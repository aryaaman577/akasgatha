"use client";

import React from "react";
import { GlowCard } from "../shared/GlowCard";
import type { JigyasaErrorResponse } from "@/lib/server/jigyasa/schema";

interface ErrorPanelProps {
  error: JigyasaErrorResponse;
  onRetry?: () => void;
}

const ERROR_TITLES: Record<JigyasaErrorResponse["error"]["code"], string> = {
  INVALID_REQUEST: "Invalid Request",
  UNSUPPORTED_CONTENT_TYPE: "Unsupported Content Type",
  RATE_LIMITED: "Rate Limit Exceeded",
  PROVIDER_NOT_CONFIGURED: "Provider Not Configured",
  PROVIDER_TIMEOUT: "Request Timeout",
  PROVIDER_UNAVAILABLE: "Provider Unavailable",
  REQUEST_ABORTED: "Request Cancelled",
  INTERNAL_ERROR: "Internal Error",
};

export function ErrorPanel({ error, onRetry }: ErrorPanelProps) {
  const title = ERROR_TITLES[error.error.code] || "Error";

  return (
    <div className="mt-6">
      <GlowCard
        className="border-l-4"
        {...({
          style: {
            borderLeftColor: error.error.retryable ? "var(--space-antique-gold)" : "#d32f2f",
          },
        } as React.HTMLAttributes<HTMLDivElement>)}
      >
        <div className="flex items-start gap-4">
          {/* Error icon */}
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: error.error.retryable ? "rgba(189,165,106,0.15)" : "rgba(211,47,47,0.15)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke={error.error.retryable ? "var(--space-antique-gold)" : "#d32f2f"}
              strokeWidth={2}
            >
              {error.error.retryable ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>

          {/* Error content */}
          <div className="flex-1">
            <h3
              className="font-display text-fluid-card font-light"
              style={{ color: "var(--space-moonlight)" }}
            >
              {title}
            </h3>
            <p
              className="mt-2 text-fluid-body text-balance-pretty"
              style={{ color: "var(--space-stardust)", opacity: 0.85 }}
            >
              {error.error.message}
            </p>

            {error.error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full px-6 text-fluid-button font-medium outline-none transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
                style={{
                  background: "var(--space-antique-gold)",
                  color: "var(--space-obsidian)",
                }}
              >
                Try Again
              </button>
            )}

            <p
              className="mt-4 text-fluid-button"
              style={{ color: "var(--space-stardust)", opacity: 0.5 }}
            >
              Request ID: {error.requestId}
            </p>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
