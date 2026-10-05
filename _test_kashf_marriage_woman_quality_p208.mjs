#!/usr/bin/env node
/**
 * _test_kashf_marriage_woman_quality_p208.mjs
 *
 * Golden tests for marriage.p208.womanQualityH5H4 (q-marriage-woman-quality).
 *
 * Opened 2026-10-05, found re-reading p207-208 directly against the raw
 * scan while re-examining the adjacent marriage.p207-208.adulterySignsUnresolved
 * blocker. A genuinely separate نكتة from that blocker's own unresolved
 * "بيت التزويج" table -- see that method's registry notes for why the
 * two must not be conflated despite a partial figure-name overlap.
 *
 * Exact quote (p208, PDF 210): "نكتة: إن كان حل في الخامس النصرة
 * الداخلة، أو النصرة الخارجة، أو العقلة، فالمرأة جيدة ثابتة؛ وإن حل في
 * الميزان القبض الخارج، أو الطريق، أو الإجتماع، فعاقبتها غير حميدة،
 * وليس لك فيها بركة، وكذلك الرابع، لأنهما: بيوت العواقب."
 *
 * Same named-cast precondition chapter as marriage.p205.modestyPurity
 * ("كمل الرمل على إسمها" applies to every نكتة in it) -- boards below
 * were found by a brute-force search over all 65,536 mother combinations
 * so every branch is reached through the real board-generation math.
 */

import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { getKashfQuestionRoute, validateKashfQuestionRoutes } from './goral-hachol/registry/kashf-question-route-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; } }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after opening marriage.p208.womanQualityH5H4');
ok(validateKashfQuestionRoutes((id) => getKashfMethod(id)).valid, 'question route registry stays internally valid');

const method = getKashfMethod('marriage.p208.womanQualityH5H4');
ok(method.kashfRuntimeStatus === 'ready', 'marriage.p208.womanQualityH5H4 is ready');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(method.runtimeAllowed === true, 'runtime is allowed');
ok(method.kashfIntentId === 'marriage.womanQualitySign', 'registered under a new, distinct intent');
ok(/بيوت العواقب/.test(method.notes || ''), 'registry notes carry the exact photographed clause');
ok(/adulterySignsUnresolved/.test(method.notes || ''), 'registry notes cross-reference the still-blocked, distinct adultery-signs entry');
ok(/CONSERVATIVE BY DESIGN/.test(method.notes || ''), 'registry notes document the conservative positive-field design choice');
ok(hasCanonicalCustomExecutor('marriage.p208.womanQualityH5H4'), 'executor is reachable via dispatch');

const route = getKashfQuestionRoute('q-marriage-woman-quality');
ok(route != null, 'q-marriage-woman-quality route exists');
ok(route.kashfMethodId === 'marriage.p208.womanQualityH5H4', 'q-marriage-woman-quality routes to the correct executor');

const CONFIRMED_CONTEXT = { dynFields: { candidate: 'רחל', castConfirmedOnName: true } };

function resultFor(mothers, clientContext = CONFIRMED_CONTEXT) {
  const board = buildRamlBoardFromMothers(mothers);
  const reading = buildKashfReadingByQuestionId(board, 'q-marriage-woman-quality', clientContext);
  return reading?.primaryFormula?.result?.executorResult || null;
}

// Named-cast gate: no name/confirmation => no sign, regardless of board.
{
  const r1 = resultFor(['1111', '1111', '2111', '2111'], {});
  ok(r1?.branch === 'named-cast-not-confirmed', 'no clientContext: gate blocks with named-cast-not-confirmed');
  ok(r1?.positive === null, 'no clientContext: positive is null');

  const r2 = resultFor(['1111', '1111', '2111', '2111'], { dynFields: { candidate: 'רחל', castConfirmedOnName: false } });
  ok(r2?.branch === 'named-cast-not-confirmed', 'name but no confirmation checkbox: gate still blocks');

  const r3 = resultFor(['1111', '1111', '2111', '2111'], { dynFields: { candidate: '', castConfirmedOnName: true } });
  ok(r3?.branch === 'named-cast-not-confirmed', 'confirmation checked but no name: gate still blocks');
}

// Good-woman sign: H5 in {Nusra Dakhila, Nusra Kharija, Aqla}, no bad-outcome figure in H15/H4.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '2111', '2111']);
  const entries = board.entries || board;
  const h5 = entries.find((e) => Number(e.house || e.houseNumber) === 5);
  ok((h5.pattern || h5.key) === '1122', 'good case: real board lands H5=1122 (Nusra Kharija) as expected');

  const result = resultFor(['1111', '1111', '2111', '2111']);
  ok(result?.branch === 'good-stable-sign', 'good case: branch is good-stable-sign');
  ok(result?.goodWomanSign === true, 'good case: goodWomanSign is true');
  ok(result?.badOutcomeSign === false, 'good case: badOutcomeSign is false');
  ok(result?.positive === true, 'good case: positive is true');
  ok(result?.outputHebrew.includes('טובה ויציבה'), 'good case: outputHebrew states the traditional good/stable sign');
  ok(result?.outputHebrew.includes('לא קביעה עובדתית או מוסרית'), 'good case: outputHebrew hedges as a traditional sign, not a factual/moral determination');
  ok(result?.clientSafeHebrew?.length > 0, 'good case: clientSafeHebrew is populated');
}

// Poor-outcome sign: H15 or H4 in {Qabd Kharij, Tariq, Ijtima}, no good-woman figure in H5.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const entries = board.entries || board;
  const h15 = entries.find((e) => Number(e.house || e.houseNumber) === 15);
  ok((h15.pattern || h15.key) === '2222', 'bad case: real board sanity check for H15');

  const result = resultFor(['1111', '1111', '1111', '1111']);
  ok(result?.branch === 'poor-outcome-sign', 'bad case: branch is poor-outcome-sign');
  ok(result?.goodWomanSign === false, 'bad case: goodWomanSign is false');
  ok(result?.badOutcomeSign === true, 'bad case: badOutcomeSign is true');
  ok(result?.positive === null, 'bad case: positive stays null (conservative by design), never false');
  ok(result?.outputHebrew.includes('אין בה ברכה') || result?.outputHebrew.includes('עתידה אינו משובח'), 'bad case: outputHebrew states the traditional poor-outcome sign');
}

// Conflicting signs: both H5 good-figure AND H15/H4 bad-figure present.
{
  const result = resultFor(['1111', '1111', '2111', '2112']);
  ok(result?.branch === 'conflicting-signs', 'conflict case: branch is conflicting-signs');
  ok(result?.goodWomanSign === true && result?.badOutcomeSign === true, 'conflict case: both signs are present');
  ok(result?.positive === null, 'conflict case: positive is null, no forced winner');
  ok(result?.outputHebrew.includes('בלי הכרעה'), 'conflict case: outputHebrew states no forced verdict between the two signs');
}

// No applicable clause: neither figure set present.
{
  const result = resultFor(['1111', '1111', '1111', '1112']);
  ok(result?.branch === 'no-applicable-clause', 'none case: branch is no-applicable-clause');
  ok(result?.positive === null, 'none case: positive is null');
}

{
  const result = executeCanonicalCustomMethod('marriage.p208.womanQualityH5H4', { entries: [] }, CONFIRMED_CONTEXT);
  ok(result === null, 'marriage.p208.womanQualityH5H4: missing board data returns null rather than guessing');
}

console.log(`Kashf p208 marriage woman-quality golden tests: ${assertions} assertions, ${process.exitCode ? 'FAILED' : 'passed'}`);
