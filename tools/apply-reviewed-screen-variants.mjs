import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
async function writeFile(file,data){for(let attempt=0;;attempt++){try{return await fs.writeFile(file,data)}catch(error){if(attempt>=4||!['UNKNOWN','EBUSY'].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,250));}}}

// User accepted all regenerated variants after reviewing known QA differences.
// Native assets are retained. --restore / --apply persist across future builds.
const manifestPath='assets/subpages/reviewed-ai-20261023/manifest.json';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
if(process.argv.includes('--restore')||process.argv.includes('--apply')){
 manifest.enabled=process.argv.includes('--apply');
 await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
}
let placements=0;
for(const entry of manifest.entries){
 const enabled=manifest.enabled!==false;
 const pixels=await fs.readFile(entry.file);
 if(crypto.createHash('sha256').update(pixels).digest('hex')!==entry.sha256)throw new Error(`Unexpected reviewed asset: ${entry.key}`);
 const original=enabled?null:await fs.readFile(entry.originalFile);
 const [width,height]=enabled?entry.outputSize:[original.readUInt32BE(16),original.readUInt32BE(20)];
 for(const file of entry.pages){
  const source=await fs.readFile(file,'utf8'),$=load(source),root='../'.repeat(file.split('/').length-1);
  const images=$('img[src]').filter((i,e)=>[entry.originalFile,entry.file].some(p=>($(e).attr('src')||'').split('?')[0].endsWith(p)));
  if(!images.length)throw new Error(`Missing ${entry.key} in ${file}`);
  for(const element of images.toArray()){
  const img=$(element),src=root+(enabled?entry.file:entry.originalFile)+'?v='+(entry.version||manifest.version),figure=img.closest('figure');
  const ratio=(width/height).toFixed(6);
  img.attr({src,width,height}).removeAttr('srcset');
  img.closest('a.sb-screen-zoom,a.sb-image-trigger').attr('href',src);
  const style=(figure.attr('style')||'').replace(/--sb-native-width:[^;]+;?/g,'').replace(/--sb-(screen|preview)-ratio:[\d.]+/g,(m,k)=>`--sb-${k}-ratio:${ratio}`).replace(/;+$/,'');
  figure.attr({style:style+`;--sb-native-width:${entry.previewWidth}px`,'data-quality-screen':enabled?'reviewed-ai':'verified-native','data-original-screen':entry.originalFile});
  if(enabled)figure.attr('data-ai-review','user-accepted-known-differences');else figure.removeAttr('data-ai-review');
  placements++;
  }
  const output=$.html();if(output!==source)await writeFile(file,output);
 }
}
console.log(`${manifest.enabled===false?'Original captures restored':'User-accepted AI variants applied'} to ${placements} placements (${manifest.entries.length} images).`);
