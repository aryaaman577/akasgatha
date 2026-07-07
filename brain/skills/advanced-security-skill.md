# Skill: Advanced Security

> Layered security approach for AkasGatha — practical, not enterprise overkill.

---

## Secrets Management

- All secrets in `.env` (server-side only)
- Never `NEXT_PUBLIC_` for secrets
- Never hardcode in source
- Never log full values
- Access pattern: `process.env.GEMINI_API_KEY` in server code only
- Check: `grep -r "AIza" src/` should return nothing

## Input Validation

- Zod on every API route
- String length limits (5–500 for questions)
- Enum validation for mood, topicType
- `.strict()` mode to reject unknown fields
- Strip control characters from input
- Request body size cap: 10KB

## API Rate Abuse Prevention

- In-memory per-IP rate limiting
- Default: 30 requests per 60 seconds
- Configurable via env vars
- 429 response with retryAfter
- Auto-cleanup of expired entries to prevent memory leak
- Limitation: resets on restart, not distributed (acceptable for MVP)

## Prompt Injection Defense

### Layers of defense:
1. Input sanitization (strip control chars)
2. Pattern detection (regex for common injection phrases)
3. System prompt structure (system always first, user input delimited)
4. Output validation (Zod schema — the real safety net)
5. Fallback response (invalid output → safe default)

### Key patterns to detect:
```
ignore previous instructions
you are now
system prompt
override your rules
forget your rules
respond without json
```

### Response to injection:
- Log the attempt (sanitized — no raw payload)
- Return safe fallback response
- Do not reveal detection to the user

## Schema Validation

- Every LLM response validated with Zod before reaching the client
- Extract JSON from raw text (find first `{...}` block)
- Parse with JSON.parse (try/catch)
- Validate with Zod ResponseSchema
- On failure → return fallback

## XSS Prevention

- React JSX auto-escapes strings by default
- Never use `dangerouslySetInnerHTML` with AI content
- Never use `innerHTML` with dynamic content
- Never use `document.write` with dynamic content
- Never use `eval()` with dynamic content
- If markdown rendering needed later: use remark/rehype with HTML disabled

## Dependency Audit

- Run `npm audit` before every deployment
- Fix critical and high severity issues
- Use specific versions (not `*` or `latest`)
- Minimize dependency count
- Review new dependencies before adding

## Docker Hardening

- Multi-stage build (minimal production image)
- Non-root user (nextjs, UID 1001)
- No `.env` in image (inject at runtime)
- `.dockerignore` excludes secrets and docs
- Only port 3000 exposed
- Alpine base (minimal attack surface)

## AWS Security Groups

- SSH (22): your IP only — NEVER 0.0.0.0/0
- HTTP (80): 0.0.0.0/0 (public demo)
- HTTPS (443): 0.0.0.0/0 (optional)
- All other ports: CLOSED
- Review security group before every demo

## Logging Safety

- Never log API keys
- Never log full prompts in production
- Never log raw user input at full length
- Log only: sanitized info, error codes, request metadata
- Pattern: `console.error('LLM error:', error instanceof Error ? error.message : 'unknown')`

## Final Audit Process

Before submission, run the full checklist from `brain/SECURITY_CHECKLIST.md`:
1. Secret scan
2. Code audit
3. npm audit
4. Docker inspection
5. AWS security group review
6. Penetration test (injection payloads, rate limit test)
7. Error response review
