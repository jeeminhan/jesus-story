'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onNearEnd?: () => void;
}

export function AudioPlayer({ audioUrl, onNearEnd }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const nearEndCalled = useRef(false);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    nearEndCalled.current = false;
  }, [audioUrl]);

  if (!audioUrl) {
    return null;
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) {
      return;
    }

    const nextProgress = audio.currentTime / audio.duration;
    setProgress(nextProgress);

    if (nextProgress >= 0.8 && !nearEndCalled.current) {
      nearEndCalled.current = true;
      onNearEnd?.();
    }
  }

  function handleEnded() {
    setPlaying(false);
    onNearEnd?.();
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <div
      className="rounded-[20px] border px-3.5 py-3"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />

      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div
            className="text-[0.62rem] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Narration
          </div>
          <div className="truncate text-[0.9rem]" style={{ color: 'var(--text-primary)' }}>
            {playing ? 'Playing now' : 'Listen to this scene'}
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: 'var(--accent)',
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: 'var(--text-primary)',
          }}
          aria-label={playing ? 'Pause narration' : 'Play narration'}
        >
          {playing ? '||' : '>'}
        </button>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-400/60 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
