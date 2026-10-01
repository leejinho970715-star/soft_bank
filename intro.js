(() => {
 // Show the home announcement without an introductory video overlay.
 if(!document.querySelector('#soft-bank-renewal > main > .hero')||document.body.classList.contains('sb-renewal'))return;
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const storageKey='sb-holiday-notice-2026-09-hidden';
 let hidden=false;try{hidden=localStorage.getItem(storageKey)===today();}catch{}
 if(hidden)return;
 const notice=document.createElement('dialog');notice.className='sb-home-notice';notice.setAttribute('aria-label','추석 휴무 안내: 9월 23일부터 9월 27일까지');
 const visual=document.createElement('div');visual.className='sb-notice-visual';
 const img=document.createElement('img');img.src='assets/holiday-notice.png';img.width=480;img.height=552;
 img.alt='추석 휴무 안내. 9월 23일부터 9월 27일까지 휴무입니다. Amaranth10, Alpha, icube 기능 및 기술지원 문의는 9월 23일 오후 3시까지 접수 가능합니다. 제품 및 서비스 구매 문의는 icsu@duzon119.co.kr로 접수 부탁드립니다. 아이원소프트뱅크.';
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
