# Architecture — Gospel Story

## Executive Summary

Gospel Story is a **server-first Next.js 15 App Router monolith**. All data fetching happens in React Server Components via direct Supabase calls — there is no separate API server. A single Server Action handles form mutation. The routing model uses nested dynamic segments (`[lang]`, `[arc]`) so the language and arc context flow naturally through the URL.

---

## Technology Stack

See [Project Overview → Technology Stack](./project-overview.md#technology-stack).

---

## Architecture Pattern

**Layered Monolith — Server-First**

```
Browser
  └── Next.js App Router (SSR / RSC)
        ├── Server Components → Direct Supabase queries (src/lib/queries.ts)
        ├── Client Components → Interactive UI (AudioPlayer, ConnectForm, ChoiceButton)
        └── Server Actions   → Form mutation (src/app/actions/connect.ts)
              └── Supabase (PostgreSQL)
```

Key design decisions:
- **No dedicated API layer.** Server Components call `src/lib/queries.ts` directly, which wraps Supabase calls.
- **Translation at the DB level.** Language is passed as a URL segment (`[lang]`) and threaded into every Supabase query using `!inner` join filters on translation tables.
- **Mock-data fallback.** `src/lib/queries.ts` checks `NEXT_PUBLIC_SUPABASE_URL` at runtime. If absent, it returns hardcoded mock data from `src/lib/mock-data.ts`, allowing full UI exploration without a Supabase instance.
- **Minimal client JS.** Only components requiring browser APIs (`AudioPlayer`) or interactivity (`ChoiceButton`, `ConnectForm`) are Client Components.

---

## Routing Structure

| Route                          | Segment                                | Purpose                              |
|-------------------------------|----------------------------------------|--------------------------------------|
| `/`                           | `src/app/page.tsx`                     | Language selection (redirects to `[lang]`) |
| `/[lang]`                     | `src/app/[lang]/page.tsx`              | Arc listing for a language           |
| `/[lang]/[arc]`               | `src/app/[lang]/[arc]/page.tsx`        | Scene reader (`?scene=<id>`)         |
| `/[lang]/[arc]/connect`       | `src/app/[lang]/[arc]/connect/page.tsx`| Community connection form            |

Scene navigation within `/[lang]/[arc]` is driven by the `?scene` query parameter. The starting scene is loaded when no `?scene` is present.

---

## Data Architecture

See [Data Models](./data-models.md) for full schema.

**Translation model:**
Every piece of user-facing content has a base record and a separate `*_translations` table keyed by `(record_id, lang)`. This allows unlimited language support without schema changes.

```
arcs → arc_translations (title, tagline per lang)
scenes → scene_translations (title, body, audio_url per lang)
choices → choice_translations (label per lang)
```

**Scene graph:**
Scenes within an arc form a directed graph. Each `choice` record points from a `scene_id` to a `next_scene_id`, enabling branching narratives. A scene marked `is_start=true` is the entry point; `is_end=true` signals a terminal node.

---

## Data Access Layer

All Supabase interactions are centralized in `src/lib/queries.ts`:

| Function                        | Purpose                                         |
|---------------------------------|-------------------------------------------------|
| `getActiveLanguages()`          | List languages with `is_active=true`            |
| `getPublishedArcs(lang)`        | List arcs with translations for `lang`          |
| `getArcBySlug(slug)`            | Resolve arc slug to `{ id, slug }`              |
| `getStartScene(arcSlug, lang)`  | Get the `is_start` scene with translations      |
| `getScene(sceneId, lang)`       | Get any scene by ID with translations           |
| `insertCommunityConnection(data)` | Insert a community connection submission      |

Internal helper: `withChoices(scene, lang)` — fetches choices with translations for a given scene.

---

## Server Actions

| Action                        | File                              | Purpose                              |
|-------------------------------|-----------------------------------|--------------------------------------|
| `submitCommunityConnection`   | `src/app/actions/connect.ts`      | Validates and inserts community connection form submission |

---

## Component Architecture

See [Component Inventory](./component-inventory.md) for full list.

**Server Components (data-fetching pages):**
- `src/app/page.tsx` — fetches languages, renders `LanguageGrid`
- `src/app/[lang]/page.tsx` — fetches arcs, renders `ArcCard` list
- `src/app/[lang]/[arc]/page.tsx` — fetches scene, renders `SceneView`
- `src/app/[lang]/[arc]/connect/page.tsx` — renders `ConnectForm`

**Client Components:**
- `AudioPlayer` — requires browser `<audio>` API
- `ChoiceButton` — interactive navigation (router push)
- `ConnectForm` — uses `useFormState` / `useActionState` for Server Action feedback

---

## AI Layer

See [Conversational Entry Design](./plans/2026-03-30-conversational-entry-design.md) for the full design document.

The app uses AI at two stages: entry and storytelling.

### Stage 1: Conversational Entry (`/api/entry`)
The home page is a free-text input ("What are you carrying right now?"). AI detects language, classifies emotion, selects the best story, and streams a personalized bridge sentence.

### Stage 2: Story Generation (`/api/story`)
Stories are defined as **skeletons** — ordered beats with guardrails and tone guidance. For each beat, AI generates lyrical prose contextualized to the user's input and language. No pre-written translations. Illustrations are static assets tied to beats.

```
Browser
  └── Conversational Entry (free-text input)
        └── /api/entry (Route Handler)
              └── AI SDK generateText → classify language + emotion
              └── AI SDK streamText → bridge sentence
        └── /story/[slug] (Scene Reader)
              └── /api/story (Route Handler, per beat)
                    └── AI SDK streamText → contextualized prose + choice labels
                    └── Beat skeleton (guardrails, tone, visual context)
```

### AI Boundary
- AI generates prose from fixed beat skeletons — it cannot skip, reorder, or invent beats
- Guardrails enforce theological safety (MUST/MUST NOT constraints in system prompt)
- AI never interprets scripture, makes theological claims, or uses churchy vocabulary
- Illustrations are static; AI is told what they depict so prose matches visuals

---

## Deployment Architecture

No CI/CD pipeline is currently configured. The app is a standard Next.js project deployable to any Node.js host (Vercel, Railway, etc.).

**Required environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Public anon key
SUPABASE_SERVICE_ROLE_KEY       # Service role key (used in seed script)
RESEND_API_KEY                  # Coordinator email delivery (Story 2.4)
VERCEL_OIDC_TOKEN               # Vercel AI Gateway — auto-provisioned via `vercel env pull` (Story 2.5)
```

**AI Provider:** Vercel AI Gateway. Model strings (e.g. `"anthropic/claude-sonnet-4-6"`) route automatically. Run `vercel link` then `vercel env pull` to provision `VERCEL_OIDC_TOKEN` locally. No provider-specific API keys required.

---

## Testing Strategy

**E2E (Playwright)** — `e2e/` directory:

| Test File                  | Coverage                                      |
|---------------------------|-----------------------------------------------|
| `home.spec.ts`            | Language selection page                        |
| `arc-selection.spec.ts`   | Arc listing page                               |
| `story-reader.spec.ts`    | Scene reading and choice navigation            |
| `connect.spec.ts`         | Community connection form submission           |

No unit or integration tests currently. Mock-data fallback enables E2E tests to run without a live Supabase instance.
