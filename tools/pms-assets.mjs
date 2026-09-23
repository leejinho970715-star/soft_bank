import fs from 'node:fs';
const screens=JSON.parse(fs.readFileSync('assets/subpages/pms-screens/manifest.json','utf8'));
const regenerated=JSON.parse(fs.readFileSync('assets/subpages/regenerated/manifest.json','utf8'));
const features=[
 ['현황관리',['재고 및 장비 관리','프로젝트별 진행률 현황관리','프로젝트별 추정손익 관리','목표대비 실적 관리','예산대비 실적현황 관리']],
 ['운영관리',['프로젝트별 청구 관리','프로젝트별 수주잔고 관리','프로젝트별 이슈 관리']],
 ['계약관리',['프로젝트별 계약관리','프로젝트별 견적관리','프로젝트별 목표관리']],
 ['예산관리',['프로젝트별 예산관리','프로젝트별 실행내역 관리','발생비용 집계관리','투입원가관리']],
 ['일정관리',['작업일보 관리','작업스케줄 관리','작업진척에 따른 일정관리']],
];
const extensions=[
 ['프로젝트 관리',['프로젝트 수행을 한눈에 파악하고 팀 간 협업을 원활하게 지원하는 프로젝트 관리 기능을 제공합니다.']],
 ['자산관리',['차량, 건물, 비품 등 조직의 물리적 자산을 효과적으로 추적하고 관리합니다.']],
 ['인건비 및 급여 관리',['직원들의 인건비와 급여를 효율적으로 계산하고 관리합니다.']],
 ['현금관리',['사업 거래의 현금 흐름을 효과적으로 관리하여 신속한 의사결정을 지원합니다.']],
 ['재고 및 판매 관리',['제품 및 자재의 입출고 현황, 재고 수준을 모니터링하며 판매 정보를 효과적으로 관리합니다.']],
];
export function applyPmsAssets($,root){
 const labels=['대시보드','계약현황','계약관리','프로젝트현황','진행상황','GW 전자결재','예약관리','주요 기능 업무 흐름'];
 $('main img').each((i,el)=>{
  const img=$(el),index=screens.findIndex(s=>(img.attr('src')||'').endsWith(s.source+'.png'));
  if(index<0)return;
  const screen=screens[index],asset=regenerated['assets/subpages/pms-screens/'+screen.name+'.png'];
  const base=asset?root+asset.file.replace(/\.png$/,''):root+'assets/subpages/pms-screens/'+screen.name;
  img.attr({src:base+'.png',width:asset?.width||screen.width,height:asset?.height||screen.height,alt:'더존 PMS '+labels[index]+' 화면'});
  const frame=img.closest('.sb-laptop-mockup');
  if(screen.name==='workflow')frame.replaceWith(img.removeClass('sb-section-screen').addClass('sb-pms-workflow'));
  else frame.addClass('sb-pms-screen-mockup');
  img.wrap('<picture class="sb-pms-screen-picture"></picture>');
  img.before($('<source type="image/webp">').attr('srcset',base+'.webp'));
  if(screen.name==='workflow'){
   const workflow=[
    ['PJT 기본정보',['계약정보등록','계약정보관리']],
    ['실행예산관리',['집행관리','예실대비현황','진행률 매출관리','하자관리']],
    ['자재/장비관리',['구매관리','외주관리','자재관리','장비관리','인적관리','안전재고관리']],
    ['운영관리',['정산보고','계약관리','청구관리','매출관리','손익관리','수주잔고관리','외주잔고관리']],
    ['현장관리',['작업일보','자재관리','사진대장','경비관리','장비관리','노무관리']],
    ['PJT 영업관리',['계약관리','납품관리','견적관리','제안관리','목표관리']],
    ['안전관리',['안전보건일지','안전교육대장','작업계획서','안전관리비현황','각종보고서']]
   ];
   const figure=$('<figure id="pms-project-workflow" class="sb-pms-workflow-3d"></figure>');
   figure.append($('<img loading="lazy">').attr({src:root+'assets/subpages/regenerated/pms-workflow-3d.png',alt:'PMS의 일곱 업무 단계를 연결하는 3D 아이콘'}));
   const caption=$('<figcaption></figcaption>');
   workflow.forEach(([title,items],i)=>{const section=$('<section></section>');section.append($('<span class="sb-workflow-number"></span>').text(i+1));section.append($('<h4></h4>').text(title));const list=$('<ul></ul>');items.forEach(item=>list.append($('<li class="sb-check-item"></li>').text(item)));caption.append(section.append(list));});
   figure.append(caption);img.closest('picture').replaceWith(figure);
 const stages=[['입고 등록',['자재 입고','바코드 부착']],['작업지시',['BOM 기반 작업지시','자재 소요량 계산','작업 순서 정의']],['자재 준비',['피킹 리스트 생성','자재 출고','자재 스캔 검증']],['가공작업',['작업 시작/완료','사용 자재 실적 등록','설비 연동','공정 간 자재 이동']],['품질검사',['중간/최종 검사','검사 결과 등록','불량 처리','재작업 관리']],['완제품 등록',['완제품 입고','바코드 부착','재고 반영']],['출하',['출하 계획','출하 검증','운송장 연동','출하 완료']]];
 const flow=$('<figure id="pms-manufacturing-workflow" class="sb-pms-workflow-3d sb-manufacturing-workflow"></figure>');
 flow.append($('<img loading="lazy">').attr({src:root+'assets/subpages/regenerated/manufacturing-workflow-3d.png',alt:'입고부터 출하까지 일곱 생산 단계를 연결하는 3D 업무 흐름도'}));
 const manufacturingCaption=$('<figcaption></figcaption>');
 stages.forEach(([title,items],i)=>{const card=$('<section></section>').append($('<span class="sb-workflow-number"></span>').text(i+1)).append($('<h4></h4>').text(title));const list=$('<ul></ul>');items.forEach(text=>list.append($('<li class="sb-check-item"></li>').text(text)));manufacturingCaption.append(card.append(list));});
 flow.prepend($('<h3></h3>').text('생산·출하 업무 흐름'));
 figure.after(flow.append(manufacturingCaption));
  }
 });
 function diagram(file,alt,entries){
  const figure=$('<figure class="sb-pms-diagram"></figure>');
  const [width,height]=file==='features'?[1769,889]:[1825,862];
  figure.append($('<img loading="lazy">').attr({src:root+'assets/subpages/pms-custom/'+file+'.png',alt,width,height}));
  const text=$('<figcaption class="sb-pms-diagram-details"></figcaption>');
  for(const [title,items] of entries){
   const card=$('<section></section>').append($('<h4></h4>').text(title));
   const list=$('<ul></ul>');
   items.forEach(item=>list.append($('<li></li>').text(item)));
   text.append(card.append(list));
  }
  return figure.append(text);
 }
 $('.pms .img_faetures .cont_img').removeClass('scrollTb').empty().append(diagram('features','PMS에서 현황·운영·계약·예산·일정 관리로 연결되는 3D 주요기능 구성도',features));
 const gw=$('.sb-gw-expansion');
 gw.children('.sb-pms-diagram').remove();
 gw.append(diagram('gw-expansion','GW를 중심으로 PM·CFOS·AWS·IMS 모듈과 다섯 업무 기능이 연결되는 3D 확장 구성도',extensions));
}
