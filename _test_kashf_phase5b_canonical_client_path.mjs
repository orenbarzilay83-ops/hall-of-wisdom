import fs from 'node:fs';
import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { writeCanonicalKashfReading } from './goral-hachol/engine/kashf-canonical-narrative-writer.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const html = read('./goral-hachol.html');
const app = read('./goral-hachol/ui/goral-app.js');

// Browser wiring: both canonical modules must be exposed through KASHF_ENGINE.
assert.match(html, /import\('\.\/goral-hachol\/engine\/kashf-canonical-reading-engine\.js'\)/);
assert.match(html, /import\('\.\/goral-hachol\/engine\/kashf-canonical-narrative-writer\.js'\)/);
assert.match(html, /buildKashfReadingByQuestionId:\s*canonicalReadingMod\.buildKashfReadingByQuestionId/);
assert.match(html, /writeCanonicalKashfReading:\s*canonicalNarrativeMod\.writeCanonicalKashfReading/);

// Client routing invariant: an explicit Question ID is authoritative.
const selectedIndex = app.indexOf('if (selectedQuestion?.id)');
const elseIndex = app.indexOf('} else {', selectedIndex);
const boardIndex = app.indexOf('window.KASHF_ENGINE.buildRamlBoardFromMothers(', selectedIndex);
const canonicalIndex = app.indexOf('window.KASHF_ENGINE.buildKashfReadingByQuestionId(', selectedIndex);
const writerIndex = app.indexOf('window.KASHF_ENGINE.writeCanonicalKashfReading(', selectedIndex);
const legacyIndex = app.indexOf('window.KASHF_ENGINE.buildKashfReading(kashfBoard, kashfTopicId, clientCtx)', selectedIndex);

assert.ok(selectedIndex >= 0, 'selected Question-ID branch missing');
assert.ok(elseIndex > selectedIndex, 'explicit free-topic else branch missing');
assert.ok(boardIndex > selectedIndex && boardIndex < elseIndex, 'canonical board must be rebuilt from the four mothers');
assert.ok(canonicalIndex > selectedIndex && canonicalIndex < elseIndex, 'selected Question ID must use canonical reader');
assert.ok(writerIndex > selectedIndex && writerIndex < elseIndex, 'selected Question ID must use canonical writer');
assert.ok(legacyIndex > elseIndex, 'legacy broad topic reader must never run inside selected Question-ID branch');
assert.match(app.slice(selectedIndex, elseIndex), /selectedMothers\.map\(\(mother\) => mother\.key\)/);

// Runtime proof with the same four-mother board used by canonical QA.
const board = buildRamlBoardFromMothers(['2222', '2211', '2121', '2221']);

for (const questionId of ['q-message', 'q-news-arrive', 'q-well-drilling', 'q-inheritance']) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.canRunKashf, true, questionId + ' should remain runnable after Phase 5B wiring');

  const reading = buildKashfReadingByQuestionId(board, questionId, {
    name: 'לקוח בדיקה',
    question: questionId,
  });
  assert.equal(reading.valid, true, questionId + ' must produce canonical client reading');
  assert.equal(reading.canonicalExecution?.topicBundleExecuted, false, questionId + ' must not execute broad topic bundle');
  assert.deepEqual(reading.canonicalExecution?.methodsExecuted, [route.kashfMethodId]);

  const rendered = writeCanonicalKashfReading(reading);
  assert.match(rendered, /canonical-kashf-reading/);
  assert.ok(rendered.includes(route.kashfMethodId), questionId + ' rendered output must expose the selected canonical method');
}

for (const [questionId, status] of Object.entries({
  'q-lifespan': 'blocked-by-source',
  'q-lifespan-remaining': 'blocked-by-source',
  'q-mother': 'blocked-by-source',
  'q-dig-direction': 'repair-required',
})) {
  const reading = buildKashfReadingByQuestionId(board, questionId, { question: questionId });
  assert.equal(reading.valid, false, questionId + ' must remain fail-closed');
  assert.equal(reading.kashfRuntimeStatus, status);
  const rendered = writeCanonicalKashfReading(reading);
  assert.match(rendered, /canonical-kashf-reading blocked/);
  assert.doesNotMatch(rendered, /השיטה הקנונית:/, 'blocked output must not masquerade as an executed canonical method');
}

console.log('Phase 5B canonical client-path assertions: PASS');
