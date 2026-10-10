import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateResponse} from '../../lib/rsvp/validation.mjs';
const input=(names='',attendance='attending')=>({attendance,additionalNames:names,message:' Best wishes! '});
test('main guest uses one reserved seat',()=>{assert.deepEqual(validateResponse(input(),1).names,[]);assert.throws(()=>validateResponse(input('Xayah'),1),/reserves 1/);});
test('four seats allow three named additions, fewer are welcome',()=>{assert.equal(validateResponse(input('Akali, Evelynn, Kai’Sa'),4).names.length,3);assert.equal(validateResponse(input('Akali'),4).names.length,1);assert.throws(()=>validateResponse(input('Akali, Evelynn, Kai’Sa, Lux'),4),/reserves 4/);});
test('declining clears guest names and preserves a private message',()=>{const result=validateResponse(input('Xayah','declining'),2);assert.deepEqual(result.names,[]);assert.equal(result.message,'Best wishes!');});
test('reject duplicate and malformed names',()=>{assert.throws(()=>validateResponse(input('Lux, lux'),4),/only once/);assert.throws(()=>validateResponse(input('<Lux>'),4));assert.throws(()=>validateResponse(null,2));});
test('reject numeric names before checking capacity',()=>{assert.throws(()=>validateResponse(input('111,225,333,433'),4),/not numbers/);assert.throws(()=>validateResponse(input('Lux123'),4),/not numbers/);assert.throws(()=>validateResponse(input('１２３'),4),/not numbers/);});
test('accept accented and punctuated names',()=>{assert.equal(validateResponse(input('José de la Cruz, Anne-Marie, O’Neil'),4).names.length,3);});
test('reject blank entries and stray commas; single-seat guests may attend alone',()=>{for(const names of ['Lux, , Mel','Lux,',',Lux',',,'])assert.throws(()=>validateResponse(input(names),4),/blank guest name/);assert.deepEqual(validateResponse(input('   '),1).names,[]);});
test('reject symbols, emoji, short names and placeholders',()=>{for(const names of ['!!!','A','Li','A-B','Lux 😃','@Lux','John_Lee','Guest','TBD','Anne--Marie'])assert.throws(()=>validateResponse(input(names),4));});
test('normalize whitespace and reject equivalent duplicates',()=>{assert.deepEqual(validateResponse(input('  José   de la Cruz, Mary J. '),3).names,['José de la Cruz','Mary J.']);assert.throws(()=>validateResponse(input('Mary  Jane, mary jane'),3),/only once/);});

test('multi-seat attending invitations require at least one additional guest',()=>{for(const seats of [2,3,30]){for(const names of ['', '   '])assert.throws(()=>validateResponse(input(names),seats),/at least one additional guest/);assert.equal(validateResponse(input('Jane Doe'),seats).names.length,1);assert.deepEqual(validateResponse(input('', 'declining'),seats).names,[]);}assert.deepEqual(validateResponse({message:'Best wishes!'},2,true).names,[]);});
