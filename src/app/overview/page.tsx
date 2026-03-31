import Link from 'next/link';

const experiencePillars = [
  {
    title: 'Starts with you',
    body: 'You share what you are carrying — in any language, in your own words. The app listens, and the story that begins is shaped by what you said.',
  },
  {
    title: 'Feels like art',
    body: 'Painterly scenes, emotional color shifts, ambient pacing, and text that arrives like it is being spoken. Every beat is anchored in a real Gospel narrative.',
  },
  {
    title: 'Continues with people',
    body: 'The story does not end with a screen. It moves into reflection, witness, and connection with real people who walked similar paths.',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'You arrive',
    body: 'A single question: "What are you carrying right now?" You respond freely — any language, any length.',
  },
  {
    step: '2',
    title: 'The app listens',
    body: 'AI detects your language and emotional state. It selects the Gospel story that speaks most directly to what you shared.',
  },
  {
    step: '3',
    title: 'A bridge appears',
    body: 'One sentence, streamed word by word, that echoes your own words and invites you into a story about someone who carried something similar.',
  },
  {
    step: '4',
    title: 'The story unfolds',
    body: 'Each scene is generated in real time — the same Gospel events, told in your language, shaped by what you are carrying. The structure is fixed. The telling is yours.',
  },
  {
    step: '5',
    title: 'You choose your path',
    body: 'At key moments you make choices that shift the lens — follow a different character, stay in the grief, or move toward what happens next.',
  },
];

const architectureNotes = [
  {
    title: 'Story Skeletons',
    body: 'Each story is a skeleton: ordered beats with guardrails and tone guidance. The AI generates prose for each beat but cannot skip, reorder, or invent plot points.',
  },
  {
    title: 'Theological Guardrails',
    body: 'Every skeleton includes MUST and MUST NOT constraints. The AI tells the story — it never interprets scripture, makes theological claims, or uses churchy vocabulary.',
  },
  {
    title: 'Visual Anchors',
    body: 'Illustrations are static assets tied to specific beats. The AI is told what the illustration depicts so the prose matches the visual moment.',
  },
  {
    title: 'Any Language',
    body: 'No translation tables. The AI generates directly in whatever language the user wrote in. One English skeleton serves every language.',
  },
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <div className="max-w-2xl">
          <p
            className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Project Overview
          </p>
          <h1
            className="mt-3 max-w-xl text-[clamp(1.9rem,7vw,3.6rem)] font-medium leading-[0.96] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            A living gospel experience that begins with you.
          </h1>
          <p
            className="mt-4 max-w-xl text-base leading-7 text-white/62 sm:text-lg"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Gospel Story is an AI-powered interactive narrative for people with no church background.
            It starts where you are — emotionally, not religiously — and uses AI to tell the stories of
            Jesus in your language, shaped by what you are carrying.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Experience pillars */}
          <section
            className="rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-ui)' }}>
              What makes this different
            </p>
            <div className="mt-6 grid gap-4">
              {experiencePillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[24px] border p-4"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <h3 className="text-base text-white" style={{ fontFamily: 'var(--font-narrative)' }}>
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/55" style={{ fontFamily: 'var(--font-ui)' }}>
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section
            className="rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
            }}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-ui)' }}>
              How it works
            </p>
            <div className="mt-6 space-y-3">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[22px] border px-4 py-3"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white/50"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-ui)' }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm text-white/80" style={{ fontFamily: 'var(--font-narrative)' }}>
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/45" style={{ fontFamily: 'var(--font-ui)' }}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Architecture notes */}
        <section
          className="rounded-[32px] border p-5 sm:p-6"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-ui)' }}>
            Under the hood
          </p>
          <h2
            className="mt-3 text-[1.65rem] leading-tight text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            The AI is the host, not the author.
          </h2>
          <p
            className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Every story is anchored in a specific Gospel passage. The structure — the beats, the branching,
            the guardrails — is fixed by humans. The AI generates the telling: the prose, the language, the
            emotional register. It cannot skip a beat, invent theology, or stray from the source material.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {architectureNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-[24px] border p-4"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <h3 className="text-base text-white" style={{ fontFamily: 'var(--font-narrative)' }}>
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/55" style={{ fontFamily: 'var(--font-ui)' }}>
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              fontFamily: 'var(--font-narrative)',
            }}
          >
            Enter the experience
          </Link>
          <Link
            href="/prototype"
            className="inline-flex min-h-[40px] items-center justify-center rounded-full border px-4 text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-90"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Experimental features
          </Link>
        </div>
      </div>
    </main>
  );
}
