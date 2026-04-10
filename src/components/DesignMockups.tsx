/** Inline CSS-art phone mockups from the design directions document.
 *  These are static, non-interactive previews of key screens. */

interface PhoneFrameProps {
  label: string;
  children: React.ReactNode;
}

function PhoneFrame({ label, children }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden"
        style={{
          width: '220px',
          height: '476px',
          borderRadius: '32px',
          border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5)',
          background: '#000',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '64px',
            height: '18px',
            background: '#000',
            borderRadius: '0 0 12px 12px',
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
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '64px',
            height: '3px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.2)',
            zIndex: 50,
          }}
        />
      </div>
      <p
        className="text-[0.6rem] tracking-[0.08em] text-white/25"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {label}
      </p>
    </div>
  );
}

/** D1 — Dark scene (grief path) — Woman at the well */
function DarkScene() {
  return (
    <PhoneFrame label="Scene · Grief Path">
      <div style={{ width: '100%', height: '100%', background: '#14080f', position: 'relative' }}>
        {/* Illustration zone — top 65% */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '65%',
            overflow: 'hidden',
            background: [
              'radial-gradient(ellipse at 40% 30%, rgba(155,58,110,0.35) 0%, transparent 55%)',
              'radial-gradient(ellipse at 70% 60%, rgba(87,23,60,0.5) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 70%, rgba(34,13,24,0.8) 0%, transparent 45%)',
              'radial-gradient(ellipse at 80% 20%, rgba(60,10,40,0.4) 0%, transparent 40%)',
              'linear-gradient(185deg, #1a0b14 0%, #0e0509 40%, #14080f 100%)',
            ].join(', '),
          }}
        >
          {/* Light bloom */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              right: '20%',
              width: '48px',
              height: '48px',
              background: 'radial-gradient(circle, rgba(244,194,219,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          {/* Figure silhouette */}
          <div style={{ position: 'absolute', bottom: '2px', left: '52%', transform: 'translateX(-30%)' }}>
            <div style={{ width: '14px', height: '42px', background: 'rgba(70,15,45,0.75)', borderRadius: '3px 3px 0 0' }} />
            <div style={{ position: 'absolute', top: '8px', left: '-3px', width: '20px', height: '32px', background: 'rgba(87,20,56,0.4)', borderRadius: '50% 50% 0 0' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '43px', left: '52%', transform: 'translateX(-24%)' }}>
            <div style={{ width: '10px', height: '10px', background: 'rgba(90,25,58,0.85)', borderRadius: '50%' }} />
          </div>
          {/* Second figure (further back) */}
          <div style={{ position: 'absolute', bottom: '2px', left: '25%' }}>
            <div style={{ width: '11px', height: '36px', background: 'rgba(50,10,32,0.5)', borderRadius: '3px 3px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '34px', left: '1px', width: '8px', height: '8px', background: 'rgba(60,12,36,0.6)', borderRadius: '50%' }} />
          </div>
          {/* Water shimmer */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px', background: 'linear-gradient(to top, rgba(155,58,110,0.15), transparent)' }} />
        </div>
        {/* Text zone — bottom 35% */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            padding: '16px 20px 22px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(20,8,15,0.7) 30%, rgba(20,8,15,0.95) 60%, rgba(20,8,15,1) 100%)',
          }}
        >
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {[true, true, false, false, false].map((active, i) => (
              <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: active ? 'rgba(244,194,219,0.7)' : 'rgba(244,194,219,0.2)' }} />
            ))}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-narrative)',
              fontSize: '12px',
              lineHeight: '1.7',
              color: '#f4c2db',
              fontStyle: 'italic',
            }}
          >
            <span style={{ opacity: 0.45 }}>She came</span>{' '}
            <span style={{ opacity: 1 }}>alone at noon.</span>
            <br />
            <span style={{ opacity: 0.45 }}>The others came</span>{' '}
            <span style={{ opacity: 1 }}>in the cool of morning.</span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <span style={{ fontSize: '9px', color: 'rgba(244,194,219,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontFamily: 'var(--font-ui)' }}>
              tap anywhere
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** D3 — Emotional entry screen */
function EmotionalEntry() {
  const options = [
    { label: 'Grief', sub: 'Something broke and I can\'t fix it', style: { background: 'rgba(155,58,110,0.1)', border: '1px solid rgba(155,58,110,0.2)', color: '#f4c2db' } },
    { label: 'Searching', sub: 'I\'m looking for something I can\'t name', style: { background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', color: '#fffbeb' } },
    { label: 'Doubt', sub: 'I used to believe. Now I\'m not sure.', style: { background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.15)', color: '#e2e8f0' } },
    { label: 'Curiosity', sub: 'I don\'t believe, but I\'m listening', style: { background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)', color: '#ccfbf1' } },
    { label: 'Anger', sub: 'I\'m furious at God or life or both', style: { background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#fee2e2' } },
  ];
  return (
    <PhoneFrame label="Emotional Entry">
      <div style={{ width: '100%', height: '100%', background: '#080808', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 22px' }}>
        <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '10.5px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', marginBottom: '22px', paddingTop: '16px', fontStyle: 'italic' }}>
          What are you carrying?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
          {options.map((opt) => (
            <div key={opt.label} style={{ padding: '11px 14px', borderRadius: '5px', ...opt.style }}>
              <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '13px', fontWeight: 500, lineHeight: '1.2', color: opt.style.color }}>{opt.label}</p>
              <p style={{ fontSize: '9px', lineHeight: '1.4', opacity: 0.55, fontFamily: 'var(--font-ui)', marginTop: '2px' }}>{opt.sub}</p>
            </div>
          ))}
        </div>
        <p style={{ padding: '16px 0', fontSize: '8px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em', textAlign: 'center' as const, fontFamily: 'var(--font-ui)' }}>
          Tap the word that fits
        </p>
      </div>
    </PhoneFrame>
  );
}

/** D4 — Mirror moment */
function MirrorMoment() {
  return (
    <PhoneFrame label="Mirror Moment">
      <div style={{ width: '100%', height: '100%', background: '#0a0508', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0' }}>
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'radial-gradient(ellipse at 50% 40%, rgba(155,58,110,0.12) 0%, transparent 65%)',
              'radial-gradient(ellipse at 20% 70%, rgba(100,30,70,0.08) 0%, transparent 50%)',
            ].join(', '),
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 26px', textAlign: 'center' as const }}>
          <p style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(155,58,110,0.6)', marginBottom: '20px', fontFamily: 'var(--font-ui)' }}>
            A reflection
          </p>
          <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '14.5px', lineHeight: '1.65', color: 'rgba(244,194,219,0.9)', fontStyle: 'italic', marginBottom: '26px' }}>
            She didn&apos;t come looking for God.
            <br />
            She came looking for water.
            <br />
            And someone was already there.
          </p>
          <div style={{ width: '22px', height: '1px', background: 'rgba(155,58,110,0.3)', margin: '0 auto 20px' }} />
          <p style={{ fontSize: '9px', color: 'rgba(244,194,219,0.3)', letterSpacing: '0.08em', marginBottom: '32px', fontFamily: 'var(--font-ui)' }}>
            Grief path · Scene 5 of 5
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div style={{ padding: '10px 22px', background: 'rgba(155,58,110,0.25)', border: '1px solid rgba(155,58,110,0.4)', borderRadius: '6px', fontSize: '11px', color: 'rgba(244,194,219,0.9)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', width: '100%', textAlign: 'center' as const }}>
              Tell me more
            </div>
            <p style={{ fontSize: '9px', color: 'rgba(244,194,219,0.25)', letterSpacing: '0.06em', fontFamily: 'var(--font-narrative)', fontStyle: 'italic' }}>
              Sit with this
            </p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** D6 — Scene card (share object) */
function SceneCard() {
  return (
    <PhoneFrame label="Share Card">
      <div style={{ width: '100%', height: '100%', background: '#14080f', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Art zone — top 82% */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            background: [
              'radial-gradient(ellipse at 55% 35%, rgba(155,58,110,0.4) 0%, transparent 60%)',
              'radial-gradient(ellipse at 25% 65%, rgba(87,23,60,0.5) 0%, transparent 50%)',
              'linear-gradient(165deg, #200d18 0%, #110609 50%, #14080f 100%)',
            ].join(', '),
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px 16px',
              background: 'linear-gradient(to bottom, transparent, rgba(20,8,15,0.8) 40%, rgba(20,8,15,0.97) 80%)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '10.5px', lineHeight: '1.65', color: 'rgba(244,194,219,0.85)', fontStyle: 'italic', marginBottom: '6px' }}>
              &ldquo;Come, see a man who told me everything I ever did.&rdquo;
            </p>
            <p style={{ fontSize: '8px', color: 'rgba(155,58,110,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontFamily: 'var(--font-ui)' }}>
              From the story
            </p>
          </div>
        </div>
        {/* Share bar */}
        <div
          style={{
            height: '56px',
            background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <span style={{ flex: 1, fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-ui)' }}>
            Thinking of someone?
          </span>
          <span style={{ padding: '5px 12px', borderRadius: '16px', background: 'rgba(155,58,110,0.25)', border: '1px solid rgba(155,58,110,0.4)', fontSize: '9px', color: 'rgba(244,194,219,0.8)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em' }}>
            Share
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** D5 — Color bloom (searching path, mid-journey) */
function ColorBloom() {
  return (
    <PhoneFrame label="Color Bloom · Searching">
      <div style={{ width: '100%', height: '100%', background: '#0e0b0c', position: 'relative' }}>
        {/* Illustration — desaturated with color bloom */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '62%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              background: [
                'radial-gradient(ellipse at 45% 50%, rgba(251,191,36,0.18) 0%, transparent 35%)',
                'radial-gradient(ellipse at 45% 50%, rgba(200,170,100,0.12) 0%, transparent 55%)',
                'linear-gradient(180deg, #2a2520 0%, #1a1612 50%, #0e0b0c 100%)',
              ].join(', '),
            }}
          >
            {/* Bloom glow */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                width: '64px',
                height: '64px',
                background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.06) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />
          </div>
          {/* Color stripe */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, transparent 0%, rgba(251,191,36,0.05) 20%, rgba(251,191,36,0.4) 50%, rgba(251,191,36,0.05) 80%, transparent 100%)' }} />
        </div>
        {/* Text zone */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            padding: '16px 20px 20px',
            background: 'linear-gradient(to bottom, transparent, rgba(14,11,12,0.9) 30%, #0e0b0c 70%)',
          }}
        >
          <p style={{ fontSize: '7px', letterSpacing: '0.12em', color: 'rgba(251,191,36,0.4)', textTransform: 'uppercase' as const, marginBottom: '8px', fontFamily: 'var(--font-ui)' }}>
            Scene 3 of 5
          </p>
          <p style={{ fontFamily: 'var(--font-narrative)', fontSize: '11.5px', lineHeight: '1.72', color: 'rgba(255,251,235,0.8)', fontStyle: 'italic', marginBottom: '12px' }}>
            The star didn&apos;t move the way stars move.
            <br />
            It waited.
          </p>
          {/* Color bars */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
            {[true, true, true, false, false].map((earned, i) => (
              <div key={i} style={{ height: '2px', borderRadius: '1px', flex: 1, background: earned ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function DesignMockups() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
      <DarkScene />
      <EmotionalEntry />
      <ColorBloom />
      <MirrorMoment />
      <SceneCard />
    </div>
  );
}
