/**
 * Cerebras AI Provider
 * 
 * Real AI provider using Cerebras Cloud SDK with gpt-oss-120b model.
 * Implements strict structured output, RAG grounding, citation validation,
 * and hybrid knowledge mode.
 * 
 * Phase 5 - Gate A
 */

import type { JigyasaProvider, ProviderInput, ProviderOutput, ProviderHealth } from "./types";
import { getCerebrasClient, isCerebrasConfigured } from "./cerebras-client";
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
import {
  validateStructuredOutput,
  extractAllCitationIds,
  getCerebrasResponseFormat,
  type JigyasaStructuredOutput,
} from "./jigyasa-output-schema";
import { categorizeError, createProviderError } from "./provider-errors";
import { logger } from "../utils/logger";

export class CerebrasProvider implements JigyasaProvider {
  readonly name = "cerebras";
  private env: ReturnType<typeof getServerEnv>;

  constructor() {
    this.env = getServerEnv();
    
    if (!this.env.CEREBRAS_API_KEY) {
      throw new Error("CEREBRAS_API_KEY is required for Cerebras provider");
    }
    
    if (!this.env.CEREBRAS_MODEL) {
      throw new Error("CEREBRAS_MODEL is required for Cerebras provider");
    }
  }

  async generate(input: ProviderInput): Promise<ProviderOutput> {
    const startTime = Date.now();
    const client = getCerebrasClient();

    // Check RAG context availability
    const hasRagContext = !!(input.ragContext && input.ragContext.totalResults > 0);
    const contextSufficient = isContextSufficient(input.ragContext || null, this.env.JIGYASA_MIN_RAG_RESULTS);

    // In hybrid mode, allow general answers even without RAG
    // In strict mode, require RAG context
    if (this.env.JIGYASA_KNOWLEDGE_MODE === "strict" && !contextSufficient) {
      throw createProviderError(
        "INSUFFICIENT_KNOWLEDGE",
        this.name,
        "INSUFFICIENT_KNOWLEDGE: No relevant knowledge found in corpus"
      );
    }

    // Build citation map and allowed IDs
    const citationMap = input.ragContext ? buildCitationMap(input.ragContext) : {};
    const allowedCitationIds = getAllowedCitationIds(citationMap);

    // Build system instruction (reuse Groq's system prompt)
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

    // Get strict JSON schema for Cerebras
    const responseFormat = getCerebrasResponseFormat();

    // Attempt generation with optional schema repair
    let schemaRepairAttempted = false;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // Respect abort signal
        if (input.signal.aborted) {
          throw createProviderError(
            "ABORTED",
            this.name,
            "REQUEST_ABORTED: Request aborted by client"
          );
        }

        // Optional Cerebras API version header
        const headers: Record<string, string> = {};
        if (this.env.CEREBRAS_VERSION_PATCH) {
          headers["X-Cerebras-Version-Patch"] = String(this.env.CEREBRAS_VERSION_PATCH);
        }

        // Call Cerebras API (headers not yet supported in SDK types)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await client.chat.completions.create({
          model: this.env.CEREBRAS_MODEL!,
          messages: [
            {
              role: "system",
              content: systemInstruction
            },
            {
              role: "user",
              content: schemaRepairAttempted
                ? "Your previous response had JSON schema errors. Please fix the schema and try again. Do not change the factual content or invent new citations."
                : userMessage
            }
          ],
          temperature: this.env.CEREBRAS_TEMPERATURE,
          max_completion_tokens: this.env.CEREBRAS_MAX_OUTPUT_TOKENS,
          response_format: responseFormat,
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        // Extract response (SDK types not yet complete)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const choice = (response as any).choices?.[0];
        if (!choice || !choice.message || !choice.message.content) {
          throw createProviderError(
            "MALFORMED_OUTPUT",
            this.name,
            "PROVIDER_INVALID_OUTPUT: Empty response from model"
          );
        }

        const rawText = choice.message.content.trim();

        // Parse JSON
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawText);
        } catch (parseError) {
          logger.error("JSON parse failure from Cerebras", {
            requestId: input.requestId,
            error: parseError instanceof Error ? parseError.message : String(parseError),
            preview: rawText.substring(0, 200),
          });
          
          // Allow one schema repair attempt
          if (!schemaRepairAttempted) {
            schemaRepairAttempted = true;
            logger.warn("Attempting schema repair", { requestId: input.requestId });
            continue;
          }
          
          throw createProviderError(
            "MALFORMED_OUTPUT",
            this.name,
            "PROVIDER_INVALID_OUTPUT: Failed to parse JSON response"
          );
        }

        // Validate schema
        let structured: JigyasaStructuredOutput;
        try {
          structured = validateStructuredOutput(parsed);
        } catch (validationError) {
          logger.error("Schema validation failure from Cerebras", {
            requestId: input.requestId,
            error: validationError instanceof Error ? validationError.message : String(validationError),
          });
          
          // Allow one schema repair attempt
          if (!schemaRepairAttempted) {
            schemaRepairAttempted = true;
            logger.warn("Attempting schema repair", { requestId: input.requestId });
            continue;
          }
          
          throw validationError;
        }

        // Fallback for missing answerMode
        if (!structured.answerMode) {
          structured.answerMode = hasRagContext ? "RAG_GROUNDED" : "GENERAL_SPACE_KNOWLEDGE";
          logger.warn("Missing answerMode in response, using fallback", {
            requestId: input.requestId,
            fallbackMode: structured.answerMode,
          });
        }

        // Validate citations (only if citations are provided)
        if (structured.citationIds.length > 0) {
          const allCitationIds = extractAllCitationIds(structured);
          const validation = validateCitationIds(allCitationIds, allowedCitationIds);

          if (!validation.valid) {
            logger.warn("Unknown citation IDs detected from Cerebras", {
              requestId: input.requestId,
              unknownIds: validation.unknownIds,
            });

            // Filter out unknown citations
            const validCitationIds = filterValidCitations(allCitationIds, allowedCitationIds);
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokensUsed = (response as any).usage?.total_tokens;

        return {
          answer,
          meta: {
            durationMs,
            model: this.env.CEREBRAS_MODEL,
            tokensUsed,
            answerMode: structured.answerMode,
          },
        };
      } catch (error) {
        lastError = error as Error;

        // If this was a schema repair attempt and it failed, throw
        if (schemaRepairAttempted) {
          throw categorizeError(error, this.name);
        }

        // Check if we should attempt schema repair
        const categorized = categorizeError(error, this.name);
        if (categorized.category === "MALFORMED_OUTPUT" && !schemaRepairAttempted) {
          schemaRepairAttempted = true;
          logger.warn("Attempting schema repair after malformed output", {
            requestId: input.requestId,
          });
          continue;
        }

        // Not a schema issue, throw immediately
        throw categorized;
      }
    }

    // Should not reach here, but if we do, throw last error
    throw categorizeError(lastError || new Error("Unknown error"), this.name);
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      return {
        configured: isCerebrasConfigured(),
        available: true,
        mock: false,
      };
    } catch {
      return {
        configured: false,
        available: false,
        mock: false,
      };
    }
  }
}
