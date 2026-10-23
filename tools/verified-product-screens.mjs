import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

const entries=JSON.parse(await fs.readFile('assets/subpages/verified-screens-20261023/manifest.json','utf8'));
const version='20261023-native-1';
let placements=0;
for(const scope of new Set(entries.map(e=>e.scope))){
 const file='subpages/product/'+scope,original=await fs.readFile(file,'utf8'),$=load(original);
 const root='../'.repeat(file.split('/').length-1);
 $('link[href*="brochure-screens/presentation.css"]').remove();
 $('head').append(`<link rel="stylesheet" href="${root}assets/subpages/brochure-screens/presentation.css?v=${version}">`);
 for(const entry of entries.filter(e=>e.scope===scope)){
  let found=0;
  $('img[src]').each((i,e)=>{
   const img=$(e),old=(img.attr('src')||'').split('?')[0];
   if(!entry.oldPaths.some(p=>old.endsWith(p))&&!old.endsWith(entry.file))return;
   const src=root+entry.file+'?v='+version,[width,height]=entry.outputSize,ratio=(width/height).toFixed(6);
   img.attr({src,width,height}).removeAttr('srcset').removeAttr('data-quality-source');
   img.closest('a.sb-screen-zoom,a.sb-image-trigger').attr('href',src);
   const figure=img.closest('figure');
   if(figure.length){
    const style=(figure.attr('style')||'').replace(/--sb-native-width:[^;]+;?/g,'').replace(/--sb-(screen|preview)-ratio:[\d.]+/g,(m,k)=>'--sb-'+k+'-ratio:'+ratio);
    figure.attr({style:style+';--sb-native-width:'+entry.nativeSize[0]+'px','data-quality-screen':'verified-native','data-original-screen':entry.file});
   }
   found++;placements++;
  });
  if(found!==1)throw new Error(`Expected one ${entry.key} screen in ${scope}; found ${found}`);
 }
 if($.html()!==original)await fs.writeFile(file,$.html());
}
console.log(`Verified original product captures applied to ${placements} placements.`);
