/**
 * In-Memory Rate Limiter
 * 
 * Simple in-memory rate limiting for local development.
 * 
 * LIMITATIONS:
 * - Process-local only (not shared across serverless instances)
 * - Lost on server restart
 * - Not suitable for production distributed deployments
 * 
 * For production, replace with Redis-based implementation in Phase 8.
 */

import type { RateLimiter, RateLimitInput, RateLimitResult } from "./types";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  async check(input: RateLimitInput): Promise<RateLimitResult> {
    const now = Math.floor(Date.now() / 1000);
    const entry = this.store.get(input.key);

    // No existing entry or expired entry
    if (!entry || entry.resetAt <= now) {
      const resetAt = now + input.windowSeconds;
      this.store.set(input.key, { count: 1, resetAt });
      
      return {
        allowed: true,
        remaining: input.limit - 1,
        resetAt,
      };
    }

    // Entry exists and not expired
    if (entry.count < input.limit) {
      entry.count++;
      this.store.set(input.key, entry);
      
      return {
        allowed: true,
        remaining: input.limit - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries to prevent memory growth
   */
  private cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.store.delete(key);
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Singleton instance for the application
let rateLimiterInstance: InMemoryRateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new InMemoryRateLimiter();
  }
  return rateLimiterInstance;
}
