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
  AI_PROVIDER: z.enum(["mock", "gemini", "groq", "cerebras", "openrouter"]).default("mock"),
  AI_FALLBACK_PROVIDER: z.enum(["none", "mock", "cerebras"]).default("none"),
  
  // Model Configuration
  JIGYASA_MODEL: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  GROQ_MODEL: z.string().optional(),
  CEREBRAS_MODEL: z.string().optional(),
  
  // API Keys (not required for mock provider)
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  CEREBRAS_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional(),
  
  // Gemini Configuration
  GEMINI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  GEMINI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1800),
  GEMINI_THINKING_LEVEL: z.enum(["low", "medium", "high"]).default("low"),
  GEMINI_MAX_RETRIES: z.coerce.number().int().nonnegative().default(1),
  
  // Groq Configuration
  GROQ_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  GROQ_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1800),
  GROQ_MAX_RETRIES: z.coerce.number().int().nonnegative().default(1),
  
  // Cerebras Configuration
  CEREBRAS_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  CEREBRAS_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1800),
  CEREBRAS_MAX_RETRIES: z.coerce.number().int().nonnegative().default(0),
  CEREBRAS_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  CEREBRAS_VERSION_PATCH: z.coerce.number().int().positive().optional(),
  
  // RAG Configuration
  JIGYASA_REQUIRE_RAG: z.enum(["true", "false"]).default("true").transform(v => v === "true"),
  JIGYASA_MIN_RAG_RESULTS: z.coerce.number().int().nonnegative().default(1),
  JIGYASA_MAX_CONTEXT_CHARS: z.coerce.number().int().positive().default(10000),
  JIGYASA_STREAM_ENABLED: z.enum(["true", "false"]).default("true").transform(v => v === "true"),
  JIGYASA_ALLOW_UNGROUNDED_GENERAL_ANSWERS: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  
  // Hybrid Knowledge Policy
  JIGYASA_KNOWLEDGE_MODE: z.enum(["strict", "hybrid"]).default("hybrid"),
  JIGYASA_ALLOW_GENERAL_SPACE_ANSWERS: z.enum(["true", "false"]).default("true").transform(v => v === "true"),
  JIGYASA_REQUIRE_RAG_FOR_ALL_ANSWERS: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  JIGYASA_REQUIRE_LIVE_VERIFICATION_FOR_CURRENT_FACTS: z.enum(["true", "false"]).default("true").transform(v => v === "true"),
  
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
      AI_FALLBACK_PROVIDER: process.env.AI_FALLBACK_PROVIDER,
      JIGYASA_MODEL: process.env.JIGYASA_MODEL,
      GEMINI_MODEL: process.env.GEMINI_MODEL,
      GROQ_MODEL: process.env.GROQ_MODEL,
      CEREBRAS_MODEL: process.env.CEREBRAS_MODEL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,
      GEMINI_TEMPERATURE: process.env.GEMINI_TEMPERATURE,
      GEMINI_MAX_OUTPUT_TOKENS: process.env.GEMINI_MAX_OUTPUT_TOKENS,
      GEMINI_THINKING_LEVEL: process.env.GEMINI_THINKING_LEVEL,
      GEMINI_MAX_RETRIES: process.env.GEMINI_MAX_RETRIES,
      GROQ_TEMPERATURE: process.env.GROQ_TEMPERATURE,
      GROQ_MAX_OUTPUT_TOKENS: process.env.GROQ_MAX_OUTPUT_TOKENS,
      GROQ_MAX_RETRIES: process.env.GROQ_MAX_RETRIES,
      CEREBRAS_TEMPERATURE: process.env.CEREBRAS_TEMPERATURE,
      CEREBRAS_MAX_OUTPUT_TOKENS: process.env.CEREBRAS_MAX_OUTPUT_TOKENS,
      CEREBRAS_MAX_RETRIES: process.env.CEREBRAS_MAX_RETRIES,
      CEREBRAS_TIMEOUT_MS: process.env.CEREBRAS_TIMEOUT_MS,
      CEREBRAS_VERSION_PATCH: process.env.CEREBRAS_VERSION_PATCH,
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
      JIGYASA_REQUIRE_RAG: process.env.JIGYASA_REQUIRE_RAG,
      JIGYASA_MIN_RAG_RESULTS: process.env.JIGYASA_MIN_RAG_RESULTS,
      JIGYASA_MAX_CONTEXT_CHARS: process.env.JIGYASA_MAX_CONTEXT_CHARS,
      JIGYASA_STREAM_ENABLED: process.env.JIGYASA_STREAM_ENABLED,
      JIGYASA_ALLOW_UNGROUNDED_GENERAL_ANSWERS: process.env.JIGYASA_ALLOW_UNGROUNDED_GENERAL_ANSWERS,
      JIGYASA_KNOWLEDGE_MODE: process.env.JIGYASA_KNOWLEDGE_MODE,
      JIGYASA_ALLOW_GENERAL_SPACE_ANSWERS: process.env.JIGYASA_ALLOW_GENERAL_SPACE_ANSWERS,
      JIGYASA_REQUIRE_RAG_FOR_ALL_ANSWERS: process.env.JIGYASA_REQUIRE_RAG_FOR_ALL_ANSWERS,
      JIGYASA_REQUIRE_LIVE_VERIFICATION_FOR_CURRENT_FACTS: process.env.JIGYASA_REQUIRE_LIVE_VERIFICATION_FOR_CURRENT_FACTS,
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

  if (env.AI_PROVIDER === "gemini") {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini");
    }
    if (!env.GEMINI_MODEL) {
      throw new Error("GEMINI_MODEL is required when AI_PROVIDER=gemini");
    }
  }

  if (env.AI_PROVIDER === "groq") {
    if (!env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is required when AI_PROVIDER=groq");
    }
    if (!env.GROQ_MODEL) {
      throw new Error("GROQ_MODEL is required when AI_PROVIDER=groq");
    }
  }

  if (env.AI_PROVIDER === "cerebras") {
    if (!env.CEREBRAS_API_KEY) {
      throw new Error("CEREBRAS_API_KEY is required when AI_PROVIDER=cerebras");
    }
    if (!env.CEREBRAS_MODEL) {
      throw new Error("CEREBRAS_MODEL is required when AI_PROVIDER=cerebras");
    }
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
