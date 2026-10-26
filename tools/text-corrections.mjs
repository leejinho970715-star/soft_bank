import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// Proofreading pass from the final site review (2026-10-23): typos, spacing and product-name spelling.
// Runs on visible text and accessible labels only, so URLs and file names stay as they are.
// Every rule must be safe to run again on already corrected pages.
const everywhere=[
 [/검색어를 입력 하세요/g,'검색어를 입력하세요'],
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
 [/보호방침’이 작용됩니다/g,'보호방침’이 적용됩니다'],
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
// Second proofreading pass (2026-10-26).
const W='\\s+';
const more={
 'subpages/product/amaranth10/brand.html':[[/사용중인 모든 화면/g,'사용 중인 모든 화면']],
 'subpages/product/pms.html':[[/핵심 지표를 시각적 확인/g,'핵심 지표를 시각적으로 확인'],[/확장가능한 기능/g,'확장 가능한 기능']],
 'subpages/product/wehago/cooperation.html':[[/팀간 캘린더/g,'팀 간 캘린더'],[/참조중인 업무/g,'참조 중인 업무'],[/직원간 지식/g,'직원 간 지식'],[/주고 받을 수/g,'주고받을 수'],[/원격접속 할 PC/g,'원격접속할 PC'],[/제한없이/g,'제한 없이']],
 'subpages/product/wehago/extraservice.html':[[/우리회사/g,'우리 회사'],[/도 한번에/g,'도 한 번에']],
 'subpages/product/wehago/linkedservice.html':[[/우리회사/g,'우리 회사'],[/확인하고 바로처리/g,'확인하고 바로 처리'],[/절차없는/g,'절차 없는']],
 'subpages/company/headquarters.html':[[/\[우24465\] 강원도 춘천시/g,'[우24465] 강원특별자치도 춘천시']],
 'subpages/customer/faq.html':[[/업로드 할 수/g,'업로드할 수']],
 'subpages/member/join.html':[[/만들어 주세요, 첫글자는/g,'만들어 주세요. 첫 글자는'],[/첫번째 자리/g,'첫 번째 자리']],
 'subpages/member/yak.html':[[/만들어 주세요, 첫글자는/g,'만들어 주세요. 첫 글자는'],[/첫번째 자리/g,'첫 번째 자리']],
 'subpages/amaranth10/notice.html':[[/계정과목[ \u00a0]별([ \u00a0])분개/g,'계정과목별$1분개'],[/분개[ \u00a0]별([ \u00a0])증빙/g,'분개별$1증빙']],
 'subpages/articles/amaranth10__notice__541.html':[[/계정과목[ \u00a0]별([ \u00a0])분개/g,'계정과목별$1분개']],
 'subpages/articles/amaranth10__notice__539.html':[[/분개[ \u00a0]별([ \u00a0])증빙/g,'분개별$1증빙']],
 'subpages/articles/government__promotion__5498.html':[[/컨텍센터/g,'컨택센터']],
 'subpages/articles/government__promotion__5204.html':[[/아마란스10/g,'아마란스 10'],[/\(회계,인사,예산\)/g,'(회계, 인사, 예산)']],
 'subpages/articles/government__promotion__5201.html':[[/더존프로모션게시글입니다/g,'더존프로모션 게시글입니다']],
 'subpages/articles/government__notice__865.html':[[/접수 메뉴얼/g,'접수 매뉴얼']],
 'subpages/articles/government__notice__4207.html':[[/2026년 3월 18\(수\)/g,'2026년 3월 18일(수)'],[/비즈오케이\(biz\.incheon\.go\.kr\)을/g,'비즈오케이(biz.incheon.go.kr)를']],
 'subpages/articles/government__notice__4304.html':[[/더존 아이원소프트뱅크 입니다/g,'더존 아이원소프트뱅크입니다'],[/별도 신청시/g,'별도 신청 시']],
 'subpages/articles/customer__notice__2820.html':[[/Window OS와/g,'Windows OS와'],[/OS 구분없이/g,'OS 구분 없이']],
 'subpages/articles/customer__notice__4226.html':[[/"douzone\.com"도메인/g,'"douzone.com" 도메인']],
 'subpages/articles/customer__notice__4519.html':[[/스팸 메일을 클릭으로 인해/g,'스팸 메일 클릭으로 인해']],
 'subpages/articles/customer__notice__5502.html':[[/오후 18시/g,'오후 6시']],
 'subpages/articles/bizbox__pds__93.html':[[/클릭후 운영체제 맞게/g,'클릭 후 운영체제에 맞게'],[/2\.다운받은파일을/g,'2. 다운받은 파일을'],[/4\.설치완료후/g,'4. 설치 완료 후'],[/로그인후/g,'로그인 후']],
 'renewal/privacy.html':[[/수집 시에(\s+)동의 받은/g,'수집 시에$1동의받은'],[/운영하는데 이용되는/g,'운영하는 데 이용되는']],
 'renewal/terms.html':[
  [new RegExp('이용자'+W+'와 회사','g'),'이용자와 회사'],[/동의 하는 것으로/g,'동의하는 것으로'],[/소재 지를/g,'소재지를'],
  [new RegExp('더존고객회원'+W+'은','g'),'더존고객회원은'],[/적은후/g,'적은 후'],[/등록 되어 있는/g,'등록되어 있는'],[/지적 재산권에 의해 보호(\s*)$/g,'지적 재산권에 의해 보호됩니다.$1'],
  [new RegExp('서비스로'+W+'의 교체','g'),'서비스로의 교체'],[/고 의\/과실/g,'고의/과실'],[/제8조에 규정한 이용자 의무/g,'제9조에 규정한 이용자 의무'],[/상실 시키기로/g,'상실시키기로'],
  [/부여 합니다/g,'부여합니다'],[/서비 스 이용의사/g,'서비스 이용의사'],[/있습니 다/g,'있습니다'],[/탈퇴시까지로/g,'탈퇴 시까지로'],[/안정성확보에/g,'안전성 확보에'],[/요금정산등/g,'요금정산 등'],
  [/기간동안/g,'기간 동안'],[/신용 정보집중기관/g,'신용정보집중기관'],[/4\.회사는 다음 각호에/g,'4. 회사는 다음 각 호에'],[/해서는 안됩니다/g,'해서는 안 됩니다'],[/하여서는 안됩니다/g,'하여서는 안 됩니다'],
  [/게시 하거나/g,'게시하거나'],[/제공 받는 것에/g,'제공받는 것에'],[/제 3자의/g,'제3자의'],[/사전 통지없이/g,'사전 통지 없이'],[/제 한, 정지/g,'제한, 정지'],[/지지 아니 합니다/g,'지지 아니합니다']
 ]
};
for(const [page,rules] of Object.entries(more))pages[page]=[...(pages[page]||[]),...rules];


// 개인정보처리방침 (약관 팝업, 회원가입, 구매상담, 제휴문의): fix the errors carried over from the original policy text.
// Applied to the HTML source because some sentences span inline tags.
const privacyPages=new Set(['renewal/privacy.html','subpages/member/yak.html','subpages/purchase/inquiry.html','subpages/purchase/bsnss_inquiry.html']);
const privacy=[
 [/\(" 회사 " 또는 "아이원소프트뱅크"라 함\)은/g,'("회사" 또는 "아이원소프트뱅크"라 함)는'],
 [/정보통신망 이용촉진 및 정보 보호 등에/g,'정보통신망 이용촉진 및 정보보호 등에'],
 [/고 충을/g,'고충을'],
 [/두고 있습니다 있습니다\./g,'두고 있습니다.'],
 [/게시함을 게시함을 알려드립니다 알려드립니다\./g,'게시함을 알려드립니다.'],
 [/목적이외의/g,'목적 이외의'],
 [/참여기회 제공,인구통계학적/g,'참여기회 제공, 인구통계학적'],
 [/개인정보를 수집시에/g,'개인정보를 수집 시에'],
 [/동의일로부터 지체 없이 파기까지/g,'동의일로부터 파기 시까지'],
 [/보존기간 :/g,'보존 기간 :'],
 [/아이원소프트뱅크 정보주체의 동의/g,'아이원소프트뱅크는 정보주체의 동의'],
 [/개인정보처리 위탁\(확인필요\)/g,'개인정보처리 위탁'],
 [/위탁받는자의/g,'위탁받는 자의'],
 [/제공받는 자의 보유·이용기간\s*:\s*지체\s*없이 파기/g,'위탁받는 자의 보유·이용기간 : 지체 없이 파기'],
 [/위탁계약 종료시 까지/g,'위탁계약 종료 시까지'],
 [/위탁계약 체결시/g,'위탁계약 체결 시'],
 [/기술적\?관리적/g,'기술적·관리적'],
 [/관리\?감독/g,'관리·감독'],
 [/신원이노베이션은/g,'아이원소프트뱅크는'],
 [/(^|>|\s)키란 웹사이트/g,'$1쿠키란 웹사이트'],
 [/회사은\(는\)/g,'회사는'],
 [/방문 회수/g,'방문 횟수'],
 [/개인 맞춤 서비스 제공 귀하는/g,'개인 맞춤 서비스 제공. 귀하는'],
 [/설정방법 : 예\(인터넷 익스플로어의 경우\) =&gt; 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보/g,'설정방법 : 예(Chrome의 경우) =&gt; 웹 브라우저 우측 상단의 더보기(⋮) &gt; 설정 &gt; 개인정보 보호 및 보안 &gt; 서드 파티 쿠키'],
 [/개인정보의 파기 아이원소프트뱅크 주식회사은/g,'아이원소프트뱅크 주식회사는'],
 [/이용자가 입력한 입력한 정보는 정보는 보유기간이 보유기간이 경과했거나 경과했거나 처리목적이 처리목적이 달성된 달성된 후\s+내부 방침 및 관련 법령에 법령에 따라 파기합니다 파기합니다\s*\./g,'이용자가 입력한 정보는 보유기간이 경과했거나 처리목적이 달성된 후 내부 방침 및 관련 법령에 따라 파기합니다.'],
 [/아이원소프트뱅크 주식회사은/g,'아이원소프트뱅크 주식회사는'],
 [/아이원소프트뱅크은/g,'아이원소프트뱅크는'],
 [/최소화 하여/g,'최소화하여'],
 [/이용자의 개인정보는 비밀번호는 암호화 되어/g,'이용자의 개인정보 중 비밀번호는 암호화되어'],
 [/암호화 하거나/g,'암호화하거나'],
 [/별도 보안기능을 사용하고 있습니(?!다)/g,'별도 보안기능을 사용하고 있습니다.'],
 [/아이원소프트뱅크 주식회사 별개의 기관으로서/g,'아이원소프트뱅크 주식회사와는 별개의 기관으로서'],
 // Current contact details of the relief agencies.
 [/▶ 개인정보 분쟁조정위원회 \(한국인터넷진흥원 운영\)(\s*<\/span>[\s\S]*?- 홈페이지 : )privacy\.kisa\.or\.kr(\s*<br>\s*- 전화 : \(국번없이\) )118/g,'▶ 개인정보 분쟁조정위원회$1www.kopico.go.kr$21833-6972'],
 [/▶ 대검찰청 사이버범죄수사단 : 02-3480-3573 \(www\.spo\.go\.kr\)/g,'▶ 대검찰청 사이버수사과 : (국번없이) 1301 (www.spo.go.kr)'],
 [/▶ 경찰청 사이버범죄수사단 : 1566-0112 \(www\.netan\.go\.kr\)/g,'▶ 경찰청 사이버수사국 : (국번없이) 182 (ecrm.police.go.kr)']
];

// 이용약관 (약관 팝업, 회원가입 약관 동의): the terms were written for 더존비즈온's site; they name 아이원소프트뱅크 and its site.
const termsPages=new Set(['renewal/terms.html','subpages/member/yak.html']);
const S='\\s+';
const terms=[
 [/더존비즈온의 웹서비스 이용약관은/g,'아이원소프트뱅크의 웹서비스 이용약관은'],
 [/\(주\)더존비즈온\(이하 “회사”라 한다\)(이|가)/g,'아이원소프트뱅크(주)(이하 “회사”라 한다)가'],
 [new RegExp('서비스제공 웹사이트는'+S+'더존ICT그룹 홈페이지'+S+'\\(www\\.douzone\\.com\\)와'+S+'더존고객센터 홈페이지\\(http://help\\.douzone\\.com\\)를 포함합니다\\.','g'),'서비스제공 웹사이트는 아이원소프트뱅크 홈페이지(www.duzon119.co.kr)를 포함합니다.'],
 [new RegExp('이용자는'+S+'더존고객센터 홈페이지\\(http://help\\.douzone\\.com\\)에서'+S+'회원가입 후 서비스를 이용하는'+S+'더존고객'+S+'회원과','g'),'이용자는 아이원소프트뱅크 홈페이지(www.duzon119.co.kr)에서 회원가입 후 서비스를 이용하는 회원과'],
 [/더존고객회원\s*은/g,'회원은'],
 [/더존비즈온 자체개발 콘텐츠 : 더존비즈온 저작권 소유/g,'아이원소프트뱅크 자체개발 콘텐츠 : 아이원소프트뱅크 저작권 소유'],
 [/더존비즈온에서 서비스 하는/g,'아이원소프트뱅크에서 서비스하는'],
 [/더존비즈온 ‘개인정보 보호방침’이/g,'아이원소프트뱅크 ‘개인정보 처리방침’이']
];
const fix=(text,rules)=>rules.reduce((value,[pattern,replacement])=>value.replace(pattern,replacement),text);
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}

let changed=0;
for(const file of ['index.html',...await walk('subpages'),...await walk('renewal')]){
 const normalized=file.replaceAll('\\','/'),rules=[...everywhere,...(pages[normalized]||[])];
 const original=await fs.readFile(file,'utf8'),source=fix(fix(original,privacyPages.has(normalized)?privacy:[]),termsPages.has(normalized)?terms:[]);
 if(source===original&&!rules.some(([pattern])=>{pattern.lastIndex=0;return pattern.test(source);})&&!normalized.endsWith('company/location.html')&&!normalized.endsWith('member/join.html')&&!normalized.endsWith('member/yak.html'))continue;
 const $=load(source);let edits=0;
 const visit=node=>{for(const child of node.children||[]){
  if(child.type==='text'){const next=fix(child.data,rules);if(next!==child.data){child.data=next;edits++;}}
  else if(child.type==='tag'&&!['script','style'].includes(child.name))visit(child);
 }};
 visit($.root()[0]);
 $('[alt],[title],[aria-label],[placeholder],[data-image-caption],meta[name=description],meta[property="og:title"],meta[property="og:description"]').each((i,e)=>{for(const attr of ['alt','title','aria-label','placeholder','content','data-image-caption']){const value=$(e).attr(attr);if(value==null||(attr==='content'&&e.name!=='meta'))continue;const next=fix(value,rules);if(next!==value){$(e).attr(attr,next);edits++;}}});
 // A closing parenthesis was captured inside a link (government notice 865): keep it as text after the link.
 $('a[href="https://www.mssmiv.com)/"]').each((i,e)=>{const a=$(e);a.attr('href','https://www.mssmiv.com/');a.find('u').text('http://www.mssmiv.com');a.after(')');edits++;});
 // FAQ 1:1 문의하기: the old /board/bbs_inquiry.asp answers with a server error; use the existing site's 구매상담 page for now.
 $('a[href="https://www.duzon119.co.kr/board/bbs_inquiry.asp"]').each((i,e)=>{$(e).attr('href','https://www.duzon119.co.kr/purchase/inquiry.asp');edits++;});
 // The third phone box is the last four digits, not the middle ones.
 $('#join-field-8').each((i,e)=>{for(const attr of ['title','aria-label'])if($(e).attr(attr)==='연락처 가운데 자리 입력'){$(e).attr(attr,'연락처 마지막 자리 입력');edits++;}});
 // 오시는 길: list the real contact lines instead of a single 대표전화.
 $('.sub_location b, b').filter((i,e)=>normalized.endsWith('company/location.html')&&$(e).text().trim()==='연락처').each((i,e)=>{const p=$(e).nextAll('p').first();if(p.text().trim()==='대표전화 1600-4208'){p.html('구매상담문의 1877-0256<br>고객센터 1877-1859<br>iCUBE / G20 1877-0840<br>블루멤버십 1600-4208<br>테스트 계정 신청 070-4497-3388');edits++;}});
 if(!edits&&source===original)continue;
 await fs.writeFile(file,$.html());changed++;
}
console.log(`Text corrections applied to ${changed} pages`);
