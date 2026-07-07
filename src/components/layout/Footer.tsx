import Link from "next/link";

import { navigationItems } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div>
          <p className="text-lg font-semibold text-white">AkasGatha</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Cultural stories are presented as narratives. Scientific explanations
            and evidence are kept separate for clear, respectful learning.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            A student-built educational platform for sky stories, astronomy, and
            careful science communication.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-2 md:justify-end">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-slate-400 outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
