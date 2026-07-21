#!/usr/bin/env tsx
/**
 * RAG Duplicate Suppression & Chunk Check Script
 * 
 * Verifies document IDs, chunk IDs, and detects content duplicates.
 * 
 * Usage: npm run rag:check-duplicates
 */

import * as path from "path";
import { discoverCorpusFiles, parseAndValidateDocument } from "../../src/lib/server/rag/frontmatter";
import { loadIndex, calculateContentHash } from "../../src/lib/server/rag/local-index";

async function main() {
  console.log("======================================================================");
  console.log("RAG DUPLICATE SUPPRESSION CHECK");
  console.log("======================================================================");
  console.log();

  const corpusDir = path.join(process.cwd(), "content", "knowledge");
  const files = await discoverCorpusFiles(corpusDir);

  const seenDocIds = new Set<string>();
  const duplicateDocIds: string[] = [];

  for (const filePath of files) {
    const { document } = await parseAndValidateDocument(filePath);
    if (!document) continue;

    const id = document.frontmatter.id;
    if (seenDocIds.has(id)) {
      duplicateDocIds.push(id);
    }
    seenDocIds.add(id);
  }

  const index = await loadIndex();
  let duplicateChunkHashes = 0;
  if (index) {
    const seenHashes = new Set<string>();
    for (const entry of index.entries) {
      if (seenHashes.has(entry.contentHash)) {
        duplicateChunkHashes++;
      }
      seenHashes.add(entry.contentHash);
    }
  }

  console.log("DUPLICATE CHECK RESULTS:");
  console.log(`  Total documents      : ${seenDocIds.size}`);
  console.log(`  Duplicate document IDs: ${duplicateDocIds.length}`);
  console.log(`  Duplicate chunks     : ${duplicateChunkHashes}`);
  console.log();

  if (duplicateDocIds.length > 0 || duplicateChunkHashes > 0) {
    console.error("❌ DUPLICATE CHECK FAILED");
    if (duplicateDocIds.length > 0) console.error("  Duplicate IDs:", duplicateDocIds);
    process.exit(1);
  }

  console.log("======================================================================");
  console.log("DUPLICATE CHECK PASSED ✓");
  console.log("======================================================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
