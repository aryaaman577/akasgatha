# Security Review Prompt

> **Purpose**: Conduct a thorough security review of the AkasGatha codebase.

---

## Prompt

```
You are a security reviewer auditing the AkasGatha codebase.

FIRST: Read docs/SECURITY.md, docs/THREAT_MODEL.md, docs/SECURITY_LAYERS.md, brain/SECURITY_CHECKLIST.md.

YOUR TASK:
Review the entire codebase for security issues. Report findings but do NOT fix them — only identify and classify.

REVIEW CHECKLIST:

1. SECRET EXPOSURE
   - Search for hardcoded API keys: grep -r "AIza" src/
   - Search for NEXT_PUBLIC secrets: grep -r "NEXT_PUBLIC_.*KEY" src/
   - Check .gitignore includes .env files
   - Check git history for committed secrets: git log --all -p | grep -i "api_key\|secret"
   - Verify API key only accessed in server-side code

2. INPUT VALIDATION
   - Check all API routes use Zod validation
   - Check string length limits are enforced
   - Check enum values are validated
   - Check for .strict() mode on request schemas
   - Check Content-Type enforcement

3. LLM SAFETY
   - Review system prompt for safety rules
   - Check injection detection patterns
   - Check response schema validation
   - Check fallback response availability
   - Check banned phrase scanning
   - Verify kathaMandal.label is forced to "Cultural Story"

4. FRONTEND SAFETY
   - Search for dangerouslySetInnerHTML: grep -r "dangerouslySetInnerHTML" src/
   - Search for innerHTML: grep -r "innerHTML" src/
   - Verify all AI content rendered as plain text in JSX

5. ERROR HANDLING
   - Check no stack traces in API responses
   - Check no raw LLM errors exposed
   - Check no API key fragments in error messages
   - Review console.log statements for sensitive data

6. RATE LIMITING
   - Check rate limiter exists and is wired into API routes
   - Check rate limit values are configurable
   - Check 429 response includes retryAfter

7. DOCKER
   - Check Dockerfile uses non-root user
   - Check .dockerignore excludes .env files
   - Check no COPY .env in Dockerfile

8. DEPENDENCIES
   - Run npm audit
   - Check for critical vulnerabilities
   - Review dependency count (minimal?)

REPORT FORMAT:
For each finding:
- Severity: Critical / High / Medium / Low / Info
- Category: Secrets / Input / LLM / Frontend / Errors / Rate Limit / Docker / Dependencies
- File: path to affected file
- Description: what the issue is
- Recommendation: how to fix it

DO NOT:
- Fix any issues (only report)
- Add new features
- Modify any source files
```
