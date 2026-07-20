import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: "h1" | "h2";
  /** Slot for a decorative visual beside the heading */
  visualSlot?: ReactNode;
  /** Show a subtle vertical connector line on the left */
  connectedScroll?: boolean;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className = "",
  headingLevel = "h2",
  visualSlot,
  connectedScroll = false,
}: SectionShellProps) {
  const headingClasses =
    "font-display max-w-3xl text-fluid-section font-light tracking-wide text-[var(--space-moonlight)]";

  return (
    <section
      className={[
        "relative px-5 py-16 sm:px-6 sm:py-24 lg:px-8",
        className,
      ].join(" ")}
    >
      {/* Optional left scroll connector */}
      {connectedScroll && (
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(189,165,106,0.2) 20%, rgba(189,165,106,0.2) 80%, transparent 100%)",
            marginLeft: "2rem",
          }}
          aria-hidden="true"
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div
          className={[
            "mb-12",
            visualSlot ? "flex flex-col gap-8 md:flex-row md:items-start" : "",
          ].join(" ")}
        >
          {/* Text block */}
          <div className="max-w-3xl flex-1">
            {eyebrow && (
              <p className="mb-4 text-fluid-label font-medium uppercase tracking-[0.2em] text-[var(--space-antique-gold)]">
                {eyebrow}
              </p>
            )}
            {headingLevel === "h1" ? (
              <h1 className={headingClasses}>{title}</h1>
            ) : (
              <h2 className={headingClasses}>{title}</h2>
            )}
            {description && (
              <p className="mt-6 max-w-optimal text-fluid-body text-balance-pretty text-[var(--space-stardust)]/70">
                {description}
              </p>
            )}
          </div>

          {/* Optional visual slot */}
          {visualSlot && (
            <div className="flex-shrink-0 overflow-visible" aria-hidden="true">
              {visualSlot}
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
