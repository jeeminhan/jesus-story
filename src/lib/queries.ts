import { createServerSupabaseClient } from './supabase';
import {
  getMockArcBySlug,
  getMockCoordinatorMessages,
  getMockSceneById,
  getMockScenesForArc,
  getMockStartScene,
  getMockPublishedArcs,
  mockLanguages,
  mockCoordinatorMessages,
  mockWitnessVideos,
} from './mock-data';
import type { EmotionalKey } from './constants';
import type {
  ArcWithTranslation,
  ChoiceWithLabel,
  CommunityConnectionInsert,
  CoordinatorMessageSummary,
  Language,
  SceneWithContent,
  WitnessVideo,
} from './types';

export interface SceneProgress {
  index: number;
  total: number;
}

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

function deriveSceneProgress(scenes: SceneWithContent[], sceneId: string): SceneProgress | null {
  const startScene = scenes.find((scene) => scene.is_start);
  if (!startScene) {
    return null;
  }

  const sceneMap = new Map(scenes.map((scene) => [scene.id, scene]));

  function findPath(currentSceneId: string, trail: string[]): string[] | null {
    const currentScene = sceneMap.get(currentSceneId);
    if (!currentScene) {
      return null;
    }

    const nextTrail = [...trail, currentSceneId];
    if (currentSceneId === sceneId) {
      return nextTrail;
    }

    for (const choice of currentScene.choices) {
      if (trail.includes(choice.next_scene_id)) {
        continue;
      }

      const resolvedPath = findPath(choice.next_scene_id, nextTrail);
      if (resolvedPath) {
        return resolvedPath;
      }
    }

    return null;
  }

  const memo = new Map<string, number>();

  function longestRemainingPath(currentSceneId: string): number {
    if (memo.has(currentSceneId)) {
      return memo.get(currentSceneId) ?? 1;
    }

    const currentScene = sceneMap.get(currentSceneId);
    if (!currentScene) {
      return 1;
    }

    if (currentScene.is_end || currentScene.choices.length === 0) {
      memo.set(currentSceneId, 1);
      return 1;
    }

    const resolvedLength =
      1 + Math.max(...currentScene.choices.map((choice) => longestRemainingPath(choice.next_scene_id)));
    memo.set(currentSceneId, resolvedLength);
    return resolvedLength;
  }

  const pathToCurrent = findPath(startScene.id, []);
  if (!pathToCurrent) {
    return null;
  }

  const index = Math.max(0, pathToCurrent.length - 1);
  const total = Math.max(index + 1, index + longestRemainingPath(sceneId));
  return { index, total };
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

export async function getSceneProgress(arcSlug: string, sceneId: string, lang: string): Promise<SceneProgress | null> {
  const scenes = await getScenesForArc(arcSlug, lang);
  if (!scenes.length) {
    return null;
  }

  return deriveSceneProgress(scenes, sceneId);
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
  arc_slug: string | null;
  arc_title: string | null;
  sender_name: string | null;
  path_summary: string | null;
  created_at: string;
};

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function readArcSlug(value: unknown) {
  if (Array.isArray(value)) {
    return typeof value[0]?.slug === 'string' ? value[0].slug : null;
  }

  if (value && typeof value === 'object' && 'slug' in value && typeof (value as { slug?: unknown }).slug === 'string') {
    return (value as { slug: string }).slug;
  }

  return null;
}

export async function getConnectMessageByToken(token: string): Promise<ConnectMessageByToken | null> {
  const normalizedToken = token.trim();
  if (!normalizedToken) {
    return null;
  }

  if (!hasSupabaseConfig()) {
    const message = mockCoordinatorMessages.find((entry) => entry.reply_token === normalizedToken);
    if (!message) {
      return null;
    }

    return {
      id: message.id,
      message: message.message,
      coordinator_reply: message.coordinator_reply,
      lang: message.lang,
      emotional_key: message.emotional_key,
      arc_slug: message.arc_slug,
      arc_title: message.arc_title,
      sender_name: message.sender_name,
      path_summary: message.path_summary,
      created_at: message.created_at,
    };
  }

  if (!isUuidLike(normalizedToken)) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('connect_messages')
    .select('id, message, coordinator_reply, lang, emotional_key, created_at, arcs(slug)')
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
    arc_slug: readArcSlug(data.arcs),
    arc_title: null,
    sender_name: null,
    path_summary: null,
    created_at: data.created_at ?? new Date(0).toISOString(),
  };
}

export async function getCoordinatorMessages(): Promise<CoordinatorMessageSummary[]> {
  if (!hasSupabaseConfig()) {
    return getMockCoordinatorMessages();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('connect_messages')
    .select('id, reply_token, lang, emotional_key, message, coordinator_reply, created_at, arcs(slug)')
    .order('created_at', { ascending: false })
    .limit(24);

  if (error) {
    throw error;
  }

  return ((data as Array<any> | null) ?? []).map((row) => ({
    id: row.id,
    reply_token: row.reply_token,
    lang: row.lang ?? 'en',
    emotional_key: row.emotional_key ?? null,
    message: row.message ?? '',
    coordinator_reply: row.coordinator_reply ?? null,
    created_at: row.created_at ?? new Date(0).toISOString(),
    arc_slug: readArcSlug(row.arcs),
    arc_title: null,
    sender_name: null,
    path_summary: null,
  }));
}
