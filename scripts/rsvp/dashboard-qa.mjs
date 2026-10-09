// Opt-in integration QA: requires the local app and local PostgreSQL.
// Run explicitly with: node scripts/rsvp/dashboard-qa.mjs
import assert from 'node:assert/strict';
import {createHash, randomUUID} from 'node:crypto';
import pg from 'pg';

process.loadEnvFile('.env.local');
const origin=process.env.RSVP_TEST_ORIGIN||'http://localhost:5173';
const app=new URL(origin), database=new URL(process.env.DATABASE_URL);
assert.ok(['localhost','127.0.0.1'].includes(app.hostname)&&app.port==='5173'&&app.protocol==='http:', 'QA requires the local app on port 5173.');
assert.ok(['localhost','127.0.0.1'].includes(database.hostname)&&database.port==='54329'&&database.pathname==='/wedding', 'QA requires local wedding PostgreSQL on port 54329.');
const pool=new pg.Pool({connectionString:database.toString()});
const ids=[], prefix='Dashboard QA '+randomUUID();
let checks=0;
function pass(){checks++;}
async function request(path,input,auth,headers={}){
 const response=await fetch(origin+path,{method:input===undefined?'GET':'POST',signal:AbortSignal.timeout(15000),headers:{origin,'Content-Type':'application/json',...(auth?{cookie:auth.cookie,'x-csrf-token':auth.csrf}:{}),...headers},...(input===undefined?{}:{body:JSON.stringify(input)})});
 return {status:response.status,data:await response.json()};
}
async function login(){
 const response=await fetch(origin+'/api/admin',{method:'POST',signal:AbortSignal.timeout(15000),headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({action:'login',password:process.env.ADMIN_PASSWORD})});
 assert.equal(response.status,200);
 const auth={cookie:response.headers.get('set-cookie').split(';')[0]};
 auth.csrf=(await request('/api/admin',undefined,auth)).data.csrf;return auth;
}
async function snapshot(){
 const records=(await pool.query('SELECT row_to_json(i) AS record FROM invitations i WHERE NOT(id=ANY($1::uuid[])) ORDER BY id',[ids])).rows;
 return createHash('sha256').update(JSON.stringify(records)).digest('hex');
}
let original;
try{
 original=await snapshot();
 const auth=await login(), other=await login();
 async function row(id){return (await request('/api/admin',undefined,auth)).data.invitations.find(item=>item.id===id);}
 async function create(label,extra={}){
  const name=prefix+' '+label;
  const result=await request('/api/admin',{action:'create',name,seats:3,guestGroup:'groom',...extra},auth);
  // Record our exact UUID before assertions so partial failures still clean up.
  const stored=(await pool.query('SELECT id FROM invitations WHERE main_guest_name=$1',[name])).rows;
  ids.push(...stored.map(item=>item.id));
  assert.equal(result.status,200);assert.equal(stored.length,1);return row(stored[0].id);
 }
 function edit(item,extra={}){return {action:'update',id:item.id,expectedVersion:item.edit_version,name:item.main_guest_name,seats:item.reserved_seats,guestGroup:item.guest_group,messageOnly:item.message_only,attendance:item.attendance||'pending',additionalNames:item.additional_names.join(', '),message:item.message,...extra};}
 async function success(input){assert.equal((await request('/api/admin',input,auth)).status,200);pass();}
 async function stale(input){assert.equal((await request('/api/admin',input,auth)).status,409);pass();}
 assert.equal((await request('/api/admin')).status,401);
 assert.equal((await request('/api/admin/notifications')).status,401);
 assert.equal((await request('/api/admin/errors')).status,401);pass();
 const normal=await create('normal');
 for(const attendance of ['pending','attending','declining']){
  const current=await row(normal.id);
  await success(edit(current,{attendance,additionalNames:attendance==='attending'?'Jane Doe':'',message:'A retained QA message'}));
  const saved=await row(normal.id);assert.equal(saved.attendance,attendance==='pending'?null:attendance);
  assert.equal(saved.message,'A retained QA message');assert.ok(saved.edit_version>current.edit_version);
 }
 let current=await row(normal.id);
 await success(edit(current,{messageOnly:true}));
 let saved=await row(normal.id);assert.equal(saved.attendance,null);assert.deepEqual(saved.additional_names,[]);assert.equal(saved.message_only,true);
 assert.ok((await request('/api/guest-messages')).data.messages.some(item=>item.name===saved.main_guest_name));pass();
 await stale(edit(current,{name:prefix+' stale conversion'}));
 current=saved;
 await success(edit(current,{messageOnly:false,seats:3,attendance:'pending',message:'Retained pending note'}));
 saved=await row(normal.id);assert.equal(saved.message,'Retained pending note');assert.equal(saved.submitted_at,null);pass();
 const legacyEdit=edit(saved,{name:prefix+' legacy renamed'});delete legacyEdit.messageOnly;
 await success(legacyEdit);saved=await row(normal.id);assert.equal(saved.message_only,false);assert.equal(saved.message,'Retained pending note');
 const draft=saved;
 assert.equal((await request('/api/rsvp',{token:draft.token,attendance:'attending',additionalNames:'Jane Doe',message:'Guest submitted while admin was editing'})).status,201);
 await stale(edit(draft,{name:prefix+' stale after RSVP'}));
 current=await row(normal.id);assert.ok(current.edit_version>draft.edit_version);
 const obsolete=edit(draft);delete obsolete.expectedVersion;
 assert.equal((await request('/api/admin',obsolete,auth)).status,409);pass();
 await success(edit(current,{name:prefix+' corrected'}));
 await stale(edit(current,{name:prefix+' overwritten'}));
 current=await row(normal.id);
 await success({action:'sent',id:current.id,expectedVersion:current.edit_version,sent:true});
 await stale(edit(current));
 saved=await row(normal.id);assert.equal(saved.sent,true);assert.ok(saved.edit_version>current.edit_version);pass();
 const concurrentEdits=await Promise.all([request('/api/admin',edit(saved,{name:prefix+' concurrent one'}),auth),request('/api/admin',edit(saved,{name:prefix+' concurrent two'}),other)]);
 assert.deepEqual(concurrentEdits.map(result=>result.status).sort(),[200,409]);pass();
 const lifecycle=await create('lifecycle');
 await success({action:'revoke',id:lifecycle.id,expectedVersion:lifecycle.edit_version});
 assert.equal((await request('/api/invitations/'+lifecycle.token)).status,404);
 await stale({action:'rotate',id:lifecycle.id,expectedVersion:lifecycle.edit_version});
 const revoked=await row(lifecycle.id);assert.ok(revoked.edit_version>lifecycle.edit_version);
 await success({action:'rotate',id:revoked.id,expectedVersion:revoked.edit_version});
 const rotated=await row(lifecycle.id);assert.ok(rotated.edit_version>revoked.edit_version);assert.notEqual(rotated.token,lifecycle.token);assert.equal(rotated.revoked,false);
 assert.equal((await request('/api/invitations/'+rotated.token)).status,200);pass();
 const message=await create('message',{messageOnly:true,seats:0,guestGroup:'bride'});
 for(const text of ['', ' ', 'x'.repeat(2001)])assert.equal((await request('/api/rsvp',{token:message.token,message:text})).status,400);pass();
 const racing=await Promise.all([request('/api/rsvp',{token:message.token,message:'QA wishes'}),request('/api/rsvp',{token:message.token,message:'QA wishes'})]);
 assert.deepEqual(racing.map(result=>result.status).sort(),[201,409]);pass();
 await stale(edit(message,{name:prefix+' stale message'}));
 const messageCurrent=await row(message.id), messageEdit=edit(messageCurrent,{name:prefix+' message renamed'});delete messageEdit.messageOnly;
 await success(messageEdit);const messageSaved=await row(message.id);assert.equal(messageSaved.message_only,true);assert.equal(messageSaved.message,'QA wishes');assert.ok(messageSaved.edit_version>messageCurrent.edit_version);
 const notices=(await request('/api/admin/notifications',undefined,auth)).data.notifications.filter(item=>item.householdId===message.id);
 assert.equal(notices.length,1);assert.equal(notices[0].kind,'message');
 await successNotification(notices.map(item=>item.key));
 async function successNotification(keys){assert.equal((await request('/api/admin/notifications',{keys},auth)).status,200);assert.ok(!(await request('/api/admin/notifications',undefined,other)).data.notifications.some(item=>keys.includes(item.key)));pass();}
 assert.equal((await request('/api/admin',null,auth)).status,400);
 assert.equal((await request('/api/admin',[],auth)).status,400);
 current=await row(normal.id);
 assert.equal((await request('/api/admin',edit(current,{name:'A'}),auth)).status,400);
 assert.equal((await request('/api/admin',edit(current,{seats:0}),auth)).status,400);
 assert.equal((await request('/api/admin',edit(current,{expectedVersion:-1}),auth)).status,400);
 assert.equal((await request('/api/admin',edit(current),auth,{'x-csrf-token':'invalid'})).status,403);pass();
 const doomed=await create('deleted');
 await success({action:'delete',ids:[doomed.id]});
 for(const input of [edit(doomed),{action:'sent',id:doomed.id,expectedVersion:doomed.edit_version,sent:true},{action:'rotate',id:doomed.id,expectedVersion:doomed.edit_version},{action:'revoke',id:doomed.id,expectedVersion:doomed.edit_version}])assert.equal((await request('/api/admin',input,auth)).status,404);pass();
 const csv='main_guest_name,reserved_seats,guest_group\n'+prefix+' Import One,2,bride\n'+prefix+' Import Two,3,groom';
 const imported=await request('/api/admin',{action:'import',csv},auth);
 const importedRows=(await pool.query('SELECT id FROM invitations WHERE main_guest_name=ANY($1::text[])',[[prefix+' Import One',prefix+' Import Two']])).rows;ids.push(...importedRows.map(item=>item.id));
 assert.equal(imported.status,200);assert.equal(importedRows.length,2);
 assert.equal((await request('/api/admin',{action:'import',csv:'main_guest_name,reserved_seats\n'+prefix+' Not Added,1\n'+prefix+' Import One,2'},auth)).status,400);
 const unexpected=(await pool.query('SELECT id FROM invitations WHERE main_guest_name=$1',[prefix+' Not Added'])).rows;ids.push(...unexpected.map(item=>item.id));assert.equal(unexpected.length,0);pass();
 console.log('PASS: '+checks+' dashboard integration groups, including version conflicts, deleted records, message-only, retained notes, notifications, auth and CSV.');
}finally{
 try{
  if(ids.length){await pool.query('DELETE FROM admin_notification_reads WHERE notification_key LIKE ANY($1::text[])',[ids.map(id=>id+':%')]);await pool.query('DELETE FROM invitations WHERE id=ANY($1::uuid[])',[ids]);}
  if(original){assert.equal(await snapshot(),original,'Non-fixture guest records changed during QA.');console.log('PASS: fixture cleanup; original guest records unchanged.');}
 }finally{await pool.end();}
}
