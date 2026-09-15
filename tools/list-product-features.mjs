import fs from 'node:fs/promises';
import {load} from 'cheerio';
for(const page of JSON.parse(await fs.readFile('reference/inventory.json','utf8')).filter(p=>p.status===200&&p.path.startsWith('/product/'))){
 const $=load(await fs.readFile('reference/pages/'+page.file,'utf8'));
 console.log(page.path,$('#pageTop').next().find('.cont_txt b,h5').map((i,e)=>$(e).text().trim().replace(/\s+/g,' ').slice(0,100)).get());
}
