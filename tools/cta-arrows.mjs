import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Only the 영상으로 확인하기 and 리플릿 자세히 보기 buttons carry the trailing '›' (styles.css draws it for .sb-cta-arrow).
const label=/^(영상으로\s*확인하기|리플[릿렛]\s*자세히\s*보기)$/;
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}
let changed=0;
for(const file of await walk('subpages/product')){
 const source=await fs.readFile(file,'utf8');
 const $=load(source);
 $('.sb-content a, .sb-content button').each((i,e)=>{const el=$(e),match=label.test(el.text().replace(/\s+/g,' ').trim());if(match)el.addClass('sb-cta-arrow');else if(el.hasClass('sb-cta-arrow'))el.removeClass('sb-cta-arrow');});
 const html=$.html();
 if(html!==source){await fs.writeFile(file,html);changed++;}
}
console.log(`CTA arrows marked on ${changed} pages`);
