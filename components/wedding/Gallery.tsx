'use client';
import {ChevronLeft,ChevronRight,X} from "lucide-react";

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import './gallery.css';

// Original adaptation of the shared-element gallery pattern demonstrated at
// https://21st.dev/@jahed/components/shared-element-gallery.
// Selected from the couple’s shared photograph collection; natural framing preserved.
// Original photos from all three shared folders, interleaved for variety.
const moments = [
  {
    "id": 1,
    "src": "/photos/gallery/moment-4614.webp",
    "alt": "Dancing together as white birds fly across the courtyard",
    "width": 1800,
    "height": 1200,
    "tone": "garden"
  },
  {
    "src": "/photos/gallery/portrait-4226.webp",
    "alt": "Clive adjusting his embroidered Barong cuff in a heritage room",
    "width": 1333,
    "height": 2000,
    "tone": "finished",
    "id": 3
  },
  {
    "id": 4,
    "src": "/photos/gallery/moment-4963.webp",
    "alt": "Clive and Rubie smiling together in coordinated pink and navy attire",
    "width": 1333,
    "height": 2000,
    "tone": "finished"
  },
  {
    "id": 5,
    "src": "/photos/gallery/moment-4702-repaired.webp",
    "alt": "A joyful twirl beneath a bright blue sky",
    "width": 1536,
    "height": 1024,
    "tone": "garden"
  },
  {
    "src": "/photos/gallery/evening-4421.webp",
    "alt": "Clive and Rubie sharing a quiet moment beneath a glowing lantern",
    "width": 1333,
    "height": 2000,
    "tone": "evening",
    "id": 6
  },
  {
    "id": 7,
    "src": "/photos/gallery/moment-4258.webp",
    "alt": "Rubie looking up at Clive across a cafe table in her embroidered Filipiniana",
    "width": 1333,
    "height": 2000,
    "tone": "heritage"
  },
  {
    "id": 8,
    "src": "/photos/gallery/moment-4994.webp",
    "alt": "Clive and Rubie embracing beside a carved wooden staircase",
    "width": 2000,
    "height": 1333,
    "tone": "garden"
  },
  {
    "src": "/photos/gallery/portrait-4103.webp",
    "alt": "Clive and Rubie laughing together in a warm heritage room",
    "width": 2000,
    "height": 1333,
    "tone": "finished",
    "id": 9
  },
  {
    "id": 10,
    "src": "/photos/gallery/moment-5070.webp",
    "alt": "Clive and Rubie making a heart with their arms beside a sunlit heritage window",
    "width": 1600,
    "height": 2400,
    "tone": "finished"
  },
  {
    "id": 11,
    "src": "/photos/gallery/moment-4395-updated.webp",
    "alt": "Clive and Rubie laughing together in matching green outfits outdoors",
    "width": 1333,
    "height": 2000,
    "tone": "heritage"
  },
  {
    "id": 12,
    "src": "/photos/gallery/moment-5089.webp",
    "alt": "Clive and Rubie dancing beside a sunlit heritage window",
    "width": 1333,
    "height": 2000,
    "tone": "finished"
  },
  {
    "id": 13,
    "src": "/photos/gallery/moment-4841.webp",
    "alt": "A close-up of their hands held together",
    "width": 1800,
    "height": 1200,
    "tone": "garden"
  },
  {
    "src": "/photos/gallery/moment-4344.webp",
    "alt": "Clive and Rubie sharing coffee beneath woven lamps and a chandelier",
    "width": 1333,
    "height": 2000,
    "tone": "finished",
    "id": 14
  },
  {
    "id": 15,
    "src": "/photos/gallery/moment-4861.webp",
    "alt": "An embrace in front of an ornate white building",
    "width": 1200,
    "height": 1800,
    "tone": "garden"
  }
,
  {id:16,src:'/photos/gallery/moment-4977.webp',alt:'Clive and Rubie laughing together with a playful embrace',width:1333,height:2000,tone:'finished'}
,{"id":17,"src":"/photos/gallery/moment-4108.webp","alt":"Rubie smiling up at Clive in their embroidered heritage outfits","width":1333,"height":2000,"tone":"shadow-lift"},
{"id":18,"src":"/photos/gallery/river-walk.webp","alt":"Clive and Rubie walking hand in hand through a leafy river","width":2000,"height":1333,"tone":"heritage"},
{"id":19,"src":"/photos/gallery/moment-4980.webp","alt":"Clive and Rubie making playful faces beneath antique portraits","width":2000,"height":1333,"tone":"finished"},
{"id":20,"src":"/photos/gallery/moment-5246.webp","alt":"Clive and Rubie laughing and holding hands outside a heritage house","width":2000,"height":1333,"tone":"finished"},
{"id":21,"src":"/photos/gallery/moment-5234.webp","alt":"Clive and Rubie tossing their shoes into the blue sky","width":1333,"height":2000,"tone":"finished"}
];

// Mix tall and wide photographs throughout the masonry columns.
const galleryOrder = [1, 7, 5, 4, 17, 6, 3, 14, 21, 9, 15, 11, 8, 12, 20, 19, 16, 13, 10, 18];
const orderedMoments = galleryOrder.map(id => moments.find(moment => moment.id === id)!);
const galleryMoments = orderedMoments.map((moment, index) => ({ ...moment, id: index + 1, ratio: moment.width / moment.height }));

function Photograph({ index }: { index: number }) {
  const moment = galleryMoments[index];
  return <img className={`gallery-photo gallery-photo--${moment.tone}`} src={moment.src} alt={moment.alt} width={moment.width} height={moment.height} loading="lazy" draggable={false} />;
}

export function Gallery() {
  const [columnCount, setColumnCount] = useState(4);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setColumnCount(query.matches ? 2 : 4);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const columns = Array.from({ length: columnCount }, (_, column) => galleryMoments.map((moment, index) => ({ moment, index })).filter((_, index) => index % columnCount === column));
  const [active, setActive] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const galleryId = useId();
  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 300, damping: 32 };

  useEffect(() => {
    if (!viewerOpen) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (modal && !modal.open) modal.showModal();
    closeButton.current?.focus();
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [viewerOpen]);

  const close = () => setActive(null);
  const move = (step: number) => setActive(value => value === null ? null : (value + step + galleryMoments.length) % galleryMoments.length);

  return <section id="gallery" className="section wedding-gallery" aria-labelledby="gallery-heading">
    <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><filter id="gallery-shadow-lift" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="0.76" offset="0"/><feFuncG type="gamma" amplitude="1" exponent="0.76" offset="0"/><feFuncB type="gamma" amplitude="1" exponent="0.76" offset="0"/></feComponentTransfer></filter></defs></svg><LayoutGroup id={galleryId}>
      <div className="container">
        <header className="section-title"><p className="eyebrow">Little moments, a lifetime of love</p><h2 id="gallery-heading">Our gallery</h2><p className="subtitle">A few moments from our story.</p></header>
        <div className="wedding-gallery-grid">{columns.map((column, columnIndex) => <div className="gallery-column" key={columnIndex}>{column.map(({ moment, index }) =>
          <button type="button" className="gallery-tile" key={moment.id} aria-haspopup="dialog" aria-label={`Open photograph ${moment.id} of ${galleryMoments.length}: ${moment.alt}`} onClick={event => {
            opener.current = event.currentTarget;
            dialog.current?.showModal();
            setViewerOpen(true);
            setActive(index);
          }}>
            <motion.span className={`gallery-image gallery-tone-${index % 3}`} layoutId={reducedMotion ? undefined : `moment-${moment.id}`} transition={transition} style={{ aspectRatio: moment.ratio, visibility: active === index ? 'hidden' : 'visible' }}>
              <Photograph index={index} />
            </motion.span>
          </button>)}</div>)}
        </div>
      </div>
      <dialog ref={dialog} className="gallery-lightbox" aria-label="Wedding photo gallery" aria-describedby={`${galleryId}-instructions`} onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        // Keep focus on the viewer controls in browsers with differing dialog Tab behavior.
        if (event.key === 'Tab') {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
        <AnimatePresence onExitComplete={() => setViewerOpen(false)}>
          {active !== null && <motion.div key="viewer" layoutRoot className="gallery-viewer" initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.22 }}>
            <div className="gallery-frost" onClick={close} aria-hidden="true" />
            <button ref={closeButton} type="button" className="gallery-close" onClick={close} aria-label="Close gallery"><X size={24} aria-hidden="true"/></button>
            <button type="button" className="gallery-prev" onClick={() => move(-1)} aria-label="Previous photograph"><ChevronLeft size={28} aria-hidden="true"/></button>
            <figure>
              <motion.div key={galleryMoments[active].id} layoutId={reducedMotion ? undefined : `moment-${galleryMoments[active].id}`} className={`gallery-image gallery-expanded gallery-tone-${active % 3}`} transition={transition} drag={reducedMotion ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.65} dragSnapToOrigin onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 700) close();
              }} style={{ aspectRatio: galleryMoments[active].ratio, width: `min(100%, calc(68dvh * ${galleryMoments[active].ratio}))` }}>
                <Photograph index={active} />
              </motion.div>
              <figcaption aria-live="polite">{active + 1} / {galleryMoments.length}</figcaption>
              <p id={`${galleryId}-instructions`} className="gallery-instructions">Use the arrows to explore · Esc to close{!reducedMotion && ' · Drag to dismiss'}</p>
            </figure>
            <button type="button" className="gallery-next" onClick={() => move(1)} aria-label="Next photograph"><ChevronRight size={28} aria-hidden="true"/></button>
          </motion.div>}
        </AnimatePresence>
      </dialog>
    </LayoutGroup>
  </section>;
}


