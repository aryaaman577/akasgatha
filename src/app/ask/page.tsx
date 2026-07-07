import type { Metadata } from "next";

import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";

export const metadata: Metadata = {
  title: "Jigyasa Engine | AkasGatha",
  description:
    "A Phase 2 preview of the future AkasGatha interactive question system.",
};

export default function AskPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SectionShell
        eyebrow="Preview"
        title="Jigyasa Engine"
        description="A future interactive question system for structured cosmic explanations, with cultural story and scientific evidence kept visibly separate."
        headingLevel="h1"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <GlowCard as="section" className="p-6">
            <form aria-describedby="phase-3-note" className="space-y-5">
              <div>
                <label htmlFor="question" className="text-sm font-semibold text-white">
                  Question
                </label>
                <textarea
                  id="question"
                  name="question"
                  disabled
                  placeholder="Ask about an eclipse, moon phase, planet, or star story."
                  rows={5}
                  className="mt-2 w-full resize-none rounded-md border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-75"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="mood" className="text-sm font-semibold text-white">
                    Mood
                  </label>
                  <select
                    id="mood"
                    name="mood"
                    disabled
                    className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-75"
                    defaultValue=""
                  >
                    <option value="">Select a learning mood</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="topic" className="text-sm font-semibold text-white">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    disabled
                    className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-75"
                    defaultValue=""
                  >
                    <option value="">Select a cosmic topic</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-amber-200 px-5 text-sm font-semibold text-slate-950 opacity-60 disabled:cursor-not-allowed sm:w-auto"
              >
                Seek structured answer
              </button>
            </form>
          </GlowCard>

          <GlowCard as="section" className="border-amber-200/20 bg-amber-200/10 p-6">
            <p
              id="phase-3-note"
              className="text-lg font-semibold leading-7 text-amber-100"
            >
              Interactive structured responses will be added in Phase 3.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This preview shows the intended shape only. It does not submit
              questions, call a backend, store user data, or contact an LLM.
            </p>
          </GlowCard>
        </div>
      </SectionShell>
    </main>
  );
}
