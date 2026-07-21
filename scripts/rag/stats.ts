#!/usr/bin/env tsx
/**
 * RAG Stats & Memory Benchmark Script
 * 
 * Reports corpus documents, chunk count, index file size, 
 * cold/cached retrieval latency, and memory consumption.
 * 
 * Usage: npm run rag:stats
 */

import * as fs from "fs/promises";
import * as path from "path";
import { loadIndex, loadManifest, invalidateCache } from "../../src/lib/server/rag/local-index";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

async function main() {
  console.log("======================================================================");
  console.log("AKASGATHA RAG SYSTEM METRICS & BENCHMARK");
  console.log("======================================================================");
  console.log();

  const dataDir = path.join(process.cwd(), "data", "rag");
  const indexFile = path.join(dataDir, "index.json");
  const manifestFile = path.join(dataDir, "manifest.json");

  // 1. File Stats
  let indexSizeKb = 0;
  let manifestSizeKb = 0;
  try {
    const stat = await fs.stat(indexFile);
    indexSizeKb = Number((stat.size / 1024).toFixed(2));
    const mstat = await fs.stat(manifestFile);
    manifestSizeKb = Number((mstat.size / 1024).toFixed(2));
  } catch {
    console.error("❌ Index files not found. Run 'npm run rag:ingest' first.");
    process.exit(1);
  }

  // 2. Memory before load
  if (global.gc) global.gc();
  const memBefore = process.memoryUsage();

  // 3. Manifest & Index Load (Cold)
  const coldStart = Date.now();
  invalidateCache();
  const manifest = await loadManifest();
  const index = await loadIndex();
  const coldLoadMs = Date.now() - coldStart;

  const memAfterLoad = process.memoryUsage();

  if (!manifest || !index) {
    console.error("❌ Failed to load index.");
    process.exit(1);
  }

  // Count domains
  const domainCounts: Record<string, number> = {};
  for (const entry of index.entries) {
    const d = entry.chunk.domain || "unknown";
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  }

  console.log("📊 INDEX & CORPUS METRICS:");
  console.log(`   Schema Version    : ${manifest.schemaVersion}`);
  console.log(`   Document Count    : ${manifest.documentCount}`);
  console.log(`   Chunk Count       : ${manifest.chunkCount}`);
  console.log(`   Index File Size   : ${indexSizeKb} KB`);
  console.log(`   Manifest Size     : ${manifestSizeKb} KB`);
  console.log(`   Embedding Dims    : ${manifest.dimensions}`);
  console.log("   Domain Chunks     :", JSON.stringify(domainCounts));
  console.log();

  // 4. Memory Metrics
  const heapUsedBeforeMb = (memBefore.heapUsed / 1024 / 1024).toFixed(2);
  const heapUsedAfterMb = (memAfterLoad.heapUsed / 1024 / 1024).toFixed(2);
  console.log("🧠 MEMORY USAGE:");
  console.log(`   Heap Used Before  : ${heapUsedBeforeMb} MB`);
  console.log(`   Heap Used After   : ${heapUsedAfterMb} MB`);
  console.log(`   Delta Heap        : ${(Number(heapUsedAfterMb) - Number(heapUsedBeforeMb)).toFixed(2)} MB`);
  console.log();

  // 5. Cold vs Cached Retrieval Latency
  console.log("⏱️  RETRIEVAL LATENCY BENCHMARK:");
  
  // Cold Retrieval
  invalidateCache();
  const q1Start = Date.now();
  const resCold = await retrieveLocalContext("Solar eclipse mechanism and Rahu Ketu story", { topK: 5 });
  const coldLatencyMs = Date.now() - q1Start;

  // Cached Retrieval (10 runs)
  const iterations = 10;
  const cachedStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    await retrieveLocalContext("Solar eclipse mechanism and Rahu Ketu story", { topK: 5 });
  }
  const avgCachedLatencyMs = Number(((Date.now() - cachedStart) / iterations).toFixed(2));

  console.log(`   Cold Retrieval    : ${coldLatencyMs} ms (results: ${resCold.totalResults})`);
  console.log(`   Cached Retrieval  : ${avgCachedLatencyMs} ms (avg over ${iterations} runs)`);
  console.log();

  console.log("======================================================================");
  console.log("METRICS BENCHMARK COMPLETE ✓");
  console.log("======================================================================");
}

main().catch((err) => {
  console.error("❌ Stats benchmark failed:", err);
  process.exit(1);
});
