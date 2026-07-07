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
        "group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 text-slate-100 shadow-[0_18px_80px_rgba(2,6,23,0.34)] backdrop-blur-md transition duration-300 hover:border-sky-300/40 hover:bg-white/[0.075]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />
      {children}
    </Component>
  );
}
