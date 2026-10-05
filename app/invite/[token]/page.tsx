'use client';
import {use} from 'react';
import {InvitationToken} from '@/components/wedding/HouseholdRSVP';
import {WeddingInvitation} from '@/components/wedding/WeddingInvitation';
export default function Invite({params}:{params:Promise<{token:string}>}){const {token}=use(params);return <InvitationToken.Provider value={token}><WeddingInvitation/></InvitationToken.Provider>;}
