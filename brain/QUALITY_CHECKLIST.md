# Quality Checklist — AkasGatha

Use this checklist before submitting each phase and before final submission.

---

## UI Quality

- [ ] Dark cosmic theme is consistent across all pages
- [ ] No bright white flashes or unstyled content
- [ ] Typography is clean and readable (Google Fonts: Inter or similar)
- [ ] Glassmorphism effects are subtle, not cluttered
- [ ] Cards have consistent padding, borders, and spacing
- [ ] Framer Motion animations are smooth (no jank)
- [ ] Hero section looks cinematic and impressive
- [ ] Topic grid is visually engaging
- [ ] Response cards are well-organized and scannable
- [ ] Mobile layout works at 375px width
- [ ] Tablet layout works at 768px width
- [ ] No horizontal scroll on any viewport
- [ ] Loading states look polished (skeletons, not spinners)
- [ ] Error states are user-friendly (not raw errors)
- [ ] All interactive elements have hover/focus states
- [ ] Color palette is harmonious (no clashing colors)

---

## Code Quality

- [ ] TypeScript strict mode — no `any` types (or documented exceptions)
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` passes with zero errors
- [ ] Components are reusable and focused (single responsibility)
- [ ] No duplicate code across components
- [ ] File naming is consistent (PascalCase for components, camelCase for utilities)
- [ ] Imports are organized and clean
- [ ] No unused imports or variables
- [ ] No commented-out code blocks (remove or document why kept)
- [ ] Environment variables accessed only in server-side code
- [ ] Zod schemas used for all validation

---

## AI Response Quality

- [ ] AI responses follow the exact JSON schema from PROMPT_CONTRACT
- [ ] kathaMandal.label is always "Cultural Story"
- [ ] kathaMandal.disclaimer exists and is meaningful
- [ ] vigyanDrishti contains verifiable scientific facts
- [ ] satyaSetu honestly states alignment and divergence
- [ ] pramaanMatrix has honest evidence levels
- [ ] sceneType maps to a valid 3D scene
- [ ] jigyasaAgni has exactly 3 follow-up questions
- [ ] smritiQuest has 3–5 quiz questions with correct answers
- [ ] Fallback response works when AI fails
- [ ] No myth-as-proof language passes through

---

## Content Safety Quality

- [ ] No response presents mythology as scientific proof
- [ ] No astrology predictions generated
- [ ] No medical, religious, or supernatural overclaims
- [ ] Cultural stories are labeled and disclaimed
- [ ] Scientific sections contain verifiable information
- [ ] Evidence levels are honest (not inflated)
- [ ] Banned phrase scanner catches known bad patterns
- [ ] Prompt injection attempts return safe fallback
- [ ] Off-topic questions get polite redirect

---

## Security Quality

- [ ] No API keys in source code
- [ ] No `NEXT_PUBLIC_` for secrets
- [ ] `.env` in `.gitignore`
- [ ] All API input validated with Zod
- [ ] Rate limiting active
- [ ] Safe error responses (no stack traces)
- [ ] No `dangerouslySetInnerHTML` with AI content
- [ ] LLM responses validated before rendering
- [ ] Prompt injection detection active
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Docker container runs as non-root
- [ ] AWS SSH restricted to admin IP

---

## Deployment Quality

- [ ] Docker build succeeds cleanly
- [ ] Container starts and health check passes
- [ ] All features work in Docker container
- [ ] EC2 instance accessible via public IP
- [ ] Security group properly configured
- [ ] App accessible on HTTP port 80
- [ ] Screenshots captured for report
- [ ] Container logs show no errors or secrets
