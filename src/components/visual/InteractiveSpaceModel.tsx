"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

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
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Planet sphere */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(95,166,184,0.8) 0%, rgba(85,124,214,0.6) 30%, rgba(24,35,90,0.9) 70%, rgba(7,9,18,1) 100%)",
          boxShadow: "-8px -8px 20px rgba(0,0,0,0.8), 0 0 40px rgba(85,124,214,0.3), inset -12px -12px 30px rgba(0,0,0,0.6)",
        }} />
      {/* Atmosphere rim */}
      <div className="absolute h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, transparent 80%, rgba(95,166,184,0.3) 85%, transparent 90%)",
          filter: "blur(3px)",
        }} />
      {/* Orbit ring 1 — with moon */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{
          border: "1.5px solid rgba(189,165,106,0.35)",
          transform: `rotateX(68deg) rotateZ(calc(var(--idle) * 0.4))`,
        }}>
        <div className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(216,220,233,0.9), rgba(170,170,180,0.7))",
            boxShadow: "0 0 8px rgba(216,220,233,0.5)",
          }} />
      </div>
      {/* Orbit ring 2 */}
      <div className="absolute h-60 w-60 rounded-full"
        style={{
          border: "1px dashed rgba(85,124,214,0.25)",
          transform: `rotateX(72deg) rotateZ(calc(var(--idle) * -0.25))`,
        }}>
        <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{ background: "rgba(95,166,184,0.8)", boxShadow: "0 0 6px rgba(95,166,184,0.6)" }} />
      </div>
      {/* Stardust */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute h-1 w-1 rounded-full"
          style={{
            background: "rgba(216,220,233,0.6)",
            transform: `rotate(${i * 60}deg) translateX(${36 + (i % 2) * 10}px)`,
          }} />
      ))}
    </div>
  );
}

function EclipseAlignment() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Scientific orbital line */}
      <div className="absolute h-1 w-52"
        style={{ background: "linear-gradient(to right, transparent, rgba(189,165,106,0.6), transparent)" }} />
      {/* Sun */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,160,48,1) 0%, rgba(220,120,20,0.8) 50%, rgba(180,70,10,0.4) 80%, transparent 100%)",
          boxShadow: "0 0 40px rgba(232,160,48,0.6), 0 0 80px rgba(232,160,48,0.2)",
          transform: "translateX(-56px)",
        }} />
      {/* Corona */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 60%, rgba(122,49,72,0.3) 70%, rgba(232,160,48,0.1) 85%, transparent 100%)",
          transform: "translateX(-56px)",
          filter: "blur(4px)",
        }} />
      {/* Earth (dark silhouette covering sun during eclipse) */}
      <div className="absolute h-16 w-16 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(24,35,90,0.9), rgba(7,9,18,0.98))",
          boxShadow: "0 0 12px rgba(216,220,233,0.3)",
          transform: "translateX(calc(sin(var(--idle) * 0.01) * 2px))",
        }} />
      {/* Moon (small, bright) */}
      <div className="absolute h-8 w-8 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(216,220,233,0.9), rgba(180,180,190,0.7))",
          boxShadow: "0 0 10px rgba(216,220,233,0.5)",
          transform: "translateX(44px)",
        }} />
      {/* Shadow cone */}
      <div className="absolute"
        style={{
          width: "60px",
          height: "4px",
          background: "linear-gradient(to right, rgba(7,9,18,0.8), transparent)",
          transform: "translateX(14px)",
          filter: "blur(2px)",
        }} />
    </div>
  );
}

function MoonPhase() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Orbit arc */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1px solid rgba(189,165,106,0.15)",
          transform: "rotateX(75deg)",
        }} />
      {/* Moon sphere */}
      <div className="absolute h-32 w-32 rounded-full overflow-hidden"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(241,240,232,0.95) 0%, rgba(200,204,214,0.85) 40%, rgba(150,155,170,0.7) 70%, rgba(100,105,120,0.6) 100%)",
          boxShadow: "0 0 20px rgba(216,220,233,0.2), inset -4px -4px 12px rgba(0,0,0,0.3)",
        }}>
        {/* Shadow overlay for phase */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at calc(50% + sin(var(--idle) * 0.02) * 20%) 50%, transparent 0%, rgba(3,4,10,0.95) 50%)`,
          }} />
      </div>
      {/* Cold dust */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute h-0.5 w-0.5 rounded-full"
          style={{
            background: "rgba(200,204,214,0.5)",
            transform: `rotate(${i * 45}deg) translateX(${32 + (i % 3) * 8}px)`,
          }} />
      ))}
    </div>
  );
}

function StarMap() {
  const stars = useMemo(() => [
    { x: 50, y: 20 }, { x: 70, y: 35 }, { x: 30, y: 40 },
    { x: 65, y: 60 }, { x: 40, y: 70 }, { x: 55, y: 50 },
    { x: 25, y: 55 }, { x: 75, y: 25 },
  ], []);
  const edges = [[0,1],[1,3],[3,4],[2,5],[5,1],[2,6],[7,1]];
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Celestial grid */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{ border: "0.5px solid rgba(85,124,214,0.12)", transform: "rotateX(78deg)" }} />
      <div className="absolute h-36 w-52"
        style={{ border: "0.5px solid rgba(85,124,214,0.08)", transform: "rotateX(78deg) rotateZ(60deg)" }} />
      {/* Constellation SVG */}
      <svg viewBox="0 0 100 90" className="absolute h-full w-full" style={{ transform: `rotateY(calc(var(--idle) * 0.1))` }}>
        {edges.map(([a, b], i) => (
          <line key={i}
            x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y}
            stroke="rgba(189,165,106,0.4)" strokeWidth="0.5"
            strokeDasharray="100" strokeDashoffset="0"
          />
        ))}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={i === 5 ? 2 : 1.2}
            fill="rgba(241,240,232,0.9)"
            style={{ filter: i === 5 ? "drop-shadow(0 0 3px rgba(189,165,106,0.8))" : "drop-shadow(0 0 2px rgba(216,220,233,0.5))" }} />
        ))}
      </svg>
    </div>
  );
}

function KnowledgeLibrary() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Archive glow */}
      <div className="absolute h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(189,165,106,0.12) 0%, transparent 70%)", filter: "blur(8px)" }} />
      {/* Orbiting knowledge rings */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{ border: "1px solid rgba(189,165,106,0.35)", transform: `rotateX(68deg) rotateZ(calc(var(--idle) * 0.3))` }} />
      <div className="absolute h-32 w-32 rounded-full"
        style={{ border: "1px solid rgba(85,124,214,0.4)", transform: `rotateX(55deg) rotateZ(calc(var(--idle) * -0.4))` }} />
      {/* Archive slabs — stacked floating rectangles */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute rounded"
          style={{
            width: `${48 - i * 8}px`,
            height: `${6 - i}px`,
            background: i === 0
              ? "linear-gradient(90deg, rgba(189,165,106,0.7), rgba(241,240,232,0.5))"
              : i === 1
              ? "linear-gradient(90deg, rgba(85,124,214,0.5), rgba(95,166,184,0.4))"
              : "linear-gradient(90deg, rgba(41,29,85,0.6), rgba(119,89,217,0.4))",
            transform: `translateY(${(i - 1) * 14}px) translateZ(${(2 - i) * 10}px)`,
            boxShadow: i === 0 ? "0 0 10px rgba(189,165,106,0.3)" : "none",
          }} />
      ))}
      {/* Glyph lines */}
      <svg viewBox="0 0 60 60" className="absolute h-16 w-16 opacity-30">
        <line x1="10" y1="20" x2="50" y2="20" stroke="rgba(189,165,106,0.8)" strokeWidth="1" />
        <line x1="10" y1="30" x2="40" y2="30" stroke="rgba(189,165,106,0.6)" strokeWidth="1" />
        <line x1="10" y1="40" x2="45" y2="40" stroke="rgba(189,165,106,0.7)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function QuestionOrb() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Outer energy field */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1px solid rgba(119,89,217,0.3)",
          boxShadow: "0 0 30px rgba(119,89,217,0.1)",
          transform: `rotateX(45deg) rotateZ(calc(var(--idle) * 0.2))`,
        }} />
      {/* Pulsar orb */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(119,89,217,0.4) 0%, rgba(41,29,85,0.8) 50%, rgba(7,9,18,0.95) 100%)",
          boxShadow: "0 0 40px rgba(119,89,217,0.4), 0 0 80px rgba(119,89,217,0.1)",
        }} />
      {/* Energy filaments as SVG */}
      <svg viewBox="0 0 100 100" className="absolute h-36 w-36"
        style={{ transform: `rotateZ(calc(var(--idle) * 0.3))` }}>
        {[0,60,120,180,240,300].map((deg, i) => (
          <line key={i}
            x1="50" y1="50"
            x2={50 + Math.cos(deg * Math.PI / 180) * 42}
            y2={50 + Math.sin(deg * Math.PI / 180) * 42}
            stroke="rgba(119,89,217,0.5)" strokeWidth="0.8"
            style={{ animation: `filament-pulse ${2 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }}
          />
        ))}
        {/* Constellation nodes */}
        {[30, 110, 190, 270].map((deg, i) => (
          <circle key={i}
            cx={50 + Math.cos(deg * Math.PI / 180) * 38}
            cy={50 + Math.sin(deg * Math.PI / 180) * 38}
            r="2" fill="rgba(95,166,184,0.8)" />
        ))}
      </svg>
      {/* Silver core */}
      <div className="absolute h-6 w-6 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(216,220,233,0.95), rgba(180,185,200,0.7))",
          boxShadow: "0 0 15px rgba(216,220,233,0.6)",
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
      {/* Accretion glow */}
      <div className="absolute h-48 w-48 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 30%, rgba(122,49,72,0.2) 50%, rgba(119,89,217,0.1) 65%, transparent 75%)",
          filter: "blur(8px)",
          animation: "lens-warp 8s ease-in-out infinite",
        }} />
      {/* Lensing rings */}
      {[52, 40, 28].map((size, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${size * 4}px`,
            height: `${size * 4}px`,
            border: `${0.5 + i * 0.3}px solid rgba(${i === 0 ? "122,49,72" : i === 1 ? "119,89,217" : "85,124,214"},${0.2 + i * 0.1})`,
            transform: `rotateX(${65 + i * 5}deg) rotateZ(calc(var(--idle) * ${i % 2 === 0 ? 0.2 : -0.3} * 1deg))`,
          }} />
      ))}
      {/* Black hole shadow */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(3,4,10,1) 0%, rgba(7,9,18,0.98) 60%, rgba(122,49,72,0.2) 100%)",
          boxShadow: "0 0 30px rgba(122,49,72,0.3), 0 0 60px rgba(119,89,217,0.15)",
        }} />
      {/* Silver rim */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{ boxShadow: "0 0 0 1px rgba(216,220,233,0.12), 0 0 10px rgba(216,220,233,0.06)" }} />
      {/* Nebula turbulence dust */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            background: "rgba(119,89,217,0.5)",
            transform: `rotate(calc(${i * 72}deg + var(--idle) * 0.5 * 1deg)) translateX(${34 + i * 3}px)`,
          }} />
      ))}
    </div>
  );
}

function CelestialCycle() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Outer clock ring */}
      <div className="absolute h-52 w-52 rounded-full"
        style={{
          border: "1.5px solid rgba(189,165,106,0.40)",
          transform: `rotateX(70deg) rotateZ(calc(var(--idle) * 0.15 * 1deg))`,
          boxShadow: "0 0 15px rgba(189,165,106,0.1)",
        }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute"
            style={{
              width: i % 3 === 0 ? "3px" : "1.5px",
              height: i % 3 === 0 ? "10px" : "6px",
              background: `rgba(189,165,106,${i % 3 === 0 ? 0.8 : 0.4})`,
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 30}deg) translateY(-${52 * 2 - 6}px) translateX(-50%)`,
              transformOrigin: "0 0",
            }} />
        ))}
      </div>
      {/* Mid ring */}
      <div className="absolute h-36 w-36 rounded-full"
        style={{
          border: "1px solid rgba(85,124,214,0.35)",
          transform: `rotateX(55deg) rotateZ(calc(var(--idle) * -0.25 * 1deg))`,
        }} />
      {/* Inner ring */}
      <div className="absolute h-20 w-20 rounded-full"
        style={{
          border: "1px solid rgba(119,89,217,0.3)",
          transform: `rotateX(80deg) rotateZ(calc(var(--idle) * 0.4 * 1deg))`,
        }} />
      {/* Time marker */}
      <div className="absolute h-1.5 w-8 rounded-full"
        style={{
          background: "linear-gradient(to right, rgba(216,220,233,0.8), rgba(189,165,106,0.6))",
          transform: `rotate(calc(var(--idle) * 0.5 * 1deg))`,
          transformOrigin: "0% 50%",
        }} />
      {/* Center point */}
      <div className="absolute h-3 w-3 rounded-full"
        style={{
          background: "rgba(189,165,106,0.9)",
          boxShadow: "0 0 8px rgba(189,165,106,0.6)",
        }} />
    </div>
  );
}

function SatelliteOrbit() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
      {/* Earth horizon */}
      <div className="absolute h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 38%, rgba(95,166,184,0.8), rgba(24,35,90,0.9) 50%, rgba(7,9,18,0.95) 80%)",
          boxShadow: "0 0 30px rgba(95,166,184,0.2), inset 0 0 20px rgba(0,0,0,0.5)",
        }} />
      {/* Atmosphere */}
      <div className="absolute h-28 w-28 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 80%, rgba(95,166,184,0.2) 88%, transparent 95%)",
          filter: "blur(2px)",
        }} />
      {/* Orbital trajectory */}
      <div className="absolute h-44 w-44 rounded-full"
        style={{
          border: "1px dashed rgba(85,124,214,0.35)",
          transform: "rotateX(60deg)",
        }} />
      {/* Satellite body wrapper */}
      <div className="absolute"
        style={{
          transform: "translate(calc(cos(var(--idle) * 0.5deg) * 63px), calc(sin(var(--idle) * 0.5deg) * 14px)) rotateX(60deg)",
        }}>
        <div style={{
            width: "10px",
            height: "6px",
            background: "rgba(200,204,214,0.9)",
            borderRadius: "1px",
            position: "absolute",
            top: "-3px", left: "-5px",
          }} />
        <div className="absolute flex items-center gap-0.5" style={{ top: "-1.5px", left: "-8px" }}>
          <div style={{ width: "6px", height: "3px", background: "rgba(85,124,214,0.7)", borderRadius: "0.5px" }} />
          <div style={{ width: "4px", height: "6px", background: "rgba(200,204,214,0.8)" }} />
          <div style={{ width: "6px", height: "3px", background: "rgba(85,124,214,0.7)", borderRadius: "0.5px" }} />
        </div>
      </div>
      {/* Communication pulse SVG */}
      <svg viewBox="0 0 200 200" className="absolute h-44 w-44 opacity-60"
        style={{ transform: "rotateX(60deg)" }}>
        <g style={{ transform: "translate(calc(cos(var(--idle) * 0.5deg) * 70px), calc(sin(var(--idle) * 0.5deg) * 28px))" }}>
          <circle cx="100" cy="100" r="4" fill="none" stroke="rgba(95,166,184,0.8)" strokeWidth="1"
            style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
          <circle cx="100" cy="100" r="1.5" fill="rgba(216,220,233,1)" />
        </g>
      </svg>
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

  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* Reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
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

      const _dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = state.current;

      if (!reducedMotion) {
        s.idle += 0.4;
        
        // Dampen current rotations toward target
        s.currRotX += (s.targetRotX - s.currRotX) * 0.1;
        s.currRotY += (s.targetRotY - s.currRotY) * 0.1;
      }

      const totalX = s.currRotX + s.dragRotX;
      const totalY = s.idle * 0.3 + s.currRotY + s.dragRotY;
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
  }, [reducedMotion, interactionMode, size, intensity]);

  /* Mouse & Touch Handlers (passive & ref-based) */
  const updateRotation = useCallback((clientX: number, clientY: number) => {
    if (reducedMotion || interactionMode !== "tilt" || state.current.isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    state.current.targetRotX = -ny * 20;
    state.current.targetRotY = nx * 20;
  }, [reducedMotion, interactionMode]);

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
