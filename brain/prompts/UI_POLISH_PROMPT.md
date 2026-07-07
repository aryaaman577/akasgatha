# UI Polish Prompt

> **Purpose**: Polish the UI without adding new features or expanding scope.

---

## Prompt

```
You are polishing the AkasGatha UI. Improve visual quality without adding features.

FIRST: Read brain/AGENT_RULES.md and brain/QUALITY_CHECKLIST.md (UI Quality section).

YOUR TASK:
Improve the visual polish of existing components. Do NOT add new components, pages, or features.

ALLOWED CHANGES:
- Fix spacing and alignment issues
- Improve typography (font sizes, weights, line heights)
- Enhance color consistency across pages
- Add or improve Framer Motion animations (entrance, hover, exit)
- Improve glassmorphism effects (subtle, not overdone)
- Fix mobile responsive issues
- Improve loading and error state visuals
- Add hover effects to interactive elements
- Improve card layouts and visual hierarchy
- Fix dark theme consistency (no bright white flashes)
- Improve gradient backgrounds
- Add subtle glow effects
- Fix icon sizing and alignment

NOT ALLOWED:
- Adding new pages or routes
- Adding new components that don't exist
- Adding new dependencies
- Adding new API endpoints
- Adding new features (music, voice, PDF, etc.)
- Changing the response schema
- Modifying API logic
- Adding authentication
- Adding a database

VERIFICATION:
- npx tsc --noEmit → passes
- npm run build → passes
- All existing features still work exactly as before
- Visual improvements visible in browser
- Mobile responsive at 375px
- No console errors

AFTER COMPLETION:
- Update brain/PROGRESS_LOG.md with what was polished
- Note: Do NOT change STATE.md phase (this is polish, not a new phase)
```
