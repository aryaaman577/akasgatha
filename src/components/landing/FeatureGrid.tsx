import { featureItems } from "@/config/features";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionShell } from "@/components/shared/SectionShell";

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
          <GlowCard key={feature.title} className="min-h-[238px]">
            <div className="mb-5 h-1 w-12 rounded bg-gradient-to-r from-amber-200 via-sky-300 to-teal-300" />
            <h3 className="text-lg font-semibold tracking-normal text-white">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {feature.description}
            </p>
            <p className="mt-4 text-sm leading-6 text-amber-100/90">
              {feature.whyItMatters}
            </p>
          </GlowCard>
        ))}
      </div>
    </SectionShell>
  );
}
