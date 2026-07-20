/**
 * Cerebras AI Client
 * 
 * Singleton lazy client for Cerebras Cloud SDK.
 * Configured server-side only with environment variables.
 */

import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { getServerEnv } from "../env";

let cerebrasClientInstance: Cerebras | null = null;

/**
 * Get singleton Cerebras client
 * Lazy initialization - only created when first requested
 */
export function getCerebrasClient(): Cerebras {
  if (cerebrasClientInstance) {
    return cerebrasClientInstance;
  }

  const env = getServerEnv();

  if (!env.CEREBRAS_API_KEY) {
    throw new Error("CEREBRAS_API_KEY is required for Cerebras provider");
  }

  if (!env.CEREBRAS_MODEL) {
    throw new Error("CEREBRAS_MODEL is required for Cerebras provider");
  }

  // Create singleton client
  cerebrasClientInstance = new Cerebras({
    apiKey: env.CEREBRAS_API_KEY,
    timeout: env.CEREBRAS_TIMEOUT_MS,
    maxRetries: 0, // We handle retries at provider level
  });

  return cerebrasClientInstance;
}

/**
 * Check if Cerebras is configured
 */
export function isCerebrasConfigured(): boolean {
  const env = getServerEnv();
  return !!(env.CEREBRAS_API_KEY && env.CEREBRAS_MODEL);
}
