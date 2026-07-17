"use client";

import React, { useRef, useState, useEffect } from "react";

export type SpaceModelVariant =
  | "cosmic_gate"
  | "planet_orbit"
  | "eclipse_alignment"
  | "moon_phase"
  | "star_map"
  | "knowledge_library"
  | "question_orb"
  | "evidence_grid"
  | "telescope_view"
  | "constellation_path"
  | "mystery_orb"
  | "celestial_cycle"
  | "satellite_orbit";

type InteractiveSpaceModelProps = {
  variant: SpaceModelVariant;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

export function InteractiveSpaceModel({
  variant,
  className = "",
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
}: InteractiveSpaceModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (reducedMotion || !containerRef.current) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;

    const rotateX = -(y / rect.height) * 30; // Max 15 degrees tilt
    const rotateY = (x / rect.width) * 30;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    setIsHovered(true);
  };

  const renderModel = () => {
    switch (variant) {
      case "cosmic_gate":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="absolute h-48 w-48 rounded-full border border-[var(--color-antique-gold)]/40 opacity-70 animate-[spin_20s_linear_infinite]" style={{ transform: "rotateX(75deg)" }} />
            <div className="absolute h-56 w-56 rounded-full border border-[var(--color-cosmic-blue)]/50 opacity-60 animate-[spin_30s_linear_infinite_reverse]" style={{ transform: "rotateY(75deg)" }} />
            <div className="absolute h-32 w-32 rounded-full bg-[var(--color-obsidian)] shadow-[0_0_60px_var(--color-cosmic-blue)] border border-[var(--color-antique-gold)]/30 backdrop-blur-md" style={{ transform: "translateZ(30px)" }} />
            <div className="absolute h-2 w-2 rounded-full bg-[var(--color-ivory)] shadow-[0_0_10px_var(--color-ivory)]" style={{ transform: "translateZ(50px)" }} />
          </div>
        );
      case "planet_orbit":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-[var(--color-graphite)] to-[var(--color-obsidian)] border border-[var(--color-antique-gold)]/20 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8),_0_0_40px_var(--color-cosmic-blue)]" />
            <div className="absolute h-48 w-48 rounded-full border-2 border-dashed border-[var(--color-ivory)]/10 animate-[spin_15s_linear_infinite]" style={{ transform: "rotateX(60deg)" }}>
               <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-antique-gold)] shadow-[0_0_10px_var(--color-antique-gold)]" />
            </div>
            <div className="absolute h-64 w-64 rounded-full border border-[var(--color-cosmic-blue)]/30 animate-[spin_25s_linear_infinite_reverse]" style={{ transform: "rotateX(70deg)" }}>
               <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--color-ivory)] shadow-[0_0_8px_var(--color-ivory)]" />
            </div>
          </div>
        );
      case "eclipse_alignment":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="absolute h-40 w-40 rounded-full bg-[var(--color-antique-gold)]/20 shadow-[0_0_80px_var(--color-antique-gold)] blur-md" style={{ transform: "translateZ(-40px)" }} />
            <div className="absolute h-32 w-32 rounded-full bg-[var(--color-obsidian)] border border-[var(--color-cosmic-blue)]/50 shadow-[0_0_20px_var(--color-ivory)]" style={{ transform: "translateZ(20px)" }} />
            <div className="absolute h-10 w-10 rounded-full bg-[var(--color-graphite)] border border-[var(--color-ivory)]/20 shadow-[0_0_10px_black]" style={{ transform: "translateZ(80px) translateX(40px)" }} />
          </div>
        );
      case "mystery_orb":
      case "question_orb":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="absolute h-36 w-36 rounded-full bg-gradient-to-br from-[var(--color-cosmic-blue)]/20 to-[var(--color-obsidian)] backdrop-blur-xl border border-[var(--color-ivory)]/20 shadow-[0_0_50px_var(--color-cosmic-blue)]" />
            <div className="absolute h-24 w-24 rounded-full border border-[var(--color-antique-gold)]/30 animate-[spin_10s_linear_infinite]" style={{ transform: "rotateX(45deg) rotateY(45deg)" }} />
            <div className="absolute h-24 w-24 rounded-full border border-[var(--color-ivory)]/20 animate-[spin_12s_linear_infinite_reverse]" style={{ transform: "rotateX(-45deg) rotateY(-45deg)" }} />
            <div className="absolute h-3 w-3 rounded-full bg-[var(--color-ivory)] shadow-[0_0_15px_var(--color-ivory)] animate-pulse" />
          </div>
        );
      case "knowledge_library":
      case "evidence_grid":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="grid grid-cols-3 gap-3" style={{ transform: "rotateX(60deg) rotateZ(45deg)" }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`h-12 w-12 rounded bg-[var(--color-graphite)]/80 border border-[var(--color-cosmic-blue)]/40 backdrop-blur-sm ${i % 2 === 0 ? 'shadow-[0_0_15px_var(--color-antique-gold)]' : ''}`} style={{ transform: `translateZ(${Math.sin(i) * 20}px)` }} />
              ))}
            </div>
          </div>
        );
      case "star_map":
      case "constellation_path":
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <svg viewBox="0 0 100 100" className="absolute h-full w-full overflow-visible opacity-50" style={{ transform: "translateZ(0)" }}>
              <path d="M 20 50 L 40 20 L 70 30 L 80 70 L 50 80 Z" fill="none" stroke="var(--color-antique-gold)" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[spin_40s_linear_infinite_reverse] origin-center" />
            </svg>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-[var(--color-ivory)] shadow-[0_0_8px_var(--color-ivory)]" style={{ transform: `translate3d(${(i * 15) - 30}px, ${(i % 2 === 0 ? -20 : 20)}px, ${i * 10}px)` }} />
            ))}
            <div className="absolute h-64 w-64 rounded-full border-t border-[var(--color-cosmic-blue)]/30" style={{ transform: "rotateX(80deg)" }} />
          </div>
        );
      default:
        // Generic fallback variant for celestial_cycle, satellite_orbit, telescope_view, moon_phase
        return (
          <div className="relative flex h-full w-full items-center justify-center transform-style-3d">
            <div className="absolute h-40 w-40 rounded-full border border-[var(--color-ivory)]/10" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
            <div className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-[var(--color-cosmic-blue)] to-[var(--color-graphite)] shadow-[0_0_30px_var(--color-cosmic-blue)]" />
            <div className="absolute h-2 w-2 rounded-full bg-[var(--color-antique-gold)] shadow-[0_0_10px_var(--color-antique-gold)] animate-[spin_8s_linear_infinite] origin-[40px_40px]" />
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative perspective-1000 touch-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ariaHidden ? "presentation" : "img"}
    >
      <div
        className="relative h-full w-full transform-style-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
        }}
      >
        {renderModel()}
      </div>
    </div>
  );
}
