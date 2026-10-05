'use client';
import {useState, type CSSProperties} from 'react';
import {WeddingInvitation} from '../../components/wedding/WeddingInvitation';
import './preview.css';
const choices = [
 {name:'Brittany Signature',family:'Brittany',note:'Airy, delicate signature. my first choice.',source:'https://www.dafont.com/brittany-signature.font'},
 {name:'Autography',family:'Autography',note:'Sweeping, relaxed lettering with a handwritten rhythm.',source:'https://www.dafont.com/autography.font'},
 {name:'Billion Dreams',family:'Billion',note:'Fuller strokes and a more expressive, celebratory look.',source:'https://www.dafont.com/billion-dreams.font'},
];
export default function FontPreview(){
 const [selected,setSelected]=useState(0);
 return <><div className="font-review"><header><p>CLIVE & RUBIE · TYPE STUDY</p><h1>Three new directions</h1><p>Compare the same sections below, then select a font to see it throughout the invitation. The banner keeps Amsterdam.</p></header><div className="font-options">{choices.map((font,i)=><article key={font.family} style={{'--sample-font':font.family} as CSSProperties}><div className="font-option-label"><b>{i+1}. {font.name}</b><p>{font.note}</p></div><div className="font-story"><h2>Ang aming kwento</h2><p>A story still being written.</p><span className="font-ornament">❖</span><img src="/photos/revamp/tunnel-story.jpg" alt="Clive and Rubie beneath a heritage arch"/><h3>Chapter one</h3><p>From a shared beginning to a lifetime together.</p></div><div className="font-rsvp"><h2>Will you join us?</h2><p>WE WOULD BE DELIGHTED TO HAVE YOU.</p></div><button aria-pressed={selected===i} onClick={()=>setSelected(i)}>{selected===i?'Showing below':'Preview full invitation'}</button><a href={font.source} target="_blank" rel="noreferrer">Font source ↗</a></article>)}</div><p className="font-license">Personal-use font samples from the designers’ DaFont listings. Public web embedding rights should be checked with the chosen font’s designer before launch.</p><div className="font-selected">Full invitation preview · {choices[selected].name} <a href="#preview-start">View banner ↓</a></div></div><div id="preview-start" className="font-full-preview" style={{'--script':`'${choices[selected].family}', cursive`} as CSSProperties}><WeddingInvitation /></div></>;
}
