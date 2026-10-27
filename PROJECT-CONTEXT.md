# Project Context: Clive & Rubie Wedding Invitation

This file is the portable handoff for continuing the project with another AI assistant. Read it first, then inspect the current source files before making changes. Treat source code and configuration as authoritative when they differ from older notes.

## Project purpose

A private-in-practice wedding invitation website for Clive and Rubie, with a public-facing invitation, individually tokenized household RSVP links, and a password-protected admin dashboard. It is a personal project built with AI assistance. The site discourages indexing and has no public guest-list/response-reading API. The source should remain private because it includes personal photos and a GCash QR image.

## Current stack

- Next.js 16 App Router, React 19, TypeScript, Node.js (see `package.json` for exact versions).
- PostgreSQL via `pg`; SQL schema and local setup scripts are in `scripts/rsvp/`.
- CSS in `app/invitation.css`, `app/globals.css`, and component-specific styles; animations use Framer Motion/Lottie where needed.
- Local development is configured for port 5173. The active deployment path is native Next.js/Vercel, not the legacy Vinext/Cloudflare starter.

## Current product and design

- Main invitation: envelope/logo opening, music control, hero and countdown, couple story, wedding schedule, venues/maps, attire, photo gallery/lightbox, household RSVP, reminders, gifts/GCash QR, and closing.
- Design direction has evolved; inspect `components/wedding/WeddingInvitation.tsx`, its imported components, and current CSS before changing visual details. Older design notes may describe superseded styles.
- Current event content in source: November 29, 2026; ceremony at 1:00 PM at St. James the Greater Church; cocktails at 4:00 PM and reception at 5:00 PM at Nato's Farm; RSVP deadline November 7, 2026. Verify these details with the owner before public distribution.
- Real couple photography and custom invitation artwork are stored under `public/`. The gift QR is personal financial information. Never expose, reproduce, or move it to public third-party services without explicit instruction.
- Some public copy may still be draft (for example story captions/programme wording). Review and confirm content before sending invitations broadly.

## Important paths

- `app/page.tsx`: main invitation route.
- `app/invite/[token]/page.tsx`, `components/wedding/TokenInvitation.tsx`: private household link experience.
- `app/admin/page.tsx`, `components/wedding/`: private dashboard and invitation management UI.
- `app/api/rsvp/route.ts`, `app/api/admin/route.ts`, `app/api/guest-messages/route.ts`, `app/api/admin/notifications/route.ts`: server endpoints.
- `lib/rsvp/`: database access, auth/session handling, input validation, messages, CSV, notifications and utilities.
- `scripts/rsvp/schema.sql`: PostgreSQL schema.
- `scripts/rsvp/local-db.ps1`, `scripts/rsvp/ensure-local-db.mjs`, `scripts/rsvp/setup.mjs`: local DB lifecycle and seed setup.
- `public/photos/`, `public/invitation/`: original/local visual assets.

## Running locally

From the project root:

1. Install dependencies only if needed: `npm ci`.
2. Start app: `npm run dev` (predev starts/checks the local DB).
3. Open `http://localhost:5173`; admin is at `/admin`.
4. Local PostgreSQL listens on `127.0.0.1:54329`; see `LOCAL-RSVP.md` for setup, credentials location, test household setup, and operational details.
5. `npm run db:setup` initializes/seeds the local database; it skips existing names.

Never read out or include secrets from `.env.local`, `.local/admin-access.txt`, DB dumps, or exported guest files in handoff text. Those files are ignored by Git and must stay local.

## RSVP and security model

- Each household has a high-entropy opaque token. The DB stores a hash for lookup and encrypted token material for dashboard recovery/copying. Replaced/revoked links stop working.
- Household guests can submit/update their RSVP according to the invitation state; seat counts are enforced server-side. Admin operations require the local dashboard session/CSRF protections.
- Keep `ADMIN_SESSION_SECRET` stable: changing it can invalidate admin sessions and prevent decrypting existing invitation links. Keep the production database and admin secrets in deployment secret storage, never in source control.
- Dashboard login throttling currently uses process memory; this is not durable across serverless instances. Check the current deployment plan before exposing admin broadly; `VERCEL-DEPLOYMENT.md` documents the risk.
- Test with synthetic households and local DB where possible. Avoid using or revealing real guest data in examples, prompts, screenshots, or generated documentation.

## Commands and validation

- `npm run dev`: local Next dev server plus local DB precheck/start.
- `npm run build`: production build.
- `npm run lint`: ESLint.
- `npm test`: RSVP validation, headcount, and music tests.
- `npm run test:rsvp`: RSVP tests.
- `node scripts/rsvp/api-test.mjs`: live local API/DB integration checks; requires server and DB, creates/removes only its QA household.
- `npm run test:dashboard`: dashboard QA script; inspect before use if external state is involved.

Do not run tests or modify data unless asked by the user or required for the task. Do not deploy, publish, send invitations, or message guests without explicit authorization.

## Deployment status and caveats

Deployment is not done by local scripts. `VERCEL-DEPLOYMENT.md` covers required `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`, schema initialization, and rate-limiting caveat. The local DB does not serve the hosted app. Confirm hosted DB backups, durable admin throttling, domain, production secrets, and invitation URLs before launch. Do not run local setup against a hosted DB.

## Current known follow-ups

- Confirm all event, venue, RSVP, and wedding copy with the couple.
- Review visual behavior across target mobile sizes and browsers if requested; some prior notes record limited/incomplete cross-browser and screen-reader coverage.
- Confirm deployment and hosted PostgreSQL plan; local app/data are not automatically deployed.
- Check gallery implementation and real selected photos in source; older docs that say twelve placeholders are stale.
- Maintain backups before any bulk guest list or database changes.

## Documentation map and freshness

- `README.md`: top-level commands/current architecture, but it retains a long legacy Vinext/Cloudflare starter section.
- `LOCAL-RSVP.md`: current local RSVP DB/admin workflow; consult for exact operations.
- `VERCEL-DEPLOYMENT.md`: current deployment requirements and caveats.
- `INVITATION-BUILD.md`, `PROJECT-TIMELINE.md`, `CINEMATIC-UPDATE.md`, `DESIGN-UPDATE.md`: historical design/implementation decisions; these are not all current. Verify any claim against source.

## Working agreement for another AI

1. Start by reading this file, `README.md`, and the relevant current source and local guidance.
2. Preserve the existing architecture and visual assets unless the user asks for a redesign or migration.
3. Do not assume fictional names/seeds or old prototypes are real guest data.
4. Make small, reviewable edits; explain which files changed and what was checked.
5. Ask the owner when a decision affects real event facts, guest privacy, money/gift details, deployment, or irreversible data changes.

## Performance and scale review (2026-10-27)

Reviewed the user's checklist against current code. This project is a single event site with a small, manually managed guest list; optimize for reliable invitation delivery and guest privacy, not multi-tenant throughput. Do not add infrastructure without measurements.

### Already handled in the current code

- **Database connection pooling:** `lib/rsvp/db.ts` keeps a process-global `pg.Pool` (max 5 connections). Confirm this limit against the chosen hosted Postgres provider/serverless pooler before launch; a per-process pool is not the same as a cross-instance connection proxy.
- **Image compression:** the selected photo gallery is served as local WebP assets under `public/photos/gallery`; this is not proof every image is optimally sized. Keep originals safe and review file dimensions/bytes if doing a dedicated asset pass.
- **Lazy loading:** below-the-fold `<img>` elements in story/gallery use `loading="lazy"`; hero is eager/high priority. Gallery currently contains 20 images. Preserve the eager hero and lazy-load offscreen images.
- **Pagination:** admin household list has client-side filtering plus selectable page sizes (10/20/50/100) and Previous/Next navigation. Admin GET still transfers every invitation record; server pagination is not needed unless real list size/response size justifies its extra complexity.
- **Loading feedback:** dashboard has loading/busy/status states and form action labels. This is not a full skeleton UI. Add skeletons only if observed load time makes blank/loading states feel slow.
- **API cache safety:** admin API returns `Cache-Control: no-store`, dashboard fetches with `cache: 'no-store'`; guest messages also use `no-store`. Keep admin, RSVP, invitation-token, and guest data responses private and uncached.
- **Avoiding N+1:** reviewed primary admin, RSVP, notification and guest-message handlers. Dashboard initial load is one invitation query; RSVP uses a small transaction; notification handler uses two parallel reads. No obvious row-by-row query loop was found in those paths.
- **Image optimization / delivery:** Next.js is used, but invitation content mostly uses native `<img>` because it is local art and custom gallery/lightbox. Next Image optimizer is not automatically applied. Evaluate only with a measured asset/LCP issue and preserve composition/quality.
- **Minification:** production Next.js build handles normal production bundling/minification. Confirm with a production build when verification is requested.
- **Non-critical media:** background music is opt-in and now uses `preload="none"` in `components/wedding/BackgroundMusic.tsx`, so the browser waits for the user's play/open action before fetching audio.
- **Debounce:** admin search filters an already loaded in-memory household list; debounce is unnecessary at current scale. Add only if search moves to the server or measured typing/render lag appears.

### Not currently warranted

- **Load balancer:** no; one small, personal app does not need horizontal traffic distribution. Revisit only with real traffic/availability requirements.
- **Server-side response/query cache:** no; little reusable expensive public data, while guest and invitation data must not leak across users. The public guest-message list is bounded to 100 and should remain uncached until its privacy/freshness model is intentionally changed.
- **Database indexes:** current schema has primary/unique indexes for IDs/token hashes, and an index on invitation error timestamps; no dedicated performance evidence justifies more indexes. Consider an index on `submitted_at` only if query plans or scale indicate it helps current filters/sorts. Check PostgreSQL query plans before adding indexes.
- **Cache expensive queries:** no expensive query identified; dashboard's aggregates are computed from the already returned list. Measure first.
- **Compress API payloads:** no evidence current JSON payloads are large enough; admin intentionally receives data for client search/edit/export. If this grows, prefer server-side search/pagination and minimal field selection over bespoke compression.
- **Split code into chunks / defer scripts:** Next production bundler already chunks route/client bundles. `WeddingInvitation` is a client component importing gallery, Lottie, and motion code; route-level dynamic splitting may help initial JS but can affect the visual opening. Only optimize after bundle analysis/Lighthouse and interaction review.
- **Unnecessary re-renders:** not profiled. Admin computes counts/filters from local rows; do not add memoization blindly. React Profiler/browser performance trace first.
- **Unused dependencies:** not yet audited. `package.json` still has legacy Vinext/Cloudflare dependencies and scripts, but removing them is a separate cleanup requiring lockfile and build verification. Inventory imports and scripts before removal; never prune based only on package names.
- **Lighthouse audit:** not yet completed in this review. Run against a production build (not `next dev`) in a browser when requested/available; record mobile and desktop results and the tested URL/build.

### Before handoff / next useful review

1. Run a production build and a Lighthouse audit if performance score or launch readiness is a goal; capture URL, device profile, date, and results. Avoid claiming optimization success without measurements.
2. If Lighthouse identifies image/LCP issues, inspect the actual largest contentful paint asset and byte sizes; preserve the couple's original image details.
3. If admin data volume becomes material, move search/filter/pagination into API/SQL and return only required fields. Keep exports explicit and authenticated.
4. Before hosted launch, confirm the production Postgres pooling mode/connection limit and provider backups; retain `no-store` for all private endpoints.
5. Reconcile old README/local notes that still refer to Vinext, Cloudflare, disabled RSVP, placeholder photos, or outdated design/content. `PROJECT-CONTEXT.md` reflects current findings but does not silently rewrite history.
6. Keep `.env.local`, `.local/`, guest exports, invitation tokens, and the GCash QR out of AI prompts or public repositories. Share project code or this context with another LLM only through a private workspace/repository and without secret/local-state files.

### Applied in the 2026-10-27 performance pass

- Changed soundtrack preload from `metadata` to `none`; playback remains user-triggered and the existing audio unlock/fade flow is unchanged.
- No database/cache/load-balancer changes were justified by the app's current scale. Lighthouse, image byte/dimension audit, React profiling, and dependency cleanup remain measurement-led follow-ups.
