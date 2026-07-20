"use client";

import Link from "next/link";
import AkasGathaHero from "@/components/visual/AkasGathaHero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { AkasGranthPreview } from "@/components/landing/AkasGranthPreview";
import { AboutPreview } from "@/components/landing/AboutPreview";
import { useLanguage, translations } from "@/config/language";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="relative flex flex-col items-center overflow-visible" style={{ background: 'transparent' }}>
      {/* Thin scroll connector line */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(189,165,106,0.06) 10%, rgba(189,165,106,0.06) 90%, transparent)" }}
        aria-hidden="true"
      />

      {/* 1. Hero - Cinematic AkasGatha Hero */}
      <div className="relative z-10 w-full overflow-visible">
        <AkasGathaHero />
      </div>

      {/* 2. Feature Grid — Eight Dwars */}
      <div className="relative z-10 w-full section-blend section-atm-violet">
        <FeatureGrid />
      </div>

      {/* 3. Jigyasa Preview */}
      <SectionShell
        eyebrow={t.homeJigyasaEyebrow}
        title={t.homeJigyasaTitle}
        description={t.homeJigyasaDesc}
        className="relative z-10 w-full section-blend section-atm-cyan"
      >
        <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
          {/* Model */}
          <div className="relative mx-auto h-56 w-56 overflow-visible lg:mx-0 lg:h-64 lg:w-64">
            <InteractiveSpaceModel variant="question_orb" size="full" interactionMode="tilt" aria-hidden={true} />
          </div>

          {/* Content */}
          <GlowCard atmosphere="violet" className="flex flex-col">
            {/* Example question */}
            <p
              className="rounded-lg px-4 py-4 text-fluid-body text-balance-pretty italic"
              style={{ background: "rgba(119,89,217,0.08)", border: "1px solid rgba(119,89,217,0.15)", color: "var(--space-stardust)" }}
            >
              {t.homeJigyasaExample}
            </p>

            {/* Response structure labels */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t.homeJigyasaLens1, color: "var(--space-antique-gold)" },
                { label: t.homeJigyasaLens2, color: "var(--space-cyan-dim)" },
                { label: t.homeJigyasaLens3, color: "var(--space-stardust)" },
                { label: t.homeJigyasaLens4, color: "var(--space-pulsar)" },
              ].map((lens) => (
                <div
                  key={lens.label}
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: lens.color }} />
                  <span className="text-fluid-label font-medium" style={{ color: lens.color }}>{lens.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/ask"
              className="mt-8 inline-flex w-fit min-h-[40px] items-center rounded-full px-6 text-fluid-button font-medium tracking-wide outline-none transition-all duration-200 hover:shadow-[0_0_20px_rgba(119,89,217,0.2)] focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
              style={{ border: "1px solid rgba(119,89,217,0.35)", background: "rgba(119,89,217,0.08)", color: "var(--space-moonlight)" }}
            >
              {t.homeJigyasaCta}
            </Link>
          </GlowCard>
        </div>
      </SectionShell>

      {/* 4. Granth Preview */}
      <div className="relative z-10 w-full section-blend section-atm-sapphire">
        <AkasGranthPreview />
      </div>

      {/* 5. Story vs Science Bridge */}
      <SectionShell
        eyebrow={t.homeBridgeEyebrow}
        title={t.homeBridgeTitle}
        description={t.homeBridgeDesc}
        className="relative z-10 w-full section-blend section-atm-gold"
        connectedScroll
      >
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-center">
          <div className="relative mx-auto h-48 w-48 overflow-visible lg:mx-0">
            <InteractiveSpaceModel variant="truth_bridge" size="full" interactionMode="tilt" aria-hidden={true} />
          </div>
          <div className="space-y-4">
            {[
              { label: t.homeBridgeStory, text: t.homeBridgeLine1, color: "var(--space-antique-gold)" },
              { label: t.homeBridgeScience, text: t.homeBridgeLine2, color: "var(--space-cyan-dim)" },
              { label: t.homeBridgeBoundary, text: t.homeBridgeLine3, color: "var(--space-stardust)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(16,19,29,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: item.color }} />
                <div>
                  <p className="text-fluid-label font-medium" style={{ color: item.color }}>{item.label}</p>
                  <p className="mt-2 text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* 6. Learning Stance */}
      <SectionShell
        eyebrow={t.homeStanceEyebrow}
        title={t.homeStanceTitle}
        description={t.homeStanceDesc}
        className="relative z-10 w-full section-blend section-atm-violet"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <GlowCard as="div" atmosphere="gold">
            <h3 className="font-display text-fluid-card font-light" style={{ color: "var(--space-antique-gold)" }}>
              {t.homeStanceCard1}
            </h3>
            <p className="mt-4 text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
              {t.homeStanceCard1Desc}
            </p>
          </GlowCard>
          <GlowCard as="div" atmosphere="cyan">
            <h3 className="font-display text-fluid-card font-light" style={{ color: "var(--space-cyan-dim)" }}>
              {t.homeStanceCard2}
            </h3>
            <p className="mt-4 text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
              {t.homeStanceCard2Desc}
            </p>
          </GlowCard>
          <GlowCard as="div" atmosphere="void">
            <h3 className="font-display text-fluid-card font-light" style={{ color: "var(--space-stardust)" }}>
              {t.homeStanceCard3}
            </h3>
            <p className="mt-4 text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
              {t.homeStanceCard3Desc}
            </p>
          </GlowCard>
        </div>
      </SectionShell>

      {/* 7. About Preview */}
      <div className="relative z-10 w-full mt-12 mb-12 section-blend section-atm-gold">
        <AboutPreview />
      </div>
    </main>
  );
}
