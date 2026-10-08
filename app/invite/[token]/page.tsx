import type {Metadata,ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import {db,hashToken,validToken} from '@/lib/rsvp/db';
import {TokenInvitation} from '@/components/wedding/TokenInvitation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{token:string}>},parent:ResolvingMetadata):Promise<Metadata>{
 const {token}=await params;
 const inherited=await parent;
 return {openGraph:{...inherited.openGraph,url:validToken(token)?`/invite/${token}`:'/'}};
}
export default async function Invite({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 if(!validToken(token))notFound();
 const {rows}=await db().query('SELECT id FROM invitations WHERE token_hash=$1 AND NOT revoked LIMIT 1',[hashToken(token)]);
 if(!rows.length)notFound();
 return <TokenInvitation token={token}/>;
}
