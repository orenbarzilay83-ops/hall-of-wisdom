#!/usr/bin/env node
/**
 * _test_kashf_verdict_rate_audit.mjs
 *
 * History of this file's own corrections (kept because each one fixed a
 * real measurement bug, and the next person reading this should not
 * reintroduce any of them):
 *
 *  Round 1 (wrong): counted any output text different from the single
 *  generic fallback string ('ללא הכרעה מפורשת') as "a verdict produced".
 *  That overcounts — several methods (e.g. travel.p239.profitH7Witness)
 *  write rich, non-generic Hebrew prose for their explicit NO-VERDICT
 *  branches too, explaining exactly why the source gives no ruling here.
 *
 *  Round 2 (still wrong): switched to reading each method's structured
 *  result instead of text, but classified every board-outcome as a binary
 *  "decisive or not" — which silently treated DESCRIPTIVE source-grounded
 *  findings (content the source gives, but that the source itself never
 *  claims resolves the actual question) as if they were decisive verdicts.
 *  The clearest case: general.p174.h1h2h4h7h10h15's own executor text
 *  says outright "אינו מוסר כאן נוסחת רוב, שקלול בין הבתים או פסק כן/לא
 *  יחיד" (the source gives no majority rule, weighting, or single yes/no
 *  verdict here) — yet round 2's audit marked it "always decisive" purely
 *  because it always returns non-empty content.
 *
 *  Round 3 (this version): every per-board outcome is classified into
 *  exactly one of four buckets, read from each method's own structured
 *  result AND cross-checked against what that executor's own documented
 *  scope actually claims to resolve (not inferred from "a value exists"):
 *
 *   - DECISIVE: the source gives a specific, resolved answer to the
 *     EXACT question asked on this board — a real yes/no via
 *     verdict.positive, or (for non-yes/no "what/which" questions) a
 *     specific resolved value the method's own documentation presents as
 *     answering the question, not as a side-report.
 *   - DESCRIPTIVE: the method returns real, source-grounded content on
 *     this board, but the source itself (per the executor's own
 *     documented scope) does not claim this content decides the actual
 *     question — a multi-house status report with no aggregate rule
 *     (general.p174), a planetary life-stage mapping that explicitly
 *     "does not compute a lifespan" (lifespan.p264), a physical/character
 *     profile that explicitly "does not identify a person or prove
 *     guilt" (theft.p225), or a hazard-type note riding alongside a
 *     separate, genuinely decisive safety reading (travel.p240, only on
 *     boards where its OTHER house's reading itself stays undetermined).
 *   - NO-DECISION: the method ran, but its own documented decisive
 *     condition is not met on this board (e.g. verdict.positive is null,
 *     or a method-specific "unresolved" sentinel) — the source genuinely
 *     gives nothing here, not even descriptive content.
 *   - MISSING-INPUT: the method requires a specific client-supplied field
 *     beyond the board (an independent casting, a casting time-of-day, a
 *     named-cast confirmation) that this harness did not supply. This is
 *     an architectural fact about the method, checked once per method,
 *     not a per-board outcome.
 *
 * Two families of methods:
 *
 *  1. "positive-field" methods (61 of 91 ready methods) set a real
 *     engine-level verdict.positive: true | false | null. These are
 *     genuinely yes/no questions; positive !== null => DECISIVE,
 *     positive === null => NO-DECISION. (None of these 61 carry a
 *     general.p174-style "no verdict at all, ever" disclaimer found
 *     during this round's audit, so none are reclassified DESCRIPTIVE.)
 *
 *  2. "categorical" methods (23 of 91) never set verdict.positive (these
 *     are what/which/how questions, not yes/no ones). Each is classified
 *     per-board by its own named field, with DESCRIPTIVE used wherever
 *     the executor's own text disclaims deciding the question (see the
 *     CATEGORICAL_RULES table below, each with its source citation).
 *
 * 3 methods require a client-input field this engine cannot infer from
 * the board alone (hidden.p188.quarterDirection's four independent
 * casts; mother.p257.statusDayNight's casting period;
 * marriage.p205.modestyPurity's named-cast confirmation gate). Realistic
 * values are supplied so their per-board outcome reflects the source
 * condition, not a false "no decision"; they are additionally flagged
 * MISSING-INPUT-CAPABLE so the report can state that a real client who
 * skips those fields gets no verdict for an architectural reason, not a
 * source reason.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';

import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

const patterns = [];
for (const fire of ['1', '2'])
  for (const air of ['1', '2'])
    for (const water of ['1', '2'])
      for (const earth of ['1', '2'])
        patterns.push(fire + air + water + earth);

function mulberry32(seed) {
  return function rng() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);
const randPattern = () => patterns[Math.floor(rng() * 16)];

// 7 structured boards (uniform-fortune extremes + mixes) + 40 seeded random
// boards. Same battery used throughout this round for reproducibility.
const BOARDS = [
  ['2222', '2211', '2121', '2221'],
  ['1122', '1122', '1122', '1122'],
  ['1221', '1221', '1221', '1221'],
  ['2211', '1122', '2211', '1122'],
  ['1221', '2221', '1221', '2221'],
  ['1122', '2221', '1122', '2221'],
  ['2221', '1122', '2221', '1122'],
];
for (let i = 0; i < 40; i++) BOARDS.push([randPattern(), randPattern(), randPattern(), randPattern()]);

// Realistic client input for the 3 methods that require it beyond the
// board. Values chosen so the condition genuinely fires at least once
// (verified by direct inspection of each executor), not arbitrary filler.
const DYN_FIELDS_BY_QUESTION = {
  'q-dig-direction': { dynFields: { quarter1Pattern: '2111', quarter2Pattern: '1112', quarter3Pattern: '1212', quarter4Pattern: '1112' } },
  'q-mother': { dynFields: { motherCastPeriod: 'לילה' } },
  'q-marriage-chastity': { dynFields: { candidate: 'לדוגמה', castConfirmedOnName: true } },
  'q-marriage-woman-quality': { dynFields: { candidate: 'לדוגמה', castConfirmedOnName: true } },
};
const MISSING_INPUT_CAPABLE_METHODS = new Set([
  'hidden.p188.quarterDirection',       // printed p188: four independent per-quarter castings
  'mother.p257.statusDayNight',         // printed p257: rule applies only when cast at night
  'marriage.p205.modestyPurity',        // printed p205: "اكمل الرمل على إسمها" — named-cast gate, enforced as a hard executor precondition
  'marriage.p208.womanQualityH5H4',     // printed p208: same chapter opener/named-cast gate as marriage.p205.modestyPurity
]);

// Per-method classifier for the 23 methods that never use verdict.positive.
// Each returns 'decisive' | 'descriptive' | 'no-decision' for one board's
// executor result. Citations point at the SAME executor comments already
// in kashf-canonical-executors.js, not re-derived here.
const CATEGORICAL_RULES = {
  // Direct, specific resolved facts the method's own scope presents as
  // answering the exact question asked -> decisive when resolved.
  'illness.bodyPart.h6Figure': (r) => (r.bodyPartHebrew != null ? 'decisive' : 'no-decision'),
  'pregnancy.p191.genderH5': (r) => (r.gender != null ? 'decisive' : 'no-decision'),
  'siblings.p182.seniority': (r) => (r.senioritySignal !== 'unresolved' ? 'decisive' : 'no-decision'),
  'marriage.p204.previousStatusH7inH10': (r) => (r.previousStatus != null ? 'decisive' : 'no-decision'),
  'relocation.p183.currentVsNewPlace': (r) => (r.sourceOutcome !== 'unresolved' ? 'decisive' : 'no-decision'),
  'relocation.p183.stayMoveH1H2': (r) => (r.decision !== 'unresolved' ? 'decisive' : 'no-decision'),
  'pregnancy.p191-192.miscarriageRedH7NakisH8': (r) => (r.miscarriageSign === true ? 'decisive' : 'no-decision'),
  'child.p194.healthTrajectoryH6H8': (r) => (r.longTermOutcome !== 'unresolved' ? 'decisive' : 'no-decision'),
  'marriage.p204.dowryH8': (r) => (r.isLargeDowry === true ? 'decisive' : 'no-decision'),
  'money.p179.sourceByIncomingHonorHouse': (r) => (r.sourceResolved === true ? 'decisive' : 'no-decision'),
  'money.p181.recast25811': (r) => (r.sourceOutcome !== 'unresolved' ? 'decisive' : 'no-decision'),
  'love.p204.attentionFireRows1713': (r) => (r.sourceConditionMet === true ? 'decisive' : 'no-decision'),
  'missing.p249.returnAnglesJudge': (r) => (r.returnIndicatedForMale === true ? 'decisive' : 'no-decision'),
  'theft.p224.relationshipH7Recurrence': (r) => (r.relationResolved === true ? 'decisive' : 'no-decision'),
  'illness.p197.h1h8ElementHumor': (r) => (r.sameElement === true ? 'decisive' : 'no-decision'),
  'friends.p263.h1h11': (r) => (r.pairEvidence != null || r.derivedEvidence != null ? 'decisive' : 'no-decision'),
  'hidden.p188.quarterDirection': (r) => (Array.isArray(r.suspected) && r.suspected.length === 1 && Array.isArray(r.unresolved) && r.unresolved.length === 0 ? 'decisive' : 'no-decision'),

  // Genuinely always-decisive categorical classifiers: every board yields
  // ONE specific, source-grounded value that directly answers the exact
  // question asked (not a side-effect multi-house dump) — confirmed by
  // re-reading both the executor and the question-bank.js description.
  // marriage.p211.dissolutionH7StateMatrix (q-divorce, "will they
  // separate?"): an 8-way classification over H7's full state space,
  // every branch a concrete, specific prediction about the marriage.
  'marriage.p211.dissolutionH7StateMatrix': () => 'decisive',
  // profession.p254.h9Planet (q-profession, "what profession suits me?"):
  // H9's ruling planet always maps to one specific profession text; every
  // one of the 16 patterns is covered (verified: field counts summed to
  // the full board count in this round's audit).
  'profession.p254.h9Planet': () => 'decisive',

  // Explicitly DESCRIPTIVE per the executor's own documented scope —
  // real source content, but never claimed by the source (or by this
  // engine's own comments) to decide the question asked.
  // general.p174.h1h2h4h7h10h15 (q-general-state, "מה מצבי הכללי?"):
  // own output text states "אינו מוסר כאן נוסחת רוב, שקלול בין הבתים או
  // פסק כן/לא יחיד" — no aggregate verdict; a 6-house status report only.
  // The UI's own desc already frames this as "סקירה כללית" (a general
  // overview), not a yes/no.
  'general.p174.h1h2h4h7h10h15': () => 'descriptive',
  // lifespan.p264.stagesH11H9H7 (q-lifespan-stages): own output text
  // states "אינה מחשבת את מספר שנות החיים" — explicitly not a lifespan
  // computation, just a 3-stage planetary-rulership mapping. The UI's own
  // desc says the same: "לא חישוב שנות חיים".
  'lifespan.p264.stagesH11H9H7': () => 'descriptive',
  // theft.p225.thiefDescriptionH7 (q-theft-who, "מי גנב?"): own fields
  // identityResolved/guiltProven are hard-coded false, and its own output
  // text says "אינו מזהה אדם מסוים ואינו מוכיח אשמה" — a physical/
  // character profile only, never an identity or proof.
  'theft.p225.thiefDescriptionH7': () => 'descriptive',
  // prisoner.p272.releaseManner (q-prisoner-release-manner): `positive`
  // stays null in every branch by design -- the executor deliberately
  // never asserts that voluntary or involuntary exit is the "good"
  // outcome (the source states only the MANNER of exit, not its value).
  // Any named branch (involuntary/voluntary/conflicting) is real,
  // source-grounded descriptive content; only the true no-signal branch
  // ("unresolved", none of the five houses clearly saad/nahs) is no-decision.
  'prisoner.p272.releaseManner': (r) => (r.branch !== 'unresolved' ? 'descriptive' : 'no-decision'),

  // Split case: travel.p240.roadCautionsH9H7 (q-travel-danger). H9's
  // fortune (h9Evidence) is a genuine decisive safety signal when H9 is
  // not mixed — but H7's element-based caution TYPE (h7Caution) is always
  // present regardless, and only names a hazard CATEGORY, never a safety
  // verdict. When H9 is mixed, h9Evidence is null and only the
  // descriptive h7Caution remains; the source gives no safety ruling at
  // all on that board.
  'travel.p240.roadCautionsH9H7': (r) => (r.h9Evidence != null ? 'decisive' : r.h7Caution != null ? 'descriptive' : 'no-decision'),

  // travel.p244.returnH1H2H9 (q-traveler-return): kept here (not in the
  // positive-field group) because verdict.positive is wired only to the
  // allBeneficIncoming branch, which is confirmed UNREACHABLE (0/65536,
  // see _test_kashf_rare_branch_reachability.mjs) — reading positive
  // alone would misreport this method as permanently no-decision even on
  // the hardship branch, which the source does decide.
  'travel.p244.returnH1H2H9': (r) => (r.sourceOutcome !== 'unresolved' ? 'decisive' : 'no-decision'),
};

const ids = Object.keys(KASHF_QUESTION_ROUTES).sort();
const perQuestion = [];
let totalRunnable = 0;

for (const id of ids) {
  const route = resolveKashfRouteByQuestionId(id);
  if (route.canRunKashf !== true) continue;
  totalRunnable++;
  const methodId = route.kashfMethodId;
  const extraContext = DYN_FIELDS_BY_QUESTION[id] || {};
  let decisiveCount = 0, descriptiveOnlyCount = 0, noDecisionCount = 0, total = 0;

  for (const mothers of BOARDS) {
    const board = buildRamlBoardFromMothers(mothers);
    const reading = buildKashfReadingByQuestionId(board, id, { question: 'test', ...extraContext });
    if (!reading || reading.valid !== true) continue;
    total++;
    const execResult = reading?.primaryFormula?.result?.executorResult;
    let outcome;
    if (CATEGORICAL_RULES[methodId]) {
      outcome = execResult ? CATEGORICAL_RULES[methodId](execResult) : 'no-decision';
    } else {
      const positive = reading?.primaryFormula?.verdict?.positive;
      outcome = typeof positive === 'boolean' ? 'decisive' : 'no-decision';
    }
    if (outcome === 'decisive') decisiveCount++;
    else if (outcome === 'descriptive') descriptiveOnlyCount++;
    else noDecisionCount++;
  }

  perQuestion.push({
    id, methodId, decisiveCount, descriptiveOnlyCount, noDecisionCount, total,
    decisiveRate: total > 0 ? decisiveCount / total : 0,
    categorical: Boolean(CATEGORICAL_RULES[methodId]),
    missingInputCapable: MISSING_INPUT_CAPABLE_METHODS.has(methodId),
  });
}

const decisiveAtLeastOnce = perQuestion.filter((q) => q.decisiveCount > 0).length;
const decisiveOnAllBoards = perQuestion.filter((q) => q.total > 0 && q.decisiveCount === q.total).length;
const descriptiveOnlyNeverDecisive = perQuestion.filter((q) => q.decisiveCount === 0 && q.descriptiveOnlyCount > 0).length;
const noDecisionOnEveryBoard = perQuestion.filter((q) => q.decisiveCount === 0 && q.descriptiveOnlyCount === 0).length;
const missingInputCapable = perQuestion.filter((q) => q.missingInputCapable).length;

fs.writeFileSync('/tmp/kashf_verdict_rate_audit.json', JSON.stringify({
  totalQuestions: Object.keys(KASHF_QUESTION_ROUTES).length,
  routedToReady: totalRunnable,
  decisiveAtLeastOnce,
  decisiveOnAllBoards,
  descriptiveOnlyNeverDecisive,
  noDecisionOnEveryBoard,
  missingInputCapable,
  boardsUsed: BOARDS.length,
  perQuestion,
}, null, 1));

console.log('Total questions in bank:', Object.keys(KASHF_QUESTION_ROUTES).length);
console.log('Routed to a ready method (canRunKashf=true):', totalRunnable);
console.log(`Decisive verdict on >=1 of ${BOARDS.length} boards:`, decisiveAtLeastOnce);
console.log(`Decisive verdict on ALL ${BOARDS.length} boards:`, decisiveOnAllBoards);
console.log('Descriptive-only on every tested board (real source content, never a decisive verdict):', descriptiveOnlyNeverDecisive);
console.log('No decision at all on every tested board (all confirmed reachable-but-rare, see _test_kashf_rare_branch_reachability.mjs — not bugs):', noDecisionOnEveryBoard);
console.log('Of the above, methods that additionally require client input beyond the board (architectural, not a source gap):', missingInputCapable);

// Sanity assertions.
// 2026-10-06: four closed sub-rules opened and routed this round
// (q-illness-duration-risk, q-illness-sensory-signs,
// q-pregnancy-maternal-safety, q-child-wellbeing) raised this from 98 to 102.
assert.equal(totalRunnable, 102, 'routed-to-ready count reflects the four p192/194/196 methods opened 2026-10-06');
assert.ok(decisiveAtLeastOnce <= totalRunnable && decisiveOnAllBoards <= decisiveAtLeastOnce, 'counts are internally consistent');
assert.equal(decisiveAtLeastOnce + descriptiveOnlyNeverDecisive + noDecisionOnEveryBoard, totalRunnable, 'every routed method falls into exactly one of: decisive at least once, descriptive-only, or no-decision-only');

const expectedDescriptiveOnly = new Set(['q-general-state', 'q-lifespan-stages', 'q-theft-who', 'q-prisoner-release-manner']);
const actualDescriptiveOnly = new Set(perQuestion.filter((q) => q.decisiveCount === 0 && q.descriptiveOnlyCount > 0).map((q) => q.id));
assert.deepEqual(actualDescriptiveOnly, expectedDescriptiveOnly, 'the descriptive-only set matches the four methods whose own executor text disclaims a decisive verdict');

const expectedNoDecisionOnly = new Set([
  'q-miscarriage', 'q-livelihood-arrive', 'q-traveler-return', 'q-missing-return', 'q-fear-punishment',
  // Added 2026-10-05 with the new q-missing-return-timing route: its
  // positive branches require H10=H11=Tariq(1111) or H10=Tariq(1111)+
  // H11=Ijtima(2112) specifically -- both real, reachable combinations
  // (the same-day branch is exercised directly by a hand-picked real
  // board in _test_kashf_missing_p249_return_life.mjs), just not hit by
  // any of this file's 47 generic sample boards. Same category as the
  // other five: a confirmed-reachable rare condition, not a bug.
  'q-missing-return-timing',
  // q-missing-in-city was in this set only while routed to the
  // now-withdrawn missing.p249.inCitySignAwtad (all four Awtad uniformly
  // dakhil/kharij, ~0.39% of boards -- too rare to hit in this file's 47
  // sample boards). Re-audited 2026-10-05 and re-pointed to
  // missing.p249.inCitySignH1H4 (combine H1+H4; see
  // _test_kashf_missing_p249_in_city.mjs), whose dakhil/kharij condition
  // is common enough that it now fires decisively on >=1 of the 47
  // boards below, moving q-missing-in-city out of this set entirely.
  //
  // q-missing-arriving (missing.p249.arrivalSignH3H15) added here
  // 2026-10-06: re-audited a 4th time, independently, and demoted to
  // descriptive-only -- its AND-based positive verdict rested on a
  // single analogy to a grammatically different clause (a named-figure
  // subject vs. this clause's abstract "his arrival" referent) and was
  // withdrawn as unproven; see the method's own registry notes. It now
  // always returns positive:null, with no CATEGORICAL_RULES entry below
  // (unlike the four prose-level "descriptive-only" methods, it has no
  // resolved/unresolved axis to map -- h3Dakhil/h15Dakhil are always
  // populated regardless of outcome), so this file's own categorization
  // correctly places it in no-decision-only, not descriptive-only.
  'q-missing-arriving',
  // Added 2026-10-06 with the three methods opened this round whose
  // positive/negative conditions are real and independently confirmed
  // reachable on hand-picked real boards (see
  // _test_kashf_p192_194_196_closed_subrules.mjs), just narrower than any
  // of this file's 47 generic sample boards happen to satisfy:
  // q-illness-duration-risk needs H1's own pattern to literally recur at
  // H6 or H8; q-illness-sensory-signs needs H1=Ahyan(1222) recurring at
  // H6/H8, or a Saturn/Jupiter figure at H6/H8; q-pregnancy-maternal-safety
  // needs H6, H8 AND H12 to be simultaneously pure-benefic. (The fourth
  // method opened the same round, q-child-wellbeing, needs only a 2-house
  // AND and does fire decisively on >=1 of the 47 boards, so it is not in
  // this set.)
  'q-illness-duration-risk',
  'q-illness-sensory-signs',
  'q-pregnancy-maternal-safety',
]);
const actualNoDecisionOnly = new Set(perQuestion.filter((q) => q.decisiveCount === 0 && q.descriptiveOnlyCount === 0).map((q) => q.id));
assert.deepEqual(actualNoDecisionOnly, expectedNoDecisionOnly, 'the no-decision-only set matches the ten exhaustively-accounted-for rare/demoted conditions exactly');

console.log('Kashf verdict-rate audit: PASS');
