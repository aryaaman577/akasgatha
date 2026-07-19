/**
 * RAG Type Definitions
 * 
 * Core types for Retrieval-Augmented Generation system.
 * Phase 4B: Complete RAG pipeline types
 */

import type { z } from "zod";
import type { frontmatterSchema } from "./schema";

/**
 * Domain categories for knowledge organization
 */
export type RagDomain = "science" | "narrative" | "boundary" | "glossary";

/**
 * Source type classification
 */
export type RagSourceType = "official" | "scholarly" | "traditional" | "internal" | "academic" | "primary-text" | "reference" | "internal-policy";

/**
 * Validated frontmatter (from schema)
 */
export type ValidatedFrontmatter = z.infer<typeof frontmatterSchema>;

/**
 * Validated document (Phase 4B-1)
 */
export interface ValidatedDocument {
  filePath: string;
  frontmatter: ValidatedFrontmatter;
  content: string;
  contentHash: string;
}

/**
 * Validation error (Phase 4B-1)
 */
export interface ValidationError {
  filePath: string;
  documentId?: string;
  field: string;
  message: string;
}

/**
 * Validation result (Phase 4B-1)
 */
export interface ValidationResult {
  valid: boolean;
  documents: ValidatedDocument[];
  errors: ValidationError[];
  stats: {
    totalFiles: number;
    validDocuments: number;
    scienceCount: number;
    narrativeCount: number;
    boundaryCount: number;
    glossaryCount: number;
    duplicateIds: string[];
  };
}

/**
 * Document metadata from frontmatter
 */
export interface RagDocumentMetadata {
  id: string;
  title: string;
  domain: RagDomain;
  topic: string;
  language: "en" | "hi";
  sourceName: string;
  sourceUrl: string;
  sourceType: RagSourceType;
  reviewedAt: string; // YYYY-MM-DD
  licenseNote: string;
  author?: string;
  publishedAt?: string;
  version?: string;
  tags?: string[];
  relatedTopics?: string[];
  culturalRegion?: string;
  notes?: string;
}

/**
 * Complete document with content
 */
export interface RagDocument {
  metadata: RagDocumentMetadata;
  content: string;
  filepath: string;
}

/**
 * Chunked segment of a document with preserved metadata
 * Phase 4B-2
 */
export interface RagChunk {
  // Unique identifier for this chunk
  id: string;
  
  // Parent document metadata
  documentId: string;
  documentTitle: string;
  domain: RagDomain;
  topic: string;
  language: "en" | "hi";
  
  // Source attribution
  sourceName: string;
  sourceUrl: string;
  sourceType: RagSourceType;
  
  // Chunk content
  content: string;
  
  // Chunk positioning
  chunkIndex: number; // Position in document (0-based)
  totalChunks: number; // Total chunks in document
  
  // Token metrics
  tokenCount: number;
  
  // Optional tags for filtering
  tags?: string[];
}

/**
 * Embedding vector for a chunk
 * Phase 4B-3
 */
export interface RagEmbedding {
  chunkId: string;
  vector: number[];
  model: string; // e.g., "text-embedding-3-small"
  dimensions: number; // e.g., 1536
  createdAt: string; // ISO timestamp
}

/**
 * Retrieval result from vector search
 * Phase 4B-4
 */
export interface RagRetrievalResult {
  chunk: RagChunk;
  score: number; // Similarity score (0-1)
  rank: number; // Position in results (1-based)
}

/**
 * RAG context for LLM prompting
 * Phase 4B-4
 */
export interface RagContext {
  query: string;
  retrievedChunks: RagRetrievalResult[];
  totalResults: number;
  retrievalTime: number; // milliseconds
  metadata: {
    domains: RagDomain[];
    sources: string[];
    avgScore: number;
  };
}

/**
 * Chunking configuration
 * Phase 4B-2
 */
export interface ChunkingConfig {
  maxTokens: number; // Maximum tokens per chunk
  overlap: number; // Token overlap between chunks
  preserveParagraphs: boolean; // Try to preserve paragraph boundaries
  minChunkTokens: number; // Minimum tokens for a valid chunk
}

/**
 * Embedding configuration
 * Phase 4B-3
 */
export interface EmbeddingConfig {
  model: string; // OpenAI model name
  dimensions: number; // Vector dimensions
  batchSize: number; // Chunks per batch request
}

/**
 * Retrieval configuration
 * Phase 4B-4
 */
export interface RetrievalConfig {
  topK: number; // Number of results to return
  minScore: number; // Minimum similarity threshold
  domainFilter?: RagDomain[]; // Optional domain filtering
  languageFilter?: "en" | "hi"; // Optional language filtering
}

