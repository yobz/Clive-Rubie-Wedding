import {db,hashToken,validToken} from '@/lib/rsvp/db';
import {sameOrigin} from '@/lib/rsvp/auth';
import {validateResponse} from '@/lib/rsvp/validation.mjs';
import {recordInvitationError} from '@/lib/rsvp/errors';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Please submit from the invitation page.'},{status:403});
 const raw=await request.text();if(raw.length>6500)return Response.json({error:'Your response is too long.'},{status:413});
 let input;try{input=JSON.parse(raw);}catch{return Response.json({error:'Invalid response.'},{status:400});}
 if(!validToken(input?.token))return Response.json({error:'A valid invitation link is required.'},{status:400});
 let client;try{
 client=await db().connect();await client.query('BEGIN');
 const {rows}=await client.query('SELECT * FROM invitations WHERE token_hash=$1 AND NOT revoked FOR UPDATE',[hashToken(input.token)]);
 if(!rows[0]){await client.query('ROLLBACK');return Response.json({error:'This invitation is unavailable.'},{status:404});}
 if(rows[0].submitted_at){await client.query('ROLLBACK');return Response.json({error:'Your response has already been received. Please contact Clive and Rubie for changes.'},{status:409});}
 let response;try{response=validateResponse(input,rows[0].reserved_seats);}catch(error){await client.query('ROLLBACK');return Response.json({error:(error as Error).message},{status:400});}
 await client.query('UPDATE invitations SET attendance=$1,additional_names=$2,message=$3,submitted_at=now() WHERE id=$4',[response.attendance,response.names,response.message,rows[0].id]);
 await client.query('COMMIT');return Response.json({saved:true},{status:201});
 }catch(error){if(client)await client.query('ROLLBACK').catch(()=>{});client?.release();client=undefined;const reference=await recordInvitationError('rsvp-save',error,input.token);return Response.json({error:'We could not save your response. Please try again. Reference: '+reference},{status:503});}finally{client?.release();}
}
