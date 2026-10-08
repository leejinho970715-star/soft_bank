import fs from 'node:fs';

const {entries}=JSON.parse(fs.readFileSync('assets/subpages/quality-screens/manifest.json','utf8'));

// Run after native/legacy mappings. Keep source identity for repeatable rebuilds.
export function applyProductScreenQuality($,page,root){
 if(!/^(?:\/product\/|subpages\/product\/)(?:amaranth10\/|nonprofit\/|wehago\/)/.test(page))return 0;
 let changed=0;
 $('main .sb-unframed-screen').each((i,element)=>{
  const figure=$(element);
  figure.find('img.sb-flat-screen').each((j,el)=>{
   const img=$(el),previous=(img.attr('data-quality-source')||img.attr('src')||'').replace(/^(?:\.\.\/)+/,'');
   const asset=entries[previous];if(!asset)return;
   const before=$.html(element),link=img.closest('.sb-screen-zoom');
   // Complete real screenshots replace legacy crop viewports, including in zoom.
   const label=link.children('.sb-native-screen-label').remove();
   link.empty().append(img).append(label);
   img.attr({src:root+asset.file,width:asset.width,height:asset.height,'data-quality-source':previous,'data-quality-id':asset.id})
    .removeAttr('style data-screen-crop data-screen-size').removeClass('sb-screen-pixels');
   link.attr('href',root+asset.file);
   if(asset.alt){img.attr('alt',asset.alt);link.attr('aria-label',asset.alt+' 크게 보기');}
   figure.attr({'data-screen-content':'complete','data-quality-screen':'enhanced'});
   if(!figure.hasClass('sb-native-screen-pair'))figure.attr('style',`--sb-screen-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-height:516px;--sb-preview-padding:0px`);
   if(before!==$.html(element))changed++;
  });
 });
 return changed;
}
