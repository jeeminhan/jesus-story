# Gospel Story

Multilingual, choose-your-own-path interactive gospel storybook for international students. Built with Next.js 15 App Router and Supabase.

## What It Is

Readers pick a language, choose a gospel story arc, and navigate through branching scenes by making choices. Each scene can have optional audio narration. After finishing an arc, readers can submit a community connection request to link up with a local group.

All content — arcs, scenes, choices, UI labels — is stored with per-language translations in Supabase, making the app fully multilingual without code changes.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Testing | Playwright (E2E) |

## Quick Start

**1. Install**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.example .env.local
```

Set these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> **No Supabase?** Leave the vars empty. The app runs in mock mode with hardcoded sample data so you can explore the UI without a database.

**3. Apply database schema**

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

**4. Seed data**

```bash
npm run seed
```

**5. Run**

```bash
npm run dev   # http://localhost:3000
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Language selection |
| `/[lang]` | Arc selection |
| `/[lang]/[arc]` | Scene reader (`?scene=<id>` for scene navigation) |
| `/[lang]/[arc]/connect` | Community connection form |

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run test:e2e   # Playwright E2E tests
npm run seed       # Seed database
```

## Architecture Notes

- **Server Components first** — pages fetch Supabase data directly; no separate API server.
- **Centralized queries** — all data access lives in `src/lib/queries.ts`.
- **Translation model** — every user-facing string has a `*_translations` table row keyed by `(id, lang)`.
- **Mock fallback** — `src/lib/mock-data.ts` is returned when Supabase env vars are absent.
- **One Server Action** — `src/app/actions/connect.ts` handles the community connection form.

## Documentation

Full project documentation is in `docs/`:

- [docs/index.md](./docs/index.md) — Master index
- [docs/architecture.md](./docs/architecture.md) — Architecture and design decisions
- [docs/data-models.md](./docs/data-models.md) — Database schema
- [docs/component-inventory.md](./docs/component-inventory.md) — UI components
- [docs/development-guide.md](./docs/development-guide.md) — Full dev setup guide
