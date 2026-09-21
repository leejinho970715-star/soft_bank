"""Locally upscale the approved September 21 product mockups, retaining alpha.

Requires Pillow and the official Real-ESRGAN ncnn Vulkan executable in
tmp/upscale/engine. Originals and resumable results stay in tmp/upscale.
"""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import time
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'tmp/upscale'
FOLDERS = ['omniesol-custom', 'amaranth-custom', 'pms-custom',
           'wehago-custom', 'wehago-extra', 'wehago-linked']
manifest = []

def valid_image(path):
    if not path.exists():
        return False
    try:
        with Image.open(path) as image:
            image.load()
            return ImageStat.Stat(image.convert('L')).stddev[0] > 8
    except OSError:
        return False

for folder in FOLDERS:
    for target in sorted((ROOT / 'assets/subpages' / folder).glob('*.png')):
        backup = WORK / 'originals' / folder / target.name
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            with Image.open(target) as candidate:
                if candidate.width >= 3840:
                    raise RuntimeError('Restore the pre-upscale original before rerunning: ' + str(target))
            shutil.copy2(target, backup)
        digest = hashlib.sha256(backup.read_bytes()).hexdigest()
        final = WORK / (digest + '-4k.png')
        method_file = WORK / (digest + '-method.txt')
        model = method_file.read_text() if method_file.exists() else 'realesrgan-x4plus'
        if not valid_image(final):
            # The graphics model preserves thin UI lines without the driver's
            # large-kernel failures encountered with x4plus on the discrete GPU.
            model = 'realesr-animevideov3'
            raw = WORK / (digest + '-graphics-raw.png')
            if target.name == 'banking.png' and folder == 'wehago-linked' and (WORK / 'sample.png').exists():
                shutil.copy2(WORK / 'sample.png', raw)
                model = 'realesrgan-x4plus'
            if not valid_image(raw):
                print('Upscaling ' + str(target.relative_to(ROOT)), flush=True)
                with (WORK / 'engine.log').open('w') as log:
                    subprocess.run([str(WORK / 'engine/realesrgan-ncnn-vulkan.exe'),
                        '-i', str(backup), '-o', str(raw), '-n', model,
                        '-s', '4', '-g', '1', '-t', '64', '-m', str(WORK / 'engine/models'),
                        '-j', '1:1:1'], stdout=log, stderr=log, check=True)
                if 'failed' in (WORK / 'engine.log').read_text(errors='replace') or not valid_image(raw):
                    raise RuntimeError('GPU conversion failed; keeping original: ' + str(target))
            with Image.open(backup) as original, Image.open(raw) as enhanced:
                size = (3840, round(original.height * 3840 / original.width))
                result = enhanced.convert('RGB').resize(size, Image.Resampling.LANCZOS)
                # Keep the approved silhouette and soft shadows rather than hallucinating alpha.
                result.putalpha(original.convert('RGBA').getchannel('A').resize(size, Image.Resampling.LANCZOS))
                result.save(final, optimize=True)
            method_file.write_text(model)
        for attempt in range(20):
            try:
                shutil.copy2(final, target)
                break
            except OSError:
                if attempt == 19:
                    raise
                time.sleep(1)
        with Image.open(target) as output:
            manifest.append({'file': str(target.relative_to(ROOT)).replace('\\', '/'),
                             'width': output.width, 'height': output.height,
                             'originalSha256': digest, 'method': model + ', 3840px, original alpha'})
        (WORK / 'progress.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
        print('Completed ' + str(len(manifest)) + ': ' + target.name, flush=True)
(ROOT / 'assets/subpages/product-upscale-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
