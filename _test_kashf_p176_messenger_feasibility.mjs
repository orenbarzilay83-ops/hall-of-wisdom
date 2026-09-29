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
let allPureMalefic = 0;

for (const a of patterns) for (const b of patterns) for (const c of patterns) for (const d of patterns) {
  const sourceBoard = buildRamlBoardFromMothers([a, b, c, d]);
  const sourceSnapshot = sourceBoard.entries.map((entry) => entry.pattern);
  const recastMothers = sourceHouses.map((house) => sourceBoard.entries[house - 1].pattern);
  const derivedBoard = buildRamlBoardFromMothers(recastMothers);
  const qualities = derivedHouses.map((house) =>
    classifyCanonicalFigure(derivedBoard.entries[house - 1].pattern).saadNahs
  );
  const pureBeneficCount = qualities.filter((quality) => quality === 'saad').length;
  boardsChecked++;
  if (pureBeneficCount === 5) allPureBenefic++;
  if (qualities.every((quality) => quality === 'nahs')) allPureMalefic++;
  maxPureBenefic = Math.max(maxPureBenefic, pureBeneficCount);
  assert.deepEqual(sourceBoard.entries.map((entry) => entry.pattern), sourceSnapshot);
}

assert.equal(boardsChecked, 65536);
assert.equal(allPureBenefic, 0);
assert.equal(maxPureBenefic, 4);
assert.equal(allPureMalefic, 480);

const negativeBoard = buildRamlBoardFromMothers(['1112', '1111', '1111', '1211']);
const sourceSnapshot = negativeBoard.entries.map((entry) => entry.pattern);
const negative = buildKashfReadingByQuestionId(negativeBoard, 'q-message');
assert.equal(negative.valid, true);
assert.equal(negative.overallPositive, false);
assert.equal(negative.primaryFormula.result.executorResult.sourceOutcome, 'request-not-fulfilled');
assert.deepEqual(negative.primaryFormula.result.executorResult.recastMotherPatterns, ['1112', '1211', '1111', '2221']);
assert.deepEqual(negative.primaryFormula.result.executorResult.recastConditionHouses, derivedHouses);
assert.deepEqual(negativeBoard.entries.map((entry) => entry.pattern), sourceSnapshot);

const unresolvedBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const unresolved = buildKashfReadingByQuestionId(unresolvedBoard, 'q-message');
assert.equal(unresolved.valid, true);
assert.equal(unresolved.overallPositive, null);
assert.equal(unresolved.primaryFormula.result.executorResult.sourceOutcome, 'unresolved');
assert.doesNotMatch(unresolved.verdict.text, /הבקשה תיענה\./);

const news = buildKashfReadingByQuestionId(negativeBoard, 'q-news-arrive');
assert.equal(news.valid, false);
assert.equal(news.reason, 'unsupported');

console.log(`Kashf p176 recast: ${boardsChecked} boards, ${allPureBenefic} all-pure-benefic, ${allPureMalefic} all-pure-malefic; only the negative branch runs: PASS`);
