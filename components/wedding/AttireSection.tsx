'use client';
import {ChevronLeft,ChevronRight,X,ZoomIn,ZoomOut} from "lucide-react";

import { useEffect, useRef, useState } from 'react';
import './attire.css';

const panels = [
  { title: 'For the ladies', description: 'Modern Filipiniana in joyful colours, expressive details, and your own beautiful style.', image: '1.webp', alt: 'Seven examples of colourful modern Filipiniana outfits, including dresses, separates, and a tailored barong ensemble' },
  { title: 'For the gentlemen', description: 'A classic or contemporary Barong, tailored trousers, and polished dress shoes.', image: 'gentlemen-five.webp', alt: 'Five examples of traditional cream and contemporary embroidered Barong ensembles with tailored trousers' },
];

export function AttireSection() {
  const [active, setActive] = useState(0);
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{const media=matchMedia("(max-width: 767px)");const update=()=>setMobile(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expanded,setExpanded]=useState<number|null>(null);
  const [zoomed,setZoomed]=useState(false);
  const lightbox=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  const previousOverflow=useRef('');
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(()=>{if(expanded===null)return;previousOverflow.current=document.body.style.overflow;document.body.style.overflow='hidden';if(lightbox.current&&!lightbox.current.open)lightbox.current.showModal();return()=>{document.body.style.overflow=previousOverflow.current;};},[expanded]);
  useEffect(()=>{if(!mobile&&expanded!==null){lightbox.current?.close();setExpanded(null);setZoomed(false);}},[mobile,expanded]);
  const close=()=>{lightbox.current?.close();setExpanded(null);setZoomed(false);opener.current?.focus({preventScroll:true});};

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      if (expanded===null && !hovered && !focused && !motion.matches && visible && !document.hidden) timer = setInterval(() => setActive(value => (value + 1) % panels.length), 4500);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.15 });
    if (wrapper.current) observer.observe(wrapper.current);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { if (timer) clearInterval(timer); observer.disconnect(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, [hovered, focused,expanded]);

  const change = () => setActive(value => (value + 1) % panels.length);
  return <section id="attire" className="section attire-section" aria-labelledby="attire-heading" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div className="container">
      <header className="section-title"><p className="eyebrow">A touch of heritage. A celebration together.</p><h2 id="attire-heading">What to wear</h2></header>
      <div ref={wrapper} className="attire-carousel" role="region" aria-roledescription="carousel" aria-label="Ladies and gentlemen attire inspiration" onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <div className="attire-panels">{panels.map((panel, index) => <div className={`attire-panel${active === index ? ' is-current' : ''}`} key={panel.title} aria-hidden={index !== active}>
          <h3>{panel.title}</h3><p>{panel.description}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <button type="button" className="attire-image-trigger" tabIndex={mobile&&active===index?0:-1} aria-label={`Attire inspiration: ${panel.title}`} aria-haspopup={mobile?"dialog":undefined} onClick={e=>{if(!matchMedia("(max-width: 767px)").matches)return;opener.current=e.currentTarget;setExpanded(index);}}><img src={`/invitation/attire/${panel.image}`} alt={panel.alt} width={1200} height={630} loading="lazy" decoding="async" /></button><p className="attire-tap-hint">Tap the image, then scroll to view the outfits.</p>
        </div>)}</div>
        <div className="attire-controls"><button type="button" onClick={change} aria-label="Previous attire panel"><ChevronLeft size={28} aria-hidden="true"/></button><div className="attire-dots" role="group" aria-label="Choose attire panel">{panels.map((panel,index)=><button key={panel.title} type="button" className="attire-dot" aria-label={`Show ${panel.title.toLowerCase()}`} aria-pressed={active===index} onClick={()=>setActive(index)}><span/></button>)}</div><button type="button" onClick={change} aria-label="Next attire panel"><ChevronRight size={28} aria-hidden="true"/></button></div>
      </div>
      <aside className="attire-guidance" aria-label="Dress code reminders">
        <p>Come dressed in your most stylish, colourful modern Filipiniana or Barong ensemble. Complete your look with dress shoes or elegant sandals; kindly leave <strong>T-shirts, slippers, and Crocs at home.</strong></p>
        <p className="attire-bride-note">White gowns are reserved for the bride. Traditional cream barongs are welcome.</p>
      </aside>
    </div>
    <dialog ref={lightbox} className="attire-lightbox" aria-label="Enlarged attire inspiration" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setExpanded(v=>v===null?0:(v+1)%panels.length);}}}>
      {expanded!==null&&<div className="attire-lightbox-content"><button type="button" className="attire-lightbox-close" aria-label="Close attire image" onClick={close}><X size={26}/></button><h3>{panels[expanded].title}</h3><div className={`attire-lightbox-image${zoomed?" is-zoomed":""}`}><img src={`/invitation/attire/${panels[expanded].image}`} alt={panels[expanded].alt}/></div><div className="attire-controls"><button type="button" aria-label="Previous attire image" onClick={()=>setExpanded(v=>v===null?0:(v+1)%panels.length)}><ChevronLeft size={28}/></button><span>{expanded+1} / {panels.length}</span><button type="button" aria-label={zoomed?"Fit attire image to screen":"Zoom in on attire image"} aria-pressed={zoomed} onClick={()=>setZoomed(v=>!v)}>{zoomed?<ZoomOut size={24}/>:<ZoomIn size={24}/>}</button><button type="button" aria-label="Next attire image" onClick={()=>setExpanded(v=>v===null?0:(v+1)%panels.length)}><ChevronRight size={28}/></button></div><p className="attire-viewer-hint">Tap the magnifier, then scroll to view. Tap outside to close.</p></div>}
    </dialog>
  </section>;
}
