import React from 'react';
import { clamp, backOut, easeOut, lerp, easeInOut } from './anim';
import { C } from './rig';
import { FONT } from './fonts';

// What goes on top of a shot. The genre keeps text off the picture: one title card, small UI readouts in a mono
// face (a timer, a label, a chip), a few marks. No comic speech bubbles, no "HA HA", no captions of the voice.
// One look for every readout: a dark translucent pill, cream text, orange for the live value.

export const UI = {
  pill: '#0B0816',
  text: '#F6EFE3',
  live: '#FF8A3D',
  good: '#5BE08A',
  bad: '#FF5A4A',
};

/** A four-point sparkle that blooms and fades over 18 frames from t = 0 (a glint, a win). */
export const Sparkle: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t <= 0 || t > 18) return null;
  const k = Math.sin((t / 18) * Math.PI);
  return <path transform={`translate(${x} ${y}) scale(${k * s}) rotate(${t * 6})`} d="M 0 -40 Q 6 -6 40 0 Q 6 6 0 40 Q -6 6 -40 0 Q -6 -6 0 -40 Z" fill="#FFE27A" />;
};

/** A short answer or value as a small label (a sum's answer, a price, "x10"), with an optional mark drawn on after markT. */
export const Tag: React.FC<{ x: number; y: number; t: number; text: string; mark?: 'x' | 'check'; markT?: number; w?: number }> = ({ x, y, t, text, mark, markT = 16, w = 180 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 22));
  const m = clamp((t - markT) / 12);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-54} width={w} height={108} rx={54} fill={UI.pill} opacity={0.75} />
      <rect x={-w / 2} y={-54} width={w} height={108} rx={54} fill="none" stroke={UI.text} strokeWidth={3} opacity={0.85} />
      <text y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={UI.text} letterSpacing={3}>
        {text}
      </text>
      {mark && m > 0 ? (
        mark === 'x' ? (
          <path d={`M ${w / 2 + 28} -30 L ${w / 2 + 86} 28 M ${w / 2 + 86} -30 L ${w / 2 + 28} 28`} stroke={UI.bad} strokeWidth={13} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - m)} />
        ) : (
          <path d={`M ${w / 2 + 26} 0 L ${w / 2 + 48} 26 L ${w / 2 + 92} -32`} stroke={UI.good} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={110} strokeDashoffset={110 * (1 - m)} />
        )
      ) : null}
    </g>
  );
};

/** A chip in the corner naming the power while it runs (REWIND, COPY, PAUSED...), with an icon that blinks. */
export const HudChip: React.FC<{ x?: number; y?: number; f: number; label: string; icon?: 'rewind' | 'pause' | 'copy' | 'paste' | 'dot' | 'skip' }> = ({ x = 96, y = 112, f, label, icon = 'dot' }) => {
  const blink = Math.floor(f / 5) % 2 ? 1 : 0.5;
  const w = 240 + label.length * 34;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-36} y={-54} width={w} height={108} rx={54} fill={UI.pill} opacity={0.65} />
      <g transform="translate(24 0)" opacity={blink}>
        {icon === 'rewind' ? <path d="M 0 -24 L -26 0 L 0 24 Z M 30 -24 L 4 0 L 30 24 Z" fill="#FFB15A" /> : null}
        {icon === 'pause' ? <path d="M -12 -22 L -2 -22 L -2 22 L -12 22 Z M 8 -22 L 18 -22 L 18 22 L 8 22 Z" fill="#FFB15A" /> : null}
        {icon === 'copy' || icon === 'paste' ? (
          <g fill="none" stroke="#FFB15A" strokeWidth={5} strokeLinejoin="round">
            <rect x={-14} y={-22} width={26} height={32} rx={4} />
            <rect x={-2} y={-10} width={26} height={32} rx={4} fill={icon === 'paste' ? '#FFB15A' : 'none'} />
          </g>
        ) : null}
        {icon === 'dot' ? <circle r={12} fill="#FF4A4A" /> : null}
        {icon === 'skip' ? <path d="M -24 -22 L -2 0 L -24 22 Z M -2 -22 L 20 0 L -2 22 Z M 22 -22 L 30 -22 L 30 22 L 22 22 Z" fill="#FFB15A" /> : null}
      </g>
      <text x={108} y={15} fontFamily={FONT.ui} fontSize={40} fill={UI.text} letterSpacing={8}>
        {label}
      </text>
    </g>
  );
};

/** A round dial with a readout: a stopwatch counting, a countdown, a battery. `p` is how full the ring is (0..1). */
export const Dial: React.FC<{ x?: number; y?: number; p: number; readout: string; r?: number; size?: number }> = ({ x = 1720, y = 140, p, readout, r = 84, size = 40 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={UI.pill} opacity={0.55} />
    <circle r={r} fill="none" stroke={UI.text} strokeWidth={5} opacity={0.85} />
    <circle r={r} fill="none" stroke={UI.live} strokeWidth={9} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - clamp(p))} transform="rotate(-90)" />
    <rect x={-14} y={-r - 28} width={28} height={18} rx={4} fill={UI.text} opacity={0.85} />
    <text y={size * 0.35} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={UI.live}>
      {readout}
    </text>
  </g>
);

/** A horizontal gauge with a label: how much is left, how fast, how strong. `p` 0..1; it turns red past `danger`. */
export const Gauge: React.FC<{ x: number; y: number; w?: number; p: number; label: string; danger?: number }> = ({ x, y, w = 420, p, label, danger = 0.8 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-20} y={-58} width={w + 40} height={110} rx={22} fill={UI.pill} opacity={0.6} />
    <text x={0} y={-18} fontFamily={FONT.ui} fontSize={28} fill={UI.text} letterSpacing={4} opacity={0.85}>
      {label}
    </text>
    <rect x={0} y={0} width={w} height={26} rx={13} fill="#ffffff" opacity={0.12} />
    <rect x={0} y={0} width={w * clamp(p)} height={26} rx={13} fill={p > danger ? UI.bad : UI.live} />
  </g>
);

/** A label that pops up and drifts off ("x10", "+1", "56"), smoothly animated. */
export const FloatLabel: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number }> = ({ x, y, t, text, color = '#FFE27A', size = 72 }) => {
  if (t < 0 || t > 44) return null;
  const s = backOut(clamp(t / 22));
  return (
    <text x={x} y={y - easeOut(t / 44) * 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size * s} fill={color} opacity={clamp((44 - t) / 14)} stroke="#1A1230" strokeWidth={6} paintOrder="stroke">
      {text}
    </text>
  );
};

/** Concentric rings opening out from a point (focus, a realisation, a power switching on), smoothly animated. */
export const FocusRings: React.FC<{ x: number; y: number; t: number; r0?: number; color?: string }> = ({ x, y, t, r0 = 60, color = '#FFE7B3' }) =>
  t > 0 && t < 26 ? (
    <g>
      {[0, 1, 2].map((i) => {
        const r = r0 + (t - i * 5) * 18;
        return r > r0 ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={6} opacity={clamp(1 - (t - i * 4) / 14)} /> : null;
      })}
    </g>
  ) : null;

/** Stars circling a dazed head, from t = 0. */
export const DizzyStars: React.FC<{ x: number; y: number; t: number; rx?: number; ry?: number }> = ({ x, y, t, rx = 110, ry = 50 }) =>
  t < 0 ? null : (
    <g>
      {[0, 1, 2].map((i) => {
        const a = t / 4 + (i * Math.PI * 2) / 3;
        return (
          <path
            key={i}
            transform={`translate(${x + Math.cos(a) * rx} ${y + Math.sin(a) * ry}) scale(0.5)`}
            d="M 0 -40 L 10 -12 L 40 -12 L 16 6 L 25 36 L 0 18 L -25 36 L -16 6 L -40 -12 L -10 -12 Z"
            fill="#FFE27A"
            stroke={C.ink}
            strokeWidth={5}
          />
        );
      })}
    </g>
  );

/**
 * A selection box: dashed "marching ants" that draw round a target from t = 0, with corner handles, then hold.
 * For powers that pick a thing out of the world (copy, scan, target, freeze one object).
 */
export const Marquee: React.FC<{ x: number; y: number; w: number; h: number; t: number; color?: string; label?: string }> = ({ x, y, w, h, t, color = '#7FD4FF', label }) => {
  if (t < 0) return null;
  const draw = easeOut(clamp(t / 18));
  const per = 2 * (w + h);
  const ants = (t * 1.5) % 24;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} opacity={0.08 * draw} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#0B0816" strokeWidth={9} opacity={0.5 * draw} strokeDasharray={`${per * draw} ${per}`} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={5} strokeDasharray={draw < 1 ? `${per * draw} ${per}` : '14 10'} strokeDashoffset={draw < 1 ? 0 : -ants} />
      {draw >= 1
        ? [
            [x, y],
            [x + w, y],
            [x, y + h],
            [x + w, y + h],
          ].map(([hx, hy], i) => <rect key={i} x={hx - 9} y={hy - 9} width={18} height={18} rx={3} fill="#F6EFE3" stroke={color} strokeWidth={4} />)
        : null}
      {label && draw >= 1 ? (
        <g transform={`translate(${x} ${y - 22})`}>
          <rect x={0} y={-34} width={label.length * 21 + 34} height={44} rx={10} fill={color} />
          <text x={17} y={-3} fontFamily={FONT.ui} fontSize={30} fill="#0B0816">
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Something appearing out of nowhere (a pasted copy, a summoned object): before t = 0 nothing, then it pops in about
 * (x, y) with an overshoot, glowing in the power's colour, and a ring opens out from it. Wrap the thing in it.
 */
export const PasteIn: React.FC<{ x: number; y: number; t: number; children: React.ReactNode; color?: string; ring?: number }> = ({ x, y, t, children, color = '#7FD4FF', ring = 90 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 24));
  const glow = 1 - clamp(t / 28);
  return (
    <g>
      {t < 30 ? <circle cx={x} cy={y} r={ring * (0.6 + easeOut(t / 30) * 1.6)} fill="none" stroke={color} strokeWidth={6} opacity={1 - t / 30} /> : null}
      <g transform={`translate(${x} ${y}) scale(${0.55 + 0.45 * s}) translate(${-x} ${-y})`} style={glow > 0 ? { filter: `drop-shadow(0 0 ${4 + 16 * glow}px ${color}) brightness(${1 + 0.5 * glow})` } : undefined}>
        {children}
      </g>
    </g>
  );
};

/** A small notice that pops in and out (COPIED, SAVED, +1), centred at x, y, from t = 0 for `hold` frames. */
export const Toast: React.FC<{ x: number; y: number; t: number; text: string; hold?: number; color?: string }> = ({ x, y, t, text, hold = 32, color = UI.live }) => {
  if (t < 0 || t > hold + 10) return null;
  const s = t < hold ? backOut(clamp(t / 12)) : 1 - clamp((t - hold) / 10);
  const w = text.length * 26 + 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={UI.pill} opacity={0.8} />
      <circle cx={-w / 2 + 34} cy={0} r={9} fill={color} />
      <text x={14} y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={UI.text} letterSpacing={4}>
        {text}
      </text>
    </g>
  );
};

/** VHS-style tape lines and a moving bright band, for a power that bends time (rewind, fast-forward). Full frame. */
export const TapeLines: React.FC<{ f: number }> = ({ f }) => {
  const band = 1080 - ((f * 53) % 1400) + 160;
  return (
    <g>
      <defs>
        <pattern id="tapeScan" width="4" height="6" patternUnits="userSpaceOnUse" y={(f * 3) % 6}>
          <rect width="4" height="2" fill="#000" opacity="0.22" />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill="url(#tapeScan)" />
      <rect x={0} y={band} width={1920} height={26} fill="#FFFFFF" opacity={0.1} />
    </g>
  );
};

/**
 * The title card: a small first line and a big second line, as the genre does it ("WHAT IF YOU COULD" /
 * "COPY AND PASTE ANYTHING?"). Each line pops on (line 1 at t = 2, line 2 at t = 5). `accent` is one word in line 2
 * that pulses at accentT. Put it over a wide establishing shot, upper third.
 */
export const TitleCard: React.FC<{ t: number; lines: [string, string]; accent?: string; accentT?: number; y?: number; size?: number }> = ({ t, lines, accent, accentT = 40, y = 175, size = 128 }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 26));
  const pulse = t >= accentT && t < accentT + 28 ? 1 + 0.05 * Math.sin(((t - accentT) / 28) * Math.PI) : 1;
  const words = lines[1].split(' ');
  return (
    <g>
      <g transform={`translate(960 ${y}) scale(${pop(3)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={size / 2} letterSpacing={5} fill="#F6EFE3" stroke="#1A1230" strokeWidth={8} paintOrder="stroke">
          {lines[0]}
        </text>
      </g>
      <g transform={`translate(960 ${y + size + 14}) scale(${pop(8)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={C.orange} stroke="#1A1230" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.55))' }}>
          {words.map((w, i) => (
            <tspan key={i} style={w.replace(/[^\w]/g, '') === accent ? { fontSize: size * pulse } : undefined} fill={w.replace(/[^\w]/g, '') === accent ? '#FFE27A' : undefined}>
              {(i ? ' ' : '') + w}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------
// Phase 3: Data HUD, Blueprint & Tech Visuals Toolkit
// Ported from aiTrends 2D reference kit (ui2d.js)
// -------------------------------------------------------------

export interface DataCardProps {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  t: number;
  title?: string;
  subtitle?: string;
  from?: number;
  to?: number;
  decimals?: number;
  unit?: string;
  start?: number;
  dur?: number;
  labels?: Array<[number, string | null]>;
  shape?: number;
  arrow?: boolean;
  color?: string;
}

/**
 * Animated Data Card: title, subtitle, live-updating counter, and a smooth curve graph drawing on.
 * Exact canonical component from ui2d.js.
 */
export const DataCard: React.FC<DataCardProps> = ({
  x = 360,
  y = 220,
  w = 1200,
  h = 640,
  t,
  title = 'SUBJECT 11 · MAX',
  subtitle = 'SPEED FACTOR',
  from = 10,
  to = 12.4,
  decimals = 1,
  unit = 'x',
  start = 6,
  dur = 48,
  labels = [[0, null], [0.55, null], [1, null]],
  shape = 1.7,
  arrow = true,
  color = '#FF8A3D',
}) => {
  if (t < 0) return null;
  const inDur = 14;
  const aIn = clamp(t / inDur);
  const sc = 0.94 + 0.06 * backOut(clamp(t / (inDur + 4)));
  const p = easeInOut(clamp((t - start) / dur));
  const v = lerp(from, to, p);
  const valStr = v.toFixed(decimals) + unit;

  // Graph curve geometry
  const gx0 = x + 100;
  const gx1 = x + w - 100;
  const gy0 = y + h - 100;
  const gy1 = y + h * 0.42;

  const pt = (u: number): [number, number] => [
    lerp(gx0, gx1, u),
    lerp(gy0, gy1, Math.pow(u, shape)),
  ];

  const steps = 60;
  const maxI = Math.floor(steps * p);
  let d = '';
  for (let i = 0; i <= maxI; i++) {
    const [px, py] = pt(i / steps);
    d += (i === 0 ? `M ${px.toFixed(1)} ${py.toFixed(1)}` : ` L ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  const [headX, headY] = pt(p);

  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2}) scale(${sc}) translate(${-x - w / 2} ${-y - h / 2})`} opacity={aIn}>
      {/* Background card with glass border */}
      <rect x={x} y={y} width={w} height={h} rx={28} fill="rgba(18,28,48,0.94)" stroke="rgba(150,180,230,0.25)" strokeWidth={2.5} />

      {/* Title & Subtitle */}
      <text x={x + 70} y={y + 85} fontFamily={FONT.ui} fontSize={46} fontWeight={800} fill="#9FB6D8" letterSpacing={2}>
        {title}
      </text>
      <text x={x + 72} y={y + 130} fontFamily={FONT.ui} fontSize={22} fontWeight={700} fill="#6F84A6" letterSpacing={3}>
        {subtitle}
      </text>

      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={x + 70}
          y1={y + h * 0.38 + i * h * 0.14}
          x2={x + w - 70}
          y2={y + h * 0.38 + i * h * 0.14}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
        />
      ))}

      {/* Live Value & Arrow */}
      <g transform={`translate(${x + w - 80} ${y + 105})`}>
        <text textAnchor="end" fontFamily={FONT.ui} fontSize={76} fontWeight={900} fill={color} style={{ filter: `drop-shadow(0 0 16px ${color}88)` }}>
          {valStr}
        </text>
        {arrow ? (
          <path
            d={to >= from ? 'M 18 10 L 46 10 L 32 -18 Z' : 'M 18 -18 L 46 -18 L 32 10 Z'}
            fill={color}
          />
        ) : null}
      </g>

      {/* Curve */}
      {d ? (
        <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}

      {/* Head Glow */}
      {p > 0.01 ? (
        <g transform={`translate(${headX} ${headY})`}>
          <circle r={14} fill={color} opacity={0.35} />
          <circle r={7} fill="#FFFFFF" />
        </g>
      ) : null}

      {/* Milestone Labels */}
      {labels.map(([u, lab], idx) => {
        if (p + 0.02 < u) return null;
        const [lx, ly] = pt(u);
        const txt = lab ?? (lerp(from, to, u).toFixed(decimals) + unit);
        return (
          <text key={idx} x={lx} y={ly - 22} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fontWeight={700} fill="#FFFFFF" opacity={clamp((p - u + 0.08) / 0.08) * 0.85}>
            {txt}
          </text>
        );
      })}
    </g>
  );
};

export interface CompareBarRow {
  label: string;
  v: number;
  color?: string;
}

/**
 * Animated Horizontal Comparison Bars: e.g. [{ label: 'REAL', v: 0.3 }, { label: 'FELT', v: 0.9 }]
 */
export const CompareBars: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  t: number;
  rows: CompareBarRow[];
  start?: number;
  color?: string;
}> = ({ x = 320, y = 520, w = 800, t, rows, start = 0, color = '#8FB8E8' }) => {
  if (t < start) return null;
  return (
    <g>
      {rows.map((r, i) => {
        const p = easeOut(clamp((t - start - i * 8) / 24));
        const yy = y + i * 72;
        const barW = Math.max(24, w * clamp(r.v) * p);
        const barColor = r.color || color;
        return (
          <g key={i}>
            <text x={x} y={yy + 17} fontFamily={FONT.ui} fontSize={26} fontWeight={800} fill="#F6EFE3" letterSpacing={2}>
              {r.label}
            </text>
            {/* Track */}
            <rect x={x + 160} y={yy - 4} width={w} height={26} rx={13} fill={color} opacity={0.15} />
            {/* Value Bar */}
            <rect x={x + 160} y={yy - 4} width={barW} height={26} rx={13} fill={barColor} />
            {/* Percentage */}
            <text x={x + 180 + w} y={yy + 17} fontFamily={FONT.ui} fontSize={24} fontWeight={800} fill={barColor}>
              {`${Math.round(r.v * 100 * p)}%`}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/**
 * Dimension line with measurement arrowheads: e.g. "30 m", "0.25 s"
 */
export const DimensionLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t: number;
  text: string;
  color?: string;
  start?: number;
  dur?: number;
}> = ({ x1, y1, x2, y2, t, text, color = '#FFD47E', start = 0, dur = 20 }) => {
  if (t < start) return null;
  const p = easeOut(clamp((t - start) / dur));
  const ex = lerp(x1, x2, p);
  const ey = lerp(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const arrow = (ax: number, ay: number, a: number) => (
    <polygon
      points={`0,0 ${-Math.cos(a - 0.4) * 16},${-Math.sin(a - 0.4) * 16} ${-Math.cos(a + 0.4) * 16},${-Math.sin(a + 0.4) * 16}`}
      transform={`translate(${ax} ${ay})`}
      fill={color}
    />
  );

  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={3} />
      {arrow(x1, y1, ang + Math.PI)}
      {p > 0.95 ? arrow(x2, y2, ang) : null}
      <text
        x={midX}
        y={midY - 14}
        textAnchor="middle"
        fontFamily={FONT.ui}
        fontSize={36}
        fontWeight={800}
        fill={color}
        opacity={clamp((p - 0.4) * 2)}
        style={{ filter: `drop-shadow(0 0 10px ${color}88)` }}
      >
        {text}
      </text>
    </g>
  );
};

/**
 * Precision readout: label + value with optional glow (e.g. "0.20 s", "NORMAL: 0.25 s")
 */
export const Readout: React.FC<{
  x: number;
  y: number;
  value: string;
  label?: string;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}> = ({ x, y, value, label, color = '#FFD47E', size = 46, align = 'left' }) => (
  <g>
    {label ? (
      <text x={x} y={y - size * 0.75} textAnchor={align} fontFamily={FONT.ui} fontSize={size * 0.45} fontWeight={700} fill="#F6EFE3" opacity={0.7} letterSpacing={2}>
        {label}
      </text>
    ) : null}
    <text x={x} y={y} textAnchor={align} fontFamily={FONT.ui} fontSize={size} fontWeight={900} fill={color} style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}>
      {value}
    </text>
  </g>
);

/**
 * Blueprint backdrop: dark navy grid with registration marks.
 */
export const BlueprintGrid: React.FC<{
  grid?: number;
  opacity?: number;
  color?: string;
  id?: string;
}> = ({ grid = 60, opacity = 0.08, color = '#8FB8E8', id = 'bp' }) => (
  <g>
    <defs>
      <pattern id={`${id}_grid`} width={grid} height={grid} patternUnits="userSpaceOnUse">
        <rect width={grid} height={grid} fill="none" stroke={color} strokeWidth={1} opacity={opacity} />
      </pattern>
      <pattern id={`${id}_grid5`} width={grid * 5} height={grid * 5} patternUnits="userSpaceOnUse">
        <rect width={grid * 5} height={grid * 5} fill="none" stroke={color} strokeWidth={2} opacity={opacity * 2.2} />
      </pattern>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0B1324" />
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#${id}_grid)`} />
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#${id}_grid5)`} />
  </g>
);

/**
 * LineFigure: Blueprint style line stick figure schematic for technical/diagram shots.
 */
export const LineFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
  facing?: 1 | -1;
  tilt?: number;
}> = ({ x, y, s = 1, color = '#E8F0FF', facing = 1, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * facing} ${s}) rotate(${tilt})`} stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
    {/* Head */}
    <circle cx={0} cy={-220} r={24} />
    {/* Torso */}
    <line x1={0} y1={-196} x2={0} y2={-100} />
    {/* Arms */}
    <polyline points="-40,-130 0,-185 40,-130" />
    {/* Legs */}
    <polyline points="-30,0 0,-100 30,0" />
  </g>
);

/**
 * Corner badge e.g. "100x" or "DAY 3".
 */
export const Badge: React.FC<{
  text: string;
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}> = ({ text, x = 1750, y = 140, color = '#FFD47E', size = 42 }) => (
  <text x={x} y={y} textAnchor="end" fontFamily={FONT.ui} fontSize={size} fontWeight={900} fill={color} letterSpacing={2} style={{ filter: `drop-shadow(0 0 14px ${color}88)` }}>
    {text}
  </text>
);

/**
 * Callout label with leader line pointing at something.
 */
export const Callout: React.FC<{
  at: [number, number];
  to: [number, number];
  text: string;
  t: number;
  start?: number;
  color?: string;
  size?: number;
}> = ({ at, to, text, t, start = 0, color = '#F6EFE3', size = 32 }) => {
  if (t < start) return null;
  const p = easeOut(clamp((t - start) / 16));
  const ex = lerp(at[0], to[0], p);
  const ey = lerp(at[1], to[1], p);
  const isRight = to[0] >= at[0];

  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={6} fill={color} />
      <line x1={at[0]} y1={at[1]} x2={ex} y2={ey} stroke={color} strokeWidth={2.5} opacity={0.8} />
      {p > 0.6 ? (
        <text
          x={to[0] + (isRight ? 16 : -16)}
          y={to[1] + 8}
          textAnchor={isRight ? 'start' : 'end'}
          fontFamily={FONT.ui}
          fontSize={size}
          fontWeight={800}
          fill={color}
          opacity={clamp((p - 0.6) / 0.4)}
          letterSpacing={2}
        >
          {text}
        </text>
      ) : null}
    </g>
  );
};
