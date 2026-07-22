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
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">("checking");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const isGroqAvailable = capabilities?.providers.includes("groq") ?? false;
  const isGeminiAvailable = capabilities?.providers.includes("gemini") ?? false;

  const handleSelect = (option: ProviderOption) => {
    onChange(option);
    setIsOpen(false);
  };

  const options: { id: ProviderOption; label: string; subtext?: string; available: boolean }[] = [
    { id: "auto", label: "Auto", subtext: "Recommended", available: true },
    { id: "groq", label: "Groq", available: status === "checking" || isGroqAvailable },
    { id: "gemini", label: "Gemini", available: status === "checking" || isGeminiAvailable }
  ];

  const selectedOption = options.find(o => o.id === value) || options[0];

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full min-h-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)] disabled:opacity-50 flex items-center justify-between border"
        style={{
          borderColor: "var(--space-antique-gold)",
          background: "rgba(189,165,106,0.15)",
          color: "var(--space-antique-gold)",
        }}
      >
        <span>
          {selectedOption.label}
          {selectedOption.subtext && <span className="ml-2 text-xs opacity-75 font-normal">· {selectedOption.subtext}</span>}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <ul 
          role="listbox"
          className="absolute top-[100%] left-0 right-0 mt-2 py-1 rounded-lg border z-50 shadow-lg"
          style={{
            borderColor: "rgba(189,165,106,0.2)",
            background: "#070912",
          }}
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.id}
                disabled={!option.available}
                onClick={(e) => {
                  e.preventDefault();
                  if (option.available) handleSelect(option.id);
                }}
                className="w-full text-left px-3 py-2 text-sm transition-all duration-200 outline-none focus-visible:bg-[rgba(189,165,106,0.1)] hover:bg-[rgba(189,165,106,0.1)] disabled:opacity-50 flex items-center justify-between"
                style={{
                  color: value === option.id ? "var(--space-antique-gold)" : "var(--space-moonlight)",
                  cursor: option.available ? "pointer" : "not-allowed",
                }}
              >
                <span>
                  {option.label}
                  {option.subtext && <span className="ml-2 text-xs opacity-75 font-normal">· {option.subtext}</span>}
                </span>
                {!option.available && status !== "checking" && (
                  <span className="text-xs text-red-400 opacity-80">Unavailable</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
