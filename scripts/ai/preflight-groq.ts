/**
 * Groq Provider Preflight Test
 * 
 * Tests real Groq API access with candidate models.
 * Determines which models are actually available on the user account.
 * 
 * Usage: npm run ai:preflight-groq
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

import Groq from "groq-sdk";

const CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

async function preflightGroq() {
  console.log("=".repeat(80));
  console.log("GROQ PROVIDER PREFLIGHT");
  console.log("=".repeat(80));
  console.log();

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.log("❌ GROQ_API_KEY not configured");
    console.log();
    console.log("To use Groq:");
    console.log("1. Get API key from: https://console.groq.com/keys");
    console.log("2. Add GROQ_API_KEY to .env.local");
    console.log("3. Run: npm run ai:preflight-groq");
    console.log();
    process.exit(1);
  }

  console.log("✅ GROQ_API_KEY is configured");
  console.log();

  // Create client
  const client = new Groq({ apiKey });

  // Test each candidate model
  const results: Array<{
    model: string;
    available: boolean;
    reason: string;
    category?: string;
  }> = [];

  for (const model of CANDIDATE_MODELS) {
    console.log("-".repeat(80));
    console.log(`Testing model: ${model}`);
    console.log();

    try {
      // Minimal test request
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: "Reply with exactly: OK"
          }
        ],
        temperature: 0,
        max_tokens: 10,
      });

      const reply = response.choices[0]?.message?.content?.trim() || "";

      console.log(`✅ Model accessible`);
      console.log(`   Response: ${reply}`);
      console.log(`   Tokens: ${response.usage?.total_tokens || "N/A"}`);
      console.log();

      results.push({
        model,
        available: true,
        reason: "Success",
      });
    } catch (error) {
      const err = error as Error;
      const message = err.message.toLowerCase();

      let category = "UNKNOWN";
      let reason = err.message;

      if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid") && message.includes("key")) {
        category = "AUTHENTICATION";
        reason = "Invalid or unauthorized API key";
      } else if (message.includes("402") || message.includes("payment") || message.includes("billing")) {
        category = "BILLING_REQUIRED";
        reason = "Billing or payment required";
      } else if (message.includes("403") || message.includes("forbidden")) {
        category = "PERMISSION_DENIED";
        reason = "Permission denied for this model";
      } else if (message.includes("404") || message.includes("not found")) {
        category = "MODEL_NOT_FOUND";
        reason = "Model not found or unavailable";
      } else if (message.includes("429") || message.includes("rate limit")) {
        category = "RATE_LIMIT";
        reason = "Rate limit exceeded";
      } else if (message.includes("timeout")) {
        category = "TIMEOUT";
        reason = "Request timeout";
      } else if (message.includes("503") || message.includes("unavailable")) {
        category = "PROVIDER_UNAVAILABLE";
        reason = "Provider temporarily unavailable";
      }

      console.log(`❌ Model not accessible`);
      console.log(`   Category: ${category}`);
      console.log(`   Reason: ${reason}`);
      console.log();

      results.push({
        model,
        available: false,
        reason,
        category,
      });
    }
  }

  // Summary
  console.log("=".repeat(80));
  console.log("PREFLIGHT SUMMARY");
  console.log("=".repeat(80));
  console.log();

  const available = results.filter(r => r.available);
  const unavailable = results.filter(r => !r.available);

  console.log("Available models:");
  if (available.length === 0) {
    console.log("  None");
  } else {
    available.forEach(r => {
      console.log(`  ✅ ${r.model}`);
    });
  }
  console.log();

  if (unavailable.length > 0) {
    console.log("Unavailable models:");
    unavailable.forEach(r => {
      console.log(`  ❌ ${r.model} (${r.category})`);
      console.log(`     ${r.reason}`);
    });
    console.log();
  }

  // Recommendation
  if (available.length > 0) {
    const recommended = available[0].model;
    console.log("Recommendation:");
    console.log(`  Use GROQ_PRIMARY_MODEL=${recommended}`);
    if (available.length > 1) {
      console.log(`  Use GROQ_SECONDARY_MODEL=${available[1].model}`);
    }
    console.log();
    process.exit(0);
  } else {
    console.log("❌ No Groq models are currently accessible");
    console.log();
    process.exit(1);
  }
}

preflightGroq().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
