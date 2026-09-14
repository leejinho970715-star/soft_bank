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
const pages=inventory.filter(p=>p.status===200);
const assetMap=JSON.parse(await fs.readFile('reference/asset-map.json','utf8'));
const faqData=JSON.parse(await fs.readFile('reference/faq-data.json','utf8'));
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
 const entry=menu.find(m=>m.url===page.path)||menu.find(m=>m.code===code.slice(0,4));
 const activeTab=$('a').filter((i,e)=>{try{return new URL($(e).attr('href'),origin+page.path).pathname===page.path}catch{return false}}).first().text().trim();
 const title=activeTab||entry?.title||$('h1,h2,h3,h4,strong').first().text().trim()||page.path;
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
   a.attr('href',url.origin===origin&&!url.search&&destinations.has(url.pathname)?local(url.pathname):url.href).attr('target','_blank').attr('rel','noopener noreferrer');
  }else if(!href){a.attr('href',origin+page.path).attr('target','_blank').attr('rel','noopener noreferrer');}
 });
 $('form').attr('data-preview-form','true');
 $('.amaranth10__list,.wehago__list').addClass('sb-product-tabs');
 $('table').wrap('<div class="sb-table-scroll" tabindex="0" aria-label="표 가로 스크롤"></div>');
 const after=cleanText($);
 if(before!==after)throw new Error('Content changed: '+page.path);
 const hash=crypto.createHash('sha256').update(before).digest('hex');
 const siblings=menu.filter(m=>m.code.length===4&&m.code.startsWith(code.slice(0,2))&&destinations.has(m.url));
 const nav=siblings.map(m=>`<a ${m.url===page.path?'aria-current="page"':''} href="${local(m.url)}" target="_blank" rel="noopener noreferrer">${escape(m.title)}</a>`).join('');
 const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | 아이원소프트뱅크</title><link rel="icon" href="${root}assets/favicon.png"><link rel="stylesheet" href="${root}renewal/skin.css"><script src="${root}renewal/skin.js" defer></script></head><body class="sb-renewal" data-preview="true"><header class="sb-header"><a href="${root}index.html" target="_blank" rel="noopener noreferrer"><img src="${root}assets/logo-footer.png" alt="아이원소프트뱅크"></a><a href="${'../'.repeat(depth)}index.html">서브페이지 전체보기 <span>↗</span></a></header><aside class="sb-preview">공개 페이지 기반 디자인 미리보기 · 등록·로그인·검색은 기존 사이트에서 이용할 수 있습니다. <a href="${origin+page.path}" target="_blank" rel="noopener noreferrer">기존 페이지 열기 ↗</a></aside><section class="sb-hero"><div><p>${escape(group)}</p><h1>${escape(title)}</h1><nav aria-label="관련 메뉴">${nav}</nav></div></section><main class="sb-content" id="main-content">${$.html()}</main><footer class="sb-footer"><img src="${root}assets/logo-footer.png" alt="아이원소프트뱅크"><div>${original('#footer .ft__05').html()||''}</div><a href="${local('/company/privacy.asp')}" target="_blank" rel="noopener noreferrer">개인정보취급방침</a><a href="${local('/company/clause.asp')}" target="_blank" rel="noopener noreferrer">이용약관</a></footer><dialog class="sb-preview-dialog"><p>공개 페이지 기반 미리보기입니다. 이 기능은 기존 사이트에서 이용할 수 있습니다.</p><a href="${origin+page.path}" target="_blank" rel="noopener noreferrer">기존 페이지 열기 ↗</a><button type="button">닫기</button></dialog></body></html>`;
 await fs.mkdir(path.dirname('subpages/'+out),{recursive:true});
 await fs.writeFile('subpages/'+out,html);
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
