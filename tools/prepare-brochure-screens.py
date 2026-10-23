"""Export the seven Amaranth 10 PDF captures without learned text reconstruction.

Optional argument: the supplied Amaranth10 product PDF. Original embedded image pixels
are extracted losslessly. Exports use deterministic 2x Lanczos sampling only: no OCR,
GAN, learned upscaler, sharpening, text replacement, crop, or synthetic UI.
"""
import sys
import json
import hashlib
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/subpages/brochure-screens'
# The PDF shares image objects between facing pages. These page numbers identify the
# feature shown on that page; the image index is zero-based in pypdf page.images.
selection = {
    'automatic-journals': (18, 9),
    'tax-filing': (19, 3),
    'funds': (19, 2),
    'annual-leave': (20, 3),
    'payroll': (21, 5),
    'domestic-overseas-sales': (22, 1),
    'mps': (23, 3),
}
folder.mkdir(parents=True, exist_ok=True)
(folder / 'sources').mkdir(exist_ok=True)
reader = None
if len(sys.argv) > 1:
    from pypdf import PdfReader
    reader = PdfReader(sys.argv[1])
manifest = []
for name, (page, index) in selection.items():
    source = folder / 'sources' / (name + '.png')
    if reader:
        reader.pages[page - 1].images[index].image.convert('RGB').save(source, optimize=True)
    with Image.open(source) as native:
        native = native.convert('RGB')
        result = native.resize((native.width * 2, native.height * 2), Image.Resampling.LANCZOS)
        result.save(folder / (name + '.png'), optimize=True)
        manifest.append({
            'name': name, 'sourceDocument': 'Amaranth10 제품 소개서.pdf',
            'sourcePage': page, 'embeddedImageIndex': index,
            'nativeSize': list(native.size), 'outputSize': list(result.size),
            'nativePixelSha256': hashlib.sha256(native.tobytes()).hexdigest(),
            'outputSha256': hashlib.sha256((folder / (name + '.png')).read_bytes()).hexdigest(),
            'method': 'Lossless PDF image extraction; deterministic 2x Lanczos; no learned restoration or text redraw.'
        })
        print(name, native.size, '->', result.size)
(folder / 'source-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
