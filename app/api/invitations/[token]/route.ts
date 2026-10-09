import {db,hashToken,validToken} from '@/lib/rsvp/db';
import {recordInvitationError} from '@/lib/rsvp/errors';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 if(!validToken(token))return Response.json({error:'This invitation link is invalid.'},{status:404});
 try{const result=await db().query('SELECT main_guest_name,reserved_seats,attendance,additional_names,message,submitted_at FROM invitations WHERE token_hash=$1 AND NOT revoked',[hashToken(token)]);
 if(!result.rows[0])return Response.json({error:'This invitation link is no longer available. Please contact Clive and Rubie.'},{status:404});
 return Response.json(result.rows[0],{headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
 }catch(error){const reference=await recordInvitationError('invitation-load',error,token);return Response.json({error:'RSVP is temporarily unavailable. Please try again shortly. Reference: '+reference},{status:503});}
}
