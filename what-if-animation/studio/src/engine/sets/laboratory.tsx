import React from 'react';
import { rnd, clamp } from '../anim';
import { Glow, Cone, LightVeil } from '../light';

// The Laboratory: high-tech scientific research facility for science explainers, experiment beats, and tech demos.
// Features server racks with blinking LEDs, holographic glass whiteboard, a steel lab workstation, and an animated EEG monitor.

const LAB_PALETTE = {
  wall: '#111625',
  wallGrid: '#1A233A',
  floor: '#0B0F19',
  floorLines: '#161D2E',
  steel: '#2A344A',
  steelLight: '#4B5B7D',
  cyan: '#22D3EE',
  green: '#10B981',
  amber: '#F59E0B',
};

export const Laboratory: React.FC<{
  t: number;
  id?: string;
  alert?: number;
  eeg?: number;
}> = ({ t, id = 'lab', alert = 0, eeg = 1 }) => {
  const isAlert = alert > 0;
  const accentColor = isAlert ? '#EF4444' : LAB_PALETTE.cyan;

  // Blinking server lights pattern
  const serverLeds = Array.from({ length: 24 }).map((_, i) => {
    const on = (Math.floor(t / 8) + i * 7) % 3 === 0;
    const isAmber = i % 5 === 0;
    return {
      x: 260 + (i % 4) * 22,
      y: 420 + Math.floor(i / 4) * 36,
      color: isAlert ? '#EF4444' : isAmber ? LAB_PALETTE.amber : LAB_PALETTE.green,
      on,
    };
  });

  return (
    <g id={id}>
      <defs>
        <radialGradient id={`${id}glow`}>
          <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
        </radialGradient>
        <pattern id={`${id}grid`} width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={LAB_PALETTE.wallGrid} strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Back Wall */}
      <rect x="-400" y="-200" width="2720" height="920" fill={LAB_PALETTE.wall} />
      <rect x="-400" y="-200" width="2720" height="920" fill={`url(#${id}grid)`} opacity={0.6} />

      {/* Volumetric Center Glow */}
      <circle cx={960} cy={480} r={650} fill={`url(#${id}glow)`} />

      {/* Floor */}
      <polygon points="-400,720 2320,720 2320,1300 -400,1300" fill={LAB_PALETTE.floor} />
      <line x1="-400" y1="720" x2="2320" y2="720" stroke={LAB_PALETTE.steelLight} strokeWidth={4} />

      {/* Floor Perspective Lines */}
      {[-200, 200, 600, 960, 1320, 1720, 2120].map((x, i) => (
        <line key={i} x1={x} y1={720} x2={x + (x - 960) * 0.8} y2={1200} stroke={LAB_PALETTE.floorLines} strokeWidth={2} />
      ))}

      {/* Server Rack (Left Background) */}
      <g>
        <rect x="220" y="340" width="160" height="380" rx="8" fill="#151C2C" stroke="#2D3B55" strokeWidth="4" />
        <rect x="235" y="360" width="130" height="340" rx="4" fill="#0C101A" />
        {/* Horizontal rack slots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="235" y1={395 + i * 38} x2="365" y2={395 + i * 38} stroke="#1E273A" strokeWidth="2" />
        ))}
        {/* Server LEDs */}
        {serverLeds.map((led, i) => (
          <circle key={i} cx={led.x} cy={led.y} r={3.5} fill={led.color} opacity={led.on ? 1 : 0.25} />
        ))}
      </g>

      {/* Holographic Glass Whiteboard (Right Background) */}
      <g>
        <rect x="1460" y="320" width="340" height="340" rx="12" fill={accentColor} fillOpacity={0.06} stroke={accentColor} strokeWidth="3" opacity={0.8} />
        {/* Neural Network Nodes on Glass */}
        <g stroke={accentColor} strokeWidth="2" opacity={0.65}>
          <line x1="1520" y1="420" x2="1620" y2="380" />
          <line x1="1520" y1="420" x2="1620" y2="480" />
          <line x1="1620" y1="380" x2="1720" y2="440" />
          <line x1="1620" y1="480" x2="1720" y2="440" />
          <line x1="1520" y1="560" x2="1620" y2="480" />
          <line x1="1620" y1="480" x2="1720" y2="580" />
        </g>
        {[
          [1520, 420], [1520, 560],
          [1620, 380], [1620, 480],
          [1720, 440], [1720, 580]
        ].map(([nx, ny], i) => (
          <circle key={i} cx={nx} cy={ny} r={7} fill="#0B0F19" stroke={accentColor} strokeWidth="3" />
        ))}
        {/* Glass formula annotation */}
        <text x="1490" y="360" fontFamily="'JetBrains Mono', monospace" fontSize="18" fill={accentColor} opacity={0.8}>
          NEURAL_SYNAPSE // v4.2
        </text>
      </g>

      {/* Main Lab Bench (Center-Back) */}
      <g>
        {/* Table top */}
        <polygon points="620,680 1300,680 1330,730 590,730" fill="#242F44" stroke="#3D4F72" strokeWidth="3" />
        {/* Table legs */}
        <rect x="630" y="730" width="22" height="180" fill="#1C2436" />
        <rect x="1270" y="730" width="22" height="180" fill="#1C2436" />

        {/* Dual High-Tech Monitors */}
        {/* Monitor 1: EEG Brainwave Screen */}
        <rect x="740" y="520" width="220" height="150" rx="6" fill="#0C101A" stroke="#3D4F72" strokeWidth="4" />
        <rect x="750" y="530" width="200" height="130" fill="#070A12" />
        {/* EEG Waveform path */}
        <path
          d={`M 755 595 Q 780 ${595 - Math.sin(t / 4) * 25} 805 595 T 855 ${595 + Math.sin(t / 3) * 35} T 905 595 T 945 595`}
          fill="none"
          stroke={accentColor}
          strokeWidth="3"
        />
        <text x="760" y="550" fontFamily="'JetBrains Mono', monospace" fontSize="14" fill={accentColor} opacity={0.7}>
          EEG_ACTIVITY
        </text>

        {/* Monitor 2: Diagnostic Data */}
        <rect x="980" y="520" width="200" height="150" rx="6" fill="#0C101A" stroke="#3D4F72" strokeWidth="4" />
        <rect x="990" y="530" width="180" height="130" fill="#070A12" />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="1005" y="555 + i * 18" width={40 + ((i * 37 + Math.floor(t / 6)) % 100)} height="8" rx="4" fill={LAB_PALETTE.steelLight} opacity={0.65} />
        ))}

        {/* Monitor Stands */}
        <rect x="840" y="670" width="20" height="16" fill="#1C2436" />
        <rect x="1070" y="670" width="20" height="16" fill="#1C2436" />
      </g>

      {/* Overhead Fluorescent Light Fixture */}
      <rect x="680" y="-30" width="560" height="50" rx="8" fill="#1E273A" stroke="#3D4F72" strokeWidth="3" />
      <rect x="700" y="10" width="520" height="12" rx="6" fill="#FFFFFF" opacity={0.9} style={{ filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.8))' }} />
    </g>
  );
};
