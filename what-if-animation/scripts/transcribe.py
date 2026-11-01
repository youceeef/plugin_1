"""Voice transcription and alignment via local faster-whisper.
Replaces external TTS by accepting any user-provided audio file (.wav, .mp3, .m4a),
transcribing it locally with exact word-level millisecond timestamps, and initializing the episode.

Usage:
    python <skill>/scripts/transcribe.py <slug> <audio_path> [<script_text_path>]

Writes:
    public/<slug>/voice.wav               (44.1 kHz mono standard)
    src/episodes/<slug>/words.json        (word timestamps for plan.py)
    src/episodes/<slug>/episode.json      (auto-generated if not already present)
"""
import json, os, pathlib, re, subprocess, sys

import numpy as np

STUDIO = pathlib.Path.cwd()
if not (STUDIO / 'src' / 'episodes').exists():
    raise SystemExit('Run this from the studio folder (the one with src/episodes and package.json).')

slug = sys.argv[1]
audio_in = pathlib.Path(sys.argv[2])
if not audio_in.exists():
    raise SystemExit(f'Input audio file not found: {audio_in}')

script_text = None
if len(sys.argv) > 3:
    sp = pathlib.Path(sys.argv[3])
    if sp.exists():
        script_text = sp.read_text(encoding='utf-8').strip()

ep_dir = STUDIO / 'src' / 'episodes' / slug
ep_dir.mkdir(parents=True, exist_ok=True)
pub_dir = STUDIO / 'public' / slug
pub_dir.mkdir(parents=True, exist_ok=True)
out_dir = STUDIO / 'out' / slug
out_dir.mkdir(parents=True, exist_ok=True)

voice_wav = pub_dir / 'voice.wav'
print(f'Converting {audio_in.name} to {voice_wav} (44.1 kHz mono)...')
subprocess.run([
    'ffmpeg', '-y', '-v', 'error', '-i', str(audio_in),
    '-ac', '1', '-ar', '44100', str(voice_wav)
], check=True)

# Measure audio duration
dur_str = subprocess.run([
    'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', str(voice_wav)
], capture_output=True, text=True, check=True).stdout.strip()
dur = float(dur_str)
print(f'Audio duration: {dur:.1f} s ({dur/60:.2f} min)')

# Transcribe with local faster-whisper
print('Loading local faster-whisper model...')
from faster_whisper import WhisperModel

# Use small.en if cached, otherwise base.en
model = WhisperModel('base.en', device='cpu', compute_type='int8')
print('Transcribing with word-level timestamps...')
initial_prompt = script_text[:800] if script_text else None
segments, info = model.transcribe(
    str(voice_wav),
    word_timestamps=True,
    initial_prompt=initial_prompt,
    vad_filter=False,
    beam_size=1,
)

words = []
sentences = []
cur_sentence = []

for seg in segments:
    for w in seg.words:
        raw = w.word.strip()
        # Separate trailing punctuation
        m = re.match(r"^([^\w']*)([\w']+)([^\w']*)$", raw)
        if m:
            prefix, core, punct = m.groups()
        else:
            core = raw
            punct = ''
        if not core:
            continue
        entry = {
            'w': core,
            's': round(float(w.start), 3),
            'e': round(float(w.end), 3),
            'p': punct
        }
        words.append(entry)
        cur_sentence.append(core + punct)
        if punct in ('.', '!', '?') or (cur_sentence and len(cur_sentence) >= 12):
            sentences.append(' '.join(cur_sentence))
            cur_sentence = []

if cur_sentence:
    sentences.append(' '.join(cur_sentence))

# Save words.json
words_path = ep_dir / 'words.json'
words_path.write_text(json.dumps(words, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Transcribed {len(words)} words into {words_path}')

# Create or update episode.json
ep_json_path = ep_dir / 'episode.json'
if not ep_json_path.exists():
    title_line1 = "WHAT IF YOU COULD"
    title_line2 = slug.upper().replace('-', ' ')
    if script_text:
        first_line = script_text.splitlines()[0].strip()
        if first_line.lower().startswith('what if'):
            title_line1 = "WHAT IF"
            title_line2 = first_line[7:].strip().upper()
    
    ep_data = {
        'id': ''.join(part.capitalize() for part in slug.split('-')),
        'slug': slug,
        'topic': sentences[0] if sentences else slug,
        'title': [title_line1, title_line2],
        'accent': title_line2.split()[-1] if title_line2.split() else 'ANYTHING',
        'auto_shots': True,
        'script': [{'beat': f'Beat {i+1}', 'text': s} for i, s in enumerate(sentences)],
        'cast': ['pipHood']
    }
    ep_json_path.write_text(json.dumps(ep_data, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Initialized {ep_json_path} with {len(sentences)} beats.')
else:
    print(f'{ep_json_path} already exists; preserving settings.')

print('Done transcribe step.')
