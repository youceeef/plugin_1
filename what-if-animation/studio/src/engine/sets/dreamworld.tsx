import React from 'react';

export interface DreamworldProps {
  t: number;
  id?: string;
}

/**
 * Surreal Dream World set for dream sequences, weird logic, and mind-bending What-If moments.
 * Features floating impossible architecture, glowing mystical portals, floating clock dials, and surreal stars.
 */
export const Dreamworld: React.FC<DreamworldProps> = ({ t, id = 'dw' }) => {
  const float1 = Math.sin(t / 20) * 12;
  const float2 = Math.cos(t / 25) * 15;
  const rot1 = (t * 0.8) % 360;

  return (
    <g id={`set_dreamworld_${id}`}>
      {/* 1. Deep Surreal Void Background */}
      <defs>
        <linearGradient id={`${id}_voidGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B081A" />
          <stop offset="50%" stopColor="#1E1035" />
          <stop offset="100%" stopColor="#080D21" />
        </linearGradient>
        <radialGradient id={`${id}_portalGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}_voidGrad)`} />

      {/* 2. Floating Surreal Portal */}
      <ellipse cx={960} cy={480 + float1} rx={420} ry={340} fill={`url(#${id}_portalGlow)`} />
      <ellipse cx={960} cy={480 + float1} rx={360} ry={290} fill="none" stroke="#A855F7" strokeWidth={3} strokeDasharray="16 12" opacity={0.7} />
      <ellipse cx={960} cy={480 + float1} rx={310} ry={250} fill="none" stroke="#22D3EE" strokeWidth={2} opacity={0.5} />

      {/* 3. Floating Impossible Stairs */}
      <g transform={`translate(280, ${420 + float2}) rotate(-15)`}>
        <polygon points="0,0 120,-30 180,-10 60,20" fill="#2E1B4E" stroke="#7C3AED" strokeWidth={3} />
        <polygon points="60,20 180,-10 240,10 120,40" fill="#3B2264" stroke="#7C3AED" strokeWidth={3} />
        <polygon points="120,40 240,10 300,30 180,60" fill="#4C2882" stroke="#7C3AED" strokeWidth={3} />
      </g>

      {/* 4. Floating Surreal Clock (Melting / Dream logic) */}
      <g transform={`translate(1540, ${360 + float1}) rotate(${rot1 * 0.1})`}>
        <ellipse cx={0} cy={0} rx={110} ry={140} fill="#181428" stroke="#F59E0B" strokeWidth={6} />
        <circle cx={0} cy={-20} r={6} fill="#F59E0B" />
        {/* Clock Hands */}
        <line x1={0} y1={-20} x2={40} y2={-70} stroke="#F59E0B" strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={-20} x2={-60} y2={20} stroke="#F59E0B" strokeWidth={4} strokeLinecap="round" />
        {/* Roman Numerals */}
        <text x={0} y={-100} fill="#FDE68A" fontSize={22} textAnchor="middle" fontFamily="serif">XII</text>
        <text x={75} y={-10} fill="#FDE68A" fontSize={20} textAnchor="middle" fontFamily="serif">III</text>
        <text x={0} y={80} fill="#FDE68A" fontSize={22} textAnchor="middle" fontFamily="serif">VI</text>
        <text x={-75} y={-10} fill="#FDE68A" fontSize={20} textAnchor="middle" fontFamily="serif">IX</text>
      </g>

      {/* 5. Impossible Floating Checkerboard Ground / Pedestal */}
      <g transform="translate(960, 860)">
        <ellipse cx={0} cy={0} rx={620} ry={130} fill="#140E26" stroke="#8B5CF6" strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={480} ry={90} fill="#1B1233" stroke="#38BDF8" strokeWidth={2} strokeDasharray="12 8" />
        {/* Glowing Rim Light */}
        <ellipse cx={0} cy={-10} rx={460} ry={70} fill="none" stroke="#C084FC" strokeWidth={3} opacity={0.6} />
      </g>
    </g>
  );
};
