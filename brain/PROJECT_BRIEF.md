# Project Brief — AkasGatha

> **Read this file first before doing any work on this project.**

---

## Product Summary

**AkasGatha** is a cinematic educational web platform that explains ancient Indian sky stories (planets, nakshatras, eclipses, moon phases, cosmic mysteries) alongside modern space science. It uses Generative AI (Gemini API) to produce structured, multi-section responses that clearly separate cultural story from scientific evidence.

**Product name is AkasGatha.** Do not rename. Do not write "AkasGatha AI."

---

## MVP Scope

### Included in MVP

1. **Akas Dwar** — Cinematic landing section (hero, tagline, CTA)
2. **Akas Granth** — Topic library grid with preset cosmic topics
3. **Jigyasa Engine** — Question input + structured AI response
4. **Katha Mandal** — Cultural story response section (labeled "Cultural Story")
5. **Rahasya Chakra** — Mystery/curiosity response section
6. **Vigyan Drishti** — Modern science response section
7. **Satya Setu** — Bridge between story and science
8. **Pramaan Matrix** — Evidence grading (proven / symbolic / unknown)
9. **Drishya Yantra** — 3 reusable 3D scenes (cosmic sky, eclipse, planet orbit)
10. **Jigyasa Agni** — 3 AI-generated follow-up questions
11. **Smriti Quest** — Quiz/revision section (3–5 questions per topic)
12. **Docker + AWS EC2 deployment**

### NOT in MVP Scope

- Login / Authentication
- Database / Persistence
- Admin Dashboard
- Music / Voice Narration
- PDF Generator
- Real Star Map
- Astrology Prediction (never — against product principles)
- Social Feed
- Payment System
- Custom heavy 3D animation per topic

---

## Key Modules

| Module | Location | Purpose |
|---|---|---|
| Home Page | `src/app/page.tsx` | Akas Dwar + Akas Granth + features |
| Ask Page | `src/app/ask/page.tsx` | Jigyasa Engine + response view |
| About Page | `src/app/about/page.tsx` | Project info + content safety note |
| Health API | `src/app/api/health/route.ts` | Health check endpoint |
| Jigyasa API | `src/app/api/jigyasa/route.ts` | AI query endpoint |
| LLM Provider | `src/lib/llm/` | Gemini integration + prompt builder |
| Schemas | `src/lib/schemas/` | Zod request + response schemas |
| Security | `src/lib/security/` | Rate limiter + sanitizer |
| 3D Scenes | `src/components/three/` | React Three Fiber components |
| Response Cards | `src/components/jigyasa/` | Section display components |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| UI Components | Shadcn UI |
| Animation | Framer Motion |
| 3D Rendering | React Three Fiber + drei |
| Validation | Zod |
| AI Provider | Google Gemini API (primary) |
| Container | Docker (multi-stage build) |
| Cloud | AWS EC2 (Ubuntu) |

---

## Security Principles

1. **Server-side secrets only** — Never expose API keys to the browser
2. **Input validation first** — Validate all input with Zod before processing
3. **Rate limiting** — Prevent API abuse with per-IP rate limits
4. **Prompt injection defense** — Detect, validate output, fallback on failure
5. **No raw HTML** — Never use `dangerouslySetInnerHTML` with AI content
6. **Safe errors** — Never expose stack traces, raw LLM errors, or secrets in responses
7. **Content safety** — Never present mythology as scientific proof
8. **Docker hardening** — Non-root user, no secrets in image
9. **AWS hardening** — Restrictive security groups, SSH restricted by IP

---

## Key Documents

| Document | Location | Purpose |
|---|---|---|
| PRD | `docs/PRD.md` | Product requirements |
| Architecture | `docs/ARCHITECTURE.md` | System design |
| API Spec | `docs/API_SPEC.md` | Endpoint contracts |
| Prompt Contract | `docs/PROMPT_CONTRACT.md` | LLM prompt rules |
| Security | `docs/SECURITY.md` | Security guide |
| Threat Model | `docs/THREAT_MODEL.md` | Risk analysis |
| Roadmap | `brain/ROADMAP.md` | Phase-wise plan |
| Agent Rules | `brain/AGENT_RULES.md` | Coding rules |
| State | `brain/STATE.md` | Current project state |
