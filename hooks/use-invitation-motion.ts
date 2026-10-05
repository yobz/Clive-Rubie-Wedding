'use client';
import { useEffect } from 'react';

/** Content starts visible. Animation is progressive enhancement, never a loading gate. */
export function useInvitationMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    document.querySelector('.monogram')?.setAttribute('aria-label', 'Clive and Rubie, home');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.section-heading, .story-photograph, .story-grid article, .event-card, .attire > div, .rsvp-intro, .rsvp-form, .gifts > h2, .gifts > p, .faq > div, .album-heading, .album-card'));
    let reveal: IntersectionObserver | undefined;
    const setup = () => {
      reveal?.disconnect();
      targets.forEach(el => { el.classList.remove('reveal-pending'); el.style.removeProperty('--reveal-delay'); });
      if (media.matches || !('IntersectionObserver' in window)) return;
      reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); reveal?.unobserve(entry.target); }
      }), { threshold: .08 });
      targets.forEach((el, i) => {
        el.classList.add('reveal-item');
        if (el.getBoundingClientRect().top > window.innerHeight * .85) {
          el.classList.add('reveal-pending');
          el.style.setProperty('--reveal-delay', `${Math.min(i % 3, 2) * 85}ms`);
          reveal?.observe(el);
        }
      });
    };
    let frame = 0;
    let previousScrollY = window.scrollY;
    const update = () => {
      frame = 0;
      const height = root.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      root.style.setProperty('--reading-progress', `${height > 0 ? scrollY / height : 0}`);
      root.classList.toggle('page-scrolled', scrollY > 70);
      if (scrollY < 24 || scrollY < previousScrollY) root.classList.remove('page-header-hidden');
      else if (scrollY > previousScrollY + 4) root.classList.add('page-header-hidden');
      previousScrollY = scrollY;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    setup(); update();
    media.addEventListener('change', setup);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      reveal?.disconnect(); cancelAnimationFrame(frame);
      media.removeEventListener('change', setup);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      targets.forEach(el => { el.classList.remove('reveal-pending', 'reveal-item'); el.style.removeProperty('--reveal-delay'); });
      root.classList.remove('page-scrolled', 'page-header-hidden'); root.style.removeProperty('--reading-progress');
    };
  }, []);
}
