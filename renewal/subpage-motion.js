/* Shared motion: no pinning, spacers, or persistent hidden content. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('sb-renewal')) return;
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
    const selector = '.sb-content h2, .sb-content h3, .sb-content .cont_txt, .sb-content .feature-text, .sb-content .contWrap>.img, .sb-content .sb-feature, .sb-content .about__list>li, .sb-content .photo_list li, .sb-content .video__wrap>li, .sb-content .info-card, .sb-content .feature-card, .sb-content .sb-product-heading, .sb-content .sb-contact-inner, .sb-content .sb-table-scroll, .sb-content .board_view, .sb-content .board_write, .sb-content .member-area, .sb-content .location, .sb-catalog section';
    const scan = () => {
      const candidates = [...document.querySelectorAll(selector)].filter(el => el.getClientRects().length && !el.closest('[hidden], .sb-original:not([open])'));
      candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el))).forEach((el, index) => {
        if (initialized.has(el)) return;
        initialized.add(el);
        // Preserve scroll restoration and deep-link reading positions.
        if (el.getBoundingClientRect().top < 0) return;
        triggers.push(ScrollTrigger.create({trigger: el, start: 'top 95%', once: true, onEnter: () => {
          tweens.push(gsap.fromTo(el, {y: distance, opacity: .12}, {y: 0, opacity: 1, duration: context.conditions.mobile ? .55 : .8, delay: (index % 4) * .045, ease: 'power2.out', clearProps: 'transform,opacity'}));
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
