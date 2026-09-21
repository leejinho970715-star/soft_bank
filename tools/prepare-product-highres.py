"""Validate the upscale outputs and create lightweight WebP delivery copies."""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
manifest_path = 'tmp/upscale/progress.json' if '--progress' in sys.argv else 'assets/subpages/product-upscale-manifest.json'
entries = json.loads((ROOT / manifest_path).read_text())
report_path = ROOT / 'tmp/upscale/validation.json'
previous = {entry['file']:entry for entry in json.loads(report_path.read_text())} if report_path.exists() else {}
report = []
for entry in entries:
    path = ROOT / entry['file']
    webp = path.with_suffix('.webp')
    if webp.exists() and webp.stat().st_mtime >= path.stat().st_mtime and entry['file'] in previous:
        report.append(previous[entry['file']])
        continue
    original = ROOT / 'tmp/upscale/originals' / path.parent.name / path.name
    with Image.open(path) as image, Image.open(original) as before:
        assert image.mode == 'RGBA' and image.width == 3840, str(path)
        expected_alpha = before.getchannel('A').resize(image.size, Image.Resampling.LANCZOS)
        assert ImageChops.difference(expected_alpha, image.getchannel('A')).getbbox() is None, str(path)
        def thumbnail(im):
            im = im.convert('RGBA').resize((256, 170), Image.Resampling.LANCZOS)
            background = Image.new('RGBA', im.size, 'white')
            return Image.alpha_composite(background, im).convert('RGB')
        difference = sum(ImageStat.Stat(ImageChops.difference(thumbnail(image), thumbnail(before))).mean) / 3
        assert difference < 6, f'Unexpected visual change: {path}: {difference}'
        image.save(webp, quality=94, method=4)
        report.append({'file':entry['file'],'difference':round(difference,2),'pngBytes':path.stat().st_size,'webpBytes':webp.stat().st_size})
        print('Validated: ' + path.name, flush=True)
report_path.write_text(json.dumps(report, indent=2))
