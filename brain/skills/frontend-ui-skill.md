# Skill: Frontend UI

> Standards for building the AkasGatha frontend.

---

## Next.js App Router

- Use the App Router (`src/app/`) for all pages and API routes
- Server Components by default; add `"use client"` only when needed (interactivity, state, effects)
- Use `layout.tsx` for shared layout (Navbar, Footer)
- Use `page.tsx` for route pages
- Use `route.ts` for API endpoints

## Reusable Components

- Each component should do one thing well
- Props should be typed with TypeScript interfaces
- Components live in `src/components/<category>/ComponentName.tsx`
- Categories: `layout/`, `home/`, `jigyasa/`, `three/`, `ui/`
- Shadcn UI components go in `src/components/ui/`

## Responsive Layout

- Mobile-first approach: design for 375px first, then scale up
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Test at 375px (mobile), 768px (tablet), 1280px (desktop)
- No horizontal scroll at any viewport
- Touch targets at least 44x44px on mobile

## Tailwind CSS

- Use Tailwind utility classes for all styling
- Use CSS custom properties (via Tailwind config) for theme colors
- Common patterns:
  - `bg-gradient-to-b from-slate-950 to-slate-900` — dark gradient
  - `backdrop-blur-md bg-white/5` — glassmorphism
  - `border border-white/10` — subtle borders
  - `text-slate-100` — primary text
  - `text-slate-400` — secondary text
- Do not use inline styles (`style={{}}`) except for dynamic values

## Shadcn UI

- Use Shadcn components for standard UI primitives
- Available components: Button, Card, Input (add more as needed via `npx shadcn-ui add`)
- Customize via Tailwind classes, not by modifying the Shadcn source
- Keep consistent with Shadcn's design patterns

## Framer Motion

- Use for entrance animations, page transitions, hover effects
- Common patterns:
  ```tsx
  // Fade in from bottom
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >

  // Stagger children
  <motion.div
    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    initial="hidden"
    animate="show"
  >

  // Hover scale
  <motion.div whileHover={{ scale: 1.02 }}>
  ```
- Keep animations subtle (0.3–0.6s duration)
- Use `transition={{ ease: "easeOut" }}` for natural feel
- Respect `prefers-reduced-motion` (Framer Motion handles this automatically)

## Clean Typography

- Primary font: Inter (or similar clean sans-serif via Google Fonts)
- Headings: `font-bold`, sizes `text-3xl` to `text-6xl`
- Body: `text-base` to `text-lg`, `leading-relaxed`
- Use `tracking-tight` for headings, normal for body
- Ensure sufficient contrast on dark backgrounds

## Glassmorphism Without Clutter

- Use sparingly — on cards, navbar, not on everything
- Pattern: `bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`
- Keep backgrounds subtle (5–10% opacity)
- Ensure text remains readable over the effect
- Do not stack multiple glassmorphism layers
