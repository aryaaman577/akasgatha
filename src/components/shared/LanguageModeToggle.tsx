"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { LanguageMode } from "@/config/language";
import { LANGUAGE_LABELS } from "@/config/language";

const MODES: LanguageMode[] = ["en", "hi", "hinglish", "hi-en"];

export function LanguageModeToggle() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape, arrow-key nav */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(MODES.indexOf(language));
        return;
      }
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % MODES.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + MODES.length) % MODES.length);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setLanguage(MODES[focusedIndex]);
        setOpen(false);
        return;
      }
    },
    [open, focusedIndex, language, setLanguage]
  );

  /* Focus the correct item when navigating */
  useEffect(() => {
    if (!open || !listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>("[role='option']");
    items[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button — only selected label shown */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setFocusedIndex(MODES.indexOf(language));
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LANGUAGE_LABELS[language]}. Click to change.`}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
        style={{
          background: "rgba(16,19,29,0.85)",
          border: "1px solid rgba(189,165,106,0.25)",
          color: "var(--space-antique-gold)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Globe indicator */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="0.75" />
          <ellipse cx="6" cy="6" rx="2.5" ry="5.25" stroke="currentColor" strokeWidth="0.75" />
          <line x1="0.75" y1="6" x2="11.25" y2="6" stroke="currentColor" strokeWidth="0.75" />
        </svg>
        <span>{LANGUAGE_LABELS[language]}</span>
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M 2 3.5 L 5 6.5 L 8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Select language mode"
          className="absolute left-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl py-1 outline-none"
          style={{
            background: "rgba(10,12,22,0.96)",
            border: "1px solid rgba(189,165,106,0.20)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 40px rgba(41,29,85,0.2)",
          }}
        >
          {MODES.map((mode, i) => {
            const isSelected = mode === language;
            return (
              <li
                key={mode}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => {
                  setLanguage(mode);
                  setOpen(false);
                }}
                onFocus={() => setFocusedIndex(i)}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm outline-none transition-colors duration-150"
                style={{
                  color: isSelected
                    ? "var(--space-antique-gold)"
                    : "var(--space-stardust)",
                  background:
                    i === focusedIndex
                      ? "rgba(189,165,106,0.08)"
                      : "transparent",
                }}
                onMouseEnter={() => setFocusedIndex(i)}
              >
                {/* Selected dot */}
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{
                    background: isSelected
                      ? "var(--space-antique-gold)"
                      : "transparent",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(216,220,233,0.2)",
                  }}
                />
                {LANGUAGE_LABELS[mode]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
