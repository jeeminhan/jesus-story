'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StoryIllustration } from '@/components/StoryIllustration';

const DEMO_INPUT = "I lost my mother last month. I don't know how to grieve. Everything feels hollow.";
const DEMO_SLUG = 'when-he-wept';
const DEMO_ANSWERS = [
  "Yes. I called everyone when she was in the hospital. Nobody came in time.",
  "I'd tell her I'm sorry I wasn't there at the end.",
];

type DemoPhase = 'intro' | 'typing' | 'entering';

export default function DemoPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<DemoPhase>('intro');
  const [typedText, setTypedText] = useState('');
  const typingRef = useRef<number | null>(null);

  // Auto-type effect
  useEffect(() => {
    if (phase !== 'typing') return;

    let i = 0;
    typingRef.current = window.setInterval(() => {
      i += 1;
      if (i <= DEMO_INPUT.length) {
        setTypedText(DEMO_INPUT.slice(0, i));
      } else {
        if (typingRef.current) window.clearInterval(typingRef.current);
        // Pause after typing, then navigate
        setTimeout(() => {
          setPhase('entering');
          router.push(
            `/story/${DEMO_SLUG}?input=${encodeURIComponent(DEMO_INPUT)}&lang=en&demo=true&demoAnswers=${encodeURIComponent(JSON.stringify(DEMO_ANSWERS))}&maxBeats=3`,
          );
        }, 1200);
      }
    }, 45);

    return () => {
      if (typingRef.current) window.clearInterval(typingRef.current);
    };
  }, [phase, router]);

  function handleStart() {
    setPhase('typing');
  }

  function handleSkip() {
    if (typingRef.current) window.clearInterval(typingRef.current);
    setPhase('entering');
    router.push(
      `/story/${DEMO_SLUG}?input=${encodeURIComponent(DEMO_INPUT)}&lang=en&demo=true&demoAnswers=${encodeURIComponent(JSON.stringify(DEMO_ANSWERS))}&maxBeats=3`,
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #09080a 0%, #0d0a05 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-lg">
        {/* Intro phase — story card preview */}
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="overflow-hidden rounded-3xl" style={{ background: '#0D0A0E', maxWidth: '320px' }}>
              <StoryIllustration
                slug={DEMO_SLUG}
                className="w-full"
                style={{ height: '220px', display: 'block' }}
              />
            </div>

            <div>
              <p
                className="text-[0.65rem] uppercase tracking-[0.22em] text-white/35"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Demo
              </p>
              <h1
                className="mt-2 text-3xl font-medium text-white"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                When He Wept
              </h1>
              <p
                className="mt-3 text-sm leading-6 text-white/50"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                Walk through the grief story with a sample input.
              </p>
            </div>

            <button
              onClick={handleStart}
              className="rounded-full border px-8 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Begin demo
            </button>
          </div>
        )}

        {/* Typing phase — simulated user input */}
        {phase === 'typing' && (
          <div className="flex flex-col gap-6">
            <p
              className="text-[0.65rem] uppercase tracking-[0.22em] text-white/35"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Someone shares what they&apos;re carrying...
            </p>

            <div
              className="min-h-[120px] rounded-2xl border p-5 text-lg leading-8 text-white/80"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              {typedText}
              <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-white/60" />
            </div>

          </div>
        )}

        {/* Entering phase — loading transition */}
        {phase === 'entering' && (
          <div className="flex flex-col items-center gap-4">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            <p
              className="text-sm text-white/40"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              Entering the story...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
