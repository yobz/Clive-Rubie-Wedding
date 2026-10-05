# Vercel deployment

The public invitation is `/`, personal RSVP links are `/invite/<token>`, and the password-protected dashboard is `/admin`. All routes deploy together.

Set these server-only variables in the Vercel project before deployment:
- DATABASE_URL: hosted PostgreSQL connection string with provider-required TLS settings.
- ADMIN_PASSWORD: a strong private dashboard password.
- ADMIN_SESSION_SECRET: at least 32 characters. Keep stable because invitation link encryption uses this secret.

Never upload .env.local or .local. The local PostgreSQL database cannot be used by Vercel. Initialize the hosted database with scripts/rsvp/schema.sql. Create fake households from /admin for testing. Local invitation links will not exist in a new hosted database.

Use the Next.js framework preset and npm run build. Deploy with the existing Vercel project or import the repository. Do not run npm run db:setup against hosted PostgreSQL: that script intentionally loads the local environment.

The admin login currently limits attempts in process memory; this is not a durable serverless rate limit. Before sharing the admin URL broadly, configure Vercel Firewall rate limiting for POST /api/admin or implement shared PostgreSQL throttling.

The site still contains placeholder story, programme and reminders text. Initial public review can include these, but final guest invitations should use completed content.
