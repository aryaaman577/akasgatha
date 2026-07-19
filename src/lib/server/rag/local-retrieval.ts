/**
 * Local RAG Retrieval
 * 
 * Complete retrieval system with domain grouping and Katha-Vigyan separation.
 * Phase 4B: Works without external APIs.
 */

import { queryIndex, type IndexEntry } from "./local-index";
import { classifyIntent, getDomainPriorities, type QuestionIntent } from "./intent";

/**
 * Citation (no vectors exposed)
 */
export interface Citation {
  id: string;
  domain: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
  score: number;
  rank: number;
}

/**
 * Retrieval result grouped by domain
 */
export interface RetrievalResult {
  query: string;
  intent: QuestionIntent;
  scienceChunks: Citation[];
  narrativeChunks: Citation[];
  boundaryChunks: Citation[];
  glossaryChunks: Citation[];
  totalResults: number;
  retrievalTimeMs: number;
}

/**
 * Retrieve with domain grouping
 */
export async function retrieve(
  query: string,
  options: {
    topK?: number;
    minScore?: number;
    languageFilter?: string;
  } = {}
): Promise<RetrievalResult> {
  const startTime = Date.now();
  
  // Classify intent
  const intent = classifyIntent(query);
  const priorities = getDomainPriorities(intent);
  
  // Query index
  const topK = options.topK || 10; // Retrieve more initially for grouping
  const results = await queryIndex(query, {
    topK,
    minScore: options.minScore || 0.1,
    languageFilter: options.languageFilter,
  });
  
  // Apply domain priorities
  const weighted = results.map(r => ({
    ...r,
    score: r.score * (priorities[r.entry.chunk.domain as keyof typeof priorities] || 1.0),
  })).sort((a, b) => b.score - a.score);
  
  // Group by domain
  const scienceResults = weighted.filter(r => r.entry.chunk.domain === "science");
  const narrativeResults = weighted.filter(r => r.entry.chunk.domain === "narrative");
  const boundaryResults = weighted.filter(r => r.entry.chunk.domain === "boundary");
  const glossaryResults = weighted.filter(r => r.entry.chunk.domain === "glossary");
  
  // Apply per-domain caps
  const scienceCap = intent === "science" ? 5 : intent === "narrative" ? 2 : 3;
  const narrativeCap = intent === "narrative" ? 5 : intent === "science" ? 2 : 3;
  const boundaryCap = 2;
  const glossaryCap = 2;
  
  // Convert to citations (no vectors!)
  const scienceChunks = scienceResults.slice(0, scienceCap).map(toCitation);
  const narrativeChunks = narrativeResults.slice(0, narrativeCap).map(toCitation);
  const boundaryChunks = boundaryResults.slice(0, boundaryCap).map(toCitation);
  const glossaryChunks = glossaryResults.slice(0, glossaryCap).map(toCitation);
  
  const retrievalTimeMs = Date.now() - startTime;
  
  return {
    query,
    intent,
    scienceChunks,
    narrativeChunks,
    boundaryChunks,
    glossaryChunks,
    totalResults: scienceChunks.length + narrativeChunks.length + boundaryChunks.length + glossaryChunks.length,
    retrievalTimeMs,
  };
}

/**
 * Convert index entry to citation (strips vectors)
 */
function toCitation(result: { entry: IndexEntry; score: number; rank: number }): Citation {
  return {
    id: result.entry.citationId,
    domain: result.entry.chunk.domain,
    title: result.entry.chunk.documentTitle,
    sourceName: result.entry.chunk.sourceName,
    sourceUrl: result.entry.chunk.sourceUrl,
    content: result.entry.chunk.content,
    score: result.score,
    rank: result.rank,
  };
}

/**
 * Build RAG context with Katha-Vigyan separation
 */
export function buildRagContext(
  result: RetrievalResult,
  maxTokens: number = 2000
): {
  vigyanContext: string;
  kathaContext: string;
  boundaryContext: string;
  citations: Citation[];
  truncated: boolean;
} {
  const citations: Citation[] = [];
  let vigyanContext = "";
  let kathaContext = "";
  let boundaryContext = "";
  let tokenCount = 0;
  let truncated = false;
  
  // Helper to estimate tokens (rough: 1 token ≈ 4 chars)
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  
  // Add science chunks to Vigyan
  for (const chunk of result.scienceChunks) {
    const chunkText = `[${chunk.id}] ${chunk.title}\n${chunk.content}\n\n`;
    const chunkTokens = estimateTokens(chunkText);
    
    if (tokenCount + chunkTokens > maxTokens) {
      truncated = true;
      break;
    }
    
    vigyanContext += chunkText;
    citations.push(chunk);
    tokenCount += chunkTokens;
  }
  
  // Add narrative chunks to Katha
  for (const chunk of result.narrativeChunks) {
    const chunkText = `[${chunk.id}] ${chunk.title}\n${chunk.content}\n\n`;
    const chunkTokens = estimateTokens(chunkText);
    
    if (tokenCount + chunkTokens > maxTokens) {
      truncated = true;
      break;
    }
    
    kathaContext += chunkText;
    citations.push(chunk);
    tokenCount += chunkTokens;
  }
  
  // Add boundary chunks (separation policy)
  for (const chunk of result.boundaryChunks) {
    const chunkText = `[${chunk.id}] ${chunk.title}\n${chunk.content}\n\n`;
    const chunkTokens = estimateTokens(chunkText);
    
    if (tokenCount + chunkTokens > maxTokens) {
      truncated = true;
      break;
    }
    
    boundaryContext += chunkText;
    citations.push(chunk);
    tokenCount += chunkTokens;
  }
  
  // Add glossary to appropriate section based on intent
  for (const chunk of result.glossaryChunks) {
    const chunkText = `[${chunk.id}] ${chunk.title}\n${chunk.content}\n\n`;
    const chunkTokens = estimateTokens(chunkText);
    
    if (tokenCount + chunkTokens > maxTokens) {
      truncated = true;
      break;
    }
    
    // Add glossary to both contexts (definitions apply to both)
    if (result.intent === "science" || result.intent === "mixed") {
      vigyanContext += chunkText;
    }
    if (result.intent === "narrative" || result.intent === "mixed") {
      kathaContext += chunkText;
    }
    citations.push(chunk);
    tokenCount += chunkTokens;
  }
  
  return {
    vigyanContext: vigyanContext.trim(),
    kathaContext: kathaContext.trim(),
    boundaryContext: boundaryContext.trim(),
    citations,
    truncated,
  };
}
