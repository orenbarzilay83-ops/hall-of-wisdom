import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');

const engine = read('./goral-hachol/engine/kashf-reading-engine.js');
const shib = read('./goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js');
const gate5 = read('./goral-hachol/data/sources/kashf-al-asrar/kashf-gate5-foundational-figures.js');
const indexHtml = read('./kashf-v57-ai-master-index.html');

assert.match(engine, /const dhamirMode = clientContext\?\.dhamirMode \|\| null;/);
assert.match(engine, /dhamirMode === 'legacy-majority-explicit'/);
assert.match(engine, /dhamirMode === 'subject-h6'/);
assert.doesNotMatch(engine, /let dhamir = null;\s*try \{\s*dhamir = computeDhamirByMajority\(board\);/);

assert.match(shib, /patterns: \['2122', '1211', '2211', '1121', '2222', '2112'\]/);
assert.match(shib, /patterns: \['2212', '1111', '1122', '2121', '2112'\]/);
assert.match(shib, /patterns: \['1221', '2221', '2111'\]/);
assert.match(shib, /patterns: \['1121', '1211', '1222'\]/);
assert.doesNotMatch(shib, /נגזר בהיקש-השלמה/);

assert.match(gate5, /sourceVerification: 'printed-p163-verified-2026-09-18'/);
assert.match(gate5, /'kharij-dakhil':[\s\S]*?בא במהירות מנסיעתו/);
assert.match(gate5, /'dakhil-kharij':[\s\S]*?יתעכב בנסיעתו זמן רב/);
assert.match(gate5, /runtimeRole: 'supporting-only'/);
assert.match(gate5, /autoRoute: false/);

const m = indexHtml.match(/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(m, 'Master Index JSON block missing');
const data = JSON.parse(m[1]);
const ids = [
  'B06-OPS-ATTRIBUTED-METHODS',
  'B06-DHAMIR-NEED-DRIVEN',
  'B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE',
  'B07-DHAMIR-NEED-DRIVEN-SELECTION',
  'B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION',
  'B09-DHAMIR-MAJORITY-RUNTIME-DISABLED',
  'B09-DHAMIR-H6-SUBJECT-ID-CANDIDATE',
  'B10-DEREKH-H13-POLARITY-DOWNSTREAM',
  'B10-SEVEN-WITNESSES-SUPPORTING-ROLE',
];
for (const id of ids) {
  const item = data.downstreamCorrectionQueue.find((x) => (x.id || x.queueId) === id);
  assert.ok(item, `missing queue item ${id}`);
  assert.equal(item.status, 'RESOLVED', `${id} not RESOLVED`);
  assert.ok(item.resolution, `${id} missing resolution`);
}

console.log('Wave 1 safety/data static assertions: PASS');
