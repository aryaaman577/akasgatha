/**
 * Gemini AI Provider
 * 
 * Real AI provider using Google's Gemini API.
 * Implements structured output, RAG grounding, and citation validation.
 * Phase 5
 */

import { GoogleGenAI } from "@google/genai";
import type { JigyasaProvider, ProviderInput, ProviderOutput, ProviderHealth } from "./types";
import { getServerEnv } from "../env";
import { buildSystemInstruction, buildUserMessage } from "./prompts/jigyasa-system";
import { buildGroupedContext, isContextSufficient } from "../jigyasa/context-builder";
import {
  buildCitationMap,
  getAllowedCitationIds,
  validateCitationIds,
  buildPublicSources,
  filterValidCitations,
} from "../jigyasa/citation-validator";
import { logger } from "../utils/logger";

/**
 * Expected structured output from the model
 */
interface ModelStructuredOutput {
  shortAnswer: string;
  katha: string;
  vigyan: string;
  pramaan: Array<{
    text: string;
    citationIds: string[];
  }>;
  uncertainty: string;
  citationIds: string[];
  followUps: string[];
}

export class GeminiProvider implements JigyasaProvider {
  readonly name = "gemini";
  private client: GoogleGenAI;
  private env: ReturnType<typeof getServerEnv>;

  constructor() {
    this.env = getServerEnv();
    
    if (!this.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required for Gemini provider");
    }
    
    if (!this.env.GEMINI_MODEL) {
      throw new Error("GEMINI_MODEL is required for Gemini provider");
    }

    this.client = new GoogleGenAI({ apiKey: this.env.GEMINI_API_KEY });
  }

  async generate(input: ProviderInput): Promise<ProviderOutput> {
    const startTime = Date.now();

    // Check for RAG requirement
    if (this.env.JIGYASA_REQUIRE_RAG && !isContextSufficient(input.ragContext || null, this.env.JIGYASA_MIN_RAG_RESULTS)) {
      throw new Error("INSUFFICIENT_KNOWLEDGE: No relevant knowledge found in corpus");
    }

    // Build citation map and allowed IDs
    const citationMap = input.ragContext ? buildCitationMap(input.ragContext) : {};
    const allowedCitationIds = getAllowedCitationIds(citationMap);

    // Build system instruction
    const systemInstruction = buildSystemInstruction(allowedCitationIds);

    // Build context
    const groupedContext = input.ragContext
      ? buildGroupedContext(input.ragContext, this.env.JIGYASA_MAX_CONTEXT_CHARS)
      : { full: "No relevant context available.", charCount: 0 } as const;

    // Build user message
    const userMessage = buildUserMessage(input.question, groupedContext.full, input.history);

    // Call Gemini using models.generateContent
    const generateContentParams = {
      model: this.env.GEMINI_MODEL!,
      contents: userMessage,
      systemInstruction,
      config: {
        temperature: this.env.GEMINI_TEMPERATURE,
        maxOutputTokens: this.env.GEMINI_MAX_OUTPUT_TOKENS,
        responseMimeType: "application/json" as const,
      },
    };

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= this.env.GEMINI_MAX_RETRIES) {
      try {
        // Respect abort signal
        if (input.signal.aborted) {
          throw new Error("Request aborted");
        }

        // Generate content
        const response = await this.client.models.generateContent(generateContentParams);
        
        // Check for safety blocks or empty response
        if (!response.text || response.text.trim().length === 0) {
          const blockReason = response.candidates?.[0]?.finishReason;
          throw new Error(`PROVIDER_SAFETY_BLOCK: Content blocked (${blockReason || "unknown reason"})`);
        }

        // Parse structured output
        const rawText = response.text.trim();
        let structured: ModelStructuredOutput;
        
        try {
          // Try to parse JSON (strip markdown code blocks if present)
          let jsonText = rawText;
          
          // Remove markdown code blocks if present
          if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
          }
          
          structured = JSON.parse(jsonText);
        } catch (parseError) {
          // Log first 200 chars of response for debugging (no secrets)
          const preview = rawText.substring(0, 200);
          logger.warn("Failed to parse Gemini response as JSON", {
            requestId: input.requestId,
            preview: preview.includes("GEMINI_API_KEY") ? "[REDACTED]" : preview,
          });
          throw new Error("PROVIDER_INVALID_OUTPUT: Failed to parse JSON response");
        }

        // Validate schema
        this.validateStructuredOutput(structured);

        // Validate citations
        const allCitationIds = this.extractAllCitationIds(structured);
        const validation = validateCitationIds(allCitationIds, allowedCitationIds);

        if (!validation.valid) {
          logger.warn("Unknown citation IDs detected", {
            requestId: input.requestId,
            unknownIds: validation.unknownIds,
            attempt,
          });

          // Allow one repair attempt
          if (attempt < this.env.GEMINI_MAX_RETRIES) {
            attempt++;
            continue;
          }

          // Filter out unknown citations
          const validCitationIds = filterValidCitations(allCitationIds, allowedCitationIds);
          
          // If no valid citations remain, reject
          if (validCitationIds.length === 0 && allCitationIds.length > 0) {
            throw new Error("CITATION_VALIDATION_FAILED: All citations are invalid");
          }

          // Use filtered citations
          structured.citationIds = validCitationIds;
        }

        // Build public sources
        const sources = buildPublicSources(structured.citationIds, citationMap);

        // Build final answer
        const answer = {
          shortAnswer: structured.shortAnswer,
          katha: structured.katha,
          vigyan: structured.vigyan,
          pramaan: structured.pramaan.map(p => p.text),
          uncertainty: structured.uncertainty,
          sources,
          followUps: structured.followUps,
        };

        const durationMs = Date.now() - startTime;

        return {
          answer,
          meta: {
            durationMs,
            model: this.env.GEMINI_MODEL,
            tokensUsed: response.usageMetadata?.totalTokenCount,
          },
        };
      } catch (error) {
        lastError = error as Error;

        // Check if retryable
        if (this.isRetryableError(error)) {
          attempt++;
          if (attempt <= this.env.GEMINI_MAX_RETRIES) {
            logger.warn("Gemini call failed, retrying", {
              requestId: input.requestId,
              attempt,
              error: lastError.message,
            });
            continue;
          }
        }

        // Map and throw error
        throw this.mapGeminiError(error);
      }
    }

    // Max retries exceeded
    throw lastError || new Error("PROVIDER_UNAVAILABLE: Max retries exceeded");
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      // Provider is configured if we got this far
      return {
        configured: true,
        available: true,
        mock: false,
      };
    } catch {
      return {
        configured: true,
        available: false,
        mock: false,
      };
    }
  }

  /**
   * Validate structured output schema
   */
  private validateStructuredOutput(output: ModelStructuredOutput): void {
    if (!output.shortAnswer || typeof output.shortAnswer !== "string") {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid shortAnswer");
    }

    if (typeof output.katha !== "string" || typeof output.vigyan !== "string") {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid katha/vigyan");
    }

    if (!Array.isArray(output.pramaan)) {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid pramaan array");
    }

    if (!output.uncertainty || typeof output.uncertainty !== "string") {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid uncertainty");
    }

    if (!Array.isArray(output.citationIds)) {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid citationIds array");
    }

    if (!Array.isArray(output.followUps)) {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid followUps array");
    }
  }

  /**
   * Extract all citation IDs from structured output
   */
  private extractAllCitationIds(output: ModelStructuredOutput): string[] {
    const ids = new Set<string>();
    
    // From top-level citationIds
    output.citationIds.forEach(id => ids.add(id));
    
    // From pramaan citationIds
    output.pramaan.forEach(p => {
      if (Array.isArray(p.citationIds)) {
        p.citationIds.forEach(id => ids.add(id));
      }
    });
    
    return Array.from(ids);
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    const message = error.message.toLowerCase();
    
    // Retryable conditions
    if (message.includes("timeout")) return true;
    if (message.includes("503")) return true;
    if (message.includes("unavailable")) return true;
    if (message.includes("overloaded")) return true;
    
    // Non-retryable
    if (message.includes("auth")) return false;
    if (message.includes("invalid_api_key")) return false;
    if (message.includes("safety")) return false;
    if (message.includes("aborted")) return false;
    
    return false;
  }

  /**
   * Map Gemini errors to standard error codes
   */
  private mapGeminiError(error: unknown): Error {
    if (!(error instanceof Error)) {
      return new Error("INTERNAL_ERROR: Unknown error occurred");
    }

    const message = error.message.toLowerCase();

    if (message.includes("aborted")) {
      return new Error("REQUEST_ABORTED: " + error.message);
    }

    if (message.includes("auth") || message.includes("invalid_api_key") || message.includes("api key")) {
      return new Error("PROVIDER_AUTH_FAILED: " + error.message);
    }

    if (message.includes("rate limit") || message.includes("429")) {
      return new Error("PROVIDER_RATE_LIMITED: " + error.message);
    }

    if (message.includes("timeout")) {
      return new Error("PROVIDER_TIMEOUT: " + error.message);
    }

    if (message.includes("safety") || message.includes("blocked")) {
      return new Error("PROVIDER_SAFETY_BLOCK: " + error.message);
    }

    if (message.includes("invalid_output") || message.includes("citation")) {
      return new Error(error.message); // Already prefixed
    }

    if (message.includes("insufficient_knowledge")) {
      return new Error(error.message); // Already prefixed
    }

    if (message.includes("503") || message.includes("unavailable")) {
      return new Error("PROVIDER_UNAVAILABLE: " + error.message);
    }

    // Default to unavailable for unknown errors
    return new Error("PROVIDER_UNAVAILABLE: " + error.message);
  }
}
