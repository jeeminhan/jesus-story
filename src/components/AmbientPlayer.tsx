'use client';

import { useEffect, useRef, useState } from 'react';
import type { EmotionalKey } from '@/lib/constants';

interface AmbientPlayerProps {
  emotionalKey: EmotionalKey | null;
}

const ARC_MUSIC: Record<EmotionalKey, string> = {
  grief: '/music/grief.mp3',
  doubt: '/music/doubt.mp3',
  searching: '/music/searching.mp3',
  curiosity: '/music/curiosity.mp3',
  anger: '/music/anger.mp3',
};

const STORAGE_KEY = 'gospel-ambient-muted';
const TARGET_VOLUME = 0.35;

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

function UnmutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9 2L5 5H2v6h3l4 3V2z" />
      <path
        d="M12 4.5a5 5 0 0 1 0 7M10.5 6a3 3 0 0 1 0 4"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9 2L5 5H2v6h3l4 3V2z" />
      <line x1="12" y1="5" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="5" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AmbientPlayer({ emotionalKey }: AmbientPlayerProps) {
  const [muted, setMuted] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const previousMutedRef = useRef(muted);

  function clearFadeInterval() {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }

  function clearPauseTimeout() {
    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }

  function fadeVolume(audio: HTMLAudioElement, from: number, to: number, durationMs: number) {
    const clampedFrom = clampVolume(from);
    const clampedTo = clampVolume(to);
    const intervalMs = 50;
    const steps = Math.max(1, Math.round(durationMs / intervalMs));
    let step = 0;

    audio.volume = clampedFrom;

    const intervalId = window.setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      audio.volume = clampVolume(clampedFrom + (clampedTo - clampedFrom) * progress);

      if (progress >= 1) {
        window.clearInterval(intervalId);
      }
    }, intervalMs);

    return intervalId;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    clearFadeInterval();
    clearPauseTimeout();

    const nextTrack = emotionalKey ? ARC_MUSIC[emotionalKey] : undefined;
    if (!nextTrack) {
      fadeIntervalRef.current = fadeVolume(audio, audio.volume, 0, 500);
      pauseTimeoutRef.current = window.setTimeout(() => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }, 500);
      return;
    }

    audio.src = nextTrack;
    audio.loop = true;
    audio.volume = 0;
    void audio.play().catch(() => {});

    fadeIntervalRef.current = fadeVolume(audio, 0, muted ? 0 : TARGET_VOLUME, 2000);
  }, [emotionalKey]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || muted || !audio.src || !audio.paused) {
      return;
    }

    let removed = false;

    const attemptGestureResume = () => {
      if (removed) {
        return;
      }

      void audio.play().then(() => {
        clearFadeInterval();
        fadeIntervalRef.current = fadeVolume(audio, audio.volume, TARGET_VOLUME, 500);
        removeListeners();
      }).catch(() => {});
    };

    const removeListeners = () => {
      if (removed) {
        return;
      }

      removed = true;
      document.removeEventListener('pointerdown', attemptGestureResume);
      document.removeEventListener('touchstart', attemptGestureResume);
      document.removeEventListener('click', attemptGestureResume);
      document.removeEventListener('keydown', attemptGestureResume);
    };

    document.addEventListener('pointerdown', attemptGestureResume, { passive: true });
    document.addEventListener('touchstart', attemptGestureResume, { passive: true });
    document.addEventListener('click', attemptGestureResume, { passive: true });
    document.addEventListener('keydown', attemptGestureResume);

    return removeListeners;
  }, [emotionalKey, muted]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(muted));

    if (previousMutedRef.current === muted) {
      return;
    }

    previousMutedRef.current = muted;
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    clearFadeInterval();
    clearPauseTimeout();

    if (muted) {
      fadeIntervalRef.current = fadeVolume(audio, audio.volume, 0, 500);
      return;
    }

    if (!audio.src) {
      return;
    }

    void audio.play().catch(() => {});
    fadeIntervalRef.current = fadeVolume(audio, audio.volume, TARGET_VOLUME, 500);
  }, [muted]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      clearFadeInterval();
      clearPauseTimeout();

      fadeIntervalRef.current = fadeVolume(audio, audio.volume, 0, 1000);
      pauseTimeoutRef.current = window.setTimeout(() => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }, 1000);
    };
  }, []);

  return (
    <div className="pointer-events-auto">
      <audio ref={audioRef} loop preload="auto" style={{ display: 'none' }} />
      <button
        type="button"
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        onClick={() => setMuted((currentMuted) => !currentMuted)}
        className="flex items-center justify-center rounded-full border transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          width: 38,
          height: 38,
          color: muted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.72)',
          borderColor: 'rgba(255,255,255,0.12)',
          backgroundColor: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {muted ? <MutedIcon /> : <UnmutedIcon />}
      </button>
    </div>
  );
}
