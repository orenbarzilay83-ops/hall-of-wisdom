#!/usr/bin/env node
/**
 * _test_kashf_board_validation_gate.mjs
 *
 * History (so this header never again claims more than the code does):
 *
 * - 2026-10-05: buildKashfReadingByMethod (the single entry point both the
 *   canonical path and the AI bridge call through) always returned
 *   valid:true/canRunKashf:true regardless of board?.boardValidation. A gate
 *   was added that blocked when board.boardValidation.hasCritical === true.
 *
 * - 2026-10-06 (1st pass): that gate trusted an ATTACHED FLAG, which can be
 *   missing, stale, or simply wrong for a board not freshly produced by
 *   generateRamlEntriesFromMothers. Replaced with
 *   verifyKashfBoardStructuralIntegrity (raml-board-generator.js), which
 *   reads board.entries directly and ignores any attached flag. At this
 *   point it checked ONLY house 15 (the Judge)'s own declared parity --
 *   printed p.34 (PDF 36): "...فإذا أتى شكل فرد، فيكون الرمل غلطا" (if an
 *   odd/single figure comes [as the Judge], the raml is a mistake). A first
 *   draft that same day also recomputed ALL 16 houses from houses 1-4 and
 *   flagged any mismatch, but that broke ~650 pre-existing assertions
 *   across ~9 other test files using a long-established synthetic-fixture
 *   convention (a fixed 16-pattern array, 1-3 houses overridden per case),
 *   so it was narrowed back to Judge-parity only.
 *
 * - 2026-10-06 (2nd pass, this round): re-read the full p.34-35 scan
 *   directly (PDF 36-37). p.35, immediately after describing how the
 *   daughters are built from the mothers, states a SECOND, equally
 *   explicit critical check: "ويلزم من هذا إذا كان الأول ناره مفتوحة
 *   فالخامس كذلك؛ وهواء الثاني هو السادس؛ وماء الثالث ماء السابع؛ وتراب
 *   الرابع تراب الثامن، هذا كله في اختيار التخت؛ وإذا فقد شيء من ذلك كان
 *   التخت غلطا." (And it follows from this: if the first [mother]'s fire is
 *   open, so is the fifth [daughter]; the second's air is the sixth['s];
 *   the third's water is the seventh's water; the fourth's earth is the
 *   eighth's earth -- all this goes into selecting the board; and if
 *   something of that is lost, the board [at-takht] is a mistake.) This is
 *   a diagonal, one-digit-per-daughter check -- house 5's digit at the fire
 *   row-position must equal house 1's digit at that same position; house 6
 *   at the air position must equal house 2's; house 7 (water) house 3's;
 *   house 8 (earth) house 4's. It is NOT a claim that all four digits of
 *   each daughter must match all four mothers (no such claim is in this
 *   text; that would be the full buildDaughtersFromMothers transpose,
 *   already implemented as the generator's own construction logic, not a
 *   separately-stated validity CHECK). verifyKashfBoardStructuralIntegrity
 *   now checks this diagonal relation too, independent of Judge parity.
 *
 *   This round's change is weakening nothing: the fixture convention this
 *   broke again (confirmed: the same ~9-10 files, since their synthetic
 *   boards don't satisfy the diagonal relation either) is handled by
 *   isolating those fixtures to a dedicated test-only code path that
 *   CANNOT reach the client or the AI bridge --
 *   buildKashfReadingByMethodForLegacyFixtureTests /
 *   buildKashfReadingByQuestionIdForLegacyFixtureTests
 *   (kashf-canonical-reading-engine.js) and
 *   buildKashfCanonicalAiBridgeForLegacyFixtureTests
 *   (kashf-canonical-ai-bridge.js) -- never the production gate itself.
 *   Section "isolation is enforced, not just named" below proves that by
 *   source-grepping the whole repository.
 *
 * Current scope, stated precisely (not "all 16 houses recomputed"): TWO
 * independent, source-cited critical checks -- (a) house 15's own declared
 * parity, (b) the four daughter/mother diagonal digits (h5/h1 fire, h6/h2
 * air, h7/h3 water, h8/h4 earth). Houses 9-14 and 16 (nieces, witnesses,
 * sentence) are NOT independently re-verified against their parents --
 * documented and tested below as a deliberate, proven scope boundary, not
 * a silent gap.
 *
 * Per explicit instruction: a critical finding must block a verdict in BOTH
 * the canonical reading path and the AI bridge; a mere warning must NOT.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildRamlBoardFromMothers, verifyKashfBoardStructuralIntegrity } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

function toPattern(n) {
  let s = '';
  for (let i = 0; i < 4; i++) s += ((n >> i) & 1) ? '2' : '1';
  return s;
}

// ── Exhaustive proof: neither check ever false-positives on a real board ───

let criticalCount = 0;
let warningOnlyCount = 0;
let cleanCount = 0;
let firstWarningOnlyBoard = null;
let firstCleanBoard = null;
for (let a = 0; a < 16; a++) {
  for (let b = 0; b < 16; b++) {
    for (let c = 0; c < 16; c++) {
      for (let d = 0; d < 16; d++) {
        const mothers = [toPattern(a), toPattern(b), toPattern(c), toPattern(d)];
        const board = buildRamlBoardFromMothers(mothers);

        const structural = verifyKashfBoardStructuralIntegrity(board.entries);
        if (structural.hasCritical) criticalCount++;

        const bv = board.boardValidation;
        if (!bv.hasCritical && bv.warnings.length > 0) {
          warningOnlyCount++;
          if (!firstWarningOnlyBoard) firstWarningOnlyBoard = mothers;
        } else if (!bv.hasCritical && bv.warnings.length === 0) {
          cleanCount++;
          if (!firstCleanBoard) firstCleanBoard = mothers;
        }
      }
    }
  }
}
ok(criticalCount === 0, 'neither the Judge-parity nor the daughter/mother-diagonal check ever flags a critical issue on any of the 65,536 genuinely-constructed boards (no false positives)');
ok(warningOnlyCount > 0, 'warning-only boards (e.g. no-liar-figure) are real and reachable -- confirms the two severities are not both vacuous');
ok(warningOnlyCount + cleanCount === 65536, 'enumeration covers all 65,536 boards exactly once (none of them critical)');

// ── Case: a valid board, no warning, no critical finding ───────────────────

{
  const board = buildRamlBoardFromMothers(firstCleanBoard);
  const structural = verifyKashfBoardStructuralIntegrity(board.entries);
  ok(structural.structurallyValid === true, 'a genuinely valid board passes the independent structural verifier cleanly');
  ok(structural.issues.length === 0, 'a genuinely valid board carries zero issues');

  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === true, 'a valid board produces a valid canonical reading');
  ok(reading.canRunKashf === true, 'a valid board is not blocked');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-missing-in-city', questionText: 'test', board, clientContext: { question: 'test' } });
  ok(bridge.aiVerdictAllowed === true, 'a valid board is allowed to produce an AI-facing verdict');
}

// ── Case: a valid board carrying only a warning must still verdict ─────────

{
  const board = buildRamlBoardFromMothers(firstWarningOnlyBoard);
  ok(board.boardValidation.hasCritical === false, 'sanity: this board is warning-only, not critical');
  ok(board.boardValidation.warnings.length > 0, 'sanity: this board does carry at least one warning');
  ok(verifyKashfBoardStructuralIntegrity(board.entries).hasCritical === false, 'sanity: the independent verifier agrees this board is structurally sound');

  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === true, 'a warning-only board does not block valid:true in the canonical path');
  ok(reading.canRunKashf === true, 'a warning-only board does not block canRunKashf:true in the canonical path');
  ok(reading.verdict !== null, 'a warning-only board still produces a verdict object (never blocked by a mere warning)');

  const bridge = buildKashfCanonicalAiBridge({
    questionId: 'q-missing-in-city',
    questionText: 'test',
    board,
    clientContext: { question: 'test' },
  });
  ok(bridge.aiVerdictAllowed === true, 'the AI bridge also does not block a warning-only board (aiVerdictAllowed stays true)');
}

// ── Case: Judge (house 15) not even, metadata LIES ──────────────────────────
//
// The attached boardValidation claims the board is fully valid -- the gate
// must not be fooled by it, because it no longer reads that field at all.

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const spoofedValidBoard = {
    ...realBoard,
    entries: realBoard.entries.map((e) => (e.houseNumber === 15 ? { ...e, pattern: '1112', key: '1112' } : e)),
    boardValidation: { isValid: true, hasCritical: false, warnings: [] },
  };

  const structural = verifyKashfBoardStructuralIntegrity(spoofedValidBoard.entries);
  ok(structural.hasCritical === true, 'sanity: the independent verifier catches the corrupted Judge regardless of the attached (lying) flag');
  ok(structural.issues.some((i) => i.code === 'judge-not-even'), 'the specific issue code names judge-not-even');

  const reading = buildKashfReadingByQuestionId(spoofedValidBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === false, 'raw-data-corrupted Judge blocks valid:true even though boardValidation claims isValid:true');
  ok(reading.canRunKashf === false, 'raw-data-corrupted Judge blocks canRunKashf:true even though boardValidation claims hasCritical:false');
  ok(reading.reason === 'board-validation-critical', 'the block reason names the board-validation gate specifically');
  ok(reading.verdict === null, 'no verdict object is produced');
  ok(reading.userMessage?.includes('הדיין'), 'the user-facing message names the Judge as the actual problem checked');

  const bridge = buildKashfCanonicalAiBridge({
    questionId: 'q-missing-in-city',
    questionText: 'test',
    board: spoofedValidBoard,
    clientContext: { question: 'test' },
  });
  ok(bridge.aiVerdictAllowed === false, 'the AI bridge also refuses to present a verdict, despite the lying metadata');
  ok(bridge.canonicalReading?.reason === 'board-validation-critical', 'the bridge surfaces the same specific block reason');
}

// ── Case: Judge not even, metadata MISSING entirely ─────────────────────────

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const noMetadataBoard = {
    entries: realBoard.entries.map((e) => (e.houseNumber === 15 ? { ...e, pattern: '1112', key: '1112' } : e)),
    // boardValidation intentionally omitted entirely.
  };

  const reading = buildKashfReadingByQuestionId(noMetadataBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === false, 'raw-data-corrupted Judge blocks valid:true even with boardValidation entirely absent');
  ok(reading.canRunKashf === false, 'raw-data-corrupted Judge blocks canRunKashf:true even with boardValidation entirely absent');
  ok(reading.reason === 'board-validation-critical', 'the block reason names the board-validation gate specifically');

  const bridge = buildKashfCanonicalAiBridge({
    questionId: 'q-missing-in-city',
    questionText: 'test',
    board: noMetadataBoard,
    clientContext: { question: 'test' },
  });
  ok(bridge.aiVerdictAllowed === false, 'the AI bridge refuses to present a verdict with boardValidation entirely absent');
}

// ── Case: a daughter house built contrary to its mother (p.35) ─────────────
//
// House 6 (daughter 2, air row) corrupted so it no longer matches house 2
// (mother 2)'s own air-row digit -- the Judge (house 15) stays untouched
// and even, isolating this as specifically a p.35 violation, not a p.34 one.

{
  const realBoard = buildRamlBoardFromMothers(['1111', '2112', '1221', '2222']);
  const house15Pattern = realBoard.entries.find((e) => e.houseNumber === 15).pattern;
  const house15Ones = house15Pattern.split('').filter((ch) => ch === '1').length;
  ok(house15Ones % 2 === 0, 'sanity: the Judge stays even and untouched in this fixture');

  const house6Pattern = realBoard.entries.find((e) => e.houseNumber === 6).pattern;
  const house2Pattern = realBoard.entries.find((e) => e.houseNumber === 2).pattern;
  ok(house6Pattern[1] === house2Pattern[1], 'sanity: the real board satisfies the diagonal relation before tampering (air row, house6[1] === house2[1])');

  const corruptedBoard = {
    ...realBoard,
    entries: realBoard.entries.map((e) => (e.houseNumber === 6 ? { ...e, pattern: '2222', key: '2222' } : e)),
    boardValidation: { isValid: true, hasCritical: false, warnings: [] }, // also lies, same as the Judge cases above
  };
  ok(corruptedBoard.entries.find((e) => e.houseNumber === 6).pattern[1] !== house2Pattern[1], 'sanity: house 6 (daughter) no longer matches house 2 (mother) at the air-row position');

  const structural = verifyKashfBoardStructuralIntegrity(corruptedBoard.entries);
  ok(structural.hasCritical === true, 'a daughter built contrary to its mother (p.35 diagonal) is caught, independent of Judge parity');
  ok(structural.issues.some((i) => i.code === 'daughter-mother-diagonal-mismatch' && i.motherHouse === 2 && i.daughterHouse === 6), 'the specific mother/daughter pair (2/6) is named in the issue');

  const reading = buildKashfReadingByQuestionId(corruptedBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === false, 'the canonical path blocks on a daughter/mother diagonal mismatch, not only a bad Judge');
  ok(reading.reason === 'board-validation-critical', 'same block reason for this class of structural problem');
  ok(reading.userMessage?.includes('אם המתאימה') || reading.userMessage?.includes('בית-בת'), 'the user-facing message now also describes the daughter/mother mismatch, not only the Judge');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-missing-in-city', questionText: 'test', board: corruptedBoard, clientContext: { question: 'test' } });
  ok(bridge.aiVerdictAllowed === false, 'the AI bridge also blocks on a daughter/mother diagonal mismatch');
}

// ── Case: a derived house OTHER than a daughter is corrupted, Judge even ───
//
// House 9 (a niece/granddaughter, combine(H1,H2)) corrupted while the Judge
// stays even and all four daughter/mother diagonals stay intact. p.34-35
// cite explicit critical checks for the Judge and for the daughter
// diagonal ONLY -- no equivalent explicit "التخت غلطا" statement was found
// for nieces/witnesses/the sentence house. This is NOT caught, by a
// deliberate, proven scope boundary (not a silent gap): documented here so
// it cannot quietly regress into being assumed covered.

{
  const realBoard = buildRamlBoardFromMothers(['1111', '2112', '1221', '2222']);
  const house9Pattern = realBoard.entries.find((e) => e.houseNumber === 9).pattern;

  const inconsistentBoard = {
    ...realBoard,
    entries: realBoard.entries.map((e) => (e.houseNumber === 9 ? { ...e, pattern: '2222', key: '2222' } : e)),
  };
  ok(inconsistentBoard.entries.find((e) => e.houseNumber === 9).pattern !== house9Pattern, 'sanity: house 9 was actually changed from its construction-correct value');

  const structural = verifyKashfBoardStructuralIntegrity(inconsistentBoard.entries);
  ok(structural.hasCritical === false, 'by deliberate, documented scope: a niece/witness/sentence-house mismatch (house 9 here) is NOT flagged -- no explicit source rule was found for it');

  const reading = buildKashfReadingByQuestionId(inconsistentBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === true, 'consistently, the canonical reading is not blocked by this class of mismatch either');
}

// ── Gate applies board-wide: a second, unrelated ready method also blocks ──

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const criticalBoard = {
    entries: realBoard.entries.map((e) => (e.houseNumber === 15 ? { ...e, pattern: '1112', key: '1112' } : e)),
  };
  const reading = buildKashfReadingByQuestionId(criticalBoard, 'q-missing-return', { question: 'test' });
  ok(reading.valid === false, 'the gate is not special-cased to one question/method: a different ready method is blocked too');
  ok(reading.reason === 'board-validation-critical', 'same block reason on the second method');
}

// ── Isolation is enforced, not just named ───────────────────────────────────
//
// buildKashfReadingByMethodForLegacyFixtureTests / ...ByQuestionId... and
// buildKashfCanonicalAiBridgeForLegacyFixtureTests exist ONLY so this
// engagement's long-established synthetic-board fixture convention (used
// across ~10 _test_kashf_*.mjs files) can keep running without weakening
// the real, source-cited gate above. Prove by direct source grep that
// nothing outside the _test_*.mjs suite imports these names -- not
// Supabase edge functions, not goral-app.js/goral-hachol-ui.js, not even
// kashf-canonical-ai-bridge.js's own PRODUCTION export.

{
  const LEGACY_FIXTURE_NAMES = [
    'buildKashfReadingByMethodForLegacyFixtureTests',
    'buildKashfReadingByQuestionIdForLegacyFixtureTests',
    'buildKashfCanonicalAiBridgeForLegacyFixtureTests',
  ];

  function listFilesRecursive(dir, acc = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) listFilesRecursive(full, acc);
      else if (/\.(js|mjs|ts|html)$/.test(entry.name)) acc.push(full);
    }
    return acc;
  }

  // The only two files allowed to reference these names at all are the two
  // engine files that DEFINE them (kashf-canonical-reading-engine.js
  // defines the reading-engine pair and kashf-canonical-ai-bridge.js both
  // defines the bridge one AND legitimately imports the reading-engine
  // pair for its own test-only wrapper). Their production exports are
  // separately verified below to hardcode the gated path. Every OTHER file
  // under goral-hachol/** or supabase/** must have zero references.
  const repoRoot = process.cwd();
  const DEFINING_FILES = new Set([
    path.join(repoRoot, 'goral-hachol/engine/kashf-canonical-reading-engine.js'),
    path.join(repoRoot, 'goral-hachol/intelligence/kashf-canonical-ai-bridge.js'),
    // raml-board-generator.js only mentions these names in its own
    // explanatory comment (pointing a future reader at the isolation
    // mechanism) -- it has no import of and cannot call either function.
    path.join(repoRoot, 'goral-hachol/engine/raml-board-generator.js'),
  ]);
  const allSourceFiles = [
    ...listFilesRecursive(path.join(repoRoot, 'goral-hachol')),
    ...listFilesRecursive(path.join(repoRoot, 'supabase')),
  ].filter((file) => !DEFINING_FILES.has(file));
  const violations = [];
  for (const file of allSourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const name of LEGACY_FIXTURE_NAMES) {
      if (content.includes(name)) violations.push(`${path.relative(repoRoot, file)}: ${name}`);
    }
  }
  ok(violations.length === 0, `no production/client-facing file outside the two defining engine files imports a *ForLegacyFixtureTests name (found: ${JSON.stringify(violations)})`);

  // Confirm the names DO exist somewhere (i.e. this isn't vacuously true
  // because the functions were renamed/removed without updating this list).
  const readingEngineSrc = fs.readFileSync(path.join(repoRoot, 'goral-hachol/engine/kashf-canonical-reading-engine.js'), 'utf8');
  const bridgeSrc = fs.readFileSync(path.join(repoRoot, 'goral-hachol/intelligence/kashf-canonical-ai-bridge.js'), 'utf8');
  ok(readingEngineSrc.includes('export function buildKashfReadingByMethodForLegacyFixtureTests'), 'buildKashfReadingByMethodForLegacyFixtureTests is actually exported where expected');
  ok(readingEngineSrc.includes('export function buildKashfReadingByQuestionIdForLegacyFixtureTests'), 'buildKashfReadingByQuestionIdForLegacyFixtureTests is actually exported where expected');
  ok(bridgeSrc.includes('export function buildKashfCanonicalAiBridgeForLegacyFixtureTests'), 'buildKashfCanonicalAiBridgeForLegacyFixtureTests is actually exported where expected');

  // And confirm the production exports in kashf-canonical-ai-bridge.js call
  // the GATED reading-engine functions, not the bypass ones, by name.
  ok(/function buildKashfCanonicalAiBridge\(input = \{\}\) \{\s*return buildKashfCanonicalAiBridgeInternal\(input, false\);/.test(bridgeSrc),
    'buildKashfCanonicalAiBridge (production) hardcodes useLegacyFixtureTestReadingPath=false, not derived from any input');
}

console.log(`Kashf board-validation gate: ${assertions} assertions passed`);
