// Kashf printed p265, PDF p267: feasibility of the two state-continuity
// clauses under the current canonical pure-benefic classification. Only the
// first clause is enabled; the second is not source-closed operationally.
import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { classifyCanonicalFigure } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';

const patterns = Array.from({ length: 16 }, (_, n) =>
  n.toString(2).padStart(4, '0').split('').map(bit => bit === '0' ? '1' : '2').join(''));
let fourBenefic = 0;
let beneficH1RepeatedH15 = 0;
let firstClauseComplete = 0;

for (const a of patterns) for (const b of patterns)
  for (const c of patterns) for (const d of patterns) {
    const entries = buildRamlBoardFromMothers([a, b, c, d]).entries;
    const at = house => entries[house - 1].pattern;
    const benefic = house => classifyCanonicalFigure(at(house)).saadNahs === 'saad';
    if ([1, 2, 9, 15].every(benefic)) fourBenefic++;
    if (benefic(1) && at(1) === at(15)) {
      beneficH1RepeatedH15++;
      if ([2, 4, 5, 7, 8, 10, 11].some(house => at(house) === at(1))) firstClauseComplete++;
    }
  }

assert.equal(fourBenefic, 0, 'Do not wire the second clause as four pure benefics: it is unreachable');
assert.equal(beneficH1RepeatedH15, 1536, 'First clause also requires presence in happy houses');
assert.equal(firstClauseComplete, 569, 'The first clause requires a second occurrence in a source-defined fortunate house');
console.log('Kashf p265 reachability PASS: 65,536 boards; four pure benefics 0; H1/H15 1,536; full first clause 569');
