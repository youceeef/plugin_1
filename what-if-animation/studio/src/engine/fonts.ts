import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { STUDIO } from '../studio.config';

// Modern Scientific & Tech Typography:
// - Title: Space Grotesk (geometric, tech, high legibility, clean weights)
// - UI & Schematics: JetBrains Mono (precise, beautiful monospace for data/code/metrics)
// - Hand & Notes: Caveat (natural, modern architectural cursive handwriting)

loadSpaceGrotesk('normal', { weights: ['600', '700'], subsets: ['latin'] });
loadJetBrainsMono('normal', { weights: ['400', '500', '700'], subsets: ['latin'] });
loadCaveat('normal', { weights: ['400', '700'], subsets: ['latin'] });
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Space Grotesk',
  ui: 'JetBrains Mono',
  hand: 'Caveat',
};
