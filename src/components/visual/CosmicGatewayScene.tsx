"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { RenderManager } from "@/core/RenderManager";

/* --------------------------------------------------------------------------
   CosmicGatewayScene — procedural Three.js cosmic gateway portal
   Uses npm-installed `three` — no CDN, no window.THREE.
   Mounts on an external canvas + wrapper passed via refs.
   -------------------------------------------------------------------------- */

interface CosmicGatewaySceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  wrapRef: React.RefObject<HTMLDivElement | null>;
  onReady?: () => void;
}

export function CosmicGatewayScene({
  canvasRef,
  wrapRef,
  onReady,
}: CosmicGatewaySceneProps) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const onReadyCb = useCallback(() => onReady?.(), [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    if (!canvas || !wrapEl) return;
    // Local non-null reference for use in closures
    const wrap: HTMLDivElement = wrapEl;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    /* ---- Renderer ---- */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isCoarse,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isCoarse ? 1.25 : 1.65)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    /* ---- Scene ---- */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050712, 0.022);

    /* ---- Camera ---- */
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.2, 6.6);

    /* Model offset: shift portal to the right half of the full-bleed canvas */
    const modelOffsetX = 1.8;

    /* ---- Groups ---- */
    const interactionGroup = new THREE.Group();
    const baseOrientationGroup = new THREE.Group();
    const gatewayModel = new THREE.Group();

    // Permanent three-quarter base orientation
    baseOrientationGroup.rotation.set(0.18, -0.58, 0.06);
    interactionGroup.position.x = modelOffsetX;

    baseOrientationGroup.add(gatewayModel);
    interactionGroup.add(baseOrientationGroup);
    scene.add(interactionGroup);

    const starGroup = new THREE.Group();
    const nebulaGroup = new THREE.Group();
    const dustGroup = new THREE.Group();
    scene.add(starGroup, nebulaGroup, dustGroup);

    /* ---- Palette ---- */
    const palette = {
      gold: new THREE.Color("#c6a35a"),
      goldSoft: new THREE.Color("#ead69c"),
      ivory: new THREE.Color("#fff6df"),
      silver: new THREE.Color("#cdd7e6"),
      violet: new THREE.Color("#7c3cff"),
      indigo: new THREE.Color("#27165f"),
      sapphire: new THREE.Color("#12326f"),
      cyan: new THREE.Color("#89e7ff"),
    };

    /* ---- Lights ---- */
    scene.add(new THREE.AmbientLight(0xb5c7ff, 0.25));

    const moonLight = new THREE.DirectionalLight(0xf5f2dc, 2.2);
    moonLight.position.set(-3.8, 4.8, 5.4);
    scene.add(moonLight);

    const violetLight = new THREE.PointLight(0x7c3cff, 7.0, 20, 1.8);
    violetLight.position.set(0, 0, 2.5);
    scene.add(violetLight);

    const goldLight = new THREE.PointLight(0xead69c, 2.6, 14, 2.0);
    goldLight.position.set(2.8, -1.5, 2.6);
    scene.add(goldLight);

    const rimLight = new THREE.DirectionalLight(0xdce8ff, 1.8);
    rimLight.position.set(4.5, 2.5, -4.5);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0x89e7ff, 0.8);
    backLight.position.set(-2, -3, -5);
    scene.add(backLight);

    /* ---- Materials ---- */
    function makeMat(
      color: number,
      emissive: number,
      roughness = 0.3,
      metalness = 0.8
    ) {
      return new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.2,
        roughness,
        metalness,
      });
    }

    const goldMat = makeMat(0xc6a35a, 0x5d4216, 0.24, 0.9);
    const silverMat = makeMat(0xcdd7e6, 0x17243a, 0.22, 0.82);
    const ivoryMat = makeMat(0xfff6df, 0x4b3b18, 0.3, 0.74);
    const darkGoldMat = makeMat(0x8f7134, 0x3a260b, 0.35, 0.92);
    const cyanMat = makeMat(0x89e7ff, 0x124466, 0.28, 0.78);

    /* ---- Ring definitions ---- */
    const ringDefs = [
      {
        r: 2.9, tube: 0.05, mat: goldMat,
        tilt: [0.25, -0.55, 0.15] as const, speed: 0.032,
      },
      {
        r: 2.55, tube: 0.04, mat: silverMat,
        tilt: [1.05, 0.15, -0.4] as const, speed: -0.048,
      },
      {
        r: 2.2, tube: 0.045, mat: darkGoldMat,
        tilt: [-0.55, 0.8, 0.6] as const, speed: 0.04,
      },
      {
        r: 1.8, tube: 0.035, mat: ivoryMat,
        tilt: [0.7, -0.75, -0.2] as const, speed: -0.055,
      },
      {
        r: 1.4, tube: 0.04, mat: goldMat,
        tilt: [-1.0, -0.2, 0.45] as const, speed: 0.065,
      },
      {
        r: 1.05, tube: 0.032, mat: cyanMat,
        tilt: [0.45, 0.95, -0.55] as const, speed: -0.072,
      },
      {
        r: 3.2, tube: 0.035, mat: silverMat,
        tilt: [-0.3, -0.6, 0.8] as const, speed: 0.022,
      },
      {
        r: 0.75, tube: 0.028, mat: darkGoldMat,
        tilt: [1.2, -0.35, 0.2] as const, speed: 0.085,
      },
    ];

    interface RingEntry {
      group: THREE.Group;
      speed: number;
    }
    const ringEntries: RingEntry[] = [];

    ringDefs.forEach((def, i) => {
      const group = new THREE.Group();
      group.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2]);

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(def.r, def.tube, 16, 200),
        def.mat
      );
      group.add(torus);

      // Halo
      const haloColor = i % 3 === 0 ? 0xead69c : i % 3 === 1 ? 0x89e7ff : 0x7c3cff;
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(def.r, def.tube * 0.5, 8, 200),
        new THREE.MeshBasicMaterial({
          color: haloColor,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      halo.scale.setScalar(1.02);
      group.add(halo);

      gatewayModel.add(group);
      ringEntries.push({ group, speed: def.speed });
    });

    /* ---- Celestial markings ---- */
    const markGeos = [
      new THREE.BoxGeometry(0.024, 0.18, 0.02),
      new THREE.BoxGeometry(0.02, 0.09, 0.016),
    ];
    ringDefs.slice(0, 4).forEach((def, ri) => {
      const mGroup = new THREE.Group();
      const count = ri === 0 ? 72 : ri === 1 ? 56 : ri === 2 ? 48 : 36;
      const majorEvery = ri === 0 ? 6 : 7;
      for (let i = 0; i < count; i++) {
        if ((i + ri) % 3 === 1 && ri > 1) continue;
        const major = i % majorEvery === 0;
        const mesh = new THREE.Mesh(
          markGeos[major ? 0 : 1],
          major ? goldMat : silverMat
        );
        const angle = (i / count) * Math.PI * 2;
        const r = def.r + (major ? 0.02 : -0.008);
        mesh.position.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          0.005 * ri
        );
        mesh.rotation.z = angle;
        mesh.scale.y = major ? 1.1 : 0.6;
        mGroup.add(mesh);
      }
      mGroup.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2]);
      gatewayModel.add(mGroup);
      ringEntries.push({ group: mGroup, speed: def.speed * -0.6 });
    });

    /* ---- Core void ---- */
    const voidDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 128),
      new THREE.MeshBasicMaterial({
        color: 0x010107,
        transparent: true,
        opacity: 0.97,
        side: THREE.DoubleSide,
      })
    );
    voidDisc.position.z = -0.1;
    gatewayModel.add(voidDisc);

    // Inner glow ring
    const innerGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 1.2, 160),
      new THREE.MeshBasicMaterial({
        color: 0x7c3cff,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    innerGlow.position.z = -0.05;
    gatewayModel.add(innerGlow);

    // Center luminous point
    const centerPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0xfff6df,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
      })
    );
    centerPoint.position.z = 0.02;
    gatewayModel.add(centerPoint);

    // Core pulse sphere
    const corePulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0xfff6df,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
    );
    corePulse.position.z = 0.2;
    gatewayModel.add(corePulse);

    /* ---- Energy waves ---- */
    const energyWaves: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const wave = new THREE.Mesh(
        new THREE.TorusGeometry(1.35 + i * 0.44, 0.007, 8, 164),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? 0x89e7ff : 0x7c3cff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      wave.rotation.set(0.2 - i * 0.1, -0.12 + i * 0.08, i * 0.42);
      gatewayModel.add(wave);
      energyWaves.push(wave);
    }

    /* ---- Sigil nodes ---- */
    const sigilGroup = new THREE.Group();
    const smallSphereGeo = new THREE.SphereGeometry(0.026, 10, 10);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 1.9 + Math.sin(i * 2.31) * 0.04;
      const s = new THREE.Mesh(
        smallSphereGeo,
        i % 5 === 0 ? ivoryMat : goldMat
      );
      s.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.07);
      s.scale.setScalar(i % 5 === 0 ? 1.4 : 0.82);
      sigilGroup.add(s);
    }
    sigilGroup.rotation.set(0.4, -0.2, 0);
    gatewayModel.add(sigilGroup);
    ringEntries.push({ group: sigilGroup, speed: 0.025 });

    /* ---- Point clouds ---- */
    function makePoints(
      count: number,
      radius: number,
      spreadZ: number,
      size: number,
      colors: THREE.Color[],
      opacity: number,
      parent: THREE.Group,
      zOff: number
    ) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const rr = radius * Math.cbrt(Math.random());
        pos[i * 3] = Math.cos(theta) * rr;
        pos[i * 3 + 1] = Math.sin(theta) * rr;
        pos[i * 3 + 2] = u * spreadZ + zOff;
        const c = colors[Math.floor(Math.random() * colors.length)].clone();
        if (Math.random() > 0.7) c.lerp(palette.ivory, 0.25);
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      parent.add(pts);
      return pts;
    }

    const starCount = isCoarse ? 600 : 1200;
    const nebCount = isCoarse ? 400 : 900;
    const dustCount = isCoarse ? 150 : 380;

    makePoints(
      starCount, 14, 20, isCoarse ? 0.018 : 0.014,
      [palette.silver, palette.ivory, palette.cyan, palette.goldSoft],
      0.82, starGroup, -8
    );
    const mid = makePoints(
      Math.floor(starCount * 0.45), 8, 7, isCoarse ? 0.026 : 0.022,
      [palette.silver, palette.cyan, palette.goldSoft],
      0.6, starGroup, -1.2
    );
    mid.position.z = -1;

    const neb = makePoints(
      nebCount, 5.5, 2.8, isCoarse ? 0.055 : 0.045,
      [palette.indigo, palette.violet, palette.sapphire, palette.cyan],
      0.32, nebulaGroup, -1.4
    );
    neb.scale.set(1.2, 0.7, 1);

    const gDust = makePoints(
      dustCount, 4.5, 4, isCoarse ? 0.032 : 0.024,
      [palette.gold, palette.goldSoft, palette.silver],
      0.45, dustGroup, 1.1
    );
    gDust.position.z = 1;

    /* ---- State ---- */
    let width = 1;
    let height = 1;
    let isVisible = true;
    let pageVisible = true;
    const state = {
      targetX: 0,
      targetY: 0,
      yaw: 0,
      targetYaw: 0,
      pitch: 0,
      targetPitch: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      hover: false,
      auto: !prefersReducedMotion,
    };

    /* ---- Resize ---- */
    function resize() {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      camera.aspect = width / height;

      // Safe camera distance: fit model bounding sphere (radius ~3.5) with 12% padding
      const modelRadius = 3.5;
      const safeRadius = modelRadius * 1.12;
      const vFov = (camera.fov * Math.PI) / 180;
      const fitZ = safeRadius / Math.sin(vFov / 2);
      // Use fitZ but clamp to reasonable range
      const baseZ = Math.max(5.8, Math.min(8.5, fitZ));
      camera.position.z =
        width < height ? baseZ * (height / width) * 0.82 : baseZ;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    /* ---- Visibility — generous rootMargin so animation never pauses while near-viewport ---- */
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.0, rootMargin: "300px 0px 300px 0px" }
    );
    io.observe(wrap);

    function onVisChange() {
      pageVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", onVisChange);

    /* ---- Pointer interaction ---- */
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const rect = wrap.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      wrap.style.setProperty("--mx", String(nx));
      wrap.style.setProperty("--my", String(ny));
      if (!state.dragging) {
        state.targetX = nx * 0.22;
        state.targetY = ny * -0.16;
      }
      state.hover = true;
    }
    function onPointerLeave() {
      state.targetX = 0;
      state.targetY = 0;
      state.hover = false;
      wrap.style.setProperty("--mx", "0");
      wrap.style.setProperty("--my", "0");
    }
    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      state.dragging = true;
      state.auto = false;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.targetYaw = state.yaw;
      state.targetPitch = state.pitch;
    }
    function onPointerMoveDoc(e: PointerEvent) {
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.targetYaw += dx * 0.008;
      state.targetPitch = Math.max(
        -0.5,
        Math.min(0.5, state.targetPitch + dy * 0.005)
      );
    }
    function onPointerUp() {
      if (!state.dragging) return;
      state.dragging = false;
      state.auto = !prefersReducedMotion;
    }

    wrap.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerleave", onPointerLeave);
    wrap.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMoveDoc, {
      passive: true,
    });
    document.addEventListener("pointerup", onPointerUp);

    /* ---- Animation via RenderManager ---- */
    let clock = 0;
    let hasRendered = false;

    RenderManager.register(
      "cosmic-gateway",
      canvas,
      renderer,
      (dt: number) => {
        clock += dt;

        if (state.auto && !prefersReducedMotion) {
          state.targetYaw += 0.002;
        }
        state.yaw += (state.targetYaw - state.yaw) * 0.04;
        state.pitch += (state.targetPitch - state.pitch) * 0.06;
        state.targetX += (0 - state.targetX) * 0.02;
        state.targetY += (0 - state.targetY) * 0.02;

        interactionGroup.rotation.y = state.yaw;
        interactionGroup.rotation.x = state.pitch;

        ringEntries.forEach(({ group, speed }) => {
          group.rotation.z += speed * dt;
        });

        energyWaves.forEach((wave, i) => {
          (wave.material as THREE.MeshBasicMaterial).opacity =
            0.12 + Math.sin(clock * 1.4 + i) * 0.06;
        });

        const pscale = 0.9 + Math.sin(clock * 2.2) * 0.15;
        corePulse.scale.setScalar(pscale);
        (corePulse.material as THREE.MeshBasicMaterial).opacity =
          0.6 + Math.sin(clock * 2.2) * 0.22;

        starGroup.rotation.y = clock * 0.005;
        nebulaGroup.rotation.z = clock * 0.003;
        dustGroup.rotation.z = -clock * 0.004;

        camera.position.x += (modelOffsetX + state.targetX * 0.5 - camera.position.x) * 0.04;
        camera.position.y += (0.2 + state.targetY * 0.35 - camera.position.y) * 0.04;
        camera.lookAt(modelOffsetX, 0, 0);

        renderer.render(scene, camera);

        if (!hasRendered) {
          hasRendered = true;
          onReadyCb();
        }
      },
      scene,
      camera
    );

    /* ---- Cleanup ---- */
    const cleanup = () => {
      RenderManager.unregister("cosmic-gateway");
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      wrap.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMoveDoc);
      document.removeEventListener("pointerup", onPointerUp);

      // Dispose geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
        if (obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          (obj.material as THREE.PointsMaterial)?.dispose();
        }
      });
      renderer.dispose();
    };
    cleanupRef.current = cleanup;

    return () => {
      cleanupRef.current?.();
    };
  }, [canvasRef, wrapRef, onReadyCb]);

  return null; // side-effect only
}
