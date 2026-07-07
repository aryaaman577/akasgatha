import Link from "next/link";
import type { Metadata } from "next";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { topicItems } from "@/config/topics";

export const metadata: Metadata = {
  title: "Akas Granth | AkasGatha",
  description:
    "Browse AkasGatha topic cards for planets, eclipses, stars, moon phases, mysteries, time cycles, and space missions.",
};

export default function GranthPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SectionShell
        eyebrow="Akas Granth"
        title="A topic library for sky stories and evidence-aware science."
        description="Choose a starting point for future Jigyasa exploration. Each topic keeps cultural narrative, learning angle, and suggested visual scene type separate."
        headingLevel="h1"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topicItems.map((topic) => (
            <GlowCard key={topic.title} className="flex min-h-[292px] flex-col">
              <div className="mb-5 inline-flex w-fit rounded-md border border-sky-200/20 bg-sky-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-normal text-sky-100">
                {topic.sceneType}
              </div>
              <h2 className="text-xl font-semibold tracking-normal text-white">
                {topic.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {topic.description}
              </p>
              <p className="mt-4 text-sm leading-6 text-amber-100/90">
                {topic.learningAngle}
              </p>
              <Link
                href="/ask"
                className="mt-auto inline-flex min-h-11 w-fit items-center rounded-md border border-amber-200/25 px-4 text-sm font-semibold text-amber-100 outline-none transition hover:bg-amber-200/10 focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                Preview in Jigyasa -&gt;
              </Link>
            </GlowCard>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}
