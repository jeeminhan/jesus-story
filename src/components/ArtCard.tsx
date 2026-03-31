'use client';

import { useRouter } from 'next/navigation';
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
  recipientName?: string | null;
  senderName?: string | null;
  bridgeText?: string | null;
  personalNote?: string | null;
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
  recipientName,
  senderName,
  bridgeText,
  personalNote,
  onEnter,
}: ArtCardProps) {
  const router = useRouter();
  const { savedSceneId } = useSession(lang, arcSlug);
  const [resolvedStartSceneId, setResolvedStartSceneId] = useState(startSceneId);
  const [showResumeIndicator, setShowResumeIndicator] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);

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
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.58) 100%)',
        }}
      />

      <div className="pointer-events-none absolute bottom-[12%] left-[5%] right-[5%] z-30">
        {recipientName || senderName ? (
          <div className="mb-3 flex justify-center">
            <span
              className="rounded-full border px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em]"
              style={
                {
                  color: 'var(--text-secondary)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(7,6,6,0.18)',
                  backdropFilter: 'blur(12px)',
                } as CSSProperties
              }
            >
              {recipientName ? `For ${recipientName}` : 'A story for you'}
              {senderName ? ` • from ${senderName}` : ''}
            </span>
          </div>
        ) : null}

        {bridgeText ? (
          <p
            className="mx-auto mb-3 max-w-lg text-center text-sm leading-7 sm:text-[0.98rem]"
            style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-secondary)' }}
          >
            {bridgeText}
          </p>
        ) : null}

        <blockquote
          className="mx-auto max-w-lg rounded-[30px] border px-5 py-4 text-[1.15rem] italic leading-[1.72] shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:px-6 sm:text-[1.28rem]"
          style={{
            fontFamily: 'var(--font-narrative)',
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(7,6,6,0.22)',
            backdropFilter: 'blur(14px)',
          }}
        >
          {quote}
        </blockquote>

        {personalNote ? (
          <div
            className="mx-auto mt-3 max-w-lg rounded-[24px] border px-4 py-3"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(7,6,6,0.18)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              className="text-[0.62rem] uppercase tracking-[0.18em]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            >
              Note
            </p>
            <p
              className="mt-2 text-sm leading-7"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
            >
              {personalNote}
            </p>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-40 flex justify-center">
        <span
          className="rounded-full border px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em]"
          style={
            {
              color: 'var(--text-secondary)',
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(7,6,6,0.2)',
              backdropFilter: 'blur(12px)',
            } as CSSProperties
          }
        >
          Tap to enter
        </span>
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
