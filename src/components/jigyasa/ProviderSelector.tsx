"use client";

import { useEffect, useState } from "react";

type ProviderOption = "auto" | "groq" | "cerebras";

interface ProviderSelectorProps {
  value: ProviderOption;
  onChange: (value: ProviderOption) => void;
  disabled?: boolean;
}

interface ProviderCapabilities {
  providers: ("groq" | "cerebras")[];
  fallbackEnabled: boolean;
}

export function ProviderSelector({ value, onChange, disabled }: ProviderSelectorProps) {
  const [capabilities, setCapabilities] = useState<ProviderCapabilities | null>(null);

  useEffect(() => {
    // Fetch capabilities once on mount
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.capabilities) {
          setCapabilities(data.capabilities);
        }
      })
      .catch(() => {
        // Silent fail - default to showing only Auto
        setCapabilities({ providers: [], fallbackEnabled: false });
      });
  }, []);

  const isGroqAvailable = capabilities?.providers.includes("groq") ?? false;
  const isCerebrasAvailable = capabilities?.providers.includes("cerebras") ?? false;

  return (
    <div>
      <label
        htmlFor="provider-select"
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Choose AI
      </label>
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={() => onChange("auto")}
          disabled={disabled}
          className={`flex-1 min-h-[44px] px-4 py-2 rounded-lg text-fluid-button font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 disabled:cursor-not-allowed ${
            value === "auto"
              ? "border-2"
              : "border"
          }`}
          style={{
            borderColor: value === "auto" ? "var(--space-antique-gold)" : "rgba(189,165,106,0.2)",
            background: value === "auto" ? "rgba(189,165,106,0.12)" : "rgba(7,9,18,0.6)",
            color: value === "auto" ? "var(--space-antique-gold)" : "var(--space-moonlight)",
          }}
          aria-pressed={value === "auto"}
        >
          Auto
          {value === "auto" && (
            <span className="ml-2 text-xs opacity-70">Recommended</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange("groq")}
          disabled={disabled || !isGroqAvailable}
          className={`flex-1 min-h-[44px] px-4 py-2 rounded-lg text-fluid-button font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 disabled:cursor-not-allowed ${
            value === "groq"
              ? "border-2"
              : "border"
          }`}
          style={{
            borderColor: value === "groq" ? "var(--space-cyan-dim)" : "rgba(95,166,184,0.2)",
            background: value === "groq" ? "rgba(95,166,184,0.12)" : "rgba(7,9,18,0.6)",
            color: value === "groq" ? "var(--space-cyan-dim)" : isGroqAvailable ? "var(--space-moonlight)" : "var(--space-stardust)",
          }}
          aria-pressed={value === "groq"}
          title={!isGroqAvailable ? "Not configured" : ""}
        >
          Groq
        </button>

        <button
          type="button"
          onClick={() => onChange("cerebras")}
          disabled={disabled || !isCerebrasAvailable}
          className={`flex-1 min-h-[44px] px-4 py-2 rounded-lg text-fluid-button font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 disabled:cursor-not-allowed ${
            value === "cerebras"
              ? "border-2"
              : "border"
          }`}
          style={{
            borderColor: value === "cerebras" ? "var(--space-pulsar)" : "rgba(180,120,210,0.2)",
            background: value === "cerebras" ? "rgba(180,120,210,0.12)" : "rgba(7,9,18,0.6)",
            color: value === "cerebras" ? "var(--space-pulsar)" : !isCerebrasAvailable ? "var(--space-stardust)" : "var(--space-moonlight)",
          }}
          aria-pressed={value === "cerebras"}
          title={!isCerebrasAvailable ? "Available after setup" : ""}
        >
          Cerebras
          {!isCerebrasAvailable && (
            <span className="ml-2 text-xs opacity-50">Setup</span>
          )}
        </button>
      </div>
    </div>
  );
}
