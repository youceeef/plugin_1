import React from 'react';
import {
  ShotProps,
  camT, kf, clamp, easeOut, backOut,
  Hero, basePose, poseAt, LOOKS,
  Study, Desk,
  Bedroom,
  Kitchen, KitchenIsland,
  Classroom, SchoolDesk, Kid, KIDS,
  Stairwell, Banister,
  Rooftop,
  Schematic, SCH, Arrow, DrawOn, SchLabel, CountUp,
  Tabletop, Mug, Foreground, TitleCard,
  Laboratory, Space, Street, Stage, Subway,
  Dreamworld, Gallery, Gym
} from './index';

const PIP = LOOKS.pipHood;
const CYAN = '#22D3EE';
const ORANGE = '#FF8A3D';
const RED = '#FF5A4A';

export interface DynamicShotConfig {
  id: string;
  size: 'wide' | 'medium' | 'close' | 'extreme_close' | 'insert' | 'ots' | 'low' | 'schematic' | string;
  set: 'study' | 'bedroom' | 'kitchen' | 'classroom' | 'stairwell' | 'rooftop' | 'schematic' | string;
  note?: string;
  line?: string;
  expr?: string;
  key?: number;
}

/**
 * Procedural DynamicShot component for long-form episodes (7-10 minutes).
 * Renders any shot composition dynamically based on size, set, and line.
 */
export const DynamicShot: React.FC<ShotProps & DynamicShotConfig> = ({
  t, len, f, id, size, set, line, expr = 'neutral'
}) => {
  const normSize = size.toLowerCase();
  const normSet = set.toLowerCase();

  // 0. TITLE CARD SHOT
  if (normSize.includes('title') || (line && line.toLowerCase().includes('what if this were possible'))) {
    return (
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
        <Dreamworld t={t + 40} id={`title_${id}`} />
        <Hero look={PIP} pose={{ ...basePose, x: 960, y: 720, scale: 0.9, yaw: 0, expr: 'neutral' }} rimId="rimR" shadow={0.8} />
        <TitleCard t={t} lines={['WHAT IF YOU COULD', 'CONTROL YOUR DREAMS?']} accent="DREAMS" accentT={28} size={118} />
      </g>
    );
  }

  // 1. SCHEMATIC SCIENCE SHOT (Contextual to line)
  if (normSize.includes('schematic') || normSet.includes('schematic')) {
    const l = (line || '').toLowerCase();
    let schTitle = 'NEURAL COHERENCE SCHEMATIC';
    let schLabel = 'NEURAL ACTIVITY';
    let schTarget = 85;
    let schSuffix = '%';

    if (l.includes('half') || l.includes('people') || l.includes('experienced') || l.includes('studies')) {
      schTitle = 'STUDIES // POPULATION INCIDENCE';
      schLabel = 'EXPERIENCED LUCID DREAMING';
      schTarget = 55;
      schSuffix = '% OF POPULATION';
    } else if (l.includes('rehearsal') || l.includes('real practice') || l.includes('skills')) {
      schTitle = 'MOTOR CORTEX // NEURAL REHEARSAL';
      schLabel = 'SYNAPTIC RETENTION RATE';
      schTarget = 94;
      schSuffix = '% MATCH';
    } else if (l.includes('logic') || l.includes('switched off') || l.includes('brain')) {
      schTitle = 'PREFRONTAL CORTEX // LOGIC STATUS';
      schLabel = 'PREFRONTAL ACTIVATION IN REM';
      schTarget = 18;
      schSuffix = '% ACTIVE';
    }

    return (
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
        <Schematic t={t} id={`sch_${id}`} />
        {/* Glowing Brain / Neural Network Schematic */}
        <circle cx={960} cy={520} r={280} fill="#142236" stroke={SCH.line} strokeWidth={4} />
        <ellipse cx={960} cy={520} rx={280} ry={70} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
        <ellipse cx={960} cy={380} rx={242} ry={50} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
        <ellipse cx={960} cy={660} rx={242} ry={50} fill="none" stroke={SCH.grid} strokeWidth={3} strokeDasharray="8 6" />
        <line x1={960} y1={180} x2={960} y2={860} stroke={SCH.dim} strokeWidth={3} strokeDasharray="12 8" />
        
        {/* Brain Synapse Nodes */}
        <circle cx={880} cy={460} r={8} fill={CYAN} opacity={0.8 + 0.2 * Math.sin(t / 8)} />
        <circle cx={1040} cy={460} r={8} fill={CYAN} opacity={0.8 + 0.2 * Math.cos(t / 8)} />
        <circle cx={960} cy={500} r={10} fill={ORANGE} />
        <circle cx={900} cy={560} r={7} fill={CYAN} />
        <circle cx={1020} cy={560} r={7} fill={CYAN} />
        <line x1={880} y1={460} x2={960} y2={500} stroke={CYAN} strokeWidth={2} opacity={0.6} />
        <line x1={1040} y1={460} x2={960} y2={500} stroke={CYAN} strokeWidth={2} opacity={0.6} />
        <line x1={960} y1={500} x2={900} y2={560} stroke={CYAN} strokeWidth={2} opacity={0.6} />
        <line x1={960} y1={500} x2={1020} y2={560} stroke={CYAN} strokeWidth={2} opacity={0.6} />

        <Arrow x0={960} y0={520} x1={1340} y1={520} t={t - 8} dur={24} color={ORANGE} bend={0} />
        <SchLabel x={1400} y={485} t={t - 16} text={schLabel} size={24} color={SCH.line} anchor="start" />
        <CountUp x={1400} y={570} t={t - 20} to={schTarget} dur={42} size={50} color={ORANGE} suffix={schSuffix} anchor="start" />
        <SchLabel x={960} y={110} t={t - 4} text={schTitle} size={36} color={SCH.glow} />
      </g>
    );
  }

  // 2. MACRO TABLETOP INSERT (Contextual: Dream Journal Notebook)
  if (normSize.includes('insert')) {
    const isJournal = line && line.toLowerCase().includes('journal');
    return (
      <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.18]]))}>
        <Tabletop edge={950} kind="wood" wood="#9E7D5C" grain="#8B6948" lip="#6D4F35" floor="#18151D" floorLines="#120F16" />
        {isJournal ? (
          <g id="dream_journal">
            {/* Open Leather Bound Dream Journal */}
            <rect x={680} y={340} width={560} height={360} rx={12} fill="#3E2723" stroke="#231709" strokeWidth={6} />
            {/* Left Page */}
            <rect x={700} y={355} width={255} height={330} rx={4} fill="#FAF3E0" />
            {/* Right Page */}
            <rect x={965} y={355} width={255} height={330} rx={4} fill="#F5ECCE" />
            {/* Center Spine */}
            <line x1={960} y1={355} x2={960} y2={685} stroke="#5D4037" strokeWidth={5} />
            {/* Ruled lines & notes */}
            <text x={720} y={400} fill="#B8860B" fontSize={18} fontWeight="bold" fontFamily="monospace">DREAM LOG // 07:15 AM</text>
            <line x1={720} y1={430} x2={930} y2={430} stroke="#7B8DA6" strokeWidth={2} strokeDasharray="6 4" />
            <line x1={720} y1={470} x2={930} y2={470} stroke="#7B8DA6" strokeWidth={2} strokeDasharray="6 4" />
            <line x1={720} y1={510} x2={930} y2={510} stroke="#7B8DA6" strokeWidth={2} strokeDasharray="6 4" />
            <line x1={720} y1={550} x2={900} y2={550} stroke="#7B8DA6" strokeWidth={2} strokeDasharray="6 4" />
            {/* Right Page sketches */}
            <circle cx={1090} cy={480} r={50} fill="none" stroke="#22D3EE" strokeWidth={3} strokeDasharray="4 4" />
            <text x={1090} y={560} fill="#64748B" fontSize={15} textAnchor="middle" fontFamily="sans-serif">"I AM DREAMING"</text>
            {/* Fountain Pen resting beside */}
            <line x1={1260} y1={360} x2={1290} y2={640} stroke="#1A202C" strokeWidth={12} strokeLinecap="round" />
            <line x1={1260} y1={360} x2={1265} y2={400} stroke="#ECC94B" strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : (
          <>
            <rect x={760} y={380} width={400} height={280} rx={8} fill="#E8DFD1" stroke="#2B241D" strokeWidth={5} />
            <line x1={800} y1={440} x2={1120} y2={440} stroke="#7B8DA6" strokeWidth={3} />
            <line x1={800} y1={500} x2={1120} y2={500} stroke="#7B8DA6" strokeWidth={3} />
            <line x1={800} y1={560} x2={1080} y2={560} stroke="#7B8DA6" strokeWidth={3} />
            <line x1={1200} y1={370} x2={1240} y2={620} stroke="#E9C46A" strokeWidth={14} strokeLinecap="round" />
            <circle cx={960} cy={520} r={((t * 24) % 360)} fill="none" stroke={CYAN} strokeWidth={8} opacity={clamp(1 - t / len)} />
          </>
        )}
      </g>
    );
  }

  // 3. SET BACKGROUNDS
  let setNode: React.ReactNode = null;
  let charX = 960;
  let charY = 712;
  let charScale = 1.0;
  let charYaw = 0.3;
  let camCenter = { x: 960, y: 540 };

  if (normSet.includes('study')) {
    setNode = (
      <>
        <Study t={t + 40} id={`std_${id}`} />
        <Desk x0={560} x1={1360} y={700} />
        <Mug x={1120} y={670} rot={0} steam={1} f={t} />
      </>
    );
    charX = 960; charY = 712;
  } else if (normSet.includes('kitchen')) {
    setNode = (
      <>
        <Kitchen t={t + 40} id={`kit_${id}`} />
        <KitchenIsland />
      </>
    );
    charX = 960; charY = 720;
  } else if (normSet.includes('classroom')) {
    setNode = (
      <>
        <Classroom t={t + 40} id={`cls_${id}`} solved={false} wrong={false} />
        <SchoolDesk x={1260} />
      </>
    );
    charX = 1260; charY = 720; charYaw = -0.3;
  } else if (normSet.includes('stairwell')) {
    setNode = (
      <>
        <Stairwell t={t + 40} id={`sw_${id}`} />
        <Banister />
      </>
    );
    charX = 480; charY = 390; charScale = 0.9;
  } else if (normSet.includes('bedroom')) {
    setNode = <Bedroom t={t + 40} id={`bed_${id}`} />;
    charX = 940; charY = 720;
  } else if (normSet.includes('lab')) {
    setNode = <Laboratory t={t + 40} id={`lab_${id}`} />;
    charX = 960; charY = 720;
  } else if (normSet.includes('space')) {
    setNode = <Space t={t + 40} id={`sp_${id}`} />;
    charX = 960; charY = 620; charScale = 0.95;
  } else if (normSet.includes('street')) {
    setNode = <Street t={t + 40} id={`str_${id}`} />;
    charX = 880; charY = 740;
  } else if (normSet.includes('stage')) {
    setNode = <Stage t={t + 40} id={`stg_${id}`} topic={line ? line.toUpperCase().slice(0, 36) : 'KEYNOTE // PRESENTATION'} />;
    charX = 960; charY = 720;
  } else if (normSet.includes('subway') || normSet.includes('train')) {
    setNode = <Subway t={t + 40} id={`sub_${id}`} />;
    charX = 960; charY = 720;
  } else if (normSet.includes('dream') || normSet.includes('surreal')) {
    setNode = <Dreamworld t={t + 40} id={`dw_${id}`} />;
    charX = 960; charY = 720;
  } else if (normSet.includes('gallery') || normSet.includes('art')) {
    setNode = <Gallery t={t + 40} id={`gal_${id}`} />;
    charX = 960; charY = 720;
  } else if (normSet.includes('gym') || normSet.includes('sport')) {
    setNode = <Gym t={t + 40} id={`gym_${id}`} />;
    charX = 960; charY = 720;
  } else {
    // Default to Rooftop
    setNode = <Rooftop t={t + 40} sunX={960} sunY={440} red={0} />;
    charX = 960; charY = 720;
  }

  // 4. CAMERA FRAMING BASED ON SIZE (Gentle, cinematic drift)
  let z0 = 1.0;
  let cy = 540;
  let cx = charX;

  if (normSize.includes('extreme') || normSize.includes('cu')) {
    z0 = 3.6; cy = 400;
  } else if (normSize.includes('close')) {
    z0 = 2.7; cy = 460;
  } else if (normSize.includes('medium')) {
    z0 = 1.6; cy = 580;
  } else if (normSize.includes('ots')) {
    z0 = 1.45; cy = 520;
  } else if (normSize.includes('low')) {
    z0 = 1.2; cy = 560;
  } else {
    // Wide
    z0 = 0.95; cy = 520; cx = 960;
  }

  // Smooth, subtle camera drift: 2.5% slow push-in and gentle Y pedestal
  const z1 = z0 * 1.028;
  const cy1 = cy - 6;
  const zoom = kf(t, [[0, z0], [len, z1]]);
  const camY = kf(t, [[0, cy], [len, cy1]]);
  const camX = kf(t, [[0, cx], [len, cx + (charYaw > 0 ? 8 : -8)]]);

  // 5. ORGANIC CHARACTER LIFE (Breathing, periodic blinking, subtle sway - NO entrance bounce)
  const isFlying = line && line.toLowerCase().includes('fly over cities');
  const actualY = isFlying ? 500 : charY;
  const breath = Math.sin(t / 24) * 1.5;
  const headSway = Math.sin(t / 36) * 1.2;
  const blink = (t % 130 >= 50 && t % 130 <= 55) ? 1 : 0;

  // Stable, grounded character pose without scale popping or entrance bounce
  const pose = {
    ...basePose,
    x: charX,
    y: actualY + breath,
    scale: charScale,
    yaw: isFlying ? 0 : charYaw,
    blink,
    headTilt: headSway,
    expr: (expr || (normSize.includes('close') ? 'smug' : 'neutral')) as any,
    armL: isFlying ? { a: 75, b: 25 } : { a: 15, b: 0 },
    armR: isFlying ? { a: 75, b: -25 } : { a: 20, b: -10 }
  };

  return (
    <g transform={camT(camX, camY, zoom)}>
      {setNode}
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0.8} />
      {normSize.includes('ots') && (
        <Foreground blur={12}>
          <ellipse cx={260} cy={740} rx={180} ry={340} fill="#0A0812" />
        </Foreground>
      )}
    </g>
  );
};
