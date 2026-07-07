# Skill: Three.js Scene Design

> Standards for lightweight, reusable 3D scenes in AkasGatha.

---

## Lightweight Scenes

- Every scene must be simple enough to run at 30+ FPS on mobile
- Max vertex count per scene: ~500
- Use procedural geometry (BufferGeometry, Points) — no external 3D models
- No texture files — use procedural colors and shaders only
- Total Three.js bundle: lazy-loaded, not in main chunk
- Canvas size: ~300-400px height, full width of parent card

## Reusable Templates

Three scene templates — each maps to multiple topics:

### CosmicSky (cosmic_sky)
- Procedural starfield using Points geometry
- 200–500 star particles with random positions in a sphere
- Slow rotation (0.001 rad/frame)
- Star sizes vary (1–3px)
- Soft white/blue colors
- Used for: nakshatras, constellations, night sky, general cosmic

### EclipseScene (eclipse)
- Sun: sphere with emissive orange/yellow material, subtle glow
- Moon: smaller dark sphere, slowly translating across the Sun
- Simple linear animation (Moon slides across Sun over ~10 seconds, loops)
- Optional corona ring (Torus geometry, semi-transparent)
- Used for: solar eclipse, lunar eclipse, Rahu, Ketu

### PlanetOrbit (planet_orbit)
- Central body: sphere (Sun-like, emissive yellow)
- Orbiting body: smaller sphere (planet, blue/green/red)
- Circular or slightly elliptical orbit path
- Orbit line (Line geometry, subtle)
- Smooth orbit animation (constant angular velocity)
- Used for: planets, graha, orbital mechanics, moon phases

## No Heavy Assets

- No .glb, .gltf, .obj, or .fbx model files
- No image textures (.jpg, .png)
- No video textures
- No environment maps
- No shadow rendering (expensive)
- No post-processing effects (bloom, DOF)

## Mobile Performance

- Use `React.lazy()` for all scene components
- Wrap in `<Suspense fallback={<LoadingPlaceholder />}>`
- Set `dpr={[1, 1.5]}` on Canvas (limit pixel ratio)
- Consider `frameloop="demand"` for static scenes
- Use `useFrame` sparingly — only for animation
- Dispose of geometries and materials on unmount

## Fallback UI

When WebGL is unavailable or performance is poor:

```tsx
function FallbackScene() {
  return (
    <div className="w-full h-[300px] bg-gradient-to-b from-slate-900 to-slate-950 
                    rounded-xl flex items-center justify-center">
      <p className="text-slate-400 text-sm">
        3D visualization requires a WebGL-supported browser
      </p>
    </div>
  );
}
```

Detect WebGL support:
```typescript
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}
```

## Scene Mapping

The AI response includes `sceneType`. Map it in the SceneWrapper:

```typescript
const SCENE_MAP = {
  cosmic_sky: CosmicSky,
  eclipse: EclipseScene,
  planet_orbit: PlanetOrbit,
} as const;

// Usage in SceneWrapper
const SceneComponent = SCENE_MAP[sceneType] || FallbackScene;
```
