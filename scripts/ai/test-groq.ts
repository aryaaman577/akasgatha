/**
 * Real Groq Integration Test
 * 
 * Tests the Groq provider with actual API calls using openai/gpt-oss-20b model.
 * Tests both RAG-grounded and general space knowledge modes.
 * Requires GROQ_API_KEY and GROQ_MODEL in environment.
 * Phase 5
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

import { getServerEnv } from "../../src/lib/server/env";
import { GroqProvider } from "../../src/lib/server/ai/groq-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

const TEST_QUESTIONS = [
  {
    question: "Grahan kyon hota hai?",
    language: "hinglish" as const,
    expectedDomains: ["science"],
    description: "Science question about eclipses (RAG available)",
    expectRAG: true,
  },
  {
    question: "Rahu Ketu aur eclipse ka relation kya hai?",
    language: "hinglish" as const,
    expectedDomains: ["science", "narrative"],
    description: "Mixed question requiring both Katha and Vigyan (RAG available)",
    expectRAG: true,
  },
  {
    question: "What is a neutron star?",
    language: "en" as const,
    expectedDomains: ["science"],
    description: "General space question (corpus may have limited coverage)",
    expectRAG: false,
  },
  {
    question: "How do rocket engines work?",
    language: "en" as const,
    expectedDomains: ["science"],
    description: "General space question (may use general knowledge)",
    expectRAG: false,
  },
  {
    question: "What is dark matter?",
    language: "en" as const,
    expectedDomains: ["science"],
    description: "Cosmology question (may use general knowledge)",
    expectRAG: false,
  },
  {
    question: "Why does Saturn have rings?",
    language: "en" as const,
    expectedDomains: ["science"],
    description: "Planetary science question (may use general knowledge)",
    expectRAG: false,
  },
];

async function testGroq() {
  console.log("======================================================================");
  console.log("GROQ INTEGRATION TEST");
  console.log("======================================================================\n");

  // Check environment
  const env = getServerEnv();

  if (!env.GROQ_API_KEY) {
    console.log("⚠️  SKIPPED: GROQ_API_KEY not found in environment");
    console.log("   Set GROQ_API_KEY in .env.local to run this test\n");
    return;
  }

  if (!env.GROQ_MODEL) {
    console.log("⚠️  SKIPPED: GROQ_MODEL not configured");
    console.log("   Set GROQ_MODEL in .env.local (e.g., openai/gpt-oss-20b)\n");
    return;
  }

  console.log(`Provider: Groq`);
  console.log(`Model: ${env.GROQ_MODEL}`);
  console.log(`Temperature: ${env.GROQ_TEMPERATURE}`);
  console.log(`Max Output Tokens: ${env.GROQ_MAX_OUTPUT_TOKENS}`);
  console.log(`Knowledge Mode: ${env.JIGYASA_KNOWLEDGE_MODE}`);
  console.log(`Allow General Space Answers: ${env.JIGYASA_ALLOW_GENERAL_SPACE_ANSWERS}`);
  console.log(`Require RAG For All: ${env.JIGYASA_REQUIRE_RAG_FOR_ALL_ANSWERS}\n`);

  // Initialize provider
  let provider: GroqProvider;
  try {
    provider = new GroqProvider();
  } catch (error) {
    console.error("❌ FAILED: Could not initialize Groq provider");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  // Test health check
  console.log("Testing health check...");
  const health = await provider.healthCheck();
  console.log(`Health: configured=${health.configured}, available=${health.available}, mock=${health.mock}\n`);

  if (!health.available) {
    console.error("❌ FAILED: Provider not available");
    process.exitCode = 1;
    return;
  }

  // Run test questions
  let passCount = 0;
  let failCount = 0;

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const test = TEST_QUESTIONS[i];
    console.log(`Test ${i + 1}/${TEST_QUESTIONS.length}: ${test.description}`);
    console.log(`Question: "${test.question}"`);

    // Create abort controller for this test
    const abortController = new AbortController();

    try {
      // Retrieve RAG context using local index
      const ragContext = await retrieveLocalContext(test.question, {
        topK: 5,
        minScore: 0.5,
      });

      const hasRagContext = ragContext.totalResults > 0;
      console.log(`RAG: ${ragContext.totalResults} results${hasRagContext ? `, domains: ${ragContext.metadata.domains.join(", ")}` : ""}`);

      // Generate answer
      const startTime = Date.now();
      const result = await provider.generate({
        question: test.question,
        language: test.language,
        history: [],
        requestId: `test-${Date.now()}`,
        signal: abortController.signal,
        ragContext: hasRagContext ? ragContext : undefined,
      });

      const duration = Date.now() - startTime;

      // Validate response
      const answer = result.answer;
      const answerMode = result.meta.answerMode || "UNKNOWN";
      
      console.log(`Duration: ${duration}ms`);
      console.log(`Answer Mode: ${answerMode}`);
      console.log(`Short Answer: ${answer.shortAnswer.substring(0, 150)}...`);
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
      } else {
        console.log("Citations: None (general knowledge)");
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
        {
          name: "Answer mode valid",
          pass: ["RAG_GROUNDED", "HYBRID", "GENERAL_SPACE_KNOWLEDGE", "LIVE_VERIFICATION_REQUIRED", "INSUFFICIENT_KNOWLEDGE", "OUT_OF_SCOPE"].includes(answerMode),
        },
      ];

      // Check Katha/Vigyan separation for mixed questions
      if (test.expectedDomains.includes("narrative") && test.expectedDomains.includes("science")) {
        checks.push({
          name: "Katha and Vigyan both present",
          pass: answer.katha.length > 0 && answer.vigyan.length > 0,
        });
      }

      // Check vigyan is present for science questions
      if (test.expectedDomains.includes("science") && !test.expectedDomains.includes("narrative")) {
        checks.push({
          name: "Vigyan present for science question",
          pass: answer.vigyan.length > 0,
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
    } finally {
      // Clean up abort controller
      abortController.abort();
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
    process.exitCode = 0;
  } else {
    console.log("✗ SOME TESTS FAILED");
    process.exitCode = 1;
  }
}

// Run tests with graceful exit
testGroq()
  .then(() => {
    // Allow cleanup before exit
    setTimeout(() => {
      process.exit(process.exitCode || 0);
    }, 100);
  })
  .catch(error => {
    console.error("\n❌ TEST RUNNER ERROR:");
    console.error(error);
    setTimeout(() => {
      process.exit(1);
    }, 100);
  });
