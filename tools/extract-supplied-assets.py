"""Extract individual supplied mockups without redrawing their UI pixels."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
source = Path('C:/Users/tlscj/Downloads/제품.서비스 페이지')
out = Path('assets/subpages/figma')
out.mkdir(parents=True, exist_ok=True)
manifest = {}
for name, key in [('Amaranth 10','amaranth'),('OmniEsol','omniesol'),('WEHAGO','wehago')]:
    im = Image.open(source / (name+'.png')).convert('RGBA')
    # Each rectangle is an original separate mockup in the user-supplied sheet.
    if key=='amaranth':
        scale=im.width/2048
        rows=[(14,179,[8,235,460,682,916,1133,1350,1560,1778,2014]),(181,349,[8,234,460,684,918,1135,1350,1570,1790]),(363,540,[8,234,460,685,914,1130]),(540,747,[8,245,475,695,915,1135,1350,1570,1810,2040]),(752,925,[8,240,462,690,914,1140,1360,1575])]
    elif key=='omniesol':
        scale=im.width/1742
        rows=[(75,374,[70,444,852,1225,1640]),(377,697,[82,450,875,1230]),(730,1036,[75,460,885,1295,1695]),(1045,1360,[75,440])]
    else:
        scale=im.width/2048
        rows=[(25,141,[17,176,332,494,663,830,1001,1171,1330,1509,1680]),(142,286,[13,171,332,493,660,826,995,1167,1338,1510,1677,1865,2040])]
    boxes=[[edges[i],y0,edges[i+1],y1] for y0,y1,edges in rows for i in range(len(edges)-1)]
    entries=[]
    for n,b in enumerate(boxes,1):
        box=tuple(round(v*scale) for v in b)
        crop=im.crop(box)
        a=np.array(crop).astype(np.float32)/255
        # The supplied sheet has a uniform partially transparent gray canvas.
        # Undo that canvas compositing, retaining the actual mockup and soft edges.
        bg=95/255
        alpha=np.clip((a[:,:,3]-bg)/(1-bg),0,1)
        rgb=np.divide(a[:,:,:3]*a[:,:,3,None]-(86/255)*bg*(1-alpha[:,:,None]),alpha[:,:,None],out=np.zeros_like(a[:,:,:3]),where=alpha[:,:,None]>0.001)
        result=np.dstack((np.clip(rgb,0,1),alpha))
        # Remove the flat #444 Figma canvas only where connected to crop edges.
        original=np.asarray(crop)
        gray=np.max(original[:,:,:3],axis=2)-np.min(original[:,:,:3],axis=2)
        canvas_mask=(gray<5)&(original[:,:,0]>=63)&(original[:,:,0]<=90)
        seed=np.zeros(canvas_mask.shape,dtype=bool)
        seed[0,:]=canvas_mask[0,:];seed[-1,:]=canvas_mask[-1,:]
        seed[:,0]=canvas_mask[:,0];seed[:,-1]=canvas_mask[:,-1]
        outside=ndimage.binary_propagation(seed,mask=canvas_mask)
        result[outside,3]=0
        asset=Image.fromarray((result*255).astype('uint8'),'RGBA')
        asset.thumbnail((1600,1200),Image.Resampling.LANCZOS)
        filename=f'{key}-{n:02d}.png'
        asset.save(out/filename,optimize=True)
        entries.append({'file':str(out/filename).replace('\\','/'),'sourceBox':box,'width':asset.width,'height':asset.height})
    manifest[key]=entries
    canvas=Image.new('RGB',(1000,((len(entries)+3)//4)*190),'#eef3fa')
    draw=ImageDraw.Draw(canvas)
    for n,e in enumerate(entries):
        a=Image.open(e['file']); a.thumbnail((240,155))
        x=(n%4)*250;y=(n//4)*190
        canvas.paste(a,(x+(250-a.width)//2,y),a)
        draw.text((x+10,y+160),Path(e['file']).name,fill='black')
    canvas.save(out/(key+'-contact.jpg'))
    print(key,len(entries))
(out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
