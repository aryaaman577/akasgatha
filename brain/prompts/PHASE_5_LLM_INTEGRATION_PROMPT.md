# Phase 5: LLM Integration Prompt

> **Purpose**: Replace mock responses with real Gemini API calls.

---

## Prompt

```
You are working on AkasGatha Phase 5: Real LLM Integration.

FIRST: Read brain/AGENT_RULES.md, docs/PROMPT_CONTRACT.md, docs/API_SPEC.md, brain/skills/llm-response-skill.md, brain/skills/prompt-engineering-skill.md.

YOUR TASK:
Replace mock API responses with real Gemini API calls. Implement prompt construction, response parsing, validation, and fallback.

FILES TO CREATE:

1. src/lib/llm/provider.ts
   - Define LLMProvider interface: { name: string, generate(prompt: string): Promise<string> }
   - getProvider(name: string) function → returns correct provider based on env
   - Supported: "gemini", "mock"

2. src/lib/llm/gemini.ts
   - Implement GeminiProvider using @google/generative-ai
   - Read API key from process.env.GEMINI_API_KEY (SERVER-SIDE ONLY)
   - Use gemini-1.5-flash or gemini-pro model
   - Handle API errors gracefully
   - Never expose API key in any error or log

3. src/lib/llm/mock.ts
   - Implement MockProvider that returns the mock response JSON
   - Used when LLM_PROVIDER=mock or when API key is missing

4. src/lib/llm/prompt-builder.ts
   - buildSystemPrompt() → returns the system prompt from PROMPT_CONTRACT.md
   - buildUserPrompt(question, mood, topicType) → returns the user prompt
   - Full prompt = system prompt + user prompt

5. src/lib/llm/response-parser.ts
   - extractJSON(rawText: string) → finds first {...} block in raw LLM text
   - parseAndValidate(rawText: string) → extract → parse → validate with Zod → return
   - On failure → return fallback response

6. src/lib/data/fallback.ts
   - A complete, valid fallback response about solar eclipses
   - Passes Zod response schema validation
   - Used when LLM fails, returns invalid data, or is unavailable

7. src/lib/security/sanitize.ts
   - sanitizeQuestion(question: string) → strip control chars, trim
   - hasInjectionAttempt(question: string) → check against injection patterns
   - scanBannedPhrases(response: JigyasaResponse) → check for myth-as-proof language
   - forceCulturalStoryLabel(response: JigyasaResponse) → force kathaMandal.label

FILES TO MODIFY:

8. src/app/api/jigyasa/route.ts
   - Replace mock data with real LLM call flow:
     a. Validate input (Zod)
     b. Sanitize question
     c. Check for injection attempts → if detected, return fallback
     d. Build prompt
     e. Call LLM provider
     f. Parse and validate response
     g. Force safety labels
     h. Return validated response
   - Handle all error cases with safe messages

SECURITY RULES:
- API key accessed only via process.env.GEMINI_API_KEY
- Never use NEXT_PUBLIC_ for the key
- Never log the full API key
- Never return raw LLM text to client
- Always validate through Zod before returning
- Always have fallback ready

VERIFICATION:
- npx tsc --noEmit → passes
- npm run build → passes
- Set LLM_PROVIDER=mock → mock response works
- Set LLM_PROVIDER=gemini with valid key → real AI response works
- Test with various questions → responses have all required sections
- Test injection attempt → safe fallback returned
- Test with missing API key → graceful error, not crash
- kathaMandal.label is always "Cultural Story"

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 5 items in brain/TODO.md

DO NOT:
- Modify frontend components (they should already work with the response schema)
- Add 3D scenes (that's Phase 6)
- Add rate limiting (that's Phase 7)
- Use NEXT_PUBLIC_ for the API key
```
