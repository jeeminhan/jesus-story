# Development Guide — Gospel Story

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- A Supabase project (or run in mock mode without one)

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anon (public) key
SUPABASE_SERVICE_ROLE_KEY=       # Your Supabase service role key (seed script only)
```

> **Mock mode:** If you leave `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` empty, the app runs with hardcoded mock data from `src/lib/mock-data.ts`. The UI is fully explorable — no Supabase required.

### 3. Apply the database schema

In your Supabase dashboard (SQL editor) or via the Supabase CLI, run:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Seed data (optional)

```bash
npm run seed
```

This runs `scripts/seed.ts` using `tsx`. Requires `SUPABASE_SERVICE_ROLE_KEY` to be set.

### 5. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## NPM Scripts

| Script          | Command                  | Description                        |
|-----------------|--------------------------|------------------------------------|
| `dev`           | `next dev`               | Start local dev server             |
| `build`         | `next build`             | Production build                   |
| `start`         | `next start`             | Serve production build             |
| `lint`          | `next lint`              | Run ESLint                         |
| `test:e2e`      | `playwright test`        | Run Playwright E2E tests           |
| `seed`          | `tsx scripts/seed.ts`    | Seed database with initial data    |

---

## Running Tests

### E2E tests (Playwright)

```bash
npm run test:e2e
```

Tests run against the local dev server (see `playwright.config.ts` for base URL config). The mock-data fallback ensures tests pass without a live Supabase instance.

Test files in `e2e/`:

| File                    | What it tests                             |
|------------------------|-------------------------------------------|
| `home.spec.ts`         | Language selection page renders correctly |
| `arc-selection.spec.ts`| Arc listing page                          |
| `story-reader.spec.ts` | Scene display and choice navigation       |
| `connect.spec.ts`      | Community connection form                 |

---

## Key Development Patterns

### Adding a new language

1. Insert a row into `languages` in Supabase
2. Add translations for existing arcs, scenes, and choices using the new `lang` code
3. No code changes required — the app is fully data-driven

### Adding a new arc

1. Insert a row into `arcs`
2. Add `arc_translations` rows for each active language
3. Create `scenes`, `scene_translations`, `choices`, and `choice_translations` rows
4. Mark the start scene with `is_start = true`
5. Set `is_published = true` on the arc to make it visible

### Modifying data access

All Supabase queries are in `src/lib/queries.ts`. Update mock data in `src/lib/mock-data.ts` if adding new query functions.

### Adding a new page

Use Next.js App Router conventions. Place new pages under `src/app/`. Use Server Components by default; only add `'use client'` when browser APIs or interactivity are needed.

---

## Deployment

No CI/CD pipeline is currently configured. To deploy manually:

```bash
npm run build
npm run start
```

Or deploy to Vercel with zero config — push to a connected GitHub repository and Vercel will auto-detect Next.js.

**Required environment variables on the host:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # Only needed if running seed scripts from the host
```
