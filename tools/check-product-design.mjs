import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const report=[];
for(const p of inventory.filter(p=>p.status===200&&p.path.startsWith('/product/'))){
 const filename='subpages'+p.path.replace(/\.asp$/,'.html');
 const current=load(await fs.readFile(filename,'utf8'));
 const previous=load(execFileSync('git',['show','HEAD:'+filename],{encoding:'utf8',maxBuffer:30*1024*1024}));
 const media=q=>q('main video,main source,main iframe,.js-video[data-video]').map((i,e)=>q(e).attr('src')||q(e).attr('data-video')).get().sort();
 const missing=[];
 for(const src of current('img[src]').map((i,e)=>current(e).attr('src')).get()){
  if(/^(https?:|data:)/.test(src))continue;
  try{await fs.access(path.resolve(path.dirname(filename),src))}catch{missing.push(src)}
 }
 report.push({page:p.path,suppliedMockups:current('.sb-design-mockup').length,missing,videoUnchanged:JSON.stringify(media(current))===JSON.stringify(media(previous)),figmaStyles:current('link[href*="products-figma.css"]').length===1});
}
await fs.writeFile('renewal/product-design-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.some(r=>r.missing.length||!r.videoUnchanged||!r.figmaStyles))process.exitCode=1;
