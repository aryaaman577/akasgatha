/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createCosmicGate(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.6, { color: 0x221155, pulseSpeed: 2.0, pulseAmount: 0.15 });

  // ── Black dimensional centre ─────────────────────────────
  const coreGeom = new THREE.SphereGeometry(1.5, 32, 32);
  const core = new THREE.Mesh(coreGeom, materials.obsidian);
  group.add(core);

  // ── Thick nested orbital bands ───────────────────────────
  const ringGeom = new THREE.TorusGeometry(2.2, 0.2, 16, 64);
  const ring1 = new THREE.Mesh(ringGeom, materials.silverMetallic);
  group.add(ring1);

  const ringGeom2 = new THREE.TorusGeometry(2.8, 0.1, 16, 64);
  const ring2 = new THREE.Mesh(ringGeom2, materials.goldMetallic);
  group.add(ring2);

  // ── Floating fragments ───────────────────────────────────
  const fragGeom = new THREE.TetrahedronGeometry(0.2);
  const fragments: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const f = new THREE.Mesh(fragGeom, materials.goldEmissive);
    group.add(f);
    fragments.push(f);
  }

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 12 : 28;
  const microStars = createMicroStars(group, starCount, 6.0, { color: 0xeeddff, sizeRange: [0.6, 2.0] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [5, 12] });
  const nebula = createNebulaPlane(group, { color: 0x110525, opacity: 0.05, size: 10, zOffset: -4 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      ring1.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.4) * 0.2;
      ring1.rotation.y = elapsed * 0.35;

      ring2.rotation.x = Math.PI / 4 + Math.cos(elapsed * 0.25) * 0.2;
      ring2.rotation.z = -elapsed * 0.25;

      fragments.forEach((f, i) => {
        const angle = (i / 6) * Math.PI * 2 + elapsed * 0.4;
        f.position.set(
          Math.cos(angle) * 3.5, 
          Math.sin(elapsed * 2 + i) * 0.5, 
          Math.sin(angle) * 3.5
        );
        f.rotation.x += delta * 0.8;
        f.rotation.y += delta * 1.5;

        // Parallax
        if (mouse) {
          f.position.x += mouse.x * 0.003 * (i % 2 === 0 ? 1 : -1);
          f.position.y += mouse.y * 0.003 * (i % 2 === 0 ? 1 : -1);
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      ringGeom.dispose();
      ringGeom2.dispose();
      fragGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    }
  };
}
