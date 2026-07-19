#!/usr/bin/env tsx
/**
 * RAG Inspect Script
 * 
 * Inspects retrieval results for a query.
 * Phase 4B: npm run rag:inspect -- "Your question"
 */

import { retrieve, buildRagContext } from "../../src/lib/server/rag/local-retrieval";
import { loadManifest } from "../../src/lib/server/rag/local-index";

async function main() {
  const query = process.argv[2];
  
  if (!query) {
    console.error("Usage: npm run rag:inspect -- \"Your question here\"");
    process.exit(1);
  }
  
  console.log("======================================================================");
  console.log("RAG INSPECTION");
  console.log("======================================================================");
  console.log();
  
  // Check manifest
  const manifest = await loadManifest();
  if (!manifest) {
    console.error("ERROR: No index found. Run 'npm run rag:ingest' first.");
    process.exit(1);
  }
  
  console.log(`Index: ${manifest.chunkCount} chunks from ${manifest.documentCount} documents`);
  console.log(`Provider: ${manifest.provider} (${manifest.model})`);
  console.log();
  
  console.log(`Query: "${query}"`);
  console.log("-".repeat(70));
  console.log();
  
  // Retrieve
  const result = await retrieve(query, { topK: 10, minScore: 0.1 });
  
  console.log(`Intent: ${result.intent}`);
  console.log(`Retrieval time: ${result.retrievalTimeMs}ms`);
  console.log(`Total results: ${result.totalResults}`);
  console.log();
  
  // Show science chunks
  if (result.scienceChunks.length > 0) {
    console.log(`SCIENCE CHUNKS (${result.scienceChunks.length}):`);
    for (const chunk of result.scienceChunks) {
      console.log(`  [${chunk.rank}] ${chunk.title}`);
      console.log(`      Raw Score: ${chunk.score.toFixed(3)}`);
      console.log(`      Citation: ${chunk.id}`);
      console.log(`      Source: ${chunk.sourceName}`);
      console.log(`      Preview: ${chunk.content.substring(0, 100)}...`);
      console.log();
    }
  }
  
  // Show narrative chunks
  if (result.narrativeChunks.length > 0) {
    console.log(`NARRATIVE CHUNKS (${result.narrativeChunks.length}):`);
    for (const chunk of result.narrativeChunks) {
      console.log(`  [${chunk.rank}] ${chunk.title}`);
      console.log(`      Raw Score: ${chunk.score.toFixed(3)}`);
      console.log(`      Citation: ${chunk.id}`);
      console.log(`      Source: ${chunk.sourceName}`);
      console.log(`      Preview: ${chunk.content.substring(0, 100)}...`);
      console.log();
    }
  }
  
  // Show boundary chunks
  if (result.boundaryChunks.length > 0) {
    console.log(`BOUNDARY CHUNKS (${result.boundaryChunks.length}):`);
    for (const chunk of result.boundaryChunks) {
      console.log(`  [${chunk.rank}] ${chunk.title}`);
      console.log(`      Raw Score: ${chunk.score.toFixed(3)}`);
      console.log(`      Citation: ${chunk.id}`);
      console.log();
    }
  }
  
  // Show glossary chunks
  if (result.glossaryChunks.length > 0) {
    console.log(`GLOSSARY CHUNKS (${result.glossaryChunks.length}):`);
    for (const chunk of result.glossaryChunks) {
      console.log(`  [${chunk.rank}] ${chunk.title}`);
      console.log(`      Raw Score: ${chunk.score.toFixed(3)}`);
      console.log(`      Citation: ${chunk.id}`);
      console.log();
    }
  }
  
  // Build context
  console.log("RAG CONTEXT BUILDER:");
  console.log("-".repeat(70));
  const context = buildRagContext(result, 2000);
  console.log(`Citations: ${context.citations.length}`);
  console.log(`Vigyan context: ${context.vigyanContext.length} chars`);
  console.log(`Katha context: ${context.kathaContext.length} chars`);
  console.log(`Boundary context: ${context.boundaryContext.length} chars`);
  console.log(`Truncated: ${context.truncated ? "YES" : "NO"}`);
  console.log();
  
  console.log("======================================================================");
  console.log("INSPECTION COMPLETE ✓");
  console.log("======================================================================");
}

main().catch((error) => {
  console.error();
  console.error("INSPECTION FAILED:");
  console.error(error);
  process.exit(1);
});
