# Phase 1: Project Setup Prompt

> **Purpose**: Set up the Next.js project foundation. No UI, no features — only tooling and structure.

---

## Prompt

```
You are working on AkasGatha Phase 1: Project Setup.

FIRST: Read brain/PROJECT_BRIEF.md and brain/AGENT_RULES.md.

YOUR TASK:
Initialize the Next.js project with all required tooling. Do NOT build any UI or features yet.

STEPS:
1. Initialize Next.js 14+ with App Router and TypeScript:
   npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

2. Install additional dependencies:
   npm install framer-motion zod @react-three/fiber @react-three/drei three @google/generative-ai
   npm install -D @types/three

3. Initialize Shadcn UI:
   npx -y shadcn-ui@latest init
   Then add: npx shadcn-ui@latest add button card input

4. Configure next.config.js:
   - Set output: 'standalone' (for Docker)
   - Add any needed image domains

5. Verify TypeScript strict mode in tsconfig.json:
   - "strict": true

6. Create folder structure (empty placeholder files where needed):
   src/
   ├── app/
   │   ├── layout.tsx (basic with fonts and metadata)
   │   ├── page.tsx (minimal placeholder)
   │   ├── ask/page.tsx (placeholder)
   │   ├── about/page.tsx (placeholder)
   │   └── api/
   │       ├── health/route.ts (placeholder)
   │       └── jigyasa/route.ts (placeholder)
   ├── components/
   │   ├── layout/
   │   ├── home/
   │   ├── jigyasa/
   │   ├── three/
   │   └── ui/ (Shadcn components go here)
   ├── lib/
   │   ├── llm/
   │   ├── schemas/
   │   ├── security/
   │   ├── data/
   │   └── utils.ts
   └── styles/
       └── globals.css

7. Update layout.tsx:
   - Set metadata: title "AkasGatha", description about the platform
   - Add Google Font (Inter or similar)
   - Apply dark theme body class

VERIFICATION:
- npx tsc --noEmit → passes
- npm run lint → passes
- npm run build → passes
- Dev server starts: npm run dev → page loads at localhost:3000

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 1 items in brain/TODO.md

DO NOT:
- Build any UI components (that's Phase 2)
- Add any API logic (that's Phase 4)
- Add LLM integration (that's Phase 5)
- Add 3D scenes (that's Phase 6)
```
