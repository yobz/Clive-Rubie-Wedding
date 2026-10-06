import assert from 'node:assert/strict';
import {parseHouseholds} from '../../lib/rsvp/csv.mjs';
assert.deepEqual(parseHouseholds('\ufeffreserved_seats,main_guest_name\r\n2,"Santos, Ana"\r\n'),[{name:'Santos, Ana',seats:2}]);
assert.equal(parseHouseholds('main_guest_name,reserved_seats\n"Ana ""Nena"" Cruz",2')[0].name,'Ana "Nena" Cruz');
for(const body of ['Ana,0','Ana,2.5','!!!,2','Ana,2\n ana ,1','"Ana,2','Ana,2,3',',2'])assert.throws(()=>parseHouseholds('main_guest_name,reserved_seats\n'+body));
console.log('PASS: CSV quoting, BOM, reordered headers, invalid rows and duplicates.');
