/**
 * Structured Server Logger
 * 
 * Minimal structured logging for server-side operations.
 * Never logs secrets, API keys, or sensitive user data.
 * Phase 7: Enhanced with automatic redaction
 */

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  route?: string;
  method?: string;
  status?: number;
  provider?: string;
  mock?: boolean;
  durationMs?: number;
  inputChars?: number;
  historyMessages?: number;
  errorCode?: string;
  rateLimitResult?: string;
  [key: string]: unknown;
}

/**
 * Redact sensitive patterns from log messages and context
 */
function redactSensitive(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      // Redact API keys (various patterns)
      .replace(/sk-[a-zA-Z0-9]{32,}/g, "[REDACTED_API_KEY]")
      .replace(/gsk_[a-zA-Z0-9]{32,}/g, "[REDACTED_API_KEY]")
      .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED_TOKEN]")
      // Redact Authorization headers
      .replace(/authorization:\s*[^\s,}]+/gi, "authorization: [REDACTED]")
      // Redact potential passwords
      .replace(/password["\s:=]+[^\s,}]+/gi, "password: [REDACTED]")
      // Redact potential tokens
      .replace(/token["\s:=]+[^\s,}]+/gi, "token: [REDACTED]");
  }

  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return value.map(redactSensitive);
    }

    const redacted: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // Redact known sensitive keys
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("key") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("token") ||
        lowerKey.includes("password") ||
        lowerKey.includes("authorization")
      ) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = redactSensitive(val);
      }
    }
    return redacted;
  }

  return value;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  
  // Redact message and context
  const safeMessage = typeof message === "string" ? redactSensitive(message) : message;
  const safeContext = context ? redactSensitive(context) : undefined;
  
  const contextStr = safeContext ? ` ${JSON.stringify(safeContext)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${safeMessage}${contextStr}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.log(formatLog("info", message, context));
  },

  warn(message: string, context?: LogContext): void {
    console.warn(formatLog("warn", message, context));
  },

  error(message: string, context?: LogContext): void {
    console.error(formatLog("error", message, context));
  },
};

/**
 * Truncate question content for safe logging when enabled
 */
export function truncateForLog(content: string, maxLength = 100): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.slice(0, maxLength) + "...";
}
