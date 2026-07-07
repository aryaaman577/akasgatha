# Threat Model — AkasGatha

## Overview

This threat model identifies assets, attackers, attack surfaces, threats, impacts, and defenses for the AkasGatha MVP. It is scoped to a student internship project deployed on AWS EC2, not a production SaaS application.

---

## Assets to Protect

| Asset | Sensitivity | Impact if Compromised |
|---|---|---|
| Gemini API Key | **Critical** | Attacker can use your API quota; financial cost; key revocation |
| Server-side source code | Medium | IP exposure, but no user data at risk |
| LLM prompt templates | Medium | Attacker could understand system behavior to craft better injections |
| EC2 instance | **High** | Attacker gains compute; possible crypto mining; AWS bill spike |
| User-submitted questions | Low | No PII collected; ephemeral; not stored |
| AI-generated responses | Medium | Misinformation if safety rules are bypassed |
| Application availability | Medium | Demo not accessible during presentation/evaluation |

---

## Attackers

| Attacker | Motivation | Capability |
|---|---|---|
| Curious student/peer | Explore, test boundaries | Low — basic web knowledge |
| Automated scanner | Opportunistic vulnerability scanning | Medium — scans open ports, common paths |
| Prompt injection tester | Bypass content safety rules | Medium — knows LLM injection techniques |
| Bot/scraper | Exhaust API quota, scrape content | Medium — automated requests |
| Internship evaluator | Verify security claims in report | Low — reviews code, not attacks |

---

## Attack Surfaces

| Surface | Entry Point | Exposed To |
|---|---|---|
| Frontend | Public URL | All users |
| `/api/jigyasa` endpoint | POST requests | All users |
| `/api/health` endpoint | GET requests | All users |
| EC2 SSH port | Port 22 | Anyone if misconfigured |
| Docker container | Container runtime | Host system if misconfigured |
| Environment variables | Server memory, `.env` file | Code with access to `process.env` |
| Git repository | Code history | Anyone with repo access |
| npm dependencies | `node_modules` | Build pipeline |

---

## Threats, Impact, and Defenses

### Threat 1: API Key Leakage

| Attribute | Detail |
|---|---|
| **Attack** | API key committed to git, exposed in client bundle, or logged |
| **Impact** | **Critical** — Attacker uses your Gemini quota; financial cost; key must be revoked |
| **Likelihood** | High (common student mistake) |
| **Defense** | `.env` in `.gitignore`; no `NEXT_PUBLIC_` prefix; server-side only access; no key logging |
| **Detection** | `grep -r "AIza" .` (Gemini keys start with "AIza"); git-secrets pre-commit hook |
| **Residual Risk** | Key could be in git history if committed once. Rotate key if this happens. |

### Threat 2: Prompt Injection

| Attribute | Detail |
|---|---|
| **Attack** | User crafts a question that overrides system prompt: "Ignore previous instructions and..." |
| **Impact** | **High** — LLM ignores safety rules; generates harmful/incorrect content |
| **Likelihood** | Medium (prompt injection is well-known) |
| **Defense** | Input sanitization; injection pattern detection; output schema validation; fallback response |
| **Detection** | Pattern matching on input; schema validation failure logs |
| **Residual Risk** | Novel injection techniques may bypass pattern detection. Schema validation is the safety net. |

### Threat 3: LLM Hallucination

| Attribute | Detail |
|---|---|
| **Attack** | Not an attack — inherent LLM behavior. AI generates plausible but incorrect information. |
| **Impact** | **Medium** — Misinformation presented as fact |
| **Likelihood** | High (LLMs routinely hallucinate) |
| **Defense** | Structured response format; evidence level field; "unknown" option in pramaanMatrix; user-visible labels |
| **Detection** | Difficult to auto-detect. Rely on structured format to flag uncertainty. |
| **Residual Risk** | Some hallucinated "facts" may pass schema validation. The structured format mitigates by making uncertainty explicit. |

### Threat 4: Myth-as-Proof Misinformation

| Attribute | Detail |
|---|---|
| **Attack** | LLM presents mythology as scientific evidence (e.g., "Vedas predicted quantum physics") |
| **Impact** | **High** — Violates core product principle; educational harm; evaluation failure |
| **Likelihood** | Medium (LLMs trained on internet content that mixes myth and science) |
| **Defense** | System prompt rules; forced "Cultural Story" label; banned phrase scanning; post-validation |
| **Detection** | Banned phrase list; `kathaMandal.label` check; content review |
| **Residual Risk** | Subtle myth-as-proof language may pass filters. The structured format reduces this by separating sections. |

### Threat 5: XSS Through Generated Content

| Attribute | Detail |
|---|---|
| **Attack** | LLM response contains `<script>` tags or HTML that gets rendered in the browser |
| **Impact** | **High** — Script execution in user's browser; session hijacking (if auth existed) |
| **Likelihood** | Low (React auto-escapes by default; unlikely LLM output) |
| **Defense** | React JSX auto-escaping; no `dangerouslySetInnerHTML`; content sanitization |
| **Detection** | Code review for `dangerouslySetInnerHTML`; HTML pattern scan in responses |
| **Residual Risk** | Minimal — React's default behavior is the defense. |

### Threat 6: Rate Abuse / API Cost Exhaustion

| Attribute | Detail |
|---|---|
| **Attack** | Automated requests to `/api/jigyasa` to exhaust Gemini API quota and increase costs |
| **Impact** | **Medium** — Financial cost; API quota exhaustion; degraded availability |
| **Likelihood** | Medium (easy to automate) |
| **Defense** | In-memory rate limiting (30 req/60s per IP); 429 response; request size limit |
| **Detection** | Rate limit hit logs; monitoring request counts |
| **Residual Risk** | Distributed attack from multiple IPs bypasses per-IP rate limiting. Acceptable for MVP. |

### Threat 7: Dependency Risk

| Attribute | Detail |
|---|---|
| **Attack** | Vulnerable npm package in dependency tree (supply chain attack) |
| **Impact** | **Medium** — Code execution; data exfiltration (theoretical) |
| **Likelihood** | Low (but non-zero for any npm project) |
| **Defense** | `npm audit` before deployment; use specific versions in package.json; minimal dependencies |
| **Detection** | `npm audit`; GitHub Dependabot alerts (if repo is on GitHub) |
| **Residual Risk** | Zero-day in a dependency. Mitigated by minimal attack surface (no user data, no auth). |

### Threat 8: Docker Misconfiguration

| Attribute | Detail |
|---|---|
| **Attack** | Container runs as root; `.env` baked into image; unnecessary ports exposed |
| **Impact** | **Medium** — Privilege escalation; secret exposure; expanded attack surface |
| **Likelihood** | Medium (common mistake in student projects) |
| **Defense** | Non-root user; multi-stage build; `.dockerignore`; runtime env injection |
| **Detection** | Review Dockerfile; `docker inspect` image; check running user |
| **Residual Risk** | Docker daemon itself runs as root on the host. Standard Docker behavior. |

### Threat 9: AWS Port Exposure

| Attribute | Detail |
|---|---|
| **Attack** | SSH port open to `0.0.0.0/0`; debug ports exposed; all traffic allowed |
| **Impact** | **High** — Brute force SSH; unauthorized access; crypto mining on your instance |
| **Likelihood** | Medium (default security groups can be permissive) |
| **Defense** | SSH only from your IP; only ports 22, 80, 443 open; all others closed |
| **Detection** | AWS console security group review; `nmap` scan of your instance |
| **Residual Risk** | If your IP changes (dynamic ISP), SSH may require security group update. |

### Threat 10: Secret Leakage in Logs

| Attribute | Detail |
|---|---|
| **Attack** | API keys, full prompts, or user input logged to console or log files |
| **Impact** | **Medium** — Secrets accessible in Docker logs, CloudWatch, or terminal history |
| **Likelihood** | Medium (developers often log too much during debugging) |
| **Defense** | Never log API keys; log only key presence (`key ? 'set' : 'missing'`); sanitize error logs |
| **Detection** | `grep -r "console.log" --include="*.ts"` — review all log statements |
| **Residual Risk** | Third-party libraries may log unexpectedly. Minimal for this project. |

---

## MVP Risk Decisions

| Decision | Risk Accepted | Justification |
|---|---|---|
| In-memory rate limiting | Resets on restart; no distributed defense | Acceptable for demo; not production |
| No authentication | Anyone can use the API | No user data; ephemeral usage; demo project |
| No database | No audit trail | Reduces complexity; no sensitive data to store |
| No HTTPS on EC2 | Traffic not encrypted | Demo project; no sensitive data in transit |
| Single EC2 instance | No redundancy | Student project; not SLA-bound |
| Free tier EC2 | Limited resources | Sufficient for demo; cost-controlled |

---

## Residual Risks Summary

| Risk | Severity | Mitigation Status |
|---|---|---|
| Novel prompt injection bypasses schema validation | Medium | Partially mitigated — schema is safety net |
| LLM hallucination passes as fact | Medium | Partially mitigated — structured format helps |
| API key in git history (if committed once) | High | Must rotate key immediately if this happens |
| Distributed rate abuse | Low | Not mitigated — acceptable for MVP |
| Zero-day in npm dependency | Low | Not mitigated — standard risk |
