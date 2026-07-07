# Phase 2: Frontend Foundation Prompt

> **Purpose**: Build the static frontend pages and layout components.

---

## Prompt

```
You are working on AkasGatha Phase 2: Frontend Foundation.

FIRST: Read brain/PROJECT_BRIEF.md, brain/AGENT_RULES.md, and brain/skills/frontend-ui-skill.md.
ALSO READ: brain/skills/section-design-skill.md for section design guidance.

YOUR TASK:
Build the static frontend pages and layout components. Use mock/placeholder data where needed.

COMPONENTS TO BUILD:

1. src/components/layout/Navbar.tsx
   - Logo text "AkasGatha" (not "AkasGatha AI")
   - Nav links: Home, Explore, About
   - Mobile hamburger menu
   - Sticky, glassmorphism style, dark theme

2. src/components/layout/Footer.tsx
   - Project credit line
   - Content safety disclaimer
   - Simple, elegant

3. src/components/home/AkasDwar.tsx
   - Cinematic hero section
   - Title: "AkasGatha"
   - Tagline: "Where ancient sky stories meet modern space science"
   - CTA button: "Begin Your Journey" → links to /ask
   - Framer Motion entrance animation
   - Subtle starfield or gradient background

4. src/components/home/AkasGranth.tsx
   - Topic library grid (3-4 columns on desktop, 1-2 on mobile)
   - Topics: Surya, Chandra, Mangal, Rahu & Ketu, Nakshatras, Eclipse, Moon Phases
   - Each card: icon/emoji, title, brief description
   - Click → navigates to /ask with topic pre-filled
   - Framer Motion stagger animation

5. src/components/home/FeatureGrid.tsx
   - 3-4 feature highlight cards
   - Features: AI-Powered Exploration, Story-Science Bridge, 3D Visualizations, Evidence-Based Learning
   - Icon + title + description per card

PAGES TO BUILD:

6. src/app/page.tsx (Home)
   - AkasDwar hero
   - AkasGranth topic grid
   - FeatureGrid highlights
   - Dark cosmic background

7. src/app/about/page.tsx
   - About the project
   - Content safety note: "AkasGatha separates cultural stories from scientific explanations..."
   - Tech stack mention
   - Creator credit

8. src/app/ask/page.tsx (placeholder)
   - Simple placeholder: "Jigyasa Engine — Coming in Phase 3"
   - Basic layout with Navbar/Footer

STYLING:
- Dark cosmic theme (dark navy/black backgrounds, soft glows, star-like accents)
- Tailwind CSS for all styling
- Shadcn UI Card, Button components
- Framer Motion for entrance animations and hover effects
- Glassmorphism: semi-transparent cards with backdrop blur
- Clean typography (Inter font)
- Mobile-first responsive design

VERIFICATION:
- npx tsc --noEmit → passes
- npm run lint → passes
- npm run build → passes
- All 3 pages render correctly in browser
- Mobile responsive at 375px
- No console errors

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 2 items in brain/TODO.md

DO NOT:
- Build the Jigyasa Engine question form (that's Phase 3)
- Build response cards (that's Phase 3)
- Add API routes (that's Phase 4)
- Add 3D scenes (that's Phase 6)
```
