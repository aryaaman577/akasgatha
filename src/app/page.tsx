import { AkasDwar } from "@/components/landing/AkasDwar";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AkasDwar />
      <FeatureGrid />
      <SectionShell
        eyebrow="Learning stance"
        title="Respectful stories. Separate science. Honest evidence."
        description="AkasGatha is designed so learners can enjoy cultural meaning while still seeing what science can measure, what remains symbolic, and what is unknown."
        className="border-t border-white/10 bg-slate-950/70"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <GlowCard>
            <h3 className="text-lg font-semibold text-white">Narrative layer</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Stories are framed as cultural narratives that can inspire
              curiosity and memory.
            </p>
          </GlowCard>
          <GlowCard>
            <h3 className="text-lg font-semibold text-white">Science layer</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Scientific explanations are kept evidence-aware, observational,
              and separate from symbolic meaning.
            </p>
          </GlowCard>
          <GlowCard>
            <h3 className="text-lg font-semibold text-white">Safety layer</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The platform avoids personal prediction claims, miracle claims,
              and mythology-as-proof language.
            </p>
          </GlowCard>
        </div>
      </SectionShell>
    </main>
  );
}
