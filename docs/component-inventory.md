# Component Inventory — Gospel Story

All components live in `src/components/`. Six components total — all purpose-built for this app, no component library.

---

## Component Summary

| Component       | Type   | File                        | Used By                              |
|-----------------|--------|-----------------------------|--------------------------------------|
| `LanguageGrid`  | Server | `LanguageGrid.tsx`          | `app/page.tsx`                       |
| `ArcCard`       | Server | `ArcCard.tsx`               | `app/[lang]/page.tsx`                |
| `SceneView`     | Server | `SceneView.tsx`             | `app/[lang]/[arc]/page.tsx`          |
| `AudioPlayer`   | Client | `AudioPlayer.tsx`           | `SceneView`                          |
| `ChoiceButton`  | Client | `ChoiceButton.tsx`          | `SceneView`                          |
| `ConnectForm`   | Client | `ConnectForm.tsx`           | `app/[lang]/[arc]/connect/page.tsx`  |

---

## Component Details

### `LanguageGrid`

**Type:** Server Component (assumed — no `'use client'`)
**Purpose:** Renders the language selection grid on the home page. Each language links to `/[lang]`.

**Props:**
| Prop        | Type         | Description                  |
|-------------|--------------|------------------------------|
| `languages` | `Language[]` | List of active languages     |

---

### `ArcCard`

**Type:** Server Component
**Purpose:** Displays a single story arc with its title and tagline. Links to `/[lang]/[arc]`.

**Props:**
| Prop  | Type                  | Description                  |
|-------|-----------------------|------------------------------|
| `arc` | `ArcWithTranslation`  | Arc data with translation    |
| `lang`| `string`              | Current language code        |

---

### `SceneView`

**Type:** Server Component (composes Client Components internally)
**Purpose:** Main scene display — renders scene title, narrative body, optional audio player, and choice buttons.

**Props:**
| Prop    | Type               | Description                              |
|---------|--------------------|------------------------------------------|
| `scene` | `SceneWithContent` | Scene data with translation and choices  |
| `lang`  | `string`           | Current language code (for choice links) |
| `arc`   | `string`           | Current arc slug (for choice links)      |

**Sub-components rendered:**
- `AudioPlayer` (if `scene.audio_url` is present)
- `ChoiceButton` (for each choice in `scene.choices`)

---

### `AudioPlayer`

**Type:** Client Component (`'use client'`)
**Purpose:** Plays optional audio narration for a scene. Wraps HTML `<audio>` element.

**Props:**
| Prop  | Type   | Description         |
|-------|--------|---------------------|
| `url` | `string` | Audio file URL    |

**Why client:** Requires browser `<audio>` API and playback controls.

---

### `ChoiceButton`

**Type:** Client Component (`'use client'`)
**Purpose:** Renders a single narrative choice button. On click, navigates to the next scene via `?scene=<next_scene_id>`.

**Props:**
| Prop     | Type               | Description                        |
|----------|--------------------|------------------------------------|
| `choice` | `ChoiceWithLabel`  | Choice data with translated label  |
| `lang`   | `string`           | Current language code              |
| `arc`    | `string`           | Current arc slug                   |

**Why client:** Uses `useRouter` for programmatic navigation.

---

### `ConnectForm`

**Type:** Client Component (`'use client'`)
**Purpose:** Community connection form. Submits via the `submitCommunityConnection` Server Action. Uses React `useActionState` to handle success/error feedback.

**Props:**
| Prop      | Type     | Description                               |
|-----------|----------|-------------------------------------------|
| `lang`    | `string` | Language code (passed as hidden field)    |
| `arcSlug` | `string` | Arc slug (passed as hidden field)         |

**Fields:**
- `name` (required)
- `email` (required)
- `city` (optional)
- `lang` (hidden)
- `arcSlug` (hidden)

**Why client:** Uses `useActionState` hook for Server Action state management.
