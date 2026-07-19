/**
 * Frontmatter Parsing and Validation
 * 
 * Parse markdown frontmatter and validate against schema.
 * Phase 4B-1: Document discovery and validation
 */

import * as fs from "fs/promises";
import * as path from "path";
import matter from "gray-matter";
import { frontmatterSchema, validateFrontmatterRules } from "./schema";
import type { ValidatedDocument, ValidationError, ValidationResult } from "./types";
import { createHash } from "crypto";

/**
 * Discover all markdown files in corpus directory
 */
export async function discoverCorpusFiles(corpusDir: string): Promise<string[]> {
  const files: string[] = [];

  async function scanDirectory(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await scanDirectory(corpusDir);
  return files.sort(); // Deterministic ordering
}

/**
 * Parse and validate a single document
 */
export async function parseAndValidateDocument(
  filePath: string
): Promise<{ document?: ValidatedDocument; errors: ValidationError[] }> {
  const errors: ValidationError[] = [];

  try {
    // Read file
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Parse frontmatter
    const { data, content } = matter(fileContent);

    // Validate with Zod
    const validationResult = frontmatterSchema.safeParse(data);

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        errors.push({
          filePath,
          documentId: data.id as string | undefined,
          field: issue.path.join(".") || "frontmatter",
          message: issue.message,
        });
      });
      return { errors };
    }

    const frontmatter = validationResult.data;

    // Additional validation rules
    const rulesValidation = validateFrontmatterRules(frontmatter);
    if (!rulesValidation.valid) {
      rulesValidation.errors.forEach((error) => {
        errors.push({
          filePath,
          documentId: frontmatter.id,
          field: "validation-rule",
          message: error,
        });
      });
      return { errors };
    }

    // Validate content not empty
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      errors.push({
        filePath,
        documentId: frontmatter.id,
        field: "content",
        message: "document content cannot be empty",
      });
      return { errors };
    }

    // Check for suspicious executable content
    if (/<script/i.test(content) || /javascript:/i.test(content)) {
      errors.push({
        filePath,
        documentId: frontmatter.id,
        field: "content",
        message: "document contains suspicious executable markup",
      });
      return { errors };
    }

    // Hash content for change detection
    const contentHash = createHash("sha256")
      .update(trimmedContent)
      .digest("hex")
      .slice(0, 16);

    return {
      document: {
        filePath,
        frontmatter,
        content: trimmedContent,
        contentHash,
      },
      errors: [],
    };
  } catch (error) {
    errors.push({
      filePath,
      field: "file-read",
      message: error instanceof Error ? error.message : "unknown error reading file",
    });
    return { errors };
  }
}

/**
 * Validate entire corpus
 */
export async function validateCorpus(corpusDir: string): Promise<ValidationResult> {
  const files = await discoverCorpusFiles(corpusDir);
  const documents: ValidatedDocument[] = [];
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const duplicateIds: string[] = [];

  // Parse and validate each file
  for (const file of files) {
    const result = await parseAndValidateDocument(file);

    if (result.document) {
      // Check for duplicate IDs
      if (seenIds.has(result.document.frontmatter.id)) {
        duplicateIds.push(result.document.frontmatter.id);
        errors.push({
          filePath: file,
          documentId: result.document.frontmatter.id,
          field: "id",
          message: "duplicate document ID",
        });
      } else {
        seenIds.add(result.document.frontmatter.id);
        documents.push(result.document);
      }
    }

    errors.push(...result.errors);
  }

  // Calculate stats
  const stats = {
    totalFiles: files.length,
    validDocuments: documents.length,
    scienceCount: documents.filter((d) => d.frontmatter.domain === "science").length,
    narrativeCount: documents.filter((d) => d.frontmatter.domain === "narrative").length,
    boundaryCount: documents.filter((d) => d.frontmatter.domain === "boundary").length,
    glossaryCount: documents.filter((d) => d.frontmatter.domain === "glossary").length,
    duplicateIds: Array.from(new Set(duplicateIds)),
  };

  return {
    valid: errors.length === 0 && documents.length > 0,
    documents,
    errors,
    stats,
  };
}
