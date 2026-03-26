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
          style={{
            filter: lightWorld ? 'saturate(1.08) contrast(1.02) brightness(1.01)' : 'saturate(1.04) contrast(1.06)',
          }}
        />
      ) : null}

      {!sceneAsset ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 200"
          preserveAspectRatio="xMidYMid slice"
        >
        {emotionalKey === 'grief' ? (
          <g>
            <rect x="0" y="0" width="320" height="200" fill="rgba(10,3,7,0.98)" />
            {/* Stars */}
            <circle cx="108" cy="10" r="1.0" fill="rgba(255,210,225,0.55)" />
            <circle cx="143" cy="6" r="0.7" fill="rgba(255,210,225,0.4)" />
            <circle cx="172" cy="16" r="1.2" fill="rgba(255,210,225,0.65)" />
            <circle cx="128" cy="28" r="0.8" fill="rgba(255,210,225,0.45)" />
            <circle cx="191" cy="22" r="0.9" fill="rgba(255,210,225,0.5)" />
            <circle cx="157" cy="13" r="0.7" fill="rgba(255,210,225,0.4)" />
            <circle cx="152" cy="40" r="0.8" fill="rgba(255,210,225,0.35)" />
            <circle cx="119" cy="46" r="1.0" fill="rgba(255,210,225,0.5)" />
            <circle cx="198" cy="35" r="0.7" fill="rgba(255,210,225,0.42)" />
            <circle cx="168" cy="52" r="0.6" fill="rgba(255,210,225,0.32)" />
            <circle cx="135" cy="55" r="0.9" fill="rgba(255,210,225,0.38)" />
            <circle cx="178" cy="44" r="0.7" fill="rgba(255,210,225,0.3)" />
            {/* Crescent moon */}
            <circle cx="198" cy="20" r="11" fill="rgba(210,160,180,0.22)" />
            <circle cx="204" cy="17" r="9" fill="rgba(10,3,7,0.98)" />
            {/* Stone wall background courses */}
            <rect x="80" y="52" width="160" height="5" rx="1" fill="rgba(75,35,50,0.45)" />
            <rect x="80" y="61" width="160" height="5" rx="1" fill="rgba(70,32,46,0.38)" />
            <rect x="80" y="70" width="160" height="5" rx="1" fill="rgba(75,35,50,0.32)" />
            {/* Stone joints */}
            <rect x="92" y="56" width="3" height="5" fill="rgba(10,3,7,0.5)" />
            <rect x="127" y="56" width="3" height="5" fill="rgba(10,3,7,0.5)" />
            <rect x="162" y="56" width="3" height="5" fill="rgba(10,3,7,0.5)" />
            <rect x="197" y="56" width="3" height="5" fill="rgba(10,3,7,0.5)" />
            <rect x="110" y="65" width="3" height="5" fill="rgba(10,3,7,0.45)" />
            <rect x="145" y="65" width="3" height="5" fill="rgba(10,3,7,0.45)" />
            <rect x="180" y="65" width="3" height="5" fill="rgba(10,3,7,0.45)" />
            {/* Bare branch left */}
            <path
              d="M 100 90 L 108 72 M 108 72 L 104 56 M 108 72 L 116 63 M 104 56 L 111 46 M 104 56 L 98 50"
              stroke="rgba(55,22,36,0.55)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Bare branch right */}
            <path
              d="M 220 85 L 213 68 M 213 68 L 218 54 M 213 68 L 206 60 M 218 54 L 223 44"
              stroke="rgba(55,22,36,0.45)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Well structure */}
            {/* Well shaft body */}
            <path d="M 134 112 L 131 157 L 189 157 L 186 112 Z" fill="rgba(42,14,26,0.92)" />
            {/* Well rim stones */}
            <rect x="130" y="104" width="11" height="9" rx="1.5" fill="rgba(88,42,58,0.75)" />
            <rect x="144" y="101" width="11" height="9" rx="1.5" fill="rgba(88,42,58,0.75)" />
            <rect x="158" y="100" width="11" height="9" rx="1.5" fill="rgba(88,42,58,0.75)" />
            <rect x="172" y="101" width="11" height="9" rx="1.5" fill="rgba(88,42,58,0.75)" />
            <rect x="183" y="104" width="11" height="9" rx="1.5" fill="rgba(88,42,58,0.75)" />
            {/* Well opening ellipse */}
            <ellipse cx="160" cy="110" rx="30" ry="9" fill="rgba(22,6,14,0.95)" />
            <ellipse cx="160" cy="110" rx="30" ry="9" fill="none" stroke="rgba(110,55,75,0.6)" strokeWidth="2.5" />
            {/* Well rope */}
            <line x1="160" y1="108" x2="160" y2="150" stroke="rgba(110,75,85,0.55)" strokeWidth="1.5" strokeDasharray="3,2" />
            {/* Water shimmer — animated */}
            <motion.ellipse
              cx="160"
              cy="150"
              rx="20"
              ry="5"
              fill="rgba(139,45,80,0.45)"
              animate={{ opacity: prefersReduced ? 0.45 : [0.3, 0.6, 0.3], scaleX: prefersReduced ? 1 : [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut' }}
              style={{ transformOrigin: '160px 150px' }}
            />
            <ellipse cx="160" cy="150" rx="12" ry="3" fill="rgba(180,100,130,0.3)" />
            {/* Crossbeam above well */}
            <rect x="133" y="95" width="54" height="4" rx="2" fill="rgba(65,30,45,0.7)" />
            <rect x="133" y="93" width="5" height="20" rx="1" fill="rgba(65,30,45,0.65)" />
            <rect x="182" y="93" width="5" height="20" rx="1" fill="rgba(65,30,45,0.65)" />
            {/* Ground cobblestones */}
            <rect x="0" y="157" width="320" height="43" fill="rgba(16,6,11,0.98)" />
            <rect x="94" y="160" width="22" height="7" rx="2" fill="rgba(38,16,26,0.65)" />
            <rect x="120" y="164" width="19" height="7" rx="2" fill="rgba(38,16,26,0.58)" />
            <rect x="183" y="161" width="22" height="7" rx="2" fill="rgba(38,16,26,0.62)" />
            <rect x="207" y="166" width="18" height="7" rx="2" fill="rgba(38,16,26,0.5)" />
            <rect x="142" y="168" width="16" height="6" rx="2" fill="rgba(38,16,26,0.45)" />
            <rect x="163" y="172" width="20" height="6" rx="2" fill="rgba(38,16,26,0.4)" />
            {/* Ground cracks */}
            <path d="M 108 162 L 128 170 L 122 183" stroke="rgba(70,28,44,0.4)" strokeWidth="1" fill="none" />
            <path d="M 208 166 L 192 174 L 198 188" stroke="rgba(70,28,44,0.35)" strokeWidth="1" fill="none" />
            {/* Fog/mist at base of wall */}
            <rect x="80" y="75" width="160" height="30" fill="url(#griefMist)" opacity="0.3" />
            <defs>
              <linearGradient id="griefMist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(139,45,66,0)" />
                <stop offset="100%" stopColor="rgba(139,45,66,0.3)" />
              </linearGradient>
            </defs>
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
            {/* Ceiling — dark vault suggestion */}
            <path d="M 96 0 Q 160 35 224 0" fill="rgba(15,20,38,0.95)" />
            <path d="M 96 0 Q 160 45 224 0 L 224 55 L 96 55 Z" fill="rgba(12,17,32,0.9)" />
            {/* Ceiling stone lines */}
            <path d="M 96 18 Q 160 48 224 18" stroke="rgba(50,65,100,0.3)" strokeWidth="1.2" fill="none" />
            <path d="M 96 34 Q 160 60 224 34" stroke="rgba(50,65,100,0.25)" strokeWidth="1" fill="none" />
            {/* Left column — more detailed with base and capital */}
            <rect x="92" y="58" width="26" height="4" rx="1" fill="rgba(160,175,200,0.55)" />
            {/* capital top */}
            <rect x="95" y="62" width="20" height="100" fill="rgba(130,148,175,0.55)" />
            {/* shaft */}
            {/* Column fluting lines */}
            <line x1="100" y1="65" x2="100" y2="158" stroke="rgba(100,115,145,0.25)" strokeWidth="0.8" />
            <line x1="105" y1="65" x2="105" y2="158" stroke="rgba(100,115,145,0.2)" strokeWidth="0.8" />
            <line x1="110" y1="65" x2="110" y2="158" stroke="rgba(100,115,145,0.2)" strokeWidth="0.8" />
            <rect x="92" y="158" width="26" height="5" rx="1" fill="rgba(160,175,200,0.5)" />
            {/* base */}
            <rect x="90" y="163" width="30" height="4" rx="1" fill="rgba(150,165,195,0.45)" />
            {/* plinth */}
            {/* Right column — mirrored */}
            <rect x="202" y="58" width="26" height="4" rx="1" fill="rgba(160,175,200,0.55)" />
            <rect x="205" y="62" width="20" height="100" fill="rgba(130,148,175,0.55)" />
            <line x1="210" y1="65" x2="210" y2="158" stroke="rgba(100,115,145,0.25)" strokeWidth="0.8" />
            <line x1="215" y1="65" x2="215" y2="158" stroke="rgba(100,115,145,0.2)" strokeWidth="0.8" />
            <line x1="220" y1="65" x2="220" y2="158" stroke="rgba(100,115,145,0.2)" strokeWidth="0.8" />
            <rect x="202" y="158" width="26" height="5" rx="1" fill="rgba(160,175,200,0.5)" />
            <rect x="198" y="163" width="30" height="4" rx="1" fill="rgba(150,165,195,0.45)" />
            {/* Arch connecting columns */}
            <path d="M 96 62 Q 160 20 224 62" fill="none" stroke="rgba(120,140,175,0.5)" strokeWidth="5" />
            <path d="M 96 62 Q 160 20 224 62" fill="none" stroke="rgba(80,100,140,0.35)" strokeWidth="9" />
            {/* Light through arch — animated */}
            <motion.ellipse
              cx="160"
              cy="62"
              rx="50"
              ry="18"
              fill="rgba(74,111,165,0.18)"
              animate={{ opacity: prefersReduced ? 0.18 : [0.1, 0.28, 0.1] }}
              transition={{ duration: 5, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut' }}
            />
            {/* Floating dust particles in light beam */}
            <circle cx="148" cy="75" r="0.8" fill="rgba(180,200,230,0.35)" />
            <circle cx="162" cy="68" r="0.6" fill="rgba(180,200,230,0.3)" />
            <circle cx="172" cy="80" r="0.7" fill="rgba(180,200,230,0.28)" />
            <circle cx="155" cy="88" r="0.5" fill="rgba(180,200,230,0.25)" />
            <circle cx="168" cy="95" r="0.6" fill="rgba(180,200,230,0.2)" />
            {/* Floor tiles */}
            <rect x="0" y="163" width="320" height="37" fill="rgba(12,16,28,0.97)" />
            <line x1="96" y1="163" x2="96" y2="200" stroke="rgba(50,65,95,0.35)" strokeWidth="1" />
            <line x1="224" y1="163" x2="224" y2="200" stroke="rgba(50,65,95,0.35)" strokeWidth="1" />
            <line x1="96" y1="175" x2="224" y2="175" stroke="rgba(50,65,95,0.25)" strokeWidth="0.8" />
            <line x1="96" y1="187" x2="224" y2="187" stroke="rgba(50,65,95,0.2)" strokeWidth="0.8" />
            {/* Column shadows on floor */}
            <path d="M 121 163 L 104 200 L 96 200 L 96 163 Z" fill="rgba(8,11,20,0.5)" />
            <path d="M 199 163 L 216 200 L 224 200 L 224 163 Z" fill="rgba(8,11,20,0.5)" />
            {/* Darkness beyond arch */}
            <rect x="121" y="62" width="78" height="105" fill="rgba(5,8,15,0.85)" />
            {/* Figure standing in archway has a shadow ellipse */}
            <ellipse cx="160" cy="164" rx="14" ry="4" fill="rgba(5,8,15,0.7)" />
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
            {/* Pre-dawn sky gradient band */}
            <rect x="0" y="0" width="320" height="70" fill="rgba(8,6,3,0.95)" />
            {/* Horizon amber glow */}
            <ellipse cx="160" cy="98" rx="140" ry="28" fill="rgba(196,131,42,0.18)" />
            <ellipse cx="160" cy="98" rx="90" ry="16" fill="rgba(220,160,60,0.15)" />
            {/* Horizon line */}
            <rect x="0" y="96" width="320" height="2.5" fill="rgba(196,131,42,0.45)" />
            {/* Distant city silhouette on horizon */}
            <rect x="108" y="84" width="8" height="12" fill="rgba(30,20,8,0.8)" />
            <rect x="119" y="80" width="6" height="16" fill="rgba(30,20,8,0.85)" />
            <rect x="128" y="86" width="10" height="10" fill="rgba(30,20,8,0.75)" />
            <rect x="141" y="82" width="5" height="14" fill="rgba(30,20,8,0.8)" />
            <rect x="149" y="88" width="8" height="8" fill="rgba(30,20,8,0.7)" />
            <rect x="160" y="83" width="6" height="13" fill="rgba(30,20,8,0.8)" />
            <rect x="169" y="79" width="7" height="17" fill="rgba(30,20,8,0.85)" />
            <rect x="179" y="85" width="9" height="11" fill="rgba(30,20,8,0.75)" />
            <rect x="191" y="81" width="5" height="15" fill="rgba(30,20,8,0.8)" />
            {/* Far mountain layer */}
            <path d="M 0 96 L 80 60 L 130 96 Z" fill="rgba(25,18,8,0.75)" />
            <path d="M 100 96 L 170 42 L 240 96 Z" fill="rgba(28,20,9,0.8)" />
            <path d="M 190 96 L 260 55 L 320 96 Z" fill="rgba(25,18,8,0.72)" />
            {/* Near mountain layer */}
            <path d="M 0 96 L 60 72 L 110 96 Z" fill="rgba(18,13,5,0.88)" />
            <path d="M 80 96 L 145 58 L 210 96 Z" fill="rgba(20,14,6,0.92)" />
            <path d="M 175 96 L 240 70 L 320 96 Z" fill="rgba(18,13,5,0.85)" />
            {/* Road perspective */}
            <path d="M 140 200 L 152 96 L 168 96 L 180 200 Z" fill="rgba(55,38,16,0.5)" />
            <path d="M 152 96 L 168 96" stroke="rgba(196,131,42,0.35)" strokeWidth="0.8" />
            <line x1="160" y1="100" x2="160" y2="200" stroke="rgba(196,131,42,0.2)" strokeWidth="1" strokeDasharray="4,6" />
            {/* Ground plane */}
            <rect x="0" y="145" width="320" height="55" fill="rgba(14,10,4,0.95)" />
            <rect x="0" y="96" width="320" height="55" fill="rgba(12,9,4,0.7)" />
            {/* Ground texture lines */}
            <line x1="95" y1="155" x2="128" y2="155" stroke="rgba(80,55,20,0.3)" strokeWidth="0.8" />
            <line x1="185" y1="158" x2="220" y2="158" stroke="rgba(80,55,20,0.28)" strokeWidth="0.8" />
            <line x1="95" y1="170" x2="135" y2="170" stroke="rgba(80,55,20,0.22)" strokeWidth="0.8" />
            <line x1="178" y1="173" x2="218" y2="173" stroke="rgba(80,55,20,0.22)" strokeWidth="0.8" />
            {/* Rocks foreground */}
            <ellipse cx="110" cy="168" rx="10" ry="5" fill="rgba(40,28,12,0.7)" />
            <ellipse cx="103" cy="165" rx="6" ry="3" fill="rgba(50,35,15,0.65)" />
            <ellipse cx="212" cy="172" rx="8" ry="4" fill="rgba(40,28,12,0.65)" />
            <ellipse cx="222" cy="169" rx="5" ry="2.5" fill="rgba(50,35,15,0.6)" />
            {/* Sparse dry grass */}
            <line x1="130" y1="155" x2="128" y2="145" stroke="rgba(120,85,30,0.4)" strokeWidth="0.8" />
            <line x1="133" y1="155" x2="135" y2="144" stroke="rgba(120,85,30,0.35)" strokeWidth="0.8" />
            <line x1="192" y1="158" x2="190" y2="147" stroke="rgba(120,85,30,0.38)" strokeWidth="0.8" />
            <line x1="195" y1="158" x2="197" y2="147" stroke="rgba(120,85,30,0.35)" strokeWidth="0.8" />
            {/* Birds on horizon */}
            <path d="M 120 48 Q 123 44 126 48" stroke="rgba(150,110,40,0.45)" strokeWidth="1" fill="none" />
            <path d="M 128 44 Q 131 40 134 44" stroke="rgba(150,110,40,0.38)" strokeWidth="1" fill="none" />
            <path d="M 190 50 Q 193 46 196 50" stroke="rgba(150,110,40,0.42)" strokeWidth="1" fill="none" />
            {/* Figure shadow on ground */}
            <ellipse cx="160" cy="162" rx="10" ry="3.5" fill="rgba(10,7,3,0.75)" />
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
            {/* Soft sky gradient */}
            <rect x="0" y="0" width="320" height="80" fill="rgba(208,238,232,0.92)" />
            {/* Distant hills layered */}
            <path d="M 0 105 Q 80 78 160 90 Q 240 102 320 80 L 320 105 Z" fill="rgba(180,220,215,0.6)" />
            <path d="M 0 110 Q 70 90 160 98 Q 240 106 320 88 L 320 110 Z" fill="rgba(160,210,205,0.5)" />
            {/* Near hill layer */}
            <path d="M 0 118 Q 60 100 140 112 Q 220 124 320 105 L 320 120 Z" fill="rgba(140,195,190,0.55)" />
            {/* Water surface */}
            <rect x="0" y="120" width="320" height="80" fill="rgba(42,122,106,0.18)" />
            <rect x="0" y="120" width="320" height="2" fill="rgba(42,122,106,0.35)" />
            {/* water edge */}
            {/* Water reflections — horizontal shimmer lines */}
            <line x1="95" y1="132" x2="135" y2="132" stroke="rgba(42,122,106,0.2)" strokeWidth="1" />
            <line x1="185" y1="136" x2="225" y2="136" stroke="rgba(42,122,106,0.18)" strokeWidth="1" />
            <line x1="110" y1="148" x2="155" y2="148" stroke="rgba(42,122,106,0.15)" strokeWidth="0.8" />
            <line x1="168" y1="152" x2="210" y2="152" stroke="rgba(42,122,106,0.15)" strokeWidth="0.8" />
            <line x1="105" y1="165" x2="145" y2="165" stroke="rgba(42,122,106,0.12)" strokeWidth="0.8" />
            <line x1="175" y1="168" x2="218" y2="168" stroke="rgba(42,122,106,0.12)" strokeWidth="0.8" />
            {/* Ripple circles — animated, expanding */}
            <motion.circle
              cx="160"
              cy="135"
              r="22"
              fill="none"
              stroke="rgba(42,122,106,0.3)"
              strokeWidth="1.2"
              animate={{ r: prefersReduced ? 22 : [18, 30, 18], opacity: prefersReduced ? 0.3 : [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: loopRepeat, ease: 'easeOut' }}
            />
            <motion.circle
              cx="160"
              cy="135"
              r="38"
              fill="none"
              stroke="rgba(42,122,106,0.22)"
              strokeWidth="1"
              animate={{ r: prefersReduced ? 38 : [30, 48, 30], opacity: prefersReduced ? 0.22 : [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: loopRepeat, ease: 'easeOut', delay: 0.8 }}
            />
            <motion.circle
              cx="160"
              cy="135"
              r="55"
              fill="none"
              stroke="rgba(42,122,106,0.15)"
              strokeWidth="0.8"
              animate={{ r: prefersReduced ? 55 : [44, 65, 44], opacity: prefersReduced ? 0.15 : [0.22, 0, 0.22] }}
              transition={{ duration: 3, repeat: loopRepeat, ease: 'easeOut', delay: 1.6 }}
            />
            {/* Shore reeds left */}
            <line x1="110" y1="120" x2="108" y2="100" stroke="rgba(15,80,70,0.5)" strokeWidth="1.2" />
            <line x1="115" y1="120" x2="117" y2="99" stroke="rgba(15,80,70,0.45)" strokeWidth="1" />
            <line x1="120" y1="120" x2="118" y2="102" stroke="rgba(15,80,70,0.4)" strokeWidth="1" />
            <ellipse cx="108" cy="99" rx="3" ry="5" fill="rgba(15,80,70,0.45)" />
            <ellipse cx="117" cy="98" rx="2.5" ry="4" fill="rgba(15,80,70,0.4)" />
            {/* Shore reeds right */}
            <line x1="205" y1="120" x2="203" y2="101" stroke="rgba(15,80,70,0.48)" strokeWidth="1.2" />
            <line x1="210" y1="120" x2="212" y2="100" stroke="rgba(15,80,70,0.42)" strokeWidth="1" />
            <ellipse cx="203" cy="100" rx="3" ry="4.5" fill="rgba(15,80,70,0.42)" />
            {/* Shore ground */}
            <path d="M 0 118 L 320 118 L 320 125 Q 200 122 160 124 Q 120 126 0 122 Z" fill="rgba(180,220,210,0.5)" />
            {/* Light rays from sun — subtle */}
            <path d="M 195 0 L 155 120 L 170 120 Z" fill="rgba(42,122,106,0.05)" />
            <path d="M 195 0 L 140 120 L 155 120 Z" fill="rgba(42,122,106,0.04)" />
            <path d="M 195 0 L 170 120 L 185 120 Z" fill="rgba(42,122,106,0.06)" />
            {/* Birds */}
            <path d="M 130 38 Q 133 34 136 38" stroke="rgba(42,100,90,0.5)" strokeWidth="1" fill="none" />
            <path d="M 138 32 Q 141 28 144 32" stroke="rgba(42,100,90,0.42)" strokeWidth="1" fill="none" />
            <path d="M 174 42 Q 177 38 180 42" stroke="rgba(42,100,90,0.45)" strokeWidth="1" fill="none" />
            {/* Figure standing shadow on shore */}
            <ellipse cx="159" cy="125" rx="10" ry="3" fill="rgba(15,80,70,0.25)" />
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
            {/* Deep red sky glow from below */}
            <ellipse cx="160" cy="200" rx="180" ry="80" fill="rgba(181,32,32,0.22)" />
            <ellipse cx="160" cy="200" rx="100" ry="50" fill="rgba(220,38,38,0.18)" />
            {/* Background broken architecture */}
            <rect x="96" y="40" width="18" height="100" fill="rgba(30,8,8,0.88)" />
            {/* broken pillar left */}
            <path d="M 96 40 L 105 30 L 118 42" fill="rgba(40,10,10,0.9)" />
            {/* broken top left */}
            <rect x="206" y="55" width="18" height="85" fill="rgba(30,8,8,0.85)" />
            {/* broken pillar right */}
            <path d="M 206 55 L 215 42 L 224 56" fill="rgba(40,10,10,0.88)" />
            {/* broken top right */}
            {/* More shards — large dramatic ones */}
            <path d="M 160 200 L 118 95 L 138 88 Z" fill="rgba(181,32,32,0.48)" />
            <path d="M 160 200 L 202 92 L 182 85 Z" fill="rgba(181,32,32,0.52)" />
            <path d="M 160 200 L 105 130 L 88 160 Z" fill="rgba(181,32,32,0.42)" />
            <path d="M 160 200 L 215 125 L 232 155 Z" fill="rgba(181,32,32,0.46)" />
            {/* Smaller shards */}
            <path d="M 130 165 L 118 148 L 122 165 Z" fill="rgba(181,32,32,0.35)" />
            <path d="M 195 168 L 208 150 L 204 168 Z" fill="rgba(181,32,32,0.38)" />
            <path d="M 140 180 L 132 170 L 143 172 Z" fill="rgba(200,40,40,0.32)" />
            <path d="M 185 178 L 193 168 L 182 172 Z" fill="rgba(200,40,40,0.35)" />
            {/* Ground cracks — glowing fissures */}
            <path d="M 160 200 L 120 160" stroke="rgba(220,38,38,0.65)" strokeWidth="2.5" fill="none" />
            <path d="M 120 160 L 100 145" stroke="rgba(220,38,38,0.5)" strokeWidth="1.8" fill="none" />
            <path d="M 120 160 L 115 175" stroke="rgba(220,38,38,0.45)" strokeWidth="1.5" fill="none" />
            <path d="M 160 200 L 200 158" stroke="rgba(220,38,38,0.65)" strokeWidth="2.5" fill="none" />
            <path d="M 200 158 L 220 145" stroke="rgba(220,38,38,0.5)" strokeWidth="1.8" fill="none" />
            <path d="M 200 158 L 205 175" stroke="rgba(220,38,38,0.45)" strokeWidth="1.5" fill="none" />
            <path d="M 160 200 L 160 155" stroke="rgba(220,38,38,0.55)" strokeWidth="2" fill="none" />
            {/* Glow along cracks — animated */}
            <motion.path
              d="M 160 200 L 120 160 L 100 145"
              stroke="rgba(255,80,80,0.4)"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: prefersReduced ? 0.4 : [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut' }}
            />
            <motion.path
              d="M 160 200 L 200 158 L 220 145"
              stroke="rgba(255,80,80,0.4)"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: prefersReduced ? 0.4 : [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.8, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut', delay: 0.4 }}
            />
            {/* Background crack lines (distant) */}
            <line x1="130" y1="40" x2="155" y2="85" stroke="rgba(181,32,32,0.28)" strokeWidth="1" />
            <line x1="185" y1="38" x2="165" y2="82" stroke="rgba(181,32,32,0.25)" strokeWidth="1" />
            <line x1="150" y1="30" x2="160" y2="78" stroke="rgba(181,32,32,0.22)" strokeWidth="0.8" />
            {/* Ground plane */}
            <rect x="0" y="160" width="320" height="40" fill="rgba(12,3,3,0.96)" />
            {/* Debris on ground */}
            <path d="M 110 168 L 118 163 L 116 172 Z" fill="rgba(60,15,15,0.7)" />
            <path d="M 208 170 L 216 164 L 215 173 Z" fill="rgba(60,15,15,0.65)" />
            <ellipse cx="130" cy="172" rx="8" ry="3" fill="rgba(40,10,10,0.65)" />
            <ellipse cx="192" cy="174" rx="7" ry="2.5" fill="rgba(40,10,10,0.6)" />
            {/* Heat shimmer lines rising — animated */}
            <motion.line
              x1="148"
              y1="155"
              x2="145"
              y2="125"
              stroke="rgba(220,80,80,0.2)"
              strokeWidth="0.8"
              animate={{ opacity: prefersReduced ? 0.2 : [0.1, 0.3, 0.1], x1: prefersReduced ? 148 : [148, 146, 148] }}
              transition={{ duration: 2.2, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut' }}
            />
            <motion.line
              x1="172"
              y1="155"
              x2="175"
              y2="120"
              stroke="rgba(220,80,80,0.18)"
              strokeWidth="0.8"
              animate={{ opacity: prefersReduced ? 0.18 : [0.08, 0.28, 0.08], x1: prefersReduced ? 172 : [172, 174, 172] }}
              transition={{ duration: 2.6, repeat: loopRepeat, repeatType: 'mirror', ease: 'easeInOut', delay: 0.6 }}
            />
            {/* Figure anger glow */}
            <ellipse cx="160" cy="140" rx="22" ry="35" fill="rgba(181,32,32,0.14)" />
            {/* Figure shadow on ground */}
            <ellipse cx="160" cy="164" rx="12" ry="4" fill="rgba(8,2,2,0.8)" />
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
      ) : null}

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={prefersReduced ? { opacity: 0.94 } : { opacity: [0.88, 0.97, 0.88] }}
        transition={prefersReduced ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: overlayFor(emotionalKey, lightWorld) }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.015) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0.14) 100%), radial-gradient(circle at center, rgba(255,255,255,0) 48%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </div>
  );
}
