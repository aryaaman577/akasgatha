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
    <main className="min-h-screen relative flex flex-col items-center overflow-hidden">
      <SectionShell
        eyebrow="Akas Granth"
        title="A topic library for sky stories and evidence-aware science."
        description={t.topicIntro}
        headingLevel="h1"
        className="w-full relative z-10"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
          {topicItems.map((topic) => (
            <GlowCard key={topic.title} className="flex min-h-[320px] flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-40 w-40 opacity-40 transition-opacity duration-500 group-hover:opacity-100 -translate-y-1/4 translate-x-1/4">
                <InteractiveSpaceModel variant={topic.sceneType} aria-hidden={true} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 inline-flex w-fit rounded-md border border-[var(--color-cosmic-blue)]/30 bg-[var(--color-cosmic-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-cosmic-blue)]">
                  {topic.sceneType.replace('_', ' ')}
                </div>
                <h2 className="font-display text-2xl font-light tracking-wide text-[var(--color-antique-gold)]">
                  {topic.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ivory)]/70">
                  {topic.description}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-ivory)]/90 flex-1">
                  {topic.learningAngle}
                </p>
                <Link
                  href="/ask"
                  className="mt-6 inline-flex w-fit items-center rounded-md border border-[var(--color-antique-gold)]/40 px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-antique-gold)]/20 hover:border-[var(--color-antique-gold)] focus-visible:ring-2 focus-visible:ring-[var(--color-antique-gold)]"
                >
                  Preview in Jigyasa -&gt;
                </Link>
              </div>
            </GlowCard>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}
