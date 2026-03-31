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

### `stories` (Skeleton Model)

Story skeletons for AI-generated contextualized narratives. See [Conversational Entry Design](./plans/2026-03-30-conversational-entry-design.md).

| Column          | Type        | Constraints             | Description                              |
|-----------------|-------------|-------------------------|------------------------------------------|
| `id`            | uuid        | PK                      | Primary key                              |
| `slug`          | text        | UNIQUE, NOT NULL        | URL-safe identifier                      |
| `emotional_key` | text        | NOT NULL                | Emotion this story maps to               |
| `gospel_source` | text        | NOT NULL                | Scripture reference (e.g. "John 11:1-44")|
| `title`         | text        | NOT NULL                | English canonical title                  |
| `tagline`       | text        | NOT NULL                | Short description                        |
| `guardrails`    | text        | NOT NULL                | MUST/MUST NOT constraints for AI         |
| `tone_guidance` | text        | NOT NULL                | How to adjust tone per emotion           |
| `is_published`  | boolean     | NOT NULL, default false | Controls visibility                      |
| `created_at`    | timestamptz | NOT NULL, default now() | Creation timestamp                       |

---

### `story_beats`

Ordered plot points within a story. AI generates prose for each beat.

| Column             | Type        | Constraints                           | Description                                |
|--------------------|-------------|---------------------------------------|--------------------------------------------|
| `id`               | uuid        | PK                                    | Primary key                                |
| `story_id`         | uuid        | FK → stories(id) ON DELETE CASCADE    | Parent story                               |
| `order`            | int         | NOT NULL                              | Beat sequence number                       |
| `beat_summary`     | text        | NOT NULL                              | Short plot point ("Jesus weeps")           |
| `beat_detail`      | text        | NOT NULL                              | Fuller context for AI prompt               |
| `illustration_url` | text        | NULLABLE                              | Static illustration asset path             |
| `illustration_alt` | text        | NULLABLE                              | Accessibility description                  |
| `visual_context`   | text        | NULLABLE                              | Description for AI prompt alignment        |
| `is_start`         | boolean     | NOT NULL, default false               | Entry beat of the story                    |
| `is_end`           | boolean     | NOT NULL, default false               | Terminal beat                              |
| `created_at`       | timestamptz | NOT NULL, default now()               | Creation timestamp                         |

**Unique:** `(story_id, order)`

---

### `beat_choices`

Directed edges in the beat graph. AI generates choice labels from hints.

| Column         | Type | Constraints                              | Description                          |
|----------------|------|------------------------------------------|--------------------------------------|
| `id`           | uuid | PK                                       | Primary key                          |
| `beat_id`      | uuid | FK → story_beats(id) ON DELETE CASCADE   | Source beat                          |
| `next_beat_id` | uuid | FK → story_beats(id)                     | Destination beat                     |
| `choice_hint`  | text | NOT NULL                                 | Hint for AI to generate label        |
| `order`        | int  | NOT NULL, default 0                      | Display order                        |

---

### `entry_logs`

Logs conversational entry submissions for analytics.

| Column         | Type        | Constraints             | Description                    |
|----------------|-------------|-------------------------|--------------------------------|
| `id`           | uuid        | PK                      | Primary key                    |
| `user_input`   | text        | NOT NULL                | Raw text the user typed        |
| `detected_lang`| text        | NOT NULL                | Detected language code         |
| `emotional_key`| text        | NOT NULL                | Classified emotion             |
| `arc_slug`     | text        | NOT NULL                | Selected story slug            |
| `created_at`   | timestamptz | NOT NULL, default now() | Submission timestamp           |

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
