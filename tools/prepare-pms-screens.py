"""Deterministic enlargement of supplied PMS UI; never synthesize UI text."""
from pathlib import Path
from PIL import Image, ImageFilter
import hashlib, json

folder = Path('assets/subpages/pms-screens')
folder.mkdir(exist_ok=True)
names = [('c8837d243298c2','dashboard'),('d04779dd94eecf','contracts'),('95319d1d375e4d','contract-management'),('dcc82d16101e28','projects'),('613a28b2c14d6e','progress'),('63d7d5b75da515','approval'),('9ed3b00b26fef6','reservations'),('ae5df97fd5267d','workflow')]
manifest = []
for source, name in names:
    path = Path('assets/subpages/original') / (source+'.png')
    im = Image.open(path).convert('RGBA')
    original = im.size
    # Dashboard alone has a uniform 15px outer mat, not application content.
    crop = (15,15,im.width,im.height-15) if name == 'dashboard' else (0,0,im.width,im.height)
    im = im.crop(crop)
    size = (3840,round(im.height*3840/im.width))
    alpha = im.getchannel('A').resize(size,Image.Resampling.LANCZOS)
    im = im.convert('RGB').resize(size,Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.1,percent=75,threshold=3)).convert('RGBA')
    im.putalpha(alpha)
    im.save(folder/(name+'.png'),compress_level=3)
    im.save(folder/(name+'.webp'),quality=96,method=2)
    manifest.append(dict(source=source,name=name,width=size[0],height=size[1],sourceSize=original,crop=crop,sourceSha256=hashlib.sha256(path.read_bytes()).hexdigest(),method='Lanczos + mild unsharp; original UI content retained'))
(folder/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(manifest),'PMS images')
