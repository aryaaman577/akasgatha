"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import type { AboutModelVariant } from "./types";
import { createMaterials, setupLighting } from "./materials";

import { createKnowledgeLibrary } from "./builders/createKnowledgeLibrary";
import { createTelescopeView } from "./builders/createTelescopeView";
import { createTruthBridge } from "./builders/createTruthBridge";
import { createCosmicGate } from "./builders/createCosmicGate";
import { createQuestionOrb } from "./builders/createQuestionOrb";
import { createStoryOrbit } from "./builders/createStoryOrbit";
import { createEvidenceGrid } from "./builders/createEvidenceGrid";
import { createConstellationPath } from "./builders/createConstellationPath";
import { createSatelliteOrbit } from "./builders/createSatelliteOrbit";

/* eslint-disable @typescript-eslint/no-explicit-any */
type BuilderFn = (scene: THREE.Scene, materials: Record<string, any>) => {
  group: THREE.Group;
  update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => void;
  dispose: () => void;
};

const BUILDERS: Record<AboutModelVariant, BuilderFn> = {
  knowledge_library: createKnowledgeLibrary,
  telescope_view: createTelescopeView,
  truth_bridge: createTruthBridge,
  cosmic_gate: createCosmicGate,
  question_orb: createQuestionOrb,
  story_orbit: createStoryOrbit,
  evidence_grid: createEvidenceGrid,
  constellation_path: createConstellationPath,
  satellite_orbit: createSatelliteOrbit,
};

interface Props {
  variant: AboutModelVariant;
  size?: "about_lg" | "about_sm" | "full";
  interactionMode?: "tilt" | "rotate" | "none";
  "aria-hidden"?: boolean;
  className?: string;
}

/* ── Reusable math helpers (no allocations in hot path) ──── */
const MAX_TILT = 0.12; // ±7° max model rotation from pointer
const LERP_SPEED = 4.0; // exponential smoothing speed
const RETURN_SPEED = 2.0; // speed of return to idle on pointer leave

export function AboutInteractiveSpaceModel({
  variant,
  size = "about_lg",
  interactionMode = "tilt",
  "aria-hidden": ariaHidden = true,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pointer state — never triggers React re-renders
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
    isOver: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- Reduced motion check ---
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Renderer ---
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.2 : 1.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch {
      // WebGL context limit exceeded — bail out silently
      return;
    }

    // Verify context was obtained
    if (!renderer.getContext()) return;

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();

    // Subtle atmospheric depth fog (skip on mobile for perf)
    if (!isMobile) {
      scene.fog = new THREE.FogExp2(0x030410, 0.06);
    }

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 8;

    // --- Lighting ---
    const { materials, dispose: disposeMats } = createMaterials();
    const disposeLights = setupLighting(scene);

    // --- Build Model ---
    const builderFn = BUILDERS[variant];
    const builderInstance = builderFn(scene, materials);

    const scaleBase = size === "about_sm" ? 0.55 : 0.75;
    builderInstance.group.scale.setScalar(scaleBase);

    // --- Fit camera to model bounds ---
    const fitCamera = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    // Initial fit
    const initRect = container.getBoundingClientRect();
    fitCamera(initRect.width, initRect.height);

    // --- ResizeObserver ---
    const resizeObs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      fitCamera(width, height);
    });
    resizeObs.observe(container);

    // --- IntersectionObserver for pause/resume ---
    let isNearViewport = false;
    const intObs = new IntersectionObserver(
      ([entry]) => { isNearViewport = entry.isIntersecting; },
      { rootMargin: "500px" }
    );
    intObs.observe(container);

    // --- Animation Loop ---
    let rafId: number;
    let lastTime = performance.now();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isNearViewport) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1); // cap delta
      lastTime = now;
      const elapsed = now / 1000;

      // --- Smooth pointer tracking (delta-time based exponential lerp) ---
      if (interactionMode === "tilt" && !reducedMotion) {
        const ptr = pointerRef.current;

        // Determine effective target: smooth back to 0 when pointer leaves
        const effTargetX = ptr.isOver ? ptr.targetX : 0;
        const effTargetY = ptr.isOver ? ptr.targetY : 0;
        const speed = ptr.isOver ? LERP_SPEED : RETURN_SPEED;

        // Exponential smoothing: independent of frame rate
        const factor = 1 - Math.exp(-speed * dt);
        ptr.smoothX += (effTargetX - ptr.smoothX) * factor;
        ptr.smoothY += (effTargetY - ptr.smoothY) * factor;

        // Clamp tilt range
        const tiltX = Math.max(-MAX_TILT, Math.min(MAX_TILT, ptr.smoothY * MAX_TILT));
        const tiltY = Math.max(-MAX_TILT, Math.min(MAX_TILT, ptr.smoothX * MAX_TILT));

        builderInstance.group.rotation.x = tiltX;
        builderInstance.group.rotation.y = tiltY;
      }

      // Idle rotation always (additive on top of tilt)
      builderInstance.group.rotation.y += 0.003;

      // Pass smoothed mouse to builder for parallax effects
      const mouseData = reducedMotion ? undefined : {
        x: pointerRef.current.smoothX,
        y: pointerRef.current.smoothY,
      };

      builderInstance.update(dt, elapsed, mouseData);
      renderer.render(scene, camera);
    };

    // Render first frame immediately
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(rafId);
      resizeObs.disconnect();
      intObs.disconnect();
      builderInstance.dispose();
      disposeLights();
      disposeMats();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [variant, size, interactionMode]);

  // --- Pointer handlers (shared between mouse and touch) ---
  const updatePointer = useCallback((clientX: number, clientY: number) => {
    if (interactionMode !== "tilt" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.targetX = (clientX - rect.left) / rect.width * 2 - 1;
    pointerRef.current.targetY = -((clientY - rect.top) / rect.height * 2 - 1);
    pointerRef.current.isOver = true;
  }, [interactionMode]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    updatePointer(e.clientX, e.clientY);
  }, [updatePointer]);

  const handlePointerLeave = useCallback(() => {
    // Don't snap — just mark as "not over" so smooth return engages
    pointerRef.current.isOver = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updatePointer]);

  const handleTouchEnd = useCallback(() => {
    pointerRef.current.isOver = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      style={{ overflow: "hidden" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-hidden={ariaHidden}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
          background: "transparent",
        }}
      />
    </div>
  );
}
