export function summarizeGuests(rows) {
 return rows.reduce((total,row)=>{
  total.reserved+=row.reserved_seats;
  if(row.sent)total.sent+=1;
  else total.notSent+=1;
  if(row.attendance==='attending')total.attending+=1+row.additional_names.length;
  else if(row.attendance==='declining')total.declining+=1;
  else total.pending+=1;
  return total;
 },{attending:0,declining:0,pending:0,reserved:0,sent:0,notSent:0});
}
