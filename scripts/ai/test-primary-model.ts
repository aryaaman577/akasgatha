/**
 * Test Primary Model (openai/gpt-oss-120b) Directly
 * Gate 2 - Routing Validation
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { GroqProvider } from "../../src/lib/server/ai/groq-provider";
import { retrieveLocalContext } from "../../src/lib/server/rag/local-retrieval";

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

async function testPrimaryModel() {
  console.log(`${CYAN}Testing Primary Model (openai/gpt-oss-120b)${RESET}\n`);
  
  try {
    // Create provider with primary model override
    const provider = new GroqProvider("openai/gpt-oss-120b");
    console.log(`Model: ${provider.getModel()}`);
    
    // Test 1: Corpus question with RAG
    console.log(`\n${CYAN}Test 1: Grahan kyon hota hai (with RAG)${RESET}`);
    const ragResult1 = await retrieveLocalContext("Grahan kyon hota hai", {
      topK: 5,
      minScore: 0.3,
    });
    console.log(`RAG Results: ${ragResult1.totalResults}`);
    
    const abortController1 = new AbortController();
    const response1 = await provider.generate({
      question: "Grahan kyon hota hai?",
      language: "hinglish",
      ragContext: ragResult1,
      history: [],
      requestId: "test-primary-1",
      signal: abortController1.signal,
    });
    
    console.log(`${GREEN}✓ Success${RESET}`);
    console.log(`Answer: ${response1.answer.shortAnswer.substring(0, 100)}...`);
    console.log(`Citations: ${response1.answer.sources.length}`);
    console.log(`Model: ${response1.meta.model}`);
    console.log(`Answer Mode: ${response1.meta.answerMode}`);
    
    // Test 2: General knowledge question
    console.log(`\n${CYAN}Test 2: What is a neutron star (general knowledge)${RESET}`);
    const ragResult2 = await retrieveLocalContext("What is a neutron star", {
      topK: 5,
      minScore: 0.3,
    });
    console.log(`RAG Results: ${ragResult2.totalResults}`);
    
    const abortController2 = new AbortController();
    const response2 = await provider.generate({
      question: "What is a neutron star?",
      language: "en",
      ragContext: ragResult2,
      history: [],
      requestId: "test-primary-2",
      signal: abortController2.signal,
    });
    
    console.log(`${GREEN}✓ Success${RESET}`);
    console.log(`Answer: ${response2.answer.shortAnswer.substring(0, 100)}...`);
    console.log(`Citations: ${response2.answer.sources.length}`);
    console.log(`Model: ${response2.meta.model}`);
    console.log(`Answer Mode: ${response2.meta.answerMode}`);
    
    console.log(`\n${GREEN}Primary model test passed${RESET}`);
    process.exit(0);
    
  } catch (error) {
    console.error(`${RED}✗ Error:${RESET}`, error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testPrimaryModel();
