import assert from 'node:assert/strict';
const origin='http://localhost:5173';
const valid={requestId:'00000000-0000-4000-8000-000000000001',name:'QA Wedding Guest',attendance:'attending',dietary:'Vegetarian',song:'A test song'};
async function post(value,from=origin){return fetch(origin+'/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json',Origin:from},body:JSON.stringify(value)})}
assert.equal((await post(valid,'https://example.com')).status,403,'Foreign origins must fail');
assert.equal((await post({...valid,name:' '})).status,400,'Blank names must fail');
assert.equal((await post({...valid,attendance:'maybe'})).status,400,'Unknown attendance must fail');
assert.equal((await post({...valid,dietary:'x'.repeat(501)})).status,400,'Oversized fields must fail');
assert.equal((await post(valid)).status,201,'Attendance must save');
assert.equal((await post(valid)).status,201,'A retry must be idempotent');
assert.equal((await post({...valid,requestId:'00000000-0000-4000-8000-000000000002',attendance:'declining'})).status,201,'Declines must save');
console.log('Passed 7 RSVP API checks. Local QA records use UUIDs ending 000001 and 000002.');
