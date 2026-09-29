import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';

const cases = [
  { id: 'PV-P257-MOTHER-NIGHT-ANGLE', mothers: ['1111', '1111', '1112', '1212'], positive: true, expected: 'לטוב ולתיקון' },
  { id: 'PV-P257-MOTHER-NIGHT-FALLING', mothers: ['1112', '1112', '1111', '2121'], positive: false, expected: 'לצרות' },
  { id: 'PV-P257-MOTHER-NIGHT-CONFLICT', mothers: ['1111', '1111', '1111', '1111'], positive: null, expected: 'אינו נותן כלל קדימות' },
  { id: 'PV-P257-MOTHER-NIGHT-NO-MATCH', mothers: ['1112', '1112', '1112', '2222'], positive: null, expected: 'אינו נותן פסק' },
];
for (const item of cases) {
  const board = buildRamlBoardFromMothers(item.mothers);
  const reading = buildKashfReadingByQuestionId(board, 'q-mother', { dynFields: { motherCastPeriod: 'לילה' } });
  const result = reading.primaryFormula.result.executorResult;
  assert.equal(reading.valid, true, item.id);
  assert.equal(reading.overallPositive, item.positive, item.id);
  assert.match(result.outputHebrew, new RegExp(item.expected), item.id);
  assert(!result.outputHebrew.includes('מצב בריאותה'), item.id);
}
const board = buildRamlBoardFromMothers(cases[0].mothers);
for (const period of ['יום', undefined]) {
  const reading = buildKashfReadingByQuestionId(board, 'q-mother', { dynFields: { motherCastPeriod: period } });
  assert.equal(reading.overallPositive, null);
  assert.equal(reading.primaryFormula.result.executorResult.signals.length, 0);
  assert.match(reading.verdict.text, /ענף היום אינו מוכרע/);
}
const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-mother', board, clientContext: { dynFields: { motherCastPeriod: 'לילה' } } });
assert.equal(bridge.professionalVerdictSafety?.clientFacingCertified, true);
assert.equal(bridge.professionalVerdictSafety?.authoritativePolarity, 'positive');
console.log('Kashf mother p257 night placement: PASS');
