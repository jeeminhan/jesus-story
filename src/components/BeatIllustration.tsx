// Inline SVG beat illustrations — animations require inline rendering, not <img> src.
// Each SVG is authored at 360x300, dark background, warm cream line art.

interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

// ─── when-he-wept beats ───

function WhenHeWeptBeat1({ className, style }: SvgProps) {
  const css = `
    @keyframes figure-walk {
      0%, 100% { transform: translateX(0); }
      50%      { transform: translateX(5px); }
    }
    @keyframes road-fade {
      from { opacity: 0; stroke-dashoffset: 1; }
      to   { opacity: 0.25; stroke-dashoffset: 0; }
    }
    @keyframes watchers-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #messenger {
      transform-box: fill-box;
      transform-origin: center;
      animation: figure-walk 1.8s ease-in-out infinite;
    }
    #road { stroke-dasharray: 1; pathLength: 1; animation: road-fade 2s ease-out forwards; }
    #watchers { animation: watchers-in 1.5s ease-out 0.8s both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Horizon line */}
      <line x1="0" y1="200" x2="360" y2="200" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* Road stretching toward horizon */}
      <path id="road" d="M80 280 C120 240 150 220 180 200" stroke="#D4C4A8" strokeWidth="1" pathLength={1} strokeDasharray="1"/>
      <path d="M280 280 C240 240 210 220 180 200" stroke="#D4C4A8" strokeWidth="1" pathLength={1} strokeDasharray="1" opacity="0.2"/>

      {/* Messenger figure */}
      <g id="messenger">
        <circle cx="130" cy="168" r="11" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <path d="M130 179 C129 190 126 202 122 216" stroke="#D4C4A8" strokeWidth="1.8"/>
        <path d="M130 188 C122 185 114 180 108 178" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M130 188 C138 192 146 198 150 204" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M122 216 C118 226 112 236 108 248" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M122 216 C126 228 128 240 126 252" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M122 179 C115 172 105 168 98 170" stroke="#D4C4A8" strokeWidth="1" opacity="0.5"/>
        <path d="M119 185 C111 180 102 178 96 181" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.35"/>
      </g>

      {/* Two watching figures (Martha and Mary) */}
      <g id="watchers">
        <path d="M258 140 C258 120 280 110 302 110 C324 110 346 120 346 140 L346 240 L258 240 Z" stroke="#D4C4A8" strokeWidth="1" fill="#100C0F" opacity="0.6"/>

        <circle cx="282" cy="158" r="10" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M282 168 C282 180 280 195 278 210" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M278 176 C272 178 266 182 262 188" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M284 176 C290 180 294 186 294 194" stroke="#D4C4A8" strokeWidth="1.2"/>

        <circle cx="316" cy="162" r="10" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M316 172 C315 184 314 198 312 212" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M312 180 C308 175 306 172 308 168" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M318 180 C324 184 328 190 326 198" stroke="#D4C4A8" strokeWidth="1.2"/>
      </g>

      {/* Message scroll near messenger's hand */}
      <rect x="148" y="198" width="14" height="10" rx="2" stroke="#D4C4A8" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <line x1="150" y1="202" x2="160" y2="202" stroke="#D4C4A8" strokeWidth="0.5" opacity="0.4"/>
      <line x1="150" y1="205" x2="158" y2="205" stroke="#D4C4A8" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

function WhenHeWeptBeat2({ className, style }: SvgProps) {
  const css = `
    @keyframes stillness {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.92; }
    }
    @keyframes wait-pulse {
      0%, 100% { r: 42; opacity: 0.04; }
      50%      { r: 58; opacity: 0; }
    }
    @keyframes days-fade {
      from { opacity: 0; }
      to   { opacity: 0.18; }
    }
    #still-figure { animation: stillness 6s ease-in-out infinite; }
    #wait-ring    { animation: wait-pulse 4s ease-in-out infinite; }
    #days-text    { animation: days-fade 2s ease-out 1s both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Expanding stillness ring */}
      <circle id="wait-ring" cx="148" cy="160" r="42" fill="#D4C4A8"/>

      {/* Seated still figure */}
      <g id="still-figure">
        <circle cx="148" cy="112" r="16" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <path d="M148 128 L148 180" stroke="#D4C4A8" strokeWidth="2"/>
        <path d="M148 148 C138 152 128 156 118 158" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M148 148 C158 152 168 156 178 158" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M148 180 C138 188 122 192 108 192" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M148 180 C158 188 174 192 188 192" stroke="#D4C4A8" strokeWidth="1.4"/>
        <line x1="98" y1="218" x2="198" y2="218" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.2"/>
      </g>

      {/* Two days markers */}
      <g id="days-text">
        <line x1="268" y1="100" x2="268" y2="180" stroke="#D4C4A8" strokeWidth="1.5" opacity="0.6"/>
        <line x1="284" y1="100" x2="284" y2="180" stroke="#D4C4A8" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="268" cy="96" r="3" fill="#D4C4A8" opacity="0.5"/>
        <circle cx="284" cy="96" r="3" fill="#D4C4A8" opacity="0.5"/>
        <text x="259" y="198" fontSize="9" fill="#D4C4A8" opacity="0.35" fontFamily="serif" letterSpacing="2">I   II</text>
      </g>

      {/* Directional arrows suggesting urgency */}
      <path d="M240 150 L220 150" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.2"/>
      <path d="M238 150 L234 146 M238 150 L234 154" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.2"/>
      <path d="M240 160 L220 160" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.15"/>
      <path d="M238 160 L234 156 M238 160 L234 164" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.15"/>
    </svg>
  );
}

function WhenHeWeptBeat3({ className, style }: SvgProps) {
  const css = `
    @keyframes approach {
      from { transform: translateX(-10px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes mourner-sway {
      0%, 100% { transform: rotate(0deg); }
      40%      { transform: rotate(-2deg); }
      70%      { transform: rotate(1.5deg); }
    }
    @keyframes house-settle {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #approaching-figure { animation: approach 2s ease-out forwards; }
    #mourner-1 {
      transform-box: fill-box; transform-origin: 50% 0%;
      animation: mourner-sway 5s ease-in-out 0.2s infinite;
    }
    #mourner-2 {
      transform-box: fill-box; transform-origin: 50% 0%;
      animation: mourner-sway 6s ease-in-out 1s infinite;
    }
    #mourner-3 {
      transform-box: fill-box; transform-origin: 50% 0%;
      animation: mourner-sway 5.5s ease-in-out 0.6s infinite;
    }
    #house { animation: house-settle 1.5s ease-out both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Ground */}
      <line x1="0" y1="240" x2="360" y2="240" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* House (Bethany) */}
      <g id="house">
        <rect x="200" y="110" width="140" height="130" stroke="#D4C4A8" strokeWidth="1.3" fill="#0E0B0F"/>
        <line x1="195" y1="110" x2="345" y2="110" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M250 240 L250 185 C250 178 270 178 270 185 L270 240" stroke="#D4C4A8" strokeWidth="1" fill="#0A080B"/>
        <rect x="294" y="130" width="22" height="18" rx="2" stroke="#D4C4A8" strokeWidth="0.8" fill="none" opacity="0.5"/>
      </g>

      {/* Mourners gathered at door */}
      <g id="mourner-1">
        <circle cx="242" cy="176" r="9" stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <path d="M242 185 C240 196 238 210 236 224" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M238 192 C233 194 228 196 224 200" stroke="#D4C4A8" strokeWidth="1.1"/>
        <path d="M245 192 C249 196 252 202 252 210" stroke="#D4C4A8" strokeWidth="1.1"/>
      </g>
      <g id="mourner-2">
        <circle cx="286" cy="172" r="9" stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <path d="M286 181 C285 192 284 206 282 220" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M282 188 C277 188 272 190 268 195" stroke="#D4C4A8" strokeWidth="1.1"/>
        <path d="M289 188 C294 192 298 198 298 206" stroke="#D4C4A8" strokeWidth="1.1"/>
      </g>
      <g id="mourner-3">
        <circle cx="324" cy="169" r="9" stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <path d="M324 178 C323 190 322 204 320 218" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M320 185 C315 186 310 188 306 194" stroke="#D4C4A8" strokeWidth="1.1"/>
        <path d="M327 185 C331 190 334 197 332 205" stroke="#D4C4A8" strokeWidth="1.1"/>
      </g>

      {/* Approaching figure -- Jesus */}
      <g id="approaching-figure">
        <circle cx="82" cy="178" r="13" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <path d="M82 191 L82 232" stroke="#D4C4A8" strokeWidth="1.8"/>
        <path d="M82 205 C74 208 66 210 58 210" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M82 205 C90 208 98 210 104 210" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M82 232 C78 242 75 252 74 260" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M82 232 C86 242 89 252 90 260" stroke="#D4C4A8" strokeWidth="1.3"/>
        <line x1="46" y1="258" x2="62" y2="254" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.25"/>
        <line x1="38" y1="264" x2="56" y2="261" stroke="#D4C4A8" strokeWidth="0.5" opacity="0.18"/>
      </g>
    </svg>
  );
}

function WhenHeWeptBeat4({ className, style }: SvgProps) {
  const css = `
    @keyframes martha-lean {
      0%, 100% { transform: rotate(0deg); }
      35%      { transform: rotate(3deg); }
      70%      { transform: rotate(-1deg); }
    }
    @keyframes jesus-steady {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.92; }
    }
    @keyframes tension-line {
      from { stroke-dashoffset: 1; opacity: 0; }
      to   { stroke-dashoffset: 0; opacity: 0.12; }
    }
    #martha {
      transform-box: fill-box;
      transform-origin: 50% 0%;
      animation: martha-lean 6s ease-in-out infinite;
    }
    #jesus-figure { animation: jesus-steady 8s ease-in-out infinite; }
    #tension { stroke-dasharray: 1; pathLength: 1; animation: tension-line 2s ease-out 0.5s both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Dusty ground */}
      <line x1="0" y1="248" x2="360" y2="248" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* Tension line between them */}
      <path id="tension" d="M180 248 C180 220 180 190 180 160" stroke="#D4C4A8" strokeWidth="1.5" pathLength={1} strokeDasharray="1"/>

      {/* Martha -- leaning forward, confronting */}
      <g id="martha">
        <circle cx="115" cy="118" r="14" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <path d="M115 132 C114 148 112 164 110 182" stroke="#D4C4A8" strokeWidth="1.8"/>
        <path d="M114 144 C124 140 138 136 152 134" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M152 134 L162 130" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M116 148 C110 156 106 164 104 172" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M110 182 C107 196 104 212 102 228" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M112 184 C116 198 118 214 118 230" stroke="#D4C4A8" strokeWidth="1.3"/>
      </g>

      {/* Jesus -- facing her, still, unhurried */}
      <g id="jesus-figure">
        <circle cx="248" cy="114" r="14" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <line x1="248" y1="128" x2="248" y2="190" stroke="#D4C4A8" strokeWidth="1.8"/>
        <path d="M248 148 C238 154 228 158 218 160" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M248 148 C258 154 268 158 278 160" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M248 190 C244 206 242 220 241 236" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M248 190 C252 206 254 220 255 236" stroke="#D4C4A8" strokeWidth="1.3"/>
      </g>

      {/* Space between them */}
      <ellipse cx="182" cy="180" rx="25" ry="6" fill="#D4C4A8" opacity="0.025"/>
    </svg>
  );
}

function WhenHeWeptBeat5({ className, style }: SvgProps) {
  const css = `
    @keyframes weep-sway {
      0%, 100% { transform: rotate(0deg); }
      35%      { transform: rotate(-2deg); }
      68%      { transform: rotate(1.2deg); }
    }
    @keyframes tear-a {
      0%        { opacity: 0;    transform: translateY(0); }
      10%       { opacity: 0.7;  transform: translateY(0); }
      65%       { opacity: 0.5;  transform: translateY(11px); }
      85%, 100% { opacity: 0;    transform: translateY(18px); }
    }
    @keyframes tear-b {
      0%, 25%   { opacity: 0;    transform: translateY(0); }
      38%       { opacity: 0.55; transform: translateY(0); }
      78%       { opacity: 0.4;  transform: translateY(13px); }
      95%, 100% { opacity: 0;    transform: translateY(20px); }
    }
    @keyframes tear-c {
      0%, 45%   { opacity: 0;    transform: translateY(0); }
      55%       { opacity: 0.45; transform: translateY(0); }
      88%       { opacity: 0.3;  transform: translateY(10px); }
      100%      { opacity: 0;    transform: translateY(16px); }
    }
    @keyframes crowd-sway {
      0%, 100% { transform: rotate(0deg); }
      50%      { transform: rotate(-1deg); }
    }
    #weeping-figure {
      transform-box: fill-box;
      transform-origin: 50% 0%;
      animation: weep-sway 7s ease-in-out infinite;
    }
    #tear-a { animation: tear-a 5s ease-in 0s  infinite; }
    #tear-b { animation: tear-b 5s ease-in 1.4s infinite; }
    #tear-c { animation: tear-c 5s ease-in 2.8s infinite; }
    #crowd  {
      transform-box: fill-box; transform-origin: 50% 0%;
      animation: crowd-sway 9s ease-in-out 1s infinite;
    }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Ground */}
      <line x1="0" y1="256" x2="360" y2="256" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* Surrounding mourners */}
      <g id="crowd" opacity="0.35">
        <circle cx="50" cy="148" r="9" stroke="#D4C4A8" strokeWidth="1"/>
        <path d="M50 157 L50 188" stroke="#D4C4A8" strokeWidth="1.2"/>
        <circle cx="80" cy="142" r="9" stroke="#D4C4A8" strokeWidth="1"/>
        <path d="M80 151 L80 182" stroke="#D4C4A8" strokeWidth="1.2"/>
        <circle cx="278" cy="148" r="9" stroke="#D4C4A8" strokeWidth="1"/>
        <path d="M278 157 L278 188" stroke="#D4C4A8" strokeWidth="1.2"/>
        <circle cx="308" cy="142" r="9" stroke="#D4C4A8" strokeWidth="1"/>
        <path d="M308 151 L308 182" stroke="#D4C4A8" strokeWidth="1.2"/>
      </g>

      {/* Jesus weeping -- center, head bowed */}
      <g id="weeping-figure">
        <circle cx="180" cy="96" r="17" stroke="#D4C4A8" strokeWidth="1.8" fill="#0D0A0E"/>
        <line x1="180" y1="113" x2="179" y2="124" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M179 124 C177 142 174 162 170 188" stroke="#D4C4A8" strokeWidth="2"/>
        <path d="M176 132 C166 138 154 144 144 150" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M144 150 C140 160 138 172 138 184" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M183 132 C192 138 202 144 212 150" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M212 150 C216 160 218 172 218 184" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M170 188 C166 204 163 220 162 236" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M172 190 C176 206 178 222 178 238" stroke="#D4C4A8" strokeWidth="1.4"/>
      </g>

      {/* Three tears */}
      <path id="tear-a" d="M170 110 C169 114 168 119 169 122 C170 125 173 123 173 120 C173 117 172 112 170 110Z" stroke="#D4C4A8" strokeWidth="0.9"/>
      <path id="tear-b" d="M179 112 C178 116 177 121 178 124 C179 127 182 125 182 122 C182 119 181 114 179 112Z" stroke="#D4C4A8" strokeWidth="0.9"/>
      <path id="tear-c" d="M187 111 C186 115 185 120 186 123 C187 126 190 124 190 121 C190 118 189 113 187 111Z" stroke="#D4C4A8" strokeWidth="0.8"/>
    </svg>
  );
}

function WhenHeWeptBeat6({ className, style }: SvgProps) {
  const css = `
    @keyframes light-spill {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes voice-ripple {
      0%   { r: 2;  opacity: 0.6; stroke-width: 1.4; }
      100% { r: 28; opacity: 0;   stroke-width: 0.4; }
    }
    @keyframes voice-ripple-2 {
      0%, 30% { r: 2;  opacity: 0; }
      35%     { opacity: 0.5; r: 3; }
      100%    { r: 22; opacity: 0; stroke-width: 0.5; }
    }
    @keyframes figure-emerge {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes caller-arm {
      0%   { transform: rotate(0deg); }
      40%  { transform: rotate(8deg); }
      100% { transform: rotate(0deg); }
    }
    #cave-light { animation: light-spill 2s ease-out both; }
    #ripple-1 { animation: voice-ripple   2.2s ease-out 1.5s infinite; }
    #ripple-2 { animation: voice-ripple-2 2.2s ease-out 2.2s infinite; }
    #caller-right-arm {
      transform-box: fill-box;
      transform-origin: 218px 148px;
      animation: caller-arm 3s ease-in-out 1.5s infinite;
    }
    #wrapped-figure { animation: figure-emerge 1.8s ease-out 0.8s both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Ground */}
      <line x1="0" y1="252" x2="360" y2="252" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* Cave / tomb entrance */}
      <path d="M220 252 L220 120 C220 90 260 78 300 78 C340 78 360 96 360 120 L360 252Z" fill="#08060A" stroke="#D4C4A8" strokeWidth="1.2"/>
      <path d="M220 252 L220 130 C220 105 240 96 260 96 C280 96 300 105 300 130 L300 252" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.4"/>

      {/* Light spilling into cave */}
      <g id="cave-light">
        <path d="M220 168 C225 158 240 148 258 146 C248 162 244 182 244 200 C244 218 248 234 255 248 L220 248Z" fill="#C4A66A" opacity="0.06"/>
        <path d="M220 185 C226 176 238 170 250 170 C245 184 244 198 246 212 C247 224 250 238 255 248 L220 248Z" fill="#C4A66A" opacity="0.04"/>
      </g>

      {/* Wrapped figure emerging */}
      <g id="wrapped-figure">
        <rect x="254" y="122" width="30" height="110" rx="4" stroke="#D4C4A8" strokeWidth="1.2" fill="#0E0B10" opacity="0.9"/>
        <line x1="254" y1="138" x2="284" y2="138" stroke="#D4C4A8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="254" y1="155" x2="284" y2="155" stroke="#D4C4A8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="254" y1="172" x2="284" y2="172" stroke="#D4C4A8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="254" y1="189" x2="284" y2="189" stroke="#D4C4A8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="254" y1="206" x2="284" y2="206" stroke="#D4C4A8" strokeWidth="0.7" opacity="0.5"/>
        <circle cx="269" cy="116" r="12" stroke="#D4C4A8" strokeWidth="1.2" fill="#0E0B10"/>
        <line x1="258" y1="112" x2="280" y2="112" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.45"/>
        <line x1="256" y1="118" x2="282" y2="118" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.45"/>
      </g>

      {/* Calling figure */}
      <circle cx="130" cy="112" r="15" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
      <line x1="130" y1="127" x2="130" y2="180" stroke="#D4C4A8" strokeWidth="1.8"/>
      <path d="M130 145 C142 138 158 132 174 130" stroke="#D4C4A8" strokeWidth="1.5"/>
      <g id="caller-right-arm">
        <path d="M130 145 C118 140 108 132 100 126" stroke="#D4C4A8" strokeWidth="1.4"/>
      </g>
      <path d="M130 180 C126 196 123 212 122 228" stroke="#D4C4A8" strokeWidth="1.3"/>
      <path d="M130 180 C134 196 137 212 138 228" stroke="#D4C4A8" strokeWidth="1.3"/>

      {/* Voice ripple circles */}
      <circle id="ripple-1" cx="178" cy="140" r="2" stroke="#D4C4A8"/>
      <circle id="ripple-2" cx="178" cy="140" r="2" stroke="#D4C4A8"/>
    </svg>
  );
}

function WhenHeWeptBeat7({ className, style }: SvgProps) {
  const css = `
    @keyframes cloth-fall {
      0%   { transform: translateY(0) rotate(0deg);   opacity: 0.8; }
      100% { transform: translateY(24px) rotate(15deg); opacity: 0; }
    }
    @keyframes cloth-fall-2 {
      0%, 20% { transform: translateY(0) rotate(0deg);    opacity: 0; }
      25%     { opacity: 0.6; }
      100%    { transform: translateY(20px) rotate(-12deg); opacity: 0; }
    }
    @keyframes life-glow {
      0%, 100% { opacity: 0.05; }
      50%      { opacity: 0.12; }
    }
    @keyframes lazarus-breathe {
      0%, 100% { transform: scaleY(1); }
      50%      { transform: scaleY(1.015); }
    }
    @keyframes helpers-reveal {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #cloth-1 { animation: cloth-fall   2.5s ease-in 1s both; }
    #cloth-2 { animation: cloth-fall-2 2.5s ease-in 0s both; }
    #cloth-3 { animation: cloth-fall   2.5s ease-in 2s both; }
    #life-glow-el { animation: life-glow 4s ease-in-out infinite; }
    #lazarus {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: lazarus-breathe 4s ease-in-out 1.5s infinite;
    }
    #helpers { animation: helpers-reveal 1.5s ease-out both; }
  `;
  return (
    <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <rect width="360" height="300" fill="#0D0A0E"/>

      {/* Ground */}
      <line x1="0" y1="258" x2="360" y2="258" stroke="#D4C4A8" strokeWidth="0.6" opacity="0.15"/>

      {/* Glow of life around Lazarus */}
      <circle id="life-glow-el" cx="184" cy="152" r="55" fill="#C4A66A"/>

      {/* Lazarus -- standing, being unwrapped */}
      <g id="lazarus">
        <circle cx="184" cy="96" r="16" stroke="#D4C4A8" strokeWidth="1.8" fill="#0D0A0E"/>
        <line x1="184" y1="112" x2="184" y2="200" stroke="#D4C4A8" strokeWidth="2"/>
        <path d="M184 138 C172 142 160 146 150 148" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M184 138 C196 142 208 146 218 148" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M184 200 C180 218 178 236 177 252" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M184 200 C188 218 190 236 191 252" stroke="#D4C4A8" strokeWidth="1.4"/>
      </g>

      {/* Falling grave cloths */}
      <path id="cloth-1" d="M172 118 C168 124 162 132 158 138 C154 130 152 122 156 114 C162 110 170 112 172 118Z" stroke="#D4C4A8" strokeWidth="0.9" fill="#0D0A0E" opacity="0.7"/>
      <path id="cloth-2" d="M185 108 C188 116 186 126 182 130 L178 126 C176 118 178 108 185 108Z" stroke="#D4C4A8" strokeWidth="0.9" fill="#0D0A0E" opacity="0.6"/>
      <path id="cloth-3" d="M196 120 C200 128 206 136 210 142 C214 134 214 124 210 116 C204 112 196 114 196 120Z" stroke="#D4C4A8" strokeWidth="0.9" fill="#0D0A0E" opacity="0.65"/>

      {/* Two helpers pulling wrappings free */}
      <g id="helpers">
        <circle cx="88" cy="122" r="11" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M88 133 L88 178" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M88 148 C104 146 122 144 140 144" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M88 154 C104 154 118 152 132 150" stroke="#D4C4A8" strokeWidth="1.2" opacity="0.6"/>
        <path d="M88 178 C84 194 82 210 81 226" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M88 178 C92 194 94 210 95 226" stroke="#D4C4A8" strokeWidth="1.2"/>

        <circle cx="278" cy="122" r="11" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M278 133 L278 178" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M278 148 C262 146 244 144 228 144" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M278 154 C262 154 248 152 236 150" stroke="#D4C4A8" strokeWidth="1.2" opacity="0.6"/>
        <path d="M278 178 C274 194 272 210 271 226" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M278 178 C282 194 284 210 285 226" stroke="#D4C4A8" strokeWidth="1.2"/>
      </g>
    </svg>
  );
}

// ─── Lookup map ───

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

// Map beat IDs to SVG file paths for fallback rendering
function getBeatSvgPath(slug: string, beatId: string): string | null {
  // Extract beat number from beat ID (e.g. 'beat-grief-8' → '8')
  const match = beatId.match(/(\d+)$/);
  if (!match) return null;
  return `/beat-illustrations/${slug}/beat-${match[1]}.svg`;
}

// Stories that have file-based beat SVGs in /public/beat-illustrations/
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
  // Try inline component first (for animations)
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
