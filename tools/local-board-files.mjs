import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Board attachments were linked through the old site's /_lib/download.asp. The files were copied into
// assets/documents/board/ (list: reference/board-files.json), so the links point there and download
// under their original names.
const files=JSON.parse(await fs.readFile('reference/board-files.json','utf8'));
const local=new Map(files.filter(file=>file.local).map(file=>[`${file.path}/${file.name}`,file]));
async function walk(dir){const out=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())out.push(...await walk(file));else if(file.endsWith('.html'))out.push(file);}return out;}

let changed=0,links=0;
for(const file of ['index.html',...await walk('subpages')]){
 const source=await fs.readFile(file,'utf8');
 if(!source.includes('download.asp'))continue;
 const $=load(source),root='../'.repeat(file.replaceAll('\\','/').split('/').length-1);
 $('a[href*="download.asp"]').each((i,e)=>{
  let url;try{url=new URL($(e).attr('href'),'https://www.duzon119.co.kr/');}catch{return;}
  const entry=local.get(`${url.searchParams.get('path')||'board'}/${url.searchParams.get('downfile')}`);
  if(!entry)return;
  $(e).attr({href:`${root}assets/documents/board/${entry.local}`,download:entry.name}).removeAttr('target');
  links++;
 });
 const html=$.html();
 if(html!==source){await fs.writeFile(file,html);changed++;}
}
console.log(`Board attachments served locally: ${links} links on ${changed} pages`);
