import fs from 'node:fs/promises';
import {load} from 'cheerio';
const base='https://www.duzon119.co.kr';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const seen=new Set(inventory.map(x=>x.path));
// Follow menu/tab destinations only; never enumerate customer records or submit forms.
for(let i=0;i<inventory.length;i++){
 const entry=inventory[i];if(entry.status!==200)continue;
 const $=load(await fs.readFile('reference/pages/'+entry.file,'utf8'));
 const region=$('#pageTop').nextAll().not('#footer');
 for(const a of region.find('a[href]').toArray()){
  const href=$(a).attr('href');if(!href||href.startsWith('javascript:'))continue;
  const u=new URL(href,base+entry.path);
  if(u.origin!==base||u.search||!u.pathname.endsWith('.asp')||/^\/(board|mypage)\//.test(u.pathname)||seen.has(u.pathname))continue;
  seen.add(u.pathname);
  try{const r=await fetch(u,{signal:AbortSignal.timeout(20000)});const t=await r.text();const file=u.pathname.slice(1).replaceAll('/','__')+'.html';await fs.writeFile('reference/pages/'+file,t);inventory.push({path:u.pathname,file,status:r.status,url:r.url,bytes:t.length});console.log(r.status,u.pathname);}catch(e){console.log('Unavailable',u.pathname,e.message);}
 }
}
await fs.writeFile('reference/inventory.json',JSON.stringify(inventory,null,2));
const css=await (await fetch(base+'/common/css/contents.css')).text();
await fs.writeFile('reference/contents.css',css);
console.log('TOTAL',inventory.length);
