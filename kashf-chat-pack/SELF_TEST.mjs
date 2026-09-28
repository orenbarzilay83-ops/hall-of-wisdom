import assert from 'node:assert/strict';
import fs from 'node:fs';
import { runKashfPack } from './run.mjs';

const cases = JSON.parse(fs.readFileSync(new URL('./GOLDEN_CASES.json', import.meta.url), 'utf8')).cases;
for (const item of cases) {
  const result = runKashfPack({ mothers: item.mothers, questionId: item.questionId });
  assert.equal(result.status, 'ok', item.id);
  assert.equal(result.methodId, item.methodId, item.id);
  for (const [key, expected] of Object.entries(item.expected)) {
    assert.equal(result.methodResult?.executorResult?.[key], expected, `${item.id}: ${key}`);
  }
}

// Constructed arithmetic fixture from the printed counting method (Qawl p36)
// and remainder rule (p58). It is not a worked example printed by the author.
const qawl = runKashfPack({ mothers: ['1111', '1121', '2212', '1221'], questionId: 'q-jinn-type' });
assert.equal(qawl.status, 'ok');
assert.equal(qawl.sourceVolume, 'al-qawl-al-jami');
assert.deepEqual(qawl.houses.map(h => h.pattern), [
  '1111', '1121', '2212', '1221', '1121', '1122', '1212', '1121',
  '2212', '1211', '2221', '2111', '1221', '2112', '1111', '2222',
]);
assert.equal(qawl.openCount, 36);
assert.equal(qawl.remainder, 1);
assert.equal(qawl.jinnTypeEvidence?.id, 'air-figure-flying-jinn');
assert.equal(qawl.verdict, null);
assert.equal(qawl.clientAnswerDraft, null);

for (const questionId of ['q-sorcerer', 'q-obsession', 'q-lifespan']) {
  assert.equal(runKashfPack({ mothers: ['1111', '1121', '2212', '1221'], questionId }).status,
    'blocked', questionId);
}
console.log('SELF_TEST PASS: 4 printed Kashf fixtures, constructed Qawl arithmetic, source attribution and 3 blocked routes.');
