"""Retain authentic UI pixels for the additionally flagged product screens.

Sources: supplied WEHAGO leaflet where a matching capture exists, otherwise retained
original official/user-provided captures. No generated UI, OCR, or learned restoration.
"""
from pathlib import Path
from PIL import Image
from pypdf import PdfReader
import json, hashlib
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'assets/subpages/verified-screens-20261023';out.mkdir(parents=True,exist_ok=True)
entries=[]
def export(key,source,old,scope,crop=None,document=None,page=None):
    im=Image.open(ROOT/source).convert('RGBA')
    if crop: im=im.crop(crop)
    native=im.size
    pixelhash=hashlib.sha256(im.tobytes()).hexdigest()
    if im.width<1200: im=im.resize((im.width*2,im.height*2),Image.Resampling.LANCZOS)
    dest=out/(key+'.png');im.save(dest,optimize=True)
    entries.append({'key':key,'file':dest.relative_to(ROOT).as_posix(),'scope':scope,'oldPaths':old,
      'sourceFile':source,'sourceDocument':document,'sourcePage':page,'crop':crop,
      'nativeSize':list(native),'outputSize':list(im.size),'nativePixelSha256':pixelhash,
      'method':'Original capture pixels; deterministic sampling only where enlarged; no OCR, generated text, sharpening or learned restoration.'})

export('smart-a10-modules','assets/subpages/official-corrected/sources/smart-a10-modules.png',
 ['quality-screens/smart-a10-modules-complete-v4.png'],'wehago/smart_A10.html')
export('smart-a10-income-tax','assets/subpages/official-corrected/sources/income-tax.png',
 ['flat-screens/income-tax-full.png'],'wehago/smart_A10.html',crop=(486,114,1656,844))
leaflet=Path('C:/Users/tlscj/Downloads/아이원소프트뱅크/WEHAGO 제품소개서.pdf')
r=PdfReader(leaflet)
source=ROOT/'output/nahago-quality-20261023/fax-leaflet51.png';source.parent.mkdir(parents=True,exist_ok=True);r.pages[50].images[0].image.save(source)
export('wehago-fax',source.relative_to(ROOT).as_posix(),['flat-screens/ui-061-full.png'],'wehago/cooperation.html',
 crop=(82,1008,1108,1466),document=leaflet.name,page=51)
export('one-news','assets/subpages/oneai-hq/reference-4.png',
 ['quality-screens/ui-092-proofread-restored-v3-body.png','quality-screens/ui-092-proofread-restored-v3.png'],'oneai.html',crop=(0,110,967,653))
export('one-studio','assets/subpages/oneai-hq/reference-5.png',
 ['quality-screens/ui-093-proofread-restored-v3-body.png','quality-screens/ui-093-proofread-restored-v3.png'],'oneai.html',crop=(0,110,966,651))
export('pms-contracts','assets/subpages/original/d04779dd94eecf.png',
 ['regenerated/ui-095.png'],'pms.html')

# Keep the entire OmniEsol product-screen set consistent with the original captures,
# including the three flagged examples; illustrations and hero assets are not included.
m=json.loads((ROOT/'assets/subpages/regenerated/manifest.json').read_text(encoding='utf-8'))
for number in range(14):
    token=f'ui-{number:03d}'
    source=next(source for source,value in m.items() if Path(value.get('file','')).name==token+'.png')
    export('omni-'+token,source,[f'regenerated/{token}.png',f'quality-screens/{token}-restored-v3.png'],'omniesol.html')
(out/'manifest.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for entry in entries:print(entry['key'],entry['nativeSize'],'->',entry['outputSize'])
