# Security Checklist — AkasGatha

Pre-deployment security verification. Check every item before shipping.

---

## Secrets

- [ ] `.env` file exists and is NOT committed to git
- [ ] `.env` listed in `.gitignore`
- [ ] `.env.local` listed in `.gitignore`
- [ ] `.env.production` listed in `.gitignore`
- [ ] No `NEXT_PUBLIC_` prefix used for any secret or API key
- [ ] `GEMINI_API_KEY` accessed only in server-side code (`route.ts`, `lib/llm/`)
- [ ] No hardcoded API keys anywhere in `src/`
- [ ] No API keys in any log statement
- [ ] `grep -r "AIza" src/` returns zero results
- [ ] API key not in git history: `git log --all -p | grep -i "AIza"` returns zero results

---

## API

- [ ] `/api/health` accepts only GET (returns 405 for POST)
- [ ] `/api/jigyasa` accepts only POST (returns 405 for GET)
- [ ] All request bodies validated with Zod schema
- [ ] Invalid input returns 400 with safe error message
- [ ] Question length enforced: 5–500 characters
- [ ] Mood and topicType enum validated
- [ ] Unknown fields rejected (`.strict()`)
- [ ] Content-Type `application/json` enforced for POST
- [ ] Request body size limited to 10KB
- [ ] Error responses never contain stack traces
- [ ] Error responses never contain raw LLM errors
- [ ] Error responses use structured format: `{ success, error: { code, message } }`

---

## LLM

- [ ] All LLM API calls are server-side only (Route Handlers)
- [ ] System prompt enforces safety rules
- [ ] User input placed in delimited field in prompt
- [ ] Prompt injection patterns detected before prompt construction
- [ ] Injection detection triggers safe fallback (not error)
- [ ] Raw LLM response parsed for JSON (find first `{...}` block)
- [ ] Parsed JSON validated with Zod response schema
- [ ] Invalid schema triggers fallback response
- [ ] `kathaMandal.label` forced to "Cultural Story" post-validation
- [ ] Banned phrase list scanned in response fields
- [ ] Fallback response is always available and valid
- [ ] No raw LLM text ever sent to client

---

## Frontend

- [ ] No `dangerouslySetInnerHTML` used with AI-generated content
- [ ] No `innerHTML` assignment with AI-generated content
- [ ] All AI text rendered via React JSX (auto-escaped)
- [ ] No `document.write` calls
- [ ] No `eval()` calls with dynamic content
- [ ] Console has no warnings or errors in production build
- [ ] No sensitive data in React component state that could leak to dev tools

---

## Dependencies

- [ ] `npm audit` run
- [ ] No `critical` severity vulnerabilities
- [ ] `high` severity issues documented if unresolvable
- [ ] All dependencies have specific version numbers (no `*` or `latest`)
- [ ] No unnecessary dependencies installed
- [ ] `package-lock.json` committed

---

## Docker

- [ ] Dockerfile uses multi-stage build
- [ ] Production stage runs as non-root user (`nextjs`, UID 1001)
- [ ] No `COPY .env` in Dockerfile
- [ ] `.env` not in Docker image: `docker run --rm akasgatha cat /app/.env` fails
- [ ] `.dockerignore` excludes: `.env`, `.env.*`, `node_modules`, `.git`, `docs/`, `brain/`
- [ ] Only port 3000 exposed in Dockerfile
- [ ] Environment variables injected at runtime (`--env-file` or `-e`)
- [ ] Image size is reasonable (< 300MB)
- [ ] No development dependencies in production image

---

## AWS

- [ ] Security group: SSH (22) restricted to your IP only
- [ ] Security group: HTTP (80) open to `0.0.0.0/0`
- [ ] Security group: No other ports open (3000, 8080, etc.)
- [ ] SSH key pair `.pem` file NOT in project directory
- [ ] SSH key pair NOT committed to git
- [ ] `.env` file created on EC2 instance (not transferred via Docker image)
- [ ] Instance type is free tier eligible (t2.micro or t3.micro)
- [ ] Instance stopped when not actively demoing (cost control)

---

## Final Audit

- [ ] Full `npm run build` succeeds
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] All API endpoints tested with curl
- [ ] Prompt injection test executed
- [ ] Rate limiting test executed
- [ ] All security items above checked
- [ ] Screenshots captured for report
- [ ] No secrets visible in any screenshot
