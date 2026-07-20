/**
 * Jigyasa API Route
 * 
 * Main endpoint for Jigyasa question processing.
 * Validates requests, enforces rate limits, and returns structured answers.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/server/env";
import { 
  jigyasaRequestSchema, 
  validateHistoryConstraints,
  type JigyasaSuccessResponse,
  type JigyasaErrorResponse,
} from "@/lib/server/jigyasa/schema";
import { generateRequestId } from "@/lib/server/utils/request-id";
import { logger, truncateForLog } from "@/lib/server/utils/logger";
import { createTimeoutController, isAbortError } from "@/lib/server/utils/timeout";
import { getRateLimiter } from "@/lib/server/rate-limit/in-memory-limiter";
import { isProviderMock } from "@/lib/server/ai/provider-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  try {
    const env = getServerEnv();

    // Validate content type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return createErrorResponse(requestId, "UNSUPPORTED_CONTENT_TYPE", "Content-Type must be application/json", false);
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(requestId, "INVALID_REQUEST", "Invalid JSON in request body", false);
    }

    const validationResult = jigyasaRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      return createErrorResponse(requestId, "INVALID_REQUEST", errorMessage, false);
    }

    const input = validationResult.data;

    // Validate question length
    if (input.question.length > env.JIGYASA_MAX_INPUT_CHARS) {
      return createErrorResponse(
        requestId,
        "INVALID_REQUEST",
        `Question exceeds maximum length of ${env.JIGYASA_MAX_INPUT_CHARS} characters`,
        false
      );
    }

    // Validate history constraints
    if (input.history) {
      const historyValidation = validateHistoryConstraints(
        input.history,
        env.JIGYASA_MAX_HISTORY_MESSAGES,
        env.JIGYASA_MAX_HISTORY_CHARS
      );
      
      if (!historyValidation.valid) {
        return createErrorResponse(requestId, "INVALID_REQUEST", historyValidation.reason!, false);
      }
    }

    // Rate limiting
    const rateLimiter = getRateLimiter();
    const rateLimitKey = getRateLimitKey(request);
    const rateLimitResult = await rateLimiter.check({
      key: rateLimitKey,
      limit: env.JIGYASA_RATE_LIMIT_REQUESTS,
      windowSeconds: env.JIGYASA_RATE_LIMIT_WINDOW_SECONDS,
    });

    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded", {
        requestId,
        route: "/api/jigyasa",
        rateLimitResult: "exceeded",
      });

      return NextResponse.json(
        createErrorResponse(requestId, "RATE_LIMITED", "Rate limit exceeded. Please try again later.", true).body,
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": env.JIGYASA_RATE_LIMIT_REQUESTS.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    // Log request (safe metadata only)
    logger.info("Jigyasa request received", {
      requestId,
      route: "/api/jigyasa",
      method: "POST",
      language: input.language,
      inputChars: input.question.length,
      historyMessages: input.history?.length ?? 0,
      ...(env.JIGYASA_LOG_QUESTION_CONTENT && {
        questionPreview: truncateForLog(input.question, 100),
      }),
    });

    // Create timeout controller
    const { controller, cleanup } = createTimeoutController(env.JIGYASA_REQUEST_TIMEOUT_MS);

    try {
      // RAG retrieval using local index (Phase 4B-4 + Phase 5)
      // RAG runs ONCE before any provider attempt
      let ragContext = null;
      try {
        const { retrieveLocalContext } = await import("@/lib/server/rag/local-retrieval");
        ragContext = await retrieveLocalContext(input.question, {
          topK: 5,
          minScore: 0.5,
          languageFilter: input.language === "hi" ? "hi" : "en",
        });
        
        logger.info("RAG retrieval completed", {
          requestId,
          resultsCount: ragContext.totalResults,
          domains: ragContext.metadata.domains,
          avgScore: ragContext.metadata.avgScore,
          retrievalTime: ragContext.retrievalTime,
        });
      } catch (ragError) {
        // Log RAG errors but don't fail the request
        logger.warn("RAG retrieval failed", {
          requestId,
          error: ragError instanceof Error ? ragError.message : "Unknown error",
        });
      }
      
      // Handle provider preference
      let result;
      
      if (input.providerPreference === "groq") {
        // Direct Groq provider call - no fallback
        logger.info("Using direct Groq provider (user preference)", {
          requestId,
          providerPreference: input.providerPreference,
        });
        
        const { GroqProvider } = await import("@/lib/server/ai/groq-provider");
        
        try {
          const groqProvider = new GroqProvider();
          const groqResult = await groqProvider.generate({
            question: input.question,
            language: input.language,
            history: input.history,
            requestId,
            signal: controller.signal,
            ragContext,
          });
          
          result = {
            ...groqResult,
            meta: {
              ...groqResult.meta,
              provider: "groq",
              fallbackUsed: false,
              providerAttempts: 1,
              primaryProvider: "groq",
              fallbackProvider: undefined,
            },
          };
        } catch (error) {
          // For direct provider calls, throw errors immediately (no fallback)
          logger.error("Direct Groq provider failed", {
            requestId,
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      } else if (input.providerPreference === "cerebras") {
        // Cerebras disabled due to billing
        return createErrorResponse(
          requestId,
          "PROVIDER_NOT_CONFIGURED",
          "Cerebras provider is currently unavailable. Please use Auto or Groq.",
          false
        );
      } else {
        // Auto mode - use provider router with fallback support
        logger.info("Using automatic provider routing", {
          requestId,
          providerPreference: input.providerPreference || "auto",
        });
        
        const { getProviderWithFallback } = await import("@/lib/server/ai/provider-registry");
        const router = getProviderWithFallback();
        
        result = await router.generate({
          question: input.question,
          language: input.language,
          history: input.history,
          requestId,
          signal: controller.signal,
          ragContext, // Pass SAME RAG context to all providers
        });
      }

      const durationMs = Date.now() - startTime;

      logger.info("Jigyasa request completed", {
        requestId,
        status: 200,
        provider: result.meta.provider,
        primaryProvider: result.meta.primaryProvider,
        fallbackUsed: result.meta.fallbackUsed,
        providerAttempts: result.meta.providerAttempts,
        mock: isProviderMock(),
        ragEnabled: ragContext !== null,
        durationMs,
      });

      const response: JigyasaSuccessResponse = {
        requestId,
        status: "ok",
        answer: result.answer,
        meta: {
          provider: result.meta.provider,
          model: result.meta.model || result.meta.provider,
          mock: isProviderMock(),
          ragUsed: ragContext !== null,
          retrievedChunkCount: ragContext?.totalResults || 0,
          durationMs,
        },
      };

      return NextResponse.json(response, {
        status: 200,
        headers: {
          "X-Request-Id": requestId,
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      });
    } finally {
      cleanup();
    }
  } catch (error) {
    const durationMs = Date.now() - startTime;

    // Handle abort/timeout errors
    if (isAbortError(error)) {
      logger.warn("Request aborted or timed out", {
        requestId,
        errorType: error instanceof Error ? error.name : "unknown",
        durationMs,
      });

      const code = error instanceof Error && error.name === "TimeoutError"
        ? "PROVIDER_TIMEOUT"
        : "REQUEST_ABORTED";

      return createErrorResponse(
        requestId,
        code,
        error instanceof Error ? error.message : "Request was aborted",
        code === "PROVIDER_TIMEOUT"
      );
    }

    // Handle known error codes from providers
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Parse error code from message
      if (errorMessage.startsWith("INSUFFICIENT_KNOWLEDGE:")) {
        return createErrorResponse(
          requestId,
          "INSUFFICIENT_KNOWLEDGE",
          errorMessage.replace("INSUFFICIENT_KNOWLEDGE: ", ""),
          false
        );
      }

      if (errorMessage.startsWith("OUT_OF_SCOPE:")) {
        return createErrorResponse(
          requestId,
          "OUT_OF_SCOPE",
          errorMessage.replace("OUT_OF_SCOPE: ", ""),
          false
        );
      }

      if (errorMessage.startsWith("PROVIDER_AUTH_FAILED:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_AUTH_FAILED",
          errorMessage.replace("PROVIDER_AUTH_FAILED: ", ""),
          false
        );
      }

      if (errorMessage.startsWith("PROVIDER_RATE_LIMITED:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_RATE_LIMITED",
          errorMessage.replace("PROVIDER_RATE_LIMITED: ", ""),
          true
        );
      }

      if (errorMessage.startsWith("PROVIDER_SAFETY_BLOCK:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_SAFETY_BLOCK",
          errorMessage.replace("PROVIDER_SAFETY_BLOCK: ", ""),
          false
        );
      }

      if (errorMessage.startsWith("PROVIDER_INVALID_OUTPUT:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_INVALID_OUTPUT",
          errorMessage.replace("PROVIDER_INVALID_OUTPUT: ", ""),
          true
        );
      }

      if (errorMessage.startsWith("CITATION_VALIDATION_FAILED:")) {
        return createErrorResponse(
          requestId,
          "CITATION_VALIDATION_FAILED",
          errorMessage.replace("CITATION_VALIDATION_FAILED: ", ""),
          true
        );
      }

      if (errorMessage.startsWith("PROVIDER_TIMEOUT:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_TIMEOUT",
          errorMessage.replace("PROVIDER_TIMEOUT: ", ""),
          true
        );
      }

      if (errorMessage.startsWith("PROVIDER_UNAVAILABLE:")) {
        return createErrorResponse(
          requestId,
          "PROVIDER_UNAVAILABLE",
          errorMessage.replace("PROVIDER_UNAVAILABLE: ", ""),
          true
        );
      }

      if (errorMessage.startsWith("REQUEST_ABORTED:")) {
        return createErrorResponse(
          requestId,
          "REQUEST_ABORTED",
          errorMessage.replace("REQUEST_ABORTED: ", ""),
          false
        );
      }
    }

    // Log unexpected errors (without sensitive details)
    logger.error("Jigyasa request failed", {
      requestId,
      errorCode: "INTERNAL_ERROR",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      durationMs,
    });

    return createErrorResponse(
      requestId,
      "INTERNAL_ERROR",
      "An unexpected error occurred. Please try again.",
      true
    );
  }
}

/**
 * Create standardized error response
 */
function createErrorResponse(
  requestId: string,
  code: JigyasaErrorResponse["error"]["code"],
  message: string,
  retryable: boolean
): NextResponse<JigyasaErrorResponse> {
  const response: JigyasaErrorResponse = {
    requestId,
    status: "error",
    error: {
      code,
      message,
      retryable,
    },
  };

  const statusCode = code === "RATE_LIMITED" ? 429 
    : code === "INVALID_REQUEST" || code === "UNSUPPORTED_CONTENT_TYPE" ? 400
    : code === "PROVIDER_NOT_CONFIGURED" ? 503
    : 500;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      "X-Request-Id": requestId,
    },
  });
}

/**
 * Generate rate limit key from request metadata
 * Uses IP address when available, falls back to generic key
 */
function getRateLimitKey(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    const ips = forwarded.split(",").map(ip => ip.trim());
    return `jigyasa:${ips[0]}`;
  }
  
  if (realIp) {
    return `jigyasa:${realIp}`;
  }

  // Fallback to generic key (less effective but prevents complete failure)
  return "jigyasa:anonymous";
}
