'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { EMOTIONAL_ENTRY_KEYS, type EmotionalEntryKey, isEmotionalKey } from '@/lib/constants';

export const EMOTIONAL_ENTRY_FALLBACK_SLUG = 'the-king-who-came';

export interface EmotionalEntryScreenProps {
  arcs: Array<{
    slug: string;
    emotional_key: EmotionalEntryKey | null;
    title: string;
    tagline: string;
    startSceneId: string | null;
  }>;
  lang: string;
}

const ENTRY_COPY: Record<
  EmotionalEntryKey,
  { title: string; subtitle: string; accent: string; surface: string; text: string }
> = {
  grief: {
    title: 'grief',
    subtitle: 'Something is gone, and the ache stays with you.',
    accent: '#9b3a6e',
    surface: 'rgba(155,58,110,0.12)',
    text: '#f6d7e6',
  },
  doubt: {
    title: 'doubt',
    subtitle: 'You want something true enough to trust.',
    accent: '#64748b',
    surface: 'rgba(100,116,139,0.14)',
    text: '#dce5f1',
  },
  searching: {
    title: 'searching',
    subtitle: 'You feel the pull of something more, but not yet its name.',
    accent: '#fbbf24',
    surface: 'rgba(251,191,36,0.12)',
    text: '#fff4cc',
  },
  curiosity: {
    title: 'curiosity',
    subtitle: 'You are not convinced. You are still open.',
    accent: '#14b8a6',
    surface: 'rgba(20,184,166,0.12)',
    text: '#d1fbf4',
  },
  anger: {
    title: 'anger',
    subtitle: 'Something in you is loud, raw, and unresolved.',
    accent: '#dc2626',
    surface: 'rgba(220,38,38,0.12)',
    text: '#ffd7d7',
  },
};

export function EmotionalEntryScreen({ arcs, lang }: EmotionalEntryScreenProps) {
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let masterGain: GainNode | null = null;
    let stopped = false;
    let noteTimer: ReturnType<typeof setTimeout> | null = null;

    // Notes to cycle through (Hz) — a slow minor-ish sequence
    // A1, E1, D2, G1 — deep, melancholic, musical
    const NOTE_SEQUENCE = [55, 41.2, 73.4, 49, 61.7, 36.7];
    // Time to hold each note before gliding to next (ms)
    const NOTE_DURATION = 7000;
    // Glide time (how long the frequency transition takes, in seconds for Web Audio)
    const GLIDE_TIME = 3.5;

    function buildDrone(audioCtx: AudioContext): {
      setFrequency: (hz: number, glideTime: number) => void;
      masterGain: GainNode;
    } {
      const master = audioCtx.createGain();
      master.gain.value = 0;
      master.connect(audioCtx.destination);

      // Simple feedback delay for reverb feel
      const delay = audioCtx.createDelay(0.5);
      delay.delayTime.value = 0.28;
      const delayGain = audioCtx.createGain();
      delayGain.gain.value = 0.35;
      delay.connect(delayGain);
      delayGain.connect(delay);
      delayGain.connect(master);

      // 4 oscillators: root, slightly detuned +2Hz, slightly detuned -2Hz, perfect fifth
      const oscillators: OscillatorNode[] = [];
      const configs = [
        { detune: 0, gainVal: 0.35, type: 'sine' as OscillatorType },
        { detune: 2, gainVal: 0.2, type: 'sine' as OscillatorType },
        { detune: -2, gainVal: 0.2, type: 'sine' as OscillatorType },
        { detune: 0, gainVal: 0.12, type: 'triangle' as OscillatorType, fifthMultiplier: 1.5 },
      ];

      configs.forEach((cfg) => {
        const osc = audioCtx.createOscillator();
        osc.type = cfg.type;
        osc.frequency.value = NOTE_SEQUENCE[0] * (cfg.fifthMultiplier ?? 1) + cfg.detune;

        const oscGain = audioCtx.createGain();
        oscGain.gain.value = cfg.gainVal;

        osc.connect(oscGain);
        oscGain.connect(delay);
        oscGain.connect(master);
        osc.start();
        oscillators.push(osc);
      });

      function setFrequency(hz: number, glideTime: number) {
        const now = audioCtx.currentTime;
        configs.forEach((cfg, i) => {
          const targetHz = hz * (cfg.fifthMultiplier ?? 1) + cfg.detune;
          oscillators[i].frequency.setTargetAtTime(targetHz, now, glideTime / 3);
        });
      }

      return { setFrequency, masterGain: master };
    }

    function scheduleNotes(setFrequency: (hz: number, glide: number) => void, noteIndex: number) {
      if (stopped) return;
      const hz = NOTE_SEQUENCE[noteIndex % NOTE_SEQUENCE.length];
      setFrequency(hz, GLIDE_TIME);
      noteTimer = setTimeout(() => {
        scheduleNotes(setFrequency, noteIndex + 1);
      }, NOTE_DURATION);
    }

    function start() {
      if (stopped) return;
      try {
        ctx = new AudioContext();
        const { setFrequency, masterGain: mg } = buildDrone(ctx);
        masterGain = mg;

        // Fade in master gain over 4s
        const now = ctx.currentTime;
        mg.gain.setValueAtTime(0, now);
        mg.gain.linearRampToValueAtTime(0.45, now + 4);

        // Start cycling notes after the initial fade in
        setTimeout(() => scheduleNotes(setFrequency, 1), 2000);

        // If context is suspended (autoplay policy), resume on first interaction
        if (ctx.state === 'suspended') {
          const resume = () => ctx?.resume();
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        }
      } catch {
        // Web Audio not available
      }
    }

    start();

    return () => {
      stopped = true;
      if (noteTimer) clearTimeout(noteTimer);
      if (ctx && masterGain) {
        // Fade out master gain over 1.5s then close context
        const now = ctx.currentTime;
        masterGain.gain.setTargetAtTime(0, now, 0.5);
        setTimeout(() => {
          ctx?.close().catch(() => {});
        }, 1500);
      }
    };
  }, []);

  const arcByKey = new Map<
    EmotionalEntryKey,
    { slug: string; startSceneId: string | null; tagline: string }
  >();

  for (const arc of arcs) {
    if (!isEmotionalKey(arc.emotional_key)) {
      continue;
    }

    if (!arcByKey.has(arc.emotional_key)) {
      arcByKey.set(arc.emotional_key, {
        slug: arc.slug,
        startSceneId: arc.startSceneId,
        tagline: arc.tagline,
      });
    }
  }

  function handleSelect(emotionalKey: EmotionalEntryKey) {
    const selectedArc = arcByKey.get(emotionalKey);
    const slug = selectedArc?.slug ?? EMOTIONAL_ENTRY_FALLBACK_SLUG;
    const nextUrl = selectedArc?.startSceneId ? `/${lang}/${slug}?scene=${selectedArc.startSceneId}` : `/${lang}/${slug}`;

    document.documentElement.setAttribute('data-key', emotionalKey);
    window.location.assign(nextUrl);
  }

  return (
    <main
      role="main"
      className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-8"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%), linear-gradient(180deg, #09080a 0%, #0d0a05 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[10%] top-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 right-[8%] h-44 w-44 rounded-full bg-amber-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col justify-center">
        <div className="mb-10 max-w-xl">
          <p
            className="mb-4 text-xs uppercase tracking-[0.28em] text-white/35"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Gospel Story
          </p>
          <h1
            className="text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[0.95] text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            What are you carrying right now?
          </h1>
          <p
            className="mt-5 max-w-lg text-base leading-7 text-white/58 sm:text-lg"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Choose the word that feels closest. The story will meet you there.
          </p>
        </div>

        <div className="grid gap-3">
          {EMOTIONAL_ENTRY_KEYS.map((key) => {
            const copy = ENTRY_COPY[key];
            const selectedArc = arcByKey.get(key);
            const detail = selectedArc?.tagline?.trim() || copy.subtitle;

            return (
              <button
                key={key}
                type="button"
                aria-label={`Choose ${copy.title}`}
                onClick={() => handleSelect(key)}
                className="group relative overflow-hidden rounded-[28px] border px-5 py-5 text-left transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:px-6 sm:py-6"
                style={
                  {
                    borderColor: `${copy.accent}40`,
                    background: `linear-gradient(135deg, ${copy.surface} 0%, rgba(255,255,255,0.02) 100%)`,
                    '--entry-accent': copy.accent,
                  } as CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: copy.accent }}
                />
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span
                      className="block text-[1.75rem] font-medium capitalize sm:text-[2rem]"
                      style={{ color: copy.text, fontFamily: 'var(--font-narrative)' }}
                    >
                      {copy.title}
                    </span>
                    <span
                      className="mt-2 block max-w-xl text-sm leading-6 text-white/55 sm:text-base"
                      style={{ fontFamily: 'var(--font-narrative)' }}
                    >
                      {detail}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-2 text-sm uppercase tracking-[0.24em] text-white/28 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Enter
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
