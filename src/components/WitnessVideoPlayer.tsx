'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { WitnessVideo } from '@/lib/types';

interface WitnessVideoPlayerProps {
  video: WitnessVideo;
  lang: string;
  arcSlug: string;
}

export function WitnessVideoPlayer({ video, lang, arcSlug }: WitnessVideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  const connectPath = `/${lang}/${arcSlug}/connect`;

  useEffect(() => {
    async function attemptAutoplay() {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      try {
        await videoElement.play();
        setNeedsTapToPlay(false);
      } catch {
        setNeedsTapToPlay(true);
      }
    }

    void attemptAutoplay();
  }, [video.id]);

  async function togglePlayback() {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (!videoElement.paused && !videoElement.ended) {
      videoElement.pause();
      return;
    }

    try {
      await videoElement.play();
      setNeedsTapToPlay(false);
    } catch {
      setNeedsTapToPlay(true);
    }
  }

  return (
    <div
      role="main"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {isInitialLoading || isBuffering ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-witness-pulse"
          style={{ backgroundColor: 'var(--surface)', opacity: 0.3 }}
        />
      ) : null}

      {video.speaker_name ? (
        <p
          className="absolute left-4 top-4 z-30 text-sm"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-ui)' }}
        >
          {video.speaker_name}
        </p>
      ) : null}

      <video
        ref={videoRef}
        poster={video.poster_url ?? undefined}
        autoPlay
        muted={false}
        playsInline
        preload="metadata"
        aria-label={video.speaker_name ? `Witness: ${video.speaker_name}` : 'Witness video'}
        onClick={() => {
          void togglePlayback();
        }}
        onLoadedData={() => setIsInitialLoading(false)}
        onCanPlay={() => setIsBuffering(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setNeedsTapToPlay(false);
        }}
        onError={() => {
          setIsInitialLoading(false);
          setIsBuffering(false);
        }}
        className="relative z-20 w-full max-w-[360px] object-contain"
      >
        {video.caption_url ? <track kind="captions" src={video.caption_url} default /> : null}
      </video>

      {video.caption_url ? null : <span className="sr-only">No captions available for this video.</span>}

      {needsTapToPlay ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <span
            className="rounded-md px-4 py-2 text-sm"
            style={{ color: 'var(--text-primary)', backgroundColor: 'var(--surface)' }}
          >
            Tap to play
          </span>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Skip witness video"
        onClick={() => router.push(connectPath)}
        className="absolute bottom-6 right-6 z-30 border-0 bg-transparent p-0 text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}
      >
        Skip →
      </button>

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
