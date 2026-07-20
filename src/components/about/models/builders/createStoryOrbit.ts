/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createStoryOrbit(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.4, { color: 0x44aaff, pulseSpeed: 1.8, pulseAmount: 0.15 });

  // ── Volumetric blue core ─────────────────────────────────
  const coreGeom = new THREE.SphereGeometry(1.2, 32, 32);
  const core = new THREE.Mesh(coreGeom, materials.glassCyan);
  group.add(core);

  // Wireframe
  const coreWire = new THREE.Mesh(coreGeom, materials.wireframeGold);
  coreWire.scale.setScalar(1.02);
  group.add(coreWire);

  // ── Layered golden torus ribbons ─────────────────────────
  const ribbonGeom = new THREE.TorusGeometry(2.0, 0.15, 16, 64, Math.PI * 1.5);
  const ribbons: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(ribbonGeom, materials.goldMetallic);
    r.rotation.x = Math.PI * Math.random();
    r.rotation.y = Math.PI * Math.random();
    group.add(r);
    ribbons.push(r);
  }

  // ── Floating geometric fragments ─────────────────────────
  const fragGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const fragments: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const f = new THREE.Mesh(fragGeom, materials.silverMetallic);
    group.add(f);
    fragments.push(f);
  }

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 12 : 26;
  const microStars = createMicroStars(group, starCount, 5.0, { color: 0xccddee, sizeRange: [0.6, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [7, 13] });
  const nebula = createNebulaPlane(group, { color: 0x051125, opacity: 0.05, size: 9, zOffset: -3.5 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      core.rotation.y += delta * 0.15;
      core.rotation.z += delta * 0.08;
      coreWire.rotation.copy(core.rotation);

      ribbons.forEach((r, i) => {
        const speed = i % 2 === 0 ? 0.25 : -0.15;
        r.rotation.z += delta * speed;
        r.rotation.x += delta * speed * 0.4;
      });

      fragments.forEach((f, i) => {
        const r = 2.8 + Math.sin(elapsed + i) * 0.2;
        f.position.set(
          Math.cos(elapsed * 0.7 + i) * r,
          Math.sin(elapsed * 0.4 + i) * 1.5,
          Math.sin(elapsed * 0.7 + i) * r
        );
        f.rotation.x += delta * 0.8;
        f.rotation.y += delta * 1.6;

        if (mouse) {
          f.position.x += mouse.x * 0.002;
          f.position.y += mouse.y * 0.002;
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      ribbonGeom.dispose();
      fragGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    }
  };
}
