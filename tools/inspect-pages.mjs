import fs from 'node:fs/promises';
import {load} from 'cheerio';
for(const p of JSON.parse(await fs.readFile('reference/inventory.json','utf8'))){
 if(p.status!==200)continue;
 const $=load(await fs.readFile('reference/pages/'+p.file,'utf8'));
 console.log(p.path, $('#pageTop').length, $('#pageTop').next().attr('class'), $('#pageTop').next().attr('id'));
}
