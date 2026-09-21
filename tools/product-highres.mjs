import fs from 'node:fs/promises';

const manifest=JSON.parse(await fs.readFile('assets/subpages/product-upscale-manifest.json','utf8').catch(error=>{
 if(error.code==='ENOENT')return '[]';
 throw error;
}));
const entries=new Map(manifest.map(entry=>[entry.file,entry]));

export function applyHighresAssets($,root){
 $('img').each((i,element)=>{
  const img=$(element),src=img.attr('src')||'',entry=entries.get(src.slice(root.length));
  if(!src.startsWith(root)||!entry)return;
  img.attr({width:entry.width,height:entry.height});
  if(img.parent().is('picture.sb-highres-picture'))return;
  img.wrap('<picture class="sb-highres-picture"></picture>');
  img.before($('<source type="image/webp">').attr('srcset',root+entry.file.replace(/\.png$/,'.webp')));
 });
}
