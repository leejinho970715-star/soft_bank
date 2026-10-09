(() => {
 // Show the home announcement without an introductory video overlay.
 if(!document.querySelector('#soft-bank-renewal > main > .hero')||document.body.classList.contains('sb-renewal'))return;
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const storageKey='sb-ifrs18-notice-20261009-hidden';
 let hidden=false;try{hidden=localStorage.getItem(storageKey)===today();}catch{}
 if(hidden)return;
 const notice=document.createElement('dialog');notice.className='sb-home-notice';notice.setAttribute('aria-label','Amaranth 10 IFRS18 서비스 안내');
 const visual=document.createElement('a');visual.className='sb-notice-visual';visual.href='subpages/product/ifrs18.html';visual.setAttribute('aria-label','Amaranth 10 IFRS18 자세히 보기');
 const img=document.createElement('img');img.src='assets/subpages/ifrs18/home-modal-banner-20261009.png';img.width=1254;img.height=1254;
 img.alt='Amaranth 10. IFRS18 전환, 지금 준비하세요. 기존 전표는 그대로, 재무제표 전환은 간편하게. 재무제표 양식설정 · 계정별 범주설정 · 현금흐름표. 자세히 보기.';
 visual.append(img);
 const actions=document.createElement('div');actions.className='sb-notice-actions';
 const hide=document.createElement('button');hide.type='button';hide.textContent='오늘 하루 동안 열지 않기';
 const close=document.createElement('button');close.type='button';close.textContent='닫기';
 actions.append(hide,close);notice.append(visual,actions);document.body.append(notice);
 hide.addEventListener('click',()=>{try{localStorage.setItem(storageKey,today());}catch{}notice.close();});
 close.addEventListener('click',()=>notice.close());
 notice.addEventListener('close',()=>{document.body.classList.remove('sb-notice-open');notice.remove();},{once:true});
 document.body.classList.add('sb-notice-open');notice.showModal();close.focus();
})();
