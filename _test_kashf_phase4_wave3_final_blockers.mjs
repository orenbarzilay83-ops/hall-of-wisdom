import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');

const indexHtml = read('./kashf-v57-ai-master-index.html');
const router = read('./goral-hachol/engine/kashf-question-router.js');
const engine = read('./goral-hachol/engine/kashf-reading-engine.js');
const narrative = read('./goral-hachol/engine/kashf-narrative-writer.js');
const rules = read('./goral-hachol/engine/kashf-topic-rules.js');
const leshon = read('./goral-hachol/engine/kashf-leshon-hainyan.js');
const workplan = read('./WORKPLAN.md');

const m = indexHtml.match(/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(m, 'Master Index JSON missing');
const data = JSON.parse(m[1]);

const blockers = [
  'B05-P112-LISAN-STRUCTURE',
  'B12-P177-RELATIVE-THIRTEENTH-BLOCKED',
  'B12-P178-LIFESPAN-COMPUTATION-BLOCKED',
  'B12-P179-DEBT-WALKING-BLOCKED',
  'B13-P180-ELEMENT-AMOUNT-BLOCKED',
  'B13-P181-OTHER-BOOK-REMAINDER-BLOCKED',
  'B14-P185-RECURSIVE-QUARTERS-BLOCKED',
  'B14-P187-KIND-DIRECTION-BLOCKED',
  'B14-P188-190-DEPTH-METHODS-BLOCKED',
];

const queue = data.downstreamCorrectionQueue;
assert.equal(queue.length, 46);
assert.equal(queue.filter((x) => x.status === 'RESOLVED').length, 37, '46 queue total includes earlier resolved items');
const unresolved = queue.filter((x) => x.status !== 'RESOLVED');
assert.equal(unresolved.length, 9);
assert.deepEqual(unresolved.map((x) => x.id), blockers);

for (const id of blockers) {
  const item = queue.find((x) => x.id === id);
  assert.ok(item.wave3Processed, id + ' missing wave3Processed');
  assert.equal(item.finalDisposition, 'PROCESSED_BLOCKED_OR_DEFERRED');
  assert.equal(item.runtimeEligible, false);
  assert.ok(item.blockerType);
  assert.ok(item.resolution);
  assert.ok(item.unlockCriteria);
}
assert.equal(queue.find((x) => x.id === 'B05-P112-LISAN-STRUCTURE').status, 'DEFERRED_UNTIL_ALGORITHM_VERIFIED');
assert.equal(unresolved.filter((x) => x.status === 'BLOCKED').length, 8);

assert.match(leshon, /runtimeEligible: false/);
assert.match(leshon, /DEFERRED_UNTIL_ALGORITHM_VERIFIED/);
assert.doesNotMatch(leshon, /computeDhamirByMajority/);
assert.doesNotMatch(leshon, /SHIBUTZ_2_MONEY_BY_HOUSE/);

assert.match(engine, /if \(check\.runtimeEligible === false\)/);
assert.match(narrative, /f\.error \|\| f\.blocked \|\| f\.runtimeEligible === false/);

for (const id of ['life-years', 'money-source-total', 'money-magnitude', 'hidden-depth', 'well-drilling']) {
  const re = new RegExp("id: '" + id + "'[\\s\\S]{0,260}?runtimeEligible: false");
  assert.match(rules, re, id + ' must be non-runtime');
}
assert.match(router, /'q-money-source'[\s\S]{0,380}?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-lifespan-remaining'[\s\S]{0,380}?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-debts'[\s\S]{0,380}?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-well-drilling'[\s\S]{0,380}?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-dig-direction'[\s\S]{0,380}?routeStatus: 'BLOCKED'/);

const p179 = data.records.find((x) => x.entryId === 'gate6.house2.p179.creditor-debtor-money-movement');
assert.ok(p179.criticalFacts.some((x) => x.includes('السابع والتاسع عشر')));
assert.ok(p179.doNotInfer.some((x) => x.includes('H9')));

const p185 = data.records.find((x) => x.entryId === 'gate6.house4.p185.hidden-place-recursive-quarters');
assert.ok(p185.criticalFacts.some((x) => x.includes('1=מערב') && x.includes('2=מזרח')));
assert.equal(p185.branches.find((x) => x.condition === 'remainder-1')?.outcome, 'west-quarter');
assert.equal(p185.branches.find((x) => x.condition === 'remainder-2')?.outcome, 'east-quarter');
assert.ok(p185.sourceDiscrepancies.some((x) => x.includes('94')));

const p190 = data.records.find((x) => x.entryId === 'gate6.house4.p189-190.tamtam-water-depth-table');
assert.ok(p190.criticalFacts.some((x) => x.includes('H1+H12')));
assert.ok(p190.criticalFacts.some((x) => x.includes('ثم أخرج من الثاني عشر في الثاني عشر في الثاني عشر')));
assert.ok(p190.doNotInfer.some((x) => x.includes('H12+H9')));

assert.match(workplan, /32\/32/);
assert.match(workplan, /23 RESOLVED \+ 8 BLOCKED \+ 1 DEFERRED_UNTIL_ALGORITHM_VERIFIED/);

console.log('Wave 3 final blocker assertions: PASS');
