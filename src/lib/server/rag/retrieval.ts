/**
 * RAG Retrieval Service
 * 
 * High-level retrieval interface combining embeddings and vector search.
 * Phase 4B-4
 */

import OpenAI from "openai";
import type { RagContext, RetrievalConfig } from "./types";
import { queryVectorStore, DEFAULT_RETRIEVAL_CONFIG } from "./vectorstore";
import { DEFAULT_EMBEDDING_CONFIG } from "./embeddings";

/**
 * Retrieve relevant context for a query
 */
export async function retrieveContext(
  query: string,
  config: RetrievalConfig = DEFAULT_RETRIEVAL_CONFIG
): Promise<RagContext> {
  const startTime = Date.now();

  // Step 1: Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  // Step 2: Query vector store
  const results = await queryVectorStore(queryEmbedding, config);

  // Step 3: Calculate metadata
  const domains = Array.from(new Set(results.map((r) => r.chunk.domain)));
  const sources = Array.from(new Set(results.map((r) => r.chunk.sourceName)));
  const avgScore = results.length > 0
    ? results.reduce((sum, r) => sum + r.score, 0) / results.length
    : 0;

  const retrievalTime = Date.now() - startTime;

  return {
    query,
    retrievedChunks: results,
    totalResults: results.length,
    retrievalTime,
    metadata: {
      domains,
      sources,
      avgScore,
    },
  };
}

/**
 * Generate embedding for a query string
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.embeddings.create({
    model: DEFAULT_EMBEDDING_CONFIG.model,
    input: query,
    dimensions: DEFAULT_EMBEDDING_CONFIG.dimensions,
  });

  return response.data[0].embedding;
}

/**
 * Format retrieved context for LLM prompting
 */
export function formatContextForPrompt(context: RagContext): string {
  if (context.retrievedChunks.length === 0) {
    return "No relevant context found in the knowledge base.";
  }

  const chunks = context.retrievedChunks.map((result, idx) => {
    const chunk = result.chunk;
    return `
[Source ${idx + 1}]
Domain: ${chunk.domain}
Title: ${chunk.documentTitle}
Source: ${chunk.sourceName}
Relevance: ${(result.score * 100).toFixed(1)}%

${chunk.content}
`.trim();
  });

  return `
Retrieved Knowledge (${context.totalResults} sources):

${chunks.join("\n\n---\n\n")}

Retrieval Statistics:
- Domains: ${context.metadata.domains.join(", ")}
- Average relevance: ${(context.metadata.avgScore * 100).toFixed(1)}%
`.trim();
}

/**
 * Analyze retrieval quality
 */
export function analyzeRetrievalQuality(context: RagContext): {
  hasScience: boolean;
  hasNarrative: boolean;
  hasBoundary: boolean;
  avgScore: number;
  confidence: "high" | "medium" | "low";
} {
  const hasScience = context.metadata.domains.includes("science");
  const hasNarrative = context.metadata.domains.includes("narrative");
  const hasBoundary = context.metadata.domains.includes("boundary");
  const avgScore = context.metadata.avgScore;

  let confidence: "high" | "medium" | "low";
  if (avgScore >= 0.75) {
    confidence = "high";
  } else if (avgScore >= 0.6) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    hasScience,
    hasNarrative,
    hasBoundary,
    avgScore,
    confidence,
  };
}
