import Link from "next/link";

import { navigationItems } from "@/config/navigation";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-lg font-semibold tracking-normal text-white outline-none transition hover:text-amber-100 focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          AkasGatha
        </Link>
        <div className="flex flex-wrap gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-md border border-transparent px-3 text-sm font-medium text-slate-300 outline-none transition hover:border-white/10 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
