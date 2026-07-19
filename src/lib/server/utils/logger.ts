/**
 * Structured Server Logger
 * 
 * Minimal structured logging for server-side operations.
 * Never logs secrets, API keys, or sensitive user data.
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

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
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
