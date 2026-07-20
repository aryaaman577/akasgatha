/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createQuestionOrb(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.4, { color: 0xaa55ff, pulseSpeed: 2.5, pulseAmount: 0.2 });

  // ── Solid silver pulsar centre ───────────────────────────
  const coreGeom = new THREE.IcosahedronGeometry(1.2, 2);
  const core = new THREE.Mesh(coreGeom, materials.silverMetallic);
  group.add(core);

  // Wireframe detail
  const coreWire = new THREE.Mesh(coreGeom, materials.wireframeGold);
  coreWire.scale.setScalar(1.02);
  group.add(coreWire);

  // ── Violet energy shell ──────────────────────────────────
  const shellGeom = new THREE.SphereGeometry(2, 32, 32);
  const shell = new THREE.Mesh(shellGeom, materials.glassViolet);
  group.add(shell);

  // ── Orbiting nodes ───────────────────────────────────────
  const nodeGeom = new THREE.SphereGeometry(0.2, 16, 16);
  const nodes: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const node = new THREE.Mesh(nodeGeom, materials.glowCyan);
    group.add(node);
    nodes.push(node);
  }

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 12 : 25;
  const microStars = createMicroStars(group, starCount, 4.8, { color: 0xddeeff, sizeRange: [0.5, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 1, { interval: [6, 12] });
  const nebula = createNebulaPlane(group, { color: 0x150830, opacity: 0.05, size: 8, zOffset: -3 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      core.rotation.y -= delta * 0.4;
      core.rotation.x += delta * 0.15;
      coreWire.rotation.copy(core.rotation);
      
      shell.rotation.y += delta * 0.08;
      const scale = 1 + Math.sin(elapsed * 2.5) * 0.04;
      shell.scale.set(scale, scale, scale);

      nodes.forEach((node, i) => {
        const speed = i % 2 === 0 ? 1.2 : -1.0;
        const radius = 2.5 + (i * 0.2);
        node.position.x = Math.cos(elapsed * speed + i) * radius;
        node.position.z = Math.sin(elapsed * speed + i) * radius;
        node.position.y = Math.sin(elapsed * 1.8 + i) * 1.5;
        
        if (mouse) {
           node.position.x += mouse.x * 0.003;
           node.position.y += mouse.y * 0.003;
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      shellGeom.dispose();
      nodeGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    }
  };
}
