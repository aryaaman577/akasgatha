"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/**
 * Eclipse Drishya Yantra — Live 3D Educational Eclipse Scene
 * 
 * Shows solar eclipse, lunar eclipse, and alignment overview
 * with scientifically accurate umbra and penumbra visualization
 */

type EclipseMode = "solar" | "lunar" | "overview";

type EclipseDrishyaYantraProps = {
  mode?: EclipseMode;
  className?: string;
};

// Sun component with emissive material
function Sun() {
  return (
    <mesh position={[-8, 0, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial
        color="#FFA030"
        emissive="#FF8020"
        emissiveIntensity={0.8}
        roughness={0.9}
      />
      {/* Sun glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFA030"
          transparent
          opacity={0.2}
        />
      </mesh>
    </mesh>
  );
}

// Earth component with atmosphere
function Earth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#1E5A8E"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh scale={1.1}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#5FA6B8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Moon component
function Moon({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.27, 32, 32]} />
      <meshStandardMaterial
        color="#D8DCE9"
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  );
}

// Orbit path visualization
function OrbitPath({ radius, segments = 128 }: { radius: number; segments?: number }) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#BDA56A", transparent: true, opacity: 0.3 }))} />
  );
}

// Umbra and Penumbra visualization
function ShadowCones({ mode }: { mode: EclipseMode }) {
  if (mode === "overview") return null;

  const umbraColor = mode === "solar" ? "#1a1a2e" : "#0a0a15";
  const penumbraColor = mode === "solar" ? "#2a2a3e" : "#1a1a25";

  return (
    <group>
      {/* Umbra (darker shadow) */}
      <mesh position={mode === "solar" ? [2, 0, 0] : [-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.25, 4, 32, 1, true]} />
        <meshBasicMaterial
          color={umbraColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Penumbra (lighter shadow) */}
      <mesh position={mode === "solar" ? [2, 0, 0] : [-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.5, 5, 32, 1, true]} />
        <meshBasicMaterial
          color={penumbraColor}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Animated scene content
function AnimatedEclipseScene({ mode }: { mode: EclipseMode }) {
  const moonRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    setTime((t) => t + delta * 0.3);

    if (mode === "overview" && moonRef.current) {
      // Moon orbits Earth slowly
      const moonOrbitRadius = 1.5;
      const moonAngle = time * 0.5;
      moonRef.current.position.x = Math.cos(moonAngle) * moonOrbitRadius;
      moonRef.current.position.z = Math.sin(moonAngle) * moonOrbitRadius;
    }

    if (earthRef.current && mode === "overview") {
      // Earth rotates slowly
      earthRef.current.rotation.y = time * 0.2;
    }
  });

  // Position calculations based on mode
  let sunPos: [number, number, number] = [-8, 0, 0];
  let earthPos: [number, number, number] = [0, 0, 0];
  let moonPos: [number, number, number] = [2, 0, 0];

  if (mode === "solar") {
    // Solar eclipse: Sun - Moon - Earth
    sunPos = [-6, 0, 0];
    moonPos = [-2, 0, 0];
    earthPos = [2, 0, 0];
  } else if (mode === "lunar") {
    // Lunar eclipse: Sun - Earth - Moon
    sunPos = [-6, 0, 0];
    earthPos = [0, 0, 0];
    moonPos = [4, 0, 0];
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[-10, 2, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-8, 0, 0]} intensity={2} color="#FFA030" distance={20} decay={2} />

      {/* Celestial bodies */}
      <Sun />
      
      <group ref={earthRef}>
        <Earth position={mode === "overview" ? [0, 0, 0] : earthPos} />
      </group>

      <group ref={moonRef}>
        <Moon position={mode === "overview" ? [1.5, 0, 0] : moonPos} />
      </group>

      {/* Orbit paths */}
      {mode === "overview" && (
        <>
          <OrbitPath radius={1.5} />
          <OrbitPath radius={5} segments={256} />
        </>
      )}

      {/* Shadow visualization */}
      <ShadowCones mode={mode} />

      {/* Grid helper for reference (subtle) */}
      <gridHelper args={[20, 20, "#333344", "#222233"]} position={[0, -2, 0]} />
    </>
  );
}

// Labels component (HTML overlay)
function EclipseLabels({ mode }: { mode: EclipseMode }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 text-sm space-y-1">
        <div className="px-3 py-1.5 rounded bg-black/60 backdrop-blur-sm text-white/90 font-medium">
          {mode === "solar" ? "सूर्य ग्रहण / Solar Eclipse" : mode === "lunar" ? "चंद्र ग्रहण / Lunar Eclipse" : "Eclipse Alignment"}
        </div>
      </div>

      {mode !== "overview" && (
        <div className="absolute bottom-4 left-4 text-xs space-y-1">
          <div className="px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white/80">
            <span className="inline-block w-3 h-3 bg-gray-900/80 rounded-full mr-2"></span>
            Umbra (Total Shadow)
          </div>
          <div className="px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white/80">
            <span className="inline-block w-3 h-3 bg-gray-700/60 rounded-full mr-2"></span>
            Penumbra (Partial Shadow)
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 text-xs px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white/70">
        Live 3D Scientific View
      </div>
    </div>
  );
}

// Main component
export function EclipseDrishyaYantra({ mode = "solar", className = "" }: EclipseDrishyaYantraProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isClient) {
    return (
      <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden ${className}`}>
        <div className="flex items-center justify-center h-full min-h-[300px] text-white/50">
          Loading Eclipse Scene...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden ${className}`}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={45} />
        
        {!reducedMotion && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 6}
            maxAzimuthAngle={Math.PI / 6}
            enableDamping
            dampingFactor={0.05}
          />
        )}

        <AnimatedEclipseScene mode={mode} />
      </Canvas>

      <EclipseLabels mode={mode} />
    </div>
  );
}

// Eclipse mode detection helper
export function detectEclipseQuestion(question: string): EclipseMode | null {
  const q = question.toLowerCase();
  
  // Solar eclipse keywords
  if (
    q.includes("solar eclipse") ||
    q.includes("सूर्य ग्रहण") ||
    q.includes("surya grahan") ||
    (q.includes("sun") && q.includes("eclipse")) ||
    (q.includes("moon") && q.includes("blocks") && q.includes("sun"))
  ) {
    return "solar";
  }

  // Lunar eclipse keywords
  if (
    q.includes("lunar eclipse") ||
    q.includes("चंद्र ग्रहण") ||
    q.includes("chandra grahan") ||
    q.includes("chand grahan") ||
    (q.includes("moon") && q.includes("eclipse")) ||
    (q.includes("earth") && q.includes("shadow") && q.includes("moon"))
  ) {
    return "lunar";
  }

  // General eclipse/alignment keywords
  if (
    q.includes("eclipse") ||
    q.includes("ग्रहण") ||
    q.includes("grahan") ||
    (q.includes("rahu") && q.includes("ketu") && (q.includes("eclipse") || q.includes("ग्रहण") || q.includes("grahan")))
  ) {
    return "overview";
  }

  return null;
}
