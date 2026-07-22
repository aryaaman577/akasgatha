"use client";

import { useEffect, useState } from "react";

type ProviderOption = "auto" | "groq" | "gemini";

interface ProviderSelectorProps {
  value: ProviderOption;
  onChange: (value: ProviderOption) => void;
  disabled?: boolean;
}

interface ProviderCapabilities {
  providers: ("groq" | "cerebras" | "gemini")[];
  fallbackEnabled: boolean;
  models?: {
    groq?: string | null;
    gemini?: string | null;
  };
}

export function ProviderSelector({ value, onChange, disabled }: ProviderSelectorProps) {
  const [capabilities, setCapabilities] = useState<ProviderCapabilities | null>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    fetch("/api/health", { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("Health check failed");
        return res.json();
      })
      .then((data) => {
        if (data.capabilities) {
          setCapabilities(data.capabilities);
          setStatus("ready");
        } else {
          setStatus("unavailable");
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setStatus("unavailable");
        setCapabilities({ providers: [], fallbackEnabled: false });
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const isGroqAvailable = capabilities?.providers.includes("groq") ?? false;
  const isGeminiAvailable = capabilities?.providers.includes("gemini") ?? false;

  const renderStatus = () => {
    if (status === "checking") {
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span>Checking...</span>
          </div>
        </div>
      );
    }

    if (status === "unavailable") {
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
            <span>Unavailable</span>
          </div>
        </div>
      );
    }

    if (value === "auto") {
      const fallbackText = isGeminiAvailable ? "with verified Gemini fallback" : "no fallback";
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-cyan-dim)", opacity: 0.8 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span className="font-medium">Auto is ready</span>
          </div>
          <span className="ml-4 opacity-70">Groq primary {fallbackText}</span>
        </div>
      );
    }

    if (value === "groq") {
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-cyan-dim)", opacity: 0.8 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span className="font-medium">Groq is ready</span>
          </div>
          <span className="ml-4 opacity-70">{capabilities?.models?.groq || "openai/gpt-oss-20b"}</span>
        </div>
      );
    }

    if (value === "gemini") {
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-cyan-dim)", opacity: 0.8 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span className="font-medium">Gemini is ready</span>
          </div>
          <span className="ml-4 opacity-70">{capabilities?.models?.gemini || "gemini-3.1-flash-lite"}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col">
      <label
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Choose AI
      </label>

      {/* Complete Provider Controls */}
      <div className="flex flex-col gap-2">
        {/* Auto — Recommended */}
        <button
          type="button"
          onClick={() => onChange("auto")}
          disabled={disabled}
          aria-pressed={value === "auto"}
          className="w-full min-h-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 flex items-center justify-between border"
          style={{
            borderColor: value === "auto" ? "var(--space-antique-gold)" : "rgba(189,165,106,0.2)",
            background: value === "auto" ? "rgba(189,165,106,0.15)" : "rgba(7,9,18,0.6)",
            color: value === "auto" ? "var(--space-antique-gold)" : "var(--space-moonlight)",
          }}
        >
          <span>Auto</span>
          <span className="text-xs opacity-75 font-normal">Recommended</span>
        </button>

        {/* Manual Provider Options Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Groq option */}
          <button
            type="button"
            onClick={() => isGroqAvailable && onChange("groq")}
            disabled={disabled || !isGroqAvailable}
            aria-pressed={value === "groq"}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] flex items-center justify-center border`}
            style={{
              borderColor: value === "groq" ? "var(--space-cyan-dim)" : "rgba(189,165,106,0.2)",
              background: value === "groq" ? "rgba(95,166,184,0.15)" : "rgba(7,9,18,0.6)",
              color: value === "groq" ? "var(--space-cyan-dim)" : "var(--space-moonlight)",
              opacity: isGroqAvailable ? 1 : 0.4,
              cursor: isGroqAvailable && !disabled ? "pointer" : "not-allowed",
            }}
          >
            Groq
          </button>

          {/* Gemini option */}
          <button
            type="button"
            onClick={() => isGeminiAvailable && onChange("gemini")}
            disabled={disabled || !isGeminiAvailable}
            aria-pressed={value === "gemini"}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] flex items-center justify-center border`}
            style={{
              borderColor: value === "gemini" ? "var(--space-cyan-dim)" : "rgba(189,165,106,0.2)",
              background: value === "gemini" ? "rgba(95,166,184,0.15)" : "rgba(7,9,18,0.6)",
              color: value === "gemini" ? "var(--space-cyan-dim)" : "var(--space-moonlight)",
              opacity: isGeminiAvailable ? 1 : 0.4,
              cursor: isGeminiAvailable && !disabled ? "pointer" : "not-allowed",
            }}
          >
            Gemini
          </button>
        </div>
      </div>

      {/* Immediately below the complete provider controls show only one readiness status for the currently selected option */}
      {renderStatus()}
    </div>
  );
}
