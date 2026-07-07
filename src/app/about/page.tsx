import type { Metadata } from "next";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";

export const metadata: Metadata = {
  title: "About | AkasGatha",
  description:
    "Learn how AkasGatha separates cultural storytelling from evidence-aware astronomy education.",
};

const coreModules = [
  "Akas Dwar",
  "Akas Granth",
  "Jigyasa Engine",
  "Katha Mandal",
  "Vigyan Drishti",
  "Satya Setu",
  "Pramaan Matrix",
  "Smriti Quest",
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SectionShell
        eyebrow="About"
        title="What is AkasGatha?"
        description="AkasGatha is a cinematic educational web platform for exploring ancient Indian sky stories alongside modern space science."
        headingLevel="h1"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <GlowCard as="section">
            <h2 className="text-xl font-semibold text-white">Why it exists</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The project helps students and curious learners approach planets,
              nakshatra, eclipses, moon phases, and cosmic mysteries without
              reducing cultural stories to misinformation or turning science
              into decoration.
            </p>
          </GlowCard>
          <GlowCard as="section">
            <h2 className="text-xl font-semibold text-white">
              Story and science separation
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              AkasGatha uses cultural storytelling to build curiosity, but
              scientific explanations are presented separately with an
              evidence-aware approach.
            </p>
          </GlowCard>
          <GlowCard as="section">
            <h2 className="text-xl font-semibold text-white">Core modules</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {coreModules.map((module) => (
                <span
                  key={module}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"
                >
                  {module}
                </span>
              ))}
            </div>
          </GlowCard>
          <GlowCard as="section">
            <h2 className="text-xl font-semibold text-white">
              Gen AI and cloud direction
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Later phases will add structured Gen AI responses through
              server-side APIs, then package the app for Docker and AWS
              deployment. This phase only establishes the static frontend
              foundation.
            </p>
          </GlowCard>
          <GlowCard as="section" className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white">
              Safety note against misinformation
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The platform does not present mythology, scriptures, symbolic
              interpretations, or cultural beliefs as scientific proof. It also
              avoids personal prediction claims, deterministic claims, and
              miracle-proof language.
            </p>
          </GlowCard>
        </div>
      </SectionShell>
    </main>
  );
}
