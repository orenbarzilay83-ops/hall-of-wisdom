import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  getKashfMethod,
  validateKashfMethodRegistry,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import {
  buildKashfReadingByMethod,
  buildKashfReadingByQuestionId,
} from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import {
  resolveBestKashfAiRetrievalHit,
} from './goral-hachol/registry/kashf-ai-retrieval-index.js';

function makeBoard(overrides = {}) {
  const fallback = [
    '1111','1112','1121','1122','1211','1212','1221','1222',
    '2111','2112','2121','2122','2211','2212','2221','2222',
  ];
  const entries = fallback.map((pattern, i) => ({
    house: i + 1,
    houseNumber: i + 1,
    pattern,
    key: pattern,
    hebrew: pattern,
    hebrewName: pattern,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = {
      ...entries[idx],
      pattern,
      key: pattern,
      hebrew: `צורה-${pattern}`,
      hebrewName: `צורה-${pattern}`,
    };
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

assert.equal(validateKashfMethodRegistry().valid, true);

// p167 — exact personal intent, not generic "behind the matter".
const hiddenMethod = getKashfMethod('spiritual.p167.hiddenActionAirRows46815');
assert(hiddenMethod?.runtimeAllowed === true);
assert.match(hiddenMethod.notes || '', /querent|השואל|ورائي/);

const hiddenRoute = resolveKashfRouteByQuestionId('q-hidden-action');
assert.equal(hiddenRoute.kashfMethodId, 'spiritual.p167.hiddenActionAirRows46815');
assert.equal(hiddenRoute.canRunKashf, true);
assert.match(hiddenRoute.note || '', /querent|השואל|ورائي/);

const hiddenReading = buildKashfReadingByQuestionId(
  makeBoard({ 4:'1111', 6:'1111', 8:'1111', 15:'1211' }),
  'q-hidden-action',
  { question: 'האם יש פעולה מאחורי השואל?' }
);
assert.equal(hiddenReading.valid, true);
assert.equal(hiddenReading.canonicalExecution?.topicBundleExecuted, false);
assert.deepEqual(hiddenReading.canonicalExecution?.methodsExecuted, ['spiritual.p167.hiddenActionAirRows46815']);
const hiddenExec = hiddenReading.primaryFormula?.result?.executorResult;
assert.match(hiddenExec?.sourceText || '', /מאחוריי/);
assert.match(hiddenExec?.outputHebrew || '', /מאחורי השואל/);
assert(!String(hiddenExec?.outputHebrew || '').includes('מאחורי הדבר'));

const oldGeneric = resolveBestKashfAiRetrievalHit('האם יש פעולה מאחורי הדבר', { runnableOnly: true });
assert(
  oldGeneric.best?.kashfMethodId !== 'spiritual.p167.hiddenActionAirRows46815' || oldGeneric.resolved === false,
  'old “behind the matter” wording must not authoritatively resolve p167'
);
const exactPersonal = resolveBestKashfAiRetrievalHit('האם יש פעולה מאחורי השואל', { runnableOnly: true });
assert.equal(exactPersonal.resolved, true);
assert.equal(exactPersonal.best?.kashfMethodId, 'spiritual.p167.hiddenActionAirRows46815');

// House-1 source methods are distinct intents and fail closed until individually ready.
const connection = getKashfMethod('connection.p166-167.initiatorAndDegree');
assert.equal(connection.runtimeAllowed, false);
assert.equal(connection.kashfIntentId, 'connection.specificPerson.initiatorAndDegree');

const location = getKashfMethod('need.p168-169.locationNameColorBalanceWalk');
assert.equal(location.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(location.runtimeAllowed, false);

const validity = getKashfMethod('matter.p169.validityH6H8Planet');
assert.equal(validity.kashfRuntimeStatus, 'repair-required');
assert.equal(validity.runtimeAllowed, false);
assert.match(validity.notes || '', /Mercury|عطارد/);

const need = getKashfMethod('need.p169-170.outcomeRules');
assert.equal(need.kashfRuntimeStatus, 'repair-required');
assert.equal(need.runtimeAllowed, false);

const p170Gaze = getKashfMethod('attention.p170.mutualGazeFireRows1713');
assert.equal(p170Gaze.kashfRuntimeStatus, 'repair-required');
assert.equal(p170Gaze.runtimeAllowed, false);

// The live selected love-attention question stays on p204, never p170.
const loveAttentionRoute = resolveKashfRouteByQuestionId('q-who-looks-love');
assert.equal(loveAttentionRoute.kashfMethodId, 'love.p204.attentionFireRows1713');
assert.notEqual(loveAttentionRoute.kashfMethodId, p170Gaze.kashfMethodId);

// External istikhara is knowledge only and cannot execute even by direct method id.
const istikhara = getKashfMethod('decision.external.p170-172.istikharaFigureTable');
assert.equal(istikhara.methodRole, 'external-tradition');
assert.equal(istikhara.kashfRuntimeStatus, 'educational-only');
assert.equal(istikhara.runtimeAllowed, false);
assert.notEqual(istikhara.attributedSourceBook, 'Kashf');

const blockedIstikhara = buildKashfReadingByMethod(
  makeBoard(),
  'decision.external.p170-172.istikharaFigureTable',
  { question: 'אסתכארה' }
);
assert.equal(blockedIstikhara.valid, false);
assert.equal(blockedIstikhara.canRunKashf, false);
assert.equal(blockedIstikhara.reason, 'attributed-reference-only');

// P0-G: Question Bank visible Kashf path must now use canonical question routing.
const html = fs.readFileSync('./goral-hachol.html', 'utf8');
const app = fs.readFileSync('./goral-hachol/ui/goral-app.js', 'utf8');
assert(html.includes("import('./goral-hachol/engine/kashf-canonical-reading-engine.js')"));
assert(html.includes("import('./goral-hachol/engine/kashf-canonical-narrative-writer.js')"));
assert(html.includes('buildKashfReadingByQuestionId: canonicalReadingMod.buildKashfReadingByQuestionId'));
assert(html.includes('writeCanonicalKashfReading: canonicalNarrativeMod.writeCanonicalKashfReading'));
assert(app.includes('const hasCanonicalQuestion = Boolean(selectedQuestion?.id)'));
assert(app.includes('window.KASHF_ENGINE.buildKashfReadingByQuestionId('));
assert(app.includes('selectedQuestion.id'));
assert(app.includes('window.KASHF_ENGINE.writeCanonicalKashfReading(kashfReading)'));

// Legacy topic mode is allowed only as the no-question compatibility branch.
assert(app.includes(': window.KASHF_ENGINE.buildKashfReading(kashfBoard, kashfTopicId, clientCtx)'));

console.log('Batch 16 House-1 intent separation: PASS');
console.log('p167 personal hidden-action scope: PASS');
console.log('p168-170 blocked/repair-required boundaries: PASS');
console.log('external p170-172 istikhara isolation: PASS');
console.log('Question Bank visible output canonical cutover: PASS');
