import {db} from '@/lib/rsvp/db';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 try{
  const {rows}=await db().query("SELECT main_guest_name AS name, message FROM invitations WHERE attendance='attending' AND submitted_at IS NOT NULL AND NOT revoked AND length(trim(message))>0 ORDER BY submitted_at DESC LIMIT 100");
  return Response.json({messages:rows},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({messages:[]},{status:503});}
}
