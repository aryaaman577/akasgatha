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

/**
 * Raw output from Gemini (may use creative field names)
 */
interface RawModelOutput {
  [key: string]: unknown;
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

    const hasRagContext = !!(input.ragContext && input.ragContext.totalResults > 0);
    const contextSufficient = isContextSufficient(input.ragContext || null, this.env.JIGYASA_MIN_RAG_RESULTS);
    const allowGeneralSpace = this.env.JIGYASA_ALLOW_GENERAL_SPACE_ANSWERS && !this.env.JIGYASA_REQUIRE_RAG_FOR_ALL_ANSWERS;

    if (this.env.JIGYASA_KNOWLEDGE_MODE === "strict" && !contextSufficient && !allowGeneralSpace) {
      throw new Error("INSUFFICIENT_KNOWLEDGE: No relevant knowledge found in corpus");
    }

    const answerMode = hasRagContext 
      ? (contextSufficient ? "RAG_GROUNDED" : "HYBRID") 
      : "GENERAL_SPACE_KNOWLEDGE";

    // Build citation map and allowed IDs
    const citationMap = input.ragContext && hasRagContext ? buildCitationMap(input.ragContext) : {};
    const allowedCitationIds = getAllowedCitationIds(citationMap);

    // Build system instruction
    const systemInstruction = buildSystemInstruction(allowedCitationIds);

    // Build context
    const groupedContext = input.ragContext && hasRagContext
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
        responseSchema: {
          type: "object" as const,
          properties: {
            shortAnswer: {
              type: "string" as const,
              description: "One sentence direct answer in the requested language"
            },
            katha: {
              type: "string" as const,
              description: "Cultural narrative or empty string"
            },
            vigyan: {
              type: "string" as const,
              description: "Scientific explanation or empty string"
            },
            pramaan: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  text: {
                    type: "string" as const,
                    description: "Evidence statement"
                  },
                  citationIds: {
                    type: "array" as const,
                    items: {
                      type: "string" as const
                    },
                    description: "Citation IDs from allowed list"
                  }
                },
                required: ["text", "citationIds"]
              },
              description: "Array of evidence statements with citations"
            },
            uncertainty: {
              type: "string" as const,
              description: "Confidence and limitations"
            },
            citationIds: {
              type: "array" as const,
              items: {
                type: "string" as const
              },
              description: "All citation IDs used"
            },
            followUps: {
              type: "array" as const,
              items: {
                type: "string" as const
              },
              description: "2-4 follow-up questions"
            }
          },
          required: ["shortAnswer", "katha", "vigyan", "pramaan", "uncertainty", "citationIds", "followUps"]
        }
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

        // Get full text from response
        const rawText = response.text.trim();
        
        // Log response length for debugging
        logger.info("Gemini response received", {
          requestId: input.requestId,
          textLength: rawText.length,
          hasContent: rawText.length > 0,
        });

        // Parse structured output
        let structured: ModelStructuredOutput;
        
        try {
          // Try to parse JSON (strip markdown code blocks if present)
          let jsonText = rawText;
          
          // Remove markdown code blocks if present
          if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
          }
          
          // Parse JSON
          let rawOutput: RawModelOutput;
          try {
            rawOutput = JSON.parse(jsonText);
          } catch (parseErr) {
            // Try cleaning up common JSON formatting issues
            // Replace smart quotes with regular quotes
            jsonText = jsonText.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
            // Try parsing again
            rawOutput = JSON.parse(jsonText);
          }
          
          // Normalize field names to expected schema
          structured = this.normalizeFieldNames(rawOutput);
        } catch (parseError) {
          // Log more details for debugging
          logger.error("JSON parse failure details", {
            requestId: input.requestId,
            textLength: rawText.length,
            firstChars: rawText.substring(0, 100),
            lastChars: rawText.substring(Math.max(0, rawText.length - 100)),
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
          });
          throw new Error("PROVIDER_INVALID_OUTPUT: Failed to parse JSON response");
        }

        // Validate schema
        this.validateStructuredOutput(structured);

        // Validate citations
        const allCitationIds = this.extractAllCitationIds(structured);
        
        if (allowedCitationIds.length === 0) {
          // GENERAL_SPACE_KNOWLEDGE mode: enforce empty citations
          structured.citationIds = [];
          structured.pramaan = structured.pramaan.map(p => ({ ...p, citationIds: [] }));
        } else {
          const validation = validateCitationIds(allCitationIds, allowedCitationIds);

          if (!validation.valid) {
            logger.warn("Unknown citation IDs detected", {
              requestId: input.requestId,
              unknownIds: validation.unknownIds,
              attempt,
            });

            // Filter out unknown citations
            const validCitationIds = filterValidCitations(allCitationIds, allowedCitationIds);
            structured.citationIds = validCitationIds;
            structured.pramaan = structured.pramaan.map(p => ({
              ...p,
              citationIds: filterValidCitations(p.citationIds || [], allowedCitationIds),
            }));
          }
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
            answerMode,
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
   * Normalize field names from Gemini's creative variations to expected schema
   */
  private normalizeFieldNames(raw: RawModelOutput): ModelStructuredOutput {
    const normalized: Partial<ModelStructuredOutput> = {};

    // Normalize shortAnswer (common variations)
    const shortAnswerKey = this.findKey(raw, ["shortAnswer", "short_answer", "answer", "directAnswer", "brief"]);
    normalized.shortAnswer = shortAnswerKey && typeof raw[shortAnswerKey] === "string" 
      ? raw[shortAnswerKey] as string 
      : "";

    // Normalize katha (common variations)
    const kathaKey = this.findKey(raw, ["katha", "katha_narrative", "mythological_perspective", "mythology", "narrative", "cultural_context"]);
    normalized.katha = kathaKey && typeof raw[kathaKey] === "string"
      ? raw[kathaKey] as string
      : "";

    // Normalize vigyan (common variations)
    const vigyanKey = this.findKey(raw, ["vigyan", "vigyan_scientific_explanation", "science", "scientific_explanation", "scientific"]);
    normalized.vigyan = vigyanKey && typeof raw[vigyanKey] === "string"
      ? raw[vigyanKey] as string
      : "";

    // Normalize pramaan (common variations)
    const pramaanKey = this.findKey(raw, ["pramaan", "evidence", "proof", "supporting_evidence"]);
    const pramaanArray = pramaanKey && Array.isArray(raw[pramaanKey]) ? raw[pramaanKey] as unknown[] : [];
    
    // Normalize each pramaan item
    normalized.pramaan = pramaanArray.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = item as Record<string, unknown>;
        const textKey = this.findKey(itemObj, ["text", "statement", "evidence"]);
        const citationKey = this.findKey(itemObj, ["citationIds", "citations", "sources"]);
        
        return {
          text: textKey && typeof itemObj[textKey] === "string" ? itemObj[textKey] as string : "",
          citationIds: citationKey && Array.isArray(itemObj[citationKey]) ? itemObj[citationKey] as string[] : [],
        };
      }
      return { text: "", citationIds: [] };
    });

    // Normalize uncertainty (common variations)
    const uncertaintyKey = this.findKey(raw, ["uncertainty", "confidence", "limitations", "caveats"]);
    normalized.uncertainty = uncertaintyKey && typeof raw[uncertaintyKey] === "string"
      ? raw[uncertaintyKey] as string
      : "";

    // Normalize citationIds (common variations)
    const citationIdsKey = this.findKey(raw, ["citationIds", "citations", "sources", "references"]);
    normalized.citationIds = citationIdsKey && Array.isArray(raw[citationIdsKey])
      ? raw[citationIdsKey] as string[]
      : [];

    // Normalize followUps (common variations)
    const followUpsKey = this.findKey(raw, ["followUps", "follow_ups", "followup_questions", "related_questions", "suggestions"]);
    normalized.followUps = followUpsKey && Array.isArray(raw[followUpsKey])
      ? raw[followUpsKey] as string[]
      : [];

    return normalized as ModelStructuredOutput;
  }

  /**
   * Find first matching key in object (case-insensitive)
   */
  private findKey(obj: Record<string, unknown>, candidates: string[]): string | null {
    // First try exact match
    for (const candidate of candidates) {
      if (candidate in obj) {
        return candidate;
      }
    }

    // Then try case-insensitive match
    const lowerKeys = Object.keys(obj).map(k => k.toLowerCase());
    for (const candidate of candidates) {
      const lowerCandidate = candidate.toLowerCase();
      const index = lowerKeys.indexOf(lowerCandidate);
      if (index !== -1) {
        return Object.keys(obj)[index];
      }
    }

    return null;
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
