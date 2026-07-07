# TODO — AkasGatha

Phase-wise checklist. Check off items as completed.

---

## Phase 0: Documentation and Brain Setup

- [x] Create `docs/PRD.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Create `docs/API_SPEC.md`
- [x] Create `docs/PROMPT_CONTRACT.md`
- [x] Create `docs/SECURITY.md`
- [x] Create `docs/THREAT_MODEL.md`
- [x] Create `docs/SECURITY_LAYERS.md`
- [x] Create `docs/TEST_PLAN.md`
- [x] Create `docs/DEPLOYMENT_RUNBOOK.md`
- [x] Create `docs/REPORT_DRAFT.md`
- [x] Create `brain/PROJECT_BRIEF.md`
- [x] Create `brain/AGENT_RULES.md`
- [x] Create `brain/ROADMAP.md`
- [x] Create `brain/STATE.md`
- [x] Create `brain/TODO.md`
- [x] Create `brain/DECISIONS.md`
- [x] Create `brain/PROGRESS_LOG.md`
- [x] Create `brain/QUALITY_CHECKLIST.md`
- [x] Create `brain/SECURITY_CHECKLIST.md`
- [x] Create all `brain/prompts/` files
- [x] Create all `brain/skills/` files
- [x] Create `README_FIRST.md`
- [x] Create `.env.example`
- [x] Create `.gitignore`

---

## Phase 1: Project Setup

- [x] Initialize Next.js 14+ with App Router and TypeScript
- [x] Configure Tailwind CSS
- [ ] Initialize Shadcn UI (deferred by narrowed Phase 1 scope)
- [ ] Install Framer Motion (deferred by narrowed Phase 1 scope)
- [ ] Install Zod (deferred by narrowed Phase 1 scope)
- [ ] Install React Three Fiber + drei + three (deferred by narrowed Phase 1 scope)
- [ ] Install @google/generative-ai (deferred by narrowed Phase 1 scope)
- [x] Configure ESLint
- [x] Configure TypeScript strict mode
- [x] Create foundation folder structure (`src/app`)
- [x] Create basic layout.tsx with metadata
- [x] Create minimal placeholder home page
- [x] Configure next.config.ts with standalone output
- [x] Verify: `npx tsc --noEmit` passes
- [x] Verify: `npm run lint` passes
- [x] Verify: `npm run build` passes
- [x] Update brain/STATE.md
- [x] Update brain/PROGRESS_LOG.md

---

## Phase 2: Frontend Foundation

- [x] Build Navbar component
- [x] Build Footer component
- [x] Build AkasDwar hero section
- [x] Build AkasGranth topic grid
- [x] Build FeatureGrid highlights
- [x] Assemble Home page
- [x] Build About page
- [x] Build Ask page placeholder
- [x] Apply dark cosmic theme
- [x] Add subtle CSS transition-only motion (Framer Motion not installed for this phase)
- [x] Ensure mobile responsive layout
- [x] Verify: `npm.cmd run lint`, `npm.cmd run type-check`, and `npm.cmd run build` pass
- [x] Update brain/STATE.md
- [x] Update brain/PROGRESS_LOG.md

---

## Phase 3: Mock Jigyasa UI

- [ ] Build QuestionInput component
- [ ] Build ResponseView layout
- [ ] Build KathaMandal card
- [ ] Build RahasyaChakra card
- [ ] Build VigyanDrishti card
- [ ] Build SatyaSetu card
- [ ] Build PramaanMatrix card
- [ ] Build JigyasaAgni card
- [ ] Build SmritiQuest card
- [ ] Create mock response data
- [ ] Add loading state
- [ ] Add error state
- [ ] Verify: Ask page works end-to-end with mock data
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 4: Mock Backend API

- [ ] Create /api/health route
- [ ] Create /api/jigyasa route (returns mock data)
- [ ] Create Zod request schema
- [ ] Create Zod response schema
- [ ] Add input validation
- [ ] Add method restriction
- [ ] Add safe error responses
- [ ] Wire frontend to call API
- [ ] Verify: API works, frontend displays API responses
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 5: Real LLM Integration

- [ ] Create LLM provider interface
- [ ] Create Gemini provider
- [ ] Create mock provider (fallback)
- [ ] Create prompt builder
- [ ] Implement system prompt from PROMPT_CONTRACT
- [ ] Implement user prompt template
- [ ] Add JSON extraction from raw response
- [ ] Add Zod response validation
- [ ] Add fallback response on failure
- [ ] Add banned phrase detection
- [ ] Add prompt injection detection
- [ ] Verify: Real AI responses work, fallback works
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 6: 3D Scenes

- [ ] Create SceneWrapper (lazy loading)
- [ ] Create CosmicSky scene
- [ ] Create EclipseScene
- [ ] Create PlanetOrbit scene
- [ ] Add scene mapping from sceneType
- [ ] Add WebGL fallback UI
- [ ] Test mobile performance
- [ ] Verify: All 3 scenes render, correct mapping works
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 7: Security Hardening

- [ ] Implement rate limiter
- [ ] Implement input sanitizer
- [ ] Add security headers to next.config.js
- [ ] Add Content-Type enforcement
- [ ] Add request size limit
- [ ] Audit for dangerouslySetInnerHTML
- [ ] Audit for NEXT_PUBLIC_ secrets
- [ ] Run npm audit
- [ ] Run security test plan
- [ ] Verify: All security tests pass
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 8: Docker + AWS Deployment

- [ ] Create Dockerfile (multi-stage, non-root)
- [ ] Create .dockerignore
- [ ] Create docker-compose.yml
- [ ] Build Docker image successfully
- [ ] Run container locally
- [ ] Test all features in container
- [ ] Launch EC2 instance
- [ ] Configure security group
- [ ] Install Docker on EC2
- [ ] Deploy app to EC2
- [ ] Verify app accessible at public IP
- [ ] Capture deployment screenshots
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 9: Final Report + Polish

- [ ] Final UI polish pass
- [ ] Final security audit
- [ ] Complete REPORT_DRAFT with real screenshots
- [ ] Run all tests from TEST_PLAN.md
- [ ] Update README.md
- [ ] Final build verification
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md
