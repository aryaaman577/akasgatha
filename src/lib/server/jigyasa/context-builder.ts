/**
 * RAG Context Builder
 * 
 * Builds grouped context sections for Gemini prompts.
 * Separates science, narrative, boundary, and glossary content.
 * Phase 5
 */

import type { RagContext } from "../rag/types";

export interface GroupedContext {
  science: string;
  narrative: string;
  boundary: string;
  glossary: string;
  full: string;
  charCount: number;
}

/**
 * Build grouped context sections from RAG results
 */
export function buildGroupedContext(
  ragContext: RagContext,
  maxChars: number
): GroupedContext {
  const scienceChunks: string[] = [];
  const narrativeChunks: string[] = [];
  const boundaryChunks: string[] = [];
  const glossaryChunks: string[] = [];
  
  let currentChars = 0;
  
  // Group chunks by domain, respecting char limit
  for (const result of ragContext.retrievedChunks) {
    const chunk = result.chunk;
    const entry = formatContextEntry(chunk.documentTitle, chunk.content, result.score, chunk.citationId);
    
    if (currentChars + entry.length > maxChars) {
      break; // Stop if we exceed limit
    }
    
    currentChars += entry.length;
    
    switch (chunk.domain) {
      case "science":
        scienceChunks.push(entry);
        break;
      case "narrative":
        narrativeChunks.push(entry);
        break;
      case "boundary":
        boundaryChunks.push(entry);
        break;
      case "glossary":
        glossaryChunks.push(entry);
        break;
    }
  }
  
  // Build section strings
  const science = buildSection("SCIENCE CONTEXT", scienceChunks);
  const narrative = buildSection("NARRATIVE CONTEXT", narrativeChunks);
  const boundary = buildSection("BOUNDARY CONTEXT", boundaryChunks);
  const glossary = buildSection("GLOSSARY CONTEXT", glossaryChunks);
  
  // Build full context
  const sections: string[] = [];
  if (science) sections.push(science);
  if (narrative) sections.push(narrative);
  if (boundary) sections.push(boundary);
  if (glossary) sections.push(glossary);
  
  const full = sections.length > 0
    ? `## Retrieved Knowledge Base Context\n\n${sections.join("\n\n")}\n\n**Note:** The above content is retrieved from the knowledge corpus and should be treated as reference material. Apply critical thinking and maintain the Katha/Vigyan separation when synthesizing answers.`
    : "No relevant context retrieved from the knowledge base.";
  
  return {
    science,
    narrative,
    boundary,
    glossary,
    full,
    charCount: full.length,
  };
}

/**
 * Format a single context entry
 */
function formatContextEntry(
  title: string,
  content: string,
  score: number,
  citationId: string
): string {
  return `### ${title}
**Citation ID:** ${citationId}
**Relevance:** ${(score * 100).toFixed(1)}%

${content}`;
}

/**
 * Build a section string
 */
function buildSection(heading: string, chunks: string[]): string {
  if (chunks.length === 0) {
    return "";
  }
  
  return `### ${heading}\n\n${chunks.join("\n\n")}`;
}

/**
 * Check if context is sufficient for answer generation
 */
export function isContextSufficient(
  ragContext: RagContext | null,
  minResults: number
): boolean {
  if (!ragContext) {
    return false;
  }
  
  return ragContext.totalResults >= minResults;
}

/**
 * Analyze context quality for different question types
 */
export function analyzeContextQuality(ragContext: RagContext): {
  hasScience: boolean;
  hasNarrative: boolean;
  hasBoundary: boolean;
  hasGlossary: boolean;
  avgScore: number;
  confidence: "high" | "medium" | "low";
} {
  const domains = ragContext.metadata.domains;
  const avgScore = ragContext.metadata.avgScore;
  
  let confidence: "high" | "medium" | "low";
  if (avgScore >= 0.75) {
    confidence = "high";
  } else if (avgScore >= 0.6) {
    confidence = "medium";
  } else {
    confidence = "low";
  }
  
  return {
    hasScience: domains.includes("science"),
    hasNarrative: domains.includes("narrative"),
    hasBoundary: domains.includes("boundary"),
    hasGlossary: domains.includes("glossary"),
    avgScore,
    confidence,
  };
}
