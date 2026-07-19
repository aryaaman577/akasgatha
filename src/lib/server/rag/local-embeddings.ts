/**
 * Local Deterministic Embedding Provider
 * 
 * Generates deterministic embeddings without external API calls.
 * Uses TF-IDF style vector generation for semantic similarity.
 * Phase 4B: Default provider for development and testing.
 */

import { createHash } from "crypto";

/**
 * Local embedding configuration
 */
export interface LocalEmbeddingConfig {
  dimensions: number;
  model: string;
}

export const LOCAL_EMBEDDING_CONFIG: LocalEmbeddingConfig = {
  dimensions: 384, // Smaller than OpenAI but sufficient for local search
  model: "local-tfidf-v1",
};

/**
 * Generate deterministic embedding for text
 */
export function generateLocalEmbedding(
  text: string,
  config: LocalEmbeddingConfig = LOCAL_EMBEDDING_CONFIG
): number[] {
  // Normalize text
  const normalized = text.toLowerCase().trim();
  
  // Extract features
  const words = tokenize(normalized);
  const bigrams = extractBigrams(words);
  const trigrams = extractTrigrams(words);
  
  // Create feature set
  const features = [
    ...words,
    ...bigrams.map(b => `bi:${b}`),
    ...trigrams.map(t => `tri:${t}`),
  ];
  
  // Generate deterministic vector
  const vector: number[] = new Array(config.dimensions).fill(0);
  
  for (const feature of features) {
    const hash = hashFeature(feature);
    const indices = getFeatureIndices(hash, config.dimensions, 3); // 3 hash functions
    
    for (const idx of indices) {
      vector[idx] += 1.0;
    }
  }
  
  // Normalize vector (L2 normalization)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= magnitude;
    }
  }
  
  return vector;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have same dimensions");
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Extract bigrams from words
 */
function extractBigrams(words: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]}_${words[i + 1]}`);
  }
  return bigrams;
}

/**
 * Extract trigrams from words
 */
function extractTrigrams(words: string[]): string[] {
  const trigrams: string[] = [];
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
  }
  return trigrams;
}

/**
 * Hash feature to 32-bit integer
 */
function hashFeature(feature: string): number {
  const hash = createHash("md5").update(feature).digest();
  return hash.readUInt32BE(0);
}

/**
 * Get multiple indices for feature using different hash functions
 */
function getFeatureIndices(
  baseHash: number,
  dimensions: number,
  count: number
): number[] {
  const indices: number[] = [];
  for (let i = 0; i < count; i++) {
    const hash = (baseHash + i * 2654435761) >>> 0; // Use golden ratio for distribution
    indices.push(hash % dimensions);
  }
  return indices;
}

/**
 * Calculate keyword overlap score
 */
export function keywordScore(query: string, text: string): number {
  const queryWords = new Set(tokenize(query));
  const textWords = tokenize(text);
  
  if (queryWords.size === 0 || textWords.length === 0) {
    return 0;
  }
  
  let matches = 0;
  for (const word of textWords) {
    if (queryWords.has(word)) {
      matches++;
    }
  }
  
  return matches / Math.sqrt(queryWords.size * textWords.length);
}
