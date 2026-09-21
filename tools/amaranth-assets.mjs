export function applyAmaranthAssets($,root){
 const entries=[
  ['.brand06','board','화상회의 화면과 모바일 참여 화면 3D 목업'],
  ['.brand07','tasks','Amaranth 10 업무관리와 모바일 업무 현황 3D 목업'],
  ['.brand009','sharing','문서 공유와 메모를 활용하는 스마트워크 3D 목업'],
  ['.brand11','ecosystem','Amaranth 10 ERP·그룹웨어·문서관리 통합 구성도 3D 목업'],
 ];
 for(const [section,file,alt] of entries){
  $('.amaranth10 '+section+' > .img img').attr({src:root+'assets/subpages/amaranth-custom/'+file+'.png',alt,width:'1536',height:'1024'}).addClass('sb-amaranth-custom');
 }
}
