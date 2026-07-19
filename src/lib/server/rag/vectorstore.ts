/**
 * RAG Vector Store (Pinecone)
 * 
 * Manage vector storage and retrieval using Pinecone.
 * Phase 4B-3
 */

import { Pinecone } from "@pinecone-database/pinecone";
import type { RagChunk, RagEmbedding, RagRetrievalResult, RetrievalConfig } from "./types";

/**
 * Pinecone vector record metadata
 */
interface PineconeMetadata {
  documentId: string;
  documentTitle: string;
  domain: string;
  topic: string;
  language: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  content: string;
  chunkIndex: number;
  totalChunks: number;
  tokenCount: number;
  tags?: string;
}

/**
 * Default retrieval configuration
 */
export const DEFAULT_RETRIEVAL_CONFIG: RetrievalConfig = {
  topK: 5,
  minScore: 0.5,
};

/**
 * Initialize Pinecone client
 */
function getPineconeClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY;
  
  if (!apiKey) {
    throw new Error("PINECONE_API_KEY environment variable is required");
  }

  return new Pinecone({ apiKey });
}

/**
 * Get Pinecone index name from environment
 */
function getIndexName(): string {
  const indexName = process.env.PINECONE_INDEX_NAME || "akashgatha-embeddings";
  return indexName;
}

/**
 * Upsert chunk embeddings to Pinecone
 */
export async function upsertEmbeddings(
  chunks: RagChunk[],
  embeddings: RagEmbedding[],
  onProgress?: (processed: number, total: number) => void
): Promise<void> {
  const client = getPineconeClient();
  const indexName = getIndexName();
  const index = client.index(indexName);

  // Create a map of chunkId -> chunk for easy lookup
  const chunkMap = new Map(chunks.map((c) => [c.id, c]));

  // Prepare records for upsert
  const records = embeddings.map((emb) => {
    const chunk = chunkMap.get(emb.chunkId);
    if (!chunk) {
      throw new Error(`Chunk not found for embedding: ${emb.chunkId}`);
    }

    const metadata: PineconeMetadata = {
      documentId: chunk.documentId,
      documentTitle: chunk.documentTitle,
      domain: chunk.domain,
      topic: chunk.topic,
      language: chunk.language,
      sourceName: chunk.sourceName,
      sourceUrl: chunk.sourceUrl,
      sourceType: chunk.sourceType,
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      totalChunks: chunk.totalChunks,
      tokenCount: chunk.tokenCount,
      tags: chunk.tags?.join(","),
    };

    return {
      id: emb.chunkId,
      values: emb.vector,
      metadata,
    };
  });

  // Upsert in batches (Pinecone recommends batches of 100)
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await index.upsert(batch as any); // Pinecone types vary by version

    if (onProgress) {
      onProgress(i + batch.length, records.length);
    }

    // Small delay between batches
    if (i + batchSize < records.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

/**
 * Query Pinecone for similar chunks
 */
export async function queryVectorStore(
  queryVector: number[],
  config: RetrievalConfig = DEFAULT_RETRIEVAL_CONFIG
): Promise<RagRetrievalResult[]> {
  const client = getPineconeClient();
  const indexName = getIndexName();
  const index = client.index(indexName);

  // Build filter based on config
  const filter: Record<string, unknown> = {};
  
  if (config.domainFilter && config.domainFilter.length > 0) {
    filter.domain = { $in: config.domainFilter };
  }
  
  if (config.languageFilter) {
    filter.language = config.languageFilter;
  }

  // Query Pinecone
  const queryResponse = await index.query({
    vector: queryVector,
    topK: config.topK,
    includeMetadata: true,
    filter: Object.keys(filter).length > 0 ? filter : undefined,
  });

  // Convert Pinecone results to RagRetrievalResult
  const results: RagRetrievalResult[] = [];
  
  for (let i = 0; i < queryResponse.matches.length; i++) {
    const match = queryResponse.matches[i];
    const score = match.score || 0;

    // Filter by minimum score
    if (score < config.minScore) {
      continue;
    }

    const metadata = match.metadata as unknown as PineconeMetadata;

    const chunk: RagChunk = {
      id: match.id,
      documentId: metadata.documentId,
      documentTitle: metadata.documentTitle,
      domain: metadata.domain as RagChunk["domain"],
      topic: metadata.topic,
      language: metadata.language as "en" | "hi",
      sourceName: metadata.sourceName,
      sourceUrl: metadata.sourceUrl,
      sourceType: metadata.sourceType as RagChunk["sourceType"],
      content: metadata.content,
      chunkIndex: metadata.chunkIndex,
      totalChunks: metadata.totalChunks,
      tokenCount: metadata.tokenCount,
      tags: metadata.tags ? metadata.tags.split(",") : undefined,
    };

    results.push({
      chunk,
      score,
      rank: i + 1,
    });
  }

  return results;
}

/**
 * Delete all vectors from index (for reindexing)
 */
export async function clearIndex(): Promise<void> {
  const client = getPineconeClient();
  const indexName = getIndexName();
  const index = client.index(indexName);

  await index.deleteAll();
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<{
  totalVectors: number;
  dimension: number;
}> {
  const client = getPineconeClient();
  const indexName = getIndexName();
  const index = client.index(indexName);

  const stats = await index.describeIndexStats();

  return {
    totalVectors: stats.totalRecordCount || 0,
    dimension: stats.dimension || 0,
  };
}
