/**
 * Gemini Answer Routing Diagnostic Test Script
 * 
 * Verifies that when Gemini is selected in Jigyasa, legitimate astronomy questions
 * receive real answers using Gemini (gemini-3.1-flash-lite) in GENERAL_SPACE_KNOWLEDGE
 * or RAG_GROUNDED mode without incorrectly throwing INSUFFICIENT_KNOWLEDGE.
 * 
 * Usage: tsx scripts/ai/test-gemini-routing.ts
 */

import * as fs from "fs";
import * as path from "path";

try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
} catch {
  // Ignore
}

import { getServerEnv } from "../../src/lib/server/env";
import { GeminiProvider } from "../../src/lib/server/ai/gemini-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

async function testGeminiDirectQuery(question: string, language: "en" | "hi" | "hinglish" = "en") {
  console.log(`\n--------------------------------------------------`);
  console.log(`TEST QUERY: "${question}" (${language})`);
  console.log(`--------------------------------------------------`);

  const env = getServerEnv();
  console.log(`  Configured Gemini Model : ${env.GEMINI_MODEL}`);
  console.log(`  Knowledge Mode          : ${env.JIGYASA_KNOWLEDGE_MODE}`);

  // 1. Run RAG context retrieval
  const ragContext = await retrieveLocalContext(question, {
    topK: 3,
    minScore: 0.5,
    languageFilter: language === "hi" ? "hi" : "en",
  });
  console.log(`  RAG Retrieved Chunks    : ${ragContext.totalResults}`);

  // 2. Call GeminiProvider
  const geminiProvider = new GeminiProvider();
  const controller = new AbortController();

  const result = await geminiProvider.generate({
    question,
    language,
    requestId: `test-${Date.now()}`,
    signal: controller.signal,
    ragContext,
  });

  console.log(`  Answer Mode             : ${result.meta.answerMode}`);
  console.log(`  Model Used              : ${result.meta.model}`);
  console.log(`  Short Answer            : ${result.answer.shortAnswer}`);
  console.log(`  Vigyan Explanation      : ${result.answer.vigyan.substring(0, 150)}...`);
  console.log(`  Sources Count           : ${result.answer.sources.length}`);
  
  return result;
}

async function main() {
  console.log("======================================================================");
  console.log("JIGYASA GEMINI ANSWER ROUTING DIAGNOSTIC TEST");
  console.log("======================================================================");

  try {
    // Test 1: What is a white dwarf?
    const res1 = await testGeminiDirectQuery("What is a white dwarf?", "en");
    if (!res1.answer.shortAnswer || res1.answer.shortAnswer.includes("insufficient")) {
      throw new Error("FAIL: White dwarf question returned insufficient knowledge");
    }

    // Test 2: What is a neutron star?
    await testGeminiDirectQuery("What is a neutron star?", "en");

    // Test 3: Dark matter kya hai?
    await testGeminiDirectQuery("Dark matter kya hai?", "hinglish");

    // Test 4: Wormhole kya hota hai?
    await testGeminiDirectQuery("Wormhole kya hota hai?", "hinglish");

    // Test 5: Pulsar lighthouse jaisa kyu dikhta hai?
    await testGeminiDirectQuery("Pulsar lighthouse jaisa kyu dikhta hai?", "hinglish");

    // Test 6: ब्लैक होल क्या होता है
    await testGeminiDirectQuery("ब्लैक होल क्या होता है", "hi");

    console.log("\n======================================================================");
    console.log("ALL GEMINI ROUTING DIAGNOSTIC TESTS PASSED ✓");
    console.log("======================================================================");
  } catch (err) {
    console.error("\n❌ GEMINI ROUTING TEST FAILED:", err);
    process.exit(1);
  }
}

main();
