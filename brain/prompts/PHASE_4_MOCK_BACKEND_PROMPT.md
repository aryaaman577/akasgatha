# Phase 4: Mock Backend API Prompt

> **Purpose**: Create API routes with Zod validation that return mock data.

---

## Prompt

```
You are working on AkasGatha Phase 4: Mock Backend API.

FIRST: Read brain/AGENT_RULES.md, docs/API_SPEC.md, and brain/skills/api-security-skill.md.

YOUR TASK:
Create the API route handlers with full input validation. Return mock data for now (LLM integration comes in Phase 5).

FILES TO CREATE/MODIFY:

1. src/lib/schemas/request.ts
   - Zod schema for JigyasaRequest
   - question: string, trimmed, 5-500 chars
   - mood: enum (curious, scholarly, storyteller, skeptic, mystical), optional, default "curious"
   - topicType: enum (planet, nakshatra, eclipse, moon, mystery, constellation, general), optional, default "general"
   - Use .strict() to reject unknown fields

2. src/lib/schemas/response.ts
   - Zod schema for JigyasaResponse
   - All fields from docs/API_SPEC.md
   - Export TypeScript type: type JigyasaResponse = z.infer<typeof JigyasaResponseSchema>

3. src/app/api/health/route.ts
   - GET handler only
   - Returns: { status: "ok", timestamp, version: "1.0.0", llmProvider }
   - POST/PUT/DELETE → 405 Method Not Allowed

4. src/app/api/jigyasa/route.ts
   - POST handler only
   - Parse request body
   - Validate with Zod request schema
   - On validation error → 400 with safe error message
   - On success → return mock response data
   - GET/PUT/DELETE → 405 Method Not Allowed
   - All errors use structured format: { success: false, error: { code, message } }
   - Never expose raw error messages

5. src/lib/data/mock-response.ts (update if needed)
   - Ensure mock data passes Zod response schema validation

6. Update src/app/ask/page.tsx
   - Replace hardcoded mock data with actual fetch to POST /api/jigyasa
   - Handle loading, success, and error states
   - Handle 400 validation errors (show message to user)
   - Handle 429 rate limit errors (show "please wait" message)
   - Handle 500 errors (show "something went wrong")

SECURITY RULES:
- Validate ALL input before processing
- Never return raw error.message to client
- Use structured error responses
- Only allow specified HTTP methods
- Log errors server-side only (console.error with sanitized info)

VERIFICATION:
- npx tsc --noEmit → passes
- npm run lint → passes
- npm run build → passes
- curl http://localhost:3000/api/health → 200 OK
- curl -X POST http://localhost:3000/api/jigyasa -H "Content-Type: application/json" -d '{"question":"Why does eclipse happen?"}' → 200 with response
- curl -X POST http://localhost:3000/api/jigyasa -d '{}' → 400 validation error
- curl -X GET http://localhost:3000/api/jigyasa → 405
- Frontend Ask page works with real API calls

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 4 items in brain/TODO.md

DO NOT:
- Add LLM integration (that's Phase 5)
- Add rate limiting logic (that's Phase 7)
- Modify Phase 2/3 components unless fixing a direct bug
```
