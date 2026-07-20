"use client";

import { SkeletonCard } from "../shared/SkeletonCard";
import { useLanguage, translations } from "@/config/language";

export function ResponseSkeleton() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="mt-6 space-y-4">
      <SkeletonCard lines={4} label={t.skeletonLabel} />
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
    </div>
  );
}
