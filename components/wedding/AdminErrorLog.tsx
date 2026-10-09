'use client';
import {useEffect,useState} from 'react';
import {adminRequest} from '@/lib/rsvp/admin-request.mjs';
type Incident={id:string;stage:string;error_code:string;created_at:string;main_guest_name:string|null};
export function AdminErrorLog(){
 const [incidents,setIncidents]=useState<Incident[]>([]),[status,setStatus]=useState(''),[loading,setLoading]=useState(true);
 async function refresh(){setLoading(true);setStatus('');try{const data=await adminRequest('/api/admin/errors',{cache:'no-store'}) as {errors:Incident[]};setIncidents(data.errors);}catch(error){setStatus((error as Error).message);}finally{setLoading(false);}}
 // The request completes asynchronously before updating state.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{void refresh();},[]);
 const labels:Record<string,string>={'invitation-page':'Opening invitation','invitation-load':'Loading RSVP details','rsvp-save':'Saving RSVP'};
 return <section className="admin-error-log"><div className="admin-section-heading"><div><h2>Invitation error log</h2><p>Latest 100 server incidents from the past 30 days. Times shown in Philippine time.</p></div><button disabled={loading} onClick={()=>void refresh()}>Refresh log</button></div><p className="admin-count-help">This records server failures from now on. Network problems before a request reaches the server cannot be recorded. If database storage fails, check the hosting server logs.</p>{loading?<p role="status">Loading incidents…</p>:status?<p role="alert">{status}</p>:!incidents.length?<p className="admin-empty">No recorded server errors in the past 30 days.</p>:<div className="admin-error-table"><table><thead><tr><th>Time (PHT)</th><th>Household</th><th>Action</th><th>Error code</th><th>Incident reference</th></tr></thead><tbody>{incidents.map(incident=><tr key={incident.id}><td>{new Date(incident.created_at).toLocaleString('en-PH',{timeZone:'Asia/Manila'})}</td><td>{incident.main_guest_name||'Unknown or unavailable'}</td><td>{labels[incident.stage]||incident.stage}</td><td>{incident.error_code}</td><td><code>{incident.id}</code></td></tr>)}</tbody></table></div>}</section>;
}
