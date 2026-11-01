import React from 'react';
import { rnd, clamp } from '../anim';

// The City Street Set: for urban walk beats, everyday reality, public settings, and city atmospheres.
// Features a sidewalk curb, crosswalk road, tall iron streetlight with volumetric light cone, neon shop glow, and distant skyline.

const STREET_PALETTE = {
  sky: '#0C0F1D',
  buildingFar: '#121626',
  buildingMid: '#1A2035',
  road: '#151924',
  sidewalk: '#262D3D',
  curb: '#384259',
  lightYellow: '#FDE047',
  neonCyan: '#22D3EE',
  neonAmber: '#F59E0B',
};

export const Street: React.FC<{
  t: number;
  id?: string;
  rain?: number;
}> = ({ t, id = 'street', rain = 0 }) => {
  return (
    <g id={id}>
      <defs>
        {/* Streetlight Volumetric Glow Cone */}
        <linearGradient id={`${id}lightCone`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity={0.4} />
          <stop offset="60%" stopColor="#FEF08A" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity={0} />
        </linearGradient>
        {/* Neon Glow */}
        <radialGradient id={`${id}neonGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={STREET_PALETTE.neonCyan} stopOpacity={0.3} />
          <stop offset="100%" stopColor={STREET_PALETTE.neonCyan} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Deep Night Sky */}
      <rect x="-400" y="-300" width="2720" height="1100" fill={STREET_PALETTE.sky} />

      {/* Distant City Skyline Silhouettes */}
      <g>
        <rect x="-100" y="240" width="220" height="500" fill={STREET_PALETTE.buildingFar} />
        <rect x="180" y="320" width="180" height="420" fill={STREET_PALETTE.buildingFar} />
        <rect x="420" y="180" width="260" height="560" fill={STREET_PALETTE.buildingFar} />
        <rect x="740" y="280" width="200" height="460" fill={STREET_PALETTE.buildingFar} />
        <rect x="1000" y="200" width="300" height="540" fill={STREET_PALETTE.buildingFar} />
        <rect x="1360" y="310" width="220" height="430" fill={STREET_PALETTE.buildingFar} />
        <rect x="1640" y="220" width="260" height="520" fill={STREET_PALETTE.buildingFar} />
      </g>

      {/* Midground Storefronts & Facades */}
      <g>
        {/* Shop 1: Left */}
        <rect x="100" y="440" width="460" height="300" fill={STREET_PALETTE.buildingMid} stroke="#2D374D" strokeWidth="3" />
        {/* Shop Window with warm interior glow */}
        <rect x="140" y="520" width="180" height="160" rx="4" fill="#3E2C1C" stroke="#78502A" strokeWidth="3" />
        <rect x="150" y="530" width="160" height="140" fill="#FEF08A" opacity={0.25} />
        {/* Neon Sign */}
        <rect x="140" y="470" width="220" height="36" rx="6" fill="#181326" stroke={STREET_PALETTE.neonCyan} strokeWidth="2" />
        <circle cx="250" cy="488" r="80" fill={`url(#${id}neonGlow)`} />
        <text x="250" y="495" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="18" fill={STREET_PALETTE.neonCyan} letterSpacing="3">
          24H // METRO
        </text>

        {/* Shop 2: Right */}
        <rect x="1380" y="460" width="480" height="280" fill={STREET_PALETTE.buildingMid} stroke="#2D374D" strokeWidth="3" />
        <rect x="1440" y="530" width="220" height="150" rx="4" fill="#1A2738" stroke="#334E73" strokeWidth="3" />
        <text x="1550" y="505" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="16" fill={STREET_PALETTE.neonAmber} letterSpacing="2">
          DREAM CAFE
        </text>
      </g>

      {/* Asphalt Street Road (Lower Half) */}
      <polygon points="-400,740 2320,740 2320,1300 -400,1300" fill={STREET_PALETTE.road} />

      {/* Distant Car Headlights / Taillight Streaks */}
      <line x1="-200" y1="755" x2="800" y2="755" stroke="#EF4444" strokeWidth="4" opacity={0.4} />
      <line x1="1200" y1="755" x2="2100" y2="755" stroke="#FEF08A" strokeWidth="4" opacity={0.3} />

      {/* Sidewalk with Curb (Foreground) */}
      <g>
        {/* Curb top */}
        <polygon points="-400,770 2320,770 2320,1300 -400,1300" fill={STREET_PALETTE.sidewalk} />
        {/* Curb stone bevel edge */}
        <polygon points="-400,755 2320,755 2320,770 -400,770" fill={STREET_PALETTE.curb} />
        {/* Concrete sidewalk slab lines */}
        {[-100, 300, 700, 1100, 1500, 1900].map((x, i) => (
          <line key={i} x1={x} y1="770" x2={x - 80} y2="1200" stroke="#1E2330" strokeWidth="2.5" />
        ))}
      </g>

      {/* Pedestrian Crosswalk Stripes (Center-Left) */}
      <g opacity="0.65">
        {[480, 560, 640, 720, 800].map((x, i) => (
          <polygon key={i} points={`${x},775 ${x + 50},775 ${x + 30},870 ${x - 20},870`} fill="#CBD5E1" />
        ))}
      </g>

      {/* Tall Cast-Iron Streetlight (Center-Right) */}
      <g>
        {/* Light Beam Cone onto pavement */}
        <polygon points="1260,340 1020,950 1500,950" fill={`url(#${id}lightCone)`} />
        {/* Streetlight Post & Arm */}
        <line x1="1260" y1="340" x2="1260" y2="800" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
        <rect x="1245" y="780" width="30" height="30" rx="4" fill="#0F172A" />
        {/* Curved Arm */}
        <path d="M 1260 420 Q 1260 330 1230 330 L 1210 330" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
        {/* Lamp Lantern Head */}
        <polygon points="1195,330 1225,330 1230,355 1190,355" fill="#334155" />
        <circle cx="1210" cy="355" r="14" fill="#FEF08A" style={{ filter: 'drop-shadow(0 0 20px #FDE047)' }} />
      </g>
    </g>
  );
};
