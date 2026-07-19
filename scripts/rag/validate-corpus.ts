/**
 * RAG Corpus Validation Script
 * 
 * Validates all corpus documents for Phase 4B-1.
 * Usage: npm run rag:validate
 */

import * as path from "path";
import { validateCorpus } from "../../src/lib/server/rag/frontmatter";

async function main() {
  console.log("=".repeat(70));
  console.log("RAG CORPUS VALIDATION");
  console.log("=".repeat(70));
  console.log();

  const corpusDir = path.join(process.cwd(), "content", "knowledge");
  console.log(`Corpus directory: ${corpusDir}`);
  console.log();

  try {
    const result = await validateCorpus(corpusDir);

    console.log("STATISTICS:");
    console.log(`  Total files scanned: ${result.stats.totalFiles}`);
    console.log(`  Valid documents: ${result.stats.validDocuments}`);
    console.log(`  Science documents: ${result.stats.scienceCount}`);
    console.log(`  Narrative documents: ${result.stats.narrativeCount}`);
    console.log(`  Boundary documents: ${result.stats.boundaryCount}`);
    console.log(`  Glossary documents: ${result.stats.glossaryCount}`);
    console.log();

    if (result.errors.length > 0) {
      console.log("ERRORS:");
      console.log();

      result.errors.forEach((error) => {
        console.log(`  File: ${path.relative(process.cwd(), error.filePath)}`);
        if (error.documentId) {
          console.log(`  ID: ${error.documentId}`);
        }
        console.log(`  Field: ${error.field}`);
        console.log(`  Error: ${error.message}`);
        console.log();
      });

      console.log("=".repeat(70));
      console.log(`VALIDATION FAILED: ${result.errors.length} error(s) found`);
      console.log("=".repeat(70));
      process.exit(1);
    }

    if (result.stats.duplicateIds.length > 0) {
      console.log("DUPLICATE IDs:");
      result.stats.duplicateIds.forEach((id) => {
        console.log(`  - ${id}`);
      });
      console.log();
      console.log("=".repeat(70));
      console.log("VALIDATION FAILED: Duplicate IDs found");
      console.log("=".repeat(70));
      process.exit(1);
    }

    if (result.stats.validDocuments === 0) {
      console.log("=".repeat(70));
      console.log("VALIDATION FAILED: No valid documents found");
      console.log("=".repeat(70));
      process.exit(1);
    }

    console.log("=".repeat(70));
    console.log("VALIDATION PASSED ✓");
    console.log("=".repeat(70));
    process.exit(0);
  } catch (error) {
    console.error("FATAL ERROR:");
    console.error(error);
    process.exit(1);
  }
}

main();
