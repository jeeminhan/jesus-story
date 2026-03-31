import { StoryReader } from '@/components/StoryReader';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ input?: string; lang?: string; demo?: string; demoAnswers?: string; maxBeats?: string }>;

const STORY_SLUGS = [
  'when-he-wept',
  'the-night-he-answered',
  'the-king-who-came',
  'come-and-see',
  'the-storm-he-stilled',
];

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { input = '', lang = 'en', demo, demoAnswers, maxBeats } = await searchParams;

  const illustrationPath = STORY_SLUGS.includes(slug)
    ? `/story-illustrations/${slug}.svg`
    : null;

  const isDemo = demo === 'true';
  const parsedDemoAnswers = isDemo && demoAnswers
    ? (JSON.parse(decodeURIComponent(demoAnswers)) as string[])
    : undefined;
  const parsedMaxBeats = isDemo && maxBeats ? parseInt(maxBeats, 10) : undefined;

  return (
    <StoryReader
      storySlug={slug}
      userInput={input}
      lang={lang}
      storyIllustration={illustrationPath}
      demoAnswers={parsedDemoAnswers}
      maxBeats={parsedMaxBeats}
    />
  );
}
