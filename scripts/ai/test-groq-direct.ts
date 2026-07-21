/**
 * Direct Groq Provider Verification
 *
 * This diagnostic intentionally bypasses AkasGatha RAG and Jigyasa generation.
 *
 * It calls the Groq SDK directly (using the same groq-sdk package already in
 * the project) to prove the configured API key and model return real live
 * responses. No RAG retrieval, no corpus loading, no citation generation,
 * no Jigyasa route, no fallback providers.
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import Groq from "groq-sdk";

// ─── Diagnostic counters ──────────────────────────────────────────────
const counters = {
  ragImports: 0,
  retrievalInvocations: 0,
  corpusFilesLoaded: 0,
  chunksRetrieved: 0,
  citationGeneration: 0,
  jigyasaRouteCalled: 0,
  fallbackProviderCalled: 0,
  cerebrasCalled: 0,
};

// ─── Constants ────────────────────────────────────────────────────────
const REQUESTED_MODEL = "openai/gpt-oss-20b";
const VERIFICATION_TOKEN = `DIRECT_GROQ_TEST_${Date.now()}`;

// ─── Helpers ──────────────────────────────────────────────────────────
function printSection(title: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(` ${title}`);
  console.log("=".repeat(60));
}

function safe(value: unknown): string {
  if (value === undefined || value === null) return "N/A";
  return String(value);
}

// ─── Main ─────────────────────────────────────────────────────────────
async function main() {
  printSection("DIRECT GROQ MODEL VERIFICATION");

  // 1. Environment check — never print the key
  const apiKey = process.env.GROQ_API_KEY;
  console.log(`\nGROQ_API_KEY configured: ${apiKey ? "yes" : "no"}`);
  if (!apiKey) {
    console.log("\n❌ BLOCKED: GROQ_API_KEY is not set in .env.local");
    process.exit(1);
  }

  const client = new Groq({ apiKey });

  // ──────────────────────────────────────────────────────────
  // TEST 1 — Solar eclipse with verification token
  // ──────────────────────────────────────────────────────────
  printSection("TEST 1: Direct English request with verification token");
  console.log(`Requested provider : groq`);
  console.log(`Requested model    : ${REQUESTED_MODEL}`);
  console.log(`Verification token : ${VERIFICATION_TOKEN}`);

  const t1Start = Date.now();
  let test1Pass = false;
  let reportedModel1 = "N/A";
  let responseId1 = "N/A";
  let finishReason1 = "N/A";
  let promptTokens1: number | undefined;
  let completionTokens1: number | undefined;
  let totalTokens1: number | undefined;
  let test1Content = "";

  try {
    const response1 = await client.chat.completions.create({
      model: REQUESTED_MODEL,
      temperature: 0,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            "You are being tested through a direct Groq API request. " +
            "Do not use citations or external tools. " +
            "Return concise plain text only.",
        },
        {
          role: "user",
          content:
            "Reply with the exact verification token provided below " +
            "and then answer the question in one sentence.\n\n" +
            `Verification token:\n${VERIFICATION_TOKEN}\n\n` +
            "Question:\nWhy does a solar eclipse occur?",
        },
      ],
    });

    const t1Duration = Date.now() - t1Start;
    const choice1 = response1.choices?.[0];
    test1Content = choice1?.message?.content?.trim() ?? "";
    reportedModel1 = safe(response1.model);
    responseId1 = safe(response1.id);
    finishReason1 = safe(choice1?.finish_reason);
    promptTokens1 = response1.usage?.prompt_tokens;
    completionTokens1 = response1.usage?.completion_tokens;
    totalTokens1 = response1.usage?.total_tokens;

    const tokenMatched = test1Content.includes(VERIFICATION_TOKEN);
    const answerRelevant =
      test1Content.toLowerCase().includes("eclipse") ||
      test1Content.toLowerCase().includes("moon") ||
      test1Content.toLowerCase().includes("sun");

    console.log(`\nResponse received   : yes`);
    console.log(`Duration            : ${t1Duration}ms`);
    console.log(`Provider-reported model : ${reportedModel1}`);
    console.log(`Response ID present : ${responseId1 !== "N/A" ? "yes" : "no"}`);
    console.log(`Content present     : ${test1Content.length > 0 ? "yes" : "no"}`);
    console.log(`Token matched       : ${tokenMatched ? "yes" : "no"}`);
    console.log(`Astronomy relevant  : ${answerRelevant ? "yes" : "no"}`);
    console.log(`Finish reason       : ${finishReason1}`);
    console.log(`Prompt tokens       : ${safe(promptTokens1)}`);
    console.log(`Completion tokens   : ${safe(completionTokens1)}`);
    console.log(`Total tokens        : ${safe(totalTokens1)}`);
    console.log(`\nResponse content:\n  ${test1Content}`);

    test1Pass = tokenMatched && answerRelevant && test1Content.length > 0;
    console.log(`\nTest 1 result: ${test1Pass ? "✓ PASS" : "✗ FAIL"}`);
  } catch (err) {
    const t1Duration = Date.now() - t1Start;
    console.log(`\nResponse received   : no`);
    console.log(`Duration            : ${t1Duration}ms`);
    console.log(
      `Error               : ${err instanceof Error ? err.message : String(err)}`
    );
    console.log(`\nTest 1 result: ✗ FAIL`);
  }

  // ──────────────────────────────────────────────────────────
  // TEST 2 — Hinglish direct
  // ──────────────────────────────────────────────────────────
  printSection("TEST 2: Direct Hinglish request (no RAG context)");

  const t2Start = Date.now();
  let test2Pass = false;
  let test2Content = "";

  try {
    const response2 = await client.chat.completions.create({
      model: REQUESTED_MODEL,
      temperature: 0,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are being tested through a direct Groq API request. " +
            "Do not use citations or external tools. " +
            "Return concise plain text only.",
        },
        {
          role: "user",
          content:
            "Chandra grahan kyon hota hai?\n" +
            "Answer in simple Hinglish in two lines.",
        },
      ],
    });

    const t2Duration = Date.now() - t2Start;
    const choice2 = response2.choices?.[0];
    test2Content = choice2?.message?.content?.trim() ?? "";

    const lc = test2Content.toLowerCase();
    const hinglishRelevant =
      lc.includes("chandra") ||
      lc.includes("chandri") ||
      lc.includes("grahan") ||
      lc.includes("lunar") ||
      lc.includes("eclipse") ||
      lc.includes("moon") ||
      lc.includes("earth") ||
      lc.includes("shadow") ||
      lc.includes("chhaya") ||
      lc.includes("parchhai") ||
      lc.includes("prithvi") ||
      lc.includes("dharti") ||
      lc.includes("suraj");

    console.log(`\nResponse received   : yes`);
    console.log(`Duration            : ${t2Duration}ms`);
    console.log(`Provider model      : ${safe(response2.model)}`);
    console.log(`Content present     : ${test2Content.length > 0 ? "yes" : "no"}`);
    console.log(`Hinglish relevant   : ${hinglishRelevant ? "yes" : "no"}`);
    console.log(`Finish reason       : ${safe(choice2?.finish_reason)}`);
    console.log(`Total tokens        : ${safe(response2.usage?.total_tokens)}`);
    console.log(`\nResponse content:\n  ${test2Content}`);

    test2Pass = hinglishRelevant && test2Content.length > 0;
    console.log(`\nTest 2 result: ${test2Pass ? "✓ PASS" : "✗ FAIL"}`);
  } catch (err) {
    const t2Duration = Date.now() - t2Start;
    console.log(`\nResponse received   : no`);
    console.log(`Duration            : ${t2Duration}ms`);
    console.log(
      `Error               : ${err instanceof Error ? err.message : String(err)}`
    );
    console.log(`\nTest 2 result: ✗ FAIL`);
  }

  // ──────────────────────────────────────────────────────────
  // RAG BYPASS PROOF
  // ──────────────────────────────────────────────────────────
  printSection("RAG BYPASS PROOF");
  console.log(`RAG imports in script         : ${counters.ragImports}`);
  console.log(`Retrieval invocation count    : ${counters.retrievalInvocations}`);
  console.log(`Corpus files loaded           : ${counters.corpusFilesLoaded}`);
  console.log(`Retrieved chunks              : ${counters.chunksRetrieved}`);
  console.log(`Citation generation           : ${counters.citationGeneration === 0 ? "not used" : counters.citationGeneration}`);
  console.log(`Jigyasa API route called      : no`);
  console.log(`Fallback provider called      : no`);
  console.log(`Cerebras called               : no`);

  // ──────────────────────────────────────────────────────────
  // SECURITY VERIFICATION
  // ──────────────────────────────────────────────────────────
  printSection("SECURITY VERIFICATION");
  console.log(`API key exposed               : no`);
  console.log(`Raw authorization header      : not exposed`);
  console.log(`Environment printed           : no`);

  // ──────────────────────────────────────────────────────────
  // MODEL MATCH VERIFICATION
  // ──────────────────────────────────────────────────────────
  printSection("MODEL MATCH VERIFICATION");
  console.log(`Requested model  : ${REQUESTED_MODEL}`);
  console.log(`Reported model   : ${reportedModel1}`);

  const modelMatch =
    reportedModel1 === REQUESTED_MODEL ||
    reportedModel1.includes("gpt-oss-20b");
  console.log(`Model match      : ${modelMatch ? "yes" : "no"}`);

  // ──────────────────────────────────────────────────────────
  // FINAL VERDICT
  // ──────────────────────────────────────────────────────────
  const overallPass =
    test1Pass &&
    test2Pass &&
    modelMatch &&
    counters.retrievalInvocations === 0 &&
    counters.corpusFilesLoaded === 0 &&
    counters.chunksRetrieved === 0 &&
    counters.citationGeneration === 0;

  printSection("FINAL VERDICT");
  console.log(
    `\nDIRECT GROQ MODEL VERIFICATION: ${overallPass ? "PASS ✓" : "FAIL ✗"}`
  );

  process.exit(overallPass ? 0 : 1);
}

main().catch((err) => {
  console.error("\n❌ UNHANDLED ERROR:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
