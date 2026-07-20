"use client";

import { SectionShell } from "@/components/shared/SectionShell";
import { JigyasaMockForm } from "@/components/jigyasa/JigyasaMockForm";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";

export default function AskPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-visible">
      <SectionShell
        eyebrow={t.askEyebrow}
        title={t.askTitle}
        description={t.askSubtitle}
        headingLevel="h1"
        className="relative z-10 w-full"
      >
        {/* Signature */}
        <p
          className="mb-8 text-fluid-body italic text-balance-pretty"
          style={{ color: "var(--space-antique-gold)", opacity: 0.7 }}
        >
          {t.askSig}
        </p>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Form */}
          <JigyasaMockForm />

          {/* Side model — desktop only */}
          <div className="hidden lg:flex sticky top-24 flex-col items-center justify-center">
            <div className="relative h-56 w-56 overflow-visible">
              <InteractiveSpaceModel
                variant="question_orb"
                size="full"
                interactionMode="tilt"
                aria-hidden={true}
              />
            </div>
            <p
              className="mt-6 text-center text-fluid-button font-medium uppercase tracking-widest"
              style={{ color: "var(--space-stardust)", opacity: 0.45 }}
            >
              {t.askAwaiting}
            </p>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
