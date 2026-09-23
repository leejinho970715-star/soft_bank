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
   trigger=source;image.src=img.src;image.alt=img.alt||'제품 이미지';caption.textContent=image.alt;
   dialog.showModal();document.body.classList.add('sb-image-open');close.focus();
  };
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('sb-image-open');trigger?.focus({preventScroll:true});image.removeAttribute('src');});
  document.querySelectorAll('.sb-content img,.sb-hero-asset').forEach(img=>{
   if(img.closest('button')||img.alt===''||img.closest('.sb-product-heading,.sb-contact-banner'))return;
   const link=img.closest('a');
   // Keep product navigation and download links; intercept image-file links only.
   if(link&&!/\.(png|webp|jpe?g|gif|svg)(?:[?#]|$)/i.test(link.href))return;
   const target=link||img;
   if(!link){target.tabIndex=0;target.setAttribute('role','button');target.setAttribute('aria-label',(img.alt||'제품 이미지')+' 크게 보기');}
   target.classList.add('sb-image-trigger');target.setAttribute('aria-haspopup','dialog');
   target.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(img,target);});
   if(!link)target.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(img,target);}});
  });
 }
 const syncWidth=()=>document.documentElement.style.setProperty('--product-viewport',document.documentElement.clientWidth+'px');
 syncWidth();window.addEventListener('resize',syncWidth);
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
