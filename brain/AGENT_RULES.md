# Agent Rules — AkasGatha

> **These rules are non-negotiable. Read and follow them before writing any code.**

---

## Identity Rules

1. **Product name is AkasGatha.** Do not rename it. Do not abbreviate it. Do not modify it.
2. **Do not write "AkasGatha AI"** as the product name. The product name is exactly `AkasGatha`.
3. Use `AkasGatha` in all headings, metadata, UI text, and code comments.

---

## Content Safety Rules

4. **Do not present mythology as scientific proof.** Every cultural story must be clearly labeled as "Cultural Story."
5. **Do not generate astrology predictions**, horoscopes, birth charts, or fortune-telling content. This is an educational platform about astronomy, not astrology.
6. **Do not claim ancient texts "predicted" modern science** unless providing a specific, verifiable citation.
7. **Always separate cultural story from scientific explanation** — structurally (different JSON fields) and visually (different UI cards).
8. **Use respectful language** for cultural traditions while maintaining scientific accuracy.

---

## Development Rules

9. **Work phase by phase.** Read the ROADMAP.md and only work on the currently requested phase. Do not jump ahead.
10. **Do not add out-of-scope features.** Check the "NOT in MVP Scope" list in PROJECT_BRIEF.md before adding anything. If it's not listed as in-scope, do not add it.
11. **Do not rewrite unrelated files.** When working on Phase 3, do not modify Phase 2 files unless fixing a bug discovered during Phase 3.
12. **Do not refactor working code** unless explicitly asked. If it works and passes checks, leave it alone.
13. **Keep it buildable.** After every change, verify:
    - `npx tsc --noEmit` (type check)
    - `npm run lint` (lint)
    - `npm run build` (build)

---

## Security Rules

14. **Do not expose API keys to the frontend.** Never use `NEXT_PUBLIC_` prefix for any secret or API key.
15. **All LLM calls must be server-side only** — in Next.js Route Handlers (`src/app/api/*/route.ts`).
16. **Never use `dangerouslySetInnerHTML`** with AI-generated content. Use React JSX auto-escaping.
17. **Never return raw LLM errors** to the client. Use safe, generic error messages.
18. **Never log API keys or full secrets.** Log only `key ? 'set' : 'missing'`.
19. **Validate all input with Zod** before processing. Never pass raw input to the LLM.
20. **Validate all LLM output with Zod** before returning to the client. Use fallback response on failure.

---

## State Management Rules

21. **Update STATE.md** after completing every phase. Change `currentPhase`, `nextPhase`, and `completedPhases`.
22. **Update PROGRESS_LOG.md** after every phase with what was done, what works, and what was tested.
23. **Update TODO.md** by checking off completed items after every phase.
24. **Do not delete or overwrite brain files.** Only append to PROGRESS_LOG.md and DECISIONS.md. Update (not delete) STATE.md and TODO.md.

---

## Code Quality Rules

25. **Use TypeScript strict mode.** No `any` types unless absolutely unavoidable and documented.
26. **Follow existing code patterns.** If components use a certain pattern, new components should follow the same pattern.
27. **Use Shadcn UI components** for UI primitives (buttons, cards, inputs). Do not create custom versions of existing Shadcn components.
28. **Use Tailwind CSS** for styling. Do not add external CSS libraries beyond what is already in the stack.
29. **Use Framer Motion** for animations. Do not add other animation libraries.
30. **Use Zod** for all validation. Do not use manual validation or other validation libraries.

---

## What NOT to Do

- ❌ Do not add login/auth
- ❌ Do not add a database
- ❌ Do not add an admin dashboard
- ❌ Do not add music or voice narration
- ❌ Do not add PDF generation inside the app
- ❌ Do not add a real star map
- ❌ Do not generate astrology predictions
- ❌ Do not add social features
- ❌ Do not add payment systems
- ❌ Do not create custom heavy 3D animations for every topic
- ❌ Do not use `NEXT_PUBLIC_` for API keys
- ❌ Do not use `dangerouslySetInnerHTML` with AI content
- ❌ Do not commit `.env` files
- ❌ Do not rename the project
- ❌ Do not skip phases
- ❌ Do not ignore TypeScript errors
- ❌ Do not add dependencies without justification

---

## How to Update Progress

After completing any phase:

```markdown
1. Open brain/STATE.md
   - Update currentPhase to the completed phase
   - Update nextPhase to the next phase
   - Add the phase to completedPhases list

2. Open brain/PROGRESS_LOG.md
   - Add a new entry with:
     - Date
     - Phase completed
     - What was done
     - What was tested
     - Issues found (if any)

3. Open brain/TODO.md
   - Check off completed items with [x]

4. Run verification:
   - npx tsc --noEmit
   - npm run lint
   - npm run build
```

---

## How to Avoid Breaking Working Code

1. **Read existing code** before modifying any file
2. **Run the full check suite** after every change: `npx tsc --noEmit && npm run lint && npm run build`
3. **Test in browser** after every UI change
4. **Test API endpoints** with curl after every API change
5. **Do not modify files outside your current phase** unless fixing a direct bug
6. **If unsure, ask** rather than making assumptions about product intent
