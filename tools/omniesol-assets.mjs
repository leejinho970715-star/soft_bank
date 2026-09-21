export function applyOmniAssets($,root){
 const entries=[['연결된 구매',['procurement']],['입력은 최소화',['expense']],['제조현장의 모든',['manufacturing','dashboard']],['영업 시작부터',['sales']],['그룹사 업무 통합',['group']]];
 for(const [heading,files] of entries){
  const section=$('.omniesol .section').filter((i,e)=>$(e).find('h3').text().includes(heading)).first();
  const visual=section.children('.sec-visual');
  visual.empty().addClass('omni-custom-visual');
  if(files.length===2){section.addClass('omni-dual-section');visual.addClass('omni-dual-visual');}
  for(const file of files)visual.append($('<img loading="lazy" class="shot sb-design-mockup" width="1536" height="1024">').attr('src',root+'assets/subpages/omniesol-custom/'+file+'.png').attr('alt',({procurement:'공급사정보조회 3D 모니터 목업',expense:'경비청구작성 3D 모니터 목업',manufacturing:'설비가동분석 3D 모니터 목업',dashboard:'OmniEsol 통합 대시보드 3D 모니터 목업',sales:'영업진행현황 3D 모니터 목업',group:'OmniEsol로 연결되는 그룹사 통합 경영 3D 일러스트'})[file]));
 }
}
