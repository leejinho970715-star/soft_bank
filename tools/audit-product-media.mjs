import fs from 'node:fs/promises';
import {load} from 'cheerio';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const results=[];
for(const page of inventory.filter(p=>p.status===200&&p.path.startsWith('/product/'))){
 const source=load(await fs.readFile('reference/pages/'+page.file,'utf8'));
 const destination=page.path.slice(1).replace(/\.asp$/,'.html');
 const output=load(await fs.readFile('subpages/'+destination,'utf8'));
 const get=($,region)=>region.find('video source,video[src],iframe[src]').map((i,e)=>new URL($(e).attr('src'),'https://www.duzon119.co.kr'+page.path).href).get();
 const original=get(source,source('#pageTop').next());
 const renewed=get(output,output('.sb-content'));
 const same=JSON.stringify(original)===JSON.stringify(renewed);
 if(!same)throw new Error('Video changed: '+page.path);
 if(output('.site-header').length!==1||output('#soft-bank-renewal>footer').length!==1)throw new Error('Shared shell missing '+page.path);
 results.push({page:page.path,videosUnchanged:same,videoSources:original,mockup:output('.sb-hero-asset').attr('src'),icons:output('.sb-function-icon').map((i,e)=>output(e).attr('data-feature')).get()});
}
await fs.writeFile('renewal/product-media-audit.json',JSON.stringify(results,null,2));
console.log(`Product pages checked: ${results.length}; all video sources unchanged; shared header/footer present.`);
