import fs from 'node:fs';
import assert from 'node:assert/strict';
import { KASHF_BOOK_RULE_CATALOG, KASHF_BOOK_RULE_CATALOG_VERSION } from './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';

const rule = KASHF_BOOK_RULE_CATALOG.find((item) => item.ruleKey === 'kashf-p101-witness-scheme-extended');
assert(rule, 'p101 extended witness rule must exist');
assert.equal(KASHF_BOOK_RULE_CATALOG_VERSION, 'kashf-book-rule-catalog-v4');
assert.deepEqual(rule.requiredHouses, [5, 9, 13, 14, 15, 16]);
assert.match(rule.calculationType, /5→\[3,7,11\]/);
assert.doesNotMatch(rule.calculationType, /15→\[3,6,7,11\]/);
assert.equal(rule.implementationStatus, 'missing');
assert.equal(rule.applicabilityStatus, 'unresolved');
assert.equal(rule.resolutionStatus, 'unresolvedSourceRelationship');

const paths = [
  'goral-hachol/data/sources/kashf-al-asrar/kashf-al-asrar-book.js',
  'kashf-al-asrar.html',
];
for (const path of paths) {
  const text = fs.readFileSync(path, 'utf8');
  assert.match(text, /הצורה החמישית מעידה על השלישי, על השביעי ועל האחד־עשר/);
  assert.doesNotMatch(text, /הצורה החמישה־עשר מעידה על השלישי, על השישי, על השביעי ועל האחד־עשר/);
}

const audit = fs.readFileSync('HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md', 'utf8');
assert.match(audit, /5→\[3,7,11\]/);
assert.match(audit, /הקריאה הישנה 15→\[3,6,7,11\] הייתה שגיאת תמלול/);

const indexHtml = fs.readFileSync('kashf-v57-ai-master-index.html', 'utf8');
const jsonMatch = indexHtml.match(/<script id="kashf-ai-master-index-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
assert(jsonMatch, 'embedded Master Index JSON must exist');
const index = JSON.parse(jsonMatch[1]);
const queueItem = index.downstreamCorrectionQueue.find((item) => item.id === 'B04-DATA-WITNESS-NUMERAL');
assert.equal(queueItem?.status, 'RESOLVED');
assert.match(queueItem?.resolution || '', /5→\[3,7,11\]/);

console.log('DS-04 PASS: p101 uses figure 5 → H3/H7/H11, remains isolated from the p53 runtime scheme.');
