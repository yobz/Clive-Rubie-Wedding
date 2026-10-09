'use client';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import './attire.css';
type Message={name:string;message:string};
export function GuestMessages(){
 const [messages,setMessages]=useState<Message[]>([]),[active,setActive]=useState(0);
 useEffect(()=>{let live=true;const load=()=>fetch('/api/guest-messages').then(r=>r.ok?r.json() as Promise<{messages:Message[]}>:null).then(data=>{if(live&&data)setMessages(data.messages);}).catch(()=>{});load();window.addEventListener('wedding:rsvp-saved',load);return()=>{live=false;window.removeEventListener('wedding:rsvp-saved',load);};},[]);
 useEffect(()=>{if(messages.length<2)return;const timer=setInterval(()=>{if(!document.hidden)setActive(v=>(v+1)%messages.length);},10000);return()=>clearInterval(timer);},[active,messages.length]);
 if(!messages.length)return null;
 const current=active%messages.length;
 const change=(direction:number)=>setActive(v=>(v+direction+messages.length)%messages.length);
 return <section className="section guest-messages" aria-labelledby="guest-messages-heading"><div className="container"><header className="section-title"><p className="eyebrow">Words we will treasure</p><h2 id="guest-messages-heading">With love, from you</h2></header><div className="message-carousel" role="region" aria-roledescription="carousel" aria-label="Messages from our guests"><div className="message-slides">{messages.map((item,index)=><figure key={index} className={`message-slide${index===current?' is-current':''}`} aria-hidden={index!==current}><blockquote><span className="message-quote" aria-hidden="true">“</span><p>{item.message}</p></blockquote><figcaption><span aria-hidden="true" className="message-signature-rule"/>{item.name}</figcaption></figure>)}</div>{messages.length>1&&<div className="attire-controls"><button type="button" aria-label="Previous guest message" onClick={()=>change(-1)}><ChevronLeft size={28}/></button><span className="message-position">{current+1} / {messages.length}</span><button type="button" aria-label="Next guest message" onClick={()=>change(1)}><ChevronRight size={28}/></button></div>}</div></div></section>;
}
