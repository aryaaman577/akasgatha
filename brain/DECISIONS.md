# Decision Log — AkasGatha

> Architectural and product decisions. Record the decision, rationale, and alternatives considered.

---

## Decision 001: Product Name

| Field | Value |
|---|---|
| **Decision** | Product name is **AkasGatha** |
| **Date** | 2026-07-07 |
| **Rationale** | "Akas" (sky) + "Gatha" (story/song) — captures the essence of sky stories |
| **Alternatives** | None — name is fixed by the project owner |
| **Rule** | Never rename. Never write "AkasGatha AI." |

---

## Decision 002: No Authentication in MVP

| Field | Value |
|---|---|
| **Decision** | No login, auth, or user accounts in MVP |
| **Date** | 2026-07-07 |
| **Rationale** | No user data to protect. Demo project doesn't need accounts. Reduces complexity significantly. |
| **Alternatives** | NextAuth.js — rejected for MVP scope control |
| **Impact** | No saved history, no personalization. Acceptable for internship demo. |

---

## Decision 003: No Database in MVP

| Field | Value |
|---|---|
| **Decision** | No database. All content generated on-the-fly by AI. |
| **Date** | 2026-07-07 |
| **Rationale** | Topics are static JSON. AI responses are ephemeral. No user data to persist. Eliminates DB setup on EC2. |
| **Alternatives** | SQLite, Supabase — rejected for scope control |
| **Impact** | No conversation history, no analytics. Acceptable for MVP. |

---

## Decision 004: No Music/Voice in MVP

| Field | Value |
|---|---|
| **Decision** | No background music or voice narration |
| **Date** | 2026-07-07 |
| **Rationale** | Polish feature, not core functionality. Adds complexity (audio licensing, TTS APIs). |
| **Alternatives** | Web Speech API, ElevenLabs — deferred to future scope |
| **Impact** | Less immersive but still visually cinematic. |

---

## Decision 005: 3 Reusable 3D Templates

| Field | Value |
|---|---|
| **Decision** | Build exactly 3 reusable 3D scene templates: cosmic_sky, eclipse, planet_orbit |
| **Date** | 2026-07-07 |
| **Rationale** | Covers major topic categories. Custom 3D per topic is out of scope. 3 templates demonstrate capability without overengineering. |
| **Alternatives** | Per-topic custom 3D — rejected (too time-consuming for MVP) |
| **Impact** | Multiple topics share the same scene type. Acceptable — the AI still provides unique content. |

---

## Decision 006: Separate Mythology from Science

| Field | Value |
|---|---|
| **Decision** | Every AI response must structurally and visually separate cultural story from scientific explanation |
| **Date** | 2026-07-07 |
| **Rationale** | Core product principle. Prevents misinformation. Demonstrates responsible AI usage. Required for educational credibility. |
| **Alternatives** | Mixed narrative — rejected (violates content safety principles) |
| **Impact** | Response schema has distinct fields. UI has distinct cards. Validated in code. |

---

## Decision 007: Docker + AWS for Cloud Proof

| Field | Value |
|---|---|
| **Decision** | Containerize with Docker, deploy on AWS EC2 |
| **Date** | 2026-07-07 |
| **Rationale** | Internship requires demonstrating cloud computing skills. Docker + EC2 is the standard proof. |
| **Alternatives** | Vercel (too simple — no Docker proof), AWS ECS (overkill for MVP), Railway (not AWS) |
| **Impact** | More deployment work, but satisfies internship requirements. |

---

## Decision 008: Gemini API as Primary LLM

| Field | Value |
|---|---|
| **Decision** | Use Google Gemini API as primary LLM provider |
| **Date** | 2026-07-07 |
| **Rationale** | Free tier available. Good structured output. Official SDK for Node.js. |
| **Alternatives** | IBM watsonx (optional later), OpenAI (costs money), Ollama (needs local GPU) |
| **Impact** | Dependency on Google's API availability and rate limits. |

---

## Decision 009: In-Memory Rate Limiting

| Field | Value |
|---|---|
| **Decision** | Use in-memory rate limiting (Map-based, per-IP) |
| **Date** | 2026-07-07 |
| **Rationale** | Simple, no external dependency. Sufficient for single-instance MVP. |
| **Alternatives** | Redis rate limiting — overkill for MVP; adds dependency |
| **Impact** | Resets on server restart. Not distributed. Acceptable for demo. |

---

## Decision 010: Next.js App Router

| Field | Value |
|---|---|
| **Decision** | Use Next.js App Router (not Pages Router) |
| **Date** | 2026-07-07 |
| **Rationale** | Modern standard. Server Components support. Route Handlers for API. Better for new projects. |
| **Alternatives** | Pages Router — legacy; Vite — no SSR/API routes built-in |
| **Impact** | Learning curve for App Router patterns. Standard for 2024+ Next.js projects. |
