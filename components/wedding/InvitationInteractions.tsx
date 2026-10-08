"use client";

import { useState } from "react";
import {Plus,Minus} from "lucide-react";

const questions = [
  { question: "What time should we arrive?", answer: "The ceremony begins at 1:00 PM on November 29, 2026. Please arrive before the ceremony begins. Cocktails start at 4:00 PM, followed by the reception programme at 5:00 PM." },
  { question: "Is parking available?", answer: "Yes, parking is available at both the church and reception venue." },
  { question: "Can we take photos during the ceremony?", answer: <>We would love you to be fully present for our unplugged ceremony. Please keep phones and cameras tucked away <strong>from the moment the entourage walks down the aisle until the ceremony ends.</strong> This keeps the aisle clear and lets everyone enjoy the moment. Our photographers will capture the memories, and we will share the photos with everyone afterward. Thank you for celebrating with us!</> },
  { question: "Where can we stay nearby?", answer: <>You can stay at <a href="https://www.facebook.com/NatosFarm" target="_blank" rel="noopener noreferrer">Nato's Farm</a>. Please DM them on Facebook for accommodation inquiries and mention Clive and Rubie's wedding. For another countryside option, explore the villas at <a href="https://bantuglakeranch.com/villas/" target="_blank" rel="noopener noreferrer">Bantug Lake Ranch</a>. If you prefer a city hotel, <a href="https://www.lfisherhotelbacolod.com/" target="_blank" rel="noopener noreferrer">L' Fisher Hotel</a> offers accommodation along Lacson Street in Bacolod. Please contact your chosen property directly for availability and arrange transport to the venues.</> },
  { question: "How do we confirm our attendance?", answer: <>Please submit the RSVP form on your personal invitation link <strong className="rsvp-deadline-date">on or before November 7, 2026</strong>. Contact Clive and Rubie personally if you need to make changes afterward.</> },
];

export function FAQList() {
  const [expanded, setExpanded] = useState<string[]>([]);
  return <div className="faq-list">{questions.map(({question,answer},index)=>{
    const open=expanded.includes(question);
    return <div className="faq-item" key={question}>
      <button type="button" className="faq-trigger" aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={()=>setExpanded(values=>open?values.filter(value=>value!==question):[...values,question])}>
        {question}<span className="faq-indicator" aria-hidden="true">{open?<Minus size={30} strokeWidth={2} />:<Plus size={30} strokeWidth={2} />}</span>
      </button>
      <div id={`faq-answer-${index}`} className={`faq-answer ${open?'is-open':''}`} inert={!open} aria-hidden={!open}><div><p>{answer}</p></div></div>
    </div>;
  })}</div>;
}
