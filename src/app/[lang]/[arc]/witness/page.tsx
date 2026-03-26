import { notFound, redirect } from 'next/navigation';
import { WitnessVideoPlayer } from '@/components/WitnessVideoPlayer';
import { isValidLang } from '@/lib/constants';
import { getArcBySlug, getWitnessVideo } from '@/lib/queries';

export default async function WitnessPage({
  params,
}: {
  params: Promise<{ lang: string; arc: string }>;
}) {
  const { lang, arc: arcSlug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const arc = await getArcBySlug(arcSlug);
  if (!arc) {
    notFound();
  }

  const witnessVideo = await getWitnessVideo(arc.emotional_key ?? 'searching', lang);
  if (!witnessVideo) {
    redirect(`/${lang}/${arcSlug}/connect`);
  }

  return <WitnessVideoPlayer video={witnessVideo} lang={lang} arcSlug={arcSlug} />;
}
