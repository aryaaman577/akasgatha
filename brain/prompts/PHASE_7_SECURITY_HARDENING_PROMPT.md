# Phase 7: Security Hardening Prompt

> **Purpose**: Implement all security measures from SECURITY_LAYERS.md.

---

## Prompt

```
You are working on AkasGatha Phase 7: Security Hardening.

FIRST: Read brain/AGENT_RULES.md, docs/SECURITY.md, docs/SECURITY_LAYERS.md, docs/THREAT_MODEL.md, brain/skills/api-security-skill.md, brain/skills/advanced-security-skill.md.

YOUR TASK:
Implement all MVP security layers. Do NOT add new features — only add security measures.

FILES TO CREATE/MODIFY:

1. src/lib/security/rate-limiter.ts
   - In-memory rate limiter (Map-based)
   - Per-IP tracking
   - Configurable via RATE_LIMIT_MAX and RATE_LIMIT_WINDOW env vars
   - Default: 30 requests per 60 seconds
   - Returns { limited: boolean, retryAfter?: number }
   - Auto-cleanup of expired entries (prevent memory leak)

2. src/lib/security/sanitize.ts (update if exists)
   - sanitizeQuestion(): strip control characters, excessive whitespace
   - hasInjectionAttempt(): pattern detection for common injection phrases
   - scanBannedPhrases(): check AI response for myth-as-proof language
   - Ensure all functions are used in the API route

3. next.config.js (update)
   - Add security headers:
     - X-Content-Type-Options: nosniff
     - X-Frame-Options: DENY
     - X-XSS-Protection: 1; mode=block
     - Referrer-Policy: strict-origin-when-cross-origin
     - Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' (needed for Three.js)

4. src/app/api/jigyasa/route.ts (update)
   - Add rate limiting check at the top
   - Add Content-Type enforcement (must be application/json)
   - Add request body size check (< 10KB)
   - Ensure all error responses are safe (no stack traces, no raw errors)
   - Log sanitized error info server-side

5. src/app/api/health/route.ts (update)
   - Ensure method restriction is enforced
   - No sensitive info in response

SECURITY AUDIT:
Run these checks and fix any issues found:

- grep -r "dangerouslySetInnerHTML" src/ → should be zero results in jigyasa components
- grep -r "NEXT_PUBLIC_.*KEY" src/ → should be zero results
- grep -r "console.log" src/ → review each for sensitive data
- npm audit --audit-level=critical → fix or document issues
- grep -r "innerHTML" src/ → should be zero results (use React JSX)

VERIFICATION:
- npx tsc --noEmit → passes
- npm run build → passes
- Rate limiting: 35 rapid requests → 429 after ~30
- Content-Type: send text/plain → 400 error
- Injection: send "ignore previous instructions" → safe fallback
- Large body: send >10KB → 400 error
- Error responses: trigger 500 → no stack trace in response
- npm audit → no critical vulnerabilities
- All existing features still work

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Update brain/SECURITY_CHECKLIST.md with results
- Check off Phase 7 items in brain/TODO.md

DO NOT:
- Add new features
- Modify UI components (unless fixing a security issue)
- Add authentication (out of scope)
- Add HTTPS configuration (manual for AWS)
```
