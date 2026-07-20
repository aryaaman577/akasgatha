"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { RenderManager } from "@/core/RenderManager";

/* ═══════════════════════════════════════════════════════════
   COSMIC KNOWLEDGE ORRERY
   A single premium 3D centerpiece for the About page.
   Split celestial sphere — obsidian/glass — with astrolabe
   rings, orbital markers, micro-stars, and shooting stars.
   ═══════════════════════════════════════════════════════════ */

/* ── Palette ────────────────────────────────────────────── */
const C = {
  celestialBlue: 0x8198b8,
  platinum: 0xc8cdd6,
  charcoal: 0x1a1d24,
  starWhite: 0xe8ecf2,
  deepBlack: 0x08090c,
  coreGlow: 0x6880a8,
  rimBlue: 0x5a7099,
  warm: 0x9aa0ad,
} as const;

/* ── Constants ──────────────────────────────────────────── */
const MAX_TILT_RAD = (5 * Math.PI) / 180; // 5 degrees
const POINTER_SPEED = 3.5;
const RETURN_SPEED = 1.8;
const IDLE_ROTATION_SPEED = 0.06; // rad/s

/* ── Shared re-usable vectors (zero-alloc in loop) ─────── */
const _v3 = new THREE.Vector3();

/* ═══════════════════════════════════════════════════════════
   MATERIALS  (created once, shared)
   ═══════════════════════════════════════════════════════════ */
function createOrreryMaterials() {
  const mats = {
    /* Matte obsidian hemisphere */
    obsidian: new THREE.MeshStandardMaterial({
      color: C.charcoal,
      metalness: 0.15,
      roughness: 0.82,
    }),
    /* Constellation engravings on obsidian */
    constellationLine: new THREE.LineBasicMaterial({
      color: C.platinum,
      transparent: true,
      opacity: 0.12,
    }),
    /* Smoked glass hemisphere */
    smokedGlass: new THREE.MeshPhysicalMaterial({
      color: 0x2a3040,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.45,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
    /* Inner stellar core */
    stellarCore: new THREE.MeshStandardMaterial({
      color: C.coreGlow,
      emissive: C.coreGlow,
      emissiveIntensity: 0.35,
      metalness: 0.3,
      roughness: 0.4,
    }),
    /* Platinum astrolabe rings */
    platinumRing: new THREE.MeshStandardMaterial({
      color: C.platinum,
      metalness: 0.88,
      roughness: 0.14,
      envMapIntensity: 1.2,
    }),
    /* Orbital markers */
    marker: new THREE.MeshStandardMaterial({
      color: C.celestialBlue,
      metalness: 0.7,
      roughness: 0.25,
    }),
    /* Inner scientific arcs */
    arcMaterial: new THREE.MeshBasicMaterial({
      color: C.celestialBlue,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
    /* Dust particles */
    dustMaterial: new THREE.PointsMaterial({
      color: C.starWhite,
      size: 1.2,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
    /* Background micro-stars */
    starMaterial: new THREE.PointsMaterial({
      color: C.starWhite,
      size: 1.6,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
    /* Shooting star trail */
    shootingStarMat: new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    /* Core inner glow sphere */
    innerGlow: new THREE.MeshBasicMaterial({
      color: C.coreGlow,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    /* Seam ring where hemispheres meet */
    seamRing: new THREE.MeshStandardMaterial({
      color: C.platinum,
      metalness: 0.92,
      roughness: 0.1,
    }),
  };

  const dispose = () => {
    Object.values(mats).forEach((m) => {
      if (m && "dispose" in m) m.dispose();
    });
  };

  return { mats, dispose };
}

/* ═══════════════════════════════════════════════════════════
   LIGHTING
   ═══════════════════════════════════════════════════════════ */
function setupOrreryLighting(scene: THREE.Scene) {
  // Subtle ambient
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);

  // Key light — cool white from upper-right
  const key = new THREE.DirectionalLight(0xe8ecf2, 1.0);
  key.position.set(4, 5, 5);

  // Rim light — muted celestial blue from behind-left
  const rim = new THREE.DirectionalLight(C.rimBlue, 0.7);
  rim.position.set(-5, 1, -4);

  // Soft fill — faint from below
  const fill = new THREE.DirectionalLight(C.warm, 0.25);
  fill.position.set(0, -3, 2);

  // Breathing accent (will be animated)
  const accent = new THREE.PointLight(C.celestialBlue, 0.3, 15);
  accent.position.set(0, 0, 0);

  scene.add(ambient, key, rim, fill, accent);

  return {
    accent,
    dispose: () => {
      scene.remove(ambient, key, rim, fill, accent);
      [ambient, key, rim, fill, accent].forEach((l) => l.dispose());
    },
  };
}

/* ═══════════════════════════════════════════════════════════
   BUILD THE ORRERY
   ═══════════════════════════════════════════════════════════ */
function buildOrrery(
  scene: THREE.Scene,
  mats: ReturnType<typeof createOrreryMaterials>["mats"]
) {
  const root = new THREE.Group();
  scene.add(root);

  // Groups with different damping layers
  const coreGroup = new THREE.Group();     // sphere + core: heaviest damping
  const ringGroup = new THREE.Group();     // astrolabe rings: medium damping
  const dustGroup = new THREE.Group();     // particles: light damping
  const bgStarGroup = new THREE.Group();   // background stars: lightest
  root.add(coreGroup, ringGroup, dustGroup, bgStarGroup);

  const geometries: THREE.BufferGeometry[] = [];

  /* ── 1. Split Celestial Sphere ────────────────────────── */
  const SPHERE_R = 2.6;

  // Obsidian hemisphere (top half, y >= 0)
  const obsidianGeom = new THREE.SphereGeometry(
    SPHERE_R, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2
  );
  geometries.push(obsidianGeom);
  const obsidianHemi = new THREE.Mesh(obsidianGeom, mats.obsidian);
  coreGroup.add(obsidianHemi);

  // Smoked glass hemisphere (bottom half, y < 0)
  const glassGeom = new THREE.SphereGeometry(
    SPHERE_R, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2
  );
  geometries.push(glassGeom);
  const glassHemi = new THREE.Mesh(glassGeom, mats.smokedGlass);
  coreGroup.add(glassHemi);

  // Seam ring at the equator
  const seamGeom = new THREE.TorusGeometry(SPHERE_R + 0.02, 0.04, 16, 128);
  geometries.push(seamGeom);
  const seam = new THREE.Mesh(seamGeom, mats.seamRing);
  seam.rotation.x = Math.PI / 2;
  coreGroup.add(seam);

  /* ── 2. Constellation Lines on Obsidian ───────────────── */
  // Create several thin line paths on the upper hemisphere
  const constellationPaths = [
    // Path 1: zigzag across top
    [
      [0.3, 0.9, 0.2], [-0.1, 0.85, 0.5], [0.4, 0.7, 0.55],
      [0.1, 0.6, 0.8], [-0.3, 0.75, 0.6],
    ],
    // Path 2: arc near equator
    [
      [-0.8, 0.3, 0.5], [-0.6, 0.5, 0.6], [-0.2, 0.55, 0.8],
      [0.2, 0.4, 0.9], [0.5, 0.3, 0.8],
    ],
    // Path 3: top cluster
    [
      [0.0, 0.95, 0.0], [0.3, 0.92, 0.15], [0.15, 0.88, 0.4],
      [-0.2, 0.9, 0.3],
    ],
    // Path 4: side arc
    [
      [0.7, 0.5, -0.5], [0.8, 0.4, -0.2], [0.75, 0.6, 0.1],
      [0.6, 0.7, -0.1],
    ],
  ];

  const constellationLines: THREE.Line[] = [];
  constellationPaths.forEach((path) => {
    const points = path.map((p) => {
      _v3.set(p[0], p[1], p[2]).normalize().multiplyScalar(SPHERE_R + 0.03);
      return _v3.clone();
    });
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(lineGeom);
    const line = new THREE.Line(lineGeom, mats.constellationLine);
    coreGroup.add(line);
    constellationLines.push(line);
  });

  // Constellation dots at intersections
  const dotGeom = new THREE.SphereGeometry(0.03, 8, 8);
  geometries.push(dotGeom);
  const dotPositions = [
    [0.3, 0.9, 0.2], [-0.1, 0.85, 0.5], [0.1, 0.6, 0.8],
    [-0.8, 0.3, 0.5], [0.2, 0.4, 0.9], [0.0, 0.95, 0.0],
    [0.7, 0.5, -0.5], [0.75, 0.6, 0.1],
  ];
  dotPositions.forEach((p) => {
    const dot = new THREE.Mesh(dotGeom, mats.marker);
    _v3.set(p[0], p[1], p[2]).normalize().multiplyScalar(SPHERE_R + 0.04);
    dot.position.copy(_v3);
    coreGroup.add(dot);
  });

  /* ── 3. Inner Stellar Core (visible through glass) ──── */
  const innerCoreGeom = new THREE.IcosahedronGeometry(1.3, 2);
  geometries.push(innerCoreGeom);
  const innerCore = new THREE.Mesh(innerCoreGeom, mats.stellarCore);
  coreGroup.add(innerCore);

  // Glow sphere
  const glowGeom = new THREE.SphereGeometry(1.5, 24, 24);
  geometries.push(glowGeom);
  const glowSphere = new THREE.Mesh(glowGeom, mats.innerGlow);
  coreGroup.add(glowSphere);

  // Scientific arcs inside glass hemisphere
  const arcRadii = [1.8, 2.1, 2.35];
  const arcs: THREE.Mesh[] = [];
  arcRadii.forEach((r, i) => {
    const arcGeom = new THREE.TorusGeometry(r, 0.015, 8, 80, Math.PI * 1.2);
    geometries.push(arcGeom);
    const arc = new THREE.Mesh(arcGeom, mats.arcMaterial);
    arc.rotation.x = Math.PI / 2 + (i - 1) * 0.3;
    arc.rotation.z = i * 0.7;
    arc.position.y = -0.3;
    coreGroup.add(arc);
    arcs.push(arc);
  });

  // Suspended micro-stars inside glass hemisphere
  const innerStarCount = 16;
  const innerStarPositions = new Float32Array(innerStarCount * 3);
  for (let i = 0; i < innerStarCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.PI / 2 + Math.random() * Math.PI / 2; // lower hemisphere
    const r = 0.8 + Math.random() * 1.5;
    innerStarPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    innerStarPositions[i * 3 + 1] = -Math.abs(r * Math.cos(phi)) * 0.6; // keep below equator
    innerStarPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const innerStarGeom = new THREE.BufferGeometry();
  innerStarGeom.setAttribute("position", new THREE.BufferAttribute(innerStarPositions, 3));
  geometries.push(innerStarGeom);
  const innerStarsMat = new THREE.PointsMaterial({
    color: C.starWhite,
    size: 1.0,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const innerStars = new THREE.Points(innerStarGeom, innerStarsMat);
  coreGroup.add(innerStars);

  /* ── 4. Platinum Astrolabe Rings ──────────────────────── */
  // Primary ring
  const ring1Geom = new THREE.TorusGeometry(3.5, 0.035, 16, 160);
  geometries.push(ring1Geom);
  const ring1 = new THREE.Mesh(ring1Geom, mats.platinumRing);
  ring1.rotation.x = Math.PI / 2 + 0.15;
  ringGroup.add(ring1);

  // Secondary ring (tilted)
  const ring2Geom = new THREE.TorusGeometry(3.9, 0.025, 16, 140);
  geometries.push(ring2Geom);
  const ring2 = new THREE.Mesh(ring2Geom, mats.platinumRing);
  ring2.rotation.x = Math.PI / 2 - 0.3;
  ring2.rotation.y = 0.5;
  ringGroup.add(ring2);

  // Tertiary ring (subtle, wider)
  const ring3Geom = new THREE.TorusGeometry(4.3, 0.018, 12, 120);
  geometries.push(ring3Geom);
  const ring3 = new THREE.Mesh(ring3Geom, mats.platinumRing);
  ring3.rotation.x = Math.PI / 2 + 0.4;
  ring3.rotation.z = -0.35;
  ringGroup.add(ring3);

  /* ── 5. Orbital Markers on Rings ──────────────────────── */
  const markerGeom = new THREE.SphereGeometry(0.07, 12, 12);
  geometries.push(markerGeom);

  interface OrbitalMarker {
    mesh: THREE.Mesh;
    ringRadius: number;
    speed: number;
    angle: number;
    tiltX: number;
    tiltY: number;
  }
  const markers: OrbitalMarker[] = [];

  const markerDefs = [
    { r: 3.5, speed: 0.15, startAngle: 0, tx: 0.15, ty: 0 },
    { r: 3.5, speed: 0.15, startAngle: Math.PI, tx: 0.15, ty: 0 },
    { r: 3.9, speed: -0.1, startAngle: Math.PI / 3, tx: -0.3, ty: 0.5 },
    { r: 3.9, speed: -0.1, startAngle: Math.PI * 1.3, tx: -0.3, ty: 0.5 },
    { r: 4.3, speed: 0.08, startAngle: Math.PI / 2, tx: 0.4, tz: -0.35 },
  ];

  markerDefs.forEach((d) => {
    const m = new THREE.Mesh(markerGeom, mats.marker);
    ringGroup.add(m);
    markers.push({
      mesh: m,
      ringRadius: d.r,
      speed: d.speed,
      angle: d.startAngle,
      tiltX: Math.PI / 2 + d.tx,
      tiltY: d.ty ?? 0,
    });
  });

  /* ── 6. Atmospheric Dust ──────────────────────────────── */
  const dustCount = 50;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustPhases = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.0 + Math.random() * 3.0;
    dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dustPositions[i * 3 + 2] = r * Math.cos(phi);
    dustPhases[i] = Math.random() * Math.PI * 2;
  }
  const dustGeom = new THREE.BufferGeometry();
  dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  geometries.push(dustGeom);
  const dust = new THREE.Points(dustGeom, mats.dustMaterial);
  dust.frustumCulled = false;
  dustGroup.add(dust);

  /* ── 7. Background Stars ──────────────────────────────── */
  const bgStarCount = 80;
  const bgStarPositions = new Float32Array(bgStarCount * 3);
  const bgStarPhases = new Float32Array(bgStarCount);
  for (let i = 0; i < bgStarCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 7 + Math.random() * 6;
    bgStarPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    bgStarPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    bgStarPositions[i * 3 + 2] = r * Math.cos(phi);
    bgStarPhases[i] = Math.random() * Math.PI * 2;
  }
  const bgStarGeom = new THREE.BufferGeometry();
  bgStarGeom.setAttribute("position", new THREE.BufferAttribute(bgStarPositions, 3));
  geometries.push(bgStarGeom);
  const bgStars = new THREE.Points(bgStarGeom, mats.starMaterial);
  bgStars.frustumCulled = false;
  bgStarGroup.add(bgStars);

  /* ── 8. Shooting Star Pool ────────────────────────────── */
  const TRAIL_PTS = 14;
  interface PooledShootingStar {
    line: THREE.Line;
    geom: THREE.BufferGeometry;
    active: boolean;
    life: number;
    maxLife: number;
    speed: number;
    dirX: number;
    dirY: number;
    startX: number;
    startY: number;
    startZ: number;
    length: number;
  }

  const shootingPool: PooledShootingStar[] = [];
  for (let i = 0; i < 2; i++) {
    const positions = new Float32Array(TRAIL_PTS * 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometries.push(geom);
    const line = new THREE.Line(geom, mats.shootingStarMat.clone());
    line.visible = false;
    line.frustumCulled = false;
    bgStarGroup.add(line);
    shootingPool.push({
      line,
      geom,
      active: false,
      life: 0,
      maxLife: 0,
      speed: 0,
      dirX: 0,
      dirY: 0,
      startX: 0,
      startY: 0,
      startZ: 0,
      length: 0,
    });
  }

  let shootTimer = 3 + Math.random() * 5; // first spawn sooner

  const spawnShootingStar = () => {
    const star = shootingPool.find((s) => !s.active);
    if (!star) return;
    const angle = (0.5 + Math.random() * 1.0) * Math.PI;
    star.dirX = Math.cos(angle);
    star.dirY = Math.sin(angle);
    star.startX = (Math.random() - 0.5) * 10;
    star.startY = 3 + Math.random() * 5;
    star.startZ = -5 - Math.random() * 4;
    star.speed = 5 + Math.random() * 4;
    star.length = 2 + Math.random() * 2.5;
    star.maxLife = 0.35 + Math.random() * 0.35;
    star.life = 0;
    star.active = true;
    star.line.visible = true;
    shootTimer = 5 + Math.random() * 7;
  };

  /* ── Euler for marker tilt (pre-allocated) ──────────── */
  const _markerEuler = new THREE.Euler();
  const _markerPos = new THREE.Vector3();

  /* ── UPDATE ───────────────────────────────────────────── */
  const update = (
    dt: number,
    elapsed: number,
    smoothMouse: { x: number; y: number }
  ) => {
    // Idle rotation
    coreGroup.rotation.y += IDLE_ROTATION_SPEED * dt;

    // Layered pointer tilt (different damping per group is handled in the caller)
    // Here we just apply the passed-in smoothed mouse to each layer

    // Inner core animation
    innerCore.rotation.y += dt * 0.12;
    innerCore.rotation.x += dt * 0.05;

    // Breathing glow
    const breathe = 1 + Math.sin(elapsed * 1.5) * 0.06;
    glowSphere.scale.setScalar(breathe);
    (mats.innerGlow as THREE.MeshBasicMaterial).opacity =
      0.1 + Math.sin(elapsed * 1.2) * 0.04;

    // Breathing accent light
    // (accent reference passed via closure isn't available here — handled in caller)

    // Scientific arcs gentle movement
    arcs.forEach((arc, i) => {
      arc.rotation.z += dt * 0.03 * (i % 2 === 0 ? 1 : -1);
    });

    // Ring group slow counter-rotation
    ringGroup.rotation.y -= dt * 0.02;

    // Orbital markers
    markers.forEach((m) => {
      m.angle += dt * m.speed;
      _markerPos.set(
        Math.cos(m.angle) * m.ringRadius,
        Math.sin(m.angle) * m.ringRadius,
        0
      );
      _markerEuler.set(m.tiltX, m.tiltY, 0);
      _markerPos.applyEuler(_markerEuler);
      m.mesh.position.copy(_markerPos);
    });

    // Dust: slow drift + twinkle
    const dustPosAttr = dustGeom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < dustCount; i++) {
      dustPosAttr.array[i * 3 + 1] += Math.sin(elapsed * 0.4 + dustPhases[i]) * 0.0004;
    }
    dustPosAttr.needsUpdate = true;
    mats.dustMaterial.opacity = 0.25 + Math.sin(elapsed * 0.8) * 0.08;

    // Bg stars twinkle
    mats.starMaterial.opacity = 0.35 + Math.sin(elapsed * 0.6) * 0.1;
    bgStarGroup.rotation.y += dt * 0.005;

    // Inner suspended stars gentle movement
    const iStarPosAttr = innerStarGeom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < innerStarCount; i++) {
      iStarPosAttr.array[i * 3 + 1] += Math.sin(elapsed * 0.7 + i * 1.3) * 0.0003;
    }
    iStarPosAttr.needsUpdate = true;

    // Shooting stars
    shootTimer -= dt;
    if (shootTimer <= 0) spawnShootingStar();

    for (const star of shootingPool) {
      if (!star.active) continue;
      star.life += dt;
      const t = star.life / star.maxLife;
      if (t >= 1) {
        star.active = false;
        star.line.visible = false;
        (star.line.material as THREE.LineBasicMaterial).opacity = 0;
        continue;
      }
      // Fade envelope
      const fade = t < 0.12 ? t / 0.12 : 1 - Math.pow((t - 0.12) / 0.88, 2);
      (star.line.material as THREE.LineBasicMaterial).opacity = fade * 0.5;

      const posAttr = star.geom.getAttribute("position") as THREE.BufferAttribute;
      const traveled = star.life * star.speed;
      for (let i = 0; i < TRAIL_PTS; i++) {
        const trailT = i / (TRAIL_PTS - 1);
        const offset = traveled - trailT * star.length * (0.4 + t * 0.6);
        posAttr.array[i * 3] = star.startX + star.dirX * offset;
        posAttr.array[i * 3 + 1] = star.startY + star.dirY * offset;
        posAttr.array[i * 3 + 2] = star.startZ;
      }
      posAttr.needsUpdate = true;
    }
  };

  /* ── DISPOSE ──────────────────────────────────────────── */
  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    innerStarsMat.dispose();
    shootingPool.forEach((s) => (s.line.material as THREE.Material).dispose());
    scene.remove(root);
  };

  return {
    root,
    coreGroup,
    ringGroup,
    dustGroup,
    bgStarGroup,
    update,
    dispose,
  };
}

/* ═══════════════════════════════════════════════════════════
   REACT COMPONENT
   ═══════════════════════════════════════════════════════════ */
interface CosmicOrreryProps {
  className?: string;
}

export function CosmicOrrery({ className = "" }: CosmicOrreryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.2 : 1.5;

    // --- Renderer ---
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    if (!renderer.getContext()) return;

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // --- Scene ---
    const scene = new THREE.Scene();
    if (!isMobile) {
      scene.fog = new THREE.FogExp2(0x08090c, 0.025);
    }

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.5, 14);
    camera.lookAt(0, 0, 0);

    // --- Build ---
    const { mats, dispose: disposeMats } = createOrreryMaterials();
    const lighting = setupOrreryLighting(scene);
    const orrery = buildOrrery(scene, mats);

    // Tilt sphere slightly for more dynamic view
    orrery.root.rotation.x = 0.2;
    orrery.root.rotation.z = 0.05;

    // --- Fit to container ---
    const fitCamera = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const initRect = container.getBoundingClientRect();
    fitCamera(initRect.width, initRect.height);

    const resizeObs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      fitCamera(width, height);
    });
    resizeObs.observe(container);

    // --- Visibility ---
    let visible = true;
    const intObs = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "300px" }
    );
    intObs.observe(container);

    // --- Animation via RenderManager ---
    let elapsed = 0;
    RenderManager.register(
      "cosmic-orrery",
      canvas,
      renderer,
      (dt: number) => {
        elapsed += dt;

        // Smooth pointer
        if (!reducedMotion) {
          const ptr = pointerRef.current;
          const effTX = ptr.isOver ? ptr.targetX : 0;
          const effTY = ptr.isOver ? ptr.targetY : 0;
          const speed = ptr.isOver ? POINTER_SPEED : RETURN_SPEED;
          const factor = 1 - Math.exp(-speed * dt);
          ptr.smoothX += (effTX - ptr.smoothX) * factor;
          ptr.smoothY += (effTY - ptr.smoothY) * factor;

          // Layered tilt: core heaviest, rings medium, dust light, bg lightest
          const tiltXBase = ptr.smoothY * MAX_TILT_RAD;
          const tiltYBase = ptr.smoothX * MAX_TILT_RAD;

          orrery.coreGroup.rotation.x = 0.2 + tiltXBase * 0.6;
          orrery.coreGroup.rotation.z = 0.05 + tiltYBase * 0.3;
          // Y rotation is handled by idle + tilt
          orrery.coreGroup.rotation.y += tiltYBase * 0.004;

          orrery.ringGroup.rotation.x = tiltXBase * 0.8;
          orrery.ringGroup.rotation.z = tiltYBase * 0.5;

          orrery.dustGroup.rotation.x = tiltXBase * 1.0;
          orrery.dustGroup.rotation.y = tiltYBase * 0.6;

          orrery.bgStarGroup.rotation.x = tiltXBase * 0.3;
        }

        // Breathing accent light
        lighting.accent.intensity = 0.25 + Math.sin(elapsed * 1.3) * 0.08;

        orrery.update(dt, elapsed, {
          x: pointerRef.current.smoothX,
          y: pointerRef.current.smoothY,
        });

        renderer.render(scene, camera);
      },
      scene,
      camera,
      3
    );

    return () => {
      RenderManager.unregister("cosmic-orrery");
      resizeObs.disconnect();
      intObs.disconnect();
      orrery.dispose();
      lighting.dispose();
      disposeMats();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  // --- Pointer handlers ---
  const updatePointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.targetY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.isOver = true;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => updatePointer(e.clientX, e.clientY),
    [updatePointer]
  );
  const onPointerLeave = useCallback(() => {
    pointerRef.current.isOver = false;
  }, []);
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    [updatePointer]
  );
  const onTouchEnd = useCallback(() => {
    pointerRef.current.isOver = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-hidden="true"
      style={{ position: "relative" }}
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
