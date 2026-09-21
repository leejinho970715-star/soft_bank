export function applyWehagoAssets($,root){
 const generated={'메일':'mail','일정관리':'calendar','할일관리':'tasks','노트':'notes','팩스':'fax','문자':'sms','근태관리':'attendance','전자결재':'approval','회사게시판':'board','내PC원격접속':'remote'};
 const swapped={'웹스토리지':['wehago-14.png',1391],'거래처관리':['wehago-13.png',1341],'연락처':['wehago-14.png',1391]};
 $('.wehago_03 .inner').each((i,e)=>{
  const section=$(e),label=section.children('.txt').children('strong').first().text().trim();
  const img=section.children('.img').find('img').first();
  if(swapped[label]){
   const [file,width]=swapped[label];
   img.attr({src:root+'assets/subpages/figma/'+file,width,height:1200});
  }
  if(generated[label])img.attr({src:root+'assets/subpages/wehago-custom/'+generated[label]+'.png',width:1536,height:1024,alt:label==='할일관리'?'첨부된 팩스 화면의 모니터·태블릿 3D 목업':label+' 3D 화면 목업'});
 });
}
