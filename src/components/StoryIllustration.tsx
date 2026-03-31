// Inline SVG illustrations — animations require inline rendering, not <img> src.
// Each SVG is authored at 360×480, dark background, warm cream line art.

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

function WhenHeWept({ className, style }: Props) {
  return (
    <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style>{`
        @keyframes grief-sway {
          0%, 100% { transform: rotate(0deg); }
          30%       { transform: rotate(-1.8deg); }
          70%       { transform: rotate(1.1deg); }
        }
        @keyframes tear-fall {
          0%        { opacity: 0;    transform: translateY(0px); }
          12%       { opacity: 0.65; transform: translateY(0px); }
          65%       { opacity: 0.5;  transform: translateY(9px); }
          85%, 100% { opacity: 0;    transform: translateY(16px); }
        }
        @keyframes tear-fall-2 {
          0%, 22%   { opacity: 0;    transform: translateY(0px); }
          36%       { opacity: 0.42; transform: translateY(0px); }
          72%       { opacity: 0.32; transform: translateY(11px); }
          90%, 100% { opacity: 0;    transform: translateY(18px); }
        }
        @keyframes stone-breathe {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.88; }
        }
        #grief-figure {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: grief-sway 9s ease-in-out infinite;
        }
        #tear-1 { animation: tear-fall   5.5s ease-in 0.6s  infinite; }
        #tear-2 { animation: tear-fall-2 5.5s ease-in 2.1s  infinite; }
        #stone  { animation: stone-breathe 12s ease-in-out infinite; }
      `}</style>

      <rect width="360" height="480" fill="#0D0A0E"/>
      <line x1="20" y1="392" x2="340" y2="392" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.2"/>

      <g id="stone">
        <circle cx="268" cy="328" r="150" fill="#100C0F" stroke="#D4C4A8" strokeWidth="1.5"/>
        <line x1="268" y1="182" x2="268" y2="392" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.3"/>
      </g>

      <g id="grief-figure">
        <circle cx="102" cy="260" r="17" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <path d="M102 277 C 100 296 95 318 88 348 C 86 362 86 376 88 392" stroke="#D4C4A8" strokeWidth="2"/>
        <path d="M97 288 C 84 296 70 308 58 326 C 54 338 56 360 60 376"   stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M108 288 C 118 298 124 314 122 334 C 120 352 114 368 110 382" stroke="#D4C4A8" strokeWidth="1.5"/>
      </g>

      <path id="tear-1" d="M93 272 C92 276 91 281 92 284 C93 287 96 285 96 282 C96 278 95 273 93 272Z"  stroke="#D4C4A8" strokeWidth="0.8"/>
      <path id="tear-2" d="M101 275 C100 279 99 284 100 287 C101 290 104 288 104 285 C104 281 103 276 101 275Z" stroke="#D4C4A8" strokeWidth="0.8"/>
    </svg>
  );
}

function TheNightHeAnswered({ className, style }: Props) {
  return (
    <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style>{`
        @keyframes wound-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.75; }
          50%      { transform: scale(1.22); opacity: 1;    }
        }
        @keyframes wound-dot-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1;   }
        }
        @keyframes glow-ring-expand {
          0%, 100% { opacity: 0.08; }
          50%      { opacity: 0.0;  }
        }
        @keyframes hand-reveal {
          from { opacity: 0; transform: translateX(var(--dx,0px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes gap-breathe {
          0%, 100% { opacity: 0.04; }
          50%      { opacity: 0.09; }
        }
        #left-hand  {
          animation: hand-reveal 2.2s ease-out forwards;
          --dx: -12px;
        }
        #right-hand {
          opacity: 0;
          animation: hand-reveal 2.2s ease-out 0.6s forwards;
          --dx: 12px;
        }
        #wound-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: wound-pulse 3.2s ease-in-out 1.8s infinite;
        }
        #wound-dot   { animation: wound-dot-pulse 3.2s ease-in-out 1.8s infinite; }
        #wound-glow  { animation: glow-ring-expand 3.2s ease-in-out 1.8s infinite; }
        #gap-glow    { animation: gap-breathe 4s ease-in-out infinite; }
      `}</style>

      <rect width="360" height="480" fill="#0D0A0E"/>

      <ellipse id="gap-glow" cx="180" cy="264" rx="20" ry="14" fill="#C4A66A"/>

      <g id="left-hand">
        <path d="M0 275 C50 267 95 257 132 249" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M0 290 C50 282 95 272 130 264" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M132 249 C138 247 142 247 144 250 L145 262 C145 262 148 248 152 247 C156 246 159 248 159 252 L158 264 C158 264 161 250 165 249 C169 248 172 251 172 255 L169 266 C169 266 172 254 176 254 C180 254 182 257 181 261 L176 272 C174 278 168 282 162 282 L148 280 C142 280 136 278 132 274 L130 264Z" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M132 264 C127 264 122 260 122 254 C122 249 126 246 130 248" stroke="#D4C4A8" strokeWidth="1.2"/>
      </g>

      <g id="right-hand">
        <path d="M360 275 C310 267 265 257 228 249" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M360 290 C310 282 265 272 230 264" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M228 249 C222 247 218 247 216 250 L215 262 C215 262 212 248 208 247 C204 246 201 248 201 252 L202 264 C202 264 199 250 195 249 C191 248 188 251 188 255 L191 266 C191 266 188 254 184 254 C180 254 178 257 179 261 L184 272 C186 278 192 282 198 282 L212 280 C218 280 224 278 228 274 L230 264Z" stroke="#D4C4A8" strokeWidth="1.3" fill="#0D0A0E"/>
        <path d="M228 264 C233 264 238 260 238 254 C238 249 234 246 230 248" stroke="#D4C4A8" strokeWidth="1.2"/>
        <circle id="wound-glow" cx="205" cy="264" r="10" fill="#C4A66A"/>
        <circle id="wound-ring"  cx="205" cy="264" r="6"  stroke="#C4A66A" strokeWidth="1.5"/>
        <circle id="wound-dot"   cx="205" cy="264" r="2"  fill="#C4A66A"/>
      </g>
    </svg>
  );
}

function TheKingWhoCame({ className, style }: Props) {
  return (
    <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style>{`
        @keyframes star-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.7; }
          50%      { transform: scale(1.12); opacity: 1;   }
        }
        @keyframes ray-breathe {
          0%, 100% { opacity: 0.9; }
          50%      { opacity: 0.4; }
        }
        @keyframes ray-alt {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 0.25; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.04; }
          50%      { opacity: 0.09; }
        }
        @keyframes glow-inner-p {
          0%, 100% { opacity: 0.06; }
          50%      { opacity: 0.14; }
        }
        @keyframes star-ray-descend {
          0%   { opacity: 0;    stroke-dashoffset: 1; }
          40%  { opacity: 0.12; }
          100% { opacity: 0.12; stroke-dashoffset: 0; }
        }
        @keyframes child-glow {
          0%, 100% { opacity: 0.06; }
          50%      { opacity: 0.16; }
        }
        #star-shape {
          transform-box: fill-box;
          transform-origin: center;
          animation: star-pulse 4s ease-in-out infinite;
        }
        #glow-outer { animation: glow-pulse 4s ease-in-out infinite; }
        #glow-inner-el { animation: glow-inner-p 4s ease-in-out 0.5s infinite; }
        .ray-main { animation: ray-breathe 4s ease-in-out infinite; }
        .ray-main:nth-child(2) { animation-delay: 0.5s; }
        .ray-main:nth-child(3) { animation-delay: 1s; }
        .ray-main:nth-child(4) { animation-delay: 1.5s; }
        .ray-diag { animation: ray-alt 4s ease-in-out infinite; }
        .ray-diag:nth-child(6) { animation-delay: 0.8s; }
        .ray-diag:nth-child(7) { animation-delay: 1.6s; }
        .ray-diag:nth-child(8) { animation-delay: 2.4s; }
        #star-ray-down {
          stroke-dasharray: 1;
          pathLength: 1;
          animation: star-ray-descend 3s ease-out 0.8s forwards;
        }
        #child-glow-el { animation: child-glow 5s ease-in-out 2s infinite; }
      `}</style>

      <rect width="360" height="480" fill="#0D0A0E"/>

      <circle id="glow-outer"    cx="180" cy="108" r="48" fill="#C4A66A"/>
      <circle id="glow-inner-el" cx="180" cy="108" r="24" fill="#C4A66A"/>

      <g stroke="#C4A66A" strokeLinecap="round">
        <line className="ray-main" x1="180" y1="68"  x2="180" y2="52"  strokeWidth="1.2"/>
        <line className="ray-main" x1="180" y1="148" x2="180" y2="164" strokeWidth="1.2"/>
        <line className="ray-main" x1="140" y1="108" x2="124" y2="108" strokeWidth="1.2"/>
        <line className="ray-main" x1="220" y1="108" x2="236" y2="108" strokeWidth="1.2"/>
        <line className="ray-diag" x1="152" y1="80"  x2="141" y2="69"  strokeWidth="0.9"/>
        <line className="ray-diag" x1="208" y1="80"  x2="219" y2="69"  strokeWidth="0.9"/>
        <line className="ray-diag" x1="152" y1="136" x2="141" y2="147" strokeWidth="0.9"/>
        <line className="ray-diag" x1="208" y1="136" x2="219" y2="147" strokeWidth="0.9"/>
      </g>

      <path id="star-shape" d="M180 86 L184 100 L196 96 L188 108 L196 120 L184 116 L180 130 L176 116 L164 120 L172 108 L164 96 L176 100Z" stroke="#C4A66A" strokeWidth="1.2" fill="#C4A66A" opacity="0.7"/>

      <line id="star-ray-down" x1="180" y1="164" x2="180" y2="376" stroke="#C4A66A" strokeWidth="0.6" pathLength="1" strokeDasharray="1"/>

      <path d="M116 380 L102 430 L258 430 L244 380Z" stroke="#D4C4A8" strokeWidth="1.5" fill="#100C0F"/>
      <path d="M124 382 L114 422 L246 422 L236 382Z" stroke="#D4C4A8" strokeWidth="0.8" fill="#0D0A0E" opacity="0.5"/>
      <line x1="136" y1="390" x2="150" y2="384" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.35"/>
      <line x1="155" y1="392" x2="168" y2="386" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.35"/>
      <line x1="190" y1="392" x2="204" y2="386" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.35"/>
      <line x1="210" y1="390" x2="222" y2="384" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.35"/>

      <circle id="child-glow-el" cx="180" cy="406" r="30" fill="#C4A66A"/>
      <ellipse cx="180" cy="406" rx="38" ry="14" fill="#110D10" stroke="#D4C4A8" strokeWidth="1.3"/>
      <path d="M150 406 C158 398 170 396 180 397 C190 396 202 398 210 406" stroke="#D4C4A8" strokeWidth="0.8" opacity="0.4"/>
      <circle cx="155" cy="405" r="7" fill="#110D10" stroke="#D4C4A8" strokeWidth="1"/>
    </svg>
  );
}

function ComeAndSee({ className, style }: Props) {
  return (
    <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style>{`
        @keyframes path-draw {
          from { stroke-dashoffset: 1; opacity: 0.2; }
          to   { stroke-dashoffset: 0; opacity: 0.35; }
        }
        @keyframes path-fade {
          from { stroke-dashoffset: 1; opacity: 0.1; }
          to   { stroke-dashoffset: 0; opacity: 0.15; }
        }
        @keyframes figure-reveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arm-beckon {
          0%, 100% { transform: rotate(0deg); }
          40%      { transform: rotate(-6deg); }
          70%      { transform: rotate(3deg); }
        }
        @keyframes walkers-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hand-open {
          0%, 100% { opacity: 0.7; }
          45%      { opacity: 1; }
        }
        #path-left   { stroke-dasharray: 1; pathLength: 1; animation: path-draw 2.5s ease-out forwards; }
        #path-right  { stroke-dasharray: 1; pathLength: 1; animation: path-draw 2.5s ease-out 0.3s forwards; opacity: 0.2; }
        #path-fade-l { stroke-dasharray: 1; pathLength: 1; animation: path-fade 2.5s ease-out 0.5s forwards; opacity: 0.1; }
        #path-fade-r { stroke-dasharray: 1; pathLength: 1; animation: path-fade 2.5s ease-out 0.7s forwards; opacity: 0.1; }
        #standing-figure { animation: figure-reveal 1.2s ease-out 1.5s both; }
        #left-arm {
          transform-box: fill-box;
          transform-origin: 100% 50%;
          animation: arm-beckon 5s ease-in-out 2.5s infinite;
        }
        #open-hand { animation: hand-open 5s ease-in-out 2.5s infinite; }
        #walkers   { animation: walkers-in 1.4s ease-out 2s both; }
      `}</style>

      <rect width="360" height="480" fill="#0D0A0E"/>

      <path id="path-left"  d="M60 460 C100 420 128 370 148 310 C162 268 168 240 172 210" stroke="#D4C4A8" strokeWidth="1.2" pathLength="1" strokeDasharray="1"/>
      <path id="path-right" d="M300 460 C260 420 232 370 212 310 C198 268 192 240 188 210" stroke="#D4C4A8" strokeWidth="1.2" pathLength="1" strokeDasharray="1"/>
      <path id="path-fade-l" d="M172 210 C175 196 178 186 180 180" stroke="#D4C4A8" strokeWidth="0.8" pathLength="1" strokeDasharray="1"/>
      <path id="path-fade-r" d="M188 210 C185 196 182 186 180 180" stroke="#D4C4A8" strokeWidth="0.8" pathLength="1" strokeDasharray="1"/>

      <g id="standing-figure">
        <circle cx="180" cy="220" r="14" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <line x1="180" y1="234" x2="180" y2="286" stroke="#D4C4A8" strokeWidth="1.8"/>
        <g id="left-arm">
          <path d="M180 250 C165 248 150 242 136 248" stroke="#D4C4A8" strokeWidth="1.5"/>
        </g>
        <g id="open-hand">
          <line x1="136" y1="248" x2="130" y2="242" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
          <line x1="136" y1="248" x2="128" y2="249" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
          <line x1="136" y1="248" x2="130" y2="254" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
        </g>
        <path d="M180 250 C194 248 208 242 220 238" stroke="#D4C4A8" strokeWidth="1.5"/>
        <path d="M180 286 C174 310 170 336 168 360" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M180 286 C186 310 190 336 192 360" stroke="#D4C4A8" strokeWidth="1.4"/>
      </g>

      <g id="walkers">
        <circle cx="152" cy="366" r="8"  stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <line x1="152" y1="374" x2="152" y2="404" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M152 384 C146 382 141 184 137 388" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <path d="M152 384 C158 382 163 384 167 388" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <path d="M152 404 C148 416 146 428 145 438" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
        <path d="M152 404 C156 416 158 428 159 438" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>

        <circle cx="208" cy="372" r="8"  stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <line x1="208" y1="380" x2="208" y2="408" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M208 390 C202 388 197 390 193 394" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <path d="M208 390 C214 388 219 390 223 394" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <path d="M208 408 C204 420 202 432 201 442" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
        <path d="M208 408 C212 420 214 432 215 442" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
      </g>
    </svg>
  );
}

function TheStormHeStilled({ className, style }: Props) {
  return (
    <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <style>{`
        @keyframes wave-shift-a {
          0%   { transform: translateX(0px);  opacity: 0.55; }
          50%  { transform: translateX(-7px); opacity: 0.7;  }
          100% { transform: translateX(0px);  opacity: 0.55; }
        }
        @keyframes wave-shift-b {
          0%   { transform: translateX(0px); opacity: 0.5; }
          50%  { transform: translateX(8px); opacity: 0.65; }
          100% { transform: translateX(0px); opacity: 0.5; }
        }
        @keyframes wave-shift-c {
          0%   { transform: translateX(0px);  opacity: 0.5; }
          50%  { transform: translateX(-5px); opacity: 0.62; }
          100% { transform: translateX(0px);  opacity: 0.5; }
        }
        @keyframes spray-pop {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          40%      { opacity: 0.5; transform: translateY(-4px); }
        }
        @keyframes arm-authority {
          0%   { transform: rotate(0deg);  opacity: 0; }
          15%  { opacity: 1; }
          60%  { transform: rotate(-8deg); }
          100% { transform: rotate(0deg);  opacity: 1; }
        }
        @keyframes scene-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes calm-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        #wave-1 { animation: wave-shift-a 2.8s ease-in-out infinite; }
        #wave-2 { animation: wave-shift-b 2.4s ease-in-out 0.3s infinite; }
        #wave-3 { animation: wave-shift-c 3.1s ease-in-out 0.6s infinite; }
        #wave-4 { animation: wave-shift-a 2.6s ease-in-out 0.9s infinite; }
        #wave-5 { animation: wave-shift-b 2.9s ease-in-out 0.2s infinite; }
        #wave-6 { animation: wave-shift-c 3.3s ease-in-out 0.5s infinite; }
        #spray-1 { animation: spray-pop 2.2s ease-in-out 0.1s infinite; }
        #spray-2 { animation: spray-pop 2.5s ease-in-out 0.8s infinite; }
        #spray-3 { animation: spray-pop 2.1s ease-in-out 1.3s infinite; }
        #calm-lines { animation: calm-in 1.5s ease-out 0.5s both; }
        #standing-figure { animation: scene-in 1.2s ease-out 0.3s both; }
        #raised-arm {
          transform-box: fill-box;
          transform-origin: 190px 334px;
          animation: arm-authority 2s ease-out 1s both;
        }
        #huddled { animation: scene-in 1.8s ease-out 0.2s both; }
      `}</style>

      <rect width="360" height="480" fill="#0D0A0E"/>

      <path id="wave-1" d="M0 248 C14 236 28 252 42 240 C56 228 68 248 80 238"  stroke="#D4C4A8" strokeWidth="1.3"/>
      <path id="wave-2" d="M0 268 C16 252 30 270 46 256 C60 244 74 264 88 252"  stroke="#D4C4A8" strokeWidth="1.3"/>
      <path id="wave-3" d="M0 290 C18 272 34 294 52 278 C66 265 78 285 90 272"  stroke="#D4C4A8" strokeWidth="1.4"/>
      <path id="wave-4" d="M0 314 C22 294 38 318 58 302 C74 288 84 310 94 298"  stroke="#D4C4A8" strokeWidth="1.4"/>
      <path id="wave-5" d="M0 340 C24 318 42 344 64 326 C78 314 86 338 98 326"  stroke="#D4C4A8" strokeWidth="1.3"/>
      <path id="wave-6" d="M0 366 C26 346 44 370 66 354 C80 342 90 362 100 350" stroke="#D4C4A8" strokeWidth="1.2"/>
      <path id="spray-1" d="M24 230 C22 222 28 218 32 224" stroke="#D4C4A8" strokeWidth="0.8"/>
      <path id="spray-2" d="M56 238 C52 228 60 222 64 230" stroke="#D4C4A8" strokeWidth="0.8"/>
      <path id="spray-3" d="M18 308 C14 298 22 292 26 300" stroke="#D4C4A8" strokeWidth="0.8"/>

      <g id="calm-lines" stroke="#D4C4A8">
        <line x1="272" y1="250" x2="360" y2="250" strokeWidth="1"   opacity="0.3"/>
        <line x1="266" y1="265" x2="360" y2="265" strokeWidth="1"   opacity="0.28"/>
        <line x1="270" y1="280" x2="360" y2="280" strokeWidth="1"   opacity="0.26"/>
        <line x1="268" y1="296" x2="360" y2="296" strokeWidth="0.9" opacity="0.24"/>
        <line x1="272" y1="312" x2="360" y2="312" strokeWidth="0.9" opacity="0.22"/>
        <line x1="270" y1="328" x2="360" y2="328" strokeWidth="0.8" opacity="0.20"/>
        <line x1="272" y1="344" x2="360" y2="344" strokeWidth="0.8" opacity="0.18"/>
        <line x1="272" y1="360" x2="360" y2="360" strokeWidth="0.7" opacity="0.15"/>
      </g>

      <path d="M100 360 C110 376 130 384 180 386 C230 388 250 378 260 362" stroke="#D4C4A8" strokeWidth="2" fill="#100C0F"/>
      <path d="M100 360 L260 360" stroke="#D4C4A8" strokeWidth="1.5"/>
      <path d="M108 348 C120 344 150 342 180 342 C210 342 240 344 252 348" stroke="#D4C4A8" strokeWidth="1.2" opacity="0.6"/>

      <g id="huddled">
        <circle cx="130" cy="332" r="8" stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <path d="M130 340 C126 348 124 354 124 360" stroke="#D4C4A8" strokeWidth="1.2"/>
        <circle cx="150" cy="330" r="8" stroke="#D4C4A8" strokeWidth="1.2" fill="#0D0A0E"/>
        <path d="M150 338 C148 346 148 354 148 360" stroke="#D4C4A8" strokeWidth="1.2"/>
        <path d="M144 350 C138 350 134 352 132 356" stroke="#D4C4A8" strokeWidth="1" opacity="0.7"/>
      </g>

      <g id="standing-figure">
        <circle cx="190" cy="308" r="13" stroke="#D4C4A8" strokeWidth="1.5" fill="#0D0A0E"/>
        <line x1="190" y1="321" x2="190" y2="356" stroke="#D4C4A8" strokeWidth="1.8"/>
        <path d="M190 334 C178 336 168 334 158 338" stroke="#D4C4A8" strokeWidth="1.4"/>
        <path d="M190 356 C186 366 184 374 184 382" stroke="#D4C4A8" strokeWidth="1.3"/>
        <path d="M190 356 C194 366 196 374 196 382" stroke="#D4C4A8" strokeWidth="1.3"/>
      </g>

      <g id="raised-arm">
        <path d="M190 334 C196 322 200 308 202 294 C204 282 204 270 202 260" stroke="#D4C4A8" strokeWidth="1.5"/>
        <line x1="202" y1="260" x2="197" y2="252" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <line x1="202" y1="260" x2="205" y2="252" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
        <line x1="202" y1="260" x2="210" y2="257" stroke="#D4C4A8" strokeWidth="1" opacity="0.8"/>
      </g>
    </svg>
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
