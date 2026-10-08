# Local wedding invitation

Run `npm run dev`, then open http://localhost:5173. On Windows this also starts the configured portable local database when needed. The public site needs no login.

## Database and dashboard

The local PostgreSQL connection and private admin credentials are in ignored `.env.local`. A convenient password reference is `.local/admin-access.txt`. Do not publish either file.

The portable database listens only on 127.0.0.1:54329. Start it using `powershell -File scripts/rsvp/local-db.ps1 start`; use `stop` for a clean shutdown. It is not installed as a Windows service. Docker is an alternative: `docker compose --env-file .env.local up -d`. Use one database runtime at a time.

`npm run db:setup` creates the schema and seeds Yasuo (1), Rakan (2), Ahri (4), Garen (2), and Teemo (1). It skips existing names. Initial test links are in `.local/test-invitations.json`; current links are always available in the dashboard.

Open http://localhost:5173/admin and sign in using the local password. Create households, copy links or invitation messages, mark invitations sent, view responses, correct names/seats/messages, replace or revoke links, and export CSV. Sending messages remains manual.

Each opaque invitation link identifies one household. An attending main guest uses one seat; each additional comma-separated name uses another. Fewer guests are allowed. Declining clears additional names. Optional messages are preserved. A submitted response is read-only for guests; the dashboard can correct it or set it to pending to reopen it.

Tokens are randomly generated, hashed for lookup, and encrypted for dashboard retrieval. Keep ADMIN_SESSION_SECRET stable: changing it invalidates sessions and prevents decrypting existing links. Replacing a link invalidates its old token.

## Verification

`npm run test:rsvp` tests validation. With the server and database running, `node scripts/rsvp/api-test.mjs` tests authentication, seat limits, simultaneous duplicate submissions, persistence, corrections, revocation, rotation and CSRF. It creates and removes only its own QA household.

`npm run build` validates the Next.js production build. Production hosting, hosted PostgreSQL, durable distributed login throttling and backups must be configured before deployment; nothing is deployed by these scripts.

## Visual assets

The gallery intentionally contains twelve placeholders in `components/wedding/Gallery.tsx`. Replace empty `src` values and alt text when final photographs arrive. The story uses only `/photos/revamp/tunnel-story.jpg`. Attire images live in `public/invitation/attire`.

The original hero photograph remains intact; its displayed brightness is increased slightly. Amsterdam is used for the hero, Playfair Display for other headings, and Cormorant for body text. Fonts are local and preloaded; the envelope waits for font loading before revealing the invitation (with a timeout so failed font requests cannot trap visitors).

Music playback is requested silently within the opening tap, then faded in after the envelope exits. A manual music control remains available if the browser refuses playback.

## October 5 visual and music update

The envelope uses a textured paper pattern, a gold seal and a 1.1-second opacity fade. Attire switches every 4.5 seconds using a 0.9-second crossfade, pauses on hover/focus and offers dot navigation. The gallery is an original adaptation of the 21st.dev shared-element gallery pattern, with masonry placeholders, spring expansion, frosted backdrop and drag dismissal.

Music plays Panalangin, This Love, Dilaw, Palagi, Forevermore, Sa’yo, Saksi Ang Langit, Enchanted and Closer, then repeats the playlist. One play/pause control preserves the current track position.

Gallery placeholders have now been replaced by twelve selected photographs from the couple’s Drive collection, optimized as WebP under public/photos/gallery. New venue photos are displayed with photo-only framing for Nato’s Farm. Mobile swatches are larger and grouped; attire arrows are larger. RSVP rejects numeric guest names, and the music fade clamps early frame timestamps to zero. Run node --test scripts/music-volume.test.mjs scripts/rsvp/validation.test.mjs for these regression checks.

Gallery update: twelve original photographs now mix eight outdoor couple moments from the first shared Drive folder with four heritage images (4027,4048,4061,4067) from the second folder. WebP exports preserve natural framing. Small display-only brightness/contrast corrections are shared by thumbnails and the fullscreen viewer; originals remain intact. AI enhancement experiments were rejected because they changed fine details.

Approved botanical splash: local lottie-web player runs the approved logo on every visit/refresh. After completion, the invitation prompt fades upward and nudges gently after1.5s, with2s rests between nudges. Clicking the logo or prompt fades out the splash in550ms and reveals the page in450ms; music retains synchronous gesture unlock and fades in after dismissal. Reduced-motion users receive the finished artwork with no repeating nudge. The standalone preview remains available.
