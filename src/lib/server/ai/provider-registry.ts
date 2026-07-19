/**
 * AI Provider Registry
 * 
 * Selects and instantiates the appropriate provider based on configuration.
 */

import type { JigyasaProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { GeminiProvider } from "./gemini-provider";
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

    case "openrouter":
      // Phase 5+: Implement OpenRouter provider
      throw new Error(
        "OpenRouter provider not yet implemented. Use AI_PROVIDER=gemini or AI_PROVIDER=mock."
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
