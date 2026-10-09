document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.sb-inline-screen-gallery').forEach(figure=>{
  const tabs=[...figure.querySelectorAll('.sb-inline-screen-tabs [role="tab"]')],panels=[...figure.querySelectorAll('.sb-inline-screen-view')];
  const select=index=>{tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});};
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>select(index));
   tab.addEventListener('keydown',event=>{
    const keys={ArrowRight:(index+1)%tabs.length,ArrowLeft:(index-1+tabs.length)%tabs.length,Home:0,End:tabs.length-1};
    if(!(event.key in keys))return;event.preventDefault();select(keys[event.key]);tabs[keys[event.key]].focus();
   });
  });
 });
 if([...document.body.classList].some(name=>name.startsWith('sb-page-product-amaranth10-'))){
  const footer=document.querySelector('#soft-bank-renewal > footer');
  if(footer&&!document.querySelector('.sb-amaranth-ifrs-banner'))footer.insertAdjacentHTML('beforebegin',`
   <section class="sb-amaranth-ifrs-banner" aria-labelledby="sb-amaranth-ifrs-title">
    <div class="sb-amaranth-ifrs-copy">
     <span class="sb-amaranth-ifrs-label">K-IFRS 제1118호 대응</span>
     <h2 id="sb-amaranth-ifrs-title">2027년부터 손익계산서가 재무성과표로<br>바뀝니다.</h2>
     <p>전표 수정 없는 계정별 범주 재분류, 18호 기초서식 자동 생성, 영업손익 기준<br>현금흐름표까지 — Amaranth 10의 IFRS 18 재무제표관리를 확인해 보세요.</p>
    </div>
    <a class="sb-amaranth-ifrs-link" href="../ifrs18.html">IFRS 18 대응 자세히 보기</a>
   </section>`);
 }
 if(document.body.classList.contains('sb-product')){
  const dialog=document.createElement('dialog');
  dialog.className='sb-image-dialog';dialog.setAttribute('aria-label','제품 이미지 크게 보기');
  const close=document.createElement('button');close.type='button';close.className='sb-image-close';close.textContent='닫기 ×';
  const detail=document.createElement('button');detail.type='button';detail.className='sb-image-detail-toggle';detail.textContent='글자 확대';detail.hidden=true;detail.setAttribute('aria-pressed','false');
  const image=document.createElement('img');image.draggable=false;
  const crop=document.createElement('div');crop.className='sb-image-crop';crop.hidden=true;
  const caption=document.createElement('p');caption.className='sb-image-caption';
  const controls=document.createElement('div');controls.className='sb-image-tools';controls.append(detail,close);
  dialog.append(controls,image,crop,caption);document.body.append(dialog);
  image.addEventListener('load',()=>{detail.disabled=false;});
  let trigger=null,fittedWidth=0,pan=null,suppressDragClick=false;
  const endPan=(suppressClick=false)=>{
   const active=pan;pan=null;dialog.classList.remove('sb-image-panning');
   if(!active)return;
   if(suppressClick&&active.moved){
    suppressDragClick=true;
    // A captured drag can finish over the backdrop; do not treat its click as closing.
    setTimeout(()=>{suppressDragClick=false;},0);
   }
   if(dialog.hasPointerCapture(active.pointerId))dialog.releasePointerCapture(active.pointerId);
  };
  dialog.addEventListener('pointerdown',e=>{
   if(!dialog.classList.contains('sb-image-detail')||!e.isPrimary||e.button!==0||!['mouse','pen'].includes(e.pointerType))return;
   if(e.target.closest?.('.sb-image-tools,button,a,input,select,textarea'))return;
   const rect=dialog.getBoundingClientRect();
   // Leave native scrollbars and backdrop clicks to the browser.
   if(e.clientX<rect.left+dialog.clientLeft||e.clientX>=rect.left+dialog.clientLeft+dialog.clientWidth||e.clientY<rect.top+dialog.clientTop||e.clientY>=rect.top+dialog.clientTop+dialog.clientHeight)return;
   suppressDragClick=false;
   pan={pointerId:e.pointerId,x:e.clientX,y:e.clientY,left:dialog.scrollLeft,top:dialog.scrollTop,moved:false};
   dialog.setPointerCapture(e.pointerId);dialog.classList.add('sb-image-panning');e.preventDefault();
  });
  dialog.addEventListener('pointermove',e=>{
   if(!pan||e.pointerId!==pan.pointerId)return;
   if(!(e.buttons&1)){endPan();return;}
   const dx=e.clientX-pan.x,dy=e.clientY-pan.y;
   if(Math.max(Math.abs(dx),Math.abs(dy))>=4)pan.moved=true;
   dialog.scrollLeft=pan.left-dx;dialog.scrollTop=pan.top-dy;e.preventDefault();
  });
  dialog.addEventListener('pointerup',e=>{if(e.pointerId===pan?.pointerId)endPan(true);});
  dialog.addEventListener('pointercancel',e=>{if(e.pointerId===pan?.pointerId)endPan();});
  dialog.addEventListener('lostpointercapture',e=>{if(e.pointerId===pan?.pointerId)endPan();});
  window.addEventListener('blur',()=>endPan());
  const open=(img,source)=>{
   endPan();suppressDragClick=false;
   dialog.classList.remove('sb-image-detail');image.style.removeProperty('width');
   detail.hidden=!img.dataset?.qualitySource;detail.textContent='글자 확대';detail.setAttribute('aria-pressed','false');
   dialog.classList.toggle('sb-poster-dialog',source.dataset.imageModal==='poster');
   trigger=source;image.src=img.src;image.alt=img.alt||'제품 이미지';caption.textContent=image.alt;
   detail.disabled=!image.complete||!image.naturalWidth;
   const viewport=img.closest?.('.sb-screen-window');
   image.hidden=!!viewport;crop.hidden=!viewport;crop.replaceChildren();
   if(viewport){
    const copy=viewport.cloneNode(true);
    // Cloning only the viewport keeps raster hardware out of the enlarged view.
    copy.querySelectorAll('img').forEach(el=>{el.loading='eager';el.removeAttribute('tabindex');el.removeAttribute('role');});
    crop.append(copy);
    const rect=img.dataset.screenCrop.split(',').map(Number);
    crop.style.setProperty('--sb-crop-ratio',String(rect[2]/rect[3]));
   }
   dialog.showModal();dialog.scrollTop=0;dialog.scrollLeft=0;document.body.classList.add('sb-image-open');close.focus();
   fittedWidth=0;
  };
  detail.addEventListener('click',()=>{
   endPan();suppressDragClick=false;
   const expanded=!dialog.classList.contains('sb-image-detail');
   if(expanded)fittedWidth=image.getBoundingClientRect().width;
   dialog.classList.toggle('sb-image-detail',expanded);
   if(expanded)image.style.width=Math.min(image.naturalWidth,Math.max(fittedWidth*2,1200))+'px';
   else image.style.removeProperty('width');
   detail.textContent=expanded?'전체 화면':'글자 확대';detail.setAttribute('aria-pressed',String(expanded));
   dialog.scrollTop=0;dialog.scrollLeft=0;
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(suppressDragClick){suppressDragClick=false;e.preventDefault();e.stopPropagation();return;}if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{endPan();suppressDragClick=false;document.body.classList.remove('sb-image-open');trigger?.focus({preventScroll:true});image.removeAttribute('src');image.style.removeProperty('width');dialog.classList.remove('sb-image-detail');crop.replaceChildren();});
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
   const gallery=img.closest('.sb-inline-screen-gallery');
   if((!gallery||img===gallery.querySelector('img'))&&img.closest('.sb-content')&&!document.body.classList.contains('sb-page-product-oneai')&&!img.matches('.sb-page-product-nonprofit-intro .sb-nonprofit-hero,.sb-page-product-nonprofit-intro .sb-nonprofit-process .sb-process-icon,.sb-page-product-wehago-cooperation .wehago_02 img,.sb-page-product-wehago-extraservice .wehago_02 img,.sb-page-product-pms .sb-pms-workflow-3d img,.sb-page-product-pms .sect_faetures img,.sb-page-product-omniesol img[src$="/omniesol-custom/chatbot.png"]'))zoomImages.push(img);
   if(!link){target.tabIndex=0;target.setAttribute('role','button');target.setAttribute('aria-label',(img.alt||'제품 이미지')+' 크게 보기');}
   target.classList.add('sb-image-trigger');target.setAttribute('aria-haspopup','dialog');
   target.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(img,target);});
   if(!link)target.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(img,target);}});
  });
  zoomImages.forEach(img=>{
   const button=document.createElement('button');button.type='button';button.className='sb-screen-view';button.textContent='화면 크게보기';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',(img.alt||'제품 이미지')+' 화면 크게보기');
   const gallery=img.closest('.sb-inline-screen-gallery');
   if(gallery){button.textContent='전체 화면 크게보기';button.setAttribute('aria-label',gallery.getAttribute('aria-label')+' 전체 화면 크게보기');}
   button.addEventListener('click',()=>open(img,button));
   const actions=document.createElement('div');actions.className='sb-screen-actions';
   const pair=img.closest('.sb-native-screen-pair');
   if(pair){
    const copy=pair.closest('.sb-zigzag-feature')?.querySelector('.sb-feature-copy');
    if(copy){
     let group=copy.querySelector('.sb-native-pair-actions');
     if(!group){group=document.createElement('div');group.className='sb-screen-actions sb-native-pair-actions';copy.append(group);}
     button.textContent=(img.closest('a')?.querySelector('.sb-native-screen-label')?.textContent||'')+' 화면 크게보기';
     group.append(button);return;
    }
   }
   let container=img.parentElement,video=null;
   while(container&&!container.matches('.sb-content')){
    const candidate=[...container.querySelectorAll('a')].find(a=>a.textContent.trim()==='영상으로 확인하기'||(document.body.matches('.sb-page-product-wehago-smart_a10,.sb-page-product-wehago-cooperation,.sb-page-product-wehago-extraservice,.sb-page-product-wehago-linkedservice')&&/^리플[릿렛]\s*자세히\s*보기$/.test(a.textContent.trim())));
    if(candidate&&zoomImages.filter(other=>container.contains(other)).length===1){video=candidate;break;}
    container=container.parentElement;
   }
   if(video){video.before(actions);actions.append(video,button);}
   else{
    const feature=img.closest('.sb-zigzag-feature,.sb-feature,.sb-centered-feature,.ifrs-feature');
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
 document.querySelectorAll('.sb-page-product-wehago-smart_a10 .wehago_02 .contBox .txt p,.sb-page-product-wehago-cooperation .wehago_02 .contBox .txt p,.sb-page-product-wehago-extraservice .wehago_02 .contBox .txt p').forEach(p=>p.classList.add('sb-check-item'));
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
