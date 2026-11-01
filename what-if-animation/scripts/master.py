"""Step 8: the master. Renders the episode, then brings the mix to -14 LUFS with true peaks under -1 dBTP (two-pass
loudnorm, video copied untouched), measures the result and writes the report.
Supports segmented chunk rendering and lossless concatenation for long-form episodes (7-10 minutes).

Usage:
    python <skill>/scripts/master.py <slug> [--skip-render] [--concurrency 6] [--chunk-frames 1800]
"""
import json, pathlib, re, subprocess, sys, time

from wi import STUDIO, ep_dir, load_episode, load_json, loudness, out_dir, save_json

slug = sys.argv[1]
args = sys.argv[2:]
conc = args[args.index('--concurrency') + 1] if '--concurrency' in args else '4'
chunk_size = int(args[args.index('--chunk-frames') + 1]) if '--chunk-frames' in args else 1200

ep = load_episode(slug)
od = out_dir(slug)
raw = od / f'{slug}-raw.mp4'
final = od / f'{slug}-final.mp4'
npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'

tl = load_json(ep_dir(slug) / 'timeline.json')
total_frames = tl['total']
fps = tl.get('fps', 30)

if '--skip-render' not in args:
    t0 = time.time()
    
    # Decide whether to render in chunks (recommended for > 1500 frames / 50 s)
    use_chunks = total_frames > 1500
    if use_chunks:
        print(f'Long-form episode detected ({total_frames} frames, {total_frames/fps:.1f} s). Using segmented chunk renderer (chunk size: {chunk_size} frames, concurrency: {conc})...', flush=True)
        chunks_dir = od / 'chunks'
        chunks_dir.mkdir(parents=True, exist_ok=True)
        chunk_files = []
        
        frame_start = 0
        chunk_idx = 1
        
        while frame_start < total_frames:
            frame_end = min(total_frames - 1, frame_start + chunk_size - 1)
            c_file = chunks_dir / f'chunk_{chunk_idx:03d}.mp4'
            chunk_files.append(c_file)
            
            # Check if chunk already exists and has valid size
            already_done = c_file.exists() and c_file.stat().st_size > 50000
            if already_done:
                print(f'Chunk {chunk_idx:03d} (frames {frame_start}-{frame_end}) already exists, skipping.', flush=True)
            else:
                print(f'Rendering Chunk {chunk_idx:03d} (frames {frame_start}-{frame_end})...', flush=True)
                cmd = [
                    npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(c_file),
                    f'--frames={frame_start}-{frame_end}',
                    '--concurrency', conc,
                    '--gl', 'angle',
                    '--hardware-acceleration', 'if-possible',
                    '--for-seamless-aac-concatenation'
                ]
                subprocess.run(cmd, cwd=STUDIO, check=True)
                
            frame_start = frame_end + 1
            chunk_idx += 1
            
        print('All chunks rendered! Concatenating losslessly via FFmpeg...', flush=True)
        concat_txt = od / 'concat_chunks.txt'
        concat_txt.write_text('\n'.join(f"file '{c.as_posix()}'" for c in chunk_files) + '\n', encoding='utf-8')
        
        subprocess.run([
            'ffmpeg', '-y', '-v', 'error',
            '-f', 'concat', '-safe', '0',
            '-i', str(concat_txt),
            '-c', 'copy',
            str(raw)
        ], check=True)
        print(f'Concatenation complete: {raw}', flush=True)
    else:
        cmd = [
            npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(raw),
            '--concurrency', conc,
            '--gl', 'angle',
            '--hardware-acceleration', 'if-possible'
        ]
        print(' '.join(cmd), flush=True)
        subprocess.run(cmd, cwd=STUDIO, check=True)
        
    print(f'Rendered video in {time.time() - t0:.0f} s', flush=True)

# Audio mastering to -14 LUFS with 2-pass EBU R128 loudnorm
print('Mastering audio mix to EBU R128 standard (-14.0 LUFS)...')
I, TP, LRA = -14.0, -1.5, 11
first = subprocess.run([
    'ffmpeg', '-hide_banner', '-nostats', '-i', str(raw),
    '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json',
    '-f', 'null', '-'
], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr

m = json.loads(first[first.rfind('{'):first.rfind('}') + 1])
filt = (
    f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
    f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
)
subprocess.run([
    'ffmpeg', '-y', '-v', 'error', '-i', str(raw),
    '-c:v', 'copy', '-af', filt, '-ar', '48000',
    '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart',
    str(final)
], check=True)

lufs, peak = loudness(final)
tp = subprocess.run([
    'ffmpeg', '-hide_banner', '-nostats', '-i', str(final),
    '-af', f'loudnorm=I={I}:TP={TP}:print_format=json',
    '-f', 'null', '-'
], capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr

true_peak = float(json.loads(tp[tp.rfind('{'):tp.rfind('}') + 1])['input_tp'])
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(final)], capture_output=True, text=True).stdout.strip())

costs = load_json(od / 'costs.json', [])
report = {
    'episode': ep['id'],
    'file': str(final),
    'seconds': round(dur, 2),
    'minutes': round(dur / 60, 2),
    'lufs': lufs,
    'true_peak_dbtp': true_peak,
    'segments': len(tl['segments']),
    'cuts_per_min': round((len(tl['segments']) - 1) / (tl['total'] / tl['fps']) * 60, 1),
    'elevenlabs_credits': 0
}
save_json(od / 'report.json', report)
print(json.dumps(report, indent=1))
ok = abs(lufs + 14) <= 0.5 and true_peak <= -1.0
print('Loudness OK (-14 LUFS)' if ok else '! loudness off target: check the report')

# Automatic deliverable suite: generate board stills & storyboard contact sheet
print('Ensuring complete deliverable suite (stills & storyboard contact sheet)...', flush=True)
try:
    scripts_dir = pathlib.Path(__file__).parent
    subprocess.run(['node', str(scripts_dir / 'stills.mjs'), slug], cwd=STUDIO, check=True)
    subprocess.run([sys.executable, str(scripts_dir / 'board.py'), slug], cwd=STUDIO, check=True)
    print(f'All deliverables ready in {od}: final.mp4, raw.mp4, report.json, shotlist.md, storyboard.jpg, board/')
except Exception as ex:
    print(f'Notice: Storyboard still generation note: {ex}', flush=True)
