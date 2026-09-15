(() => {
  const root = document.getElementById('soft-bank-renewal');
  if (!root) return;

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
    if (quick) quick.classList.toggle('closed', !open);
    if (quickToggle) {
      quickToggle.innerHTML = 'DOUZONE <span>' + (open ? '×' : '+') + '</span>';
      quickToggle.setAttribute('aria-expanded', String(open));
      quickToggle.setAttribute('aria-label', open ? '왼쪽 퀵메뉴 접기' : '왼쪽 퀵메뉴 열기');
    }
    if (quickFab) {
      quickFab.setAttribute('aria-expanded', String(open));
      const sign = quickFab.querySelector('b');
      if (sign) sign.textContent = open ? '×' : '+';
    }
  };

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
      const typing = gsap.timeline({
        scrollTrigger: { trigger: company, start: 'top 72%', once: true }
      });

      typeItems.forEach((el, index) => {
        const text = el.dataset.typeText || el.textContent.trim().replace(/\s+/g, ' ');
        typing.set(el, { opacity: 1, onComplete: () => {
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
        typing.set(companyButton, { opacity: 0 })
          .to(companyButton, { opacity: 1, duration: 0.18 })
          .to(companyButton, { x: -16, duration: 0.1 })
          .to(companyButton, { x: 14, duration: 0.1 })
          .to(companyButton, { x: -10, duration: 0.1 })
          .to(companyButton, { x: 7, duration: 0.1 })
          .to(companyButton, { x: 0, duration: 0.14, ease: 'power2.out' });
      }
    }
  }
})();

// Display the captured original legal documents in full.
for (const [key, id] of [['privacy', 'privacy-modal'], ['terms', 'terms-modal']]) {
  const panel = document.querySelector('#' + id + ' .legal-scroll');
  if (!panel) continue;
  panel.textContent = '문서를 불러오는 중입니다.';
  fetch(new URL('renewal/' + key + '.html', document.currentScript?.src || location.href)).then(r => { if (!r.ok) throw new Error('Document unavailable'); return r.text(); }).then(html => { panel.innerHTML = html; }).catch(() => { panel.textContent = '문서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'; });
}
