# Project Overview — Gospel Story

## Executive Summary

Gospel Story is a multilingual, choose-your-own-path interactive gospel storybook web application. It is designed for international students, allowing them to read through gospel narrative "arcs" in their native language, make narrative choices that affect scene progression, optionally listen to audio narration, and submit a community connection request at the end of an arc.

The app is built as a **Next.js 15 App Router monolith** backed by **Supabase** (PostgreSQL + Storage). All content — arcs, scenes, choices, and UI labels — is stored with per-language translations, making the app fully multilingual from the database up. A mock-data fallback layer allows the UI to run locally without Supabase credentials.

---

## Project Metadata

| Field               | Value                                      |
|---------------------|--------------------------------------------|
| **Name**            | gospel-story                               |
| **Version**         | 0.1.0                                      |
| **Repository Type** | Monolith                                   |
| **Primary Language**| TypeScript                                 |
| **Runtime**         | Node.js (Next.js server)                   |
| **Database**        | Supabase (PostgreSQL)                      |
| **Deployment**      | Not yet configured (CI/CD TBD)             |

---

## Technology Stack

| Category          | Technology              | Version   | Notes                                    |
|-------------------|-------------------------|-----------|------------------------------------------|
| Framework         | Next.js                 | ^15.0.0   | App Router, Server Components            |
| Language          | TypeScript              | ^5.7.0    | Strict mode                              |
| UI Library        | React                   | ^19.0.0   | Server + Client Components               |
| Styling           | Tailwind CSS            | ^3.4.14   | Utility-first CSS                        |
| Database          | Supabase (PostgreSQL)   | ^2.56.0   | Hosted Postgres + Storage                |
| SSR Client        | @supabase/ssr           | ^0.5.2    | Server-side Supabase client              |
| E2E Testing       | Playwright              | ^1.56.1   | Browser-based integration tests          |
| Script Runner     | tsx                     | ^4.20.6   | For seed script                          |
| Build/Lint        | ESLint + Next ESLint    | ^9.0.0    | Code quality                             |
| CSS Tooling       | PostCSS + Autoprefixer  | ^8.x      | CSS processing                           |

---

## Architecture Type

**Pattern:** Layered monolith with server-first rendering

- Next.js App Router with nested dynamic segments handles routing
- Server Components fetch data directly from Supabase (no separate API layer)
- One Server Action handles form mutation (`submitCommunityConnection`)
- Translation-aware data model: all user-facing content is language-scoped at the DB level
- Mock-data fallback: `src/lib/mock-data.ts` enables local development without Supabase

---

## User-Facing Features

1. **Language Selection** — choose a language from the list of active languages
2. **Arc Selection** — browse published gospel story arcs in the chosen language
3. **Scene Reader** — read scenes, listen to optional audio narration, and choose branching paths
4. **Community Connection** — submit name/email/city to connect with a local community after finishing an arc

---

## Repository Structure

```
gospel-story/          # Monolith root
├── src/               # Application source
│   ├── app/           # Next.js App Router (pages, layouts, actions)
│   ├── components/    # Reusable UI components
│   └── lib/           # Data access, types, utilities
├── supabase/          # Database schema and migrations
├── e2e/               # Playwright end-to-end tests
├── scripts/           # Data seeding scripts
└── docs/              # Project documentation (this folder)
```

---

## Links

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Data Models](./data-models.md)
- [API Contracts](./api-contracts.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [Full Index](./index.md)
