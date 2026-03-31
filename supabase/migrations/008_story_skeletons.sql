-- Story skeleton tables for AI-generated contextualized narratives.
-- Replaces the pre-written scene_translations model with beat-based generation.

CREATE TABLE stories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  emotional_key   text NOT NULL,
  gospel_source   text NOT NULL,
  title           text NOT NULL,
  tagline         text NOT NULL DEFAULT '',
  guardrails      text NOT NULL,
  tone_guidance   text NOT NULL DEFAULT '',
  is_published    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE story_beats (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id          uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  "order"           int NOT NULL,
  beat_summary      text NOT NULL,
  beat_detail       text NOT NULL DEFAULT '',
  illustration_url  text,
  illustration_alt  text,
  visual_context    text,
  is_start          boolean NOT NULL DEFAULT false,
  is_end            boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (story_id, "order")
);

CREATE INDEX story_beats_story_id_idx ON story_beats(story_id);

CREATE TABLE beat_choices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beat_id       uuid NOT NULL REFERENCES story_beats(id) ON DELETE CASCADE,
  next_beat_id  uuid NOT NULL REFERENCES story_beats(id),
  choice_hint   text NOT NULL,
  "order"       int NOT NULL DEFAULT 0
);

CREATE INDEX beat_choices_beat_id_idx ON beat_choices(beat_id);
