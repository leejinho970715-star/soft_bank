import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
async function walk(dir){const files=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const visualAssets=new Set(['assets/hero-visual-asset.png','assets/subpages/v2/support.png','assets/subpages/v2/notice.png','assets/subpages/v2/consult.png','assets/subpages/v2/company.png']);
const entries=[];
for(const file of await walk('assets/point-color'))if(file.endsWith('.png.json'))entries.push(JSON.parse(await fs.readFile(file,'utf8')));
entries.sort((a,b)=>a.original.localeCompare(b.original));
const active=entries.filter(e=>!visualAssets.has(e.original));
const map=new Map(active.map(e=>[e.original,e]));
const awaitableDimensions=new Map();
for(const original of visualAssets){const png=await fs.readFile(original);awaitableDimensions.set(original,{width:png.readUInt32BE(16),height:png.readUInt32BE(20)});}
let updated=0,images=0;
for(const file of ['index.html',...await walk('subpages'),...await walk('renewal')].filter(f=>f.endsWith('.html'))){
 const source=await fs.readFile(file,'utf8');
 let html=source.replace(/<img\b[^>]*>/g,img=>{
  const match=img.match(/src="((?:\.\.\/)*)(assets\/[^"?]+)(?:\?[^\"]*)?"/);
  const src=match?.[2];
  const original=src?.replace('assets/point-color/','assets/');
  const isVisual=/class="[^"]*\b(?:hero-asset|sb-hero-asset)\b/.test(img)||visualAssets.has(original);
  if(isVisual){
   if(src!==original){
    const $=load(img,null,false);const png=awaitableDimensions.get(original);$('img').attr({src:match[1]+original,...(png||{})});return $.html();
   }
   return img;
  }
  const entry=map.get(src);if(!entry)return img;
  const $=load(img,null,false);$('img').attr({src:match[1]+entry.file,width:entry.width,height:entry.height});images++;return $.html();
 });
 html=html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/g,picture=>picture.includes('assets/point-color/')?picture.replace(/<source\b[^>]*>/g,''):picture);
 html=html.replace(/products-figma\.css\?v=[^"\s]+/g,'products-figma.css?v=20261012-1');
 if(source!==html){await fs.writeFile(file,html);updated++;}
}
const sprite=map.get('assets/support-assets.png');
if(sprite){const file='styles.css';const css=await fs.readFile(file,'utf8');await fs.writeFile(file,css.replace("url('assets/support-assets.png')",`url('${sprite.file}')`));}
await fs.writeFile('assets/point-color/manifest.json',JSON.stringify(active,null,2)+'\n');
console.log(`Warm accents: ${active.length} body assets mapped, ${images} image references replaced in ${updated} pages. Main/sub visual assets preserved.`);
