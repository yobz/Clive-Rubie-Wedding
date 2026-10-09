export class AdminRequestError extends Error {
 constructor(message,status=0,outcomeUnknown=false){super(message);this.name='AdminRequestError';this.status=status;this.outcomeUnknown=outcomeUnknown;}
}
// A timeout does not prove that a write failed; callers must refresh before retrying it.
export async function adminRequest(url,options={},timeoutMs=15000,fetchImpl=globalThis.fetch){
 const write=options.method==='POST';const controller=new AbortController();let timer;
 try{return await Promise.race([
  (async()=>{const response=await fetchImpl(url,{...options,signal:controller.signal});let data;
   try{data=await response.json();}catch{throw new AdminRequestError(write?'We could not confirm the save. Refresh the dashboard before retrying.':'The server returned an unreadable response. Please refresh.',response.status,write&&response.status!==401&&response.status!==403);}
   if(!response.ok)throw new AdminRequestError(data?.error||'The request could not be completed.',response.status,write&&response.status>=500);
   return data;
  })(),
  new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new AdminRequestError(write?'The save took too long to confirm. Refresh the dashboard before retrying.':'The dashboard took too long to load. Please try again.',0,write));},timeoutMs);})
 ]);}catch(error){if(error instanceof AdminRequestError)throw error;throw new AdminRequestError(write?'We could not confirm the save. Check your connection and refresh before retrying.':'Could not load the dashboard. Check your connection and try again.',0,write);}finally{clearTimeout(timer);}
}
