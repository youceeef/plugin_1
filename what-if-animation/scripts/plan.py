"""Step 3: the shot list on the voice. Resolves the edit's cues against the word timings and writes the timeline.
Supports automatic procedural shot generation for long-form episodes (7-10 minutes).

Usage:
    python <skill>/scripts/plan.py <slug>
"""
import json, pathlib, statistics, sys

from wi import ep_dir, load_episode, load_json, out_dir, resolve, save_json, find_word, stem

slug = sys.argv[1]
ep = load_episode(slug)
FPS = ep.get('fps', 30)
LEAD = ep.get('lead', 2)
words = load_json(ep_dir(slug) / 'words.json', [])
if not words:
    raise SystemExit('No words.json yet: run transcribe.py or voice.py first.')

# ---------------------------------------------------------------- Auto-shots generator for long form
if ep.get('auto_shots') or not ep.get('shots') or not ep.get('edit'):
    print('Generating procedural shot list and edit cues for long-form episode...')
    SETS = ['bedroom', 'rooftop', 'study', 'classroom', 'kitchen', 'stairwell']
    SIZES = ['wide', 'medium', 'close', 'insert', 'ots', 'medium', 'extreme_close']
    SCIENCE_WORDS = {'percent', 'million', 'billion', 'thousand', 'speed', 'energy', 'miles', 'degrees', 'science', 'fact', 'real', 'gravity', 'physics', 'momentum', 'brain', 'logic', 'research', 'studies', '2021'}

    shots_def = []
    edit_def = []
    
    cur_shot_words = []
    shot_idx = 1
    scene_idx = 0
    shots_in_scene = 0
    
    for i, w in enumerate(words):
        cur_shot_words.append(w['w'] + (w.get('p') or ''))
        
        # Relaxed, smoother pacing: target 3.2s to 5.5s per shot (12-18 cuts/min)
        shot_dur = w['e'] - (words[i - len(cur_shot_words) + 1]['s'] if cur_shot_words else w['s'])
        is_punct = w.get('p') in ('.', '!', '?', ';')
        has_pause = (i + 1 < len(words)) and (words[i + 1]['s'] - w['e'] >= 0.42)
        is_long = shot_dur >= 5.2
        
        # Only cut if we've held for at least 3.0s on punctuation/pause, or reached max hold
        if (is_punct and shot_dur >= 3.0) or (has_pause and shot_dur >= 2.8) or is_long or (i == len(words) - 1):
            sid = f'S{shot_idx}'
            
            # Scene set selection: change set every 6-8 shots
            if shots_in_scene >= 6 or shot_idx == 1:
                scene_set = SETS[scene_idx % len(SETS)]
                scene_idx += 1
                shots_in_scene = 0
            else:
                scene_set = SETS[(scene_idx - 1) % len(SETS)]
                
            line_text = ' '.join(cur_shot_words)
            has_sci = any(sw in line_text.lower() for sw in SCIENCE_WORDS)
            
            if has_sci and shot_idx > 3:
                size = 'schematic'
                shot_set = 'schematic'
            else:
                size = SIZES[shots_in_scene % len(SIZES)]
                shot_set = scene_set
                
            shots_def.append({
                'id': sid,
                'size': size,
                'set': shot_set,
                'key': 15,
                'note': line_text[:60]
            })
            
            first_w_idx = i - len(cur_shot_words) + 1
            if shot_idx == 1:
                edit_def.append({'shot': sid, 'at': 'f:0'})
            else:
                cue_word = words[first_w_idx]['w']
                # Use absolute frame to prevent cue collision across long scripts
                f_cut = max(0, round(words[first_w_idx]['s'] * FPS) - LEAD)
                edit_def.append({'shot': sid, 'at': f'f:{f_cut}'})
                
            shot_idx += 1
            shots_in_scene += 1
            cur_shot_words = []

    ep['shots'] = shots_def
    ep['edit'] = edit_def
    save_json(ep_dir(slug) / 'episode.json', ep)
    print(f'Generated {len(shots_def)} shots across {scene_idx} scenes.')

    # Auto-generate shots.tsx if it doesn't exist
    shots_tsx_path = ep_dir(slug) / 'shots.tsx'
    if not shots_tsx_path.exists():
        lines = [
            "import React from 'react';",
            "import { DynamicShot, ShotProps } from '../../engine';",
            ""
        ]
        for s in shots_def:
            sid = s['id']
            size = s['size']
            st = s['set']
            note = s.get('note', '').replace('"', '\\"')
            lines.append(f'export const {sid}: React.FC<ShotProps> = (p) => <DynamicShot {{...p}} id="{sid}" size="{size}" set="{st}" line="{note}" />;')
        shots_tsx_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        print(f'Created {shots_tsx_path}')

    # Auto-generate index.tsx if it doesn't exist
    index_tsx_path = ep_dir(slug) / 'index.tsx'
    if not index_tsx_path.exists():
        ep_id = ep.get('id', ''.join(part.capitalize() for part in slug.split('-')))
        index_content = f"""import React from 'react';
import {{ defineEpisode, Timeline }} from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const {slug.replace('-', '_')} = defineEpisode('{ep_id}', {{
  timeline: timeline as Timeline,
  shots: shots as any,
}});
"""
        index_tsx_path.write_text(index_content, encoding='utf-8')
        print(f'Created {index_tsx_path}')

# ---------------------------------------------------------------- Standard timeline resolution
shots = {s['id']: s for s in ep['shots']}

starts, wi_prev, prev = [], 0, 0
for k, e in enumerate(ep['edit']):
    if e['shot'] not in shots:
        raise SystemExit(f'Edit entry {k} uses unknown shot {e["shot"]}')
    at = str(e['at'])
    if at.startswith(('f:', 's:')):
        a = resolve(at, words, FPS)
    elif at.startswith('+'):
        a = prev + int(at[1:])
    else:
        base, _, off = at.partition('+') if '+' in at else (at, '', '0')
        if '#' in base:
            w, n = base.split('#')
            i = find_word(words, w, wi_prev, int(n))
        else:
            i = find_word(words, base, wi_prev)
        wi_prev = i + 1
        a = max(0, round(words[i]['s'] * FPS) - LEAD + int(off or 0))
    if k == 0:
        a = 0
    if a <= prev and k > 0:
        a = prev + 1  # Guard against identical cut frames
    starts.append(a)
    prev = a

end = resolve(ep['end'], words, FPS) if 'end' in ep else round((words[-1]['e'] + ep.get('tail', 0.9)) * FPS)
if end <= starts[-1]:
    end = starts[-1] + round(ep.get('tail', 1.0) * FPS)

segments, last_clock = [], {}
for k, e in enumerate(ep['edit']):
    a = starts[k]
    b = starts[k + 1] if k + 1 < len(starts) else end
    if e.get('reverse'):
        t0 = e.get('from', last_clock.get(e['shot'], b - a))
        t1 = e.get('to', 0)
    else:
        t0 = e.get('from', 0)
        t1 = t0 + (b - a)
    last_clock[e['shot']] = t1
    line = ' '.join(w['w'] + w.get('p', '').strip() for w in words if a <= round(w['s'] * FPS) + LEAD < b)
    seg = {'shot': e['shot'], 'a': a, 'b': b, 't0': t0, 't1': t1, 'line': line}
    if e.get('look'):
        seg['look'] = e['look']
    segments.append(seg)

ids = list(dict.fromkeys(s['shot'] for s in segments))
info = []
for sid in ids:
    segs = [s for s in segments if s['shot'] == sid]
    fwd = [s for s in segs if s['t1'] >= s['t0']]
    length = max([s['t1'] for s in fwd] + [s['t0'] for s in segs])
    d = shots[sid]
    first = segs[0]
    info.append({
        'id': sid, 'size': d.get('size', ''), 'key': d.get('key', (first['b'] - first['a']) // 2), 'len': length, 'first': first['a'],
        'line': first['line'], 'note': d.get('note', ''),
    })

fx = []
for e in ep.get('fx', []):
    item = {k: v for k, v in e.items() if k != 'at'}
    item['f'] = resolve(e['at'], words, FPS, segments, ids)
    fx.append(item)

old = load_json(ep_dir(slug) / 'timeline.json', {}) or {}
audio = {k: v for k, v in old.get('audio', {}).items() if k.endswith('Vol')}
for k in ['voice', 'sfx', 'music']:
    f = stem(slug, k)
    if f:
        audio[k] = f'{slug}/{f.name}'
title = ep.get('title', ['', ''])
tl = {'slug': slug, 'title': ' '.join(title) if isinstance(title, list) else title, 'fps': FPS, 'total': end, 'segments': segments, 'shots': info, 'fx': fx, 'audio': audio}
save_json(ep_dir(slug) / 'timeline.json', tl)

cuts = [s['a'] for s in segments[1:]]
lens = [(s['b'] - s['a']) / FPS for s in segments]
dur = end / FPS
per_min = (len(cuts) / dur * 60) if dur > 0 else 0
print(f'{len(segments)} segments, {len(ids)} shots, {dur:.1f} s ({dur/60:.2f} min, {end} frames)')
print(f'pace: {per_min:.0f} cuts/min overall; median shot {statistics.median(lens):.1f} s, longest {max(lens):.1f} s')

rows = ['| # | Shot | Size | In | Length | Clock | Look | Words |', '|---|---|---|---|---|---|---|---|']
for k, s in enumerate(segments[:40]):  # Print up to first 40 rows for preview
    d = shots[s['shot']]
    clock = f"{s['t0']:.0f}→{s['t1']:.0f}" + (' (back)' if s['t1'] < s['t0'] else '')
    rows.append(f"| {k + 1} | {s['shot']} | {d.get('size', '')} | {s['a'] / FPS:.2f} s | {(s['b'] - s['a']) / FPS:.2f} s | {clock} | {s.get('look', '')} | {s['line']} |")
if len(segments) > 40:
    rows.append(f"| ... | and {len(segments) - 40} more shots ... | | | | | | |")

md = f"# {tl['title']}: shot list\n\n{dur:.1f} s ({dur/60:.2f} min), {len(segments)} segments, {per_min:.0f} cuts/min\n\n" + '\n'.join(rows) + '\n'
(out_dir(slug) / 'shotlist.md').write_text(md, encoding='utf-8')
print(f'Wrote timeline.json and shotlist.md')
