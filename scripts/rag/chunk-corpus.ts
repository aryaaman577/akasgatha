#!/usr/bin/env tsx
/**
 * Chunk Corpus Script
 * 
 * Chunks all RAG corpus documents and outputs statistics.
 * Phase 4B-2
 */

import * as path from "path";
import * as fs from "fs";
import { loadCorpusDocuments } from "../../src/lib/server/rag/frontmatter";
import { chunkDocuments, getChunkingStats, DEFAULT_CHUNKING_CONFIG } from "../../src/lib/server/rag/chunker";

const CORPUS_DIR = path.join(process.cwd(), "content", "knowledge");
const OUTPUT_DIR = path.join(process.cwd(), "content", "chunks");

async function main() {
  console.log("======================================================================");
  console.log("RAG CORPUS CHUNKING");
  console.log("======================================================================");
  console.log();

  // Load all documents
  console.log(`Loading documents from: ${CORPUS_DIR}`);
  const documents = await loadCorpusDocuments(CORPUS_DIR);
  console.log(`Loaded ${documents.length} documents`);
  console.log();

  // Configuration
  console.log("Chunking configuration:");
  console.log(`  Max tokens per chunk: ${DEFAULT_CHUNKING_CONFIG.maxTokens}`);
  console.log(`  Overlap tokens: ${DEFAULT_CHUNKING_CONFIG.overlap}`);
  console.log(`  Preserve paragraphs: ${DEFAULT_CHUNKING_CONFIG.preserveParagraphs}`);
  console.log(`  Min chunk tokens: ${DEFAULT_CHUNKING_CONFIG.minChunkTokens}`);
  console.log();

  // Chunk documents
  console.log("Chunking documents...");
  const startTime = Date.now();
  const chunks = chunkDocuments(documents, DEFAULT_CHUNKING_CONFIG);
  const duration = Date.now() - startTime;
  console.log(`Chunked in ${duration}ms`);
  console.log();

  // Statistics
  const stats = getChunkingStats(chunks);
  console.log("CHUNKING STATISTICS:");
  console.log(`  Total chunks: ${stats.totalChunks}`);
  console.log(`  Average tokens per chunk: ${stats.avgTokensPerChunk.toFixed(1)}`);
  console.log(`  Min tokens: ${stats.minTokens}`);
  console.log(`  Max tokens: ${stats.maxTokens}`);
  console.log();

  console.log("Chunks by domain:");
  Object.entries(stats.byDomain)
    .sort(([, a], [, b]) => b - a)
    .forEach(([domain, count]) => {
      console.log(`  ${domain}: ${count} chunks`);
    });
  console.log();

  console.log("Chunks by document (top 10):");
  Object.entries(stats.byDocument)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([docId, count]) => {
      console.log(`  ${docId}: ${count} chunks`);
    });
  console.log();

  // Save chunks to JSON file
  console.log("Saving chunks...");
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outputFile = path.join(OUTPUT_DIR, "corpus-chunks.json");
  fs.writeFileSync(outputFile, JSON.stringify(chunks, null, 2), "utf-8");
  console.log(`Saved ${chunks.length} chunks to: ${outputFile}`);
  console.log();

  // Sample chunk preview
  console.log("Sample chunk preview:");
  console.log("----------------------------------------------------------------------");
  if (chunks.length > 0) {
    const sampleChunk = chunks[0];
    console.log(`ID: ${sampleChunk.id}`);
    console.log(`Document: ${sampleChunk.documentTitle}`);
    console.log(`Domain: ${sampleChunk.domain}`);
    console.log(`Chunk: ${sampleChunk.chunkIndex + 1}/${sampleChunk.totalChunks}`);
    console.log(`Tokens: ${sampleChunk.tokenCount}`);
    console.log(`Content preview: ${sampleChunk.content.substring(0, 200)}...`);
  }
  console.log("----------------------------------------------------------------------");
  console.log();

  console.log("======================================================================");
  console.log("CHUNKING COMPLETE ✓");
  console.log("======================================================================");
}

main().catch((error) => {
  console.error("Error during chunking:", error);
  process.exit(1);
});
