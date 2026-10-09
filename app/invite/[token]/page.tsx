import type {Metadata,ResolvingMetadata} from 'next';
import {cache} from 'react';
import {notFound} from 'next/navigation';
import {db,hashToken,validToken} from '@/lib/rsvp/db';
import {TokenInvitation} from '@/components/wedding/TokenInvitation';
import {recordInvitationError} from '@/lib/rsvp/errors';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const findInvitation=cache(async(token:string)=>{
 if(!validToken(token))notFound();
 const {rows}=await (async()=>{try{return await db().query('SELECT id,guest_group FROM invitations WHERE token_hash=$1 AND NOT revoked LIMIT 1',[hashToken(token)]);}catch(error){await recordInvitationError('invitation-page',error,token);throw error;}})();
 if(!rows.length)notFound();
 return rows[0] as {id:string;guest_group:string|null};
});
export async function generateMetadata({params}:{params:Promise<{token:string}>},parent:ResolvingMetadata):Promise<Metadata>{
 const {token}=await params;
 const [inherited,invitation]=await Promise.all([parent,findInvitation(token)]);
 const image=invitation.guest_group==='bride'?'/invitation/social-preview-bride.jpg':'/invitation/social-preview-v2.jpg';
 return {openGraph:{...inherited.openGraph,url:`/invite/${token}`,images:[{url:image,width:600,height:849,type:'image/jpeg',alt:'Clive and Rubie wedding invitation'}]},twitter:{card:'summary_large_image',title:'Clive and Rubie',description:'Sa bawat bukas, ikaw.',images:[image]}};
}
export default async function Invite({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 await findInvitation(token);
 return <TokenInvitation token={token}/>;
}
