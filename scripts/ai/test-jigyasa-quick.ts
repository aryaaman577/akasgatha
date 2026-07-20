/**
 * Quick Jigyasa API Test
 * Tests 2 questions with Auto and Groq modes
 */

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

async function test(provider: "auto" | "groq", question: string, language: "en" | "hinglish") {
  console.log(`\n${CYAN}Testing ${provider.toUpperCase()}:${RESET} ${question}`);
  
  try {
    const response = await fetch("http://localhost:3001/api/jigyasa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        language,
        providerPreference: provider,
        responseStyle: "quick",
      }),
    });

    const data = await response.json();

    if (data.status === "ok") {
      console.log(`${GREEN}✓ SUCCESS${RESET}`);
      console.log(`  Provider: ${data.meta.provider}`);
      console.log(`  Model: ${data.meta.model}`);
      console.log(`  RAG: ${data.meta.ragUsed ? data.meta.retrievedChunkCount : 0} results`);
      console.log(`  Citations: ${data.answer.sources.length}`);
      console.log(`  Answer: ${data.answer.shortAnswer.substring(0, 80)}...`);
      return true;
    } else {
      console.log(`${RED}✗ FAILED${RESET}: ${data.error.message}`);
      return false;
    }
  } catch (error) {
    console.log(`${RED}✗ ERROR${RESET}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function main() {
  console.log(`${CYAN}JIGYASA QUICK API TEST${RESET}\n`);

  const results = [];

  // Test Auto mode
  results.push(await test("auto", "What is a neutron star?", "en"));
  results.push(await test("auto", "Grahan kyon hota hai", "hinglish"));

  // Test Groq direct mode  
  results.push(await test("groq", "What is a black hole?", "en"));
  results.push(await test("groq", "Rahu Ketu kaun hain", "hinglish"));

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`\n${CYAN}RESULTS${RESET}: ${GREEN}${passed} passed${RESET}, ${RED}${failed} failed${RESET}`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
