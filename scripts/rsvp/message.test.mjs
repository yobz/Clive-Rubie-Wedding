import {test} from 'node:test';
import assert from 'node:assert/strict';
import {invitationMessage} from '../../lib/rsvp/message.mjs';
test('clipboard invitation preserves paragraphs and link on its own line',()=>{
 const message=invitationMessage('Graves',2,'http://localhost:5173/invite/example');
 assert.equal(message,"Hi Graves!\n\nWe'd love to celebrate our wedding with you on November 29, 2026.\nWe've reserved 2 seats for your invitation.\nPlease RSVP here:\nhttp://localhost:5173/invite/example\n\nIf the link won’t open or you have any questions, just reply here!\n\nWith love,\nClive & Rubie");
 assert.match(invitationMessage('Ana',1,'url'),/1 seat for/);
});
