import Link from 'next/link';
import { headers } from 'next/headers';
import { getActiveLanguages } from '@/lib/queries';
import { StoryIllustration } from '@/components/StoryIllustration';
import { DesignMockups } from '@/components/DesignMockups';

const pillars = [
  {
    title: 'Starts with emotion',
    body: 'The entry question is human, not religious: "What are you carrying right now?" Each answer routes into a different story from the life of Jesus.',
    icon: '01',
  },
  {
    title: 'Feels like art',
    body: 'Painterly scenes, emotional color shifts, ambient pacing, and text that arrives like it\'s being spoken — not a wall of content.',
    icon: '02',
  },
  {
    title: 'Continues with people',
    body: 'The story doesn\'t end with a screen. It moves into reflection, witness, and connection with real people who walked similar paths.',
    icon: '03',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'You share what you\'re carrying',
    body: 'Any language. Any length. Even one word is enough. The app detects your language and emotional state.',
  },
  {
    step: '2',
    title: 'A bridge appears',
    body: 'One sentence, streamed word by word, that echoes your own words and invites you into a story about someone who carried something similar.',
  },
  {
    step: '3',
    title: 'The story unfolds in real time',
    body: 'Each scene is generated live — the same Gospel events, told in your language, shaped by what you\'re carrying. The structure is fixed. The telling is yours.',
  },
  {
    step: '4',
    title: 'You pause and reflect',
    body: 'Between scenes, the story asks you a question. Your answer shapes the next scene — deepening the connection between your life and the ancient story.',
  },
  {
    step: '5',
    title: 'The story pauses, but doesn\'t end',
    body: 'At the end, you\'re invited to share a card with someone, connect with a real person, or carry the story forward in your own way.',
  },
];

const guardrails = [
  {
    title: 'The AI is the host, not the author',
    body: 'Every story is anchored in a specific Gospel passage. The AI generates the telling — the prose, the language, the emotional register — but it cannot skip a beat, invent theology, or stray from the source material.',
  },
  {
    title: 'No church vocabulary',
    body: 'Words like "saved," "sin," "repent," and "born again" are banned across all stories. The experience is designed for people with no church background.',
  },
  {
    title: 'Scripture fidelity',
    body: 'The AI may describe scenes evocatively — setting, atmosphere, sensory detail — but it must not invent dialogue, characters, or events. Jesus speaks only what scripture records.',
  },
  {
    title: 'Any language, no translation',
    body: 'The AI generates directly in whatever language you write in. One English skeleton serves every language — Korean, Japanese, Spanish, French, and more.',
  },
];

const storyArcs = [
  { title: 'When He Wept', emotion: 'Grief', passage: 'John 11', slug: 'when-he-wept' },
  { title: 'The Night He Answered', emotion: 'Doubt', passage: 'John 20', slug: 'the-night-he-answered' },
  { title: 'The King Who Came', emotion: 'Searching', passage: 'Luke 2 / Matt 2', slug: 'the-king-who-came' },
  { title: 'Come and See', emotion: 'Curiosity', passage: 'John 1', slug: 'come-and-see' },
  { title: 'The Storm He Stilled', emotion: 'Anger', passage: 'Mark 4', slug: 'the-storm-he-stilled' },
];

function resolvePreferredLang(acceptLanguage: string, availableLangs: string[]) {
  const candidates = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean)
    .flatMap((lang) => {
      const baseLang = lang.split('-')[0];
      return baseLang && baseLang !== lang ? [lang, baseLang] : [lang];
    });

  for (const candidate of candidates) {
    if (availableLangs.includes(candidate)) {
      return candidate;
    }
  }

  if (availableLangs.includes('en')) {
    return 'en';
  }

  return availableLangs[0] ?? 'en';
}

export default async function HomePage() {
  const languageHeader = (await headers()).get('accept-language') ?? '';
  const languages = await getActiveLanguages();
  const activeLangs = languages.map((language) => language.code);
  const preferredLang = resolvePreferredLang(languageHeader, activeLangs);

  return (
    <main className="root-entry-shell min-h-screen bg-[#0b0b0d] text-white">
      {/* ── Hero ── */}
      <section className="relative px-6 pb-20 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/45"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Gospel Story
          </p>
          <h1
            className="mt-5 max-w-[720px] text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            An AI-powered story experience that meets people where they actually are.
          </h1>
          <p
            className="mt-6 max-w-[600px] text-lg leading-8 text-white/65"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Someone shares what they&apos;re carrying — grief, doubt, anger, curiosity, or searching — and the story of Jesus is retold through the lens of their experience. Each scene is generated in real time, in their language, shaped by their words.
          </p>

          {/* Illustration strip */}
          <div className="mt-12 flex gap-3 overflow-hidden">
            {storyArcs.map((arc) => (
              <div
                key={arc.slug}
                className="shrink-0 overflow-hidden rounded-2xl"
                style={{ width: '140px', height: '186px' }}
              >
                <StoryIllustration
                  slug={arc.slug}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(196,166,106,0.15)]"
              style={{
                backgroundColor: 'rgba(196,166,106,0.15)',
                borderColor: 'rgba(196,166,106,0.25)',
                border: '1px solid rgba(196,166,106,0.25)',
                color: '#e8d5b0',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Watch the demo
            </Link>
            <Link
              href="/new"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
              style={{
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Try it yourself
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── What makes this different ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            What makes this different
          </p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            It doesn&apos;t feel like content at someone. It feels like a story that knows you.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col gap-3">
                <span
                  className="text-[0.7rem] font-medium tracking-[0.15em] text-white/30"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {pillar.icon}
                </span>
                <h3
                  className="text-lg text-white/90"
                  style={{ fontFamily: 'var(--font-narrative)' }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="text-sm leading-7 text-white/50"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── Design mockups ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            What it looks like
          </p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Every screen is a scene, not a page.
          </h2>
          <p
            className="mt-4 max-w-[540px] text-sm leading-7 text-white/45"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Watercolor-style illustration, emotional color shifts per path, text that arrives like spoken word, and no visible chrome. Scroll to see the key screens.
          </p>
          <div className="mt-12">
            <DesignMockups />
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── How it works ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            How it works
          </p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Five moments, one story.
          </h2>

          <div className="mt-12 flex flex-col gap-0">
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                className="relative flex gap-6 pb-10"
              >
                {/* Vertical line */}
                {i < howItWorks.length - 1 && (
                  <div
                    className="absolute left-[15px] top-[32px] h-[calc(100%-20px)] w-px"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  />
                )}
                {/* Step number */}
                <div
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-xs font-medium text-white/50"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {item.step}
                </div>
                {/* Content */}
                <div className="pt-0.5">
                  <h3
                    className="text-base font-medium text-white/85"
                    style={{ fontFamily: 'var(--font-narrative)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 max-w-[480px] text-sm leading-7 text-white/45"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── Story arcs ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Five arcs
          </p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Each emotion has a story waiting.
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {storyArcs.map((arc) => (
              <div
                key={arc.slug}
                className="overflow-hidden rounded-2xl border"
                style={{
                  borderColor: 'rgba(255,255,255,0.07)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="overflow-hidden" style={{ height: '200px' }}>
                  <StoryIllustration
                    slug={arc.slug}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                </div>
                <div className="px-5 py-4">
                  <p
                    className="text-[0.65rem] uppercase tracking-[0.2em] text-white/30"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {arc.emotion}
                  </p>
                  <h3
                    className="mt-2 text-base text-white/80"
                    style={{ fontFamily: 'var(--font-narrative)' }}
                  >
                    {arc.title}
                  </h3>
                  <p
                    className="mt-1 text-xs text-white/35"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {arc.passage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── Guardrails ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Under the hood
          </p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            You can contextualize the telling, but you cannot change the events.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {guardrails.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <h3
                  className="text-base text-white/85"
                  style={{ fontFamily: 'var(--font-narrative)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-7 text-white/45"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-[900px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── Footer CTA ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 text-center">
          <h2
            className="max-w-[500px] text-[clamp(1.5rem,4vw,2.2rem)] font-medium leading-[1.15] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            See it for yourself.
          </h2>
          <p
            className="max-w-[420px] text-base leading-7 text-white/50"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            The demo walks through the grief arc with a sample input. Or try it with your own words.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full px-8 text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(196,166,106,0.15)]"
              style={{
                backgroundColor: 'rgba(196,166,106,0.15)',
                border: '1px solid rgba(196,166,106,0.25)',
                color: '#e8d5b0',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Watch the demo
            </Link>
            <Link
              href="/new"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
              style={{
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Try it yourself
            </Link>
          </div>

          {/* Secondary links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={`/${preferredLang}`}
              className="text-sm text-white/30 transition-colors hover:text-white/60"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Live app ({preferredLang.toUpperCase()})
            </Link>
            <a
              href="/ux-design-directions.html"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Design mockup
            </a>
            <Link
              href="/overview"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Technical overview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
