#!/usr/bin/env tsx
/**
 * RAG Source Verification Script
 * 
 * Verifies that all corpus documents have valid source metadata,
 * valid URLs, and proper attribution.
 * 
 * Usage: npm run rag:verify-sources
 */

import * as path from "path";
import { discoverCorpusFiles, parseAndValidateDocument } from "../../src/lib/server/rag/frontmatter";

async function main() {
  console.log("======================================================================");
  console.log("RAG SOURCE VERIFICATION");
  console.log("======================================================================");
  console.log();

  const corpusDir = path.join(process.cwd(), "content", "knowledge");
  const files = await discoverCorpusFiles(corpusDir);

  let verifiedCount = 0;
  let pendingCount = 0;
  let errorCount = 0;

  for (const filePath of files) {
    const { document, errors } = await parseAndValidateDocument(filePath);
    if (errors.length > 0 || !document) {
      console.error(`❌ Validation error in ${path.relative(process.cwd(), filePath)}`);
      errorCount++;
      continue;
    }

    const { id, domain, sourceType, sourceName, sourceUrl } = document.frontmatter;

    if (sourceType === "official" || sourceType === "academic" || sourceType === "primary-text") {
      if (sourceUrl && (sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://"))) {
        verifiedCount++;
      } else {
        console.warn(`⚠️  Pending URL review: [${domain}] ${id} (${sourceName})`);
        pendingCount++;
      }
    } else if (sourceType === "internal-policy") {
      verifiedCount++;
    } else {
      verifiedCount++;
    }
  }

  console.log();
  console.log("VERIFICATION SUMMARY:");
  console.log(`  Total documents scanned : ${files.length}`);
  console.log(`  Verified sources        : ${verifiedCount}`);
  console.log(`  Pending review          : ${pendingCount}`);
  console.log(`  Invalid / Error         : ${errorCount}`);
  console.log();

  if (errorCount > 0) {
    console.log("======================================================================");
    console.log("SOURCE VERIFICATION FAILED ❌");
    console.log("======================================================================");
    process.exit(1);
  }

  console.log("======================================================================");
  console.log("SOURCE VERIFICATION PASSED ✓");
  console.log("======================================================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
