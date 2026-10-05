import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fadeVolume} from '../lib/music-volume.mjs';
test('fade clamps early frames and caps late frames',()=>{
 assert.equal(fadeVolume(-0.7),0);
 assert.equal(fadeVolume(0),0);
 assert.equal(fadeVolume(600),0.15);
 assert.equal(fadeVolume(1200),0.3);
 assert.equal(fadeVolume(5000),0.3);
});
