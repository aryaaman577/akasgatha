# Roadmap — AkasGatha

Phase-wise development roadmap. Each phase builds on the previous one. Do not skip phases.

---

## Phase 0: Documentation and Brain Setup ✅

**Status**: Complete

**Deliverables**:
- `docs/` — PRD, Architecture, API Spec, Prompt Contract, Security, Threat Model, Security Layers, Test Plan, Deployment Runbook, Report Draft
- `brain/` — Project Brief, Agent Rules, Roadmap, State, TODO, Decisions, Progress Log, Quality Checklist, Security Checklist
- `brain/prompts/` — All phase prompts + utility prompts
- `brain/skills/` — All skill reference files
- Root files: `README_FIRST.md`, `.env.example`, `.gitignore`

---

## Phase 1: Project Setup

**Status**: Not started

**Goal**: Initialize the Next.js project with all tooling configured.

**Deliverables**:
- Next.js 14+ with App Router (TypeScript)
- Tailwind CSS configured
- Shadcn UI initialized (card, button, input components)
- Framer Motion installed
- Zod installed
- React Three Fiber + drei installed
- ESLint + TypeScript strict mode
- Folder structure created (empty placeholder files)
- `package.json` with all dependencies
- `next.config.js` with standalone output
- Basic `layout.tsx` with fonts and metadata
- Verify: `npm run build` passes

**Duration**: ~1 hour

---

## Phase 2: Frontend Foundation

**Status**: Not started

**Goal**: Build the static frontend pages and layout components.

**Deliverables**:
- `Navbar.tsx` — responsive navigation
- `Footer.tsx` — credits and links
- `AkasDwar.tsx` — cinematic hero section
- `AkasGranth.tsx` — topic library grid
- `FeatureGrid.tsx` — feature highlights
- Home page (`/`) — assembles hero + library + features
- About page (`/about`) — project info + content safety note
- Ask page placeholder (`/ask`) — placeholder with "Coming soon" or basic form
- Dark cosmic theme with Tailwind
- Framer Motion entrance animations
- Mobile responsive layout
- Verify: `npm run build` passes, pages render in browser

**Duration**: ~3–4 hours

---

## Phase 3: Mock Jigyasa UI

**Status**: Not started

**Goal**: Build the question input form and response display with mock data.

**Deliverables**:
- `QuestionInput.tsx` — question form with mood and topic type selectors
- `ResponseView.tsx` — layout for all response sections
- `KathaMandal.tsx` — cultural story card
- `RahasyaChakra.tsx` — mystery card
- `VigyanDrishti.tsx` — science card
- `SatyaSetu.tsx` — bridge card
- `PramaanMatrix.tsx` — evidence card
- `JigyasaAgni.tsx` — follow-up questions
- `SmritiQuest.tsx` — quiz component
- Mock response data (hardcoded JSON)
- Loading and error states
- Verify: Ask page works end-to-end with mock data

**Duration**: ~3–4 hours

---

## Phase 4: Mock Backend API

**Status**: Not started

**Goal**: Create API routes with Zod validation that return mock data.

**Deliverables**:
- `/api/health/route.ts` — health check endpoint
- `/api/jigyasa/route.ts` — returns mock structured response
- `src/lib/schemas/request.ts` — Zod request schema
- `src/lib/schemas/response.ts` — Zod response schema
- Input validation with safe error responses
- Method restriction (GET/POST enforcement)
- Wire up frontend to call real API (instead of hardcoded mock)
- Verify: API returns correct responses, frontend displays them

**Duration**: ~2 hours

---

## Phase 5: Real LLM Integration

**Status**: Not started

**Goal**: Replace mock responses with real Gemini API calls.

**Deliverables**:
- `src/lib/llm/provider.ts` — provider interface and selection
- `src/lib/llm/gemini.ts` — Gemini API integration
- `src/lib/llm/mock.ts` — mock provider for development
- `src/lib/llm/prompt-builder.ts` — system + user prompt construction
- Server-side API key usage only
- JSON extraction from raw LLM response
- Zod response validation
- Fallback response on failure
- Banned phrase detection
- Prompt injection detection
- Verify: Real AI responses display correctly, fallback works

**Duration**: ~3–4 hours

---

## Phase 6: 3D Scenes

**Status**: Not started

**Goal**: Add 3 lightweight, reusable 3D scene templates.

**Deliverables**:
- `SceneWrapper.tsx` — lazy-loading wrapper with Suspense
- `CosmicSky.tsx` — starfield/constellation scene
- `EclipseScene.tsx` — eclipse animation
- `PlanetOrbit.tsx` — planet orbital scene
- Scene mapping from `sceneType` to component
- Fallback UI when WebGL unavailable
- Mobile performance optimization
- Verify: Scenes render, correct scene shown per topic, fallback works

**Duration**: ~3 hours

---

## Phase 7: Security Hardening

**Status**: Not started

**Goal**: Implement all security layers from SECURITY_LAYERS.md.

**Deliverables**:
- `src/lib/security/rate-limiter.ts` — in-memory rate limiter
- `src/lib/security/sanitize.ts` — input sanitizer + injection detection
- Security headers in `next.config.js`
- Rate limiting on `/api/jigyasa`
- Content-Type enforcement
- Request size limiting
- Safe error responses (no stack traces)
- No `dangerouslySetInnerHTML` audit
- `npm audit` run
- Security checklist verification
- Verify: All security tests from TEST_PLAN.md pass

**Duration**: ~2 hours

---

## Phase 8: Docker + AWS Deployment

**Status**: Not started

**Goal**: Containerize the app and deploy to AWS EC2.

**Deliverables**:
- `Dockerfile` — multi-stage build with non-root user
- `.dockerignore` — proper exclusions
- `docker-compose.yml` — local Docker development
- Docker build succeeds
- Container runs locally with all features working
- EC2 instance launched and configured
- Security group configured (SSH restricted, HTTP open)
- Docker installed on EC2
- App deployed and accessible via public IP
- Deployment screenshots captured
- Verify: App accessible at `http://<EC2_IP>`, all features work

**Duration**: ~3–4 hours

---

## Phase 9: Final Report + Polish

**Status**: Not started

**Goal**: Finalize the internship report and polish the app.

**Deliverables**:
- Complete `REPORT_DRAFT.md` with actual screenshots
- Final UI polish pass (spacing, typography, animations)
- Final security audit (checklist from SECURITY_LAYERS.md)
- Final build verification
- All screenshots captured
- README.md with project description
- Verify: Report is complete, app is polished, all tests pass

**Duration**: ~2–3 hours

---

## Total Estimated Duration

| Phase | Est. Hours |
|---|---|
| Phase 0: Docs + Brain | 2 |
| Phase 1: Project Setup | 1 |
| Phase 2: Frontend Foundation | 3–4 |
| Phase 3: Mock Jigyasa UI | 3–4 |
| Phase 4: Mock Backend API | 2 |
| Phase 5: LLM Integration | 3–4 |
| Phase 6: 3D Scenes | 3 |
| Phase 7: Security Hardening | 2 |
| Phase 8: Docker + AWS | 3–4 |
| Phase 9: Report + Polish | 2–3 |
| **Total** | **~24–30 hours** |
