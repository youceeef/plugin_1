// Tiny animation helpers shared by the whole engine. Every shot is a pure function of its own clock t
// (frames), so nothing here keeps state: the same t always draws the same frame, which is what lets the
// engine play any shot backwards.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const backOut = (t: number) => {
  const c1 = 0.65; // Soft, smooth ~2% bounce overshoot
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** Piecewise value from [frame, value] keys with an ease between neighbours. */
export const kf = (f: number, keys: [number, number][], ease = easeInOut) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (f <= f1) return lerp(v0, v1, ease((f - f0) / Math.max(1e-6, f1 - f0)));
  }
  return keys[keys.length - 1][1];
};
/** A repeatable pseudo-random number in 0..1 for (seed, i): sets scatter books, stars and dust with it. */
export const rnd = (seed: number, i: number) => Math.abs(Math.sin(seed * 31.7 + i * 12.9898) * 43758.5453) % 1;
/** A smooth harmonic bounce that dies away: max amp 2, freq 80 deg (1.396 rad), decay ~8 frames. */
export const settle = (t: number, amp = 2, speed = 80 * (Math.PI / 180), decay = 8) =>
  (t > 0 ? Math.sin(t * speed) * Math.min(amp, 2) * Math.exp(-t / decay) : 0);

/** The camera: centre the world point (cx, cy) on screen at zoom s (1920 x 1080 frame). */
export const camT = (cx: number, cy: number, s: number) => `translate(960 540) scale(${s}) translate(${-cx} ${-cy})`;
/** A smooth, decaying harmonic camera bounce for a hit or transition (max amp 2, freq 80 deg, decay 8). */
export const shake = (t: number, from: number, len = 16, amp = 2) => {
  const dt = t - from;
  if (dt < 0 || dt >= len) return { x: 0, y: 0 };
  const a = Math.min(amp, 2);
  const env = a * Math.exp(-dt / 8);
  const angle = dt * (80 * (Math.PI / 180));
  return {
    x: Math.sin(angle) * env,
    y: Math.cos(angle * 0.8) * env * 0.6,
  };
};
