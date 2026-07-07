import Link from "next/link";

import { GlowCard } from "@/components/shared/GlowCard";

export function AkasDwar() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="star-dust absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="cosmic-wash absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex rounded-md border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-sm font-medium text-amber-100">
            Akas Dwar
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
            AkasGatha
          </h1>
          <p className="mt-6 max-w-2xl text-2xl font-medium leading-9 text-sky-100">
            Ancient sky stories explained with modern space science.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore cosmic stories, mysteries, planets, and evidence-based
            science in one structured learning experience.
          </p>
          <p className="mt-5 max-w-3xl rounded-lg border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm leading-6 text-slate-200">
            Cultural stories are presented as narratives, while scientific
            explanations and evidence are clearly separated.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ask"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950 outline-none transition hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start Jigyasa -&gt;
            </Link>
            <Link
              href="/granth"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-sky-200/25 bg-white/5 px-5 py-3 text-sm font-semibold text-sky-50 outline-none transition hover:border-sky-200/50 hover:bg-sky-300/10 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore Akas Granth -&gt;
            </Link>
          </div>
        </div>

        <GlowCard className="p-0" as="div">
          <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-slate-950">
            <div className="star-dust absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="absolute inset-6 rounded-lg border border-white/10 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute left-8 right-8 top-8 rounded-lg border border-amber-200/20 bg-slate-950/70 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-amber-100">Story layer</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Cultural narratives stay labeled, contextual, and distinct from
                evidence.
              </p>
            </div>
            <div className="absolute bottom-8 left-8 right-8 rounded-lg border border-sky-200/20 bg-slate-950/70 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-sky-100">Science layer</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Astronomy, observation, and uncertainty are presented as their
                own learning path.
              </p>
            </div>
            <div
              className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/25 bg-sky-300/10 shadow-[0_0_100px_rgba(56,189,248,0.22)]"
              aria-hidden="true"
            />
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
