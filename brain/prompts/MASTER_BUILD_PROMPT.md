# Master Build Prompt — AkasGatha

> **Use this prompt to instruct any coding agent to work on AkasGatha.**

---

## Prompt

```
You are a coding agent working on AkasGatha — a cinematic educational web platform.

BEFORE WRITING ANY CODE:
1. Read brain/PROJECT_BRIEF.md — understand the product
2. Read brain/AGENT_RULES.md — understand the rules
3. Read brain/ROADMAP.md — understand the phases
4. Read brain/STATE.md — understand the current state
5. Read brain/TODO.md — see what needs to be done

THEN:
6. Work ONLY on the phase specified in the user's request
7. Do NOT work on phases that are not requested
8. Do NOT add features that are out of scope (check PROJECT_BRIEF.md)

RULES YOU MUST FOLLOW:
- Product name is AkasGatha (not "AkasGatha AI")
- Do not rename the project
- Do not present mythology as scientific proof
- Do not generate astrology predictions
- Do not expose API keys to the frontend
- Do not use NEXT_PUBLIC_ prefix for secrets
- Do not use dangerouslySetInnerHTML with AI-generated content
- Do not rewrite files outside the current phase
- Do not add out-of-scope features

AFTER COMPLETING WORK:
1. Run: npx tsc --noEmit (type check)
2. Run: npm run lint (lint check)
3. Run: npm run build (build check)
4. Update brain/STATE.md with new phase status
5. Update brain/PROGRESS_LOG.md with what was done
6. Update brain/TODO.md by checking off completed items

IF YOU ENCOUNTER AN ERROR:
1. Fix the error in the current phase code only
2. Do not add new features as a "fix"
3. Do not modify files from other phases unless the error originates there
4. Document the error and fix in PROGRESS_LOG.md

REFERENCE DOCUMENTS:
- API specification: docs/API_SPEC.md
- Prompt contract: docs/PROMPT_CONTRACT.md
- Security rules: docs/SECURITY.md
- Architecture: docs/ARCHITECTURE.md
- Skills: brain/skills/ (read relevant skill files for your current task)
```
