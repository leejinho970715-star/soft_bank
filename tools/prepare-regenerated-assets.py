"""Package approved built-in image-generation outputs; preserve their pixels and alpha."""
from pathlib import Path
from PIL import Image
import json
folder=Path('assets/subpages/regenerated')
manifest={}
for record in Path('output').glob('regen-*.json'):
    item=json.loads(record.read_text(encoding='utf-8-sig'))
    file=folder/('ui-'+str(item['index']).zfill(3)+'.png')
    if not file.exists(): continue
    im=Image.open(file)
    webp=file.with_suffix('.webp')
    if not webp.exists() or webp.stat().st_mtime<file.stat().st_mtime:
        im.save(webp,quality=97,method=3)
    asset={'file':file.as_posix(),'width':im.width,'height':im.height,'kind':item['kind'],'generated':True,'source':item['source'],'prompt':item.get('prompt','Built-in image generation: restore exact OmniEsol UI with crisp Korean typography.')}
    for alias in item['aliases']:manifest[alias]=asset
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Packaged',len(manifest),'source mappings')
