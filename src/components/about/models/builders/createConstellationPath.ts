/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createConstellationPath(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.3, { color: 0x44aadd, pulseSpeed: 2.0, pulseAmount: 0.12 });

  // ── Central memory crystal ───────────────────────────────
  const coreGeom = new THREE.OctahedronGeometry(0.8, 0);
  const core = new THREE.Mesh(coreGeom, materials.glassCyan);
  group.add(core);

  // Wireframe detail
  const coreWire = new THREE.Mesh(coreGeom, materials.wireframeGold);
  coreWire.scale.setScalar(1.03);
  group.add(coreWire);

  // ── Constellation nodes & paths ──────────────────────────
  const points = [
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(1, -2, 1),
    new THREE.Vector3(-1.5, 1.5, -1),
    new THREE.Vector3(-2, -1, 1),
    new THREE.Vector3(0, 2, -2),
  ];

  const nodeGeom = new THREE.IcosahedronGeometry(0.2, 1);
  const nodes: THREE.Mesh[] = [];
  const cylGeoms: THREE.CylinderGeometry[] = [];

  points.forEach((p) => {
    const n = new THREE.Mesh(nodeGeom, materials.silverMetallic);
    n.position.copy(p);
    group.add(n);
    nodes.push(n);

    // Path to centre
    const dist = p.length();
    const cylGeom = new THREE.CylinderGeometry(0.02, 0.02, dist, 8);
    cylGeoms.push(cylGeom);
    const cyl = new THREE.Mesh(cylGeom, materials.goldEmissive);
    // Align cylinder from centre to point
    const halfP = p.clone().multiplyScalar(0.5);
    cyl.position.copy(halfP);
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize());
    group.add(cyl);
  });

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 10 : 22;
  const microStars = createMicroStars(group, starCount, 4.5, { color: 0xbbddff, sizeRange: [0.5, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 1, { interval: [7, 14] });
  const nebula = createNebulaPlane(group, { color: 0x081525, opacity: 0.04, size: 8, zOffset: -3 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      core.rotation.y += delta * 0.25;
      core.rotation.x += delta * 0.15;
      coreWire.rotation.copy(core.rotation);

      group.rotation.y += delta * 0.08;
      group.rotation.z = Math.sin(elapsed * 0.4) * 0.08;

      nodes.forEach((n, i) => {
        n.rotation.x += delta * 0.8;
        n.rotation.y += delta * 1.2;
        n.scale.setScalar(1 + Math.sin(elapsed * 1.8 + i) * 0.15);

        if (mouse) {
          n.position.x += mouse.x * 0.002 * (i % 2 === 0 ? 1 : -1);
        }
      });

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      nodeGeom.dispose();
      cylGeoms.forEach((g) => g.dispose());
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    },
  };
}
