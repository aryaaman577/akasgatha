# API Specification — AkasGatha

## Base URL

```
Development: http://localhost:3000
Production:  http://<EC2_PUBLIC_IP>
```

---

## GET /api/health

Health check endpoint for monitoring and Docker/AWS verification.

### Request

```
GET /api/health
```

No request body. No authentication required.

### Success Response (200)

```json
{
  "status": "ok",
  "timestamp": "2026-07-07T12:00:00.000Z",
  "version": "1.0.0",
  "llmProvider": "gemini"
}
```

### Error Response (500)

```json
{
  "status": "error",
  "message": "Service unhealthy"
}
```

---

## POST /api/jigyasa

Main query endpoint. Accepts a cosmic question and returns a structured AI-generated response.

### Request

```
POST /api/jigyasa
Content-Type: application/json
```

### Request Body

```json
{
  "question": "Why does Rahu swallow the Sun during a solar eclipse?",
  "mood": "curious",
  "topicType": "eclipse"
}
```

### Request Body Schema

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `question` | `string` | Yes | 5–500 characters, trimmed | The cosmic question from the user |
| `mood` | `string` | No | One of allowed values | The learner's mood/tone preference |
| `topicType` | `string` | No | One of allowed values | Topic category for scene mapping |

### Allowed `mood` Values

```typescript
type Mood =
  | "curious"      // Default — wonder and exploration
  | "scholarly"    // Academic and detailed
  | "storyteller"  // Narrative and immersive
  | "skeptic"      // Evidence-focused and questioning
  | "mystical"     // Poetic and philosophical
```

Default: `"curious"` if not provided. Invalid values are rejected with `400 VALIDATION_ERROR`.

### Allowed `topicType` Values

```typescript
type TopicType =
  | "planet"        // Graha — planetary topics
  | "nakshatra"     // Constellation / star topics
  | "eclipse"       // Solar / lunar eclipse topics
  | "moon"          // Moon phase / Chandra topics
  | "mystery"       // Cosmic mysteries, unknowns
  | "constellation" // Star pattern topics
  | "general"       // Default / catch-all
```

Default: `"general"` if not provided. Invalid values are rejected with `400 VALIDATION_ERROR`.

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "topicTitle": "Rahu and the Solar Eclipse",
    "topicSummary": "The ancient story of Rahu swallowing the Sun, and the science of how the Moon's shadow creates a solar eclipse.",
    "kathaMandal": {
      "title": "The Story of Rahu",
      "content": "In ancient Indian texts, Rahu is described as a shadow entity...",
      "label": "Cultural Story",
      "disclaimer": "This is a cultural narrative, not a scientific explanation."
    },
    "rahasyaChakra": {
      "title": "The Mystery",
      "content": "Why did ancient observers across cultures create serpent/dragon myths for eclipses?",
      "wonderQuestion": "What did ancient observers actually see that inspired these stories?"
    },
    "vigyanDrishti": {
      "title": "The Science",
      "content": "A solar eclipse occurs when the Moon passes between Earth and the Sun...",
      "keyFacts": [
        "The Moon's diameter is ~400 times smaller than the Sun",
        "The Moon is ~400 times closer to Earth than the Sun",
        "This coincidence makes total solar eclipses possible"
      ]
    },
    "satyaSetu": {
      "title": "Story Meets Science",
      "content": "The ancient observation was accurate — something does temporarily cover the Sun...",
      "alignment": "The observation is correct; the explanation differs.",
      "divergence": "Rahu is a mythological entity; the Moon is the actual occluding body."
    },
    "pramaanMatrix": {
      "title": "Evidence Check",
      "proven": "Solar eclipses are caused by lunar occultation — verified by NASA, ISRO, and every space agency.",
      "symbolic": "Rahu and Ketu represent the lunar nodes (ascending/descending) in astronomical terms.",
      "unknown": "Why the Moon-Sun size-distance ratio creates such a precise visual match is considered a remarkable coincidence.",
      "evidenceLevel": "high"
    },
    "sceneType": "eclipse",
    "jigyasaAgni": [
      "What are the lunar nodes, and why do eclipses only happen near them?",
      "Did ancient Indian astronomers accurately predict eclipses?",
      "What is the difference between Rahu and Ketu in astronomical terms?"
    ],
    "smritiQuest": [
      {
        "question": "What causes a solar eclipse?",
        "options": [
          "Rahu swallows the Sun",
          "The Moon passes between Earth and the Sun",
          "The Earth's shadow falls on the Sun",
          "The Sun temporarily dims"
        ],
        "correctIndex": 1,
        "explanation": "A solar eclipse occurs when the Moon's orbit brings it directly between Earth and the Sun."
      },
      {
        "question": "What are Rahu and Ketu in modern astronomy?",
        "options": [
          "Planets beyond Neptune",
          "Types of comets",
          "The lunar nodes (orbital intersection points)",
          "Dark matter entities"
        ],
        "correctIndex": 2,
        "explanation": "Rahu and Ketu correspond to the ascending and descending lunar nodes — the points where the Moon's orbit crosses the ecliptic."
      },
      {
        "question": "Why is the story of Rahu labeled as 'Cultural Story' and not science?",
        "options": [
          "Because it is wrong",
          "Because it is a narrative explanation, not an empirical observation",
          "Because ancient people were ignorant",
          "Because it contradicts NASA"
        ],
        "correctIndex": 1,
        "explanation": "Cultural stories are narrative frameworks for understanding phenomena. They carry meaning but are not empirical scientific explanations."
      }
    ]
  }
}
```

### Error Response (400 — Validation Error)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Question must be between 5 and 500 characters."
  }
}
```

### Error Response (429 — Rate Limited)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please wait before trying again.",
    "retryAfter": 60
  }
}
```

### Error Response (500 — Internal Error)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again."
  }
}
```

> **Security Rule**: Never expose raw LLM errors, stack traces, or API key details in error responses.

### Error Response (503 — LLM Unavailable)

```json
{
  "success": false,
  "error": {
    "code": "LLM_UNAVAILABLE",
    "message": "The AI service is temporarily unavailable. Please try again later."
  }
}
```

---

## API Security Rules

1. **Method Restriction**: Only allow the specified HTTP method per route. Return `405 Method Not Allowed` for others.
2. **Input Validation**: Validate all request fields with Zod before processing. Reject invalid input with `400`.
3. **Rate Limiting**: Limit to `RATE_LIMIT_MAX` requests per `RATE_LIMIT_WINDOW` seconds per IP.
4. **No Secrets in Response**: Never include API keys, internal errors, or LLM raw output in responses.
5. **Safe Error Messages**: Use generic, user-friendly error messages. Log details server-side only.
6. **Content-Type Enforcement**: Only accept `application/json` for POST requests.
7. **Response Schema Validation**: Validate LLM output against Zod schema before returning to client.
8. **CORS**: Restrict to same-origin in production (Next.js handles this by default).
9. **No GET with Side Effects**: Health check is read-only. Query endpoint is POST-only.
10. **Request Size Limit**: Reject request bodies larger than 10KB.

---

## Zod Schemas Reference

### Request Schema

```typescript
import { z } from "zod";

export const JigyasaRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must be at most 500 characters"),
  mood: z
    .enum(["curious", "scholarly", "storyteller", "skeptic", "mystical"])
    .optional()
    .default("curious"),
  topicType: z
    .enum(["planet", "nakshatra", "eclipse", "moon", "mystery", "constellation", "general"])
    .optional()
    .default("general"),
});
```

### Response Schema

```typescript
export const JigyasaResponseSchema = z.object({
  topicTitle: z.string(),
  topicSummary: z.string(),
  kathaMandal: z.object({
    title: z.string(),
    content: z.string(),
    label: z.literal("Cultural Story"),
    disclaimer: z.string(),
  }),
  rahasyaChakra: z.object({
    title: z.string(),
    content: z.string(),
    wonderQuestion: z.string(),
  }),
  vigyanDrishti: z.object({
    title: z.string(),
    content: z.string(),
    keyFacts: z.array(z.string()).min(1).max(5),
  }),
  satyaSetu: z.object({
    title: z.string(),
    content: z.string(),
    alignment: z.string(),
    divergence: z.string(),
  }),
  pramaanMatrix: z.object({
    title: z.string(),
    proven: z.string(),
    symbolic: z.string(),
    unknown: z.string(),
    evidenceLevel: z.enum(["high", "medium", "low", "unknown"]),
  }),
  sceneType: z.enum(["cosmic_sky", "eclipse", "planet_orbit"]),
  jigyasaAgni: z.array(z.string()).length(3),
  smritiQuest: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
      explanation: z.string(),
    })
  ).min(3).max(5),
});
```
