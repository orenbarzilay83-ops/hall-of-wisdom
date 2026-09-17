#!/usr/bin/env node

import assert from 'node:assert/strict';
import { FIGURE_DESCRIPTIONS } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-descriptions-gate2.js';
import { HAWI_FIGURE_NAMES_BY_ID } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js';

const local = (pattern) => FIGURE_DESCRIPTIONS[pattern];
const global = (pattern) => HAWI_FIGURE_NAMES_BY_ID[pattern];

for (const pattern of ['2222', '1121', '2212', '1111', '2112', '1211']) {
  assert.equal(local(pattern).profileScope, 'local-chapter-profile');
  assert.ok(local(pattern).localProfileAttributes);
  assert.ok(local(pattern).crossChapterConflicts.length > 0);
}

assert.equal(local('2222').localProfileAttributes.gender, 'נקבה');
assert.equal(local('2222').localProfileAttributes.movement, 'לא פנימי ולא חיצוני לפי פרופיל זה');
assert.equal(global('2222').genderHebrew, 'דו-מיני');
assert.equal(global('2222').movementHebrew, 'קבוע');

assert.equal(local('1121').localProfileAttributes.elementPrimary, 'אוויר');
assert.equal(local('1121').localProfileAttributes.elementSecondaryPrinted, 'מים');
assert.equal(global('1121').elementHebrew, 'אוויר');

assert.equal(local('2212').localProfileAttributes.movement, 'פנימי');
assert.equal(local('2212').localProfileAttributes.time, 'יומי');
assert.equal(global('2212').movementHebrew, 'קבוע');
assert.equal(global('2212').timeHebrew, 'לילי');

assert.equal(local('1111').localProfileAttributes.gender, 'נקבה');
assert.equal(global('1111').genderHebrew, 'דו-מיני');

assert.match(local('2112').localProfileAttributes.contextuality, /מיטיב\/מזיק/);
assert.equal(global('2112').movementHebrew, 'קבוע');

assert.equal(local('1211').localProfileAttributes.movement, 'פנימי');
assert.equal(global('1211').movementHebrew, 'מתהפך');

console.log('KASHF p72–95 local figure-profile scope tests: PASS');
