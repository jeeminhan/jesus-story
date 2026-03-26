# Source Tree Analysis — Gospel Story

## Annotated Directory Tree

```
jesus-story/          # Project root
│
├── src/                               # All application source code
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout (HTML shell, global CSS, metadata)
│   │   ├── page.tsx                   # / → Language selection page (Server Component)
│   │   ├── globals.css                # Global Tailwind base styles
│   │   ├── actions/
│   │   │   └── connect.ts             # Server Action: community connection form submission
│   │   └── [lang]/                    # Dynamic route: language segment
│   │       ├── page.tsx               # /[lang] → Arc listing (Server Component)
│   │       └── [arc]/                 # Dynamic route: arc segment
│   │           ├── page.tsx           # /[lang]/[arc] → Scene reader (Server Component)
│   │           └── connect/
│   │               └── page.tsx       # /[lang]/[arc]/connect → Community form (Server Component)
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── ArcCard.tsx                # Arc listing card with title + tagline
│   │   ├── AudioPlayer.tsx            # (Client) Audio narration player
│   │   ├── ChoiceButton.tsx           # (Client) Scene choice navigation button
│   │   ├── ConnectForm.tsx            # (Client) Community connection form
│   │   ├── LanguageGrid.tsx           # Language selection grid
│   │   └── SceneView.tsx              # Scene display (title, body, audio, choices)
│   │
│   └── lib/                           # Shared logic and utilities
│       ├── queries.ts                 # ★ All Supabase data access (centralized)
│       ├── types.ts                   # TypeScript interfaces for all domain entities
│       ├── supabase.ts                # Supabase client factory (server-side SSR)
│       ├── mock-data.ts               # Hardcoded mock data for local dev without Supabase
│       └── constants.ts               # App-wide constants
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     # ★ Full DB schema (all 8 tables + indexes)
│
├── e2e/                               # Playwright end-to-end tests
│   ├── home.spec.ts                   # Tests: language selection page
│   ├── arc-selection.spec.ts          # Tests: arc listing page
│   ├── story-reader.spec.ts           # Tests: scene reading + choice navigation
│   └── connect.spec.ts                # Tests: community connection form
│
├── scripts/
│   └── seed.ts                        # Data seeding script (run with `npm run seed`)
│
├── docs/                              # Project documentation (this folder)
│   ├── index.md                       # Master documentation index
│   ├── project-overview.md            # High-level project summary
│   ├── architecture.md                # Architecture and design decisions
│   ├── source-tree-analysis.md        # This file
│   ├── data-models.md                 # Database schema documentation
│   ├── api-contracts.md               # Server actions and data access contracts
│   ├── component-inventory.md         # UI component catalog
│   ├── development-guide.md           # Dev setup and commands
│   └── plans/                         # Historical planning documents
│       ├── 2026-03-02-gospel-storybook-design.md
│       └── 2026-03-02-gospel-storybook-implementation.md
│
├── package.json                       # Dependencies and npm scripts
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── playwright.config.ts               # Playwright E2E test configuration
├── postcss.config.mjs                 # PostCSS configuration
├── .env.example                       # Environment variable template
└── README.md                          # Quick-start guide
```

---

## Critical Folders

| Folder            | Purpose                                                              |
|-------------------|----------------------------------------------------------------------|
| `src/app/`        | All Next.js routes (pages, layouts, server actions)                 |
| `src/components/` | Reusable UI components (both Server and Client Components)          |
| `src/lib/`        | Data access layer, types, Supabase client, mock data                |
| `supabase/`       | Database migration SQL files                                         |
| `e2e/`            | Playwright browser tests                                             |

---

## Entry Points

| Entry Point                | Description                                    |
|---------------------------|------------------------------------------------|
| `src/app/layout.tsx`      | Root HTML layout, metadata, global styles      |
| `src/app/page.tsx`        | First page rendered: language selection        |
| `src/lib/queries.ts`      | All database queries — start here for data flow|
| `supabase/migrations/001_initial_schema.sql` | Database schema definition  |
