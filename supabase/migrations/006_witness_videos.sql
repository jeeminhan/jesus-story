create table if not exists witness_videos (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid references arcs(id),
  emotional_key text not null,
  lang text not null,
  video_url text not null,
  poster_url text,
  caption_url text,
  speaker_name text,
  created_at timestamptz not null default now()
);

create index if not exists witness_videos_emotional_key_lang_idx on witness_videos(emotional_key, lang);
