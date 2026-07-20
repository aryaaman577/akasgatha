/**
 * Jigyasa Provider Router with Fallback
 * 
 * Central orchestrator that manages primary and fallback providers.
 * Implements single RAG execution and controlled fallback logic.
 * 
 * Phase 5 - Gate A
 */

import type { JigyasaProvider, ProviderInput, ProviderOutput } from "./types";
import { GroqProvider } from "./groq-provider";
import { CerebrasProvider } from "./cerebras-provider";
import { getServerEnv } from "../env";
import { categorizeError } from "./provider-errors";
import { logger } from "../utils/logger";

export interface RouterOutput extends ProviderOutput {
  meta: ProviderOutput["meta"] & {
    provider: string;
    fallbackUsed: boolean;
    providerAttempts: number;
    primaryProvider: string;
    fallbackProvider: string | null | undefined;
  };
}

export class JigyasaProviderRouter {
  private primaryProvider: JigyasaProvider | null = null;
  private fallbackProvider: JigyasaProvider | null = null;
  private env: ReturnType<typeof getServerEnv>;

  constructor() {
    this.env = getServerEnv();
    this.initializeProviders();
  }

  /**
   * Initialize primary and fallback providers based on configuration
   */
  private initializeProviders(): void {
    // Initialize primary provider
    try {
      switch (this.env.AI_PROVIDER) {
        case "groq":
          this.primaryProvider = new GroqProvider();
          break;
        case "cerebras":
          this.primaryProvider = new CerebrasProvider();
          break;
        case "mock":
        case "gemini":
        case "openrouter":
          // These providers don't support fallback yet
          this.primaryProvider = null;
          break;
        default:
          this.primaryProvider = null;
      }
    } catch (error) {
      logger.error("Failed to initialize primary provider", {
        provider: this.env.AI_PROVIDER,
        error: error instanceof Error ? error.message : String(error),
      });
      this.primaryProvider = null;
    }

    // Initialize fallback provider if configured
    if (this.env.AI_FALLBACK_PROVIDER && this.env.AI_FALLBACK_PROVIDER !== "none") {
      try {
        switch (this.env.AI_FALLBACK_PROVIDER) {
          case "cerebras":
            // Only create fallback if it's different from primary
            if (this.env.AI_PROVIDER !== "cerebras") {
              this.fallbackProvider = new CerebrasProvider();
            }
            break;
          case "mock":
            // Mock not supported as fallback in production
            this.fallbackProvider = null;
            break;
          default:
            this.fallbackProvider = null;
        }
      } catch (error) {
        logger.error("Failed to initialize fallback provider", {
          provider: this.env.AI_FALLBACK_PROVIDER,
          error: error instanceof Error ? error.message : String(error),
        });
        this.fallbackProvider = null;
      }
    }
  }

  /**
   * Generate answer with automatic fallback
   */
  async generate(input: ProviderInput): Promise<RouterOutput> {
    if (!this.primaryProvider) {
      throw new Error("No primary provider configured");
    }

    const primaryProviderName = this.primaryProvider.name;
    const fallbackProviderName = this.fallbackProvider?.name || null;

    // Attempt 1: Primary provider
    try {
      logger.info("Attempting primary provider", {
        requestId: input.requestId,
        provider: primaryProviderName,
      });

      const result = await this.primaryProvider.generate(input);

      // Success with primary
      return {
        ...result,
        meta: {
          ...result.meta,
          provider: primaryProviderName,
          fallbackUsed: false,
          providerAttempts: 1,
          primaryProvider: primaryProviderName,
          fallbackProvider: fallbackProviderName || undefined,
        },
      };
    } catch (error) {
      const categorized = categorizeError(error, primaryProviderName);

      logger.warn("Primary provider failed", {
        requestId: input.requestId,
        provider: primaryProviderName,
        category: categorized.category,
        fallbackAllowed: categorized.fallbackAllowed,
        error: categorized.message,
      });

      // Check if fallback is allowed and available
      if (!categorized.fallbackAllowed) {
        logger.info("Fallback not allowed for this error category", {
          requestId: input.requestId,
          category: categorized.category,
        });
        throw categorized;
      }

      if (!this.fallbackProvider) {
        logger.info("No fallback provider configured", {
          requestId: input.requestId,
        });
        throw categorized;
      }

      // Check abort signal before attempting fallback
      if (input.signal.aborted) {
        logger.info("Request aborted, skipping fallback", {
          requestId: input.requestId,
        });
        throw categorized;
      }

      // Attempt 2: Fallback provider
      try {
        logger.info("Attempting fallback provider", {
          requestId: input.requestId,
          provider: fallbackProviderName || "fallback",
        });

        const result = await this.fallbackProvider.generate(input);

        // Success with fallback
        return {
          ...result,
          meta: {
            ...result.meta,
            provider: fallbackProviderName || "unknown",
            fallbackUsed: true,
            providerAttempts: 2,
            primaryProvider: primaryProviderName,
            fallbackProvider: fallbackProviderName || undefined,
          },
        };
      } catch (fallbackError) {
        const categorizedFallback = categorizeError(fallbackError, fallbackProviderName || "fallback");

        logger.error("Fallback provider also failed", {
          requestId: input.requestId,
          provider: fallbackProviderName || "fallback",
          category: categorizedFallback.category,
          error: categorizedFallback.message,
        });

        // Return the fallback error (more recent)
        throw categorizedFallback;
      }
    }
  }

  /**
   * Get provider configuration info
   */
  getProviderInfo() {
    return {
      primary: this.primaryProvider?.name || null,
      fallback: this.fallbackProvider?.name || null,
      primaryConfigured: !!this.primaryProvider,
      fallbackConfigured: !!this.fallbackProvider,
    };
  }
}

// Singleton instance
let routerInstance: JigyasaProviderRouter | null = null;

/**
 * Get singleton router instance
 */
export function getProviderRouter(): JigyasaProviderRouter {
  if (!routerInstance) {
    routerInstance = new JigyasaProviderRouter();
  }
  return routerInstance;
}
