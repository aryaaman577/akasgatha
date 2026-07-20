"use client";

import Link from "next/link";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { topicItems } from "@/config/topics";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";

export default function GranthPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-visible">

      {/* Header with model */}
      <SectionShell
        eyebrow={t.granthEyebrow}
        title={t.granthTitle}
        description={t.granthIntro}
        headingLevel="h1"
        className="relative z-10 w-full"
        visualSlot={
          <div className="relative h-36 w-36 overflow-visible sm:h-44 sm:w-44">
            <InteractiveSpaceModel variant="knowledge_library" size="full" interactionMode="tilt" aria-hidden={true} />
          </div>
        }
      >
        {/* Signature line */}
        <p
          className="mb-8 text-fluid-body italic text-balance-pretty"
          style={{ color: "var(--space-antique-gold)", opacity: 0.7 }}
        >
          {t.granthSig}
        </p>

        {/* Topic grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topicItems.map((topic) => {
            const titleKey = `topic${topic.index}Title` as keyof typeof t;
            const descKey = `topic${topic.index}Desc` as keyof typeof t;
            const angleKey = `topic${topic.index}Angle` as keyof typeof t;

            return (
              <GlowCard
                key={topic.index}
                as="div"
                atmosphere="gold"
                className="group flex min-h-[320px] flex-col overflow-visible"
              >
                {/* Model */}
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden">
                  <InteractiveSpaceModel
                    variant={topic.sceneType}
                    size="full"
                    interactionMode="tilt"
                    aria-hidden={true}
                  />
                </div>

                {/* Scene type micro-label */}
                <div
                  className="mb-4 inline-flex w-fit rounded-md px-3 py-1 text-fluid-button font-semibold uppercase tracking-widest"
                  style={{
                    background: "rgba(95,166,184,0.08)",
                    border: "1px solid rgba(95,166,184,0.20)",
                    color: "var(--space-cyan-dim)",
                  }}
                >
                  {topic.sceneType.replace(/_/g, " ")}
                </div>

                {/* Title */}
                <h2
                  className="font-display text-fluid-card font-light tracking-wide"
                  style={{ color: "var(--space-antique-gold)" }}
                >
                  {t[titleKey]}
                </h2>

                {/* Description */}
                <p
                  className="mt-4 text-fluid-body max-w-optimal text-balance-pretty"
                  style={{ color: "var(--space-stardust)", opacity: 0.75 }}
                >
                  {t[descKey]}
                </p>

                {/* Learning angle */}
                <p
                  className="mt-4 flex-1 text-fluid-body max-w-optimal text-balance-pretty"
                  style={{ color: "var(--space-moonlight)", opacity: 0.6 }}
                >
                  {t[angleKey]}
                </p>

                {/* CTA */}
                <Link
                  href="/ask"
                  className="mt-6 inline-flex w-fit items-center rounded-full border px-5 py-2 text-fluid-button font-medium tracking-wide outline-none transition-all duration-200 hover:border-[rgba(189,165,106,0.5)] hover:bg-[rgba(189,165,106,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
                  style={{
                    borderColor: "rgba(189,165,106,0.30)",
                    color: "var(--space-moonlight)",
                  }}
                >
                  {t.granthCta}
                </Link>
              </GlowCard>
            );
          })}
        </div>
      </SectionShell>
    </main>
  );
}
