import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Proofreading pass from the final site review (2026-10-23): typos, spacing and product-name spelling.
// Runs on visible text and accessible labels only, so URLs and file names stay as they are.
// Every rule must be safe to run again on already corrected pages.
const everywhere=[
 // Product names use the spaced spelling; file names such as "Amaranth10_..." are left alone.
 [/Amaranth10(?![\w%.])/g,'Amaranth 10'],
 [/K-IFRS18 대응 가이드/g,'K-IFRS 제1118호 대응 가이드'],
 [/IFRS18(?![\w%.])/g,'IFRS 18'],
 [/(^|[^\[])Amaranth 10\] 일월계표/g,'$1[Amaranth 10] 일월계표'],
 [/\[전표승인해제\]은/g,'[전표승인해제]는'],
 [/메뉴이며기본/g,'메뉴이며 기본'],
 [/결재문서기본/g,'결재문서 기본'],
 [/WEHAGO서비스/g,'WEHAGO 서비스'],
 [/하나의플랫폼/g,'하나의 플랫폼'],
 [/메신저,화상회의/g,'메신저, 화상회의'],
 [/한 눈에/g,'한눈에'],
 [/구애 받지/g,'구애받지'],
 // Footer contact lines and copyright.
 [/iCUBE \/ G20 : 1877-0840(?! · 블루멤버십)/g,'iCUBE / G20 : 1877-0840 · 블루멤버십 : 1600-4208 · 테스트 계정 신청 : 070-4497-3388'],
 [/COPYRIGHT © 2024 DOUZONE BIZON\./g,'COPYRIGHT © 2026 아이원소프트뱅크㈜.']
];
const pages={
 'index.html':[[/대한민국 기업체 최적화된/g,'대한민국 기업에 최적화된'],[/체험 하러가기/g,'체험하러 가기']],
 'subpages/company/about.html':[[/전부 유통 네트워크/g,'전국 유통 네트워크'],[/고객에 최대한/g,'고객에게 최대한']],
 'subpages/company/headquarters.html':[[/120여 학원의 540여/g,'120여 학원 및 540여'],[/약 250여개사/g,'250여 개사'],[/250여개사/g,'250여 개사'],[/더존 디지털 웨어/g,'더존디지털웨어'],[/남산면수동리/g,'남산면 수동리'],[/강촌 캠퍼스/g,'강촌캠퍼스']],
 'subpages/company/location.html':[[/구로디지털단지 역/g,'구로디지털단지역'],[/\[17-752\]/g,'(17-752)'],[/\[우12345\]/g,'[우08381]']],
 'subpages/product/amaranth10/brand.html':'groupware',
 'subpages/product/nonprofit/intro.html':[[/홈텍스/g,'홈택스'],[/원천세·종합소득세/g,'원천세·법인세'],[/협업의 요구사항/g,'현업의 요구사항']],
 'subpages/product/amaranth10/hr.html':[[/협업의 요구사항/g,'현업의 요구사항']],
 'subpages/product/amaranth10/lm.html':[[/고객 별/g,'고객별'],[/실시간데이터/g,'실시간 데이터'],[/시스템화 합니다/g,'시스템화합니다'],[/국내 거래 건의/g,'해외(수출입) 거래 건의']],
 'subpages/product/omniesol.html':[[/ERP과/g,'ERP와'],[/리스입대차/g,'리스임대차'],[/수익성분결산/g,'수익성분석결산'],[/수익성분계획/g,'수익성분석계획'],[/레포팅/g,'리포팅'],[/저장없이/g,'저장 없이'],[/DEWS 개발도구 화면 서비스 화면/g,'DEWS 개발도구 서비스 화면']],
 'subpages/product/wehago/smart_A10.html':[[/WEHAGO는 세무신고 특화형/g,'Smart A10은 세무신고 특화형'],[/이력등을/g,'이력 등을'],[/보호 할/g,'보호할'],[/경험 할/g,'경험할'],[/리플렛/g,'리플릿']],
 'subpages/product/wehago/extraservice.html':[[/동계제공/g,'통계제공'],[/서비스를위하고/g,'서비스를 위하고']],
 'subpages/product/wehago/linkedservice.html':[[/수임료\/미납대금 전자결재/g,'수임료/미납대금 전자결제'],[/WEHAGO T 와/g,'WEHAGO T와'],[/법인카드,개인카드서비스/g,'법인카드, 개인카드 서비스'],[/법인카드,개인카드/g,'법인카드, 개인카드']],
 'subpages/product/wehago/cooperation.html':[[/결제문서 자동생성/g,'결재문서 자동생성'],[/Wi-Fi을/g,'Wi-Fi를'],[/컨텐츠/g,'콘텐츠'],[/보호 할/g,'보호할'],[/ *, *(?=주간|월간|목록|목적별|프로젝트별)/g,', ']],
 'subpages/product/pms.html':[[/진행율/g,'진행률'],[/결제 진행 상황/g,'결재 진행 상황'],[/(시각화하여|확인하고|제공하여|높이고),(?=\S)/g,'$1, ']],
 'subpages/product/oneai.html':[[/일일히/g,'일일이'],[/실시간 통역/g,'실시간 번역'],[/소장 작성을(\s*)자동으로 작성/g,'소장을$1자동으로 작성'],[/형식으로보내기/g,'형식으로 내보내기'],[/문서를 보고 형식으로/g,'문서를 보고서 형식으로'],[/\(계정별, 거래처\)/g,'(계정별, 거래처별)'],[/디지털화 하고자/g,'디지털화하고자'],[/공간 입니다/g,'공간입니다'],[/더존ATEC/g,'더존 ATEC']],
 'subpages/customer/faq.html':[[/전표를 재정렬합니다/g,'전표를 대사합니다']],
 'subpages/customer/customer_etc.html':[[/2025 \/10\/23/g,'2025/10/23']],
 'subpages/member/join.html':'member',
 'subpages/member/yak.html':'member',
 'subpages/member/find.html':[[/가입시 입력하신 이름을 입력해주세요\./g,'가입 시 입력하신 이름, 이메일을 입력해주세요.'],[/가입시 입력하신/g,'가입 시 입력하신']]
};
const shared={
 groupware:[[/개인 일정 뿐만/g,'개인 일정뿐만'],[/전자메일로 부터/g,'전자메일로부터'],[/전자팩스의 SMS/g,'전자팩스와 SMS'],[/구성원에서 공유/g,'구성원과 공유']],
 member:[[/이메일 알람 설정은 '수신 허용'으로/g,"이메일 알림 설정은 '수신'으로"]]
};
pages['subpages/product/nonprofit/intro.html'].push(...shared.groupware);
for(const [page,rules] of Object.entries(pages))if(typeof rules==='string')pages[page]=shared[rules];

const fix=(text,rules)=>rules.reduce((value,[pattern,replacement])=>value.replace(pattern,replacement),text);
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}

let changed=0;
for(const file of ['index.html',...await walk('subpages'),...await walk('renewal')]){
 const normalized=file.replaceAll('\\','/'),rules=[...everywhere,...(pages[normalized]||[])];
 const source=await fs.readFile(file,'utf8');
 if(!rules.some(([pattern])=>{pattern.lastIndex=0;return pattern.test(source);})&&!normalized.endsWith('company/location.html')&&!normalized.endsWith('member/join.html')&&!normalized.endsWith('member/yak.html'))continue;
 const $=load(source);let edits=0;
 const visit=node=>{for(const child of node.children||[]){
  if(child.type==='text'){const next=fix(child.data,rules);if(next!==child.data){child.data=next;edits++;}}
  else if(child.type==='tag'&&!['script','style'].includes(child.name))visit(child);
 }};
 visit($.root()[0]);
 $('[alt],[title],[aria-label],[data-image-caption],meta[name=description],meta[property="og:title"],meta[property="og:description"]').each((i,e)=>{for(const attr of ['alt','title','aria-label','content','data-image-caption']){const value=$(e).attr(attr);if(value==null||(attr==='content'&&e.name!=='meta'))continue;const next=fix(value,rules);if(next!==value){$(e).attr(attr,next);edits++;}}});
 // The third phone box is the last four digits, not the middle ones.
 $('#join-field-8').each((i,e)=>{for(const attr of ['title','aria-label'])if($(e).attr(attr)==='연락처 가운데 자리 입력'){$(e).attr(attr,'연락처 마지막 자리 입력');edits++;}});
 // 오시는 길: list the real contact lines instead of a single 대표전화.
 $('.sub_location b, b').filter((i,e)=>normalized.endsWith('company/location.html')&&$(e).text().trim()==='연락처').each((i,e)=>{const p=$(e).nextAll('p').first();if(p.text().trim()==='대표전화 1600-4208'){p.html('구매상담문의 1877-0256<br>고객센터 1877-1859<br>iCUBE / G20 1877-0840<br>블루멤버십 1600-4208<br>테스트 계정 신청 070-4497-3388');edits++;}});
 if(!edits)continue;
 await fs.writeFile(file,$.html());changed++;
}
console.log(`Text corrections applied to ${changed} pages`);
