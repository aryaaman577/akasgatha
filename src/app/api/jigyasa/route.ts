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
import { getConcurrencyLimiter } from "@/lib/server/rate-limit/concurrency-limiter";
import { isProviderMock } from "@/lib/server/ai/provider-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Limit request body size to 100KB (prevents DoS via large payloads)
export const maxDuration = 30; // 30 seconds max execution time

// Next.js App Router body size limit (100KB)
const MAX_REQUEST_BODY_SIZE = 100 * 1024; // 100KB

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  try {
    const env = getServerEnv();

    // Check request body size (before parsing)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_SIZE) {
      return createErrorResponse(
        requestId,
        "INVALID_REQUEST",
        `Request body exceeds maximum size of ${MAX_REQUEST_BODY_SIZE} bytes`,
        false
      );
    }

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
            "Retry-After": Math.ceil((rateLimitResult.resetAt - Math.floor(Date.now() / 1000))).toString(),
          },
        }
      );
    }

    // Concurrent request limiting (prevent resource exhaustion)
    const concurrencyLimiter = getConcurrencyLimiter();
    const concurrencyKey = rateLimitKey; // Use same key as rate limit

    try {
      await concurrencyLimiter.acquire(concurrencyKey);
    } catch (concurrencyError) {
      logger.warn("Concurrent request limit exceeded", {
        requestId,
        route: "/api/jigyasa",
        currentCount: concurrencyLimiter.getCount(concurrencyKey),
      });

      return NextResponse.json(
        createErrorResponse(
          requestId,
          "RATE_LIMITED",
          "Too many concurrent requests. Please try again in a moment.",
          true
        ).body,
        { status: 429 }
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
    const { controller, cleanup: cleanupTimeout } = createTimeoutController(env.JIGYASA_REQUEST_TIMEOUT_MS);

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
      } else if (input.providerPreference === "gemini") {
        // Direct Gemini provider call - no fallback
        logger.info("Using direct Gemini provider (user preference)", {
          requestId,
          providerPreference: input.providerPreference,
        });
        
        const { GeminiProvider } = await import("@/lib/server/ai/gemini-provider");
        
        try {
          const geminiProvider = new GeminiProvider();
          const geminiResult = await geminiProvider.generate({
            question: input.question,
            language: input.language,
            history: input.history,
            requestId,
            signal: controller.signal,
            ragContext,
          });
          
          result = {
            ...geminiResult,
            meta: {
              ...geminiResult.meta,
              provider: "gemini",
              fallbackUsed: false,
              providerAttempts: 1,
              primaryProvider: "gemini",
              fallbackProvider: undefined,
            },
          };
        } catch (error) {
          logger.error("Direct Gemini provider failed", {
            requestId,
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
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
          ragUsed: ragContext !== null && ragContext.totalResults > 0,
          retrievedChunkCount: ragContext?.totalResults || 0,
          durationMs,
          requestedProvider: input.providerPreference || "auto",
          actualProvider: result.meta.provider,
          requestedModel: input.providerPreference === "gemini" ? env.GEMINI_MODEL : input.providerPreference === "groq" ? (env.GROQ_PRIMARY_MODEL || env.GROQ_MODEL) : undefined,
          actualModel: result.meta.model || result.meta.provider,
          fallbackUsed: result.meta.fallbackUsed || false,
          answerMode: result.meta.answerMode || (ragContext && ragContext.totalResults > 0 ? "RAG_GROUNDED" : "GENERAL_SPACE_KNOWLEDGE"),
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
      cleanupTimeout();
      // Release concurrency slot
      concurrencyLimiter.release(concurrencyKey);
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
