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
    "max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-4xl";

  return (
    <section className={["px-5 py-16 sm:px-6 lg:px-8", className].join(" ")}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-amber-200">
              {eyebrow}
            </p>
          ) : null}
          {headingLevel === "h1" ? (
            <h1 className={headingClasses}>{title}</h1>
          ) : (
            <h2 className={headingClasses}>{title}</h2>
          )}
          {description ? (
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
