export function applyWehagoLinkedAssets($,root){
 const entries={'경영현황':'management','통장입·출금 현황':'banking','매출·매입 현황':'sales','신고/납부현황':'filing','청구서 조회 및 납부':'billing','경비현황분석':'expenses'};
 $('.wehago_01 .swiper-slide>.txt,.wehago_03 .inner>.txt').each((i,e)=>{
  const txt=$(e),label=txt.children('strong').text().trim(),file=entries[label];
  if(file)txt.siblings('.img').find('img').first().attr({src:root+'assets/subpages/wehago-linked/'+file+'.png',width:1536,height:1024,alt:label+' 첨부 화면 3D 목업'});
 });
}
