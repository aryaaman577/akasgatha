# Phase 8: Docker + AWS Deployment Prompt

> **Purpose**: Containerize the app and deploy to AWS EC2.

---

## Prompt

```
You are working on AkasGatha Phase 8: Docker + AWS Deployment.

FIRST: Read brain/AGENT_RULES.md, docs/DEPLOYMENT_RUNBOOK.md, brain/skills/docker-aws-skill.md.

YOUR TASK:
Create Docker configuration files and prepare for AWS EC2 deployment.

FILES TO CREATE:

1. Dockerfile
   Multi-stage build:

   Stage 1 (deps):
   - FROM node:20-alpine AS deps
   - WORKDIR /app
   - COPY package.json package-lock.json ./
   - RUN npm ci --only=production

   Stage 2 (builder):
   - FROM node:20-alpine AS builder
   - WORKDIR /app
   - COPY --from=deps /app/node_modules ./node_modules
   - COPY . .
   - RUN npm run build

   Stage 3 (runner):
   - FROM node:20-alpine AS runner
   - WORKDIR /app
   - ENV NODE_ENV=production
   - Create non-root user (nextjs, UID 1001)
   - COPY --from=builder /app/.next/standalone ./
   - COPY --from=builder /app/.next/static ./.next/static
   - COPY --from=builder /app/public ./public
   - USER nextjs
   - EXPOSE 3000
   - CMD ["node", "server.js"]

2. .dockerignore
   ```
   node_modules
   .next
   .git
   .gitignore
   docs
   brain
   .env
   .env.*
   *.md
   .DS_Store
   coverage
   ```

3. docker-compose.yml
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
       restart: unless-stopped
       environment:
         - NODE_ENV=production
   ```

VERIFICATION (LOCAL):
- docker build -t akasgatha:latest . → builds successfully
- docker run -d --name akasgatha -p 3000:3000 --env-file .env akasgatha:latest → starts
- curl http://localhost:3000/api/health → 200 OK
- http://localhost:3000 → home page loads
- docker exec akasgatha whoami → "nextjs" (not root)
- docker run --rm akasgatha cat /app/.env → file not found (good)

AWS DEPLOYMENT NOTES:
The actual AWS deployment is manual (not automated by this phase). Document these steps in the deployment runbook:

1. Launch EC2 (Ubuntu 22.04 LTS, t2.micro)
2. Configure security group (SSH from your IP, HTTP from anywhere)
3. SSH into instance
4. Install Docker
5. Clone repo or transfer image
6. Create .env on server
7. Build and run container (port 80:3000)
8. Test public IP access

Ensure next.config.js has:
- output: 'standalone'

AFTER COMPLETION:
- Update brain/STATE.md
- Update brain/PROGRESS_LOG.md
- Check off Phase 8 items in brain/TODO.md

DO NOT:
- Add new features
- Modify application logic
- COPY .env into the Docker image
- Run container as root
- Expose ports other than 3000
```
