import fs from 'node:fs';
import assert from 'node:assert/strict';
import {
  SHIBUTZ_2_CANONICAL_NUMBER,
  SHIBUTZ_2_MONEY_BY_HOUSE,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js';

// 1-3: p111 money table corrected values
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[7].value, 29, 'p111 H7 must be 29');
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[11].altValue, 600, 'p111 H11 alternate must be 600');
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[12].altValue, 700, 'p111 H12 alternate must be 700');

// 4: p106 canonical position 7 stays 28, untouched
const p106Pos7 = SHIBUTZ_2_CANONICAL_NUMBER.find((f) => f.position === 7);
assert(p106Pos7, 'p106 canonical position 7 entry must exist');
assert.equal(p106Pos7.number, 28, 'p106 canonical position 7 number must remain 28');
assert.equal(p106Pos7.pattern, '2122', 'p106 canonical position 7 pattern must remain אדום/2122');

// 5: p106 table and p111 table are separate exports, not merged
assert.notEqual(SHIBUTZ_2_CANONICAL_NUMBER, SHIBUTZ_2_MONEY_BY_HOUSE);
assert(Array.isArray(SHIBUTZ_2_CANONICAL_NUMBER), 'SHIBUTZ_2_CANONICAL_NUMBER must remain an array (p106 shape)');
assert(
  !Array.isArray(SHIBUTZ_2_MONEY_BY_HOUSE) && typeof SHIBUTZ_2_MONEY_BY_HOUSE === 'object',
  'SHIBUTZ_2_MONEY_BY_HOUSE must remain a house-indexed object (p111 shape)'
);

// Master Index embedded JSON
const indexHtml = fs.readFileSync('kashf-v57-ai-master-index.html', 'utf8');
const jsonMatch = indexHtml.match(/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
assert(jsonMatch, 'embedded Master Index JSON must exist');
const index = JSON.parse(jsonMatch[1]);

// 6: p111 record VERIFIED
const p111Record = index.records.find((r) => r.entryId === 'shibutz.p111.money-number-table');
assert(p111Record, 'shibutz.p111.money-number-table record must exist');
assert.equal(p111Record.verificationStatus, 'VERIFIED');
assert.deepEqual(p111Record.sourceDiscrepancies, []);

// 7: B05-DATA-P111-MONEY-TABLE resolved
const moneyQueueItem = index.downstreamCorrectionQueue.find((q) => q.id === 'B05-DATA-P111-MONEY-TABLE');
assert(moneyQueueItem, 'B05-DATA-P111-MONEY-TABLE queue item must exist');
assert.equal(moneyQueueItem.status, 'RESOLVED');
assert.match(moneyQueueItem.resolution || '', /29/);
assert.match(moneyQueueItem.resolution || '', /600/);
assert.match(moneyQueueItem.resolution || '', /700/);
assert.match(moneyQueueItem.resolution || '', /28/);

// 8: p112 record stays non-runtime
const p112Record = index.records.find((r) => r.entryId === 'shibutz.p112.lisan-al-amr');
assert(p112Record, 'shibutz.p112.lisan-al-amr record must exist');
assert.equal(p112Record.runtimeEligible, false);

// 9: B05-P112-LISAN-STRUCTURE deferred (not resolved)
const lisanQueueItem = index.downstreamCorrectionQueue.find((q) => q.id === 'B05-P112-LISAN-STRUCTURE');
assert(lisanQueueItem, 'B05-P112-LISAN-STRUCTURE queue item must exist');
assert.equal(lisanQueueItem.status, 'DEFERRED_UNTIL_ALGORITHM_VERIFIED');
assert.notEqual(lisanQueueItem.status, 'RESOLVED');

// no runtimeEligible:true anywhere in the Master Index
(function assertNoRuntimeEligibleTrue(node) {
  if (node && typeof node === 'object') {
    if (node.runtimeEligible === true) {
      throw new Error('runtimeEligible:true found in Master Index — forbidden');
    }
    for (const key of Object.keys(node)) assertNoRuntimeEligibleTrue(node[key]);
  }
})(index);

// no duplicate queue ids, all sourceEntryId references resolvable
const queueIds = index.downstreamCorrectionQueue.map((q) => q.id);
assert.equal(new Set(queueIds).size, queueIds.length, 'downstreamCorrectionQueue must have no duplicate ids');
const recordEntryIds = new Set(index.records.map((r) => r.entryId));
for (const q of index.downstreamCorrectionQueue) {
  if (q.sourceEntryId) {
    assert(recordEntryIds.has(q.sourceEntryId), `sourceEntryId ${q.sourceEntryId} must reference an existing record`);
  }
}

// record count unchanged (272) — DS-05 only edits fields, adds/removes no records
assert.equal(index.records.length, 272, 'Master Index record count must remain 272');

// 10: Registry still marks kashf-leshon-hainyan as disconnected orphan
const registryText = fs.readFileSync('goral-hachol/registry/hall-wisdom-engine-registry.js', 'utf8');
const registryBlockMatch = registryText.match(/id:\s*'kashf-leshon-hainyan'[\s\S]*?\}\),/);
assert(registryBlockMatch, 'kashf-leshon-hainyan registry entry must exist');
const registryBlock = registryBlockMatch[0];
assert.match(registryBlock, /executionStatus:\s*'disconnected-orphan'/);
assert.match(registryBlock, /runtimeRole:\s*'disconnected'/);
assert.match(registryBlock, /productionStatus:\s*'blocked'/);

// 11: no active importer of computeLeshonHainyan outside the module itself,
// the registry snapshot, and this test/report file
const candidateDirs = ['goral-hachol/engine', 'goral-hachol/ui', 'goral-hachol/brain'];
const importPattern = /kashf-leshon-hainyan/;
const offenders = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) {
      if (full === 'goral-hachol/engine/kashf-leshon-hainyan.js') continue;
      const text = fs.readFileSync(full, 'utf8');
      if (importPattern.test(text)) offenders.push(full);
    }
  }
}
walk('goral-hachol/engine');
walk('goral-hachol/ui');
walk('goral-hachol/brain');
assert.deepEqual(offenders, [], `no active engine/ui/brain file may import kashf-leshon-hainyan.js, found: ${offenders.join(', ')}`);

// 12/13: forbidden triplicity constant and misleading past grouping not added
const shibutzimText = fs.readFileSync('goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js', 'utf8');
assert.doesNotMatch(shibutzimText, /KASHF_P112_HOUSE_TRIPLICITY_GROUPS/, 'forbidden constant must not be added');
assert.doesNotMatch(shibutzimText, /past:\s*\[\s*3,\s*6,\s*9,\s*12\s*\]/, 'misleading past:[3,6,9,12] grouping must not be added');
assert.doesNotMatch(indexHtml, /KASHF_P112_HOUSE_TRIPLICITY_GROUPS/, 'forbidden constant must not appear in Master Index');

console.log('DS-05 PASS: p111 money table corrected (H7=29, H11 alt=600, H12 alt=700); p106 untouched (position 7=28); p112 stays non-operational (runtimeEligible=false, DEFERRED_UNTIL_ALGORITHM_VERIFIED); kashf-leshon-hainyan.js remains a disconnected orphan.');
