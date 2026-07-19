"use client";

import React, { useState, useRef } from "react";
import { GlowCard } from "../shared/GlowCard";
import { ResponseSkeleton } from "./ResponseSkeleton";
import { ResponsePanel } from "./ResponsePanel";
import { ErrorPanel } from "./ErrorPanel";
import { useLanguage, translations } from "@/config/language";
import type { JigyasaSuccessResponse, JigyasaErrorResponse } from "@/lib/server/jigyasa/schema";

type FormStatus = "idle" | "loading" | "success" | "error";

export function JigyasaMockForm() {
  const { language } = useLanguage();
  const t = translations[language];

  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("eclipse");
  const [mood, setMood] = useState("curious");
  const [style, setStyle] = useState("detailed");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [response, setResponse] = useState<JigyasaSuccessResponse | null>(null);
  const [error, setError] = useState<JigyasaErrorResponse | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const questionText = question.trim() || t.homeJigyasaExample;
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setStatus("loading");
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("/api/jigyasa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          language,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse(data);
        setStatus("success");
      } else {
        setError(data);
        setStatus("error");
      }
    } catch (err) {
      // Handle abort separately
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }

      // Network or other errors
      setError({
        requestId: "unknown",
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: err instanceof Error ? err.message : "An unexpected error occurred",
          retryable: true,
        },
      });
      setStatus("error");
    }
  };

  const handleRetry = () => {
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-[var(--space-stardust)]/10 px-4 py-3 text-fluid-body outline-none transition-colors focus:border-[var(--space-antique-gold)]/50 focus:ring-1 focus:ring-[var(--space-antique-gold)]/30";
  const inputStyle = {
    background: "rgba(7,9,18,0.80)",
    color: "var(--space-moonlight)",
  };

  return (
    <div className="w-full">
      <GlowCard as="section" atmosphere="violet" clipContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question */}
          <div>
            <label
              htmlFor="question"
              className="text-fluid-label font-medium tracking-wide"
              style={{ color: "var(--space-moonlight)" }}
            >
              {t.askLabelQuestion}
            </label>
            <textarea
              id="question"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.askPlaceholder}
              rows={3}
              disabled={status === "loading"}
              className={`${inputClass} resize-none placeholder:opacity-40 disabled:opacity-50 disabled:cursor-not-allowed`}
              style={inputStyle}
            />
          </div>

          {/* Selectors */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="topic" className="text-fluid-button font-medium" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                {t.askLabelTopic}
              </label>
              <select
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={status === "loading"}
                className={`${inputClass} min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed`}
                style={inputStyle}
              >
                <option value="eclipse">{t.topicOptEclipse}</option>
                <option value="planets">{t.topicOptPlanets}</option>
                <option value="stars">{t.topicOptStars}</option>
              </select>
            </div>
            <div>
              <label htmlFor="mood" className="text-fluid-button font-medium" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                {t.askLabelMood}
              </label>
              <select
                id="mood"
                name="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={status === "loading"}
                className={`${inputClass} min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed`}
                style={inputStyle}
              >
                <option value="curious">{t.moodOptCurious}</option>
                <option value="analytical">{t.moodOptAnalytical}</option>
                <option value="storyteller">{t.moodOptStory}</option>
              </select>
            </div>
            <div>
              <label htmlFor="style" className="text-fluid-button font-medium" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                {t.askLabelStyle}
              </label>
              <select
                id="style"
                name="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                disabled={status === "loading"}
                className={`${inputClass} min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed`}
                style={inputStyle}
              >
                <option value="detailed">{t.styleOptDetailed}</option>
                <option value="summary">{t.styleOptSummary}</option>
              </select>
            </div>
          </div>

          {/* Submit / Cancel */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {status === "loading" ? (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-7 text-fluid-button font-semibold outline-none transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
                style={{
                  background: "rgba(211,47,47,0.8)",
                  color: "var(--space-moonlight)",
                }}
              >
                Cancel Request
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full px-7 text-fluid-button font-semibold outline-none transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
                style={{
                  background: "var(--space-moonlight)",
                  color: "var(--space-obsidian)",
                }}
              >
                {t.askButton}
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {status === "loading" && <ResponseSkeleton />}
      {status === "success" && response && <ResponsePanel response={response} />}
      {status === "error" && error && <ErrorPanel error={error} onRetry={handleRetry} />}
    </div>
  );
}
