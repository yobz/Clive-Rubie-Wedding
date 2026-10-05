'use client';
import {useEffect,useState} from 'react';
const ceremony = Date.parse('2026-11-29T13:00:00+08:00');
export function WeddingCountdown(){
 const[remaining,setRemaining]=useState<number|null>(null);
 useEffect(()=>{const tick=()=>setRemaining(Math.max(0,Math.floor((ceremony-Date.now())/1000)));tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)},[]);
 const values=remaining===null?null:[Math.floor(remaining/86400),Math.floor(remaining%86400/3600),Math.floor(remaining%3600/60),remaining%60];
 return <><time className="hero-date" dateTime="2026-11-29">November 29, 2026</time><div className="hero-countdown" role="group" aria-label="Countdown to our ceremony, November 29, 2026 at 1 PM Philippine time">{['Days','Hours','Minutes','Seconds'].map((label,i)=><div key={label}><b>{values?String(values[i]).padStart(2,'0'):'-'}</b><span>{label}</span></div>)}</div></>
}
export function WeddingDetails(){return <section id="wedding-details" className="section wedding-details"><div className="container"><h2>Wedding Details</h2><dl><div><dt>Date</dt><dd>November 29, 2026</dd></div><div><dt>Ceremony</dt><dd>1:00 PM</dd></div><div><dt>Cocktails</dt><dd>4:00 PM</dd></div><div><dt>Reception</dt><dd>5:00 PM</dd></div></dl><p>Cocktails begin at 4:00 PM, followed by the reception programme at 5:00 PM.</p></div></section>}
