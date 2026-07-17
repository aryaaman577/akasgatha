"use client";

import Link from "next/link";
import { OrbitHeroVisual } from "@/components/visual/OrbitHeroVisual";
import { useLanguage, translations } from "@/config/language";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";

export function AkasDwar() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="relative px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative z-10">
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <p className="inline-flex rounded-md border border-[var(--color-antique-gold)]/30 bg-[var(--color-antique-gold)]/10 px-3 py-2 text-sm font-medium uppercase tracking-widest text-[var(--color-antique-gold)]">
              Akas Dwar
            </p>
            <LanguageModeToggle />
          </div>
          <h1 className="font-display max-w-4xl text-5xl font-light tracking-tight text-[var(--color-ivory)] sm:text-6xl lg:text-7xl">
            AkasGatha
          </h1>
          <p className="mt-6 max-w-2xl text-2xl font-light leading-9 text-[var(--color-ivory)]/90">
            {t.heroTagline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-ivory)]/70 sm:text-lg">
            Where ancient sky stories meet evidence-aware learning.
          </p>
          <p className="mt-6 max-w-3xl rounded-lg border border-[var(--color-cosmic-blue)]/40 bg-[var(--color-cosmic-blue)]/20 px-5 py-4 text-sm leading-relaxed text-[var(--color-ivory)]/90 backdrop-blur-sm">
            {t.safetyLine}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/ask"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--color-ivory)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--color-obsidian)] outline-none transition-all duration-300 hover:bg-[var(--color-antique-gold)] hover:text-[var(--color-obsidian)] focus-visible:ring-2 focus-visible:ring-[var(--color-antique-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)]"
            >
              {t.ctaStart}
            </Link>
            <Link
              href="/granth"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--color-ivory)]/20 bg-white/5 px-6 py-3 text-sm font-semibold tracking-wide text-[var(--color-ivory)] outline-none transition-all duration-300 hover:border-[var(--color-antique-gold)]/50 hover:bg-[var(--color-antique-gold)]/10 focus-visible:ring-2 focus-visible:ring-[var(--color-antique-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)]"
            >
              {t.ctaExplore}
            </Link>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-0">
          <OrbitHeroVisual />
        </div>
      </div>
    </section>
  );
}
