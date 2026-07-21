/**
 * Real Jigyasa API Test
 * Tests actual Groq API calls through the Jigyasa browser endpoint
 * 
 * CRITICAL: This test makes REAL API calls to Groq
 */

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

interface TestResult {
  name: string;
  passed: boolean;
  details: Record<string, unknown>;
  error?: string;
}

const results: TestResult[] = [];

const TEST_QUESTIONS = [
  { question: "What is a neutron star?", language: "en" as const, expected: "general" },
  { question: "Black hole ke paas time slow kyon hota hai", language: "hinglish" as const, expected: "general" },
  { question: "Rocket vacuum mein kaise chalta hai", language: "hinglish" as const, expected: "general" },
  { question: "Rahu Ketu aur eclipse ka relation kya hai", language: "hinglish" as const, expected: "corpus" },
  { question: "Can humans live on Mars", language: "en" as const, expected: "general" },
];

async function testProviderOption(
  provider: "auto" | "groq",
  question: string,
  language: "en" | "hi" | "hinglish"
) {
  const startTime = Date.now();
  
  try {
    const response = await fetch("http://localhost:3001/api/jigyasa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        language,
        providerPreference: provider,
        responseStyle: "balanced",
      }),
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || `HTTP ${response.status}`,
        duration,
      };
    }

    if (data.status !== "ok") {
      return {
        success: false,
        error: data.error?.message || "Status not ok",
        duration,
      };
    }

    // Validate response structure
    const checks = {
      hasShortAnswer: !!data.answer?.shortAnswer,
      hasKatha: typeof data.answer?.katha === "string",
      hasVigyan: typeof data.answer?.vigyan === "string",
      hasPramaan: Array.isArray(data.answer?.pramaan),
      hasSources: Array.isArray(data.answer?.sources),
      hasFollowUps: Array.isArray(data.answer?.followUps),
      hasProvider: !!data.meta?.provider,
      hasModel: !!data.meta?.model,
      ragUsed: data.meta?.ragUsed === true,
      notMock: data.meta?.mock === false,
    };

    const allChecksPassed = Object.values(checks).every(v => v);

    return {
      success: allChecksPassed,
      duration,
      provider: data.meta?.provider,
      model: data.meta?.model,
      ragUsed: data.meta?.ragUsed,
      ragResults: data.meta?.retrievedChunkCount,
      answerPreview: data.answer?.shortAnswer?.substring(0, 100),
      citationCount: data.answer?.sources?.length || 0,
      checks,
      error: allChecksPassed ? undefined : "Response validation failed",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    };
  }
}

async function runTests() {
  console.log(`${CYAN}========================================${RESET}`);
  console.log(`${CYAN}JIGYASA REAL GROQ API VALIDATION${RESET}`);
  console.log(`${CYAN}========================================${RESET}\n`);

  // Test Auto Mode
  console.log(`${CYAN}Testing AUTO mode${RESET}\n`);
  
  for (const test of TEST_QUESTIONS) {
    console.log(`${YELLOW}Question:${RESET} ${test.question}`);
    console.log(`${YELLOW}Language:${RESET} ${test.language}`);
    
    const result = await testProviderOption("auto", test.question, test.language);
    
    if (result.success) {
      console.log(`${GREEN}✓ PASS${RESET}`);
      console.log(`  Provider: ${result.provider}`);
      console.log(`  Model: ${result.model}`);
      console.log(`  RAG Used: ${result.ragUsed}`);
      console.log(`  RAG Results: ${result.ragResults}`);
      console.log(`  Citations: ${result.citationCount}`);
      console.log(`  Duration: ${result.duration}ms`);
      console.log(`  Answer: ${result.answerPreview}...`);
      
      results.push({
        name: `Auto: ${test.question.substring(0, 50)}`,
        passed: true,
        details: {
          provider: result.provider,
          model: result.model,
          duration: result.duration,
          ragUsed: result.ragUsed,
          citationCount: result.citationCount,
        },
      });
    } else {
      console.log(`${RED}✗ FAIL${RESET}`);
      console.log(`  Error: ${result.error}`);
      console.log(`  Duration: ${result.duration}ms`);
      
      results.push({
        name: `Auto: ${test.question.substring(0, 50)}`,
        passed: false,
        details: { duration: result.duration },
        error: result.error,
      });
    }
    
    console.log();
  }

  // Test Direct Groq Mode
  console.log(`\n${CYAN}Testing GROQ mode (direct)${RESET}\n`);
  
  for (const test of TEST_QUESTIONS) {
    console.log(`${YELLOW}Question:${RESET} ${test.question}`);
    console.log(`${YELLOW}Language:${RESET} ${test.language}`);
    
    const result = await testProviderOption("groq", test.question, test.language);
    
    if (result.success) {
      console.log(`${GREEN}✓ PASS${RESET}`);
      console.log(`  Provider: ${result.provider}`);
      console.log(`  Model: ${result.model}`);
      console.log(`  RAG Used: ${result.ragUsed}`);
      console.log(`  RAG Results: ${result.ragResults}`);
      console.log(`  Citations: ${result.citationCount}`);
      console.log(`  Duration: ${result.duration}ms`);
      console.log(`  Answer: ${result.answerPreview}...`);
      
      results.push({
        name: `Groq: ${test.question.substring(0, 50)}`,
        passed: true,
        details: {
          provider: result.provider,
          model: result.model,
          duration: result.duration,
          ragUsed: result.ragUsed,
          citationCount: result.citationCount,
        },
      });
    } else {
      console.log(`${RED}✗ FAIL${RESET}`);
      console.log(`  Error: ${result.error}`);
      console.log(`  Duration: ${result.duration}ms`);
      
      results.push({
        name: `Groq: ${test.question.substring(0, 50)}`,
        passed: false,
        details: { duration: result.duration },
        error: result.error,
      });
    }
    
    console.log();
  }

  // Summary
  console.log(`${CYAN}========================================${RESET}`);
  console.log(`${CYAN}TEST SUMMARY${RESET}`);
  console.log(`${CYAN}========================================${RESET}\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total: ${results.length}`);
  console.log(`${GREEN}Passed: ${passed}${RESET}`);
  console.log(`${RED}Failed: ${failed}${RESET}\n`);

  if (failed > 0) {
    console.log(`${RED}FAILED TESTS:${RESET}`);
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ${RED}✗${RESET} ${r.name}`);
      console.log(`    ${r.error}`);
    });
    process.exit(1);
  }

  console.log(`${GREEN}All tests passed!${RESET}`);
  process.exit(0);
}

runTests().catch(error => {
  console.error(`${RED}Fatal error:${RESET}`, error);
  process.exit(1);
});
