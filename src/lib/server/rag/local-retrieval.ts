/**
 * Local RAG Retrieval Service
 * 
 * Phase 4B local retrieval using deterministic TF-IDF embeddings.
 * No external API dependencies (OpenAI, Pinecone, etc.)
 */

import type { RagContext, RetrievalConfig } from "./types";
import { queryIndex } from "./local-index";
import { classifyIntent } from "./intent";

/**
 * Default retrieval configuration
 */
export const DEFAULT_LOCAL_RETRIEVAL_CONFIG: RetrievalConfig = {
  topK: 5,
  minScore: 0.5,
};

/**
 * Retrieve relevant context using local index
 */
export async function retrieveLocalContext(
  query: string,
  config: RetrievalConfig = DEFAULT_LOCAL_RETRIEVAL_CONFIG
): Promise<RagContext> {
  const startTime = Date.now();

  // Query local index with hybrid scoring
  const results = await queryIndex(query, {
    topK: config.topK,
    minScore: config.minScore,
    domainFilter: config.domainFilter,
    languageFilter: config.languageFilter,
  });

  // Build RAG context from results
  const retrievedChunks = results.map(result => ({
    chunk: result.entry.chunk,
    score: result.score,
    rank: result.rank,
  }));

  // Calculate metadata
  const domains = Array.from(new Set(retrievedChunks.map(r => r.chunk.domain)));
  const sources = Array.from(new Set(retrievedChunks.map(r => r.chunk.sourceName)));
  const avgScore = retrievedChunks.length > 0
    ? retrievedChunks.reduce((sum, r) => sum + r.score, 0) / retrievedChunks.length
    : 0;

  const retrievalTime = Date.now() - startTime;

  return {
    query,
    retrievedChunks,
    totalResults: retrievedChunks.length,
    retrievalTime,
    metadata: {
      domains,
      sources,
      avgScore,
    },
  };
}

/**
 * Format retrieved context for LLM prompting
 */
export function formatLocalContextForPrompt(context: RagContext): string {
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
export function analyzeLocalRetrievalQuality(context: RagContext): {
  hasScience: boolean;
  hasNarrative: boolean;
  hasBoundary: boolean;
  hasGlossary: boolean;
  avgScore: number;
  confidence: "high" | "medium" | "low";
} {
  const hasScience = context.metadata.domains.includes("science");
  const hasNarrative = context.metadata.domains.includes("narrative");
  const hasBoundary = context.metadata.domains.includes("boundary");
  const hasGlossary = context.metadata.domains.includes("glossary");
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
    hasGlossary,
    avgScore,
    confidence,
  };
}

/**
 * Extended retrieval result with intent classification and grouped chunks
 * Used by test scripts
 */
export interface ExtendedRetrievalResult {
  intent: "science" | "narrative" | "mixed" | "general";
  retrievedChunks: RagContext["retrievedChunks"];
  scienceChunks: RagContext["retrievedChunks"];
  narrativeChunks: RagContext["retrievedChunks"];
  boundaryChunks: RagContext["retrievedChunks"];
  glossaryChunks: RagContext["retrievedChunks"];
  totalResults: number;
  retrievalTimeMs: number;
  metadata: RagContext["metadata"];
}

/**
 * Retrieve with intent classification (for testing)
 */
export async function retrieve(
  query: string,
  config: RetrievalConfig = DEFAULT_LOCAL_RETRIEVAL_CONFIG
): Promise<ExtendedRetrievalResult> {
  const context = await retrieveLocalContext(query, config);
  const intent = classifyIntent(query);
  
  // Group chunks by domain
  const scienceChunks = context.retrievedChunks.filter(r => r.chunk.domain === "science");
  const narrativeChunks = context.retrievedChunks.filter(r => r.chunk.domain === "narrative");
  const boundaryChunks = context.retrievedChunks.filter(r => r.chunk.domain === "boundary");
  const glossaryChunks = context.retrievedChunks.filter(r => r.chunk.domain === "glossary");
  
  return {
    intent,
    retrievedChunks: context.retrievedChunks,
    scienceChunks,
    narrativeChunks,
    boundaryChunks,
    glossaryChunks,
    totalResults: context.totalResults,
    retrievalTimeMs: context.retrievalTime,
    metadata: context.metadata,
  };
}

/**
 * Build RAG context (for testing/inspection)
 */
export function buildRagContext(result: ExtendedRetrievalResult, maxChars?: number): {
  citations: string[];
  vigyanContext: string;
  kathaContext: string;
  boundaryContext: string;
  truncated: boolean;
} {
  const scienceContext = result.scienceChunks.map(r => r.chunk.content).join("\n\n");
  const narrativeContext = result.narrativeChunks.map(r => r.chunk.content).join("\n\n");
  const boundaryContext = result.boundaryChunks.map(r => r.chunk.content).join("\n\n");
  
  const citations = result.retrievedChunks.map(r => r.chunk.citationId);
  
  return {
    citations,
    vigyanContext: scienceContext,
    kathaContext: narrativeContext,
    boundaryContext,
    truncated: false, // Simplified for now
  };
}
