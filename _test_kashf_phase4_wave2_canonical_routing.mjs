import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const router = read('./goral-hachol/engine/kashf-question-router.js');
const engine = read('./goral-hachol/engine/kashf-reading-engine.js');
const ui = read('./goral-hachol/ui/goral-app.js');
const rules = read('./goral-hachol/engine/kashf-topic-rules.js');
const pending = read('./goral-hachol/engine/kashf-pending-extraction.js');
const indexHtml = read('./kashf-v57-ai-master-index.html');

assert.match(ui, /questionId:\s+selectedQuestion\?\.id \|\| null/);
assert.match(engine, /resolveKashfQuestionRoute/);
assert.match(engine, /filterSupportingChecksForRoute/);
assert.match(engine, /questionRoute\?\.routeStatus === 'BLOCKED'/);
assert.match(engine, /if \(runPrimaryForRoute\)/);
assert.match(engine, /rules\.altFormula && runAltForRoute/);
assert.match(engine, /routedSupportingChecks\.map/);

assert.match(router, /'q-money-source'[\s\S]*?supportingCheckIds: \['money-source-total'\]/);
assert.match(router, /'q-livelihood'[\s\S]*?supportingCheckIds: \['livelihood-house', 'parnasa-source'\]/);
assert.match(router, /'q-stay-place'[\s\S]*?supportingCheckIds: \['current-place'\]/);
assert.match(router, /'q-best-city'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-dig-direction'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-well-drilling'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-father'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-secrets'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-lifespan-remaining'[\s\S]*?routeStatus: 'BLOCKED'/);
assert.match(router, /'q-debts'[\s\S]*?routeStatus: 'BLOCKED'/);

for (const fn of [
  'computePregnancyConfirmationKashf',
  'computePregnancyGenderKashf',
  'computePregnancyMiscarriageRiskKashf',
  'computePregnancyBirthEaseKashf',
  'computeChildHealthKashf',
  'computeChildWelfareKashf',
]) {
  assert.match(pending, new RegExp('export function ' + fn + '\\('));
  assert.match(engine, new RegExp(fn));
  assert.match(rules, new RegExp(fn));
}
assert.match(router, /'q-pregnancy'[\s\S]*?pregnancy-confirmation-exact/);
assert.match(router, /'q-gender'[\s\S]*?pregnancy-gender-exact/);
assert.match(router, /'q-miscarriage'[\s\S]*?pregnancy-miscarriage-exact/);
assert.match(router, /'q-birth-ease'[\s\S]*?pregnancy-birth-ease-exact/);
assert.match(router, /'q-child-health'[\s\S]*?child-health-exact/);
assert.match(router, /'q-child-lifespan'[\s\S]*?child-welfare-exact/);
assert.doesNotMatch(router, /'q-(?:pregnancy|gender|miscarriage|birth-ease|child-health)'[\s\S]{0,260}?pregnancy-detailed/);

const m = indexHtml.match(/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(m, 'Master Index JSON missing');
const data = JSON.parse(m[1]);
const wave2 = [
  'B10-PROXIMITY-NO-RUNTIME-WITHOUT-DEFINITION',
  'B11-HOUSE1-INTENT-ROUTING-DEFERRED',
  'B11-P168-169-LOCATION-PROCEDURE-BLOCKED',
  'B11-P170-171-ALTERNATE-ISTIKHARA-NO-RUNTIME',
  'B12-HOUSE1-P172-178-INTENT-ROUTING-DEFERRED',
  'B12-P176-SUBBOARD-RECAST-NO-RUNTIME',
  'B13-HOUSE2-ONE-PRIMARY-MONEY-ROUTE',
  'B13-HOUSE3-RELOCATION-ROUTING-DEFERRED',
  'B13-P184-PROPERTY-MAP-NO-RUNTIME',
  'B14-HIDDEN-LOCATION-NO-MULTIMETHOD',
  'B14-HOUSE5-PREGNANCY-ROUTING-DEFERRED',
  'B15-P192-INTENT-SEPARATION',
  'B15-P194-CHILD-HEALTH-ROUTING',
  'B15-P196-ILLNESS-CHAPTER-OPENING',
];
for (const id of wave2) {
  const item = data.downstreamCorrectionQueue.find((x) => x.id === id);
  assert.ok(item, id + ' missing');
  assert.equal(item.status, 'RESOLVED', id + ' not resolved');
}
const unresolved = data.downstreamCorrectionQueue.filter((x) => x.status !== 'RESOLVED');
assert.equal(unresolved.length, 9, 'Wave 3 must contain exactly 9 unresolved items');

console.log('Wave 2 canonical routing assertions: PASS');
