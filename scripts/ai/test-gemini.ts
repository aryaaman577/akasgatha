/**
 * Real Gemini Integration Test
 * 
 * Tests the Gemini provider with actual API calls.
 * Requires GEMINI_API_KEY and GEMINI_MODEL in environment.
 * Phase 5
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

import { getServerEnv } from "../../src/lib/server/env";
import { GeminiProvider } from "../../src/lib/server/ai/gemini-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

const TEST_QUESTIONS = [
  {
    question: "Grahan kyon hota hai?",
    language: "hinglish" as const,
    expectedDomains: ["science"],
    description: "Science question about eclipses",
  },
  {
    question: "Rahu Ketu aur eclipse ka relation kya hai?",
    language: "hinglish" as const,
    expectedDomains: ["science", "narrative"],
    description: "Mixed question requiring both Katha and Vigyan",
  },
];

async function testGemini() {
  console.log("======================================================================");
  console.log("GEMINI INTEGRATION TEST");
  console.log("======================================================================\n");

  // Check environment
  const env = getServerEnv();

  if (!env.GEMINI_API_KEY) {
    console.log("⚠️  SKIPPED: GEMINI_API_KEY not found in environment");
    console.log("   Set GEMINI_API_KEY in .env.local to run this test\n");
    return;
  }

  if (!env.GEMINI_MODEL) {
    console.log("⚠️  SKIPPED: GEMINI_MODEL not configured");
    console.log("   Set GEMINI_MODEL in .env.local (e.g., gemini-3.5-flash)\n");
    return;
  }

  console.log(`Provider: Gemini`);
  console.log(`Model: ${env.GEMINI_MODEL}`);
  console.log(`Temperature: ${env.GEMINI_TEMPERATURE}`);
  console.log(`Max Output Tokens: ${env.GEMINI_MAX_OUTPUT_TOKENS}\n`);

  // Initialize provider
  let provider: GeminiProvider;
  try {
    provider = new GeminiProvider();
  } catch (error) {
    console.error("❌ FAILED: Could not initialize Gemini provider");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Test health check
  console.log("Testing health check...");
  const health = await provider.healthCheck();
  console.log(`Health: configured=${health.configured}, available=${health.available}, mock=${health.mock}\n`);

  if (!health.available) {
    console.error("❌ FAILED: Provider not available");
    process.exit(1);
  }

  // Run test questions
  let passCount = 0;
  let failCount = 0;

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const test = TEST_QUESTIONS[i];
    console.log(`Test ${i + 1}/${TEST_QUESTIONS.length}: ${test.description}`);
    console.log(`Question: "${test.question}"`);

    try {
      // Retrieve RAG context using local index
      const ragContext = await retrieveLocalContext(test.question, {
        topK: 5,
        minScore: 0.5,
      });

      console.log(`RAG: ${ragContext.totalResults} results, domains: ${ragContext.metadata.domains.join(", ")}`);

      // Generate answer
      const startTime = Date.now();
      const result = await provider.generate({
        question: test.question,
        language: test.language,
        history: [],
        requestId: `test-${Date.now()}`,
        signal: new AbortController().signal,
        ragContext,
      });

      const duration = Date.now() - startTime;

      // Validate response
      const answer = result.answer;
      
      console.log(`Duration: ${duration}ms`);
      console.log(`Short Answer: ${answer.shortAnswer.substring(0, 100)}...`);
      console.log(`Katha: ${answer.katha ? "Yes" : "Empty"} (${answer.katha.length} chars)`);
      console.log(`Vigyan: ${answer.vigyan ? "Yes" : "Empty"} (${answer.vigyan.length} chars)`);
      console.log(`Pramaan: ${answer.pramaan.length} evidence statements`);
      console.log(`Sources: ${answer.sources.length} citations`);
      console.log(`Follow-ups: ${answer.followUps.length} questions`);

      // List citations
      if (answer.sources.length > 0) {
        console.log("Citations:");
        answer.sources.forEach(source => {
          console.log(`  - ${source.id}: ${source.title}`);
          if (source.url && !source.url.startsWith("http")) {
            console.log(`    ⚠️  WARNING: Invalid URL format: ${source.url}`);
          }
        });
      }

      // Validation checks
      const checks: Array<{ name: string; pass: boolean; message?: string }> = [
        {
          name: "Short answer present",
          pass: answer.shortAnswer.length > 0,
        },
        {
          name: "No fake citations",
          pass: answer.sources.every(s => !s.id.includes("FAKE")),
        },
        {
          name: "Valid URLs",
          pass: answer.sources.every(s => !s.url || s.url.startsWith("http")),
        },
        {
          name: "Uncertainty present",
          pass: answer.uncertainty.length > 0,
        },
        {
          name: "Follow-ups provided",
          pass: answer.followUps.length >= 2,
        },
      ];

      // Check Katha/Vigyan separation for mixed questions
      if (test.expectedDomains.includes("narrative") && test.expectedDomains.includes("science")) {
        checks.push({
          name: "Katha and Vigyan both present",
          pass: answer.katha.length > 0 && answer.vigyan.length > 0,
        });
      }

      let testPassed = true;
      checks.forEach(check => {
        if (check.pass) {
          console.log(`  ✓ ${check.name}`);
        } else {
          console.log(`  ✗ ${check.name}${check.message ? `: ${check.message}` : ""}`);
          testPassed = false;
        }
      });

      if (testPassed) {
        console.log("✓ PASS\n");
        passCount++;
      } else {
        console.log("✗ FAIL\n");
        failCount++;
      }
    } catch (error) {
      console.log(`✗ FAIL: ${error instanceof Error ? error.message : String(error)}\n`);
      failCount++;
    }
  }

  // Summary
  console.log("======================================================================");
  console.log("TEST SUMMARY");
  console.log("======================================================================");
  console.log(`Total tests: ${TEST_QUESTIONS.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log("");

  if (failCount === 0) {
    console.log("✓ ALL TESTS PASSED");
  } else {
    console.log("✗ SOME TESTS FAILED");
    process.exit(1);
  }
}

// Run tests
testGemini().catch(error => {
  console.error("\n❌ TEST RUNNER ERROR:");
  console.error(error);
  process.exit(1);
});
