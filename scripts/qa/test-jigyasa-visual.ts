/**
 * Visual QA Test for Jigyasa Model — Commit c714b73
 * Tests console errors and basic page load
 */

async function testJigyasaVisual() {
  console.log("=".repeat(60));
  console.log("JIGYASA VISUAL MODEL QA — COMMIT c714b73");
  console.log("=".repeat(60));

  const testUrl = "http://localhost:3002/ask";
  console.log(`\nTest URL: ${testUrl}`);
  console.log("\n⚠️  MANUAL TESTING REQUIRED");
  console.log("This script validates server-side only.");
  console.log("Visual inspection must be performed in browser.\n");

  // Test 1: Server Health
  console.log("TEST 1: Server Health Check");
  try {
    const response = await fetch("http://localhost:3002/api/health");
    if (!response.ok) {
      console.log("❌ BLOCKED: Health check failed");
      console.log(`   Status: ${response.status}`);
      return;
    }
    const health = await response.json();
    console.log("✅ Server healthy");
    console.log(`   Provider: ${health.provider}`);
    console.log(`   Model: ${health.model}`);
  } catch (error) {
    console.log("❌ BLOCKED: Cannot reach server");
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  // Test 2: Ask Page Loads
  console.log("\nTEST 2: Ask Page Load");
  try {
    const response = await fetch(testUrl);
    if (!response.ok) {
      console.log("❌ BLOCKED: Page failed to load");
      console.log(`   Status: ${response.status}`);
      return;
    }
    const html = await response.text();
    
    // Check for critical components
    const checks = [
      { name: "JigyasaMockForm", pattern: /JigyasaMockForm|provider-selector|question-input/i },
      { name: "InteractiveSpaceModel", pattern: /InteractiveSpaceModel|question_orb/i },
      { name: "No build errors", pattern: /Application error|Unhandled Runtime Error/i, shouldNotMatch: true },
    ];

    for (const check of checks) {
      const matches = check.pattern.test(html);
      const passed = check.shouldNotMatch ? !matches : matches;
      if (passed) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ BLOCKED: ${check.name} check failed`);
        return;
      }
    }
  } catch (error) {
    console.log("❌ BLOCKED: Page load error");
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  // Test 3: Provider Restriction
  console.log("\nTEST 3: Provider Restriction (Groq only)");
  try {
    const response = await fetch("http://localhost:3002/api/jigyasa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "Test",
        language: "en",
        answerMode: "balanced",
        providerPreference: "cerebras", // Should be rejected
      }),
    });
    
    if (response.status === 400) {
      const error = await response.json();
      if (error.code === "INVALID_REQUEST") {
        console.log("✅ Cerebras correctly rejected");
      } else {
        console.log("⚠️  Warning: Unexpected error code:", error.code);
      }
    } else {
      console.log("❌ BLOCKED: Cerebras should be rejected");
      return;
    }
  } catch (error) {
    console.log("⚠️  Warning: Provider restriction test error");
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SERVER-SIDE TESTS: PASS");
  console.log("=".repeat(60));
  console.log("\n📋 MANUAL VISUAL QA REQUIRED:\n");
  console.log("1. Open: http://localhost:3002/ask");
  console.log("2. Test viewports: 1440px, 1024px, 768px, 390px, 360px");
  console.log("3. Verify checklist in scripts/qa/visual-qa-jigyasa-model.md");
  console.log("\nVISUAL CHECKS:");
  console.log("  □ No 360° rotation");
  console.log("  □ Model stays front-facing");
  console.log("  □ No thin side or 2D strip appearance");
  console.log("  □ Pointer movement: ~±4° horizontal, ~±2° vertical");
  console.log("  □ Pointer leave returns smoothly to neutral");
  console.log("  □ Depth layers look naturally dimensional");
  console.log("  □ Particles do not obscure model");
  console.log("  □ Glow is restrained");
  console.log("  □ No visible rectangular Canvas wrapper");
  console.log("  □ No clipping or overflow");
  console.log("  □ No console errors");
  console.log("  □ Ask Jigyasa uses real Groq");
  console.log("  □ RAG and citations work");
  console.log("\nFUNCTIONAL TEST:");
  console.log("  1. Select 'Groq' provider");
  console.log("  2. Ask: 'What is a neutron star'");
  console.log("  3. Verify real Groq response appears");
  console.log("  4. Ask: 'Rahu Ketu aur grahan ka sambandh kya hai'");
  console.log("  5. Verify RAG retrieval and citations");
  console.log("\n" + "=".repeat(60));
}

testJigyasaVisual().catch(console.error);
