import {notFound} from 'next/navigation';
import {db,hashToken,validToken} from '@/lib/rsvp/db';
import {TokenInvitation} from '@/components/wedding/TokenInvitation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export default async function Invite({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 if(!validToken(token))notFound();
 const {rows}=await db().query('SELECT id FROM invitations WHERE token_hash=$1 AND NOT revoked LIMIT 1',[hashToken(token)]);
 if(!rows.length)notFound();
 return <TokenInvitation token={token}/>;
}
