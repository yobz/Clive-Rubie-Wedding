'use client';
import {useEffect,useRef,useState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {adminRequest,AdminRequestError} from '@/lib/rsvp/admin-request.mjs';
import {parseHouseholds} from '@/lib/rsvp/csv.mjs';
type Household={name:string;seats:number;group?:string|null};
export function HouseholdImport({csrf,busy,onBusyChange,onImported,onSessionExpired}:{csrf:string;busy:boolean;onBusyChange:(busy:boolean)=>void;onImported:()=>Promise<void>;onSessionExpired:()=>void}){
 const [csv,setCsv]=useState(''),[rows,setRows]=useState<Household[]>([]),[phase,setPhase]=useState<'idle'|'reading'|'ready'|'importing'|'success'|'error'>('idle'),[elapsed,setElapsed]=useState(0),[notice,setNotice]=useState(''),[filename,setFilename]=useState('');
 const locked=useRef(false),started=useRef(0);
 useEffect(()=>{if(phase!=='importing')return;const timer=setInterval(()=>setElapsed(Math.floor((performance.now()-started.current)/1000)),1000);return()=>clearInterval(timer);},[phase]);
 async function choose(file:File){
  if(locked.current)return;locked.current=true;setPhase('reading');setNotice('');setRows([]);setCsv('');setFilename(file.name);
  try{if(file.size>100000)throw Error('Choose a CSV smaller than 100 KB.');const text=await file.text();const parsed=parseHouseholds(text);setCsv(text);setRows(parsed);setPhase('ready');setNotice('CSV ready. Review the households, then click Import.');}
  catch(error){setPhase('error');setNotice((error as Error).message);}finally{locked.current=false;}
 }
 async function importHouseholds(){
  if(locked.current||busy||!rows.length)return;locked.current=true;onBusyChange(true);started.current=performance.now();setElapsed(0);setNotice('');setPhase('importing');
  try{
   const result=await adminRequest('/api/admin',{method:'POST',headers:{'Content-Type':'application/json','x-csrf-token':csrf},body:JSON.stringify({action:'import',csv})},30000) as {imported?:number};
   if(!Number.isInteger(result.imported))throw Error('Missing import confirmation');
   const seconds=((performance.now()-started.current)/1000).toFixed(1);
   setNotice(`Successfully imported ${result.imported} households in ${seconds} seconds. Their invitation links are ready below.`);setRows([]);setCsv('');setPhase('success');await onImported();
  }catch(error){setPhase('error');if(error instanceof AdminRequestError){if(error.status===401)onSessionExpired();if(error.outcomeUnknown){setRows([]);setCsv('');}}setNotice((error as Error).message);}
  finally{locked.current=false;onBusyChange(false);}
 }
 const working=phase==='reading'||phase==='importing';
 return <section className="admin-import" aria-labelledby="import-heading" aria-busy={working}><h2 id="import-heading">Import Households</h2><p>Upload a CSV with main_guest_name, reserved_seats and guest_group (Bride’s guest or Groom’s guest). Seats include the main guest. Each row creates one household and invitation link.</p><input type="file" accept=".csv,text/csv" disabled={busy||working} aria-label="Household CSV" onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';if(file)void choose(file);}}/>{filename&&<p className="admin-import-filename">{filename}</p>}<div role="status" aria-live="polite" className={`admin-import-status${phase==='success'?' is-success':phase==='error'?' is-error':''}`}>{working&&<div className="admin-import-progress"><LoaderCircle className="admin-import-spinner" size={22} aria-hidden="true"/><span>{phase==='reading'?'Reading and checking CSV…':`Importing ${rows.length} households…`}</span></div>}{notice&&<p>{notice}</p>}</div>{phase==='importing'&&<p className="admin-import-elapsed">Elapsed: {elapsed}s. Please keep this page open.</p>}{rows.length>0&&<><p>{rows.length} households · {rows.reduce((n,r)=>n+r.seats,0)} reserved seats</p><ul>{rows.slice(0,5).map(r=><li key={r.name}>{r.name} - {r.seats} seats - {r.group==='bride'?'Bride’s guest':r.group==='groom'?'Groom’s guest':'Unassigned'}</li>)}</ul>{rows.length>5&&<p>Plus {rows.length-5} more households.</p>}<button disabled={busy||working} onClick={()=>void importHouseholds()}>{phase==='importing'?'Importing…':`Import ${rows.length} Households`}</button><button disabled={busy||working} onClick={()=>{setCsv('');setRows([]);setNotice('');setFilename('');setPhase('idle');}}>Cancel</button></>}</section>;
}
