"""Product screens taken from the Amaranth 10 brochure PDF (supplied 2026-10-23).

The brochure embeds the original captures with correct, legible text, so they replace the
clarity-restored screens whose text came out garbled. Sources were pulled with
`pdfimages -png` (pages 18-22) into sources/.

Enlargement: RealESRNet_x4plus (the PSNR-trained, non-GAN Real-ESRGAN model, which removes
JPEG noise without inventing detail), run on CPU through spandrel, then reduced to 2x with
Lanczos and a light unsharp mask. The GAN model RealESRGAN_x4plus was tried and rejected
because it reshaped Korean glyphs (기본급, 지방소득세). Every output was checked against
its source at 6x zoom.

Usage: python3 tools/prepare-brochure-screens.py path/to/RealESRNet_x4plus.pth
(needs torch, spandrel; weights from github.com/xinntao/Real-ESRGAN releases v0.1.1)
"""
import sys
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageFilter
from spandrel import ModelLoader

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/subpages/brochure-screens'
model = ModelLoader().load_from_file(sys.argv[1]).eval()


def enlarge(image, tile=256, pad=16):
    scale = model.scale
    data = torch.from_numpy(np.asarray(image, dtype=np.float32) / 255).permute(2, 0, 1)[None]
    _, _, height, width = data.shape
    out = torch.zeros(1, 3, height * scale, width * scale)
    for y in range(0, height, tile):
        for x in range(0, width, tile):
            y0, x0 = max(y - pad, 0), max(x - pad, 0)
            y1, x1 = min(y + tile + pad, height), min(x + tile + pad, width)
            with torch.no_grad():
                part = model(data[:, :, y0:y1, x0:x1])
            th, tw = min(tile, height - y) * scale, min(tile, width - x) * scale
            oy, ox = (y - y0) * scale, (x - x0) * scale
            out[:, :, y * scale:y * scale + th, x * scale:x * scale + tw] = part[:, :, oy:oy + th, ox:ox + tw]
    return Image.fromarray((out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255).round().astype(np.uint8))


for source in sorted((folder / 'sources').glob('*.png')):
    with Image.open(source) as image:
        image = image.convert('RGB')
        size = (image.width * 2, image.height * 2)
        result = enlarge(image).resize(size, Image.LANCZOS)
        result.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2)).save(folder / source.name, optimize=True)
        print(f'{source.name}: {size[0]}x{size[1]}')
