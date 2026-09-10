# Banner and motion update

Reference: https://www.thedigitalyes.com/ . Its public application content describes animated invitation openings, personal photo backgrounds, galleries, countdowns, RSVP, maps, and guest details. The browser runtime was unavailable, so this review used the site's public content and application assets; it was not an interactive visual review.

Applied an original interpretation: a full-width photographic opening, sequenced title entrance, a brief image settle, staggered scroll reveals, subtle hover responses, sticky navigation, scroll progress, and a five-photo gallery with a keyboard-accessible dialog. Existing RSVP, calendars, countdown, travel details, and FAQs remain available. The invitation opens directly with no login or mandatory entrance screen.

Motion is progressive enhancement: content is visible before JavaScript runs. IntersectionObserver reveals content once, offscreen animation does not loop, and `prefers-reduced-motion` removes animated transitions and transforms. Photo browsing supports native touch scrolling, scroll buttons, arrow-key lightbox navigation, Escape to dismiss, trapped dialog focus, and restoration to the opening thumbnail.

The embedded public Drive listing exposed 562 raw images. The first 50 had been reviewed in the earlier pass; all remaining 512 were reviewed on labeled contact sheets, followed by larger-image inspection of the finalists.

New raw assets:
- Banner: IMG_4567.jpg — 1bXkmi1Um7B5Ipd-RLv7_mQNltLW02P5l. Couple at right beneath illuminated stone arch; empty wall supports left-aligned text. Mobile image framing favors 82% horizontal / 58% vertical.
- Gallery: IMG_4503.jpg — wider cobblestone/stone-wall composition.
- Gallery: IMG_4563.jpg — couple facing the camera beneath the arch.

One imagegen enhancement was attempted for the banner and rejected after visual inspection because it altered facial, embroidery, and stone details. The published banner uses the original photograph; no generated edit is used. Original Drive files are unchanged. Layout crops and shading are applied in CSS.

Validation: TypeScript passes. Production build validates bundle generation and routes. Browser interaction, visual layout, and screen-reader checks could not be performed in the unavailable browser runtime. No database schema or RSVP endpoint changes were made.
