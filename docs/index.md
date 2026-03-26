# Gospel Story — Documentation Index

_Generated: 2026-03-20 | Scan: Quick | Mode: Initial_

---

## Project Overview

- **Type:** Monolith (web)
- **Primary Language:** TypeScript
- **Architecture:** Layered monolith — Next.js 15 App Router + Supabase

**Tech Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Supabase (PostgreSQL) · Playwright

**Entry Point:** `src/app/page.tsx` → language selection

**Architecture Pattern:** Server Components fetch data directly; one Server Action handles mutations; mock-data fallback for local dev

---

## Generated Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](./project-overview.md) | Executive summary, tech stack table, feature list |
| [Architecture](./architecture.md) | Architecture pattern, routing, data flow, design decisions |
| [Source Tree Analysis](./source-tree-analysis.md) | Annotated directory tree with folder purposes |
| [Data Models](./data-models.md) | Full DB schema — 8 tables, relationships, TypeScript types |
| [API Contracts](./api-contracts.md) | Query functions and Server Action contracts |
| [Component Inventory](./component-inventory.md) | All 6 UI components with props and purpose |
| [Development Guide](./development-guide.md) | Setup, scripts, testing, deployment |

---

## Existing Documentation

| Document | Description |
|----------|-------------|
| [README](../README.md) | Quick-start guide |
| [Storybook Design Plan](./plans/2026-03-02-gospel-storybook-design.md) | Design planning document |
| [Storybook Implementation Plan](./plans/2026-03-02-gospel-storybook-implementation.md) | Implementation planning document |

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # Add Supabase credentials (or leave blank for mock mode)
npm run dev                  # http://localhost:3000
```

See [Development Guide](./development-guide.md) for full setup instructions.

---

## Quick Navigation

**Working on data?** → [Data Models](./data-models.md) · [API Contracts](./api-contracts.md)

**Working on UI?** → [Component Inventory](./component-inventory.md) · [Source Tree](./source-tree-analysis.md)

**Understanding the system?** → [Architecture](./architecture.md) · [Project Overview](./project-overview.md)

**Setting up locally?** → [Development Guide](./development-guide.md)
