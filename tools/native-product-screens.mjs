import fs from 'node:fs';

const {assets,bindings}=JSON.parse(fs.readFileSync('assets/subpages/native-screens/manifest.json','utf8'));
const normalize=value=>(value||'').replace(/[^가-힣a-zA-Z0-9]/g,'').toLowerCase();
const pagePath=page=>page.startsWith('/product/')?'subpages'+page.replace(/\.asp$/,'.html'):page;

// Feature + page + tab bindings avoid replacing unrelated uses of a shared raster.
// Apply after all legacy image mappings so rebuilding keeps the approved native UI.
export function applyNativeProductScreens($,page,root){
 const applicable=bindings.filter(binding=>binding.page===pagePath(page));
 let changed=0;
 for(const binding of applicable){
  const matches=$('main .sb-unframed-screen').filter((i,element)=>{
   const figure=$(element),row=figure.closest('.sb-zigzag-feature');
   const copy=row.children('.sb-feature-copy').first();
   const label=copy.children('b,strong').first().text();
   return normalize(label)===normalize(binding.label)
    && (figure.closest('[data-np-page]').attr('data-np-page')||'')===binding.tab;
  });
  if(matches.length!==1)throw new Error(`Native screen binding ${binding.reviewId}: expected one ${binding.label} in ${binding.page}/${binding.tab}, found ${matches.length}`);
  const figure=matches.first(),before=$.html(figure),asset=assets[binding.asset];
  const caption=figure.children('figcaption').remove();
  const featureLabel=({70:'자동전표처리',71:'근태관리',73:'일정관리'})[binding.reviewId]||binding.label;
  const oldAlt=(binding.page.includes('/wehago/')?'WEHAGO ':'Amaranth 10 ')+featureLabel+' 실제 제품 화면';
  figure.empty().removeAttr('data-official-correction data-original-screen');
  figure.attr({'data-screen-content':'complete','data-native-screen':binding.asset,
   'data-native-review-id':binding.reviewId,
   style:`--sb-screen-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-ratio:${(asset.width/asset.height).toFixed(6)};--sb-preview-height:516px;--sb-preview-padding:0px`});
  figure.toggleClass('sb-native-screen-pair',Boolean(binding.secondaryAsset));
  function appendScreen(source,alt,label){
   const link=$('<a class="sb-screen-zoom"></a>').attr({href:root+source.file,'aria-label':alt+' 크게 보기'});
   link.append($('<img class="sb-flat-screen" loading="lazy">').attr({src:root+source.file,alt,width:source.width,height:source.height}));
   if(label)link.append($('<span class="sb-native-screen-label"></span>').text(label));
   figure.append(link);
  }
  appendScreen(asset,binding.secondaryAsset?'Amaranth 10 전자팩스 화면':oldAlt,binding.secondaryAsset?'전자팩스':null);
  if(binding.secondaryAsset)appendScreen(assets[binding.secondaryAsset],'Amaranth 10 SMS 화면','SMS');
  figure.append(caption);
  if(before!==$.html(figure))changed++;
 }
 return {matched:applicable.length,changed};
}
