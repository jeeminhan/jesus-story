'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { EmotionalKey } from '@/lib/constants';
import { useSession } from '@/lib/useSession';
import { ArcBackground } from './ArcBackground';
import { AmbientPlayer } from './AmbientPlayer';
import { SceneIllustration } from './SceneIllustration';

interface ArtCardProps {
  quote: string;
  arcSlug: string;
  lang: string;
  emotionalKey?: EmotionalKey | null;
  startSceneId: string;
  sceneSlug?: string | null;
  lightWorld?: boolean;
  onEnter?: () => void;
}

export function ArtCard({
  quote,
  arcSlug,
  lang,
  emotionalKey,
  startSceneId,
  sceneSlug,
  lightWorld,
  onEnter,
}: ArtCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { savedSceneId } = useSession(lang, arcSlug);
  const [resolvedStartSceneId, setResolvedStartSceneId] = useState(startSceneId);
  const [showResumeIndicator, setShowResumeIndicator] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const isReturningCarrier = searchParams.get('from') === 'carrier';

  function clearResumeTimer() {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }

  function handleEnter(sceneId = resolvedStartSceneId) {
    clearResumeTimer();
    if (emotionalKey) {
      document.documentElement.setAttribute('data-key', emotionalKey);
    }
    onEnter?.();
    router.push(`/${lang}/${arcSlug}?scene=${sceneId}`);
  }

  useEffect(() => {
    if (emotionalKey) {
      document.documentElement.setAttribute('data-key', emotionalKey);
    }
  }, [emotionalKey]);

  useEffect(() => {
    clearResumeTimer();

    if (savedSceneId && savedSceneId !== startSceneId) {
      setResolvedStartSceneId(savedSceneId);
      setShowResumeIndicator(true);

      resumeTimeoutRef.current = window.setTimeout(() => {
        setShowResumeIndicator(false);
        onEnter?.();
        router.push(`/${lang}/${arcSlug}?scene=${savedSceneId}`);
      }, 2000);

      return () => clearResumeTimer();
    }

    setResolvedStartSceneId(startSceneId);
    setShowResumeIndicator(false);

    return () => clearResumeTimer();
  }, [savedSceneId, startSceneId, onEnter, router, lang, arcSlug]);

  return (
    <div
      role="main"
      aria-label="Story entry — tap to begin"
      className="fixed inset-0 overflow-hidden"
      style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg)' }}
      data-emotional-key={emotionalKey ?? undefined}
    >
      <ArcBackground emotionalKey={emotionalKey ?? null} />

      <button
        type="button"
        aria-label="Tap anywhere to begin"
        onClick={() => handleEnter()}
        className="absolute inset-0 z-10 m-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2"
        style={{ '--tw-ring-color': 'var(--accent)' } as CSSProperties}
      >
        <span className="sr-only">Begin story</span>
      </button>

      {isReturningCarrier ? (
        <div className="absolute left-4 top-4 z-50">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              router.push(`/${lang}/${arcSlug}/share`);
            }}
            className="rounded-full border px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2"
            style={
              {
                color: 'var(--text-secondary)',
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(0,0,0,0.28)',
                backdropFilter: 'blur(12px)',
                '--tw-ring-color': 'var(--accent)',
              } as CSSProperties
            }
          >
            Share again
          </button>
        </div>
      ) : null}

      <SceneIllustration
        emotionalKey={emotionalKey ?? null}
        sceneSlug={sceneSlug}
        lightWorld={lightWorld}
        className="pointer-events-none absolute inset-0 z-10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, var(--surface) 80%)',
        }}
      />

      <div className="pointer-events-none absolute bottom-[13%] left-[5%] right-[5%] z-30">
        <blockquote
          className="mx-auto max-w-xl rounded-[28px] border px-5 py-5 text-[21px] italic leading-relaxed shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:px-6"
          style={{
            fontFamily: 'var(--font-narrative)',
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(7,6,6,0.32)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {quote}
        </blockquote>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center">
        <button
          type="button"
          onClick={() => handleEnter()}
          className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
          style={
            {
              color: 'var(--text-secondary)',
              borderColor: 'rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(7,6,6,0.42)',
              backdropFilter: 'blur(12px)',
              '--tw-ring-color': 'var(--accent)',
            } as CSSProperties
          }
        >
          Tap anywhere
        </button>
      </div>

      {showResumeIndicator ? (
        <div className="pointer-events-none absolute bottom-16 left-0 right-0 z-50 flex justify-center">
          <span
            className="resume-indicator text-xs"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            You were here &rarr;
          </span>
        </div>
      ) : null}

      <div className="pointer-events-none absolute right-3 top-3 z-40">
        <AmbientPlayer emotionalKey={emotionalKey ?? null} />
      </div>

      <style jsx>{`
        @keyframes resumeFade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          15% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }

        .resume-indicator {
          animation: resumeFade 2s ease forwards;
        }
      `}</style>
    </div>
  );
}
