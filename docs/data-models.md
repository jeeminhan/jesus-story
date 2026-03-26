# Data Models — Gospel Story

Source: `supabase/migrations/001_initial_schema.sql`

---

## Overview

The database follows a **translation-per-row** pattern. Every piece of user-facing text lives in a `*_translations` table with a `(record_id, lang)` unique constraint. The `lang` column references `languages(code)`, ensuring referential integrity across all translations.

---

## Entity Relationship Summary

```
languages
  ↑ (referenced by lang columns in all translation tables)
  │
arcs ──────────────── arc_translations (title, tagline per lang)
  │
  └── scenes ────────── scene_translations (title, body, audio_url per lang)
        │
        └── choices ─── choice_translations (label per lang)
              │
              └── (next_scene_id → scenes)   ← branching graph edge

community_connections   (standalone submission record)
```

---

## Tables

### `languages`

Defines the available reading languages.

| Column        | Type    | Constraints          | Description                        |
|---------------|---------|----------------------|------------------------------------|
| `id`          | uuid    | PK, default uuid     | Primary key                        |
| `code`        | text    | UNIQUE, NOT NULL     | Language code (e.g. `"en"`, `"ko"`)   |
| `name`        | text    | NOT NULL             | English display name               |
| `native_name` | text    | NOT NULL             | Name in native script              |
| `is_active`   | boolean | NOT NULL, default true | Whether this language is enabled  |

---

### `arcs`

Top-level story units. Each arc is an independent narrative path.

| Column        | Type        | Constraints              | Description                         |
|---------------|-------------|--------------------------|-------------------------------------|
| `id`          | uuid        | PK, default uuid         | Primary key                         |
| `slug`        | text        | UNIQUE, NOT NULL         | URL-safe identifier                 |
| `order`       | int         | NOT NULL, default 0      | Display ordering                    |
| `is_published`| boolean     | NOT NULL, default false  | Controls visibility                 |
| `created_at`  | timestamptz | NOT NULL, default now()  | Creation timestamp                  |

---

### `arc_translations`

Localized content for each arc.

| Column    | Type | Constraints                   | Description                       |
|-----------|------|-------------------------------|-----------------------------------|
| `id`      | uuid | PK                            | Primary key                       |
| `arc_id`  | uuid | FK → arcs(id) ON DELETE CASCADE | Parent arc                      |
| `lang`    | text | FK → languages(code)          | Language code                     |
| `title`   | text | NOT NULL                      | Arc title in this language        |
| `tagline` | text | NOT NULL                      | Short arc description             |

**Unique:** `(arc_id, lang)`

---

### `scenes`

Individual scenes within an arc. Scenes form a directed graph via `choices`.

| Column     | Type        | Constraints                   | Description                         |
|------------|-------------|-------------------------------|-------------------------------------|
| `id`       | uuid        | PK                            | Primary key                         |
| `arc_id`   | uuid        | FK → arcs(id) ON DELETE CASCADE | Parent arc                        |
| `slug`     | text        | NOT NULL                      | Human-readable identifier           |
| `is_start` | boolean     | NOT NULL, default false       | Entry point of the arc              |
| `is_end`   | boolean     | NOT NULL, default false       | Terminal node (no outgoing choices) |
| `created_at` | timestamptz | NOT NULL, default now()    | Creation timestamp                  |

**Unique:** `(arc_id, slug)`
**Index:** `scenes_arc_id_idx`

---

### `scene_translations`

Localized content for each scene.

| Column      | Type | Constraints                      | Description                       |
|-------------|------|----------------------------------|-----------------------------------|
| `id`        | uuid | PK                               | Primary key                       |
| `scene_id`  | uuid | FK → scenes(id) ON DELETE CASCADE | Parent scene                     |
| `lang`      | text | FK → languages(code)             | Language code                     |
| `title`     | text | NOT NULL                         | Scene title                       |
| `body`      | text | NOT NULL                         | Scene narrative text              |
| `audio_url` | text | NULLABLE                         | Optional audio narration URL      |

**Unique:** `(scene_id, lang)`
**Index:** `scene_translations_lang_idx`

---

### `choices`

Directed edges in the scene graph — each choice navigates from one scene to another.

| Column         | Type | Constraints                          | Description                          |
|----------------|------|--------------------------------------|--------------------------------------|
| `id`           | uuid | PK                                   | Primary key                          |
| `scene_id`     | uuid | FK → scenes(id) ON DELETE CASCADE    | Source scene                         |
| `next_scene_id`| uuid | FK → scenes(id)                      | Destination scene                    |
| `order`        | int  | NOT NULL, default 0                  | Display order of choices in a scene  |

**Index:** `choices_scene_id_idx`

---

### `choice_translations`

Localized button label for each choice.

| Column      | Type | Constraints                        | Description             |
|-------------|------|------------------------------------|-------------------------|
| `id`        | uuid | PK                                 | Primary key             |
| `choice_id` | uuid | FK → choices(id) ON DELETE CASCADE | Parent choice           |
| `lang`      | text | FK → languages(code)               | Language code           |
| `label`     | text | NOT NULL                           | Button label text       |

**Unique:** `(choice_id, lang)`

---

### `community_connections`

Form submissions from readers who want to connect with a local community.

| Column       | Type        | Constraints               | Description                          |
|--------------|-------------|---------------------------|--------------------------------------|
| `id`         | uuid        | PK                        | Primary key                          |
| `arc_id`     | uuid        | FK → arcs(id), NULLABLE   | Arc the reader just completed        |
| `lang`       | text        | FK → languages(code), NULLABLE | Reading language                |
| `name`       | text        | NOT NULL                  | Reader's name                        |
| `email`      | text        | NOT NULL                  | Reader's email                       |
| `city`       | text        | NULLABLE                  | Reader's city (optional)             |
| `created_at` | timestamptz | NOT NULL, default now()   | Submission timestamp                 |

---

## TypeScript Types

Defined in `src/lib/types.ts`:

| Interface                  | Maps To                                        |
|---------------------------|------------------------------------------------|
| `Language`                | `languages` row                                |
| `Arc`                     | `arcs` row                                     |
| `ArcWithTranslation`      | `arcs` + joined `arc_translations`             |
| `Scene`                   | `scenes` row                                   |
| `Choice`                  | `choices` row                                  |
| `ChoiceWithLabel`         | `choices` + joined `choice_translations`       |
| `SceneWithContent`        | `scenes` + joined `scene_translations` + choices |
| `CommunityConnectionInsert` | Insert payload for `community_connections`   |
