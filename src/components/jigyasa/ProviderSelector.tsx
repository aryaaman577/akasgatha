"use client";

import { useEffect, useState, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">("checking");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
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
        setStatus("unavailable");
        setCapabilities({ providers: [], fallbackEnabled: false });
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isGroqAvailable = capabilities?.providers.includes("groq") ?? false;
  const isGeminiAvailable = capabilities?.providers.includes("gemini") ?? false;

  const getDisplayLabel = () => {
    if (value === "auto") return "Auto (Recommended)";
    if (value === "groq") return "Groq";
    if (value === "gemini") return "Gemini";
    return "Auto";
  };

  const handleSelect = (option: ProviderOption) => {
    onChange(option);
    setIsOpen(false);
  };

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

    // Ready status dynamically based on selection
    if (value === "auto") {
      const fallbackText = isGeminiAvailable ? "with verified Gemini fallback" : "no fallback";
      return (
        <div className="mt-2 text-xs flex flex-col gap-0.5" style={{ color: "var(--space-cyan-dim)", opacity: 0.8 }}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span>Auto is ready</span>
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
            <span>Groq is ready</span>
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
            <span>Gemini is ready</span>
          </div>
          <span className="ml-4 opacity-70">{capabilities?.models?.gemini || "verified model"}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Choose AI
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full min-h-[44px] px-4 py-2 rounded-lg text-fluid-button font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 disabled:cursor-not-allowed border flex items-center justify-between"
        style={{
          borderColor: isOpen ? "var(--space-antique-gold)" : "rgba(189,165,106,0.2)",
          background: "rgba(7,9,18,0.6)",
          color: "var(--space-moonlight)",
        }}
      >
        <span>{getDisplayLabel()}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </button>

      {/* Dynamic Readiness Line positioned directly below the control */}
      {renderStatus()}

      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-2 rounded-lg border overflow-hidden shadow-lg"
          style={{
            top: "76px", // Position it exactly below the button to not overlap the readiness text visually
            background: "rgba(7,9,18,0.95)",
            borderColor: "rgba(189,165,106,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            type="button"
            onClick={() => handleSelect("auto")}
            className="w-full px-4 py-3 text-left text-fluid-button font-medium transition-all duration-200 hover:bg-[rgba(189,165,106,0.12)] focus:outline-none focus:bg-[rgba(189,165,106,0.12)]"
            style={{
              color: value === "auto" ? "var(--space-antique-gold)" : "var(--space-moonlight)",
              background: value === "auto" ? "rgba(189,165,106,0.08)" : "transparent",
            }}
          >
            Auto
            <span className="ml-2 text-xs opacity-70">Recommended</span>
          </button>

          {isGroqAvailable && (
            <button
              type="button"
              onClick={() => handleSelect("groq")}
              className="w-full px-4 py-3 text-left text-fluid-button font-medium transition-all duration-200 hover:bg-[rgba(95,166,184,0.12)] focus:outline-none focus:bg-[rgba(95,166,184,0.12)]"
              style={{
                color: value === "groq" ? "var(--space-cyan-dim)" : "var(--space-moonlight)",
                background: value === "groq" ? "rgba(95,166,184,0.08)" : "transparent",
              }}
            >
              Groq
            </button>
          )}

          {isGeminiAvailable && (
            <button
              type="button"
              onClick={() => handleSelect("gemini")}
              className="w-full px-4 py-3 text-left text-fluid-button font-medium transition-all duration-200 hover:bg-[rgba(95,166,184,0.12)] focus:outline-none focus:bg-[rgba(95,166,184,0.12)]"
              style={{
                color: value === "gemini" ? "var(--space-cyan-dim)" : "var(--space-moonlight)",
                background: value === "gemini" ? "rgba(95,166,184,0.08)" : "transparent",
              }}
            >
              Gemini
            </button>
          )}
        </div>
      )}
    </div>
  );
}
