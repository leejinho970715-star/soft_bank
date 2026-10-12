import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
async function walk(directory) {
  const files=[];
  for(const entry of await fs.readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())files.push(...await walk(file));
    else if(file.endsWith('.html'))files.push(file);
  }
  return files;
}
let checked=0,updated=0;
for(const file of ['index.html',...await walk('subpages')]) {
  const source=await fs.readFile(file,'utf8');
  const brand=source.match(/<header class="site-header">[\s\S]*?(<a class="brand"[^>]*>[\s\S]*?<\/a>)/)?.[1];
  if(!brand)continue;
  const replacement=brand.replace('class="brand"','class="footer-brand"');
  const html=source.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/,footer=>footer.replace(/<img\b[^>]*class="footer-logo"[^>]*>|<a class="footer-brand"[^>]*>[\s\S]*?<\/a>/,replacement));
  const $=load(html);
  const images=$('#soft-bank-renewal>footer .footer-brand img').toArray();
  const header=$('.site-header>.brand img').toArray();
  if(images.length!==2||images.some((e,i)=>$(e).attr('src')!==$(header[i]).attr('src')))throw new Error(`Footer logos do not match header: ${file}`);
  checked++;
  if(html!==source){await fs.writeFile(file,html);updated++;}
}
console.log(`Footer brand: ${updated} pages updated; ${checked} headers and footers match.`);
