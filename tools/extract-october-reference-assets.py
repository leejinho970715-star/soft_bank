"""Losslessly export the supplied proposal pixels; never regenerate UI text."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument('--downloads-dir', type=Path, required=True)
parser.add_argument('--amaranth-catalog', type=Path, required=True)
args = parser.parse_args()
destination = Path('assets/proposal-native-20261020')
destination.mkdir(parents=True, exist_ok=True)
logistics_name = '260703_물류고도화_01-복사.pdf'
oneai_name = '[WEHAGO] ONE AI 제안서_고객안내용_아이원소프트뱅크.pdf'
documents = {
    'logistics': (args.downloads_dir / logistics_name, PdfReader(args.downloads_dir / logistics_name)),
    'oneai': (args.downloads_dir / oneai_name, PdfReader(args.downloads_dir / oneai_name)),
    'amaranth': (args.amaranth_catalog, PdfReader(args.amaranth_catalog)),
}
exports = []

def export(name, document, page, indices):
    source, reader = documents[document]
    parts = [reader.pages[page - 1].images[index].image for index in indices]
    if len(parts) == 1:
        image = parts[0]
        if image.mode == 'CMYK':
            image = image.convert('RGB')
    else:
        # The proposal stores one screen as consecutive horizontal strips.
        # Rejoin at native scale without cropping, resampling, or text changes.
        if len({part.width for part in parts}) != 1:
            raise ValueError('Screen strips must have identical native widths')
        image = Image.new('RGBA', (parts[0].width, sum(part.height for part in parts)))
        top = 0
        for part in parts:
            image.paste(part.convert('RGBA'), (0, top))
            top += part.height
    output = destination / (name + '.png')
    image.save(output, optimize=True)
    exports.append({'file': output.as_posix(), 'width': image.width, 'height': image.height,
                    'sourceDocument': source.name, 'sourcePage': page, 'imageIndices': indices,
                    'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                    'export': 'Native pixels. Consecutive strips joined only when needed. No UI or text generation.'})

export('wehago-portal', 'logistics', 33, [2, 3, 4])
export('wehago-mobile', 'logistics', 39, [2])
export('wehago-accounting', 'logistics', 17, [2, 3])
export('wehago-input', 'logistics', 28, [2])
export('wehago-logistics', 'logistics', 28, [6])
export('amaranth-mobile', 'amaranth', 16, [17])

# Native service icons used in the submitted ONE AI proposal.
for index in [5, 6, 8, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]:
    export('service-' + str(index), 'oneai', 4, [index])

# The desktop portal was previously extracted from the official Amaranth catalog.
source = Path('assets/subpages/native-screens/portal.png')
output = destination / 'amaranth-portal.png'
output.write_bytes(source.read_bytes())
with Image.open(output) as image:
    exports.append({'file': output.as_posix(), 'width': image.width, 'height': image.height,
                    'sourceDocument': 'Official Amaranth 10 product catalog', 'sourcePage': 45,
                    'sourceAsset': source.as_posix(), 'export': 'Unchanged native portal pixels.'})
(destination / 'manifest.json').write_text(json.dumps(exports, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Exported', len(exports), 'native assets')
