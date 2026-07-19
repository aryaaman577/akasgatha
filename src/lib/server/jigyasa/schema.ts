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
    mock: z.boolean(),
    durationMs: z.number(),
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
      "RATE_LIMITED",
      "PROVIDER_NOT_CONFIGURED",
      "PROVIDER_TIMEOUT",
      "PROVIDER_UNAVAILABLE",
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
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
