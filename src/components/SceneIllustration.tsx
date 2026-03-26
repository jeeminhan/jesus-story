'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface SceneIllustrationProps {
  emotionalKey: string | null;
  sceneSlug?: string | null;
  lightWorld?: boolean;
  className?: string;
  style?: CSSProperties;
}

function overlayFor(emotionalKey: string | null, lightWorld?: boolean) {
  if (lightWorld) {
    return 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 38%, rgba(255,248,235,0.22) 100%)';
  }

  switch (emotionalKey) {
    case 'grief':
      return 'radial-gradient(circle at top, rgba(155,58,110,0.26), transparent 42%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(10,4,8,0.34))';
    case 'doubt':
      return 'radial-gradient(circle at top, rgba(100,116,139,0.22), transparent 42%), linear-gradient(180deg, rgba(0,0,0,0.04), rgba(8,12,22,0.3))';
    case 'curiosity':
      return 'radial-gradient(circle at top, rgba(20,184,166,0.18), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(6,24,22,0.14))';
    case 'anger':
      return 'radial-gradient(circle at top, rgba(220,38,38,0.24), transparent 42%), linear-gradient(180deg, rgba(0,0,0,0.1), rgba(20,0,0,0.34))';
    case 'searching':
    default:
      return 'radial-gradient(circle at top, rgba(251,191,36,0.22), transparent 42%), linear-gradient(180deg, rgba(0,0,0,0.06), rgba(26,18,8,0.24))';
  }
}

export function SceneIllustration({ emotionalKey, sceneSlug, lightWorld, className, style }: SceneIllustrationProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const sceneAsset = sceneSlug ? `/scene-illustrations/${sceneSlug}.svg` : null;
  const loopRepeat = prefersReduced ? 0 : Infinity;

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {sceneAsset ? (
        <motion.img
          src={sceneAsset}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          initial={false}
          animate={
            prefersReduced
              ? { scale: 1, x: 0, y: 0 }
              : { scale: [1.02, 1.05, 1.02], x: [0, -6, 0], y: [0, -8, 0] }
          }
          transition={prefersReduced ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: lightWorld ? 'saturate(1.03)' : 'saturate(0.97)' }}
        />
      ) : null}

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
      >
        {emotionalKey === 'grief' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(10,3,7,0.98)" />
            <circle cx="198" cy="20" r="11" fill="rgba(210,160,180,0.22)" />
            <circle cx="204" cy="17" r="9" fill="rgba(10,3,7,0.98)" />
            <motion.circle
              cx="160"
              cy="122"
              r="26"
              fill="rgba(186, 74, 135, 0.34)"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 0.38, scale: prefersReduced ? 1 : [1, 1.08, 1] }}
              transition={{
                opacity: { duration: 1.1, delay: 0.4 },
                scale: {
                  duration: 4,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 2,
                },
              }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.rect
              x="148"
              y="110"
              width="24"
              height="50"
              rx="10"
              fill="rgba(39, 21, 34, 0.92)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: prefersReduced ? 0 : [0, -3, 0] }}
              transition={{
                opacity: { duration: 1.2, delay: 0.5 },
                y: {
                  duration: 4,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 2,
                },
              }}
            />
            <motion.circle
              cx="160"
              cy="98"
              r="11"
              fill="rgba(39, 21, 34, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: prefersReduced ? 0 : [0, -3, 0] }}
              transition={{
                opacity: { duration: 1, delay: 0.55 },
                y: {
                  duration: 4,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 2,
                },
              }}
            />
          </g>
        ) : null}

        {emotionalKey === 'doubt' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(8,11,20,0.97)" />
            <motion.rect
              x="96"
              y="52"
              width="22"
              height="118"
              rx="8"
              fill="rgba(144, 158, 181, 0.65)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 1 : [0.65, 0.75, 0.65] }}
              transition={{
                opacity: {
                  duration: 6,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1,
                },
              }}
            />
            <motion.rect
              x="202"
              y="52"
              width="22"
              height="118"
              rx="8"
              fill="rgba(144, 158, 181, 0.65)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 1 : [0.65, 0.75, 0.65] }}
              transition={{
                opacity: {
                  duration: 6,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.8,
                },
              }}
            />
            <motion.rect
              x="148"
              y="108"
              width="24"
              height="52"
              rx="10"
              fill="rgba(15, 20, 32, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: prefersReduced ? 0 : [-2, 2, -2] }}
              transition={{
                opacity: { duration: 1.15, delay: 0.55 },
                x: {
                  duration: 5,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 2.5,
                },
              }}
            />
          </g>
        ) : null}

        {emotionalKey === 'searching' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(10,8,4,0.97)" />
            <motion.rect
              x="148"
              y="108"
              width="24"
              height="52"
              rx="10"
              fill="rgba(58, 38, 17, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: prefersReduced ? 0 : [0, -4, 0] }}
              transition={{
                opacity: { duration: 1.1, delay: 0.45 },
                y: {
                  duration: 1.6,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.5,
                },
              }}
            />
            <motion.circle
              cx="160"
              cy="95"
              r="11"
              fill="rgba(58, 38, 17, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: prefersReduced ? 0 : [0, -4, 0] }}
              transition={{
                opacity: { duration: 0.95, delay: 0.5 },
                y: {
                  duration: 1.6,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.5,
                },
              }}
            />
            <motion.rect
              x="178"
              y="92"
              width="5"
              height="84"
              rx="2.5"
              fill="rgba(120, 83, 39, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: prefersReduced ? 0 : [-3, 3, -3] }}
              transition={{
                opacity: { duration: 1.05, delay: 0.55 },
                rotate: {
                  duration: 1.8,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.5,
                },
              }}
              style={{ transformOrigin: 'top center' }}
            />
          </g>
        ) : null}

        {emotionalKey === 'curiosity' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(230,248,244,0.98)" />
            <motion.circle
              cx="195"
              cy="80"
              r="20"
              fill="rgba(250, 204, 21, 0.3)"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 0.78, scale: prefersReduced ? 1 : [1, 1.12, 1] }}
              transition={{
                opacity: { duration: 1, delay: 0.2 },
                scale: {
                  duration: 5,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 0,
                },
              }}
              style={{ transformOrigin: '195px 80px' }}
            />
            <motion.rect
              x="147"
              y="109"
              width="24"
              height="52"
              rx="10"
              fill="rgba(7, 63, 61, 0.9)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: prefersReduced ? 0 : [-1.5, 1.5, -1.5] }}
              transition={{
                opacity: { duration: 1.05, delay: 0.45 },
                x: {
                  duration: 5,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.5,
                },
              }}
            />
            <motion.circle
              cx="159"
              cy="96"
              r="10.5"
              fill="rgba(7, 63, 61, 0.95)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: prefersReduced ? 0 : [-1.5, 1.5, -1.5] }}
              transition={{
                opacity: { duration: 0.95, delay: 0.5 },
                x: {
                  duration: 5,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.5,
                },
              }}
            />
          </g>
        ) : null}

        {emotionalKey === 'anger' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(8,2,2,0.98)" />
            <motion.path
              d="M120 92L144 112L122 132Z"
              fill="rgba(220, 38, 38, 0.5)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 0.5 : [0.5, 0.65, 0.5] }}
              transition={{
                opacity: {
                  duration: 2.1,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 0,
                },
              }}
            />
            <motion.path
              d="M196 90L174 111L197 130Z"
              fill="rgba(220, 38, 38, 0.58)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 0.58 : [0.58, 0.73, 0.58] }}
              transition={{
                opacity: {
                  duration: 2.4,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 0.4,
                },
              }}
            />
            <motion.path
              d="M130 152L151 138L149 168Z"
              fill="rgba(220, 38, 38, 0.45)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 0.45 : [0.45, 0.6, 0.45] }}
              transition={{
                opacity: {
                  duration: 1.9,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 0.8,
                },
              }}
            />
            <motion.path
              d="M188 151L168 138L170 168Z"
              fill="rgba(220, 38, 38, 0.52)"
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReduced ? 0.52 : [0.52, 0.67, 0.52] }}
              transition={{
                opacity: {
                  duration: 2.6,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: 1.2,
                },
              }}
            />
            <motion.rect
              x="148"
              y="109"
              width="24"
              height="52"
              rx="9"
              fill="rgba(36, 5, 6, 0.96)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: prefersReduced ? 0 : [-1.5, 1.5, -1.5] }}
              transition={{
                opacity: { duration: 1, delay: 0.45 },
                x: {
                  duration: 0.18,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'linear',
                  delay: 1,
                },
              }}
            />
            <motion.circle
              cx="160"
              cy="96"
              r="11"
              fill="rgba(36, 5, 6, 0.98)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: prefersReduced ? 0 : [-1.5, 1.5, -1.5] }}
              transition={{
                opacity: { duration: 0.95, delay: 0.5 },
                x: {
                  duration: 0.18,
                  repeat: loopRepeat,
                  repeatType: 'mirror',
                  ease: 'linear',
                  delay: 1,
                },
              }}
            />
          </g>
        ) : null}
      </svg>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={prefersReduced ? { opacity: 1 } : { opacity: [0.82, 1, 0.82] }}
        transition={prefersReduced ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: overlayFor(emotionalKey, lightWorld) }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.18) 100%), radial-gradient(circle at center, rgba(255,255,255,0) 50%, rgba(0,0,0,0.22) 100%)',
        }}
      />
    </div>
  );
}
