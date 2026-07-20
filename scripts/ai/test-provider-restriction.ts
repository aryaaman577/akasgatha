/**
 * Test Provider Restriction
 * Verifies that only "auto" and "groq" are accepted
 * and that "cerebras" is properly rejected
 */

const CYAN_COLOR = "\x1b[36m";
const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const RESET_COLOR = "\x1b[0m";

interface ProviderTestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const testResults: ProviderTestResult[] = [];

async function testProvider(provider: string, shouldSucceed: boolean) {
  try {
    const response = await fetch("http://localhost:3001/api/jigyasa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "What is a star?",
        language: "en",
        providerPreference: provider,
      }),
    });

    const data = await response.json();

    if (shouldSucceed) {
      // Should succeed
      if (response.status === 200 && data.status === "ok") {
        return { success: true, statusCode: response.status };
      } else {
        return { 
          success: false, 
          statusCode: response.status,
          error: `Expected success but got: ${data.error?.message || "unknown error"}` 
        };
      }
    } else {
      // Should fail with 400
      if (response.status === 400 && data.status === "error") {
        return { 
          success: true, 
          statusCode: response.status,
          errorCode: data.error?.code 
        };
      } else {
        return { 
          success: false, 
          statusCode: response.status,
          error: `Expected 400 INVALID_REQUEST but got ${response.status}` 
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log(`${CYAN_COLOR}PROVIDER RESTRICTION TEST${RESET_COLOR}\n`);

  // Test 1: Auto should be accepted
  console.log(`${CYAN_COLOR}Test 1: "auto" should be accepted${RESET_COLOR}`);
  const autoResult = await testProvider("auto", true);
  if (autoResult.success) {
    console.log(`${GREEN_COLOR}✓ PASS${RESET_COLOR}: auto accepted (status ${autoResult.statusCode})\n`);
    testResults.push({ name: "auto accepted", passed: true });
  } else {
    console.log(`${RED_COLOR}✗ FAIL${RESET_COLOR}: ${autoResult.error}\n`);
    testResults.push({ name: "auto accepted", passed: false, error: autoResult.error });
  }

  // Test 2: Groq should be accepted
  console.log(`${CYAN_COLOR}Test 2: "groq" should be accepted${RESET_COLOR}`);
  const groqResult = await testProvider("groq", true);
  if (groqResult.success) {
    console.log(`${GREEN_COLOR}✓ PASS${RESET_COLOR}: groq accepted (status ${groqResult.statusCode})\n`);
    testResults.push({ name: "groq accepted", passed: true });
  } else {
    console.log(`${RED_COLOR}✗ FAIL${RESET_COLOR}: ${groqResult.error}\n`);
    testResults.push({ name: "groq accepted", passed: false, error: groqResult.error });
  }

  // Test 3: Cerebras should be rejected
  console.log(`${CYAN_COLOR}Test 3: "cerebras" should be rejected${RESET_COLOR}`);
  const cerebrasResult = await testProvider("cerebras", false);
  if (cerebrasResult.success) {
    console.log(`${GREEN_COLOR}✓ PASS${RESET_COLOR}: cerebras rejected (status ${cerebrasResult.statusCode}, code ${cerebrasResult.errorCode})\n`);
    testResults.push({ name: "cerebras rejected", passed: true });
  } else {
    console.log(`${RED_COLOR}✗ FAIL${RESET_COLOR}: ${cerebrasResult.error}\n`);
    testResults.push({ name: "cerebras rejected", passed: false, error: cerebrasResult.error });
  }

  // Test 4: Invalid provider should be rejected
  console.log(`${CYAN_COLOR}Test 4: invalid provider should be rejected${RESET_COLOR}`);
  const invalidResult = await testProvider("invalid", false);
  if (invalidResult.success) {
    console.log(`${GREEN_COLOR}✓ PASS${RESET_COLOR}: invalid provider rejected (status ${invalidResult.statusCode})\n`);
    testResults.push({ name: "invalid provider rejected", passed: true });
  } else {
    console.log(`${RED_COLOR}✗ FAIL${RESET_COLOR}: ${invalidResult.error}\n`);
    testResults.push({ name: "invalid provider rejected", passed: false, error: invalidResult.error });
  }

  // Summary
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;

  console.log(`${CYAN_COLOR}SUMMARY${RESET_COLOR}: ${GREEN_COLOR}${passed} passed${RESET_COLOR}, ${RED_COLOR}${failed} failed${RESET_COLOR}\n`);

  if (failed > 0) {
    console.log(`${RED_COLOR}FAILED TESTS:${RESET_COLOR}`);
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`  ${RED_COLOR}✗${RESET_COLOR} ${r.name}: ${r.error}`);
    });
    process.exit(1);
  }

  console.log(`${GREEN_COLOR}All tests passed!${RESET_COLOR}`);
  process.exit(0);
}

async function runMain() {
  await main();
}

runMain();
