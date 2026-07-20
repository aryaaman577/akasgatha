/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createGlowCore, createMicroStars, createShootingStarPool, createNebulaPlane } from "./spaceEffects";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

export function createSatelliteOrbit(scene: THREE.Scene, materials: Record<string, any>) {
  const group = new THREE.Group();
  scene.add(group);

  // ── Inner glow core ──────────────────────────────────────
  const glowCore = createGlowCore(group, 0.35, { color: 0x6633bb, pulseSpeed: 2.0, pulseAmount: 0.12 });

  // ── Central core ─────────────────────────────────────────
  const coreGeom = new THREE.SphereGeometry(1.0, 32, 32);
  const core = new THREE.Mesh(coreGeom, materials.glassViolet);
  group.add(core);

  const innerGeom = new THREE.IcosahedronGeometry(0.8, 1);
  const inner = new THREE.Mesh(innerGeom, materials.obsidian);
  group.add(inner);

  // Wireframe on inner
  const innerWire = new THREE.Mesh(innerGeom, materials.wireframeGold);
  innerWire.scale.setScalar(1.02);
  group.add(innerWire);

  // ── Orbit planes ─────────────────────────────────────────
  const ringGeom = new THREE.TorusGeometry(2.5, 0.02, 16, 64);
  const planes = [
    { rotX: Math.PI / 2, rotY: 0 },
    { rotX: Math.PI / 3, rotY: Math.PI / 4 },
    { rotX: -Math.PI / 4, rotY: Math.PI / 3 },
  ];

  const rings: THREE.Mesh[] = [];
  planes.forEach((p) => {
    const r = new THREE.Mesh(ringGeom, materials.silverMetallic);
    r.rotation.x = p.rotX;
    r.rotation.y = p.rotY;
    group.add(r);
    rings.push(r);
  });

  // ── Satellites ───────────────────────────────────────────
  const satGeom = new THREE.BoxGeometry(0.3, 0.3, 0.6);
  const sats: { mesh: THREE.Mesh; angle: number; speed: number; plane: { rotX: number; rotY: number } }[] = [];

  // Pre-allocate reusable objects for satellite position calculation
  const _satPos = new THREE.Vector3();
  const _satEuler = new THREE.Euler();

  planes.forEach((p, i) => {
    const s = new THREE.Mesh(satGeom, materials.goldMetallic);
    group.add(s);
    sats.push({ mesh: s, angle: i * 2, speed: 0.4 + i * 0.15, plane: p });
  });

  // ── Space effects ────────────────────────────────────────
  const starCount = IS_MOBILE ? 10 : 24;
  const microStars = createMicroStars(group, starCount, 5.0, { color: 0xddccff, sizeRange: [0.5, 1.8] });
  const shootingStars = IS_MOBILE ? null : createShootingStarPool(group, 2, { interval: [6, 13] });
  const nebula = createNebulaPlane(group, { color: 0x100830, opacity: 0.04, size: 9, zOffset: -3.5 });

  return {
    group,
    update: (delta: number, elapsed: number, mouse?: { x: number; y: number }) => {
      core.rotation.y -= delta * 0.15;
      inner.rotation.x += delta * 0.3;
      inner.rotation.y += delta * 0.3;
      innerWire.rotation.copy(inner.rotation);

      sats.forEach((s) => {
        s.angle += delta * s.speed;

        // Calculate position on the tilted ring (reuse pre-allocated objects)
        _satPos.set(Math.cos(s.angle) * 2.5, Math.sin(s.angle) * 2.5, 0);
        _satEuler.set(s.plane.rotX, s.plane.rotY, 0);
        _satPos.applyEuler(_satEuler);

        s.mesh.position.copy(_satPos);
        s.mesh.lookAt(core.position);

        if (mouse) {
          s.mesh.position.x += mouse.x * 0.003;
          s.mesh.position.y += mouse.y * 0.003;
        }
      });

      group.rotation.y += delta * 0.04;

      glowCore.update(elapsed);
      microStars.update(elapsed);
      shootingStars?.update(delta, elapsed);
      nebula.update(elapsed);
    },
    dispose: () => {
      coreGeom.dispose();
      innerGeom.dispose();
      ringGeom.dispose();
      satGeom.dispose();
      glowCore.dispose();
      microStars.dispose();
      shootingStars?.dispose();
      nebula.dispose();
      scene.remove(group);
    },
  };
}
