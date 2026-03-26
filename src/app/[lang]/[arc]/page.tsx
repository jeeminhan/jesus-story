import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArtCard } from '@/components/ArtCard';
import { MirrorMomentGate } from '@/components/MirrorMomentGate';
import { isValidLang } from '@/lib/constants';
import { getArcBySlug, getScene, getStartScene, getWitnessVideo } from '@/lib/queries';

type StoryPageParams = Promise<{ lang: string; arc: string }>;
type StorySearchParams = Promise<{ scene?: string; from?: string; note?: string }>;

function humanizeStoryFigure(arcSlug: string) {
  return arcSlug
    .split('-')
    .filter(Boolean)
    .map((part, index) => {
      if (['the', 'a', 'an', 'who', 'at', 'to', 'of', 'and', 'in'].includes(part) && index !== 0) {
        return part;
      }

      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(' ');
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: StoryPageParams;
  searchParams: StorySearchParams;
}): Promise<Metadata> {
  const { lang, arc: arcSlug } = await params;
  const { from, note } = await searchParams;
  const scene = await getStartScene(arcSlug, lang);
  const quote = scene?.body?.slice(0, 120) ?? 'A story for you';
  const isCarrier = from === 'carrier';
  const noteQuery = isCarrier && note?.trim() ? `&note=${encodeURIComponent(note.trim().slice(0, 200))}` : '';
  const carrierQuery = isCarrier ? '&carrier=1' : '';
  const encodedArcSlug = encodeURIComponent(arcSlug);
  const encodedLang = encodeURIComponent(lang);
  const baseImageUrl = `/api/og?arc=${encodedArcSlug}&lang=${encodedLang}${carrierQuery}${noteQuery}`;
  const squareImageUrl = `${baseImageUrl}&square=1`;

  return {
    title: 'A story for you',
    description: quote,
    openGraph: {
      title: 'A story for you',
      description: quote,
      images: [
        { url: baseImageUrl, width: 1200, height: 630 },
        { url: squareImageUrl, width: 1080, height: 1080 },
      ],
    },
  };
}

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: StoryPageParams;
  searchParams: StorySearchParams;
}) {
  const { lang, arc: arcSlug } = await params;
  const { scene: sceneId } = await searchParams;

  if (!isValidLang(lang)) {
    notFound();
  }

  const arc = await getArcBySlug(arcSlug);
  if (!arc) {
    notFound();
  }

  if (!sceneId) {
    const startScene = await getStartScene(arcSlug, lang);
    if (!startScene) {
      notFound();
    }

    return (
      <ArtCard
        quote={startScene.body.slice(0, 120)}
        arcSlug={arcSlug}
        lang={lang}
        emotionalKey={arc.emotional_key}
        startSceneId={startScene.id}
        sceneSlug={startScene.slug}
        lightWorld={startScene.light_world}
      />
    );
  }

  const scene = await getScene(sceneId, lang);
  if (!scene) {
    notFound();
  }
  const witnessVideo = scene.is_end ? await getWitnessVideo(arc.emotional_key ?? 'searching', lang) : null;

  return (
    <MirrorMomentGate
      scene={scene}
      lang={lang}
      arcSlug={arcSlug}
      emotionalKey={arc.emotional_key ?? 'searching'}
      storyFigure={humanizeStoryFigure(arc.slug)}
      hasWitnessVideo={witnessVideo !== null}
      witnessVideoId={witnessVideo?.id ?? null}
      hasSceneParam={Boolean(sceneId)}
    />
  );
}
