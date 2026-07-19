/**
 * AI Provider Registry
 * 
 * Selects and instantiates the appropriate provider based on configuration.
 */

import type { JigyasaProvider } from "./types";
import { MockProvider } from "./mock-provider";
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
      // Phase 4B: Implement Gemini provider
      throw new Error(
        "Gemini provider not yet implemented. Available in Phase 4B. Use AI_PROVIDER=mock for development."
      );

    case "openrouter":
      // Phase 4B: Implement OpenRouter provider
      throw new Error(
        "OpenRouter provider not yet implemented. Available in Phase 4B. Use AI_PROVIDER=mock for development."
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
