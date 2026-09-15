import fs from 'node:fs/promises';

const assets=JSON.parse(await fs.readFile('assets/subpages/figma/manifest.json','utf8'));
const file=(family,n)=>assets[family]?.[n-1]?.file;

export function applyProductDesign($,page,root){
 const body=$('body');body.addClass('sb-figma-product');
 if(page==='/product/pms.asp'){
  const source=$('.gw_info');
  const text=element=>element.text().replace(/\s+/g,' ').trim();
  const section=$('<section class="sb-pms-gw" aria-labelledby="pms-gw-title"></section>');
  const header=$('<header class="sb-gw-heading"><span>GROUPWARE</span><h2 id="pms-gw-title">서비스소개: GW</h2></header>');
  header.append($('<p></p>').text(text(source.children('.pms_pg_int'))));
  section.append(header).append('<h3 class="sb-gw-label">GW 주요기능</h3>');
  const grid=$('<div class="sb-gw-grid"></div>');
  source.find('.cont_li>dl').each((i,e)=>{
   const item=$(e),title=text(item.find('dt>p')).replace('전자결제','전자결재');
   const card=$('<article class="info-card sb-gw-card"></article>');
   card.append($('<img alt="" width="96" height="96" loading="lazy">').attr('src',root+'assets/subpages/features/'+['approval','finance','tasks'][i]+'.png'));
   card.append($('<h4></h4>').text(title)).append($('<p></p>').text(text(item.find('dd'))));
   grid.append(card);
  });
  section.append(grid);
  const expansion=$('<div class="sb-gw-expansion"><span>SCALABILITY</span><h3>GW 확장가능한 기능</h3></div>');
  expansion.append($('<p></p>').text(text(source.children('.img_faetures').find('.cont_txt>p'))));
  section.append(expansion);
  source.replaceWith(section);
 }
 const am=page.includes('/amaranth10/')||page.includes('/nonprofit/');
 const weh=page.includes('/wehago/');
 if(weh){
  $('a').each((i,e)=>{if(/리플[릿렛].*보기/.test($(e).text()))$(e).attr('href',root+'assets/documents/wehago-services-2026.pdf').attr('target','_blank').attr('rel','noopener')});
  $('.video__wrap>li').each((i,e)=>{const a=$(e).children('a').first();if(a.length&&!a.find('img').length)a.append('<img src="'+root+'assets/subpages/wehago-video-0'+(i+1)+'.jpg" alt="'+$(e).children('b').text()+'" loading="lazy">')});
 }
 if(page==='/product/wehago/smart_A10.asp'){
  $('.wehago_05').before('<section class="sb-wehago-connected"><h2>다른 서비스들과 연동된 편리함! WEHAGO의 서비스들과 연결되어<br>더욱 편리한 경영관리로 다양한 업무를 빠르고 효율적으로 처리할 수 있습니다.</h2><div class="sb-service-tags"><span>전자결재 연동</span><span>문서 관리</span><span>메신저</span><span>경비청구</span><span>근태관리</span></div><div class="sb-wehago-ecosystem" role="img" aria-label="Smart A10을 중심으로 연결된 WEHAGO 업무 서비스"></div></section>');
 }
 const omni=page==='/product/omniesol.asp';
 if(omni){
  $('.omniesol .feature-wrap').each((i,e)=>{if($(e).children().length===8)$(e).addClass('sb-more-modules')});
  $('.omniesol .mod-title').prepend('<span class="sec-label">Product &amp; Service</span>');
  $('.omniesol .section>.inner').each((i,e)=>$(e).replaceWith($(e).contents()));
  $('.omniesol .panel').each((i,p)=>$(p).children('.section').each((j,e)=>$(e).attr('data-omni-side',j%2?'left':'right')));
 }
 $('section.cta').addClass('sb-contact-banner');
 $('a.cta').each((i,e)=>{if(/문의|상담|세미나/.test($(e).text()))$(e).closest('section').addClass('sb-contact-banner')});
 $('.sb-contact-banner').each((i,e)=>{
  const banner=$(e);if(banner.children().length===1&&banner.children().first().is('div'))banner.html(banner.children().first().html());
  banner.wrapInner('<div class="sb-contact-inner"></div>');
 });
 const title=am?(page.includes('nonprofit')?'Amaranth 10 비영리':'Amaranth 10'):weh?'WEHAGO':omni?'OmniEsol':page.includes('oneai')?'ONE AI':'PMS';
 $('.sb-hero>div>p').first().text('Product & Service');
 $('.sb-hero h1').text(title);
 $('.sb-hero nav').remove();
 $('.sb-hero h1').after('<p class="sb-hero-description">ERP·그룹웨어·AI가 하나로 융합된 더존 차세대 통합 비즈니스 플랫폼</p>');
 const intro=$('<div class="sb-product-heading"><span>Product &amp; Service</span><h2></h2></div>');
 intro.find('h2').text(title);$('main').prepend(intro);

 const sourceMap=new Map();
 const assign=(base,family,indices)=>indices.forEach((n,i)=>sourceMap.set(base+String(i+1).padStart(2,'0')+'.png',file(family,n)));
 assign('brand01__img','amaranth',[1,2,3,4,5,4,5,6,7,8,8,9]);
 assign('overview01__img','amaranth',[10,11,12,13,14,15,16,17,18]);
 assign('hr01__img','amaranth',[18,19,20,21,22]);
 assign('lm01__img','amaranth',[23,24,25,26,27,28,29,30,31]);
 assign('cooperSec3__img','wehago',[11,12,13,14,15,16,17,18,19,20,21,22,13,14,16]);
 assign('wehago_03_img','wehago',[1,2,3,4,5,6,7,8,9,10,10]);
 assign('extraSec3__img','wehago',[21,22,17,16]);
 assign('linkedSec3_img','wehago',[20,21,22,17,16]);
 sourceMap.set('smart_A10__img01.png',file('wehago',4));
 sourceMap.set('extraservice__img01.png',file('wehago',21));
 sourceMap.set('linked__img01.png',file('wehago',20));
 sourceMap.set('oneffice01__img01.png',file('omniesol',7));

 $('main img').each((i,e)=>{
  const img=$(e),src=img.attr('data-original-src')||'';
  const base=src.split('/').pop();const mapped=sourceMap.get(base);
  if(!mapped)return;
  img.attr('src',root+mapped).attr('width','1600').attr('height','1200').addClass('sb-design-mockup').removeClass('sb-cutout sb-section-screen');
  const frame=img.closest('.sb-laptop-mockup');
  if(frame.length)frame.replaceWith(img.toString());
 });
 if(omni){
  const mapping=[1,2,3,4,5,6,7,5,6,7,8,9,10,11,12,12];
  $('main img.shot').each((i,e)=>{
   const img=$(e);img.attr('src',root+file('omniesol',mapping[i]||12)).addClass('sb-design-mockup').removeClass('sb-section-screen sb-cutout');
   img.closest('.sb-laptop-mockup').replaceWith(img.toString());
  });
 }
 if(page==='/product/oneai.asp'){
  $('#mobile>.grid>div').each((i,e)=>{$(e).children('span').first().replaceWith('<img class="sb-mobile-icon" src="'+root+'assets/subpages/oneai-hq/mobile-'+['voice','lens','calendar','messenger'][i]+'.png" alt="" width="140" height="140" loading="lazy">')});
  const illustrations={'정확성':0,'사용성':1,'보안성':2,'세법도우미':3,'ONE News':4,'ONE Studio':5};
  $('main img').each((i,e)=>{
   const img=$(e),name=illustrations[img.attr('alt')];if(name===undefined)return;
   img.attr('src',root+'assets/subpages/oneai-hq/image-'+name+'.png').removeClass().addClass('sb-ai-diagram');
   const size=[[1782,883],[1404,1120],[1798,875],[1521,1034],[1527,1030],[1528,1029]][name];img.attr('width',size[0]).attr('height',size[1]);
   const frame=img.closest('.sb-laptop-mockup');if(frame.length)frame.replaceWith(img.toString());
  });
  $('.alt-section>div').each((i,e)=>{const row=$(e);row.children().first().addClass('sb-ai-visual');row.children().last().addClass('sb-ai-copy')});
  $('#intro').prepend('<img class="sb-ai-brand" src="'+root+'assets/subpages/oneai-hq/brand-visual.png" alt="ONE AI와 업무 서비스 연결">');
  $('.alt-section').first().parent('section').addClass('sb-ai-values');
  $('#downloads>.grid>div').each((i,e)=>{const card=$(e),icon=['chat','tasks','portal','mail'][i];card.addClass('sb-resource-card');card.children().first().empty().addClass('sb-resource-visual').append('<img src="'+root+'assets/subpages/features/'+icon+'.png" alt="" loading="lazy">')});
 }
 // The source sliders contain exact duplicate slides intended for looping.
 $('.wehago_slide .swiper-wrapper').each((i,e)=>{
  const seen=new Set();$(e).children('.swiper-slide').each((j,s)=>{const key=$(s).find('.txt').text().replace(/\s+/g,'');if(seen.has(key))$(s).remove();else seen.add(key)});
 });
 $('.sb-generated-panel:empty').remove();
 $('.sb-feature').each((i,e)=>$(e).addClass('sb-design-row').attr('data-layout',i%2?'visual-left':'visual-right'));
 $('.wehago_03>ul>li>.inner,.wehago_03>.wehago_slide .swiper-slide,.wehago_03 .swiper-wrapper>.swiper-slide').each((i,e)=>$(e).addClass('sb-design-row').attr('data-layout',i%2?'visual-left':'visual-right'));
 const semanticIcons=[['회계','finance'],['급여','approval'],['인사','hr'],['물류','logistics'],['개인','calendar'],['전자','security'],['연말','tasks'],['법인','portal']];
 $('.wehago_02>ul>li').not('.first').each((i,e)=>{
  const card=$(e),label=card.find('.txt>b,strong').first().text();
  const icon=semanticIcons.find(([word])=>label.includes(word))?.[1];
  if(icon)card.find('img').first().attr('src',root+'assets/subpages/features/'+icon+'.png');
 });
 if(page==='/product/wehago/cooperation.asp'){
  const icons={'메신저':'chat','화상회의':'meeting','웹스토리지':'storage','거래처관리':'cooperation/crm','연락처':'cooperation/contacts','메일':'mail','일정관리':'calendar','할일관리':'tasks','노트':'cooperation/notes','팩스':'fax','문자':'cooperation/sms','근태관리':'cooperation/attendance','전자결재':'approval','회사게시판':'cooperation/bulletin','내PC원격접속':'cooperation/remote'};
  const iconFor=label=>$('<img class="sb-wehago-illustration sb-cooperation-icon" width="140" height="140" loading="lazy">').attr('src',root+'assets/subpages/features/'+icons[label]+'.png').attr('alt',label+' 3D 아이콘');
  $('.wehago_02>ul>li:not(.first)').each((i,e)=>{
   const card=$(e),label=card.find('.txt>b').first().text().trim();
   if(!icons[label])return;
   card.children('.img').empty().append(iconFor(label));
   // The source messenger summary accidentally duplicated accounting services.
   if(label==='메신저')card.find('.txt .flex').html('<div><p>그룹대화 / 1:1 대화</p><p>대화내용 검색</p><p>문서·화면 공유</p><p>웹오피스 동시편집</p><p>실시간 협업</p></div>');
  });
  $('.wehago_03 .inner>.txt,.wehago_01 .swiper-slide>.txt').each((i,e)=>{
   const text=$(e),label=text.children('strong').first().text().trim();
   if(icons[label])text.prepend(iconFor(label).addClass('sb-cooperation-detail-icon'));
   if(label==='메신저'&&text.closest('.wehago_01').length)text.siblings('.img').find('img').attr('src',root+file('wehago',11)).attr('width','1316').attr('height','1200');
  });
 }
 $('.sb-product-tabs a').each((i,e)=>{const a=$(e);if(a.hasClass('active'))a.attr('aria-current','page')});
 $('.sb-design-mockup').each((i,e)=>{
  const img=$(e),entry=Object.values(assets).flat().find(a=>root+a.file===img.attr('src'));
  if(entry)img.attr('width',String(entry.width)).attr('height',String(entry.height));
  if(!img.attr('alt')){
   const section=img.closest('.sb-feature,.inner,.swiper-slide,.section');
   const label=section.find('.cont_txt>b,.txt>strong,.sec-label').first().text().trim();
   img.attr('alt',(label||title).replace(/\s+/g,' ')+' 제품 화면');
  }
 });
 const css=$('<link rel="stylesheet">').attr('href',root+'renewal/products-figma.css?v=20260915-5');$('head').append(css);
 $('head').append($('<script defer></script>').attr('src',root+'renewal/products-figma.js?v=20260915-5'));
}
