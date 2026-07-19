/**
 * RAG System Types
 * 
 * Core type definitions for the knowledge retrieval system.
 * Phase 4B-1: Corpus validation and frontmatter types
 */

/**
 * Valid domain categories for content separation
 */
export type Domain = "science" | "narrative" | "boundary" | "glossary";

/**
 * Valid source types for attribution
 */
export type SourceType = 
  | "official"       // NASA, ESA, ISRO, IAU, etc.
  | "academic"       // Peer-reviewed, university sources
  | "primary-text"   // Historical texts, manuscripts
  | "reference"      // Encyclopedic references
  | "internal-policy"; // Project policies

/**
 * Valid languages
 */
export type Language = "en" | "hi";

/**
 * Document frontmatter schema
 */
export interface DocumentFrontmatter {
  // Required fields
  id: string;
  title: string;
  domain: Domain;
  topic: string;
  language: Language;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  reviewedAt: string; // YYYY-MM-DD
  licenseNote: string;
  
  // Optional fields
  author?: string;
  publishedAt?: string;
  version?: string;
  tags?: string[];
  relatedTopics?: string[];
  culturalRegion?: string;
  notes?: string;
}

/**
 * Validated document with content
 */
export interface ValidatedDocument {
  filePath: string;
  frontmatter: DocumentFrontmatter;
  content: string;
  contentHash: string;
}

/**
 * Validation error
 */
export interface ValidationError {
  filePath: string;
  documentId?: string;
  field: string;
  message: string;
}

/**
 * Validation result
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
