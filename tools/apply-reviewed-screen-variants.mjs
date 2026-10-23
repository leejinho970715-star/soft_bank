import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';

// Only these two variants were accepted with known minor numeric differences.
// Keep the native captures and other rejected AI candidates unchanged.
const manifest=JSON.parse(await fs.readFile('assets/subpages/reviewed-ai-20261023/manifest.json','utf8'));
let placements=0;
for(const entry of manifest.entries){
 const pixels=await fs.readFile(entry.file);
 if(crypto.createHash('sha256').update(pixels).digest('hex')!==entry.sha256)throw new Error(`Unexpected reviewed asset: ${entry.key}`);
 for(const file of entry.pages){
  const source=await fs.readFile(file,'utf8'),$=load(source),root='../'.repeat(file.split('/').length-1);
  const images=$('img[src]').filter((i,e)=>[entry.originalFile,entry.file].some(p=>($(e).attr('src')||'').split('?')[0].endsWith(p)));
  if(images.length!==1)throw new Error(`Expected exactly one ${entry.key} in ${file}; found ${images.length}`);
  const img=images.first(),src=root+entry.file+'?v='+manifest.version,[width,height]=entry.outputSize,figure=img.closest('figure');
  const ratio=(width/height).toFixed(6);
  img.attr({src,width,height}).removeAttr('srcset');
  img.closest('a.sb-screen-zoom,a.sb-image-trigger').attr('href',src);
  const style=(figure.attr('style')||'').replace(/--sb-native-width:[^;]+;?/g,'').replace(/--sb-(screen|preview)-ratio:[\d.]+/g,(m,k)=>`--sb-${k}-ratio:${ratio}`).replace(/;+$/,'');
  figure.attr({style:style+`;--sb-native-width:${entry.previewWidth}px`,'data-quality-screen':'reviewed-ai','data-original-screen':entry.originalFile,'data-ai-review':'user-accepted-minor-differences'});
  const output=$.html();if(output!==source)await fs.writeFile(file,output);
  placements++;
 }
}
console.log(`User-reviewed AI variants applied to ${placements} placements (${manifest.entries.length} images).`);
