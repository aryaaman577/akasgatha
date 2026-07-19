/**
 * Local Vector Index
 * 
 * File-based vector index with deterministic IDs and content hashing.
 * Phase 4B: Works without external APIs.
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

/**
 * Generate deterministic chunk ID
 */
export function generateChunkId(
  documentId: string,
  chunkIndex: number,
  contentHash: string
): string {
  // Format: docId-idx-hash
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
  // Format: domain-docId-idx
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
 * Load existing index
 */
export async function loadIndex(): Promise<VectorIndex | null> {
  try {
    const data = await fs.readFile(INDEX_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Load existing manifest
 */
export async function loadManifest(): Promise<IndexManifest | null> {
  try {
    const data = await fs.readFile(MANIFEST_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Save index atomically
 */
export async function saveIndex(index: VectorIndex): Promise<void> {
  // Ensure directory exists
  await fs.mkdir(INDEX_DIR, { recursive: true });
  
  // Write to temp files
  await fs.writeFile(TEMP_INDEX_FILE, JSON.stringify(index, null, 2), "utf-8");
  await fs.writeFile(TEMP_MANIFEST_FILE, JSON.stringify(index.manifest, null, 2), "utf-8");
  
  // Atomic rename
  await fs.rename(TEMP_INDEX_FILE, INDEX_FILE);
  await fs.rename(TEMP_MANIFEST_FILE, MANIFEST_FILE);
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
  
  // Check if we can reuse embeddings
  const canReuse =
    existingIndex &&
    existingIndex.manifest.provider === LOCAL_EMBEDDING_CONFIG.model &&
    existingIndex.manifest.dimensions === LOCAL_EMBEDDING_CONFIG.dimensions &&
    existingIndex.manifest.schemaVersion === SCHEMA_VERSION;
  
  // Build content hash map for reuse lookup
  const existingByHash = new Map<string, IndexEntry>();
  if (canReuse && existingIndex) {
    for (const entry of existingIndex.entries) {
      existingByHash.set(entry.contentHash, entry);
    }
  }
  
  // Process chunks
  const entries: IndexEntry[] = [];
  let reusedCount = 0;
  let newCount = 0;
  
  for (const chunk of chunks) {
    const contentHash = calculateContentHash(chunk.content);
    
    // Try to reuse existing embedding by content hash
    const existing = existingByHash.get(contentHash);
    if (existing) {
      // Reuse embedding - regenerate IDs based on current chunk data
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
      // Generate new embedding
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
  
  // Calculate index hash
  const indexHash = createHash("sha256")
    .update(JSON.stringify(entries.map(e => e.chunkId).sort()))
    .digest("hex");
  
  // Count documents
  const documentIds = new Set(chunks.map(c => c.documentId));
  
  // Create manifest
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
 * Query index with hybrid scoring
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
  const index = await loadIndex();
  if (!index) {
    return [];
  }
  
  const topK = options.topK || 5;
  const minScore = options.minScore || 0.1;
  
  // Generate query embedding
  const queryEmbedding = generateLocalEmbedding(query);
  
  // Score all entries
  const scored = index.entries
    .filter(entry => {
      if (options.domainFilter && !options.domainFilter.includes(entry.chunk.domain)) {
        return false;
      }
      if (options.languageFilter && entry.chunk.language !== options.languageFilter) {
        return false;
      }
      return true;
    })
    .map(entry => {
      // Semantic similarity (primary signal)
      const semanticScore = cosineSimilarity(queryEmbedding, entry.embedding);
      
      // Keyword boost
      const keywordBoost = calculateKeywordBoost(query, entry.chunk.content);
      
      // Topic boost using aliases
      const topicBoost = getTopicBoost(query, entry.chunk.documentTitle, entry.chunk.topic);
      
      // Metadata boost (science slightly preferred for factual queries)
      const metadataBoost = entry.chunk.domain === "science" ? 1.05 : 1.0;
      
      // Hybrid score with very high topic weight for exact matches
      const score = (semanticScore * 0.4 + keywordBoost * 0.1 + topicBoost * 0.5) * metadataBoost;
      
      return { entry, score };
    })
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score);
  
  // Apply diversity (max 2 chunks per document)
  const diversified = applyDiversity(scored, 2);
  
  // Take top K
  const results = diversified.slice(0, topK);
  
  // Add ranks
  return results.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * Calculate keyword boost
 */
function calculateKeywordBoost(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();
  
  let matches = 0;
  for (const word of queryWords) {
    if (contentLower.includes(word)) {
      matches++;
    }
  }
  
  return queryWords.length > 0 ? matches / queryWords.length : 0;
}

/**
 * Apply diversity constraint
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
