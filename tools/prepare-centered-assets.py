"""Resample existing transparent product cutouts without synthesizing UI content.

Originals stay in tmp/upscale/centered-originals and the pre-change ZIP.
Run with the bundled Pillow runtime before the site build.
"""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parent.parent
manifest_path = root / 'assets/subpages/product-upscale-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
known = {entry['file'] for entry in manifest}
files = sorted((root / 'assets/subpages/figma').glob('*.png'))
for path in files:
    relative = path.relative_to(root).as_posix()
    if relative in known:
        continue
    backup = root / 'tmp/upscale/centered-originals' / path.name
    backup.parent.mkdir(parents=True, exist_ok=True)
    if not backup.exists():
        shutil.copyfile(path, backup)
    original = Image.open(backup).convert('RGBA')
    size = (3840, round(original.height * 3840 / original.width))
    alpha = original.getchannel('A').resize(size, Image.Resampling.LANCZOS)
    result = original.resize(size, Image.Resampling.LANCZOS)
    rgb = result.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.1, percent=60, threshold=3))
    result = rgb.convert('RGBA')
    result.putalpha(alpha)
    pending = path.with_suffix('.pending.png')
    result.save(pending, compress_level=3)
    pending.replace(path)
    result.save(path.with_suffix('.webp'), quality=94, method=2)
    manifest.append({'file': relative, 'width': size[0], 'height': size[1],
                     'originalSha256': hashlib.sha256(backup.read_bytes()).hexdigest(),
                     'method': 'Lanczos resampling + mild unsharp mask, 3840px, preserved alpha; no synthesized UI detail'})
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(path.name, flush=True)
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print('Prepared', len(files), 'product cutouts')
