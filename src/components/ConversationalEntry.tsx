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
      style={{ background: '#0b0b0d' }}
    >
      <style>{`
        @keyframes entry-btn-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Music toggle */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50">
        <AmbientPlayer emotionalKey={musicKey} />
      </div>

      {/* Ambient glow — subtle, warm, matching landing page */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[15%] -translate-x-1/2"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(196,166,106,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        {/* Prompt phase */}
        {(phase === 'prompt' || phase === 'loading') && (
          <div className="flex flex-col gap-8">
            <div>
              <p
                className="text-[0.6rem] uppercase tracking-[0.35em]"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 500,
                }}
              >
                Begin
              </p>
              <h1
                className="mt-5 text-[clamp(2rem,6vw,3.6rem)] font-medium leading-[1.06] tracking-tight"
                style={{
                  fontFamily: 'var(--font-narrative)',
                  color: 'var(--text-primary)',
                }}
              >
                What are you carrying right now?
              </h1>
              <p
                className="mt-5 max-w-md text-[1.02rem] leading-[1.8]"
                style={{
                  fontFamily: 'var(--font-narrative)',
                  color: 'rgba(255,255,255,0.4)',
                }}
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
              className="w-full resize-none text-[1.02rem] leading-[1.8] focus:outline-none disabled:opacity-50"
              style={{
                fontFamily: 'var(--font-narrative)',
                color: 'rgba(255,255,255,0.85)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px 20px',
              }}
            />

            <div className="flex flex-wrap items-center gap-5">
              {phase === 'loading' && (
                <span
                  className="flex items-center gap-2.5 text-[0.85rem]"
                  style={{
                    fontFamily: 'var(--font-narrative)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full"
                    style={{ border: '1.5px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(196,166,106,0.6)' }}
                  />
                  Listening...
                </span>
              )}

              <Link
                href="/demo"
                className="text-[0.75rem] transition-colors hover:text-white/50"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'rgba(255,255,255,0.2)',
                }}
              >
                Try a demo &rarr;
              </Link>

              {error && (
                <p
                  className="text-[0.78rem]"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    color: 'rgba(248,113,113,0.7)',
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bridge phase — streaming + done */}
        {(phase === 'streaming' || phase === 'done') && (
          <div className="flex flex-col gap-10">
            {/* Echo what they typed */}
            <p
              className="text-[0.78rem] leading-relaxed"
              style={{
                fontFamily: 'var(--font-ui)',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              &ldquo;{input}&rdquo;
            </p>

            {/* Bridge sentence streaming in */}
            <p
              className="max-w-xl text-[clamp(1.3rem,4vw,2rem)] font-medium leading-[1.35]"
              style={{
                fontFamily: 'var(--font-narrative)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {bridgeText}
              {phase === 'streaming' && (
                <span
                  className="ml-0.5 inline-block h-5 w-[2px] align-middle"
                  style={{
                    background: 'rgba(196,166,106,0.6)',
                    animation: 'cursor-blink 1s ease-in-out infinite',
                  }}
                />
              )}
            </p>

            {/* Continue button — appears when stream is done */}
            {phase === 'done' && (
              <button
                type="button"
                onClick={handleContinue}
                className="group mt-2 inline-flex w-fit items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.9rem] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                style={{
                  color: '#e8d5b0',
                  border: '1px solid rgba(196,166,106,0.25)',
                  backgroundColor: 'rgba(196,166,106,0.1)',
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
