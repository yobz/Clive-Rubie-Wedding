import {test} from 'node:test';import assert from 'node:assert/strict';
import {validateResponse} from '../../lib/rsvp/validation.mjs';
import {summarizeGuests} from '../../lib/rsvp/headcounts.mjs';
import {invitationNotifications} from '../../lib/rsvp/notifications.mjs';
import {invitationMessage} from '../../lib/rsvp/message.mjs';
test('message-only submission requires a message and ignores attendance and extra guests',()=>{
 assert.deepEqual(validateResponse({message:' Love you! ',attendance:'attending',additionalNames:'Hidden'},1,true),{attendance:null,names:[],message:'Love you!'});
 assert.throws(()=>validateResponse({message:' '},1,true));assert.throws(()=>validateResponse({message:'x'.repeat(2001)},1,true));
});
test('message-only records do not affect any guest or delivery totals',()=>{
 const guest={reserved_seats:2,attendance:'attending',additional_names:['Friend'],sent:true};
 const note={...guest,message_only:true};assert.deepEqual(summarizeGuests([guest,note]),summarizeGuests([guest]));
});
test('message-only creates one message notification, without RSVP or seat copy',()=>{
 const notices=invitationNotifications([{id:'note',main_guest_name:'Friend',message_only:true,attendance:null,message:'Best wishes',submitted_at:'2026-10-09T00:00:00Z'}]);
 assert.equal(notices.length,1);assert.equal(notices[0].kind,'message');assert.equal(notices[0].attendance,'message-only');
 const text=invitationMessage('Friend',1,'https://example.com/invite/test',true);assert.ok(text.includes('Leave us a little love'));assert.ok(!text.includes('seat'));assert.ok(!text.includes('RSVP'));
});
