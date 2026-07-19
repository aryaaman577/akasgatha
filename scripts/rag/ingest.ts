#!/usr/bin/env tsx
/**
 * RAG Ingestion Script
 * 
 * Builds local vector index with incremental embedding reuse.
 * Phase 4B: npm run rag:ingest
 */

import * as path from "path";
import { loadCorpusDocuments } from "../../src/lib/server/rag/frontmatter";
import { chunkDocuments, DEFAULT_CHUNKING_CONFIG } from "../../src/lib/server/rag/chunker";
import { buildIndex, saveIndex } from "../../src/lib/server/rag/local-index";

const CORPUS_DIR = path.join(process.cwd(), "content", "knowledge");

async function main() {
  console.log("======================================================================");
  console.log("RAG INGESTION");
  console.log("======================================================================");
  console.log();

  // Load and validate corpus
  console.log(`Loading corpus from: ${CORPUS_DIR}`);
  const documents = await loadCorpusDocuments(CORPUS_DIR);
  console.log(`✓ Loaded ${documents.length} documents`);
  console.log();

  // Chunk documents
  console.log("Chunking documents...");
  const chunks = chunkDocuments(documents, DEFAULT_CHUNKING_CONFIG);
  console.log(`✓ Generated ${chunks.length} chunks`);
  console.log();

  // Build index with embedding reuse
  console.log("Building vector index...");
  const { index, reusedCount, newCount } = await buildIndex(chunks);
  console.log(`✓ Reused ${reusedCount} embeddings`);
  console.log(`✓ Generated ${newCount} new embeddings`);
  console.log();

  // Save index atomically
  console.log("Saving index...");
  await saveIndex(index);
  console.log(`✓ Saved to data/rag/index.json`);
  console.log(`✓ Saved manifest to data/rag/manifest.json`);
  console.log();

  // Report manifest
  console.log("INDEX MANIFEST:");
  console.log(`  Schema version: ${index.manifest.schemaVersion}`);
  console.log(`  Provider: ${index.manifest.provider}`);
  console.log(`  Model: ${index.manifest.model}`);
  console.log(`  Dimensions: ${index.manifest.dimensions}`);
  console.log(`  Documents: ${index.manifest.documentCount}`);
  console.log(`  Chunks: ${index.manifest.chunkCount}`);
  console.log(`  Corpus hash: ${index.manifest.corpusHash.substring(0, 16)}...`);
  console.log(`  Index hash: ${index.manifest.indexHash.substring(0, 16)}...`);
  console.log(`  Updated: ${index.manifest.updatedAt}`);
  console.log();

  console.log("======================================================================");
  console.log("INGESTION COMPLETE ✓");
  console.log("======================================================================");
}

main().catch((error) => {
  console.error();
  console.error("INGESTION FAILED:");
  console.error(error);
  process.exit(1);
});
