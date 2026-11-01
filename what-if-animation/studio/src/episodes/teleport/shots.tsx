import React from 'react';
import {
  ShotProps,
  camT, kf, clamp, easeOut, backOut, settle,
  Hero, Pose, basePose, poseAt, faceAt, LOOKS,
  Stairwell, Banister,
  Study, Desk,
  Classroom, SchoolDesk, Kid, KIDS,
  Rooftop,
  Schematic, SCH, Arrow, DrawOn, SchLabel, CountUp,
  Tabletop, Mug, FocusRings, Foreground, TitleCard, Glow, LightVeil, FONT
} from '../../engine';

const PIP = LOOKS.pipHood;
const CYAN = '#22D3EE';
const ORANGE = '#FF8A3D';
const RED = '#FF5A4A';

// S1: Wide, stairwell landing: Pip outside door searching pockets, locked out
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 380, y: 390, scale: 0.9, yaw: 0.4, armL: { a: 45, b: 25 }, armR: { a: 35, b: 30 }, expr: 'worried' } },
    { f: 20, p: { armL: { a: 55, b: 35 }, armR: { a: 25, b: 40 }, headTilt: -6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 480], [len, 500]]), 380, 1.35)}>
      <Stairwell t={t + 20} id="s1" />
      <Hero look={PIP} pose={{ ...pose, expr: 'oops' }} rimId="rimR" shadow={0.8} />
      <Banister />
      <Foreground blur={10}>
        <rect x={-100} y={600} width={220} height={500} fill="#090B10" />
      </Foreground>
    </g>
  );
};

// S2: Close-up: Pip pauses, smug face, cyan eye glint as he blinks
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t >= 6 && t <= 13 ? 1 : 0;
  const glint = t >= 13 ? clamp((t - 13) / 6) : 0;
  return (
    <g transform={camT(960, 460, kf(t, [[0, 3.2], [len, 3.4]]))}>
      <Stairwell t={t + 40} id="s2" />
      <Hero
        look={PIP}
        pose={{ ...basePose, x: 960, y: 720, scale: 1.1, yaw: -0.2, expr: t >= 13 ? 'smug' : 'neutral', blink, glint, glintColor: CYAN }}
        rimId="rimL"
        shadow={0}
      />
      {t >= 10 && <FocusRings x={960} y={420} t={t - 10} color={CYAN} r0={40} />}
    </g>
  );
};

// S3: Medium: Inside study, Pip in desk chair with steaming mug, smug
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.35, armR: { a: 45, b: -20 }, armL: { a: 15, b: -8 }, expr: 'smug' } },
    { f: 22, p: { armR: { a: 38, b: -28 }, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 580, 1.8)}>
      <Study t={t + 60} id="s3" />
      <Hero look={PIP} pose={{ ...pose, expr: 'smug' }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <Mug x={1120} y={670} rot={0} steam={1} f={t} />
      <Foreground blur={12}>
        <path d="M 1720 0 L 1920 0 L 1920 1080 L 1680 1080 Z" fill="#0C0E14" />
      </Foreground>
    </g>
  );
};

// S4: Wide over-the-shoulder: hallway/stairwell, Pip checks watch, late for class
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 920, y: 410, scale: 0.95, yaw: -0.4, armL: { a: 65, b: 45 }, armR: { a: 10, b: -5 }, expr: 'worried' } },
    { f: 20, p: { armL: { a: 75, b: 50 }, headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 920]]), 460, 1.45)}>
      <Stairwell t={t + 90} id="s4" />
      <Hero look={PIP} pose={{ ...pose, expr: 'worried' }} rimId="rimR" shadow={0.8} />
      <Foreground blur={14}>
        <ellipse cx={240} cy={720} rx={180} ry={360} fill="#090B10" />
      </Foreground>
    </g>
  );
};

// S5: Macro insert: school desk, notebook, pencil, cyan teleport burst
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const r = (t * 22) % 360;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.18]]))}>
      <Tabletop edge={950} kind="wood" wood="#9E7D5C" grain="#8B6948" lip="#6D4F35" floor="#18151D" floorLines="#120F16" />
      <LightVeil id="s5veil" lights={[[960, 480, 700]]} o={0.4} />
      {/* Notebook */}
      <rect x={760} y={380} width={400} height={280} rx={8} fill="#E8DFD1" stroke="#2B241D" strokeWidth={5} />
      <line x1={800} y1={440} x2={1120} y2={440} stroke="#7B8DA6" strokeWidth={3} />
      <line x1={800} y1={500} x2={1120} y2={500} stroke="#7B8DA6" strokeWidth={3} />
      <line x1={800} y1={560} x2={1080} y2={560} stroke="#7B8DA6" strokeWidth={3} />
      {/* Pencil */}
      <line x1={1200} y1={370} x2={1240} y2={620} stroke="#E9C46A" strokeWidth={14} strokeLinecap="round" />
      {/* Cyan teleport flash ring */}
      <circle cx={960} cy={520} r={r} fill="none" stroke={CYAN} strokeWidth={8} opacity={clamp(1 - t / len)} />
      <circle cx={960} cy={520} r={r * 0.5} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={clamp(1 - t / len)} />
    </g>
  );
};

// S6: Medium: Classroom, Pip seated at desk with sunglasses on, cool
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(kf(t, [[0, 1240], [len, 1260]]), 640, 1.75)}>
      <Classroom t={t + 110} id="s6" solved={false} wrong={false} />
      <SchoolDesk x={1260} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 1260,
          y: 720,
          scale: 0.95,
          yaw: -0.3,
          expr: 'cool',
          glasses: 1,
          armR: { a: 24, b: -12 },
          armL: { a: 20, b: -8 },
        }}
        rimId="rimL"
        shadow={0}
      />
      <Foreground blur={12}>
        <Kid x={680} y={840} s={1.2} look={KIDS[0]} />
      </Foreground>
    </g>
  );
};

// S7: Wide: Rooftop sunset over city skyline, golden dusk
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 620, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <Rooftop t={t + 30} sunX={960} sunY={440} red={0} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 720,
          scale: 0.95,
          yaw: 0.5,
          expr: 'happy',
          armL: { a: 15, b: 0 },
          armR: { a: 15, b: 0 },
        }}
        rimId="rimR"
        shadow={0.9}
      />
      <Foreground blur={10}>
        <rect x={-50} y={920} width={2020} height={200} fill="#0E0C16" />
      </Foreground>
    </g>
  );
};

// S8: Extreme close-up: Pip eyes glint cyan as he blinks to jump
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t >= 5 && t <= 12 ? 1 : 0;
  const glint = t >= 12 ? clamp((t - 12) / 6) : 0;
  return (
    <g transform={camT(960, 390, kf(t, [[0, 3.8], [len, 4.0]]))}>
      <Rooftop t={t + 60} sunX={960} sunY={440} red={0} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 680,
          scale: 1.05,
          yaw: 0.2,
          expr: 'smug',
          blink,
          glint,
          glintColor: CYAN,
        }}
        rimId="rimR"
        shadow={0}
      />
    </g>
  );
};

// S9: Low angle wide: Pip teleported right on the parapet ledge
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 580, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <Rooftop t={t + 80} low={140} sunX={960} sunY={380} red={0} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 650,
          scale: 1.0,
          yaw: 0.3,
          expr: 'cool',
          armL: { a: 22, b: -10 },
          armR: { a: 24, b: -8 },
        }}
        rimId="rimR"
        shadow={0.5}
      />
    </g>
  );
};

// S10: Title card wide shot
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Rooftop t={t + 100} sunX={960} sunY={500} red={0} />
      <Hero
        look={PIP}
        pose={{ ...basePose, x: 960, y: 740, scale: 0.85, yaw: 0, expr: 'neutral' }}
        rimId="rimR"
        shadow={0.9}
      />
      <TitleCard t={t} lines={['WHAT IF YOU COULD', 'TELEPORT ANYWHERE?']} accent="ANYWHERE" accentT={22} size={118} />
    </g>
  );
};

// S11: Schematic science beat: Earth rotating with velocity vectors at 0° and 60°
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Schematic t={t} id="sch11" />
      {/* Globe representation */}
      <circle cx={960} cy={520} r={280} fill="#142236" stroke={SCH.line} strokeWidth={4} />
      {/* Latitude parallels */}
      <ellipse cx={960} cy={520} rx={280} ry={70} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
      <ellipse cx={960} cy={380} rx={242} ry={50} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
      <ellipse cx={960} cy={660} rx={242} ry={50} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
      {/* Axis of rotation */}
      <line x1={960} y1={180} x2={960} y2={860} stroke={SCH.dim} strokeWidth={3} strokeDasharray="12 8" />
      <path d="M 930 190 A 30 15 0 0 1 990 190" fill="none" stroke={SCH.glow} strokeWidth={4} />

      {/* Equator velocity arrow */}
      <Arrow x0={960} y0={520} x1={1340} y1={520} t={t - 5} dur={10} color={ORANGE} bend={0} />
      <SchLabel x={1440} y={485} t={t - 8} text="EQUATOR (LAT 0°)" size={26} color={SCH.line} anchor="start" />
      <CountUp x={1440} y={570} t={t - 10} to={1040} dur={20} size={52} color={ORANGE} suffix=" MPH" anchor="start" />

      {/* 60 deg North velocity arrow */}
      <Arrow x0={960} y0={380} x1={1150} y1={380} t={t - 15} dur={10} color={CYAN} bend={0} />
      <SchLabel x={1270} y={345} t={t - 18} text="NORTH (LAT 60°)" size={26} color={SCH.line} anchor="start" />
      <CountUp x={1270} y={430} t={t - 20} to={520} dur={20} size={52} color={CYAN} suffix=" MPH" anchor="start" />

      {/* Top Banner */}
      <SchLabel x={960} y={110} t={t - 2} text="CONSERVATION OF LINEAR MOMENTUM" size={38} color={SCH.glow} />
    </g>
  );
};

// S12: Low angle medium: The turn! Red sky alert, Pip jumps in mid-air in shock
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / 20));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 540, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Rooftop t={t + 140} red={1} low={80} />
      {/* Wind gusts across frame */}
      {[240, 420, 600, 780].map((y, i) => (
        <line
          key={i}
          x1={-200 + ((t * 30 + i * 180) % 2400)}
          y1={y}
          x2={-200 + ((t * 30 + i * 180) % 2400) + 380}
          y2={y}
          stroke="#FFAA99"
          strokeWidth={4}
          opacity={0.65}
        />
      ))}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 700 - (1 - p) * 110 + settle(t - 14, 2, 80 * (Math.PI / 180), 8),
          scale: 1.05,
          yaw: -0.4,
          tilt: -14,
          expr: 'shock',
          sway: 20,
          armL: { a: 80, b: 20 },
          armR: { a: 110, b: -30 },
        }}
        rimId="rimRed"
        shadow={p * 0.7}
      />
    </g>
  );
};

// S13: Ground insert high speed: boots hit the rooftop floor with fierce relative wind & skid
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 820, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Rooftop t={t + 160} red={1} />
      {/* Skid marks drawing on */}
      <DrawOn d="M 600 860 L 1020 860" t={t} dur={24} color="#150810" width={18} />
      <DrawOn d="M 640 890 L 1080 890" t={t} dur={28} color="#150810" width={18} />
      {/* Dust & smoke blast */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx={1000 + i * 110 + t * 16}
          cy={870 - i * 15}
          rx={50 + t * 9}
          ry={24 + t * 4.5}
          fill="#D9534F"
          opacity={clamp(1 - t / len) * 0.45}
        />
      ))}
      {/* Boots at impact */}
      <g transform="translate(980 840)">
        <ellipse cx={-40} cy={10} rx={32} ry={16} fill="#1A121E" stroke="#FF5A4A" strokeWidth={3} />
        <ellipse cx={40} cy={10} rx={32} ry={16} fill="#1A121E" stroke="#FF5A4A" strokeWidth={3} />
      </g>
    </g>
  );
};

// S14: Macro readout / schematic stamp: DELTA V = 520 MPH. THAT'S REAL.
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t} id="sch14" />
      <rect x={380} y={260} width={1160} height={560} rx={18} fill="#0F1724" stroke={RED} strokeWidth={6} />
      <SchLabel x={960} y={350} t={t - 3} text="RELATIVE VELOCITY MISMATCH" size={42} color={SCH.line} />
      <SchLabel x={960} y={480} t={t - 8} text="ΔV = 520 MPH" size={96} color={RED} />
      <SchLabel x={960} y={580} t={t - 14} text="GROUND IMPACT AT MACH 0.68" size={36} color={ORANGE} />
      <rect x={660} y={670} width={600} height={80} rx={40} fill={RED} opacity={t >= 18 ? 1 : 0} />
      {t >= 18 && (
        <text x={960} y={725} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={46} fill="#FFFFFF" letterSpacing={6}>
          THAT'S REAL.
        </text>
      )}
    </g>
  );
};

// S15: Extreme close-up: Pip in shock, red rim lighting, wind whipping drawstrings, cliffhanger
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 390, kf(t, [[0, 3.2], [len, 3.8]]))}>
      <Rooftop t={t + 200} red={1} low={180} />
      {/* High-speed wind streaks */}
      {[200, 340, 480].map((y, i) => (
        <line
          key={i}
          x1={-100 + ((t * 60 + i * 300) % 2200)}
          y1={y}
          x2={-100 + ((t * 60 + i * 300) % 2200) + 450}
          y2={y}
          stroke="#FF8877"
          strokeWidth={5}
          opacity={0.6}
        />
      ))}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 690,
          scale: 1.08,
          yaw: -0.35,
          tilt: 8,
          expr: 'shock',
          sway: 35,
          armL: { a: 40, b: 20 },
          armR: { a: 30, b: 15 },
        }}
        rimId="rimRed"
        shadow={0}
      />
    </g>
  );
};
