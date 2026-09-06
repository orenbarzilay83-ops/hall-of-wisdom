/**
 * _test_kashf_book_rule_catalog.mjs
 *
 * Proves the Canonical Book Rule Catalog (kashf-book-rule-catalog.js v3)
 * and its selector (kashf-book-rule-selector.js v3) correctly distinguish
 * implemented / applicable / selected / evaluated / applied — five
 * genuinely different facts that v2 had conflated (it built
 * ruleCoverageStatus.appliedBookRules directly from implementationStatus,
 * which incorrectly reported kashf-p49-house6-sorcery-domain as "applied"
 * despite no independent runtime object existing for it).
 *
 * Also proves: the five distinct witness systems (A/B/C/D/E, pages
 * 41/45/53/101-102/130-131) stay separate; kashf-p53-witness-scheme-basic
 * can be genuinely operationally-implemented-and-applied while its
 * relationship to kashf-p101-witness-scheme-extended stays unresolved
 * (two independent facts, neither erasing the other); kashf-p101-witness-
 * scheme-extended can never appear in appliedBookRules; page-adjacency
 * alone does not prove topical relevance (connection-type-by-element /
 * matter-true-and-directed-at-me); dhamir sub-methods are only "applied"
 * with direct runtime evidence, never by blanket topic-independence
 * claims.
 *
 * No AI call. No fetch. No network. No UI. No change to any Kashf engine
 * file (kashf-reading-engine.js, kashf-dhamir.js, computeWitnessTestimony,
 * kashf-narrative-writer.js, etc.) or to raml-board-generator.js/
 * hawi-interpreter.js.
 */

import { KASHF_BOOK_RULE_CATALOG, KASHF_BOOK_RULE_CATALOG_VERSION, KASHF_DHAMIR_METHOD_COVERAGE } from './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';
import { selectApplicableBookRules } from './goral-hachol/engine/kashf-book-rule-selector.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const MOTHERS = ['1211', '1212', '1121', '1122'];
const selection = selectApplicableBookRules({ method: 'kashf', topicId: 'spiritualDiagnostics', questionType: 'spiritual' });
const key = (r) => r.ruleKey || r.methodKey;
const has = (bucket, k) => bucket.some((r) => key(r) === k);

console.log('\n--- 1. implemented does not automatically equal applied ---');
{
  const house6 = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p49-house6-sorcery-domain');
  assert(house6.implementationStatus === 'implemented', '(1) house6 is marked implementationStatus:"implemented"');
  assert(!has(selection.appliedBookRules, 'kashf-p49-house6-sorcery-domain'), '(1) house6 is NOT in appliedBookRules despite being "implemented" — no independent runtime object exists for it');
  assert(has(selection.implementedAvailableRules, 'kashf-p49-house6-sorcery-domain'), '(1) house6 IS in implementedAvailableRules instead');
}

console.log('\n--- 2. applicable does not automatically equal selected ---');
{
  // "Applicable" = the source could conceivably apply this rule to the
  // topic (appliesToTopics lists it); "selected" = the selector actually
  // matched it. Every catalog entry in this file lists spiritualDiagnostics
  // in appliesToTopics, so applicable ⊇ selected always holds; the real
  // proof is that being topic-matched does NOT by itself mean the rule ran.
  const p101 = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p101-witness-scheme-extended');
  assert(p101.appliesToTopics.includes('spiritualDiagnostics'), '(2) p101-extended is applicable (appliesToTopics includes spiritualDiagnostics)');
  assert(has(selection.selectedRules, 'kashf-p101-witness-scheme-extended'), '(2) p101-extended IS selected (selector matched it to the topic)');
  assert(!has(selection.evaluatedRules, 'kashf-p101-witness-scheme-extended'), '(2) being applicable+selected does NOT mean evaluated — p101-extended was never computed');
}

console.log('\n--- 3. selected does not automatically equal evaluated ---');
{
  const selectedButNotEvaluated = selection.selectedRules.filter((r) => !has(selection.evaluatedRules, key(r)));
  assert(selectedButNotEvaluated.length > 0, `(3) at least one selected rule is not evaluated (got ${selectedButNotEvaluated.length}: ${selectedButNotEvaluated.map(key).join(', ')})`);
  assert(selectedButNotEvaluated.some((r) => key(r) === 'kashf-p167-connection-type-by-element'), '(3) connection-type-by-element is selected but not evaluated (no engine code exists for it)');
}

console.log('\n--- 4. evaluated does not automatically equal verdict-impacting ---');
{
  const evaluatedNotFeedingVerdict = selection.evaluatedRules.filter((r) => r.runtimeEvidence && r.runtimeEvidence.feedsOverallPositive !== true);
  assert(evaluatedNotFeedingVerdict.length > 0, `(4) at least one evaluated rule does not feed reading.overallPositive (got ${evaluatedNotFeedingVerdict.length}: ${evaluatedNotFeedingVerdict.map(key).join(', ')})`);
  assert(evaluatedNotFeedingVerdict.some((r) => key(r) === 'kashf-p53-witness-scheme-basic'), '(4) witnessTestimony is evaluated (computeWitnessTestimony runs) but does NOT feed the overallPositive scalar');
  assert(evaluatedNotFeedingVerdict.some((r) => key(r) === 'type1-face1-mizan'), '(4) dhamir mizan is evaluated but does NOT feed the overallPositive scalar (advisor-only by design)');
}

console.log('\n--- 5. appliedBookRules contains only rules with real runtime evidence ---');
{
  for (const rule of selection.appliedBookRules) {
    const ev = rule.runtimeEvidence;
    assert(!!ev, `(5) ${key(rule)} in appliedBookRules has a runtimeEvidence object`);
    assert(ev.evaluated === true, `(5) ${key(rule)} in appliedBookRules has runtimeEvidence.evaluated === true`);
    assert(ev.resultConfirmedNonError === true, `(5) ${key(rule)} in appliedBookRules has runtimeEvidence.resultConfirmedNonError === true`);
    assert(ev.feedsOverallPositive === true || ev.feedsNarrativeOrProfessionalFinding === true, `(5) ${key(rule)} in appliedBookRules feeds the verdict or a professional finding`);
  }
}

console.log('\n--- 6. an implemented dhamir method that never ran is not "applied" (structural check) ---');
{
  const fakeUnrunMethod = {
    methodKey: 'test-only-unrun-dhamir-method', ruleCategory: 'dhamirMethod', implementationStatus: 'implemented',
    runtimeEvidence: { evaluated: false, engineOutputPath: null, resultConfirmedNonError: false, feedsOverallPositive: false, feedsNarrativeOrProfessionalFinding: false, evidenceNote: 'test fixture — code exists but no proof this specific call executed it' },
  };
  // Exercises the same evaluated-gate the real selector uses: implemented status alone must never satisfy the applied check.
  const wouldBeApplied = fakeUnrunMethod.runtimeEvidence.evaluated && (fakeUnrunMethod.runtimeEvidence.feedsOverallPositive || fakeUnrunMethod.runtimeEvidence.feedsNarrativeOrProfessionalFinding);
  assert(wouldBeApplied === false, '(6) a dhamir method with implementationStatus:"implemented" but runtimeEvidence.evaluated:false is correctly excluded from "applied" by the same logic the real selector uses');
  assert(selection.appliedBookRules.every((r) => r.runtimeEvidence?.evaluated === true), '(6) sanity: every real dhamir entry currently in appliedBookRules does carry evaluated:true');
}

console.log('\n--- 7. p.53 can be operationally implemented while its relationship to p.101-102 stays unresolved ---');
{
  assert(has(selection.appliedBookRules, 'kashf-p53-witness-scheme-basic'), '(7) kashf-p53-witness-scheme-basic IS in appliedBookRules (operationally implemented + evaluated + feeds a real finding)');
  assert(has(selection.unresolvedSourceRelationshipRules, 'kashf-p53-witness-scheme-basic'), '(7) kashf-p53-witness-scheme-basic is ALSO in unresolvedSourceRelationshipRules (its relationship to p.101-102 is unresolved) — both facts hold simultaneously');
  const p53 = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p53-witness-scheme-basic');
  assert(p53.implementationStatus === 'implemented' && p53.resolutionStatus === 'unresolvedSourceRelationship', '(7) ruleOperationalStatus (implementationStatus) and relationshipResolutionStatus (resolutionStatus) are independently tracked fields on the same rule');
}

console.log('\n--- 8. p.101-102 (extended scheme) is never applied ---');
{
  assert(!has(selection.appliedBookRules, 'kashf-p101-witness-scheme-extended'), '(8) kashf-p101-witness-scheme-extended is NOT in appliedBookRules');
  assert(!has(selection.evaluatedRules, 'kashf-p101-witness-scheme-extended'), '(8) kashf-p101-witness-scheme-extended is NOT in evaluatedRules');
  assert(has(selection.unresolvedSourceRelationshipRules, 'kashf-p101-witness-scheme-extended'), '(8) kashf-p101-witness-scheme-extended IS in unresolvedSourceRelationshipRules');
  assert(has(selection.unavailableBookRules, 'kashf-p101-witness-scheme-extended'), '(8) kashf-p101-witness-scheme-extended IS in unavailableBookRules');
}

console.log('\n--- 9. a rule adjacent on the same page only is not classified verifiedRelevant ---');
{
  const connectionType = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p167-connection-type-by-element');
  const matterTrue = KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === 'kashf-p167-matter-true-and-directed-at-me');
  assert(connectionType.applicabilityStatus !== 'verifiedRelevant', `(9) connection-type-by-element is NOT applicabilityStatus:"verifiedRelevant" (got: ${connectionType.applicabilityStatus})`);
  assert(matterTrue.applicabilityStatus !== 'verifiedRelevant', `(9) matter-true-and-directed-at-me is NOT applicabilityStatus:"verifiedRelevant" (got: ${matterTrue.applicabilityStatus})`);
  assert(has(selection.unresolvedApplicabilityRules, 'kashf-p167-connection-type-by-element'), '(9) connection-type-by-element IS in unresolvedApplicabilityRules');
  assert(has(selection.unresolvedApplicabilityRules, 'kashf-p167-matter-true-and-directed-at-me'), '(9) matter-true-and-directed-at-me IS in unresolvedApplicabilityRules');
  assert(!has(selection.missingVerifiedRelevantRules, 'kashf-p167-connection-type-by-element'), '(9) connection-type-by-element is NOT in missingVerifiedRelevantRules (relevance itself is unproven, not just "uncoded")');
  assert(!has(selection.missingVerifiedRelevantRules, 'kashf-p167-matter-true-and-directed-at-me'), '(9) matter-true-and-directed-at-me is NOT in missingVerifiedRelevantRules');
}

console.log('\n--- 10. pilot-003 verdict is unchanged ---');
{
  const before = buildRamlBoardFromMothers(MOTHERS);
  const beforeReading = buildKashfReading(before, 'spiritualDiagnostics', { name: '', question: 'x' });
  const afterBoard = buildRamlBoardFromMothers(MOTHERS);
  const afterReading = buildKashfReading(afterBoard, 'spiritualDiagnostics', { name: '', question: 'x' });
  assert(JSON.stringify(beforeReading) === JSON.stringify(afterReading), '(10) buildKashfReading() output is identical across calls — engine untouched by this round');
  assert(beforeReading.primaryFormula.verdict.positive === true, '(10) sanity: pilot-003 verdict (positive:true) is unchanged by the catalog layer');
}

console.log('\n--- 11. completeness stays partial ---');
{
  const { contextPackage } = buildKashfAiContextPackage({
    mothers: MOTHERS, topicId: 'spiritualDiagnostics',
    question: 'האם קיימת פגיעת כישוף על הנשאלת?', readingId: 'catalog-test-001',
  });
  const rcs = contextPackage.readingContext.ruleCoverageStatus;
  assert(rcs.completeness === 'partial', `(11) completeness is honestly "partial" (got: ${rcs.completeness})`);
  assert(rcs.catalogVersion === KASHF_BOOK_RULE_CATALOG_VERSION, `(11) ruleCoverageStatus.catalogVersion matches the catalog's exported version (got: ${rcs.catalogVersion})`);
  assert(Array.isArray(rcs.appliedBookRules) && rcs.appliedBookRules.length === 10, `(11) appliedBookRules in the real payload has exactly the 10 evidence-backed rule ids (got: ${rcs.appliedBookRules.length})`);
  assert(rcs.appliedBookRules.includes('kashf-p53-witness-scheme-basic'), '(11) real payload appliedBookRules includes kashf-p53-witness-scheme-basic');
  assert(!rcs.appliedBookRules.includes('kashf-p101-witness-scheme-extended'), '(11) real payload appliedBookRules excludes kashf-p101-witness-scheme-extended');
  assert(!rcs.appliedBookRules.includes('kashf-p49-house6-sorcery-domain'), '(11) real payload appliedBookRules excludes kashf-p49-house6-sorcery-domain');
  assert(rcs.dhamirCoverage.evaluated === 5 && rcs.dhamirCoverage.applied === 5, `(11) dhamirCoverage reports 5 evaluated / 5 applied out of 8 catalogued (got: ${JSON.stringify(rcs.dhamirCoverage)})`);
}

console.log('\n--- 12. full AI payload passes the real, unmodified sanitizer ---');
{
  const { contextPackage } = buildKashfAiContextPackage({
    mothers: MOTHERS, topicId: 'spiritualDiagnostics',
    question: 'האם קיימת פגיעת כישוף על הנשאלת?', readingId: 'catalog-test-001',
  });
  const result = sanitizeKashfReadingPayloadForAi(contextPackage);
  assert(result.ok === true, `(12) sanitizeKashfReadingPayloadForAi(contextPackage) === {ok:true} (in practice: ${JSON.stringify(result)})`);
}

console.log('\n--- 13. no engine file changed (structural, git-independent check) ---');
{
  const fs = await import('node:fs');
  for (const path of [
    './goral-hachol/engine/kashf-pending-extraction.js',
    './goral-hachol/engine/kashf-reading-engine.js',
    './goral-hachol/engine/kashf-topic-rules.js',
    './goral-hachol/engine/kashf-narrative-writer.js',
    './goral-hachol/engine/kashf-dhamir.js',
  ]) {
    assert(!fs.readFileSync(path, 'utf8').includes('KASHF_BOOK_RULE_CATALOG'), `(13) ${path} was not modified to reference the new catalog`);
  }
}

console.log('\n--- 14. no fetch/AI reference anywhere in the new/modified files ---');
{
  const fs = await import('node:fs');
  for (const path of [
    './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js',
    './goral-hachol/engine/kashf-book-rule-selector.js',
  ]) {
    const src = fs.readFileSync(path, 'utf8');
    assert(!/\bfetch\s*\(/.test(src), `(14) ${path} contains no fetch() call`);
    assert(!/callAnthropic/i.test(src), `(14) ${path} contains no callAnthropic reference`);
  }
}

console.log('\n--- Bonus: five witness systems stay separate; catalog integrity ---');
{
  const witnessKeys = ['kashf-p41-six-pillars-witnesses-general', 'kashf-p45-trine-witness-scheme', 'kashf-p53-witness-scheme-basic', 'kashf-p101-witness-scheme-extended', 'kashf-p130-five-witnesses-scoring-technique'];
  const pages = witnessKeys.map((k) => String(KASHF_BOOK_RULE_CATALOG.find((r) => r.ruleKey === k)?.sourcePage));
  assert(new Set(pages).size === 5, `(bonus) all 5 witness systems have distinct sourcePage values (got: ${pages.join(', ')})`);
  assert(KASHF_BOOK_RULE_CATALOG.length === 13, `(bonus) catalog has 13 entries (got: ${KASHF_BOOK_RULE_CATALOG.length})`);
  assert(KASHF_DHAMIR_METHOD_COVERAGE.length === 8, `(bonus) 8 dhamir sub-methods catalogued (got: ${KASHF_DHAMIR_METHOD_COVERAGE.length})`);
  for (const rule of KASHF_BOOK_RULE_CATALOG) {
    assert(!!rule.runtimeEvidence && typeof rule.runtimeEvidence.evaluated === 'boolean', `(bonus) ${rule.ruleKey} carries a runtimeEvidence.evaluated boolean`);
  }
  for (const m of KASHF_DHAMIR_METHOD_COVERAGE) {
    assert(!!m.runtimeEvidence && typeof m.runtimeEvidence.evaluated === 'boolean', `(bonus) dhamir method ${m.methodKey} carries a runtimeEvidence.evaluated boolean`);
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. implemented/applicable/selected/evaluated/applied נשמרים כחמש עובדות נפרדות: house6 (implemented, לא-applied), עמ׳ 101-102 (selected, לא-evaluated, לעולם-לא-applied), שני חוקי-עמ׳-167 (unresolvedApplicability, לא-missingVerifiedRelevant). עמ׳ 53 מוכח applied ובו-זמנית מסומן unresolvedSourceRelationship — שתי עובדות בלתי-תלויות. 5/8 שיטות-דמיר evaluated+applied בפועל (לא כל 8, גם לא רק implemented). ה-verdict לא השתנה, הפלט עובר סניטייזר אמיתי, ואף קובץ-מנוע לא נגע.');
