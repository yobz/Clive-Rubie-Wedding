export function parseHouseholds(csv){
 if(typeof csv!=='string'||csv.length>100000)throw Error('Choose a CSV smaller than 100 KB.');
 const rows=[];let row=[],cell='',quoted=false,closed=false;
 for(const c of csv.replace(/^\uFEFF/,'')+'\n'){
  if(quoted){if(c==='"'){quoted=false;closed=true;}else cell+=c;continue;}
  if(c==='"'){if(closed){cell+='"';quoted=true;closed=false;}else if(cell==='')quoted=true;else throw Error('Invalid CSV quoting.');continue;}
  if(c===','||c==='\n'){row.push(cell);cell='';closed=false;if(c==='\n'){if(row.some(v=>v.trim()))rows.push(row);row=[];}continue;}
  if(c==='\r')continue;if(closed&&!/\s/.test(c))throw Error('Invalid CSV quoting.');cell+=c;
 }
 if(quoted)throw Error('Unclosed CSV quote.');
 const headers=rows.shift()?.map(v=>v.trim().toLowerCase());if(!headers||headers.length!==2||!headers.includes('main_guest_name')||!headers.includes('reserved_seats'))throw Error('Use the columns main_guest_name and reserved_seats.');
 if(!rows.length||rows.length>500)throw Error('Include 1–500 households per file.');
 const names=new Set();return rows.map((r,i)=>{if(r.length!==2)throw Error(`Row ${i+2}: expected two columns.`);const name=r[headers.indexOf('main_guest_name')].normalize('NFC').trim().replace(/\s+/g,' '),value=r[headers.indexOf('reserved_seats')].trim(),seats=Number(value);if(name.length<2||name.length>100||!/[\p{L}]/u.test(name)||/[\p{Cc}]/u.test(name))throw Error(`Row ${i+2}: enter a guest name of 2–100 characters.`);if(!/^\d+$/.test(value)||seats<1||seats>30)throw Error(`Row ${i+2}: reserved seats must be a whole number from 1 to 30.`);const key=name.toLowerCase();if(names.has(key))throw Error(`Row ${i+2}: duplicate guest ${name}.`);names.add(key);return {name,seats};});
}
