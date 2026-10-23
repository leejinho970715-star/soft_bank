"""Product screens taken from the Amaranth 10 brochure PDF (supplied 2026-10-23).

The brochure embeds the original captures with correct, legible text, so they replace the
clarity-restored screens whose text came out garbled. Sources were pulled with
`pdfimages -png` (pages 18-22); here they are enlarged 2x with Lanczos and given a light
unsharp mask for high-DPI screens. No generative or learned upscaler is used: Real-ESRGAN was
tried and reshaped Korean glyphs (기본급, 지방소득세), so the pixels are only resampled.
"""
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/subpages/brochure-screens'
for source in sorted((folder / 'sources').glob('*.png')):
    with Image.open(source) as image:
        image = image.convert('RGB')
        output = folder / source.name
        enlarged = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
        enlarged.filter(ImageFilter.UnsharpMask(radius=1.6, percent=110, threshold=2)).save(output, optimize=True)
        print(f'{output.name}: {image.width * 2}x{image.height * 2}')
