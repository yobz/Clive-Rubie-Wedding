import {test} from 'node:test';import assert from 'node:assert/strict';import {adminRequest} from '../../lib/rsvp/admin-request.mjs';
test('admin requests have bounded waits and uncertain writes are identified',async()=>{
 await assert.rejects(adminRequest('/api/admin',{method:'POST'},10,()=>new Promise(()=>{})),e=>e.outcomeUnknown&&e.message.includes('too long'));
 await assert.rejects(adminRequest('/api/admin',{},10,()=>new Promise(()=>{})),e=>!e.outcomeUnknown);
});
test('expired sessions and conflicts are distinct from an unconfirmed save',async()=>{
 for(const status of [401,403,409])await assert.rejects(adminRequest('/api/admin',{method:'POST'},100,async()=>Response.json({error:'Refresh required'},{status})),e=>e.status===status&&!e.outcomeUnknown);
 await assert.rejects(adminRequest('/api/admin',{method:'POST'},100,async()=>new Response('<html>error</html>',{status:502})),e=>e.outcomeUnknown);
 assert.deepEqual(await adminRequest('/api/admin',{method:'POST'},100,async()=>Response.json({ok:true})),{ok:true});
});
