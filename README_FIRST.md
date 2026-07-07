# README FIRST — AkasGatha

> **Read this before writing any code.**

---

## What Is This?

This is the **Phase 0 Planning Pack** for AkasGatha — a cinematic educational web platform that explains ancient Indian sky stories alongside modern space science.

This pack contains everything a developer or coding agent needs to understand, build, and deploy the project.

---

## How to Use This Pack

### If You're a Developer

1. **Start here** → Read this file
2. **Understand the product** → Read `brain/PROJECT_BRIEF.md`
3. **Know the rules** → Read `brain/AGENT_RULES.md`
4. **See the plan** → Read `brain/ROADMAP.md`
5. **Check current state** → Read `brain/STATE.md`
6. **Start building** → Follow `brain/prompts/PHASE_1_SETUP_PROMPT.md`

### If You're a Coding Agent (AI)

1. Read `brain/PROJECT_BRIEF.md` first
2. Read `brain/AGENT_RULES.md` — these rules are non-negotiable
3. Read `brain/STATE.md` — understand what phase to work on
4. Read the relevant `brain/prompts/PHASE_X_*.md` for your current task
5. Read relevant `brain/skills/*.md` for implementation guidance
6. After work: update `brain/STATE.md`, `brain/PROGRESS_LOG.md`, and `brain/TODO.md`

### If You're an Evaluator

1. Read `docs/PRD.md` for product overview
2. Read `docs/ARCHITECTURE.md` for system design
3. Read `docs/SECURITY.md` for security approach
4. Read `docs/REPORT_DRAFT.md` for the internship report

---

## Folder Structure

```
AkasGatha/
├── docs/                   # Formal project documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── ARCHITECTURE.md     # System architecture
│   ├── API_SPEC.md         # API endpoint specification
│   ├── PROMPT_CONTRACT.md  # LLM prompt and response rules
│   ├── SECURITY.md         # Security guide
│   ├── THREAT_MODEL.md     # Threat analysis
│   ├── SECURITY_LAYERS.md  # 10-layer security plan
│   ├── TEST_PLAN.md        # Testing strategy
│   ├── DEPLOYMENT_RUNBOOK.md # Deployment steps
│   └── REPORT_DRAFT.md     # Internship report draft
├── brain/                  # Agent-readable project brain
│   ├── PROJECT_BRIEF.md    # Quick project summary
│   ├── AGENT_RULES.md      # Rules for coding agents
│   ├── ROADMAP.md          # Phase-wise development plan
│   ├── STATE.md            # Current project state
│   ├── TODO.md             # Phase-wise checklist
│   ├── DECISIONS.md        # Decision log
│   ├── PROGRESS_LOG.md     # Work progress history
│   ├── QUALITY_CHECKLIST.md # Quality verification
│   ├── SECURITY_CHECKLIST.md # Security verification
│   ├── prompts/            # Phase-specific agent prompts
│   └── skills/             # Implementation skill guides
├── README_FIRST.md         # This file
├── .env.example            # Environment variable template
└── .gitignore              # Git ignore rules
```

---

## Key Principles

1. **Product name is AkasGatha** — never rename, never add "AI"
2. **Separate mythology from science** — always, structurally and visually
3. **Phase-based development** — one phase at a time, no skipping
4. **Security from the start** — API keys server-side, input validation, safe errors
5. **Keep it buildable** — MVP discipline, no overengineering
6. **Update the brain** — state files, progress log, and TODO after every phase

---

## Quick Start (After Phase 1 Setup)

```bash
# Install dependencies
npm ci

# Create environment file
cp .env.example .env
# Edit .env with your real GEMINI_API_KEY

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## Next Step

→ Follow `brain/prompts/PHASE_1_SETUP_PROMPT.md` to initialize the Next.js project.
