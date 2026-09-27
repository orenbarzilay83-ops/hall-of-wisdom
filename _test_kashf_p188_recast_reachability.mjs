import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { classifyCanonicalFigure } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';
import { getKashfMethod } from './goral-hachol/registry/kashf-canonical-method-registry.js';

const patterns = [];
for (const fire of ['1', '2'])
  for (const air of ['1', '2'])
    for (const water of ['1', '2'])
      for (const earth of ['1', '2'])
        patterns.push(fire + air + water + earth);

let checked = 0;
let allInward = 0;
let allInwardBenefic = 0;
let maximumInwardBenefic = 0;
for (const a of patterns)
  for (const b of patterns)
    for (const c of patterns)
      for (const d of patterns) {
        const original = buildRamlBoardFromMothers([a, b, c, d]);
        const derivedMothers = [1, 4, 6, 8].map(house => original.entries[house - 1].pattern);
        const derived = buildRamlBoardFromMothers(derivedMothers);
        const decisive = [1, 4, 7, 10].map(house => classifyCanonicalFigure(derived.entries[house - 1].pattern));
        const inward = decisive.filter(figure => figure.dakhalKharij === 'dakhil').length;
        const inwardBenefic = decisive.filter(figure => figure.dakhalKharij === 'dakhil'
          && figure.saadNahs === 'saad').length;
        checked++;
        if (inward === 4) allInward++;
        if (inwardBenefic === 4) allInwardBenefic++;
        maximumInwardBenefic = Math.max(maximumInwardBenefic, inwardBenefic);
      }

assert.equal(checked, 65536);
assert.equal(allInward, 0);
assert.equal(allInwardBenefic, 0);
assert.equal(maximumInwardBenefic, 3);
assert.equal(getKashfMethod('well.p188.recast1468').runtimeAllowed, false);
assert.equal(getKashfMethod('well.p188.recast1468').kashfRuntimeStatus, 'blocked-by-source');
console.log('p188 recast reachability: 65,536 original boards; 0 all-inward; maximum 3 inward-benefic; runtime blocked: PASS');
