'use client';
import {useEffect,useState} from 'react';
export function ScrollNavigation(){
 const[visible,setVisible]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>80);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 return <header className={`scroll-navigation${visible?' shown':''}`} inert={!visible} aria-hidden={!visible}><nav aria-label="Main navigation"><a href="#story">Our story</a><a href="#places">The day</a><a className="nav-monogram" href="#home" aria-label="Clive and Rubie home"><img src="/invitation/monogram-new.png" alt=""/></a><a href="#attire">Details</a><a href="#rsvp">RSVP</a></nav></header>
}
