import React from "react";
import { GlowCard } from "./GlowCard";

type SkeletonCardProps = {
  className?: string;
  lines?: number;
};

export function SkeletonCard({ className = "", lines = 3 }: SkeletonCardProps) {
  return (
    <GlowCard className={`animate-pulse ${className}`}>
      <div className="mb-4 h-6 w-1/3 rounded bg-[var(--color-ivory)]/10" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-[var(--color-ivory)]/5 ${
              i === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </GlowCard>
  );
}
