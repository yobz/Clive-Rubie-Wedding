'use client';
import { useEffect } from 'react';

/** Content starts visible. Animation is progressive enhancement, never a loading gate. */
export function useInvitationMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
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
    const update = () => {
      frame = 0;
      const height = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--reading-progress', `${height > 0 ? window.scrollY / height : 0}`);
      root.classList.toggle('page-scrolled', window.scrollY > 70);
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
      root.classList.remove('page-scrolled'); root.style.removeProperty('--reading-progress');
    };
  }, []);
}
