import type { ReactNode } from "react";

export type CardAtmosphere = "default" | "gold" | "violet" | "cyan" | "void";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section" | "li";
  atmosphere?: CardAtmosphere;
  /** Render a space model in the card visual area */
  modelSlot?: ReactNode;
  /** Set true to clip children (e.g. for pure text cards with no overflow glow needed) */
  clipContent?: boolean;
};

export function GlowCard({
  children,
  className = "",
  as: Component = "article",
  atmosphere = "default",
  modelSlot,
  clipContent = false,
}: GlowCardProps) {
  // Atmosphere-specific Tailwind classes
  const atmosphereClass: Record<CardAtmosphere, string> = {
    default: "border-[rgba(189,165,106,0.12)] hover:border-[rgba(189,165,106,0.30)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_60px_rgba(41,29,85,0.18)]",
    gold:    "border-[rgba(189,165,106,0.28)] hover:border-[rgba(223,207,153,0.45)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_60px_rgba(189,165,106,0.12)]",
    violet:  "border-[rgba(119,89,217,0.22)] hover:border-[rgba(119,89,217,0.45)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_60px_rgba(119,89,217,0.15)]",
    cyan:    "border-[rgba(95,166,184,0.22)] hover:border-[rgba(95,166,184,0.45)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_60px_rgba(95,166,184,0.12)]",
    void:    "border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.10)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.7)]",
  };

  return (
    <Component
      className={[
        "group relative rounded-xl text-[var(--space-moonlight)]",
        "transition-all duration-500 hover:-translate-y-1",
        "shadow-[0_4px_24px_rgba(0,0,0,0.55)]",
        "backdrop-blur-[16px]",
        "border",
        atmosphereClass[atmosphere],
        clipContent ? "overflow-hidden" : "overflow-visible",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background:
          "linear-gradient(135deg, rgba(16,19,29,0.88) 0%, rgba(7,9,18,0.78) 100%)",
      }}
    >
      {/* Top shimmer line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(189,165,106,0.35), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Optional model slot — intentionally overflow-visible */}
      {modelSlot && (
        <div className="relative overflow-visible" aria-hidden="true">
          {modelSlot}
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10 p-6">{children}</div>
    </Component>
  );
}
