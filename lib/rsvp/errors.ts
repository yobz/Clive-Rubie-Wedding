import {randomUUID} from 'node:crypto';
import {db,hashToken,validToken} from './db';
export type ErrorStage='invitation-page'|'invitation-load'|'rsvp-save';
export async function recordInvitationError(stage:ErrorStage,error:unknown,token?:unknown){
 const id=randomUUID();
 const rawCode=error&&typeof error==='object'&&'code' in error?String(error.code):'UNKNOWN';
 const code=/^[A-Z0-9_]{1,30}$/.test(rawCode)?rawCode:'UNKNOWN';
 // Never retain request bodies, raw URLs, invitation tokens, or database error text.
 const event={id,stage,code,reference:validToken(token)?hashToken(token):null};
 console.error('wedding-invitation-error',JSON.stringify(event));
 try{
  await db().query("INSERT INTO invitation_errors(id,stage,error_code,token_reference) VALUES($1,$2,$3,$4)",[id,stage,code,event.reference]);
  await db().query("DELETE FROM invitation_errors WHERE created_at < now() - interval '30 days'");
 }catch{console.error('wedding-error-log-storage-unavailable',id);}
 return id;
}
