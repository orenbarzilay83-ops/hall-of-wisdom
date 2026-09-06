#!/usr/bin/env node
/**
 * _test_hall_wisdom_intent_analyzer.mjs
 *
 * Tests for Hall of Wisdom Core — Intent Analyzer (first implemented
 * component). No AI, no network, no engine calls — pure text-pattern logic.
 */

import { analyzeIntent, validateIntentInput, validateIntentResult, ANALYSIS_VERSION } from './goral-hachol/intelligence/intent-analyzer.js';
import {
  getAllIntentIds, getIntentDefinition, isIntentId, isPrimaryIntentValue,
  validateIntentDefinition, UNKNOWN_INTENT_ID,
} from './goral-hachol/intelligence/intent-types.js';
import { INTENT_PATTERNS } from './goral-hachol/intelligence/intent-analyzer-hebrew-rules.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    console.error('FAIL:', message);
  }
}

function assertPrimary(question, expectedIntent, note = '') {
  const r = analyzeIntent({ question });
  assert(r.primaryIntent === expectedIntent, `${note || question}: expected primaryIntent=${expectedIntent}, got ${r.primaryIntent} (confidence=${r.confidence})`);
  return r;
}

// --- Intent catalog sanity ------------------------------------------------

assert(getAllIntentIds().length === 12, `catalog has exactly 12 intents, got ${getAllIntentIds().length}`);
for (const id of getAllIntentIds()) {
  const def = getIntentDefinition(id);
  const { valid, errors } = validateIntentDefinition(def);
  assert(valid, `intent definition ${id} is valid: ${errors.join('; ')}`);
  assert(Array.isArray(def.commonlyConfusedWith) && def.commonlyConfusedWith.every((c) => isIntentId(c)), `${id}.commonlyConfusedWith only references real intents`);
  assert(INTENT_PATTERNS[id] && INTENT_PATTERNS[id].length > 0, `${id} has at least one Hebrew pattern rule`);
}
assert(!isIntentId('notARealIntent'), 'isIntentId rejects unknown intent ids');

// --- 1-12: the 12 worked examples from the spec ----------------------------

assertPrimary('האם העסק החדש יצליח?', 'prediction', 'example 1');
assertPrimary('האם כדאי לי לפתוח עסק?', 'decisionSupport', 'example 2');
assertPrimary('האם העסק יצא לפועל?', 'outcomeCompletion', 'example 3');
assertPrimary('מתי העסק יתחיל להרוויח?', 'timingRequest', 'example 4');
assertPrimary('מה הוא חושב עליי?', 'hiddenThoughtIntent', 'example 5');
assertPrimary('האם הוא אוהב אותי?', 'stateAssessment', 'example 6 (not hiddenThoughtIntent by default)');
assertPrimary('האם כדאי לי להמשיך איתו?', 'decisionSupport', 'example 7');
assertPrimary('מי גנב את הכסף?', 'investigation', 'example 8');
assertPrimary('למה העסק לא מצליח?', 'diagnosis', 'example 9');
assertPrimary('מה עדיף, עבודה שכירה או עצמאית?', 'comparison', 'example 10');
assertPrimary('מה עליי לעשות כדי לשפר את העסק?', 'guidance', 'example 11');
assertPrimary('מה צפוי לי בתקופה הקרובה?', 'generalForecast', 'example 12');

// --- example 1: excludedIntents must name the right absent intents (fix 3: ---
// strengthened to also cover decisionSupport, matching the exact 5-intent
// example given: hiddenThoughtIntent/timingRequest/diagnosis/investigation/decisionSupport)
{
  const r = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  const excludedIds = r.excludedIntents.map((e) => e.intentId);
  for (const shouldBeExcluded of ['hiddenThoughtIntent', 'timingRequest', 'investigation', 'diagnosis', 'decisionSupport']) {
    assert(excludedIds.includes(shouldBeExcluded), `prediction excludedIntents includes ${shouldBeExcluded}`);
  }
  assert(r.excludedIntents.every((e) => typeof e.reason === 'string' && e.reason.length > 0), 'every excluded intent has a non-empty reason');
  // fix 3: reasons are concrete/human ("what this intent would need"), not a
  // generic "no signal found" placeholder.
  const decisionSupportExclusion = r.excludedIntents.find((e) => e.intentId === 'decisionSupport');
  assert(decisionSupportExclusion.reason === 'לא נשאל האם כדאי לבצע פעולה.', `decisionSupport exclusion reason matches the requested wording exactly (got "${decisionSupportExclusion.reason}")`);
  const hiddenThoughtExclusion = r.excludedIntents.find((e) => e.intentId === 'hiddenThoughtIntent');
  assert(hiddenThoughtExclusion.reason === 'השאלה אינה מבקשת לברר מחשבות או רגשות.', `hiddenThoughtIntent exclusion reason matches the requested wording exactly (got "${hiddenThoughtExclusion.reason}")`);
}
{
  // primaryIntent === 'unknown' never returns excludedIntents (nothing was
  // actually "chosen" to exclude relative to)
  const r = analyzeIntent({ question: 'מה קורה בעסק?' });
  assert(Array.isArray(r.excludedIntents) && r.excludedIntents.length === 0, 'unknown primaryIntent returns an empty excludedIntents array, not a guessed exclusion set');
}

// --- gender variants (male/female phrasing) --------------------------------

assertPrimary('מה היא חושבת עליי?', 'hiddenThoughtIntent', 'female form of "what does she think about me"');
assertPrimary('האם היא אוהבת אותי?', 'stateAssessment', 'female form of "does she love me"');
assertPrimary('מה מצבה?', 'stateAssessment', 'female form of "what is her state"');

// --- punctuation variants ---------------------------------------------------

assertPrimary('האם העסק יצליח', 'prediction', 'no question mark');
assertPrimary('האם העסק יצליח.', 'prediction', 'period instead of question mark');
assertPrimary('האם   העסק   יצליח?', 'prediction', 'extra whitespace collapses correctly');

// --- multiple-intent question: primary is one of the real signals, other appears as secondary
{
  const r = analyzeIntent({ question: 'האם כדאי לי לפתוח עסק ומתי הוא יצליח?' });
  assert(['decisionSupport', 'timingRequest'].includes(r.primaryIntent), `multi-intent question resolves to one of the two real signals, got ${r.primaryIntent}`);
  const other = r.primaryIntent === 'decisionSupport' ? 'timingRequest' : 'decisionSupport';
  assert(r.secondaryIntents.includes(other), `multi-intent question keeps the other real signal (${other}) as secondary`);
}

// --- timing appearing together with a business question --------------------
{
  const r = analyzeIntent({ question: 'מתי העסק יתחיל להרוויח?', questionTypeHint: 'businessSuccess' });
  assert(r.primaryIntent === 'timingRequest', 'timing signal wins primary even with a business questionType hint present');
}

// --- hidden thought vs relationship state (direct pair) ---------------------
{
  const hidden = analyzeIntent({ question: 'מה הוא מרגיש כלפיי?' });
  assert(hidden.primaryIntent === 'hiddenThoughtIntent', 'explicit "what does he feel" resolves to hiddenThoughtIntent');
  const state = analyzeIntent({ question: 'האם יש בינינו קשר?' });
  assert(state.primaryIntent === 'stateAssessment', '"is there a relationship between us" resolves to stateAssessment, not hiddenThoughtIntent');
}

// --- diagnosis vs prediction (direct pair) ----------------------------------
{
  const diag = analyzeIntent({ question: 'מה הסיבה שהעסק לא מצליח?' });
  assert(diag.primaryIntent === 'diagnosis', 'cause-seeking question resolves to diagnosis');
  const pred = analyzeIntent({ question: 'האם העסק יצליח בסוף?' });
  assert(pred.primaryIntent === 'prediction', 'outcome-seeking question resolves to prediction, not diagnosis');
}

// --- decisionSupport vs outcomeCompletion (direct pair) ---------------------
{
  const decision = analyzeIntent({ question: 'האם כדאי לי לחתום על החוזה?' });
  assert(decision.primaryIntent === 'decisionSupport', '"should I sign the contract" resolves to decisionSupport');
  const completion = analyzeIntent({ question: 'האם החוזה יושלם בהצלחה?' });
  assert(completion.primaryIntent === 'outcomeCompletion', '"will the contract be completed" resolves to outcomeCompletion, not decisionSupport');
}

// --- comparison vs decisionSupport (direct pair) ----------------------------
{
  const cmp = analyzeIntent({ question: 'מה עדיף, לקנות דירה או לשכור?' });
  assert(cmp.primaryIntent === 'comparison', '"which is preferable, buy or rent" resolves to comparison');
  const dec = analyzeIntent({ question: 'האם כדאי לי לקנות דירה?' });
  assert(dec.primaryIntent === 'decisionSupport', '"should I buy an apartment" resolves to decisionSupport, not comparison');
}

// --- ambiguous questions: primaryIntent must be 'unknown', never a guess -----
// (fix 1: no generalForecast-as-default-guess; unknown is the only legal
// fallback whenever confidence is insufficient)
{
  const r = analyzeIntent({ question: 'מה יהיה איתו?' });
  assert(r.confidence < 0.5, `weak-signal-only question has low confidence (got ${r.confidence})`);
  assert(r.requiresClarification === true, 'weak-signal-only question requires clarification');
  assert(r.primaryIntent === UNKNOWN_INTENT_ID, `weak-signal-only question resolves to '${UNKNOWN_INTENT_ID}', not a guessed real intent (got ${r.primaryIntent})`);
  assert(typeof r.clarificationQuestion === 'string' && r.clarificationQuestion.length > 0, 'clarificationQuestion is provided when clarification is required');
}
{
  const r = analyzeIntent({ question: 'מה קורה בעסק?' });
  assert(r.confidence === 0, `zero-signal question has confidence 0 (got ${r.confidence})`);
  assert(r.requiresClarification === true, 'zero-signal question requires clarification');
  assert(r.primaryIntent === UNKNOWN_INTENT_ID, `zero-signal question resolves to '${UNKNOWN_INTENT_ID}', never a guessed real intent (got ${r.primaryIntent})`);
  assert(isPrimaryIntentValue(r.primaryIntent), 'primaryIntent is still a legal primaryIntent value (unknown counts) even with zero signal');
  assert(!isIntentId(r.primaryIntent), `'${UNKNOWN_INTENT_ID}' is deliberately not one of the 12 catalog intents`);
}

// --- fix 1: engines/strategy must never receive a guessed intent -------------
{
  const r = analyzeIntent({ question: 'קורה משהו' }); // no recognizable pattern at all
  assert(r.primaryIntent === UNKNOWN_INTENT_ID, 'a question with no matching pattern anywhere never falls back to any specific real intent');
  assert(r.strategyHints.length === 0, 'unknown primaryIntent carries no strategyHints (nothing to hint a strategy for)');
  assert(r.forbiddenDefaultRuleCategories.length > 0, 'unknown primaryIntent still returns a conservative (non-empty) forbiddenDefaultRuleCategories');
}

// --- fix 2: genuine ties/near-ties are never resolved by declaration order ---
{
  // "מתי" (timingRequest, weight 3) vs "כדאי לי" (decisionSupport, weight 3+1=4)
  // — gap of 1 is below CLEAR_WIN_MARGIN(2), so this must NOT silently pick
  // one of them by list order; it must become unknown + requiresClarification.
  const r = analyzeIntent({ question: 'מתי כדאי לי לנסוע?' });
  assert(r.primaryIntent === UNKNOWN_INTENT_ID, `near-tied scores never get an arbitrary winner (got ${r.primaryIntent})`);
  assert(r.requiresClarification === true, 'near-tied scores require clarification');
  assert(r.secondaryIntents.includes('decisionSupport') && r.secondaryIntents.includes('timingRequest'), 'both near-tied candidates surface in secondaryIntents for transparency');
  assert(r.ambiguityReasons.some((s) => s.includes('הפער')), 'ambiguityReasons explains the insufficient-gap situation');
}
{
  // sanity: a genuinely large gap (>= CLEAR_WIN_MARGIN) still commits normally —
  // this is not a change from before, just re-confirmed under the new logic.
  const r = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  assert(r.primaryIntent === 'prediction' && r.requiresClarification === false, 'a clear, wide-margin win still commits to a real primaryIntent without clarification');
}

// --- empty / malformed input --------------------------------------------------
{
  const { valid, errors } = validateIntentInput({ question: '' });
  assert(!valid, 'empty question string fails input validation');
  assert(errors.length > 0, 'empty question produces at least one error message');
}
{
  const { valid } = validateIntentInput({});
  assert(!valid, 'missing question field fails input validation');
}
{
  const { valid } = validateIntentInput({ question: 'שאלה תקינה' });
  assert(valid, 'minimal valid input (question only) passes validation');
}
{
  const { valid } = validateIntentInput({ question: 'שאלה', method: 'tarot' });
  assert(!valid, 'invalid method value fails input validation');
}
{
  const { valid } = validateIntentInput({ question: 'שאלה', questionTypeHint: 'notARealQuestionType' });
  assert(!valid, 'invalid questionTypeHint fails input validation');
}

// --- invalid intent / confidence range (result validator) --------------------
{
  const badResult = { primaryIntent: 'notARealIntent', secondaryIntents: [], confidence: 0.5, excludedIntents: [], requiresClarification: false };
  const { valid, errors } = validateIntentResult(badResult);
  assert(!valid, 'unknown primaryIntent fails result validation');
  assert(errors.some((e) => e.includes('primaryIntent')), 'error message mentions primaryIntent');
}
{
  const badResult = { primaryIntent: 'prediction', secondaryIntents: [], confidence: 1.5, excludedIntents: [], requiresClarification: false };
  const { valid } = validateIntentResult(badResult);
  assert(!valid, 'confidence above 1 fails result validation');
}
{
  const badResult = { primaryIntent: 'prediction', secondaryIntents: [], confidence: -0.1, excludedIntents: [], requiresClarification: false };
  const { valid } = validateIntentResult(badResult);
  assert(!valid, 'confidence below 0 fails result validation');
}
{
  const badResult = { primaryIntent: 'prediction', secondaryIntents: ['prediction'], confidence: 0.5, excludedIntents: [], requiresClarification: false };
  const { valid } = validateIntentResult(badResult);
  assert(!valid, 'secondaryIntents containing primaryIntent fails result validation');
}
{
  const badResult = { primaryIntent: 'prediction', secondaryIntents: ['decisionSupport', 'decisionSupport'], confidence: 0.5, excludedIntents: [], requiresClarification: false };
  const { valid } = validateIntentResult(badResult);
  assert(!valid, 'duplicate secondaryIntents fails result validation');
}
{
  const badResult = { primaryIntent: 'prediction', secondaryIntents: [], confidence: 0.5, excludedIntents: [], requiresClarification: true, clarificationQuestion: '' };
  const { valid } = validateIntentResult(badResult);
  assert(!valid, 'requiresClarification=true with empty clarificationQuestion fails result validation');
}
{
  // fix 1: 'unknown' is a LEGAL primaryIntent value (unlike a made-up string)...
  const okResult = {
    primaryIntent: UNKNOWN_INTENT_ID, secondaryIntents: [], confidence: 0.2,
    excludedIntents: [], requiresClarification: true, clarificationQuestion: 'שאלת-הבהרה?',
    decisionReason: 'לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה.', analysisVersion: ANALYSIS_VERSION,
  };
  assert(validateIntentResult(okResult).valid, `primaryIntent='${UNKNOWN_INTENT_ID}' with requiresClarification=true is a valid result`);
}
{
  // ...but it can never be paired with requiresClarification=false — that
  // combination would mean "we don't know, but don't ask" which is exactly
  // the guessing behavior fix 1 forbids.
  const badResult = {
    primaryIntent: UNKNOWN_INTENT_ID, secondaryIntents: [], confidence: 0.2,
    excludedIntents: [], requiresClarification: false,
  };
  const { valid, errors } = validateIntentResult(badResult);
  assert(!valid, `primaryIntent='${UNKNOWN_INTENT_ID}' with requiresClarification=false fails result validation`);
  assert(errors.some((e) => e.includes('requiresClarification')), 'error message explains the unknown+requiresClarification=false conflict');
}
{
  // sanity: every real analyzeIntent() output must itself pass validateIntentResult()
  // — both the confident-real-intent path and the unknown/ambiguous path.
  const r = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  const { valid, errors } = validateIntentResult(r);
  assert(valid, `real analyzeIntent output (confident) passes its own result validator: ${errors.join('; ')}`);

  const rUnknown = analyzeIntent({ question: 'מה קורה בעסק?' });
  const unknownValidation = validateIntentResult(rUnknown);
  assert(unknownValidation.valid, `real analyzeIntent output (unknown) passes its own result validator: ${unknownValidation.errors.join('; ')}`);
}

// --- privacy: no PII in matchedSignals / constructed fields -------------------
// (normalizedQuestion legitimately echoes the caller's own input verbatim —
// that is not a leak. The actual requirement, per spec, is that *constructed*
// fields like matchedSignals/excludedIntents/clarificationQuestion never embed
// PII pulled out of the question text — they only ever carry fixed, canonical,
// authored strings from intent-types.js/intent-analyzer-hebrew-rules.js.)
{
  const r = analyzeIntent({ question: 'האם דוד כהן, שמספר הטלפון שלו 0501234567, יצליח בעסק?' });
  const constructedFields = JSON.stringify({
    matchedSignals: r.matchedSignals,
    excludedIntents: r.excludedIntents,
    ambiguityReasons: r.ambiguityReasons,
    strategyHints: r.strategyHints,
    forbiddenDefaultRuleCategories: r.forbiddenDefaultRuleCategories,
    clarificationQuestion: r.clarificationQuestion,
  });
  assert(!constructedFields.includes('0501234567'), 'phone number from the question never appears in any constructed output field');
  assert(!constructedFields.includes('דוד כהן'), 'name from the question never appears in any constructed output field');
  assert(r.matchedSignals.every((s) => typeof s.label === 'string' && !/\d{7,}/.test(s.label)), 'matchedSignals only ever contain fixed canonical labels, never digits/PII from the live question');
}

// --- output contract shape ----------------------------------------------------
{
  const r = analyzeIntent({ question: 'האם העסק יצליח?' });
  for (const field of [
    'normalizedQuestion', 'primaryIntent', 'secondaryIntents', 'questionType', 'confidence',
    'matchedSignals', 'excludedIntents', 'ambiguityReasons', 'strategyHints',
    'forbiddenDefaultRuleCategories', 'requiresClarification', 'clarificationQuestion', 'needsOrenDecision',
    'decisionReason', 'analysisVersion',
  ]) {
    assert(field in r, `output contract includes field "${field}"`);
  }
  assert(!('topicId' in r), 'output never includes/invents a topicId (not part of the contract)');
}

// --- questionType is derived, hint respected but does not override text signal
{
  const r1 = analyzeIntent({ question: 'האם העסק יצליח?', questionTypeHint: 'businessSuccess' });
  assert(r1.questionType === 'businessSuccess', 'valid questionTypeHint is used as-is for the questionType output field');
  assert(r1.primaryIntent === 'prediction', 'questionTypeHint does not override a clear text-based intent signal');

  const r2 = analyzeIntent({ question: 'האם העסק יצליח?', questionTypeHint: 'health' });
  assert(r2.primaryIntent === 'prediction', 'even a mismatched/unrelated questionTypeHint cannot flip a clear prediction signal');
}

// --- Intent is not Question Type: same questionType, different intents -------
{
  const a = analyzeIntent({ question: 'האם העסק יצליח?', questionTypeHint: 'businessSuccess' });
  const b = analyzeIntent({ question: 'האם כדאי לי לפתוח עסק?', questionTypeHint: 'businessSuccess' });
  const c = analyzeIntent({ question: 'למה העסק לא מצליח?', questionTypeHint: 'businessSuccess' });
  assert(a.questionType === b.questionType && b.questionType === c.questionType, 'all three share the same questionType (businessSuccess)');
  assert(new Set([a.primaryIntent, b.primaryIntent, c.primaryIntent]).size === 3, 'but each has a distinct primaryIntent (prediction/decisionSupport/diagnosis)');
}

// --- strategyHints / forbiddenDefaultRuleCategories come from the matched intent, unmodified
{
  const r = analyzeIntent({ question: 'מה הוא חושב עליי?' });
  const def = getIntentDefinition('hiddenThoughtIntent');
  assert(JSON.stringify(r.strategyHints) === JSON.stringify(def.defaultStrategyHints), 'strategyHints exactly matches the matched intent\'s defaultStrategyHints');
  assert(JSON.stringify(r.forbiddenDefaultRuleCategories) === JSON.stringify(def.forbiddenDefaultRuleCategories), 'forbiddenDefaultRuleCategories exactly matches the matched intent\'s definition');
}

// --- structural guards: no engine imports, no fetch, no AI call ---------------
{
  const fs = await import('node:fs');
  const files = [
    './goral-hachol/intelligence/intent-types.js',
    './goral-hachol/intelligence/intent-analyzer.js',
    './goral-hachol/intelligence/intent-analyzer-hebrew-rules.js',
  ];
  for (const f of files) {
    const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    const codeOnly = src.split('\n').filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('//')).join('\n');
    assert(!/from\s+['"].*\/engine\//.test(codeOnly), `${f} does not import from any goral-hachol/engine/ path`);
    assert(!/\bcallAnthropic\s*\(/.test(codeOnly), `${f} does not call callAnthropic`);
    assert(!/\bfetch\s*\(/.test(codeOnly), `${f} does not call fetch`);
    assert(!/ANTHROPIC_API_KEY/.test(codeOnly), `${f} does not reference ANTHROPIC_API_KEY`);
  }
}

// --- no change to existing QA results: run the real 60-scenario suite through
//     the (unrelated) decision brain and confirm the known-clean baseline still holds
{
  const { run } = await import('./goral-hachol/brain/goral-brain-evaluation-runner.mjs');
  const report = run();
  assert(
    report.failuresBySeverity.high === 0 && report.failuresBySeverity.medium === 3 && report.failuresBySeverity.none === 57,
    `existing QA/Decision Brain results are unaffected by adding the Intent Analyzer (expected 0 high / 3 medium / 57 none, got ${JSON.stringify(report.failuresBySeverity)})`
  );
}

// --- smoke: engines/UI/cards untouched (same convention as other suites) -----
{
  const fs = await import('node:fs');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html still exists');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js still exists');
  const html = fs.readFileSync(new URL('./goral-hachol.html', import.meta.url), 'utf8');
  assert(html.includes('orenAdvisorPanel'), 'orenAdvisorPanel still present in goral-hachol.html');
  const { buildKashfReading } = await import('./goral-hachol/engine/kashf-reading-engine.js');
  const { interpretHawiQuestionInitial } = await import('./goral-hachol/engine/hawi-interpreter.js');
  assert(typeof buildKashfReading === 'function', 'kashf-reading-engine.js still exports buildKashfReading as a function');
  assert(typeof interpretHawiQuestionInitial === 'function', 'hawi-interpreter.js still exports interpretHawiQuestionInitial as a function');
}

// --- decisionReason / analysisVersion (new fields) ----------------------------

// decisionReason exists (confident case)
{
  const r = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  assert(typeof r.decisionReason === 'string' && r.decisionReason.length > 0, 'decisionReason is a non-empty string for a confident real primaryIntent');
  assert(r.decisionReason.includes('prediction'), 'decisionReason for a confident pick names the chosen intentId');
}

// decisionReason exists even when requiresClarification=true (per spec example wording)
{
  const r = analyzeIntent({ question: 'מה קורה בעסק?' });
  assert(r.requiresClarification === true, 'sanity: this is the requiresClarification=true case');
  assert(r.decisionReason === 'לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה.', `zero-signal decisionReason matches the requested wording exactly (got "${r.decisionReason}")`);
}
{
  // the near-tie case: decisionReason names both competing intents (per spec example: "לא ניתן להכריע בין prediction ל-decisionSupport")
  const r = analyzeIntent({ question: 'מתי כדאי לי לנסוע?' });
  assert(r.requiresClarification === true, 'sanity: this is the near-tie requiresClarification=true case');
  assert(r.decisionReason.startsWith('לא ניתן להכריע בין'), `near-tie decisionReason follows the "לא ניתן להכריע בין X ל-Y" template (got "${r.decisionReason}")`);
  assert(r.decisionReason.includes('decisionSupport') && r.decisionReason.includes('timingRequest'), 'near-tie decisionReason names both competing intents');
}

// decisionReason mentions a real runner-up when one exists alongside a confident win
{
  const r = analyzeIntent({ question: 'האם כדאי לי לנסוע, ומתי?' });
  assert(r.requiresClarification === false, 'sanity: this question has a clear (>=2 gap) winner');
  assert(r.decisionReason.includes('קיבל עדיפות על'), `decisionReason mentions the real runner-up it won against (got "${r.decisionReason}")`);
}

// analysisVersion exists and is identical across every output
{
  const questions = ['האם העסק החדש יצליח?', 'מה קורה בעסק?', 'מתי כדאי לי לנסוע?', 'מי גנב את הכסף?'];
  const versions = questions.map((q) => analyzeIntent({ question: q }).analysisVersion);
  assert(versions.every((v) => typeof v === 'string' && v.length > 0), 'analysisVersion is a non-empty string on every output');
  assert(new Set(versions).size === 1, `analysisVersion is identical across all outputs (got ${JSON.stringify(versions)})`);
  assert(versions[0] === ANALYSIS_VERSION, 'analysisVersion on real output matches the single exported ANALYSIS_VERSION constant');
}

// decisionReason never leaks PII
{
  const r = analyzeIntent({ question: 'האם דוד כהן, שמספר הטלפון שלו 0501234567, יצליח בעסק?' });
  assert(!r.decisionReason.includes('0501234567'), 'decisionReason never contains a phone number from the question');
  assert(!r.decisionReason.includes('דוד כהן'), 'decisionReason never contains a name from the question');
}

// decisionReason never contains chain-of-thought / AI-model language
{
  const chainOfThoughtMarkers = ['אני חושב', 'לדעתי', 'בואו נבדוק', 'step by step', 'let me', 'I think', 'reasoning:', 'thought:'];
  for (const q of ['האם העסק החדש יצליח?', 'מה קורה בעסק?', 'מתי כדאי לי לנסוע?', 'מה הוא חושב עליי?']) {
    const r = analyzeIntent({ question: q });
    for (const marker of chainOfThoughtMarkers) {
      assert(!r.decisionReason.toLowerCase().includes(marker.toLowerCase()), `decisionReason for "${q}" contains no chain-of-thought marker "${marker}"`);
    }
  }
}

// --- validators: analysisVersion / decisionReason -----------------------------
{
  const bad = { primaryIntent: 'prediction', secondaryIntents: [], confidence: 0.9, excludedIntents: [], requiresClarification: false, decisionReason: 'נבחר prediction.' };
  const { valid, errors } = validateIntentResult(bad);
  assert(!valid, 'missing analysisVersion fails result validation');
  assert(errors.some((e) => e.includes('analysisVersion')), 'error message mentions analysisVersion');
}
{
  const bad = { primaryIntent: 'prediction', secondaryIntents: [], confidence: 0.9, excludedIntents: [], requiresClarification: false, analysisVersion: ANALYSIS_VERSION, decisionReason: '' };
  const { valid, errors } = validateIntentResult(bad);
  assert(!valid, 'empty decisionReason fails result validation');
  assert(errors.some((e) => e.includes('decisionReason')), 'error message mentions decisionReason');
}
{
  const bad = { primaryIntent: 'prediction', secondaryIntents: [], confidence: 0.9, excludedIntents: [], requiresClarification: false, analysisVersion: ANALYSIS_VERSION };
  // decisionReason entirely missing
  const { valid } = validateIntentResult(bad);
  assert(!valid, 'result missing decisionReason entirely fails validation');
}
{
  // sanity: every real analyzeIntent() output already passes the new checks too
  const rConfident = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  const rUnknown = analyzeIntent({ question: 'מה קורה בעסק?' });
  assert(validateIntentResult(rConfident).valid, 'real confident output passes validation including the new decisionReason/analysisVersion checks');
  assert(validateIntentResult(rUnknown).valid, 'real unknown output passes validation including the new decisionReason/analysisVersion checks');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
