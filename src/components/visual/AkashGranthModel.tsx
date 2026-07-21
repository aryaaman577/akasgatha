"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

/**
 * AkashGranthModel — Premium Live 3D Cosmic Archive
 * 
 * A genuine WebGL Three.js scene representing an ancient celestial knowledge sphere.
 * Features:
 * - Real 3D geometry (no images/videos)
 * - Stable front-facing orientation (no 360° rotation)
 * - Continuously animated internal elements
 * - Layered atmospheric depth
 * - Cinematic lighting
 * - Restrained pointer interaction
 */

type AkashGranthModelProps = {
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
};

export function AkashGranthModel({
  className = "",
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel = "Akash Granth Cosmic Archive",
}: AkashGranthModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mainSphere: THREE.Mesh;
    innerCore: THREE.Mesh;
    atmosphere: THREE.Mesh;
    cloudLayer: THREE.Mesh;
    particles: THREE.Points;
    orbitRing1: THREE.Mesh;
    orbitRing2: THREE.Mesh;
    markers: THREE.Group;
    time: number;
    targetRotX: number;
    targetRotY: number;
    currRotX: number;
    currRotY: number;
  } | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Pointer interaction with clamping
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!sceneRef.current || reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Clamp to ±4° horizontal, ±2° vertical
    sceneRef.current.targetRotY = nx * (4 * Math.PI / 180);
    sceneRef.current.targetRotX = -ny * (2 * Math.PI / 180);
  }, [reducedMotion]);

  const onPointerLeave = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.targetRotX = 0;
    sceneRef.current.targetRotY = 0;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // === MAIN CELESTIAL SPHERE ===
    const mainGeo = new THREE.IcosahedronGeometry(1, 4);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x1a2356,
      roughness: 0.7,
      metalness: 0.1,
      emissive: 0x0a0f1c,
      emissiveIntensity: 0.2,
    });
    const mainSphere = new THREE.Mesh(mainGeo, mainMat);
    scene.add(mainSphere);

    // === INNER CORE GLOW ===
    const coreGeo = new THREE.IcosahedronGeometry(0.75, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xbda56a,
      transparent: true,
      opacity: 0.15,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(innerCore);

    // === ATMOSPHERE SHELL ===
    const atmoGeo = new THREE.IcosahedronGeometry(1.08, 3);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x557cd6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphere);

    // === ROTATING CLOUD LAYER ===
    const cloudGeo = new THREE.IcosahedronGeometry(1.03, 3);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0x5fa6b8,
      transparent: true,
      opacity: 0.12,
      wireframe: false,
    });
    const cloudLayer = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(cloudLayer);

    // === ORBITAL RINGS ===
    const ringGeo1 = new THREE.TorusGeometry(1.5, 0.01, 8, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xbda56a,
      transparent: true,
      opacity: 0.3,
    });
    const orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    orbitRing1.rotation.x = Math.PI / 2.6;
    scene.add(orbitRing1);

    const ringGeo2 = new THREE.TorusGeometry(1.8, 0.008, 6, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x557cd6,
      transparent: true,
      opacity: 0.2,
    });
    const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitRing2.rotation.x = Math.PI / 3.2;
    scene.add(orbitRing2);

    // === KNOWLEDGE MARKERS (small spheres on orbit) ===
    const markers = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const markerGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf1f0e8 : 0x5fa6b8,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      const angle = (i / 4) * Math.PI * 2;
      marker.position.set(
        Math.cos(angle) * 1.5,
        Math.sin(angle) * 0.3,
        Math.sin(angle) * 1.5
      );
      markers.add(marker);
    }
    scene.add(markers);

    // === PARTICLE FIELD (cosmic dust) ===
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2 + Math.random() * 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 2 + 1;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd8dce9,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // === LIGHTING ===
    const keyLight = new THREE.DirectionalLight(0xf1f0e8, 1.2);
    keyLight.position.set(3, 2, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x557cd6, 0.3);
    fillLight.position.set(-2, -1, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xbda56a, 0.5);
    rimLight.position.set(-3, 1, -2);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x070912, 0.4);
    scene.add(ambient);

    // Store scene ref
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mainSphere,
      innerCore,
      atmosphere,
      cloudLayer,
      particles,
      orbitRing1,
      orbitRing2,
      markers,
      time: 0,
      targetRotX: 0,
      targetRotY: 0,
      currRotX: 0,
      currRotY: 0,
    };

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop
    let rafId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);
      if (!sceneRef.current) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = sceneRef.current;
      s.time += dt;

      if (!reducedMotion) {
        // Continuously animate internal elements (NOT the main model)
        
        // Cloud layer rotates continuously
        s.cloudLayer.rotation.y += 0.08 * dt;
        
        // Inner core pulses
        const coreScale = 1 + Math.sin(s.time * 0.5) * 0.05;
        s.innerCore.scale.set(coreScale, coreScale, coreScale);
        
        // Orbit rings rotate
        s.orbitRing1.rotation.z += 0.15 * dt;
        s.orbitRing2.rotation.z -= 0.1 * dt;
        
        // Markers orbit
        s.markers.rotation.y += 0.2 * dt;
        
        // Particles drift slowly
        s.particles.rotation.y += 0.03 * dt;
        s.particles.rotation.x += 0.01 * dt;
        
        // Atmosphere breathes
        const atmoScale = 1 + Math.sin(s.time * 0.8) * 0.02;
        s.atmosphere.scale.set(atmoScale, atmoScale, atmoScale);
        
        // Main model: ONLY subtle breathing (NO 360° rotation)
        const breathX = Math.sin(s.time * 0.4) * 0.01;
        const breathY = Math.cos(s.time * 0.3) * 0.01;
        
        // Damped pointer interaction
        s.currRotX += (s.targetRotX - s.currRotX) * 0.08;
        s.currRotY += (s.targetRotY - s.currRotY) * 0.08;
        
        // Apply only breathing + pointer (NO continuous rotation)
        s.mainSphere.rotation.x = breathX + s.currRotX;
        s.mainSphere.rotation.y = breathY + s.currRotY;
      }

      s.renderer.render(s.scene, s.camera);
    };

    rafId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      sceneRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ariaHidden ? "presentation" : "img"}
      style={{
        touchAction: "pan-y",
        cursor: "default",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
