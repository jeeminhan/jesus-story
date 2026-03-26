import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CardGenerator } from '@/components/CardGenerator';
import { isValidLang } from '@/lib/constants';
import { getActiveLanguages, getArcBySlug, getScenesForArc } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Share this story',
};

type SharePageParams = Promise<{ lang: string; arc: string }>;

export default async function SharePage({
  params,
}: {
  params: SharePageParams;
}) {
  const { lang, arc: arcSlug } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const arc = await getArcBySlug(arcSlug);
  if (!arc) {
    notFound();
  }

  const scenes = await getScenesForArc(arcSlug, lang);
  if (!scenes.length) {
    notFound();
  }

  const languages = await getActiveLanguages();

  return (
    <CardGenerator
      arcSlug={arcSlug}
      lang={lang}
      scenes={scenes}
      emotionalKey={arc.emotional_key}
      availableLangs={languages.map((language) => language.code)}
    />
  );
}
