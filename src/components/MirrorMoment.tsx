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

const MIRROR_COPY: Record<
  EmotionalKey,
  {
    lead: string;
    reflection: string;
    linger: string;
  }
> = {
  grief: {
    lead: 'You came in carrying grief.',
    reflection: 'You met a story that does not hurry the hurting.',
    linger: 'Nothing is being demanded from you here. You can stay close, reach outward, or leave this in silence.',
  },
  doubt: {
    lead: 'You came in with questions still awake.',
    reflection: 'You met a story that does not shame doubt. It stays long enough to answer it slowly.',
    linger: 'You do not have to force certainty tonight. You can go deeper, ask for a human reply, or step away without pretending.',
  },
  searching: {
    lead: 'You came in looking for something real.',
    reflection: 'You met a story that moved toward you first.',
    linger: 'You can keep following that thread, leave a few honest words, or let the story stay with you awhile.',
  },
  curiosity: {
    lead: 'You came in open, but unconvinced.',
    reflection: 'You met a story that invited attention instead of demanding agreement.',
    linger: 'You can lean in further, leave a note for someone real, or simply keep this question with you.',
  },
  anger: {
    lead: 'You came in carrying heat.',
    reflection: 'You met a story strong enough to hold anger without turning away.',
    linger: 'You do not need to calm yourself down before taking the next step. You can keep going, reach for someone, or leave this here.',
  },
};

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
  const copy = MIRROR_COPY[emotionalKey];
  const primaryLine = copy?.lead ?? `You came in ${mood}.`;
  const secondaryLine = copy?.reflection ?? `You met ${figureName}.`;
  const options = [
    hasWitnessVideo
      ? {
          key: 'tell-me-more',
          label: 'Tell me more',
          detail: 'Hear one honest witness from someone who walked this same road too.',
          onSelect: onTellMeMore,
        }
      : null,
    {
      key: 'leave-a-message',
      label: 'Leave a message',
      detail: 'Write a few words and let a real person read them later, without putting you on the spot.',
      onSelect: onLeaveMessage,
    },
    {
      key: 'sit-with-this',
      label: 'Sit with this',
      detail: 'Leave without explaining yourself. Come back if and when you want.',
      onSelect: () => setSitting(true),
    },
  ].filter(Boolean) as Array<{ key: string; label: string; detail: string; onSelect: () => void }>;

  if (sitting) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }}
      >
        <div className="flex max-w-lg flex-col items-center gap-6 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
          >
            Not yet
          </p>
          <p
            className="max-w-md text-[1.35rem] leading-relaxed"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
          >
            That is enough for now.
          </p>
          <p
            className="max-w-md text-sm leading-7"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            You can leave this here without guilt. If you want to return later, the story will still be here.
          </p>
          <button
            type="button"
            onClick={onSitWithThis}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border px-6 text-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              fontFamily: 'var(--font-narrative)',
            }}
          >
            Return to the beginning
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
          className="leading-[1.15]"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-narrative)',
            fontWeight: 500,
            fontSize: 'clamp(24px, 4vw, 32px)',
          }}
        >
          {primaryLine}
        </motion.p>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.15 }}
          className="max-w-xl text-base leading-8 sm:text-lg"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
        >
          {secondaryLine} In {figureName}, something answered back.
        </motion.p>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.25 }}
          className="max-w-xl text-sm leading-7 sm:text-base"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
        >
          {copy?.linger}
        </motion.p>

        <div className="grid w-full max-w-xl gap-3">
          {options.map((option, index) => (
            <motion.button
              key={option.key}
              type="button"
              aria-label={option.label}
              onClick={option.onSelect}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0.35 + index * 0.18, reduceMotion)}
              className="w-full rounded-[24px] border px-5 py-5 text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
                background:
                  option.key === 'tell-me-more'
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)',
              }}
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span
                    className="block text-[1.15rem] leading-tight"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
                  >
                    {option.label}
                  </span>
                  <span
                    className="mt-2 block max-w-lg text-sm leading-7"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
                  >
                    {option.detail}
                  </span>
                </span>
                <span aria-hidden="true" className="pt-1 text-lg" style={{ color: 'var(--text-secondary)' }}>
                  →
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
