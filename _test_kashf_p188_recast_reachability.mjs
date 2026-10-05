import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { classifyCanonicalFigure } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';
import { getDakhalKharij, getSaadNahs } from './goral-hachol/engine/kashf-figure-classifier.js';
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

// ── Re-investigated 2026-10-05: WHY is the count exactly 0, not just "0"? ──
// Three further facts, each independently verified, explain the result
// mathematically instead of leaving it as an unexplained zero.

// Fact 1: the condition itself is not a logical impossibility. On a board
// built from 4 FREELY CHOSEN mothers, houses {1,4,7,10} are simultaneously
// dakhil-and-benefic in exactly 64 of 65,536 cases.
let freeTargetCount = 0;
const freeTargetTuples = new Set();
for (const a of patterns)
  for (const b of patterns)
    for (const c of patterns)
      for (const d of patterns) {
        const board = buildRamlBoardFromMothers([a, b, c, d]);
        const figs = [1, 4, 7, 10].map(h => board.entries[h - 1].pattern);
        const allDakhilBenefic = figs.every(p => getDakhalKharij(p) === 'dakhil' && getSaadNahs(p) === 'saad');
        if (allDakhilBenefic) {
          freeTargetCount++;
          freeTargetTuples.add([a, b, c, d].join(','));
        }
      }
assert.equal(freeTargetCount, 64, 'the all-dakhil-benefic Awtad condition is achievable for 64 of 65,536 freely-chosen mother tuples — not a logical impossibility');

// Fact 2: when the 4 "new mothers" are instead H1/H4/H6/H8 of an EXISTING
// board, H6 and H8 are not free — they are derived from the original 4
// mothers — so the reachable (H1,H4,H6,H8) tuple space is a strict subset.
const reachableTuples = new Set();
for (const a of patterns)
  for (const b of patterns)
    for (const c of patterns)
      for (const d of patterns) {
        const original = buildRamlBoardFromMothers([a, b, c, d]);
        const tuple = [1, 4, 6, 8].map(h => original.entries[h - 1].pattern).join(',');
        reachableTuples.add(tuple);
      }
assert.equal(reachableTuples.size, 4096, 'only 4,096 of the 65,536 possible (H1,H4,H6,H8) tuples are reachable from some original board (1/16) — H6 and H8 are derived, not free');

// Fact 3: the exhaustive intersection of facts 1 and 2 is empty — this is
// the precise, fully-explained reason behind "0 all-inward-benefic" above:
// the recast-from-existing-board construction structurally excludes every
// tuple that would satisfy its own stated success condition, even though
// that condition is independently achievable for freely-chosen mothers.
let overlap = 0;
for (const tuple of freeTargetTuples) {
  if (reachableTuples.has(tuple)) overlap++;
}
assert.equal(overlap, 0, 'none of the 64 target tuples are among the 4,096 reachable tuples — a confirmed, exhaustively-verified mathematical fact, not an unexplained zero');

console.log('p188 recast — precise explanation: 64/65536 target tuples exist in the abstract, 4096/65536 tuples are reachable via H1/H4/H6/H8 recast, 0 overlap: PASS');
