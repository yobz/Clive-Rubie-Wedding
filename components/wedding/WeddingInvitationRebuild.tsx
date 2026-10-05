'use client';

import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { EventDetails } from './EventDetails';
import { RSVPSection } from './RSVPSection';
import { weddingData } from '@/lib/wedding-data';

const navigation = [
  ['Story', 'story'],
  ['The day', 'details'],
  ['Gallery', 'gallery'],
  ['Attire', 'attire'],
  ['RSVP', 'rsvp'],
];

export function WeddingInvitationRebuild() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="rebuild-site">
      <a className="rebuild-skip" href="#main">Skip to content</a>
      <header className="rebuild-header">
        <a className="rebuild-mark" href="#home" aria-label="Clive and Rubie, home">
          <span>R</span><i>&amp;</i><span>C</span>
        </a>
        <nav className={menuOpen ? 'rebuild-nav is-open' : 'rebuild-nav'} aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
        <a className="rebuild-rsvp-link" href="#rsvp" onClick={closeMenu}>RSVP <ArrowUpRight size={15} /></a>
        <button className="rebuild-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <main id="main">
        <section className="rebuild-hero" id="home" aria-labelledby="rebuild-title">
          <img src="/photos/revamp/tunnel-hero.jpg" alt="Clive and Rubie beneath an illuminated heritage arch" width="1800" height="1200" fetchPriority="high" />
          <div className="rebuild-hero-wash" />
          <div className="rebuild-hero-top"><span>R&C / 01</span><span>INTRAMUROS, MANILA</span></div>
          <div className="rebuild-hero-copy">
            <p className="rebuild-kicker">WITH THE BLESSING OF OUR FAMILIES</p>
            <h1 id="rebuild-title"><span>Clive</span><em>&amp;</em><span>Rubie</span></h1>
            <p className="rebuild-line">Sa bawat bukas, ikaw.</p>
            <p className="rebuild-date">20 FEBRUARY 2027 <b>/</b> MANILA, PHILIPPINES</p>
            <a className="rebuild-primary" href="#details">Explore the day <ArrowDownRight size={17} /></a>
          </div>
          <div className="rebuild-hero-bottom"><span>ISANG PAG-IBIG. ISANG PANGAKO.</span><span>SCROLL TO DISCOVER ↓</span></div>
        </section>

        <section className="rebuild-welcome" aria-label="Welcome">
          <div className="rebuild-emblem" aria-hidden="true"><span>R</span><i>&amp;</i><span>C</span></div>
          <p>We are gathering our favorite people in the heart of Manila to celebrate a love rooted in family, faith, and Filipino heritage.</p>
          <span className="rebuild-rule" aria-hidden="true" />
        </section>

        <section className="rebuild-story" id="story" aria-labelledby="story-title">
          <div className="rebuild-section-intro"><span className="rebuild-index">02 / ANG AMING KWENTO</span><h2 id="story-title">A story still<br /><i>being written.</i></h2><p>From one shared beginning to a lifetime of choosing each other.</p></div>
          <div className="rebuild-story-layout">
            <figure className="rebuild-story-main"><img src="/photos/revamp/tunnel-story.jpg" alt="Clive and Rubie together beneath a heritage arch" width="1800" height="1200" loading="lazy" /><figcaption>Hand in hand, through every chapter.</figcaption></figure>
            <div className="rebuild-milestones">
              {weddingData.story.map((item, index) => <article key={item.year}><span>0{index + 1} / {item.year}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="rebuild-day" id="details" aria-labelledby="day-title">
          <div className="rebuild-section-intro"><span className="rebuild-index">03 / KAGANAPAN</span><h2 id="day-title">The day,<br /><i>in its own time.</i></h2><p>A simple guide from the first “I do” to the last dance.</p></div>
          <EventDetails />
        </section>

        <section className="rebuild-gallery" id="gallery" aria-labelledby="gallery-title">
          <div className="rebuild-gallery-heading"><div><span className="rebuild-index">04 / MGA ALAALA</span><h2 id="gallery-title">Little moments,<br /><i>held forever.</i></h2></div><p>Our favorite frames from the season of becoming.</p></div>
          <div className="rebuild-gallery-grid">
            <figure className="gallery-wide"><img src="/photos/revamp/tunnel-embrace.jpg" alt="Clive and Rubie sharing a tender moment beneath a stone arch" width="1800" height="1200" loading="lazy" /><figcaption>Where our roots meet</figcaption></figure>
            <figure><img src="/photos/revamp/indoor-portrait.jpg" alt="Rubie in embroidered Filipiniana attire" width="1800" height="1200" loading="lazy" /><figcaption>A style of her own</figcaption></figure>
            <figure><img src="/photos/revamp/indoor-detail.jpg" alt="Rubie holding a floral fan" width="1800" height="1200" loading="lazy" /><figcaption>Little beautiful things</figcaption></figure>
          </div>
        </section>

        <section className="rebuild-attire" id="attire" aria-labelledby="attire-title">
          <img src="/photos/revamp/indoor-full-length.jpg" alt="Filipiniana attire detail" width="1800" height="1200" loading="lazy" />
          <div><span className="rebuild-index">05 / KASUOTAN</span><h2 id="attire-title">Wear a little<br /><i>of our heritage.</i></h2><p>Barong Tagalog, Filipiniana-inspired silhouettes, and formalwear in dusty rose, soft grey, or muted sage.</p><div className="rebuild-swatches"><span style={{ background: '#8d3451' }} /><span style={{ background: '#d85c7a' }} /><span style={{ background: '#b8b8b8' }} /><span style={{ background: '#9ba89a' }} /><span style={{ background: '#b89a62' }} /></div><small>White and ivory gowns are reserved for the bride. A traditional cream barong is welcome.</small></div>
        </section>

        <RSVPSection />

        <section className="rebuild-concierge" id="faq" aria-labelledby="concierge-title">
          <div className="rebuild-section-intro"><span className="rebuild-index">07 / PARA SA INYO</span><h2 id="concierge-title">Everything you need<br /><i>before you arrive.</i></h2><p>Less wondering. More celebrating.</p></div>
          <div className="rebuild-concierge-grid"><article><span>01</span><h3>Stay awhile</h3><p>We will share our favorite places to stay around Intramuros and the old city.</p></article><article><span>02</span><h3>Find your way</h3><p>Maps, parking guidance, and arrival notes will be gathered here for an easy day.</p></article><article><span>03</span><h3>Bring the feeling</h3><p>Come ready for family, good food, old songs, and a dance or two under the stars.</p></article></div>
        </section>
      </main>

      <footer className="rebuild-footer"><div className="rebuild-footer-mark">R <i>&amp;</i> C</div><p>With love, from Manila</p><span>{weddingData.hashtag}</span><small>© 2026 CLIVE &amp; RUBIE</small></footer>
    </div>
  );
}
