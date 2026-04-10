// CSS gradient beat illustrations — atmospheric scene art per beat.
// Each uses layered gradients, figure silhouettes, and bloom effects
// matching the DesignMockups gradient art style.

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const GRIEF_BASE: React.CSSProperties = {
  position: 'relative',
  aspectRatio: '360/300',
  background: '#14080f',
  overflow: 'hidden',
};

const GRIEF_ATM = [
  'radial-gradient(ellipse at 40% 30%, rgba(155,58,110,0.35) 0%, transparent 55%)',
  'radial-gradient(ellipse at 70% 60%, rgba(87,23,60,0.5) 0%, transparent 50%)',
  'radial-gradient(ellipse at 20% 70%, rgba(34,13,24,0.8) 0%, transparent 45%)',
  'linear-gradient(185deg, #1a0b14 0%, #0e0509 40%, #14080f 100%)',
].join(', ');

// ─── Beat 1: Messenger running to Bethany ───

function WhenHeWeptBeat1({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: GRIEF_ATM }} />
      {/* Road — gradient line receding */}
      <div style={{ position: 'absolute', bottom: 0, left: '20%', width: '1px', height: '60%', background: 'linear-gradient(to top, rgba(155,58,110,0.08), rgba(155,58,110,0.18), transparent)', transform: 'rotate(12deg)', transformOrigin: 'bottom center' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '20%', width: '1px', height: '60%', background: 'linear-gradient(to top, rgba(155,58,110,0.08), rgba(155,58,110,0.18), transparent)', transform: 'rotate(-12deg)', transformOrigin: 'bottom center' }} />
      {/* Horizon */}
      <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(155,58,110,0.15), transparent)' }} />
      {/* Messenger figure — running */}
      <div style={{ position: 'absolute', bottom: '25%', left: '30%' }}>
        <div style={{ width: '12px', height: '12px', background: 'rgba(90,25,58,0.8)', borderRadius: '50%', margin: '0 auto 3px' }} />
        <div style={{ width: '10px', height: '36px', background: 'rgba(70,15,45,0.7)', borderRadius: '3px', margin: '0 auto' }} />
        {/* Trailing robe */}
        <div style={{ position: 'absolute', top: '16px', left: '-6px', width: '16px', height: '24px', background: 'rgba(87,20,56,0.3)', borderRadius: '50% 0 0 50%' }} />
      </div>
      {/* Watching figures — Martha & Mary at doorway */}
      <div style={{ position: 'absolute', bottom: '22%', right: '18%' }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50px', height: '60px', background: 'rgba(20,8,15,0.7)', borderRadius: '4px 4px 0 0', border: '1px solid rgba(155,58,110,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '62px', right: '10px', width: '10px', height: '10px', background: 'rgba(90,25,58,0.6)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '62px', right: '28px', width: '10px', height: '10px', background: 'rgba(60,12,36,0.5)', borderRadius: '50%' }} />
      </div>
      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '38%', left: '38%', width: '14px', height: '8px', background: 'rgba(155,58,110,0.2)', borderRadius: '2px' }} />
      {/* Dust */}
      <div style={{ position: 'absolute', bottom: '20%', left: '24%', width: '30px', height: '12px', background: 'radial-gradient(ellipse, rgba(155,58,110,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
}

// ─── Beat 2: Jesus stays — deliberate delay ───

function WhenHeWeptBeat2({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: [
        'radial-gradient(ellipse at 50% 50%, rgba(87,23,60,0.25) 0%, transparent 50%)',
        'linear-gradient(180deg, #14080f 0%, #0e0509 100%)',
      ].join(', ') }} />
      {/* Waiting pulse — concentric rings */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(155,58,110,0.06) 0%, rgba(155,58,110,0.02) 40%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(155,58,110,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
      {/* Still figure — Jesus */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(90,25,58,0.7)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '12px', height: '44px', background: 'rgba(70,15,45,0.6)', borderRadius: '3px', margin: '0 auto' }} />
      </div>
      {/* "Two more days" — subtle text-like marks */}
      <div style={{ position: 'absolute', bottom: '18%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
        <div style={{ width: '20px', height: '2px', background: 'rgba(155,58,110,0.12)', borderRadius: '1px' }} />
        <div style={{ width: '20px', height: '2px', background: 'rgba(155,58,110,0.12)', borderRadius: '1px' }} />
      </div>
    </div>
  );
}

// ─── Beat 3: "Lord, if you had been here" — Martha speaks ───

function WhenHeWeptBeat3({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: GRIEF_ATM }} />
      {/* Martha — foreground, reaching */}
      <div style={{ position: 'absolute', bottom: '20%', left: '30%' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(90,25,58,0.85)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '12px', height: '42px', background: 'rgba(70,15,45,0.7)', borderRadius: '3px', margin: '0 auto' }} />
        {/* Reaching arm */}
        <div style={{ position: 'absolute', top: '22px', right: '-20px', width: '24px', height: '6px', background: 'linear-gradient(to right, rgba(87,20,56,0.4), rgba(87,20,56,0.15))', borderRadius: '3px' }} />
      </div>
      {/* Jesus — facing her */}
      <div style={{ position: 'absolute', bottom: '22%', right: '30%' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(90,25,58,0.7)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '12px', height: '44px', background: 'rgba(70,15,45,0.6)', borderRadius: '3px', margin: '0 auto' }} />
      </div>
      {/* Mourners — distant */}
      <div style={{ position: 'absolute', top: '30%', right: '15%', display: 'flex', gap: '6px' }}>
        {[0.3, 0.22, 0.18].map((o, i) => (
          <div key={i} style={{ width: '8px', height: '24px', background: `rgba(50,10,32,${o})`, borderRadius: '2px' }} />
        ))}
      </div>
      {/* Emotional bloom between them */}
      <div style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '40px', background: 'radial-gradient(circle, rgba(244,194,219,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
}

// ─── Beat 4: "Jesus wept" ───

function WhenHeWeptBeat4({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: [
        'radial-gradient(ellipse at 50% 45%, rgba(155,58,110,0.4) 0%, transparent 50%)',
        'radial-gradient(ellipse at 40% 55%, rgba(87,23,60,0.35) 0%, transparent 40%)',
        'linear-gradient(180deg, #1a0b14 0%, #14080f 100%)',
      ].join(', ') }} />
      {/* Solitary weeping figure — center, larger */}
      <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: '18px', height: '18px', background: 'rgba(90,25,58,0.85)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '14px', height: '50px', background: 'rgba(70,15,45,0.75)', borderRadius: '4px', margin: '0 auto' }} />
        {/* Bowed posture — robe drape */}
        <div style={{ position: 'absolute', top: '12px', left: '-6px', width: '28px', height: '36px', background: 'rgba(87,20,56,0.3)', borderRadius: '50% 50% 0 0' }} />
      </div>
      {/* Tears — bloom drops */}
      <div style={{ position: 'absolute', top: '40%', left: 'calc(50% - 6px)', width: '6px', height: '10px', background: 'radial-gradient(ellipse, rgba(244,194,219,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '43%', left: 'calc(50% + 4px)', width: '5px', height: '8px', background: 'radial-gradient(ellipse, rgba(244,194,219,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      {/* Ground reflection of grief */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(to top, rgba(155,58,110,0.1), transparent)' }} />
    </div>
  );
}

// ─── Beat 5: "Take away the stone" ───

function WhenHeWeptBeat5({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: GRIEF_ATM }} />
      {/* Tomb — large dark mass */}
      <div style={{ position: 'absolute', top: '15%', right: '5%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at 50% 50%, rgba(20,8,15,0.9) 0%, rgba(34,13,24,0.6) 50%, transparent 80%)', borderRadius: '50%' }} />
      {/* Stone — circular, partially covering */}
      <div style={{ position: 'absolute', top: '30%', right: '20%', width: '80px', height: '80px', background: 'rgba(30,12,22,0.8)', borderRadius: '50%', border: '1px solid rgba(155,58,110,0.1)' }} />
      {/* Jesus commanding — left side */}
      <div style={{ position: 'absolute', bottom: '18%', left: '20%' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(90,25,58,0.8)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '12px', height: '44px', background: 'rgba(70,15,45,0.7)', borderRadius: '3px', margin: '0 auto' }} />
        {/* Outstretched arm toward tomb */}
        <div style={{ position: 'absolute', top: '20px', right: '-24px', width: '28px', height: '6px', background: 'linear-gradient(to right, rgba(87,20,56,0.5), rgba(87,20,56,0.2))', borderRadius: '3px' }} />
      </div>
      {/* Light crack at tomb entrance */}
      <div style={{ position: 'absolute', top: '38%', right: '28%', width: '3px', height: '30px', background: 'linear-gradient(to bottom, rgba(244,194,219,0.12), rgba(244,194,219,0.04), transparent)' }} />
    </div>
  );
}

// ─── Beat 6: "Lazarus, come out" ───

function WhenHeWeptBeat6({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: [
        'radial-gradient(ellipse at 60% 40%, rgba(155,58,110,0.4) 0%, transparent 50%)',
        'radial-gradient(ellipse at 30% 60%, rgba(87,23,60,0.3) 0%, transparent 45%)',
        'linear-gradient(180deg, #1a0b14 0%, #14080f 100%)',
      ].join(', ') }} />
      {/* Tomb opening — burst of light */}
      <div style={{ position: 'absolute', top: '25%', right: '20%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(244,194,219,0.15) 0%, rgba(244,194,219,0.05) 40%, transparent 70%)', borderRadius: '50%' }} />
      {/* Lazarus emerging — wrapped figure */}
      <div style={{ position: 'absolute', top: '30%', right: '28%' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(244,194,219,0.35)', borderRadius: '50%', margin: '0 auto 3px' }} />
        <div style={{ width: '12px', height: '44px', background: 'rgba(244,194,219,0.2)', borderRadius: '3px', margin: '0 auto' }} />
        {/* Wrapping bands */}
        <div style={{ position: 'absolute', top: '20px', left: '-2px', width: '16px', height: '3px', background: 'rgba(244,194,219,0.12)', borderRadius: '1px' }} />
        <div style={{ position: 'absolute', top: '30px', left: '-2px', width: '16px', height: '3px', background: 'rgba(244,194,219,0.1)', borderRadius: '1px' }} />
        <div style={{ position: 'absolute', top: '40px', left: '-2px', width: '16px', height: '3px', background: 'rgba(244,194,219,0.08)', borderRadius: '1px' }} />
      </div>
      {/* Crowd reacting — left side */}
      <div style={{ position: 'absolute', bottom: '18%', left: '15%', display: 'flex', gap: '8px' }}>
        {[0.6, 0.45, 0.35, 0.25].map((o, i) => (
          <div key={i}>
            <div style={{ width: '8px', height: '8px', background: `rgba(90,25,58,${o})`, borderRadius: '50%', marginBottom: '2px' }} />
            <div style={{ width: '7px', height: '22px', background: `rgba(70,15,45,${o * 0.7})`, borderRadius: '2px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Beat 7: Unbinding — community restores ───

function WhenHeWeptBeat7({ className, style }: SvgProps) {
  return (
    <div className={className} style={{ ...style, ...GRIEF_BASE }}>
      <div style={{ position: 'absolute', inset: 0, background: [
        'radial-gradient(ellipse at 50% 40%, rgba(155,58,110,0.3) 0%, transparent 55%)',
        'radial-gradient(ellipse at 50% 50%, rgba(244,194,219,0.06) 0%, transparent 40%)',
        'linear-gradient(180deg, #1a0b14 0%, #14080f 100%)',
      ].join(', ') }} />
      {/* Central gathering — warm bloom */}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', width: '140px', height: '100px', background: 'radial-gradient(ellipse, rgba(244,194,219,0.1) 0%, rgba(155,58,110,0.04) 50%, transparent 80%)', borderRadius: '50%' }} />
      {/* Lazarus — center, being unbound */}
      <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(244,194,219,0.4)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '12px', height: '44px', background: 'rgba(244,194,219,0.25)', borderRadius: '3px', margin: '0 auto' }} />
      </div>
      {/* Helpers on either side */}
      <div style={{ position: 'absolute', top: '32%', left: '30%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(90,25,58,0.6)', borderRadius: '50%', marginBottom: '3px' }} />
        <div style={{ width: '9px', height: '32px', background: 'rgba(70,15,45,0.5)', borderRadius: '2px' }} />
        {/* Arm reaching to unbind */}
        <div style={{ position: 'absolute', top: '16px', right: '-14px', width: '18px', height: '5px', background: 'linear-gradient(to right, rgba(87,20,56,0.35), rgba(87,20,56,0.1))', borderRadius: '3px' }} />
      </div>
      <div style={{ position: 'absolute', top: '30%', right: '30%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(90,25,58,0.55)', borderRadius: '50%', marginBottom: '3px' }} />
        <div style={{ width: '9px', height: '32px', background: 'rgba(70,15,45,0.45)', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', top: '16px', left: '-14px', width: '18px', height: '5px', background: 'linear-gradient(to left, rgba(87,20,56,0.35), rgba(87,20,56,0.1))', borderRadius: '3px' }} />
      </div>
      {/* Falling cloth strips */}
      <div style={{ position: 'absolute', bottom: '22%', left: '46%', width: '20px', height: '3px', background: 'rgba(244,194,219,0.08)', borderRadius: '1px', transform: 'rotate(15deg)' }} />
      <div style={{ position: 'absolute', bottom: '26%', left: '52%', width: '16px', height: '3px', background: 'rgba(244,194,219,0.06)', borderRadius: '1px', transform: 'rotate(-10deg)' }} />
    </div>
  );
}

// ─── Registry ───

const BEAT_ILLUSTRATIONS: Record<string, Record<string, React.FC<SvgProps>>> = {
  'when-he-wept': {
    'beat-grief-1': WhenHeWeptBeat1,
    'beat-grief-2': WhenHeWeptBeat2,
    'beat-grief-3': WhenHeWeptBeat3,
    'beat-grief-4': WhenHeWeptBeat4,
    'beat-grief-5': WhenHeWeptBeat5,
    'beat-grief-6': WhenHeWeptBeat6,
    'beat-grief-7': WhenHeWeptBeat7,
  },
};

// ─── Exported component ───

function getBeatSvgPath(slug: string, beatId: string): string | null {
  const match = beatId.match(/(\d+)$/);
  if (!match) return null;
  return `/beat-illustrations/${slug}/beat-${match[1]}.svg`;
}

const STORIES_WITH_SVG_FILES = new Set(['when-he-wept']);

export function BeatIllustration({
  slug,
  beatId,
  className,
  style,
}: {
  slug: string;
  beatId: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Try inline component first
  const storyBeats = BEAT_ILLUSTRATIONS[slug];
  const Component = storyBeats?.[beatId];
  if (Component) return <Component className={className} style={style} />;

  // Fall back to <img> only for stories that have SVG files
  if (!STORIES_WITH_SVG_FILES.has(slug)) return null;
  const svgPath = getBeatSvgPath(slug, beatId);
  if (!svgPath) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={svgPath} alt="" className={className} style={style} />
  );
}
