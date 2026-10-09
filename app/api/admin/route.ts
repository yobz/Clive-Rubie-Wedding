import {randomUUID,createCipheriv,createDecipheriv,createHash,randomBytes} from 'node:crypto';
import {db,newToken,hashToken} from '@/lib/rsvp/db';
import {session,sameOrigin,makeSession,sessionCookie,safeEqual} from '@/lib/rsvp/auth';
import {validateResponse} from '@/lib/rsvp/validation.mjs';
import {parseHouseholds,normalizeGuestGroup} from '@/lib/rsvp/csv.mjs';
export const runtime='nodejs';
const attempts=new Map<string,{count:number;until:number}>();
function encrypt(token:string){const iv=randomBytes(12),key=createHash('sha256').update(process.env.ADMIN_SESSION_SECRET!).digest(),c=createCipheriv('aes-256-gcm',key,iv);const data=Buffer.concat([c.update(token,'utf8'),c.final()]);return Buffer.concat([iv,c.getAuthTag(),data]).toString('base64url');}
function decrypt(value:string){try{const b=Buffer.from(value,'base64url'),d=createDecipheriv('aes-256-gcm',createHash('sha256').update(process.env.ADMIN_SESSION_SECRET!).digest(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return Buffer.concat([d.update(b.subarray(28)),d.final()]).toString();}catch{return '';}}
function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export async function GET(request:Request){const auth=session(request);if(!auth)return json({error:'Please sign in.'},401);try{const {rows}=await db().query('SELECT * FROM invitations ORDER BY created_at DESC');const invitations=rows.map(({token_hash,token_ciphertext,...row})=>({...row,token:token_ciphertext?decrypt(token_ciphertext):''}));return json({csrf:auth.csrf,invitations});}catch{return json({error:'Database unavailable. Check local PostgreSQL.'},503);}}
export async function POST(request:Request){
 if(!sameOrigin(request))return json({error:'Invalid request origin.'},403);
 let input;try{const raw=await request.text();if(raw.length>120000)return json({error:'Request too large.'},413);input=JSON.parse(raw);}catch{return json({error:'Invalid request.'},400);}
 if(!input || typeof input!=='object' || Array.isArray(input))return json({error:'Invalid request.'},400);
 if(input.action==='login'){
  const key=request.headers.get('x-forwarded-for')?.split(',')[0]||'local';const now=Date.now();const entry=attempts.get(key);if(entry&&entry.until>now&&entry.count>=10)return json({error:'Too many attempts. Try again in 15 minutes.'},429);
  if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SESSION_SECRET)return json({error:'Admin access is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the hosting environment.'},503);
  if(typeof input.password!=='string'||!safeEqual(input.password,process.env.ADMIN_PASSWORD)){attempts.set(key,{count:entry&&entry.until>now?entry.count+1:1,until:entry&&entry.until>now?entry.until:now+900000});return json({error:'Incorrect password.'},401);}
  attempts.delete(key);return Response.json({ok:true},{headers:{'Set-Cookie':sessionCookie(makeSession(),request),'Cache-Control':'no-store'}});
 }
 const auth=session(request);if(!auth)return json({error:'Please sign in.'},401);if(request.headers.get('x-csrf-token')!==auth.csrf)return json({error:'Refresh the dashboard and try again.'},403);
 if(input.action==='logout')return Response.json({ok:true},{headers:{'Set-Cookie':sessionCookie('',request)}});
 try{
 if(input.action==='import'){
  const households=parseHouseholds(input.csv);const client=await db().connect();
  try{await client.query('BEGIN');await client.query('LOCK TABLE invitations IN SHARE ROW EXCLUSIVE MODE');
   const existing=await client.query('SELECT main_guest_name FROM invitations');
   const names=new Set(existing.rows.map(r=>r.main_guest_name.normalize('NFC').trim().replace(/\s+/g,' ').toLowerCase()));
   for(const household of households){if(names.has(household.name.toLowerCase()))throw Error('Already exists: '+household.name+'. No households were imported.');}
   const records=households.map(household=>{const token=newToken();return {id:randomUUID(),name:household.name,seats:household.seats,group:household.group??null,hash:hashToken(token),encrypted:encrypt(token)};});
   await client.query('INSERT INTO invitations(id,main_guest_name,reserved_seats,token_hash,token_ciphertext,guest_group) SELECT * FROM unnest($1::uuid[],$2::text[],$3::integer[],$4::text[],$5::text[],$6::text[])',[records.map(r=>r.id),records.map(r=>r.name),records.map(r=>r.seats),records.map(r=>r.hash),records.map(r=>r.encrypted),records.map(r=>r.group)]);
   await client.query('COMMIT');return json({ok:true,imported:households.length});
  }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
 }
 if(input.action==='create'){
  if(input.messageOnly!==undefined&&typeof input.messageOnly!=='boolean')return json({error:'Invalid invitation type.'},400);
  if(input.messageOnly)input.seats=1;
  if(typeof input.name!=='string'||input.name.trim().length<2||input.name.length>100||!Number.isInteger(input.seats)||input.seats<1||input.seats>30)return json({error:'Enter a name (2-100 characters) and 1-30 seats.'},400);
  const group=normalizeGuestGroup(input.guestGroup);const token=newToken();await db().query('INSERT INTO invitations(id,main_guest_name,reserved_seats,token_hash,token_ciphertext,guest_group,message_only) VALUES($1,$2,$3,$4,$5,$6,$7)',[randomUUID(),input.name.trim(),input.seats,hashToken(token),encrypt(token),group,input.messageOnly===true]);return json({ok:true});
 }
 if(input.action==='delete'){
  const ids=input.ids;
  if(!Array.isArray(ids)||ids.length<1||ids.length>500||ids.some(id=>typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))||new Set(ids).size!==ids.length)return json({error:'Select 1-500 valid households to delete.'},400);
  const result=await db().query('DELETE FROM invitations WHERE id = ANY($1::uuid[])',[ids]);
  return json({ok:true,deleted:result.rowCount});
 }
 if(typeof input.id!=='string'||!/^[0-9a-f-]{36}$/i.test(input.id))return json({error:'Invalid invitation.'},400);
 if(input.action==='rotate'){const token=newToken();await db().query("UPDATE invitations SET token_hash=$1,token_ciphertext=$2,revoked=false,attendance=NULL,additional_names='{}',message='',submitted_at=NULL,sent=false WHERE id=$3",[hashToken(token),encrypt(token),input.id]);return json({ok:true});}
 if(input.action==='revoke'){await db().query('UPDATE invitations SET revoked=true WHERE id=$1',[input.id]);return json({ok:true});}
 if(input.action==='sent'){if(typeof input.sent!=='boolean')return json({error:'Invalid sent status.'},400);await db().query('UPDATE invitations SET sent=$1 WHERE id=$2',[input.sent,input.id]);return json({ok:true});}
 if(input.action==='update'){
  if(typeof input.messageOnly!=='boolean')return json({error:'Choose the invitation type.'},400);
  if(input.messageOnly)input.seats=1;
  if(typeof input.name!=='string'||input.name.trim().length<2||input.name.length>100||!Number.isInteger(input.seats)||input.seats<1||input.seats>30)return json({error:'Enter a name and 1-30 seats.'},400);
  const group=input.guestGroup===undefined?undefined:normalizeGuestGroup(input.guestGroup);
  const response=input.messageOnly?(typeof input.message==='string'&&input.message.trim()?validateResponse(input,1,true):null):input.attendance==='pending'?null:validateResponse(input,input.seats);
  await db().query('UPDATE invitations SET main_guest_name=$1,reserved_seats=$2,attendance=$3,additional_names=$4,message=$5,guest_group=CASE WHEN $7::boolean THEN $8::text ELSE guest_group END,message_only=$9,submitted_at=CASE WHEN $10::boolean THEN COALESCE(submitted_at,now()) ELSE NULL END WHERE id=$6',[input.name.trim(),input.seats,response?.attendance??null,response?.names??[],response?.message??'',input.id,group!==undefined,group??null,input.messageOnly,Boolean(response)]);return json({ok:true});
 }
 return json({error:'Unknown action.'},400);
 }catch(error){if(error instanceof Error&&!(error as Error&{code?:string}).code)return json({error:error.message},400);return json({error:'The change could not be saved.'},503);}
}
