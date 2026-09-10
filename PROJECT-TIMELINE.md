# Wedding Invitation Project Timeline

## Starting point

- Built a React 19, TypeScript, Vinext/Vite wedding invitation with Cloudflare D1 RSVP support.
- Core sections included the hero, story, event details, maps, calendars, attire, gifts, FAQs, countdown, and RSVP.
- RSVP validation covered guest name, attendance, dietary preferences, song request, request UUIDs, origin checks, field limits, and duplicate retry protection.
- Sample wedding details remain in the app and must be personalized before guest distribution.

## Cinematic UI/UX pass

- Reviewed the inspiration site and the available photo inventory.
- Reviewed 562 raw images using contact sheets and larger finalist inspections.
- Selected original couple photography for the banner and gallery.
- Added the full-width photographic hero, sequenced title entrance, image settle, staggered scroll reveals, sticky navigation, and scroll progress.
- Added a five-photo gallery with touch scrolling, arrow controls, keyboard navigation, Escape handling, focus trapping, and focus restoration.
- Added reduced-motion behavior so content remains usable without animation.
- Preserved RSVP, countdown, maps, calendar downloads, travel details, gifts, and FAQs.
- Rejected an image-generation edit because it changed facial, embroidery, and architectural details. The published banner uses the original photograph.

## Validation completed

- ESLint passed with 0 errors and 273 warnings, primarily existing image and generated-artifact warnings.
- Vinext production build passed.
- Native `npx next build` passed with `/` static and `/api/rsvp` dynamic.
- Local Wrangler preview rendered at `http://127.0.0.1:8787`.
- Browser accessibility snapshot showed the hero, navigation, story, event details, gallery, and RSVP entry point.
- First-viewport visual inspection passed.
- Full browser interaction and screen-reader coverage remain incomplete.

## Vercel exploration

- Identified that the original Cloudflare D1 API could not deploy unchanged to Vercel.
- Temporarily migrated the RSVP route to Neon and verified the native Next build.
- Added a Postgres schema and Vercel deployment notes, then decided to remove Neon for now so the current work can focus on UI/UX.
- Published the project to GitHub at `https://github.com/yobz/Wedding-Invitation.git` on branch `main`.
- Latest published commit before the Neon cleanup: `4239888` (`Prepare wedding invitation for Vercel`).

## Current handoff state

- Continue using native Next.js for Vercel UI previews.
- Neon is being removed now; RSVP persistence should remain clearly disabled until a database decision is made.
- The next useful work is visual refinement and responsive inspection, especially mobile framing, typography, gallery behavior, RSVP disabled-state messaging, and personalization of the wedding content.
- Before public distribution, add a real RSVP database or another approved persistence service, run its schema, configure deployment secrets, and test a real submission.
- The current working tree will need a follow-up commit and push after the Neon cleanup.
