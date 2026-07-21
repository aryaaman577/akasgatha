/**
 * Jigyasa API Request and Response Schemas
 * 
 * Strict validation contracts for API-safe data exchange.
 */

import { z } from "zod";

// ============================================================================
// REQUEST SCHEMA
// ============================================================================

export const jigyasaRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question cannot be empty")
    .transform(str => str.replace(/\r\n/g, "\n")) // Normalize line endings
    .refine(str => str.trim().length > 0, "Question cannot contain only whitespace"),
  
  language: z.enum(["en", "hi", "hinglish"]).default("en"),
  
  conversationId: z
    .string()
    .max(128)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid conversation ID format")
    .optional(),
  
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1, "History entry cannot be empty"),
      })
    )
    .optional(),
  
  // Phase 5 UX: AI provider preference (optional, backward-compatible)
  // Only Groq is currently active
  providerPreference: z
    .enum(["auto", "groq", "gemini"])
    .default("auto")
    .optional(),
  
  // Phase 5 UX: Response style preference (optional, backward-compatible)
  responseStyle: z
    .enum(["balanced", "quick", "structured", "deep", "katha-vigyan"])
    .default("balanced")
    .optional(),
})
.strict(); // Reject unknown fields

export type JigyasaRequest = z.infer<typeof jigyasaRequestSchema>;

/**
 * Validate history array constraints
 */
export function validateHistoryConstraints(
  history: JigyasaRequest["history"],
  maxMessages: number,
  maxTotalChars: number
): { valid: boolean; reason?: string } {
  if (!history || history.length === 0) {
    return { valid: true };
  }

  if (history.length > maxMessages) {
    return {
      valid: false,
      reason: `History cannot exceed ${maxMessages} messages`,
    };
  }

  const totalChars = history.reduce((sum, msg) => sum + msg.content.length, 0);
  if (totalChars > maxTotalChars) {
    return {
      valid: false,
      reason: `History content cannot exceed ${maxTotalChars} characters`,
    };
  }

  return { valid: true };
}

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const jigyasaSuccessResponseSchema = z.object({
  requestId: z.string(),
  status: z.literal("ok"),
  answer: z.object({
    shortAnswer: z.string(),
    katha: z.string(),
    vigyan: z.string(),
    pramaan: z.array(z.string()),
    uncertainty: z.string(),
    sources: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.string().url().optional(),
      })
    ),
    followUps: z.array(z.string()),
    visual: z
      .object({
        sceneId: z.string(),
        parameters: z.record(z.string(), z.unknown()),
      })
      .optional(),
  }),
  meta: z.object({
    provider: z.string(),
    model: z.string(),
    mock: z.boolean(),
    ragUsed: z.boolean(),
    retrievedChunkCount: z.number(),
    durationMs: z.number(),
    requestedProvider: z.string().optional(),
    actualProvider: z.string().optional(),
    requestedModel: z.string().optional(),
    actualModel: z.string().optional(),
    fallbackUsed: z.boolean().optional(),
    answerMode: z.string().optional(),
  }),
});

export type JigyasaSuccessResponse = z.infer<typeof jigyasaSuccessResponseSchema>;

export const jigyasaErrorResponseSchema = z.object({
  requestId: z.string(),
  status: z.literal("error"),
  error: z.object({
    code: z.enum([
      "INVALID_REQUEST",
      "UNSUPPORTED_CONTENT_TYPE",
      "OUT_OF_SCOPE",
      "INSUFFICIENT_KNOWLEDGE",
      "RATE_LIMITED",
      "PROVIDER_NOT_CONFIGURED",
      "PROVIDER_AUTH_FAILED",
      "PROVIDER_RATE_LIMITED",
      "PROVIDER_TIMEOUT",
      "PROVIDER_UNAVAILABLE",
      "PROVIDER_SAFETY_BLOCK",
      "PROVIDER_INVALID_OUTPUT",
      "CITATION_VALIDATION_FAILED",
      "REQUEST_ABORTED",
      "INTERNAL_ERROR",
    ]),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export type JigyasaErrorResponse = z.infer<typeof jigyasaErrorResponseSchema>;

export type JigyasaResponse = JigyasaSuccessResponse | JigyasaErrorResponse;

// ============================================================================
// HEALTH CHECK RESPONSE
// ============================================================================

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
  version: z.string(),
  provider: z.object({
    name: z.string(),
    configured: z.boolean(),
    mock: z.boolean(),
    // Phase 5: Provider routing info
    primary: z.string().nullable().optional(),
    primaryModel: z.string().nullable().optional(),
    primaryConfigured: z.boolean().optional(),
    fallback: z.string().nullable().optional(),
    fallbackModel: z.string().nullable().optional(),
    fallbackConfigured: z.boolean().optional(),
  }),
  // Phase 5 UX: Available provider capabilities
  capabilities: z.object({
    providers: z.array(z.enum(["groq", "cerebras", "gemini"])),
    fallbackEnabled: z.boolean(),
    models: z.object({
      groq: z.string().nullable().optional(),
      gemini: z.string().nullable().optional(),
    }).optional(),
  }).optional(),
  rag: z.union([
    z.object({
      available: z.literal(true),
      documentCount: z.number(),
      chunkCount: z.number(),
      schemaVersion: z.string(),
      provider: z.string(),
      model: z.string(),
    }),
    z.object({
      available: z.literal(false),
      message: z.string(),
    }),
  ]).optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
