"use client";

import React from "react";
import { useLanguage, LanguageMode } from "@/config/language";

export function LanguageModeToggle() {
  const { language, setLanguage } = useLanguage();

  const modes: { id: LanguageMode; label: string }[] = [
    { id: "en", label: "English" },
    { id: "hi", label: "Hindi" },
    { id: "hinglish", label: "Hinglish" },
    { id: "hi-en", label: "Hi+En" },
  ];

  return (
    <div 
      className="inline-flex items-center rounded-full border border-[var(--color-antique-gold)]/30 bg-[var(--color-graphite)]/80 p-1 backdrop-blur-md"
      role="radiogroup" 
      aria-label="Select Language Mode"
    >
      {modes.map((mode) => {
        const isSelected = language === mode.id;
        return (
          <button
            key={mode.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setLanguage(mode.id)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-antique-gold)] ${
              isSelected 
                ? "text-[var(--color-obsidian)] shadow-sm bg-[var(--color-antique-gold)]" 
                : "text-[var(--color-ivory)]/70 hover:text-[var(--color-ivory)] hover:bg-[var(--color-cosmic-blue)]/30"
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
