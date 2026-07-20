/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createKnowledgeLibrary(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner energy core (luminous) ─────────────────────────
  const glowCore = createGlowCore(group, 0.5, { color: 0x5533bb, pulseSpeed: 1.8, pulseAmount: 0.12 });

  // ── Core octahedron ──────────────────────────────────────
  const coreGeom = new THREE.OctahedronGeometry(1.2, 2);
  const core = new THREE.Mesh(coreGeom, materials.goldEmissive);
  group.add(core);

  // Wireframe overlay on core for layered detail
  const wireframe = new THREE.Mesh(coreGeom, materials.wireframeGold);
  wireframe.scale.setScalar(1.02);
  group.add(wireframe);

  // ── Crystal Shell ────────────────────────────────────────
  const shellGeom = new THREE.IcosahedronGeometry(2.0, 1);
  const shell = new THREE.Mesh(shellGeom, materials.glassCyan);
  group.add(shell);

  // Energy field aura around shell
  const auraGeom = new THREE.IcosahedronGeometry(2.3, 1);
  const aura = new THREE.Mesh(auraGeom, materials.energyField);
  group.add(aura);

  // ── Orbiting Knowledge Fragments ─────────────────────────
  const fragGeom = new THREE.BoxGeometry(0.3, 0.3, 0.05);
  const fragments: THREE.Mesh[] = [];
  const fragCount = 8;
  for (let i = 0; i < fragCount; i++) {
    const frag = new THREE.Mesh(fragGeom, materials.goldMetallic);
    const angle = (i / fragCount) * Math.PI * 2;
    frag.position.set(
      Math.cos(angle) * 3,
      Math.sin(angle) * 1.5,
      Math.sin(angle) * 3
    );
    group.add(frag);
    fragments.push(frag);
  }

  // ── Measurement rings ────────────────────────────────────
  const ringGeom = new THREE.TorusGeometry(3.5, 0.02, 16, 100);
  const ring1 = new THREE.Mesh(ringGeom, materials.silverMetallic);
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);
  const ring2 = new THREE.Mesh(ringGeom, materials.goldMetallic);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 15 : 30;
  const microStars = createMicroStars(group, starCount, 5.5, { color: 0xd8dce9, sizeRange: [0.6, 2.0] });

  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [6, 12] });

  const nebula1 = createNebulaPlane(group, { color: 0x1a0e30, opacity: 0.05, size: 10, zOffset: -4 });
  const nebula2 = createNebulaPlane(group, { color: 0x0a1530, opacity: 0.03, size: 8, zOffset: -5 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      core.rotation.y += delta * 0.4;
      wireframe.rotation.y = core.rotation.y;
      wireframe.rotation.x = core.rotation.x;
      shell.rotation.z -= delta * 0.15;
      shell.rotation.x += delta * 0.08;
      aura.rotation.z = shell.rotation.z;
      aura.rotation.x = shell.rotation.x;

      // Fragment orbit with eccentricity
      for (let i = 0; i < fragCount; i++) {
        const f = fragments[i];
        const angle = (i / fragCount) * Math.PI * 2;
        const speed = 0.3 + (i % 3) * 0.08;
        f.rotation.x += delta * 0.8;
        f.position.y += Math.sin(elapsed * speed * 2 + angle) * 0.003;

        // Subtle parallax response to mouse
        if (mouse) {
          f.position.x += mouse.x * 0.002 * (i % 2 === 0 ? 1 : -1);
        }
      }

      ring1.rotation.z += delta * 0.08;
      ring2.rotation.x -= delta * 0.12;

      // Space effects
      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula1.update(elapsed);
      nebula2.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      shellGeom.dispose();
      auraGeom.dispose();
      fragGeom.dispose();
      ringGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula1.dispose();
      nebula2.dispose();
      scene.remove(group);
    },
  };
}
