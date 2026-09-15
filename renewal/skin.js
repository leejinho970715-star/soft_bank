/* UI-only enhancement; classic ASP form handlers are not replaced in production. */
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('sb-renewal'))return;
 document.querySelectorAll('video').forEach(video=>{video.controls=true;video.autoplay=false;video.loop=false;});
 document.querySelectorAll('iframe[src*="youtube"]').forEach(frame=>{
  const url=new URL(frame.src);url.searchParams.set('controls','1');url.searchParams.set('autoplay','0');url.searchParams.set('loop','0');frame.src=url.href;
 });
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
