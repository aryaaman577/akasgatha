import Link from "next/link";
import { AkasDwar } from "@/components/landing/AkasDwar";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center overflow-hidden">
      {/* Scroll connector line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--color-ivory)]/5 mix-blend-screen pointer-events-none" aria-hidden="true" />
      
      <div className="w-full relative z-10">
        <AkasDwar />
      </div>

      <div className="w-full max-w-7xl relative z-10 mt-16 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex flex-col gap-12 md:flex-row">
          {/* Jigyasa Preview */}
          <GlowCard className="flex-1 flex flex-col items-center text-center p-10 min-h-[400px]">
            <div className="h-48 w-48 mb-8 relative">
              <InteractiveSpaceModel variant="question_orb" aria-hidden={true} />
            </div>
            <h2 className="font-display text-3xl text-[var(--color-antique-gold)] font-light mb-4">
              Ask with curiosity.
            </h2>
            <p className="text-[var(--color-ivory)]/70 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Our Jigyasa engine separates symbolic stories from observable science, letting you safely explore cosmic questions.
            </p>
            <Link href="/ask" className="mt-auto px-6 py-2.5 rounded-full border border-[var(--color-cosmic-blue)] bg-[var(--color-graphite)]/50 text-sm font-medium tracking-wide text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-cosmic-blue)]/30 hover:border-[var(--color-cosmic-blue)]">
              Try Jigyasa
            </Link>
          </GlowCard>

          {/* Granth Preview */}
          <GlowCard className="flex-1 flex flex-col items-center text-center p-10 min-h-[400px]">
            <div className="h-48 w-48 mb-8 relative">
              <InteractiveSpaceModel variant="knowledge_library" aria-hidden={true} />
            </div>
            <h2 className="font-display text-3xl text-[var(--color-antique-gold)] font-light mb-4">
              Learn with structure.
            </h2>
            <p className="text-[var(--color-ivory)]/70 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Browse the Akas Granth library to see ancient narratives compared with modern evidence-aware learning.
            </p>
            <Link href="/granth" className="mt-auto px-6 py-2.5 rounded-full border border-[var(--color-cosmic-blue)] bg-[var(--color-graphite)]/50 text-sm font-medium tracking-wide text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-cosmic-blue)]/30 hover:border-[var(--color-cosmic-blue)]">
              Explore Library
            </Link>
          </GlowCard>
        </div>
      </div>

      <div className="w-full relative z-10 mt-12">
        <FeatureGrid />
      </div>

      <SectionShell
        eyebrow="Learning stance"
        title="Stories spark curiosity. Science brings clarity."
        description="AkasGatha is designed so learners can enjoy cultural meaning while still seeing what science can measure, what remains symbolic, and what is unknown."
        className="relative z-10 border-t border-[var(--color-ivory)]/5 bg-[var(--color-obsidian)]/80 w-full"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <GlowCard>
            <h3 className="font-display text-2xl font-light text-[var(--color-antique-gold)]">Narrative layer</h3>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ivory)]/70">
              Cultural narratives stay narratives. They inspire wonder and imagination without being treated as factual proof.
            </p>
          </GlowCard>
          <GlowCard>
            <h3 className="font-display text-2xl font-light text-[var(--color-antique-gold)]">Science layer</h3>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ivory)]/70">
              Scientific explanations stay evidence-aware, focusing on observation, measurement, and objective facts.
            </p>
          </GlowCard>
          <GlowCard>
            <h3 className="font-display text-2xl font-light text-[var(--color-antique-gold)]">Safety layer</h3>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ivory)]/70">
              The platform avoids personal prediction claims, miracle claims, and mythology-as-proof language entirely.
            </p>
          </GlowCard>
        </div>
      </SectionShell>
    </main>
  );
}
