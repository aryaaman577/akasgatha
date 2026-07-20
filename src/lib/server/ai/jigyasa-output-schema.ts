/**
 * Jigyasa Shared Output Schema
 * 
 * Canonical structured output schema used by all providers (Groq, Cerebras).
 * This ensures consistent response format regardless of which provider generates the answer.
 */

/**
 * Expected structured output from the model
 */
export interface JigyasaStructuredOutput {
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

/**
 * Get JSON Schema for structured output (Groq format)
 * Used by Groq provider with strict: false
 */
export function getGroqResponseFormat() {
  return {
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
}

/**
 * Get JSON Schema for structured output (Cerebras format)
 * Used by Cerebras provider with strict: true
 */
export function getCerebrasResponseFormat() {
  return {
    type: "json_schema" as const,
    json_schema: {
      name: "jigyasa_response",
      strict: true, // Cerebras requires strict mode
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
}

/**
 * Validate structured output schema
 * Throws on invalid schema
 */
export function validateStructuredOutput(output: unknown): JigyasaStructuredOutput {
  if (typeof output !== "object" || output === null) {
    throw new Error("PROVIDER_INVALID_OUTPUT: Response is not an object");
  }

  const o = output as Record<string, unknown>;

  if (!o.shortAnswer || typeof o.shortAnswer !== "string") {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid shortAnswer");
  }

  if (typeof o.katha !== "string" || typeof o.vigyan !== "string") {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid katha/vigyan");
  }

  if (!Array.isArray(o.pramaan)) {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid pramaan array");
  }

  // Validate each pramaan item
  for (const p of o.pramaan) {
    if (typeof p !== "object" || p === null) {
      throw new Error("PROVIDER_INVALID_OUTPUT: Invalid pramaan item");
    }
    const item = p as Record<string, unknown>;
    if (typeof item.text !== "string") {
      throw new Error("PROVIDER_INVALID_OUTPUT: Invalid pramaan item text");
    }
    if (!Array.isArray(item.citationIds)) {
      throw new Error("PROVIDER_INVALID_OUTPUT: Invalid pramaan item citationIds");
    }
  }

  if (!o.uncertainty || typeof o.uncertainty !== "string") {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid uncertainty");
  }

  if (!Array.isArray(o.citationIds)) {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid citationIds array");
  }

  if (!Array.isArray(o.followUps)) {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid followUps array");
  }

  if (!o.answerMode || typeof o.answerMode !== "string") {
    throw new Error("PROVIDER_INVALID_OUTPUT: Missing or invalid answerMode");
  }

  // All validation passed - safe to cast
  return o as unknown as JigyasaStructuredOutput;
}

/**
 * Extract all citation IDs from structured output
 */
export function extractAllCitationIds(output: JigyasaStructuredOutput): string[] {
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
