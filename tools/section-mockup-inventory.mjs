import fs from 'node:fs/promises';
import {load} from 'cheerio';
import crypto from 'node:crypto';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const map=JSON.parse(await fs.readFile('reference/asset-map.json','utf8'));
const records=[];
for(const page of inventory.filter(p=>p.status===200&&p.path.startsWith('/product/'))){
 const original=load(await fs.readFile('reference/pages/'+page.file,'utf8'));
 const $=load(original('#pageTop').next().toString(),null,false);
 $('script,style,noscript,.youtb_btn img').remove();
 $('img').each((i,e)=>{
  const img=$(e),src=img.attr('src')||'';
  if(/icon|logo|arr/i.test(src)||!src||src.startsWith('data:'))return;
  const url=new URL(src,'https://www.duzon119.co.kr'+page.path).href;
  const reference=map[url];
  const context=img.closest('.sb-feature,.contwrap,.contWrap>div,section').text().replace(/\s+/g,' ').trim().slice(0,220);
  records.push({page:page.path,url,reference,key:crypto.createHash('sha256').update(url).digest('hex').slice(0,12),label:img.attr('alt')||context});
 });
}
await fs.writeFile('reference/section-mockups.json',JSON.stringify(records,null,2));
console.log(JSON.stringify({placements:records.length,unique:new Set(records.map(r=>r.url)).size,local:new Set(records.filter(r=>r.reference).map(r=>r.url)).size}));
