'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { WitnessVideo } from '@/lib/types';

interface WitnessVideoPlayerProps {
  video: WitnessVideo;
  lang: string;
  arcSlug: string;
}

export function WitnessVideoPlayer({ video, lang, arcSlug }: WitnessVideoPlayerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [durationLabel, setDurationLabel] = useState('0:18');

  const connectPath = `/${lang}/${arcSlug}/connect`;
  const storyPath = `/${lang}/${arcSlug}`;
  const homePath = `/${lang}`;
  const eyebrowLabel = `${video.emotional_key} path · same story`;
  const hasFinishedState = isComplete || hasLoadError;
  const forceLoadError = searchParams.get('witnessError') === '1';
  const pullQuote =
    video.emotional_key === 'grief'
      ? "I didn't think anything could reach me in that season. I was wrong."
      : video.emotional_key === 'doubt'
        ? 'He did not shame my questions. He met them.'
        : video.emotional_key === 'curiosity'
          ? 'I stayed open a little longer, and something opened back.'
          : video.emotional_key === 'anger'
            ? 'Peace did not erase the storm. It changed who held it.'
            : 'I kept looking for something real. This met me first.';

  useEffect(() => {
    if (forceLoadError) {
      setIsInitialLoading(false);
      setIsBuffering(false);
      setNeedsTapToPlay(false);
      setHasLoadError(true);
      setIsPlaying(false);
      return;
    }

    async function attemptAutoplay() {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      try {
        await videoElement.play();
        setNeedsTapToPlay(false);
        setIsPlaying(true);
      } catch {
        setNeedsTapToPlay(true);
        setIsPlaying(false);
      }
    }

    void attemptAutoplay();
  }, [forceLoadError, video.id]);

  async function togglePlayback() {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (!videoElement.paused && !videoElement.ended) {
      videoElement.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await videoElement.play();
      setNeedsTapToPlay(false);
      setIsPlaying(true);
    } catch {
      setNeedsTapToPlay(true);
      setIsPlaying(false);
    }
  }

  function navigateTo(path: string) {
    router.push(path);
  }

  return (
    <div
      role="main"
      className="fixed inset-0 z-50 overflow-hidden px-5 py-8 sm:px-6"
      style={{ backgroundColor: '#0c0609' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(155,58,110,0.18) 0%, rgba(155,58,110,0) 36%), linear-gradient(180deg, #14080f 0%, #0c0609 100%)',
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[440px] flex-col">
        <div className="flex items-start justify-between gap-4 px-1 pb-3 pt-6">
          <div>
            <p
              className="text-[0.62rem] uppercase tracking-[0.18em]"
              style={{ color: 'rgba(244,194,219,0.58)', fontFamily: 'var(--font-ui)' }}
            >
              Someone who&apos;s been there
            </p>
            <p
              className="mt-1 text-[0.72rem]"
              style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-ui)' }}
            >
              {eyebrowLabel}
            </p>
          </div>

          <button
            type="button"
            aria-label="Skip witness video"
            onClick={() => navigateTo(connectPath)}
            className="border-0 bg-transparent px-0 py-1 text-[0.7rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)' }}
          >
            Skip
          </button>
        </div>

        <div className="mx-auto w-full max-w-[380px]">
          <div
            className="relative overflow-hidden rounded-[22px] border"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(200,150,170,0.2) 0%, transparent 45%), radial-gradient(ellipse at 50% 60%, rgba(120,50,80,0.35) 0%, transparent 55%), linear-gradient(180deg, #1e0c14 0%, #120709 60%, #0c0609 100%)',
            }}
          >
            <div className="relative aspect-[9/13]">
              {isInitialLoading && !video.poster_url ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-witness-pulse"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                />
              ) : null}

              {!hasLoadError ? (
                <video
                  ref={videoRef}
                  poster={video.poster_url ?? undefined}
                  autoPlay
                  muted={false}
                  playsInline
                  preload="metadata"
                  aria-label={
                    video.speaker_name
                      ? `Witness: ${video.speaker_name} on the ${video.emotional_key} path`
                      : `Witness video on the ${video.emotional_key} path`
                  }
                  onLoadedData={() => setIsInitialLoading(false)}
                  onCanPlay={() => setIsBuffering(false)}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => {
                    setIsInitialLoading(false);
                    setIsBuffering(false);
                    setNeedsTapToPlay(false);
                    setIsPlaying(true);
                  }}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    setIsComplete(true);
                  }}
                  onLoadedMetadata={() => {
                    const duration = videoRef.current?.duration;
                    if (duration && Number.isFinite(duration)) {
                      const minutes = Math.floor(duration / 60);
                      const seconds = Math.floor(duration % 60);
                      setDurationLabel(`${minutes}:${String(seconds).padStart(2, '0')}`);
                    }
                  }}
                  onError={() => {
                    setIsInitialLoading(false);
                    setIsBuffering(false);
                    setNeedsTapToPlay(false);
                    setHasLoadError(true);
                    setIsPlaying(false);
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  {video.caption_url ? <track kind="captions" src={video.caption_url} default /> : null}
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <div className="max-w-xs">
                    <p
                      className="text-[0.62rem] uppercase tracking-[0.2em]"
                      style={{ color: 'rgba(244,194,219,0.5)', fontFamily: 'var(--font-ui)' }}
                    >
                      Still a valid path
                    </p>
                    <p
                      className="mt-3 text-[1.4rem] leading-tight"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
                    >
                      We couldn&apos;t load this right now.
                    </p>
                    <p
                      className="mt-3 text-sm leading-7"
                      style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-narrative)' }}
                    >
                      Nothing is broken for you. You can still leave a message or simply sit with what you&apos;ve seen.
                    </p>
                  </div>
                </div>
              )}

              {!hasLoadError ? (
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause witness video' : 'Play witness video'}
                  onClick={() => {
                    void togglePlayback();
                  }}
                  className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {(!isPlaying || needsTapToPlay) && !isBuffering ? (
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full border"
                      style={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          borderLeft: '14px solid rgba(255,255,255,0.78)',
                          marginLeft: '4px',
                        }}
                      />
                    </span>
                  ) : null}
                </button>
              ) : null}

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                    style={{
                      borderColor: 'rgba(155,58,110,0.32)',
                      backgroundColor: 'rgba(200,140,160,0.24)',
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.78rem',
                    }}
                  >
                    {(video.speaker_name ?? 'W').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-ui)' }}>
                      {video.speaker_name ?? 'A witness'}
                    </p>
                  </div>
                </div>

                <span
                  className="rounded-full px-2.5 py-1 text-[0.68rem]"
                  style={{
                    color: 'rgba(255,255,255,0.48)',
                    backgroundColor: 'rgba(0,0,0,0.22)',
                    fontFamily: 'var(--font-ui)',
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {durationLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="px-1 pb-4 pt-4">
            <p
              className="text-[1rem] italic leading-7"
              style={{ color: 'rgba(244,194,219,0.74)', fontFamily: 'var(--font-narrative)' }}
            >
              &ldquo;{pullQuote}&rdquo;
            </p>
            {isComplete && !hasLoadError ? (
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-narrative)' }}
              >
                That story can end here, or you can keep following it.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pb-6">
          {!hasLoadError ? (
            <button
              type="button"
              onClick={() => navigateTo(storyPath)}
              className="w-full border-0 bg-transparent px-4 py-3 text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                color: 'rgba(244,194,219,0.9)',
                backgroundColor: 'rgba(155,58,110,0.12)',
                border: '1px solid rgba(155,58,110,0.22)',
                borderRadius: '12px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
              }}
            >
              Tell me about the story
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => navigateTo(connectPath)}
            className="w-full border-0 bg-transparent px-4 py-3 text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: 'rgba(255,255,255,0.62)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
            }}
          >
            Leave a message for someone
          </button>
          <button
            type="button"
            onClick={() => navigateTo(homePath)}
            className="w-full border-0 bg-transparent px-4 py-3 text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: hasFinishedState ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.56)',
              backgroundColor: hasFinishedState ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: hasFinishedState ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              borderRadius: '12px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
            }}
          >
            I want to sit with this
          </button>
          {hasLoadError ? (
            <button
              type="button"
              onClick={() => navigateTo(storyPath)}
              className="border-0 bg-transparent px-4 py-2 text-center transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                color: 'rgba(255,255,255,0.28)',
                fontFamily: 'var(--font-narrative)',
                fontStyle: 'italic',
              }}
            >
              Return to the story
            </button>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes witnessPulse {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.7;
          }
        }

        .animate-witness-pulse {
          animation: witnessPulse 1.3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
