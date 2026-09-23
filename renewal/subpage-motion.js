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
  const entryAsset = document.querySelector('.sb-product .sb-hero-asset');
  const siteRoot = document.getElementById('soft-bank-renewal');
  if (entryAsset && siteRoot && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const entry = document.createElement('div');
    entry.className = 'sb-product-entry';
    const stage = document.createElement('div');
    stage.className = 'sb-product-entry-stage';
    stage.setAttribute('aria-hidden', 'true');
    const visual = document.createElement('img');
    visual.src = entryAsset.src;
    visual.alt = '';
    visual.decoding = 'async';
    visual.fetchPriority = 'high';
    stage.append(visual);
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'sb-product-entry-skip';
    skip.textContent = '제품 소개 본문으로 이동';
    entry.append(stage, skip);
    siteRoot.before(entry);
    // Keep navigation interactive while the intro covers the page content.
    const coveredContent = [...siteRoot.children]
      .filter(el => !el.matches('.site-header') && !el.contains(siteRoot.querySelector('.site-header')))
      .map(el => ({el, wasInert: el.inert}));
    let entryFrame = 0;
    const updateEntry = () => {
      entryFrame = 0;
      const distance = entry.offsetHeight;
      const progress = Math.max(0, Math.min(1, -entry.getBoundingClientRect().top / distance));
      const active = progress < 1;
      const fade = Math.max(0, Math.min(1, (1 - progress) / .18));
      visual.style.transform = `scale(${.8 + progress * 2})`;
      stage.style.opacity = String(fade);
      stage.hidden = !active;
      skip.hidden = !active;
      coveredContent.forEach(({el, wasInert}) => { el.inert = active || wasInert; });
      document.body.classList.toggle('sb-product-entering', active);
      document.body.classList.toggle('sb-product-entry-scrolling', active && progress > .005);
    };
    const queueEntry = () => { if (!entryFrame) entryFrame = requestAnimationFrame(updateEntry); };
    skip.addEventListener('click', () => {
      window.scrollTo({top: window.scrollY + entry.getBoundingClientRect().bottom, behavior: 'instant'});
      updateEntry();
      const main = document.getElementById('main-content');
      main?.setAttribute('tabindex', '-1');
      main?.focus({preventScroll: true});
    });
    window.addEventListener('scroll', queueEntry, {passive: true});
    window.addEventListener('resize', queueEntry, {passive: true});
    window.addEventListener('pageshow', queueEntry);
    visual.addEventListener('error', () => {
      entry.remove();
      coveredContent.forEach(({el, wasInert}) => { el.inert = wasInert; });
      document.body.classList.remove('sb-product-entering');
      document.body.classList.remove('sb-product-entry-scrolling');
      window.removeEventListener('scroll', queueEntry);
      window.removeEventListener('resize', queueEntry);
      window.removeEventListener('pageshow', queueEntry);
      cancelAnimationFrame(entryFrame);
    }, {once: true});
    if (tabPosition !== null) window.scrollTo({top: tabPosition, behavior: 'instant'});
    updateEntry();
  }
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
    scan();
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
      document.removeEventListener('toggle', refresh, true);
      document.removeEventListener('load', refresh, true);
      window.removeEventListener('pageshow', refresh);
      triggers.forEach(trigger => trigger.kill());
      tweens.forEach(tween => tween.revert());
    };
  });
});
