/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createTelescopeView(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.35, { color: 0x4488aa, pulseSpeed: 2.2, pulseAmount: 0.1 });

  // ── Thick transparent lens body ──────────────────────────
  const lensGeom = new THREE.CylinderGeometry(2, 2, 0.5, 32);
  const lens = new THREE.Mesh(lensGeom, materials.glassCyan);
  lens.rotation.x = Math.PI / 2;
  group.add(lens);

  // Rim glass highlight on lens
  const rimGeom = new THREE.CylinderGeometry(2.05, 2.05, 0.52, 32);
  const rim = new THREE.Mesh(rimGeom, materials.rimGlass);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // ── Internal focusing rings ──────────────────────────────
  const ringGeom = new THREE.TorusGeometry(1.5, 0.05, 16, 64);
  const ring1 = new THREE.Mesh(ringGeom, materials.silverMetallic);
  const ring2 = new THREE.Mesh(ringGeom, materials.goldMetallic);
  ring1.scale.set(1.2, 1.2, 1.2);
  group.add(ring1, ring2);

  // ── Observation points ───────────────────────────────────
  const pointGeom = new THREE.SphereGeometry(0.15, 16, 16);
  const points: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const point = new THREE.Mesh(pointGeom, materials.goldEmissive);
    point.position.set(Math.cos(i * 2) * 2.5, Math.sin(i * 2) * 2.5, 0);
    group.add(point);
    points.push(point);
  }

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 10 : 22;
  const microStars = createMicroStars(group, starCount, 4.5, { color: 0xaaccdd, sizeRange: [0.5, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [7, 14] });
  const nebula = createNebulaPlane(group, { color: 0x0a1830, opacity: 0.04, size: 9, zOffset: -3.5 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      ring1.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
      ring1.rotation.y = Math.cos(elapsed * 0.4) * 0.2;

      ring2.rotation.x = -Math.sin(elapsed * 0.6) * 0.25;
      ring2.rotation.y = -Math.cos(elapsed * 0.6) * 0.25;

      points.forEach((p, i) => {
        p.position.z = Math.sin(elapsed * 1.5 + i) * 0.5;
        // Subtle parallax on observation points
        if (mouse) {
          p.position.x += mouse.x * 0.001;
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      lensGeom.dispose();
      rimGeom.dispose();
      ringGeom.dispose();
      pointGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    },
  };
}
