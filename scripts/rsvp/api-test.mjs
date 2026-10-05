import assert from 'node:assert/strict';
import pg from 'pg';
process.loadEnvFile('.env.local');
const origin='http://localhost:5173';
let cookie='',csrf='';
async function request(path,data,authenticated=false){const r=await fetch(origin+path,{method:data?'POST':'GET',headers:{origin,'Content-Type':'application/json',...(authenticated?{cookie,'x-csrf-token':csrf}:{})},...(data?{body:JSON.stringify(data)}:{})});return {r,data:await r.json()};}
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
const ids=[];
try{
 assert.equal((await request('/api/admin')).r.status,401);
 const login=await request('/api/admin',{action:'login',password:process.env.ADMIN_PASSWORD});assert.equal(login.r.status,200);cookie=login.r.headers.get('set-cookie').split(';')[0];
 let dashboard=await request('/api/admin',undefined,true);csrf=dashboard.data.csrf;
 const name='QA '+Date.now();assert.equal((await request('/api/admin',{action:'create',name,seats:3},true)).r.status,200);
 dashboard=await request('/api/admin',undefined,true);const row=dashboard.data.invitations.find(r=>r.main_guest_name===name);ids.push(row.id);
 assert.equal((await request('/api/invitations/'+row.token)).data.reserved_seats,3);
 assert.equal((await request('/api/rsvp',{token:row.token,attendance:'attending',additionalNames:'Lux, Ahri, Akali',message:''})).r.status,400);
 const response={token:row.token,attendance:'attending',additionalNames:'Lux, Ahri',message:'A message worth keeping.'};
 const concurrent=await Promise.all([request('/api/rsvp',response),request('/api/rsvp',response)]);assert.deepEqual(concurrent.map(x=>x.r.status).sort(),[201,409]);
 const saved=(await request('/api/invitations/'+row.token)).data;assert.deepEqual(saved.additional_names,['Lux','Ahri']);assert.equal(saved.message,response.message);assert.ok(saved.submitted_at);
 assert.equal((await request('/api/admin',{action:'update',id:row.id,name,seats:2,attendance:'attending',additionalNames:'Lux',message:response.message},true)).r.status,200);
 assert.equal((await request('/api/admin',{action:'revoke',id:row.id},true)).r.status,200);assert.equal((await request('/api/invitations/'+row.token)).r.status,404);
 assert.equal((await request('/api/admin',{action:'rotate',id:row.id},true)).r.status,200);assert.equal((await request('/api/invitations/'+row.token)).r.status,404);
 const forbidden=await fetch(origin+'/api/admin',{method:'POST',headers:{origin,cookie,'Content-Type':'application/json'},body:JSON.stringify({action:'revoke',id:row.id})});assert.equal(forbidden.status,403);
 console.log('PASS: authentication, household lookup, seat limits, concurrent duplicate prevention, message persistence, admin corrections, revocation, token rotation, CSRF.');
}finally{if(ids.length)await pool.query('DELETE FROM invitations WHERE id = ANY($1::uuid[])',[ids]);await pool.end();}
