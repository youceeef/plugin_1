import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, FONT } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15 } from './shots';

const teleportLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.3 * lv}) contrast(${1 + 0.2 * lv}) brightness(${1 + 0.15 * lv}) hue-rotate(${15 * lv}deg)`,
  jitter: 8,
  Overlay: ({ f, p }) => {
    const r = p * 400 + 40;
    return (
      <g>
        <circle cx={960} cy={540} r={r} fill="none" stroke="#22D3EE" strokeWidth={12 * (1 - p)} opacity={0.8 * (1 - p)} />
        <circle cx={960} cy={540} r={r * 0.6} fill="none" stroke="#FFFFFF" strokeWidth={6 * (1 - p)} opacity={0.9 * (1 - p)} />
        <HudChip f={f} label="TELEPORT" icon="dot" />
        <text x={1820} y={1010} textAnchor="end" fontFamily={FONT.ui} fontSize={24} fill="#22D3EE" opacity={0.8}>
          LOC://SYNC
        </text>
      </g>
    );
  },
};

export const teleport = defineEpisode('Teleport', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15 },
  looks: { teleport: teleportLook },
});
