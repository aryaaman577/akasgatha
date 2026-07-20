"use client";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { useLanguage, translations } from "@/config/language";
import styles from "./about.module.css";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-visible">
      <div className="relative z-10 w-full px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Mission Statement - Centered */}
          <div className="mb-16 mx-auto text-center" style={{ maxWidth: "820px" }}>
            <p
              className="text-fluid-h3 font-light text-balance-pretty leading-relaxed"
              style={{ color: "var(--space-antique-gold)", opacity: 0.9 }}
            >
              {t.aboutSig}
            </p>
          </div>

        {/* Main Content Grid - Full Width */}
        <div className="grid gap-8 mx-auto" style={{ maxWidth: "1200px" }}>
          
          {/* Vision Section - Full Width */}
          <GlowCard atmosphere="gold" className="lg:col-span-full">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2
                  className="font-display text-fluid-h2 font-light mb-4"
                  style={{ color: "var(--space-antique-gold)" }}
                >
                  {t.aboutWhyTitle}
                </h2>
                <p className="text-fluid-body text-balance-pretty leading-relaxed" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
                  {t.aboutWhyDesc}
                </p>
              </div>
              <div>
                <h2
                  className="font-display text-fluid-h2 font-light mb-4"
                  style={{ color: "var(--space-cyan-dim)" }}
                >
                  {t.aboutSepTitle}
                </h2>
                <p className="text-fluid-body text-balance-pretty leading-relaxed" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
                  {t.aboutSepDesc}
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Core Principles - 3 Column */}
          <div className="grid md:grid-cols-3 gap-6">
            <GlowCard atmosphere="gold">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "rgba(194,162,105,0.15)", border: "2px solid rgba(194,162,105,0.3)" }}>
                  <span className="text-3xl" style={{ color: "var(--space-antique-gold)" }}>📖</span>
                </div>
                <h3 className="font-display text-fluid-card font-medium mb-3" style={{ color: "var(--space-antique-gold)" }}>
                  {t.homeStanceCard1}
                </h3>
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                  {t.homeStanceCard1Desc}
                </p>
              </div>
            </GlowCard>

            <GlowCard atmosphere="cyan">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "rgba(95,166,184,0.15)", border: "2px solid rgba(95,166,184,0.3)" }}>
                  <span className="text-3xl" style={{ color: "var(--space-cyan-dim)" }}>🔬</span>
                </div>
                <h3 className="font-display text-fluid-card font-medium mb-3" style={{ color: "var(--space-cyan-dim)" }}>
                  {t.homeStanceCard2}
                </h3>
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                  {t.homeStanceCard2Desc}
                </p>
              </div>
            </GlowCard>

            <GlowCard atmosphere="void">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "rgba(180,180,200,0.12)", border: "2px solid rgba(180,180,200,0.25)" }}>
                  <span className="text-3xl" style={{ color: "var(--space-stardust)" }}>🛡️</span>
                </div>
                <h3 className="font-display text-fluid-card font-medium mb-3" style={{ color: "var(--space-stardust)" }}>
                  {t.homeStanceCard3}
                </h3>
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.8 }}>
                  {t.homeStanceCard3Desc}
                </p>
              </div>
            </GlowCard>
          </div>

          {/* Safety Guidelines - Full Width */}
          <GlowCard className="lg:col-span-full">
            <h2
              className="font-display text-fluid-h2 font-light mb-6"
              style={{ color: "var(--space-moonlight)", opacity: 0.95 }}
            >
              {t.aboutSafetyTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
                  {t.aboutSafe1}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
                  {t.aboutSafe2}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                <p className="text-fluid-body text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.85 }}>
                  {t.aboutSafe3}
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Future Roadmap - Full Width */}
          <GlowCard atmosphere="violet" className="lg:col-span-full">
            <h2
              className="font-display text-fluid-h2 font-light mb-4"
              style={{ color: "var(--space-pulsar)" }}
            >
              {t.aboutFutureTitle}
            </h2>
            <p className="text-fluid-body text-balance-pretty leading-relaxed" style={{ color: "var(--space-stardust)", opacity: 0.85, maxWidth: "800px" }}>
              {t.aboutFutureDesc}
            </p>
          </GlowCard>
        </div>
        </div>
      </div>
    </main>
  );
}
