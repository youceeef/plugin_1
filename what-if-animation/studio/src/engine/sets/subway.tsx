import React from 'react';

// The Subway / Metro Transit Set: for travel beats, daily routines, commutes, waiting, and urban transitions.
// Features tiled underground walls, steel I-beam structural pillars, platform edge with tactile warning tiles, train car windows, and a digital LED arrival board.

const SUBWAY_PALETTE = {
  wall: '#1A232E',
  tileGrout: '#293847',
  pillar: '#1E293B',
  pillarSteel: '#334155',
  platform: '#2D3748',
  platformLip: '#1A202C',
  tactileYellow: '#FBBF24',
  trackPit: '#0B0F17',
  trackRail: '#64748B',
  trainBody: '#1E293B',
  trainWindow: '#FEF08A',
  amberLed: '#F59E0B',
};

export const Subway: React.FC<{
  t: number;
  id?: string;
  trainPresent?: boolean;
}> = ({ t, id = 'subway', trainPresent = true }) => {
  return (
    <g id={id}>
      <defs>
        {/* Ceramic Metro Tile Pattern */}
        <pattern id={`${id}tiles`} width="80" height="40" patternUnits="userSpaceOnUse">
          <rect width="80" height="40" fill={SUBWAY_PALETTE.wall} />
          <path d="M 0 0 L 80 0 M 0 40 L 80 40 M 0 0 L 0 40 M 40 0 L 40 40" stroke={SUBWAY_PALETTE.tileGrout} strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Tiled Underground Back Wall */}
      <rect x="-400" y="-200" width="2720" height="920" fill={`url(#${id}tiles)`} />

      {/* Subway Station Ceramic Tile Header Stripe */}
      <rect x="-400" y="240" width="2720" height="60" fill="#0F766E" stroke="#134E4A" strokeWidth="3" />
      <rect x="-400" y="246" width="2720" height="48" fill="#115E59" />
      <text x="960" y="278" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="28" fill="#F0FDFA" letterSpacing="8">
        72ND STREET // CENTRAL LINE
      </text>

      {/* Platform Floor (Lower Half) */}
      <polygon points="-400,700 2320,700 2320,1300 -400,1300" fill={SUBWAY_PALETTE.platform} />

      {/* Tactile Yellow Bumpy Warning Stripe Along Platform Edge */}
      <rect x="-400" y="700" width="2720" height="28" fill={SUBWAY_PALETTE.tactileYellow} />
      {/* Textured bumps on warning stripe */}
      {Array.from({ length: 65 }).map((_, i) => (
        <circle key={i} cx={-300 + i * 42} cy={714} r={3.5} fill="#B45309" />
      ))}
      <line x1="-400" y1="728" x2="2320" y2="728" stroke={SUBWAY_PALETTE.platformLip} strokeWidth="4" />

      {/* Track Pit & Rails (Bottom Foreground / Pit Edge) */}
      <rect x="-400" y="660" width="460" height="300" fill={SUBWAY_PALETTE.trackPit} />
      <line x1="-400" y1="685" x2="60" y2="685" stroke={SUBWAY_PALETTE.trackRail} strokeWidth="6" />

      {/* Subway Train Car on Left (if present) */}
      {trainPresent && (
        <g>
          {/* Train Car Side Shell */}
          <rect x="-300" y="320" width="560" height="380" rx="14" fill={SUBWAY_PALETTE.trainBody} stroke="#475569" strokeWidth="4" />
          <rect x="-300" y="440" width="560" height="26" fill="#0284C7" />
          {/* Train Windows with Warm Interior Glow */}
          {[
            [-180, 380, 140, 110],
            [20, 380, 140, 110],
          ].map(([wx, wy, ww, wh], i) => (
            <g key={i}>
              <rect x={wx} y={wy} width={ww} height={wh} rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
              <rect x={wx + 6} y={wy + 6} width={ww - 12} height={wh - 12} rx="4" fill={SUBWAY_PALETTE.trainWindow} opacity={0.65} />
              {/* Passenger Silhouette */}
              <circle cx={wx + ww * 0.5} cy={wy + 55} r={22} fill="#1E293B" />
              <ellipse cx={wx + ww * 0.5} cy={wy + 95} rx={36} ry={25} fill="#1E293B" />
            </g>
          ))}
          {/* Train Door Lines */}
          <line x1="-20" y1="330" x2="-20" y2="700" stroke="#0F172A" strokeWidth="4" />
        </g>
      )}

      {/* Steel I-Beam Structural Pillars */}
      {[580, 1420].map((px, i) => (
        <g key={i}>
          {/* Pillar Main Flange */}
          <rect x={px} y="-100" width="70" height="820" fill={SUBWAY_PALETTE.pillar} stroke={SUBWAY_PALETTE.pillarSteel} strokeWidth="4" />
          {/* Inner Web Plate */}
          <rect x={px + 14} y="-100" width="42" height="820" fill="#111827" />
          {/* Heavy Steel Base on Floor */}
          <polygon points={`${px - 14},710 ${px + 84},710 ${px + 74},680 ${px - 4},680`} fill="#1E293B" stroke="#475569" strokeWidth="3" />
          {/* Rivets */}
          {[120, 260, 400, 540].map((ry, rIdx) => (
            <g key={rIdx}>
              <circle cx={px + 6} cy={ry} r={3} fill="#94A3B8" />
              <circle cx={px + 64} cy={ry} r={3} fill="#94A3B8" />
            </g>
          ))}
        </g>
      ))}

      {/* Suspended Digital LED Departure Sign (Center-Right) */}
      <g transform="translate(980 120)">
        {/* Suspension Chains */}
        <line x1="40" y1="-120" x2="40" y2="0" stroke="#475569" strokeWidth="4" />
        <line x1="320" y1="-120" x2="320" y2="0" stroke="#475569" strokeWidth="4" />
        {/* Sign Shell */}
        <rect x="0" y="0" width="360" height="90" rx="8" fill="#0B0F17" stroke="#334155" strokeWidth="4" />
        {/* Dot Matrix Screen */}
        <rect x="12" y="12" width="336" height="66" rx="4" fill="#000000" />
        <text x="24" y="40" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="16" fill={SUBWAY_PALETTE.amberLed} letterSpacing="2">
          NEXT TRAIN: 2 MIN
        </text>
        <text x="24" y="64" fontFamily="'JetBrains Mono', monospace" fontSize="14" fill="#10B981" letterSpacing="1">
          ON TIME // PLATFORM 1
        </text>
      </g>
    </g>
  );
};
