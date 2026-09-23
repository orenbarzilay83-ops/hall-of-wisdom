import assert from 'node:assert/strict';

import {
  FIGURE_DIGNITIES,
  FIGURE_JOY_GRIEF_SUPPLEMENTARY_NOTE as SUP,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';

// Printed KASHF p100 / scan p102 source regression.

assert.equal(SUP.sourceRef, "כשף אל-אסראר עמ' 100");
assert.equal(SUP.provenance.editionId, 'kashf-hebrew-v57');
assert.equal(SUP.certainty.visualDependency, 'printed-scan-p102');

assert.deepEqual(SUP.planetJoyByHouse, {
  'שבתאי (דרך שמחת צדק)': 11,
  'מאדים': 16,
  'שמש': 9,
  'נוגה': 5,
  'כוכב חמה': 1,
  'ירח': 3,
}, 'planet joy map must match printed p100, including Venus at H5');

assert.equal(SUP.nodeJoyFollows['ראש התלי'].follows, 'צדק');
assert.equal(SUP.nodeJoyFollows['זנב התלי'].follows, 'שבתאי');
assert.equal(
  Object.prototype.hasOwnProperty.call(SUP.planetJoyByHouse, 'ראש התלי (נמשך אחר צדק)'),
  false,
  'head-node follow relation must not be silently converted to H11'
);
assert.equal(
  Object.prototype.hasOwnProperty.call(SUP.planetJoyByHouse, 'זנב התלי (נמשך אחר שבתאי)'),
  false,
  'tail-node follow relation must not be silently converted to H11'
);

assert.deepEqual(
  SUP.ambiguousFigureGroup.figures,
  ['2221', '1221', '2122', '1211', '1121', '2211'],
  'six-figure ambiguous group must preserve the printed set'
);
assert.equal(SUP.ambiguousFigureGroup.statedJoyHouse, 11);
assert.equal(SUP.ambiguousFigureGroup.interpretationStatus, 'source-wording-ambiguous');
for (const p of SUP.ambiguousFigureGroup.figures) {
  assert.equal(
    Object.prototype.hasOwnProperty.call(SUP.griefByFigure, p),
    false,
    p + ': ambiguous printed wording must not be normalized into griefByFigure'
  );
}

assert.deepEqual(SUP.griefByFigure, {
  '2222': [7, 14],
  '2112': [7, 14],
  '2212': [1],
  '1111': [1],
}, 'grief pairs must be Jamaa+Ijtimaa at H7/H14 and Bayad+Tariq at H1');

assert.equal(
  Object.prototype.hasOwnProperty.call(SUP.griefByFigure, '1212'),
  false,
  'Qabd Kharij must not be incorrectly placed in H1 grief pair'
);

assert.deepEqual(SUP.tentativePlanetAttachments.figures, ['1212', '1112']);
assert.deepEqual(SUP.tentativePlanetAttachments.planets, ['שבתאי', 'מאדים']);
assert.equal(SUP.tentativePlanetAttachments.certainty, 'tentative-in-source');
assert.equal(SUP.tentativePlanetAttachments.assignment, 'collective-unspecified');
assert.match(SUP.tentativePlanetAttachments.raw, /لعله/);

assert.equal(SUP.usagePolicy.mayOverwriteMainDignityTable, false);
assert.equal(SUP.usagePolicy.mayFillNullValuesAutomatically, false);
assert.equal(SUP.usagePolicy.followsRelationMustNotBeConvertedToHouse, true);
assert.equal(SUP.usagePolicy.tentativePlanetAttachmentMustRemainTentative, true);
assert.equal(SUP.usagePolicy.tentativePlanetAttachmentMustNotBeSplitOneToOne, true);

// Batch 04 is supplementary only: main p97-99 dignity rows remain untouched.
assert.equal(Object.keys(FIGURE_DIGNITIES).length, 14);
assert.equal(FIGURE_DIGNITIES['1112'].panimHouse, 7);
assert.equal(FIGURE_DIGNITIES['2211'].simchaHouse, 12);
assert.equal(FIGURE_DIGNITIES['2112'].maalaHouse, 11);
assert.equal(FIGURE_DIGNITIES['1111'].maalaHouse, 13);

console.log('Batch 04 p100 joy/grief source regression: PASS');
console.log('Venus joy H5: PASS');
console.log('Bayad+Tariq H1 grief pair: PASS');
console.log('Qabd Kharij+Ataba Kharija tentative Saturn/Mars clause preserved: PASS');
console.log('Node follow-relations preserved without numeric inference: PASS');
