/** Phone mockups showing the same Gospel scene contextualized across languages.
 *  All CSS-only — gradient illustrations, figure silhouettes, typography. */

interface PhoneFrameProps {
  children: React.ReactNode;
  scale?: number;
}

function PhoneFrame({ children, scale = 1 }: PhoneFrameProps) {
  const w = Math.round(220 * scale);
  const h = Math.round(476 * scale);
  const notchW = Math.round(64 * scale);
  const notchH = Math.round(18 * scale);
  const radius = Math.round(32 * scale);

  return (
    <div
      className="shrink-0 relative overflow-hidden"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: `${radius}px`,
        border: '1.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5)',
        background: '#000',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: Math.round(8 * scale),
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${notchW}px`,
          height: `${notchH}px`,
          background: '#000',
          borderRadius: `0 0 ${Math.round(12 * scale)}px ${Math.round(12 * scale)}px`,
          zIndex: 100,
        }}
      />
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: Math.round(6 * scale),
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${notchW}px`,
          height: `${Math.round(3 * scale)}px`,
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.2)',
          zIndex: 50,
        }}
      />
    </div>
  );
}

/* ─── Illustration backgrounds per emotional key ─── */

const GRIEF_BG = [
  'radial-gradient(ellipse at 40% 30%, rgba(155,58,110,0.35) 0%, transparent 55%)',
  'radial-gradient(ellipse at 70% 60%, rgba(87,23,60,0.5) 0%, transparent 50%)',
  'radial-gradient(ellipse at 20% 70%, rgba(34,13,24,0.8) 0%, transparent 45%)',
  'radial-gradient(ellipse at 80% 20%, rgba(60,10,40,0.4) 0%, transparent 40%)',
  'linear-gradient(185deg, #1a0b14 0%, #0e0509 40%, #14080f 100%)',
].join(', ');

const SEARCHING_BG = [
  'radial-gradient(ellipse at 45% 50%, rgba(251,191,36,0.18) 0%, transparent 35%)',
  'radial-gradient(ellipse at 45% 50%, rgba(200,170,100,0.12) 0%, transparent 55%)',
  'linear-gradient(180deg, #2a2520 0%, #1a1612 50%, #0e0b0c 100%)',
].join(', ');

const DOUBT_BG = [
  'radial-gradient(ellipse at 50% 40%, rgba(100,116,139,0.25) 0%, transparent 55%)',
  'radial-gradient(ellipse at 30% 60%, rgba(71,85,105,0.3) 0%, transparent 45%)',
  'linear-gradient(180deg, #141a20 0%, #0e1015 50%, #0a0d10 100%)',
].join(', ');

const CURIOSITY_BG = [
  'radial-gradient(ellipse at 50% 45%, rgba(20,184,166,0.2) 0%, transparent 50%)',
  'radial-gradient(ellipse at 70% 30%, rgba(13,148,136,0.15) 0%, transparent 45%)',
  'linear-gradient(180deg, #071f1d 0%, #051412 50%, #031412 100%)',
].join(', ');

const ANGER_BG = [
  'radial-gradient(ellipse at 40% 40%, rgba(220,38,38,0.2) 0%, transparent 50%)',
  'radial-gradient(ellipse at 65% 60%, rgba(185,28,28,0.25) 0%, transparent 45%)',
  'linear-gradient(180deg, #1f0000 0%, #150000 50%, #0f0000 100%)',
].join(', ');

/* ─── Scene configurations ─── */

interface SceneConfig {
  bg: string;
  baseBg: string;
  textColor: string;
  dimColor: string;
  accentColor: string;
  bloomColor: string;
  gradientEnd: string;
  dotActive: string;
  dotInactive: string;
  line1dim: string;
  line1bright: string;
  line2dim: string;
  line2bright: string;
  lang: string;
  langLabel: string;
  culturalNote: string;
}

const SCENES: SceneConfig[] = [
  {
    bg: GRIEF_BG,
    baseBg: '#14080f',
    textColor: '#f4c2db',
    dimColor: 'rgba(244,194,219,0.45)',
    accentColor: 'rgba(155,58,110,0.6)',
    bloomColor: 'rgba(244,194,219,0.12)',
    gradientEnd: 'rgba(20,8,15,',
    dotActive: 'rgba(244,194,219,0.7)',
    dotInactive: 'rgba(244,194,219,0.2)',
    line1dim: 'She came',
    line1bright: 'alone at noon.',
    line2dim: 'The others came',
    line2bright: 'in the cool of morning.',
    lang: 'EN',
    langLabel: 'English',
    culturalNote: 'Original telling',
  },
  {
    bg: GRIEF_BG,
    baseBg: '#14080f',
    textColor: '#f4c2db',
    dimColor: 'rgba(244,194,219,0.45)',
    accentColor: 'rgba(155,58,110,0.6)',
    bloomColor: 'rgba(244,194,219,0.12)',
    gradientEnd: 'rgba(20,8,15,',
    dotActive: 'rgba(244,194,219,0.7)',
    dotInactive: 'rgba(244,194,219,0.2)',
    line1dim: '\uADF8\uB140\uB294',
    line1bright: '\uD63C\uC790 \uD55C\uB0AE\uC5D0 \uC654\uB2E4.',
    line2dim: '\uB2E4\uB978 \uC0AC\uB78C\uB4E4\uC740',
    line2bright: '\uC544\uCE68 \uC2DC\uC6D0\uD560 \uB54C \uC654\uB2E4.',
    lang: 'KO',
    langLabel: '\uD55C\uAD6D\uC5B4',
    culturalNote: 'Same scene, generated in Korean',
  },
  {
    bg: GRIEF_BG,
    baseBg: '#14080f',
    textColor: '#f4c2db',
    dimColor: 'rgba(244,194,219,0.45)',
    accentColor: 'rgba(155,58,110,0.6)',
    bloomColor: 'rgba(244,194,219,0.12)',
    gradientEnd: 'rgba(20,8,15,',
    dotActive: 'rgba(244,194,219,0.7)',
    dotInactive: 'rgba(244,194,219,0.2)',
    line1dim: '\u5F7C\u5973\u306F',
    line1bright: '\u771F\u663C\u306B\u4E00\u4EBA\u3067\u6765\u305F\u3002',
    line2dim: '\u4ED6\u306E\u4EBA\u3005\u306F',
    line2bright: '\u671D\u306E\u6DBC\u3057\u3044\u6642\u9593\u306B\u6765\u305F\u3002',
    lang: 'JA',
    langLabel: '\u65E5\u672C\u8A9E',
    culturalNote: 'Same scene, generated in Japanese',
  },
  {
    bg: GRIEF_BG,
    baseBg: '#14080f',
    textColor: '#f4c2db',
    dimColor: 'rgba(244,194,219,0.45)',
    accentColor: 'rgba(155,58,110,0.6)',
    bloomColor: 'rgba(244,194,219,0.12)',
    gradientEnd: 'rgba(20,8,15,',
    dotActive: 'rgba(244,194,219,0.7)',
    dotInactive: 'rgba(244,194,219,0.2)',
    line1dim: 'Ella vino',
    line1bright: 'sola al mediod\u00EDa.',
    line2dim: 'Los dem\u00E1s ven\u00EDan',
    line2bright: 'en el fresco de la ma\u00F1ana.',
    lang: 'ES',
    langLabel: 'Espa\u00F1ol',
    culturalNote: 'Same scene, generated in Spanish',
  },
];

/** Scenes across emotional arcs — same structure, different color worlds */
const ARC_SCENES: {
  bg: string;
  baseBg: string;
  textColor: string;
  dimColor: string;
  bloomColor: string;
  gradientEnd: string;
  dotActive: string;
  dotInactive: string;
  line1dim: string;
  line1bright: string;
  line2dim: string;
  line2bright: string;
  arcLabel: string;
  emotion: string;
}[] = [
  {
    bg: GRIEF_BG,
    baseBg: '#14080f',
    textColor: '#f4c2db',
    dimColor: 'rgba(244,194,219,0.45)',
    bloomColor: 'rgba(244,194,219,0.12)',
    gradientEnd: 'rgba(20,8,15,',
    dotActive: 'rgba(244,194,219,0.7)',
    dotInactive: 'rgba(244,194,219,0.2)',
    line1dim: 'She came',
    line1bright: 'alone at noon.',
    line2dim: 'The others came',
    line2bright: 'in the cool of morning.',
    arcLabel: 'When He Wept',
    emotion: 'Grief',
  },
  {
    bg: DOUBT_BG,
    baseBg: '#0a0d10',
    textColor: '#e2e8f0',
    dimColor: 'rgba(226,232,240,0.4)',
    bloomColor: 'rgba(148,163,184,0.1)',
    gradientEnd: 'rgba(10,13,16,',
    dotActive: 'rgba(226,232,240,0.6)',
    dotInactive: 'rgba(226,232,240,0.15)',
    line1dim: 'The doors were',
    line1bright: 'locked.',
    line2dim: 'He had decided',
    line2bright: 'not to believe them.',
    arcLabel: 'The Night He Answered',
    emotion: 'Doubt',
  },
  {
    bg: SEARCHING_BG,
    baseBg: '#0e0b0c',
    textColor: '#fffbeb',
    dimColor: 'rgba(255,251,235,0.4)',
    bloomColor: 'rgba(251,191,36,0.15)',
    gradientEnd: 'rgba(14,11,12,',
    dotActive: 'rgba(251,191,36,0.7)',
    dotInactive: 'rgba(251,191,36,0.15)',
    line1dim: 'The star didn\u2019t move',
    line1bright: 'the way stars move.',
    line2dim: '',
    line2bright: 'It waited.',
    arcLabel: 'The King Who Came',
    emotion: 'Searching',
  },
  {
    bg: CURIOSITY_BG,
    baseBg: '#031412',
    textColor: '#ccfbf1',
    dimColor: 'rgba(204,251,241,0.4)',
    bloomColor: 'rgba(20,184,166,0.12)',
    gradientEnd: 'rgba(3,20,18,',
    dotActive: 'rgba(20,184,166,0.7)',
    dotInactive: 'rgba(20,184,166,0.15)',
    line1dim: 'He turned and said,',
    line1bright: '\u201CCome and see.\u201D',
    line2dim: 'They didn\u2019t ask',
    line2bright: 'where. They went.',
    arcLabel: 'Come and See',
    emotion: 'Curiosity',
  },
  {
    bg: ANGER_BG,
    baseBg: '#0f0000',
    textColor: '#fee2e2',
    dimColor: 'rgba(254,226,226,0.4)',
    bloomColor: 'rgba(220,38,38,0.1)',
    gradientEnd: 'rgba(15,0,0,',
    dotActive: 'rgba(254,226,226,0.6)',
    dotInactive: 'rgba(254,226,226,0.15)',
    line1dim: 'The water',
    line1bright: 'was everywhere.',
    line2dim: 'And he was',
    line2bright: 'asleep.',
    arcLabel: 'The Storm He Stilled',
    emotion: 'Anger',
  },
];

function ScenePhone({ scene, scale = 1 }: { scene: typeof SCENES[0]; scale?: number }) {
  return (
    <PhoneFrame scale={scale}>
      <div style={{ width: '100%', height: '100%', background: scene.baseBg, position: 'relative' }}>
        {/* Illustration — top 65% */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', overflow: 'hidden', background: scene.bg }}>
          {/* Bloom */}
          <div style={{ position: 'absolute', top: '15%', right: '20%', width: '48px', height: '48px', background: `radial-gradient(circle, ${scene.bloomColor} 0%, transparent 70%)`, borderRadius: '50%' }} />
          {/* Figure 1 */}
          <div style={{ position: 'absolute', bottom: '2px', left: '52%', transform: 'translateX(-30%)' }}>
            <div style={{ width: '14px', height: '42px', background: 'rgba(70,15,45,0.75)', borderRadius: '3px 3px 0 0' }} />
            <div style={{ position: 'absolute', top: '8px', left: '-3px', width: '20px', height: '32px', background: 'rgba(87,20,56,0.4)', borderRadius: '50% 50% 0 0' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '43px', left: '52%', transform: 'translateX(-24%)' }}>
            <div style={{ width: '10px', height: '10px', background: 'rgba(90,25,58,0.85)', borderRadius: '50%' }} />
          </div>
          {/* Figure 2 */}
          <div style={{ position: 'absolute', bottom: '2px', left: '25%' }}>
            <div style={{ width: '11px', height: '36px', background: 'rgba(50,10,32,0.5)', borderRadius: '3px 3px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '34px', left: '1px', width: '8px', height: '8px', background: 'rgba(60,12,36,0.6)', borderRadius: '50%' }} />
          </div>
          {/* Water shimmer */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px', background: `linear-gradient(to top, ${scene.accentColor ?? 'rgba(155,58,110,0.15)'}, transparent)` }} />
        </div>
        {/* Text zone */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', padding: '14px 18px 18px', background: `linear-gradient(to bottom, transparent 0%, ${scene.gradientEnd}0.7) 30%, ${scene.gradientEnd}0.95) 60%, ${scene.gradientEnd}1) 100%)` }}>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
            {[true, true, false, false, false].map((active, i) => (
              <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: active ? scene.dotActive : scene.dotInactive }} />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '12px', lineHeight: '1.7', color: scene.textColor, fontStyle: 'italic' }}>
            <span style={{ color: scene.dimColor }}>{scene.line1dim}</span>{' '}
            <span style={{ fontWeight: 500 }}>{scene.line1bright}</span>
            <br />
            {scene.line2dim && <><span style={{ color: scene.dimColor }}>{scene.line2dim}</span>{' '}</>}
            <span style={{ fontWeight: 500 }}>{scene.line2bright}</span>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ArcPhone({ scene, scale = 1 }: { scene: typeof ARC_SCENES[0]; scale?: number }) {
  return (
    <PhoneFrame scale={scale}>
      <div style={{ width: '100%', height: '100%', background: scene.baseBg, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', overflow: 'hidden', background: scene.bg }}>
          <div style={{ position: 'absolute', top: '20%', left: '45%', width: '48px', height: '48px', background: `radial-gradient(circle, ${scene.bloomColor} 0%, transparent 70%)`, borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', padding: '14px 18px 18px', background: `linear-gradient(to bottom, transparent 0%, ${scene.gradientEnd}0.7) 30%, ${scene.gradientEnd}0.95) 60%, ${scene.gradientEnd}1) 100%)` }}>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
            {[true, false, false, false, false].map((active, i) => (
              <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: active ? scene.dotActive : scene.dotInactive }} />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '12px', lineHeight: '1.7', color: scene.textColor, fontStyle: 'italic' }}>
            <span style={{ color: scene.dimColor }}>{scene.line1dim}</span>{' '}
            <span style={{ fontWeight: 500 }}>{scene.line1bright}</span>
            <br />
            {scene.line2dim && <><span style={{ color: scene.dimColor }}>{scene.line2dim}</span>{' '}</>}
            <span style={{ fontWeight: 500 }}>{scene.line2bright}</span>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** The entry experience — someone typing what they're carrying */
export function EntryPhone({ scale = 1 }: { scale?: number }) {
  return (
    <PhoneFrame scale={scale}>
      <div style={{ width: '100%', height: '100%', background: '#0b0b0d', position: 'relative' }}>
        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(196,166,106,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${Math.round(24 * scale)}px ${Math.round(20 * scale)}px` }}>
          {/* Question */}
          <p style={{
            fontFamily: 'var(--font-narrative)', fontStyle: 'italic',
            fontSize: `${Math.round(13 * scale)}px`, lineHeight: '1.6',
            color: 'rgba(255,255,255,0.35)',
          }}>
            What are you carrying right now?
          </p>

          {/* Typed text */}
          <div style={{
            marginTop: `${Math.round(16 * scale)}px`,
            paddingBottom: `${Math.round(10 * scale)}px`,
            borderBottom: '1px solid rgba(196,166,106,0.15)',
          }}>
            <p style={{
              fontFamily: 'var(--font-narrative)',
              fontSize: `${Math.round(14 * scale)}px`, lineHeight: '1.7',
              color: 'rgba(255,255,255,0.85)',
            }}>
              My grandmother passed last week and I don&apos;t know how to grieve in a way that honors her
            </p>
            {/* Blinking cursor */}
            <span style={{
              display: 'inline-block',
              width: `${Math.round(1.5 * scale)}px`, height: `${Math.round(16 * scale)}px`,
              backgroundColor: 'rgba(196,166,106,0.6)',
              marginLeft: '2px', verticalAlign: 'text-bottom',
              animation: 'pulse 1.2s ease-in-out infinite',
            }} />
          </div>

          {/* Language detection hint */}
          <div style={{
            marginTop: `${Math.round(14 * scale)}px`,
            display: 'flex', alignItems: 'center', gap: `${Math.round(6 * scale)}px`,
          }}>
            <div style={{
              width: `${Math.round(4 * scale)}px`, height: `${Math.round(4 * scale)}px`,
              borderRadius: '50%', backgroundColor: 'rgba(196,166,106,0.4)',
            }} />
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: `${Math.round(9 * scale)}px`,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.03em',
            }}>
              English detected &middot; routing to grief arc
            </p>
          </div>

          {/* Enter button */}
          <div style={{
            marginTop: `${Math.round(28 * scale)}px`,
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              padding: `${Math.round(10 * scale)}px ${Math.round(24 * scale)}px`,
              borderRadius: '999px',
              backgroundColor: 'rgba(196,166,106,0.12)',
              border: '1px solid rgba(196,166,106,0.2)',
            }}>
              <p style={{
                fontFamily: 'var(--font-narrative)',
                fontSize: `${Math.round(11 * scale)}px`,
                color: 'rgba(232,213,176,0.8)',
                textAlign: 'center',
              }}>
                Enter the story
              </p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Three phones showing cultural contextualization: same grief, different cultural framing */
export function CultureStrip() {
  const cultures = [
    {
      lang: 'EN',
      label: 'American reader',
      input: '"I just lost my best friend and I feel numb"',
      line1dim: 'The house was',
      line1bright: 'full of people.',
      line2dim: 'Martha heard them say',
      line2bright: 'the right things.',
      note: 'Western individualist grief — isolation, numbness',
    },
    {
      lang: 'KO',
      label: '\uD55C\uAD6D\uC778 \uB3C5\uC790',
      input: '"\uD560\uBA38\uB2C8\uAC00 \uB3CC\uC544\uAC00\uC168\uB294\uB370 \uC544\uBB34\uB807\uC9C0 \uC54A\uC740 \uCC99 \uD574\uC57C \uD574\uC694"',
      line1dim: '\uC870\uBB38\uAC1D\uB4E4\uC774',
      line1bright: '\uC904\uC744 \uC774\uC5C8\uB2E4.',
      line2dim: '\uB9C8\uB974\uB2E4\uB294',
      line2bright: '\uC6C3\uB294 \uC5BC\uAD74\uB85C \uBC1B\uC558\uB2E4.',
      note: 'Korean communal grief — performing composure for others',
    },
    {
      lang: 'JA',
      label: '\u65E5\u672C\u4EBA\u306E\u8AAD\u8005',
      input: '"\u7236\u304C\u4EA1\u304F\u306A\u3063\u3066\u3001\u307E\u3060\u6CE3\u3051\u3066\u3044\u307E\u305B\u3093"',
      line1dim: '\u5F14\u554F\u5BA2\u306F',
      line1bright: '\u9759\u304B\u306B\u982D\u3092\u4E0B\u3052\u305F\u3002',
      line2dim: '\u30DE\u30EB\u30BF\u306F',
      line2bright: '\u4E00\u4EBA\u3067\u7ACB\u3061\u5C3D\u304F\u3057\u305F\u3002',
      note: 'Japanese grief — restraint, the weight of not crying',
    },
  ];

  return (
    <div className="flex justify-center gap-6">
      {cultures.map((c) => (
        <div key={c.lang} className="flex flex-col items-center gap-3">
          <PhoneFrame scale={0.75}>
            <div style={{ width: '100%', height: '100%', background: '#14080f', position: 'relative' }}>
              {/* Illustration zone */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', overflow: 'hidden', background: GRIEF_BG }}>
                <div style={{ position: 'absolute', top: '15%', right: '20%', width: '48px', height: '48px', background: 'radial-gradient(circle, rgba(244,194,219,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                {/* Figure */}
                <div style={{ position: 'absolute', bottom: '2px', left: '52%', transform: 'translateX(-30%)' }}>
                  <div style={{ width: '14px', height: '42px', background: 'rgba(70,15,45,0.75)', borderRadius: '3px 3px 0 0' }} />
                  <div style={{ position: 'absolute', top: '8px', left: '-3px', width: '20px', height: '32px', background: 'rgba(87,20,56,0.4)', borderRadius: '50% 50% 0 0' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '43px', left: '52%', transform: 'translateX(-24%)' }}>
                  <div style={{ width: '10px', height: '10px', background: 'rgba(90,25,58,0.85)', borderRadius: '50%' }} />
                </div>
              </div>
              {/* Text zone */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', padding: '14px 18px 18px', background: `linear-gradient(to bottom, transparent 0%, rgba(20,8,15,0.7) 30%, rgba(20,8,15,0.95) 60%, rgba(20,8,15,1) 100%)` }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                  {[true, true, false, false, false].map((active, i) => (
                    <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: active ? 'rgba(244,194,219,0.7)' : 'rgba(244,194,219,0.2)' }} />
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '12px', lineHeight: '1.7', color: '#f4c2db', fontStyle: 'italic' }}>
                  <span style={{ color: 'rgba(244,194,219,0.45)' }}>{c.line1dim}</span>{' '}
                  <span style={{ fontWeight: 500 }}>{c.line1bright}</span>
                  <br />
                  <span style={{ color: 'rgba(244,194,219,0.45)' }}>{c.line2dim}</span>{' '}
                  <span style={{ fontWeight: 500 }}>{c.line2bright}</span>
                </p>
              </div>
            </div>
          </PhoneFrame>
          <div className="text-center max-w-[180px]">
            <p className="text-[0.65rem] font-medium text-white/55" style={{ fontFamily: 'var(--font-ui)' }}>{c.label}</p>
            <p className="text-[0.55rem] text-white/20 mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-narrative)', fontStyle: 'italic' }}>{c.input}</p>
            <p className="text-[0.5rem] text-white/15 mt-1" style={{ fontFamily: 'var(--font-ui)' }}>{c.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Hero: one English scene */
export function HeroScene() {
  return <ScenePhone scene={SCENES[0]} scale={0.85} />;
}

/** Same scene, four languages side by side */
export function LanguageStrip() {
  return (
    <div className="flex justify-center gap-6">
      {SCENES.map((scene) => (
        <div key={scene.lang} className="flex flex-col items-center gap-3">
          <ScenePhone scene={scene} scale={0.75} />
          <div className="text-center">
            <p className="text-[0.65rem] font-medium text-white/60" style={{ fontFamily: 'var(--font-ui)' }}>{scene.langLabel}</p>
            <p className="text-[0.55rem] text-white/25 mt-0.5" style={{ fontFamily: 'var(--font-ui)' }}>{scene.culturalNote}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Five emotional arcs side by side */
export function ArcStrip() {
  return (
    <div className="flex justify-center gap-5">
      {ARC_SCENES.map((scene) => (
        <div key={scene.emotion} className="flex flex-col items-center gap-3">
          <ArcPhone scene={scene} scale={0.62} />
          <div className="text-center">
            <p className="text-[0.6rem] font-medium text-white/60" style={{ fontFamily: 'var(--font-narrative)' }}>{scene.arcLabel}</p>
            <p className="text-[0.5rem] text-white/25 mt-0.5" style={{ fontFamily: 'var(--font-ui)' }}>{scene.emotion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
