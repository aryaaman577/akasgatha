/**
 * Local Vector Index
 * 
 * File-based vector index with deterministic IDs, content hashing,
 * in-memory caching, domain sharding, and single-promise loading.
 * 
 * Phase 4B / Gate 1
 */

import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from "crypto";
import type { RagChunk } from "./types";
import { generateLocalEmbedding, cosineSimilarity, LOCAL_EMBEDDING_CONFIG } from "./local-embeddings";
import { getTopicBoost } from "./topic-aliases";

/**
 * Index entry with embedding
 */
export interface IndexEntry {
  chunkId: string;
  citationId: string;
  embedding: number[];
  chunk: RagChunk;
  contentHash: string;
}

/**
 * Index manifest
 */
export interface IndexManifest {
  version: string;
  schemaVersion: string;
  provider: string;
  model: string;
  dimensions: number;
  documentCount: number;
  chunkCount: number;
  corpusHash: string;
  indexHash: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete index structure
 */
export interface VectorIndex {
  manifest: IndexManifest;
  entries: IndexEntry[];
}

const INDEX_DIR = path.join(process.cwd(), "data", "rag");
const INDEX_FILE = path.join(INDEX_DIR, "index.json");
const MANIFEST_FILE = path.join(INDEX_DIR, "manifest.json");
const TEMP_INDEX_FILE = path.join(INDEX_DIR, "index.json.tmp");
const TEMP_MANIFEST_FILE = path.join(INDEX_DIR, "manifest.json.tmp");

const SCHEMA_VERSION = "1.0.0";
const INDEX_VERSION = "1.0.0";

// ─── IN-MEMORY CACHE & CONCURRENCY CONTROL ─────────────────────────────
let cachedIndex: VectorIndex | null = null;
let cachedManifest: IndexManifest | null = null;
let cachedIndexMtime: number = 0;
let indexLoadPromise: Promise<VectorIndex | null> | null = null;
let manifestLoadPromise: Promise<IndexManifest | null> | null = null;

// Domain-sharded map for fast lookup
let entriesByDomain: Map<string, IndexEntry[]> = new Map();

// Bounded LRU embedding cache for query vectors
const queryEmbeddingCache = new Map<string, number[]>();
const MAX_QUERY_CACHE_SIZE = 100;

/**
 * Invalidate in-memory caches (called on new ingestion or stats tests)
 */
export function invalidateCache(): void {
  cachedIndex = null;
  cachedManifest = null;
  cachedIndexMtime = 0;
  indexLoadPromise = null;
  manifestLoadPromise = null;
  entriesByDomain.clear();
  queryEmbeddingCache.clear();
}

/**
 * Generate deterministic chunk ID
 */
export function generateChunkId(
  documentId: string,
  chunkIndex: number,
  contentHash: string
): string {
  return `${documentId}-${chunkIndex}-${contentHash.substring(0, 8)}`;
}

/**
 * Generate deterministic citation ID
 */
export function generateCitationId(
  domain: string,
  documentId: string,
  chunkIndex: number
): string {
  return `${domain}-${documentId}-${chunkIndex}`;
}

/**
 * Calculate content hash
 */
export function calculateContentHash(content: string): string {
  return createHash("sha256").update(content.trim()).digest("hex");
}

/**
 * Calculate corpus hash from chunks
 */
export function calculateCorpusHash(chunks: RagChunk[]): string {
  const combined = chunks
    .map(c => `${c.documentId}:${calculateContentHash(c.content)}`)
    .sort()
    .join("|");
  return createHash("sha256").update(combined).digest("hex");
}

/**
 * Load index with memory caching, mtime validation, and concurrent promise deduplication
 */
export async function loadIndex(): Promise<VectorIndex | null> {
  if (indexLoadPromise) {
    return indexLoadPromise;
  }

  indexLoadPromise = (async () => {
    try {
      const stat = await fs.stat(INDEX_FILE);
      if (cachedIndex && stat.mtimeMs === cachedIndexMtime) {
        return cachedIndex;
      }

      const data = await fs.readFile(INDEX_FILE, "utf-8");
      const index: VectorIndex = JSON.parse(data);

      cachedIndex = index;
      cachedIndexMtime = stat.mtimeMs;

      // Build domain shard map
      entriesByDomain = new Map();
      for (const entry of index.entries) {
        const domain = entry.chunk.domain || "general";
        if (!entriesByDomain.has(domain)) {
          entriesByDomain.set(domain, []);
        }
        entriesByDomain.get(domain)!.push(entry);
      }

      return cachedIndex;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    } finally {
      indexLoadPromise = null;
    }
  })();

  return indexLoadPromise;
}

/**
 * Load existing manifest with caching
 */
export async function loadManifest(): Promise<IndexManifest | null> {
  if (cachedManifest) {
    return cachedManifest;
  }
  if (manifestLoadPromise) {
    return manifestLoadPromise;
  }

  manifestLoadPromise = (async () => {
    try {
      const data = await fs.readFile(MANIFEST_FILE, "utf-8");
      cachedManifest = JSON.parse(data);
      return cachedManifest;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    } finally {
      manifestLoadPromise = null;
    }
  })();

  return manifestLoadPromise;
}

/**
 * Save index atomically and update in-memory cache
 */
export async function saveIndex(index: VectorIndex): Promise<void> {
  await fs.mkdir(INDEX_DIR, { recursive: true });
  
  await fs.writeFile(TEMP_INDEX_FILE, JSON.stringify(index, null, 2), "utf-8");
  await fs.writeFile(TEMP_MANIFEST_FILE, JSON.stringify(index.manifest, null, 2), "utf-8");
  
  await fs.rename(TEMP_INDEX_FILE, INDEX_FILE);
  await fs.rename(TEMP_MANIFEST_FILE, MANIFEST_FILE);

  // Invalidate cache so next load gets fresh stats
  invalidateCache();
}

/**
 * Build index from chunks with incremental embedding reuse
 */
export async function buildIndex(chunks: RagChunk[]): Promise<{
  index: VectorIndex;
  reusedCount: number;
  newCount: number;
}> {
  const corpusHash = calculateCorpusHash(chunks);
  const existingIndex = await loadIndex();
  
  const canReuse =
    existingIndex &&
    existingIndex.manifest.provider === LOCAL_EMBEDDING_CONFIG.model &&
    existingIndex.manifest.dimensions === LOCAL_EMBEDDING_CONFIG.dimensions &&
    existingIndex.manifest.schemaVersion === SCHEMA_VERSION;
  
  const existingByHash = new Map<string, IndexEntry>();
  if (canReuse && existingIndex) {
    for (const entry of existingIndex.entries) {
      existingByHash.set(entry.contentHash, entry);
    }
  }
  
  const entries: IndexEntry[] = [];
  let reusedCount = 0;
  let newCount = 0;
  
  for (const chunk of chunks) {
    const contentHash = calculateContentHash(chunk.content);
    const existing = existingByHash.get(contentHash);

    if (existing) {
      const chunkId = generateChunkId(chunk.documentId, chunk.chunkIndex, contentHash);
      const citationId = generateCitationId(chunk.domain, chunk.documentId, chunk.chunkIndex);
      
      entries.push({
        chunkId,
        citationId,
        embedding: existing.embedding,
        chunk,
        contentHash,
      });
      reusedCount++;
    } else {
      const chunkId = generateChunkId(chunk.documentId, chunk.chunkIndex, contentHash);
      const citationId = generateCitationId(chunk.domain, chunk.documentId, chunk.chunkIndex);
      const textForEmbedding = `${chunk.documentTitle}\n\n${chunk.content}`;
      const embedding = generateLocalEmbedding(textForEmbedding);
      
      entries.push({
        chunkId,
        citationId,
        embedding,
        chunk,
        contentHash,
      });
      newCount++;
    }
  }
  
  const indexHash = createHash("sha256")
    .update(JSON.stringify(entries.map(e => e.chunkId).sort()))
    .digest("hex");
  
  const documentIds = new Set(chunks.map(c => c.documentId));
  
  const manifest: IndexManifest = {
    version: INDEX_VERSION,
    schemaVersion: SCHEMA_VERSION,
    provider: "local",
    model: LOCAL_EMBEDDING_CONFIG.model,
    dimensions: LOCAL_EMBEDDING_CONFIG.dimensions,
    documentCount: documentIds.size,
    chunkCount: entries.length,
    corpusHash,
    indexHash,
    createdAt: existingIndex?.manifest.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const index: VectorIndex = {
    manifest,
    entries,
  };
  
  return { index, reusedCount, newCount };
}

/**
 * Get or compute query embedding with LRU cache
 */
function getCachedQueryEmbedding(query: string): number[] {
  const normKey = query.toLowerCase().trim();
  if (queryEmbeddingCache.has(normKey)) {
    return queryEmbeddingCache.get(normKey)!;
  }

  const vec = generateLocalEmbedding(query);
  if (queryEmbeddingCache.size >= MAX_QUERY_CACHE_SIZE) {
    const firstKey = queryEmbeddingCache.keys().next().value;
    if (firstKey) queryEmbeddingCache.delete(firstKey);
  }
  queryEmbeddingCache.set(normKey, vec);
  return vec;
}

const FALSE_POSITIVE_PATTERNS = [
  /\b(galaxy s\d+|samsung galaxy|galaxy phone|galaxy price|buy galaxy|smartphone)\b/i,
  /\b(mercury poisoning|mercury metal|mercury liquid|mercury element|mercury toxicity|poisoning)\b/i,
  /\b(saturn car|saturn auto|saturn motor|saturn sedan|car parts)\b/i,
  /\b(black shirt|black dress|black pant|black clothes)\b/i,
  /\b(horoscope|rashifal|astrology prediction|future prediction|aaj ka rashifal)\b/i,
];

/**
 * Query index with hybrid scoring, domain-sharding, and max 3 domain shards limit per query
 */
export async function queryIndex(
  query: string,
  options: {
    topK?: number;
    minScore?: number;
    domainFilter?: string[];
    languageFilter?: string;
  } = {}
): Promise<Array<{ entry: IndexEntry; score: number; rank: number }>> {
  // Suppress non-astronomy false positive queries
  if (FALSE_POSITIVE_PATTERNS.some(p => p.test(query))) {
    return [];
  }

  const index = await loadIndex();
  if (!index) {
    return [];
  }
  
  const topK = Math.min(options.topK || 3, 3);
  const minScore = options.minScore || 0.1;
  
  const queryEmbedding = getCachedQueryEmbedding(query);

  // Enforce maximum 3 domain shards per query
  let entriesToScan: IndexEntry[] = [];
  if (options.domainFilter && options.domainFilter.length > 0) {
    const boundedDomains = options.domainFilter.slice(0, 3);
    for (const d of boundedDomains) {
      const sharded = entriesByDomain.get(d) || [];
      entriesToScan.push(...sharded);
    }
  } else {
    entriesToScan = index.entries;
  }
  
  const scored = entriesToScan
    .filter(entry => {
      if (options.languageFilter && entry.chunk.language !== options.languageFilter) {
        return false;
      }
      return true;
    })
    .map(entry => {
      const semanticScore = cosineSimilarity(queryEmbedding, entry.embedding);
      const keywordBoost = calculateKeywordBoost(query, `${entry.chunk.documentTitle} ${entry.chunk.content} ${entry.chunk.topic}`);
      const topicBoost = getTopicBoost(query, entry.chunk.documentTitle, entry.chunk.topic);
      const metadataBoost = entry.chunk.domain === "science" ? 1.02 : 1.0;
      
      const score = (semanticScore * 0.4 + keywordBoost * 0.4 + topicBoost * 0.7) * metadataBoost;
      return { entry, score };
    })
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score);
  
  const diversified = applyDiversity(scored, 2);
  const results = diversified.slice(0, topK);
  
  return results.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * Calculate keyword boost with stop-word filtering
 */
function calculateKeywordBoost(query: string, content: string): number {
  const stopWords = new Set(["what", "is", "a", "an", "the", "in", "on", "of", "and", "or", "how", "why", "does", "do", "kaise", "kyon", "kya", "hai", "hain", "ke", "ki", "ko", "se", "me"]);
  const queryWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  const contentLower = content.toLowerCase();
  if (queryWords.length === 0) return 0;
  
  let matches = 0;
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      matches++;
    }
  }
  
  return matches / queryWords.length;
}

/**
 * Apply diversity constraint (max per doc)
 */
function applyDiversity(
  scored: Array<{ entry: IndexEntry; score: number }>,
  maxPerDoc: number
): Array<{ entry: IndexEntry; score: number }> {
  const docCounts = new Map<string, number>();
  const result: Array<{ entry: IndexEntry; score: number }> = [];
  
  for (const item of scored) {
    const docId = item.entry.chunk.documentId;
    const count = docCounts.get(docId) || 0;
    
    if (count < maxPerDoc) {
      result.push(item);
      docCounts.set(docId, count + 1);
    }
  }
  
  return result;
}
