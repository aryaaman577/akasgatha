/**
 * Concurrent Request Limiter
 * 
 * Limits the number of concurrent expensive operations (e.g., AI calls)
 * to prevent resource exhaustion and DoS attacks.
 * 
 * Phase 7: Security Hardening
 */

export interface ConcurrencyLimiter {
  /**
   * Acquire a slot for concurrent execution
   * @returns Promise that resolves when a slot is available, or rejects if limit exceeded
   */
  acquire(key: string): Promise<void>;

  /**
   * Release a slot after execution completes
   */
  release(key: string): void;

  /**
   * Get current concurrent count for a key
   */
  getCount(key: string): number;
}

export class InMemoryConcurrencyLimiter implements ConcurrencyLimiter {
  private counts = new Map<string, number>();
  private readonly maxConcurrent: number;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async acquire(key: string): Promise<void> {
    const current = this.counts.get(key) || 0;

    if (current >= this.maxConcurrent) {
      throw new Error(`Concurrent request limit exceeded (max: ${this.maxConcurrent})`);
    }

    this.counts.set(key, current + 1);
  }

  release(key: string): void {
    const current = this.counts.get(key) || 0;
    const newCount = Math.max(0, current - 1);

    if (newCount === 0) {
      this.counts.delete(key);
    } else {
      this.counts.set(key, newCount);
    }
  }

  getCount(key: string): number {
    return this.counts.get(key) || 0;
  }
}

// Singleton instance
let concurrencyLimiterInstance: InMemoryConcurrencyLimiter | null = null;

export function getConcurrencyLimiter(): ConcurrencyLimiter {
  if (!concurrencyLimiterInstance) {
    // Allow 5 concurrent AI requests per instance
    concurrencyLimiterInstance = new InMemoryConcurrencyLimiter(5);
  }
  return concurrencyLimiterInstance;
}

