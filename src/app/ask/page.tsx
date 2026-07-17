"use client";

import { SectionShell } from "@/components/shared/SectionShell";
import { JigyasaMockForm } from "@/components/jigyasa/JigyasaMockForm";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";

export default function AskPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen relative flex flex-col items-center overflow-hidden">
      <SectionShell
        eyebrow="Preview"
        title={t.askTitle}
        description={t.askSubtitle}
        headingLevel="h1"
        className="w-full relative z-10"
      >
        <div className="mb-8 flex justify-start">
          <LanguageModeToggle />
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <JigyasaMockForm />

          <div className="hidden lg:flex sticky top-24 flex-col items-center justify-center p-6 h-[400px]">
            <div className="h-64 w-64 relative">
              <InteractiveSpaceModel variant="question_orb" aria-hidden={true} />
            </div>
            <p className="mt-8 text-center text-sm font-medium text-[var(--color-ivory)]/50 uppercase tracking-widest">
              Awaiting your query
            </p>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
