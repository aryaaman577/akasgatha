# Deployment Runbook — AkasGatha

Step-by-step guide for local development, Docker build, and AWS EC2 deployment.

---

## 1. Local Development Setup

### Prerequisites
- Node.js 20+ (`node --version`)
- npm 10+ (`npm --version`)
- Git (`git --version`)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url> akasgatha
cd akasgatha

# 2. Install dependencies
npm ci

# 3. Create environment file
cp .env.example .env
# Edit .env and add your real GEMINI_API_KEY

# 4. Run development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Verify Local Setup

```bash
# Health check
curl http://localhost:3000/api/health
# Expected: {"status":"ok",...}

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

---

## 2. Environment Setup

### Required Environment Variables

| Variable | Example | Required | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | `AIza...` | Yes | Google Gemini API key (get from Google AI Studio) |
| `LLM_PROVIDER` | `gemini` | Yes | LLM provider to use |
| `RATE_LIMIT_MAX` | `30` | No | Max requests per window (default: 30) |
| `RATE_LIMIT_WINDOW` | `60` | No | Rate limit window in seconds (default: 60) |
| `APP_URL` | `http://localhost:3000` | No | Application URL |

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key
5. Add to `.env`: `GEMINI_API_KEY=your_key_here`

> **Security**: Never commit your real API key. The `.env` file is in `.gitignore`.

---

## 3. Docker Build

### Prerequisites
- Docker Engine installed (`docker --version`)
- Docker Compose (optional, `docker-compose --version`)

### Build the Image

```bash
# Build the Docker image
docker build -t akasgatha:latest .

# Verify image was created
docker images | grep akasgatha
# Expected: akasgatha   latest   <id>   <size>
```

### Expected Build Output

```
Step 1/X: FROM node:20-alpine AS deps
Step 2/X: WORKDIR /app
...
Step N/X: Successfully built <hash>
Successfully tagged akasgatha:latest
```

### Common Build Errors

| Error | Cause | Fix |
|---|---|---|
| `npm ci` fails | Missing `package-lock.json` | Run `npm install` locally first, commit lock file |
| `COPY failed` | File not found | Check `.dockerignore` isn't excluding needed files |
| `next build` fails | TypeScript errors | Fix type errors locally first with `npx tsc --noEmit` |
| Out of memory | Build requires more RAM | Add `--memory=4g` to docker build |

---

## 4. Docker Run

### Run Locally with Docker

```bash
# Run with env file
docker run -d \
  --name akasgatha \
  -p 3000:3000 \
  --env-file .env \
  akasgatha:latest

# Check container is running
docker ps | grep akasgatha

# Check logs
docker logs akasgatha

# Test health endpoint
curl http://localhost:3000/api/health

# Test the app in browser
# http://localhost:3000
```

### Using Docker Compose (alternative)

```bash
# Start with compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker Compose File Reference

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
```

### Useful Docker Commands

```bash
# Stop container
docker stop akasgatha

# Remove container
docker rm akasgatha

# Remove image
docker rmi akasgatha:latest

# View container logs (last 50 lines)
docker logs --tail 50 akasgatha

# Execute command in running container
docker exec -it akasgatha sh

# Check running user
docker exec akasgatha whoami
# Expected: nextjs
```

---

## 5. AWS EC2 Deployment

### Step 5.1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. **Name**: `akasgatha-server`
3. **AMI**: Ubuntu 22.04 LTS (free tier eligible)
4. **Instance Type**: `t2.micro` (free tier) or `t3.micro`
5. **Key Pair**: Create new → download `.pem` file → store safely
6. **Security Group**: Create new with rules below
7. **Storage**: 20GB gp3 (default is fine)
8. Click **Launch Instance**

### Step 5.2: Configure Security Group

| Type | Protocol | Port | Source | Description |
|---|---|---|---|---|
| SSH | TCP | 22 | My IP | SSH access (your IP only) |
| HTTP | TCP | 80 | 0.0.0.0/0 | Public web access |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS (optional) |

> **Critical**: SSH must be restricted to YOUR IP only. Never use `0.0.0.0/0` for SSH.

### Step 5.3: Connect to EC2

```bash
# Set permissions on key file (Linux/Mac)
chmod 400 akasgatha-key.pem

# Connect via SSH
ssh -i akasgatha-key.pem ubuntu@<EC2_PUBLIC_IP>
```

For Windows (PowerShell):
```powershell
# Connect via SSH
ssh -i akasgatha-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 5.4: Install Docker on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (avoids sudo for docker commands)
sudo usermod -aG docker ubuntu

# Log out and back in for group to take effect
exit
# SSH back in
ssh -i akasgatha-key.pem ubuntu@<EC2_PUBLIC_IP>

# Verify Docker
docker --version
```

### Step 5.5: Deploy the Application

**Option A: Build on EC2**

```bash
# Clone repository
git clone <your-repo-url> akasgatha
cd akasgatha

# Create .env file
nano .env
# Add your environment variables:
# GEMINI_API_KEY=your_key
# LLM_PROVIDER=gemini
# RATE_LIMIT_MAX=30
# RATE_LIMIT_WINDOW=60

# Build Docker image
docker build -t akasgatha:latest .

# Run container (port 80 on host → 3000 in container)
docker run -d \
  --name akasgatha \
  -p 80:3000 \
  --env-file .env \
  --restart unless-stopped \
  akasgatha:latest
```

**Option B: Transfer pre-built image**

```bash
# On local machine: save image
docker save akasgatha:latest | gzip > akasgatha.tar.gz

# Transfer to EC2
scp -i akasgatha-key.pem akasgatha.tar.gz ubuntu@<EC2_IP>:~/

# On EC2: load image
gunzip -c akasgatha.tar.gz | docker load

# Run container
docker run -d --name akasgatha -p 80:3000 --env-file .env --restart unless-stopped akasgatha:latest
```

### Step 5.6: Verify Deployment

```bash
# On EC2 — check container
docker ps
docker logs akasgatha

# From your local machine — test health
curl http://<EC2_PUBLIC_IP>/api/health
# Expected: {"status":"ok",...}

# From browser
# http://<EC2_PUBLIC_IP>
# Expected: AkasGatha home page loads
```

---

## 6. Security Group Notes

### Minimum Required Rules

```
Inbound:
  SSH    (22)  → Your IP only (e.g., 203.0.113.50/32)
  HTTP   (80)  → 0.0.0.0/0 (anyone — for demo access)

Outbound:
  All traffic → 0.0.0.0/0 (default — needed for API calls to Gemini)
```

### What to Check

- [ ] SSH is NOT open to `0.0.0.0/0`
- [ ] No extra ports open (3000, 8080, etc.)
- [ ] Outbound allows HTTPS (for Gemini API calls)

### If Your IP Changes

If you have a dynamic IP (most home ISPs), you'll need to update the SSH security group rule:

1. AWS Console → Security Groups → Select your group
2. Edit inbound rules → SSH rule → Change source to your new IP
3. Save

---

## 7. Screenshots Needed for Report

Capture these screenshots for the internship report:

| # | Screenshot | Purpose |
|---|---|---|
| 1 | Home page (Akas Dwar) | Hero section showcase |
| 2 | Topic library (Akas Granth) | Feature grid showcase |
| 3 | Question input (Jigyasa Engine) | UI functionality |
| 4 | AI response — all sections | Full response showcase |
| 5 | 3D scene rendering | Visual/3D demonstration |
| 6 | Quiz section (Smriti Quest) | Interactive feature |
| 7 | Mobile responsive view | Responsive design proof |
| 8 | Docker build success | Docker capability proof |
| 9 | Docker running container | Container management |
| 10 | AWS EC2 instance running | Cloud deployment proof |
| 11 | AWS security group rules | Security awareness |
| 12 | App running on EC2 public IP | Live deployment proof |
| 13 | API health check response | API functionality |
| 14 | Terminal: `npm run build` success | Build process |
| 15 | Terminal: `npm audit` results | Security audit |

---

## 8. Common Errors and Fixes

### Local Development

| Error | Cause | Fix |
|---|---|---|
| `GEMINI_API_KEY is not configured` | Missing `.env` file | Copy `.env.example` to `.env`, add real key |
| `Module not found` | Dependencies not installed | Run `npm ci` |
| Port 3000 already in use | Another process on port | Kill process: `npx kill-port 3000` |
| TypeScript errors after install | Version mismatch | Delete `node_modules`, run `npm ci` |

### Docker

| Error | Cause | Fix |
|---|---|---|
| `Cannot connect to Docker daemon` | Docker not running | Start Docker: `sudo systemctl start docker` |
| Build fails at `npm ci` | No `package-lock.json` | Run `npm install` locally, commit lock file |
| Container exits immediately | Build error or missing env | Check logs: `docker logs akasgatha` |
| `port is already allocated` | Port 3000/80 in use | Stop other containers or change port |

### AWS

| Error | Cause | Fix |
|---|---|---|
| SSH connection refused | Security group blocks your IP | Update security group with current IP |
| SSH permission denied | Wrong key or key permissions | Check key file, `chmod 400 key.pem` |
| App not accessible in browser | Security group missing HTTP rule | Add HTTP (80) inbound rule |
| `docker: command not found` | Docker not installed | Install Docker on EC2 (Step 5.4) |
| API returns 500 | Missing env vars in container | Check `docker logs`, verify `.env` on EC2 |
| High AWS bill | Instance running 24/7 | Stop instance when not demoing |

### LLM

| Error | Cause | Fix |
|---|---|---|
| `API key not valid` | Wrong or expired Gemini key | Regenerate key in Google AI Studio |
| Rate limited by Gemini | Too many API calls | Wait and retry; check Gemini free tier limits |
| Response is not JSON | LLM didn't follow format instruction | Fallback response should handle this |
| Unexpected response structure | LLM schema drift | Zod validation catches this; fallback returned |
