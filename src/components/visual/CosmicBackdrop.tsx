import React from "react";

export function CosmicBackdrop() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--color-obsidian)]" aria-hidden="true">
      {/* Nebula Glow */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, var(--color-cosmic-blue) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-antique-gold) 0%, transparent 50%)",
        }}
      />

      {/* Star Layer 1 (Dense, faint, slow) */}
      <div
        className="absolute inset-0 opacity-50 motion-safe:animate-[star-pan_240s_linear_infinite]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Star Layer 2 (Medium, bright) */}
      <div
        className="absolute inset-0 opacity-40 motion-safe:animate-[star-pan_180s_linear_infinite_reverse]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)",
          backgroundSize: "150px 150px",
          backgroundPosition: "50px 50px",
        }}
      />

      {/* Star Layer 3 (Sparse, prominent) */}
      <div
        className="absolute inset-0 opacity-30 motion-safe:animate-[star-pan_120s_linear_infinite]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(252,251,249,1) 2px, transparent 2px)",
          backgroundSize: "250px 250px",
          backgroundPosition: "100px 100px",
        }}
      />

      {/* Bottom gradient to ensure content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-obsidian)]/40 to-[var(--color-obsidian)]/90" />
    </div>
  );
}
