import fs from 'node:fs/promises';
import {load} from 'cheerio';

// Build from the shared product shell so navigation, footer and contact UI stay consistent.
const $=load(await fs.readFile('subpages/product/omniesol.html','utf8'));
$('title').text('IFRS18 | Amaranth 10 | 아이원소프트뱅크');
$('head').append('<meta name="description" content="기존 전표는 그대로, IFRS18 기준 재무제표 전환은 간편하게. Amaranth 10의 재무제표 양식설정, 계정별 범주설정, 현금흐름표 기능을 만나보세요."><link rel="stylesheet" href="../../renewal/ifrs18.css">');
$('body').removeClass('sb-page-product-omniesol').addClass('sb-page-product-ifrs18');
$('.sb-hero-asset').attr({src:'../../assets/subpages/ifrs18/hero.png',alt:'Amaranth 10 IFRS18 재무관리 3D 비주얼',width:'1536',height:'1024'});
$('.sb-hero h1').text('Amaranth 10 IFRS18');
$('.sb-hero-description').html('새로운 기준의 시작,<br>복잡한 전환을 간편하게');
$('.sb-hero-products a').removeAttr('aria-current').filter((i,e)=>$(e).text()==='IFRS18').attr('aria-current','page');
const picture=(name,alt)=>`<picture><source type="image/webp" srcset="../../assets/subpages/ifrs18/${name}.webp"><img src="../../assets/subpages/ifrs18/${name}.png" alt="${alt}" loading="lazy" width="940" height="575"></picture>`;
const features=[
 ['01','format','재무제표 양식설정','새 기준에 맞는 양식을 손쉽게','합계잔액시산표, 재무상태표, 재무성과표의 기본 서식을 제공합니다. 영업·투자·재무 범주에 따라 계산식과 계정과목 연결을 설정해 회사에 맞는 양식으로 구성하세요.','기초 서식 생성 · 계산식 설정 · 계정과목 연결'],
 ['02','categories','계정별 범주설정','기존 전표는 그대로, 비교 자료는 새롭게','과거 전표와 초기이월 자료를 IFRS18 계정 체계로 재분류합니다. 건별 분할과 일괄 매핑을 지원하며, 원천 전표의 관리항목은 유지됩니다.','전표·초기이월 분류 · 건별 분할 · 일괄 매핑'],
 ['03','cashflow','현금흐름표','영업손익을 기준으로 이어지는 현금흐름','영업활동 현금흐름의 간접법 계산은 영업손익에서 시작합니다. 재무성과표의 영업손익을 연결하고, 집계에 사용할 양식과 그룹을 설정할 수 있습니다.','영업손익 연동 · 양식 연결 · 집계 그룹 설정']
];
$('main').attr('class','sb-content ifrs-content').html(`
<section class="ifrs-intro">
 <span class="ifrs-eyebrow">STANDARD · EASY · SMART · COMPLIANCE</span>
 <h2>재무제표의 새로운 기준,<br><em>준비는 지금부터</em></h2>
 <p>계정과목 재분류부터 재무제표 작성까지.<br>Amaranth 10이 IFRS18 전환 업무를 하나의 흐름으로 연결합니다.</p>
 <div class="ifrs-actions"><a class="cta dark" href="../purchase/inquiry.html">도입 상담하기</a><a class="cta ifrs-outline" href="#ifrs-resources">소개 자료 보기</a></div>
</section>
<section class="ifrs-benefits" aria-label="IFRS18 서비스 특장점">
 ${[['finance','기존 전표는 그대로','마감된 전표를 직접 수정하지 않고 IFRS18 계정과목으로 분류해 이원화 관리합니다.'],['tasks','분류 업무는 간편하게','투자·재무 계정을 지정하고 건별 또는 일괄 매핑으로 반복 업무를 줄입니다.'],['storage','표준 양식으로 빠르게','기본 서식을 생성한 뒤 회사에 맞게 계산식과 계정 연결을 조정합니다.']].map(([icon,title,copy])=>`<article><img src="../../assets/subpages/features/${icon}.png" alt="" loading="lazy" width="128" height="128"><h3>${title}</h3><p>${copy}</p></article>`).join('')}
</section>
<section class="ifrs-change">
 <span class="ifrs-eyebrow">WHAT CHANGES</span><h2>더 명확해지는 재무성과 보고</h2>
 <p>IFRS18은 재무제표의 표시와 공시 기준을 개편합니다.<br>영업·투자·재무 범주와 정의된 중간합계로 기업의 성과를 더 명확하게 보여줍니다.</p>
 <div class="ifrs-categories"><span>영업</span><span>투자</span><span>재무</span><span>법인세</span><span>중단영업</span></div>
 <div class="ifrs-change-grid"><article><h3>재무성과표</h3><p>영업손익과 재무 및 법인세차감전손익 등 중간합계를 중심으로 손익 구조를 파악합니다.</p></article><article><h3>현금흐름표</h3><p>영업활동 간접법의 출발점이 영업손익으로 바뀌며 재무성과표와 연결됩니다.</p></article></div>
</section>
<section class="ifrs-process"><span class="ifrs-eyebrow">WORKFLOW</span><h2>설정부터 작성까지, 두 단계로</h2>
 <div class="ifrs-process-grid"><article><span>STEP 01</span><h3>양식·데이터 설정</h3><p>기본 서식을 생성하고 계정과목을 연결합니다. 비교기간 전표와 초기이월 자료의 범주를 지정합니다.</p><div class="ifrs-tags"><span>재무제표 양식설정</span><span>계정별 범주설정</span></div></article><article><span>STEP 02</span><h3>재무제표 조회·작성</h3><p>설정한 양식과 분류 자료를 기반으로 재무제표를 조회하고 비교 자료를 검토합니다.</p><div class="ifrs-tags"><span>합계잔액시산표</span><span>재무상태표</span><span>재무성과표</span><span>현금흐름표</span></div></article></div>
</section>
<section class="ifrs-features"><span class="ifrs-eyebrow">CORE FEATURES</span><h2>실무를 위한 세 가지 핵심 기능</h2>
 ${features.map(([n,img,label,title,copy,tags])=>`<article class="ifrs-feature"><span class="ifrs-eyebrow">${n} / ${label}</span><h3>${title}</h3><p>${copy}</p><div class="ifrs-tags">${tags.split(' · ').map(t=>`<span>${t}</span>`).join('')}</div><a class="ifrs-screen" href="../../assets/subpages/ifrs18/${img}.png" aria-label="${label} 실제 화면 크게 보기">${picture(img,`Amaranth 10 ${label} 실제 서비스 화면`)}</a><small>실제 서비스 화면 · 선택하면 원본 크기로 볼 수 있습니다.</small></article>`).join('')}
</section>
<section class="ifrs-ready"><span class="ifrs-eyebrow">GET READY</span><h2>2027년 적용을 향한 준비</h2><div class="ifrs-timeline"><article><span>2024.04</span><h3>IFRS18 발표</h3><p>국제회계기준위원회가 새로운 표시·공시 기준을 발표했습니다.</p></article><article><span>전환 준비</span><h3>비교 자료 정비</h3><p>적용 시점에 앞서 재무제표 양식과 비교기간의 계정 분류를 점검하세요.</p></article><article><span>2027.01.01~</span><h3>시행</h3><p>IFRS18은 해당 날짜 이후 시작하는 연차 보고기간부터 적용되며 조기 적용이 허용됩니다.</p></article></div><a class="ifrs-source" href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-18-presentation-and-disclosure-in-financial-statements/">IFRS Foundation 공식 기준 안내 ↗</a></section>
<section id="ifrs-resources" class="ifrs-resources"><span class="ifrs-eyebrow">RESOURCES</span><h2>더 자세한 내용이 궁금하다면</h2><p>서비스 소개와 실제 설정 방법을 확인하세요.</p><div class="ifrs-downloads"><a href="../../assets/documents/ifrs18-intro.pdf" download><span>서비스 소개서</span><strong>Amaranth 10 IFRS18</strong><span>PDF 다운로드 ↓</span></a><a href="../../assets/documents/ifrs18-manual.pdf" download><span>사용자 매뉴얼</span><strong>K-IFRS18 대응 가이드</strong><span>PDF 다운로드 ↓</span></a></div></section>
<section class="ifrs-contact"><h2>IFRS18 전환,<br>Amaranth 10과 함께 준비하세요</h2><p>우리 회사에 맞는 도입 범위와 준비 과정을 안내해 드립니다.</p><a class="cta dark" href="../purchase/inquiry.html">도입 상담 신청</a></section>`);
await fs.writeFile('subpages/product/ifrs18.html',$.html());
const catalog=load(await fs.readFile('subpages/index.html','utf8'));
catalog('.sb-catalog section').filter((i,e)=>catalog(e).find('h2').text().includes('제품')).first().children('div').append('<a href="product/ifrs18.html"><span>IFRS18</span><small>Amaranth 10 IFRS18</small><b>↗</b></a>');
await fs.writeFile('subpages/index.html',catalog.html());
console.log('Built IFRS18 product page and catalog entry.');
