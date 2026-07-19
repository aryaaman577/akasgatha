/**
 * Server-Only Environment Configuration
 * 
 * This module validates and exposes environment variables for server-side use only.
 * DO NOT import this file from Client Components.
 * 
 * Phase 4A: Mock provider works without external API keys.
 * Real AI providers will be configured in later phases.
 */

import { z } from "zod";

const envSchema = z.object({
  // AI Provider Configuration
  AI_PROVIDER: z.enum(["mock", "gemini", "openrouter"]).default("mock"),
  
  // Model Configuration (optional, provider-specific)
  JIGYASA_MODEL: z.string().optional(),
  
  // API Keys (not required for mock provider)
  GEMINI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional(),
  
  // Request Limits
  JIGYASA_MAX_INPUT_CHARS: z.coerce.number().int().positive().default(2000),
  JIGYASA_MAX_HISTORY_MESSAGES: z.coerce.number().int().nonnegative().default(8),
  JIGYASA_MAX_HISTORY_CHARS: z.coerce.number().int().positive().default(6000),
  
  // Timeouts
  JIGYASA_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  
  // Rate Limiting
  JIGYASA_RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().default(10),
  JIGYASA_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
  
  // Logging
  JIGYASA_LOG_QUESTION_CONTENT: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  
  // Application
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Parse and validate environment variables.
 * Throws on invalid configuration.
 */
export function getServerEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse({
      AI_PROVIDER: process.env.AI_PROVIDER,
      JIGYASA_MODEL: process.env.JIGYASA_MODEL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
      JIGYASA_MAX_INPUT_CHARS: process.env.JIGYASA_MAX_INPUT_CHARS,
      JIGYASA_MAX_HISTORY_MESSAGES: process.env.JIGYASA_MAX_HISTORY_MESSAGES,
      JIGYASA_MAX_HISTORY_CHARS: process.env.JIGYASA_MAX_HISTORY_CHARS,
      JIGYASA_REQUEST_TIMEOUT_MS: process.env.JIGYASA_REQUEST_TIMEOUT_MS,
      JIGYASA_RATE_LIMIT_REQUESTS: process.env.JIGYASA_RATE_LIMIT_REQUESTS,
      JIGYASA_RATE_LIMIT_WINDOW_SECONDS: process.env.JIGYASA_RATE_LIMIT_WINDOW_SECONDS,
      JIGYASA_LOG_QUESTION_CONTENT: process.env.JIGYASA_LOG_QUESTION_CONTENT,
      APP_BASE_URL: process.env.APP_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      throw new Error(`Environment configuration error: ${issues}`);
    }
    throw error;
  }
}

/**
 * Validate that the configured provider has required credentials.
 * Mock provider always passes.
 */
export function validateProviderConfig(env: Env): void {
  if (env.AI_PROVIDER === "mock") {
    return; // Mock provider needs no credentials
  }

  if (env.AI_PROVIDER === "gemini" && !env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini");
  }

  if (env.AI_PROVIDER === "openrouter") {
    if (!env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter");
    }
    if (!env.OPENROUTER_MODEL) {
      throw new Error("OPENROUTER_MODEL is required when AI_PROVIDER=openrouter");
    }
  }
}
