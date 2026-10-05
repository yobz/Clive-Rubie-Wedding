"use client";

import { useState, type FormEvent } from "react";
import {Plus,Minus} from "lucide-react";

export function StorySlideshow() {
  return <div className="story-photo-frame">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/photos/revamp/tunnel-story.jpg" alt="Clive and Rubie together beneath the stone arch"
      className="story-slide is-active" loading="lazy" decoding="async" width={1200} height={800} />
  </div>;
}
export function LocalRSVP() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem("guestName") as HTMLInputElement;
    name.setCustomValidity(name.value.trim() ? "" : "Please enter your name.");
    if (!form.reportValidity()) return;
    setSent(true);
  }

  return (
    <div className="rsvp-panel">
      <h2 id="rsvp-heading">Will you join us?</h2>
      <p className="eyebrow">We would be delighted to have you.</p>
      <form onSubmit={submit} onChange={() => setSent(false)} aria-labelledby="rsvp-heading" aria-describedby="rsvp-preview-note">
        <div className="rsvp-row">
          <label className="name" htmlFor="guest-name">
            <span>Your name <span aria-hidden="true">*</span></span>
            <input id="guest-name" name="guestName" autoComplete="name" placeholder="Your full name" required maxLength={120}
              onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </label>
          <fieldset className="attendance">
            <legend>Will you attend? <span aria-hidden="true">*</span></legend>
            <label><input type="radio" name="attendance" value="attending" required /> Attending</label>
            <label><input type="radio" name="attendance" value="declining" required /> Declining</label>
          </fieldset>
        </div>
        <label className="message-field" htmlFor="couple-message">
          <span>A message for the couple <span className="optional">(optional)</span></span>
          <textarea id="couple-message" name="message" rows={4} maxLength={2000} placeholder="Leave Clive and Rubie a little love…" />
        </label>
        <div className="rsvp-actions">
          <p id="rsvp-preview-note" className="form-note">Preview only. responses are not sent or saved yet.</p>
          <button type="submit" className="button primary">Preview RSVP</button>
        </div>
        <p className="rsvp-status" role="status" aria-live="polite">{sent ? "Thank you! Your preview response is complete. It has not been sent or saved." : ""}</p>
      </form>
    </div>
  );
}

const questions = [
  { question: "What time should we arrive?", answer: "The ceremony begins at 1:00 PM on November 29, 2026. Please arrive before the ceremony begins. Cocktails start at 4:00 PM, followed by the reception programme at 5:00 PM." },
  { question: "Is parking available?", answer: "Parking arrangements for the church and reception venue will be shared here before the wedding." },
  { question: "Can we take photos during the ceremony?", answer: "We invite you to be fully present during our unplugged ceremony. Please keep phones and cameras tucked away as we exchange our vows." },
  { question: "Where can we stay nearby?", answer: "Accommodation suggestions and travel details will be added once confirmed." },
  { question: "How do we confirm our attendance?", answer: "Our RSVP form is currently a preview. The final RSVP deadline and submission details will be shared when responses open." },
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
