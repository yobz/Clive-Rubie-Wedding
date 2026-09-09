# Filipiniana wedding invitation

## Step 1 — Architect blueprint

React 19 with TypeScript, Vinext/Vite, Tailwind CSS 4, Lucide icons, Radix radio groups, Sonner notifications, Zod validation, and Cloudflare D1. Dependencies and reproducible versions are in `package.json` and `package-lock.json`. CSS supplies the lightweight motion without an extra animation dependency.

```text
app/
  page.tsx                    SPA entry point
  layout.tsx                  Metadata and global styles
  globals.css                 Responsive design system
  api/rsvp/route.ts           Validated RSVP persistence endpoint
components/wedding/
  WeddingInvitation.tsx       Navigation, story, attire, gifts, FAQ, countdown
  FilipinianaHeader.tsx       Invitation hero
  EventDetails.tsx            Maps and calendar downloads
  RSVPSection.tsx             Accessible RSVP form
lib/wedding-data.ts           Event/RSVP interfaces and sample content
db/schema.ts                 RSVP data model
drizzle/                     Generated D1 migrations
public/wedding-tablescape.jpg Locally served hero photograph
tailwind.config.ts           Portable theme extension
```

RSVP state comprises a guest name, attendance, dietary preferences, song request, request UUID, submitting state, confirmation, and recoverable error. The server validates all input, uses bound SQL parameters, and deduplicates retries by request UUID. There is no public guest-list or response-reading endpoint.

Guest name entry is enabled. No verified guest lookup is claimed: no authorized guest roster was provided. Sample names, date, stories, venues, parking guidance, and gift wording must be personalized before guest distribution. The deployment is private by default.

## Step 2 — Design system

`tailwind.config.ts` supplies the requested custom extension object. Tailwind 4's active equivalent lives in the `@theme` block in `app/globals.css`. The palette follows piña cream, sampaguita, mahogany, rattan, terracotta, and leaf green. Cormorant Garamond headings pair with Inter body copy. Google Fonts fall back to Georgia and sans-serif when unavailable.

Arched photography references heritage architecture; fine borders, geometric accents, and warm surfaces evoke embroidery and piña fabric. Rattan is decorative, while darker text maintains readability. Reduced-motion preferences disable animation and smooth scrolling. Scroll snapping is deliberately omitted to keep long content and enlarged text freely accessible.

## Step 3 — Implementation

The complete components listed above are runnable source, not snippets. Start with `npm install`, then `npm run dev`. `npm run build` emits the Cloudflare Worker. `npm run db:generate` generates schema migrations. See `README.md` for the inherited local D1 setup commands.

Both event cards download UTC calendar invitations, while Maps actions use encoded venue search queries. Declining hides and clears irrelevant fields in the submitted payload. A persistent inline confirmation and toast appear only after the server acknowledges the save. Failed submissions preserve entries. The countdown uses the explicit Asia/Manila offset and clamps at zero after the wedding.

## Step 4 — QA and accessibility review

Source review covers single-column mobile layouts, flexible navigation, semantic landmarks, one H1, labeled fields, grouped radio controls, visible keyboard focus, skip navigation, native keyboard-accessible FAQs, image dimensions and alt text, reduced motion, and error/success announcements. Main body copy is 16px; supporting metadata is 12px or larger.

Validation: production build and TypeScript passed; scoped ESLint reported zero errors and one advisory for the deliberately pre-sized, locally hosted JPEG. Seven API checks passed (foreign origin, blank name, invalid attendance, field bounds, attending, duplicate retry, declining). Local D1 inspection confirmed exactly two synthetic records and cleared dietary/song fields for the decline. The preview returned HTTP 200.

Cross-browser visual testing, screen-reader testing, and formal WCAG certification are not implied by source review. Browser testing was not explicitly requested. The in-app browser handoff was unavailable in this environment.

The gift wording keeps contributions optional and avoids presenting red envelopes or sabog as universal Filipino wedding customs. Cream barongs remain welcome while white gowns are reserved for the bride.

Photo: Denio Rodríguez, https://unsplash.com/photos/a-table-set-for-a-formal-dinner-with-white-flowers-and-candles-We6mP6sRZdE — Unsplash License, https://unsplash.com/license.
