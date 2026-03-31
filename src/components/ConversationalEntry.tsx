'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import { AmbientPlayer } from './AmbientPlayer';
import type { EmotionalKey } from '@/lib/constants';

type Phase = 'prompt' | 'loading' | 'streaming' | 'done';

interface Classification {
  lang: string;
  emotionalKey: string;
  arcSlug: string;
  startSceneId: string | null;
}

export function ConversationalEntry() {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('prompt');
  const [bridgeText, setBridgeText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [musicKey, setMusicKey] = useState<EmotionalKey | null>('searching');
  const classificationRef = useRef<Classification | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || phase !== 'prompt') return;

    setPhase('loading');
    setError(null);

    try {
      const res = await fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: trimmed }),
      });

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      // Read classification from headers
      const detectedKey = res.headers.get('X-Emotional-Key') ?? 'searching';
      classificationRef.current = {
        lang: res.headers.get('X-Detected-Lang') ?? 'en',
        emotionalKey: detectedKey,
        arcSlug: res.headers.get('X-Arc-Slug') ?? 'the-king-who-came',
        startSceneId: res.headers.get('X-Start-Scene-Id') || null,
      };

      // Switch music to match their emotional key
      setMusicKey(detectedKey as EmotionalKey);

      // Stream the bridge sentence
      setPhase('streaming');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setBridgeText(accumulated);
      }

      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPhase('prompt');
    }
  }, [input, phase]);

  const handleContinue = useCallback(() => {
    const c = classificationRef.current;
    if (!c) return;
    const encodedInput = encodeURIComponent(input.trim());
    const url = `/story/${c.arcSlug}?input=${encodedInput}&lang=${c.lang}`;
    window.location.assign(url);
  }, [input]);

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-8"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%), linear-gradient(180deg, #09080a 0%, #0d0a05 100%)',
      }}
    >
      <style>{`
        @keyframes entry-btn-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Music toggle */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50">
        <AmbientPlayer emotionalKey={musicKey} />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[10%] top-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 right-[8%] h-44 w-44 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        {/* Prompt phase */}
        {(phase === 'prompt' || phase === 'loading') && (
          <div className="flex flex-col gap-6">
            <div>
              <p
                className="text-[0.68rem] uppercase tracking-[0.28em] text-white/38"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Begin
              </p>
              <h1
                className="mt-3 text-[clamp(2rem,6vw,3.8rem)] font-medium leading-[0.95] text-[var(--text-primary)]"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                What are you carrying right now?
              </h1>
              <p
                className="mt-4 max-w-lg text-base leading-7 text-white/50"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                Any language. Any length. Even one word is enough.
              </p>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={phase === 'loading'}
              placeholder=""
              rows={3}
              autoFocus
              className="w-full resize-none rounded-2xl border bg-transparent px-5 py-4 text-base leading-7 text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 disabled:opacity-50"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-narrative)',
              }}
            />

            <div className="flex flex-wrap items-center gap-4">
              {phase === 'loading' && (
                <span className="flex items-center gap-2 text-base text-white/50" style={{ fontFamily: 'var(--font-narrative)' }}>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                  Listening...
                </span>
              )}

              <Link
                href="/demo"
                className="text-sm text-white/30 transition-colors hover:text-white/60"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Try a demo →
              </Link>

              {error && (
                <p
                  className="text-sm text-red-400/80"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bridge phase — streaming + done */}
        {(phase === 'streaming' || phase === 'done') && (
          <div className="flex flex-col gap-8">
            {/* Echo what they typed */}
            <p
              className="text-sm leading-6 text-white/35"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              &ldquo;{input}&rdquo;
            </p>

            {/* Bridge sentence streaming in */}
            <p
              className="max-w-xl text-[clamp(1.3rem,4vw,2rem)] font-medium leading-[1.3] text-white/90"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              {bridgeText}
              {phase === 'streaming' && (
                <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-white/60" />
              )}
            </p>

            {/* Continue button — appears when stream is done */}
            {phase === 'done' && (
              <button
                type="button"
                onClick={handleContinue}
                className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_0_24px_rgba(196,166,106,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-narrative)',
                  animation: 'entry-btn-in 0.6s ease-out both',
                }}
              >
                Enter the story
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
