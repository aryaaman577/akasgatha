/**
 * Provider Error Categories
 * 
 * Normalized error categories used across all providers.
 * Helps determine retry and fallback behavior.
 */

export type ProviderErrorCategory =
  | "AUTHENTICATION"
  | "PERMISSION_DENIED"
  | "RATE_LIMIT"
  | "TIMEOUT"
  | "CONNECTION"
  | "PROVIDER_UNAVAILABLE"
  | "SERVER_ERROR"
  | "MALFORMED_OUTPUT"
  | "SCHEMA_VALIDATION"
  | "CITATION_VALIDATION"
  | "SAFETY_BLOCK"
  | "ABORTED"
  | "CONFIGURATION"
  | "INSUFFICIENT_KNOWLEDGE"
  | "OUT_OF_SCOPE"
  | "UNKNOWN";

export interface ProviderError extends Error {
  category: ProviderErrorCategory;
  provider: string;
  model?: string;
  retryable: boolean;
  fallbackAllowed: boolean;
  stage?: string;
}

/**
 * Create a normalized provider error
 */
export function createProviderError(
  category: ProviderErrorCategory,
  provider: string,
  message: string,
  options?: {
    model?: string;
    stage?: string;
    cause?: Error;
  }
): ProviderError {
  const error = new Error(message) as ProviderError;
  error.category = category;
  error.provider = provider;
  error.model = options?.model;
  error.stage = options?.stage;
  error.cause = options?.cause;
  
  // Determine retry and fallback behavior
  error.retryable = isRetryableCategory(category);
  error.fallbackAllowed = isFallbackAllowedCategory(category);
  
  return error;
}

/**
 * Check if error category is retryable within the same provider
 */
function isRetryableCategory(category: ProviderErrorCategory): boolean {
  switch (category) {
    case "RATE_LIMIT":
    case "TIMEOUT":
    case "CONNECTION":
    case "PROVIDER_UNAVAILABLE":
    case "SERVER_ERROR":
    case "MALFORMED_OUTPUT": // Allow one schema repair attempt
      return true;
    
    default:
      return false;
  }
}

/**
 * Check if error category allows fallback to another provider
 */
function isFallbackAllowedCategory(category: ProviderErrorCategory): boolean {
  switch (category) {
    // Allow fallback
    case "RATE_LIMIT":
    case "TIMEOUT":
    case "CONNECTION":
    case "PROVIDER_UNAVAILABLE":
    case "SERVER_ERROR":
      return true;
    
    // Do not fallback
    case "AUTHENTICATION":
    case "PERMISSION_DENIED":
    case "CONFIGURATION":
    case "ABORTED":
    case "CITATION_VALIDATION":
    case "SAFETY_BLOCK":
    case "INSUFFICIENT_KNOWLEDGE":
    case "OUT_OF_SCOPE":
    case "SCHEMA_VALIDATION":
    case "MALFORMED_OUTPUT":
    case "UNKNOWN":
      return false;
    
    default:
      return false;
  }
}

/**
 * Parse error and categorize it
 */
export function categorizeError(error: unknown, provider: string): ProviderError {
  if (!(error instanceof Error)) {
    return createProviderError("UNKNOWN", provider, "Unknown error occurred");
  }

  const message = error.message.toLowerCase();

  // Check for prefixed error codes
  if (error.message.startsWith("AUTHENTICATION:")) {
    return createProviderError("AUTHENTICATION", provider, error.message);
  }
  if (error.message.startsWith("PERMISSION_DENIED:")) {
    return createProviderError("PERMISSION_DENIED", provider, error.message);
  }
  if (error.message.startsWith("PROVIDER_RATE_LIMITED:")) {
    return createProviderError("RATE_LIMIT", provider, error.message);
  }
  if (error.message.startsWith("PROVIDER_TIMEOUT:")) {
    return createProviderError("TIMEOUT", provider, error.message);
  }
  if (error.message.startsWith("PROVIDER_UNAVAILABLE:")) {
    return createProviderError("PROVIDER_UNAVAILABLE", provider, error.message);
  }
  if (error.message.startsWith("PROVIDER_INVALID_OUTPUT:")) {
    return createProviderError("MALFORMED_OUTPUT", provider, error.message);
  }
  if (error.message.startsWith("SCHEMA_VALIDATION:")) {
    return createProviderError("SCHEMA_VALIDATION", provider, error.message);
  }
  if (error.message.startsWith("CITATION_VALIDATION:")) {
    return createProviderError("CITATION_VALIDATION", provider, error.message);
  }
  if (error.message.startsWith("REQUEST_ABORTED:")) {
    return createProviderError("ABORTED", provider, error.message);
  }
  if (error.message.startsWith("CONFIGURATION:")) {
    return createProviderError("CONFIGURATION", provider, error.message);
  }
  if (error.message.startsWith("INSUFFICIENT_KNOWLEDGE:")) {
    return createProviderError("INSUFFICIENT_KNOWLEDGE", provider, error.message);
  }
  if (error.message.startsWith("OUT_OF_SCOPE:")) {
    return createProviderError("OUT_OF_SCOPE", provider, error.message);
  }

  // Pattern matching for common error messages
  if (message.includes("aborted")) {
    return createProviderError("ABORTED", provider, error.message, { cause: error });
  }

  if (message.includes("auth") || message.includes("invalid_api_key") || message.includes("api key")) {
    return createProviderError("AUTHENTICATION", provider, error.message, { cause: error });
  }

  if (message.includes("permission") || message.includes("forbidden") || message.includes("403")) {
    return createProviderError("PERMISSION_DENIED", provider, error.message, { cause: error });
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return createProviderError("RATE_LIMIT", provider, error.message, { cause: error });
  }

  if (message.includes("timeout") || message.includes("timed out")) {
    return createProviderError("TIMEOUT", provider, error.message, { cause: error });
  }

  if (message.includes("connection") || message.includes("econnrefused") || message.includes("network")) {
    return createProviderError("CONNECTION", provider, error.message, { cause: error });
  }

  if (message.includes("503") || message.includes("unavailable") || message.includes("overloaded")) {
    return createProviderError("PROVIDER_UNAVAILABLE", provider, error.message, { cause: error });
  }

  if (message.includes("500") || message.includes("502") || message.includes("504")) {
    return createProviderError("SERVER_ERROR", provider, error.message, { cause: error });
  }

  if (message.includes("safety") || message.includes("blocked") || message.includes("policy")) {
    return createProviderError("SAFETY_BLOCK", provider, error.message, { cause: error });
  }

  // Default to unavailable
  return createProviderError("PROVIDER_UNAVAILABLE", provider, error.message, { cause: error });
}
