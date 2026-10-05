import { Pool } from 'pg';
import { createHash, randomBytes } from 'node:crypto';
const globalDb = globalThis as unknown as { rsvpPool?: Pool };
export function db() {
 if (!process.env.DATABASE_URL) throw new Error('RSVP database is not configured.');
 return globalDb.rsvpPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 4000 });
}
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');
export function validToken(token: unknown): token is string { return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token); }
