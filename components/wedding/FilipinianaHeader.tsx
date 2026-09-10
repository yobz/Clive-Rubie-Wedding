import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { weddingData } from '@/lib/wedding-data';

export function FilipinianaHeader() {
  return (
    <section className="hero heirloom-hero" id="home" aria-labelledby="hero-title">
      <div className="hero-topline"><span>A CELEBRATION OF LOVE & HERITAGE</span><span>MANILA, PHILIPPINES</span></div>
      <figure className="heirloom-portrait">
        <div className="portrait-frame"><img src="/photos/portrait.jpg" alt="The couple sharing a kiss in embroidered Filipiniana attire, surrounded by woven furnishings" width="1200" height="1800" fetchPriority="high" /></div>
        <figcaption>Sa bawat bukas, ikaw.</figcaption>
      </figure>
      <div className="hero-copy invitation-paper">
        <span className="paper-monogram" aria-hidden="true">I & M</span>
        <span className="eyebrow">TOGETHER WITH OUR FAMILIES</span>
        <p className="invitation-line">With love, we invite you to the wedding of</p>
        <h1 id="hero-title">Isabel <span>&</span><br />Mateo</h1>
        <p className="hero-description">A promise for a lifetime.<br />A day to share with you.</p>
        <div className="hero-date"><span>20</span><div>FEBRUARY 2027<small>SATURDAY · INTRAMUROS, MANILA</small></div></div>
        <a href="#rsvp" className="button">Join our celebration <ArrowUpRight size={17} /></a>
        <p className="respond-by">Kindly respond by {weddingData.deadline}</p>
      </div>
      <figure className="heirloom-scene">
        <p className="scene-note">Something old.<br /><em>Something forever.</em></p>
        <div className="scene-frame"><img src="/photos/heritage.jpg" alt="The couple holding hands beneath woven lattice arches and warm hanging lanterns" width="1800" height="1200" /></div>
        <figcaption>ROOTED IN TRADITION. WRITTEN WITH LOVE.</figcaption>
      </figure>
      <a className="discover" href="#story"><ArrowDown size={15} /> TURN THE PAGE</a>
    </section>
  );
}
