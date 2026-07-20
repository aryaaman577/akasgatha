"use client";

import { useEffect, useState, useRef } from "react";

type ProviderOption = "auto" | "groq";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const isCerebrasAvailable = capabilities?.providers.includes("cerebras") ?? false;

  const getDisplayLabel = () => {
    if (value === "auto") return "Auto (Recommended)";
    if (value === "groq") return "Groq";
    if (value === "cerebras") return "Cerebras";
    return "Auto";
  };

  const handleSelect = (option: ProviderOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label
        htmlFor="provider-select"
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Choose AI
      </label>
      
      {/* Status Indicator */}
      {isGroqAvailable && !isOpen && (
        <div className="mb-2 text-xs flex items-center gap-2" style={{ color: "var(--space-cyan-dim)", opacity: 0.7 }}>
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>Groq Ready</span>
        </div>
      )}
      
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

      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-2 rounded-lg border overflow-hidden shadow-lg"
          style={{
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

          {/* Cerebras hidden - not available */}
        </div>
      )}
    </div>
  );
}
