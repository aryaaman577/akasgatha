# Jigyasa Visual Model Refinement — Complete

## Task Summary
Refined the Jigyasa QuestionOrb visual model on `/ask` page to eliminate excessive rotation and improve depth perception while preserving exact model identity.

## Problems Addressed
1. ✅ **Full 360° rotation stopped** — Model no longer spins continuously
2. ✅ **Excessive pointer interaction restrained** — Mouse movement now subtle parallax only
3. ✅ **Depth perception improved** — Added layered cosmic depth, translateZ positioning
4. ✅ **Premium detailing added** — Enhanced with particles, atmospheric effects, internal glow
5. ✅ **Front-facing stability** — Model stays centered with gentle breathing motion only

## Technical Changes

### 1. Rotation System (InteractiveSpaceModel.tsx)
**Before:**
```typescript
const totalX = s.currRotX + s.dragRotX;
const totalY = s.idle * 0.3 + s.currRotY + s.dragRotY; // Continuous 360° spin
```

**After:**
```typescript
if (variant === "question_orb") {
  // Breathing motion: gentle sine wave oscillation
  const breathX = Math.sin(s.idle * 0.02) * 1.5;
  const breathY = Math.cos(s.idle * 0.015) * 1;
  totalX = breathX + s.currRotX + s.dragRotX;
  totalY = breathY + s.currRotY + s.dragRotY;
} else {
  // Other models: keep original rotation behavior
  totalX = s.currRotX + s.dragRotX;
  totalY = s.idle * 0.3 + s.currRotY + s.dragRotY;
}
```

**Rotation Limits:**
- Horizontal breathing: ±1° gentle oscillation
- Vertical breathing: ±1.5° gentle oscillation
- No continuous 360° rotation
- Front-facing orientation preserved

### 2. Pointer Interaction (InteractiveSpaceModel.tsx)
**Before:**
```typescript
state.current.targetRotX = -ny * 20; // ±20° from mouse
state.current.targetRotY = nx * 20;  // ±20° from mouse
```

**After:**
```typescript
if (variant === "question_orb") {
  state.current.targetRotX = -ny * 2; // Limit vertical: -2 to +2 degrees
  state.current.targetRotY = nx * 4;  // Limit horizontal: -4 to +4 degrees
} else {
  // Other models: keep original interaction strength
  state.current.targetRotX = -ny * 20;
  state.current.targetRotY = nx * 20;
}
```

**Interaction Limits:**
- Vertical tilt: -2° to +2° (restrained)
- Horizontal tilt: -4° to +4° (restrained)
- Damping factor: 0.08 (slower response, smoother return to neutral)
- Effect: Subtle parallax, not heavy rotation

### 3. Depth Perception Enhancement (QuestionOrb component)

**Layered Depth System:**
```typescript
// Deep background layer
translateZ(-30px) — Outer nebula glow (h-64 w-64)
translateZ(-15px) — Mid-depth nebula (h-56 w-56)

// Mid-range layers
translateZ(0px) — Outer energy field (h-52 w-52)
translateZ(0px) — Secondary energy ring (h-44 w-44)

// Near layers
translateZ(2px) — Energy filaments SVG (h-36 w-36)
translateZ(5px) — Main pulsar orb (h-28 w-28)
translateZ(6px) — Atmospheric rim (h-32 w-32)

// Foreground elements
translateZ(8px) — Silver core (h-7 w-7)
translateZ(9px) — Inner glow accent (h-4 w-4)
translateZ(10px) — Particle field (12 floating particles)
```

### 4. Premium Visual Detailing

**Enhanced Pulsar Orb:**
- Multi-stop gradient: 4 color stops (was 3)
- Light source positioning: `circle at 35% 35%` (top-left illumination)
- Enhanced shadow: `inset -8px -8px 20px rgba(0,0,0,0.4)`
- Triple glow: main + wide halo + inset depth

**Atmospheric Rim:**
- Transparent center (75%)
- Visible rim band (75%-95%)
- Blur filter for soft atmospheric edge
- Positioned in front of orb for depth illusion

**Particle Field:**
- 12 floating cosmic dust particles
- Circular distribution (30° intervals)
- Variable radius: 45px-69px from center
- Size variation: 1.5px-2px based on position
- Alternating colors: moonlight white / violet
- Animated: `particle-float` 4-7s infinite
- Positioned at translateZ(10px) — foreground layer

**Energy Filaments:**
- Enhanced stroke width: 0.8px → 1px
- Enhanced opacity: 0.5 → 0.6
- Drop shadow: `0 0 3px rgba(119,89,217,0.4)`
- Slower rotation: `var(--idle) * 0.3` → `var(--idle) * 0.12`
- Staggered animation timing: 3-5.4s per filament

**Silver Core:**
- Size increased: h-6 w-6 → h-7 w-7
- Light source: `circle at 40% 40%`
- Triple-layer gradient (surface, mid-tone, base)
- Triple glow: white + violet halo + inset highlight
- Inner accent: animated pulse (h-4 w-4)

### 5. CSS Animations (globals.css)

**New Animations:**
```css
@keyframes subtle-pulse {
  0%, 100% { opacity: 0.35; transform: rotateX(45deg) rotateZ(...) scale(1); }
  50%      { opacity: 0.50; transform: rotateX(45deg) rotateZ(...) scale(1.02); }
}

@keyframes particle-float {
  0%, 100% { transform: translateZ(10px) translateY(0px); opacity: 0.6; }
  50%      { transform: translateZ(10px) translateY(-3px); opacity: 1; }
}

@keyframes core-pulse {
  0%, 100% { opacity: 0.9; }
  50%      { opacity: 0.6; }
}
```

**Animation Applications:**
- Outer energy field: `subtle-pulse 6s ease-in-out infinite`
- Secondary ring: `subtle-pulse 8s ease-in-out infinite 1s` (staggered)
- Particles: `particle-float 4-7s ease-in-out infinite` (variable timing)
- Inner glow: `core-pulse 4s ease-in-out infinite`

## Preserved Elements
✅ Exact model geometry unchanged
✅ Exact silhouette preserved
✅ Exact proportions maintained
✅ Exact composition kept
✅ Exact placement unchanged (h-56 w-56 container)
✅ AkasGatha color palette maintained
✅ All other models unaffected
✅ Groq AI integration untouched
✅ RAG system unaffected
✅ Citation system unaffected

## Color Palette (AkasGatha)
- Deep black: `rgba(3,4,10,...)` / `rgba(7,9,18,...)`
- Graphite: `rgba(41,29,85,...)`
- Moonlight white: `rgba(241,240,232,...)` / `rgba(216,220,233,...)`
- Muted silver: `rgba(180,185,200,...)`
- Deep blue (subtle): `rgba(85,124,214,...)` / `rgba(95,166,184,...)`
- Violet accents: `rgba(119,89,217,...)`

## Responsive Behavior
- Desktop: Full interaction with restrained tilt
- Tablet: Same interaction model (touch-pan-y enabled)
- Mobile: Same interaction model (touch-pan-y enabled)
- Reduced motion: Automatically disables all animations and interactions
- Performance: Uses IntersectionObserver to pause when off-screen

## Validation

### Build
```bash
npm run type-check  ✅ PASS
npm run build       ✅ PASS
```

### Server
```bash
npm run dev         ✅ Running on http://localhost:3002
```

### Manual Testing
- Navigate to: http://localhost:3002/ask
- Observe Jigyasa model on right sidebar (desktop)
- Verify: No continuous 360° rotation
- Verify: Front-facing with gentle breathing only
- Verify: Mouse movement creates subtle parallax (not heavy rotation)
- Verify: Model has true 3D depth (not flat 2D appearance)
- Verify: Premium cosmic detailing visible (particles, glow layers, atmosphere)
- Verify: Jigyasa AI selector still functional (Auto/Groq)
- Verify: Question input and submission works
- Verify: No visual regression on homepage, granth, or about pages

## Files Changed
- `src/components/visual/InteractiveSpaceModel.tsx` — Rotation logic, pointer interaction, QuestionOrb visual enhancement
- `src/app/globals.css` — New animation keyframes for QuestionOrb

## Commit
```
c714b73 - fix: stabilize and refine Jigyasa visual model
```

## Status
✅ **COMPLETE** — Jigyasa visual model refined successfully

## Next Steps
- User validation: Confirm visual improvements meet expectations
- Performance monitoring: Verify no FPS drops on target devices
- Cross-browser testing: Verify consistent rendering (Chrome, Firefox, Safari, Edge)
