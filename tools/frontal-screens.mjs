import fs from 'node:fs';
const supplied=JSON.parse(fs.readFileSync('assets/subpages/frontal-sources/clipboard-map.json','utf8'));
const highres=JSON.parse(fs.readFileSync('assets/subpages/frontal-screens/manifest.json','utf8'));
// Keep real UI pixels. Hardware is drawn in CSS so no AI can alter screen text.
const omni={procurement:'f3f6c3f6fd590304',expense:'fec2a236c39964fe',manufacturing:'32663a23a2ee4f8b',dashboard:'aa0431a08f2e2baf',sales:'b3ac3aa33857b471',development:'c051731f2a4086ad',mlops:'e44a910ec1912e04'};
export function applyFrontalScreens($,root){
 $('main img').each((i,e)=>{
  const img=$(e),current=img.attr('src')||'',source=img.attr('data-screen-source');
  const match=current.match(/omniesol-custom\/([^/]+)\.png$/);
  let original=match&&omni[match[1]]?root+'assets/subpages/embedded/'+omni[match[1]]+'.jpg':source;
  if(supplied[current.slice(root.length)])original=root+supplied[current.slice(root.length)];
  const doc=current.match(/nonprofit-docs\/transparent-(\d)\.png$/);
  if(doc)original=root+'assets/subpages/nonprofit-docs/source-'+doc[1]+'.png';
  const ai=current.match(/oneai-hq\/image-(\d)\.png$/);
  if(ai)original=root+'assets/subpages/oneai-hq/reference-'+ai[1]+'.png';
  const changed=!!ai||/\/(figma|amaranth-custom|wehago-custom|wehago-extra|wehago-linked|nonprofit-docs)\//.test(current);
  const actualOmni=match&&omni[match[1]];
  if((!changed&&!actualOmni)||!original||!original.startsWith(root+'assets/'))return;
  img.attr('src',original).removeAttr('width height').removeClass('sb-design-mockup sb-amaranth-custom sb-section-screen').addClass('sb-frontal-screen');
  img.attr('alt',(img.attr('alt')||'제품 화면').replace(/3D (?:모니터 )?목업|3D 화면 목업/g,'실제 화면'));
  const oldFrame=img.closest('.sb-laptop-mockup');if(oldFrame.length)oldFrame.replaceWith(img);
  // WEHAGO's original references already include front-facing devices.
  if(original.includes('/embedded/')||current.includes('/amaranth-')||current.includes('/nonprofit-docs/')||$('body').hasClass('sb-page-product-omniesol')){
   img.wrap('<figure class="sb-frontal-monitor"><div class="sb-frontal-display"></div></figure>');
   img.closest('figure').append('<div class="sb-frontal-chin" aria-hidden="true"></div><div class="sb-frontal-stand" aria-hidden="true"></div><div class="sb-frontal-foot" aria-hidden="true"></div>');
  }else{
   img.wrap('<figure class="sb-faithful-reference"></figure>');
  }
  const asset=highres[original.slice(root.length)];
  if(asset){
   img.attr({src:root+asset.file,width:asset.width,height:asset.height});
   img.wrap('<picture class="sb-frontal-picture"></picture>');
   img.before($('<source type="image/webp">').attr('srcset',root+asset.file.replace(/\.png$/,'.webp')));
   if(!img.closest('a').length)img.parent('picture').wrap($('<a class="sb-screen-zoom"></a>').attr({href:root+asset.file,'aria-label':(img.attr('alt')||'제품 화면')+' 크게 보기'}));
  }
 });
 $('main img').removeAttr('data-screen-source');
}
