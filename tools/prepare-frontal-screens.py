"""Enlarge authentic product references without generating replacement UI text."""
from pathlib import Path
from PIL import Image,ImageFilter
import json,hashlib
root=Path.cwd()
output=root/'assets/subpages/frontal-screens'
output.mkdir(exist_ok=True)
records=json.loads((output/'manifest.json').read_text()) if (output/'manifest.json').exists() else {}
inputs=Path('tmp/frontal-inputs.json')
for item in json.loads(inputs.read_text(encoding='utf-8')) if inputs.exists() else records.copy():
    source=Path(item).resolve()
    data=source.read_bytes()
    name=hashlib.sha256(data).hexdigest()[:16]
    key=source.relative_to(root).as_posix()
    if key in records and records[key]['sourceSha256']==hashlib.sha256(data).hexdigest():
        continue
    im=Image.open(source).convert('RGBA')
    original=im.size
    size=(3840,round(im.height*3840/im.width))
    alpha=im.getchannel('A').resize(size,Image.Resampling.LANCZOS)
    im=im.convert('RGB').resize(size,Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1,percent=60,threshold=3)).convert('RGBA')
    im.putalpha(alpha)
    dest=output/(name+'.png')
    im.save(dest,compress_level=3)
    im.save(dest.with_suffix('.webp'),quality=96,method=2)
    records[source.relative_to(root).as_posix()]={'file':dest.relative_to(root).as_posix(),'width':size[0],'height':size[1],'originalSize':original,'sourceSha256':hashlib.sha256(data).hexdigest()}
    (output/'manifest.json').write_text(json.dumps(records,indent=2)+'\n')
    print(source.name,flush=True)
