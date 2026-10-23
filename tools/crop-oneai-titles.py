"""Cut the haloed headline strip off the ONE AI proposal screens.

The headlines are re-set as live text in the page (tools/apply-october-revisions.mjs),
so only the product screen below them stays an image. Crop rows are the transparent
gaps found under each headline.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/subpages/quality-screens'
crops = {'ui-091': 340, 'ui-092': 334, 'ui-093': 370}
for name, top in crops.items():
    source = folder / f'{name}-proofread-restored-v3.png'
    output = folder / f'{name}-proofread-restored-v3-body.png'
    with Image.open(source) as image:
        body = image.crop((0, top, image.width, image.height))
        body.save(output, optimize=True)
    print(f'{output.name}: {body.width}x{body.height}')
