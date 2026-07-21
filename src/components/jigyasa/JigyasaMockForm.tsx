"use client";

import React, { useState, useRef } from "react";
import { GlowCard } from "../shared/GlowCard";
import { ResponseSkeleton } from "./ResponseSkeleton";
import { ResponsePanel } from "./ResponsePanel";
import { ErrorPanel } from "./ErrorPanel";
import { ProviderSelector } from "./ProviderSelector";
import { ResponseStyleSelector } from "./ResponseStyleSelector";
import { RotatingTopics } from "./RotatingTopics";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useLanguage, translations } from "@/config/language";
import type { JigyasaSuccessResponse, JigyasaErrorResponse } from "@/lib/server/jigyasa/schema";
import type { SpaceTopic } from "@/config/space-topics";

type FormStatus = "idle" | "loading" | "success" | "error";
type ProviderOption = "auto" | "groq" | "gemini";
type ResponseStyleOption = "balanced" | "quick" | "structured" | "deep" | "katha-vigyan";

export function JigyasaMockForm() {
  const { language } = useLanguage();
  const t = translations[language];

  const [question, setQuestion] = useState("");
  const [providerPreference, setProviderPreference] = useState<ProviderOption>("auto");
  const [responseStyle, setResponseStyle] = useState<ResponseStyleOption>("balanced");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [response, setResponse] = useState<JigyasaSuccessResponse | null>(null);
  const [error, setError] = useState<JigyasaErrorResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<SpaceTopic | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get topic title based on language
  const getTopicTitle = (topic: SpaceTopic): string => {
    switch (language) {
      case "hi":
        return topic.titleHi;
      case "hinglish":
        return topic.titleHinglish;
      case "hi-en":
        return `${topic.titleHi} — ${topic.titleEn}`;
      default:
        return topic.titleEn;
    }
  };

  // Compute placeholder text based on selected topic
  const placeholderText = selectedTopic
    ? `Ask about ${getTopicTitle(selectedTopic)}...`
    : t.askPlaceholder;

  const handleTopicSelect = (topic: SpaceTopic) => {
    setSelectedTopic(topic);
  };

  const handleQuestionSelect = (questionText: string) => {
    setQuestion(questionText);
  };

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
          providerPreference,
          responseStyle,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse(data);
        setStatus("success");
        // Reset topic selection after successful answer
        setSelectedTopic(null);
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
          {/* Controls Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ProviderSelector
              value={providerPreference}
              onChange={setProviderPreference}
              disabled={status === "loading"}
            />
            <ResponseStyleSelector
              value={responseStyle}
              onChange={setResponseStyle}
              disabled={status === "loading"}
            />
          </div>

          {/* Rotating Topics */}
          <RotatingTopics
            onTopicSelect={handleTopicSelect}
            selectedTopicId={selectedTopic?.id}
            disabled={status === "loading"}
            autoRotate={true}
            rotationInterval={15000}
          />

          {/* Suggested Questions */}
          <SuggestedQuestions
            topic={selectedTopic}
            onQuestionSelect={handleQuestionSelect}
            disabled={status === "loading"}
          />

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
              placeholder={placeholderText}
              rows={3}
              disabled={status === "loading"}
              className={`${inputClass} resize-none placeholder:opacity-40 disabled:opacity-50 disabled:cursor-not-allowed`}
              style={inputStyle}
            />
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
                Cancel
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
                Ask Jigyasa
              </button>
            )}
            {status === "loading" && (
              <span className="text-fluid-button" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
                Exploring
              </span>
            )}
          </div>
        </form>
      </GlowCard>

      {status === "loading" && <ResponseSkeleton />}
      {status === "success" && response && <ResponsePanel response={response} question={question} />}
      {status === "error" && error && <ErrorPanel error={error} onRetry={handleRetry} />}
    </div>
  );
}
