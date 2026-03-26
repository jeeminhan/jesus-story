-- Languages
create table if not exists languages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  native_name text not null,
  is_active boolean not null default true
);

-- Story arcs
create table if not exists arcs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  "order" int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Arc translations
create table if not exists arc_translations (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references arcs(id) on delete cascade,
  lang text not null references languages(code),
  title text not null,
  tagline text not null,
  unique (arc_id, lang)
);

-- Scenes
create table if not exists scenes (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references arcs(id) on delete cascade,
  slug text not null,
  is_start boolean not null default false,
  is_end boolean not null default false,
  created_at timestamptz not null default now(),
  unique (arc_id, slug)
);

-- Scene translations
create table if not exists scene_translations (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes(id) on delete cascade,
  lang text not null references languages(code),
  title text not null,
  body text not null,
  audio_url text,
  unique (scene_id, lang)
);

-- Choices
create table if not exists choices (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes(id) on delete cascade,
  next_scene_id uuid not null references scenes(id),
  "order" int not null default 0
);

-- Choice translations
create table if not exists choice_translations (
  id uuid primary key default gen_random_uuid(),
  choice_id uuid not null references choices(id) on delete cascade,
  lang text not null references languages(code),
  label text not null,
  unique (choice_id, lang)
);

-- Community connection submissions
create table if not exists community_connections (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid references arcs(id),
  lang text references languages(code),
  name text not null,
  email text not null,
  city text,
  created_at timestamptz not null default now()
);

create index if not exists arc_translations_lang_idx on arc_translations(lang);
create index if not exists scene_translations_lang_idx on scene_translations(lang);
create index if not exists scenes_arc_id_idx on scenes(arc_id);
create index if not exists choices_scene_id_idx on choices(scene_id);
