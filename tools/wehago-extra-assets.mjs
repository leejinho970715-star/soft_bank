export function applyWehagoExtraAssets($,root){
 const entries={
  '매출채권팩토링':['factoring','거래처에 재화나 서비스제공으로 발생된 외상매출채권을<br>실시간 회계 빅데이터를 활용하여<br>조기에 현금화하는 서비스'],
  'WE CRM':['crm','회사의 영업방식과 목표를 설정하여<br>영업을 효율적으로 관리할 수 있습니다.'],
  'WE PMS':['pms','프로젝트 관리에 최적화된 서비스로<br>업무생산성을 향상시킬 수 있습니다.'],
  '경비청구 - 법인카드':['corporate','법인카드 내역을 이젠 PC와 모바일에서 확인!<br>카드사 연동을 통한 정확한 내역 관리로<br>샐 틈 없는 법인카드관리'],
  '경비청구 - 개인카드':['personal','엑셀 업로드나 직접 입력을 통해<br>간편하게 사용하는 쉬운 개인경비청구'],
 };
 $('.wehago_01 .swiper-slide>.txt,.wehago_03 .inner>.txt').each((i,e)=>{
  const txt=$(e),label=txt.children('strong').text().trim(),entry=entries[label];
  if(!entry)return;
  const [file,description]=entry;
  txt.children('b').html(description);
  txt.siblings('.img').find('img').first().attr({src:root+'assets/subpages/wehago-extra/'+file+'.png',width:1536,height:1024,alt:label+' 첨부 화면 3D 목업'});
 });
 $('.wehago_01>.cont_txt>h5').html('회사에 필요한 서비스를<br>WEHAGO 서비스마켓에서 확인하세요.');
 $('.wehago_01>.cont_txt>p').html('더욱 효율적인 업무환경을 제공하기 위해<br>다양한 서비스가 추가됩니다');
 $('.wehago_04 .txt>b').html('우리 회사의 모든 업무가<br>하나로 연결');
}
