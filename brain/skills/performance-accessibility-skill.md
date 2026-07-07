# Skill: Performance and Accessibility

> How to keep AkasGatha fast, responsive, and usable.

---

## Performance Budget

| Metric | Target | How to Measure |
|---|---|---|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Total page weight | < 2MB (initial load) | DevTools → Network |
| 3D scene load time | < 3s (lazy loaded) | Manual observation |
| API response time | < 5s (including LLM) | DevTools → Network |
| Time to Interactive | < 3s | Lighthouse |

## Lazy 3D Loading

Three.js is a large library. Never include it in the main bundle:

```tsx
import dynamic from 'next/dynamic';

const SceneWrapper = dynamic(
  () => import('@/components/three/SceneWrapper'),
  { 
    ssr: false,
    loading: () => <ScenePlaceholder />
  }
);
```

Or with React.lazy:
```tsx
const CosmicSky = React.lazy(() => import('./CosmicSky'));

function DrishyaYantra({ sceneType }: { sceneType: string }) {
  return (
    <Suspense fallback={<ScenePlaceholder />}>
      <SceneWrapper sceneType={sceneType} />
    </Suspense>
  );
}
```

Key rules:
- `ssr: false` for all Three.js components (WebGL requires browser)
- Always provide a loading placeholder
- Keep Three.js code in `src/components/three/` (easy to identify)

## Mobile Responsiveness

### Breakpoint strategy (Tailwind):
```
Default: Mobile (< 640px)
sm: 640px+ (larger phones)
md: 768px+ (tablets)
lg: 1024px+ (laptops)
xl: 1280px+ (desktops)
```

### Mobile rules:
- Grid: 1 column on mobile, 2 on tablet, 3-4 on desktop
- Font sizes: reduce heading sizes on mobile
- Padding: reduce padding on mobile (p-4 vs p-8)
- Cards: full width on mobile, grid on desktop
- 3D scenes: may need to be smaller on mobile (200px height)
- Touch targets: minimum 44x44px

### Testing:
1. Chrome DevTools → Toggle device toolbar
2. Test at 375px (iPhone SE)
3. Test at 768px (iPad)
4. Test at 1280px (Desktop)
5. Check no horizontal scroll at any size

## Readable Contrast

Dark theme contrast rules:
- Primary text: `text-slate-100` on `bg-slate-900` (contrast ratio > 7:1)
- Secondary text: `text-slate-400` on `bg-slate-900` (contrast ratio > 4.5:1)
- Links/buttons: `text-blue-400` or brighter accent on dark
- Never use `text-slate-600` on dark background (too low contrast)
- Test with: Chrome DevTools → Rendering → Emulate vision deficiencies

## Keyboard Navigation

- All interactive elements must be focusable (buttons, inputs, links)
- Shadcn UI components handle this by default
- Tab order should be logical (top to bottom, left to right)
- Focus indicators must be visible (Tailwind: `focus:ring-2 focus:ring-blue-500`)
- Modal/overlay content should trap focus (if any modals are added)

## Reduced Motion

Respect `prefers-reduced-motion` for users who are sensitive to animations:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Framer Motion respects this automatically with `useReducedMotion()`.

For 3D scenes: reduce or stop animation when reduced motion is preferred.

## Alt Text

- All informational images need alt text
- Decorative images: `alt=""`
- 3D scenes: provide text description nearby or `aria-label` on the container
- Icons that convey meaning: use `aria-label` or screen-reader-only text
- Emoji in topic cards: decorative, pair with text label

Example:
```tsx
// Informational
<img src="/diagram.png" alt="Diagram showing how a solar eclipse occurs" />

// Decorative
<img src="/star-bg.png" alt="" role="presentation" />

// 3D scene
<div aria-label="3D visualization of a solar eclipse">
  <Canvas>...</Canvas>
</div>
```
