/**
 * Groq AI Provider
 * 
 * Real AI provider using Groq's API with openai/gpt-oss-20b model.
 * Implements structured output, RAG grounding, citation validation,
 * and hybrid knowledge mode for broad space question coverage.
 * Phase 5
 */

import Groq from "groq-sdk";
import type { JigyasaProvider, ProviderInput, ProviderOutput, ProviderHealth } from "./types";
import { getServerEnv } from "../env";
import { buildGroqSystemInstruction, buildGroqUserMessage } from "./prompts/jigyasa-groq-system";
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
  answerMode: string;
}

export class GroqProvider implements JigyasaProvider {
  readonly name = "groq";
  private client: Groq;
  private env: ReturnType<typeof getServerEnv>;
  private model: string;

  constructor(modelOverride?: string) {
    this.env = getServerEnv();
    
    if (!this.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is required for Groq provider");
    }
    
    // Determine model: override > PRIMARY > GROQ_MODEL > default
    this.model = modelOverride 
      || this.env.GROQ_PRIMARY_MODEL 
      || this.env.GROQ_MODEL 
      || "openai/gpt-oss-20b";

    this.client = new Groq({ apiKey: this.env.GROQ_API_KEY });
  }

  getModel(): string {
    return this.model;
  }

  async generate(input: ProviderInput): Promise<ProviderOutput> {
    const startTime = Date.now();

    // Check RAG context availability
    const hasRagContext = !!(input.ragContext && input.ragContext.totalResults > 0);
    const contextSufficient = isContextSufficient(input.ragContext || null, this.env.JIGYASA_MIN_RAG_RESULTS);

    // In hybrid mode, allow general answers even without RAG
    // In strict mode, require RAG context
    if (this.env.JIGYASA_KNOWLEDGE_MODE === "strict" && !contextSufficient) {
      throw new Error("INSUFFICIENT_KNOWLEDGE: No relevant knowledge found in corpus");
    }

    // Build citation map and allowed IDs
    const citationMap = input.ragContext ? buildCitationMap(input.ragContext) : {};
    const allowedCitationIds = getAllowedCitationIds(citationMap);

    // Build system instruction
    const systemInstruction = buildGroqSystemInstruction(
      allowedCitationIds,
      this.env.JIGYASA_KNOWLEDGE_MODE,
      hasRagContext
    );

    // Build context
    const groupedContext = input.ragContext
      ? buildGroupedContext(input.ragContext, this.env.JIGYASA_MAX_CONTEXT_CHARS)
      : null;

    // Build user message
    const userMessage = buildGroqUserMessage(
      input.question,
      groupedContext?.full || null,
      input.history
    );

    // Define JSON schema for structured output
    const responseFormat = {
      type: "json_schema" as const,
      json_schema: {
        name: "jigyasa_response",
        strict: false, // Allow flexibility for model to include answerMode consistently
        schema: {
          type: "object",
          properties: {
            shortAnswer: {
              type: "string",
              description: "One sentence direct answer in the requested language"
            },
            katha: {
              type: "string",
              description: "Cultural narrative or empty string"
            },
            vigyan: {
              type: "string",
              description: "Scientific explanation or empty string"
            },
            pramaan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "Evidence statement"
                  },
                  citationIds: {
                    type: "array",
                    items: {
                      type: "string"
                    },
                    description: "Citation IDs from allowed list"
                  }
                },
                required: ["text", "citationIds"],
                additionalProperties: false
              },
              description: "Array of evidence statements with citations"
            },
            uncertainty: {
              type: "string",
              description: "Confidence, limitations, and answer mode"
            },
            citationIds: {
              type: "array",
              items: {
                type: "string"
              },
              description: "All citation IDs used"
            },
            followUps: {
              type: "array",
              items: {
                type: "string"
              },
              description: "2-4 follow-up questions"
            },
            answerMode: {
              type: "string",
              description: "Answer mode: RAG_GROUNDED, HYBRID, GENERAL_SPACE_KNOWLEDGE, LIVE_VERIFICATION_REQUIRED, INSUFFICIENT_KNOWLEDGE, OUT_OF_SCOPE"
            }
          },
          required: ["shortAnswer", "katha", "vigyan", "pramaan", "uncertainty", "citationIds", "followUps", "answerMode"],
          additionalProperties: false
        }
      }
    };

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= this.env.GROQ_MAX_RETRIES) {
      try {
        // Respect abort signal
        if (input.signal.aborted) {
          throw new Error("Request aborted");
        }

        // Call Groq API
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: "system",
              content: systemInstruction
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: this.env.GROQ_TEMPERATURE,
          max_tokens: this.env.GROQ_MAX_OUTPUT_TOKENS,
          response_format: responseFormat,
        });

        // Extract response
        const choice = response.choices[0];
        if (!choice || !choice.message || !choice.message.content) {
          throw new Error("PROVIDER_INVALID_OUTPUT: Empty response from model");
        }

        const rawText = choice.message.content.trim();

        // Parse JSON
        let structured: ModelStructuredOutput;
        try {
          structured = JSON.parse(rawText);
          
          // Fallback for missing answerMode (model inconsistency workaround)
          if (!structured.answerMode) {
            structured.answerMode = hasRagContext ? "RAG_GROUNDED" : "GENERAL_SPACE_KNOWLEDGE";
            logger.warn("Missing answerMode in response, using fallback", {
              requestId: input.requestId,
              fallbackMode: structured.answerMode,
            });
          }
        } catch (parseError) {
          logger.error("JSON parse failure from Groq", {
            requestId: input.requestId,
            error: parseError instanceof Error ? parseError.message : String(parseError),
            preview: rawText.substring(0, 200),
          });
          throw new Error("PROVIDER_INVALID_OUTPUT: Failed to parse JSON response");
        }

        // Validate schema
        this.validateStructuredOutput(structured);

        // Validate citations (only if citations are provided)
        if (structured.citationIds.length > 0) {
          const allCitationIds = this.extractAllCitationIds(structured);
          const validation = validateCitationIds(allCitationIds, allowedCitationIds);

          if (!validation.valid) {
            logger.warn("Unknown citation IDs detected", {
              requestId: input.requestId,
              unknownIds: validation.unknownIds,
              attempt,
            });

            // Allow one repair attempt
            if (attempt < this.env.GROQ_MAX_RETRIES) {
              attempt++;
              continue;
            }

            // Filter out unknown citations
            const validCitationIds = filterValidCitations(allCitationIds, allowedCitationIds);
            
            // Update structured output with valid citations only
            structured.citationIds = validCitationIds;
          }
        }

        // Build public sources (only for valid citations)
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
            model: this.model,
            tokensUsed: response.usage?.total_tokens,
            answerMode: structured.answerMode,
          },
        };
      } catch (error) {
        lastError = error as Error;

        // Check if retryable
        if (this.isRetryableError(error)) {
          attempt++;
          if (attempt <= this.env.GROQ_MAX_RETRIES) {
            logger.warn("Groq call failed, retrying", {
              requestId: input.requestId,
              attempt,
              error: lastError.message,
            });
            continue;
          }
        }

        // Map and throw error
        throw this.mapGroqError(error);
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

    if (!output.answerMode || typeof output.answerMode !== "string") {
      throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid answerMode");
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
    if (message.includes("rate limit")) return true;
    
    // Non-retryable
    if (message.includes("auth")) return false;
    if (message.includes("invalid_api_key")) return false;
    if (message.includes("aborted")) return false;
    
    return false;
  }

  /**
   * Map Groq errors to standard error codes
   */
  private mapGroqError(error: unknown): Error {
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
