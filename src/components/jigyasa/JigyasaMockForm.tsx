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
  
  // Replace single response/error state with a history array
  type ChatMessage = {
    id: string;
    question: string;
    response?: JigyasaSuccessResponse;
    error?: JigyasaErrorResponse;
    status: "success" | "error";
  };
  const [history, setHistory] = useState<ChatMessage[]>([]);
  
  const [selectedTopic, setSelectedTopic] = useState<SpaceTopic | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const messageIdCounter = useRef<number>(0);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && status !== "loading") {
        submitButtonRef.current?.click();
      }
    }
  };

  const submitQuestion = async (textToSubmit: string, messageId: string) => {
    const questionText = textToSubmit.trim() || t.homeJigyasaExample;
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    }, 45000); // 45 second timeout

    setStatus("loading");
    setQuestion(""); // Copy question to stable state (history will show it)
    
    // Optimistically add to history as loading (will update later)
    // We just render loading skeleton at the bottom.

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
      clearTimeout(timeoutId);

      if (data.status === "ok") {
        setHistory(prev => [...prev, { id: messageId, question: questionText, response: data, status: "success" }]);
        setStatus("idle");
        // Reset topic selection after successful answer
        setSelectedTopic(null);
      } else {
        setHistory(prev => [...prev, { id: messageId, question: questionText, error: data, status: "error" }]);
        setStatus("idle");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // Handle abort separately
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }

      // Network or other errors
      const errorData: JigyasaErrorResponse = {
        requestId: "unknown",
        status: "error",
        error: {
          code: "PROVIDER_TIMEOUT",
          message: err instanceof Error && err.name === "AbortError" ? "Request timed out" : (err instanceof Error ? err.message : "An unexpected error occurred"),
          retryable: true,
        },
      };
      setHistory(prev => [...prev, { id: messageId, question: questionText, error: errorData, status: "error" }]);
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    messageIdCounter.current += 1;
    await submitQuestion(question, String(messageIdCounter.current));
  };

  const handleRetry = (failedQuestion: string) => {
    setQuestion(failedQuestion);
    messageIdCounter.current += 1;
    submitQuestion(failedQuestion, String(messageIdCounter.current));
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
              onKeyDown={handleKeyDown}
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
                ref={submitButtonRef}
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

      {/* Conversation History */}
      {history.map((msg) => (
        <div key={msg.id} className="mt-8">
          <div className="mb-4 text-right">
            <span className="inline-block rounded-2xl px-5 py-3 text-fluid-body font-medium"
              style={{
                background: "rgba(189,165,106,0.15)",
                color: "var(--space-moonlight)",
                border: "1px solid rgba(189,165,106,0.3)"
              }}>
              {msg.question}
            </span>
          </div>
          {msg.status === "success" && msg.response && (
            <ResponsePanel response={msg.response} question={msg.question} />
          )}
          {msg.status === "error" && msg.error && (
            <ErrorPanel error={msg.error} onRetry={() => handleRetry(msg.question)} />
          )}
        </div>
      ))}

      {status === "loading" && <ResponseSkeleton />}
    </div>
  );
}
