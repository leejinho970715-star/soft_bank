import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';

const origin='https://www.duzon119.co.kr';
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const linkSource=(await fs.readFile('reference/link.js','utf8')).replace(/\/\/[^\n]*/g,'');
const menuSource=(await fs.readFile('reference/menu.js','utf8')).split('\n').filter(l=>!l.trim().startsWith('//')).join('\n');
const links=new Map([...linkSource.matchAll(/function (link\d+)\(h\)\{var urls = ROOT_URL\s*\+\s*"([^"]+)"/g)].map(m=>[m[1],'/'+m[2].replace(/^\//,'')]));
const menu=[...menuSource.matchAll(/\[\s*"(\d+)",\s*"([^"]+)",\s*"([^"]+)"/g)].map(m=>({code:m[1],title:m[2].trim(),url:m[3].startsWith('/')?m[3]:links.get(m[3].match(/link\d+/)?.[0])}));
const pages=inventory.filter(p=>p.status===200&&!['/company/privacy.asp','/company/clause.asp'].includes(p.path));
const assetMap=JSON.parse(await fs.readFile('reference/asset-map.json','utf8'));
const imageDimensions=JSON.parse(await fs.readFile('reference/image-dimensions.json','utf8'));
const faqData=JSON.parse(await fs.readFile('reference/faq-data.json','utf8'));
const main=load(await fs.readFile('index.html','utf8'));
function sharedMarkup(selector,root){
 const $=load(main(selector).toArray().map(e=>main(e).toString()).join(''),null,false);
 $('a[href],img[src]').each((i,e)=>{const el=$(e);const attr=e.tagName==='img'?'src':'href';const value=el.attr(attr);if(value&&!/^(https?:|tel:|mailto:|#|data:)/.test(value))el.attr(attr,root+value);});
 $('.legal-scroll').text('문서를 불러오는 중입니다.');
 return $.html();
}
function featureIcon(text){
 const rules=[['search',/검색/],['approval',/결재|승인/],['calendar',/일정|근태|연차|예약/],['meeting',/화상|회의/],['share',/화면공유|연동|연계|공유/],['fax',/팩스|SMS/],['mail',/메일|전자메일/],['chat',/메신저|채팅|소통/],['storage',/문서|KEEP|자료|저장|자산화/],['finance',/회계|전표|장부|재무|자금|금융|세무|예산|급여|여신|원가|채권/],['hr',/인사|직원|인재|인력/],['logistics',/물류|재고|BOM|생산|자재|공정|수출|수입|구매|공급/],['security',/보안|보호|신뢰|관제/],['ai',/AI|RAG|분석|데이터|자동화/],['tasks',/업무관리|프로젝트|계약|진행|업무|협업|KISS/]];
 return rules.find(([,pattern])=>pattern.test(text))?.[0]||'portal';
}
const destinations=new Map(pages.map(p=>[p.path,p.path.slice(1).replace(/\.asp$/,'.html')]));
const cleanText=$=>$.root().text().replace(/\s+/g,' ').trim();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const report=[];
await fs.mkdir('subpages',{recursive:true});
await fs.mkdir('renewal',{recursive:true});
for(const page of pages){
 const original=load(await fs.readFile('reference/pages/'+page.file,'utf8'));
 const body=original('#pageTop').next();
 if(!body.length)throw new Error('Missing content: '+page.path);
 const $=load(body.toString(),null,false);
 $('script,style,noscript').remove();
 if(page.path==='/customer/faq.asp'){
  $('#faqCount').text(String(faqData.length));
  $('#faqTbody').html(faqData.map((item,i)=>`<tr class="faq-row" data-product="${escape(item.product)}"><td>${item.isNotice?'공지':faqData.length-i}</td><td>${escape(item.product)}</td><td><details><summary>${escape(item.question)}</summary><div class="sb-faq-answer">${item.answer}</div></details></td><td>${escape(item.createdAt)}</td><td>${item.views}</td></tr>`).join(''));
 }
 const before=cleanText($);
 const code=original('body').attr('data-pgcode')||'';
 const entry=menu.find(m=>m.url===page.path&&m.code.length===4)||menu.find(m=>m.code===code.slice(0,4));
 const activeTab=$('a').filter((i,e)=>{try{return new URL($(e).attr('href'),origin+page.path).pathname===page.path}catch{return false}}).first().text().trim();
 const title=entry?.title||(activeTab&&!/리플릿|리플릿|자세히/.test(activeTab)?activeTab:'')||$('h1,h2,h3,h4,strong').first().text().trim()||page.path;
 const group=menu.find(m=>m.code===code.slice(0,2))?.title||'고객센터';
 const out=destinations.get(page.path);
 const depth=out.split('/').length-1;
 const root='../'.repeat(depth+1);
 const local=(p)=>'../'.repeat(depth)+(destinations.get(p)||'index.html');
 const forms=$('form').toArray().map(e=>({name:$(e).attr('name'),action:$(e).attr('action'),method:$(e).attr('method'),fields:$(e).find('[name]').map((i,n)=>$(n).attr('name')).get()}));
 $('*').each((i,e)=>{
  const el=$(e);
  for(const name of Object.keys(e.attribs||{})){
   if(name.startsWith('on')||name==='data-aos'||name.startsWith('data-aos-'))el.removeAttr(name);
  }
  // Preserve content and inline semantic styles; remove desktop-only geometry.
  if(el.attr('style'))el.attr('style',el.attr('style').replace(/(?:^|;)\s*(?:width|min-width|max-width|height|min-height|max-height|position|left|right|top|bottom|transform|overflow|float)\s*:[^;]*/gi,''));
 });
 $('img,source,iframe,video').each((i,e)=>{
  const el=$(e);
  if(e.tagName==='video')el.attr('controls','').attr('playsinline','').attr('preload','metadata').removeAttr('autoplay loop');
  for(const attr of ['src','poster']){
   const src=el.attr(attr);if(src&&!/^(data:|blob:)/.test(src))el.attr(attr,new URL(src,origin+page.path).href);
  }
  if(e.tagName==='img'){
   el.removeAttr('width height srcset').attr('loading','lazy');
   if(el.attr('src')===origin+'/images/sub/about__list03.jpg')el.attr('src',root+'assets/subpages/consulting-3d.png');
   else if(assetMap[el.attr('src')])el.attr('src',root+assetMap[el.attr('src')]);
   else if(/\/extra_01__icon0[123]\.png$/.test(el.attr('src')||''))el.remove(); // Original decorative URLs return 404; no text or information is removed.
  }
 });
 $('a').each((i,e)=>{
  const a=$(e);let href=a.attr('href')||'';
  if(href.startsWith('javascript:'))href=links.get(href.match(/link\d+/)?.[0])||'';
  if(href&&!href.startsWith('#')){
   const url=new URL(href,origin+page.path);
   a.attr('href',url.origin===origin&&destinations.has(url.pathname)?local(url.pathname)+url.search+url.hash:url.href).attr('target','_blank').attr('rel','noopener noreferrer');
  }else if(!href){a.attr('href',origin+page.path).attr('target','_blank').attr('rel','noopener noreferrer');}
 });
 $('form').attr('data-preview-form','true');
 $('.amaranth10__list,.wehago__list').addClass('sb-product-tabs');
 $('table').wrap('<div class="sb-table-scroll" tabindex="0" aria-label="표 가로 스크롤"></div>');
 const after=cleanText($);
 if(before!==after)throw new Error('Content changed: '+page.path);
 const hash=crypto.createHash('sha256').update(before).digest('hex');
 const family=page.path.startsWith('/product/')?'product':page.path.startsWith('/company/')?'company':page.path.startsWith('/purchase/')?'consult':page.path.startsWith('/member/')?'member':page.path.startsWith('/government/')||page.path.startsWith('/community/')?'notice':'support';
 const asset=family==='product'?'platform':family==='member'?'support':family;
 const productHero=page.path.includes('/hr.asp')?'hr':page.path.includes('/lm.asp')?'logistics':page.path.includes('/overview.asp')||page.path.includes('/nonprofit/')?'finance':page.path.includes('oneai')||page.path.includes('omniesol')?'ai':page.path.includes('cooperation')?'chat':page.path.includes('linkedservice')?'share':page.path.includes('extraservice')?'finance':page.path.includes('/pms.asp')?'tasks':'portal';
 const heroCutout=page.path.startsWith('/product/amaranth10/')||page.path.startsWith('/product/nonprofit/')?root+'assets/subpages/logos/amaranth10-3d.png':page.path==='/product/oneai.asp'?root+'assets/subpages/logos/one-ai-3d.png':page.path.startsWith('/product/wehago/')?root+'assets/subpages/logos/wehago-3d.png':page.path==='/product/omniesol.asp'?root+'assets/subpages/logos/omniesol-3d.png':family==='product'?root+'assets/subpages/features/'+productHero+'.png':root+'assets/subpages/v2/'+asset+'.png';
 let cutout=root+'assets/subpages/v2/'+asset+'.png';
 const mockupKey=page.path.slice(1).replace(/\.asp$/,'').replaceAll('/','-').toLowerCase();
 let productMockup;
 try{await fs.access('assets/subpages/mockups/'+mockupKey+'.png');productMockup=root+'assets/subpages/mockups/'+mockupKey+'.png';if(family==='product')cutout=productMockup;}catch{}
 if(family==='company'&&page.path.endsWith('/about.asp')){
  $('.about__list .img img').each((i,e)=>$(e).attr('src',root+'assets/subpages/v2/'+['platform','company','consult'][i]+'.png'));
 }
 if(family==='product'){
  if(page.path==='/product/nonprofit/intro.asp')$('#functions').addClass('sb-nonprofit-functions');
  $('.youtb_btn').each((i,e)=>{$(e).find('img').remove();$(e).addClass('cta sb-product-cta');});
  $('.amaranth10>div:has(.cont_txt):has(.img),.pms .revers_wrap>div:has(.cont_txt):has(.img)').addClass('sb-feature');
  $('.contWrap .img').each((i,e)=>{
   const img=$(e).find('img').first();if(!img.length)return;
   img.addClass('sb-cutout sb-section-screen');
   $(e).html(img.toString());
  });
  $('img').not('.sb-section-screen').each((i,e)=>{
   const img=$(e);if(img.closest('.youtb_btn').length||/icon|logo|arr/i.test(img.attr('src')||''))return;
   img.addClass('sb-cutout sb-section-screen');
   img.replaceWith(`<div class="sb-generated-panel">${img.toString()}</div>`);
  });
  $('.sb-original').remove();
  if(page.path.startsWith('/product/wehago/')){
   $('.sb-section-screen').each((i,e)=>{
    const img=$(e),src=img.attr('src')||'';
    const file=src.startsWith(root)?src.slice(root.length):src;
    const dimensions=imageDimensions[file];
    const small=dimensions&&Math.max(...dimensions)<=240;
    const photo=/\.jpe?g(?:$|\?)/i.test(src);
    if(!small&&!photo)return;
    const region=img.closest('li').length?img.closest('li'):img.closest('.contWrap>div,.swiper-slide,section');
    const label=region.find('h3,h4,h5,strong,b').first().text()||region.text();
    img.attr('src',root+'assets/subpages/features/'+featureIcon(label)+'.png').removeClass('sb-cutout sb-section-screen').addClass(photo?'sb-wehago-illustration':'sb-wehago-icon');
   });
  }
  if(page.path==='/product/oneai.asp'){
   $('#usage').addClass('sb-oneai-usage');
   $('.sb-section-screen').each((i,e)=>$(e).attr('src',root+'assets/subpages/oneai-hq/image-'+i+'.png'));
  }
  $('.js-video').addClass('cta sb-product-cta');
  $('a').each((i,e)=>{
   const a=$(e);
   if(a.closest('.sb-product-tabs').length)return;
   if(/도입문의|문의하기|상담 신청|체험 신청|신청하기|다운로드|리플[릿렛].*보기/.test(a.text().trim()) || a.is('.inline-flex.cursor-pointer')){
    a.addClass('cta sb-product-cta');
    a.find('img,.sb-section-visual,.sb-screen-mockup').remove();
   }
  });
 }
 if(page.path==='/purchase/bsnss_inquiry.asp')$('.img_box').first().remove();
 if(['/purchase/seminar.asp','/purchase/amavideo.asp','/purchase/service.asp'].includes(page.path))$('.photo_list').addClass('sb-gallery-four');
 const siblings=menu.filter(m=>m.code.length===4&&m.code.startsWith(code.slice(0,2))&&destinations.has(m.url));
 const nav=siblings.map(m=>`<a ${m.url===page.path?'aria-current="page"':''} href="${local(m.url)}" target="_blank" rel="noopener noreferrer">${escape(m.title)}</a>`).join('');
 const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | 아이원소프트뱅크</title><link rel="icon" href="${root}assets/favicon.png"><link rel="stylesheet" href="${root}renewal/skin.css"><script src="${root}renewal/skin.js" defer></script></head><body class="sb-renewal" data-preview="true"><header class="sb-header"><a href="${root}index.html" target="_blank" rel="noopener noreferrer"><img src="${root}assets/logo-footer.png" alt="아이원소프트뱅크"></a><a href="${'../'.repeat(depth)}index.html">서브페이지 전체보기 <span>↗</span></a></header><aside class="sb-preview">공개 페이지 기반 디자인 미리보기 · 등록·로그인·검색은 기존 사이트에서 이용할 수 있습니다. <a href="${origin+page.path}" target="_blank" rel="noopener noreferrer">기존 페이지 열기 ↗</a></aside><section class="sb-hero"><div><p>${escape(group)}</p><h1>${escape(title)}</h1><nav aria-label="관련 메뉴">${nav}</nav></div></section><main class="sb-content" id="main-content">${$.html()}</main><footer class="sb-footer"><img src="${root}assets/logo-footer.png" alt="아이원소프트뱅크"><div>${original('#footer .ft__05').html()||''}</div><a href="${local('/company/privacy.asp')}" target="_blank" rel="noopener noreferrer">개인정보취급방침</a><a href="${local('/company/clause.asp')}" target="_blank" rel="noopener noreferrer">이용약관</a></footer><dialog class="sb-preview-dialog"><p>공개 페이지 기반 미리보기입니다. 이 기능은 기존 사이트에서 이용할 수 있습니다.</p><a href="${origin+page.path}" target="_blank" rel="noopener noreferrer">기존 페이지 열기 ↗</a><button type="button">닫기</button></dialog></body></html>`;
 await fs.mkdir(path.dirname('subpages/'+out),{recursive:true});
 const hasProductLogo=family==='product'&&heroCutout.includes('/logos/');
 const rendered=html.replace('<body class="sb-renewal"',`<body class="sb-renewal sb-v2 sb-${family} sb-page-${mockupKey}${hasProductLogo?' sb-product-logo':''}"`).replace('<section class="sb-hero"><div>',`<section class="sb-hero"><div>${family!=='product'||hasProductLogo?`<img class="sb-hero-asset" src="${heroCutout}" alt="">`:''}`)
  .replace(/<header class="sb-header">[\s\S]*?<\/header>/,sharedMarkup('.site-header',root))
  .replace(/<aside class="sb-preview">[\s\S]*?<\/aside>/,'')
  .replace(/<footer class="sb-footer">[\s\S]*?<\/footer>/,sharedMarkup('#soft-bank-renewal>footer',root)+sharedMarkup('.legal-modal',root))
  .replace('<link rel="stylesheet"',`<link rel="stylesheet" href="${root}styles.css"><link rel="stylesheet"`)
  .replace('<body class=',`<body class=`).replace(/(<body[^>]*>)/,'$1<div id="soft-bank-renewal">')
  .replace(`${root}renewal/skin.css"`,`${root}renewal/skin.css?v=20260915-3"`)
  .replace(`${root}renewal/skin.js"`,`${root}renewal/skin.js?v=20260915-3"`)
  .replace('</head>',family==='product'?`<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script><script src="${root}renewal/product-motion.js?v=20260915-3" defer></script></head>`:'</head>')
  .replace('</body>',`</div><script src="${root}app.js" defer></script></body>`);
 const finalPage=load(rendered);
 finalPage('a[href]').each((i,e)=>{
  const a=finalPage(e);const href=a.attr('href')||'';
  try{
   const url=new URL(href,origin+page.path);
   if(url.origin===origin&&destinations.has(url.pathname))a.attr('href',local(url.pathname)+url.search+url.hash);
  }catch{}
  if(!/^(https?:|\/\/|tel:|mailto:)/i.test(a.attr('href')))a.removeAttr('target rel');
 });
 for(let attempt=0;;attempt++){
  try{await fs.writeFile('subpages/'+out,finalPage.html());break;}
  catch(error){if(!['UNKNOWN','EBUSY','EPERM'].includes(error.code)||attempt>=5)throw error;await new Promise(resolve=>setTimeout(resolve,300*(attempt+1)));}
 }
 report.push({path:page.path,preview:out,title,group,textHash:hash,textIdentical:before===after,images:$('img').length,forms});
}
await fs.writeFile('renewal/content-audit.json',JSON.stringify(report,null,2));
for(const [key,p] of [['privacy','/company/privacy.asp'],['terms','/company/clause.asp']]){
 const $=load(await fs.readFile('reference/pages/'+inventory.find(e=>e.path===p).file,'utf8'));
 const content=$('#pageTop').next();content.find('script,style').remove();
 await fs.writeFile(`renewal/${key}.html`,content.html());
}
const groups=[...new Set(report.map(p=>p.group))];
await fs.writeFile('subpages/index.html',`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>서브페이지 리뉴얼 | 아이원소프트뱅크</title><link rel="stylesheet" href="../renewal/skin.css"></head><body class="sb-renewal"><header class="sb-header"><a href="../index.html"><img src="../assets/logo-footer.png" alt="아이원소프트뱅크"></a></header><section class="sb-hero"><div><p>아이원소프트뱅크</p><h1>서브페이지 리뉴얼</h1><p>공개 페이지 기반 디자인 미리보기</p></div></section><main class="sb-content sb-catalog">${groups.map(g=>`<section><h2>${escape(g)}</h2><div>${report.filter(p=>p.group===g).map(p=>`<a href="${p.preview}" target="_blank" rel="noopener noreferrer"><span>${escape(p.title)}</span><small>${p.path}</small><b>↗</b></a>`).join('')}</div></section>`).join('')}</main></body></html>`);
console.log(`Built ${report.length} pages. Text comparison: all identical.`);
