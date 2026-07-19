/**
 * Timeout and Abort Utilities
 * 
 * Combines request timeout with abort controller for safe cancellation.
 */

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class AbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AbortError";
  }
}

/**
 * Create an abort controller that times out after the specified duration
 */
export function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort(new TimeoutError(`Request timeout after ${timeoutMs}ms`));
  }, timeoutMs);

  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  return { controller, cleanup };
}

/**
 * Combine multiple abort signals into one
 */
export function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      break;
    }
    
    signal.addEventListener("abort", () => {
      controller.abort(signal.reason);
    }, { once: true });
  }

  return controller.signal;
}

/**
 * Check if an error is an abort/timeout error
 */
export function isAbortError(error: unknown): boolean {
  return (
    error instanceof AbortError ||
    error instanceof TimeoutError ||
    (error instanceof Error && error.name === "AbortError") ||
    (error instanceof Error && error.name === "TimeoutError") ||
    (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError")
  );
}
