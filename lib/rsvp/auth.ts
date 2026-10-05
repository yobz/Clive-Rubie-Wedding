import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
const cookie = 'wedding_admin';
function secret() { const s = process.env.ADMIN_SESSION_SECRET; if (!s || s.length < 32) throw new Error('Admin session secret is not configured.'); return s; }
function sign(s: string) { return createHmac('sha256',secret()).update(s).digest('base64url'); }
export function safeEqual(a: string, b: string) { const x=Buffer.from(a), y=Buffer.from(b); return x.length===y.length && timingSafeEqual(x,y); }
export function makeSession() { const payload = Buffer.from(JSON.stringify({ exp: Date.now()+8*3600000, csrf: randomBytes(24).toString('hex') })).toString('base64url'); return `${payload}.${sign(payload)}`; }
export function session(request: Request): {exp:number;csrf:string}|null {
 try { const value=request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(cookie+'='))?.slice(cookie.length+1); if(!value)return null;const [payload,signature]=value.split('.'); if(!safeEqual(sign(payload),signature))return null; const data=JSON.parse(Buffer.from(payload,'base64url').toString()); return data.exp>Date.now()?data:null; } catch{return null;}
}
export function sessionCookie(value: string, request: Request) { return `${cookie}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${value?28800:0}${new URL(request.url).protocol==='https:'?'; Secure':''}`; }
export function sameOrigin(request: Request) { return request.headers.get('origin')===new URL(request.url).origin; }
