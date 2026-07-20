"use client";

import React from "react";
import { GlowCard } from "../shared/GlowCard";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";

export function MockResponsePanel() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="mt-6 space-y-6">
      {/* Story Lens */}
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
        <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
          {t.respKathaText}
        </p>
      </GlowCard>

      {/* Science Lens */}
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
        <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
          {t.respVigyanText}
        </p>
      </GlowCard>

      {/* Pramaan + Drishya */}
      <div className="grid gap-6 md:grid-cols-2">
        <GlowCard>
          <h4 className="font-display text-fluid-card" style={{ color: "var(--space-moonlight)", opacity: 0.9 }}>
            {t.respPramaan}
          </h4>
          <div className="mt-4 space-y-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.75 }}>
            <p><strong style={{ color: "var(--space-antique-gold)" }}>{t.respProven}:</strong> {t.respProvenText}</p>
            <p><strong style={{ color: "var(--space-antique-gold)" }}>{t.respSymbolic}:</strong> {t.respSymbolicText}</p>
          </div>
        </GlowCard>
        <GlowCard>
          <h4 className="font-display text-fluid-card" style={{ color: "var(--space-moonlight)", opacity: 0.9 }}>
            {t.respDrishya}
          </h4>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-visible">
              <InteractiveSpaceModel variant="eclipse_alignment" size="full" interactionMode="tilt" aria-hidden={true} />
            </div>
            <p className="text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
              {t.respDrishyaText}
            </p>
          </div>
        </GlowCard>
      </div>

      {/* Follow-up */}
      <GlowCard atmosphere="void">
        <h4
          className="font-display text-fluid-card"
          style={{ color: "var(--space-antique-gold)" }}
        >
          {t.respFollowup}
        </h4>
        <ul className="mt-4 space-y-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
          <li className="flex items-start gap-2">
            <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
            {t.respQ1}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
            {t.respQ2}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
            {t.respQ3}
          </li>
        </ul>
      </GlowCard>

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
