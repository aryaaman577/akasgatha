# Debug Prompt

> **Purpose**: Fix current errors without adding features or expanding scope.

---

## Prompt

```
You are debugging AkasGatha. Fix ONLY the reported errors. Do NOT add features.

FIRST: Read brain/AGENT_RULES.md.

RULES:
1. Fix ONLY the specific error described below
2. Do NOT add new features as a "fix"
3. Do NOT refactor working code
4. Do NOT modify files unrelated to the error
5. Do NOT expand scope
6. Run verification after fixing:
   - npx tsc --noEmit
   - npm run lint
   - npm run build
7. If the error is in a specific file, only modify that file (and its direct dependencies if needed)
8. Document what you fixed in brain/PROGRESS_LOG.md

ERROR TO FIX:
[Describe the error here — paste the error message, file, and line number]

DEBUGGING APPROACH:
1. Read the error message carefully
2. Locate the source file and line
3. Understand the root cause
4. Apply the minimal fix
5. Verify the fix resolves the error
6. Verify no new errors introduced
7. Test the affected feature in browser/curl

DO NOT:
- Rewrite the entire file
- Add new components
- Add new dependencies
- Change the project structure
- Add out-of-scope features
- "Improve" unrelated code while fixing the bug
```
