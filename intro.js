(() => {
 const startIntro=()=>{
  const root=document.getElementById('soft-bank-renewal');
  if(!root||document.body.classList.contains('sb-renewal'))return;
  try{if(sessionStorage.getItem('softbank-intro-seen'))return;}catch{}
  const overlay=document.createElement('section');overlay.className='site-intro';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','아이원소프트뱅크 소개 영상');
  const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/NUXrXvrez80?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&enablejsapi=1&origin='+encodeURIComponent(location.origin);frame.title='아이원소프트뱅크 소개 영상';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';frame.tabIndex=-1;
  const skip=document.createElement('button');skip.type='button';skip.className='intro-skip';skip.textContent='SKIP →';skip.setAttribute('aria-label','인트로 건너뛰고 메인페이지 보기');
  const caption=document.createElement('p');caption.className='intro-caption';caption.textContent='아이원소프트뱅크 · 영상을 건너뛰려면 SKIP을 눌러주세요';
  overlay.append(frame,caption,skip);document.body.append(overlay);root.inert=true;document.body.classList.add('intro-open');skip.focus({preventScroll:true});
  let player=null,closed=false;
  const previousReady=window.onYouTubeIframeAPIReady;
  const close=()=>{if(closed)return;closed=true;try{sessionStorage.setItem('softbank-intro-seen','1')}catch{}player?.destroy();overlay.remove();root.inert=false;document.body.classList.remove('intro-open');document.removeEventListener('keydown',key);if(window.onYouTubeIframeAPIReady===apiReady)window.onYouTubeIframeAPIReady=previousReady;root.setAttribute('tabindex','-1');root.focus({preventScroll:true});};
  const key=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();skip.focus()}};
  skip.addEventListener('click',close);document.addEventListener('keydown',key);
  overlay.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const x=Math.max(70,Math.min(innerWidth-70,e.clientX+22));const y=Math.max(36,Math.min(innerHeight-36,e.clientY+22));skip.style.left=x+'px';skip.style.top=y+'px';skip.classList.add('is-following');});
  const initializePlayer=()=>{
    if(closed||player)return;
    player=new window.YT.Player(frame,{events:{
      onReady:event=>{if(!closed){event.target.mute();event.target.playVideo();}},
      onStateChange:event=>{if(event.data===window.YT.PlayerState.ENDED)close();},
      onError:close
    }});
  };
  function apiReady(){try{previousReady?.();}finally{initializePlayer();}}
  if(window.YT?.Player)initializePlayer();
  else{
    window.onYouTubeIframeAPIReady=apiReady;
    if(!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')){
      const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;document.head.append(script);
    }
  }
 };
 // Announcements precede the video so two modal layers never compete for focus.
 if(!document.querySelector('#soft-bank-renewal > main > .hero')||document.body.classList.contains('sb-renewal'))return;
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const storageKey='sb-holiday-notice-2026-09-hidden';
 let hidden=false;try{hidden=localStorage.getItem(storageKey)===today();}catch{}
 if(hidden){startIntro();return;}
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
 notice.addEventListener('close',()=>{document.body.classList.remove('sb-notice-open');notice.remove();startIntro();},{once:true});
 document.body.classList.add('sb-notice-open');notice.showModal();close.focus();
})();
