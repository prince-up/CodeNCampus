# CodeNCampus — Master Architecture & Engineering Blueprints

**Product:** CodeNCampus (School Management SaaS Platform)  
**Company:** Codazk Technologies Private Limited  
**Founder & Technical Owner:** Md. Ayan Ansari  
**Architecture Status:** Phase 0 Architecture Blueprint Complete (Ready for Founder Review & Approval)

---

## Executive Overview

**CodeNCampus** is a commercial, multi-tenant digital operating system designed for educational institutions ranging from Nursery to Class 12 across CBSE, ICSE, and State Boards.

It unifies academic lifecycle management, administration, multi-stakeholder communication, fee processing, and operational analytics into a cohesive, secure, and modern digital platform.

---

## Architectural Documentation Index

All architectural specifications, database models, security frameworks, and implementation roadmaps are authored under [`docs/`](./docs/):

1. **[Product Requirements Document](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/PRODUCT_REQUIREMENTS.md):** Vision, stakeholder personas, board compatibility, modular functional breakdown (Core, Academic, Admin, Advanced), and operational KPIs.
2. **[System Architecture](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/SYSTEM_ARCHITECTURE.md):** Monorepo structure (Turborepo + pnpm), Fastify modular monolith design, Next.js web portal, Expo React Native mobile app, and AWS cloud topology.
3. **[Database Design & Schema](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/DATABASE_DESIGN.md):** PostgreSQL 16 schema, Prisma ORM integration, UUIDv4 primary keys, tenant sequences for human-readable IDs (`DPS-STU-00001`), ERDs, and zero-downtime migration strategy.
4. **[Authentication & Authorization](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/AUTHENTICATION_AND_AUTHORIZATION.md):** Supabase Auth identity provider, backend Fastify stateless JWT verification, granular RBAC/permission catalog, multi-role switching (e.g. Teacher + Parent), and session revocation.
5. **[Multi-Tenant Architecture & Data Isolation](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/MULTI_TENANT_DESIGN.md):** Architectural evaluation of multi-tenancy models, defense-in-depth isolation (Fastify route guards, Prisma client tenant extensions, PostgreSQL Row-Level Security), and S3 asset partitioning.
6. **[White-Label Architecture](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/WHITE_LABEL_ARCHITECTURE.md):** Dual-track white-label strategy (Unified mobile app with dynamic runtime branding vs. EAS Build matrix generating dedicated branded App Store / Play Store builds from a single codebase).
7. **[Development Roadmap](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/DEVELOPMENT_ROADMAP.md):** 8-phase execution plan (Phases 0 through 7) with sprint breakdowns, clear deliverable definitions, and verification criteria tailored for scalable commercial execution.
8. **[Security, Compliance & Data Protection](file:///Users/md.ayanansari/Desktop/codencampusapp/docs/SECURITY_REQUIREMENTS.md):** OWASP Top 10 mitigation matrix, India DPDP Act 2023 compliance (minor consent, encryption of national IDs), S3 presigned upload workflows, rate limiting, and immutable audit logging.

---

## Technology Stack Summary

| Layer                         | Primary Technology                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| **Repository Management**     | Turborepo + pnpm workspaces                                                              |
| **Mobile Application**        | React Native, Expo (SDK 52+), Expo Router, TanStack Query, Zustand, React Hook Form, Zod |
| **Web Management Console**    | Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI Primitives                   |
| **Backend API**               | Node.js 20 LTS, Fastify, TypeScript, Pino Logger, Zod                                    |
| **Database & ORM**            | PostgreSQL 16 (AWS RDS Multi-AZ), Prisma ORM with Tenant Extensions                      |
| **Asynchronous Jobs & Queue** | BullMQ, Redis 7 (AWS ElastiCache / Upstash)                                              |
| **Authentication & IAM**      | Supabase Auth (Identity Provider) + Fastify Stateless JWT Verification                   |
| **Cloud & DevOps**            | AWS (ECS Fargate, S3, CloudFront), Docker, Cloudflare, GitHub Actions CI/CD              |
| **Error Monitoring**          | Sentry (Mobile, Web, Backend)                                                            |
