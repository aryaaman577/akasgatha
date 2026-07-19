/**
 * RAG Document Chunker
 * 
 * Semantically chunks documents while preserving context and metadata.
 * Phase 4B-2
 */

import { encoding_for_model } from "tiktoken";
import type { RagDocument, RagChunk, ChunkingConfig } from "./types";

/**
 * Default chunking configuration
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxTokens: 512,
  overlap: 50,
  preserveParagraphs: true,
  minChunkTokens: 50,
};

/**
 * Get token count for text using tiktoken
 */
export function countTokens(text: string): number {
  const encoder = encoding_for_model("text-embedding-3-small");
  try {
    const tokens = encoder.encode(text);
    return tokens.length;
  } finally {
    encoder.free();
  }
}

/**
 * Split text into paragraphs (preserves semantic boundaries)
 */
function splitIntoParagraphs(text: string): string[] {
  // Split on double newlines or more (paragraph breaks)
  return text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Split text into sentences (for fine-grained chunking)
 */
function splitIntoSentences(text: string): string[] {
  // Simple sentence splitting (can be improved with NLP library if needed)
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Chunk a single document into semantically coherent segments
 */
export function chunkDocument(
  document: RagDocument,
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
): RagChunk[] {
  const chunks: RagChunk[] = [];
  const paragraphs = config.preserveParagraphs
    ? splitIntoParagraphs(document.content)
    : [document.content];

  let currentChunk = "";
  let currentTokens = 0;
  let chunkIndex = 0;

  // Helper to create a chunk
  const createChunk = (content: string, index: number, total: number): RagChunk => {
    const tokenCount = countTokens(content);
    return {
      id: `${document.metadata.id}-chunk-${index}`,
      documentId: document.metadata.id,
      documentTitle: document.metadata.title,
      domain: document.metadata.domain,
      topic: document.metadata.topic,
      language: document.metadata.language,
      sourceName: document.metadata.sourceName,
      sourceUrl: document.metadata.sourceUrl,
      sourceType: document.metadata.sourceType,
      content: content.trim(),
      chunkIndex: index,
      totalChunks: total,
      tokenCount,
      tags: document.metadata.tags,
    };
  };

  // Helper to finalize current chunk
  const finalizeChunk = () => {
    if (currentChunk.trim() && currentTokens >= config.minChunkTokens) {
      chunks.push(createChunk(currentChunk, chunkIndex, 0)); // totalChunks updated later
      chunkIndex++;
    }
  };

  // Process each paragraph
  for (const paragraph of paragraphs) {
    const paragraphTokens = countTokens(paragraph);

    // If paragraph fits in current chunk with room
    if (currentTokens + paragraphTokens <= config.maxTokens) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      currentTokens += paragraphTokens;
    }
    // If paragraph is too large, split it by sentences
    else if (paragraphTokens > config.maxTokens) {
      // Finalize current chunk first
      finalizeChunk();
      currentChunk = "";
      currentTokens = 0;

      // Split paragraph into sentences and chunk them
      const sentences = splitIntoSentences(paragraph);
      for (const sentence of sentences) {
        const sentenceTokens = countTokens(sentence);

        if (currentTokens + sentenceTokens <= config.maxTokens) {
          currentChunk += (currentChunk ? " " : "") + sentence;
          currentTokens += sentenceTokens;
        } else {
          // Finalize current sentence-based chunk
          finalizeChunk();

          // Start new chunk with overlap from previous chunk
          if (chunks.length > 0 && config.overlap > 0) {
            const prevChunk = chunks[chunks.length - 1];
            const prevSentences = splitIntoSentences(prevChunk.content);
            const overlapSentences = prevSentences.slice(-2); // Last 2 sentences for context
            const overlapText = overlapSentences.join(" ");
            const overlapTokens = countTokens(overlapText);

            if (overlapTokens <= config.overlap) {
              currentChunk = overlapText + " " + sentence;
              currentTokens = overlapTokens + sentenceTokens;
            } else {
              currentChunk = sentence;
              currentTokens = sentenceTokens;
            }
          } else {
            currentChunk = sentence;
            currentTokens = sentenceTokens;
          }
        }
      }
    }
    // Paragraph doesn't fit, finalize current and start new with overlap
    else {
      finalizeChunk();

      // Add overlap from previous chunk
      if (chunks.length > 0 && config.overlap > 0) {
        const prevChunk = chunks[chunks.length - 1];
        const prevWords = prevChunk.content.split(/\s+/);
        const overlapWords = prevWords.slice(-Math.floor(config.overlap / 2));
        const overlapText = overlapWords.join(" ");
        const overlapTokens = countTokens(overlapText);

        if (overlapTokens <= config.overlap) {
          currentChunk = overlapText + "\n\n" + paragraph;
          currentTokens = overlapTokens + paragraphTokens;
        } else {
          currentChunk = paragraph;
          currentTokens = paragraphTokens;
        }
      } else {
        currentChunk = paragraph;
        currentTokens = paragraphTokens;
      }
    }
  }

  // Finalize any remaining content
  finalizeChunk();

  // Update totalChunks in all chunks
  const totalChunks = chunks.length;
  chunks.forEach((chunk) => {
    chunk.totalChunks = totalChunks;
  });

  return chunks;
}

/**
 * Chunk multiple documents
 */
export function chunkDocuments(
  documents: RagDocument[],
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
): RagChunk[] {
  const allChunks: RagChunk[] = [];

  for (const document of documents) {
    const docChunks = chunkDocument(document, config);
    allChunks.push(...docChunks);
  }

  return allChunks;
}

/**
 * Get chunking statistics for analysis
 */
export function getChunkingStats(chunks: RagChunk[]): {
  totalChunks: number;
  avgTokensPerChunk: number;
  minTokens: number;
  maxTokens: number;
  byDomain: Record<string, number>;
  byDocument: Record<string, number>;
} {
  if (chunks.length === 0) {
    return {
      totalChunks: 0,
      avgTokensPerChunk: 0,
      minTokens: 0,
      maxTokens: 0,
      byDomain: {},
      byDocument: {},
    };
  }

  const tokenCounts = chunks.map((c) => c.tokenCount);
  const byDomain: Record<string, number> = {};
  const byDocument: Record<string, number> = {};

  chunks.forEach((chunk) => {
    byDomain[chunk.domain] = (byDomain[chunk.domain] || 0) + 1;
    byDocument[chunk.documentId] = (byDocument[chunk.documentId] || 0) + 1;
  });

  return {
    totalChunks: chunks.length,
    avgTokensPerChunk: tokenCounts.reduce((a, b) => a + b, 0) / chunks.length,
    minTokens: Math.min(...tokenCounts),
    maxTokens: Math.max(...tokenCounts),
    byDomain,
    byDocument,
  };
}
