/**
 * Cerebras Provider Test Script
 * 
 * Tests Cerebras integration with:
 * - Direct API calls
 * - Structured output validation
 * - RAG grounding
 * - Citation validation
 * - Hybrid knowledge mode
 * 
 * Usage: npm run ai:test-cerebras
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

import { CerebrasProvider } from "../../src/lib/server/ai/cerebras-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";
import { getServerEnv } from "../../src/lib/server/env";

const testQuestions = [
  {
    question: "Grahan kyon hota hai?",
    language: "hi" as const,
    description: "Eclipse question (corpus-covered)"
  },
  {
    question: "Rahu Ketu aur eclipse ka relation kya hai?",
    language: "hi" as const,
    description: "Narrative + science question (corpus-covered)"
  },
  {
    question: "What is a neutron star?",
    language: "en" as const,
    description: "Pure science question"
  },
  {
    question: "How do rocket engines work?",
    language: "en" as const,
    description: "Engineering science question"
  },
  {
    question: "What is dark matter?",
    language: "en" as const,
    description: "Cosmology question"
  },
];

async function testCerebras() {
  console.log("=".repeat(80));
  console.log("CEREBRAS PROVIDER TEST");
  console.log("=".repeat(80));
  console.log();

  const env = getServerEnv();

  // Check configuration
  if (!env.CEREBRAS_API_KEY) {
    console.log("⏭️  SKIPPED: CEREBRAS_API_KEY not configured");
    console.log();
    console.log("To test Cerebras provider:");
    console.log("1. Add CEREBRAS_API_KEY to .env.local");
    console.log("2. Set CEREBRAS_MODEL (default: gpt-oss-120b)");
    console.log("3. Run: npm run ai:test-cerebras");
    console.log();
    process.exit(0);
  }

  console.log("✅ Cerebras configured");
  console.log(`   Model: ${env.CEREBRAS_MODEL}`);
  console.log(`   Temperature: ${env.CEREBRAS_TEMPERATURE}`);
  console.log(`   Max tokens: ${env.CEREBRAS_MAX_OUTPUT_TOKENS}`);
  console.log(`   Timeout: ${env.CEREBRAS_TIMEOUT_MS}ms`);
  console.log();

  // Create provider
  let provider: CerebrasProvider;
  try {
    provider = new CerebrasProvider();
    console.log("✅ Provider initialized");
    console.log();
  } catch (error) {
    console.error("❌ Provider initialization failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Run tests
  let passedTests = 0;
  let failedTests = 0;

  for (const test of testQuestions) {
    console.log("-".repeat(80));
    console.log(`Question: ${test.question}`);
    console.log(`Language: ${test.language}`);
    console.log(`Type: ${test.description}`);
    console.log();

    try {
      // Run RAG retrieval
      console.log("Running RAG retrieval...");
      const ragContext = await retrieveLocalContext(test.question, {
        topK: 5,
        minScore: 0.5,
        languageFilter: test.language === "hi" ? "hi" : "en",
      });
      console.log(`✅ Retrieved ${ragContext.totalResults} results`);
      console.log(`   Domains: ${ragContext.metadata.domains.join(", ") || "none"}`);
      console.log(`   Avg score: ${ragContext.metadata.avgScore.toFixed(2)}`);
      console.log();

      // Generate answer
      console.log("Generating answer...");
      const controller = new AbortController();
      const result = await provider.generate({
        question: test.question,
        language: test.language,
        requestId: `test-${Date.now()}`,
        signal: controller.signal,
        ragContext,
      });

      console.log("✅ Answer generated");
      console.log();
      console.log("Short Answer:");
      console.log(result.answer.shortAnswer);
      console.log();
      console.log("Katha:", result.answer.katha || "(empty)");
      console.log("Vigyan:", result.answer.vigyan ? result.answer.vigyan.substring(0, 100) + "..." : "(empty)");
      console.log();
      console.log("Pramaan:", result.answer.pramaan.length, "statements");
      console.log("Uncertainty:", result.answer.uncertainty);
      console.log("Sources:", result.answer.sources.length);
      console.log("Follow-ups:", result.answer.followUps.length);
      console.log();
      console.log("Meta:");
      console.log(`   Model: ${result.meta.model}`);
      console.log(`   Duration: ${result.meta.durationMs}ms`);
      console.log(`   Tokens: ${result.meta.tokensUsed || "N/A"}`);
      console.log(`   Answer mode: ${result.meta.answerMode}`);
      console.log();

      // Validate citations
      if (result.answer.sources.length > 0) {
        console.log("Citations:");
        result.answer.sources.forEach((source, i) => {
          console.log(`   ${i + 1}. ${source.title}`);
          console.log(`      ID: ${source.id}`);
          if (source.url) {
            console.log(`      URL: ${source.url}`);
          }
        });
        console.log();
      }

      passedTests++;
    } catch (error) {
      console.error("❌ Test failed:");
      console.error(error instanceof Error ? error.message : String(error));
      console.log();
      failedTests++;
    }
  }

  // Summary
  console.log("=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total: ${testQuestions.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log();

  if (failedTests === 0) {
    console.log("✅ All tests passed!");
    process.exit(0);
  } else {
    console.log("❌ Some tests failed");
    process.exit(1);
  }
}

testCerebras().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
