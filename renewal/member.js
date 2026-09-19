document.addEventListener('DOMContentLoaded',()=>{
 const next=document.querySelector('[data-member-next]');
 const agreements=['agree1','agree2'].map(id=>document.getElementById(id)).filter(Boolean);
 const all=document.getElementById('agree-all');
 const sync=()=>{if(all){all.checked=agreements.every(el=>el.checked);all.indeterminate=!all.checked&&agreements.some(el=>el.checked);}};
 all?.addEventListener('change',()=>{agreements.forEach(el=>{el.checked=all.checked;});sync();});
 agreements.forEach(el=>el.addEventListener('change',sync));if(all)sync();
 const modal=document.getElementById('member-join-dialog');
 next?.addEventListener('click',event=>{const missing=agreements.find(el=>!el.checked);if(missing){event.preventDefault();alert('이용약관과 개인정보 수집·이용에 동의해주세요.');missing.focus();return;}if(modal){event.preventDefault();modal.showModal();document.documentElement.classList.add('member-modal-open');modal.scrollTop=0;document.getElementById('member-join-title').focus();}});
 modal?.querySelectorAll('[data-member-close]').forEach(button=>button.addEventListener('click',()=>modal.close()));
 modal?.addEventListener('close',()=>{document.documentElement.classList.remove('member-modal-open');next?.focus({preventScroll:true});});
 modal?.addEventListener('click',event=>{if(event.target===modal){const rect=modal.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)modal.close();}});
 const tabs=[...document.querySelectorAll('.member-tabs [role="tab"]')];
 const select=tab=>tabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=!active;});
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const target=tabs[e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];select(target);target.focus();});});
 const form=document.getElementById('renewal-join');
 document.querySelector('[data-address-search]')?.addEventListener('click',()=>{
  const open=()=>new window.daum.Postcode({oncomplete:data=>{form.elements.zip.value=data.zonecode;form.elements.addr1.value=data.roadAddress||data.jibunAddress;form.elements.addr2.focus();}}).open();
  if(window.daum?.Postcode){open();return;}
  const script=document.createElement('script');script.src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';script.onload=open;script.onerror=()=>{form.querySelector('.member-status').textContent='주소 검색을 불러오지 못했습니다. 주소를 직접 입력해주세요.';};document.head.append(script);
 });
 if(form){const password=form.elements.passwd,confirm=form.elements.passwd_check;const check=()=>confirm.setCustomValidity(confirm.value!==password.value?'비밀번호가 일치하지 않습니다.':'');password.addEventListener('input',check);confirm.addEventListener('input',check);form.addEventListener('submit',e=>{e.preventDefault();form.querySelector('.member-status').textContent='입력 형식을 확인했습니다. 회원가입 서비스 준비 중으로 정보는 전송·저장되지 않았습니다.';});}
});
