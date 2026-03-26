# Gospel Storybook — Design Document
**Date:** 2026-03-02
**Status:** Approved

---

## Overview

An interactive, multilingual gospel narrative web app for international students. Users choose a language, then navigate original JSB-inspired story arcs through branching choices. Audio narration plays in their native language at each scene. Every arc ends with a warm, culturally sensitive invitation to connect with a Christian community (campus ministry, church, etc.).

---

## App Identity

- **Working name:** The Story (or "His Story" / "Story of Stories" — TBD)
- **Primary audience:** International students unfamiliar with the Bible or Christianity
- **Platform:** Web app (mobile-first responsive design)
- **Tone:** Warm, wonder-filled, lyrical prose in the spirit of the Jesus Storybook Bible — "every story whispers his name"

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (Postgres) |
| File storage | Supabase Storage (audio files) |
| Styling | Tailwind CSS + shadcn/ui |
| Audio generation | OpenAI TTS or ElevenLabs (pre-generated, stored as .mp3) |
| Auth | None needed (anonymous readers) |
| Hosting | Vercel |

---

## Data Model

### `languages`
```
id          uuid  PK
code        text  (e.g., "zh", "es", "ar", "hi", "ko")
name        text  (e.g., "中文", "Español")
native_name text
is_active   boolean
```

### `arcs`
Story arcs are the top-level narrative units (e.g., "Creation," "The Rescue," "The King Who Came").
```
id           uuid  PK
slug         text  (url-safe, e.g., "creation")
order        int   (display order on home page)
is_published boolean
```

### `arc_translations`
```
id      uuid  PK
arc_id  uuid  FK → arcs
lang    text  FK → languages.code
title   text
tagline text  (short marketing-style description)
```

### `scenes`
Nodes in the branching graph.
```
id          uuid  PK
arc_id      uuid  FK → arcs
slug        text  (e.g., "scene-garden-of-eden")
is_start    boolean  (true for the first scene in an arc)
is_end      boolean  (true for the community connection scene)
created_at  timestamptz
```

### `scene_translations`
```
id        uuid  PK
scene_id  uuid  FK → scenes
lang      text
title     text
body      text  (lyrical prose, 100-250 words)
audio_url text  (Supabase Storage URL for .mp3)
```

### `choices`
Directed edges in the branching graph.
```
id             uuid  PK
scene_id       uuid  FK → scenes (source)
next_scene_id  uuid  FK → scenes (destination)
order          int   (display order of choices in the scene)
```

### `choice_translations`
```
id        uuid  PK
choice_id uuid  FK → choices
lang      text
label     text  (the text shown on the choice button, ~8-15 words)
```

### `community_connections`
Captures users who want to connect at the end of a story arc.
```
id         uuid  PK
arc_id     uuid  FK → arcs
lang       text
name       text
email      text
city       text  (optional — to help connect to a local ministry)
created_at timestamptz
```

---

## Application Pages & Routes

### `/` — Home / Language Selection
- Full-screen welcome with the app name and tagline
- Language grid (flags + native language names)
- Persists language choice in localStorage
- On select → show list of available story arcs in that language

### `/[lang]` — Arc Selection
- Grid of published arcs with translated title, tagline, and cover illustration
- Visual progress indicator if user has started an arc (stored in localStorage)

### `/[lang]/[arc-slug]` — Story Reader (core experience)
- Renders the branching scene graph one scene at a time
- Scene view:
  - Large atmospheric background (abstract illustration or gradient, not photorealistic)
  - Scene title (small, styled)
  - Body text displayed in readable typographic style
  - Audio player (auto-plays narration, can pause/replay)
  - Choice buttons appear after audio reaches ~80% completion (or immediately on tap)
- Progress: subtle breadcrumb or chapter dots showing position in arc
- On `is_end` scene: transition to community connection CTA

### `/[lang]/[arc-slug]/connect` — Community Connection
- Warm, non-pushy "what's next" screen
- Short paragraph: "This story is real, and it's for you. Would you like to explore more with others who follow Jesus?"
- Simple form: Name, Email, City (optional)
- On submit → thank-you message + optional "Read another story" button
- Form data → `community_connections` table

### `/admin` (optional, low-priority) — Basic CMS
- Password-protected simple UI to add/edit arcs, scenes, choices, and translations
- Or skip this initially and manage content directly via Supabase Studio

---

## Branching Philosophy

Choices do **not** change the gospel message — the truth of each arc stays intact. Instead, choices change the **lens**:
- Follow a different character whose situation resonates
- Explore "why" a character made a choice
- Different cultural framing (honor/shame vs. guilt/innocence vs. fear/power)

This keeps the story theologically sound while feeling personal to students from many backgrounds.

---

## Language & Audio Strategy

1. **Write story content in English first** using Claude (lyrical JSB-style prose)
2. **Translate** each scene body and choice labels using Claude or DeepL
3. **Generate audio** using OpenAI TTS (`tts-1` model, `alloy` or language-appropriate voice) or ElevenLabs for better quality
4. **Upload audio** to Supabase Storage, update `audio_url` in `scene_translations`

Priority languages for v1 (based on largest international student populations in the US):
- Chinese (Mandarin) — `zh`
- Spanish — `es`
- Hindi — `hi`
- Korean — `ko`
- Arabic — `ar`
- English — `en`

---

## MVP Scope (v1)

**In scope:**
- 1 complete story arc (e.g., "The King Who Came" — the Christmas/incarnation story)
- 6 languages (above)
- Audio narration per scene per language
- Branching choices (2 per scene, ~8-12 scenes per arc)
- Community connection form
- Language selection on home page
- Mobile-first responsive design

**Out of scope for v1:**
- Admin CMS UI (use Supabase Studio)
- User accounts / saved progress in database (localStorage is enough)
- Push notifications or email follow-up
- Video or animated illustrations
- More than 1 arc

---

## UX & Design Direction

- **Visual style:** Painterly/illustrated aesthetics. Soft gradients, not photorealistic. Think Studio Ghibli-adjacent warmth. Abstract backgrounds that feel like stained glass or watercolor.
- **Typography:** Serif for body (Lora or Playfair Display), sans for UI elements
- **Color palette:** Deep jewel tones (indigo, burgundy, gold) with warm cream backgrounds — feels sacred but approachable
- **Accessibility:** Audio captions (text is always visible), keyboard navigable, WCAG AA contrast

---

## Key Implementation Notes for Codex

1. **Scene navigation is stateless** — current scene ID is tracked in URL params (`/en/creation?scene=abc123`) so it's shareable and browser-back works correctly
2. **Audio must not block choices** — show choices after 80% audio playback OR immediately if user taps/clicks anywhere on the scene
3. **Language is set once** at root, passed via URL prefix (`/[lang]/...`) — do not use cookies or server sessions; read from URL
4. **Content in Supabase, rendered server-side** via Next.js Server Components for fast initial load + good SEO
5. **Audio files** are served directly from Supabase Storage public bucket — no API route needed
6. **Community connection form** should be a Next.js Server Action that inserts to Supabase

---

## File Structure

```
jesus-story/          ├── src/
│   ├── app/
│   │   ├── page.tsx                  # Language selection home
│   │   ├── [lang]/
│   │   │   ├── page.tsx              # Arc selection
│   │   │   └── [arc]/
│   │   │       ├── page.tsx          # Story reader
│   │   │       └── connect/
│   │   │           └── page.tsx      # Community connection
│   │   └── layout.tsx
│   ├── components/
│   │   ├── LanguageGrid.tsx
│   │   ├── ArcCard.tsx
│   │   ├── SceneView.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── ChoiceButton.tsx
│   │   └── ConnectForm.tsx
│   └── lib/
│       ├── supabase.ts               # Supabase client
│       ├── queries.ts                # DB query functions
│       └── types.ts                  # TypeScript types matching schema
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── docs/
    └── plans/
        └── 2026-03-02-gospel-storybook-design.md
```
