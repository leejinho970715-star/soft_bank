import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

const version='20261021-2';
const productVersion='20261022-12';
const native=JSON.parse(await fs.readFile('assets/proposal-native-20261020/manifest.json','utf8'));
const assets=new Map(native.map(asset=>[path.basename(asset.file,'.png'),asset]));
const normalize=text=>text.replace(/\s+/g,' ').trim();
// Product menu names match the English product tabs on the product pages.
const name=text=>({'위하고':'WEHAGO','아마란스 10':'Amaranth10','Amaranth 10':'Amaranth10','아마란스 10 비영리':'Amaranth10 비영리','아마란스 10(비영리)':'Amaranth10 비영리','Amaranth 10 비영리':'Amaranth10 비영리','Amaranth 10(비영리)':'Amaranth10 비영리'})[normalize(text)];
const keywordGroups={
 '근태관리':['근태리더기 연동','교대근무','유연근무','모바일출퇴근'],
 'BOM관리':['생산관리','생산계획','공정수불관리','외주관리'],
 '요소별 원가계산':['원가관리','제조원가현황'],
 '재고평가':['구매자재관리','온라인쇼핑몰관리','견적관리','주문관리','출고관리','API연동 (사방넷)','자동환율관리','수입선적관리','시리얼 발행 추적','바코드 관리','프로그램 연동개발']
};
// Area hashtags shown with the OmniEsol tag style on Amaranth 10 and its nonprofit edition.
const areaTags={
 '회계관리':['지출결의','결산','부가가치세관리','금융서비스연동(CMS)','그룹재무제표','자동전표처리','반제처리','자금수지계획','법인세관리','자금일보'],
 '그룹웨어':['경비청구','업무용승용차','공유문서','대표메일','게시판','문서중앙화','업무관리','프로젝트현황','보안관리']
};
// On the Amaranth 10 회계관리 and 그룹웨어 pages (and the same rows on the nonprofit page) each hashtag goes under the one feature it best represents.
const rowTags={
 '자동전표처리':['자동전표처리'],'전표/장부관리':['반제처리'],'결산/재무제표관리':['결산'],'사용자정의 재무제표관리':['그룹재무제표'],
 '자금관리':['자금수지계획','자금일보'],'금융서비스 연동':['금융서비스연동(CMS)'],'세무신고자동화':['부가가치세관리','법인세관리'],'예산관리':['지출결의'],
 '메인포털':['보안관리'],'전자결재':['경비청구','업무용승용차'],'전자메일':['대표메일'],'게시판':['게시판'],
 '업무관리(KISS)':['업무관리','프로젝트현황'],'KEEP':['공유문서','문서중앙화']
};
const tagRow=($,label,words)=>{const row=$('<div class="tag-row sb-area-tags"></div>').attr('aria-label',label+' 관련 키워드');words.forEach(word=>row.append($('<span class="tag"></span>').text('#'+word)));return row;};
const areaTagRow=($,area)=>{const row=$('<div class="tag-row sb-area-tags"></div>').attr('aria-label',area+' 관련 키워드');areaTags[area].forEach(word=>row.append($('<span class="tag"></span>').text('#'+word)));return row;};
const serviceGroups=[
 ['경영관리',[['회계관리',19],['급여관리',20],['물류관리',21],['법인조정',22],['개인조정',23],['전자세금계산서',24],['타임머신','clock']]],
 ['협업서비스',[['메신저',5],['화상회의',6],['거래처관리',8],['연락처',10],['메일',11],['일정관리',12],['할일관리',13],['노트',14],['팩스',16],['문자','sms'],['회사게시판',17],['내PC원격접속','remote']]],
 ['업무생산성',[['전자결재',27],['웹스토리지','storage'],['웹오피스','office'],['근태관리',26],['WE CRM','crm'],['WE PMS',25]]],
 ['부가서비스',[['매출채권팩토링','factoring'],['법인카드','card'],['개인카드','card-personal'],['경비현황분석','analytics'],['WE빌더','builder']]],
 ['전문가연계서비스',[['T edge','edge'],['경영현황','analytics'],['거래내역관리',28],['인사관리',20],['채권채무관리','ledger']]]
];

async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}
async function writePage(file,html){for(let attempt=0;;attempt++){try{return await fs.writeFile(file,html);}catch(error){if(attempt>=8||!['UNKNOWN','EBUSY','EPERM'].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}}}
function screen($,key,root,alt){
 const asset=assets.get(key);if(!asset)throw new Error('Missing native screen '+key);
 const figure=$('<figure class="sb-unframed-screen sb-proposal-native-screen" data-screen-presentation="unframed" data-screen-content="complete"></figure>');
 figure.attr({'data-proposal-native':key,style:'--sb-screen-ratio:'+asset.width/asset.height+';--sb-preview-ratio:'+asset.width/asset.height+';--sb-preview-height:516px;--sb-preview-padding:0px'});
 const link=$('<a class="sb-screen-zoom"></a>').attr({href:root+asset.file,'aria-label':alt+' 크게 보기'});
 link.append($('<img class="sb-flat-screen" loading="lazy">').attr({src:root+asset.file,alt,width:asset.width,height:asset.height,'data-quality-source':asset.file}));
 return figure.append(link);
}
function serviceDirectory($,root){
 const section=$('<section class="sb-wehago-service-directory" id="wehago-service-directory" aria-labelledby="wehago-service-directory-title"><h2 id="wehago-service-directory-title">위하고(WEHAGO) 서비스 한눈에 보기</h2></section>');
 for(const [label,items] of serviceGroups){
  const article=$('<article class="sb-wehago-service-group"></article>').append($('<h3></h3>').text(label));
  const list=$('<ul></ul>');
  for(const [text,icon] of items){
   const file=typeof icon==='number'?assets.get('service-'+icon).file:'assets/service-icons/'+icon+'.svg';
   list.append($('<li></li>').append($('<img alt="" aria-hidden="true" width="28" height="28" loading="lazy">').attr('src',root+file)).append($('<span></span>').text(text)));
  }
  section.append(article.append(list));
 }
 return section;
}
function applyProducts($,file,root){
 $('.sb-hero-products a').each((i,e)=>{
  const link=$(e),href=link.attr('href')||'';
  const text=href.includes('/amaranth10/')?'Amaranth10':href.includes('/wehago/')?'WEHAGO':href.includes('/nonprofit/')?'Amaranth10 비영리':null;
  if(text)link.children('span').length?link.children('span').text(text):link.text(text);
 });
 let korean='',english='';
 if(file.includes('/product/amaranth10/')){korean='아마란스 10';english='Amaranth 10';}
 if(file.includes('/product/nonprofit/')){korean='아마란스 10 비영리';english='Amaranth 10';}
 if(file.includes('/product/wehago/')){korean='위하고';english='WEHAGO';}
 if(file.endsWith('/product/omniesol.html')){korean='옴니솔';english='OmniEsol';}
 if(korean){
  $('.sb-hero h1').text(korean+' ('+english+')');$('.sb-product-heading h2').text(korean);
  if(!$('title').text().includes(korean))$('title').text(korean+' | '+$('title').text());
 }
 $('.wehago_01 .cont_txt h5').each((i,e)=>{const text=normalize($(e).text());if(!text.includes('위하고'))$(e).text(text.replace(/WEHAGO/g,'위하고(WEHAGO)'));});
 $('.wehago_01 .cont_txt p').each((i,e)=>{const text=normalize($(e).text());if(text.startsWith('WEHAGO '))$(e).text(text.replace(/^WEHAGO/,'위하고(WEHAGO)'));});
 $('.sb-zigzag-feature').each((i,e)=>{
  const copy=$(e).children('.sb-feature-copy').first();
  const label=normalize(copy.children('b,strong').first().text());
  const words=keywordGroups[label];if(!words||copy.children('.sb-feature-keywords').length)return;
  const list=$('<ul class="sb-feature-keywords"></ul>').attr('aria-label',label+' 관련 키워드');
  words.forEach(word=>list.append($('<li></li>').text('#'+word)));
  const action=copy.children('a,button,.sb-screen-actions').first();action.length?action.before(list):copy.append(list);
 });
 if(file.includes('/product/nonprofit/'))$('.np-features .sb-zigzag-feature>.sb-feature-copy').each((i,e)=>{
  const copy=$(e),area=normalize(copy.children('b').first().text());
  if(areaTags[area]&&!copy.children('.sb-area-tags').length)copy.append(areaTagRow($,area));
 });
 if(/\/product\/(amaranth10\/(overview|brand)|nonprofit\/intro)\.html$/.test(file))$('.sb-zigzag-feature>.sb-feature-copy').each((i,e)=>{
  const copy=$(e),label=normalize(copy.children('b').first().text()),words=rowTags[label];
  if(!words||copy.children('.sb-area-tags').length)return;
  const action=copy.children('a,button,.sb-screen-actions').first();action.length?action.before(tagRow($,label,words)):copy.append(tagRow($,label,words));
 });
 if(file.endsWith('/product/omniesol.html')){
  // GSP and GEN AI DEWS drop their large illustrations and show the copy in a lavender content box.
  $('.omniesol .section').filter((i,e)=>$(e).find('img[src*="omniesol-custom/group"],img[src*="omniesol-custom/chatbot"]').length).each((i,e)=>{
   $(e).children('.sec-visual').remove();$(e).addClass('sb-omni-text-band');
  });
  // Banner chips and every tag read as hashtags.
  $('.omniesol .band .chips>.chip,.omniesol .tag-row>.tag').each((i,e)=>{const text=normalize($(e).text());if(!text.startsWith('#'))$(e).text('#'+text);});
 }
 if(!file.includes('/product/wehago/'))return;
 const first=$('.wehago_01 figure').first();
 if(first.length){
  first.replaceWith(screen($,'wehago-portal',root,'위하고(WEHAGO) 실제 통합 업무 포털 화면'));
  const copy=$('.wehago_01 .swiper-slide').first().children('.txt');
  copy.children('strong').first().text('위하고에서 시작하는 통합 업무환경');
  copy.children('p').remove();
  copy.children('strong').first().after('<p>회계·급여·물류와 메신저·화상회의 등 업무 서비스를 하나의 플랫폼에서 연결합니다.</p><p>웹과 모바일에서 필요한 업무와 정보를 확인하고 협업할 수 있습니다.</p>');
 }
 // The all-in-one overview repeated the same accounting image a third time.
 $('.wehago_04 .img').remove();$('.wehago_04 .swiper-slide').addClass('sb-wehago-text-overview');
 $('.sb-wehago-service-directory').remove();$('main').append(serviceDirectory($,root));
 if(!file.endsWith('/wehago/smart_A10.html'))return;
 const replacements=[
  ['자동 회계 처리 기능','wehago-accounting','위하고 Smart A10 매출마감·전자발행·전표처리 실제 화면'],
  ['초보자에겐 쉽고, 전문가에겐 편리한 입력 기능','wehago-input','위하고 Smart A10 출고 입력 화면'],
  ['업무에 맞춰 설정하는 출고 입력 화면','wehago-input','위하고 Smart A10 출고 입력 화면'],
  ['원스톱 물류흐름분석','wehago-logistics','위하고 Smart A10 매출이익·재고수불·출고 연계 실제 화면']
 ];
 $('.sb-zigzag-feature').each((i,e)=>{
  const row=$(e),copy=row.children('.sb-feature-copy'),heading=copy.children('strong').first();
  const entry=replacements.find(([title])=>normalize(heading.text())===title);if(!entry)return;
  row.find('figure').first().replaceWith(screen($,entry[1],root,entry[2]));
  if(entry[1]==='wehago-input'){
   heading.text('업무에 맞춰 설정하는 출고 입력 화면');
   copy.children('p').remove();
   heading.after('<p>전체재고와 창고재고를 입력 화면에서 바로 확인</p><p>부서·사원·창고 등 코드 표시 항목을 업무에 맞게 설정</p><p>견적·수주·출고지시서 등 참조문서와 연결해 업무 흐름 확인</p>');
  }
  if(entry[1]==='wehago-accounting'){
   heading.text('물류 마감부터 세금계산서·회계전표까지');
   copy.children('p').remove();
   heading.after('<p>매출마감 내역과 거래처별 합계금액을 한 화면에서 확인</p><p>전자발행 및 전표처리 상태를 조회해 미처리 건 점검</p><p>물류 자료를 회계전표·세금계산서 처리로 연결</p>');
  }
 });
}
function applyHome($,root){
 $('link[href*="home-device-mockups/layout.css"]').remove();
 $('head').append('<link rel="stylesheet" href="'+root+'assets/home-device-mockups/layout.css?v=20261021-5">');
 $('.products .product').each((i,e)=>{
  const article=$(e),link=article.children('a').first();
  const isAmaranth=(link.attr('href')||'').includes('amaranth10/brand');
  if(!isAmaranth&&!(link.attr('href')||'').includes('wehago/smart_A10'))return;
  const family=isAmaranth?'amaranth':'wehago',display=isAmaranth?'아마란스 10 · Amaranth 10':'위하고 · WEHAGO';
  article.removeClass('reveal');article.find('.title>span').first().text(display);
  const pair=$('<span class="sb-home-product-screens sb-home-device-mockup"></span>');
  if(!isAmaranth)pair.addClass('sb-home-device-wehago');
  pair.append($('<img loading="lazy">').attr({src:root+'assets/home-device-mockups/'+family+'-pc-mobile.svg?v=20261021-3',width:1800,height:isAmaranth?1180:830,alt:display+' 실제 화면을 담은 PC·모바일 전체 프레임 목업'}));
  link.empty().append(pair);
 });
 const popover=$('.quick-popover');
 if(popover.length){
  popover.addClass('open').attr('aria-hidden','false');
  const items=[['.phone','phone'],['.online','headset'],['.kakao','kakao'],['.chat-link','chat']];
  items.forEach(([selector,icon])=>popover.find(selector+' img').attr('src',root+'assets/quick-flat/'+icon+'.svg?v=20261021-1'));
  popover.find('.anonymous img').attr('src',root+'assets/quick-flat/anonymous.svg?v=20261021-1');
  if(!popover.find('.anonymous').length){
   // Temporary working destination. Replace only this href with the future Google/Naver form URL.
   popover.append('<a class="right-quick-item anonymous" href="'+root+'subpages/purchase/inquiry.html?source=anonymous-quick-menu"><img src="'+root+'assets/quick-flat/anonymous.svg?v=20261021-1" alt="익명 구매문의"><span class="quick-detail">익명 구매문의</span></a>');
  }
  $('.quick-fab').attr({'aria-expanded':'true','aria-label':'퀵메뉴 닫기'}).find('b').text('×');
 }
}
let changed=0;
for(const file of ['index.html',...await walk('subpages'),...await walk('renewal')]){
 const source=await fs.readFile(file,'utf8');if(!source.includes('id="soft-bank-renewal"'))continue;
 const $=load(source),normalized=file.replaceAll('\\','/'),root='../'.repeat(normalized.split('/').length-1);
 $('.site-header .gnb-checklist').remove();
 $('.site-header .lnb a').each((i,e)=>{const link=$(e),text=name(link.text());if(text)link.text(text);});
 if(normalized.includes('subpages/product/'))applyProducts($,normalized,root);
 if(normalized==='index.html')applyHome($,root);
 $('link[href*="styles.css"]').each((i,e)=>$(e).attr('href',($(e).attr('href').split('?')[0])+'?v='+version));
 $('link[href*="products-figma.css"]').each((i,e)=>$(e).attr('href',($(e).attr('href').split('?')[0])+'?v='+productVersion));
 $('script[src]').each((i,e)=>{const script=$(e),src=script.attr('src');if(/(?:^|\/)app\.js(?:\?|$)/.test(src))script.attr('src',src.split('?')[0]+'?v='+version);});
 const html=normalized.includes('subpages/product/')?$.html().replace(/[\t ]+$/gm,''):$.html();if(source!==html){await writePage(file,html);changed++;}
}
console.log('October website revisions applied to '+changed+' pages.');
