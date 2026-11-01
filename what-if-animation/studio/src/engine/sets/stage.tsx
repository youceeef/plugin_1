import React from 'react';

// The Auditorium Stage Set: for public speaking beats ("a speech in front of a crowd"), performances, keynotes, and auditorium scenes.
// Features a dark theater shell, stage floorboards, theatrical spotlight cone, presentation screen, microphone stand, and foreground audience silhouettes.

const STAGE_PALETTE = {
  void: '#080811',
  woodFloor: '#241B15',
  woodLines: '#17110D',
  woodLip: '#423227',
  screenBg: '#131A2B',
  screenBorder: '#2A3B59',
  accent: '#38BDF8',
  micChrome: '#CBD5E1',
};

export const Stage: React.FC<{
  t: number;
  id?: string;
  topic?: string;
  screenChart?: boolean;
}> = ({ t, id = 'stage', topic = 'KEYNOTE // PRESENTATION', screenChart = true }) => {
  return (
    <g id={id}>
      <defs>
        {/* Theatrical Spotlight Gradient */}
        <linearGradient id={`${id}spotlight`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.45} />
          <stop offset="40%" stopColor="#BAE6FD" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity={0.03} />
        </linearGradient>
        {/* Stage Floor Spotlight Pool */}
        <radialGradient id={`${id}floorSpot`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="60%" stopColor="#BAE6FD" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#241B15" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Dark Auditorium Void */}
      <rect x="-400" y="-300" width="2720" height="1680" fill={STAGE_PALETTE.void} />

      {/* Presentation Screen (Center-Back) */}
      <g>
        <rect x="580" y="180" width="760" height="420" rx="12" fill={STAGE_PALETTE.screenBg} stroke={STAGE_PALETTE.screenBorder} strokeWidth="5" />
        {/* Screen Header Bar */}
        <rect x="580" y="180" width="760" height="50" rx="12" fill="#1C273E" />
        <circle cx="615" cy="205" r="7" fill="#EF4444" />
        <circle cx="637" cy="205" r="7" fill="#F59E0B" />
        <circle cx="659" cy="205" r="7" fill="#10B981" />
        <text x="700" y="212" fontFamily="'JetBrains Mono', monospace" fontSize="16" fill="#94A3B8" letterSpacing="2">
          {topic}
        </text>

        {/* Screen Presentation Graphic: Animated Keynote Chart */}
        {screenChart && (
          <g transform="translate(640 280)">
            {/* Grid Lines */}
            {[0, 60, 120, 180, 240].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="640" y2={y} stroke="#1E293B" strokeWidth="2" strokeDasharray="6 4" />
            ))}
            {/* Growth Curve */}
            <path
              d="M 20 220 C 140 210 240 160 360 110 S 520 40 620 20"
              fill="none"
              stroke={STAGE_PALETTE.accent}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Data Points */}
            {[[20, 220], [180, 190], [360, 110], [500, 50], [620, 20]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="7" fill="#0F172A" stroke={STAGE_PALETTE.accent} strokeWidth="3" />
            ))}
          </g>
        )}
      </g>

      {/* Stage Floor (Lower Third) */}
      <polygon points="-400,680 2320,680 2320,1300 -400,1300" fill={STAGE_PALETTE.woodFloor} />
      <line x1="-400" y1="680" x2="2320" y2="680" stroke={STAGE_PALETTE.woodLip} strokeWidth="5" />

      {/* Stage Floorboard Perspective Grooves */}
      {[-300, -50, 200, 450, 700, 960, 1220, 1470, 1720, 1970, 2220].map((x, i) => (
        <line key={i} x1={x} y1="680" x2={x + (x - 960) * 0.4} y2="1200" stroke={STAGE_PALETTE.woodLines} strokeWidth="3" />
      ))}

      {/* Center Spotlight Cone */}
      <polygon points="900,-60 1020,-60 1280,780 640,780" fill={`url(#${id}spotlight)`} />
      <ellipse cx="960" cy="740" rx="340" ry="85" fill={`url(#${id}floorSpot)`} />

      {/* Vintage Stage Microphone on Stand (Center-Right) */}
      <g transform="translate(1220 540)">
        {/* Mic capsule */}
        <rect x="-14" y="-36" width="28" height="48" rx="14" fill={STAGE_PALETTE.micChrome} stroke="#475569" strokeWidth="3" />
        {/* Metal grille bands */}
        <line x1="-12" y1="-20" x2="12" y2="-20" stroke="#475569" strokeWidth="2.5" />
        <line x1="-14" y1="-10" x2="14" y2="-10" stroke="#475569" strokeWidth="2.5" />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#475569" strokeWidth="2.5" />
        {/* Stand connector */}
        <circle cx="0" cy="18" r="7" fill="#334155" />
        {/* Vertical Chrome Rod */}
        <line x1="0" y1="24" x2="0" y2="240" stroke={STAGE_PALETTE.micChrome} strokeWidth="7" />
        {/* Round Heavy Base on Floor */}
        <ellipse cx="0" cy="240" rx="42" ry="14" fill="#1E293B" stroke="#475569" strokeWidth="4" />
      </g>

      {/* Blurred Audience Silhouettes in Bottom Foreground */}
      <g opacity="0.88">
        {[
          [120, 1020, 52, 68],
          [280, 1040, 56, 72],
          [460, 1010, 50, 64],
          [680, 1050, 54, 70],
          [860, 1020, 58, 74],
          [1060, 1040, 52, 66],
          [1260, 1010, 55, 70],
          [1460, 1050, 50, 65],
          [1660, 1020, 54, 72],
          [1840, 1040, 56, 70],
        ].map(([ax, ay, rx, ry], i) => (
          <g key={i}>
            {/* Head */}
            <ellipse cx={ax} cy={ay} rx={rx} ry={ry} fill="#05050A" />
            {/* Shoulders */}
            <ellipse cx={ax} cy={ay + ry * 0.9} rx={rx * 2.2} ry={ry * 0.8} fill="#05050A" />
          </g>
        ))}
      </g>
    </g>
  );
};
