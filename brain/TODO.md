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

- [ ] Initialize Next.js 14+ with App Router and TypeScript
- [ ] Configure Tailwind CSS
- [ ] Initialize Shadcn UI (card, button, input)
- [ ] Install Framer Motion
- [ ] Install Zod
- [ ] Install React Three Fiber + drei + three
- [ ] Install @google/generative-ai
- [ ] Configure ESLint
- [ ] Configure TypeScript strict mode
- [ ] Create folder structure (src/app, src/components, src/lib)
- [ ] Create basic layout.tsx with fonts and metadata
- [ ] Configure next.config.js with standalone output
- [ ] Verify: `npx tsc --noEmit` passes
- [ ] Verify: `npm run lint` passes
- [ ] Verify: `npm run build` passes
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

---

## Phase 2: Frontend Foundation

- [ ] Build Navbar component
- [ ] Build Footer component
- [ ] Build AkasDwar hero section
- [ ] Build AkasGranth topic grid
- [ ] Build FeatureGrid highlights
- [ ] Assemble Home page
- [ ] Build About page
- [ ] Build Ask page placeholder
- [ ] Apply dark cosmic theme
- [ ] Add Framer Motion entrance animations
- [ ] Ensure mobile responsive layout
- [ ] Verify: Build passes, all pages render correctly
- [ ] Update brain/STATE.md
- [ ] Update brain/PROGRESS_LOG.md

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
