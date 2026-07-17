import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
};

export function GlowCard({
  children,
  className = "",
  as: Component = "article",
}: GlowCardProps) {
  return (
    <Component
      className={[
        "group relative overflow-hidden rounded-lg border border-white/5 bg-[var(--color-graphite)]/40 p-6 text-[var(--color-ivory)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-cosmic-blue)]/60 hover:bg-[var(--color-graphite)]/60 hover:shadow-[0_16px_48px_rgba(35,52,92,0.3)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-antique-gold)]/30 to-transparent transition-opacity duration-500 group-hover:via-[var(--color-antique-gold)]/60" />
      {children}
    </Component>
  );
}
