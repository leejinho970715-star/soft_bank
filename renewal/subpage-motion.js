/* Shared motion: no pinning, spacers, or persistent hidden content. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('sb-renewal')) return;
  const tabPositionKey = 'sb-product-tab-position';
  let tabPosition = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem(tabPositionKey) || 'null');
    sessionStorage.removeItem(tabPositionKey);
    if (saved?.url === location.href && Date.now() - saved.time < 15000) tabPosition = saved.y;
  } catch {}
  document.addEventListener('click', event => {
    const link = event.target.closest('.sb-product-tabs a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || target.href === location.href ||
        (target.pathname === location.pathname && target.search === location.search)) return;
    try { sessionStorage.setItem(tabPositionKey, JSON.stringify({url: target.href, y: window.scrollY, time: Date.now()})); } catch {}
  });
  if (tabPosition !== null) {
    const restoreTabPosition = () => window.scrollTo({top: tabPosition, behavior: 'instant'});
    restoreTabPosition();
    requestAnimationFrame(restoreTabPosition);
  }
  const floating = [...document.querySelectorAll('.sb-hero-asset, .sb-content .sb-design-mockup, .sb-content .sb-cutout, .sb-content .sb-laptop-mockup, .sb-content .sb-wehago-illustration, .sb-content .sb-ai-brand, .sb-content .sb-wehago-ecosystem, .sb-content .about__list .img img, .sb-content img[src*="/features/"], .sb-content img[src*="/oneai-hq/mobile-"]')]
    .filter(el => !el.closest('.sb-article-content, .photo_list, .video__wrap') && !el.parentElement.closest('.sb-laptop-mockup'));
  floating.forEach((el, i) => {
    el.classList.add('sb-motion-float');
    el.style.setProperty('--float-duration', `${7 + (i % 4) * .8}s`);
    el.style.setProperty('--float-delay', `${-(i % 5) * 1.1}s`);
    el.style.setProperty('--float-drift', `${i % 2 ? -3 : 3}px`);
  });
  // Only visible illustrations consume animation frames.
  const floatObserver = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => target.classList.toggle('sb-motion-inview', isIntersecting)), {rootMargin: '60px'});
  floating.forEach(el => floatObserver.observe(el));
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({desktop: '(min-width: 761px)', mobile: '(max-width: 760px)', reduced: '(prefers-reduced-motion: reduce)'}, context => {
    if (context.conditions.reduced) return;
    const distance = context.conditions.mobile ? 14 : 28;
    const initialized = new WeakSet();
    const triggers = [], tweens = [];
    const hero = document.querySelector('.sb-hero');
    if (hero && context.conditions.desktop) {
      tweens.push(gsap.fromTo(hero, {backgroundPosition: '50% 44%'}, {backgroundPosition: '50% 56%', ease: 'none', scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: .6}}));
    }
    let frame = 0, disposed = false;
    const selector = '.sb-content img, .sb-content h2, .sb-content h3, .sb-content .cont_txt, .sb-content .feature-text, .sb-content .contWrap>.img, .sb-content .sb-feature, .sb-content .about__list>li, .sb-content .photo_list li, .sb-content .video__wrap>li, .sb-content .info-card, .sb-content .feature-card, .sb-content .sb-product-heading, .sb-content .sb-contact-inner, .sb-content .sb-table-scroll, .sb-content .board_view, .sb-content .board_write, .sb-content .member-area, .sb-content .location, .sb-catalog section';
    const scan = () => {
      const candidates = [...document.querySelectorAll(selector)].filter(el => el.getClientRects().length && !el.closest('[hidden], .sb-original:not([open])'));
      candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el))).forEach((el, index) => {
        if (initialized.has(el)) return;
        initialized.add(el);
        // Preserve scroll restoration and deep-link reading positions.
        if (el.getBoundingClientRect().top < 0) return;
        triggers.push(ScrollTrigger.create({trigger: el, start: 'top 95%', once: true, onEnter: () => {
          tweens.push(gsap.fromTo(el, {y: distance, opacity: 0}, {y: 0, opacity: 1, duration: context.conditions.mobile ? .65 : .9, delay: (index % 4) * .045, ease: 'power2.out', clearProps: 'transform,opacity'}));
        }}));
      });
    };
    const refresh = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(() => {frame = 0; scan(); ScrollTrigger.refresh();});
    };
    // Content shown by a tab fades in again on every switch, so the change reads as a new page.
    // Its own scroll entrances are taken over first, or they would leave it hidden or play twice.
    const takeOver = el => [el, ...el.querySelectorAll(selector)].forEach(child => {
      initialized.add(child);
      triggers.filter(trigger => trigger.trigger === child).forEach(trigger => trigger.kill());
      gsap.killTweensOf(child);
      gsap.set(child, {clearProps: 'transform,opacity,visibility'});
    });
    const fadeIn = (el, delay = 0) => {
      takeOver(el);
      tweens.push(gsap.fromTo(el, {y: distance * .6, opacity: 0}, {y: 0, opacity: 1, duration: context.conditions.mobile ? .55 : .7, delay, ease: 'power2.out', clearProps: 'transform,opacity'}));
    };
    const tabBarBottom = () => document.querySelector('.sb-product-tabs')?.getBoundingClientRect().bottom || 0;
    // The blocks of root that are on screen below the tab bar, split into rows and cards for a short stagger.
    const visibleBlocks = root => {
      const top = Math.max(0, tabBarBottom()), blocks = [], queue = [...root.children];
      while (queue.length && blocks.length < 40) {
        const el = queue.shift();
        if (!el.getClientRects().length || el.closest('[hidden]')) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= top || rect.top >= innerHeight) continue;
        // A wrapper is opened up; anything carrying its own text (even with a lone <br>) stays whole.
        const ownText = [...el.childNodes].some(node => node.nodeType === 3 && node.textContent.trim());
        if (el.children.length && !ownText && (el.children.length === 1 || rect.height > innerHeight * .6)) queue.unshift(...el.children);
        else blocks.push(el);
      }
      return blocks;
    };
    const revealBelowTabs = root => root && visibleBlocks(root).forEach((el, i) => fadeIn(el, Math.min(i, 6) * .06));
    // Same-page product tabs (OmniEsol): everything on screen below the tab bar, including the
    // intro shared by all panels, and the product title.
    const replayTabTitles = event => {
      const panel = event.detail?.panel;
      if (!panel || panel.hidden) return;
      revealBelowTabs(document.querySelector('.sb-content'));
      const heading = document.querySelector('.sb-content .sb-product-heading');
      if (heading && !panel.contains(heading)) fadeIn(heading);
    };
    document.addEventListener('sb:product-tab-change', replayTabTitles);
    // Product tabs that point to a section of the same page (ONE AI) jump straight to it and fade it in,
    // like the tabs that open another page. A smooth scroll that long was cut short whenever a lazy
    // image loaded on the way and ScrollTrigger refreshed.
    const revealSection = event => {
      const link = event.target.closest('.sb-product-tabs a');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href);
      if (target.pathname !== location.pathname || target.search !== location.search || !target.hash) return;
      const section = document.getElementById(decodeURIComponent(target.hash.slice(1)));
      if (!section) return;
      event.preventDefault();
      if (location.hash !== target.hash) history.pushState(null, '', target.hash);
      section.scrollIntoView({behavior: 'instant', block: 'start'});
      const blocks = visibleBlocks(section);
      (blocks.length ? blocks : [section]).forEach((el, i) => fadeIn(el, Math.min(i, 6) * .06));
    };
    document.addEventListener('click', revealSection);
    // Tabs inside a section (screen tabs, 아이디/비밀번호 찾기, feature tabs): the panel that was switched to.
    let lastInput = -Infinity;
    const markInput = () => { lastInput = performance.now(); };
    document.addEventListener('pointerdown', markInput, true);
    document.addEventListener('keydown', markInput, true);
    const panelShown = mutations => {
      if (performance.now() - lastInput > 1000) return;
      new Set(mutations.map(mutation => mutation.target)).forEach(panel => {
        if (panel.matches('.omniesol>.panel') || panel.hidden || !panel.getClientRects().length) return;
        if (panel.matches('[data-panel]') && !panel.classList.contains('is-active')) return;
        const rect = panel.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) fadeIn(panel);
      });
    };
    const panelObserver = new MutationObserver(panelShown);
    document.querySelectorAll('[role="tabpanel"], [data-panel]').forEach(panel => panelObserver.observe(panel, {attributes: true, attributeFilter: ['class', 'hidden']}));
    scan();
    // Arriving from a product tab that opens another page: what sits below the tab bar.
    if (tabPosition !== null) {
      const arrive = () => revealBelowTabs(document.querySelector('.sb-content'));
      if (Math.abs(window.scrollY - tabPosition) < 2) arrive(); else requestAnimationFrame(() => requestAnimationFrame(arrive));
    }
    // Tab switches and FAQ expansion can change the document height.
    const observer = new MutationObserver(refresh);
    document.querySelectorAll('[role="tabpanel"], [data-panel]').forEach(panel => observer.observe(panel, {attributes: true, attributeFilter: ['class', 'hidden']}));
    document.addEventListener('toggle', refresh, true);
    document.addEventListener('load', refresh, true);
    document.fonts?.ready.then(refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('sb:product-tab-change', replayTabTitles);
      document.removeEventListener('click', revealSection);
      document.removeEventListener('pointerdown', markInput, true);
      document.removeEventListener('keydown', markInput, true);
      panelObserver.disconnect();
      document.removeEventListener('toggle', refresh, true);
      document.removeEventListener('load', refresh, true);
      window.removeEventListener('pageshow', refresh);
      triggers.forEach(trigger => trigger.kill());
      tweens.forEach(tween => tween.revert());
    };
  });
});
