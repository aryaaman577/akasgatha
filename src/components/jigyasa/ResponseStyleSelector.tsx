"use client";

import { useEffect, useState, useRef } from "react";

type ResponseStyleOption = "balanced" | "quick" | "structured" | "deep" | "katha-vigyan";

interface ResponseStyleSelectorProps {
  value: ResponseStyleOption;
  onChange: (value: ResponseStyleOption) => void;
  disabled?: boolean;
}

const styles: { value: ResponseStyleOption; label: string; description: string }[] = [
  { value: "balanced", label: "Balanced", description: "Concise with useful detail" },
  { value: "quick", label: "Quick Summary", description: "Direct and compact" },
  { value: "structured", label: "Structured", description: "Clear sections and steps" },
  { value: "deep", label: "Deep Dive", description: "Detailed explanation" },
  { value: "katha-vigyan", label: "Katha + Vigyan", description: "Narrative and science separated" },
];

export function ResponseStyleSelector({ value, onChange, disabled }: ResponseStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  const getDisplayLabel = () => {
    const selected = styles.find((style) => style.value === value);
    return selected ? selected.label : "Balanced";
  };

  const handleSelect = (option: ResponseStyleOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label
        htmlFor="style-select"
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Answer Style
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

      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-2 rounded-lg border overflow-hidden shadow-lg"
          style={{
            background: "rgba(7,9,18,0.95)",
            borderColor: "rgba(189,165,106,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          {styles.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => handleSelect(style.value)}
              className="w-full px-4 py-3 text-left transition-all duration-200 hover:bg-[rgba(189,165,106,0.12)] focus:outline-none focus:bg-[rgba(189,165,106,0.12)]"
              style={{
                color: value === style.value ? "var(--space-antique-gold)" : "var(--space-moonlight)",
                background: value === style.value ? "rgba(189,165,106,0.08)" : "transparent",
              }}
            >
              <div className="flex flex-col">
                <span className="text-fluid-button font-medium">{style.label}</span>
                <span className="text-xs opacity-70 mt-0.5">{style.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
