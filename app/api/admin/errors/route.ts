import {db} from '@/lib/rsvp/db';
import {session} from '@/lib/rsvp/auth';
export const runtime='nodejs';
export async function GET(request:Request){
 const headers={'Cache-Control':'no-store'};
 if(!session(request))return Response.json({error:'Please sign in.'},{status:401,headers});
 try{
  const {rows}=await db().query("SELECT e.id,e.stage,e.error_code,e.created_at,i.main_guest_name FROM invitation_errors e LEFT JOIN invitations i ON i.token_hash=e.token_reference WHERE e.created_at >= now() - interval '30 days' ORDER BY e.created_at DESC LIMIT 100");
  return Response.json({errors:rows},{headers});
 }catch{return Response.json({error:'Error log unavailable. Server logs may still contain the incident reference.'},{status:503,headers});}
}
