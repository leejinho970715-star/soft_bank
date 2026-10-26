import fs from 'node:fs/promises';import {load} from 'cheerio';
const data={};
// Product names use the spaced spelling, as tools/text-corrections.mjs does for the pages.
const title=text=>text.replace(/Amaranth10(?![\w%.])/g,'Amaranth 10').replace(/IFRS18(?![\w%.])/g,'IFRS 18');
for(const [category,p] of Object.entries({notice:'customer',amaranth:'amaranth10',bizbox:'bizbox',icube:'icube'})){
 const f=`subpages/${p}/notice.html`,$=load(await fs.readFile(f,'utf8'));const items=[];
 if(category==='notice')$('.td_subject a.title').slice(0,5).each((i,e)=>{const a=$(e).clone();a.find('.bbsimp').remove();const date=$(e).closest('tr').find('td').toArray().map(td=>$(td).text().trim()).find(t=>/^\d{4}-\d{2}-\d{2}$/.test(t));items.push([title(a.text().trim()),date||'',$(e).attr('href'),'assets/notice-thumb.png']);});
 else $('.photo_list .gall_cont').slice(0,5).each((i,e)=>items.push([title($(e).find('.title').text().trim()),$(e).find('.day').text().trim(),$(e).attr('href'),$(e).find('img').attr('src')]));
 data[category]={href:f,items};
}
await fs.writeFile('assets/news-data.js','window.SOFTBANK_NEWS = '+JSON.stringify(data,null,2)+';\n');
