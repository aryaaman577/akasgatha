import React from "react";
import { SkeletonCard } from "../shared/SkeletonCard";

export function ResponseSkeleton() {
  return (
    <div className="mt-8 space-y-6 animate-pulse">
      <SkeletonCard lines={4} />
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
      <SkeletonCard lines={2} />
    </div>
  );
}
