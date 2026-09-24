document.addEventListener('DOMContentLoaded',()=>{
 if(document.body.classList.contains('sb-product')){
  const dialog=document.createElement('dialog');
  dialog.className='sb-image-dialog';dialog.setAttribute('aria-label','제품 이미지 크게 보기');
  const close=document.createElement('button');close.type='button';close.className='sb-image-close';close.textContent='닫기 ×';
  const image=document.createElement('img');
  const caption=document.createElement('p');caption.className='sb-image-caption';
  dialog.append(close,image,caption);document.body.append(dialog);
  let trigger=null;
  const open=(img,source)=>{
   dialog.classList.toggle('sb-poster-dialog',source.dataset.imageModal==='poster');
   trigger=source;image.src=img.src;image.alt=img.alt||'제품 이미지';caption.textContent=image.alt;
   dialog.showModal();dialog.scrollTop=0;document.body.classList.add('sb-image-open');close.focus();
  };
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('sb-image-open');trigger?.focus({preventScroll:true});image.removeAttribute('src');});
  document.querySelectorAll('a[data-image-modal]').forEach(link=>{
   link.addEventListener('click',e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();open({src:link.href,alt:link.dataset.imageCaption||link.textContent.trim()},link);
   });
  });
  const zoomImages=[];
  document.querySelectorAll('.sb-content img,.sb-hero-asset').forEach(img=>{
   if(img.closest('button')||img.alt===''||img.closest('.sb-product-heading,.sb-contact-banner'))return;
   const link=img.closest('a');
   // Keep product navigation and download links; intercept image-file links only.
   if(link&&!/\.(png|webp|jpe?g|gif|svg)(?:[?#]|$)/i.test(link.href))return;
   const target=link||img;
   if(img.closest('.sb-content')&&!document.body.classList.contains('sb-page-product-oneai')&&!img.matches('.sb-page-product-nonprofit-intro .sb-nonprofit-hero,.sb-page-product-nonprofit-intro .sb-nonprofit-process .sb-process-icon,.sb-page-product-wehago-cooperation .wehago_02 img,.sb-page-product-wehago-extraservice .wehago_02 img'))zoomImages.push(img);
   if(!link){target.tabIndex=0;target.setAttribute('role','button');target.setAttribute('aria-label',(img.alt||'제품 이미지')+' 크게 보기');}
   target.classList.add('sb-image-trigger');target.setAttribute('aria-haspopup','dialog');
   target.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(img,target);});
   if(!link)target.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(img,target);}});
  });
  zoomImages.forEach(img=>{
   const button=document.createElement('button');button.type='button';button.className='sb-screen-view';button.textContent='화면 크게보기';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',(img.alt||'제품 이미지')+' 화면 크게보기');
   button.addEventListener('click',()=>open(img,button));
   const actions=document.createElement('div');actions.className='sb-screen-actions';
   let container=img.parentElement,video=null;
   while(container&&!container.matches('.sb-content')){
    const candidate=[...container.querySelectorAll('a')].find(a=>a.textContent.trim()==='영상으로 확인하기'||(document.body.matches('.sb-page-product-wehago-smart_a10,.sb-page-product-wehago-cooperation,.sb-page-product-wehago-extraservice,.sb-page-product-wehago-linkedservice')&&/^리플[릿렛]\s*자세히\s*보기$/.test(a.textContent.trim())));
    if(candidate&&zoomImages.filter(other=>container.contains(other)).length===1){video=candidate;break;}
    container=container.parentElement;
   }
   if(video){video.before(actions);actions.append(video,button);}
   else{
    const feature=img.closest('.sb-feature,.sb-centered-feature,.ifrs-feature');
    const copy=feature&&zoomImages.filter(other=>feature.contains(other)).length===1?feature.querySelector('.cont_txt,.txt,.sec-text'):null;
    if(copy)copy.append(actions);
    else{
     const visual=img.closest('figure,.img,.sb-laptop-mockup')||img.closest('a,picture')||img;
     visual.before(actions);
    }
    actions.append(button);
   }
  });

 }
 const syncWidth=()=>document.documentElement.style.setProperty('--product-viewport',document.documentElement.clientWidth+'px');
 syncWidth();window.addEventListener('resize',syncWidth);
 document.querySelectorAll('.sb-page-product-wehago-smart_a10 .wehago_02 .contBox .txt p').forEach(p=>p.classList.add('sb-check-item'));
 // Short headings remain on one line; longer headings wrap naturally.
 document.querySelectorAll('.sb-content h2,.sb-content h3,.sb-content h4,.sb-content h5,.sb-content .txt>strong').forEach(heading=>{
  if(heading.closest('.sb-product-heading,.sb-product-tabs'))return;
  heading.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
  heading.classList.add('sb-natural-title');
 });
 document.querySelectorAll('.sb-content .cont_txt,.sb-content .txt,.sb-content .sec-text,.sb-content .feature-box,.sb-content .sb-pms-diagram-details').forEach(container=>{
  const paragraphs=[...container.children].filter(el=>el.tagName==='P'&&el.textContent.trim()&&!el.querySelector('img,button'));
  if(paragraphs.length>=2&&paragraphs.every(el=>el.textContent.trim().length<100))paragraphs.forEach(el=>el.classList.add('sb-check-item'));
  container.querySelectorAll('li').forEach(el=>{if(!el.querySelector('img,ul,ol,h2,h3,h4,a')&&el.textContent.trim())el.classList.add('sb-check-item');});
 });
 document.fonts?.ready.then(()=>window.ScrollTrigger?.refresh());
 const tabs=[...document.querySelectorAll('.omniesol-nav [data-tab]')];
 const panels=[...document.querySelectorAll('.omniesol>.panel')];
 if(!tabs.length||!panels.length)return;
 const activate=(id)=>{
  tabs.forEach(t=>{const on=t.dataset.tab===id;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
  panels.forEach(p=>{const on=p.id==='panel-'+id;p.classList.toggle('active',on);p.hidden=!on;});
  window.ScrollTrigger?.refresh();
 };
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',e=>{e.preventDefault();activate(tab.dataset.tab);});
  tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();activate(next.dataset.tab);});
 });
 activate(tabs.find(t=>t.classList.contains('active'))?.dataset.tab||tabs[0].dataset.tab);
});
