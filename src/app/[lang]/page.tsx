import { notFound } from 'next/navigation';
import {
  EmotionalEntryScreen,
  EMOTIONAL_ENTRY_FALLBACK_SLUG,
} from '@/components/EmotionalEntryScreen';
import { EMOTIONAL_ENTRY_KEYS, type EmotionalEntryKey, isEmotionalKey, isValidLang } from '@/lib/constants';
import { getPublishedArcs, getStartScene } from '@/lib/queries';
import type { ArcWithTranslation } from '@/lib/types';

async function mapArcsToDoorways(arcs: ArcWithTranslation[], lang: string) {
  const explicitByKey = new Map<EmotionalEntryKey, ArcWithTranslation>();
  const positionalByKey = new Map<EmotionalEntryKey, ArcWithTranslation>();

  for (const arc of arcs) {
    if (!isEmotionalKey(arc.emotional_key)) {
      continue;
    }
    if (!explicitByKey.has(arc.emotional_key)) {
      explicitByKey.set(arc.emotional_key, arc);
    }
  }

  arcs.forEach((arc, index) => {
    if (arc.emotional_key) {
      return;
    }
    const positionalKey = EMOTIONAL_ENTRY_KEYS[index];
    if (!positionalKey || positionalByKey.has(positionalKey)) {
      return;
    }
    positionalByKey.set(positionalKey, arc);
  });

  const isMockDataMode = arcs.length === 1 && arcs[0]?.slug === EMOTIONAL_ENTRY_FALLBACK_SLUG;
  if (isMockDataMode) {
    const fallbackSceneId = (await getStartScene(EMOTIONAL_ENTRY_FALLBACK_SLUG, lang))?.id ?? null;

    return EMOTIONAL_ENTRY_KEYS.map((key) => ({
      slug: EMOTIONAL_ENTRY_FALLBACK_SLUG,
      emotional_key: key,
      title: '',
      tagline: '',
      startSceneId: fallbackSceneId,
    }));
  }

  const doorwayArcs = await Promise.all(
    EMOTIONAL_ENTRY_KEYS.map(async (key) => {
      const arc = explicitByKey.get(key) ?? positionalByKey.get(key);
      const startSceneId = arc ? (await getStartScene(arc.slug, lang))?.id ?? null : null;

      return {
        slug: arc?.slug ?? EMOTIONAL_ENTRY_FALLBACK_SLUG,
        emotional_key: key,
        title: arc?.title ?? '',
        tagline: arc?.tagline ?? '',
        startSceneId,
      };
    }),
  );

  return doorwayArcs.map((doorwayArc) => {
    if (doorwayArc.startSceneId) {
      return doorwayArc;
    }

    return {
      ...doorwayArc,
      startSceneId: null,
    };
  });
}

export default async function ArcSelectionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) {
    notFound();
  }

  const arcs = await getPublishedArcs(lang);
  const doorwayArcs = await mapArcsToDoorways(arcs, lang);

  return <EmotionalEntryScreen arcs={doorwayArcs} lang={lang} />;
}
