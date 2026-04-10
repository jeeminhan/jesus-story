// CSS gradient illustrations — atmospheric scene art per story arc.
// Each illustration uses layered gradients, figure silhouettes, and bloom effects.

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

function WhenHeWept({ className, style }: Props) {
  return (
    <div className={className} style={{ ...style, position: 'relative', aspectRatio: '360/480', background: '#14080f', overflow: 'hidden' }}>
      {/* Layered gradient atmosphere */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 40% 30%, rgba(155,58,110,0.35) 0%, transparent 55%)',
          'radial-gradient(ellipse at 70% 60%, rgba(87,23,60,0.5) 0%, transparent 50%)',
          'radial-gradient(ellipse at 20% 70%, rgba(34,13,24,0.8) 0%, transparent 45%)',
          'radial-gradient(ellipse at 80% 20%, rgba(60,10,40,0.4) 0%, transparent 40%)',
          'linear-gradient(185deg, #1a0b14 0%, #0e0509 40%, #14080f 100%)',
        ].join(', '),
      }} />
      {/* Bloom */}
      <div style={{ position: 'absolute', top: '12%', right: '18%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(244,194,219,0.14) 0%, transparent 70%)', borderRadius: '50%' }} />
      {/* Tomb / stone circle */}
      <div style={{ position: 'absolute', top: '22%', right: '8%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(87,23,60,0.3) 0%, rgba(20,8,15,0.6) 60%, transparent 80%)', border: '1px solid rgba(155,58,110,0.12)' }} />
      {/* Figure 1 — primary, closer */}
      <div style={{ position: 'absolute', bottom: '18%', left: '38%' }}>
        <div style={{ width: '18px', height: '56px', background: 'rgba(70,15,45,0.8)', borderRadius: '4px 4px 0 0' }} />
        <div style={{ position: 'absolute', top: '10px', left: '-4px', width: '26px', height: '42px', background: 'rgba(87,20,56,0.4)', borderRadius: '50% 50% 0 0' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 'calc(18% + 56px)', left: 'calc(38% + 1px)' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(90,25,58,0.9)', borderRadius: '50%' }} />
      </div>
      {/* Figure 2 — further back */}
      <div style={{ position: 'absolute', bottom: '18%', left: '22%' }}>
        <div style={{ width: '14px', height: '44px', background: 'rgba(50,10,32,0.5)', borderRadius: '3px 3px 0 0' }} />
        <div style={{ position: 'absolute', bottom: '42px', left: '2px', width: '10px', height: '10px', background: 'rgba(60,12,36,0.6)', borderRadius: '50%' }} />
      </div>
      {/* Ground / horizon shimmer */}
      <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(155,58,110,0.2), transparent)' }} />
      {/* Water reflection */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', background: 'linear-gradient(to top, rgba(155,58,110,0.12), transparent)' }} />
    </div>
  );
}

function TheNightHeAnswered({ className, style }: Props) {
  return (
    <div className={className} style={{ ...style, position: 'relative', aspectRatio: '360/480', background: '#0a0d10', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 50% 40%, rgba(100,116,139,0.25) 0%, transparent 55%)',
          'radial-gradient(ellipse at 30% 60%, rgba(71,85,105,0.3) 0%, transparent 45%)',
          'linear-gradient(180deg, #141a20 0%, #0e1015 50%, #0a0d10 100%)',
        ].join(', '),
      }} />
      {/* Gap glow — the wound light */}
      <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '28px', background: 'radial-gradient(ellipse, rgba(196,166,106,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
      {/* Hands reaching — left */}
      <div style={{ position: 'absolute', top: '44%', left: '10%', width: '35%', height: '14px', background: 'linear-gradient(to right, rgba(100,116,139,0.06), rgba(100,116,139,0.2))', borderRadius: '0 8px 8px 0' }} />
      {/* Hands reaching — right */}
      <div style={{ position: 'absolute', top: '48%', right: '10%', width: '35%', height: '14px', background: 'linear-gradient(to left, rgba(100,116,139,0.06), rgba(100,116,139,0.2))', borderRadius: '8px 0 0 8px' }} />
      {/* Wound dot */}
      <div style={{ position: 'absolute', top: '46%', right: '28%', width: '12px', height: '12px', background: 'radial-gradient(circle, rgba(196,166,106,0.6) 0%, rgba(196,166,106,0.15) 50%, transparent 70%)', borderRadius: '50%' }} />
      {/* Ambient vertical lines — door frame */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: '1px', height: '70%', background: 'linear-gradient(to bottom, transparent, rgba(100,116,139,0.1), transparent)' }} />
      <div style={{ position: 'absolute', top: '15%', right: '20%', width: '1px', height: '70%', background: 'linear-gradient(to bottom, transparent, rgba(100,116,139,0.1), transparent)' }} />
    </div>
  );
}

function TheKingWhoCame({ className, style }: Props) {
  return (
    <div className={className} style={{ ...style, position: 'relative', aspectRatio: '360/480', background: '#0e0b0c', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 50% 20%, rgba(251,191,36,0.18) 0%, transparent 45%)',
          'radial-gradient(ellipse at 50% 20%, rgba(200,170,100,0.1) 0%, transparent 60%)',
          'linear-gradient(180deg, #2a2520 0%, #1a1612 50%, #0e0b0c 100%)',
        ].join(', '),
      }} />
      {/* Star bloom */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)', borderRadius: '50%' }} />
      {/* Star core */}
      <div style={{ position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', background: 'radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0.3) 50%, transparent 70%)', borderRadius: '50%' }} />
      {/* Descending ray */}
      <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', width: '1px', height: '50%', background: 'linear-gradient(to bottom, rgba(251,191,36,0.2), rgba(251,191,36,0.04), transparent)' }} />
      {/* Manger structure */}
      <div style={{ position: 'absolute', bottom: '10%', left: '25%', right: '25%', height: '14%', background: 'rgba(26,22,18,0.8)', border: '1px solid rgba(251,191,36,0.08)', borderRadius: '2px' }}>
        <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '8px', background: 'rgba(42,37,32,0.6)', borderRadius: '2px 2px 0 0' }} />
      </div>
      {/* Child glow */}
      <div style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '30px', background: 'radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
}

function ComeAndSee({ className, style }: Props) {
  return (
    <div className={className} style={{ ...style, position: 'relative', aspectRatio: '360/480', background: '#031412', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 50% 45%, rgba(20,184,166,0.2) 0%, transparent 50%)',
          'radial-gradient(ellipse at 70% 30%, rgba(13,148,136,0.15) 0%, transparent 45%)',
          'linear-gradient(180deg, #071f1d 0%, #051412 50%, #031412 100%)',
        ].join(', '),
      }} />
      {/* Path lines — converging */}
      <div style={{ position: 'absolute', bottom: 0, left: '15%', width: '1px', height: '65%', background: 'linear-gradient(to top, rgba(20,184,166,0.05), rgba(20,184,166,0.15), transparent)', transform: 'rotate(8deg)', transformOrigin: 'bottom center' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '15%', width: '1px', height: '65%', background: 'linear-gradient(to top, rgba(20,184,166,0.05), rgba(20,184,166,0.15), transparent)', transform: 'rotate(-8deg)', transformOrigin: 'bottom center' }} />
      {/* Standing figure — center */}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: '14px', height: '14px', background: 'rgba(20,184,166,0.35)', borderRadius: '50%', margin: '0 auto 4px' }} />
        <div style={{ width: '10px', height: '40px', background: 'rgba(20,184,166,0.2)', borderRadius: '3px', margin: '0 auto' }} />
      </div>
      {/* Walker figures — lower */}
      <div style={{ position: 'absolute', bottom: '22%', left: '34%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(20,184,166,0.2)', borderRadius: '50%', margin: '0 auto 3px' }} />
        <div style={{ width: '8px', height: '28px', background: 'rgba(20,184,166,0.12)', borderRadius: '2px', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '34%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(20,184,166,0.2)', borderRadius: '50%', margin: '0 auto 3px' }} />
        <div style={{ width: '8px', height: '28px', background: 'rgba(20,184,166,0.12)', borderRadius: '2px', margin: '0 auto' }} />
      </div>
      {/* Beckoning glow */}
      <div style={{ position: 'absolute', top: '38%', left: '36%', width: '30px', height: '8px', background: 'linear-gradient(to left, rgba(20,184,166,0.15), transparent)', borderRadius: '4px' }} />
    </div>
  );
}

function TheStormHeStilled({ className, style }: Props) {
  return (
    <div className={className} style={{ ...style, position: 'relative', aspectRatio: '360/480', background: '#0f0000', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 40% 40%, rgba(220,38,38,0.2) 0%, transparent 50%)',
          'radial-gradient(ellipse at 65% 60%, rgba(185,28,28,0.25) 0%, transparent 45%)',
          'linear-gradient(180deg, #1f0000 0%, #150000 50%, #0f0000 100%)',
        ].join(', '),
      }} />
      {/* Wave layers — left side, chaotic */}
      <div style={{ position: 'absolute', top: '30%', left: 0, width: '45%', height: '3px', background: 'linear-gradient(to right, rgba(220,38,38,0.15), rgba(220,38,38,0.25), transparent)', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '36%', left: 0, width: '42%', height: '3px', background: 'linear-gradient(to right, rgba(220,38,38,0.12), rgba(220,38,38,0.22), transparent)', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '43%', left: 0, width: '48%', height: '4px', background: 'linear-gradient(to right, rgba(220,38,38,0.1), rgba(220,38,38,0.2), transparent)', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, width: '44%', height: '4px', background: 'linear-gradient(to right, rgba(220,38,38,0.08), rgba(220,38,38,0.18), transparent)', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '58%', left: 0, width: '40%', height: '3px', background: 'linear-gradient(to right, rgba(220,38,38,0.06), rgba(220,38,38,0.14), transparent)', borderRadius: '2px' }} />
      {/* Calm lines — right side */}
      <div style={{ position: 'absolute', top: '32%', right: 0, width: '30%', height: '1px', background: 'linear-gradient(to left, rgba(254,226,226,0.04), rgba(254,226,226,0.1), transparent)' }} />
      <div style={{ position: 'absolute', top: '38%', right: 0, width: '30%', height: '1px', background: 'linear-gradient(to left, rgba(254,226,226,0.03), rgba(254,226,226,0.08), transparent)' }} />
      <div style={{ position: 'absolute', top: '44%', right: 0, width: '30%', height: '1px', background: 'linear-gradient(to left, rgba(254,226,226,0.03), rgba(254,226,226,0.07), transparent)' }} />
      <div style={{ position: 'absolute', top: '50%', right: 0, width: '30%', height: '1px', background: 'linear-gradient(to left, rgba(254,226,226,0.02), rgba(254,226,226,0.06), transparent)' }} />
      {/* Boat hull */}
      <div style={{ position: 'absolute', bottom: '24%', left: '28%', right: '22%', height: '6%', background: 'rgba(30,0,0,0.8)', borderRadius: '0 0 50% 50%', border: '1px solid rgba(220,38,38,0.1)' }} />
      <div style={{ position: 'absolute', bottom: '30%', left: '30%', right: '24%', height: '1px', background: 'rgba(254,226,226,0.08)' }} />
      {/* Huddled figures — left of boat */}
      <div style={{ position: 'absolute', bottom: '32%', left: '32%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(220,38,38,0.3)', borderRadius: '50%' }} />
        <div style={{ width: '8px', height: '20px', background: 'rgba(220,38,38,0.15)', borderRadius: '2px', marginTop: '2px', marginLeft: '1px' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '31%', left: '40%' }}>
        <div style={{ width: '10px', height: '10px', background: 'rgba(220,38,38,0.25)', borderRadius: '50%' }} />
        <div style={{ width: '8px', height: '22px', background: 'rgba(220,38,38,0.12)', borderRadius: '2px', marginTop: '2px', marginLeft: '1px' }} />
      </div>
      {/* Standing figure — right side */}
      <div style={{ position: 'absolute', bottom: '30%', right: '30%' }}>
        <div style={{ width: '12px', height: '12px', background: 'rgba(254,226,226,0.25)', borderRadius: '50%', margin: '0 auto 3px' }} />
        <div style={{ width: '10px', height: '34px', background: 'rgba(254,226,226,0.15)', borderRadius: '3px', margin: '0 auto' }} />
      </div>
      {/* Spray blooms */}
      <div style={{ position: 'absolute', top: '26%', left: '8%', width: '24px', height: '24px', background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '40%', left: '16%', width: '20px', height: '20px', background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
}

// ─── Selector ───

const ILLUSTRATIONS: Record<string, (props: Props) => React.JSX.Element> = {
  'when-he-wept':          WhenHeWept,
  'the-night-he-answered': TheNightHeAnswered,
  'the-king-who-came':     TheKingWhoCame,
  'come-and-see':          ComeAndSee,
  'the-storm-he-stilled':  TheStormHeStilled,
};

export function StoryIllustration({
  slug,
  className,
  style,
}: {
  slug: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Component = ILLUSTRATIONS[slug];
  if (!Component) return null;
  return <Component className={className} style={style} />;
}
