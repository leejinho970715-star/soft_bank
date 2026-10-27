import fs from 'node:fs/promises';
import {load} from 'cheerio';

// Images supplied directly by the site owner (2026-10-26) replace the generated ones on these pages.
// Each entry: page, the current image (matched by the end of its src), the supplied file and its size.
const swaps=[
 {page:'subpages/product/oneai.html',match:'regenerated/ui-089.png',file:'oneai-usability.png',width:768,height:614},
 {page:'subpages/product/wehago/smart_A10.html',match:'quality-screens/wehago-flexible-work-restored-v3.png',file:'wehago-flexible-work.webp',width:1448,height:1086}
];
const version='20261027-1';
let changed=0;
for(const {page,match,file,width,height} of swaps){
 const source=await fs.readFile(page,'utf8'),$=load(source);
 const root='../'.repeat(page.split('/').length-1),src=`${root}assets/subpages/user-supplied/${file}?v=${version}`;
 $(`img[src*="${match}"]`).each((i,e)=>{
  const img=$(e);img.closest('picture').find('source').remove();img.attr({src,width:String(width),height:String(height)}).removeAttr('data-quality-source').removeAttr('srcset');
  img.closest('a.sb-screen-zoom').attr('href',src);
  const figure=img.closest('figure');
  if(figure.length){const ratio=(width/height).toFixed(6);figure.attr('style',(figure.attr('style')||'').replace(/--sb-screen-ratio:[\d.]+/,`--sb-screen-ratio:${ratio}`).replace(/--sb-preview-ratio:[\d.]+/,`--sb-preview-ratio:${ratio}`)).attr('data-quality-screen','user-supplied');}
 });
 const html=$.html();if(html!==source){await fs.writeFile(page,html);changed++;}
}
console.log(`User-supplied images applied to ${changed} pages`);
