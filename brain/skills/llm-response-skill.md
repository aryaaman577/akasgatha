# Skill: LLM Response Handling

> How to handle structured AI responses safely and reliably.

---

## Fixed JSON Schema

Every AI response must match the exact schema defined in `docs/API_SPEC.md`. The schema is validated with Zod on every response. No exceptions.

Required top-level fields:
- `topicTitle` (string)
- `topicSummary` (string)
- `kathaMandal` (object with title, content, label, disclaimer)
- `rahasyaChakra` (object with title, content, wonderQuestion)
- `vigyanDrishti` (object with title, content, keyFacts[])
- `satyaSetu` (object with title, content, alignment, divergence)
- `pramaanMatrix` (object with title, proven, symbolic, unknown, evidenceLevel)
- `sceneType` (enum: cosmic_sky | eclipse | planet_orbit)
- `jigyasaAgni` (string[] of length 3)
- `smritiQuest` (quiz object[] of length 3–5)

## Response Sections

Each section serves a distinct purpose. They must never be mixed:

| Section | Purpose | Safety Rule |
|---|---|---|
| kathaMandal | Cultural story | Must have label: "Cultural Story" |
| rahasyaChakra | Mystery/wonder | Must include wonderQuestion |
| vigyanDrishti | Science | Must contain only verifiable facts |
| satyaSetu | Bridge | Must state both alignment AND divergence |
| pramaanMatrix | Evidence | Must be honest about evidence level |

## Validation Pipeline

```
Raw LLM text
    │
    ▼
1. extractJSON(rawText)     — find first {...} block
    │
    ▼
2. JSON.parse(jsonString)   — parse to object (try/catch)
    │
    ▼
3. ResponseSchema.parse(obj) — Zod validation
    │
    ├── Success → 4. Post-processing
    │
    └── Failure → Return fallback response
    
4. Post-processing:
   a. Force kathaMandal.label = "Cultural Story"
   b. Scan for banned phrases
   c. Validate sceneType is one of 3 allowed values
    │
    ▼
5. Return validated response to client
```

## Fallback Response

Always have a pre-built fallback response that:
- Is a valid, complete response about solar eclipses
- Passes Zod schema validation
- Has correct labels and disclaimers
- Is returned whenever the real response fails

Do not add unsupported fallback flag fields to the client response. If fallback usage needs to be tracked, log it server-side or add an explicit schema field in a future contract change.

## No Raw HTML

All string fields in the response must be plain text. Never include:
- HTML tags (`<b>`, `<i>`, `<script>`, etc.)
- Markdown formatting (optional — if you use it, render with a safe parser)
- URLs as clickable links (render as plain text)
- Code blocks or executable content

The frontend renders all AI text inside React JSX elements, which auto-escape strings.

## Myth-Science Separation

The response schema enforces separation:
- `kathaMandal` = cultural content only
- `vigyanDrishti` = scientific content only
- `satyaSetu` = bridge between them
- `pramaanMatrix` = evidence grading

Additional post-processing:
- Force `kathaMandal.label` to `"Cultural Story"` (even if LLM returns something else)
- Scan `vigyanDrishti.content` for myth-as-proof language
- Check `pramaanMatrix.evidenceLevel` is not `"high"` unless justified
