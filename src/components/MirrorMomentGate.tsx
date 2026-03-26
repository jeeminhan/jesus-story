'use client';

import { useRouter } from 'next/navigation';
import type { EmotionalKey } from '@/lib/constants';
import type { SceneWithContent } from '@/lib/types';
import { MirrorMoment } from './MirrorMoment';
import { SceneView } from './SceneView';

interface MirrorMomentGateProps {
  scene: SceneWithContent;
  lang: string;
  arcSlug: string;
  emotionalKey: EmotionalKey;
  storyFigure?: string;
  hasWitnessVideo?: boolean;
  witnessVideoId?: string | null;
  hasSceneParam?: boolean;
  sceneIndex?: number;
  totalScenes?: number;
}

export function MirrorMomentGate({
  scene,
  lang,
  arcSlug,
  emotionalKey,
  storyFigure,
  hasWitnessVideo = false,
  witnessVideoId = null,
  hasSceneParam = true,
  sceneIndex = 0,
  totalScenes = 1,
}: MirrorMomentGateProps) {
  const router = useRouter();
  const shouldShowMirrorMoment = hasSceneParam && scene.is_end;
  const canShowWitness = hasWitnessVideo && Boolean(witnessVideoId);

  if (shouldShowMirrorMoment) {
    return (
      <MirrorMoment
        emotionalKey={emotionalKey}
        storyFigure={storyFigure}
        lang={lang}
        arcSlug={arcSlug}
        hasWitnessVideo={canShowWitness}
        onTellMeMore={() => router.push(canShowWitness ? `/${lang}/${arcSlug}/witness` : `/${lang}/${arcSlug}/connect`)}
        onLeaveMessage={() => router.push(`/${lang}/${arcSlug}/connect`)}
        onSitWithThis={() => router.push(`/${lang}`)}
      />
    );
  }

  return (
    <SceneView
      scene={scene}
      lang={lang}
      arcSlug={arcSlug}
      sceneIndex={sceneIndex}
      totalScenes={totalScenes}
      emotionalKey={emotionalKey}
    />
  );
}
