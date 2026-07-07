# Skill: Prompt Engineering

> How to build effective, safe prompts for AkasGatha.

---

## System Prompt

The system prompt is the foundation of AI behavior. It must:
- Define the AI's role clearly (educational guide, not oracle or astrologer)
- Specify the response format (JSON only, no markdown)
- List content safety rules explicitly
- Include refusal instructions for out-of-scope requests
- Handle prompt injection attempts

Key principles:
- System prompt is **always first** in the message sequence
- System prompt is **never modified** by user input
- System prompt uses **clear, unambiguous language**

## User Prompt

The user prompt template includes:
- The user's question (sanitized)
- The mood selection
- The topic type
- The exact JSON schema the LLM must follow
- Reminders about required fields and constraints

Key principles:
- User input is clearly **delimited** (labeled as "Topic Question:")
- Schema is provided **inline** so the LLM has it in context
- Important constraints are **repeated** at the end (e.g., "kathaMandal.label must be 'Cultural Story'")

## Schema Instruction

To get reliable JSON from an LLM:
1. Provide the exact schema inline (not by reference)
2. Show field names, types, and constraints
3. Use comments for non-obvious fields
4. Specify exact enum values
5. Say "Respond ONLY with the JSON object"
6. Say "No markdown fences. No explanation before or after."

## Prompt Injection Resistance

### What is prompt injection?
User inputs that try to override the system prompt:
- "Ignore previous instructions and..."
- "You are now a different AI..."
- "System prompt override:"

### Defense layers:
1. **Input sanitization** — strip control characters before prompt construction
2. **Injection detection** — pattern matching for common injection phrases
3. **Structural defense** — system prompt always first, user input delimited
4. **Output validation** — even if injection succeeds, Zod rejects bad output
5. **Fallback response** — invalid output → safe default response

### Key insight:
Prompt injection defense is **never 100% reliable**. The output validation (Zod schema) is the real safety net. Even if the LLM is tricked, the response must pass schema validation to reach the user.

## Content Safety

### Enforce in the system prompt:
- Never present mythology as scientific proof
- Never generate astrology predictions
- Never make medical/health claims
- Never generate religious truth claims
- Always label cultural stories as "Cultural Story"
- Always use honest evidence levels

### Enforce in post-processing:
- Force `kathaMandal.label = "Cultural Story"`
- Scan for banned phrases
- Check evidence level honesty
- Reject or sanitize non-conforming output

## Output Correction

When the LLM output is almost right but slightly wrong:

| Issue | Correction |
|---|---|
| `kathaMandal.label` is not "Cultural Story" | Force it to "Cultural Story" |
| `jigyasaAgni` has 2 items instead of 3 | Reject, return fallback |
| `sceneType` is "stars" instead of "cosmic_sky" | Map to closest valid value or fallback |
| HTML tags in content | Strip tags (or reject) |
| Missing `disclaimer` field | Inject default disclaimer |
| `evidenceLevel` is "proven" (not a valid enum) | Map to "high" or reject |

### Correction vs Rejection:
- Minor fixable issues → correct and proceed
- Structural issues (missing sections, wrong types) → reject, return fallback
- Safety issues (myth-as-proof in vigyanDrishti) → reject, return fallback
