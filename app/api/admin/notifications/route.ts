import {db} from '@/lib/rsvp/db';
import {session,sameOrigin} from '@/lib/rsvp/auth';
import {invitationNotifications} from '@/lib/rsvp/notifications.mjs';
export const runtime='nodejs';
const headers={'Cache-Control':'no-store'};
function json(body:unknown,status=200){return Response.json(body,{status,headers});}
type Notice={key:string;householdId:string;name:string;attendance:string;submittedAt:string;kind:string};
async function current():Promise<Notice[]>{const {rows}=await db().query("SELECT id,main_guest_name,attendance,submitted_at,message,message_only FROM invitations WHERE submitted_at IS NOT NULL AND (attendance IS NOT NULL OR message_only)");return invitationNotifications(rows);}
export async function GET(request:Request){
 if(!session(request))return json({error:'Please sign in.'},401);
 try{const [events,reads]=await Promise.all([current(),db().query('SELECT notification_key FROM admin_notification_reads')]);const seen=new Set(reads.rows.map(row=>row.notification_key));return json({notifications:events.filter(event=>!seen.has(event.key))});}catch{return json({error:'Notifications could not refresh.'},503);}
}
export async function POST(request:Request){
 if(!sameOrigin(request))return json({error:'Invalid request origin.'},403);
 const auth=session(request);if(!auth)return json({error:'Please sign in.'},401);
 if(request.headers.get('x-csrf-token')!==auth.csrf)return json({error:'Refresh the dashboard and try again.'},403);
 let keys:unknown;try{const body=await request.text();if(body.length>1000000)return json({error:'Request too large.'},413);keys=(JSON.parse(body) as {keys?:unknown}).keys;}catch{return json({error:'Invalid request.'},400);}
 if(!Array.isArray(keys)||keys.length>5000||keys.some(key=>typeof key!=='string'||key.length>160))return json({error:'Invalid notifications.'},400);
 try{const valid=new Set((await current()).map(event=>event.key));const selected=Array.from(new Set(keys as string[])).filter(key=>valid.has(key));if(selected.length)await db().query('INSERT INTO admin_notification_reads(notification_key) SELECT unnest($1::text[]) ON CONFLICT DO NOTHING',[selected]);return json({ok:true});}catch{return json({error:'Read status could not be saved. Please try again.'},503);}
}
