/**
 * Quick Groq Integration Test (Core Questions Only)
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { getServerEnv } from "../../src/lib/server/env";
import { GroqProvider } from "../../src/lib/server/ai/groq-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

const TEST_QUESTIONS = [
  {
    question: "Grahan kyon hota hai?",
    language: "hinglish" as const,
    description: "Science question about eclipses",
  },
  {
    question: "Rahu Ketu aur eclipse ka relation kya hai?",
    language: "hinglish" as const,
    description: "Mixed Katha/Vigyan question",
  },
];

async function testGroq() {
  const env = getServerEnv();
  if (!env.GROQ_API_KEY) {
    console.log("SKIPPED: No GROQ_API_KEY");
    return;
  }

  console.log(`Model: ${env.GROQ_MODEL}\n`);

  const provider = new GroqProvider();
  const health = await provider.healthCheck();
  console.log(`Health: ${health.available}\n`);

  for (let i = 0; i < TEST_QUESTIONS.length; i++) {
    const test = TEST_QUESTIONS[i];
    console.log(`Test ${i + 1}: ${test.description}`);
    console.log(`Q: "${test.question}"`);

    const abortController = new AbortController();

    try {
      const ragContext = await retrieveLocalContext(test.question, { topK: 5, minScore: 0.5 });
      console.log(`RAG: ${ragContext.totalResults} results`);

      const result = await provider.generate({
        question: test.question,
        language: test.language,
        history: [],
        requestId: `test-${Date.now()}`,
        signal: abortController.signal,
        ragContext: ragContext.totalResults > 0 ? ragContext : undefined,
      });

      console.log(`Mode: ${result.meta.answerMode || "UNKNOWN"}`);
      console.log(`Citations: ${result.answer.sources.length}`);
      console.log(`✓ PASS\n`);
    } catch (error) {
      console.log(`✗ FAIL: ${error instanceof Error ? error.message.substring(0, 100) : String(error)}\n`);
    } finally {
      abortController.abort();
    }
  }
}

testGroq().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
