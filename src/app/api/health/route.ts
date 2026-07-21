/**
 * Health Check API Route
 * 
 * Returns application health and provider status.
 * Does not expose secrets or environment values.
 */

import { NextResponse } from "next/server";
import { getProvider, isProviderMock } from "@/lib/server/ai/provider-registry";
import type { HealthResponse } from "@/lib/server/jigyasa/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const provider = getProvider();
    const { getServerEnv } = await import("@/lib/server/env");
    const { getProviderWithFallback } = await import("@/lib/server/ai/provider-registry");
    const env = getServerEnv();
    
    let providerHealth = {
      configured: true,
      available: true,
      mock: isProviderMock(),
    };

    // Check provider health if available
    if (provider.healthCheck) {
      try {
        providerHealth = await provider.healthCheck();
      } catch {
        providerHealth = {
          configured: true,
          available: false,
          mock: isProviderMock(),
        };
      }
    }

    // Get router info for fallback status
    const router = getProviderWithFallback();
    const routerInfo = router.getProviderInfo();

    // Determine primary and fallback models
    let primaryModel = null;
    let fallbackModel = null;
    
    if (env.AI_PROVIDER === "groq") {
      primaryModel = env.GROQ_PRIMARY_MODEL || env.GROQ_MODEL || null;
      fallbackModel = env.GROQ_SECONDARY_MODEL || null;
    } else if (env.AI_PROVIDER === "cerebras") {
      primaryModel = env.CEREBRAS_MODEL || null;
      fallbackModel = null; // Cerebras disabled
    }

    // Determine available providers (Phase 5)
    const availableProviders: ("groq" | "cerebras" | "gemini")[] = [];
    
    // Check Groq
    if (env.GROQ_API_KEY && (env.GROQ_PRIMARY_MODEL || env.GROQ_MODEL)) {
      availableProviders.push("groq");
    }
    
    // Cerebras disabled due to billing requirement
    // Keep code for future re-enablement
    // if (env.CEREBRAS_API_KEY && env.CEREBRAS_MODEL) {
    //   availableProviders.push("cerebras");
    // }

    // Check Gemini (only allow official stable models)
    const officialGeminiModels = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite"
    ];
    const isGeminiModelValid = env.GEMINI_MODEL && officialGeminiModels.includes(env.GEMINI_MODEL);
    
    if (env.GEMINI_API_KEY && isGeminiModelValid) {
      availableProviders.push("gemini");
    }
    
    const fallbackEnabled = !!(env.GROQ_SECONDARY_MODEL || (env.AI_FALLBACK_PROVIDER && env.AI_FALLBACK_PROVIDER !== "none"));

    // Check RAG status (Phase 4B)
    let ragStatus: HealthResponse["rag"] = undefined;
    try {
      const { loadManifest } = await import("@/lib/server/rag/local-index");
      const manifest = await loadManifest();
      
      if (manifest) {
        ragStatus = {
          available: true as const,
          documentCount: manifest.documentCount,
          chunkCount: manifest.chunkCount,
          schemaVersion: manifest.schemaVersion,
          provider: manifest.provider,
          model: manifest.model,
        };
      } else {
        ragStatus = {
          available: false as const,
          message: "Index not built. Run: npm run rag:ingest",
        };
      }
    } catch {
      ragStatus = {
        available: false as const,
        message: "RAG system not initialized",
      };
    }

    const response: HealthResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      provider: {
        name: provider.name,
        configured: providerHealth.configured,
        mock: providerHealth.mock,
        primary: routerInfo.primary,
        primaryModel: primaryModel,
        primaryConfigured: routerInfo.primaryConfigured,
        fallback: routerInfo.fallback || (fallbackModel ? "groq-secondary" : null),
        fallbackModel: fallbackModel,
        fallbackConfigured: routerInfo.fallbackConfigured || !!fallbackModel,
      },
      capabilities: {
        providers: availableProviders,
        fallbackEnabled,
        models: {
          groq: env.GROQ_PRIMARY_MODEL || env.GROQ_MODEL || null,
          gemini: isGeminiModelValid ? env.GEMINI_MODEL : null
        }
      },
      rag: ragStatus,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    // Log error but don't expose internal details
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
      },
      { status: 503 }
    );
  }
}
