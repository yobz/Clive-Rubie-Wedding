import {db,hashToken,validToken} from '@/lib/rsvp/db';
export const runtime='nodejs';
export async function GET(request: Request) {
 const token=new URL(request.url).searchParams.get('token');
 if(!validToken(token))return Response.json({error:'This invitation link is invalid.'},{status:404});
 try {const result=await db().query('SELECT main_guest_name, reserved_seats, attendance, additional_names, message, submitted_at FROM invitations WHERE token_hash=$1 AND NOT revoked',[hashToken(token)]);if(!result.rows[0])return Response.json({error:'This invitation link is invalid or has been replaced.'},{status:404});return Response.json(result.rows[0],{headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});}catch{return Response.json({error:'RSVP is temporarily unavailable. Please try again later.'},{status:503});}
}
