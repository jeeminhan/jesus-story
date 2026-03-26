# Gospel Storybook Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multilingual, choose-your-own-path interactive gospel storybook web app for international students, with audio narration per language and a community connection form at the end of each arc.

**Architecture:** Next.js 15 App Router with URL-based language routing (`/[lang]/[arc]?scene=<id>`). Story content (scenes, choices, translations) lives in Supabase Postgres. Audio files are pre-generated MP3s stored in Supabase Storage and referenced by URL in `scene_translations`. Scene navigation is stateless — current scene ID is a URL search param so sharing and browser back work correctly.

**Tech Stack:** Next.js 15, TypeScript, Supabase (Postgres + Storage), Tailwind CSS, shadcn/ui, Playwright (E2E tests), Vercel (hosting)

---

## Before You Start

**Read the design doc first:** `docs/plans/2026-03-02-gospel-storybook-design.md` — it has the full data model, routing structure, and UX decisions.

**Environment variables needed:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, for seeding
```

**Key conventions:**
- All DB queries go in `src/lib/queries.ts` — never inline SQL in components
- Language code is always the first URL segment: `/en`, `/zh`, `/es`, `/hi`, `/ko`, `/ar`
- Scene ID is always in URL search params: `?scene=<uuid>`
- Server Components fetch data; Client Components handle audio + interaction state

---

## Task 1: Scaffold the Project

**Files:**
- Create: `gospel-story/` (project root, run from `/Users/jeeminhan/Code`)

**Step 1: Bootstrap Next.js**

```bash
cd /Users/jeeminhan/Code
npx create-next-app@latest gospel-story \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --no-turbopack
cd gospel-story
```

Answer prompts: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, `src/`=Yes, App Router=Yes, import alias=`@/*`

**Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D @playwright/test
npx shadcn@latest init
```

shadcn init answers: style=Default, base color=Slate, CSS variables=Yes

**Step 3: Install shadcn components you'll need**

```bash
npx shadcn@latest add button card input label badge separator
```

**Step 4: Set up Playwright**

```bash
npx playwright install chromium
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 5: Create `.env.local`**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF
```

Fill in real values from Supabase dashboard (create a new project at supabase.com if needed).

**Step 6: Add `e2e/` to `.gitignore` test-results**

Append to `.gitignore`:
```
/test-results
/playwright-report
```

**Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Supabase and Playwright"
```

---

## Task 2: Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `src/lib/types.ts`

**Step 1: Write the migration SQL**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Languages
create table languages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,       -- 'en', 'zh', 'es', 'hi', 'ko', 'ar'
  name text not null,              -- 'English'
  native_name text not null,       -- '中文'
  is_active boolean not null default true
);

-- Story arcs (top-level narrative units)
create table arcs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,       -- 'the-king-who-came'
  "order" int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Arc translations (title + tagline per language)
create table arc_translations (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references arcs(id) on delete cascade,
  lang text not null references languages(code),
  title text not null,
  tagline text not null,
  unique(arc_id, lang)
);

-- Scenes (nodes in branching graph)
create table scenes (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references arcs(id) on delete cascade,
  slug text not null,              -- 'scene-manger'
  is_start boolean not null default false,
  is_end boolean not null default false,  -- true = community connection scene
  created_at timestamptz not null default now(),
  unique(arc_id, slug)
);

-- Scene content per language
create table scene_translations (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes(id) on delete cascade,
  lang text not null references languages(code),
  title text not null,
  body text not null,              -- lyrical prose, 100-250 words
  audio_url text,                  -- Supabase Storage URL for .mp3
  unique(scene_id, lang)
);

-- Choices (directed edges between scenes)
create table choices (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes(id) on delete cascade,
  next_scene_id uuid not null references scenes(id),
  "order" int not null default 0
);

-- Choice label per language
create table choice_translations (
  id uuid primary key default gen_random_uuid(),
  choice_id uuid not null references choices(id) on delete cascade,
  lang text not null references languages(code),
  label text not null,             -- ~8-15 words shown on the choice button
  unique(choice_id, lang)
);

-- Community connection form submissions
create table community_connections (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid references arcs(id),
  lang text references languages(code),
  name text not null,
  email text not null,
  city text,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index on arc_translations(lang);
create index on scene_translations(lang);
create index on scenes(arc_id);
create index on choices(scene_id);
```

**Step 2: Apply the migration**

In Supabase dashboard → SQL Editor, paste and run the migration SQL. Or use Supabase CLI:

```bash
# If using Supabase CLI (optional):
npx supabase db push
```

**Step 3: Write TypeScript types**

Create `src/lib/types.ts`:

```typescript
export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
}

export interface Arc {
  id: string;
  slug: string;
  order: number;
  is_published: boolean;
}

export interface ArcWithTranslation extends Arc {
  title: string;
  tagline: string;
}

export interface Scene {
  id: string;
  arc_id: string;
  slug: string;
  is_start: boolean;
  is_end: boolean;
}

export interface SceneWithContent extends Scene {
  title: string;
  body: string;
  audio_url: string | null;
  choices: ChoiceWithLabel[];
}

export interface Choice {
  id: string;
  scene_id: string;
  next_scene_id: string;
  order: number;
}

export interface ChoiceWithLabel extends Choice {
  label: string;
}

export interface CommunityConnectionInsert {
  arc_id: string;
  lang: string;
  name: string;
  email: string;
  city?: string;
}
```

**Step 4: Commit**

```bash
git add supabase/ src/lib/types.ts
git commit -m "feat: add database schema and TypeScript types"
```

---

## Task 3: Supabase Client + Query Functions

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/queries.ts`

**Step 1: Create Supabase client helpers**

Create `src/lib/supabase.ts`:

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

**Step 2: Write query functions**

Create `src/lib/queries.ts`:

```typescript
import { createServerSupabaseClient } from './supabase';
import type {
  Language,
  ArcWithTranslation,
  SceneWithContent,
  CommunityConnectionInsert,
} from './types';

export async function getActiveLanguages(): Promise<Language[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
}

export async function getPublishedArcs(lang: string): Promise<ArcWithTranslation[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('arcs')
    .select(`
      id, slug, order, is_published,
      arc_translations!inner(title, tagline)
    `)
    .eq('is_published', true)
    .eq('arc_translations.lang', lang)
    .order('order');
  if (error) throw error;
  return data.map((row: any) => ({
    ...row,
    title: row.arc_translations[0].title,
    tagline: row.arc_translations[0].tagline,
  }));
}

export async function getStartScene(arcSlug: string, lang: string): Promise<SceneWithContent | null> {
  const supabase = await createServerSupabaseClient();
  const { data: arc } = await supabase
    .from('arcs')
    .select('id')
    .eq('slug', arcSlug)
    .single();
  if (!arc) return null;

  const { data, error } = await supabase
    .from('scenes')
    .select(`
      id, arc_id, slug, is_start, is_end,
      scene_translations!inner(title, body, audio_url),
      choices(id, next_scene_id, order, choice_translations!inner(label))
    `)
    .eq('arc_id', arc.id)
    .eq('is_start', true)
    .eq('scene_translations.lang', lang)
    .eq('choices.choice_translations.lang', lang)
    .single();
  if (error || !data) return null;
  return flattenScene(data);
}

export async function getScene(sceneId: string, lang: string): Promise<SceneWithContent | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('scenes')
    .select(`
      id, arc_id, slug, is_start, is_end,
      scene_translations!inner(title, body, audio_url),
      choices(id, next_scene_id, order, choice_translations!inner(label))
    `)
    .eq('id', sceneId)
    .eq('scene_translations.lang', lang)
    .eq('choices.choice_translations.lang', lang)
    .single();
  if (error || !data) return null;
  return flattenScene(data);
}

function flattenScene(data: any): SceneWithContent {
  const t = data.scene_translations[0];
  const choices = (data.choices || [])
    .sort((a: any, b: any) => a.order - b.order)
    .map((c: any) => ({
      id: c.id,
      scene_id: data.id,
      next_scene_id: c.next_scene_id,
      order: c.order,
      label: c.choice_translations[0]?.label ?? '',
    }));
  return {
    id: data.id,
    arc_id: data.arc_id,
    slug: data.slug,
    is_start: data.is_start,
    is_end: data.is_end,
    title: t.title,
    body: t.body,
    audio_url: t.audio_url,
    choices,
  };
}

export async function insertCommunityConnection(data: CommunityConnectionInsert) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('community_connections').insert(data);
  if (error) throw error;
}

export async function getArcBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('arcs')
    .select('id, slug')
    .eq('slug', slug)
    .single();
  return data;
}
```

**Step 3: Commit**

```bash
git add src/lib/
git commit -m "feat: add Supabase client and query functions"
```

---

## Task 4: Seed Data (1 Arc, 6 Languages)

**Files:**
- Create: `scripts/seed.ts`

**Step 1: Write seed script**

Create `scripts/seed.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log('Seeding languages...');
  await supabase.from('languages').upsert([
    { code: 'en', name: 'English', native_name: 'English' },
    { code: 'zh', name: 'Chinese', native_name: '中文' },
    { code: 'es', name: 'Spanish', native_name: 'Español' },
    { code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
    { code: 'ko', name: 'Korean', native_name: '한국어' },
    { code: 'ar', name: 'Arabic', native_name: 'العربية' },
  ], { onConflict: 'code' });

  console.log('Seeding arc...');
  const { data: arc } = await supabase
    .from('arcs')
    .upsert({ slug: 'the-king-who-came', order: 1, is_published: true }, { onConflict: 'slug' })
    .select()
    .single();
  const arcId = arc!.id;

  await supabase.from('arc_translations').upsert([
    { arc_id: arcId, lang: 'en', title: 'The King Who Came', tagline: 'A story about a rescue no one expected.' },
    { arc_id: arcId, lang: 'zh', title: '来临的王', tagline: '一个没有人预料到的拯救故事。' },
    { arc_id: arcId, lang: 'es', title: 'El Rey que Vino', tagline: 'Una historia sobre un rescate que nadie esperaba.' },
    { arc_id: arcId, lang: 'hi', title: 'वह राजा जो आया', tagline: 'एक ऐसे उद्धार की कहानी जिसकी किसी को उम्मीद नहीं थी।' },
    { arc_id: arcId, lang: 'ko', title: '오신 왕', tagline: '아무도 예상하지 못한 구원 이야기.' },
    { arc_id: arcId, lang: 'ar', title: 'الملك الذي جاء', tagline: 'قصة إنقاذ لم يتوقعها أحد.' },
  ], { onConflict: 'arc_id, lang' });

  // Scenes
  console.log('Seeding scenes...');
  const sceneSlugs = [
    { slug: 'the-waiting', is_start: true, is_end: false },
    { slug: 'a-different-kind-of-king', is_start: false, is_end: false },
    { slug: 'the-shepherds-path', is_start: false, is_end: false },
    { slug: 'the-scholars-path', is_start: false, is_end: false },
    { slug: 'what-do-you-do-with-a-king', is_start: false, is_end: false },
    { slug: 'the-rescue', is_start: false, is_end: false },
    { slug: 'the-invitation', is_start: false, is_end: true },
  ];

  const insertedScenes: Record<string, string> = {};
  for (const s of sceneSlugs) {
    const { data } = await supabase
      .from('scenes')
      .upsert({ arc_id: arcId, ...s }, { onConflict: 'arc_id, slug' })
      .select()
      .single();
    insertedScenes[s.slug] = data!.id;
  }

  // English scene content (translated versions would be added later via AI pipeline)
  console.log('Seeding English scene content...');
  const sceneContent: Record<string, { title: string; body: string }> = {
    'the-waiting': {
      title: 'The Waiting',
      body: `Long ago, before you were born, before your country had a name — the world was broken. Not the way a toy breaks, but the way a heart breaks. People searched for something they could not quite name. They built empires, wrote songs, climbed mountains, and still felt the ache. Somewhere deep inside, everyone seemed to know: this is not how it was supposed to be.\n\nBut there was a whisper. Ancient and quiet. It said: someone is coming. Someone who will put everything right. Someone who has loved you since before the stars were lit.\n\nAnd the world waited.`,
    },
    'a-different-kind-of-king': {
      title: 'A Different Kind of King',
      body: `When the King finally came, he did not arrive the way kings usually do — not with armies, not with gold, not with a palace of marble and light. He came as a baby, small and helpless, in a place where animals slept. His mother wrapped him in cloth to keep him warm. His father stood guard over a borrowed stable.\n\nThe one who made the stars chose to sleep under them.\n\nThis was not a mistake. This was the plan. Because this King had come not to be served, but to serve. Not to take, but to give. And what he had come to give — no emperor had ever offered before.`,
    },
    'the-shepherds-path': {
      title: "The Shepherds' Path",
      body: `That night, on a hillside outside the little town, shepherds sat in the dark. They were not important people. They were not rich, or powerful, or respected. They were just... ordinary. Trying to get through another night.\n\nAnd then the sky broke open.\n\nLight poured down like a river, and the shepherds fell to the ground, terrified. But the messenger said: "Do not be afraid. I bring you good news. Tonight, in the city of David, a Savior has been born. He is the Rescuer the world has been waiting for. And here is how you will know him: you will find a baby wrapped in cloth, lying in a feeding trough."\n\nThe shepherds looked at each other. A feeding trough? For the Rescuer of the world?\n\nThey ran anyway.`,
    },
    'the-scholars-path': {
      title: "The Scholars' Journey",
      body: `Far away, in lands to the east, there were men who studied the sky like a map. They read the stars the way others read books. And one night, a new star appeared — brighter than the rest, moving with purpose.\n\nThey packed their bags and followed it.\n\nFor months they traveled, through deserts and markets and foreign cities. People thought they were foolish. Following a star? Searching for a king in another country? But these men had read old, old writings — writings that promised a ruler would come from an unexpected place, and that his kingdom would never end.\n\nThey did not stop until the star did.`,
    },
    'what-do-you-do-with-a-king': {
      title: 'What Do You Do With a King?',
      body: `When the travelers arrived, they knelt. They brought their most precious things — gifts fit for royalty — and laid them at the feet of a child who could not yet walk.\n\nThey were not embarrassed. They were not confused. Something in them recognized: this is who we were looking for.\n\nBut not everyone felt that way. The ruler in the palace heard about this new "king" and felt only fear. Fear that someone might take what was his. Fear that he might lose control. He tried to find the child — not to worship him, but to destroy him.\n\nThis is always the question, in every age, in every heart: what do you do when a king arrives who asks for everything?`,
    },
    'the-rescue': {
      title: 'The Rescue',
      body: `The child grew up. He was not like other people. He touched sick people and they became well. He spoke to storms and they went quiet. He told people their sins were forgiven, and they felt the weight of years lift from their shoulders.\n\nHe said things like: "I am the bread of life. I am the light of the world. I am the door. I am the way, the truth, and the life."\n\nBig claims. Impossible claims. Unless they were true.\n\nAnd then — this is the part no one expected — this King who had come to rescue everyone was killed. By the very people he had come to save.\n\nBut death could not hold him. Three days later, the tomb was empty.\n\nThe rescue was not a story about a hero who survived. It was a story about a King who gave his life so that everyone who had been lost could be found. And then took it back again, to prove that death was not the end.`,
    },
    'the-invitation': {
      title: 'The Invitation',
      body: `This story is not finished.\n\nThe King who came is still here. Not in a stable this time, but closer — he said that anyone who comes to him, he will not turn away. Anyone. From any country, any background, any story.\n\nYou came from far away to study. You left home. You may feel far from everything familiar. But this story says that the one who made you has never been far from you — and that he has been whispering your name since before you were born.\n\nHe invites you now. Not to a religion. Not to a set of rules. To himself.\n\nWould you like to explore what it means to follow him — with others who are asking the same questions?`,
    },
  };

  for (const [slug, content] of Object.entries(sceneContent)) {
    const sceneId = insertedScenes[slug];
    await supabase.from('scene_translations').upsert({
      scene_id: sceneId,
      lang: 'en',
      ...content,
      audio_url: null,
    }, { onConflict: 'scene_id, lang' });
  }

  // Choices
  console.log('Seeding choices...');
  // Scene 1 (the-waiting) → 2 choices
  const c1 = await supabase.from('choices').insert([
    { scene_id: insertedScenes['the-waiting'], next_scene_id: insertedScenes['a-different-kind-of-king'], order: 0 },
  ]).select().single();

  // Scene 2 (a-different-kind-of-king) → 2 branching choices
  const c2a = await supabase.from('choices').insert(
    { scene_id: insertedScenes['a-different-kind-of-king'], next_scene_id: insertedScenes['the-shepherds-path'], order: 0 }
  ).select().single();
  const c2b = await supabase.from('choices').insert(
    { scene_id: insertedScenes['a-different-kind-of-king'], next_scene_id: insertedScenes['the-scholars-path'], order: 1 }
  ).select().single();

  // Scenes 3 and 4 both → scene 5
  const c3 = await supabase.from('choices').insert(
    { scene_id: insertedScenes['the-shepherds-path'], next_scene_id: insertedScenes['what-do-you-do-with-a-king'], order: 0 }
  ).select().single();
  const c4 = await supabase.from('choices').insert(
    { scene_id: insertedScenes['the-scholars-path'], next_scene_id: insertedScenes['what-do-you-do-with-a-king'], order: 0 }
  ).select().single();

  // Scene 5 → 6 → 7
  const c5 = await supabase.from('choices').insert(
    { scene_id: insertedScenes['what-do-you-do-with-a-king'], next_scene_id: insertedScenes['the-rescue'], order: 0 }
  ).select().single();
  const c6 = await supabase.from('choices').insert(
    { scene_id: insertedScenes['the-rescue'], next_scene_id: insertedScenes['the-invitation'], order: 0 }
  ).select().single();

  // English choice labels
  await supabase.from('choice_translations').upsert([
    { choice_id: c1.data!.id, lang: 'en', label: 'I want to hear more about the King who was coming' },
    { choice_id: c2a.data!.id, lang: 'en', label: 'Follow the shepherds — the ordinary people who heard the news first' },
    { choice_id: c2b.data!.id, lang: 'en', label: 'Follow the scholars — the wise men who traveled from afar' },
    { choice_id: c3.data!.id, lang: 'en', label: 'See what the shepherds found' },
    { choice_id: c4.data!.id, lang: 'en', label: 'See where the star led them' },
    { choice_id: c5.data!.id, lang: 'en', label: 'What happened to this King?' },
    { choice_id: c6.data!.id, lang: 'en', label: 'What does this mean for me?' },
  ], { onConflict: 'choice_id, lang' });

  console.log('Seed complete!');
}

seed().catch(console.error);
```

**Step 2: Add `tsx` and run the seed**

```bash
npm install -D tsx
npx tsx scripts/seed.ts
```

Expected output:
```
Seeding languages...
Seeding arc...
Seeding scenes...
Seeding English scene content...
Seeding choices...
Seed complete!
```

**Step 3: Commit**

```bash
git add scripts/
git commit -m "feat: add seed script with The King Who Came arc"
```

---

## Task 5: Layout and Global Styles

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Update `globals.css` for typography**

Replace the contents of `src/app/globals.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-serif: 'Lora', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
  background-color: #0f0a1e;
  color: #f5f0e8;
}

.prose-story {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: #f5f0e8;
}

.prose-story p {
  margin-bottom: 1.25rem;
}
```

**Step 2: Update `layout.tsx`**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Story',
  description: 'An interactive gospel storybook for international students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0a1e] text-[#f5f0e8]">
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: set up global styles with serif typography and dark jewel-tone palette"
```

---

## Task 6: Home Page — Language Selection

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/LanguageGrid.tsx`
- Create: `e2e/home.spec.ts`

**Step 1: Write the E2E test first**

Create `e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('home page shows language selection and navigates to arc list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /the story/i })).toBeVisible();
  // Language options should be visible
  await expect(page.getByText('English')).toBeVisible();
  await expect(page.getByText('中文')).toBeVisible();
  // Click English and expect navigation to /en
  await page.getByText('English').click();
  await expect(page).toHaveURL('/en');
});
```

**Step 2: Run test to verify it fails**

```bash
npm run dev &
npx playwright test e2e/home.spec.ts
```

Expected: FAIL (page doesn't exist yet)

**Step 3: Create `LanguageGrid` component**

Create `src/components/LanguageGrid.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import type { Language } from '@/lib/types';

const LANGUAGE_EMOJIS: Record<string, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  es: '🇪🇸',
  hi: '🇮🇳',
  ko: '🇰🇷',
  ar: '🇸🇦',
};

export function LanguageGrid({ languages }: { languages: Language[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => router.push(`/${lang.code}`)}
          className="
            flex flex-col items-center gap-2 p-5 rounded-xl
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:border-white/20
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
          "
        >
          <span className="text-3xl">{LANGUAGE_EMOJIS[lang.code] ?? '🌐'}</span>
          <span className="text-sm font-medium text-amber-100">{lang.native_name}</span>
          <span className="text-xs text-white/50">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
```

**Step 4: Create home page**

Create `src/app/page.tsx`:

```typescript
import { getActiveLanguages } from '@/lib/queries';
import { LanguageGrid } from '@/components/LanguageGrid';

export default async function HomePage() {
  const languages = await getActiveLanguages();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">
      <div className="mb-12">
        <h1
          className="text-5xl font-bold mb-4 text-amber-100"
          style={{ fontFamily: 'Lora, serif' }}
        >
          The Story
        </h1>
        <p className="text-lg text-white/60 max-w-sm">
          An ancient story. A personal invitation. Choose your language to begin.
        </p>
      </div>
      <LanguageGrid languages={languages} />
    </main>
  );
}
```

**Step 5: Run test to verify it passes**

```bash
npx playwright test e2e/home.spec.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/app/page.tsx src/components/LanguageGrid.tsx e2e/home.spec.ts
git commit -m "feat: add home page with language selection grid"
```

---

## Task 7: Arc Selection Page

**Files:**
- Create: `src/app/[lang]/page.tsx`
- Create: `src/components/ArcCard.tsx`
- Create: `e2e/arc-selection.spec.ts`

**Step 1: Write E2E test**

Create `e2e/arc-selection.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('arc selection page shows published arcs in chosen language', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByText('The King Who Came')).toBeVisible();
  await expect(page.getByText(/A story about a rescue/i)).toBeVisible();
  await page.getByText('The King Who Came').click();
  await expect(page).toHaveURL(/\/en\/the-king-who-came/);
});
```

**Step 2: Run to verify fail**

```bash
npx playwright test e2e/arc-selection.spec.ts
```

Expected: FAIL

**Step 3: Create `ArcCard` component**

Create `src/components/ArcCard.tsx`:

```typescript
import Link from 'next/link';
import type { ArcWithTranslation } from '@/lib/types';

export function ArcCard({ arc, lang }: { arc: ArcWithTranslation; lang: string }) {
  return (
    <Link
      href={`/${lang}/${arc.slug}`}
      className="
        block p-6 rounded-2xl
        bg-gradient-to-br from-indigo-900/60 to-purple-900/40
        border border-indigo-500/20
        hover:border-amber-400/40 hover:from-indigo-800/60
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
      "
    >
      <div className="text-amber-300 text-sm font-medium mb-2 uppercase tracking-widest">
        Story
      </div>
      <h2 className="text-xl font-bold text-amber-100 mb-2" style={{ fontFamily: 'Lora, serif' }}>
        {arc.title}
      </h2>
      <p className="text-white/60 text-sm leading-relaxed">{arc.tagline}</p>
      <div className="mt-4 text-amber-400 text-sm font-medium">
        Begin →
      </div>
    </Link>
  );
}
```

**Step 4: Create arc selection page**

Create `src/app/[lang]/page.tsx`:

```typescript
import { getPublishedArcs, getActiveLanguages } from '@/lib/queries';
import { ArcCard } from '@/components/ArcCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const VALID_LANGS = ['en', 'zh', 'es', 'hi', 'ko', 'ar'];

export default async function ArcSelectionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!VALID_LANGS.includes(lang)) notFound();

  const arcs = await getPublishedArcs(lang);

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">
          ← Change language
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-amber-100 mb-2" style={{ fontFamily: 'Lora, serif' }}>
        Stories
      </h1>
      <p className="text-white/50 mb-10">Choose a story to begin.</p>
      <div className="flex flex-col gap-4">
        {arcs.map((arc) => (
          <ArcCard key={arc.id} arc={arc} lang={lang} />
        ))}
      </div>
    </main>
  );
}
```

**Step 5: Run test to verify pass**

```bash
npx playwright test e2e/arc-selection.spec.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/app/[lang]/ src/components/ArcCard.tsx e2e/arc-selection.spec.ts
git commit -m "feat: add arc selection page with language-aware routing"
```

---

## Task 8: Story Reader — Scene View

**Files:**
- Create: `src/app/[lang]/[arc]/page.tsx`
- Create: `src/components/SceneView.tsx`
- Create: `src/components/AudioPlayer.tsx`
- Create: `src/components/ChoiceButton.tsx`
- Create: `e2e/story-reader.spec.ts`

**Step 1: Write E2E test**

Create `e2e/story-reader.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('story reader loads first scene and shows choices', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
  await expect(page.getByText(/the world was broken/i)).toBeVisible();
  // Choice button should be visible
  await expect(page.getByRole('button', { name: /King who was coming/i })).toBeVisible();
});

test('clicking a choice navigates to next scene', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await page.getByRole('button', { name: /King who was coming/i }).click();
  await expect(page.getByRole('heading', { name: 'A Different Kind of King' })).toBeVisible();
  // URL should include scene param
  await expect(page).toHaveURL(/scene=/);
});
```

**Step 2: Run to verify fail**

```bash
npx playwright test e2e/story-reader.spec.ts
```

Expected: FAIL

**Step 3: Create `AudioPlayer` component**

Create `src/components/AudioPlayer.tsx`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onNearEnd?: () => void; // called when audio reaches 80% — used to reveal choices
}

export function AudioPlayer({ audioUrl, onNearEnd }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const calledRef = useRef(false);

  useEffect(() => {
    calledRef.current = false;
    setProgress(0);
    setPlaying(false);
  }, [audioUrl]);

  if (!audioUrl) return null;

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = audio.currentTime / audio.duration;
    setProgress(pct);
    if (pct >= 0.8 && !calledRef.current) {
      calledRef.current = true;
      onNearEnd?.();
    }
  }

  function handleEnded() {
    setPlaying(false);
    onNearEnd?.();
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <div className="flex items-center gap-3 py-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <button
        onClick={toggle}
        className="
          w-10 h-10 rounded-full flex items-center justify-center
          bg-amber-500/20 border border-amber-400/30
          hover:bg-amber-500/30 transition-colors
          text-amber-300 text-sm
        "
        aria-label={playing ? 'Pause narration' : 'Play narration'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400/60 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-xs text-white/30">Narration</span>
    </div>
  );
}
```

**Step 4: Create `ChoiceButton` component**

Create `src/components/ChoiceButton.tsx`:

```typescript
'use client';

import type { ChoiceWithLabel } from '@/lib/types';

interface ChoiceButtonProps {
  choice: ChoiceWithLabel;
  onSelect: (nextSceneId: string) => void;
}

export function ChoiceButton({ choice, onSelect }: ChoiceButtonProps) {
  return (
    <button
      onClick={() => onSelect(choice.next_scene_id)}
      className="
        w-full text-left px-5 py-4 rounded-xl
        bg-indigo-900/40 border border-indigo-400/20
        hover:bg-indigo-800/50 hover:border-amber-400/30
        transition-all duration-200
        text-amber-100 text-sm leading-relaxed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
      "
    >
      {choice.label} →
    </button>
  );
}
```

**Step 5: Create `SceneView` (client component)**

Create `src/components/SceneView.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { ChoiceButton } from './ChoiceButton';
import type { SceneWithContent } from '@/lib/types';

interface SceneViewProps {
  scene: SceneWithContent;
  lang: string;
  arcSlug: string;
}

export function SceneView({ scene, lang, arcSlug }: SceneViewProps) {
  const router = useRouter();
  const [choicesVisible, setChoicesVisible] = useState(!scene.audio_url);

  function handleChoiceSelect(nextSceneId: string) {
    if (scene.is_end) {
      router.push(`/${lang}/${arcSlug}/connect`);
    } else {
      router.push(`/${lang}/${arcSlug}?scene=${nextSceneId}`);
    }
  }

  // For end scenes: the single "choice" is to go to connect page
  const isEnd = scene.is_end;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl font-bold text-amber-200 mb-4"
          style={{ fontFamily: 'Lora, serif' }}
        >
          {scene.title}
        </h1>
        <div className="prose-story">
          {scene.body.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {scene.audio_url && (
        <AudioPlayer
          audioUrl={scene.audio_url}
          onNearEnd={() => setChoicesVisible(true)}
        />
      )}

      {/* Always show choices — reveal immediately if no audio */}
      <div
        className={`flex flex-col gap-3 transition-all duration-500 ${
          choicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {isEnd ? (
          <button
            onClick={() => router.push(`/${lang}/${arcSlug}/connect`)}
            className="
              w-full text-left px-5 py-4 rounded-xl
              bg-amber-500/20 border border-amber-400/30
              hover:bg-amber-500/30 hover:border-amber-400/60
              transition-all duration-200
              text-amber-100 text-sm leading-relaxed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
            "
          >
            I want to explore what it means to follow Jesus →
          </button>
        ) : (
          scene.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              onSelect={handleChoiceSelect}
            />
          ))
        )}

        {/* Allow skipping audio to reveal choices */}
        {!choicesVisible && scene.audio_url && (
          <button
            onClick={() => setChoicesVisible(true)}
            className="text-xs text-white/30 hover:text-white/50 text-center transition-colors mt-2"
          >
            Skip audio
          </button>
        )}
      </div>
    </div>
  );
}
```

**Step 6: Create the story reader page**

Create `src/app/[lang]/[arc]/page.tsx`:

```typescript
import { getStartScene, getScene, getArcBySlug } from '@/lib/queries';
import { SceneView } from '@/components/SceneView';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; arc: string }>;
  searchParams: Promise<{ scene?: string }>;
}) {
  const { lang, arc: arcSlug } = await params;
  const { scene: sceneId } = await searchParams;

  const arcData = await getArcBySlug(arcSlug);
  if (!arcData) notFound();

  const scene = sceneId
    ? await getScene(sceneId, lang)
    : await getStartScene(arcSlug, lang);

  if (!scene) notFound();

  return (
    <main className="min-h-screen px-6 py-12 max-w-xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/${lang}`}
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          ← Stories
        </Link>
      </div>
      <SceneView scene={scene} lang={lang} arcSlug={arcSlug} />
    </main>
  );
}
```

**Step 7: Run tests to verify pass**

```bash
npx playwright test e2e/story-reader.spec.ts
```

Expected: PASS

**Step 8: Commit**

```bash
git add src/app/[lang]/[arc]/ src/components/ e2e/story-reader.spec.ts
git commit -m "feat: add story reader with branching scene navigation and audio player"
```

---

## Task 9: Community Connection Form

**Files:**
- Create: `src/app/[lang]/[arc]/connect/page.tsx`
- Create: `src/app/actions/connect.ts`
- Create: `e2e/connect.spec.ts`

**Step 1: Write E2E test**

Create `e2e/connect.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('community connection page shows form', async ({ page }) => {
  await page.goto('/en/the-king-who-came/connect');
  await expect(page.getByRole('heading', { name: /what.*next/i })).toBeVisible();
  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test('submitting form shows thank you message', async ({ page }) => {
  await page.goto('/en/the-king-who-came/connect');
  await page.getByLabel(/name/i).fill('Test User');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByRole('button', { name: /connect/i }).click();
  await expect(page.getByText(/thank you/i)).toBeVisible();
});
```

**Step 2: Run to verify fail**

```bash
npx playwright test e2e/connect.spec.ts
```

Expected: FAIL

**Step 3: Create Server Action**

Create `src/app/actions/connect.ts`:

```typescript
'use server';

import { insertCommunityConnection } from '@/lib/queries';
import { getArcBySlug } from '@/lib/queries';

export async function submitCommunityConnection(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const city = formData.get('city') as string | undefined;
  const lang = formData.get('lang') as string;
  const arcSlug = formData.get('arcSlug') as string;

  if (!name || !email || !lang || !arcSlug) {
    throw new Error('Missing required fields');
  }

  const arc = await getArcBySlug(arcSlug);
  if (!arc) throw new Error('Arc not found');

  await insertCommunityConnection({
    arc_id: arc.id,
    lang,
    name,
    email,
    city: city || undefined,
  });
}
```

**Step 4: Create connect page**

Create `src/app/[lang]/[arc]/connect/page.tsx`:

```typescript
'use client';

import { useActionState } from 'react';
import { submitCommunityConnection } from '@/app/actions/connect';
import Link from 'next/link';
import { use } from 'react';

export default function ConnectPage({
  params,
}: {
  params: Promise<{ lang: string; arc: string }>;
}) {
  const { lang, arc: arcSlug } = use(params);
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean } | null, formData: FormData) => {
      formData.set('lang', lang);
      formData.set('arcSlug', arcSlug);
      await submitCommunityConnection(formData);
      return { success: true };
    },
    null
  );

  if (state?.success) {
    return (
      <main className="min-h-screen px-6 py-16 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-6">✨</div>
        <h1 className="text-2xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'Lora, serif' }}>
          Thank You
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Someone will be in touch soon. In the meantime, you can read another story.
        </p>
        <Link
          href={`/${lang}`}
          className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
        >
          ← Read another story
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/${lang}/${arcSlug}`}
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          ← Back to the story
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-amber-100 mb-3" style={{ fontFamily: 'Lora, serif' }}>
        What's Next?
      </h1>
      <p className="text-white/60 mb-8 leading-relaxed">
        This story is real, and it is for you. If you would like to explore what it means to follow Jesus
        — with others who are asking the same questions — we would love to connect you.
      </p>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-amber-200/80">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="What should we call you?"
            className="
              px-4 py-3 rounded-xl bg-white/5 border border-white/10
              text-white placeholder-white/30
              focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30
            "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-amber-200/80">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="
              px-4 py-3 rounded-xl bg-white/5 border border-white/10
              text-white placeholder-white/30
              focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30
            "
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-sm text-amber-200/80">
            City <span className="text-white/30">(optional — helps us connect you locally)</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. Boston, Seoul, Mumbai"
            className="
              px-4 py-3 rounded-xl bg-white/5 border border-white/10
              text-white placeholder-white/30
              focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30
            "
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="
            mt-2 px-6 py-4 rounded-xl
            bg-amber-500 hover:bg-amber-400
            text-amber-950 font-semibold
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {pending ? 'Connecting...' : 'I want to connect →'}
        </button>
      </form>

      <p className="mt-6 text-xs text-white/25 text-center">
        We will not spam you or share your information.
      </p>
    </main>
  );
}
```

**Step 5: Run tests to verify pass**

```bash
npx playwright test e2e/connect.spec.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/app/[lang]/[arc]/connect/ src/app/actions/ e2e/connect.spec.ts
git commit -m "feat: add community connection form with Server Action and thank-you state"
```

---

## Task 10: Run Full E2E Suite + Deploy to Vercel

**Step 1: Run all E2E tests**

```bash
npx playwright test
```

Expected: All PASS

**Step 2: Build check**

```bash
npm run build
```

Expected: Successful build with no type errors.

**Step 3: Set up Vercel deployment**

```bash
npx vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: final cleanup before v1 deploy"
```

---

## Post-MVP: Adding More Languages (AI Pipeline)

After v1, to add translations for a new language (e.g., Mandarin):

1. For each scene, use Claude to translate `body` and `title` into the target language
2. Use OpenAI TTS (`tts-1` model, voice `alloy`) to generate MP3 for each translated body
3. Upload MP3s to Supabase Storage bucket `audio` with path `/{lang}/{scene-id}.mp3`
4. Insert `scene_translations` rows with `audio_url` pointing to the public storage URL
5. Translate choice labels and insert `choice_translations` rows

Example Claude prompt for translation:
```
You are translating lyrical Christian devotional prose. Translate the following English text to [TARGET_LANGUAGE].
Preserve the warm, wonder-filled tone. Do not paraphrase — translate faithfully.

[ENGLISH_TEXT]
```
