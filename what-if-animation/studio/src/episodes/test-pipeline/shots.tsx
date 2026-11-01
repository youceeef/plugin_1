import React from 'react';
import { DynamicShot, ShotProps } from '../../engine';

export const S1: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S1" size="wide" set="study" line="Locked out? Blink. In your room? Late for class?" />;
export const S2: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S2" size="medium" set="study" line="Blink. In your seat? Rooftop sunset? Blink." />;
export const S3: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S3" size="close" set="study" line="On the edge. What if you could teleport anywhere you've seen" />;
export const S4: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S4" size="schematic" set="schematic" line="One catch. Earth rotates at a thousand miles an hour." />;
export const S5: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S5" size="schematic" set="schematic" line="Teleport between latitudes and you hit the ground at 500 mil" />;
export const S6: React.FC<ShotProps> = (p) => <DynamicShot {...p} id="S6" size="schematic" set="schematic" line="That's real. So, which way are you facing?" />;
