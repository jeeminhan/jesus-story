import { createServerSupabaseClient } from './supabase';
import {
  getMockArcBySlug,
  getMockSceneById,
  getMockScenesForArc,
  getMockStartScene,
  getMockPublishedArcs,
  mockLanguages,
  mockWitnessVideos,
} from './mock-data';
import type { EmotionalKey } from './constants';
import type {
  ArcWithTranslation,
  ChoiceWithLabel,
  CommunityConnectionInsert,
  Language,
  SceneWithContent,
  WitnessVideo,
} from './types';

type SceneRow = {
  id: string;
  arc_id: string;
  slug: string;
  is_start: boolean;
  is_end: boolean;
  light_world: boolean;
  scene_translations: Array<{
    title: string;
    body: string;
    audio_url: string | null;
  }>;
};

type ChoiceRow = {
  id: string;
  scene_id: string;
  next_scene_id: string;
  order: number;
  choice_translations: Array<{ label: string }>;
};

type WitnessVideoRow = {
  id: string;
  arc_id: string | null;
  emotional_key: EmotionalKey;
  lang: string;
  video_url: string;
  poster_url: string | null;
  caption_url: string | null;
  speaker_name: string | null;
};

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getActiveLanguages(): Promise<Language[]> {
  if (!hasSupabaseConfig()) {
    return mockLanguages.filter((lang) => lang.code === 'en' || lang.code === 'ko');
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('languages').select('*').eq('is_active', true).order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getPublishedArcs(lang: string): Promise<ArcWithTranslation[]> {
  if (!hasSupabaseConfig()) {
    return getMockPublishedArcs();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('arcs')
    .select(
      `
      id, slug, order, is_published, emotional_key,
      arc_translations!inner(title, tagline)
    `,
    )
    .eq('is_published', true)
    .eq('arc_translations.lang', lang)
    .order('order');

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    order: row.order,
    is_published: row.is_published,
    emotional_key: row.emotional_key ?? null,
    title: row.arc_translations[0]?.title ?? '',
    tagline: row.arc_translations[0]?.tagline ?? '',
  }));
}

export async function getArcBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return getMockArcBySlug(slug);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('arcs').select('id, slug, emotional_key').eq('slug', slug).single();

  if (error) {
    return null;
  }

  return { id: data.id, slug: data.slug, emotional_key: data.emotional_key ?? null };
}

export async function getStartScene(arcSlug: string, lang: string): Promise<SceneWithContent | null> {
  if (!hasSupabaseConfig()) {
    return getMockStartScene(arcSlug);
  }

  const supabase = await createServerSupabaseClient();
  const { data: arc, error: arcError } = await supabase.from('arcs').select('id').eq('slug', arcSlug).single();

  if (arcError || !arc) {
    return null;
  }

  const { data, error } = await supabase
    .from('scenes')
    .select(
      `
      id, arc_id, slug, is_start, is_end, light_world,
      scene_translations!inner(title, body, audio_url)
    `,
    )
    .eq('arc_id', arc.id)
    .eq('is_start', true)
    .eq('scene_translations.lang', lang)
    .single();

  if (error || !data) {
    return null;
  }

  return withChoices(data as SceneRow, lang);
}

export async function getScenesForArc(arcSlug: string, lang: string): Promise<SceneWithContent[]> {
  if (!hasSupabaseConfig()) {
    return getMockScenesForArc(arcSlug);
  }

  const supabase = await createServerSupabaseClient();
  const { data: arc, error: arcError } = await supabase.from('arcs').select('id').eq('slug', arcSlug).single();

  if (arcError || !arc) {
    return [];
  }

  const { data: scenesData, error: scenesError } = await supabase
    .from('scenes')
    .select(
      `
      id, arc_id, slug, is_start, is_end, light_world,
      scene_translations!inner(title, body, audio_url)
    `,
    )
    .eq('arc_id', arc.id)
    .eq('scene_translations.lang', lang)
    .order('is_start', { ascending: false })
    .order('created_at', { ascending: true });

  if (scenesError || !scenesData) {
    return [];
  }

  const sceneRows = scenesData as SceneRow[];
  if (!sceneRows.length) {
    return [];
  }

  const sceneIds = sceneRows.map((scene) => scene.id);
  const { data: choicesData, error: choicesError } = await supabase
    .from('choices')
    .select('id, scene_id, next_scene_id, order, choice_translations!inner(label)')
    .in('scene_id', sceneIds)
    .eq('choice_translations.lang', lang)
    .order('order');

  if (choicesError) {
    throw choicesError;
  }

  const choicesBySceneId = new Map<string, ChoiceWithLabel[]>();
  const rows = (choicesData as ChoiceRow[] | null) ?? [];

  for (const choice of rows) {
    const mappedChoice: ChoiceWithLabel = {
      id: choice.id,
      scene_id: choice.scene_id,
      next_scene_id: choice.next_scene_id,
      order: choice.order,
      label: choice.choice_translations[0]?.label ?? '',
    };

    const existing = choicesBySceneId.get(choice.scene_id) ?? [];
    existing.push(mappedChoice);
    choicesBySceneId.set(choice.scene_id, existing);
  }

  return sceneRows.map((scene) => ({
    id: scene.id,
    arc_id: scene.arc_id,
    slug: scene.slug,
    is_start: scene.is_start,
    is_end: scene.is_end,
    light_world: scene.light_world ?? false,
    title: scene.scene_translations[0]?.title ?? '',
    body: scene.scene_translations[0]?.body ?? '',
    audio_url: scene.scene_translations[0]?.audio_url ?? null,
    choices: choicesBySceneId.get(scene.id) ?? [],
  }));
}

export async function getScene(sceneId: string, lang: string): Promise<SceneWithContent | null> {
  if (!hasSupabaseConfig()) {
    return getMockSceneById(sceneId);
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('scenes')
    .select(
      `
      id, arc_id, slug, is_start, is_end, light_world,
      scene_translations!inner(title, body, audio_url)
    `,
    )
    .eq('id', sceneId)
    .eq('scene_translations.lang', lang)
    .single();

  if (error || !data) {
    return null;
  }

  return withChoices(data as SceneRow, lang);
}

export async function getWitnessVideo(emotionalKey: EmotionalKey, lang: string): Promise<WitnessVideo | null> {
  if (!hasSupabaseConfig()) {
    return (
      mockWitnessVideos.find((video) => video.emotional_key === emotionalKey && video.lang === lang) ??
      mockWitnessVideos[0] ??
      null
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: exactMatch, error: exactError } = await supabase
    .from('witness_videos')
    .select('id, arc_id, emotional_key, lang, video_url, poster_url, caption_url, speaker_name')
    .eq('emotional_key', emotionalKey)
    .eq('lang', lang)
    .limit(1)
    .maybeSingle();

  if (exactError) {
    return null;
  }

  if (exactMatch) {
    return exactMatch as WitnessVideoRow;
  }

  if (lang === 'en') {
    return null;
  }

  const { data: fallbackMatch, error: fallbackError } = await supabase
    .from('witness_videos')
    .select('id, arc_id, emotional_key, lang, video_url, poster_url, caption_url, speaker_name')
    .eq('emotional_key', emotionalKey)
    .eq('lang', 'en')
    .limit(1)
    .maybeSingle();

  if (fallbackError || !fallbackMatch) {
    return null;
  }

  return fallbackMatch as WitnessVideoRow;
}

async function withChoices(scene: SceneRow, lang: string): Promise<SceneWithContent> {
  const supabase = await createServerSupabaseClient();

  const { data: choicesData, error: choicesError } = await supabase
    .from('choices')
    .select('id, scene_id, next_scene_id, order, choice_translations!inner(label)')
    .eq('scene_id', scene.id)
    .eq('choice_translations.lang', lang)
    .order('order');

  if (choicesError) {
    throw choicesError;
  }

  const choices: ChoiceWithLabel[] = ((choicesData as ChoiceRow[] | null) ?? []).map((choice) => ({
    id: choice.id,
    scene_id: choice.scene_id,
    next_scene_id: choice.next_scene_id,
    order: choice.order,
    label: choice.choice_translations[0]?.label ?? '',
  }));

  return {
    id: scene.id,
    arc_id: scene.arc_id,
    slug: scene.slug,
    is_start: scene.is_start,
    is_end: scene.is_end,
    light_world: scene.light_world ?? false,
    title: scene.scene_translations[0]?.title ?? '',
    body: scene.scene_translations[0]?.body ?? '',
    audio_url: scene.scene_translations[0]?.audio_url ?? null,
    choices,
  };
}

export async function insertCommunityConnection(data: CommunityConnectionInsert) {
  if (!hasSupabaseConfig()) {
    console.log('Mock submit community connection', data);
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('community_connections').insert(data);

  if (error) {
    throw error;
  }
}

type ConnectMessageByToken = {
  id: string;
  message: string;
  coordinator_reply: string | null;
  lang: string;
  emotional_key: EmotionalKey | null;
};

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getConnectMessageByToken(token: string): Promise<ConnectMessageByToken | null> {
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    return null;
  }

  if (!hasSupabaseConfig()) {
    if (normalizedToken !== 'mock-reply-token') {
      return null;
    }

    return {
      id: 'msg-1',
      message: 'Mock message',
      coordinator_reply: null,
      lang: 'en',
      emotional_key: 'searching',
    };
  }

  if (!isUuidLike(normalizedToken)) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('connect_messages')
    .select('id, message, coordinator_reply, lang, emotional_key')
    .eq('reply_token', normalizedToken)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    message: data.message ?? '',
    coordinator_reply: data.coordinator_reply ?? null,
    lang: data.lang ?? 'en',
    emotional_key: data.emotional_key ?? null,
  };
}
