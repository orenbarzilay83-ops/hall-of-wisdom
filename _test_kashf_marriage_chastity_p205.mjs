#!/usr/bin/env node
/**
 * _test_kashf_marriage_chastity_p205.mjs
 *
 * Golden tests for marriage.p205.modestyPurity (q-marriage-chastity).
 * Repaired 2026-10-04: the canonical executor computeMarriageChastityPurityP205
 * reads purity (tahir/najis) from HAWI_FIGURE_NAMES_BY_ID where the printed
 * p205-206 scan states purity, uses saad/nahs only where the source itself
 * says saad/nahs, and derives the H7+H9 composite figure (combineRamlFigures)
 * instead of testing H7 and H9 individually. Boards below were found by a
 * brute-force search over all 65,536 mother combinations so every branch is
 * reached through the real board-generation math, not by mirroring the
 * executor's own if-statements.
 */

import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfV57Knowledge } from './goral-hachol/registry/kashf-v57-knowledge-registry.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

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

function resultFor(mothers, clientContext) {
  const board = buildRamlBoardFromMothers(mothers);
  const reading = buildKashfReadingByQuestionId(board, 'q-marriage-chastity', clientContext);
  return { reading, result: reading.primaryFormula?.result?.executorResult };
}

// ── Route contract ─────────────────────────────────────────────────────────
const route = resolveKashfRouteByQuestionId('q-marriage-chastity');
assert(route.canRunKashf === true, 'q-marriage-chastity route is runnable after the repair');
assert(route.kashfMethodId === 'marriage.p205.modestyPurity', 'q-marriage-chastity routes to marriage.p205.modestyPurity');

// ── Branch 1: pure signs (H1 pure, H1+H7 both pure) ─────────────────────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1111']);
  assert(reading.valid === true, 'pure-signs board is a valid reading');
  assert(result.branch === 'pure-signs', 'pure-signs board reaches the pure-signs branch');
  assert(result.positive === true, 'pure-signs board is positive');
  assert(result.h1Pattern === '1111' && result.h7Pattern === '1111', 'pure-signs board keeps expected H1/H7');
  assert(result.outputHebrew.includes('צורת בית 1 טהורה'), 'pure-signs board states H1 purity sign');
  assert(result.outputHebrew.includes('בית 1 ובית 7 שניהם טהורים'), 'pure-signs board states the alternate H1+H7 clause');
}

// ── Branch 2: impure signs (H1 impure; H7+H9 composite malefic) ─────────────
{
  const { reading, result } = resultFor(['1112', '1111', '1111', '1111']);
  assert(reading.valid === true, 'impure-signs board is a valid reading');
  assert(result.branch === 'impure-signs', 'impure-signs board reaches the impure-signs branch');
  assert(result.positive === false, 'impure-signs board is negative');
  assert(result.combinedH7H9Pattern === '1112', 'impure-signs board derives the expected H7+H9 composite');
  assert(result.outputHebrew.includes('צורת בית 1 טמאה'), 'impure-signs board states H1 impurity');
  assert(result.outputHebrew.includes('מזיקה — סימן לפריצות'), 'impure-signs board states the adverse composite-figure sign');
}

// ── Branch 3: mixed signs (H1 pure sign + adverse H7/H9 composite together) ─
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1121']);
  assert(reading.valid === true, 'mixed-signs board is a valid reading');
  assert(result.branch === 'mixed-signs', 'mixed-signs board reaches the mixed-signs branch');
  assert(result.positive === null, 'mixed-signs board has no single bounded polarity');
  assert(result.outputHebrew.includes('צורת בית 1 טהורה'), 'mixed-signs board keeps the positive H1 sign');
  assert(result.outputHebrew.includes('מזיקה — סימן לפריצות'), 'mixed-signs board keeps the adverse composite sign alongside it');
}

// ── Branch 4: no applicable clause ───────────────────────────────────────────
{
  const { reading, result } = resultFor(['2122', '1111', '1111', '2121']);
  assert(reading.valid === true, 'no-applicable-clause board is a valid reading');
  assert(result.branch === 'no-applicable-clause', 'board with no matching clause reaches the explicit no-rule branch');
  assert(result.positive === null, 'no-applicable-clause board makes no polarity claim');
  assert(result.outputHebrew.startsWith('אף אחד מסעיפי הסימנים (עמ׳ 205-206) אינו חל על צירוף הצורות הזה בלוח הנוכחי.'), 'no-applicable-clause board states the explicit no-rule-found message');
}

// ── Named clause coverage (each wording confirmed reachable on a real board) ─
{
  const { result } = resultFor(['1111', '1111', '1111', '2221']);
  assert(result.h1Pattern === result.h15Pattern, 'fully-pure-certain fixture matches H1 to Mizan');
  assert(result.outputHebrew.includes('טהורה כליל, אין בה ספק'), 'H1=Mizan-in-purity reaches the "fully pure, no doubt" clause');
}
{
  const { result } = resultFor(['1212', '1111', '1111', '2221']);
  assert(result.h1Pattern === result.h15Pattern, 'match-mizan-malefic fixture matches H1 to Mizan');
  assert(result.outputHebrew.includes('היא בהפך זאת'), 'H1=Mizan-malefic reaches the mirrored adverse clause');
}
{
  const { result } = resultFor(['1122', '1121', '1111', '1111']);
  assert(result.outputHebrew.includes('נשקף חשש שתתקלקל'), 'H1 saad+pure with H9 nahs reaches the "fear of later corruption" clause');
}
{
  const { result } = resultFor(['1112', '1112', '1111', '1111']);
  assert(result.outputHebrew.includes('אין חשש מרכילה'), 'H1 nahs with H9+Mizan pure reaches the "no fear of gossip" clause');
}

// ── sourceText / knowledge wiring ────────────────────────────────────────────
{
  const { reading } = resultFor(['1111', '1111', '1111', '1111']);
  const knowledge = getKashfV57Knowledge('marriage.p205.modestyPurity');
  assert(Boolean(knowledge), 'marriage.p205.modestyPurity has v57 knowledge registered');
  assert(reading.primaryFormula?.sourceText === knowledge?.v57?.hebrewRule, 'runtime sourceText is the registered Hebrew v57 rule');
  assert(reading.primaryFormula?.houses?.slice().sort().join(',') === '1,15,7,9'.split(',').sort().join(','), 'houses used are exactly H1, H7, H9, H15');
}

// ── Codex audit fix 1: v57 draft page shown by the app's book reader ────────
// kashf-v57-draft.html's p205 section must no longer describe the H7+H9
// clause as "both houses individually benefic" and must now describe a
// combined-figure operation, matching computeMarriageChastityPurityP205.
{
  const fs = await import('node:fs');
  const v57 = fs.readFileSync('./kashf-v57-draft.html', 'utf8');
  const p205Match = v57.match(/<section class="page[^"]*" id="p205">([\s\S]*?)<\/section>/);
  assert(Boolean(p205Match), 'kashf-v57-draft.html has a p205 section');
  const p205Html = p205Match ? p205Match[1] : '';
  assert(!p205Html.includes('צורות הבית השביעי והתשיעי מיטיבות'), 'v57 p205 no longer describes H7+H9 as two separately-benefic houses');
  assert(p205Html.includes('מהרכבת'), 'v57 p205 now describes the H7+H9 combined-figure operation');
  assert(p205Html.includes('תואם את המאזן וההתאמה מזיקה'), 'v57 p205 states the Mizan-match-malefic clause unambiguously (mirrors the purity-match clause)');
}

// ── Codex audit fix 2: the board must be confirmed cast on the woman's name ─
// (كمل الرمل على إسمها). No name-to-figure algorithm exists in the source for
// the primary board, so the executor reports whether the precondition was
// recorded rather than inventing a conversion.
{
  const { result: withoutName } = resultFor(['1111', '1111', '1111', '1111']);
  assert(withoutName.namedCastConfirmed === false, 'missing candidate name leaves namedCastConfirmed false');
  assert(withoutName.candidateName === null, 'missing candidate name reports candidateName as null');
  assert(withoutName.outputHebrew.includes('לא נרשם שם מועמדת'), 'missing-name evidence states the precondition was not confirmed');

  const { result: withName } = resultFor(['1111', '1111', '1111', '1111'], { dynFields: { candidate: 'רחל' } });
  assert(withName.namedCastConfirmed === true, 'recorded candidate name flips namedCastConfirmed to true');
  assert(withName.candidateName === 'רחל', 'recorded candidate name is carried through verbatim');
  assert(withName.outputHebrew.includes('מתועד כמוטל על שם המועמדת'), 'recorded-name evidence confirms the precondition');

  // question-bank.js: the candidate field for this question must be marked required.
  const fs = await import('node:fs');
  const bank = fs.readFileSync('./goral-hachol/ui/question-bank.js', 'utf8');
  const qStart = bank.indexOf("id: 'q-marriage-chastity'");
  const qChunk = bank.slice(qStart, qStart + 600);
  assert(qChunk.includes('required: true'), 'q-marriage-chastity candidate field is marked required in question-bank.js');
}

// ── Codex audit fix 3: client-facing text vs. detailed source evidence ──────
// The "read to client" text must be free of page citations and source-method
// markers; the full evidentiary text remains available separately for the
// advisor record.
{
  const { reading, result } = resultFor(['1112', '1111', '1111', '1111']);
  assert(typeof result.clientSafeHebrew === 'string' && result.clientSafeHebrew.length > 0, 'executor provides a non-empty clientSafeHebrew');
  assert(!result.clientSafeHebrew.includes('עמ'), 'clientSafeHebrew has no page citations');
  assert(!result.clientSafeHebrew.includes('وقيل'), 'clientSafeHebrew has no Arabic alternate-method markers');
  assert(!result.clientSafeHebrew.includes('שיטה חלופית'), 'clientSafeHebrew has no internal methodology notes');
  assert(result.outputHebrew.includes('עמ׳'), 'outputHebrew (the evidence record) keeps its page citations');

  const verdictText = reading.verdict?.text || reading.primaryFormula?.verdict?.text;
  assert(verdictText === result.clientSafeHebrew, 'the engine verdict surfaced to the UI uses clientSafeHebrew, not the full evidence text');

  const { writeCanonicalKashfReading } = await import('./goral-hachol/engine/kashf-canonical-narrative-writer.js');
  const html = writeCanonicalKashfReading(reading);
  const clientPanelStart = html.indexOf('קרא ללקוח');
  const clientPanelChunk = html.slice(clientPanelStart, clientPanelStart + 500);
  assert(!clientPanelChunk.includes('עמ׳ 205'), 'rendered client-reading panel has no page citation');
  assert(!clientPanelChunk.includes('وقيل'), 'rendered client-reading panel has no Arabic method markers');
  assert(html.includes('עדויות מקור מפורטות'), 'rendered advisor details panel exposes the full source-evidence text separately');
  assert(html.includes('עמ׳ 205'), 'the full evidence text (with its citation) is still present somewhere in the rendered output');
}

console.log(`Kashf marriage-chastity (p205) tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
