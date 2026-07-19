"use client";

import React from "react";
import { GlowCard } from "../shared/GlowCard";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";
import type { JigyasaSuccessResponse } from "@/lib/server/jigyasa/schema";

interface ResponsePanelProps {
  response: JigyasaSuccessResponse;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const { answer, meta } = response;

  return (
    <div className="mt-6 space-y-6">
      {/* Mock/Development Notice */}
      {meta.mock && (
        <div
          className="rounded-xl px-4 py-3 text-fluid-button"
          style={{
            background: "rgba(119,89,217,0.10)",
            border: "1px solid rgba(119,89,217,0.25)",
            color: "var(--space-stardust)",
          }}
        >
          <strong style={{ color: "var(--space-antique-gold)" }}>Phase 4A Development:</strong>{" "}
          This is a backend foundation test response. Production AI with knowledge retrieval will be added in the next phases.
        </div>
      )}

      {/* Short Answer (if provided) */}
      {answer.shortAnswer && (
        <div
          className="rounded-xl px-5 py-4 text-fluid-body font-medium"
          style={{
            background: "rgba(189,165,106,0.08)",
            border: "1px solid rgba(189,165,106,0.20)",
            color: "var(--space-moonlight)",
          }}
        >
          {answer.shortAnswer}
        </div>
      )}

      {/* Story Lens (Katha) */}
      <GlowCard atmosphere="gold">
        <div className="mb-4 inline-flex items-center gap-2">
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: "var(--space-antique-gold)" }}
          />
          <h3
            className="font-display text-fluid-card font-light"
            style={{ color: "var(--space-antique-gold)" }}
          >
            {t.respKatha}
          </h3>
        </div>
        <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty whitespace-pre-wrap" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
          {answer.katha}
        </p>
      </GlowCard>

      {/* Science Lens (Vigyan) */}
      <GlowCard atmosphere="cyan">
        <div className="mb-4 inline-flex items-center gap-2">
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: "var(--space-cyan-dim)" }}
          />
          <h3
            className="font-display text-fluid-card font-light"
            style={{ color: "var(--space-cyan-dim)" }}
          >
            {t.respVigyan}
          </h3>
        </div>
        <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty whitespace-pre-wrap" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
          {answer.vigyan}
        </p>
      </GlowCard>

      {/* Evidence (Pramaan) and Visual (Drishya) */}
      <div className="grid gap-6 md:grid-cols-2">
        <GlowCard>
          <h4 className="font-display text-fluid-card" style={{ color: "var(--space-moonlight)", opacity: 0.9 }}>
            {t.respPramaan}
          </h4>
          <ul className="mt-4 space-y-2 text-fluid-body max-w-optimal" style={{ color: "var(--space-stardust)", opacity: 0.75 }}>
            {answer.pramaan.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                <span className="text-balance-pretty">{item}</span>
              </li>
            ))}
          </ul>
          {answer.uncertainty && (
            <p className="mt-4 text-fluid-button italic" style={{ color: "var(--space-stardust)", opacity: 0.6 }}>
              {answer.uncertainty}
            </p>
          )}
        </GlowCard>

        <GlowCard>
          <h4 className="font-display text-fluid-card" style={{ color: "var(--space-moonlight)", opacity: 0.9 }}>
            {t.respDrishya}
          </h4>
          {answer.visual ? (
            <div className="mt-4 flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-visible">
                <InteractiveSpaceModel variant="eclipse_alignment" size="full" interactionMode="tilt" aria-hidden={true} />
              </div>
              <p className="text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
                Scene: {answer.visual.sceneId}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-fluid-body" style={{ color: "var(--space-stardust)", opacity: 0.5 }}>
              Visual representation pending answer-specific scene implementation.
            </p>
          )}
        </GlowCard>
      </div>

      {/* Sources (if any) */}
      {answer.sources.length > 0 && (
        <GlowCard>
          <h4 className="font-display text-fluid-card" style={{ color: "var(--space-moonlight)", opacity: 0.9 }}>
            Sources
          </h4>
          <ul className="mt-4 space-y-2">
            {answer.sources.map((source) => (
              <li key={source.id} className="text-fluid-body" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--space-cyan-dim)" }}
                  >
                    {source.title}
                  </a>
                ) : (
                  <span>{source.title}</span>
                )}
              </li>
            ))}
          </ul>
        </GlowCard>
      )}

      {/* Follow-up Questions */}
      {answer.followUps.length > 0 && (
        <GlowCard atmosphere="void">
          <h4
            className="font-display text-fluid-card"
            style={{ color: "var(--space-antique-gold)" }}
          >
            {t.respFollowup}
          </h4>
          <ul className="mt-4 space-y-2 text-fluid-body max-w-optimal" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
            {answer.followUps.map((question, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                <span className="text-balance-pretty">{question}</span>
              </li>
            ))}
          </ul>
        </GlowCard>
      )}

      {/* Safety note */}
      <div
        className="rounded-xl px-4 py-4 text-fluid-button"
        style={{
          background: "rgba(24,35,90,0.20)",
          border: "1px solid rgba(95,166,184,0.15)",
          color: "var(--space-stardust)",
          opacity: 0.7,
        }}
      >
        <strong style={{ color: "var(--space-moonlight)" }}>Safety:</strong> {t.askSafetyNote}
      </div>
    </div>
  );
}
