import fs from 'node:fs/promises';
import {load} from 'cheerio';
const origin='https://www.duzon119.co.kr';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const targets=new Map();
for(const p of inventory.filter(p=>p.status===200&&!/inquiry/.test(p.path))){
 const $=load(await fs.readFile('reference/pages/'+p.file,'utf8'));
 $('#pageTop').next().find('a[href]').each((i,e)=>{try{const u=new URL($(e).attr('href'),origin+p.path);if(u.origin===origin&&u.searchParams.get('mode')==='view'&&/^\d+$/.test(u.searchParams.get('idx'))){const key=u.pathname.slice(1).replaceAll('/','__').replace('.asp','')+'__'+u.searchParams.get('idx');targets.set(key,{key,path:u.pathname,idx:u.searchParams.get('idx'),url:u.href});}}catch{}});
}
await fs.mkdir('reference/board-details',{recursive:true});const report=[];
for(let n=0;n<targets.size;n+=5){await Promise.all([...targets.values()].slice(n,n+5).map(async p=>{try{const r=await fetch(p.url,{signal:AbortSignal.timeout(25000)});const html=await r.text();const $=load(html);if(!r.ok||!$('.board_view').length)throw Error('No public article');await fs.writeFile('reference/board-details/'+p.key+'.html',html);report.push(p);}catch(e){console.log(p.key,e.message)}}));}
await fs.writeFile('reference/board-details/index.json',JSON.stringify(report,null,2));console.log('Public articles saved:',report.length,'of',targets.size);
