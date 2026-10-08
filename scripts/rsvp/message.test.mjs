import {test} from 'node:test';
import assert from 'node:assert/strict';
import {invitationMessage} from '../../lib/rsvp/message.mjs';

test('clipboard invitation preserves personal details, paragraphs and a separate link',()=>{
 const url='https://clivefoundhisrubie.love/invite/example';
 const message=invitationMessage('John Kevin',2,url);
 assert.ok(message.startsWith('Hi John Kevin! 🥹💗\n\n'));
 assert.ok(message.includes('We’ve saved 2 seats just for you!'));
 assert.ok(message.includes('coming:\n'+url+'\n\n'));
 assert.ok(message.endsWith('With love,\nClive & Rubie 💕'));
 assert.match(invitationMessage('Ana',1,url),/1 seat just for you!/);
 assert.ok(!/[—–]/u.test(message));
});
