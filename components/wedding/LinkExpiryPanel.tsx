'use client';
import {useMemo,useState} from 'react';
import {adminRequest} from '@/lib/rsvp/admin-request.mjs';

type Guest={id:string;main_guest_name:string;attendance:string|null;message_only:boolean;revoked:boolean};
export function LinkExpiryPanel({rows,onSaved}:{rows:Guest[];onSaved?:()=>void}){
 const [runAt,setRunAt]=useState(''),[enabled,setEnabled]=useState(true),[excluded,setExcluded]=useState<string[]>([]),[search,setSearch]=useState(''),[busy,setBusy]=useState(false),[status,setStatus]=useState('');
 const pending=useMemo(()=>rows.filter(r=>!r.revoked&&!r.message_only&&!r.attendance),[rows]);
 const visible=pending.filter(r=>r.main_guest_name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 async function save(){if(!runAt){setStatus('Choose a date and time first.');return;}setBusy(true);try{await adminRequest('/api/admin',{method:'POST',body:JSON.stringify({action:'expiry-save',runAt,enabled,excludedIds:excluded})});setStatus('Automatic revocation schedule saved.');onSaved?.();}catch(e){setStatus((e as Error).message)}finally{setBusy(false)}}
 return <section className="admin-expiry"><div className="admin-section-heading"><div><h2>Automatic link expiry</h2><p>Revoke pending invitation links at a scheduled time. Philippine Standard Time.</p></div></div><label>Run at (Philippine time)<input type="datetime-local" value={runAt} onChange={e=>setRunAt(e.target.value)}/></label><label className="admin-message-only"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/>Enable this schedule</label><p className="admin-expiry-preview"><strong>{Math.max(0,pending.length-excluded.length)}</strong> pending links will be revoked</p><label>Find guests<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search guest name"/></label><div className="admin-expiry-list">{visible.map(row=><label key={row.id}><input type="checkbox" checked={excluded.includes(row.id)} onChange={e=>setExcluded(v=>e.target.checked?[...v,row.id]:v.filter(id=>id!==row.id))}/>{row.main_guest_name}</label>)}</div><p>{excluded.length} guests excluded</p><button type="button" disabled={busy} onClick={()=>{if(confirm(`Schedule revocation for ${Math.max(0,pending.length-excluded.length)} pending links?`))void save()}}>Save schedule</button>{status&&<p role="status">{status}</p>}</section>;
}
