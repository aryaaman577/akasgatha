/**
 * Citation Validation
 * 
 * Validates that all citations come from the allowlisted set.
 * Prevents model hallucination of fake sources.
 * Phase 5
 */

import type { RagContext } from "../rag/types";

export interface CitationMap {
  [citationId: string]: {
    title: string;
    url?: string;
    domain: string;
  };
}

/**
 * Build citation map from RAG context
 */
export function buildCitationMap(ragContext: RagContext): CitationMap {
  const map: CitationMap = {};
  
  for (const result of ragContext.retrievedChunks) {
    const chunk = result.chunk;
    
    // Use the citation ID from the chunk
    map[chunk.citationId] = {
      title: chunk.documentTitle,
      url: chunk.sourceUrl || undefined,
      domain: chunk.domain,
    };
  }
  
  return map;
}

/**
 * Get list of allowed citation IDs
 */
export function getAllowedCitationIds(citationMap: CitationMap): string[] {
  return Object.keys(citationMap);
}

/**
 * Validate that all citation IDs are in the allowed set
 */
export function validateCitationIds(
  citationIds: string[],
  allowedIds: string[]
): { valid: boolean; unknownIds: string[] } {
  const allowedSet = new Set(allowedIds);
  const unknownIds = citationIds.filter(id => !allowedSet.has(id));
  
  return {
    valid: unknownIds.length === 0,
    unknownIds,
  };
}

/**
 * Deduplicate citation IDs
 */
export function deduplicateCitationIds(citationIds: string[]): string[] {
  return Array.from(new Set(citationIds));
}

/**
 * Build public sources array from citation IDs
 */
export function buildPublicSources(
  citationIds: string[],
  citationMap: CitationMap
): Array<{ id: string; title: string; url?: string }> {
  const uniqueIds = deduplicateCitationIds(citationIds);
  
  return uniqueIds
    .map(id => {
      const citation = citationMap[id];
      if (!citation) {
        return null;
      }
      
      return {
        id,
        title: citation.title,
        url: citation.url,
      };
    })
    .filter((source): source is NonNullable<typeof source> => source !== null);
}

/**
 * Remove unknown citations from list
 */
export function filterValidCitations(
  citationIds: string[],
  allowedIds: string[]
): string[] {
  const allowedSet = new Set(allowedIds);
  return citationIds.filter(id => allowedSet.has(id));
}

/**
 * Check if citations support the claim domain
 */
export function validateCitationDomains(
  citationIds: string[],
  citationMap: CitationMap,
  requiredDomain: "science" | "narrative" | "boundary" | "mixed"
): { valid: boolean; reason?: string } {
  if (citationIds.length === 0 && requiredDomain !== "mixed") {
    return { valid: false, reason: "No citations provided for domain-specific content" };
  }

  const domains = citationIds
    .map(id => citationMap[id]?.domain)
    .filter((domain): domain is string => domain !== undefined);

  if (domains.length === 0 && citationIds.length > 0) {
    return { valid: false, reason: "Citations reference unknown sources" };
  }

  switch (requiredDomain) {
    case "science":
      // Pure science should have at least some science citations
      if (!domains.includes("science")) {
        return { valid: false, reason: "Science content requires science citations" };
      }
      break;
      
    case "narrative":
      // Pure narrative should have narrative citations
      if (!domains.includes("narrative")) {
        return { valid: false, reason: "Narrative content requires narrative citations" };
      }
      break;
      
    case "boundary":
      // Boundary content should reference boundary docs
      if (!domains.includes("boundary")) {
        return { valid: false, reason: "Boundary content requires boundary citations" };
      }
      break;
      
    case "mixed":
      // Mixed content is flexible
      break;
  }

  return { valid: true };
}
