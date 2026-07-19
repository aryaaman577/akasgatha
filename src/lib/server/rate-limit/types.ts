/**
 * Rate Limiter Types and Interface
 * 
 * Defines the contract for rate limiting implementations.
 * Phase 4A uses in-memory implementation suitable for local development.
 * Production deployments should replace with Redis/Upstash or similar.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp in seconds
}

export interface RateLimitInput {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimiter {
  check(input: RateLimitInput): Promise<RateLimitResult>;
}
