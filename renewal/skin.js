/* UI-only enhancement; classic ASP form handlers are not replaced in production. */
document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('sb-renewal'))return;
 enhanceInquiryForms();
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

// Preserve the original inquiry fields and restore interactions stripped from ASP pages.
function enhanceInquiryForms(){
 document.querySelectorAll('form:has(.board_write)').forEach(form=>{
  form.classList.add('sb-inquiry-form');
  form.querySelectorAll('tr').forEach((row,rowIndex)=>{
   const title=row.querySelector('th')?.textContent.trim();
   const controls=[...row.querySelectorAll('input:not([type=hidden]),select,textarea')];
   controls.forEach((field,index)=>{
    if(!field.id)field.id=`inquiry-${rowIndex}-${index}`;
    if(!field.labels?.length){
     const label=field.getAttribute('reqtitle')||field.title||field.placeholder||title;
     field.setAttribute('aria-label',`${label}${['phone','email'].includes(field.name)?` ${index+1}`:''}`);
    }
    if(field.matches('.reqField')&&!field.matches('[type=radio]'))field.required=true;
   });
   if(controls.some(field=>field.required))row.querySelector('th')?.classList.add('sb-required-label');
  });
  form.querySelectorAll('.reqField[type=checkbox]').forEach(field=>field.required=true);
  form.querySelectorAll('.onlyNumber').forEach(field=>{
   field.inputMode='numeric';
   field.addEventListener('input',()=>{field.value=field.value.replace(/\D/g,'');});
  });
  const business=form.querySelector('[name=note1][maxlength="12"]');
  if(business){
   business.inputMode='numeric';
   business.addEventListener('input',()=>{
    const digits=business.value.replace(/\D/g,'').slice(0,10);
    business.value=digits.slice(0,3)+(digits.length>3?'-'+digits.slice(3,5):'')+(digits.length>5?'-'+digits.slice(5):'');
   });
  }
  const date=form.querySelector('#meet_date'),time=form.querySelector('#meet_time');
  if(date&&time){
   const now=new Date();
   date.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
   const radios=[...form.querySelectorAll('[name=note5][type=radio]')];
   let selected=radios.find(radio=>radio.checked)||null;
   const update=()=>{
    [date,time].forEach(field=>{
     field.closest('tr').style.display=selected?'':'none';
     field.required=!!selected;
     field.disabled=!selected;
     if(!selected){field.value='';field.setCustomValidity('');}
    });
   };
   radios.forEach(radio=>radio.addEventListener('click',()=>{
    if(selected===radio){radio.checked=false;selected=null;}else selected=radio;
    update();
   }));
   date.addEventListener('input',()=>{
    const day=date.value?new Date(`${date.value}T12:00:00`).getDay():-1;
    date.setCustomValidity(day===0||day===6?'미팅 날짜는 평일(월~금)을 선택해 주세요.':'');
   });
   date.addEventListener('change',()=>{if(!date.validity.valid)date.reportValidity();});
   update();
  }
  // Native file inputs show the selected filename and retain keyboard support.
  form.querySelectorAll('.file_wrap input[type=file]').forEach(input=>{
   const wrapper=input.closest('.file_wrap');
   wrapper.replaceChildren(input);
  });
  const postcode=form.querySelector('#postcode');
  const addressLink=postcode?.parentElement.querySelector('a');
  if(addressLink){
   const button=document.createElement('button');button.type='button';button.className='sb-address-search';button.textContent='주소검색';addressLink.replaceWith(button);
   const status=document.createElement('p');status.setAttribute('role','status');postcode.parentElement.after(status);
   const dialog=document.createElement('dialog');dialog.className='sb-postcode-dialog';dialog.setAttribute('aria-label','주소검색');
   const close=document.createElement('button');close.type='button';close.textContent='닫기';
   const host=document.createElement('div');dialog.append(close,host);document.body.append(dialog);
   close.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('close',()=>button.focus());
   button.addEventListener('click',async()=>{
    button.disabled=true;status.textContent='';
    try{
     if(!window.daum?.Postcode)await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';script.onload=resolve;script.onerror=reject;document.head.append(script);
     });
     dialog.showModal();
     new window.daum.Postcode({width:'100%',height:'100%',oncomplete:data=>{
      postcode.value=data.zonecode;form.querySelector('#addr').value=data.roadAddress||data.jibunAddress;dialog.close();form.querySelector('#addr2').focus();
     }}).embed(host);
    }catch{status.textContent='주소검색을 불러오지 못했습니다. 주소를 직접 입력해 주세요.';}
    finally{button.disabled=false;}
   });
  }
 });
}
