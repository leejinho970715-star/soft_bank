/* UI-only enhancement; classic ASP form handlers are not replaced in production. */
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('sb-renewal'))return;
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
