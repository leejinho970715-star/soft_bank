/* Scroll motion leaves content visible when GSAP is unavailable. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('sb-product') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const hero = document.querySelector('.sb-hero');
    const asset = hero?.querySelector('.sb-hero-asset');
    const content = document.querySelector('.sb-content');
    const syncTopState = () => document.body.classList.toggle('sb-product-scroll-top', window.scrollY <= 1);
    syncTopState();
    window.addEventListener('scroll', syncTopState, { passive: true });
    if (asset && hero && document.body.classList.contains('sb-page-product-omniesol')) {
      gsap.fromTo(asset, { scale: 0.9 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    } else if (asset && hero && content) {
      const backdrop = document.createElement('div');
      backdrop.className = 'sb-intro-backdrop';
      hero.prepend(backdrop);
      hero.classList.add('sb-scroll-intro');
      const copy = hero.querySelectorAll(':scope > div:not(.sb-intro-backdrop) > p, h1, nav');
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(copy, { autoAlpha: 0, y: 24 });
      gsap.set(content, { autoAlpha: 0 });
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: () => `top top+=${Math.max(0, (document.querySelector('.site-header')?.offsetHeight || 80) - 1)}`,
          end: () => `+=${Math.max(900, innerHeight * 1.5)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onLeaveBack: () => gsap.set(hero, { x: 0, y: 0 }),
          onUpdate: () => {
            if (window.scrollY <= 1) gsap.set(hero, { x: 0, y: 0 });
          }
        }
      });
      intro.fromTo(asset, {
        scale: 0.38,
        x: () => asset.offsetParent.clientWidth / 2 - asset.offsetLeft - asset.offsetWidth / 2,
        y: () => asset.offsetParent.clientHeight / 2 - asset.offsetTop - asset.offsetHeight / 2
      }, { scale: 1, x: 0, y: 0, duration: 0.65, ease: 'power2.inOut' }, 0)
        .to(backdrop, { autoAlpha: 1, duration: 0.18 }, 0.65)
        .to(copy, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.18 }, 0.68)
        .to(content, { autoAlpha: 1, duration: 0.16 }, 0.88)
        .to({}, { duration: 0.16 });
    }
    const candidates = [...document.querySelectorAll('.sb-content .cont_txt, .sb-content .sb-cutout, .sb-content h2, .sb-content h3, .sb-content .sb-product-cta')];
    candidates.filter(el => !el.closest('.sb-original:not([open])') && !candidates.some(parent => parent !== el && parent.contains(el))).forEach(el => {
      gsap.from(el, {
        y: el.matches('.sb-screen-mockup,.sb-section-visual') ? 44 : 28,
        autoAlpha: 0,
        duration: 0.85,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.querySelectorAll('.sb-content img').forEach(img => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    document.querySelectorAll('.sb-original').forEach(details => details.addEventListener('toggle', refresh));
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true });
    return () => {
      window.removeEventListener('scroll', syncTopState);
      document.body.classList.remove('sb-product-scroll-top');
      hero?.classList.remove('sb-scroll-intro');
      hero?.querySelector('.sb-intro-backdrop')?.remove();
    };
  });
});
