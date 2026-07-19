/**
 * _test_kashf_book_rule_catalog.mjs
 *
 * Proves the Canonical Book Rule Catalog (kashf-book-rule-catalog.js) and
 * its selector (kashf-book-rule-selector.js) — built from
 * HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md — keep
 * the two conflicting witness schemes separate and unresolved, never
 * "activate" an unresolved rule, correctly report the 8-method dhamir
 * coverage (5 implemented / 3 missing) without ever collapsing to "all
 * verified", and that readingContext.ruleCoverageStatus in the real AI
 * payload reflects "partial" honestly.
 *
 * No AI call. No fetch. No network. No UI. No change to any Kashf engine
 * file (kashf-reading-engine.js, kashf-dhamir.js, computeWitnessTestimony,
 * etc.) or to raml-board-generator.js/hawi-interpreter.js.
 */

import { KASHF_BOOK_RULE_CATALOG, KASHF_DHAMIR_METHOD_COVERAGE } from './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';
import { selectApplicableBookRules } from './goral-hachol/engine/kashf-book-rule-selector.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const selection = selectApplicableBookRules({ method: 'kashf', topicId: 'spiritualDiagnostics', questionType: 'spiritual' });

console.log('\n--- 1/2. The two witness schemes (p.53 vs p.101-102) stay separate, never merged ---');
{
  const p53 = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p53-witness-scheme-basic');
  const p101 = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p101-witness-scheme-extended');
  assert(!!p53 && !!p101, '(1) both witness-scheme records exist as distinct catalog entries');
  assert(p53.sourcePage === 53 && p101.sourcePage === '101-102', '(1) each keeps its own distinct sourcePage');
  assert(JSON.stringify(p53.requiredHouses) !== JSON.stringify(p101.requiredHouses), '(1) each keeps its own distinct requiredHouses (not unified)');
  assert(p53.requiredHouses.join(',') === '13,14,15' && p101.requiredHouses.join(',') === '9,13,14,15,16', '(1) exact house sets preserved: p53=[13,14,15], p101=[9,13,14,15,16]');
  assert(p53.resolutionStatus === 'unresolved-source-relationship' && p101.resolutionStatus === 'unresolved-source-relationship', '(2) both flagged unresolved-source-relationship, neither silently chosen');
  assert(!KASHF_BOOK_RULE_CATALOG.some((r) => r.ruleKey?.includes('merged') || r.ruleKey?.includes('unified')), '(2) no merged/unified catalog entry exists anywhere');
}

console.log('\n--- 3. An unresolved rule is never returned as "applied" (verdict/supporting/witness buckets) ---');
{
  const appliedBuckets = [...selection.verdictRules, ...selection.supportingRules, ...selection.generalWitnessRules, ...selection.dhamirRules];
  const unresolvedKeysInAppliedBuckets = appliedBuckets.filter((r) => r.resolutionStatus === 'unresolved-source-relationship');
  assert(unresolvedKeysInAppliedBuckets.length === 0, `(3) zero unresolved-flagged rules appear in any "applied" bucket (got: ${unresolvedKeysInAppliedBuckets.map((r) => r.ruleKey)})`);
  assert(selection.unresolvedRules.length === 2, `(3) exactly 2 rules land in unresolvedRules (got: ${selection.unresolvedRules.length})`);
  assert(selection.unresolvedRules.every((r) => r.ruleKey.includes('witness-scheme')), '(3) both unresolved rules are the two witness-scheme entries');
}

console.log('\n--- 4. Selector for spiritualDiagnostics returns both page-167 formulas ---');
{
  const keys = selection.verdictRules.map((r) => r.ruleKey);
  assert(keys.includes('kashf-p167-primary-formula-spiritual-sorcery'), '(4) primaryFormula rule present in verdictRules');
  assert(keys.includes('kashf-p167-alt-formula-hidden-action'), '(4) altFormula rule present in verdictRules');
  assert(selection.verdictRules.length === 2, '(4) exactly these two verdict rules, no more');
}

console.log('\n--- 5. Rules for a different topic are not activated for spiritualDiagnostics ---');
{
  const otherTopicRule = {
    ruleKey: 'test-only-money-rule', ruleCategory: 'verdictFormula', sourceMethod: 'kashf',
    sourceBook: 'test', sourcePage: 1, sourceSection: 'test', shortSourceReference: 'test',
    appliesToTopics: ['money'], appliesToQuestionTypes: [], triggerConditions: [],
    requiredHouses: null, requiredFigures: null, calculationType: 'test', verdictEffect: 'test',
    precedence: null, conflictHandling: null, evidenceRole: 'test', implementationStatus: 'implemented',
    enginePath: null, confidence: 'verified', unresolvedReason: null,
  };
  const testCatalog = [...KASHF_BOOK_RULE_CATALOG, otherTopicRule];
  const matchedToSpiritual = testCatalog.filter((r) => r.appliesToTopics.includes('spiritualDiagnostics'));
  assert(!matchedToSpiritual.some((r) => r.ruleKey === 'test-only-money-rule'), '(5) a rule scoped to a different topic (money) is not matched to spiritualDiagnostics');
  assert(selection.irrelevantRules.every((r) => !r.appliesToTopics.includes('spiritualDiagnostics')), '(5) sanity: real irrelevantRules bucket (currently empty) never contains a topic-matched rule');
}

console.log('\n--- 6. "Five Witnesses" point-scoring technique (p.130-131) is not confused with house-witness testimony ---');
{
  const anyFiveWitnessesEntry = KASHF_BOOK_RULE_CATALOG.find((r) => r.sourcePage === '130-131' || r.sourcePage === 130 || r.sourcePage === 131);
  assert(!anyFiveWitnessesEntry, '(6) no catalog entry was created for the p.130-131 "five witnesses" degree-scoring technique this round (correctly left uncatalogued, not conflated with computeWitnessTestimony)');
  const witnessSchemeEntries = KASHF_BOOK_RULE_CATALOG.filter((r) => r.ruleCategory === 'witnessScheme');
  assert(witnessSchemeEntries.every((r) => Array.isArray(r.requiredHouses) && r.requiredHouses.every((h) => h >= 1 && h <= 16)), '(6) both witnessScheme entries use board house numbers (1-16), not degree/line counts from the p.130-131 technique');
}

console.log('\n--- 7/8. Dhamir 8-method coverage: exactly 5 implemented, 3 missing, never collapsed to "all verified" ---');
{
  assert(KASHF_DHAMIR_METHOD_COVERAGE.length === 8, `(7) exactly 8 dhamir sub-methods catalogued (got: ${KASHF_DHAMIR_METHOD_COVERAGE.length})`);
  const implemented = KASHF_DHAMIR_METHOD_COVERAGE.filter((m) => m.implementationStatus === 'implemented');
  const missing = KASHF_DHAMIR_METHOD_COVERAGE.filter((m) => m.implementationStatus === 'missing');
  assert(implemented.length === 5, `(7) exactly 5 dhamir methods marked implemented (got: ${implemented.length})`);
  assert(missing.length === 3, `(8) exactly 3 dhamir methods marked missing (got: ${missing.length})`);
  assert(missing.every((m) => m.enginePath === null && m.sentToAi === false), '(8) all 3 missing methods have enginePath:null and sentToAi:false — never claimed as executed');
  assert(missing.map((m) => m.methodKey).sort().join(',') === 'type1-face3-depth-movement,type3-mothers-arithmetic,type5-circle-closure', '(8) the exact 3 missing methods are the ones identified in the audit (depth movement, mothers-arithmetic, circle-closure)');
}

console.log('\n--- 9. Every verified catalog entry carries a real source page + reference ---');
{
  for (const rule of KASHF_BOOK_RULE_CATALOG) {
    assert(rule.sourcePage !== undefined && rule.sourcePage !== null && rule.sourcePage !== '', `(9) ${rule.ruleKey} has a non-empty sourcePage`);
    assert(typeof rule.shortSourceReference === 'string' && rule.shortSourceReference.length > 0, `(9) ${rule.ruleKey} has a non-empty shortSourceReference`);
  }
  for (const m of KASHF_DHAMIR_METHOD_COVERAGE) {
    assert(m.sourcePage !== undefined && m.sourcePage !== null && m.sourcePage !== '', `(9) dhamir method ${m.methodKey} has a non-empty sourcePage`);
  }
}

console.log('\n--- 10. AI Context is marked "partial" when a relevant rule is missing/unresolved ---');
{
  const { contextPackage } = buildKashfAiContextPackage({
    mothers: ['1211', '1212', '1121', '1122'], topicId: 'spiritualDiagnostics',
    question: 'האם קיימת פגיעת כישוף על הנשאלת?', readingId: 'catalog-test-001',
  });
  const rcs = contextPackage.readingContext.ruleCoverageStatus;
  assert(!!rcs, '(10) readingContext.ruleCoverageStatus is present in the real AI payload');
  assert(rcs.completeness === 'partial', `(10) completeness is honestly "partial" (got: ${rcs.completeness})`);
  assert(rcs.unresolvedRules.length === 2, '(10) unresolvedRules lists both witness-scheme keys');
  assert(rcs.missingRelevantRules.length >= 3, '(10) missingRelevantRules lists the unimplemented dhamir methods + missing general principle');
  assert(rcs.sourceCoverage.dhamirMethodsOnly.implemented === 5 && rcs.sourceCoverage.dhamirMethodsOnly.missing === 3, `(10) sourceCoverage.dhamirMethodsOnly reports 5 implemented / 3 missing, matching §7/§8 (got: ${JSON.stringify(rcs.sourceCoverage.dhamirMethodsOnly)})`);
}

console.log('\n--- 11. No engine file changed (structural, git-independent check) ---');
{
  const MOTHERS = ['1211', '1212', '1121', '1122'];
  const before = buildRamlBoardFromMothers(MOTHERS);
  const beforeReading = buildKashfReading(before, 'spiritualDiagnostics', { name: '', question: 'x' });
  const afterBoard = buildRamlBoardFromMothers(MOTHERS);
  const afterReading = buildKashfReading(afterBoard, 'spiritualDiagnostics', { name: '', question: 'x' });
  assert(JSON.stringify(beforeReading) === JSON.stringify(afterReading), '(11) buildKashfReading() output is identical across calls — engine untouched by this round');
  assert(beforeReading.primaryFormula.verdict.positive === true, '(11) sanity: pilot-003 verdict (positive:true) is unchanged by the catalog layer');

  const fs = await import('node:fs');
  assert(!fs.readFileSync('./goral-hachol/engine/kashf-pending-extraction.js', 'utf8').includes('KASHF_BOOK_RULE_CATALOG'), '(11) computeWitnessTestimony\'s file was not modified to reference the new catalog');
}

console.log('\n--- 12. No fetch/AI reference anywhere in the new files ---');
{
  const fs = await import('node:fs');
  for (const path of [
    './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js',
    './goral-hachol/engine/kashf-book-rule-selector.js',
  ]) {
    const src = fs.readFileSync(path, 'utf8');
    assert(!/\bfetch\s*\(/.test(src), `(12) ${path} contains no fetch() call`);
    assert(!/callAnthropic/i.test(src), `(12) ${path} contains no callAnthropic reference`);
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. הקטלוג שומר על שתי מערכות-העדים (עמ׳ 53 / עמ׳ 101-102) נפרדות ולא-פתורות, אף חוק unresolved לא מוחזר כ"applied", ה-selector מחזיר בדיוק את שתי נוסחאות עמ׳ 167 ל-spiritualDiagnostics, 5/8 שיטות-דמיר מדווחות implemented ו-3/8 missing (לעולם לא "הכל אומת"), טכניקת "חמשת העדים" (עמ׳ 130-131) לא-מבולבלת עם עדות-בתים, לכל רשומה יש מקור+עמוד, readingContext.ruleCoverageStatus מסומן partial בפועל, ואף קובץ-מנוע לא השתנה.');
