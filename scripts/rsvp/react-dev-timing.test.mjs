import assert from 'node:assert/strict';
import test from 'node:test';
import {installReactTimingGuard} from '../../lib/react-dev-timing.mjs';
const detail={devtools:{trackGroup:'Server Components ⚛'}};
test('correct only invalid React server timing and preserve details',()=>{let received;const target={measure(...args){received=args;return 'entry';}};installReactTimingGuard(target);const wrapped=target.measure;installReactTimingGuard(target);assert.equal(target.measure,wrapped);assert.equal(target.measure('\u200bInvite',{start:12,end:-1,detail}),'entry');assert.deepEqual(received,['\u200bInvite',{start:12,end:12,detail}]);});
test('ordinary measurements and errors remain untouched',()=>{const failure=Error('actual application error');const target={measure(name,options){if(name==='application')throw failure;return options;}};installReactTimingGuard(target);const options={start:2,end:8,detail};assert.equal(target.measure('\u200bInvite',options),options);assert.throws(()=>target.measure('application',{start:1,end:-1}),error=>error===failure);const unrelated={start:3,end:-1,detail:{devtools:{trackGroup:'other'}}};assert.equal(target.measure('\u200bInvite',unrelated),unrelated);});
