import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
await fs.mkdir('assets/subpages/original',{recursive:true});
const entries=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const urls=new Set();
for(const entry of entries.filter(e=>e.status===200)){
 const $=load(await fs.readFile('reference/pages/'+entry.file,'utf8'));
 $('#pageTop').next().find('img[src]').each((i,e)=>{const src=$(e).attr('src');if(!src.startsWith('data:')){const u=new URL(src,'https://www.duzon119.co.kr'+entry.path);if(u.hostname==='www.duzon119.co.kr')urls.add(u.href);}});
}
const manifest={};
try{Object.assign(manifest,JSON.parse(await fs.readFile('reference/asset-map.json','utf8')))}catch{}
for(const url of urls){
 if(manifest[url])continue;
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok){console.log('Unavailable',response.status,url);continue;}
  const bytes=Buffer.from(await response.arrayBuffer());
  const file=crypto.createHash('sha256').update(url).digest('hex').slice(0,14)+path.extname(new URL(url).pathname);
  await fs.writeFile('assets/subpages/original/'+file,bytes);
  manifest[url]='assets/subpages/original/'+file;
 }catch(e){console.log('Unavailable',url,e.message);}
}
await fs.writeFile('reference/asset-map.json',JSON.stringify(manifest,null,2));
const faq=await (await fetch('https://www.duzon119.co.kr/customer/faq_data.asp')).json();
await fs.writeFile('reference/faq-data.json',JSON.stringify(faq.filter(x=>x.isVisible!==false),null,2));
console.log('Assets saved:',Object.keys(manifest).length,'FAQ:',faq.filter(x=>x.isVisible!==false).length);
