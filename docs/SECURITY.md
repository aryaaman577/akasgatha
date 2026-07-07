# Security Guide — AkasGatha

Practical, MVP-appropriate security measures. Not enterprise overkill — but not neglected either.

---

## 1. Environment Security

### Risk
API keys and secrets leaked in code, git history, or client bundles.

### Defense
- Store all secrets in `.env` (server-side only)
- Never use `NEXT_PUBLIC_` prefix for API keys
- Add `.env`, `.env.local`, `.env.production` to `.gitignore`
- Use `.env.example` with placeholder values for documentation

### Implementation

```bash
# .env (NEVER committed)
GEMINI_API_KEY=your_actual_key_here
LLM_PROVIDER=gemini
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW=60

# .env.example (committed, safe)
GEMINI_API_KEY=replace_me
LLM_PROVIDER=gemini
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW=60
```

### Verification
- Run `git diff --cached` before every commit to check for secrets
- Search codebase: `grep -r "GEMINI_API_KEY" --include="*.ts" --include="*.tsx"` — should only appear in server-side files
- Verify `.gitignore` includes all env files

---

## 2. API Key Safety

### Risk
Gemini API key exposed to the browser, burned in CI logs, or hardcoded.

### Defense
- All LLM calls happen in Next.js Route Handlers (server-side only)
- Access keys only via `process.env.GEMINI_API_KEY` in server code
- Never return the key or partial key in any API response
- Never log the full key — log only `GEMINI_API_KEY is ${key ? 'set' : 'missing'}`

### Do Not

```typescript
// ❌ NEVER DO THIS
const response = await fetch('/api/jigyasa', {
  headers: { 'X-API-Key': process.env.NEXT_PUBLIC_GEMINI_KEY }
});

// ❌ NEVER DO THIS
console.log('Using key:', process.env.GEMINI_API_KEY);
```

### Do

```typescript
// ✅ Server-side only (route.ts)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured');
}
```

---

## 3. Input Validation

### Risk
Malformed, oversized, or malicious input reaching the LLM or causing errors.

### Defense
- Validate all POST body fields with Zod schemas
- Enforce string length limits (question: 5–500 chars)
- Enforce enum values for `mood` and `topicType`
- Trim whitespace from string inputs
- Reject requests with unknown fields (Zod `.strict()` mode)
- Limit request body size to 10KB

### Implementation

```typescript
import { z } from 'zod';

const requestSchema = z.object({
  question: z.string().trim().min(5).max(500),
  mood: z.enum(['curious', 'scholarly', 'storyteller', 'skeptic', 'mystical']).optional().default('curious'),
  topicType: z.enum(['planet', 'nakshatra', 'eclipse', 'moon', 'mystery', 'constellation', 'general']).optional().default('general'),
}).strict();
```

---

## 4. Rate Limiting

### Risk
API abuse, cost overrun from excessive LLM calls, denial of service.

### Defense
- Implement in-memory rate limiting per IP address
- Default: 30 requests per 60 seconds
- Configurable via environment variables
- Return `429 Too Many Requests` with `retryAfter` value

### Implementation

```typescript
// Simple in-memory rate limiter (sufficient for MVP)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = parseInt(process.env.RATE_LIMIT_MAX || '30');
  const window = parseInt(process.env.RATE_LIMIT_WINDOW || '60') * 1000;

  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + window });
    return false;
  }
  record.count++;
  return record.count > limit;
}
```

> **Note**: In-memory rate limiting resets on server restart. Acceptable for MVP. For production, use Redis or similar.

---

## 5. LLM Prompt Injection Defense

### Risk
User crafts a question that overrides the system prompt, causing the LLM to ignore safety rules or return harmful content.

### Defense
1. **System prompt is always first** — immutable, not influenced by user input
2. **User input is clearly delimited** — placed in a labeled field within the prompt
3. **Input sanitization** — strip control characters, limit length
4. **Output validation** — Zod schema check ensures response structure regardless of LLM behavior
5. **Injection detection** — basic pattern matching for common injection phrases
6. **Fallback response** — if output fails validation, return safe default content

### Injection Patterns to Detect

```
- "ignore previous instructions"
- "you are now"
- "system prompt"
- "override your rules"
- "forget your rules"
- "respond without json"
```

### Response to Detected Injection
- Log the attempt (sanitized — no raw payload in logs)
- Return a safe, pre-built response about solar eclipses
- Do not reveal that injection was detected (to avoid giving feedback to attacker)

---

## 6. Response Schema Validation

### Risk
LLM returns malformed JSON, missing fields, or content that violates safety rules.

### Defense
1. **Extract JSON** — find the first `{...}` block in the raw LLM response
2. **Parse JSON** — `JSON.parse()` with try/catch
3. **Validate with Zod** — check all required fields, types, and constraints
4. **Content safety check** — scan for banned phrases (myth-as-proof patterns)
5. **Fix or fallback** — attempt minor fixes (e.g., force `label: "Cultural Story"`), or return fallback

### Fallback Response
A pre-built, valid response about the default topic (solar eclipse) is always available as a fallback. It passes Zod validation and all safety checks.

---

## 7. Safe Error Handling

### Risk
Raw error messages, stack traces, or internal details exposed to users.

### Defense
- Never return raw `Error.message` to the client
- Never return LLM error details to the client
- Use generic error messages: "Something went wrong. Please try again."
- Log detailed errors server-side only
- Use structured error response format:

```typescript
// ✅ Safe error response
return Response.json({
  success: false,
  error: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please try again.',
  }
}, { status: 500 });

// ❌ Unsafe error response
return Response.json({
  error: err.message,
  stack: err.stack,
});
```

---

## 8. No Raw HTML Rendering

### Risk
XSS (Cross-Site Scripting) through AI-generated content containing HTML or script tags.

### Defense
- Never use `dangerouslySetInnerHTML` with AI-generated content
- Render all AI text as plain text content within React components
- React's JSX automatically escapes strings — rely on this
- If markdown rendering is needed later, use a safe markdown renderer with HTML disabled

```tsx
// ✅ Safe — React escapes this automatically
<p>{response.kathaMandal.content}</p>

// ❌ Dangerous — never do this with AI content
<div dangerouslySetInnerHTML={{ __html: response.kathaMandal.content }} />
```

---

## 9. Docker Security

### Risk
Container running as root, exposed debug ports, secrets baked into image.

### Defense
- Run Node.js process as non-root user in container
- Use multi-stage builds to minimize image size and attack surface
- Do not COPY `.env` files into the Docker image
- Pass environment variables at runtime via `docker run --env-file` or `docker-compose`
- Only expose port 3000 (mapped to 80 on host)
- Use `.dockerignore` to exclude:
  - `.env`, `.env.*`
  - `node_modules`
  - `.git`
  - `docs/`, `brain/`

### Dockerfile Security Lines

```dockerfile
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Switch to non-root user
USER nextjs

# Expose only app port
EXPOSE 3000
```

---

## 10. AWS Security

### Risk
Open ports, public SSH, missing security groups, accidental public access to secrets.

### Defense
- **Security Group Rules**:
  - SSH (22): Your IP only — never `0.0.0.0/0`
  - HTTP (80): `0.0.0.0/0` (public access for demo)
  - HTTPS (443): `0.0.0.0/0` (optional)
  - All other ports: CLOSED
- Store `.env` on EC2 instance, not in the Docker image
- Do not commit EC2 key pair to git
- Use `t2.micro` or `t3.micro` for cost safety (free tier eligible)
- Stop the instance when not actively demoing to avoid charges

### EC2 Setup Checklist
- [ ] Security group configured with restrictive rules
- [ ] SSH key pair created and stored securely
- [ ] `.env` file created on instance (not in image)
- [ ] Docker installed on instance
- [ ] App running and accessible on public IP

---

## Final Security Checklist

| Category | Check | Status |
|---|---|---|
| Secrets | `.env` in `.gitignore` | ☐ |
| Secrets | No `NEXT_PUBLIC_` for API keys | ☐ |
| Secrets | No hardcoded keys in source | ☐ |
| Secrets | Keys not logged | ☐ |
| API | Zod input validation on all endpoints | ☐ |
| API | Rate limiting active | ☐ |
| API | Safe error responses only | ☐ |
| API | Method restriction enforced | ☐ |
| LLM | Server-side calls only | ☐ |
| LLM | Prompt injection detection | ☐ |
| LLM | Response schema validation | ☐ |
| LLM | Fallback response ready | ☐ |
| LLM | Banned phrase check | ☐ |
| Frontend | No `dangerouslySetInnerHTML` with AI content | ☐ |
| Frontend | All AI text rendered as plain text | ☐ |
| Docker | Non-root user in container | ☐ |
| Docker | No `.env` in image | ☐ |
| Docker | `.dockerignore` configured | ☐ |
| AWS | SSH restricted to your IP | ☐ |
| AWS | Only ports 22, 80, 443 open | ☐ |
| AWS | `.env` on instance, not in image | ☐ |
| Dependencies | `npm audit` run | ☐ |
| Dependencies | No known critical vulnerabilities | ☐ |
