/**
 * Health Check API Route
 * 
 * Returns application health and provider status.
 * Does not expose secrets or environment values.
 */

import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/server/env";
import { getProvider, isProviderMock } from "@/lib/server/ai/provider-registry";
import type { HealthResponse } from "@/lib/server/jigyasa/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const env = getServerEnv();
    const provider = getProvider();
    
    let providerHealth = {
      configured: true,
      available: true,
      mock: isProviderMock(),
    };

    // Check provider health if available
    if (provider.healthCheck) {
      try {
        providerHealth = await provider.healthCheck();
      } catch (error) {
        providerHealth = {
          configured: true,
          available: false,
          mock: isProviderMock(),
        };
      }
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
