# AkasGatha — Phase Status Tracker

**Last Updated:** 2026-07-19

## Phase Summary

| Phase | Title | Status | Completion Date |
|-------|-------|--------|-----------------|
| 0 | Documentation & Planning | ✓ COMPLETE | 2024-12 |
| 1 | Next.js Foundation | ✓ COMPLETE | 2024-12 |
| 2 | Frontend Foundation | ✓ COMPLETE | 2024-12 |
| 3 | Mock Jigyasa Experience | ✓ COMPLETE | 2024-12 |
| 4A | Secure Backend Foundation | ✓ COMPLETE | 2024-12 |
| 4B | RAG Pipeline | ✓ COMPLETE | 2026-07-19 |
| 5 | Real Jigyasa AI (Gemini) | ✓ COMPLETE | 2026-07-19 |
| 6 | Dynamic 3D Scenes | 🔜 PLANNED | — |
| 7 | Security Hardening | 🔜 PLANNED | — |
| 8 | Docker & AWS Deployment | 🔜 PLANNED | — |

---

## Phase 0: Documentation & Planning
**Status:** ✓ COMPLETE  
**Commit:** b54170c

### Deliverables
- Project Brief
- Product Requirements Document (PRD)
- Architecture Design
- API Specification
- Security Guidelines
- Quality Checklist
- Deployment Runbook

---

## Phase 1-2: Foundation
**Status:** ✓ COMPLETE  
**Commits:** 496be6b, 61684ae, 2b8a941

### Deliverables
- Next.js 16 App Router setup
- TypeScript + TailwindCSS configuration
- Responsive layout (Navbar, Footer)
- Homepage with hero section
- About page
- Granth page
- Basic Three.js integration
- Mobile-responsive design

---

## Phase 3: Mock Jigyasa Experience
**Status:** ✓ COMPLETE  
**Commits:** ad94a04, dfe46a2, 3628943

### Deliverables
- `/ask` page with question form
- Mock response display
- Loading states
- Error handling UI
- Language toggle (EN/HI/Hinglish)
- Responsive Jigyasa interface
- Visual polish

---

## Phase 4A: Secure Backend Foundation
**Status:** ✓ COMPLETE  
**Commit:** fc0cc07

### Deliverables
- `/api/jigyasa` route with validation
- `/api/health` health check endpoint
- Server-only environment configuration
- Request ID generation
- Rate limiting (in-memory)
- Timeout and cancellation support
- Provider abstraction (mock provider)
- Structured request/response schemas
- Safe logging (no secrets)
- Jest test setup

### Validation
```bash
npm test               # ✓ PASS
npm run type-check     # ✓ PASS
npm run build          # ✓ PASS
```

---

## Phase 4B: RAG Pipeline
**Status:** ✓ COMPLETE  
**Commits:** 4edd99d, 17df4be, b007d73, 44dceec, 672c115

### Deliverables

#### Phase 4B-1: Corpus & Validation
- 20 validated knowledge documents
  - 10 science (astronomy, eclipses, moon phases, etc.)
  - 4 narrative (Rahu-Ketu, nakshatra)
  - 5 boundary (Katha/Vigyan separation policy)
  - 1 glossary
- Frontmatter schema validation
- Duplicate ID detection
- Source URL verification
- Content hash generation
- `npm run rag:validate` script

#### Phase 4B-2: Chunking
- Paragraph-aware chunking
- Token counting with `tiktoken`
- Configurable chunk size (default: 512 tokens)
- Chunk overlap (default: 50 tokens)
- Metadata preservation
- Deterministic chunk IDs
- Citation ID generation
- `npm run rag:chunk` script

#### Phase 4B-3: Local Vector Index
- Deterministic TF-IDF embeddings (384 dimensions)
- Content hashing for incremental updates
- Cosine similarity search
- File-based persistence (data/rag/index.json)
- Index manifest with provenance
- No external API dependencies
- `npm run rag:ingest` script

#### Phase 4B-4: Hybrid Retrieval
- Semantic similarity (40%)
- Keyword matching (10%)
- Topic aliases with exact-match boost (50%)
- Metadata boost (domain weighting)
- Diversity constraint (max 2 chunks per document)
- Intent classification (science/narrative/mixed)
- Domain filtering
- Language filtering
- `npm run rag:test` script

#### Phase 4B Cleanup (Commit 672c115)
- Corrected IAU constellation source URL
- Fixed score presentation (no >100% display)
- Documented score normalization

### Validation
```bash
npm run rag:validate   # ✓ PASS (20 docs)
npm run rag:ingest     # ✓ PASS (20 chunks)
npm run rag:test       # ✓ PASS (15/15 tests)
npm test               # ✓ PASS (17/17 tests)
npm run type-check     # ✓ PASS
npm run build          # ✓ PASS
```

### Test Results
- Intent classification: 10/10 ✓
- Prompt injection resistance: 5/5 ✓
- Total: 15/15 passed ✓

---

## Phase 5: Real Jigyasa AI (Gemini)
**Status:** ✓ COMPLETE  
**Date:** 2026-07-19  
**Commit:** (to be added)

### Deliverables

#### Core Implementation
- Gemini provider using official @google/genai SDK (v2.12.0)
- Server-only API key handling
- Environment-configurable model (GEMINI_MODEL)
- RAG-grounded answer synthesis
- Structured JSON output validation
- Citation allowlist enforcement
- Citation metadata (server-derived titles and URLs)
- Katha/Vigyan separation logic
- Uncertainty communication
- Insufficient knowledge handling
- Out-of-scope detection
- Prompt injection resistance
- English, Hindi, and Hinglish support

#### System Architecture
- System instruction (versioned, tested)
- Citation validator (allowlist-based)
- Context builder (grouped by domain)
- Error mapping (14 error codes)
- Retry logic (bounded, selective)
- Timeout and abort support

#### Testing
- Jest unit tests (17/17 passed)
- RAG integration tests (15/15 passed)
- Real Gemini integration test script
- Manual browser verification checklist

#### Documentation
- Phase 5 complete guide (PHASE_5_JIGYASA_AI.md)
- User setup instructions (MANUAL_SETUP.md)
- Updated phase status (this file)
- Extended .env.example

### Configuration
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=<user-supplied>
GEMINI_MODEL=gemini-3.5-flash
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_OUTPUT_TOKENS=1800
GEMINI_MAX_RETRIES=1
JIGYASA_REQUIRE_RAG=true
JIGYASA_MIN_RAG_RESULTS=1
JIGYASA_MAX_CONTEXT_CHARS=10000
```

### Validation
```bash
npm run rag:validate    # ✓ PASS
npm run rag:ingest      # ✓ PASS
npm run rag:test        # ✓ PASS (15/15)
npm test                # ✓ PASS (17/17)
npm run type-check      # ✓ PASS
npm run build           # ✓ PASS
npm run ai:test-gemini  # ⚠ USER KEY REQUIRED
```

### Known Limitations
- Corpus coverage: 20 documents only
- Free-tier Gemini rate limits
- Local RAG (no hosted vector DB)
- In-memory rate limiting
- No persistent history
- No dynamic 3D scenes (Phase 6)
- No production auth/database

### Security Verification
✓ API key server-only  
✓ No `NEXT_PUBLIC_` key variable  
✓ No secret in logs, responses, or Git  
✓ No prompt disclosure  
✓ Citation allowlist enforced  
✓ No arbitrary URL fetch  
✓ No unsafe HTML  
✓ Rate limit, timeout, abort active  

---

## Phase 6: Dynamic 3D Scenes (Planned)

### Objectives
- Answer-driven Three.js scene generation
- Eclipse visualization
- Moon phase animation
- Planetary orbit visualization
- Constellation display
- Scene parameter extraction from answers
- Smooth scene transitions
- Mobile-responsive 3D

### Scope
- No auth, database, or history (still Phase 7-8)
- Focus on visual experience
- Reuse existing 3D foundation

---

## Phase 7: Security Hardening (Planned)

### Objectives
- Content Security Policy (CSP)
- Rate limiting (distributed, Redis-based)
- Input sanitization review
- Output escaping review
- Dependency security audit
- Secret rotation guidance
- Security headers
- CORS configuration
- API authentication
- User session management

---

## Phase 8: Docker & AWS Deployment (Planned)

### Objectives
- Multi-stage Docker build
- Health check endpoints
- Secrets management (AWS Secrets Manager)
- Environment variable configuration
- CDN setup (CloudFront)
- S3 static asset hosting
- ECS/Fargate deployment
- Application Load Balancer
- Auto-scaling configuration
- Monitoring and logging
- Deployment runbook

---

## Current State

### Working Features
✓ Homepage with hero and preview sections  
✓ About page with Cosmic Orrery visualization  
✓ Granth page (placeholder ready for content)  
✓ `/ask` Jigyasa interface with real AI  
✓ Mock mode (AI_PROVIDER=mock)  
✓ Gemini mode (AI_PROVIDER=gemini)  
✓ RAG-grounded answers  
✓ Citation validation  
✓ Katha/Vigyan separation  
✓ Multi-language support (EN/HI/Hinglish)  
✓ Loading states, error handling, retry logic  
✓ Rate limiting and timeout  
✓ Request cancellation  
✓ Responsive design (mobile/tablet/desktop)  

### Not Yet Implemented
- Dynamic 3D scenes (Phase 6)
- Authentication (Phase 7)
- Database persistence (Phase 7)
- Saved chat history (Phase 7)
- User accounts (Phase 7)
- Production deployment (Phase 8)

---

## Commands Reference

### Development
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server
npm run lint             # Lint code
npm run type-check       # TypeScript check
npm test                 # Run Jest tests
```

### RAG System
```bash
npm run rag:validate     # Validate corpus
npm run rag:ingest       # Build vector index
npm run rag:test         # Test retrieval
npm run rag:inspect      # Inspect index
```

### AI System
```bash
npm run ai:test-gemini   # Test real Gemini (requires key)
```

---

## Repository State

**Branch:** master  
**Latest Phase 5 Commit:** (pending)  
**Untracked Files:** 52 files (preserved, not staged)

**Key Files:**
- `.env.example` - Environment template
- `.env.local` - User configuration (git-ignored)
- `data/rag/` - Vector index (generated)
- `content/knowledge/` - RAG corpus
- `docs/` - Documentation
- `tests/` - Jest tests
- `scripts/` - Build and maintenance scripts

---

## Next Action

**Phase 6:** Implement dynamic 3D scenes driven by answer content.

**Dependencies:** Phase 5 complete ✓

**Estimated Effort:** 1-2 weeks

**Key Tasks:**
1. Scene parameter extraction from structured answers
2. Eclipse visualization component
3. Moon phase animation
4. Planetary orbit system
5. Constellation mapper
6. Scene transition system
7. Mobile 3D optimization
8. Integration with `/ask` response display
