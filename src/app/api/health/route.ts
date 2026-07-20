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

    // Determine available providers (Phase 5 UX)
    const availableProviders: ("groq" | "cerebras")[] = [];
    
    // Check Groq
    if (env.GROQ_API_KEY && env.GROQ_MODEL) {
      availableProviders.push("groq");
    }
    
    // Check Cerebras (when implemented)
    // Note: Cerebras will be added when its provider is implemented
    // For now, it's not included in available providers
    
    const fallbackEnabled = env.AI_FALLBACK_PROVIDER !== "none";

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
      },
      capabilities: {
        providers: availableProviders,
        fallbackEnabled,
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
