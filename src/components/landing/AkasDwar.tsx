"use client";

import Link from "next/link";
import { OrbitHeroVisual } from "@/components/visual/OrbitHeroVisual";
import { useLanguage, translations } from "@/config/language";

export function AkasDwar() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      className="relative overflow-visible px-5 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      aria-label="AkasGatha — Hero"
    >
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

        {/* === Text side === */}
        <div className="relative z-10">

          {/* Eyebrow */}
          <p
            className="mb-6 inline-flex rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em]"
            style={{
              background: "rgba(189,165,106,0.10)",
              border: "1px solid rgba(189,165,106,0.28)",
              color: "var(--space-antique-gold)",
            }}
          >
            Akas Dwar
          </p>

          {/* Site name */}
          <h1
            className="font-display max-w-4xl text-5xl font-light tracking-wide sm:text-6xl lg:text-7xl"
            style={{
              background: "linear-gradient(135deg, var(--space-gold-light) 0%, var(--space-moonlight) 55%, var(--space-stardust) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AkasGatha
          </h1>

          {/* Primary tagline */}
          <p
            className="mt-5 max-w-lg text-lg font-light leading-7 sm:text-xl"
            style={{ color: "var(--space-moonlight)", opacity: 0.92 }}
          >
            {t.heroTagline}
          </p>

          {/* Supporting line */}
          <p
            className="mt-2 max-w-lg text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--space-stardust)", opacity: 0.65 }}
          >
            {t.heroSub}
          </p>

          {/* Safety statement */}
          <p
            className="mt-7 max-w-md rounded-xl px-4 py-3 text-xs leading-relaxed sm:text-sm"
            style={{
              background: "rgba(24,35,90,0.22)",
              border: "1px solid rgba(85,124,214,0.18)",
              color: "var(--space-stardust)",
              opacity: 0.8,
              backdropFilter: "blur(8px)",
            }}
          >
            {t.safetyLine}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ask"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full px-7 text-sm font-semibold tracking-wide outline-none transition-all duration-300 hover:shadow-[0_4px_24px_rgba(189,165,106,0.2)] focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
              style={{
                background: "var(--space-moonlight)",
                color: "var(--space-obsidian)",
              }}
            >
              {t.ctaStart}
            </Link>
            <Link
              href="/granth"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border px-7 text-sm font-semibold tracking-wide outline-none transition-all duration-300 hover:border-[rgba(189,165,106,0.45)] hover:bg-[rgba(189,165,106,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
              style={{
                borderColor: "rgba(241,240,232,0.15)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--space-moonlight)",
              }}
            >
              {t.ctaExplore}
            </Link>
          </div>
        </div>

        {/* === Hero visual side === */}
        <div className="relative flex items-center justify-center overflow-visible">
          <OrbitHeroVisual />
        </div>
      </div>
    </section>
  );
}
