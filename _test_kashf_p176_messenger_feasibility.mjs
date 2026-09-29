import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { classifyCanonicalFigure } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';

const patterns = Array.from({ length: 16 }, (_, n) => n.toString(2).padStart(4, '0')
  .split('').map((bit) => bit === '0' ? '1' : '2').join(''));
const sourceHouses = [1, 4, 5, 11];
const derivedHouses = [5, 1, 4, 7, 10];
let boardsChecked = 0;
let allPureBenefic = 0;
let maxPureBenefic = 0;

for (const a of patterns) for (const b of patterns) for (const c of patterns) for (const d of patterns) {
  const sourceBoard = buildRamlBoardFromMothers([a, b, c, d]);
  const sourceSnapshot = sourceBoard.entries.map((entry) => entry.pattern);
  const recastMothers = sourceHouses.map((house) => sourceBoard.entries[house - 1].pattern);
  const derivedBoard = buildRamlBoardFromMothers(recastMothers);
  const pureBeneficCount = derivedHouses.filter((house) =>
    classifyCanonicalFigure(derivedBoard.entries[house - 1].pattern).saadNahs === 'saad'
  ).length;
  boardsChecked++;
  if (pureBeneficCount === 5) allPureBenefic++;
  maxPureBenefic = Math.max(maxPureBenefic, pureBeneficCount);
  assert.deepEqual(sourceBoard.entries.map((entry) => entry.pattern), sourceSnapshot);
}

assert.equal(boardsChecked, 65536);
assert.equal(allPureBenefic, 0);
assert.equal(maxPureBenefic, 4);

const sample = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const messenger = buildKashfReadingByQuestionId(sample, 'q-message');
const news = buildKashfReadingByQuestionId(sample, 'q-news-arrive');
assert.equal(messenger.valid, false);
assert.equal(messenger.reason, 'repair-required');
assert.equal(news.valid, false);
assert.equal(news.reason, 'unsupported');

console.log(`Kashf p176 recast feasibility: ${boardsChecked} boards, ${allPureBenefic} all-pure-benefic, maximum ${maxPureBenefic}/5; both routes fail closed: PASS`);
