'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { EmotionalKey } from '@/lib/constants';

interface MirrorMomentProps {
  emotionalKey: EmotionalKey;
  storyFigure?: string;
  lang: string;
  arcSlug: string;
  onTellMeMore: () => void;
  onLeaveMessage: () => void;
  onSitWithThis: () => void;
  hasWitnessVideo?: boolean;
}

function getTransition(delay: number, reduceMotion: boolean) {
  if (reduceMotion) {
    return { duration: 0, delay: 0 };
  }

  return { duration: 0.5, delay };
}

export function MirrorMoment({
  emotionalKey,
  storyFigure = 'the story',
  lang: _lang,
  arcSlug: _arcSlug,
  onTellMeMore,
  onLeaveMessage,
  onSitWithThis,
  hasWitnessVideo = false,
}: MirrorMomentProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [sitting, setSitting] = useState(false);
  const figureName = useMemo(() => storyFigure.trim() || 'the story', [storyFigure]);
  const mood = emotionalKey.trim() || 'this moment';

  if (sitting) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className="max-w-md text-sm"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            You can leave this here for now, or return to the beginning.
          </p>
          <button
            type="button"
            onClick={onSitWithThis}
            className="border-0 bg-transparent p-0 text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            &larr; Beginning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-6 py-10 text-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-10">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          The mirror
        </motion.p>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.8 }}
          className="leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-narrative)',
            fontWeight: 500,
            fontSize: 'clamp(22px, 4vw, 26px)',
          }}
        >
          {`You came in ${mood}. You met ${figureName}.`}
        </motion.p>

        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          {hasWitnessVideo ? (
            <motion.button
              type="button"
              aria-label="Tell me more"
              onClick={onTellMeMore}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0.4, reduceMotion)}
              className="border-0 bg-transparent p-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-narrative)',
                fontSize: '18px',
                opacity: 1,
              }}
            >
              Tell me more
            </motion.button>
          ) : null}

          <motion.button
            type="button"
            aria-label="Talk to someone"
            onClick={onLeaveMessage}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={getTransition(0.7, reduceMotion)}
            className="border-0 bg-transparent p-0 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-narrative)',
              fontSize: '16px',
            }}
          >
            Talk to someone
          </motion.button>

          <motion.button
            type="button"
            aria-label="Sit with this"
            onClick={() => setSitting(true)}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={getTransition(1.0, reduceMotion)}
            className="border-0 bg-transparent p-0 transition-opacity hover:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-narrative)',
              fontSize: '14px',
            }}
          >
            Sit with this
          </motion.button>
        </div>
      </div>
    </div>
  );
}
