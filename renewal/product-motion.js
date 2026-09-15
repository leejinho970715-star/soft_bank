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
    if (asset && hero) {
      // Scale inside the existing hero; never add a pin spacer or hide the page.
      gsap.fromTo(asset, { scale: 0.88 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.3, invalidateOnRefresh: true }
      });
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
