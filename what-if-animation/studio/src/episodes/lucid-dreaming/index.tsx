import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const lucid_dreaming = defineEpisode('LucidDreaming', {
  timeline: timeline as Timeline,
  shots: shots as any,
});
