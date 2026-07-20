/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createEvidenceGrid(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.35, { color: 0x5533aa, pulseSpeed: 1.5, pulseAmount: 0.1 });

  // ── Multi-level glass grid structure ─────────────────────
  const gridGeom = new THREE.BoxGeometry(3, 0.05, 3);
  const grids: THREE.Mesh[] = [];
  for (let i = -1; i <= 1; i++) {
    const g = new THREE.Mesh(gridGeom, materials.glassViolet);
    g.position.y = i * 0.8;
    group.add(g);
    grids.push(g);
  }

  // ── Raised node spheres ──────────────────────────────────
  // Use a seeded approach instead of Math.random() for deterministic layout
  const nodeGeom = new THREE.SphereGeometry(0.15, 16, 16);
  const nodes: THREE.Mesh[] = [];
  const coords = [-1, 0, 1];
  const nodePositions: { x: number; y: number; z: number; mat: string }[] = [
    { x: -1, y: 0.85, z: -1, mat: "goldEmissive" },
    { x: 0, y: 0.85, z: 0, mat: "goldEmissive" },
    { x: 1, y: 0.85, z: -1, mat: "goldEmissive" },
    { x: -1, y: 0.85, z: 1, mat: "goldEmissive" },
    { x: 1, y: 0.85, z: 1, mat: "goldEmissive" },
    { x: 0, y: -0.75, z: -1, mat: "glowCyan" },
    { x: -1, y: -0.75, z: 0, mat: "glowCyan" },
    { x: 1, y: -0.75, z: 0, mat: "glowCyan" },
    { x: 0, y: -0.75, z: 1, mat: "glowCyan" },
  ];

  nodePositions.forEach((np) => {
    const n = new THREE.Mesh(nodeGeom, materials[np.mat]);
    n.position.set(np.x * 1.2, np.y, np.z * 1.2);
    group.add(n);
    nodes.push(n);
  });

  // ── Vertical connecting lines ────────────────────────────
  const lineGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8);
  const lines: THREE.Mesh[] = [];
  const linePositions = [
    { x: -0.8, z: -0.6 },
    { x: 0.4, z: 0.9 },
    { x: 0.7, z: -0.8 },
    { x: -0.5, z: 0.3 },
  ];
  linePositions.forEach((lp) => {
    const l = new THREE.Mesh(lineGeom, materials.silverMetallic);
    l.position.set(lp.x, 0, lp.z);
    group.add(l);
    lines.push(l);
  });

  // Tilt the whole thing slightly so it looks isometric
  group.rotation.x = Math.PI / 6;

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 10 : 20;
  const microStars = createMicroStars(group, starCount, 4.5, { color: 0xddc8ff, sizeRange: [0.5, 1.6] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 1, { interval: [8, 15] });
  const nebula = createNebulaPlane(group, { color: 0x0e0820, opacity: 0.04, size: 8, zOffset: -3 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      // Gentle floating animation
      group.position.y = Math.sin(elapsed * 0.7) * 0.15;
      group.rotation.y += delta * 0.12;

      nodes.forEach((n, i) => {
        const base = n.position.y > 0 ? 0.85 : -0.75;
        n.position.y = base + Math.sin(elapsed * 1.8 + i) * 0.08;

        if (mouse) {
          n.position.x += mouse.x * 0.001;
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      gridGeom.dispose();
      nodeGeom.dispose();
      lineGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    },
  };
}
