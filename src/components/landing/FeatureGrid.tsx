import { featureItems } from "@/config/features";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";
import { InteractiveSpaceModel } from "@/components/visual/InteractiveSpaceModel";

export function FeatureGrid() {
  return (
    <SectionShell
      eyebrow="Feature overview"
      title="A frontend foundation for careful cosmic learning."
      description="Each module is designed to help learners move between narrative, mystery, evidence, and recall without blending cultural meaning with scientific proof."
      className="relative"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featureItems.map((feature) => (
          <GlowCard key={feature.title} className="flex min-h-[280px] flex-col relative overflow-hidden group">
            <div className="absolute right-[-20%] top-[-10%] h-32 w-32 opacity-30 transition-opacity duration-500 group-hover:opacity-100">
              <InteractiveSpaceModel variant={feature.variant} aria-hidden={true} />
            </div>
            <div className="relative z-10 flex flex-1 flex-col justify-end mt-16">
              <h3 className="font-display text-2xl font-light tracking-wide text-[var(--color-antique-gold)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-ivory)]/80">
                {feature.description}
              </p>
            </div>
          </GlowCard>
        ))}
      </div>
    </SectionShell>
  );
}
