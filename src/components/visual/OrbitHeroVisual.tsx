import React from "react";
import { InteractiveSpaceModel } from "./InteractiveSpaceModel";

export function OrbitHeroVisual() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[500px] items-center justify-center lg:max-w-none lg:h-[500px]">
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-cosmic-blue)]/20 to-[var(--color-antique-gold)]/10 blur-3xl" aria-hidden="true" />
      
      {/* Main Interactive Model */}
      <div className="relative h-full w-full z-10">
        <InteractiveSpaceModel 
          variant="cosmic_gate" 
          aria-label="Interactive 3D cosmic gate"
        />
      </div>

      {/* Decorative Frame */}
      <div className="pointer-events-none absolute inset-4 rounded-full border border-[var(--color-ivory)]/5 shadow-[inset_0_0_60px_rgba(35,52,92,0.3)]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-ivory)]/0 via-[var(--color-ivory)]/20 to-[var(--color-ivory)]/0" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-[var(--color-ivory)]/0 via-[var(--color-ivory)]/20 to-[var(--color-ivory)]/0" aria-hidden="true" />
    </div>
  );
}
