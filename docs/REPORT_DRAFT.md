# Internship Report Draft — AkasGatha

---

## Title

**AkasGatha: A Cinematic Educational Web Platform Bridging Ancient Indian Sky Stories with Modern Space Science Using Generative AI and Cloud Computing**

---

## Abstract

AkasGatha is a web-based educational platform that uses Generative AI to explain ancient Indian sky narratives — such as stories about planets, nakshatras (constellations), eclipses, and moon phases — alongside modern space science. The platform ensures clear separation between cultural stories, symbolic meanings, and scientific evidence, avoiding the common pitfall of presenting mythology as scientific proof.

Built with Next.js, TypeScript, and Tailwind CSS, the application features an AI-powered question-answer engine (Jigyasa Engine) that generates structured, multi-section responses using the Google Gemini API. Each response includes the cultural story, the scientific explanation, a bridge between the two, evidence grading, interactive 3D visualizations, follow-up curiosity questions, and quiz challenges.

The application is containerized with Docker and deployed on AWS EC2, demonstrating practical skills in Generative AI prompt engineering, structured output generation, content safety, and cloud deployment.

---

## 1. Problem Statement

Ancient Indian astronomical traditions contain rich observations about celestial phenomena — planetary movements, eclipse cycles, constellation patterns, and lunar phases. However, existing online resources typically present these in one of two problematic ways:

1. **As pure mythology** — dismissing the astronomical observation component entirely
2. **As scientific proof** — making unverifiable claims that ancient texts "predicted" modern science

There is no accessible, interactive platform that:
- Presents cultural sky stories with respect and context
- Explains the same phenomena through modern science
- Clearly separates story, symbolism, science, evidence, and open mystery
- Uses AI to make this exploration interactive and curiosity-driven

---

## 2. Objectives

1. Design and develop a cinematic, educational web application that explains cosmic topics in a structured, layered format
2. Implement a Generative AI-powered question-answer engine that produces structured, schema-validated responses
3. Ensure content safety by enforcing clear separation between cultural narratives and scientific explanations
4. Build interactive 3D visualizations for cosmic phenomena using React Three Fiber
5. Containerize the application with Docker and deploy on AWS EC2
6. Demonstrate practical skills in prompt engineering, structured LLM output, input validation, and security hardening

---

## 3. Proposed Solution

AkasGatha addresses the problem through a structured, AI-powered learning interface with the following key features:

### Core Features

| Feature | Hindi Name | Purpose |
|---|---|---|
| Celestial Gateway | Akas Dwar | Cinematic landing with hero animation |
| Sky Library | Akas Granth | Topic library with preset cosmic topics |
| Curiosity Engine | Jigyasa Engine | AI-powered question input and answer system |
| Story Circle | Katha Mandal | Cultural/mythological story section |
| Mystery Wheel | Rahasya Chakra | Wonder and mystery angle |
| Science Lens | Vigyan Drishti | Modern science explanation |
| Truth Bridge | Satya Setu | Bridge between story and science |
| Evidence Matrix | Pramaan Matrix | Evidence grading and reality check |
| Visual Instrument | Drishya Yantra | 3D visual scenes (3 templates) |
| Curiosity Spark | Jigyasa Agni | AI-generated follow-up questions |
| Memory Quest | Smriti Quest | Quiz and revision section |

### Content Safety Principles

- Every cultural story is labeled as "Cultural Story" — never as scientific evidence
- Every scientific section contains only verifiable information
- A bridge section honestly states where story and science align, diverge, or remain open
- An evidence matrix grades claims as proven, symbolic, or unknown
- No astrology predictions, horoscopes, or fortune-telling

---

## 4. System Architecture

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Animation | Framer Motion |
| 3D Rendering | React Three Fiber + drei |
| AI Provider | Google Gemini API |
| Schema Validation | Zod |
| Containerization | Docker (multi-stage build) |
| Cloud Deployment | AWS EC2 (Ubuntu) |

### Architecture Overview

The application follows a standard Next.js full-stack architecture:

1. **Frontend** (React/Next.js): Renders the UI, handles user input, displays AI responses
2. **API Layer** (Next.js Route Handlers): Validates input, constructs prompts, calls LLM, validates output
3. **LLM Layer** (Gemini API): Generates structured responses based on the prompt contract
4. **Deployment Layer** (Docker + AWS EC2): Containerized production deployment

All LLM API calls happen server-side. No API keys are exposed to the browser.

---

## 5. Modules

### 5.1 Akas Dwar (Landing Section)
Cinematic hero section with animated title, tagline, and call-to-action. Uses Framer Motion for entrance animations and a subtle starfield background.

### 5.2 Akas Granth (Topic Library)
Grid of preset topics (planets, nakshatras, eclipses, moon phases, mysteries) that users can select to explore. Each topic card has an icon, title, and brief description.

### 5.3 Jigyasa Engine (AI Question-Answer)
The core feature. Users type a cosmic question, select a mood (curious, scholarly, etc.), and receive a multi-section AI response. The response is generated by the Gemini API and validated against a strict JSON schema.

### 5.4 Response Sections (Katha Mandal → Smriti Quest)
Each AI response is displayed across multiple cards:
- **Katha Mandal**: The cultural story (clearly labeled)
- **Rahasya Chakra**: The mystery/wonder angle
- **Vigyan Drishti**: The scientific explanation
- **Satya Setu**: Where story and science meet
- **Pramaan Matrix**: Evidence grading (proven/symbolic/unknown)

### 5.5 Drishya Yantra (3D Visualizations)
Three reusable 3D scene templates (cosmic sky, eclipse, planet orbit) built with React Three Fiber. Scenes are lazy-loaded and mapped to topic type via the `sceneType` field in the AI response.

### 5.6 Jigyasa Agni (Follow-up Questions)
Three AI-generated follow-up questions that encourage further exploration. Clicking a follow-up re-submits it as a new question.

### 5.7 Smriti Quest (Quiz Section)
3–5 multiple-choice quiz questions per topic. Each question has 4 options, a correct answer, and an explanation. Quiz answers are checked client-side.

---

## 6. Generative AI Usage

### Prompt Engineering
The system uses a carefully designed prompt contract:
- **System prompt**: Defines the AI's role, response format, and safety rules
- **User prompt template**: Includes the question, mood, topic type, and exact JSON schema
- **Content safety rules**: Embedded in the system prompt to prevent myth-as-proof, astrology predictions, and off-topic responses

### Structured Output
The AI returns a strict JSON object with predefined sections. This structured approach:
- Ensures consistent UI rendering
- Enables schema validation (Zod)
- Prevents unstructured or unsafe content
- Makes content separation verifiable

### Content Safety
- Forced "Cultural Story" label on all mythological content
- Banned phrase detection for myth-as-proof patterns
- Prompt injection detection and safe fallback responses
- Evidence level grading (high/medium/low/unknown)

---

## 7. Cloud Computing Usage

### Docker Containerization
- Multi-stage Dockerfile: dependencies → build → production
- Non-root user in production container
- Environment variables injected at runtime (not baked into image)
- `.dockerignore` for minimal image size

### AWS EC2 Deployment
- Ubuntu 22.04 LTS instance (free tier eligible)
- Docker installed on EC2
- Security group: SSH (22) restricted to admin IP, HTTP (80) public
- Application accessible via EC2 public IP

---

## 8. Security Measures

### Implemented Security Layers

1. **Secret Management**: API keys in server-side env vars only
2. **Input Validation**: Zod schema validation on all API inputs
3. **Rate Limiting**: Per-IP rate limiting to prevent API abuse
4. **Prompt Injection Defense**: Pattern detection + schema validation + fallback
5. **XSS Prevention**: React auto-escaping; no `dangerouslySetInnerHTML`
6. **Safe Error Handling**: Generic error messages; no stack traces in responses
7. **Docker Security**: Non-root user; no secrets in image
8. **AWS Security**: Restrictive security groups; SSH restricted by IP

---

## 9. Testing Summary

| Category | Tests | Status |
|---|---|---|
| Build | TypeScript, lint, Next.js build | ☐ |
| UI | Page rendering, responsiveness, interactions | ☐ |
| API | Validation, rate limiting, error handling | ☐ |
| LLM | Schema validation, content safety, fallback | ☐ |
| Security | Secret audit, injection testing, audit | ☐ |
| Docker | Build, run, non-root, no secrets in image | ☐ |
| Deployment | EC2 access, public URL, security group | ☐ |

---

## 10. Future Scope

1. **User Authentication**: Login system with saved exploration history
2. **Database Integration**: Store responses, analytics, and user progress
3. **Voice Narration**: AI-generated voice narration for each section
4. **Advanced 3D**: Custom 3D scenes for each topic (not just 3 templates)
5. **Multi-language Support**: Hindi and regional language options
6. **Real Star Map**: Integration with astronomy APIs for live sky data
7. **Community Features**: User-submitted questions and community discussion
8. **PDF Export**: Generate exploration reports as downloadable PDFs
9. **Mobile App**: React Native version for iOS and Android
10. **Additional LLM Providers**: IBM watsonx, Claude, or open-source model support

---

## 11. Conclusion

AkasGatha demonstrates a practical application of Generative AI and Cloud Computing in educational technology. The platform successfully bridges ancient Indian sky narratives with modern space science while maintaining strict content safety — never presenting mythology as scientific proof.

The project showcases skills in:
- **Generative AI**: Prompt engineering, structured output generation, content safety, schema validation
- **Full-Stack Development**: Next.js, TypeScript, Tailwind CSS, React Three Fiber
- **Cloud Computing**: Docker containerization, AWS EC2 deployment
- **Security**: Input validation, rate limiting, prompt injection defense, layered security

The MVP is functional, visually cinematic, and deployable, while remaining practical and buildable as a student internship project.

---

## References

1. Google Gemini API Documentation — https://ai.google.dev/
2. Next.js Documentation — https://nextjs.org/docs
3. React Three Fiber — https://docs.pmnd.rs/react-three-fiber
4. Zod Validation Library — https://zod.dev/
5. Docker Documentation — https://docs.docker.com/
6. AWS EC2 Documentation — https://docs.aws.amazon.com/ec2/
7. OWASP LLM Security Guidelines — https://owasp.org/www-project-top-10-for-large-language-model-applications/

---

*Report prepared for: Gen AI and Cloud Computing Internship*
*Project: AkasGatha*
*Date: [INSERT DATE]*
*Author: [INSERT NAME]*
