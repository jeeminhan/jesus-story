import type { EmotionalKey } from './constants';

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
  emotional_key: EmotionalKey | null;
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
  light_world: boolean;
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

export interface SceneWithContent extends Scene {
  title: string;
  body: string;
  audio_url: string | null;
  choices: ChoiceWithLabel[];
}

export interface CommunityConnectionInsert {
  arc_id: string;
  lang: string;
  name: string;
  email: string;
  city?: string;
}

export interface WitnessVideo {
  id: string;
  arc_id: string | null;
  emotional_key: EmotionalKey;
  lang: string;
  video_url: string;
  poster_url: string | null;
  caption_url: string | null;
  speaker_name: string | null;
}
