# Phase 3: Mock Jigyasa UI Prompt

> **Purpose**: Build the question input form and response display cards with mock data.

---

## Prompt

```
You are working on AkasGatha Phase 3: Mock Jigyasa UI.

FIRST: Read brain/PROJECT_BRIEF.md, brain/AGENT_RULES.md, brain/skills/section-design-skill.md.
ALSO READ: docs/API_SPEC.md for response structure and docs/PROMPT_CONTRACT.md for good output examples.

YOUR TASK:
Build the Jigyasa Engine question form and all response section cards. Use hardcoded mock data (not API calls yet).

COMPONENTS TO BUILD:

1. src/components/jigyasa/QuestionInput.tsx
   - Text input for question (5-500 chars, with character counter)
   - Mood selector (curious, scholarly, storyteller, skeptic, mystical)
   - Topic type selector (planet, nakshatra, eclipse, moon, mystery, general)
   - Submit button with loading state
   - Framer Motion entrance animation

2. src/components/jigyasa/ResponseView.tsx
   - Layout container for all response section cards
   - Receives the full response object as props
   - Renders sections in order: KathaMandal → RahasyaChakra → VigyanDrishti → SatyaSetu → PramaanMatrix → (3D scene placeholder) → JigyasaAgni → SmritiQuest

3. src/components/jigyasa/KathaMandal.tsx
   - Card with "Cultural Story" label (prominent, always visible)
   - Disclaimer text visible
   - Story content
   - Distinct visual style (warm, story-like)

4. src/components/jigyasa/RahasyaChakra.tsx
   - Mystery/wonder card
   - Wonder question highlighted
   - Intriguing visual style

5. src/components/jigyasa/VigyanDrishti.tsx
   - Science explanation card
   - Key facts as bullet list
   - Clean, scientific visual style

6. src/components/jigyasa/SatyaSetu.tsx
   - Bridge card showing alignment and divergence
   - Two-column or split layout for alignment vs divergence

7. src/components/jigyasa/PramaanMatrix.tsx
   - Evidence grid: Proven / Symbolic / Unknown
   - Evidence level indicator (high/medium/low/unknown)
   - Visual badge for evidence level

8. src/components/jigyasa/JigyasaAgni.tsx
   - 3 follow-up question buttons/cards
   - Each clickable (triggers new question submission)
   - Spark/fire-themed styling

9. src/components/jigyasa/SmritiQuest.tsx
   - Quiz component with 3-5 multiple choice questions
   - Option selection → reveal correct/incorrect
   - Explanation shown after answering
   - Score tracking within the quiz

MOCK DATA:
Create src/lib/data/mock-response.ts with a complete valid response object matching the schema in docs/API_SPEC.md. Use the eclipse example from PROMPT_CONTRACT.md.

PAGE UPDATE:
10. Update src/app/ask/page.tsx
    - QuestionInput at top
    - On "submit" → show mock response in ResponseView
    - Add loading state (simulate with setTimeout)
    - Add error state
    - Smooth scroll to response after submission

STYLING:
- Each response card has a unique accent color or icon for visual distinction
- Cards use Shadcn UI Card component as base
- Framer Motion stagger animation for card entrance
- Dark theme consistent with Phase 2
- Mobile responsive

VERIFICATION:
- npx tsc --noEmit → passes
- npm run lint → passes
- npm run build → passes
- Ask page: type question → click submit → mock response renders with all cards
- Quiz works: select answers, see feedback
- Follow-up questions are clickable
- Mobile layout works

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 3 items in brain/TODO.md

DO NOT:
- Call any real API (that's Phase 4)
- Add LLM integration (that's Phase 5)
- Add 3D scenes (that's Phase 6)
- Modify Phase 2 components unless fixing a bug
```
