#!/usr/bin/env tsx
/**
 * Index Corpus Script
 * 
 * Generates embeddings and indexes them in Pinecone.
 * Phase 4B-3
 * 
 * Usage: npm run rag:index
 * 
 * Prerequisites:
 * - OPENAI_API_KEY environment variable set
 * - PINECONE_API_KEY environment variable set
 * - PINECONE_INDEX_NAME environment variable set (or defaults to "akashgatha-embeddings")
 * - Pinecone index must already exist with correct dimensions (1536 for text-embedding-3-small)
 */

import * as path from "path";
import * as fs from "fs";
import type { RagChunk } from "../../src/lib/server/rag/types";
import { generateEmbeddings, estimateEmbeddingCost, DEFAULT_EMBEDDING_CONFIG } from "../../src/lib/server/rag/embeddings";
import { upsertEmbeddings, getIndexStats } from "../../src/lib/server/rag/vectorstore";

const CHUNKS_FILE = path.join(process.cwd(), "content", "chunks", "corpus-chunks.json");

async function main() {
  console.log("======================================================================");
  console.log("RAG CORPUS INDEXING");
  console.log("======================================================================");
  console.log();

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY environment variable is required");
    console.error("Get your API key from: https://platform.openai.com/api-keys");
    process.exit(1);
  }

  if (!process.env.PINECONE_API_KEY) {
    console.error("ERROR: PINECONE_API_KEY environment variable is required");
    console.error("Get your API key from: https://app.pinecone.io/");
    process.exit(1);
  }

  const indexName = process.env.PINECONE_INDEX_NAME || "akashgatha-embeddings";
  console.log(`Pinecone index: ${indexName}`);
  console.log();

  // Load chunks
  console.log(`Loading chunks from: ${CHUNKS_FILE}`);
  if (!fs.existsSync(CHUNKS_FILE)) {
    console.error(`ERROR: Chunks file not found. Run 'npm run rag:chunk' first.`);
    process.exit(1);
  }

  const chunksData = fs.readFileSync(CHUNKS_FILE, "utf-8");
  const chunks: RagChunk[] = JSON.parse(chunksData);
  console.log(`Loaded ${chunks.length} chunks`);
  console.log();

  // Estimate cost
  const costEstimate = estimateEmbeddingCost(chunks);
  console.log("Cost estimate:");
  console.log(`  Total tokens: ${costEstimate.totalTokens.toLocaleString()}`);
  console.log(`  Estimated cost: $${costEstimate.estimatedCostUSD.toFixed(4)} USD`);
  console.log();

  // Generate embeddings
  console.log("Generating embeddings with OpenAI...");
  console.log(`  Model: ${DEFAULT_EMBEDDING_CONFIG.model}`);
  console.log(`  Dimensions: ${DEFAULT_EMBEDDING_CONFIG.dimensions}`);
  console.log(`  Batch size: ${DEFAULT_EMBEDDING_CONFIG.batchSize}`);
  console.log();

  const startTime = Date.now();
  const embeddings = await generateEmbeddings(
    chunks,
    DEFAULT_EMBEDDING_CONFIG,
    (processed, total) => {
      const percent = ((processed / total) * 100).toFixed(1);
      process.stdout.write(`\r  Progress: ${processed}/${total} (${percent}%)  `);
    }
  );
  const embeddingDuration = Date.now() - startTime;
  console.log();
  console.log(`Generated ${embeddings.length} embeddings in ${(embeddingDuration / 1000).toFixed(1)}s`);
  console.log();

  // Upsert to Pinecone
  console.log("Upserting to Pinecone...");
  const upsertStartTime = Date.now();
  await upsertEmbeddings(chunks, embeddings, (processed, total) => {
    const percent = ((processed / total) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${processed}/${total} (${percent}%)  `);
  });
  const upsertDuration = Date.now() - upsertStartTime;
  console.log();
  console.log(`Upserted ${embeddings.length} vectors in ${(upsertDuration / 1000).toFixed(1)}s`);
  console.log();

  // Get index stats
  console.log("Fetching index statistics...");
  const stats = await getIndexStats();
  console.log(`  Total vectors in index: ${stats.totalVectors}`);
  console.log(`  Vector dimensions: ${stats.dimension}`);
  console.log();

  console.log("======================================================================");
  console.log("INDEXING COMPLETE ✓");
  console.log("======================================================================");
  console.log();
  console.log("Next steps:");
  console.log("  1. Test retrieval with: npm run rag:test-retrieval");
  console.log("  2. Integrate RAG into /api/jigyasa endpoint (Phase 4B-4)");
}

main().catch((error) => {
  console.error();
  console.error("Error during indexing:");
  console.error(error);
  process.exit(1);
});
