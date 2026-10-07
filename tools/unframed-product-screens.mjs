import fs from 'node:fs';

const crops=JSON.parse(fs.readFileSync('assets/subpages/unframed-screen-crops.json','utf8'));
const generated=Object.values(JSON.parse(fs.readFileSync('assets/subpages/regenerated/manifest.json','utf8')));
const kinds=new Map(generated.map(e=>[e.file,e.kind]));
const corrections=JSON.parse(fs.readFileSync('assets/subpages/official-corrected/manifest.json','utf8'));
const compositions=JSON.parse(fs.readFileSync('assets/subpages/official-corrected/composition.json','utf8')).entries;
const sources=new Map(corrections.map(row=>[row.file,compositions.find(e=>e.title===row.alt)]));
const completePath='assets/subpages/full-screen-overrides.json';
const completeScreens=fs.existsSync(completePath)?JSON.parse(fs.readFileSync(completePath,'utf8')).entries:{};

function size(file){
 const bytes=fs.readFileSync(file);
 if(bytes.subarray(1,4).toString()==='PNG')return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
 if(bytes.subarray(0,3).toString()==='GIF')return [bytes.readUInt16LE(6),bytes.readUInt16LE(8)];
 throw new Error('Unsupported screen source: '+file);
}

// Remove presentation hardware while retaining corrected UI pixels and feature mappings.
// Existing raster composites use native CSS viewports, also cloned into the zoom dialog.
export function applyUnframedProductScreens($,root){
 let changed=0;
 $('main .sb-frontal-monitor,main .sb-faithful-reference,main .sb-laptop-mockup,main .sb-device-scene,main .ifrs-screen').each((i,element)=>{
  const old=$(element),oldImage=old.find('img').first();
  const previous=(oldImage.attr('src')||'').replace(/^(?:\.\.\/)+/,'');
  if(kinds.get(previous)==='diagram')return;
  const composition=sources.get(previous);
  const original=composition?.source||previous;
  const complete=completeScreens[original];
  const file=complete?.file||original;
  const [iw,ih]=size(file);
  let crop=complete?complete.crop:composition?.crop||crops[file];
  const deviceWindow=old.find('.sb-device-desktop .sb-device-window').first();
  if(!complete&&deviceWindow.length&&!crop)throw new Error('Missing native screen crop for '+file);
  if(!complete&&kinds.get(file)==='devices'&&!crop)throw new Error('Missing raster screen crop for '+file);
  const [x,y,w,h]=crop||[0,0,iw,ih];
  if(w<=0||h<=0||x<0||y<0||x+w>iw||y+h>ih)throw new Error('Invalid screen crop: '+file);
  const priorRatio=Number(oldImage.attr('width'))/Number(oldImage.attr('height'));
  const flatFrame=old.hasClass('sb-frontal-monitor');
  const figure=$('<figure class="sb-unframed-screen"></figure>').attr({
   'data-screen-presentation':'unframed',
   style:`--sb-screen-ratio:${(w/h).toFixed(6)};--sb-preview-ratio:${(priorRatio||iw/ih).toFixed(6)};--sb-preview-height:${flatFrame?'432':'516'}px;--sb-preview-padding:${flatFrame?'26':'0'}px`
  });
  if(old.attr('data-official-correction'))figure.attr('data-official-correction',old.attr('data-official-correction'));
  if(complete)figure.attr({'data-screen-content':'complete','data-original-screen':original});
  const alt=oldImage.attr('alt')||'제품 화면';
  const link=$('<a class="sb-screen-zoom"></a>').attr({href:root+file,'aria-label':alt+' 크게 보기'});
  const image=$('<img class="sb-flat-screen" loading="lazy">').attr({src:root+file,alt,width:iw,height:ih});
  if(crop){
   const viewport=$('<span class="sb-screen-window"></span>').attr('style',`aspect-ratio:${w}/${h}`);
   image.addClass('sb-screen-pixels').attr({
    'data-screen-crop':crop.join(','),'data-screen-size':`${iw},${ih}`,
    style:`width:${iw/w*100}%!important;height:${ih/h*100}%!important;left:${-x/w*100}%;top:${-y/h*100}%`
   });
   link.append(viewport.append(image));
  }else link.append(image);
  const caption=old.children('figcaption');
  figure.append(link).append(caption);
  old.replaceWith(figure);changed++;
 });
 return changed;
}

// Refresh checked-in pages as well as newly generated pages. Complete screenshots
// use their full native image; native extraction rectangles include the whole UI.
export function applyCompleteScreenOverrides($,root){
 let changed=0;
 $('.sb-unframed-screen').each((i,element)=>{
  const figure=$(element),img=figure.find('img').first();
  const previous=(figure.attr('data-original-screen')||img.attr('src')||'').replace(/^(?:\.\.\/)+/,'');
  const complete=completeScreens[previous];if(!complete)return;
  const before=$.html(element),file=complete.file,[iw,ih]=size(file);
  const crop=complete.crop,[x,y,w,h]=crop||[0,0,iw,ih];
  if(x<0||y<0||w<=0||h<=0||x+w>iw||y+h>ih)throw new Error('Invalid complete UI bounds: '+file);
  img.attr({src:root+file,width:iw,height:ih}).removeAttr('style data-screen-crop data-screen-size').removeClass('sb-screen-pixels');
  const link=figure.find('.sb-screen-zoom').first();link.attr('href',root+file).empty();
  if(crop){
   const viewport=$('<span class="sb-screen-window"></span>').attr('style',`aspect-ratio:${w}/${h}`);
   img.addClass('sb-screen-pixels').attr({'data-screen-crop':crop.join(','),'data-screen-size':`${iw},${ih}`,style:`width:${iw/w*100}%!important;height:${ih/h*100}%!important;left:${-x/w*100}%;top:${-y/h*100}%`});
   link.append(viewport.append(img));
  }else link.append(img);
  figure.attr({'data-screen-content':'complete','data-original-screen':previous});
  figure.attr('style',(figure.attr('style')||'').replace(/--sb-screen-ratio:[^;]+/,`--sb-screen-ratio:${(w/h).toFixed(6)}`));
  if(before!==$.html(element))changed++;
 });
 return changed;
}
