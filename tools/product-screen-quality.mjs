import fs from 'node:fs';

const {entries}=JSON.parse(fs.readFileSync('assets/subpages/quality-screens/manifest.json','utf8'));
const exported=new Map(Object.entries(entries).map(([source,asset])=>[asset.file,source]));

// Run after native/legacy mappings. Keep source identity for repeatable rebuilds.
export function applyProductScreenQuality($,page,root){
 if(!/^(?:\/product\/|subpages\/product\/)/.test(page))return 0;
 let changed=0;
 $('main img').each((i,el)=>{
  const img=$(el),file=(img.attr('src')||'').replace(/^(?:\.\.\/)+/,'');
  const previous=img.attr('data-quality-source')||exported.get(file)||file;
  const asset=entries[previous];if(!asset)return;
  const figure=img.closest('figure'),link=img.closest('.sb-screen-zoom');
  if(!figure.length||!link.length)return;
  const before=$.html(figure[0]);
  if(figure.hasClass('sb-inline-screen-gallery')){
   if(asset.inlinePanels)return;
   // A composite can return to one complete image when panel previews are disabled.
   const fullAlt=figure.attr('aria-label')||img.attr('alt')||'제품 화면';
   img.attr('alt',fullAlt).removeClass('sb-inline-screen-image');
   link.empty().append(img).attr('aria-label',fullAlt+' 크게 보기');
   figure.empty().append(link).removeClass('sb-inline-screen-gallery').removeAttr('data-inline-gallery aria-label');
  }
  // Full PNG replaces crop windows and WebP source sets in both inline and zoom views.
  const label=link.children('.sb-native-screen-label').remove();
  link.empty().append(img).append(label);
  img.addClass('sb-flat-screen').attr({src:root+asset.file,width:asset.width,height:asset.height,'data-quality-source':previous,'data-quality-id':asset.id})
   .removeAttr('style data-screen-crop data-screen-size').removeClass('sb-screen-pixels sb-frontal-screen');
  link.attr('href',root+asset.file);
  if(asset.alt){img.attr('alt',asset.alt);link.attr('aria-label',asset.alt+' 크게 보기');}
  figure.attr({'data-screen-content':'complete','data-quality-screen':'enhanced'});
  if(asset.generationDate==='2026-10-09')figure.addClass('sb-clarity-restored');
  if(!figure.hasClass('sb-native-screen-pair'))figure.attr('style',`--sb-screen-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-height:516px;--sb-preview-padding:0px`);
  if(asset.inlinePanels){
   figure.addClass('sb-inline-screen-gallery').attr({'data-inline-gallery':asset.clarityReviewId,'aria-label':img.attr('alt')||'제품 화면'});
   const tabs=$('<div class="sb-inline-screen-tabs" role="tablist" aria-label="제품 화면 선택"></div>');
   const views=$('<div class="sb-inline-screen-views"></div>');
   asset.inlinePanels.forEach((panel,index)=>{
    const active=index===(asset.inlineDefault||0),id=`${asset.clarityReviewId}-${i}-${index}`;
    const button=$('<button type="button" role="tab"></button>').text(panel.label).attr({id:id+'-tab','aria-controls':id,'aria-selected':String(active),tabindex:active?'0':'-1'});
    const pane=$('<div class="sb-inline-screen-view" role="tabpanel"></div>').attr({id,'aria-labelledby':id+'-tab'});
    if(!active)pane.attr('hidden','');
    const [x,y,w,h]=panel.bounds;
    const viewport=$('<span class="sb-inline-screen-window"></span>').attr('style',`aspect-ratio:${w}/${h}`);
    const panelImage=img.clone().removeClass('sb-flat-screen').addClass('sb-inline-screen-image').attr({alt:(img.attr('alt')||'제품 화면')+' — '+panel.label,style:`width:${asset.width/w*100}%;height:${asset.height/h*100}%;left:${-x/w*100}%;top:${-y/h*100}%`});
    const panelLink=$('<a class="sb-screen-zoom"></a>').attr({href:root+asset.file,'aria-label':(img.attr('alt')||'제품 화면')+' — '+panel.label});
    viewport.append(panelImage);panelLink.append(viewport);pane.append(panelLink);tabs.append(button);views.append(pane);
   });
   figure.empty().append(tabs).append(views);
  }
  if(before!==$.html(figure[0]))changed++;
 });
 return changed;
}
