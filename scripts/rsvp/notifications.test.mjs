import test from 'node:test';
import assert from 'node:assert/strict';
import {invitationNotifications} from '../../lib/rsvp/notifications.mjs';
const response={id:'a',main_guest_name:'Test guest',attendance:'attending',submitted_at:'2026-10-09T00:00:00Z',message:'Hello'};
test('RSVP and message have independent unread state, including private declining notes',()=>{
 const all=invitationNotifications([response,{...response,id:'b',attendance:'declining'}]);assert.equal(all.length,4);
 assert.equal(invitationNotifications([response],[all[0].key]).length,1);
 assert.equal(invitationNotifications([response],all.map(item=>item.key)).length,0);
});
test('pending households and blank messages do not create extra notifications',()=>{assert.equal(invitationNotifications([{...response,attendance:null},{...response,submitted_at:null}]).length,0);assert.equal(invitationNotifications([{...response,message:'  '}]).length,1);});
test('a new submission after reopening becomes unread again',()=>{const old=invitationNotifications([response]);assert.equal(invitationNotifications([{...response,submitted_at:'2026-10-10T00:00:00Z'}],old.map(item=>item.key)).length,2);});

test('database dates and browser timestamps share identical read keys',()=>{assert.deepEqual(invitationNotifications([{...response,submitted_at:new Date(response.submitted_at)}]),invitationNotifications([response]));});
