export function applyAmaranthAssets($,root,{nonprofit=false}={}){
 const entries=[
  [nonprofit?'.brand08':'.brand06','board','화상회의 화면과 모바일 참여 화면 3D 목업'],
  ['.brand07','tasks','Amaranth 10 업무관리와 모바일 업무 현황 3D 목업'],
  ['.brand009','sharing','문서 공유와 메모를 활용하는 스마트워크 3D 목업'],
  ['.brand11','ecosystem','Amaranth 10 ERP·그룹웨어·문서관리 통합 구성도 3D 목업'],
  ['.overview03','closing','Amaranth 10 자동결산과 결산분개 내역 3D 목업'],
  ['.overview04','statements','Amaranth 10 사용자정의 재무제표와 포괄손익계산서 3D 목업'],
  ['.overview07','banking','Amaranth 10 금융자금 이체와 전표발행 3D 목업'],
  ['.overview08','tax','Amaranth 10 세무신고 작성과 전자신고 검증 3D 목업'],
  ['.overview009','budget','Amaranth 10 프로젝트별 실행예산 편성 3D 목업'],
 ];
 for(const [section,file,alt] of entries){
  $('.amaranth10 '+section+' > .img img').attr({src:root+'assets/subpages/amaranth-custom/'+file+'.png',alt,width:'1536',height:'1024'}).addClass('sb-amaranth-custom');
 }
}
