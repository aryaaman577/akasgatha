"use client";

import Link from "next/link";
import { navigationItems } from "@/config/navigation";
import { useLanguage, translations } from "@/config/language";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer
      className="px-5 py-12 sm:px-6 lg:px-8"
      style={{
        borderTop: "1px solid rgba(189,165,106,0.08)",
        background: "rgba(3,4,10,0.92)",
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div>
          <p
            className="font-display text-fluid-card font-light tracking-widest"
            style={{ color: "var(--space-antique-gold)" }}
          >
            AkasGatha
          </p>
          <p
            className="mt-4 max-w-optimal text-fluid-body text-balance-pretty"
            style={{ color: "var(--space-stardust)", opacity: 0.6 }}
          >
            {t.footerLine}
          </p>
          <p
            className="mt-2 max-w-optimal text-fluid-body text-balance-pretty"
            style={{ color: "var(--space-stardust)", opacity: 0.4 }}
          >
            {t.footerSafe}
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-1 md:justify-end">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-fluid-button text-[var(--space-stardust)] opacity-55 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--space-antique-gold)]"
            >
              {t[item.key]}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
