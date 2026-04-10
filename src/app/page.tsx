import Link from 'next/link';
import { HeroScene, EntryPhone, LanguageStrip, CultureStrip, ArcStrip } from '@/components/DesignMockups';
import './landing.css';

const LIVE_APP_URL = '/new';

export default function HomePage() {
  return (
    <main className="root-entry-shell landing-root min-h-screen overflow-x-hidden text-white">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-20 pb-24 sm:px-10 lg:px-16">
        <div
          className="pointer-events-none absolute -top-[200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, rgba(196,166,106,0.04) 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1100px]">
          <div className="flex items-start gap-16">
            {/* Text */}
            <div className="max-w-[540px] flex-1">
              <p className="landing-label">Gospel Story</p>
              <h1
                className="mt-5 text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.06] tracking-tight text-white"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                One story.
                <br />
                Every language.
                <br />
                <span className="text-white/40">Shaped by what you carry.</span>
              </h1>
              <p
                className="mt-7 max-w-[460px] text-[1.02rem] leading-[1.8] text-white/50"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                An AI-powered experience that retells true stories from the life of Jesus in your
                language, your cultural context, shaped by whatever you&apos;re going through. No
                translation tables. No templates. One skeleton, infinite tellings.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={LIVE_APP_URL}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-[0.9rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'rgba(196,166,106,0.15)',
                    border: '1px solid rgba(196,166,106,0.25)',
                    color: '#e8d5b0',
                    fontFamily: 'var(--font-narrative)',
                  }}
                >
                  Try it yourself
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-7 text-[0.9rem] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
                  style={{
                    borderColor: 'rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'var(--font-narrative)',
                  }}
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Hero phones */}
            <div className="hero-phones-col flex shrink-0 items-start justify-center gap-4">
              <EntryPhone scale={0.8} />
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── It starts with you ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">It starts with you</p>
          <h2
            className="mt-4 max-w-[500px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            You type what you&apos;re going through. The AI listens.
          </h2>
          <p
            className="mt-5 max-w-[540px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            No menu. No categories. Just one question:{' '}
            <em>&ldquo;What are you carrying right now?&rdquo;</em> Write in any language, any
            length. The AI detects your language, reads your emotional state, and selects a story arc
            that meets you where you are.
          </p>
          <p
            className="mt-4 max-w-[540px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Then a bridge sentence appears — one line, streamed word by word, that echoes your own
            words and invites you into a story about someone who carried something similar, two
            thousand years ago.
          </p>

          {/* Simulated entry flow */}
          <div className="mt-12 flex flex-wrap gap-6">
            {/* Step 1: Input */}
            <div className="min-w-[280px] flex-1">
              <p className="mock-label mb-3">Step 1 — User input</p>
              <div className="rounded-2xl border border-white/[0.08] bg-[#131318] p-6">
                <p className="mock-heading text-base">What are you carrying right now?</p>
                <div className="mock-textarea mt-4">
                  친구를 잃었어요. 아직도 믿기지 않아요.
                </div>
                <p className="mt-3 text-[0.65rem]" style={{ fontFamily: 'var(--font-ui)', color: 'rgba(255,255,255,0.3)' }}>
                  <span style={{ color: '#2a7a6a' }}>Detected:</span> Korean &middot;{' '}
                  <span style={{ color: '#8b2d42' }}>Emotion:</span> grief &middot;{' '}
                  <span style={{ color: '#c4a66a' }}>Arc:</span> When He Wept
                </p>
              </div>
            </div>
            {/* Step 2: Bridge */}
            <div className="min-w-[280px] flex-1">
              <p className="mock-label mb-3">Step 2 — Bridge sentence (streamed)</p>
              <div className="rounded-2xl border border-white/[0.08] bg-[#131318] p-6">
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                  &ldquo;친구를 잃었어요. 아직도 믿기지 않아요.&rdquo;
                </p>
                <p
                  className="mt-4 text-[1.05rem] leading-[1.5] text-white/85"
                  style={{ fontFamily: 'var(--font-narrative)' }}
                >
                  아직도 믿기지 않는 그 마음, 이천 년 전에도 똑같이 느꼈던 사람들이 있었습니다. 그들의
                  이야기를 들려드릴게요.
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 bg-white/50 align-middle" />
                </p>
                <div className="mock-btn mt-5">이야기 속으로 &rarr;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Language contextualization ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">Language</p>
          <h2
            className="mt-4 max-w-[640px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            The same scene. Four languages. No translation.
          </h2>
          <p
            className="mt-5 max-w-[540px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Each phone shows the same moment from John 11 — generated directly in English, Korean,
            Japanese, and Spanish. The AI doesn&apos;t translate. It <em>retells</em>, using the
            natural rhythms, sentence structure, and emotional register of each language.
          </p>
          <div className="mt-14">
            <LanguageStrip />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Cultural contextualization ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">Culture</p>
          <h2
            className="mt-4 max-w-[640px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Same grief. Different worlds.
          </h2>
          <p
            className="mt-5 max-w-[560px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Language is only the surface. The AI also contextualizes for <em>culture</em> — how
            grief is expressed, the social expectations around loss, the emotional textures that make
            a story feel native rather than imported.
          </p>
          <div className="mt-14">
            <CultureStrip />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Five arcs ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">Five emotional paths</p>
          <h2
            className="mt-4 max-w-[640px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            What you&apos;re carrying determines which story you enter.
          </h2>
          <p
            className="mt-5 max-w-[540px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Each emotion routes into a different passage from the Gospels. Each arc has its own color
            world, its own guardrails, its own opening line.
          </p>

          <div className="arc-grid mt-14">
            {ARCS.map((arc) => (
              <div key={arc.emotion} className={`arc-card arc-${arc.emotion}`}>
                <p className="arc-card-emotion">{arc.label}</p>
                <p className="arc-card-title">{arc.title}</p>
                <p className="arc-card-source">{arc.source}</p>
                <p className="arc-card-tagline">{arc.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">How it works</p>
          <h2
            className="mt-4 max-w-[600px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            One skeleton. Infinite tellings.
          </h2>
          <p
            className="mt-5 max-w-[540px] text-[0.95rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            The system works in six steps. Each story has exactly five beats, generated live from the
            same skeleton data. The events are fixed by scripture. The telling is shaped by you.
          </p>

          <div className="flow-row mt-14">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.title} className="contents">
                {i > 0 && <div className="flow-arrow">&rarr;</div>}
                <div className="flow-step">
                  <div className="flow-node" style={{ borderColor: step.color }}>
                    {step.icon}
                  </div>
                  <h4
                    className="text-[0.82rem] font-medium leading-snug text-white"
                    style={{ fontFamily: 'var(--font-narrative)' }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="mt-1.5 px-2 text-[0.68rem] leading-[1.5] text-white/30"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* System prompt preview */}
          <div className="mt-14">
            <p className="landing-label mb-4">
              Behind the scenes — Assembled system prompt (color-coded)
            </p>
            <div
              className="max-h-[320px] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#131318] p-6 text-xs leading-[1.7]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <PromptSection
                label="The person"
                color="person"
                text={'The reader said: "I lost my best friend last month and I don\'t know how to keep going"\nLanguage: en'}
              />
              <PromptSection
                label="Deeper context"
                color="person"
                text={'Check-in answer: "He just let me cry on the phone. Didn\'t say anything."'}
              />
              <PromptSection
                label="Guardrails (non-negotiable)"
                color="guard"
                text="MUST NOT: Explain why God allows suffering. No theodicy.\nMUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).\nMUST NOT: Rush past the grief to get to the miracle."
              />
              <PromptSection
                label="Scripture bounds"
                color="guard"
                text='John 11:33-35. "Jesus wept." Non-negotiable: the text says he wept — do not soften to "his eyes glistened" or similar. Two words.'
              />
              <PromptSection
                label="Writing style"
                color="style"
                text="Literary, not devotional. Sit in the ache. Let beats about the delay and the weeping breathe. Do not rush to resolution."
              />
              <PromptSection
                label="This beat"
                color="beat"
                text='Beat 3: "Jesus weeps." When Jesus sees Mary weeping, and the people with her weeping, he is deeply moved. He asks where they have laid Lazarus. And then: Jesus wept.'
              />
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Feature bento ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">Capabilities</p>
          <h2
            className="mt-4 text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            What the system does
          </h2>

          <div className="bento-grid mt-12">
            {FEATURES.map((f) => (
              <div key={f.title} className={`bento-card${f.wide ? ' bento-wide' : ''}`}>
                <div className="bento-icon">{f.icon}</div>
                <h3
                  className="text-[0.88rem] text-white/80"
                  style={{ fontFamily: 'var(--font-narrative)', fontWeight: 500 }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-2 text-[0.75rem] leading-[1.6] text-white/30"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── The key tension ── */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <blockquote
            className="max-w-[640px] text-[clamp(1.2rem,3vw,1.9rem)] font-medium leading-[1.35] text-white/75"
            style={{ fontFamily: 'var(--font-narrative)', fontStyle: 'italic' }}
          >
            &ldquo;You can contextualize the telling, but you cannot change the events.&rdquo;
          </blockquote>
          <p
            className="mt-8 max-w-[540px] text-[0.9rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            The reader&apos;s words shape the narrator&apos;s voice and the scene&apos;s atmosphere
            — but never appear in the mouths of biblical characters. The narrator bridges the
            reader&apos;s world and the ancient story. Jesus and the other characters speak only what
            scripture records.
          </p>
        </div>
      </section>

      <Divider />

      {/* ── API reference ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">API Routes</p>
          <h2
            className="mt-4 text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Two endpoints, streaming responses
          </h2>

          <div className="api-grid mt-10">
            <div className="api-row">
              <span className="api-method api-post">POST</span>
              <span className="api-path">/api/entry</span>
              <span className="api-desc">
                Classify input (language + emotion), stream bridge sentence. Headers:
                X-Detected-Lang, X-Emotional-Key, X-Arc-Slug
              </span>
            </div>
            <div className="api-row">
              <span className="api-method api-post">POST</span>
              <span className="api-path">/api/story</span>
              <span className="api-desc">
                Generate a story beat. Accepts storySlug, beatId, userInput, lang, previousBeats,
                checkinAnswers. Streams prose via headers.
              </span>
            </div>
          </div>

          <div className="mt-8">
            <p className="landing-label mb-3">Response headers from /api/story</p>
            <div className="landing-code">
              <span className="c-comment"># Beat metadata sent as HTTP headers</span>
              {'\n'}X-Beat-Id: beat-grief-3{'\n'}X-Is-End: false{'\n'}X-Beat-Order: 3{'\n'}
              X-Choices: <span className="c-flag">[{'{'}&#34;id&#34;:&#34;choice-grief-3&#34;,&#34;nextBeatId&#34;:&#34;beat-grief-4&#34;,&#34;hint&#34;:&#34;Follow him to the tomb&#34;{'}'}]</span>
              {'\n'}X-Checkin-Prompt: <span className="c-flag">When was the last time someone sat in your pain with you...</span>
              {'\n'}X-Illustration-Url: /beat-illustrations/when-he-wept/beat-5.svg
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Get started ── */}
      <section id="get-started" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="landing-label">Get started</p>
          <h2
            className="mt-4 text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Clone, install, run
          </h2>
          <p
            className="mt-4 max-w-[540px] text-[0.92rem] leading-[1.8] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Requires Node.js 20+ and a Google AI API key (Gemini 2.5 Flash). Supabase is optional —
            the app runs with mock skeleton data by default.
          </p>

          <div className="landing-code mt-8">
            <span className="c-comment"># Clone</span>
            {'\n'}<span className="c-cmd">git clone</span> https://github.com/jeeminhan/jesus-story.git
            {'\n'}<span className="c-cmd">cd</span> jesus-story
            {'\n'}
            {'\n'}<span className="c-comment"># Install dependencies</span>
            {'\n'}<span className="c-cmd">npm install</span>
            {'\n'}
            {'\n'}<span className="c-comment"># Set up environment</span>
            {'\n'}<span className="c-cmd">cp</span> .env.example .env.local
            {'\n'}<span className="c-comment"># Add your GOOGLE_GENERATIVE_AI_API_KEY to .env.local</span>
            {'\n'}
            {'\n'}<span className="c-comment"># Run dev server</span>
            {'\n'}<span className="c-cmd">npm run dev</span>
            {'\n'}
            {'\n'}<span className="c-comment"># Run tests</span>
            {'\n'}<span className="c-cmd">npx vitest run</span>          <span className="c-comment"># 118 unit/integration tests</span>
            {'\n'}<span className="c-cmd">npx playwright test</span>     <span className="c-comment"># E2E tests</span>
          </div>

          <div className="mt-8">
            <p className="landing-label mb-3">Available scripts</p>
            <div className="api-grid">
              {SCRIPTS.map((s) => (
                <div key={s.cmd} className="api-row">
                  <span className="api-method api-get" style={{ fontSize: '0.62rem' }}>RUN</span>
                  <span className="api-path">{s.cmd}</span>
                  <span className="api-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Footer CTA ── */}
      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 text-center">
          <h2
            className="max-w-[500px] text-[clamp(1.4rem,3.5vw,2.1rem)] font-medium leading-[1.2] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            See it for yourself.
          </h2>
          <p
            className="max-w-[420px] text-[0.95rem] leading-[1.8] text-white/45"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            The demo walks through the grief arc with a sample input. Or try it with your own words,
            in your own language.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={LIVE_APP_URL}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-[0.9rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'rgba(196,166,106,0.15)',
                border: '1px solid rgba(196,166,106,0.25)',
                color: '#e8d5b0',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Try it yourself
            </a>
            <Link
              href="/demo"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-7 text-[0.9rem] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Watch the demo
            </Link>
          </div>

          {/* Tech stack */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {TECH_STACK.map((t) => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <a
              href={LIVE_APP_URL}
              className="text-sm text-white/25 transition-colors hover:text-white/50"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Live app
            </a>
            <a
              href="https://github.com/jeeminhan/jesus-story"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/25 transition-colors hover:text-white/50"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              GitHub
            </a>
            <Link
              href="/overview"
              className="text-sm text-white/25 transition-colors hover:text-white/50"
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

/* ── Helper components ── */

function Divider() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 sm:px-10 lg:px-16">
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
      />
    </div>
  );
}

function PromptSection({ label, color, text }: { label: string; color: 'person' | 'guard' | 'style' | 'beat'; text: string }) {
  return (
    <div className="mt-3.5 first:mt-0">
      <span className={`prompt-section-label prompt-${color}`}>{label}</span>
      <p className={`prompt-${color}-text mt-1`} style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
    </div>
  );
}

/* ── Static data ── */

const ARCS = [
  { emotion: 'grief', label: 'Grief', title: 'When He Wept', source: 'John 11:1-44', tagline: 'A story for the ache that stays after the room goes quiet.' },
  { emotion: 'doubt', label: 'Doubt', title: 'The Night He Answered', source: 'John 20:24-29', tagline: 'A story for the person who needs more than slogans.' },
  { emotion: 'searching', label: 'Searching', title: 'The King Who Came', source: 'Luke 2 / Matthew 2', tagline: 'A story about a rescue no one expected.' },
  { emotion: 'curiosity', label: 'Curiosity', title: 'Come and See', source: 'John 1:35-51', tagline: 'A story for the person who is open, observant, and not yet convinced.' },
  { emotion: 'anger', label: 'Anger', title: 'The Storm He Stilled', source: 'Mark 4:35-41', tagline: 'A story for the noise inside you when everything feels too much.' },
];

const FLOW_STEPS = [
  { icon: '\u270E', title: 'Share', desc: 'User writes what they\u2019re carrying in any language', color: 'rgba(196,166,106,0.2)' },
  { icon: '\u2699', title: 'Classify', desc: 'Gemini detects language, emotion, selects arc', color: 'rgba(74,111,165,0.3)' },
  { icon: '\u266C', title: 'Bridge', desc: 'A sentence streams in their language, echoing their words', color: 'rgba(139,45,66,0.3)' },
  { icon: '\u2733', title: 'Generate', desc: 'Five beats stream live from skeleton + guardrails + user context', color: 'rgba(42,122,106,0.3)' },
  { icon: '\u2754', title: 'Check-in', desc: 'Between beats, a reflective question deepens the next scene', color: 'rgba(196,131,42,0.3)' },
  { icon: '\u25C6', title: 'Guard', desc: 'Guardrails ensure no invented dialogue, no church vocab, scripture-faithful', color: 'rgba(181,32,32,0.3)' },
];

const FEATURES = [
  { icon: '\u270D\uFE0F', title: 'Live story generation', desc: 'Each beat streams in real time from Gemini 2.5 Flash. The prose is generated directly in the reader\u2019s language \u2014 not translated after the fact. Five beats per story, each shaped by the reader\u2019s input and check-in answers.', wide: true },
  { icon: '\uD83D\uDD12', title: 'Scripture guardrails', desc: 'Three layers of fidelity enforcement. No invented dialogue. No attributed emotions beyond the text. Per-beat verse bounds.', wide: false },
  { icon: '\uD83C\uDF10', title: 'Any language on earth', desc: 'Korean, Japanese, Spanish, Tagalog, Arabic \u2014 the AI generates natively. One English skeleton serves every language.', wide: false },
  { icon: '\uD83D\uDCA1', title: 'Emotional classification', desc: 'Structured output from Gemini classifies input into one of five emotional keys. Ambiguous input defaults to \u201Csearching.\u201D', wide: false },
  { icon: '\uD83D\uDCAC', title: 'Mid-story check-ins', desc: 'After each non-end beat, a reflective question pauses the flow. The reader\u2019s answer is accumulated and shapes every subsequent beat \u2014 the narrator\u2019s voice shifts to meet what you shared.', wide: true },
  { icon: '\uD83C\uDFA8', title: 'Cultural contextualization', desc: 'Not just language \u2014 the telling adapts to cultural expressions of grief, doubt, and searching.', wide: false },
  { icon: '\u2696\uFE0F', title: 'No church vocabulary', desc: 'Saved, sin, repent, born again \u2014 banned across all five arcs. The story speaks in human language.', wide: false },
  { icon: '\uD83D\uDC41\uFE0F', title: 'Behind the scenes', desc: 'After the story ends, readers can see every system prompt that was sent \u2014 color-coded by section.', wide: false },
];

const SCRIPTS = [
  { cmd: 'npm run dev', desc: 'Start the Next.js dev server' },
  { cmd: 'npm run build', desc: 'Production build' },
  { cmd: 'npm run test', desc: 'Run Vitest suite (118 tests)' },
  { cmd: 'npm run test:e2e', desc: 'Run Playwright E2E tests' },
  { cmd: 'npm run seed', desc: 'Seed Supabase with skeleton data' },
];

const TECH_STACK = ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'AI SDK v6', 'Gemini 2.5 Flash', 'Supabase', 'Vitest', 'Playwright', 'Vercel'];
