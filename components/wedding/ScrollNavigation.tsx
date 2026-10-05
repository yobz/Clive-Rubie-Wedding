'use client';
import {useEffect,useState} from 'react';

const sections = [['story','Our story'],['wedding-details','The day'],['places','Venues'],['programme','Programme'],['colours','Colours'],['attire','Attire'],['gallery','Gallery'],['faq','FAQs'],['rsvp','RSVP']];
export function ScrollNavigation(){
 const [visible,setVisible]=useState(false);
 const [open,setOpen]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>80);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 const links=(items:string[][])=>items.map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>);
 return <header className={`scroll-navigation${visible?' shown':''}`} aria-hidden={!visible}><nav aria-label="Main navigation">
 <a className="nav-monogram" href="#home" aria-label="Clive and Rubie home" onClick={()=>setOpen(false)}><img src="/invitation/monogram-new.png" alt=""/></a>
 <button type="button" className={`nav-menu-toggle${open?' is-open':''}`} aria-label={open?'Close section menu':'Open section menu'} aria-expanded={open} aria-controls="section-navigation" onClick={()=>setOpen(!open)}><span className="nav-menu-icon" aria-hidden="true"><i/><i/><i/></span><span>Sections</span></button>
 <div id="section-navigation" className={`nav-section-links${open?' is-open':''}`}><div className="nav-links-left">{links(sections.slice(0,4))}</div><div className="nav-links-right">{links(sections.slice(4))}</div></div>
 </nav></header>
}


