'use client';
import {InvitationToken} from './HouseholdRSVP';
import {WeddingInvitation} from './WeddingInvitation';
export function TokenInvitation({token}:{token:string}){return <InvitationToken.Provider value={token}><WeddingInvitation/></InvitationToken.Provider>;}
