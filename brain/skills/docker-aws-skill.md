# Skill: Docker + AWS Deployment

> How to containerize AkasGatha and deploy to AWS EC2.

---

## Dockerfile

### Multi-stage build strategy:

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Key requirements:
- `next.config.js` must have `output: 'standalone'`
- Non-root user (nextjs) for security
- No `.env` COPY in any stage

## .dockerignore

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
.vscode
```

## docker-compose.yml

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

## Environment Variables on Server

On EC2, create `.env` file directly:

```bash
nano ~/.env
# Add:
# GEMINI_API_KEY=your_key
# LLM_PROVIDER=gemini
# RATE_LIMIT_MAX=30
# RATE_LIMIT_WINDOW=60
```

Then run with: `docker run --env-file ~/.env ...`

## EC2 Deployment Steps

### 1. Launch Instance
- AMI: Ubuntu 22.04 LTS
- Type: t2.micro (free tier)
- Key pair: Create and download .pem
- Security group: SSH (22) + HTTP (80)

### 2. Install Docker on EC2
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ubuntu
# Log out and back in
```

### 3. Deploy Application
```bash
git clone <repo-url> akasgatha
cd akasgatha
nano .env  # Add secrets
docker build -t akasgatha:latest .
docker run -d --name akasgatha -p 80:3000 --env-file .env --restart unless-stopped akasgatha:latest
```

### 4. Verify
```bash
curl http://localhost/api/health
# From your browser: http://<EC2_PUBLIC_IP>
```

## Security Group Configuration

| Type | Protocol | Port | Source |
|---|---|---|---|
| SSH | TCP | 22 | Your IP/32 |
| HTTP | TCP | 80 | 0.0.0.0/0 |

**Critical**: Never set SSH to 0.0.0.0/0.

## Public URL Testing

After deployment, test these URLs:
- `http://<EC2_IP>/` → Home page loads
- `http://<EC2_IP>/ask` → Ask page loads
- `http://<EC2_IP>/api/health` → Returns JSON health check
- `http://<EC2_IP>/about` → About page loads

Capture screenshots of each for the report.
