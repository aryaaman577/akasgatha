"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RenderManager } from "@/core/RenderManager";

type AnimatedUniforms = {
  uTime?: { value: number };
  uPulse?: { value: number };
};

const diskVertexShader = /* glsl */ `
  uniform float uTime;
  varying float vRadius;
  varying float vAngle;
  varying float vWave;

  void main() {
    vec3 p = position;
    float radius = length(p.xy);
    float angle = atan(p.y, p.x);
    float turbulence =
      sin(angle * 13.0 - uTime * 0.72 + radius * 4.8) * 0.055 +
      sin(angle * 31.0 + uTime * 0.43 - radius * 7.4) * 0.026 +
      sin(angle * 7.0 - uTime * 0.18) * 0.035;
    p.z += turbulence * smoothstep(2.45, 4.9, radius);
    vRadius = radius;
    vAngle = angle;
    vWave = turbulence;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const diskFragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  varying float vRadius;
  varying float vAngle;
  varying float vWave;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += valueNoise(p) * amplitude;
      p = p * 2.03 + vec2(17.1, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    float innerMask = smoothstep(2.82, 3.04, vRadius);
    float outerMask = 1.0 - smoothstep(4.95, 5.82, vRadius);
    vec2 circular = vec2(cos(vAngle), sin(vAngle));
    float cloud = fbm(circular * (4.0 + vRadius * 0.28) + vec2(vRadius * 1.42, -uTime * 0.11));
    float microCloud = fbm(circular * 10.5 + vec2(vRadius * 4.2 - uTime * 0.36, uTime * 0.18));
    float radialBands = 0.5 + 0.5 * sin(vRadius * 27.0 - uTime * 0.4 + uPhase + cloud * 4.0);
    float longFlow = 0.5 + 0.5 * sin(vAngle * 21.0 - uTime * 1.14 + vRadius * 9.4 + cloud * 5.2 + uPhase);
    float fineFlow = 0.5 + 0.5 * sin(vAngle * 61.0 - uTime * 1.95 - vRadius * 14.0 + microCloud * 3.4);
    float brokenFilaments = pow(max(0.0, longFlow * 0.68 + fineFlow * 0.44 + cloud * 0.28 - 0.46), 2.05);
    float hotInner = exp(-abs(vRadius - 3.08) * 2.7);
    float hotKnots = pow(max(0.0, microCloud * longFlow - 0.28), 2.25);
    float brightness = clamp(hotInner * 0.78 + brokenFilaments * 1.08 + hotKnots * 0.7 + radialBands * 0.16 + abs(vWave) * 2.1, 0.0, 1.55);

    vec3 deepBlue = vec3(0.008, 0.055, 0.38);
    vec3 electricBlue = vec3(0.015, 0.28, 1.15);
    vec3 cyan = vec3(0.12, 0.92, 1.45);
    vec3 coldWhite = vec3(0.86, 1.18, 1.34);
    vec3 color = mix(deepBlue, electricBlue, smoothstep(0.12, 0.52, brightness));
    color = mix(color, cyan, smoothstep(0.48, 0.92, brightness));
    color = mix(color, coldWhite, smoothstep(0.92, 1.3, brightness));

    float raggedOuter = 1.0 - smoothstep(5.2 + (cloud - 0.5) * 0.72, 5.95, vRadius);
    float alpha = innerMask * outerMask * raggedOuter * uOpacity * (0.075 + brightness * 0.82);
    gl_FragColor = vec4(color, alpha);
  }
`;

const pointVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aHeat;
  varying float vHeat;

  void main() {
    vec3 p = position;
    float angle = uTime * aSpeed;
    float c = cos(angle);
    float s = sin(angle);
    p.xy = mat2(c, -s, s, c) * p.xy;
    p.z += sin(uTime * 0.52 + aSpeed * 140.0 + length(p.xy) * 3.0) * 0.045;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = min(8.0, aSize * uPixelRatio * (31.0 / max(2.0, -mvPosition.z)));
    gl_Position = projectionMatrix * mvPosition;
    vHeat = aHeat;
  }
`;

const pointFragmentShader = /* glsl */ `
  precision mediump float;
  varying float vHeat;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    float alpha = smoothstep(0.5, 0.06, d);
    float hotCore = smoothstep(0.25, 0.0, d);
    vec3 color = mix(vec3(0.015, 0.24, 1.0), vec3(0.68, 1.12, 1.32), vHeat * 0.78 + hotCore * 0.5);
    gl_FragColor = vec4(color, alpha * (0.34 + vHeat * 0.66));
  }
`;

const coreVertexShader = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const coreFragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uPulse;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;

  void main() {
    float rim = 1.0 - abs(dot(normalize(vNormalView), normalize(vViewPosition)));
    float navyEdge = pow(rim, 3.5);
    float thinEdge = pow(rim, 13.0);
    float lowerEdge = smoothstep(-0.55, 0.72, -vNormalView.y);
    float rightEdge = smoothstep(-0.72, 0.82, vNormalView.x);
    vec3 abyss = vec3(0.0002, 0.0005, 0.0035);
    vec3 navy = vec3(0.006, 0.028, 0.145) * navyEdge * (0.78 + uPulse * 0.09);
    vec3 lens = vec3(0.0, 0.34, 0.72) * thinEdge * (0.08 + lowerEdge * 0.29 + rightEdge * 0.12);
    gl_FragColor = vec4(abyss + navy + lens, 1.0);
  }
`;

const starVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.035 + aPhase) * 0.018;
    vec2 delta = p.xy - uMouse;
    float distanceToMouse = max(length(delta), 0.08);
    float field = exp(-distanceToMouse * 0.72) * uMouseStrength;
    vec2 radial = delta / distanceToMouse;
    vec2 swirl = vec2(-radial.y, radial.x);
    p.xy += radial * field * 0.13 + swirl * field * 0.055 * sin(uTime * 0.8 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = min(4.0, aSize * uPixelRatio * (19.0 / max(3.0, -mvPosition.z)));
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.32 + 0.36 * (0.5 + 0.5 * sin(uTime * 0.42 + aPhase));
  }
`;

const starFragmentShader = /* glsl */ `
  precision mediump float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.08, d) * vAlpha;
    gl_FragColor = vec4(0.56, 0.78, 1.0, alpha);
  }
`;

const trailVertexShader = /* glsl */ `
  uniform float uPixelRatio;
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = min(10.0, (2.0 + aAlpha * 5.5) * uPixelRatio * (16.0 / max(3.0, -mvPosition.z)));
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = aAlpha;
  }
`;

const trailFragmentShader = /* glsl */ `
  precision mediump float;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.03, d) * vAlpha;
    vec3 color = mix(vec3(0.02, 0.22, 0.82), vec3(0.48, 0.94, 1.0), vAlpha);
    gl_FragColor = vec4(color, alpha * 0.42);
  }
`;

const shootingStarVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shootingStarFragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float tail = smoothstep(0.0, 0.16, vUv.x) * (1.0 - smoothstep(0.62, 1.0, vUv.x));
    float centre = pow(max(0.0, sin(3.14159265 * vUv.y)), 2.5);
    float head = smoothstep(0.52, 0.92, vUv.x);
    vec3 color = mix(vec3(0.02, 0.26, 1.0), vec3(0.84, 1.0, 1.0), head);
    gl_FragColor = vec4(color, tail * centre * uOpacity);
  }
`;

export default function BlackHoleScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<HTMLDivElement>(null);
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isMounted) return;

    const host = hostRef.current;
    const interaction = interactionRef.current;
    if (!host || !interaction) return;

    // Detect browser & hardware capabilities safely inside useEffect
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 640 || /iPhone|iPad|iPod|Android/i.test(userAgent));

    // Create mounted canvas element directly inside host
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    // Capability Detection: WebGL2 vs WebGL1 vs Failover
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      failIfMajorPerformanceCaveat: false,
    };

    try {
      gl = canvas.getContext("webgl2", contextAttributes) as WebGL2RenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      try {
        gl = (canvas.getContext("webgl", contextAttributes) ||
          canvas.getContext("experimental-webgl", contextAttributes)) as WebGLRenderingContext | null;
      } catch {
        gl = null;
      }
    }

    if (!gl) {
      host.classList.add("webgl-unavailable");
      return () => {
        if (canvas.parentElement === host) host.removeChild(canvas);
        host.classList.remove("webgl-unavailable");
      };
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isSafari ? "default" : "high-performance",
      });
    } catch {
      host.classList.add("webgl-unavailable");
      return () => {
        if (canvas.parentElement === host) host.removeChild(canvas);
        host.classList.remove("webgl-unavailable");
      };
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.set(0, 0, 16);

    const model = new THREE.Group();
    scene.add(model);

    const animatedMaterials: THREE.ShaderMaterial[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    
    const trackMaterial = <T extends THREE.Material>(material: T) => {
      materials.push(material);
      if (material instanceof THREE.ShaderMaterial) animatedMaterials.push(material);
      return material;
    };
    
    const trackGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
      geometries.push(geometry);
      return geometry;
    };

    // Adaptive Quality Tiers
    const qualityTier = isMobile ? "reduced" : isSafari ? "balanced" : "high";
    const starCount = qualityTier === "reduced" ? 500 : qualityTier === "balanced" ? 1000 : 1550;
    const dustCount = qualityTier === "reduced" ? 600 : qualityTier === "balanced" ? 1500 : 2600;
    const particleCount = qualityTier === "reduced" ? 1800 : qualityTier === "balanced" ? 3600 : 6800;

    // Deep-space stars
    const starPositions: number[] = [];
    const starSizes: number[] = [];
    const starPhases: number[] = [];
    for (let i = 0; i < starCount; i += 1) {
      const biased = Math.random();
      const x = biased < 0.32 ? -11 + Math.random() * 8 : -3 + Math.random() * 17;
      if (x < -2.2 && Math.random() > 0.42) continue;
      starPositions.push(x, -6.4 + Math.random() * 12.8, -3.2 - Math.random() * 5.8);
      starSizes.push(0.5 + Math.random() * (Math.random() > 0.94 ? 2.2 : 1.05));
      starPhases.push(Math.random() * Math.PI * 2);
    }
    const starGeometry = trackGeometry(new THREE.BufferGeometry());
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(starSizes, 1));
    starGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(starPhases, 1));
    const starMaterial = trackMaterial(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uMouse: { value: new THREE.Vector2(100, 100) },
          uMouseStrength: { value: 0 },
        },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Stardust
    const dustPositions: number[] = [];
    const dustSizes: number[] = [];
    const dustPhases: number[] = [];
    for (let i = 0; i < dustCount; i += 1) {
      const x = -2.5 + Math.pow(Math.random(), 0.72) * 16.5;
      if (x < 0 && Math.random() > 0.26) continue;
      dustPositions.push(x, -6.8 + Math.random() * 13.6, -1.5 - Math.random() * 8.5);
      dustSizes.push(0.22 + Math.random() * 0.58);
      dustPhases.push(Math.random() * Math.PI * 2);
    }
    const dustGeometry = trackGeometry(new THREE.BufferGeometry());
    dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(dustSizes, 1));
    dustGeometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(dustPhases, 1));
    const stardust = new THREE.Points(dustGeometry, starMaterial);
    stardust.rotation.z = -0.035;
    scene.add(stardust);

    // Pointer trail
    const trailLength = isMobile ? 24 : 48;
    const trailPositions = new Float32Array(trailLength * 3);
    const trailAlpha = new Float32Array(trailLength);
    trailPositions.fill(100);
    for (let i = 0; i < trailLength; i += 1) trailAlpha[i] = Math.pow(1 - i / trailLength, 1.7);
    const trailGeometry = trackGeometry(new THREE.BufferGeometry());
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1));
    const trailMaterial = trackMaterial(
      new THREE.ShaderMaterial({
        uniforms: { uPixelRatio: { value: 1 } },
        vertexShader: trailVertexShader,
        fragmentShader: trailFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const pointerTrail = new THREE.Points(trailGeometry, trailMaterial);
    pointerTrail.renderOrder = 10;
    scene.add(pointerTrail);

    // Shooting stars
    const shootingGeometry = trackGeometry(new THREE.PlaneGeometry(1, 1, 1, 1));
    const shootingStars: Array<{
      mesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      speed: number;
      drift: number;
      delay: number;
      initialized: boolean;
    }> = [];
    const shootingCount = isMobile ? 2 : 4;
    for (let i = 0; i < shootingCount; i += 1) {
      const material = trackMaterial(
        new THREE.ShaderMaterial({
          uniforms: { uOpacity: { value: 0 } },
          vertexShader: shootingStarVertexShader,
          fragmentShader: shootingStarFragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
      const mesh = new THREE.Mesh(shootingGeometry, material);
      mesh.visible = false;
      mesh.renderOrder = -1;
      scene.add(mesh);
      shootingStars.push({
        mesh,
        material,
        speed: 2.2,
        drift: 0.28,
        delay: 3.5 + i * 3.7 + Math.random() * 4,
        initialized: false,
      });
    }

    // Black Hole Core
    const coreGeometry = trackGeometry(new THREE.SphereGeometry(3.02, isMobile ? 64 : 112, isMobile ? 48 : 80));
    const coreMaterial = trackMaterial(
      new THREE.ShaderMaterial({
        uniforms: { uPulse: { value: 0 } },
        vertexShader: coreVertexShader,
        fragmentShader: coreFragmentShader,
        depthWrite: true,
        transparent: false,
      }),
    );
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.renderOrder = 6;
    model.add(core);

    // Plasma Accretion Disk
    const diskGroup = new THREE.Group();
    diskGroup.rotation.set(-1.215, 0.015, 0.145);
    diskGroup.scale.x = 1.68;
    model.add(diskGroup);

    const diskLayers = [
      { inner: 2.84, outer: 5.92, opacity: 0.5, phase: 0.0, z: -0.16 },
      { inner: 2.9, outer: 5.62, opacity: 0.48, phase: 1.28, z: -0.07 },
      { inner: 2.96, outer: 5.34, opacity: 0.44, phase: 2.57, z: 0.02 },
      { inner: 3.02, outer: 5.02, opacity: 0.38, phase: 3.88, z: 0.11 },
      { inner: 3.08, outer: 4.62, opacity: 0.3, phase: 5.12, z: 0.2 },
    ];
    diskLayers.forEach((layer, index) => {
      const geometry = trackGeometry(new THREE.RingGeometry(layer.inner, layer.outer, isMobile ? 192 : 384, 16));
      const material = trackMaterial(
        new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: layer.opacity },
            uPhase: { value: layer.phase },
          },
          vertexShader: diskVertexShader,
          fragmentShader: diskFragmentShader,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = layer.z;
      mesh.renderOrder = 2 + index;
      diskGroup.add(mesh);
    });

    // Layered Torus Strands
    const torusLayers = [
      { radius: 3.08, tube: 0.42, color: 0x003dff, opacity: 0.075 },
      { radius: 3.12, tube: 0.11, color: 0x008cff, opacity: 0.16 },
      { radius: 3.16, tube: 0.105, color: 0x74e8ff, opacity: 0.44 },
      { radius: 3.18, tube: 0.036, color: 0xe2ffff, opacity: 0.86 },
      { radius: 3.55, tube: 0.035, color: 0x00a7ff, opacity: 0.26 },
      { radius: 4.05, tube: 0.024, color: 0x075cff, opacity: 0.22 },
      { radius: 4.72, tube: 0.018, color: 0x003cff, opacity: 0.16 },
    ];
    torusLayers.forEach((layer) => {
      const geometry = trackGeometry(new THREE.TorusGeometry(layer.radius, layer.tube, 12, isMobile ? 160 : 320));
      const material = trackMaterial(
        new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 5;
      diskGroup.add(mesh);
    });

    // Disk Embers / Particles
    const particlePositions: number[] = [];
    const particleSpeeds: number[] = [];
    const particleSizes: number[] = [];
    const particleHeat: number[] = [];
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.98 + Math.pow(Math.random(), 1.4) * 3.05;
      particlePositions.push(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        (Math.random() - 0.5) * (0.09 + (r - 2.94) * 0.145),
      );
      particleSpeeds.push((0.018 + Math.random() * 0.035) * (Math.random() > 0.12 ? 1 : -0.35));
      particleSizes.push(0.7 + Math.random() * (Math.random() > 0.93 ? 3.9 : 2.0));
      particleHeat.push(Math.pow(1 - (r - 2.94) / 3.28, 1.2) * 0.74 + Math.random() * 0.26);
    }
    const particleGeometry = trackGeometry(new THREE.BufferGeometry());
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("aSpeed", new THREE.Float32BufferAttribute(particleSpeeds, 1));
    particleGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute("aHeat", new THREE.Float32BufferAttribute(particleHeat, 1));
    const particleMaterial = trackMaterial(
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
        vertexShader: pointVertexShader,
        fragmentShader: pointFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const diskParticles = new THREE.Points(particleGeometry, particleMaterial);
    diskParticles.renderOrder = 4;
    diskGroup.add(diskParticles);

    // Photon Crescents
    const lensArcGroup = new THREE.Group();
    model.add(lensArcGroup);
    const lensArcs = [
      { radius: 3.1, tube: 0.26, arc: Math.PI * 1.06, zRot: Math.PI * 0.95, color: 0x004dff, opacity: 0.09 },
      { radius: 3.12, tube: 0.11, arc: Math.PI * 1.02, zRot: Math.PI * 0.98, color: 0x24cfff, opacity: 0.32 },
      { radius: 3.14, tube: 0.034, arc: Math.PI * 0.98, zRot: Math.PI, color: 0xeaffff, opacity: 0.82 },
      { radius: 3.08, tube: 0.018, arc: Math.PI * 1.28, zRot: -0.12, color: 0x00c8ff, opacity: 0.3 },
    ];
    lensArcs.forEach((arc, index) => {
      const geometry = trackGeometry(new THREE.TorusGeometry(arc.radius, arc.tube, 12, isMobile ? 120 : 210, arc.arc));
      const material = trackMaterial(
        new THREE.MeshBasicMaterial({
          color: arc.color,
          transparent: true,
          opacity: arc.opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = arc.zRot;
      mesh.position.z = index < 3 ? 0.16 + index * 0.025 : -0.12;
      mesh.renderOrder = index < 3 ? 8 : 1;
      lensArcGroup.add(mesh);
    });

    // Outer Halo
    const haloGeometry = trackGeometry(new THREE.SphereGeometry(3.34, 48, 36));
    const haloMaterial = trackMaterial(
      new THREE.MeshBasicMaterial({
        color: 0x003dff,
        transparent: true,
        opacity: 0.055,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.renderOrder = 0;
    model.add(halo);

    // Canvas Sizing and Container Bounds (Zero-Size Prevention)
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let visibleWorldWidth = 1;
    let visibleWorldHeight = 1;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width || host.clientWidth || window.innerWidth * 0.45));
      height = Math.max(300, Math.floor(rect.height || host.clientHeight || 500));
      
      const isMobileWidth = width < 640;
      const isTabletWidth = width >= 640 && width < 1050;
      
      pixelRatio = Math.min(window.devicePixelRatio || 1, isMobileWidth ? 1.0 : isSafari ? 1.25 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const worldHeight = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
      const worldWidth = worldHeight * camera.aspect;
      visibleWorldHeight = worldHeight;
      visibleWorldWidth = worldWidth;
      
      const mobileScale = THREE.MathUtils.clamp(width / 585, 0.54, 0.68);
      const scale = isMobileWidth ? mobileScale : isTabletWidth ? 0.76 : 1;
      model.scale.setScalar(scale);
      model.position.x = worldWidth * (isMobileWidth ? 0.27 : isTabletWidth ? 0.305 : 0.345);
      model.position.y = isMobileWidth ? (height < 660 ? -2.88 : -2.62) : isTabletWidth ? -1.08 : -0.34;

      starMaterial.uniforms.uPixelRatio.value = pixelRatio;
      particleMaterial.uniforms.uPixelRatio.value = pixelRatio;
      trailMaterial.uniforms.uPixelRatio.value = pixelRatio;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = 0;
    let targetY = 0;
    let dragX = 0;
    let dragY = 0;
    let pointerDown = false;
    let previousX = 0;
    let previousY = 0;
    let hasPointer = false;
    let mouseStrength = 0;

    const onWindowPointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      targetX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      if (!hasPointer) {
        const worldX = targetX * visibleWorldWidth * 0.5;
        const worldY = -targetY * visibleWorldHeight * 0.5;
        for (let i = 0; i < trailLength; i += 1) {
          trailPositions[i * 3] = worldX;
          trailPositions[i * 3 + 1] = worldY;
          trailPositions[i * 3 + 2] = 0.8;
        }
        trailGeometry.attributes.position.needsUpdate = true;
        hasPointer = true;
      }
      if (pointerDown) {
        dragY = THREE.MathUtils.clamp(dragY + (event.clientX - previousX) * 0.0017, -0.13, 0.13);
        dragX = THREE.MathUtils.clamp(dragX + (event.clientY - previousY) * 0.0011, -0.075, 0.075);
        previousX = event.clientX;
        previousY = event.clientY;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      pointerDown = true;
      previousX = event.clientX;
      previousY = event.clientY;
      interaction.setPointerCapture(event.pointerId);
      interaction.classList.add("is-dragging");
    };

    const onPointerUp = (event: PointerEvent) => {
      pointerDown = false;
      if (interaction.hasPointerCapture(event.pointerId)) interaction.releasePointerCapture(event.pointerId);
      interaction.classList.remove("is-dragging");
    };

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    interaction.addEventListener("pointerdown", onPointerDown);
    interaction.addEventListener("pointerup", onPointerUp);
    interaction.addEventListener("pointercancel", onPointerUp);

    // WebGL Context Loss & Tab Visibility Recovery
    let isContextLost = false;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      isContextLost = true;
    };

    const handleContextRestored = () => {
      isContextLost = false;
      resize();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    let tabVisible = !document.hidden;
    const onVisibilityChange = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const clock = new THREE.Clock();
    let elapsed = 0;

    const resetShootingStar = (star: (typeof shootingStars)[number]) => {
      star.mesh.visible = false;
      star.material.uniforms.uOpacity.value = 0;
      star.speed = 2.1 + Math.random() * 1.55;
      star.drift = 0.18 + Math.random() * 0.23;
      star.delay = 6 + Math.random() * 13;
      star.initialized = false;
    };

    RenderManager.register(
      "black-hole",
      canvas,
      renderer,
      (delta: number) => {
        if (!tabVisible || isContextLost) {
          clock.getDelta();
          return;
        }

        delta = Math.min(delta, 0.05);
        const speed = reducedMotion.matches ? 0.13 : 1;
        elapsed += delta * speed;
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 0.72);

        animatedMaterials.forEach((material) => {
          const uniforms = material.uniforms as AnimatedUniforms;
          if (uniforms.uTime) uniforms.uTime.value = elapsed;
          if (uniforms.uPulse) uniforms.uPulse.value = pulse;
        });
        coreMaterial.uniforms.uPulse.value = pulse;

        const parallaxFactor = reducedMotion.matches ? 0 : 1;
        model.rotation.y += (targetX * 0.025 * parallaxFactor + dragY - model.rotation.y) * 0.035;
        model.rotation.x += (-targetY * 0.014 * parallaxFactor + dragX - model.rotation.x) * 0.035;
        diskGroup.position.z = Math.sin(elapsed * 0.31) * 0.018;
        stars.rotation.y = Math.sin(elapsed * 0.025) * 0.004;
        stardust.rotation.y = Math.sin(elapsed * 0.018) * 0.006;
        haloMaterial.opacity = 0.046 + pulse * 0.019;

        const pointerWorldX = targetX * visibleWorldWidth * 0.5;
        const pointerWorldY = -targetY * visibleWorldHeight * 0.5;
        mouseStrength += ((hasPointer && !reducedMotion.matches ? 1 : 0) - mouseStrength) * 0.055;
        starMaterial.uniforms.uMouse.value.set(pointerWorldX, pointerWorldY);
        starMaterial.uniforms.uMouseStrength.value = mouseStrength;

        if (hasPointer && !reducedMotion.matches) {
          for (let i = trailLength - 1; i > 0; i -= 1) {
            const current = i * 3;
            const previous = (i - 1) * 3;
            trailPositions[current] += (trailPositions[previous] - trailPositions[current]) * 0.34;
            trailPositions[current + 1] += (trailPositions[previous + 1] - trailPositions[current + 1]) * 0.34;
            trailPositions[current + 2] = 0.8;
          }
          trailPositions[0] += (pointerWorldX - trailPositions[0]) * 0.46;
          trailPositions[1] += (pointerWorldY - trailPositions[1]) * 0.46;
          trailPositions[2] = 0.8;
          trailGeometry.attributes.position.needsUpdate = true;
        }

        shootingStars.forEach((star) => {
          if (reducedMotion.matches) {
            star.mesh.visible = false;
            return;
          }
          if (star.delay > 0) {
            star.delay -= delta;
            return;
          }
          if (!star.initialized) {
            star.mesh.position.set(
              visibleWorldWidth * 0.5 + 1.2 + Math.random() * 2.5,
              -0.4 + Math.random() * visibleWorldHeight * 0.82,
              -1.2 - Math.random() * 2.2,
            );
            star.mesh.scale.set(1.5 + Math.random() * 1.5, 0.035 + Math.random() * 0.025, 1);
            star.mesh.rotation.z = Math.PI + Math.atan(star.drift);
            star.material.uniforms.uOpacity.value = 0.34 + Math.random() * 0.34;
            star.mesh.visible = true;
            star.initialized = true;
          }
          star.mesh.position.x -= star.speed * delta;
          star.mesh.position.y -= star.speed * star.drift * delta;
          if (star.mesh.position.x < -0.25 || star.mesh.position.y < -visibleWorldHeight * 0.58) {
            resetShootingStar(star);
          }
        });

        camera.position.x += (targetX * 0.08 * parallaxFactor - camera.position.x) * 0.025;
        camera.position.y += (-targetY * 0.045 * parallaxFactor - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      },
      scene,
      camera
    );

    return () => {
      RenderManager.unregister("black-hole");
      resizeObserver.disconnect();

      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onWindowPointerMove);
      interaction.removeEventListener("pointerdown", onPointerDown);
      interaction.removeEventListener("pointerup", onPointerUp);
      interaction.removeEventListener("pointercancel", onPointerUp);

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentElement === host) host.removeChild(canvas);
    };
  }, [isMounted]);

  return (
    <div className="black-hole-scene" aria-hidden="true">
      <div ref={hostRef} className="black-hole-canvas" />
      <div ref={interactionRef} className="black-hole-interaction" />
    </div>
  );
}
