/**
 * Shared space-effect helpers for About-section 3D models.
 * Uses instanced geometry and object pooling — zero allocations in the animation loop.
 */
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
   1. Instanced Micro-Stars
   ───────────────────────────────────────────────────────── */

interface MicroStarField {
  points: THREE.Points;
  update: (elapsed: number) => void;
  dispose: () => void;
}

/**
 * Creates a field of tiny twinkling stars around a model.
 * Uses a single Points object with instanced attributes — very cheap to render.
 */
export function createMicroStars(
  parent: THREE.Group,
  count: number,
  radius: number,
  options?: { color?: number; sizeRange?: [number, number]; depthRange?: [number, number] }
): MicroStarField {
  const color = options?.color ?? 0xd8dce9;
  const [minSize, maxSize] = options?.sizeRange ?? [0.8, 2.5];
  const [minDepth, maxDepth] = options?.depthRange ?? [-radius, radius];

  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count); // random phase offsets for twinkle
  const baseOpacities = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Distribute in a sphere shell
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.5 + Math.random() * 0.5);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = minDepth + Math.random() * (maxDepth - minDepth);

    phases[i] = Math.random() * Math.PI * 2;
    baseOpacities[i] = 0.3 + Math.random() * 0.5;
    sizes[i] = minSize + Math.random() * (maxSize - minSize);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aBaseOpacity", new THREE.BufferAttribute(baseOpacities, 1));
  // THREE.Points uses the size attribute from material, but we store per-point sizes
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    size: 1.5,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  parent.add(points);

  // Pre-allocate for twinkle update
  const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

  return {
    points,
    update: (elapsed: number) => {
      // Subtle twinkling via opacity modulation
      const t = elapsed * 1.5;
      let avgOpacity = 0;
      for (let i = 0; i < count; i++) {
        const twinkle = 0.5 + 0.5 * Math.sin(t + phases[i] * 3.0);
        avgOpacity += baseOpacities[i] * twinkle;

        // Gentle slow drift
        posAttr.array[i * 3 + 1] += Math.sin(t * 0.3 + phases[i]) * 0.0003;
      }
      material.opacity = Math.min(0.8, (avgOpacity / count) * 1.2);
      posAttr.needsUpdate = true;
    },
    dispose: () => {
      parent.remove(points);
      geometry.dispose();
      material.dispose();
    },
  };
}


/* ─────────────────────────────────────────────────────────
   2. Shooting Star Pool
   ───────────────────────────────────────────────────────── */

interface ShootingStarPool {
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

interface PooledStar {
  line: THREE.Line;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
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

/**
 * Pre-allocated pool of shooting star line objects.
 * Only one active at a time per pool. Spawns at randomized intervals.
 */
export function createShootingStarPool(
  parent: THREE.Group,
  poolSize: number = 2,
  options?: { interval?: [number, number]; speedRange?: [number, number] }
): ShootingStarPool {
  const [minInterval, maxInterval] = options?.interval ?? [5, 10];
  const [minSpeed, maxSpeed] = options?.speedRange ?? [4, 8];

  const TRAIL_POINTS = 12;
  const pool: PooledStar[] = [];

  for (let i = 0; i < poolSize; i++) {
    const positions = new Float32Array(TRAIL_POINTS * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false;
    line.visible = false;
    parent.add(line);

    pool.push({
      line,
      geometry,
      material,
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

  let nextSpawnTime = minInterval + Math.random() * (maxInterval - minInterval);
  let timeSinceSpawn = nextSpawnTime * 0.7; // spawn first one sooner

  const spawnStar = () => {
    // Find an inactive star
    const star = pool.find((s) => !s.active);
    if (!star) return;

    // Random direction: angled roughly downward-right to upper-left (varied)
    const angle = (0.6 + Math.random() * 1.2) * Math.PI; // 108°–396° range
    star.dirX = Math.cos(angle);
    star.dirY = Math.sin(angle);

    // Random start position at the edge of the scene
    star.startX = (Math.random() - 0.3) * 6;
    star.startY = 2 + Math.random() * 3;
    star.startZ = -1 - Math.random() * 2;

    star.speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    star.length = 2 + Math.random() * 3;
    star.maxLife = 0.3 + Math.random() * 0.4;
    star.life = 0;
    star.active = true;
    star.line.visible = true;

    nextSpawnTime = minInterval + Math.random() * (maxInterval - minInterval);
    timeSinceSpawn = 0;
  };

  return {
    update: (delta: number, _elapsed: number) => {
      // Spawn logic
      timeSinceSpawn += delta;
      if (timeSinceSpawn >= nextSpawnTime) {
        spawnStar();
      }

      // Update active stars
      for (const star of pool) {
        if (!star.active) continue;

        star.life += delta;
        const t = star.life / star.maxLife;

        if (t >= 1) {
          star.active = false;
          star.line.visible = false;
          star.material.opacity = 0;
          continue;
        }

        // Fade: quick in, slow out
        const fade = t < 0.15 ? t / 0.15 : 1 - Math.pow((t - 0.15) / 0.85, 2);
        star.material.opacity = fade * 0.7;

        // Compute trail positions (tapered: head is current, tail fades behind)
        const posAttr = star.geometry.getAttribute("position") as THREE.BufferAttribute;
        const traveled = star.life * star.speed;

        for (let i = 0; i < TRAIL_POINTS; i++) {
          const trailT = i / (TRAIL_POINTS - 1); // 0=head, 1=tail
          const offset = traveled - trailT * star.length * (0.5 + t * 0.5);

          posAttr.array[i * 3] = star.startX + star.dirX * offset;
          posAttr.array[i * 3 + 1] = star.startY + star.dirY * offset;
          posAttr.array[i * 3 + 2] = star.startZ;
        }
        posAttr.needsUpdate = true;
      }
    },
    dispose: () => {
      for (const star of pool) {
        parent.remove(star.line);
        star.geometry.dispose();
        star.material.dispose();
      }
    },
  };
}


/* ─────────────────────────────────────────────────────────
   3. Nebula Depth Plane
   ───────────────────────────────────────────────────────── */

interface NebulaPlane {
  mesh: THREE.Mesh;
  update: (elapsed: number) => void;
  dispose: () => void;
}

/**
 * Creates a large semi-transparent plane behind the model
 * with a gentle rotation for atmospheric nebula depth.
 */
export function createNebulaPlane(
  parent: THREE.Group,
  options?: { color?: number; opacity?: number; size?: number; zOffset?: number }
): NebulaPlane {
  const color = options?.color ?? 0x1a0e30;
  const opacity = options?.opacity ?? 0.05;
  const planeSize = options?.size ?? 8;
  const zOffset = options?.zOffset ?? -3;

  const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = zOffset;
  mesh.frustumCulled = false;
  parent.add(mesh);

  return {
    mesh,
    update: (elapsed: number) => {
      mesh.rotation.z = Math.sin(elapsed * 0.15) * 0.1;
      const breathe = 1 + Math.sin(elapsed * 0.25) * 0.03;
      mesh.scale.setScalar(breathe);
    },
    dispose: () => {
      parent.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}


/* ─────────────────────────────────────────────────────────
   4. Inner Glow Core
   ───────────────────────────────────────────────────────── */

interface GlowCore {
  mesh: THREE.Mesh;
  update: (elapsed: number) => void;
  dispose: () => void;
}

/**
 * A small additive-blended sphere placed at the model's center
 * that pulses gently for a "living energy" feel.
 */
export function createGlowCore(
  parent: THREE.Group,
  radius: number = 0.4,
  options?: { color?: number; pulseSpeed?: number; pulseAmount?: number }
): GlowCore {
  const color = options?.color ?? 0x4422aa;
  const pulseSpeed = options?.pulseSpeed ?? 2.0;
  const pulseAmount = options?.pulseAmount ?? 0.15;

  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  parent.add(mesh);

  return {
    mesh,
    update: (elapsed: number) => {
      const pulse = 1 + Math.sin(elapsed * pulseSpeed) * pulseAmount;
      mesh.scale.setScalar(pulse);
      material.opacity = 0.25 + Math.sin(elapsed * pulseSpeed * 0.7) * 0.1;
    },
    dispose: () => {
      parent.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
