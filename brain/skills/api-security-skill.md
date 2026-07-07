# Skill: API Security

> Practical API security for AkasGatha endpoints.

---

## Zod Validation

Every API request must be validated with Zod before any processing:

```typescript
// In route handler
const body = await request.json();
const result = RequestSchema.safeParse(body);

if (!result.success) {
  return Response.json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: result.error.issues[0]?.message || 'Invalid input',
    },
  }, { status: 400 });
}

const { question, mood, topicType } = result.data;
```

Key rules:
- Use `.safeParse()` (not `.parse()`) to avoid throwing
- Use `.strict()` to reject unknown fields
- Trim strings with `.trim()`
- Set min/max lengths for strings
- Use `.enum()` for fixed values
- Use `.default()` for optional fields

## Method Control

Each route must only accept its designated HTTP method:

```typescript
// /api/jigyasa/route.ts
export async function POST(request: Request) {
  // Handle POST
}

// If someone sends GET, Next.js returns 405 automatically
// (Only export the methods you want to support)
```

Do NOT export handlers you don't intend to support.

## Rate Limiting

In-memory rate limiter pattern:

```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const max = parseInt(process.env.RATE_LIMIT_MAX || '30');
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '60') * 1000;

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }

  record.count++;
  if (record.count > max) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfter };
  }

  return { limited: false };
}
```

Get client IP in Next.js:
```typescript
const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
```

## Safe Error Responses

**Always** use this pattern:

```typescript
// Success
return Response.json({ success: true, data: validatedResponse }, { status: 200 });

// Client error
return Response.json({
  success: false,
  error: { code: 'VALIDATION_ERROR', message: 'Question is required' },
}, { status: 400 });

// Rate limited
return Response.json({
  success: false,
  error: { code: 'RATE_LIMITED', message: 'Too many requests', retryAfter: 60 },
}, { status: 429 });

// Server error
return Response.json({
  success: false,
  error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
}, { status: 500 });
```

**Never** do this:
```typescript
// ❌ Exposes internal details
return Response.json({ error: err.message, stack: err.stack });
```

## No Secrets in Response

- Never include `process.env.GEMINI_API_KEY` in any response
- Never include partial API keys
- Never include raw LLM error messages (they may contain key fragments)
- Never include server file paths
- Never include database connection strings (n/a for MVP)

## No Raw LLM Errors

LLM SDK errors may contain:
- API key fragments
- Rate limit details
- Model configuration
- Internal error codes

Always catch LLM errors and return generic messages:

```typescript
try {
  const response = await provider.generate(prompt);
  // ... process response
} catch (error) {
  console.error('LLM call failed:', error instanceof Error ? error.message : 'Unknown');
  return Response.json({
    success: false,
    error: { code: 'LLM_UNAVAILABLE', message: 'AI service temporarily unavailable' },
  }, { status: 503 });
}
```
