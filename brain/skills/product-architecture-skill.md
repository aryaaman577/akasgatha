# Skill: Product Architecture

> How to keep the product buildable, focused, and on track.

---

## Scope Control

- **MVP scope is fixed.** The 12 features listed in PROJECT_BRIEF.md are the only features to build.
- Before adding anything, ask: "Is this in the MVP scope?" If not, do not add it.
- Feature requests beyond MVP go to the "Future Scope" section of the report, not into the code.
- If a feature seems essential but isn't in scope, document it in DECISIONS.md and move on.

## MVP Discipline

- Build the minimum version that demonstrates the concept effectively.
- A working demo with 3 features is better than a broken demo with 10 features.
- Every feature must work end-to-end before moving to the next feature.
- "It works" is the acceptance criteria, not "it's perfect."

## Feature Priority

| Priority | Features |
|---|---|
| P0 (Must work) | Jigyasa Engine (question → AI response), Response sections, Docker deployment |
| P1 (Should work) | Akas Dwar (hero), Akas Granth (library), 3D scenes, Quiz |
| P2 (Nice to have) | Framer Motion polish, Glassmorphism effects, Follow-up questions |

If running low on time, P0 features must be complete. P1 features should be complete. P2 features can be simplified.

## No Overengineering

- Do not build abstractions for features you won't use.
- Do not create a "plugin system" for LLM providers — a simple if/else is fine.
- Do not add database migrations for a project with no database.
- Do not add CI/CD pipelines unless required by the internship.
- Do not add monitoring, alerting, or observability beyond console logs.
- Do not add internationalization unless asked.

## Phase-Based Development

- Complete one phase fully before starting the next.
- Each phase should end with a working build: `npm run build` passes.
- Each phase should be independently verifiable.
- If Phase N breaks Phase N-1, fix it before proceeding to Phase N+1.
- Update brain state files after every phase — this is how agents track progress.
