# Phase 0: Docs Prompt

> **Purpose**: Generate or verify Phase 0 documentation only. Do not write application code.

---

## Prompt

```
You are working on AkasGatha Phase 0: Documentation and Brain Setup.

YOUR TASK:
Generate or verify all planning documents. Do NOT write any application code.

DELIVERABLES:
Create complete content for these directories:
1. docs/ — PRD, Architecture, API Spec, Prompt Contract, Security, Threat Model, Security Layers, Test Plan, Deployment Runbook, Report Draft
2. brain/ — Project Brief, Agent Rules, Roadmap, State, TODO, Decisions, Progress Log, Quality Checklist, Security Checklist
3. brain/prompts/ — All phase prompts and utility prompts
4. brain/skills/ — All skill reference files
5. Root: README_FIRST.md, .env.example, .gitignore

RULES:
- Read brain/AGENT_RULES.md first
- Product name is AkasGatha (never rename, never add "AI")
- Content must be practical and buildable — not overengineered
- Never present mythology as scientific proof in any document
- No application code in this phase
- Update STATE.md to show Phase 0 complete
- Update PROGRESS_LOG.md with Phase 0 entry

VERIFICATION:
- All files listed above exist with complete content
- Cross-references between documents are consistent
- Roadmap phases align with TODO checklist
- API spec matches Prompt Contract response schema
```
