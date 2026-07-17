"use client";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { InteractiveSpaceModel, SpaceModelVariant } from "@/components/visual/InteractiveSpaceModel";
import { useLanguage, translations } from "@/config/language";

const coreModules: Array<{ name: string; variant: SpaceModelVariant }> = [
  { name: "Akas Dwar", variant: "cosmic_gate" },
  { name: "Akas Granth", variant: "knowledge_library" },
  { name: "Jigyasa Engine", variant: "question_orb" },
  { name: "Katha Mandal", variant: "moon_phase" },
  { name: "Vigyan Drishti", variant: "telescope_view" },
  { name: "Satya Setu", variant: "eclipse_alignment" },
  { name: "Pramaan Matrix", variant: "evidence_grid" },
  { name: "Smriti Quest", variant: "constellation_path" },
];

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <main className="min-h-screen relative flex flex-col items-center overflow-hidden">
      <SectionShell
        eyebrow="About"
        title="What is AkasGatha?"
        description={t.heroTagline}
        headingLevel="h1"
        className="w-full relative z-10"
      >
        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          
          <GlowCard className="flex flex-col">
            <h2 className="font-display text-2xl font-light text-[var(--color-antique-gold)]">Project Mission</h2>
            <p className="mt-4 text-[var(--color-ivory)]/70 text-sm leading-relaxed">
              Explore planets, stars, eclipses, and cosmic mysteries without reducing cultural stories to misinformation or turning science into decoration.
            </p>
          </GlowCard>

          <GlowCard className="flex flex-col">
            <h2 className="font-display text-2xl font-light text-[var(--color-antique-gold)]">Story & Science</h2>
            <p className="mt-4 text-[var(--color-ivory)]/70 text-sm leading-relaxed">
              Stories build curiosity. Science provides evidence. We keep them separate to honor cultural context while teaching testable observation.
            </p>
          </GlowCard>

          <GlowCard className="flex flex-col lg:col-span-2">
            <h2 className="font-display text-2xl font-light text-[var(--color-antique-gold)] mb-6">Core Modules</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coreModules.map((module) => (
                <div key={module.name} className="flex flex-col items-center text-center p-4 rounded-lg bg-[var(--color-obsidian)]/50 border border-[var(--color-ivory)]/10">
                  <div className="h-16 w-16 mb-4">
                    <InteractiveSpaceModel variant={module.variant} aria-hidden={true} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-ivory)]/90">{module.name}</span>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="flex flex-col">
            <h2 className="font-display text-2xl font-light text-[var(--color-cosmic-blue)]">Future Gen AI & Cloud</h2>
            <p className="mt-4 text-[var(--color-ivory)]/70 text-sm leading-relaxed">
              Upcoming phases will integrate structured AI responses via server-side APIs, packaged for secure Docker and AWS deployment.
            </p>
          </GlowCard>

          <GlowCard className="flex flex-col border-[var(--color-ivory)]/20">
            <h2 className="font-display text-2xl font-light text-[var(--color-ivory)]/90">Safety Stance</h2>
            <ul className="mt-4 space-y-2 text-[var(--color-ivory)]/70 text-sm leading-relaxed list-disc list-inside">
              <li>No mythology presented as scientific proof.</li>
              <li>No personal prediction or astrology claims.</li>
              <li>No deterministic or miracle-proof language.</li>
            </ul>
          </GlowCard>

        </div>
      </SectionShell>
    </main>
  );
}
