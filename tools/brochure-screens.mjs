import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Amaranth 10 screens whose clarity-restored images had garbled text use the original
// captures from the Amaranth 10 brochure instead (see tools/prepare-brochure-screens.py).
const screens={
 'quality-screens/automatic-journals-restored-v3.png':'automatic-journals',
 'quality-screens/tax-filing-restored-v2.png':'tax-filing',
 'quality-screens/annual-leave-restored-v3.png':'annual-leave',
 'quality-screens/payroll-restored-v3.png':'payroll',
 'quality-screens/domestic-overseas-sales-clear-v1.png':'domestic-overseas-sales',
 'quality-screens/mps-clear-v1.png':'mps',
 'quality-screens/funds-clear-v1.png':'funds'
};
const version='20261023-native-1';
const manifest=JSON.parse(await fs.readFile('assets/subpages/brochure-screens/source-manifest.json','utf8'));
const size=file=>fs.readFile(file).then(data=>({width:data.readUInt32BE(16),height:data.readUInt32BE(20)}));
const sizes={};
for(const name of Object.values(screens))sizes[name]=await size(`assets/subpages/brochure-screens/${name}.png`);

async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}

let changed=0;
for(const file of await walk('subpages/product')){
 const source=await fs.readFile(file,'utf8');
 if(!Object.keys(screens).some(key=>source.includes(key))&&!source.includes('brochure-screens/'))continue;
 const $=load(source);
 const root='../'.repeat(file.replaceAll('\\','/').split('/').length-1);
 $('link[href*="brochure-screens/presentation.css"]').remove();
 $('head').append(`<link rel="stylesheet" href="${root}assets/subpages/brochure-screens/presentation.css?v=${version}">`);
 for(const [old,name] of Object.entries(screens)){
  const {width,height}=sizes[name],ratio=(width/height).toFixed(6);
  $(`img[src$="${old}"],img[src*="brochure-screens/${name}.png"]`).each((i,e)=>{
   const img=$(e),src=root+`assets/subpages/brochure-screens/${name}.png?v=${version}`;
   img.attr({src,width:String(width),height:String(height)}).removeAttr('data-quality-source').removeAttr('srcset');
   img.closest('a.sb-screen-zoom').attr('href',src);
   const figure=img.closest('figure');
   const original=manifest.find(item=>item.name===name);
   const style=(figure.attr('style')||'').replace(/--sb-native-width:[^;]+;?/g,'').replace(/--sb-screen-ratio:[\d.]+/,`--sb-screen-ratio:${ratio}`).replace(/--sb-preview-ratio:[\d.]+/,`--sb-preview-ratio:${ratio}`);
   figure.attr('style',style+`;--sb-native-width:${original.nativeSize[0]}px`).attr({'data-quality-screen':'pdf-native','data-pdf-source-page':String(original.sourcePage)});
  });
 }
 await fs.writeFile(file,$.html());changed++;
}
console.log(`Brochure screens applied to ${changed} pages`);
