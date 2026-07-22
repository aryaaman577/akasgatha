"use client";

import { useEffect, useRef } from "react";

/* --------------------------------------------------------------------------
   GatewayCanvas — procedural Three.js cosmic gateway portal
   Three.js is loaded from CDN via <Script> in HeroSection.tsx.
   This component attaches to the pre-existing canvas element.
   -------------------------------------------------------------------------- */

interface GatewayCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}

export function GatewayCanvasController({ canvasRef, wrapRef }: GatewayCanvasProps) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Wait for Three.js CDN script to be available
    let attempts = 0;
    const maxAttempts = 60;

    function tryInit() {
      attempts++;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (!w.THREE) {
        if (attempts < maxAttempts) {
          setTimeout(tryInit, 200);
        }
        return;
      }
      if (!canvasRef.current || !wrapRef.current) return;

      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      const THREE = w.THREE;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;

      let renderer: any;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !isCoarse,
          powerPreference: "high-performance",
        });
      } catch (e) {
        return; // gracefully exit if WebGL fails
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCoarse ? 1.22 : 1.65));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050712, 0.035);

      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
      camera.position.set(0, 0.16, 8.35);

      const gateway = new THREE.Group();
      scene.add(gateway);

      const nebulaGroup = new THREE.Group();
      const starGroup = new THREE.Group();
      const dustGroup = new THREE.Group();
      scene.add(starGroup, nebulaGroup, dustGroup);

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

      scene.add(new THREE.AmbientLight(0xb5c7ff, 0.22));
      const moonLight = new THREE.DirectionalLight(0xf5f2dc, 2.0);
      moonLight.position.set(-3.8, 4.8, 5.4);
      scene.add(moonLight);
      const violetLight = new THREE.PointLight(0x7c3cff, 6.2, 18, 1.8);
      violetLight.position.set(0, 0, 2.2);
      scene.add(violetLight);
      const goldLight = new THREE.PointLight(0xead69c, 2.1, 12, 2.2);
      goldLight.position.set(2.6, -1.3, 2.4);
      scene.add(goldLight);
      const rimLight = new THREE.DirectionalLight(0xdce8ff, 1.55);
      rimLight.position.set(4, 2, -4);
      scene.add(rimLight);

      function makeMaterial(color: number, emissive: number, roughness = 0.34, metalness = 0.76) {
        return new THREE.MeshStandardMaterial({
          color, emissive, emissiveIntensity: 0.18,
          roughness, metalness,
        });
      }

      const goldMat = makeMaterial(0xc6a35a, 0x5d4216, 0.26, 0.88);
      const silverMat = makeMaterial(0xcdd7e6, 0x17243a, 0.24, 0.78);
      const ivoryMat = makeMaterial(0xfff6df, 0x4b3b18, 0.32, 0.72);
      const darkGoldMat = makeMaterial(0x8f7134, 0x3a260b, 0.38, 0.9);

      const ringData = [
        { radius: 2.86, tube: 0.05, mat: goldMat,     tilt: [0.35, -0.74,  0.13], speed: 0.035 },
        { radius: 2.46, tube: 0.04, mat: silverMat,   tilt: [-0.62, 0.28,  0.54], speed: -0.052 },
        { radius: 2.08, tube: 0.045, mat: darkGoldMat, tilt: [0.54,  0.48, -0.38], speed: 0.044 },
        { radius: 1.62, tube: 0.035, mat: ivoryMat,    tilt: [-0.43, -0.56, 0.41], speed: -0.061 },
        { radius: 1.21, tube: 0.04, mat: goldMat,     tilt: [0.82,  0.17, -0.61], speed: 0.072 },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ringGroups: { group: any; speed: number; halo: any }[] = [];
      ringData.forEach((data, i) => {
        const group = new THREE.Group();
        group.rotation.set(data.tilt[0], data.tilt[1], data.tilt[2]);
        const torus = new THREE.Mesh(new THREE.TorusGeometry(data.radius, data.tube, 12, 192), data.mat);
        group.add(torus);
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(data.radius, data.tube * 0.62, 8, 192),
          new THREE.MeshBasicMaterial({
            color: i % 2 ? 0x89e7ff : 0xead69c, transparent: true,
            opacity: i % 2 ? 0.12 : 0.16, blending: THREE.AdditiveBlending, depthWrite: false,
          })
        );
        halo.scale.setScalar(1.018);
        group.add(halo);
        gateway.add(group);
        ringGroups.push({ group, speed: data.speed, halo });
      });

      const markGeos = [new THREE.BoxGeometry(0.022, 0.16, 0.018), new THREE.BoxGeometry(0.018, 0.08, 0.014)];
      ringData.slice(0, 4).forEach((data, ringIndex) => {
        const markGroup = new THREE.Group();
        const count = ringIndex === 0 ? 72 : ringIndex === 1 ? 56 : 42;
        const majorEvery = ringIndex === 0 ? 6 : 7;
        for (let i = 0; i < count; i++) {
          if ((i + ringIndex) % 3 === 1 && ringIndex > 1) continue;
          const major = i % majorEvery === 0;
          const mesh = new THREE.Mesh(markGeos[major ? 0 : 1], major ? goldMat : silverMat);
          const angle = (i / count) * Math.PI * 2;
          const r = data.radius + (major ? 0.018 : -0.006);
          mesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.004 * ringIndex);
          mesh.rotation.z = angle;
          mesh.scale.y = major ? 1.05 : 0.64;
          markGroup.add(mesh);
        }
        markGroup.rotation.set(data.tilt[0], data.tilt[1], data.tilt[2]);
        gateway.add(markGroup);
        ringGroups.push({ group: markGroup, speed: data.speed * -0.68, halo: null });
      });

      const voidDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.02, 128),
        new THREE.MeshBasicMaterial({ color: 0x010107, transparent: true, opacity: 0.96, side: THREE.DoubleSide })
      );
      voidDisc.position.z = -0.08;
      gateway.add(voidDisc);

      const innerGlow = new THREE.Mesh(
        new THREE.RingGeometry(0.72, 1.18, 160),
        new THREE.MeshBasicMaterial({
          color: 0x7c3cff, transparent: true, opacity: 0.25,
          blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
        })
      );
      innerGlow.position.z = -0.04;
      gateway.add(innerGlow);
      
      const centerLuminousPoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
        })
      );
      centerLuminousPoint.position.z = -0.02;
      gateway.add(centerLuminousPoint);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const energyWaves: any[] = [];
      for (let i = 0; i < 4; i++) {
        const wave = new THREE.Mesh(
          new THREE.TorusGeometry(1.34 + i * 0.42, 0.006, 8, 164),
          new THREE.MeshBasicMaterial({
            color: i % 2 ? 0x89e7ff : 0x7c3cff, transparent: true, opacity: 0.12,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
        );
        wave.rotation.set(0.18 - i * 0.08, -0.1 + i * 0.07, i * 0.4);
        gateway.add(wave);
        energyWaves.push(wave);
      }

      const sigilGroup = new THREE.Group();
      const smallSphereGeo = new THREE.SphereGeometry(0.024, 10, 10);
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const r = 1.83 + Math.sin(i * 2.31) * 0.035;
        const s = new THREE.Mesh(smallSphereGeo, i % 5 === 0 ? ivoryMat : goldMat);
        s.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.06);
        s.scale.setScalar(i % 5 === 0 ? 1.32 : 0.78);
        sigilGroup.add(s);
      }
      sigilGroup.rotation.set(0.32, -0.18, 0);
      gateway.add(sigilGroup);
      ringGroups.push({ group: sigilGroup, speed: 0.028, halo: null });


      function createPointCloud(
        count: number, radius: number, spreadZ: number, size: number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        colors: any[], opacity: number, group: any, name: string
      ) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2;
          const u = Math.random() * 2 - 1;
          const rr = radius * Math.cbrt(Math.random());
          const planeBias = name === "nebula" ? 0.38 : 1;
          pos[i * 3] = Math.cos(theta) * rr * (name === "nebula" ? 1.45 : 1);
          pos[i * 3 + 1] = Math.sin(theta) * rr * planeBias;
          pos[i * 3 + 2] = u * spreadZ - (name === "stars" ? 8 : 0.6);
          const color = colors[Math.floor(Math.random() * colors.length)].clone();
          if (Math.random() > 0.72) color.lerp(palette.ivory, 0.25);
          col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({
          size, vertexColors: true, transparent: true, opacity,
          blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        group.add(points);
        return points;
      }

      const starCount = isCoarse ? 720 : 1400;
      const nebulaCount = isCoarse ? 520 : 1050;
      const dustCount = isCoarse ? 180 : 420;

      createPointCloud(starCount, 13, 18, isCoarse ? 0.018 : 0.014,
        [palette.silver, palette.ivory, palette.cyan, palette.goldSoft], 0.82, starGroup, "stars");

      const midStars = createPointCloud(Math.floor(starCount * 0.46), 7.4, 7, isCoarse ? 0.026 : 0.022,
        [palette.silver, palette.cyan, palette.goldSoft], 0.64, starGroup, "mid");
      midStars.position.z = -1.2;

      const nebula = createPointCloud(nebulaCount, 5.2, 2.5, isCoarse ? 0.055 : 0.045,
        [palette.indigo, palette.violet, palette.sapphire, palette.cyan], 0.34, nebulaGroup, "nebula");
      nebula.scale.set(1.18, 0.72, 1);
      nebula.position.z = -1.4;

      const goldDust = createPointCloud(dustCount, 4.2, 3.6, isCoarse ? 0.032 : 0.024,
        [palette.gold, palette.goldSoft, palette.silver], 0.48, dustGroup, "dust");
      goldDust.position.z = 1.05;

      const corePulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xfff6df, transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending })
      );
      corePulse.position.z = 0.18;
      gateway.add(corePulse);

      gateway.rotation.x = 0.35;
      gateway.rotation.y = -0.6;
      gateway.position.y = -0.06;

      let width = 1, height = 1;
      const state = {
        targetX: 0, targetY: 0,
        yaw: 0, targetYaw: 0,
        pitch: 0, targetPitch: 0,
        dragging: false, lastX: 0, lastY: 0,
        hover: false, auto: !prefersReducedMotion,
      };

      function resize() {
        const rect = wrap.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        camera.aspect = width / height;
        const baseZ = 7.5;
        camera.position.z = width < height ? baseZ * (height / width) * 0.9 : baseZ;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);



      // Pointer parallax on wrap
      function onPointerMove(e: PointerEvent) {
        if (e.pointerType === "touch") return;
        const rect = wrap.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        wrap.style.setProperty("--mx", String(nx));
        wrap.style.setProperty("--my", String(ny));
        if (!state.dragging) {
          state.targetX = nx * 0.24;
          state.targetY = ny * -0.18;
        }
        state.hover = true;
      }
      function onPointerLeave() {
        state.targetX = 0; state.targetY = 0; state.hover = false;
        wrap.style.setProperty("--mx", "0");
        wrap.style.setProperty("--my", "0");
      }
      function onPointerDown(e: PointerEvent) {
        if (e.button !== 0) return;
        state.dragging = true; state.auto = false;
        state.lastX = e.clientX; state.lastY = e.clientY;
        state.targetYaw = state.yaw; state.targetPitch = state.pitch;
      }
      function onPointerMoveDoc(e: PointerEvent) {
        if (!state.dragging) return;
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        state.lastX = e.clientX; state.lastY = e.clientY;
        state.targetYaw += dx * 0.008;
        state.targetPitch = Math.max(-0.5, Math.min(0.5, state.targetPitch + dy * 0.005));
      }
      function onPointerUp() {
        if (!state.dragging) return;
        state.dragging = false; state.auto = !prefersReducedMotion;
      }

      wrap.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerLeave);
      wrap.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("pointermove", onPointerMoveDoc, { passive: true });
      document.addEventListener("pointerup", onPointerUp);

      let clock = 0;
      let rafId = 0;
      let hasRendered = false;
      const dt = 1 / 60;

      function animate() {
        rafId = requestAnimationFrame(animate);
        clock += dt;

        if (state.auto && !prefersReducedMotion) {
          state.targetYaw += 0.0022;
        }
        state.yaw += (state.targetYaw - state.yaw) * 0.04;
        state.pitch += (state.targetPitch - state.pitch) * 0.06;
        state.targetX += (0 - state.targetX) * 0.02;
        state.targetY += (0 - state.targetY) * 0.02;

        gateway.rotation.y = -0.6 + state.yaw;
        gateway.rotation.x = 0.35 + state.pitch;

        ringGroups.forEach(({ group, speed }) => {
          group.rotation.z += speed * dt;
        });

        energyWaves.forEach((wave, i) => {
          wave.material.opacity = 0.12 + Math.sin(clock * 1.4 + i) * 0.06;
        });
        const pscale = 0.88 + Math.sin(clock * 2.2) * 0.14;
        corePulse.scale.setScalar(pscale);
        corePulse.material.opacity = 0.6 + Math.sin(clock * 2.2) * 0.22;

        starGroup.rotation.y = clock * 0.006;
        nebulaGroup.rotation.z = clock * 0.004;
        dustGroup.rotation.z = -clock * 0.005;

        camera.position.x += (state.targetX * 0.6 - camera.position.x) * 0.04;
        camera.position.y += (0.16 + state.targetY * 0.4 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        
        if (!hasRendered) {
          hasRendered = true;
          wrap.classList.add("akg-webgl-ready");
        }
      }

      animate();

      const cleanup = () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerleave", onPointerLeave);
        wrap.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("pointermove", onPointerMoveDoc);
        document.removeEventListener("pointerup", onPointerUp);
        renderer.dispose();
      };
      cleanupRef.current = cleanup;
    }

    tryInit();

    return () => {
      cleanupRef.current?.();
    };
  }, [canvasRef, wrapRef]);

  return null; // renders nothing — side-effect only
}
