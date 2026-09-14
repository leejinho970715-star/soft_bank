import fs from 'node:fs/promises';
import {load} from 'cheerio';
const report=JSON.parse(await fs.readFile('renewal/content-audit.json','utf8'));
const routes=new Map(report.map(p=>[p.path,'subpages/'+p.preview]));
routes.set('/community/freeboard.asp','subpages/community/conmment.html');
const source=await fs.readFile('index.html','utf8');
let count=0;
const html=source.replace(/href="https:\/\/www\.duzon119\.co\.kr([^"\s]*)"/g,(match,route)=>{
 const destination=route==='/'?'index.html':routes.get(route);
 if(!destination)throw new Error('Missing route: '+route);
 count++;return `href="${destination}"`;
});
// Preserve the existing markup and formatting while adding safe new-tab behavior.
const linked=html.replace(/<a\b[^>]*>/g,tag=>{
 let result=tag.replace(/\s+target="[^"]*"/g,'').replace(/\s+rel="[^"]*"/g,'');
 return result.slice(0,-1)+' target="_blank" rel="noopener noreferrer">';
});
const $=load(linked);
for(const a of $('a[href]').toArray()){
 const href=$(a).attr('href');
 if(href.startsWith('subpages/'))await fs.access(href);
}
await fs.writeFile('index.html',linked);
console.log(`Connected ${count} main-page links; all local destinations exist.`);
