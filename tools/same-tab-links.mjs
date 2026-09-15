import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
async function update(file){
 const $=load(await fs.readFile(file,'utf8'));
 $('a[href]').each((i,e)=>{const a=$(e);if(!/^(https?:|\/\/|tel:|mailto:)/i.test(a.attr('href')))a.removeAttr('target rel');});
 for(let attempt=0;;attempt++){
  try{await fs.writeFile(file,$.html());break;}
  catch(error){if(!['UNKNOWN','EBUSY','EPERM'].includes(error.code)||attempt>=5)throw error;await new Promise(resolve=>setTimeout(resolve,300*(attempt+1)));}
 }
}
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.html'))await update(file);}}
await update('index.html');
await walk('subpages');
console.log('Internal navigation opens in the current tab.');
