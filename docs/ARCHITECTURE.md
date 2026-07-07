# Architecture Document — AkasGatha

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                       │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Akas Dwar  │  │ Akas Granth  │  │ Jigyasa Engine│  │
│  │  (Landing)  │  │  (Library)   │  │  (Ask + View) │  │
│  └─────────────┘  └──────────────┘  └───────┬───────┘  │
│                                             │           │
│  ┌──────────────────────────────────────────┘           │
│  │  Response Cards: Katha Mandal, Rahasya Chakra,      │
│  │  Vigyan Drishti, Satya Setu, Pramaan Matrix,        │
│  │  Drishya Yantra, Jigyasa Agni, Smriti Quest         │
│  └──────────────────────────────────────────────────┐   │
│                                                     │   │
│  ┌──────────────┐                                   │   │
│  │ 3D Scenes    │ ← React Three Fiber (lazy loaded) │   │
│  │ (3 templates)│                                   │   │
│  └──────────────┘                                   │   │
└─────────────────────────────┬───────────────────────────┘
                              │ POST /api/jigyasa
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS SERVER (API Routes)           │
│                                                         │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ /api/health   │  │ /api/jigyasa │  │  Middleware  │  │
│  │ (health check)│  │ (main query) │  │ (rate limit, │  │
│  └───────────────┘  └──────┬───────┘  │  validation) │  │
│                            │          └─────────────┘   │
│  ┌─────────────────────────┘                            │
│  │                                                      │
│  ▼                                                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              LLM PROVIDER LAYER                  │   │
│  │                                                  │   │
│  │  ┌──────────┐    ┌──────────┐    ┌───────────┐   │   │
│  │  │  Gemini  │    │ watsonx  │    │ Fallback  │   │   │
│  │  │  (primary)│   │(optional)│    │ (mock)    │   │   │
│  │  └──────────┘    └──────────┘    └───────────┘   │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐    │   │
│  │  │  Prompt Builder + Response Validator     │    │   │
│  │  │  (Zod schema + content safety check)     │    │   │
│  │  └──────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  DEPLOYMENT LAYER                       │
│                                                         │
│  ┌──────────────┐     ┌──────────────────────────────┐  │
│  │   Docker     │ ──► │   AWS EC2 Instance           │  │
│  │   Container  │     │   (Ubuntu + Docker + Nginx)  │  │
│  └──────────────┘     └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Framework
- **Next.js 14+ App Router** with TypeScript
- Server Components for static pages, Client Components for interactive sections

### Styling
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for consistent, accessible component primitives
- Custom design tokens for AkasGatha's cinematic theme (dark cosmic palette)

### Animation
- **Framer Motion** for page transitions, card reveals, and micro-interactions
- CSS animations for simpler effects (gradients, glows)

### 3D Rendering
- **React Three Fiber** + **@react-three/drei** for 3D scenes
- Lazy-loaded with `React.lazy()` and `Suspense`
- Fallback 2D illustration if WebGL is unavailable or performance is poor

### Page Structure

```
app/
├── layout.tsx          — Root layout (Navbar, Footer, fonts, metadata)
├── page.tsx            — Home: Akas Dwar + Akas Granth + features
├── ask/
│   └── page.tsx        — Jigyasa Engine + Response sections
├── about/
│   └── page.tsx        — About page with content safety note
└── api/
    ├── health/
    │   └── route.ts    — Health check endpoint
    └── jigyasa/
        └── route.ts    — Main AI query endpoint
```

### Component Architecture

```
components/
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── home/
│   ├── AkasDwar.tsx         — Hero section
│   ├── AkasGranth.tsx       — Topic library grid
│   └── FeatureGrid.tsx      — Feature highlight cards
├── jigyasa/
│   ├── QuestionInput.tsx    — Question form
│   ├── ResponseView.tsx     — Full response layout
│   ├── KathaMandal.tsx      — Cultural story card
│   ├── RahasyaChakra.tsx    — Mystery card
│   ├── VigyanDrishti.tsx    — Science card
│   ├── SatyaSetu.tsx        — Bridge card
│   ├── PramaanMatrix.tsx    — Evidence card
│   ├── JigyasaAgni.tsx      — Follow-up questions
│   └── SmritiQuest.tsx      — Quiz card
├── three/
│   ├── SceneWrapper.tsx     — Lazy-loading wrapper
│   ├── CosmicSky.tsx        — Starfield scene
│   ├── EclipseScene.tsx     — Eclipse animation
│   └── PlanetOrbit.tsx      — Orbital mechanics
└── ui/                      — Shadcn UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

## Backend / API Architecture

### API Routes (Next.js Route Handlers)

All API logic runs **server-side only**. No API keys are exposed to the browser.

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check for Docker/AWS monitoring |
| `/api/jigyasa` | POST | Accept question, call LLM, return structured response |

### Request/Response Flow

```
1. Client sends POST /api/jigyasa
   { question, mood, topicType }

2. Server validates input with Zod

3. Server builds prompt from PROMPT_CONTRACT

4. Server calls Gemini API (server-side only)

5. Server receives raw LLM response

6. Server parses JSON from LLM response

7. Server validates parsed JSON with Zod response schema

8. If valid → return structured response
   If invalid → return a safe fallback response that still matches `JigyasaResponseSchema`
```

## LLM Provider Layer

```typescript
// Simplified provider interface
interface LLMProvider {
  name: string;
  generateResponse(prompt: string): Promise<string>;
}

// Provider selection based on env
const provider = getProvider(process.env.LLM_PROVIDER);
// "gemini" → GeminiProvider
// "watsonx" → WatsonxProvider (optional, future)
// "mock"   → MockProvider (for development/testing)
```

### Provider Priority
1. **Gemini API** (primary, via `@google/generative-ai`)
2. **Mock Provider** (for development without API key)
3. **IBM watsonx** (optional, future extension)

## Response Validation Flow

```
Raw LLM Text
    │
    ▼
Extract JSON (find first { ... } block)
    │
    ▼
Parse JSON (JSON.parse with try/catch)
    │
    ▼
Validate with Zod ResponseSchema
    │
    ├── Valid → Return to client
    │
    └── Invalid → Return safe fallback response
         (must match JigyasaResponseSchema exactly; log fallback server-side only)
```

## 3D Scene Mapping

The AI response includes a `sceneType` field. The frontend maps it to a 3D component:

| sceneType | Component | Use Cases |
|---|---|---|
| `cosmic_sky` | `CosmicSky.tsx` | Nakshatras, constellations, night sky topics |
| `eclipse` | `EclipseScene.tsx` | Solar/lunar eclipses, Rahu/Ketu topics |
| `planet_orbit` | `PlanetOrbit.tsx` | Planets, orbital mechanics, graha topics |

If `sceneType` is unrecognized or WebGL is unavailable, render a static fallback illustration.

## No-Database MVP Decision

**Decision**: No database in MVP.

**Rationale**:
- All content is generated on-the-fly by the AI
- No user accounts = no user data to store
- Topic library is a static JSON array (hardcoded topics)
- Quiz answers are checked client-side (no persistence)
- Reduces deployment complexity (no DB setup on EC2)
- Sufficient for internship demo

**Trade-off**: No conversation history, no analytics, no saved responses. Acceptable for MVP.

## Docker / AWS Deployment Architecture

```
┌──────────────────────────────────────────────┐
│              AWS EC2 Instance                 │
│              (Ubuntu 22.04 LTS)              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │           Docker Container             │  │
│  │                                        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │   Next.js Standalone Server      │  │  │
│  │  │   (Port 3000 internal)           │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │                                        │  │
│  │  Environment Variables:                │  │
│  │  - GEMINI_API_KEY (from .env on host)  │  │
│  │  - LLM_PROVIDER                        │  │
│  │  - RATE_LIMIT_MAX                      │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Port mapping: 80:3000                       │
│                                              │
│  Security Group:                             │
│  - SSH (22) from your IP only               │
│  - HTTP (80) from anywhere                  │
│  - HTTPS (443) from anywhere (optional)     │
│  - All other ports CLOSED                   │
└──────────────────────────────────────────────┘
```

### Docker Setup

```
Dockerfile              — Multi-stage build (deps → build → production)
.dockerignore           — Exclude node_modules, .env, .git, .next
docker-compose.yml      — Optional, for local Docker development
```

### Dockerfile Strategy

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
# Install production dependencies

# Stage 2: Build
FROM node:20-alpine AS builder
# Build Next.js with standalone output

# Stage 3: Production
FROM node:20-alpine AS runner
# Copy standalone output + static files
# Run as non-root user
# Expose port 3000
```

## Folder Structure

```
AkasGatha/
├── docs/                          # Project documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── PROMPT_CONTRACT.md
│   ├── SECURITY.md
│   ├── THREAT_MODEL.md
│   ├── SECURITY_LAYERS.md
│   ├── TEST_PLAN.md
│   ├── DEPLOYMENT_RUNBOOK.md
│   └── REPORT_DRAFT.md
├── brain/                         # Agent-readable project brain
│   ├── PROJECT_BRIEF.md
│   ├── AGENT_RULES.md
│   ├── ROADMAP.md
│   ├── STATE.md
│   ├── TODO.md
│   ├── DECISIONS.md
│   ├── PROGRESS_LOG.md
│   ├── QUALITY_CHECKLIST.md
│   ├── SECURITY_CHECKLIST.md
│   ├── prompts/                   # Phase-wise agent prompts
│   │   ├── MASTER_BUILD_PROMPT.md
│   │   ├── PHASE_0_DOCS_PROMPT.md
│   │   ├── PHASE_1_SETUP_PROMPT.md
│   │   ├── PHASE_2_FRONTEND_PROMPT.md
│   │   ├── PHASE_3_MOCK_JIGYASA_PROMPT.md
│   │   ├── PHASE_4_MOCK_BACKEND_PROMPT.md
│   │   ├── PHASE_5_LLM_INTEGRATION_PROMPT.md
│   │   ├── PHASE_6_3D_SCENES_PROMPT.md
│   │   ├── PHASE_7_SECURITY_HARDENING_PROMPT.md
│   │   ├── PHASE_8_DOCKER_AWS_PROMPT.md
│   │   ├── DEBUG_PROMPT.md
│   │   ├── SECURITY_REVIEW_PROMPT.md
│   │   ├── UI_POLISH_PROMPT.md
│   │   └── REPORT_WRITING_PROMPT.md
│   └── skills/                    # Agent skill reference files
│       ├── product-architecture-skill.md
│       ├── frontend-ui-skill.md
│       ├── section-design-skill.md
│       ├── threejs-scene-skill.md
│       ├── llm-response-skill.md
│       ├── prompt-engineering-skill.md
│       ├── api-security-skill.md
│       ├── advanced-security-skill.md
│       ├── docker-aws-skill.md
│       ├── testing-debugging-skill.md
│       ├── performance-accessibility-skill.md
│       └── content-safety-research-skill.md
├── src/                           # Application source (created in Phase 1)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── ask/page.tsx
│   │   ├── about/page.tsx
│   │   └── api/
│   │       ├── health/route.ts
│   │       └── jigyasa/route.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── jigyasa/
│   │   ├── three/
│   │   └── ui/
│   ├── lib/
│   │   ├── llm/
│   │   │   ├── provider.ts
│   │   │   ├── gemini.ts
│   │   │   ├── mock.ts
│   │   │   └── prompt-builder.ts
│   │   ├── schemas/
│   │   │   ├── request.ts
│   │   │   └── response.ts
│   │   ├── security/
│   │   │   ├── rate-limiter.ts
│   │   │   └── sanitize.ts
│   │   ├── data/
│   │   │   └── topics.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── images/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README_FIRST.md
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
