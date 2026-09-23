import assert from 'node:assert/strict';

import {
  LESHON_HAINYAN_STRUCTURAL_STATES,
  classifyLeshonHainyanHouse,
  computeLeshonHainyan,
} from './goral-hachol/engine/kashf-leshon-hainyan.js';

// Printed KASHF p112 / scan p114 regression:
// الأوتاد = present, مائل الأوتاد = future, الزائل الساقط عن الوتد = past.
for (const house of [1, 4, 7, 10]) {
  assert.deepEqual(classifyLeshonHainyanHouse(house), {
    id: 'awtad',
    arabic: 'الأوتاد',
    house,
    judgment: 'present',
    judgmentHebrew: 'הווה/מצב נוכחי',
  });
}

for (const house of [2, 5, 8, 11]) {
  assert.deepEqual(classifyLeshonHainyanHouse(house), {
    id: 'mayil-al-awtad',
    arabic: 'مائل الأوتاد',
    house,
    judgment: 'future',
    judgmentHebrew: 'עתיד',
  });
}

for (const house of [3, 6, 9, 12]) {
  assert.deepEqual(classifyLeshonHainyanHouse(house), {
    id: 'zail-saqit-an-al-watad',
    arabic: 'الزائل الساقط عن الوتد',
    house,
    judgment: 'past',
    judgmentHebrew: 'עבר',
  });
}

for (const house of [13, 14, 15, 16]) {
  assert.equal(
    classifyLeshonHainyanHouse(house),
    null,
    `H${house} must not be invented into the p112 12-house structural taxonomy`
  );
}

assert.deepEqual(
  LESHON_HAINYAN_STRUCTURAL_STATES.map((x) => x.houses),
  [[1, 4, 7, 10], [2, 5, 8, 11], [3, 6, 9, 12]],
  'p112 structural house groups must remain explicit and source-faithful'
);

// H1 is put in its p104-105 moshav figure (1222), so computeLeshonHainyan
// takes the already-existing direct branch. The same figure is repeated in
// H2 and H3 to prove that p112 preserves the actual structural trigger and
// does not collapse it to a bare semantic word such as "future".
const board = {
  entries: [
    { pattern: '1222' }, // H1  awtad -> present
    { pattern: '1222' }, // H2  mayil al-awtad -> future
    { pattern: '1222' }, // H3  zail -> past
    { pattern: '2222' },
    { pattern: '1121' },
    { pattern: '1221' },
    { pattern: '2221' },
    { pattern: '2122' },
    { pattern: '2212' },
    { pattern: '1122' },
    { pattern: '2211' },
    { pattern: '1112' },
    { pattern: '1222' }, // H13 deliberately ignored by the p112 taxonomy
    { pattern: '2111' },
    { pattern: '2112' },
    { pattern: '1211' },
  ],
};

const result = computeLeshonHainyan(board, 1);
assert.equal(result.case, 'sitting-in-moshav-house');
assert.equal(result.pattern, '1222');
assert.equal(result.structuralTiming.trigger, 'house-structural-state');
assert.equal(result.structuralTiming.sourceStatus, 'explicit-in-source');
assert.deepEqual(
  result.structuralTiming.occurrences.map((x) => x.house),
  [1, 2, 3],
  'only H1-H12 occurrences participate in the p112 structural timing rule'
);
assert.deepEqual(
  result.structuralTiming.judgments,
  ['present', 'future', 'past'],
  'all source structural states must be preserved when the figure repeats across them'
);
assert.equal(
  result.structuralTiming.ambiguousAcrossStructuralStates,
  true,
  'multiple structural states must remain explicit instead of inventing precedence'
);

console.log('Batch 08 p112 Lisan al-Amr structural regression: PASS');
console.log('awtad [1,4,7,10] => present: PASS');
console.log('mayil al-awtad [2,5,8,11] => future: PASS');
console.log('zail [3,6,9,12] => past: PASS');
console.log('no invented p112 classification for H13-H16: PASS');
console.log('structural trigger preserved in computeLeshonHainyan output: PASS');
