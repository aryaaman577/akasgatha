import * as THREE from "three";

export const COLORS = {
  gold: 0xbda56a,
  cyan: 0x5fa6b8,
  silver: 0xd8dce9,
  violet: 0x7759d9,
  deepBlue: 0x070912,
  sapphire: 0x103a71,
  black: 0x030408,
};

export function createMaterials() {
  const materials = {
    /* ── Existing materials (refined) ────────────────────────── */
    goldMetallic: new THREE.MeshStandardMaterial({
      color: COLORS.gold,
      metalness: 0.92,
      roughness: 0.2,
      envMapIntensity: 1.4,
    }),
    goldEmissive: new THREE.MeshStandardMaterial({
      color: COLORS.gold,
      emissive: COLORS.gold,
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.5,
    }),
    silverMetallic: new THREE.MeshStandardMaterial({
      color: COLORS.silver,
      metalness: 0.9,
      roughness: 0.18,
      envMapIntensity: 1.1,
    }),
    glassCyan: new THREE.MeshPhysicalMaterial({
      color: COLORS.cyan,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 0.6,
      transparent: true,
      side: THREE.DoubleSide,
    }),
    glassViolet: new THREE.MeshPhysicalMaterial({
      color: COLORS.violet,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.75,
      ior: 1.5,
      thickness: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
    }),
    obsidian: new THREE.MeshStandardMaterial({
      color: COLORS.black,
      metalness: 0.75,
      roughness: 0.35,
    }),
    glowCyan: new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    glowGold: new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    glowViolet: new THREE.MeshBasicMaterial({
      color: COLORS.violet,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),

    /* ── New premium materials ───────────────────────────────── */

    /** Luminous inner energy core — pulsing additive glow */
    nebulaCore: new THREE.MeshBasicMaterial({
      color: 0x4422aa,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),

    /** Subtle energy field aura */
    energyField: new THREE.MeshBasicMaterial({
      color: 0x334488,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    }),

    /** Premium glass with clearcoat for rim highlights */
    rimGlass: new THREE.MeshPhysicalMaterial({
      color: 0x1a2a4a,
      metalness: 0.3,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    }),

    /** Atmospheric haze plane material */
    hazeViolet: new THREE.MeshBasicMaterial({
      color: 0x1a0e30,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),

    /** Wireframe overlay for layered geometry detail */
    wireframeGold: new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    }),
  };

  const dispose = () => {
    Object.values(materials).forEach((mat) => {
      if ("dispose" in mat) mat.dispose();
    });
  };

  return { materials, dispose };
}

export function setupLighting(scene: THREE.Scene) {
  // Hemisphere light for ambient depth — cool sky, warm ground
  const hemi = new THREE.HemisphereLight(0x334466, 0x0a0612, 0.35);

  // Soft white ambient fill
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);

  // Key light — main illumination
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(5, 6, 5);

  // Rim light — cinematic edge definition (cyan tint)
  const rimLight = new THREE.DirectionalLight(COLORS.cyan, 1.2);
  rimLight.position.set(-5, 2, -6);

  // Accent light — warm gold from below
  const accentLight = new THREE.PointLight(COLORS.gold, 0.6, 12);
  accentLight.position.set(0, -3, 3);

  // Violet fill — subtle depth from behind
  const violetFill = new THREE.PointLight(COLORS.violet, 0.3, 10);
  violetFill.position.set(-3, 4, -4);

  scene.add(hemi, ambient, keyLight, rimLight, accentLight, violetFill);

  return () => {
    scene.remove(hemi, ambient, keyLight, rimLight, accentLight, violetFill);
    hemi.dispose();
    ambient.dispose();
    keyLight.dispose();
    rimLight.dispose();
    accentLight.dispose();
    violetFill.dispose();
  };
}
