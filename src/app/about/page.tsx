"use client";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";

import { useLanguage, translations } from "@/config/language";
import styles from "./about.module.css";

const coreModules = [
  { name: "Akas Dwar" },
  { name: "Akas Granth" },
  { name: "Jigyasa Engine" },
  { name: "Katha Mandal" },
  { name: "Vigyan Drishti" },
  { name: "Satya Setu" },
  { name: "Pramaan Matrix" },
  { name: "Smriti Quest" },
];

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-visible">
      {/* 1. What is AkasGatha? (Hero with Cosmic Orrery Centerpiece) */}
      <SectionShell
        eyebrow={t.aboutEyebrow}
        title={t.aboutTitle}
        description={t.aboutDesc}
        headingLevel="h1"
        className="relative z-10 w-full"

      >
        <p
          className="mb-6 text-fluid-body italic text-balance-pretty"
          style={{ color: "var(--space-antique-gold)", opacity: 0.7, letterSpacing: "0.01em" }}
        >
          {t.aboutSig}
        </p>

        <div className="grid gap-6 lg:grid-cols-2" style={{ width: "100%", maxWidth: 720 }}>
          {/* 2. Why it exists */}

          <GlowCard atmosphere="gold" className={styles.aboutCard}>
            <h2
              className="font-display text-fluid-card font-light"
              style={{ color: "var(--space-antique-gold)" }}
            >
              {t.aboutWhyTitle}
            </h2>
            <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.75 }}>
              {t.aboutWhyDesc}
            </p>
          </GlowCard>

          {/* 3. Story & Science */}
          <GlowCard atmosphere="cyan" className={styles.aboutCard}>
            <h2
              className="font-display text-fluid-card font-light"
              style={{ color: "var(--space-cyan-dim)" }}
            >
              {t.aboutSepTitle}
            </h2>
            <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.75 }}>
              {t.aboutSepDesc}
            </p>
          </GlowCard>

          {/* 4. Core Modules */}
          <GlowCard className="flex flex-col lg:col-span-2">
            <h2
              className="font-display text-fluid-card font-light mb-6"
              style={{ color: "var(--space-antique-gold)" }}
            >
              {t.aboutModTitle}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {coreModules.map((mod) => (
                <div
                  key={mod.name}
                  className={`${styles.aboutModule} rounded-xl text-center flex items-center justify-center`}
                  style={{
                    background: "rgba(7,9,18,0.6)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    className="text-fluid-button font-medium"
                    style={{ color: "var(--space-moonlight)", opacity: 0.85 }}
                  >
                    {mod.name}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* 5. Future Direction */}
          <GlowCard atmosphere="void" className={styles.aboutCard}>
            <h2
              className="font-display text-fluid-card font-light"
              style={{ color: "var(--space-stardust)" }}
            >
              {t.aboutFutureTitle}
            </h2>
            <p className="mt-2 text-fluid-body max-w-optimal text-balance-pretty" style={{ color: "var(--space-stardust)", opacity: 0.7 }}>
              {t.aboutFutureDesc}
            </p>
          </GlowCard>

          {/* 6. Safety Stance */}
          <GlowCard className={styles.aboutCard}>
            <h2
              className="font-display text-fluid-card font-light"
              style={{ color: "var(--space-moonlight)", opacity: 0.9 }}
            >
              {t.aboutSafetyTitle}
            </h2>
            <ul
              className="mt-4 space-y-2 text-fluid-body max-w-optimal text-balance-pretty"
              style={{ color: "var(--space-stardust)", opacity: 0.75 }}
            >
              <li className="flex items-start gap-2">
                <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                {t.aboutSafe1}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                {t.aboutSafe2}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--space-antique-gold)" }} />
                {t.aboutSafe3}
              </li>
            </ul>
          </GlowCard>
        </div>
      </SectionShell>
    </main>
  );
}
