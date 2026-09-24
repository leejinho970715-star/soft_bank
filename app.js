(() => {
  const root = document.getElementById('soft-bank-renewal');
  if (!root) return;

  const topButton = document.createElement('button');
  topButton.type = 'button';
  topButton.className = 'sb-back-to-top';
  topButton.setAttribute('aria-label', '페이지 맨 위로 이동');
  topButton.innerHTML = '<span aria-hidden="true">↑</span>TOP';
  let topScrollFrame = 0;
  const cancelTopScroll = () => cancelAnimationFrame(topScrollFrame);
  window.addEventListener('wheel', cancelTopScroll, {passive: true});
  window.addEventListener('touchstart', cancelTopScroll, {passive: true});
  window.addEventListener('pointerdown', cancelTopScroll, {passive: true});
  window.addEventListener('keydown', cancelTopScroll);
  topButton.addEventListener('click', () => {
    cancelTopScroll();
    window.dispatchEvent(new Event('sb:back-to-top'));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      return;
    }
    const from = window.scrollY, start = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - start) / 850);
      window.scrollTo({top: from * Math.pow(1 - progress, 3), left: 0, behavior: 'instant'});
      if (progress < 1) topScrollFrame = requestAnimationFrame(tick);
    };
    topScrollFrame = requestAnimationFrame(tick);
  });
  root.append(topButton);

  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));

  const menuToggle = $('.menu-toggle');
  const gnb = $('.gnb');
  if (menuToggle && gnb) {
    menuToggle.addEventListener('click', () => {
      const open = gnb.classList.toggle('open');
      menuToggle.textContent = open ? '×' : '☰';
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }
  const gnbItems = $$('.gnb-item');
  const closeLnb = (except) => gnbItems.forEach((item) => {
    if (item === except) return;
    item.classList.remove('lnb-open');
    item.querySelector('.lnb-toggle')?.setAttribute('aria-expanded', 'false');
  });
  $$('.lnb-toggle').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const item = button.closest('.gnb-item');
      const open = !item.classList.contains('lnb-open');
      closeLnb(item);
      item.classList.toggle('lnb-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.gnb-item')) closeLnb();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeLnb();
  });

  const chat = $('.chat');
  const chatLaunch = $('.chat-launch');
  const chatClose = $('.chat header button');
  const setChat = (open) => {
    if (!chat) return;
    chat.classList.toggle('open', open);
    chat.setAttribute('aria-hidden', String(!open));
  };

  if (chatLaunch) {
    chatLaunch.addEventListener('click', () => {
      setChat(!chat.classList.contains('open'));
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', () => setChat(false));
  }

  const answerButtons = $$('.questions button');
  const chatAnswer = $('.answer');
  answerButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!chatAnswer) return;
      const answer = document.createElement('p');
      answer.textContent = button.dataset.answer || '';
      chatAnswer.replaceChildren(answer);
      setChat(true);
    });
  });

  const chatLink = $('.questions a');
  if (chatLink) {
    chatLink.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  const quick = $('.quick-left');
  const quickToggle = $('.quick-toggle');
  const quickFab = $('.quick-fab');
  const quickPopover = $('.quick-popover');
  let quickOpen = true;

  const setQuick = (open) => {
    quickOpen = open;
    if (open) setChat(false);
    if (quick) quick.classList.toggle('closed', !open);
    if (quickToggle) {
      quickToggle.innerHTML = 'DOUZONE <span>' + (open ? '×' : '+') + '</span>';
      quickToggle.setAttribute('aria-expanded', String(open));
      quickToggle.setAttribute('aria-label', open ? '왼쪽 퀵메뉴 접기' : '왼쪽 퀵메뉴 열기');
    }
    if (quick) quick.querySelector('.quick-menu')?.toggleAttribute('inert', !open);
  };
  setQuick(!matchMedia('(max-width: 700px)').matches);

  const cardnewsLink = quick && [...quick.querySelectorAll('a')].find(a => a.textContent.includes('카드뉴스'));
  if (cardnewsLink) {
    cardnewsLink.href = '#cardnews-dialog';
    cardnewsLink.setAttribute('aria-haspopup', 'dialog');
    const cardDialog = document.createElement('dialog');
    cardDialog.id = 'cardnews-dialog';
    cardDialog.className = 'sb-cardnews-dialog';
    cardDialog.setAttribute('aria-labelledby', 'cardnews-title');
    cardDialog.innerHTML = `<header><h2 id="cardnews-title">카드뉴스 신청하기</h2><button type="button" aria-label="카드뉴스 신청창 닫기">×</button></header>
      <form><label>회사명 *<input name="company" maxlength="100" autocomplete="organization" required></label>
      <label>담당자명 *<input name="writer" maxlength="50" autocomplete="name" required></label>
      <label>연락처 *<input name="phone" type="tel" maxlength="30" autocomplete="tel" required></label>
      <label>이메일<input name="email" type="email" maxlength="100" autocomplete="email"></label>
      <label>관심 주제<input name="interest" maxlength="200" placeholder="ERP, PMS, ISMS-P 등"></label>
      <label>문의사항<textarea name="note1" rows="3" maxlength="2000"></textarea></label>
      <label class="sb-consent"><input name="agree1" type="checkbox" value="1" required> [필수] 개인정보 수집 및 이용에 동의합니다.</label>
      <p>수집 항목: 회사명, 담당자명, 연락처, 이메일 / 목적: 카드뉴스 발송 및 서비스 안내 / 보유기간: 동의 철회 시까지</p>
      <label class="sb-consent"><input name="agree2" type="checkbox" value="1" required> [필수] 카드뉴스 및 서비스 정보 수신에 동의합니다.</label>
      <p>ERP, PMS, ISMS-P 등 관련 최신 정보를 이메일로 수신합니다.</p>
      <p role="status" class="sb-cardnews-status"></p><button type="submit">신청하기</button></form>`;
    root.append(cardDialog);
    const closeCard = () => cardDialog.close();
    cardDialog.querySelector('header button').addEventListener('click', closeCard);
    cardDialog.addEventListener('click', e => { if (e.target === cardDialog) { const r=cardDialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) closeCard(); } });
    cardDialog.addEventListener('close', () => {document.body.classList.remove('sb-cardnews-open');cardnewsLink.focus({preventScroll:true});});
    cardnewsLink.addEventListener('click', e => { e.preventDefault();cardDialog.showModal();document.body.classList.add('sb-cardnews-open'); });
    cardDialog.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const form=e.currentTarget, submit=form.querySelector('[type=submit]'), status=form.querySelector('[role=status]');
      submit.disabled=true;status.textContent='신청 내용을 전송하고 있습니다.';
      try {
        const response=await fetch('/_lib/cardnewsProc.asp', {method:'POST', body:new URLSearchParams(new FormData(form))});
        const result=(await response.text()).trim();
        if (!response.ok || result !== 'OK') throw new Error(result.startsWith('ERR:') ? result.slice(4) : '신청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.');
        form.reset();status.textContent='카드뉴스 신청이 완료되었습니다.';
      } catch(error) {status.textContent=error.message || '연결에 실패했습니다. 잠시 후 다시 시도해 주세요.';}
      finally {submit.disabled=false;}
    });
  }

  const closeOutsidePanels = (event) => {
    const target = event.target;
    const clickedInsideQuick = quick && quick.contains(target);
    const clickedInsideQuickToggle = quickToggle && quickToggle.contains(target);
    const clickedInsideQuickFab = quickFab && quickFab.contains(target);
    const clickedInsideQuickPopover = quickPopover && quickPopover.contains(target);
    const clickedInsideChat = chat && chat.contains(target);
    const clickedInsideChatLaunch = chatLaunch && chatLaunch.contains(target);

    if (!clickedInsideQuick && !clickedInsideQuickToggle && !clickedInsideQuickFab && !clickedInsideQuickPopover) {
      if (quickPopover) {
        quickPopover.classList.remove('open');
        quickPopover.setAttribute('aria-hidden', 'true');
      }
      if (quickFab) {
        quickFab.setAttribute('aria-expanded', 'false');
        const sign = quickFab.querySelector('b');
        if (sign) sign.textContent = '+';
      }
    }

    if (!clickedInsideChat && !clickedInsideChatLaunch) {
      setChat(false);
    }

    if (!clickedInsideQuick && !clickedInsideQuickToggle) {
      setQuick(false);
    }
  };

  if (quickToggle) {
    quickToggle.addEventListener('click', () => setQuick(!quickOpen));
  }

  if (quickFab) {
    quickFab.addEventListener('click', (event) => {
      event.stopPropagation();
      if (quickPopover) {
        const open = quickPopover.classList.toggle('open');
        if (open) setChat(false);
        quickPopover.setAttribute('aria-hidden', String(!open));
        quickFab.setAttribute('aria-expanded', String(open));
        const sign = quickFab.querySelector('b');
        if (sign) sign.textContent = open ? '×' : '+';
      }
    });
  }

  document.addEventListener('click', closeOutsidePanels);

  const modalTriggers = $$('[data-modal]');
  const modals = $$('.legal-modal');

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!$('.legal-modal.open')) {
      document.body.classList.remove('modal-open');
    }
  }

  function openModal(name) {
    const modal = document.getElementById(name + '-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) closeButton.focus();
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
  });

  modals.forEach((modal) => {
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => closeModal(modal));
    }
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modals.forEach((modal) => closeModal(modal));
    }
  });

  if (window.Swiper && window.SOFTBANK_NEWS) {
    const newsData = window.SOFTBANK_NEWS;
    let newsSwiper = null;

    function renderNews(category) {
      const data = newsData[category] || newsData.notice;
      const wrapper = $('.news-slider .swiper-wrapper');
      const newsLink = $('.news-more');
      if (!wrapper) return;

      if (newsSwiper) {
        newsSwiper.destroy(true, true);
      }

      wrapper.replaceChildren(
        ...data.items.map(([title, date, href, thumbnail]) => {
          const card = document.createElement('a');
          card.className = 'news-card glass swiper-slide';
          card.href = href || data.href;
          card.target = '_self';
          card.rel = 'noopener noreferrer';

          const img = document.createElement('img');
          img.src = thumbnail || 'assets/notice-thumb.png';
          img.alt = title;

          const badge = document.createElement('b');
          badge.textContent = category === 'notice' ? '공지' : '영상';

          const copy = document.createElement('p');
          copy.textContent = title;

          const time = document.createElement('time');
          time.textContent = date;

          card.append(img, badge, copy, time);
          return card;
        })
      );

      if (newsLink) newsLink.href = data.href;

      newsSwiper = new Swiper('.news-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        speed: 650,
        grabCursor: true,
        autoplay: { delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: { nextEl: '.news-next', prevEl: '.news-prev' },
        scrollbar: { el: '.news-slider .swiper-scrollbar', draggable: true, snapOnRelease: true },
        keyboard: { enabled: true }
      });
    }

    const newsTabs = $$('.news-tabs button');
    newsTabs.forEach((button) => {
      button.addEventListener('click', () => {
        newsTabs.forEach((tab) => tab.classList.toggle('active', tab === button));
        renderNews(button.dataset.category || 'notice');
      });
    });

    renderNews('notice');
  }

  const clientLogos = $('.client-logos');
  if (clientLogos) {
    const track = document.createElement('div');
    track.className = 'client-logo-track';
    const group = document.createElement('div');
    group.className = 'client-logo-group';
    while (clientLogos.firstChild) group.append(clientLogos.firstChild);
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    track.append(group, duplicate);
    clientLogos.append(track);
  }

  if (window.gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    $$('.reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    $$('.shake').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        x: -20,
        opacity: 0,
        duration: 0.9,
        ease: 'elastic.out(1,.2)'
      });
    });

    const company = $('.company');
    const typeItems = company ? $$('.type-text', company) : [];
    const companyButton = company ? $('.type-cta', company) : null;

    if (company && typeItems.length) {
      gsap.set([...typeItems, ...(companyButton ? [companyButton] : [])], { autoAlpha: 0 });
      const typing = gsap.timeline({
        scrollTrigger: { trigger: company, start: 'top 72%', once: true }
      });

      typeItems.forEach((el, index) => {
        const text = el.dataset.typeText || el.textContent.trim().replace(/\s+/g, ' ');
        typing.set(el, { autoAlpha: 1, onComplete: () => {
          el.style.minHeight = `${el.getBoundingClientRect().height}px`;
          el.textContent = '';
          el.classList.add('typing');
        }}).to({ count: 0 }, {
          count: text.length,
          duration: Math.max(0.45, text.length * 0.035),
          ease: 'none',
          onUpdate: function () {
            const value = Math.ceil(this.targets()[0].count);
            el.textContent = text.slice(0, value);
          },
          onComplete: () => el.classList.remove('typing')
        }, index ? '>+0.12' : 0);
      });

      if (companyButton) {
        typing.fromTo(companyButton, { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)' });
      }
    }
  } else {
    $$('.company .type-text, .company .type-cta').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }
})();

// Home paging uses native window scrolling, keeping ScrollTrigger's scroller intact.
(() => {
  const root = document.getElementById('soft-bank-renewal');
  const main = root?.querySelector(':scope > main');
  if (!main?.querySelector(':scope > .hero') || document.body.classList.contains('sb-renewal')) return;
  const sections = [...main.children].filter(el => el.tagName === 'SECTION');
  const footer = root.querySelector(':scope > footer');
  if (footer) sections.push(footer);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, active = false, lastWheel = 0, delta = 0, direction = 0, refreshTimer;
  const blocked = () => root.inert || document.body.matches('.intro-open,.modal-open,.sb-notice-open') ||
    !!root.querySelector('.gnb.open,dialog[open],.legal-modal.open');
  const cancel = () => {
    cancelAnimationFrame(frame);
    active = false;
    document.documentElement.classList.remove('sb-home-paging');
  };
  function stops() {
    const header = root.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    const viewport = Math.max(1, innerHeight-header);
    const max = Math.max(0, document.documentElement.scrollHeight-innerHeight);
    const positions = [0,max];
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const top = Math.max(0, Math.min(max, scrollY+rect.top-header));
      const bottom = Math.max(top, Math.min(max, scrollY+rect.bottom-innerHeight));
      positions.push(top);
      // Overlapping viewport-sized stops preserve every line in tall sections.
      for (let y=top+viewport*.88; y<bottom-2; y+=viewport*.88) positions.push(y);
      if (bottom>top+2) positions.push(bottom);
    }
    return positions.sort((a,b)=>a-b).filter((y,i,all)=>!i || y-all[i-1]>2);
  }
  function move(sign,edge) {
    const points = stops();
    const target = edge==='start' ? 0 : edge==='end' ? points.at(-1) :
      sign>0 ? points.find(y=>y>scrollY+3) : points.findLast(y=>y<scrollY-3);
    if (target===undefined || Math.abs(target-scrollY)<2) return;
    cancel(); active=true;
    document.documentElement.classList.add('sb-home-paging');
    const from=scrollY, start=performance.now();
    const duration=Math.min(850,Math.max(450,Math.abs(target-from)*.65));
    const tick = now => {
      if (blocked() || reduced.matches) { cancel(); return; }
      const t=Math.min(1,(now-start)/duration);
      const ease=t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
      window.scrollTo({top:from+(target-from)*ease,behavior:'instant'});
      if(t<1) frame=requestAnimationFrame(tick); else cancel();
    };
    frame=requestAnimationFrame(tick);
  }
  function nativeTarget(target) {
    if (!(target instanceof Element)) return true;
    if (target.closest('input,textarea,select,[contenteditable="true"],.legal-modal,.chat,.gnb,.quick-menu')) return true;
    for(let el=target;el && el!==root;el=el.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight>el.clientHeight+2) return true;
    }
    return false;
  }
  window.addEventListener('wheel',event=>{
    if(event.defaultPrevented || reduced.matches || blocked() || event.ctrlKey || event.metaKey ||
       Math.abs(event.deltaX)>Math.abs(event.deltaY) || nativeTarget(event.target) || !event.deltaY) return;
    event.preventDefault();
    const now=performance.now(),sign=Math.sign(event.deltaY),fresh=now-lastWheel>180;
    lastWheel=now;
    if(active) { delta=0; return; }
    // Ignore a trackpad's inertial tail until the next distinct gesture.
    if(!fresh && delta===0) return;
    if(fresh || direction!==sign) delta=0;
    direction=sign;
    delta+=event.deltaY*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? innerHeight : 1);
    if(Math.abs(delta)>=24) { delta=0; move(sign); }
  },{passive:false});
  window.addEventListener('keydown',event=>{
    if(event.key==='Escape') { cancel(); return; }
    if(event.defaultPrevented || reduced.matches || blocked() || nativeTarget(event.target) ||
       event.target.closest?.('button,a,[role="button"],.swiper') || event.altKey || event.ctrlKey || event.metaKey) return;
    const down=['ArrowDown','PageDown',' '].includes(event.key);
    const up=['ArrowUp','PageUp'].includes(event.key) || (event.key===' ' && event.shiftKey);
    if(!down && !up && !['Home','End'].includes(event.key)) return;
    event.preventDefault();
    if(!active) move(up ? -1 : 1,event.key==='Home' ? 'start' : event.key==='End' ? 'end' : undefined);
  });
  // Touch, links and scrollbar dragging remain native and interrupt the animation.
  window.addEventListener('pointerdown',cancel,{passive:true});
  window.addEventListener('touchstart',cancel,{passive:true});
  window.addEventListener('hashchange',cancel);
  window.addEventListener('sb:back-to-top',()=>{cancel();delta=0;lastWheel=performance.now();});
  window.addEventListener('pagehide',cancel);
  reduced.addEventListener('change',cancel);
  const refresh=()=>{
    cancel(); clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>window.ScrollTrigger?.refresh(),180);
  };
  window.addEventListener('resize',refresh);
  window.addEventListener('load',refresh,{once:true});
  document.fonts?.ready.then(refresh);
  const observer=new ResizeObserver(refresh);
  sections.forEach(el=>observer.observe(el));
})();

// Display the captured original legal documents in full.
for (const [key, id] of [['privacy', 'privacy-modal'], ['terms', 'terms-modal']]) {
  const panel = document.querySelector('#' + id + ' .legal-scroll');
  if (!panel) continue;
  panel.textContent = '문서를 불러오는 중입니다.';
  fetch(new URL('renewal/' + key + '.html', document.currentScript?.src || location.href)).then(r => { if (!r.ok) throw new Error('Document unavailable'); return r.text(); }).then(html => { panel.innerHTML = html; }).catch(() => { panel.textContent = '문서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'; });
}
