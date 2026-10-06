import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeGuests} from '../lib/rsvp/headcounts.mjs';
test('meal headcount uses named guests, not reserved seats',()=>{
 const rows=[{reserved_seats:4,attendance:'attending',additional_names:['Lux','Akali']},{reserved_seats:1,attendance:'attending',additional_names:[]},{reserved_seats:2,attendance:'attending',additional_names:['Twisted Fate']},{reserved_seats:1,attendance:'declining',additional_names:[]}];
 assert.deepEqual(summarizeGuests(rows),{attending:6,declining:1,pending:0,reserved:8,sent:0,notSent:4});
 rows[0]={...rows[0],attendance:null,additional_names:[]};
 assert.deepEqual(summarizeGuests(rows),{attending:3,declining:1,pending:1,reserved:8,sent:0,notSent:4});
});
test('delivery counts households independently from attendance and seats',()=>{
 const rows=[{reserved_seats:4,attendance:'attending',additional_names:['Lux'],sent:true},{reserved_seats:2,attendance:null,additional_names:[],sent:false},{reserved_seats:1,attendance:'declining',additional_names:[],sent:true}];
 assert.deepEqual(summarizeGuests(rows),{attending:2,declining:1,pending:1,reserved:7,sent:2,notSent:1});
 assert.equal(summarizeGuests([]).notSent,0);
});
