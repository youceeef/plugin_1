import React from 'react';
import { rnd, clamp } from '../anim';

// The Space / Cosmic Orbit Set: for macro questions ("What if you fly across worlds?"), astronomy beats, and cosmic dream states.
// Features a procedural starfield, glowing nebula clouds, planetary curvature with an atmospheric glow, and an orbiting satellite.

export const Space: React.FC<{
  t: number;
  id?: string;
  planetColor?: string;
  atmosphere?: string;
}> = ({ t, id = 'space', planetColor = '#152E4D', atmosphere = '#38BDF8' }) => {
  // Generate repeatable stars
  const stars = Array.from({ length: 75 }).map((_, i) => {
    const x = rnd(101, i) * 2320 - 200;
    const y = rnd(102, i) * 800 - 100;
    const r = 1 + rnd(103, i) * 2.2;
    const twinkle = 0.4 + 0.6 * Math.sin(t / 14 + i * 1.5);
    return { x, y, r, twinkle };
  });

  return (
    <g id={id}>
      <defs>
        {/* Nebula Gradients */}
        <radialGradient id={`${id}nebula1`} cx="35%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
          <stop offset="70%" stopColor="#3B82F6" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#060714" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}nebula2`} cx="75%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#060714" stopOpacity={0} />
        </radialGradient>
        {/* Atmospheric Glow */}
        <radialGradient id={`${id}atmo`} cx="50%" cy="100%" r="55%">
          <stop offset="75%" stopColor={atmosphere} stopOpacity={0.45} />
          <stop offset="90%" stopColor={atmosphere} stopOpacity={0.15} />
          <stop offset="100%" stopColor="#060714" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Deep Space Background */}
      <rect x="-400" y="-300" width="2720" height="1680" fill="#060714" />

      {/* Nebula Clouds */}
      <rect x="-400" y="-300" width="2720" height="1680" fill={`url(#${id}nebula1)`} />
      <rect x="-400" y="-300" width="2720" height="1680" fill={`url(#${id}nebula2)`} />

      {/* Procedural Stars */}
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#F8FAFC" opacity={st.twinkle} />
      ))}

      {/* Planetary Curvature (Rising from Bottom) */}
      <circle cx={960} cy={1950} r={1250} fill={planetColor} stroke="#2D4A70" strokeWidth="4" />
      {/* Continental / Cloud Landmasses on Planet Surface */}
      <path
        d="M 320 780 Q 480 740 680 790 Q 860 840 1060 770 Q 1340 760 1580 820"
        stroke="#1E426D"
        strokeWidth="60"
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
      {/* Atmospheric Rim Layer */}
      <circle cx={960} cy={1950} r={1265} fill="none" stroke={atmosphere} strokeWidth="16" opacity={0.75} style={{ filter: `drop-shadow(0 -8px 24px ${atmosphere})` }} />

      {/* Orbiting Satellite / Station (Upper Right) */}
      <g transform={`translate(${1480 + Math.sin(t / 40) * 12} ${240 + Math.cos(t / 40) * 8}) rotate(${t * 0.4})`}>
        {/* Main Body */}
        <rect x="-24" y="-18" width="48" height="36" rx="4" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3" />
        {/* Golden Foil Details */}
        <rect x="-16" y="-12" width="32" height="24" rx="2" fill="#F59E0B" />
        {/* Solar Panels (Left & Right Wings) */}
        <line x1="-24" y1="0" x2="-68" y2="0" stroke="#94A3B8" strokeWidth="4" />
        <rect x="-116" y="-22" width="48" height="44" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
        <line x1="-92" y1="-22" x2="-92" y2="22" stroke="#38BDF8" strokeWidth="1.5" />

        <line x1="24" y1="0" x2="68" y2="0" stroke="#94A3B8" strokeWidth="4" />
        <rect x="68" y="-22" width="48" height="44" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
        <line x1="92" y1="-22" x2="92" y2="22" stroke="#38BDF8" strokeWidth="1.5" />
      </g>
    </g>
  );
};
