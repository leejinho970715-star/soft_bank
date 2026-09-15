import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const assets=JSON.parse(await fs.readFile('reference/asset-map.json','utf8'));
const result=[];
for(const page of pages.filter(p=>p.status===200&&p.path.startsWith('/product/'))){
 const $=load(await fs.readFile('reference/pages/'+page.file,'utf8'));
 const region=$('#pageTop').next();
 const images=[...region.find('.contWrap .img img[src]').toArray(),...region.find('img[src]').toArray()];
 const node=images.find(e=>$(e).attr('src').startsWith('data:')||!/icon|logo|arr/i.test($(e).attr('src')));
 const src=$(node).attr('src');if(!src)continue;
 const key=page.path.slice(1).replace(/\.asp$/,'').replaceAll('/','-').toLowerCase();
 let file;
 if(src.startsWith('data:image/')){file='reference/'+key+'-screen.png';await fs.writeFile(file,Buffer.from(src.split(',')[1],'base64'));}
 else {
  const url=new URL(src,'https://www.duzon119.co.kr'+page.path).href;
  file=assets[url];
  if(!file){file='reference/'+key+'-screen.png';try{await fs.access(file);}catch{const r=await fetch(url);if(!r.ok)throw new Error('Cannot load '+url);await fs.writeFile(file,Buffer.from(await r.arrayBuffer()));}}
 }
 if(file)result.push({page:page.path,key,reference:file});
}
await fs.writeFile('reference/mockup-references.json',JSON.stringify(result,null,2));console.log(result);
