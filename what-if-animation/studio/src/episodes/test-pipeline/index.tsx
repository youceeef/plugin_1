import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const test_pipeline = defineEpisode('TestPipeline', {
  timeline: timeline as Timeline,
  shots: shots as any,
});
