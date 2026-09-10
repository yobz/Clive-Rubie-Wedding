import { ArrowDown, ArrowUpRight } from 'lucide-react';

export function FilipinianaHeader() {
  return (
    <section className="cinematic-hero" id="home" aria-labelledby="hero-title">
      <div className="banner-image-wrap"><img className="banner-image" src="/photos/revamp/tunnel-hero.jpg" alt="The couple sharing a kiss beneath an illuminated heritage arch" width="1800" height="1200" fetchPriority="high" /></div>
      <div className="banner-shade" aria-hidden="true" />
      <div className="banner-frame" aria-hidden="true" />
      <div className="banner-topline"><span>WITH THE BLESSING OF OUR FAMILIES</span><span>MANILA, PHILIPPINES</span></div>
      <div className="banner-copy">
        <p className="banner-eyebrow">A LOVE ROOTED IN TRADITION</p>
        <h1 id="hero-title"><span className="banner-name">Isabel</span><span className="banner-ampersand">&</span><span className="banner-name">Mateo</span></h1>
        <p className="banner-promise">Sa bawat bukas, ikaw.</p>
        <div className="banner-date"><span>FEBRUARY 20, 2027</span><span aria-hidden="true">·</span><span>INTRAMUROS, MANILA</span></div>
        <div className="banner-actions"><a className="button" href="#rsvp">Celebrate with us <ArrowUpRight size={17} /></a><a className="banner-story-link" href="#story">Our story <ArrowDown size={16}/></a></div>
      </div>
      <div className="banner-bottom"><span>ISANG PAG-IBIG. ISANG PANGAKO.</span><a href="#story" className="banner-scroll" aria-label="Scroll to our story"><span>SCROLL TO DISCOVER</span><ArrowDown size={17}/></a><span>02 / 20 / 27</span></div>
    </section>
  );
}
