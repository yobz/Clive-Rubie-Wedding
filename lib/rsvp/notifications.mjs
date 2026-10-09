export function invitationNotifications(rows,seen=[]){
 const read=new Set(seen);
 return rows.flatMap(row=>{
  if(!row.submitted_at||(!row.message_only&&!['attending','declining'].includes(row.attendance)))return [];
  const submittedAt=new Date(row.submitted_at).toISOString();
  const base={householdId:row.id,name:row.main_guest_name,attendance:row.message_only?'message-only':row.attendance,submittedAt};
  const events=row.message_only?[]:[{...base,key:`${row.id}:${submittedAt}:rsvp`,kind:'rsvp'}];
  if(row.message?.trim())events.push({...base,key:`${row.id}:${submittedAt}:message`,kind:'message'});
  return events;
 }).filter(event=>!read.has(event.key)).sort((a,b)=>Date.parse(b.submittedAt)-Date.parse(a.submittedAt));
}
