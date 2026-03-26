# API Contracts — Gospel Story

This project does not expose a public REST API. Data access is handled through:
1. **Server Component queries** — direct Supabase calls in RSC pages
2. **One Server Action** — form mutation via Next.js `'use server'`

All data access is centralized in `src/lib/queries.ts`.

---

## Query Functions (`src/lib/queries.ts`)

These are called from Server Components. They are not HTTP endpoints.

---

### `getActiveLanguages()`

Fetches all enabled languages for the language selection page.

**Returns:** `Promise<Language[]>`

**Supabase query:**
```sql
SELECT * FROM languages WHERE is_active = true ORDER BY name
```

**Mock fallback:** Returns `mockLanguages` when Supabase env vars are absent.

---

### `getPublishedArcs(lang: string)`

Fetches all published arcs with their translation for the given language.

**Parameters:**
| Name  | Type   | Description                    |
|-------|--------|--------------------------------|
| `lang`| string | Language code (e.g. `"en"`)    |

**Returns:** `Promise<ArcWithTranslation[]>`

**Supabase query:**
```sql
SELECT id, slug, order, is_published,
       arc_translations!inner(title, tagline)
FROM arcs
WHERE is_published = true
  AND arc_translations.lang = :lang
ORDER BY order
```

**Mock fallback:** Returns `[mockArc]`.

---

### `getArcBySlug(slug: string)`

Resolves an arc slug to its `{ id, slug }` record. Used to validate arc existence before inserting community connections.

**Parameters:**
| Name   | Type   | Description   |
|--------|--------|---------------|
| `slug` | string | Arc URL slug  |

**Returns:** `Promise<{ id: string; slug: string } | null>`

**Mock fallback:** Returns `{ id, slug }` if slug matches `mockArc.slug`, else `null`.

---

### `getStartScene(arcSlug: string, lang: string)`

Fetches the starting scene (`is_start = true`) for a given arc and language, including its choices.

**Parameters:**
| Name      | Type   | Description        |
|-----------|--------|--------------------|
| `arcSlug` | string | Arc URL slug       |
| `lang`    | string | Language code      |

**Returns:** `Promise<SceneWithContent | null>`

**Supabase query (two steps):**
1. Resolve arc slug → arc ID
2. Fetch scene with `is_start = true` + `scene_translations` + choices via `withChoices()`

**Mock fallback:** Returns `getMockStartScene()` if slug matches.

---

### `getScene(sceneId: string, lang: string)`

Fetches any scene by ID with translations and choices.

**Parameters:**
| Name      | Type   | Description        |
|-----------|--------|--------------------|
| `sceneId` | string | Scene UUID         |
| `lang`    | string | Language code      |

**Returns:** `Promise<SceneWithContent | null>`

**Mock fallback:** Returns `getMockSceneById(sceneId)`.

---

### `insertCommunityConnection(data: CommunityConnectionInsert)`

Inserts a community connection submission into the database.

**Parameters (`CommunityConnectionInsert`):**
| Field    | Type             | Required | Description                     |
|----------|------------------|----------|---------------------------------|
| `arc_id` | string (uuid)    | Yes      | Arc the reader completed        |
| `lang`   | string           | Yes      | Reading language code           |
| `name`   | string           | Yes      | Reader's name                   |
| `email`  | string           | Yes      | Reader's email                  |
| `city`   | string           | No       | Reader's city                   |

**Returns:** `Promise<void>` (throws on error)

**Mock fallback:** Logs to console, no insert.

---

## Server Actions (`src/app/actions/connect.ts`)

### `submitCommunityConnection(prevState, formData)`

Next.js Server Action called by `ConnectForm`. Validates input and calls `insertCommunityConnection`.

**Form Fields (`FormData`):**
| Field      | Required | Validation                     |
|------------|----------|--------------------------------|
| `name`     | Yes      | Non-empty string               |
| `email`    | Yes      | Must contain `@`               |
| `city`     | No       | Optional string                |
| `lang`     | Yes      | Non-empty string               |
| `arcSlug`  | Yes      | Must resolve to an existing arc |

**Return Type:** `ConnectActionState`
```ts
type ConnectActionState = {
  success: boolean;
  error?: string;
}
```

**Success response:** `{ success: true }`

**Error responses:**
| Condition                  | Error message                  |
|---------------------------|--------------------------------|
| Missing required fields    | `"Missing required fields."`   |
| Invalid email format       | `"Please provide a valid email."` |
| Arc not found              | `"Story arc not found."`       |
