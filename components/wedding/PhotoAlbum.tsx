'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const photos = [
  { src: '/photos/revamp/tunnel-story.jpg', title: 'Where our roots meet', alt: 'The couple together beneath a historic stone arch' },
  { src: '/photos/revamp/tunnel-embrace.jpg', title: 'A little closer', alt: 'The couple sharing a tender moment beneath a heritage arch' },
  { src: '/photos/revamp/indoor-portrait.jpg', title: 'A style of her own', alt: 'The bride smiling in embroidered Filipiniana attire' },
  { src: '/photos/revamp/indoor-full-length.jpg', title: 'Every detail matters', alt: 'The bride showing the full detail of her Filipiniana ensemble' },
  { src: '/photos/revamp/indoor-detail.jpg', title: 'Little beautiful things', alt: 'The bride holding a floral hand fan in embroidered Filipiniana attire' },
];

export function PhotoAlbum() {
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const change = (direction: number) => setSelected(value => value === null ? null : (value + direction + photos.length) % photos.length);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEnds({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update(); el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(el);
    return () => { el.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);
  const scroll = (direction: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * .75, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <section id="photos" className="photo-album section" aria-labelledby="album-title">
      <div className="album-heading"><div><span className="eyebrow">MGA ALAALA / OUR MEMORIES</span><h2>A love in little moments.</h2><p>The laughter, the quiet, and everything in between.</p></div><div className="album-controls"><button onClick={() => scroll(-1)} disabled={ends.start} aria-label="Scroll photos left"><ArrowLeft size={21}/></button><button onClick={() => scroll(1)} disabled={ends.end} aria-label="Scroll photos right"><ArrowRight size={21}/></button></div></div>
      <div ref={track} className="album-track" aria-label="Couple photo gallery" tabIndex={0}>
        {photos.map((photo, i) => <button key={photo.src} className="album-card" onClick={event => { opener.current = event.currentTarget; setSelected(i); }} aria-label={`Open photo ${i + 1}: ${photo.title}`}><div className="album-image"><img src={photo.src} alt={photo.alt} width="900" height="1200" loading="lazy"/><span className="album-expand"><Maximize2 size={18}/></span></div><span className="album-caption"><span>{photo.title}</span><small>0{i + 1}</small></span></button>)}
      </div>
      <p className="album-hint">Swipe through our memories. Tap a photograph to linger a little longer.</p>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="album-lightbox" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); change(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); } }}>
          <DialogTitle className="sr-only">Our photo album</DialogTitle>
          <DialogDescription className="sr-only">Use the previous and next buttons or arrow keys to browse. Press Escape to close.</DialogDescription>
          {selected !== null && <><img className="lightbox-photo" src={photos[selected].src} alt={photos[selected].alt}/><div className="lightbox-footer"><button onClick={() => change(-1)} aria-label="Previous photo"><ArrowLeft/></button><p aria-live="polite">{photos[selected].title}<span>{selected + 1} / {photos.length}</span></p><button onClick={() => change(1)} aria-label="Next photo"><ArrowRight/></button></div></>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
