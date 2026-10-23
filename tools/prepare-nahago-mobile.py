"""NAHAGO mobile screens for the WEHAGO Smart A10 HR row.

Phones are cropped from the WEHAGO service leaflet (NAHAGO pages, the A2 leaflet holds
them at the highest resolution of the supplied PDFs) into nahago-sources/. They are laid
out side by side on a transparent canvas with rounded corners and a soft shadow, then
enlarged 2x with Lanczos without sharpening. No generative or learned upscaler is
used, so the screen text is never redrawn.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
folder = ROOT / 'assets/subpages/flat-screens'
order = ['home', 'payslip-list', 'work-week', 'yearend-result', 'payslip-detail']
gap, margin = 26, 18

phones = [Image.open(folder / 'nahago-sources' / f'{name}.png').convert('RGBA') for name in order]
height = max(p.height for p in phones)
width = sum(p.width for p in phones) + gap * (len(phones) - 1)
canvas = Image.new('RGBA', (width + margin * 2, height + margin * 2), (0, 0, 0, 0))
shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
x = margin
for phone in phones:
    radius = round(phone.width * 0.13)
    mask = Image.new('L', phone.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, phone.width - 1, phone.height - 1), radius, fill=255)
    y = margin + height - phone.height
    ImageDraw.Draw(shadow).rounded_rectangle((x, y + 6, x + phone.width, y + phone.height + 6), radius, fill=(17, 32, 74, 46))
    phone.putalpha(mask)
    canvas.alpha_composite(phone, (x, y))
    x += phone.width + gap
shadow = shadow.filter(ImageFilter.GaussianBlur(8))
shadow.alpha_composite(canvas)
out = shadow.resize((shadow.width * 2, shadow.height * 2), Image.LANCZOS)
out.save(folder / 'nahago-mobile.png', optimize=True)
print(f'nahago-mobile.png: {out.width}x{out.height}')
