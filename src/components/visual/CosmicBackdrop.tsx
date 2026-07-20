"use client";

import React, { useEffect, useRef, useState } from "react";
import { CosmicPointerField } from "./CosmicPointerField";

export type BackdropVariant =
  | "universe"
  | "nebula"
  | "stardust"
  | "pulsar"
  | "cosmic_archive"
  | "eclipse_void"
  | "lunar"
  | "mission_orbit";

type CosmicBackdropProps = {
  variant?: BackdropVariant;
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
  className?: string;
};

/* Per-variant nebula colour pairs */
const VARIANT_NEBULA: Record<
  BackdropVariant,
  { a: string; b: string; c: string }
> = {
  universe:       { a: "rgba(41,29,85,0.35)",    b: "rgba(24,35,90,0.30)",   c: "rgba(119,89,217,0.10)" },
  nebula:         { a: "rgba(41,29,85,0.50)",    b: "rgba(119,89,217,0.25)", c: "rgba(85,124,214,0.15)" },
  stardust:       { a: "rgba(24,35,90,0.25)",    b: "rgba(216,220,233,0.04)",c: "rgba(85,124,214,0.10)" },
  pulsar:         { a: "rgba(119,89,217,0.40)",  b: "rgba(41,29,85,0.35)",   c: "rgba(95,166,184,0.15)" },
  cosmic_archive: { a: "rgba(24,35,90,0.40)",    b: "rgba(189,165,106,0.08)",c: "rgba(85,124,214,0.20)" },
  eclipse_void:   { a: "rgba(122,49,72,0.20)",   b: "rgba(7,9,18,0.90)",     c: "rgba(41,29,85,0.20)" },
  lunar:          { a: "rgba(216,220,233,0.08)",  b: "rgba(24,35,90,0.20)",   c: "rgba(95,166,184,0.08)" },
  mission_orbit:  { a: "rgba(95,166,184,0.20)",  b: "rgba(85,124,214,0.25)", c: "rgba(24,35,90,0.30)" },
};

export function CosmicBackdrop({
  variant = "universe",
  intensity = "medium",
  interactive = false,
  className = "",
}: CosmicBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Detect reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* Optional mouse parallax */
  useEffect(() => {
    if (!interactive || reducedMotion) return;
    const move = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [interactive, reducedMotion]);

  const nebula = VARIANT_NEBULA[variant];
  const intensityOpacity = intensity === "low" ? 0.6 : intensity === "high" ? 1.4 : 1.0;

  /* Parallax offsets */
  const p1x = interactive ? mouse.x * -12 : 0;
  const p1y = interactive ? mouse.y * -8 : 0;
  const p2x = interactive ? mouse.x * 8 : 0;
  const p2y = interactive ? mouse.y * 5 : 0;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[-1] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* === Layer 0: Deep void base === */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--space-void)" }}
      />

      {/* === Layer 1: Large slow nebula clouds === */}
      <div
        className="absolute inset-[-20%]"
        style={{
          opacity: 0.9 * intensityOpacity,
          background: `
            radial-gradient(ellipse 80% 60% at 18% 38%, ${nebula.a}, transparent 60%),
            radial-gradient(ellipse 65% 50% at 82% 65%, ${nebula.b}, transparent 55%),
            radial-gradient(ellipse 45% 35% at 52% 12%, ${nebula.c}, transparent 50%)
          `,
          animation: reducedMotion ? "none" : `nebula-breathe 18s ease-in-out infinite`,
          transform: `translate(${p1x}px, ${p1y}px)`,
          transition: "transform 0.8s ease-out",
        }}
      />

      {/* === Layer 2: Secondary nebula (shifted phase) === */}
      <div
        className="absolute inset-[-15%]"
        style={{
          opacity: 0.6 * intensityOpacity,
          background: `
            radial-gradient(ellipse 55% 45% at 70% 25%, ${nebula.a}, transparent 55%),
            radial-gradient(ellipse 40% 35% at 25% 75%, ${nebula.c}, transparent 50%)
          `,
          animation: reducedMotion ? "none" : `nebula-breathe-alt 24s ease-in-out infinite`,
          transform: `translate(${p2x}px, ${p2y}px)`,
          transition: "transform 0.8s ease-out",
        }}
      />

      {/* === Layer 3: Far-depth faint stars (very dense, tiny) === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.35 * intensityOpacity,
          backgroundImage:
            "radial-gradient(circle, rgba(216,220,233,0.55) 0.5px, transparent 0.5px)",
          backgroundSize: "52px 52px",
          backgroundPosition: "12px 8px",
          animation: reducedMotion ? "none" : "pan-x-slow 280s linear infinite",
        }}
      />

      {/* === Layer 4: Mid-depth stars === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.30 * intensityOpacity,
          backgroundImage:
            "radial-gradient(circle, rgba(241,240,232,0.70) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          backgroundPosition: "60px 40px",
          animation: reducedMotion ? "none" : "pan-x-medium 160s linear infinite",
          transform: `translate(${p2x * 0.4}px, ${p2y * 0.4}px)`,
          transition: "transform 0.6s ease-out",
        }}
      />

      {/* === Layer 5: Foreground bright stars (sparse) === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.45 * intensityOpacity,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.90) 1.5px, transparent 1.5px)",
          backgroundSize: "220px 220px",
          backgroundPosition: "80px 90px",
          animation: reducedMotion ? "none" : "pan-x-fast 100s linear infinite",
          transform: `translate(${p1x * 0.6}px, ${p1y * 0.6}px)`,
          transition: "transform 0.4s ease-out",
        }}
      />

      {/* === Layer 6: Gold celestial dust === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.07 * intensityOpacity,
          backgroundImage:
            "radial-gradient(circle, rgba(189,165,106,0.8) 1px, transparent 1px)",
          backgroundSize: "180px 180px",
          backgroundPosition: "30px 70px",
          animation: reducedMotion ? "none" : "gold-shimmer 12s ease-in-out infinite",
        }}
      />

      {/* === Layer 7: Occasional pulsar glow === */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "28%",
          left: "72%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--space-pulsar)",
          boxShadow: "0 0 20px 8px rgba(119,89,217,0.4), 0 0 60px 20px rgba(119,89,217,0.1)",
          animation: reducedMotion ? "none" : "pulsar-flash 7s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: "64%",
          left: "14%",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "var(--space-sapphire)",
          boxShadow: "0 0 14px 6px rgba(85,124,214,0.4), 0 0 40px 14px rgba(85,124,214,0.1)",
          animation: reducedMotion ? "none" : "pulsar-flash 11s ease-in-out infinite 3.5s",
        }}
      />

      {/* === Layer 7.5: Pointer Field === */}
      <CosmicPointerField />

      {/* === Layer 8: Bottom vignette (reduced for seamless scrolling) === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(3,4,10,0.25) 60%, rgba(3,4,10,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* === Layer 9: Subtle edge vignette === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(3,4,10,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
