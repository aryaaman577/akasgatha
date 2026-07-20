/**
 * AI Provider Registry
 * 
 * Selects and instantiates the appropriate provider based on configuration.
 * Phase 5: Supports Cerebras and provider fallback routing.
 */

import type { JigyasaProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { GeminiProvider } from "./gemini-provider";
import { GroqProvider } from "./groq-provider";
import { CerebrasProvider } from "./cerebras-provider";
import { getProviderRouter } from "./jigyasa-provider-router";
import { getServerEnv, validateProviderConfig } from "../env";

let providerInstance: JigyasaProvider | null = null;

export function getProvider(): JigyasaProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const env = getServerEnv();
  validateProviderConfig(env);

  switch (env.AI_PROVIDER) {
    case "mock":
      providerInstance = new MockProvider();
      break;

    case "gemini":
      providerInstance = new GeminiProvider();
      break;

    case "groq":
      providerInstance = new GroqProvider();
      break;

    case "cerebras":
      providerInstance = new CerebrasProvider();
      break;

    case "openrouter":
      // Phase 5+: Implement OpenRouter provider
      throw new Error(
        "OpenRouter provider not yet implemented. Use AI_PROVIDER=groq, AI_PROVIDER=cerebras, AI_PROVIDER=gemini or AI_PROVIDER=mock."
      );

    default:
      throw new Error(`Unknown provider: ${env.AI_PROVIDER}`);
  }

  return providerInstance;
}

export function getProviderName(): string {
  return getProvider().name;
}

export function isProviderMock(): boolean {
  return getProvider().name === "mock";
}

/**
 * Get provider router for fallback support
 * Use this instead of getProvider() when fallback is desired
 */
export function getProviderWithFallback() {
  return getProviderRouter();
}
