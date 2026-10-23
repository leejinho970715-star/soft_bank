"""Enlarge the original NAHAGO capture (PC + mobile) for the WEHAGO Smart A10 HR row.

The AI-regenerated ui-080 screen changed real labels, and no larger source exists
(duzon119 serves only the 590px PNG; the WEHAGO proposals show the mobile app only).
Lanczos 3x with a light unsharp mask keeps every original label.
"""
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'assets/subpages/original/4624fdc5bf6c51.png'
output = ROOT / 'assets/subpages/flat-screens/nahago-original-3x.png'
with Image.open(source) as image:
    image = image.convert('RGBA')
    big = image.resize((image.width * 3, image.height * 3), Image.Resampling.LANCZOS)
    rgb = big.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    rgb.putalpha(big.getchannel('A'))
    rgb.save(output, optimize=True)
print(f'{output.name}: {rgb.width}x{rgb.height}')
