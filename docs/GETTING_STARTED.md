# CodeNCampus — Developer Getting Started Guide

**Product:** CodeNCampus (School Management SaaS Platform)  
**Company:** Codazk Technologies Private Limited

---

## 1. Prerequisites

Ensure your development environment meets the following specifications:

- **Node.js:** `>= 20.0.0` (LTS recommended)
- **pnpm:** `>= 9.0.0` or `12.x`
- **Docker & Docker Compose:** For running local PostgreSQL and Redis instances.
- **Expo Go (Optional):** For physical device testing on Android & iOS.

---

## 2. Initial Setup & Installation

Clone the repository and install all monorepo workspace dependencies:

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Start local PostgreSQL 16 and Redis 7 containers
docker compose up -d

# 3. Generate Prisma client
pnpm --filter @codencampus/database prisma:generate

# 4. Copy environment configuration
cp apps/api/.env.example apps/api/.env
```

---

## 3. Running Applications in Development

Run all applications concurrently via Turborepo:

```bash
pnpm dev
```

Or run individual applications selectively:

### Fastify Backend API

```bash
pnpm --filter @codencampus/api dev
# Listening on: http://localhost:4000
# Health check: http://localhost:4000/healthz
```

### Next.js Web Management Console

```bash
pnpm --filter @codencampus/web dev
# Accessible at: http://localhost:3000
```

### React Native / Expo Mobile Application

```bash
pnpm --filter @codencampus/mobile start
# Press 'w' for Web preview
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
```

---

## 4. Running Quality Checks & Tests

Run all checks across the monorepo:

```bash
# Typecheck all workspaces with TypeScript strict mode
pnpm typecheck

# Lint codebase
pnpm lint

# Format code with Prettier
pnpm format

# Build all packages and applications
pnpm build
```

---

## 5. Monorepo Project Structure

```
codencampusapp/
├── apps/
│   ├── api/          # Fastify Modular Monolith (Port 4000)
│   ├── web/          # Next.js 15 Web Console (Port 3000)
│   └── mobile/       # React Native / Expo Mobile App
├── packages/
│   ├── database/     # Prisma Schema & Tenant-Scoped Client
│   ├── types/        # Shared Domain Models & DTOs
│   ├── validators/   # Shared Zod Schemas
│   └── config/       # Shared TSConfig & Tooling Presets
├── docs/             # Master Architectural Specifications
├── .cursor/rules/    # Permanent Cursor Project Guardrails
├── docker-compose.yml# Local Postgres & Redis Services
├── turbo.json        # Turborepo Pipeline Cache
└── pnpm-workspace.yaml
```
