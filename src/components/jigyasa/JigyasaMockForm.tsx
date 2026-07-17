"use client";

import React, { useState } from "react";
import { GlowCard } from "../shared/GlowCard";
import { ResponseSkeleton } from "./ResponseSkeleton";
import { MockResponsePanel } from "./MockResponsePanel";

export function JigyasaMockForm() {
  const [question, setQuestion] = useState("Why do eclipses happen, and how are Rahu-Ketu stories connected culturally?");
  const [topic, setTopic] = useState("eclipse");
  const [mood, setMood] = useState("curious");
  const [style, setStyle] = useState("detailed");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setStatus("loading");
    
    // Simulate network delay
    setTimeout(() => {
      setStatus("success");
    }, 600);
  };

  return (
    <div className="w-full">
      <GlowCard as="section" className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="question" className="text-sm font-medium tracking-wide text-[var(--color-ivory)]">
              Your Question
            </label>
            <textarea
              id="question"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about an eclipse, moon phase, planet, or star story..."
              rows={4}
              className="mt-2 w-full resize-none rounded-md border border-[var(--color-ivory)]/10 bg-[var(--color-obsidian)]/80 px-4 py-3 text-sm text-[var(--color-ivory)] outline-none placeholder:text-[var(--color-ivory)]/40 focus:border-[var(--color-antique-gold)]/50 focus:ring-1 focus:ring-[var(--color-antique-gold)]/50 transition-colors"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="topic" className="text-sm font-medium text-[var(--color-ivory)]/80">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-md border border-[var(--color-ivory)]/10 bg-[var(--color-obsidian)]/80 px-4 text-sm text-[var(--color-ivory)] outline-none focus:border-[var(--color-antique-gold)]/50 transition-colors"
              >
                <option value="eclipse">Eclipses & Rahu-Ketu</option>
                <option value="planets">Planets & Grah</option>
                <option value="stars">Nakshatra & Stars</option>
              </select>
            </div>
            <div>
              <label htmlFor="mood" className="text-sm font-medium text-[var(--color-ivory)]/80">
                Mood
              </label>
              <select
                id="mood"
                name="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-md border border-[var(--color-ivory)]/10 bg-[var(--color-obsidian)]/80 px-4 text-sm text-[var(--color-ivory)] outline-none focus:border-[var(--color-antique-gold)]/50 transition-colors"
              >
                <option value="curious">Curious</option>
                <option value="analytical">Analytical</option>
                <option value="storyteller">Storyteller</option>
              </select>
            </div>
            <div>
              <label htmlFor="style" className="text-sm font-medium text-[var(--color-ivory)]/80">
                Response Style
              </label>
              <select
                id="style"
                name="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-md border border-[var(--color-ivory)]/10 bg-[var(--color-obsidian)]/80 px-4 text-sm text-[var(--color-ivory)] outline-none focus:border-[var(--color-antique-gold)]/50 transition-colors"
              >
                <option value="detailed">Detailed Matrix</option>
                <option value="summary">Quick Summary</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--color-ivory)] px-6 text-sm font-semibold text-[var(--color-obsidian)] outline-none transition-all hover:bg-[var(--color-antique-gold)] focus-visible:ring-2 focus-visible:ring-[var(--color-antique-gold)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Analyzing..." : "Seek structured answer"}
            </button>
            <p className="text-xs text-[var(--color-antique-gold)] max-w-xs text-right">
              This is a mock structured response preview. Real AI responses will be added in a later backend phase.
            </p>
          </div>
        </form>
      </GlowCard>

      {status === "loading" && <ResponseSkeleton />}
      {status === "success" && <MockResponsePanel />}
    </div>
  );
}
