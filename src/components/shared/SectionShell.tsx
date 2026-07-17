import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: "h1" | "h2";
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className = "",
  headingLevel = "h2",
}: SectionShellProps) {
  const headingClasses =
    "font-display max-w-3xl text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[var(--color-ivory)]";

  return (
    <section className={["px-6 py-20 sm:py-28 lg:px-8", className].join(" ")}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--color-antique-gold)]">
              {eyebrow}
            </p>
          ) : null}
          {headingLevel === "h1" ? (
            <h1 className={headingClasses}>{title}</h1>
          ) : (
            <h2 className={headingClasses}>{title}</h2>
          )}
          {description ? (
            <p className="mt-6 text-base leading-relaxed text-[var(--color-ivory)]/70 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
