import React from "react";
import { GlowCard } from "./GlowCard";

type SkeletonCardProps = {
  className?: string;
  lines?: number;
  label?: string;
};

export function SkeletonCard({ className = "", lines = 3, label }: SkeletonCardProps) {
  return (
    <GlowCard className={`${className}`} atmosphere="void">
      {label && (
        <p
          className="mb-4 text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--space-stardust)", opacity: 0.5 }}
        >
          {label}
        </p>
      )}
      {/* Shimmer bar — heading */}
      <div
        className="mb-4 h-5 w-1/3 rounded"
        style={{
          background: "linear-gradient(90deg, rgba(189,165,106,0.06) 0%, rgba(189,165,106,0.14) 50%, rgba(189,165,106,0.06) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s ease-in-out infinite",
        }}
      />
      {/* Shimmer bars — body */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3.5 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`}
            style={{
              background: "linear-gradient(90deg, rgba(216,220,233,0.03) 0%, rgba(216,220,233,0.08) 50%, rgba(216,220,233,0.03) 100%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 2s ease-in-out infinite ${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </GlowCard>
  );
}
