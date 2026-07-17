import React from "react";
import { GlowCard } from "../shared/GlowCard";

export function MockResponsePanel() {
  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GlowCard className="border-[var(--color-antique-gold)]/30 bg-[var(--color-obsidian)]/90">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-antique-gold)]" />
          <h3 className="font-display text-xl font-light text-[var(--color-antique-gold)]">Story Lens (Katha)</h3>
        </div>
        <p className="text-[var(--color-ivory)]/80 leading-relaxed text-sm">
          In cultural narratives, Rahu and Ketu are described as shadow entities involved in a cosmic pursuit. Eclipses occur when they temporarily swallow the Sun or Moon. This story serves to explain the momentary darkness and teaches lessons about cosmic balance and cycles.
        </p>
      </GlowCard>

      <GlowCard className="border-[var(--color-cosmic-blue)]/40 bg-[var(--color-obsidian)]/90">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-cosmic-blue)]" />
          <h3 className="font-display text-xl font-light text-[var(--color-cosmic-blue)]">Science Lens (Vigyan)</h3>
        </div>
        <p className="text-[var(--color-ivory)]/80 leading-relaxed text-sm">
          Scientifically, an eclipse happens when the Earth, Moon, and Sun align in space. A solar eclipse occurs when the Moon passes between the Earth and the Sun, casting a shadow on Earth. A lunar eclipse happens when the Earth passes between the Sun and the Moon, casting a shadow on the Moon. The nodes where these orbital paths cross perfectly match the mathematical positions early astronomers attributed to Rahu and Ketu.
        </p>
      </GlowCard>

      <div className="grid gap-6 md:grid-cols-2">
        <GlowCard>
          <h4 className="font-display text-lg text-[var(--color-ivory)]/90 mb-2">Evidence Note (Pramaan)</h4>
          <p className="text-sm text-[var(--color-ivory)]/70">
            <strong>Proven:</strong> Orbital mechanics and shadow casting.<br/>
            <strong>Symbolic:</strong> The pursuit by shadow entities.
          </p>
        </GlowCard>
        <GlowCard>
          <h4 className="font-display text-lg text-[var(--color-ivory)]/90 mb-2">Visual Scene (Drishya)</h4>
          <p className="text-sm text-[var(--color-ivory)]/70">
            Suggested view: <em>Eclipse Alignment Model</em> showing the intersection of orbital planes.
          </p>
        </GlowCard>
      </div>

      <GlowCard className="bg-[var(--color-graphite)]/30">
        <h4 className="font-display text-lg text-[var(--color-antique-gold)] mb-3">Follow-up Questions (Jigyasa Agni)</h4>
        <ul className="space-y-2 text-sm text-[var(--color-ivory)]/80 list-disc list-inside">
          <li>How often do perfect alignments happen?</li>
          <li>Why don&apos;t we have an eclipse every month?</li>
          <li>How did ancient astronomers calculate the nodes without modern telescopes?</li>
        </ul>
      </GlowCard>

      <div className="rounded-lg border border-[var(--color-cosmic-blue)]/20 bg-[var(--color-obsidian)] px-4 py-3 text-xs text-[var(--color-ivory)]/60">
        <strong>Safety Note:</strong> Cultural narratives stay narratives. Scientific explanations stay evidence-aware.
      </div>
    </div>
  );
}
