/**
 * RAG Frontmatter Schema Validation
 * 
 * Zod schemas for validating document frontmatter.
 * Phase 4B-1: Strict validation rules
 */

import { z } from "zod";

/**
 * Domain enum
 */
export const domainSchema = z.enum(["science", "narrative", "boundary", "glossary"], {
  message: "domain must be one of: science, narrative, boundary, glossary",
});

/**
 * Source type enum
 */
export const sourceTypeSchema = z.enum(
  ["official", "academic", "primary-text", "reference", "internal-policy"],
  {
    message: "sourceType must be one of: official, academic, primary-text, reference, internal-policy",
  }
);

/**
 * Language enum
 */
export const languageSchema = z.enum(["en", "hi"], {
  message: "language must be one of: en, hi",
});

/**
 * ID validation - lowercase kebab-case preferred
 */
const idSchema = z
  .string()
  .min(1, "id is required")
  .regex(/^[a-z0-9-]+$/, "id must be lowercase letters, numbers, and hyphens only")
  .refine((val) => !val.includes("/") && !val.includes("\\"), "id must not contain path separators");

/**
 * URL validation - must be http/https or empty with justification
 */
const urlSchema = z
  .string()
  .refine(
    (val) => {
      if (!val) return true; // Empty allowed for internal-policy
      return val.startsWith("http://") || val.startsWith("https://");
    },
    { message: "sourceUrl must start with http:// or https://, or be empty for internal-policy" }
  );

/**
 * Date validation - YYYY-MM-DD format, not in future
 */
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "reviewedAt must be in YYYY-MM-DD format")
  .refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      now.setHours(23, 59, 59, 999); // End of today
      return date <= now;
    },
    { message: "reviewedAt cannot be in the future" }
  );

/**
 * Complete frontmatter schema
 */
export const frontmatterSchema = z
  .object({
    // Required fields
    id: idSchema,
    title: z.string().min(1, "title is required").max(200, "title too long"),
    domain: domainSchema,
    topic: z.string().min(1, "topic is required").max(50, "topic too long"),
    language: languageSchema,
    sourceName: z.string().min(1, "sourceName is required"),
    sourceUrl: urlSchema,
    sourceType: sourceTypeSchema,
    reviewedAt: dateSchema,
    licenseNote: z.string().min(1, "licenseNote is required"),

    // Optional fields
    author: z.string().optional(),
    publishedAt: z.string().optional(),
    version: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedTopics: z.array(z.string()).optional(),
    culturalRegion: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict(); // Reject unknown fields

/**
 * Additional validation rules beyond schema
 */
export function validateFrontmatterRules(
  frontmatter: z.infer<typeof frontmatterSchema>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Science domain must have URL
  if (frontmatter.domain === "science" && !frontmatter.sourceUrl) {
    errors.push("science domain documents must have a valid sourceUrl");
  }

  // Internal policy can omit URL
  if (frontmatter.sourceType === "internal-policy" && frontmatter.sourceUrl && frontmatter.sourceUrl !== "") {
    errors.push("internal-policy should either have no sourceUrl or an empty string");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
