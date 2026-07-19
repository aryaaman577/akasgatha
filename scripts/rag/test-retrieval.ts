#!/usr/bin/env tsx
/**
 * Test Retrieval Script
 * 
 * Tests RAG retrieval with sample queries.
 * Phase 4B-4
 * 
 * Usage: npm run rag:test-retrieval
 */

import { retrieveContext, analyzeRetrievalQuality } from "../../src/lib/server/rag/retrieval";

const TEST_QUERIES = [
  "How do lunar eclipses work?",
  "What is the story of Rahu and Ketu?",
  "Why do we have seasons on Earth?",
  "What are nakshatras in Indian astronomy?",
  "How does a telescope magnify distant objects?",
];

async function main() {
  console.log("======================================================================");
  console.log("RAG RETRIEVAL TESTING");
  console.log("======================================================================");
  console.log();

  // Check environment
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  if (!process.env.PINECONE_API_KEY) {
    console.error("ERROR: PINECONE_API_KEY environment variable is required");
    process.exit(1);
  }

  console.log(`Testing ${TEST_QUERIES.length} queries...\n`);

  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const query = TEST_QUERIES[i];
    console.log(`Query ${i + 1}: "${query}"`);
    console.log("-".repeat(70));

    try {
      // Retrieve context
      const context = await retrieveContext(query, {
        topK: 3,
        minScore: 0.5,
      });

      // Analyze quality
      const quality = analyzeRetrievalQuality(context);

      console.log(`Results: ${context.totalResults} chunks retrieved`);
      console.log(`Retrieval time: ${context.retrievalTime}ms`);
      console.log(`Average score: ${(context.metadata.avgScore * 100).toFixed(1)}%`);
      console.log(`Confidence: ${quality.confidence}`);
      console.log(`Domains: ${context.metadata.domains.join(", ")}`);
      console.log();

      if (context.retrievedChunks.length > 0) {
        console.log("Top result:");
        const topChunk = context.retrievedChunks[0].chunk;
        console.log(`  Title: ${topChunk.documentTitle}`);
        console.log(`  Domain: ${topChunk.domain}`);
        console.log(`  Source: ${topChunk.sourceName}`);
        console.log(`  Score: ${(context.retrievedChunks[0].score * 100).toFixed(1)}%`);
        console.log(`  Preview: ${topChunk.content.substring(0, 150)}...`);
      } else {
        console.log("No results found.");
      }

      console.log();
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      console.log();
    }
  }

  console.log("======================================================================");
  console.log("RETRIEVAL TESTING COMPLETE ✓");
  console.log("======================================================================");
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error);
  process.exit(1);
});
