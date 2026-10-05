'use client';
import {ChevronLeft,ChevronRight,X} from "lucide-react";

import { useEffect, useRef, useState } from 'react';
import './attire.css';

const panels = [
  { title: 'For the ladies', description: 'Modern Filipiniana in joyful colours, expressive details, and your own beautiful style.', image: '1.png', alt: 'Seven examples of colourful modern Filipiniana outfits, including dresses, separates, and a tailored barong ensemble' },
  { title: 'For the gentlemen', description: 'A classic or contemporary Barong, tailored trousers, and polished dress shoes.', image: '3.png', alt: 'Six examples of traditional cream and contemporary embroidered Barong ensembles with tailored trousers' },
];

export function AttireSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      if (!hovered && !focused && !motion.matches && visible && !document.hidden) timer = setInterval(() => setActive(value => (value + 1) % panels.length), 4500);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.15 });
    if (wrapper.current) observer.observe(wrapper.current);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { if (timer) clearInterval(timer); observer.disconnect(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, [hovered, focused]);

  const change = () => setActive(value => (value + 1) % panels.length);
  return <section id="attire" className="section attire-section" aria-labelledby="attire-heading" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div className="container">
      <header className="section-title"><p className="eyebrow">A touch of heritage. A celebration together.</p><h2 id="attire-heading">What to wear</h2></header>
      <div ref={wrapper} className="attire-carousel" role="region" aria-roledescription="carousel" aria-label="Ladies and gentlemen attire inspiration" onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <div className="attire-panels">{panels.map((panel, index) => <div className={`attire-panel${active === index ? ' is-current' : ''}`} key={panel.title} aria-hidden={index !== active}>
          <h3>{panel.title}</h3><p>{panel.description}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/invitation/attire/${panel.image}`} alt={panel.alt} width={1200} height={630} loading="lazy" decoding="async" />
        </div>)}</div>
        <div className="attire-controls"><button type="button" onClick={change} aria-label="Previous attire panel"><ChevronLeft size={28} aria-hidden="true"/></button><div className="attire-dots" role="group" aria-label="Choose attire panel">{panels.map((panel,index)=><button key={panel.title} type="button" className="attire-dot" aria-label={`Show ${panel.title.toLowerCase()}`} aria-pressed={active===index} onClick={()=>setActive(index)}><span/></button>)}</div><button type="button" onClick={change} aria-label="Next attire panel"><ChevronRight size={28} aria-hidden="true"/></button></div>
      </div>
      <aside className="attire-guidance" aria-label="Dress code reminders">
        <p>Come dressed in your most stylish, colourful modern Filipiniana or Barong ensemble. Complete your look with dress shoes or elegant sandals; kindly leave <strong>T-shirts, slippers, and Crocs at home.</strong></p>
        <p className="attire-bride-note">White gowns are reserved for the bride. Traditional cream barongs are welcome.</p>
      </aside>
    </div>
  </section>;
}
