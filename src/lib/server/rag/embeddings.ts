/**
 * RAG Embedding Service
 * 
 * Generate embeddings for chunks using OpenAI.
 * Phase 4B-3
 */

import OpenAI from "openai";
import type { RagChunk, RagEmbedding, EmbeddingConfig } from "./types";

/**
 * Default embedding configuration
 */
export const DEFAULT_EMBEDDING_CONFIG: EmbeddingConfig = {
  model: "text-embedding-3-small",
  dimensions: 1536,
  batchSize: 100, // OpenAI allows up to 2048 inputs per request
};

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required for embeddings");
  }

  return new OpenAI({ apiKey });
}

/**
 * Generate embedding for a single chunk
 */
export async function generateEmbedding(
  chunk: RagChunk,
  config: EmbeddingConfig = DEFAULT_EMBEDDING_CONFIG
): Promise<RagEmbedding> {
  const client = getOpenAIClient();

  // Prepare text for embedding (include metadata for better context)
  const textToEmbed = prepareChunkTextForEmbedding(chunk);

  // Call OpenAI embedding API
  const response = await client.embeddings.create({
    model: config.model,
    input: textToEmbed,
    dimensions: config.dimensions,
  });

  const embedding = response.data[0].embedding;

  return {
    chunkId: chunk.id,
    vector: embedding,
    model: config.model,
    dimensions: embedding.length,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate embeddings for multiple chunks in batches
 */
export async function generateEmbeddings(
  chunks: RagChunk[],
  config: EmbeddingConfig = DEFAULT_EMBEDDING_CONFIG,
  onProgress?: (processed: number, total: number) => void
): Promise<RagEmbedding[]> {
  const client = getOpenAIClient();
  const embeddings: RagEmbedding[] = [];

  // Process in batches
  for (let i = 0; i < chunks.length; i += config.batchSize) {
    const batch = chunks.slice(i, i + config.batchSize);
    
    // Prepare texts for batch embedding
    const textsToEmbed = batch.map(prepareChunkTextForEmbedding);

    // Call OpenAI batch embedding API
    const response = await client.embeddings.create({
      model: config.model,
      input: textsToEmbed,
      dimensions: config.dimensions,
    });

    // Map embeddings back to chunks
    const batchEmbeddings: RagEmbedding[] = batch.map((chunk, idx) => ({
      chunkId: chunk.id,
      vector: response.data[idx].embedding,
      model: config.model,
      dimensions: response.data[idx].embedding.length,
      createdAt: new Date().toISOString(),
    }));

    embeddings.push(...batchEmbeddings);

    // Report progress
    if (onProgress) {
      onProgress(i + batch.length, chunks.length);
    }

    // Rate limiting: small delay between batches
    if (i + config.batchSize < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return embeddings;
}

/**
 * Prepare chunk text for embedding
 * 
 * Includes metadata to provide richer context for the embedding model.
 */
function prepareChunkTextForEmbedding(chunk: RagChunk): string {
  // Format: "Domain: [domain] | Topic: [topic] | Title: [title]\n\n[content]"
  const metadata = `Domain: ${chunk.domain} | Topic: ${chunk.topic} | Title: ${chunk.documentTitle}`;
  return `${metadata}\n\n${chunk.content}`;
}

/**
 * Estimate cost for embedding generation
 */
export function estimateEmbeddingCost(
  chunks: RagChunk[]
): { totalTokens: number; estimatedCostUSD: number } {
  // Calculate total tokens (approximate: chunk tokens + metadata overhead)
  const totalTokens = chunks.reduce((sum, chunk) => {
    const metadataTokens = 20; // Approximate tokens for metadata prefix
    return sum + chunk.tokenCount + metadataTokens;
  }, 0);

  // OpenAI pricing for text-embedding-3-small: $0.00002 per 1K tokens
  const costPer1KTokens = 0.00002;
  const estimatedCostUSD = (totalTokens / 1000) * costPer1KTokens;

  return {
    totalTokens,
    estimatedCostUSD,
  };
}
