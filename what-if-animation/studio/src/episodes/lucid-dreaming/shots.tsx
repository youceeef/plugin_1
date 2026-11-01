import React from 'react';
import { DynamicShot, ShotProps } from '../../engine';

// High-Variety, Purposeful Storyboard for "What If You Could Control Your Dreams?"
// Rule 1: ZERO consecutive duplicate environments. Every single cut changes location or composition.
// Rule 2: Chart appears only once (S7: 55% Population Study). No redundant chart loops.
// Rule 3: Bedroom is restricted to only 4 key narrative beats across the entire 32-shot episode.

// Act 1: The Hook & Realization
export const S1: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S1" size="wide" set="bedroom" expr="neutral" line="Imagine going to sleep tonight, and suddenly realizing you're dreaming." />;
export const S2: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S2" size="wide" set="rooftop" expr="cool" line="And in that moment, you become the director. You fly over cities," />;
export const S3: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S3" size="wide" set="space" expr="cool" line="talk to people who are long gone, and build entire worlds just by thinking" />;
export const S4: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S4" size="title" set="dreamworld" expr="neutral" line="What if this were possible every single night?" />;

// Act 2: The Science Beat - What is Lucid Dreaming?
export const S5: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S5" size="medium" set="study" expr="smug" line="It's closer than you think. It's called lucid dreaming." />;
export const S6: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S6" size="medium" set="street" expr="smug" line="Knowing you're inside a dream while you're still asleep. Studies suggest that more" />;
export const S7: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S7" size="schematic" set="schematic" line="than half of all people have experienced it at least once." />;
export const S8: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S8" size="medium" set="lab" expr="neutral" line="In normal dreams, the part of your brain responsible for logic is mostly switched off," />;
export const S9: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S9" size="wide" set="dreamworld" expr="oops" line="which is why we accept even the strangest events without question." />;
export const S10: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S10" size="close" set="classroom" expr="smug" line="In a lucid dream, that part partially wakes up," />;
export const S11: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S11" size="wide" set="rooftop" expr="cool" line="and your ability to make choices comes back. Now imagine controlling your dreams whenever" />;

// Act 3: Superpowers & Benefits
export const S12: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S12" size="medium" set="stairwell" expr="cool" line="you want. First, nightmares would lose their power." />;
export const S13: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S13" size="wide" set="space" expr="smug" line="Because you could face what scares you, or change the scene completely." />;
export const S14: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S14" size="wide" set="stage" expr="smug" line="Second, you could practice your skills. A speech in front of a crowd," />;
export const S15: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S15" size="medium" set="gym" expr="cool" line="an athletic move, even playing an instrument. Research suggests the brain treats" />;
export const S16: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S16" size="close" set="lab" expr="neutral" line="this kind of rehearsal as somewhat real practice. And third," />;
export const S17: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S17" size="wide" set="gallery" expr="happy" line="you'd have unlimited space for creativity. How many artists and writers have drawn" />;
export const S18: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S18" size="close" set="study" expr="neutral" line="their ideas from dreams? Is this just fantasy?" />;

// Act 4: The 2021 Experiment Evidence
export const S19: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S19" size="wide" set="lab" expr="neutral" line="In 2021, researchers managed to hold a real conversation with" />;
export const S20: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S20" size="medium" set="subway" expr="neutral" line="people during their lucid dreams. Simple questions were asked," />;
export const S21: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S21" size="close" set="bedroom" expr="neutral" line="and the sleepers answered with eye movements while still asleep." />;

// Act 5: The Turn & Consequences
export const S22: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S22" size="medium" set="rooftop" expr="worried" line="But what if this became a daily habit? This is where the trouble starts." />;
export const S23: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S23" size="medium" set="kitchen" expr="tired" line="Your sleep quality could suffer because your brain would be partially awake instead of fully resting." />;
export const S24: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S24" size="wide" set="subway" expr="worried" line="The line between dream and reality could blur," />;
export const S25: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S25" size="medium" set="bedroom" expr="shock" line="and you might wake up each morning wondering whether last night really happened." />;
export const S26: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S26" size="wide" set="space" expr="neutral" line="And you could lose the magic of spontaneous dreams, the ones that surprise you with things you" />;

// Act 6: Resolution & Reality Check Action
export const S27: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S27" size="wide" set="street" expr="cool" line="never expected. So controlling your dreams could give you a superpower," />;
export const S28: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S28" size="medium" set="study" expr="smug" line="but it comes at a price. The best part is that getting started is simple." />;
export const S29: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S29" size="insert" set="study" expr="neutral" line="Keep a dream journal every morning, and during the day, ask yourself," />;
export const S30: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S30" size="medium" set="rooftop" expr="happy" line="am I dreaming right now? Maybe tonight will be the first night you take hold of your dream." />;
export const S31: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S31" size="wide" set="stage" expr="happy" line="If you enjoyed this video, subscribe to the channel and tell us in the comments." />;
export const S32: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S32" size="close" set="bedroom" expr="happy" line="What would you do if you could control your dream tonight?" />;
