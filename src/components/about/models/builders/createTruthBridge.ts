/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createTruthBridge(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core (centred on the bridge) ──────────────
  const glowCore = createGlowCore(group, 0.3, { color: 0x447788, pulseSpeed: 1.5, pulseAmount: 0.1 });

  // ── Warm narrative field (gold) ──────────────────────────
  const warmGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const warmField = new THREE.Mesh(warmGeom, materials.goldMetallic);
  warmField.position.set(-2, 0, 0);
  group.add(warmField);

  // Wireframe overlay
  const warmWire = new THREE.Mesh(warmGeom, materials.wireframeGold);
  warmWire.position.copy(warmField.position);
  warmWire.scale.setScalar(1.03);
  group.add(warmWire);

  // ── Cool science field (sapphire) ────────────────────────
  const coolGeom = new THREE.OctahedronGeometry(1.2, 1);
  const coolField = new THREE.Mesh(coolGeom, materials.glassCyan);
  coolField.position.set(2, 0, 0);
  group.add(coolField);

  // ── Neutral silver bridge ────────────────────────────────
  const bridgeGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
  const bridge = new THREE.Mesh(bridgeGeom, materials.silverMetallic);
  bridge.rotation.z = Math.PI / 2;
  group.add(bridge);

  // ── Bridge energy particles ──────────────────────────────
  const particleGeom = new THREE.SphereGeometry(0.08, 8, 8);
  const particles: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(particleGeom, materials.glowCyan);
    group.add(p);
    particles.push(p);
  }

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 10 : 24;
  const microStars = createMicroStars(group, starCount, 5.0, { color: 0xccddee, sizeRange: [0.5, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [8, 15] });
  const nebula = createNebulaPlane(group, { color: 0x0e1525, opacity: 0.04, size: 9, zOffset: -3 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      warmField.rotation.x += delta * 0.35;
      warmField.rotation.y += delta * 0.5;
      warmWire.rotation.copy(warmField.rotation);

      coolField.rotation.x -= delta * 0.4;
      coolField.rotation.z -= delta * 0.25;

      particles.forEach((p, i) => {
        const offset = (elapsed * 1.5 + i) % 4 - 2;
        p.position.set(
          offset,
          Math.sin(elapsed * 4 + i) * 0.2,
          Math.cos(elapsed * 4 + i) * 0.2
        );
        // Parallax
        if (mouse) {
          p.position.y += mouse.y * 0.002;
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      warmGeom.dispose();
      coolGeom.dispose();
      bridgeGeom.dispose();
      particleGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    },
  };
}
