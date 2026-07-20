/**
 * Cloudflare Workers AI Preflight Test
 * 
 * Tests real Cloudflare Workers AI access.
 * Determines if the account has usable no-charge allocation.
 * 
 * Usage: npm run ai:preflight-cloudflare
 */

import { loadEnvConfig } from "@next/env";

// Load environment files (.env.local, .env, etc.)
loadEnvConfig(process.cwd());

const CANDIDATE_MODEL = "@cf/openai/gpt-oss-120b";

async function preflightCloudflare() {
  console.log("=".repeat(80));
  console.log("CLOUDFLARE WORKERS AI PREFLIGHT");
  console.log("=".repeat(80));
  console.log();

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || accountId.trim() === "") {
    console.log("⏭️  SKIPPED: CLOUDFLARE_ACCOUNT_ID not configured");
    console.log();
    console.log("Cloudflare Workers AI is optional.");
    console.log("To enable:");
    console.log("1. Get account ID from Cloudflare dashboard");
    console.log("2. Create API token with Workers AI permissions");
    console.log("3. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env.local");
    console.log("4. Run: npm run ai:preflight-cloudflare");
    console.log();
    process.exit(0);
  }

  if (!apiToken || apiToken.trim() === "") {
    console.log("❌ CLOUDFLARE_API_TOKEN not configured");
    console.log();
    process.exit(1);
  }

  console.log("✅ Cloudflare credentials configured");
  console.log(`   Account ID: ${accountId.substring(0, 8)}...`);
  console.log();

  console.log("-".repeat(80));
  console.log(`Testing model: ${CANDIDATE_MODEL}`);
  console.log();

  try {
    // Construct API endpoint
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CANDIDATE_MODEL}`;

    // Minimal test request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Reply with exactly: OK"
          }
        ],
        temperature: 0,
        max_tokens: 10,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      let category = "UNKNOWN";
      let reason = `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 401) {
        category = "AUTHENTICATION";
        reason = "Invalid or unauthorized API token";
      } else if (response.status === 402) {
        category = "BILLING_REQUIRED";
        reason = "Billing or payment required";
      } else if (response.status === 403) {
        category = "PERMISSION_DENIED";
        reason = "Permission denied or quota exceeded";
      } else if (response.status === 404) {
        category = "MODEL_NOT_FOUND";
        reason = "Model not found or unavailable";
      } else if (response.status === 429) {
        category = "RATE_LIMIT";
        reason = "Rate limit exceeded";
      } else if (response.status === 503) {
        category = "PROVIDER_UNAVAILABLE";
        reason = "Service temporarily unavailable";
      }

      // Check for error details in response
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        reason = data.errors[0].message || reason;
      }

      console.log(`❌ Model not accessible`);
      console.log(`   Category: ${category}`);
      console.log(`   Reason: ${reason}`);
      console.log();

      console.log("=".repeat(80));
      console.log("PREFLIGHT SUMMARY");
      console.log("=".repeat(80));
      console.log();
      console.log(`❌ Cloudflare Workers AI is not currently accessible`);
      console.log(`   ${category}: ${reason}`);
      console.log();
      process.exit(1);
    }

    // Success
    const reply = data.result?.response || data.result?.content || JSON.stringify(data.result);

    console.log(`✅ Model accessible`);
    console.log(`   Response: ${reply.substring(0, 100)}`);
    console.log();

    console.log("=".repeat(80));
    console.log("PREFLIGHT SUMMARY");
    console.log("=".repeat(80));
    console.log();
    console.log("✅ Cloudflare Workers AI is accessible");
    console.log();
    console.log("Recommendation:");
    console.log(`  Use CLOUDFLARE_MODEL=${CANDIDATE_MODEL}`);
    console.log(`  Enable as fallback: AI_FALLBACK_PROVIDER=cloudflare`);
    console.log();
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    const message = err.message.toLowerCase();

    let category = "UNKNOWN";
    let reason = err.message;

    if (message.includes("timeout")) {
      category = "TIMEOUT";
      reason = "Request timeout";
    } else if (message.includes("network") || message.includes("fetch")) {
      category = "CONNECTION";
      reason = "Network connection error";
    }

    console.log(`❌ Model not accessible`);
    console.log(`   Category: ${category}`);
    console.log(`   Reason: ${reason}`);
    console.log();

    console.log("=".repeat(80));
    console.log("PREFLIGHT SUMMARY");
    console.log("=".repeat(80));
    console.log();
    console.log(`❌ Cloudflare Workers AI is not currently accessible`);
    console.log(`   ${category}: ${reason}`);
    console.log();
    process.exit(1);
  }
}

preflightCloudflare().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
