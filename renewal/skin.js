/* UI-only enhancement; classic ASP form handlers are not replaced in production. */
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('sb-renewal'))return;
 document.querySelectorAll('video').forEach(video=>{video.controls=true;video.autoplay=false;video.loop=false;});
 document.querySelectorAll('iframe[src*="youtube"]').forEach(frame=>{
  const url=new URL(frame.src);url.searchParams.set('controls','1');url.searchParams.set('autoplay','0');url.searchParams.set('loop','0');frame.src=url.href;
 });
 const activateTab=(group,value)=>{
  const buttons=[...document.querySelectorAll(`[data-tabset="${group}"]:not([data-panel]) [data-tab-button]`)];
  const panels=[...document.querySelectorAll(`[data-tabset="${group}"][data-panel]`)];
  if(!buttons.length||!panels.length)return;
  buttons.forEach(button=>{const active=button.dataset.tab===String(value);button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));});
  panels.forEach(panel=>panel.classList.toggle('is-active',panel.dataset.panel===String(value)));
 };
 document.querySelectorAll('[data-tabset]:not([data-panel])').forEach(tablist=>{
  const group=tablist.dataset.tabset;
  tablist.querySelectorAll('[data-tab-button]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();activateTab(group,button.dataset.tab);}));
  const initial=tablist.querySelector('[data-tab-button].is-active,[data-tab-button]');
  if(initial)activateTab(group,initial.dataset.tab);
 });
 if(document.body.classList.contains('sb-page-product-nonprofit-intro')){
  const requested=new URLSearchParams(location.search).get('tab');
  const selected=['groupware','accounting','hr','docs'].includes(requested)?requested:'overview';
  document.querySelectorAll('[data-np-page]').forEach(panel=>{panel.hidden=panel.dataset.npPage!==selected;});
  document.querySelectorAll('.sb-product-tabs a').forEach(link=>{
   const tab=new URL(link.href).searchParams.get('tab')||'overview';
   const active=tab===selected;
   link.classList.toggle('active',active);
   if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
 }
 const videoButtons=document.querySelectorAll('.js-video[data-video]');
 if(videoButtons.length){
  const dialog=document.createElement('dialog');dialog.className='sb-video-dialog';
  const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','영상 닫기');
  const player=document.createElement('video');player.controls=true;player.playsInline=true;player.preload='metadata';
  dialog.append(close,player);document.body.append(dialog);
  const stop=()=>{player.pause();player.removeAttribute('src');player.load();};
  close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',stop);
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  videoButtons.forEach(button=>button.addEventListener('click',()=>{player.src=button.dataset.video;dialog.showModal();}));
 }
 if(document.body.dataset.preview==='true'){
  const dialog=document.querySelector('.sb-preview-dialog');
  document.querySelectorAll('[data-preview-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();dialog.showModal();}));
  dialog?.querySelector('button').addEventListener('click',()=>dialog.close());
  const rows=[...document.querySelectorAll('.faq-row')];
  if(rows.length){
   const search=document.querySelector('#searchStr');
   const category=document.querySelector('#faqSerboardsort');
   const filter=()=>{let count=0;rows.forEach(row=>{const visible=(!category?.value||row.dataset.product===category.value)&&row.textContent.toLowerCase().includes((search?.value||'').trim().toLowerCase());row.hidden=!visible;if(visible)count++;});document.querySelector('#faqCount').textContent=count;};
   document.querySelector('#faqSearchBtn')?.addEventListener('click',filter);
   search?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();filter();}});
   category?.addEventListener('change',filter);
  }
 }
});
