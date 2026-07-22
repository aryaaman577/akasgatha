"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";

/* ============================================================
   TYPES
   ============================================================ */
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
  | "satellite_orbit"
  | "story_orbit"
  | "science_lens"
  | "truth_bridge";

export type ModelSize = "sm" | "md" | "lg" | "xl" | "full" | "about_lg" | "about_sm";
export type InteractionMode = "tilt" | "rotate" | "none";
export type VisualIntensity = "subtle" | "normal" | "vivid";

type InteractiveSpaceModelProps = {
  variant: SpaceModelVariant;
  size?: ModelSize;
  interactionMode?: InteractionMode;
  intensity?: VisualIntensity;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

const SIZE_MAP: Record<ModelSize, string> = {
  sm:   "h-24 w-24",
  md:   "h-40 w-40",
  lg:   "h-56 w-56",
  xl:   "h-72 w-72",
  full: "h-full w-full",
  about_lg: "h-full w-full",
  about_sm: "h-full w-full",
};

/* ============================================================
   MODEL RENDERERS
   ============================================================ */

function CosmicGate() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Nebula fog glow */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(119,89,217,0.25) 0%, rgba(41,29,85,0.15) 40%, transparent 70%)", filter: "blur(12px)" }} />
      {/* Outer ring — gold celestial markings */}
      <div className="absolute h-48 w-48 rounded-full"
        style={{
          border: "1.5px solid rgba(189,165,106,0.5)",
          boxShadow: "0 0 20px rgba(189,165,106,0.2), inset 0 0 20px rgba(189,165,106,0.05)",
          transform: `rotateX(72deg) rotateZ(calc(var(--idle) * 0.3))`,
          animation: "none",
        }} />
      {/* Mid ring — violet pulsar */}
      <div className="absolute h-36 w-36 rounded-full"
        style={{
          border: "1px solid rgba(119,89,217,0.6)",
          boxShadow: "0 0 15px rgba(119,89,217,0.3)",
          transform: `rotateX(60deg) rotateZ(calc(var(--idle) * -0.5))`,
        }} />
      {/* Inner ring — moonlight rim */}
      <div className="absolute h-24 w-24 rounded-full"
        style={{
          border: "1px solid rgba(241,240,232,0.2)",
          transform: `rotateX(80deg) rotateZ(calc(var(--idle) * 0.7))`,
        }} />
      {/* Portal void center */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(3,4,10,0.98) 0%, rgba(7,9,18,0.9) 60%, rgba(41,29,85,0.3) 100%)",
          boxShadow: "0 0 30px rgba(119,89,217,0.3), inset 0 0 20px rgba(0,0,0,0.9)",
        }} />
      {/* Gold tick marks at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <div key={deg} className="absolute h-1 w-4 rounded-full"
          style={{
            background: "rgba(189,165,106,0.8)",
            transform: `rotate(${deg}deg) translateX(27px)`,
            boxShadow: "0 0 6px rgba(189,165,106,0.6)",
          }} />
      ))}
      {/* Pulsar light point */}
      <div className="absolute h-2 w-2 rounded-full"
        style={{
          background: "rgba(241,240,232,0.9)",
          boxShadow: "0 0 12px 4px rgba(119,89,217,0.6), 0 0 4px rgba(255,255,255,0.8)",
        }} />
    </div>
  );
}

function PlanetOrbit() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d", transform: "scale(0.65)" }}>
      {/* Deep space ambient glow */}
      <div className="absolute h-40 w-40 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(85,124,214,0.08) 0%, transparent 70%)",
          filter: "blur(16px)",
          transform: "translateZ(-20px)",
        }} />
      
      {/* Planet sphere with enhanced depth */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle at 32% 32%, rgba(95,166,184,0.9) 0%, rgba(85,124,214,0.7) 25%, rgba(24,35,90,0.95) 65%, rgba(7,9,18,1) 100%)",
          boxShadow: "-10px -10px 24px rgba(0,0,0,0.85), 0 0 45px rgba(85,124,214,0.35), inset -14px -14px 32px rgba(0,0,0,0.7), inset 2px 2px 8px rgba(95,166,184,0.15)",
          transform: "translateZ(5px)",
        }} />
      
      {/* Surface texture overlay */}
      <div className="absolute h-28 w-28 rounded-full overflow-hidden"
        style={{
          background: "radial-gradient(circle at 30% 30%, transparent 0%, rgba(24,35,90,0.2) 40%, transparent 70%)",
          transform: "translateZ(6px)",
          opacity: 0.6,
        }} />
      
      {/* Atmosphere rim with glow */}
      <div className="absolute h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle at 32% 32%, transparent 78%, rgba(95,166,184,0.4) 84%, transparent 92%)",
          filter: "blur(3px)",
          transform: "translateZ(7px)",
        }} />
      
      {/* Orbit ring 1 — inner with moon */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{
          border: "1.5px solid rgba(189,165,106,0.4)",
          boxShadow: "0 0 8px rgba(189,165,106,0.15)",
          transform: `rotateX(68deg) rotateZ(calc(var(--idle) * 0.15))`,
        }}>
        <div className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, rgba(241,240,232,0.95), rgba(200,204,214,0.8) 50%, rgba(170,170,180,0.7))",
            boxShadow: "0 0 10px rgba(216,220,233,0.6), inset -1px -1px 3px rgba(0,0,0,0.3)",
          }} />
      </div>
      
      {/* Orbit ring 2 — outer with asteroid */}
      <div className="absolute h-60 w-60 rounded-full"
        style={{
          border: "1px dashed rgba(85,124,214,0.3)",
          transform: `rotateX(72deg) rotateZ(calc(var(--idle) * -0.12))`,
        }}>
        <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{
            background: "rgba(95,166,184,0.9)",
            boxShadow: "0 0 8px rgba(95,166,184,0.7)",
          }} />
      </div>
      
      {/* Enhanced stardust with varied sizes */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            background: i % 2 === 0 ? "rgba(241,240,232,0.7)" : "rgba(216,220,233,0.5)",
            transform: `rotate(${i * 45}deg) translateX(${38 + (i % 3) * 8}px)`,
            boxShadow: i % 3 === 0 ? "0 0 2px rgba(241,240,232,0.5)" : "none",
          }} />
      ))}
    </div>
  );
}

function EclipseAlignment() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Deep space backdrop */}
      <div className="absolute h-48 w-64 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(122,49,72,0.08) 0%, transparent 60%)",
          filter: "blur(18px)",
          transform: "translateZ(-25px)",
        }} />
      
      {/* Scientific orbital line */}
      <div className="absolute h-1 w-52"
        style={{
          background: "linear-gradient(to right, transparent, rgba(189,165,106,0.7), rgba(189,165,106,0.5), transparent)",
          boxShadow: "0 0 4px rgba(189,165,106,0.3)",
        }} />
      
      {/* Sun with enhanced corona */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,200,80,1) 0%, rgba(232,160,48,0.95) 40%, rgba(220,120,20,0.8) 70%, rgba(180,70,10,0.4) 88%, transparent 100%)",
          boxShadow: "0 0 45px rgba(232,160,48,0.7), 0 0 90px rgba(232,160,48,0.25), inset 0 0 15px rgba(255,220,120,0.5)",
          transform: "translateX(-56px) translateZ(3px)",
        }} />
      
      {/* Multi-layer corona */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 55%, rgba(232,160,48,0.15) 65%, rgba(122,49,72,0.25) 75%, rgba(232,160,48,0.08) 88%, transparent 100%)",
          transform: "translateX(-56px) translateZ(2px)",
          filter: "blur(5px)",
        }} />
      <div className="absolute h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 60%, rgba(232,160,48,0.08) 75%, transparent 90%)",
          transform: "translateX(-56px) translateZ(1px)",
          filter: "blur(8px)",
        }} />
      
      {/* Earth (dark silhouette with atmosphere) */}
      <div className="absolute h-16 w-16 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 38%, rgba(24,35,90,0.95), rgba(7,9,18,0.99))",
          boxShadow: "0 0 14px rgba(216,220,233,0.35), inset -3px -3px 8px rgba(0,0,0,0.7)",
          transform: "translateZ(8px)",
        }} />
      
      {/* Earth atmosphere rim */}
      <div className="absolute h-18 w-18 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 85%, rgba(95,166,184,0.25) 92%, transparent 98%)",
          width: "4.5rem",
          height: "4.5rem",
          filter: "blur(2px)",
          transform: "translateZ(9px)",
        }} />
      
      {/* Moon (enhanced detail) */}
      <div className="absolute h-8 w-8 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(241,240,232,0.95), rgba(216,220,233,0.85) 50%, rgba(180,180,190,0.75))",
          boxShadow: "0 0 12px rgba(216,220,233,0.6), inset -1px -1px 4px rgba(0,0,0,0.4)",
          transform: "translateX(44px) translateZ(10px)",
        }} />
      
      {/* Enhanced shadow cone */}
      <div className="absolute"
        style={{
          width: "68px",
          height: "6px",
          background: "linear-gradient(to right, rgba(7,9,18,0.9) 0%, rgba(7,9,18,0.6) 50%, transparent 100%)",
          transform: "translateX(12px) translateZ(4px)",
          filter: "blur(3px)",
        }} />
      
      {/* Particle rays */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute"
          style={{
            width: i % 2 === 0 ? "1.5px" : "1px",
            height: i % 2 === 0 ? "1.5px" : "1px",
            background: "rgba(232,160,48,0.5)",
            borderRadius: "50%",
            transform: `translateX(${-48 + i * 4}px) translateY(${(i - 2) * 6}px)`,
            boxShadow: "0 0 3px rgba(232,160,48,0.4)",
          }} />
      ))}
    </div>
  );
}

function MoonPhase() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Deep space glow */}
      <div className="absolute h-48 w-48 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,204,214,0.06) 0%, transparent 65%)",
          filter: "blur(20px)",
          transform: "translateZ(-18px)",
        }} />
      
      {/* Orbit arc with subtle glow */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1px solid rgba(189,165,106,0.2)",
          boxShadow: "0 0 6px rgba(189,165,106,0.1)",
          transform: "rotateX(75deg)",
        }} />
      
      {/* Moon sphere with enhanced surface detail */}
      <div className="absolute h-32 w-32 rounded-full overflow-hidden"
        style={{
          background: "radial-gradient(circle at 36% 36%, rgba(241,240,232,0.98) 0%, rgba(216,220,233,0.90) 30%, rgba(200,204,214,0.85) 50%, rgba(150,155,170,0.75) 75%, rgba(100,105,120,0.65) 100%)",
          boxShadow: "0 0 24px rgba(216,220,233,0.25), 0 0 45px rgba(216,220,233,0.1), inset -5px -5px 15px rgba(0,0,0,0.35)",
          transform: "translateZ(8px)",
        }}>
        {/* Surface texture */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 35%, transparent 0%, rgba(150,155,170,0.15) 40%, transparent 65%)",
            opacity: 0.7,
          }} />
        
        {/* Shadow overlay for lunar phase */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at calc(50% + sin(var(--idle) * 0.015) * 22%) 50%, transparent 0%, rgba(3,4,10,0.96) 48%, rgba(3,4,10,0.98) 52%)`,
          }} />
      </div>
      
      {/* Moonlight glow around sphere */}
      <div className="absolute h-36 w-36 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 82%, rgba(241,240,232,0.15) 90%, transparent 98%)",
          filter: "blur(4px)",
          transform: "translateZ(9px)",
        }} />
      
      {/* Enhanced cold dust field */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? "1.5px" : "1px",
            height: i % 3 === 0 ? "1.5px" : "1px",
            background: i % 2 === 0 ? "rgba(216,220,233,0.6)" : "rgba(200,204,214,0.5)",
            transform: `rotate(${i * 36}deg) translateX(${34 + (i % 4) * 6}px)`,
            boxShadow: i % 3 === 0 ? "0 0 2px rgba(216,220,233,0.4)" : "none",
          }} />
      ))}
    </div>
  );
}

function StarMap() {
  const stars = useMemo(() => [
    { x: 50, y: 20 }, { x: 70, y: 35 }, { x: 30, y: 40 },
    { x: 65, y: 60 }, { x: 40, y: 70 }, { x: 55, y: 50 },
    { x: 25, y: 55 }, { x: 75, y: 25 }, { x: 85, y: 45 },
  ], []);
  const edges = [[0,1],[1,3],[3,4],[2,5],[5,1],[2,6],[7,1],[1,8]];
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Deep space nebula backdrop */}
      <div className="absolute h-56 w-56 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(85,124,214,0.06) 0%, rgba(119,89,217,0.04) 50%, transparent 70%)",
          filter: "blur(22px)",
          transform: "translateZ(-22px)",
        }} />
      
      {/* Enhanced celestial grid */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "0.5px solid rgba(85,124,214,0.18)",
          boxShadow: "0 0 8px rgba(85,124,214,0.08)",
          transform: "rotateX(78deg)",
        }} />
      <div className="absolute h-36 w-52"
        style={{
          border: "0.5px solid rgba(85,124,214,0.12)",
          transform: "rotateX(78deg) rotateZ(60deg)",
        }} />
      
      {/* Coordinate markers */}
      {[0, 90, 180, 270].map((deg) => (
        <div key={deg} className="absolute"
          style={{
            width: "1px",
            height: "4px",
            background: "rgba(189,165,106,0.4)",
            transform: `rotate(${deg}deg) translateY(-26px)`,
          }} />
      ))}
      
      {/* Enhanced constellation SVG */}
      <svg viewBox="0 0 100 90" className="absolute h-full w-full" style={{ transform: `rotateY(calc(var(--idle) * 0.04)) translateZ(3px)` }}>
        {/* Connection lines with glow */}
        {edges.map(([a, b], i) => (
          <line key={i}
            x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y}
            stroke="rgba(189,165,106,0.5)" strokeWidth="0.6"
            strokeDasharray="100" strokeDashoffset="0"
            style={{ filter: "drop-shadow(0 0 1px rgba(189,165,106,0.3))" }}
          />
        ))}
        
        {/* Star points with varied sizes */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={i === 5 ? 2.2 : i % 3 === 0 ? 1.5 : 1.2}
            fill={i === 5 ? "rgba(189,165,106,0.95)" : i % 2 === 0 ? "rgba(241,240,232,0.9)" : "rgba(216,220,233,0.85)"}
            style={{
              filter: i === 5
                ? "drop-shadow(0 0 4px rgba(189,165,106,0.9))"
                : i % 3 === 0
                ? "drop-shadow(0 0 2.5px rgba(241,240,232,0.6))"
                : "drop-shadow(0 0 2px rgba(216,220,233,0.5))"
            }} />
        ))}
        
        {/* Subtle name label for main star */}
        <text x={stars[5].x} y={stars[5].y - 6} fontSize="3" fill="rgba(189,165,106,0.6)" textAnchor="middle" fontFamily="monospace">★</text>
      </svg>
      
      {/* Distant background stars */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: "1px",
            height: "1px",
            background: "rgba(216,220,233,0.4)",
            transform: `rotate(${i * 60 + 30}deg) translateX(${42 + (i % 2) * 6}px)`,
          }} />
      ))}
    </div>
  );
}

// Dynamic import for WebGL model
const AkashGranthModel = dynamic(
  () => import("./AkashGranthModel").then(mod => ({ default: mod.AkashGranthModel })),
  { ssr: false }
);

function KnowledgeLibrary() {
  return <AkashGranthModel />;
}

function QuestionOrb() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Layered cosmic depth — deep background glow */}
      <div className="absolute h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(119,89,217,0.08) 0%, rgba(41,29,85,0.12) 40%, transparent 70%)",
          filter: "blur(20px)",
          transform: "translateZ(-30px)",
        }} />
      
      {/* Mid-depth nebula layer */}
      <div className="absolute h-56 w-56 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(119,89,217,0.15) 20%, rgba(41,29,85,0.08) 50%, transparent 75%)",
          filter: "blur(14px)",
          transform: "translateZ(-15px)",
        }} />
      
      {/* Outer energy field with enhanced depth */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1px solid rgba(119,89,217,0.35)",
          boxShadow: "0 0 30px rgba(119,89,217,0.15), inset 0 0 20px rgba(119,89,217,0.05)",
          transform: `rotateX(45deg) rotateZ(calc(var(--idle) * 0.08))`,
          animation: "subtle-pulse 6s ease-in-out infinite",
        }} />
      
      {/* Secondary energy ring for layering */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{
          border: "0.5px solid rgba(95,166,184,0.25)",
          transform: `rotateX(50deg) rotateZ(calc(var(--idle) * -0.06))`,
          animation: "subtle-pulse 8s ease-in-out infinite 1s",
        }} />
      
      {/* Pulsar orb — enhanced with depth layers */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(119,89,217,0.5) 0%, rgba(85,124,214,0.4) 25%, rgba(41,29,85,0.85) 60%, rgba(7,9,18,0.98) 100%)",
          boxShadow: "0 0 40px rgba(119,89,217,0.5), 0 0 80px rgba(119,89,217,0.15), inset -8px -8px 20px rgba(0,0,0,0.4)",
          transform: "translateZ(5px)",
        }} />
      
      {/* Atmospheric rim for 3D effect */}
      <div className="absolute h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, transparent 75%, rgba(119,89,217,0.2) 85%, transparent 95%)",
          filter: "blur(3px)",
          transform: "translateZ(6px)",
        }} />
      
      {/* Energy filaments as SVG with enhanced depth */}
      <svg viewBox="0 0 100 100" className="absolute h-36 w-36"
        style={{ 
          transform: `rotateZ(calc(var(--idle) * 0.12)) translateZ(2px)`,
          filter: "drop-shadow(0 0 3px rgba(119,89,217,0.4))",
        }}>
        {[0,60,120,180,240,300].map((deg, i) => (
          <line key={i}
            x1="50" y1="50"
            x2={50 + Math.cos(deg * Math.PI / 180) * 42}
            y2={50 + Math.sin(deg * Math.PI / 180) * 42}
            stroke="rgba(119,89,217,0.6)" strokeWidth="1"
            style={{ animation: `filament-pulse ${3 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }}
          />
        ))}
        {/* Constellation nodes */}
        {[30, 110, 190, 270].map((deg, i) => (
          <circle key={i}
            cx={50 + Math.cos(deg * Math.PI / 180) * 38}
            cy={50 + Math.sin(deg * Math.PI / 180) * 38}
            r="2" 
            fill="rgba(95,166,184,0.85)"
            style={{ filter: "drop-shadow(0 0 2px rgba(95,166,184,0.6))" }}
          />
        ))}
      </svg>
      
      {/* Particle field — floating cosmic dust */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const radius = 45 + (i % 3) * 8;
        return (
          <div key={i} className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? "2px" : "1.5px",
              height: i % 3 === 0 ? "2px" : "1.5px",
              background: i % 2 === 0 ? "rgba(216,220,233,0.6)" : "rgba(119,89,217,0.5)",
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px)`,
              transform: "translateZ(10px)",
              boxShadow: "0 0 3px rgba(216,220,233,0.4)",
              animation: `particle-float ${4 + (i % 3)}s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
        );
      })}
      
      {/* Silver core with internal depth glow */}
      <div className="absolute h-7 w-7 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(241,240,232,0.98), rgba(216,220,233,0.9) 40%, rgba(180,185,200,0.75) 80%)",
          boxShadow: "0 0 15px rgba(216,220,233,0.7), 0 0 25px rgba(119,89,217,0.3), inset 2px 2px 6px rgba(255,255,255,0.5)",
          transform: "translateZ(8px)",
        }} />
      
      {/* Inner glow accent */}
      <div className="absolute h-4 w-4 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(241,240,232,0.6), transparent 70%)",
          filter: "blur(2px)",
          transform: "translateZ(9px)",
          animation: "core-pulse 4s ease-in-out infinite",
        }} />
    </div>
  );
}

function EvidenceGrid() {
  const nodes = useMemo(() => [
    { x: 20, y: 20, verified: true },  { x: 50, y: 15, verified: false },
    { x: 80, y: 20, verified: true },  { x: 15, y: 50, verified: false },
    { x: 50, y: 50, verified: true },  { x: 85, y: 50, verified: false },
    { x: 20, y: 80, verified: false }, { x: 50, y: 80, verified: true },
    { x: 80, y: 80, verified: false },
  ], []);
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      <svg viewBox="0 0 100 100" className="absolute h-44 w-44"
        style={{ transform: `rotateX(55deg) rotateZ(calc(var(--idle) * 0.15))` }}>
        {/* Grid connections */}
        {nodes.map((n, i) => nodes.slice(i + 1).map((m, j) => {
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          return dist < 40 ? (
            <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="rgba(95,166,184,0.25)" strokeWidth="0.5" />
          ) : null;
        }))}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.verified ? 3 : 2}
            fill={n.verified ? "rgba(189,165,106,0.9)" : "rgba(216,220,233,0.6)"}
            style={{ filter: n.verified ? "drop-shadow(0 0 3px rgba(189,165,106,0.7))" : undefined }} />
        ))}
      </svg>
    </div>
  );
}

function TelescopeView() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Optical lens rings */}
      {[52, 40, 28, 16].map((size, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${size * 4}px`,
            height: `${size * 4}px`,
            border: `${1 + i * 0.3}px solid rgba(${i === 0 ? "189,165,106" : i === 1 ? "85,124,214" : "95,166,184"},${0.25 + i * 0.1})`,
            transform: `rotateZ(calc(var(--idle) * ${i % 2 === 0 ? 0.2 : -0.15}deg))`,
            boxShadow: i === 0 ? "inset 0 0 20px rgba(24,35,90,0.4)" : "none",
          }} />
      ))}
      {/* Observation tick marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <div key={deg} className="absolute rounded-full"
          style={{
            width: "2px",
            height: deg % 90 === 0 ? "8px" : "4px",
            background: `rgba(189,165,106,${deg % 90 === 0 ? 0.7 : 0.3})`,
            transform: `rotate(${deg}deg) translateY(-${52 * 4 / 2 - 4}px)`,
            transformOrigin: "center",
          }} />
      ))}
      {/* Deep-space object in center */}
      <div className="absolute h-8 w-8 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(95,166,184,0.6), rgba(85,124,214,0.4), rgba(24,35,90,0.8))",
          boxShadow: "0 0 15px rgba(95,166,184,0.4)",
        }} />
      {/* Scan line */}
      <div className="absolute h-0.5 w-28"
        style={{
          background: "linear-gradient(to right, transparent, rgba(95,166,184,0.8), transparent)",
          animation: "scan-sweep 4s ease-in-out infinite",
        }} />
    </div>
  );
}

function ConstellationPath() {
  const path = useMemo(() => [
    { x: 20, y: 70 }, { x: 35, y: 50 }, { x: 55, y: 40 },
    { x: 65, y: 25 }, { x: 80, y: 30 }, { x: 75, y: 55 },
  ], []);
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      <svg viewBox="0 0 100 100" className="absolute h-44 w-44"
        style={{ transform: `rotateX(20deg) rotateZ(calc(var(--idle) * 0.1))` }}>
        {/* Path trail */}
        <polyline points={path.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke="rgba(119,89,217,0.4)" strokeWidth="1"
          strokeDasharray="200" strokeDashoffset="0" />
        {/* Stardust trail */}
        {path.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === path.length - 1 ? 3.5 : 2}
            fill={i === path.length - 1 ? "rgba(189,165,106,0.95)" : "rgba(85,124,214,0.8)"}
            style={{
              filter: i === path.length - 1 ? "drop-shadow(0 0 4px rgba(189,165,106,0.8))" : "drop-shadow(0 0 2px rgba(85,124,214,0.6))",
              animation: `node-appear 0.5s ease-out ${i * 0.2}s both`,
            }} />
        ))}
        {/* Breadcrumb dots */}
        {path.slice(0, -1).map((p, i) => {
          const next = path[i + 1];
          const mx = (p.x + next.x) / 2;
          const my = (p.y + next.y) / 2;
          return <circle key={`d${i}`} cx={mx} cy={my} r="0.8" fill="rgba(216,220,233,0.4)" />;
        })}
      </svg>
    </div>
  );
}

function MysteryOrb() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Deep gravitational field */}
      <div className="absolute h-56 w-56 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(122,49,72,0.08) 0%, rgba(119,89,217,0.06) 40%, transparent 70%)",
          filter: "blur(24px)",
          transform: "translateZ(-28px)",
        }} />
      
      {/* Accretion glow with enhanced depth */}
      <div className="absolute h-48 w-48 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 25%, rgba(122,49,72,0.25) 45%, rgba(119,89,217,0.15) 62%, transparent 78%)",
          filter: "blur(10px)",
          animation: "lens-warp 8s ease-in-out infinite",
          transform: "translateZ(-10px)",
        }} />
      
      {/* Gravitational lensing rings with varied speeds */}
      {[52, 40, 28].map((size, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${size * 4}px`,
            height: `${size * 4}px`,
            border: `${0.6 + i * 0.3}px solid rgba(${i === 0 ? "122,49,72" : i === 1 ? "119,89,217" : "85,124,214"},${0.25 + i * 0.12})`,
            boxShadow: `0 0 ${8 + i * 4}px rgba(${i === 0 ? "122,49,72" : i === 1 ? "119,89,217" : "85,124,214"},${0.1 + i * 0.05})`,
            transform: `rotateX(${65 + i * 5}deg) rotateZ(calc(var(--idle) * ${i % 2 === 0 ? 0.08 : -0.12}))`,
          }} />
      ))}
      
      {/* Event horizon core */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(3,4,10,1) 0%, rgba(7,9,18,0.99) 55%, rgba(122,49,72,0.25) 95%, transparent 100%)",
          boxShadow: "0 0 35px rgba(122,49,72,0.35), 0 0 70px rgba(119,89,217,0.18), inset 0 0 20px rgba(0,0,0,0.95)",
          transform: "translateZ(5px)",
        }} />
      
      {/* Photon ring */}
      <div className="absolute h-22 w-22 rounded-full"
        style={{
          width: "5.5rem",
          height: "5.5rem",
          boxShadow: "0 0 0 1.5px rgba(216,220,233,0.15), 0 0 12px rgba(216,220,233,0.08)",
          transform: "translateZ(6px)",
        }} />
      
      {/* Enhanced nebula turbulence */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: i % 2 === 0 ? "2px" : "1.5px",
            height: i % 2 === 0 ? "2px" : "1.5px",
            background: i % 3 === 0 ? "rgba(122,49,72,0.6)" : "rgba(119,89,217,0.5)",
            transform: `rotate(calc(${i * 45}deg + var(--idle) * 0.2)) translateX(${36 + (i % 3) * 4}px)`,
            boxShadow: i % 2 === 0 ? "0 0 3px rgba(119,89,217,0.4)" : "none",
          }} />
      ))}
      
      {/* Distant warped starlight */}
      {[...Array(4)].map((_, i) => (
        <div key={`s${i}`} className="absolute"
          style={{
            width: "1px",
            height: "1px",
            background: "rgba(216,220,233,0.5)",
            borderRadius: "50%",
            transform: `rotate(${i * 90 + 45}deg) translateX(${48}px)`,
          }} />
      ))}
    </div>
  );
}

function CelestialCycle() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Cosmic time field */}
      <div className="absolute h-60 w-60 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(189,165,106,0.06) 0%, rgba(85,124,214,0.04) 50%, transparent 70%)",
          filter: "blur(24px)",
          transform: "translateZ(-25px)",
        }} />
      
      {/* Outer clock ring with enhanced detail */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1.5px solid rgba(189,165,106,0.45)",
          transform: `rotateX(70deg) rotateZ(calc(var(--idle) * 0.06))`,
          boxShadow: "0 0 18px rgba(189,165,106,0.12), inset 0 0 12px rgba(189,165,106,0.05)",
        }}>
        {/* Hour markers with varied sizes */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute"
            style={{
              width: i % 3 === 0 ? "3.5px" : "2px",
              height: i % 3 === 0 ? "12px" : "7px",
              background: `rgba(189,165,106,${i % 3 === 0 ? 0.85 : 0.45})`,
              boxShadow: i % 3 === 0 ? "0 0 3px rgba(189,165,106,0.5)" : "none",
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 30}deg) translateY(-${52 * 2 - 6}px) translateX(-50%)`,
              transformOrigin: "0 0",
            }} />
        ))}
      </div>
      
      {/* Mid ring with subtle glow */}
      <div className="absolute h-36 w-36 rounded-full"
        style={{
          border: "1px solid rgba(85,124,214,0.4)",
          boxShadow: "0 0 8px rgba(85,124,214,0.15)",
          transform: `rotateX(55deg) rotateZ(calc(var(--idle) * -0.1))`,
        }} />
      
      {/* Inner ring */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          border: "1px solid rgba(119,89,217,0.35)",
          transform: `rotateX(80deg) rotateZ(calc(var(--idle) * 0.15))`,
        }} />
      
      {/* Enhanced time marker/hand */}
      <div className="absolute h-2 w-9 rounded-full"
        style={{
          background: "linear-gradient(to right, rgba(241,240,232,0.9), rgba(189,165,106,0.7) 70%, transparent)",
          boxShadow: "0 0 6px rgba(189,165,106,0.5)",
          transform: `rotate(calc(var(--idle) * 0.2))`,
          transformOrigin: "0% 50%",
        }} />
      
      {/* Center pivot point */}
      <div className="absolute h-3.5 w-3.5 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(241,240,232,0.95), rgba(189,165,106,0.8))",
          boxShadow: "0 0 10px rgba(189,165,106,0.7), inset 0 0 3px rgba(255,255,255,0.5)",
        }} />
      
      {/* Orbital markers */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: "2px",
            height: "2px",
            background: "rgba(85,124,214,0.7)",
            transform: `rotate(${i * 90}deg) translateX(18px)`,
            boxShadow: "0 0 2px rgba(85,124,214,0.5)",
          }} />
      ))}
    </div>
  );
}

function SatelliteOrbit() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Space backdrop */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(85,124,214,0.06) 0%, transparent 65%)",
          filter: "blur(20px)",
          transform: "translateZ(-20px)",
        }} />
      
      {/* Enhanced Earth with detail */}
      <div className="absolute h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle at 36% 36%, rgba(95,166,184,0.85), rgba(85,124,214,0.7) 35%, rgba(24,35,90,0.92) 65%, rgba(7,9,18,0.97) 90%)",
          boxShadow: "0 0 32px rgba(95,166,184,0.25), 0 0 50px rgba(85,124,214,0.1), inset 0 0 24px rgba(0,0,0,0.6), inset -4px -4px 12px rgba(0,0,0,0.7)",
          transform: "translateZ(5px)",
        }} />
      
      {/* Cloud layer texture */}
      <div className="absolute h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 40%, transparent 0%, rgba(216,220,233,0.08) 40%, transparent 70%)",
          transform: "translateZ(6px)",
        }} />
      
      {/* Enhanced atmosphere with layers */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 78%, rgba(95,166,184,0.25) 87%, rgba(95,166,184,0.12) 94%, transparent 98%)",
          filter: "blur(2.5px)",
          transform: "translateZ(7px)",
        }} />
      
      {/* Orbital trajectory with glow */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{
          border: "1px dashed rgba(85,124,214,0.4)",
          boxShadow: "0 0 8px rgba(85,124,214,0.15)",
          transform: "rotateX(60deg)",
        }} />
      
      {/* Enhanced satellite body */}
      <div className="absolute"
        style={{
          transform: "translate(calc(cos(var(--idle) * 0.2) * 63px), calc(sin(var(--idle) * 0.2) * 14px)) rotateX(60deg) translateZ(10px)",
        }}>
        {/* Main body */}
        <div style={{
            width: "11px",
            height: "7px",
            background: "linear-gradient(135deg, rgba(216,220,233,0.95), rgba(200,204,214,0.85))",
            borderRadius: "1.5px",
            position: "absolute",
            top: "-3.5px",
            left: "-5.5px",
            boxShadow: "0 0 4px rgba(200,204,214,0.5), inset 1px 1px 2px rgba(255,255,255,0.3)",
          }} />
        
        {/* Solar panels */}
        <div className="absolute flex items-center gap-0.5" style={{ top: "-1.5px", left: "-9px" }}>
          <div style={{
            width: "7px",
            height: "3.5px",
            background: "linear-gradient(90deg, rgba(85,124,214,0.8), rgba(85,124,214,0.6))",
            borderRadius: "0.5px",
            boxShadow: "0 0 2px rgba(85,124,214,0.4)",
          }} />
          <div style={{
            width: "5px",
            height: "7px",
            background: "rgba(200,204,214,0.9)",
            boxShadow: "0 0 3px rgba(200,204,214,0.4)",
          }} />
          <div style={{
            width: "7px",
            height: "3.5px",
            background: "linear-gradient(90deg, rgba(85,124,214,0.6), rgba(85,124,214,0.8))",
            borderRadius: "0.5px",
            boxShadow: "0 0 2px rgba(85,124,214,0.4)",
          }} />
        </div>
      </div>
      
      {/* Enhanced communication pulse */}
      <svg viewBox="0 0 200 200" className="absolute h-44 w-44 opacity-70"
        style={{ transform: "rotateX(60deg)" }}>
        <g style={{ transform: "translate(calc(cos(var(--idle) * 0.2) * 70px), calc(sin(var(--idle) * 0.2) * 28px))" }}>
          <circle cx="100" cy="100" r="4" fill="none" stroke="rgba(95,166,184,0.9)" strokeWidth="1"
            style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
          <circle cx="100" cy="100" r="2" fill="rgba(241,240,232,1)"
            style={{ boxShadow: "0 0 4px rgba(241,240,232,0.8)" }} />
        </g>
      </svg>
      
      {/* Signal traces */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="absolute"
          style={{
            width: "1px",
            height: "1px",
            background: "rgba(95,166,184,0.6)",
            borderRadius: "50%",
            transform: `rotate(${120 * i}deg) translateX(${38 + i * 4}px)`,
          }} />
      ))}
    </div>
  );
}

function StoryOrbit() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Moon-like core */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 38%, rgba(241,240,232,0.7) 0%, rgba(200,190,150,0.6) 40%, rgba(120,100,60,0.5) 100%)",
          boxShadow: "0 0 20px rgba(189,165,106,0.2), inset -6px -6px 15px rgba(0,0,0,0.4)",
        }} />
      {/* Constellation spheres */}
      {[24, 32, 40].map((size, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${size * 4}px`,
            height: `${size * 4}px`,
            border: "0.5px dashed rgba(189,165,106,0.25)",
            transform: `rotateX(${60 + i * 8}deg) rotateZ(calc(var(--idle) * ${i % 2 === 0 ? 0.2 : -0.15} * 1deg))`,
          }} />
      ))}
      {/* Luminous ribbon */}
      <svg viewBox="0 0 100 100" className="absolute h-44 w-44">
        <path d="M 50 10 Q 90 30 80 50 Q 70 70 50 80 Q 30 90 20 70 Q 10 50 30 30 Z"
          fill="none" stroke="rgba(189,165,106,0.35)" strokeWidth="1.5"
          strokeDasharray="300" strokeDashoffset="0"
          style={{ animation: "ribbon-flow 4s linear infinite" }} />
      </svg>
      {/* Abstract pattern lines (not religious symbols) */}
      {[0, 120, 240].map((deg) => (
        <div key={deg} className="absolute h-0.5 w-20"
          style={{
            background: "linear-gradient(to right, transparent, rgba(189,165,106,0.3), transparent)",
            transform: `rotate(${deg}deg)`,
          }} />
      ))}
    </div>
  );
}

function ScienceLens() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Analytical lens circles */}
      {[52, 40, 28].map((size, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${size * 4}px`,
            height: `${size * 4}px`,
            border: `${0.8 + i * 0.2}px solid rgba(${i === 0 ? "95,166,184" : i === 1 ? "85,124,214" : "216,220,233"},${0.3 + i * 0.1})`,
            transform: `rotateZ(calc(var(--idle) * ${i % 2 === 0 ? 0.15 : -0.12} * 1deg))`,
          }} />
      ))}
      {/* Measurement arcs */}
      <svg viewBox="0 0 100 100" className="absolute h-40 w-40">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
          stroke="rgba(189,165,106,0.5)" strokeWidth="0.8" strokeDasharray="4 2" />
        <path d="M 20 50 A 30 30 0 0 0 80 50" fill="none"
          stroke="rgba(95,166,184,0.4)" strokeWidth="0.6" strokeDasharray="3 2" />
        {/* Evidence lines */}
        {[20, 40, 60, 80].map((x, i) => (
          <line key={i} x1={x} y1="48" x2={x} y2="52"
            stroke="rgba(189,165,106,0.6)" strokeWidth="0.8" />
        ))}
      </svg>
      {/* Observed object */}
      <div className="absolute h-10 w-10 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(95,166,184,0.5), rgba(85,124,214,0.4), rgba(24,35,90,0.8))",
          boxShadow: "0 0 12px rgba(95,166,184,0.4)",
        }} />
    </div>
  );
}

function TruthBridge() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Story orbit field (left — gold) */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          border: "1px solid rgba(189,165,106,0.45)",
          transform: `translateX(-40px) rotateX(65deg) rotateZ(calc(var(--idle) * 0.2))`,
          boxShadow: "0 0 15px rgba(189,165,106,0.1)",
        }} />
      <div className="absolute h-12 w-12 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(189,165,106,0.3), rgba(122,49,72,0.2))",
          transform: "translateX(-40px)",
          boxShadow: "0 0 12px rgba(189,165,106,0.25)",
        }} />
      {/* Science orbit field (right — cyan) */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          border: "1px solid rgba(95,166,184,0.45)",
          transform: `translateX(40px) rotateX(65deg) rotateZ(calc(var(--idle) * -0.2))`,
          boxShadow: "0 0 15px rgba(95,166,184,0.1)",
        }} />
      <div className="absolute h-12 w-12 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(95,166,184,0.3), rgba(85,124,214,0.2))",
          transform: "translateX(40px)",
          boxShadow: "0 0 12px rgba(95,166,184,0.25)",
        }} />
      {/* Bridge — moonlight silver (clearly NOT mythology→science proof) */}
      <svg viewBox="0 0 100 40" className="absolute h-16 w-36">
        <path d="M 12 20 Q 50 8 88 20" fill="none"
          stroke="rgba(216,220,233,0.5)" strokeWidth="1.2"
          style={{ animation: "bridge-shimmer 3s ease-in-out infinite" }} />
        <path d="M 12 20 Q 50 32 88 20" fill="none"
          stroke="rgba(216,220,233,0.25)" strokeWidth="0.6" />
        {/* Small nodes on bridge */}
        <circle cx="30" cy="15" r="1.5" fill="rgba(189,165,106,0.7)" />
        <circle cx="50" cy="11" r="2" fill="rgba(216,220,233,0.8)" />
        <circle cx="70" cy="15" r="1.5" fill="rgba(95,166,184,0.7)" />
      </svg>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function InteractiveSpaceModel({
  variant,
  size = "full",
  interactionMode = "tilt",
  intensity = "normal",
  className = "",
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
}: InteractiveSpaceModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Store all dynamic state in refs
  const state = useRef({
    idle: 0,
    targetRotX: 0,
    targetRotY: 0,
    currRotX: 0,
    currRotY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragRotX: 0,
    dragRotY: 0,
    hoverScale: 1,
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  /* Reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* Local RAF loop for DOM mutation */
  useEffect(() => {
    if (!containerRef.current || !innerRef.current || interactionMode === "none") return;
    
    let rafId: number;
    let lastTime = performance.now();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: "200px" });
    observer.observe(containerRef.current);

    const baseScale = size === "about_lg" ? 0.8 : size === "about_sm" ? 0.5 : 1;
    const intensityGlow = intensity === "vivid" ? 1.4 : intensity === "subtle" ? 0.6 : 1.0;
    innerRef.current.style.opacity = String(intensityGlow);

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = state.current;

      if (!reducedMotion) {
        s.idle += 0.4;
        
        // Dampen current rotations toward target with stronger damping for Jigyasa
        const dampingFactor = variant === "question_orb" ? 0.08 : 0.1;
        s.currRotX += (s.targetRotX - s.currRotX) * dampingFactor;
        s.currRotY += (s.targetRotY - s.currRotY) * dampingFactor;
      }

      // Models with stable front-facing orientation (no 360° rotation)
      const stableModels = [
        "question_orb",
        "knowledge_library",
        "planet_orbit",
        "eclipse_alignment",
        "moon_phase",
        "star_map",
        "mystery_orb",
        "celestial_cycle",
        "satellite_orbit",
      ];

      let totalX: number, totalY: number;
      if (stableModels.includes(variant)) {
        // Breathing motion: gentle sine wave oscillation (NO 360° rotation)
        const breathX = Math.sin(s.idle * 0.02) * 1.5;
        const breathY = Math.cos(s.idle * 0.015) * 1;
        totalX = breathX + s.currRotX + s.dragRotX;
        totalY = breathY + s.currRotY + s.dragRotY;
      } else {
        // Other models: keep original rotation behavior
        totalX = s.currRotX + s.dragRotX;
        totalY = s.idle * 0.3 + s.currRotY + s.dragRotY;
      }
      
      const scale = baseScale * s.hoverScale;

      if (innerRef.current && containerRef.current) {
        innerRef.current.style.transform = `rotateX(${totalX}deg) rotateY(${totalY}deg) scale(${scale})`;
        // Inject --idle to children
        containerRef.current.style.setProperty('--idle', String(s.idle));
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [reducedMotion, interactionMode, size, intensity, variant]);

  /* Mouse & Touch Handlers (passive & ref-based) */
  const updateRotation = useCallback((clientX: number, clientY: number) => {
    if (reducedMotion || interactionMode !== "tilt" || state.current.isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Stable models: severely limit pointer interaction (subtle parallax only)
    const stableModels = [
      "question_orb",
      "knowledge_library",
      "planet_orbit",
      "eclipse_alignment",
      "moon_phase",
      "star_map",
      "mystery_orb",
      "celestial_cycle",
      "satellite_orbit",
    ];
    
    if (stableModels.includes(variant)) {
      state.current.targetRotX = -ny * 2; // Limit vertical: -2 to +2 degrees
      state.current.targetRotY = nx * 4;  // Limit horizontal: -4 to +4 degrees
    } else {
      // Other models: keep original interaction strength
      state.current.targetRotX = -ny * 20;
      state.current.targetRotY = nx * 20;
    }
  }, [reducedMotion, interactionMode, variant]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (interactionMode === "rotate" && state.current.isDragging) {
      const dx = e.clientX - state.current.dragStart.x;
      const dy = e.clientY - state.current.dragStart.y;
      state.current.dragRotX = Math.max(-32, Math.min(32, state.current.dragRotX + dy * 0.4));
      state.current.dragRotY += dx * 0.5;
      state.current.dragStart = { x: e.clientX, y: e.clientY };
    } else {
      updateRotation(e.clientX, e.clientY);
    }
  }, [updateRotation, interactionMode]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (reducedMotion || interactionMode !== "rotate") return;
    state.current.isDragging = true;
    state.current.dragStart = { x: e.clientX, y: e.clientY };
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }, [reducedMotion, interactionMode]);

  const onPointerUp = useCallback(() => {
    state.current.isDragging = false;
    if (containerRef.current && interactionMode === "rotate") containerRef.current.style.cursor = "grab";
  }, [interactionMode]);

  const onPointerLeave = useCallback(() => {
    state.current.hoverScale = 1;
    state.current.isDragging = false;
    state.current.targetRotX = 0;
    state.current.targetRotY = 0;
    if (containerRef.current && interactionMode === "rotate") containerRef.current.style.cursor = "grab";
  }, [interactionMode]);

  const onPointerEnter = useCallback(() => {
    state.current.hoverScale = 1.04;
  }, []);

  const modelNode = useMemo(() => {
    switch (variant) {
      case "cosmic_gate":        return <CosmicGate  />;
      case "planet_orbit":       return <PlanetOrbit  />;
      case "eclipse_alignment":  return <EclipseAlignment  />;
      case "moon_phase":         return <MoonPhase  />;
      case "star_map":           return <StarMap  />;
      case "knowledge_library":  return <KnowledgeLibrary  />;
      case "question_orb":       return <QuestionOrb  />;
      case "evidence_grid":      return <EvidenceGrid  />;
      case "telescope_view":     return <TelescopeView  />;
      case "constellation_path": return <ConstellationPath  />;
      case "mystery_orb":        return <MysteryOrb  />;
      case "celestial_cycle":    return <CelestialCycle  />;
      case "satellite_orbit":    return <SatelliteOrbit  />;
      case "story_orbit":        return <StoryOrbit  />;
      case "science_lens":       return <ScienceLens  />;
      case "truth_bridge":       return <TruthBridge  />;
    }
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`relative touch-pan-y select-none ${SIZE_MAP[size]} ${className}`}
      style={{
        perspective: "1000px",
        cursor: interactionMode === "rotate" ? "grab" : "default",
      }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ariaHidden ? "presentation" : "img"}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {modelNode}
      </div>
    </div>
  );
}
