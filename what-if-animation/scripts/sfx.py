"""Step 7: sound. Generates the episode's sound effects and music bed, lines each hit up on its frame,
mixes the effects and music stems, and sets their levels against the voice.
Supports seamless looping and background beds for long-form episodes (7-10 minutes).

Usage:
    python <skill>/scripts/sfx.py <slug> [--dry]
"""
import sys, time

import numpy as np

from wi import SR, api, clip_path, credits_used, spent_since, decode, ep_dir, load_episode, load_json, log_cost, loudness, pub_dir, resolve, save_json, stem, write_wav

slug = sys.argv[1]
dry = '--dry' in sys.argv
ep = load_episode(slug)
tl = load_json(ep_dir(slug) / 'timeline.json')
if not tl:
    raise SystemExit('No timeline.json: run plan.py first')
words = load_json(ep_dir(slug) / 'words.json', [])
FPS = tl['fps']
ids = [s['id'] for s in tl['shots']]
cue = lambda c: resolve(c, words, FPS, tl['segments'], ids)
DUR = tl['total'] / FPS + 0.4

S = ep.get('sound')
if not S:
    # Auto-generate sound section from existing library
    print('No sound config in episode.json; creating default long-form sound design from library...')
    S = {
        'clips': {
            'room_tone': ['quiet indoor room tone in the evening, faint distant city hum, no voices', 12.5],
            'roof_wind': ['a gentle evening breeze on a city rooftop, distant traffic', 7.0],
            'music': ['playful quirky cartoon background music, pizzicato strings, glockenspiel and soft bass, light and curious, 110 bpm, no vocals', 17.0],
            'ding': ['a correct answer ding, bright bell chime', 0.8],
            'title_boom': ['a cinematic whoosh rising into a deep boom impact', 1.6]
        },
        'events': [
            ['S1', 'room_tone', 0.12, 'onset', f'f:{tl["total"]}']
        ],
        'music': {'clip': 'music'},
        'levels': {'sfx_lu': -1.5, 'music_lu': -9.5}
    }
    # Add stingers to schematic shots
    for seg in tl['segments']:
        if 'schematic' in seg['shot'].lower() or seg.get('look') == 'schematic':
            S['events'].append([seg['shot'], 'title_boom', 0.4, 'peak'])
    ep['sound'] = S
    save_json(ep_dir(slug) / 'episode.json', ep)

# ---------------------------------------------------------------- the clips
need = {}
for name, (prompt, secs) in S['clips'].items():
    need[name] = (prompt, secs, clip_path(name, prompt, secs))
missing = [n for n, (_, _, p) in need.items() if not p.exists()]
print(f'{len(need)} clips, {len(need) - len(missing)} already in the library, {len(missing)} to generate: {", ".join(missing) or "none"}')
if dry:
    sys.exit(0)
if missing:
    before, _ = credits_used()
    t0 = time.time()
    for n in missing:
        prompt, secs, p = need[n]
        p.write_bytes(api('/v1/sound-generation?output_format=mp3_44100_128', {'text': prompt, 'duration_seconds': secs, 'prompt_influence': 0.45}))
        print('  generated', n)
    used, items = spent_since(t0, expect=len(missing))
    after, _ = credits_used()
    used = max(used, after - before)
    note = f'{len(missing)} clips, {sum(need[n][1] for n in missing):.1f} s'
    if items < len(missing) and after == before:
        note += '; not all in the history or the counter yet, check the usage page'
    log_cost(slug, 'sound', used, note)

clips = {}
for n, (_, _, p) in need.items():
    x = decode(p)
    clips[n] = x / max(1e-9, np.abs(x).max())  # normalized peak

def onset(x, mode):
    a = np.abs(x)
    win = int(0.01 * SR)
    sm = np.convolve(a, np.ones(win) / win, mode='same')
    return int(np.argmax(sm)) if mode == 'peak' else int(np.argmax(sm > 0.2 * sm.max()))

def put(buf, frame, x, gain, align='onset', cut=None):
    i = int(frame / FPS * SR) - onset(x, align)
    if i < 0:
        x, i = x[-i:], 0
    if cut is not None:
        target_len = max(0, int(cut / FPS * SR) - i)
        # If sound is an ambience and target is longer than clip, tile/loop it
        if target_len > len(x) and len(x) > SR * 2:
            reps = int(np.ceil(target_len / len(x)))
            x = np.tile(x, reps)[:target_len]
        else:
            x = x[:target_len].copy()
        f = min(len(x), int(0.08 * SR))
        if f:
            x[-f:] *= np.linspace(1, 0, f)
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i] * gain

# ---------------------------------------------------------------- effects
sfx = np.zeros(int(DUR * SR))
for ev in S.get('events', []):
    c, name, gain = ev[0], ev[1], ev[2]
    align = ev[3] if len(ev) > 3 else 'onset'
    until = cue(ev[4]) if len(ev) > 4 and ev[4] else None
    if name in clips:
        put(sfx, cue(c), clips[name], gain, align, until)

for r in S.get('repeats', []):
    if r['clip'] not in clips:
        continue
    base = clips[r['clip']]
    g0, g1 = r.get('gain', [0.3, 0.3])
    p0, p1 = r.get('pitch', [1, 1])
    start = cue(r['at'])
    for i in range(r['n']):
        k = p0 + (p1 - p0) * ((i * 37) % 11) / 10
        shifted = np.interp(np.arange(0, len(base), k), np.arange(len(base)), base)
        put(sfx, start + r.get('every', 2) * i, shifted, g0 + (g1 - g0) * ((i * 53) % 7) / 6)

# ---------------------------------------------------------------- music (with looping)
music = np.zeros(int(DUR * SR))
M = S.get('music')
if M and M.get('clip') in clips:
    m = clips[M['clip']]
    m0 = int(cue(M['from']) / FPS * SR) if M.get('from') else 0
    until_idx = int(cue(M['until']) / FPS * SR) if M.get('until') else len(music)
    
    # Loop music track to fill required duration
    pos = m0
    while pos < until_idx:
        take = min(len(m), until_idx - pos)
        music[pos:pos + take] = m[:take]
        pos += take

    for seg_look in M.get('reverse_looks', []):
        runs = []
        for s in tl['segments']:
            if s.get('look') == seg_look:
                if runs and runs[-1][1] == s['a']:
                    runs[-1][1] = s['b']
                else:
                    runs.append([s['a'], s['b']])
        for a, b in runs:
            i, j = int(a / FPS * SR), int(b / FPS * SR)
            seg = music[max(0, i - 2 * (j - i)): i][::-2][: j - i]
            music[i: i + len(seg)] = seg * 0.55

    if M.get('until'):
        end = int(cue(M['until']) / FPS * SR)
        f = int(0.08 * SR)
        if end <= len(music):
            music[max(0, end - f): end] *= np.linspace(1, 0, min(f, end))
            music[end:] = 0

# ---------------------------------------------------------------- stems and levels against the voice
pub = pub_dir(slug)
write_wav(pub / 'sfx.wav', sfx, 0.98)
if M:
    write_wav(pub / 'music.wav', music, 0.98)
L = {'sfx_lu': -1.5, 'music_lu': -9.5}
L.update(S.get('levels', {}))
v_stem = stem(slug, 'voice')
v_lufs, _ = loudness(v_stem) if v_stem else (-24.0, 0)
s_lufs, _ = loudness(pub / 'sfx.wav')
m_lufs, _ = loudness(pub / 'music.wav') if M else (float('-inf'), 0)
gain_db = {'voice': 0.0, 'sfx': v_lufs + L['sfx_lu'] - s_lufs}
if M:
    gain_db['music'] = v_lufs + L['music_lu'] - m_lufs
top = max(gain_db.values())
vols = {k: round(min(1.0, 0.8 * 10 ** ((g - top) / 20)), 4) for k, g in gain_db.items()}
audio = tl.get('audio', {})
if v_stem:
    audio['voice'] = f'{slug}/{v_stem.name}'
audio.update({'sfx': f'{slug}/sfx.wav', 'voiceVol': vols['voice'], 'sfxVol': vols['sfx']})
if M:
    audio.update({'music': f'{slug}/music.wav', 'musicVol': vols['music']})
tl['audio'] = audio
save_json(ep_dir(slug) / 'timeline.json', tl)
print(f'voice {v_lufs:.1f} LUFS, effects stem {s_lufs:.1f}, music stem {m_lufs:.1f}')
print(f'volumes in the mix: {vols} (effects {L["sfx_lu"]:+.1f} LU and music {L["music_lu"]:+.1f} LU against the voice)')
