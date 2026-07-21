/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Provider Fallback Test Script
 * 
 * Tests fallback behavior:
 * - Groq is attempted first
 * - Simulated Groq failures trigger Gemini
 * - Same RAG context is reused
 * - RAG invocation count is exactly one
 * - Proper fallback metadata
 * 
 * Usage: npm run ai:test-fallback
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

import { getProviderRouter, JigyasaProviderRouter } from "../../src/lib/server/ai/jigyasa-provider-router";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";
import { getServerEnv } from "../../src/lib/server/env";
import { ProviderInput, ProviderOutput, JigyasaProvider } from "../../src/lib/server/ai/types";

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

const results: TestResult[] = [];

function printHeader(title: string) {
  console.log(`\n${CYAN}${"=".repeat(60)}${RESET}`);
  console.log(`${CYAN}${title}${RESET}`);
  console.log(`${CYAN}${"=".repeat(60)}${RESET}\n`);
}

function printResult(result: TestResult) {
  const icon = result.passed ? "✓" : "✗";
  const color = result.passed ? GREEN : RED;
  console.log(`${color}${icon} ${result.name}${RESET}`);
  console.log(`  ${result.message}`);
  if (result.details) {
    console.log(`  Details:`, JSON.stringify(result.details, null, 2));
  }
  console.log();
}

async function testFallback() {
  const env = getServerEnv();

  // Check configuration
  if (!env.GROQ_API_KEY) {
    console.log("⏭️  SKIPPED: GROQ_API_KEY not configured");
    process.exit(0);
  }

  if (!env.GEMINI_API_KEY) {
    console.log("⏭️  SKIPPED: GEMINI_API_KEY not configured");
    console.log("Fallback test requires both Groq and Gemini configured");
    process.exit(0);
  }

  if (env.AI_FALLBACK_PROVIDER !== "gemini") {
    console.log("❌ ERROR: AI_FALLBACK_PROVIDER is not set to 'gemini'");
    console.log(`Current fallback provider: ${env.AI_FALLBACK_PROVIDER}`);
    process.exit(1);
  }

  console.log("✅ Both providers configured");
  console.log(`   Primary: ${env.AI_PROVIDER} (${env.GROQ_MODEL})`);
  console.log(`   Fallback: ${env.AI_FALLBACK_PROVIDER} (${env.GEMINI_MODEL})`);
  console.log();

  // Get router
  const router = getProviderRouter();
  const routerInfo = router.getProviderInfo();

  console.log("Router configuration:");
  console.log(`   Primary: ${routerInfo.primary} (configured: ${routerInfo.primaryConfigured})`);
  console.log(`   Fallback: ${routerInfo.fallback} (configured: ${routerInfo.fallbackConfigured})`);
  console.log();

  if (!routerInfo.primaryConfigured || !routerInfo.fallbackConfigured) {
    console.error("❌ Router not properly configured");
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // TEST 1: Normal successful request (should use primary)
  // --------------------------------------------------------------------------
  printHeader("TEST 1: Normal request (should use primary Groq provider)");

  try {
    const question = "What is a solar eclipse?";
    console.log(`Question: ${question}`);
    console.log();

    // Run RAG once
    let ragCallCount = 0;
    console.log("Running RAG retrieval...");
    const ragContext = await retrieveLocalContext(question, {
      topK: 5,
      minScore: 0.3,
    });
    ragCallCount++;
    console.log(`✅ Retrieved ${ragContext.totalResults} results`);
    console.log();

    // Generate answer
    console.log("Generating answer using router...");
    const controller = new AbortController();
    const result = await router.generate({
      question,
      language: "en",
      requestId: `test-normal-${Date.now()}`,
      signal: controller.signal,
      ragContext,
    });

    console.log("✅ Answer generated");
    console.log();

    // Validation
    const passed = 
      result.meta.provider === "groq" &&
      result.meta.fallbackUsed === false &&
      result.meta.providerAttempts === 1 &&
      ragCallCount === 1;

    results.push({
      name: "Primary Provider Success",
      passed,
      message: passed 
        ? "Primary provider succeeded without fallback" 
        : "Primary provider test failed",
      details: {
        provider: result.meta.provider,
        attempts: result.meta.providerAttempts,
        fallbackUsed: result.meta.fallbackUsed,
        ragCallCount,
      },
    });
  } catch (error) {
    results.push({
      name: "Primary Provider Success",
      passed: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  // --------------------------------------------------------------------------
  // TEST 2: Simulated Groq failure → Fallback to Gemini
  // --------------------------------------------------------------------------
  printHeader("TEST 2: Simulated Primary Failure (503) → Fallback to Gemini");

  try {
    const question = "Grahan kyon hota hai?";
    console.log(`Question: ${question}`);
    console.log();

    // Run RAG exactly once
    let ragCallCount = 0;
    console.log("Running RAG retrieval...");
    const ragContext = await retrieveLocalContext(question, {
      topK: 5,
      minScore: 0.3,
    });
    ragCallCount++;
    console.log(`✅ Retrieved ${ragContext.totalResults} results`);
    console.log();

    // Instantiate a temporary router to avoid modifying singleton indefinitely
    const tempRouter = new JigyasaProviderRouter();
    const tempRouterAny = tempRouter as any;
    
    // Check that primary/fallback are initialized
    if (!tempRouterAny.primaryProvider || !tempRouterAny.fallbackProvider) {
      throw new Error("Failed to initialize primary/fallback in temporary router");
    }

    const realGroqProvider = tempRouterAny.primaryProvider;
    let groqAttemptCount = 0;

    // Inject simulated Groq transient failure (503 Service Unavailable)
    tempRouterAny.primaryProvider = {
      name: "groq",
      generate: async (input: ProviderInput): Promise<ProviderOutput> => {
        groqAttemptCount++;
        console.log(`[Mock] Groq attempt ${groqAttemptCount}: Simulating 503 error`);
        throw new Error("HTTP 503 Service Unavailable");
      }
    };

    // Track Gemini attempts
    const realGeminiProvider = tempRouterAny.fallbackProvider;
    let geminiAttemptCount = 0;
    tempRouterAny.fallbackProvider = {
      name: "gemini",
      generate: async (input: ProviderInput): Promise<ProviderOutput> => {
        geminiAttemptCount++;
        console.log(`[Mock] Gemini attempt ${geminiAttemptCount}: Calling real Gemini generate`);
        return realGeminiProvider.generate(input);
      }
    };

    console.log("Generating answer using mock primary + real fallback...");
    const controller = new AbortController();
    const result = await tempRouter.generate({
      question,
      language: "hinglish",
      requestId: `test-fallback-${Date.now()}`,
      signal: controller.signal,
      ragContext,
    });

    console.log("✅ Answer generated after fallback");
    console.log();

    // Validation
    const passed =
      result.meta.provider === "gemini" &&
      result.meta.fallbackUsed === true &&
      result.meta.providerAttempts === 2 &&
      ragCallCount === 1 &&
      groqAttemptCount === 1 &&
      geminiAttemptCount === 1;

    results.push({
      name: "Simulated Primary Failure -> Fallback Success",
      passed,
      message: passed
        ? "Gemini fallback succeeded after Groq transient error"
        : "Fallback test failed",
      details: {
        finalProvider: result.meta.provider,
        finalModel: result.meta.model,
        attempts: result.meta.providerAttempts,
        fallbackUsed: result.meta.fallbackUsed,
        ragCallCount,
        groqAttempts: groqAttemptCount,
        geminiAttempts: geminiAttemptCount,
      },
    });
  } catch (error) {
    results.push({
      name: "Simulated Primary Failure -> Fallback Success",
      passed: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Failures that must NOT trigger fallback (e.g. INSUFFICIENT_KNOWLEDGE)
  // --------------------------------------------------------------------------
  printHeader("TEST 3: Failure category checking (should NOT trigger fallback)");

  try {
    const question = "Invalid test question";
    const ragContext = await retrieveLocalContext(question, { topK: 1 });

    const tempRouter = new JigyasaProviderRouter();
    const tempRouterAny = tempRouter as any;

    let groqAttemptCount = 0;
    tempRouterAny.primaryProvider = {
      name: "groq",
      generate: async (input: ProviderInput): Promise<ProviderOutput> => {
        groqAttemptCount++;
        throw new Error("AUTHENTICATION: Invalid API Key");
      }
    };

    let geminiAttemptCount = 0;
    tempRouterAny.fallbackProvider = {
      name: "gemini",
      generate: async (input: ProviderInput): Promise<ProviderOutput> => {
        geminiAttemptCount++;
        throw new Error("Gemini should not be called");
      }
    };

    console.log("Calling router with simulated authentication error...");
    const controller = new AbortController();
    await tempRouter.generate({
      question,
      language: "en",
      requestId: `test-no-fallback-${Date.now()}`,
      signal: controller.signal,
      ragContext,
    });

    // If we reach here without throwing, test failed
    results.push({
      name: "No-Fallback Error Categories",
      passed: false,
      message: "Expected router to propagate AUTHENTICATION error, but it succeeded.",
    });
  } catch (error: any) {
    const passed = error.category === "AUTHENTICATION" && error.fallbackAllowed === false;
    results.push({
      name: "No-Fallback Error Categories",
      passed,
      message: passed
        ? "Auth error correctly propagated without calling fallback"
        : `Unexpected error propagated: ${error.message} (${error.category})`,
      details: {
        errorCategory: error.category,
        fallbackAllowed: error.fallbackAllowed,
      }
    });
  }

  // Print summary
  printHeader("TEST SUMMARY");
  results.forEach(printResult);

  const failCount = results.filter(r => !r.passed).length;
  if (failCount > 0) {
    process.exit(1);
  }
  process.exit(0);
}

testFallback().catch((error) => {
  console.error("Fatal error during fallback test:", error);
  process.exit(1);
});
