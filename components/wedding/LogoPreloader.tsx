'use client';
import {useEffect,useRef,useState} from 'react';
import './envelope.css';

type SealAnimation={op:number;ip:number;fr:number;layers:{nm:string;op:number;ks:{o:{k:{t:number}[]};s:{k:number[]}}}[]};

export function LogoPreloader({notFound=false}:{notFound?:boolean}={}){
 const [phase,setPhase]=useState<'drawing'|'ready'|'opening'|'done'>('drawing');
 const [fallback,setFallback]=useState(false);
 const overlay=useRef<HTMLDivElement>(null);
 const artwork=useRef<HTMLSpanElement>(null);
 const opening=useRef(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const active=phase!=='done';
 useEffect(()=>{
  let cancelled=false;
  let animation:import('lottie-web').AnimationItem|undefined;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fail=()=>{if(!cancelled){setFallback(true);setPhase('ready');}};
  Promise.all([import('lottie-web'),fetch('/seal-preview/splash.json?v=clean-monogram-3').then(r=>{if(!r.ok)throw new Error('Animation unavailable');return r.json() as Promise<SealAnimation>;})]).then(([module,data])=>{
   if(cancelled||!artwork.current)return;
   // The preview's final hold is unnecessary here: show the prompt once C&R settles.
   const finalFrame=data.layers.find(l=>l.nm==='mono')?.ks.o.k.at(-1)?.t;
   if(typeof finalFrame!=='number')throw new Error('Missing monogram timing');
   const monogram=data.layers.find(l=>l.nm==='mono');
   // Reduce the central artwork by 15 displayed pixels; retain its center anchor.
   if(monogram)monogram.ks.s.k=[85,85,100];
   data.op=finalFrame+1;
   data.layers.forEach((l:{op:number})=>{l.op=data.op;});
   animation=module.default.loadAnimation({container:artwork.current,renderer:'svg',loop:false,autoplay:!reduced,animationData:data});
   // Scale the approved sequence to three seconds without changing its relative timing.
   animation.setSpeed((data.op - (data.ip ?? 0)) / data.fr / 3);
   animation.addEventListener('complete',()=>{if(!cancelled)setPhase('ready');});
   animation.addEventListener('data_failed',fail);
   if(reduced)animation.addEventListener('DOMLoaded',()=>{animation?.goToAndStop(finalFrame,true);if(!cancelled)setPhase('ready');});
  }).catch(fail);
  return()=>{cancelled=true;animation?.destroy();};
 },[]);
 useEffect(()=>{
  if(!active)return;
  const previous=document.body.style.overflow;
  const siblings=Array.from(overlay.current?.parentElement?.children??[]).filter(e=>e!==overlay.current&&e.tagName!=='NEXTJS-PORTAL') as HTMLElement[];
  const states=siblings.map(e=>e.inert);
  siblings.forEach(e=>{e.inert=true;});document.body.style.overflow='hidden';
  overlay.current?.focus({preventScroll:true});
  return()=>{document.body.style.overflow=previous;siblings.forEach((e,i)=>{e.inert=states[i];});};
 },[active]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 function open(){
  if(phase!=='ready'||opening.current)return;
  if(notFound){window.location.assign('/');return;}
  opening.current=true;
  // Keep the existing synchronous music unlock; audible music starts after the fade.
  window.dispatchEvent(new Event('wedding:open-start'));
  setPhase('opening');
  timer.current=setTimeout(()=>{
   overlay.current?.parentElement?.classList.add('invitation-entered');
   setPhase('done');window.dispatchEvent(new Event('wedding:open-complete'));
   requestAnimationFrame(()=>{const main=document.getElementById('main');if(main){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}});
  },window.matchMedia('(prefers-reduced-motion: reduce)').matches?180:550);
 }
 if(phase==='done')return null;
 return <div ref={overlay} tabIndex={-1} className={`wedding-envelope-gate is-${phase}${notFound?' is-not-found':''}`} role="dialog" aria-modal="true" aria-label={notFound?'Page not found':"Open Clive and Rubie's wedding invitation"}>
  <div className="wedding-envelope-scene">
   <button type="button" className="wedding-splash-logo" onClick={open} disabled={phase!=='ready'} aria-label={notFound?'Return to our invitation':'Open invitation'}>
    <span ref={artwork} className="wedding-splash-artwork" aria-hidden="true"/>
    {fallback&&<img src="/seal-preview/seal-static.webp" alt=""/>}
   </button>
   <div className="wedding-splash-prompt" aria-hidden={phase==='drawing'}>
    {notFound&&<><p className="not-found-code">404</p><h1 className="not-found-title">A little lost?</h1><p className="not-found-description">This page could not be found. Our celebration is just a tap away.</p></>}
    <button type="button" className="wedding-splash-prompt-button" onClick={open} disabled={phase!=='ready'} tabIndex={notFound?0:-1}><span>{notFound?'Return to our invitation':'Tap to open our invitation'}</span></button>
   </div>
  </div>
 </div>;
}




