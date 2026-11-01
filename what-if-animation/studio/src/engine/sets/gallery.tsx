import React from 'react';

export interface GalleryProps {
  t: number;
  id?: string;
}

/**
 * Creative Art Studio / Gallery set for artists, writers, and imagination beats.
 * Features exposed dark brick wall, hanging framed artwork, wooden painter's easel, palette, and studio spotlight.
 */
export const Gallery: React.FC<GalleryProps> = ({ t, id = 'gal' }) => {
  return (
    <g id={`set_gallery_${id}`}>
      <defs>
        <linearGradient id={`${id}_wallGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B1724" />
          <stop offset="70%" stopColor="#14111C" />
          <stop offset="100%" stopColor="#0B0910" />
        </linearGradient>
        <radialGradient id={`${id}_spot`} cx="60%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall & Floor */}
      <rect width={1920} height={760} fill={`url(#${id}_wallGrad)`} />
      <rect y={760} width={1920} height={320} fill="#1E1926" stroke="#2D2638" strokeWidth={3} />
      {/* Floor Planks */}
      <line x1={0} y1={840} x2={1920} y2={840} stroke="#14111A" strokeWidth={2} />
      <line x1={0} y1={920} x2={1920} y2={920} stroke="#14111A" strokeWidth={2} />
      <line x1={0} y1={1000} x2={1920} y2={1000} stroke="#14111A" strokeWidth={2} />

      {/* Warm Ambient Spotlight */}
      <rect width={1920} height={1080} fill={`url(#${id}_spot)`} />

      {/* Hanging Framed Painting 1 (Cosmic Dreamscape) */}
      <g transform="translate(340, 240)">
        <rect x={-140} y={-100} width={280} height={200} rx={4} fill="#2A2438" stroke="#D97706" strokeWidth={8} />
        {/* Abstract Cosmic Art inside */}
        <rect x={-130} y={-90} width={260} height={180} fill="#0F172A" />
        <circle cx={-30} cy={-10} r={45} fill="#818CF8" opacity={0.8} />
        <circle cx={40} cy={20} r={30} fill="#EC4899" opacity={0.6} />
        <ellipse cx={0} cy={50} rx={100} ry={25} fill="#38BDF8" opacity={0.4} />
      </g>

      {/* Hanging Framed Painting 2 (Surreal Geometric) */}
      <g transform="translate(740, 260)">
        <rect x={-110} y={-80} width={220} height={160} rx={4} fill="#2A2438" stroke="#CA8A04" strokeWidth={6} />
        <rect x={-102} y={-72} width={204} height={144} fill="#1E1E2E" />
        <polygon points="-50,40 0,-40 50,40" fill="#F43F5E" opacity={0.85} />
        <circle cx={0} cy={-10} r={22} fill="#FACC15" />
      </g>

      {/* Painter's Wooden Easel on the right side */}
      <g transform="translate(1420, 500)">
        {/* Tripod Legs */}
        <line x1={-80} y1={280} x2={0} y2={-160} stroke="#854D0E" strokeWidth={10} strokeLinecap="round" />
        <line x1={80} y1={280} x2={0} y2={-160} stroke="#854D0E" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={290} x2={0} y2={-180} stroke="#713F12" strokeWidth={8} strokeLinecap="round" />
        {/* Canvas Shelf */}
        <rect x={-120} y={60} width={240} height={16} rx={3} fill="#A16207" />
        {/* Large Canvas */}
        <rect x={-105} y={-110} width={210} height={170} rx={4} fill="#FEF3C7" stroke="#78350F" strokeWidth={4} />
        {/* Canvas Artwork: Dream in Progress */}
        <path d="M-80,20 Q-30,-70 20,-10 T70,-20" fill="none" stroke="#2563EB" strokeWidth={8} strokeLinecap="round" />
        <circle cx={40} cy={-50} r={18} fill="#EA580C" />
        {/* Palette on stool */}
        <ellipse cx={-150} cy={160} rx={40} ry={28} fill="#CA8A04" />
        <circle cx={-165} cy={155} r={5} fill="#EF4444" />
        <circle cx={-150} cy={145} r={5} fill="#3B82F6" />
        <circle cx={-135} cy={155} r={5} fill="#10B981" />
      </g>
    </g>
  );
};
