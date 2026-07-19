# AkasGatha Manual Setup Guide

This guide walks you through setting up AkasGatha with real AI-powered answers using Google's Gemini API.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20 or later** installed ([download here](https://nodejs.org/))
- **Git** installed
- A **Google account** (for Gemini API key)
- A terminal/command prompt
- A text editor (VS Code, Sublime, etc.)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd akashgatha

# Install dependencies
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- Three.js (for 3D visualizations)
- @google/genai (Gemini SDK)
- And other dependencies

## Step 2: Prepare the Knowledge Base

AkasGatha uses a local RAG (Retrieval-Augmented Generation) system. You need to build the vector index:

```bash
# Validate the knowledge corpus
npm run rag:validate

# Expected output: ✓ VALIDATION PASSED (20 documents)
```

```bash
# Build the vector index
npm run rag:ingest

# Expected output: ✓ INGESTION COMPLETE (20 chunks indexed)
```

```bash
# Test the retrieval system
npm run rag:test

# Expected output: ✓ ALL TESTS PASSED (15/15)
```

If all three commands pass, your knowledge base is ready!

## Step 3: Get Your Gemini API Key

### 3a. Visit Google AI Studio

Go to: **https://makersuite.google.com/app/apikey**

(You may need to sign in with your Google account)

### 3b. Create an API Key

1. Click **"Get API key"** or **"Create API key"**
2. Select a Google Cloud project (or create a new one)
3. Click **"Create API key in existing project"** or **"Create API key in new project"**
4. Copy the generated API key

**Important:** Keep this key secure. Never share it publicly or commit it to version control.

### 3c. API Usage Limits

Gemini API has free tier limits:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

For production use, you may need to enable billing in Google Cloud Console.

## Step 4: Configure Environment Variables

### 4a. Create Configuration File

In the project root directory, create a file named `.env.local`:

```bash
# On Windows
type nul > .env.local

# On macOS/Linux
touch .env.local
```

### 4b. Add Your Configuration

Open `.env.local` in your text editor and add:

```env
# AI Provider Configuration
AI_PROVIDER=gemini
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
GEMINI_MODEL=gemini-3.5-flash

# Optional: Adjust these if needed
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_OUTPUT_TOKENS=1800
GEMINI_MAX_RETRIES=1

# RAG Configuration
JIGYASA_REQUIRE_RAG=true
JIGYASA_MIN_RAG_RESULTS=1
JIGYASA_MAX_CONTEXT_CHARS=10000

# Rate Limiting
JIGYASA_RATE_LIMIT_REQUESTS=10
JIGYASA_RATE_LIMIT_WINDOW_SECONDS=60

# Request Limits
JIGYASA_MAX_INPUT_CHARS=2000
JIGYASA_REQUEST_TIMEOUT_MS=30000
```

**Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual Gemini API key from Step 3.**

### 4c. Verify Configuration

**Important Security Checks:**

✓ File is named `.env.local` (not `.env` or `.env.txt`)  
✓ File is in the project root (same directory as `package.json`)  
✓ File is NOT committed to Git (it's in `.gitignore`)  
✓ API key is the only thing you changed  

## Step 5: Test Gemini Integration

Run the integration test to verify your setup:

```bash
npm run ai:test-gemini
```

**Expected output:**

```
======================================================================
GEMINI INTEGRATION TEST
======================================================================

Provider: Gemini
Model: gemini-3.5-flash
Temperature: 0.2

Testing health check...
Health: configured=true, available=true, mock=false

Test 1/2: Science question about eclipses
Question: "Grahan kyon hota hai?"
RAG: 7 results, domains: science, narrative
Duration: 2341ms
Short Answer: ...
✓ PASS

Test 2/2: Mixed question requiring both Katha and Vigyan
Question: "Rahu Ketu aur eclipse ka relation kya hai?"
RAG: 8 results, domains: science, narrative
Duration: 2198ms
Short Answer: ...
✓ PASS

======================================================================
TEST SUMMARY
======================================================================
Total tests: 2
Passed: 2
Failed: 0

✓ ALL TESTS PASSED
```

If you see errors:

| Error Message | Solution |
|---------------|----------|
| "GEMINI_API_KEY not found" | Check `.env.local` file exists and has the key |
| "Invalid API key" | Verify you copied the entire key correctly |
| "Rate limit exceeded" | Wait a minute and try again |
| "Model not found" | Check `GEMINI_MODEL` is set to `gemini-3.5-flash` |

## Step 6: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

**Expected output:**

```
▲ Next.js 16.2.10
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

## Step 7: Test in Browser

### 7a. Open the Application

Visit: **http://localhost:3000**

You should see the AkasGatha homepage with:
- Hero section
- About preview
- Granth preview
- Navigation bar

### 7b. Navigate to Jigyasa

Click **"Ask Jigyasa"** in the navigation or visit: **http://localhost:3000/ask**

### 7c. Ask a Test Question

Try asking (in English, Hindi, or Hinglish):

**Science Question:**
```
Why do eclipses happen?
```
or
```
Grahan kyon hota hai?
```

**Mixed Question (Cultural + Scientific):**
```
What is the connection between Rahu Ketu and eclipses?
```
or
```
Rahu Ketu aur eclipse ka relation kya hai?
```

### 7d. Verify the Response

Check that you receive:

✓ A short answer (1-2 sentences)  
✓ Either Katha (cultural) or Vigyan (science) sections (or both for mixed questions)  
✓ Pramaan (evidence statements)  
✓ Sources with clickable links  
✓ Uncertainty statement  
✓ Follow-up questions  
✓ No mock badge (should say "Powered by Gemini")  

### 7e. Test Language Modes

Use the language toggle at the bottom:
- **EN** - English response
- **HI** - Hindi response (Devanagari script)
- **Hinglish** - Hinglish response (Roman script)

## Step 8: Production Build (Optional)

To test the production build:

```bash
# Build for production
npm run build

# Expected: ✓ Compiled successfully

# Start production server
npm start

# Visit: http://localhost:3000
```

## Troubleshooting

### Issue: "Mock mode" badge appears

**Cause:** AkasGatha is running in mock mode (not using Gemini)

**Solution:**
1. Check `.env.local` exists in project root
2. Verify `AI_PROVIDER=gemini` (not `mock`)
3. Verify `GEMINI_API_KEY` is set
4. Restart dev server (`Ctrl+C`, then `npm run dev`)

### Issue: "Provider Not Configured" error

**Cause:** Gemini provider initialization failed

**Solutions:**
1. Verify API key is correct (no extra spaces)
2. Check `GEMINI_MODEL=gemini-3.5-flash`
3. Verify `.env.local` file is in project root
4. Restart dev server

### Issue: "Insufficient Knowledge" response

**Cause:** Question is outside current knowledge base scope

**Current Knowledge Base Covers:**
- Eclipses (solar and lunar)
- Moon phases
- Seasons
- Day/night cycle
- Planetary motion
- Satellites
- Telescopes
- Black holes
- Constellations
- Nakshatra (cultural)
- Rahu-Ketu narratives

**Out of Scope:**
- Specific current events
- Astrology predictions
- Personal questions
- Non-astronomy topics

### Issue: Rate limit errors

**Cause:** Free tier limits exceeded

**Solutions:**
1. Wait 1 minute between requests
2. Reduce `JIGYASA_RATE_LIMIT_REQUESTS` in `.env.local`
3. Consider enabling billing for higher limits

### Issue: Response is empty or errors

**Cause:** Network, API, or configuration issue

**Debug Steps:**
1. Check browser Console (F12) for errors
2. Check terminal for server errors
3. Verify internet connection
4. Try `npm run ai:test-gemini` again
5. Check Gemini API status

### Issue: Build fails

**Solutions:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# If still fails, check for TypeScript errors
npm run type-check
```

## FAQ

### Q: Do I need to pay for Gemini API?

**A:** The free tier is sufficient for development and light usage. You get:
- 15 requests/minute
- 1,500 requests/day
- 1 million tokens/day

For production or heavy usage, you may need to enable billing.

### Q: Can I use a different AI model?

**A:** Phase 5 supports Gemini only. OpenRouter support is planned but not yet implemented. You can use `AI_PROVIDER=mock` for development without an API key.

### Q: How do I add more knowledge to the corpus?

**A:** You can add Markdown files to `content/knowledge/` with proper frontmatter. See existing files for format. Then run:
```bash
npm run rag:validate
npm run rag:ingest
```

### Q: Is my API key secure?

**A:** Yes, if configured correctly:
- `.env.local` is git-ignored (never committed)
- API key is server-only (never sent to browser)
- Key is not logged or exposed in responses

### Q: Can I deploy this to production?

**A:** Phase 5 is production-ready for the AI features, but:
- No authentication system yet (Phase 7)
- No database persistence (Phase 7)
- No distributed rate limiting (Phase 7)
- Docker/AWS deployment guide coming (Phase 8)

### Q: Where can I get help?

**A:** Check:
1. This guide
2. `docs/PHASE_5_JIGYASA_AI.md` - Technical details
3. `docs/PHASE_STATUS.md` - Current state
4. Project issues on repository

## Next Steps

Once you have AkasGatha running:

1. **Explore:** Try different questions in all three languages
2. **Test:** Ask edge cases (out-of-scope, insufficient knowledge)
3. **Experiment:** Adjust temperature and other parameters
4. **Extend:** Add your own knowledge documents to the corpus
5. **Build:** Work on Phase 6 (dynamic 3D scenes) or beyond

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_PROVIDER` | Yes | `mock` | `gemini` or `mock` |
| `GEMINI_API_KEY` | Yes (Gemini) | — | Your Gemini API key |
| `GEMINI_MODEL` | Yes (Gemini) | — | Model name (e.g., `gemini-3.5-flash`) |
| `GEMINI_TEMPERATURE` | No | `0.2` | Randomness (0.0-2.0) |
| `GEMINI_MAX_OUTPUT_TOKENS` | No | `1800` | Max response length |
| `GEMINI_MAX_RETRIES` | No | `1` | Max retry attempts |
| `JIGYASA_REQUIRE_RAG` | No | `true` | Require RAG context |
| `JIGYASA_MIN_RAG_RESULTS` | No | `1` | Min RAG results needed |
| `JIGYASA_MAX_CONTEXT_CHARS` | No | `10000` | Max RAG context size |
| `JIGYASA_RATE_LIMIT_REQUESTS` | No | `10` | Max requests per window |
| `JIGYASA_RATE_LIMIT_WINDOW_SECONDS` | No | `60` | Rate limit window |
| `JIGYASA_MAX_INPUT_CHARS` | No | `2000` | Max question length |
| `JIGYASA_REQUEST_TIMEOUT_MS` | No | `30000` | Request timeout |

---

**Congratulations!** You've successfully set up AkasGatha with real AI-powered responses. Enjoy exploring the cosmos with Jigyasa! 🌌✨
