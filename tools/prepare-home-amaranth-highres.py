"""Make high-density copies of the native Amaranth home screens for the 1240px mockup.

Plain Lanczos resampling with a light unsharp mask, the same treatment as
quality-screens/portal-clear-v1.png. No AI upscaling: it rewrote small Korean
labels, times and faces, so the native pixels stay the only source of detail.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/proposal-native-20261020'
# The PC screen spans 1280 of 1800 mockup units and the phone 290; at 1240px CSS on
# a 2x display that needs about 1760px and 400px. Leave headroom for zoom.
targets = {'amaranth-portal': 2, 'amaranth-mobile': 3}
manifest_path = folder / 'manifest.json'
manifest = [entry for entry in json.loads(manifest_path.read_text()) if '-highres.png' not in entry['file']]


def thumbnail(image):
    return image.convert('RGB').resize((256, 170), Image.Resampling.LANCZOS)


for name, scale in targets.items():
    source = folder / (name + '.png')
    output = folder / (name + '-highres.png')
    with Image.open(source) as native:
        native = native.convert('RGB')
        image = native.resize((native.width * scale, native.height * scale), Image.Resampling.LANCZOS)
        image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
        difference = sum(ImageStat.Stat(ImageChops.difference(thumbnail(image), thumbnail(native))).mean) / 3
        assert difference < 2, f'Unexpected visual change: {output.name}: {difference}'
        image.save(output, optimize=True)
    manifest.append({'file': output.relative_to(ROOT).as_posix(), 'width': image.width, 'height': image.height,
                     'sourceAsset': source.relative_to(ROOT).as_posix(),
                     'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                     'export': f'{scale}x Lanczos resample with light unsharp mask. No AI upscaling, UI or text generation.'})
    print(f'{output.name}: {image.width}x{image.height}, thumbnail difference {difference:.2f}')
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
