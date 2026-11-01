import React from 'react';

export interface GymProps {
  t: number;
  id?: string;
}

/**
 * Athletic Training Gym / Performance Studio set for practicing skills, sports moves, and musical instruments.
 * Features dramatic overhead rim lights, boxing heavy bag, athletic floor markings, and motivational aesthetic.
 */
export const Gym: React.FC<GymProps> = ({ t, id = 'gym' }) => {
  const bagSwing = Math.sin(t / 18) * 3;

  return (
    <g id={`set_gym_${id}`}>
      <defs>
        <linearGradient id={`${id}_wallGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#181824" />
          <stop offset="100%" stopColor="#0F0F17" />
        </linearGradient>
        <radialGradient id={`${id}_overheadLight`} cx="50%" cy="10%" r="70%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#0284C7" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall & Gym Mat Floor */}
      <rect width={1920} height={740} fill={`url(#${id}_wallGrad)`} />
      <rect y={740} width={1920} height={340} fill="#1E2028" stroke="#334155" strokeWidth={4} />

      {/* Overhead Gym Light Cone */}
      <rect width={1920} height={1080} fill={`url(#${id}_overheadLight)`} />

      {/* Concrete Wall Accents & Industrial Steel Beams */}
      <line x1={0} y1={120} x2={1920} y2={120} stroke="#334155" strokeWidth={12} />
      <line x1={400} y1={0} x2={400} y2={740} stroke="#1E293B" strokeWidth={8} />
      <line x1={1520} y1={0} x2={1520} y2={740} stroke="#1E293B" strokeWidth={8} />

      {/* Hanging Heavy Boxing Bag on the left */}
      <g transform={`translate(420, 120) rotate(${bagSwing})`}>
        {/* Steel Chain */}
        <line x1={0} y1={0} x2={0} y2={140} stroke="#64748B" strokeWidth={6} strokeDasharray="8 6" />
        {/* Heavy Leather Punching Bag */}
        <rect x={-55} y={140} width={110} height={320} rx={24} fill="#B91C1C" stroke="#7F1D1D" strokeWidth={6} />
        {/* Bag Reinforcement Straps */}
        <line x1={-55} y1={190} x2={55} y2={190} stroke="#450A0A" strokeWidth={8} />
        <line x1={-55} y1={380} x2={55} y2={380} stroke="#450A0A" strokeWidth={8} />
        <ellipse cx={0} cy={140} rx={55} ry={15} fill="#EF4444" opacity={0.6} />
      </g>

      {/* Performance Acoustic / Guitar / Instrument Stand on the right */}
      <g transform="translate(1480, 560)">
        {/* Tripod Stand */}
        <line x1={-35} y1={220} x2={0} y2={40} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
        <line x1={35} y1={220} x2={0} y2={40} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={40} x2={0} y2={-120} stroke="#334155" strokeWidth={7} />
        {/* Stylized Electric/Acoustic Guitar */}
        <ellipse cx={0} cy={-20} rx={42} ry={60} fill="#D97706" stroke="#78350F" strokeWidth={5} />
        <circle cx={0} cy={-20} r={14} fill="#1E293B" />
        <line x1={0} y1={-80} x2={0} y2={-160} stroke="#92400E" strokeWidth={10} strokeLinecap="round" />
        {/* Musical Sparkles */}
        <circle cx={45} cy={-130} r={5} fill="#FACC15" opacity={0.8} />
        <circle cx={-35} cy={-90} r={4} fill="#38BDF8" opacity={0.8} />
      </g>

      {/* Athletic Ring Floor Lines */}
      <circle cx={960} cy={880} r={280} fill="none" stroke="#0284C7" strokeWidth={5} strokeDasharray="14 10" opacity={0.7} />
      <line x1={680} y1={880} x2={1240} y2={880} stroke="#EF4444" strokeWidth={4} opacity={0.6} />
    </g>
  );
};
