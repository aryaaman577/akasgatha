# Phase 6: 3D Scenes Prompt

> **Purpose**: Add 3 lightweight, reusable 3D visual scene templates.

---

## Prompt

```
You are working on AkasGatha Phase 6: 3D Scenes.

FIRST: Read brain/AGENT_RULES.md and brain/skills/threejs-scene-skill.md.

YOUR TASK:
Create exactly 3 lightweight, reusable 3D scene templates using React Three Fiber. These are visual accents, not heavy simulations.

FILES TO CREATE:

1. src/components/three/SceneWrapper.tsx
   - Lazy-loads 3D scene components with React.lazy() + Suspense
   - Shows loading fallback (skeleton or gradient placeholder)
   - Detects WebGL support → shows 2D fallback if unavailable
   - Accepts sceneType prop and renders the correct scene
   - Wraps scene in Canvas with proper settings

2. src/components/three/CosmicSky.tsx
   - Starfield / constellation scene
   - Procedural stars (use Points geometry, not individual meshes)
   - Slow rotation animation
   - 200-500 stars max (performance budget)
   - Soft glow effect
   - Use cases: nakshatra, constellation, night sky topics

3. src/components/three/EclipseScene.tsx
   - Eclipse animation
   - Sun sphere (glowing) + Moon sphere (dark, moving across)
   - Simple animation: Moon slowly crosses the Sun
   - Corona/glow effect around the Sun
   - Use cases: solar eclipse, lunar eclipse, Rahu/Ketu topics

4. src/components/three/PlanetOrbit.tsx
   - Planet orbiting a central body
   - Central sphere (Sun-like) + orbiting sphere (planet)
   - Elliptical or circular orbit path
   - Smooth orbit animation
   - Optional orbit trail/line
   - Use cases: planet topics, graha, orbital mechanics

5. src/components/three/FallbackScene.tsx
   - 2D fallback when WebGL is unavailable
   - Gradient background with CSS stars or simple illustration
   - Text: "3D visualization unavailable — please use a WebGL-supported browser"

FILES TO MODIFY:

6. src/components/jigyasa/ResponseView.tsx (or wherever Drishya Yantra renders)
   - Add SceneWrapper component
   - Pass sceneType from AI response
   - Position in the response card layout

SCENE MAPPING:
- "cosmic_sky" → CosmicSky component
- "eclipse" → EclipseScene component
- "planet_orbit" → PlanetOrbit component
- anything else → FallbackScene

PERFORMANCE RULES:
- Max 500 vertices per scene
- Use BufferGeometry for particles
- No large texture files (procedural only)
- Lazy load all Three.js code (big bundle)
- Set frameloop="demand" or low FPS when not in view
- Test on mobile (should be smooth at 30+ FPS)

STYLING:
- Scenes should be ~300-400px tall, full width of card
- Dark background matching the app theme
- Rounded corners to match card design
- Subtle, not overwhelming

VERIFICATION:
- npx tsc --noEmit → passes
- npm run build → passes
- CosmicSky renders starfield with rotation
- EclipseScene shows eclipse animation
- PlanetOrbit shows orbiting planet
- Correct scene loads based on sceneType
- Fallback shows when WebGL unavailable
- No performance issues on desktop
- Acceptable performance on mobile

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 6 items in brain/TODO.md

DO NOT:
- Create more than 3 scene types
- Use heavy 3D models or texture files
- Add scene-specific UI controls (keep it simple)
- Import large Three.js addons
```
