import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildQawlSpiritualReading, writeQawlSpiritualReading } from './goral-hachol/engine/qawl-spiritual-kashf-bridge.js';

// Fixed board from four mothers: 36 open points, 36 mod 7 = 1 (jinn).
// H15=1111 and H4=1221; multiplication must yield 2112 (air), never H15's water.
const board = buildRamlBoardFromMothers(['1111', '1121', '2212', '1221']);
assert.equal(board.boardValidation.isValid, true);
const general = buildQawlSpiritualReading(board, 'q-sorcery');
assert.equal(general.sourceVolume, 'al-qawl-al-jami');
assert.equal(general.openCount, 36);
assert.equal(general.remainder, 1);
assert.equal(general.isqatEvidence.sourcePage, 58);
assert(general.directEvidence.some(e => e.id === 'aqla-house13-bound-magic-sprinkled' && e.sourcePage === 57));
assert.equal(general.verdict, null); // No made-up aggregate yes/no.
assert(!general.evidence.some(e => e.id === 'jawdala-house13-confused-witchcraft')); // Not in this edition.

const jinn = buildQawlSpiritualReading(board, 'q-jinn-type');
assert.equal(jinn.jinnTypeEvidence.resultPattern, '2112');
assert.equal(jinn.jinnTypeEvidence.sourcePage, 58);
assert.equal(jinn.jinnTypeEvidence.id, 'air-figure-flying-jinn');

const rendered = writeQawlSpiritualReading(jinn);
assert(rendered.includes('36 נקודות פתוחות'));
assert(rendered.includes('15×4'));
assert(!rendered.includes('מיקום הכישוף'));
assert(!rendered.includes('שם המכשף'));

const noJinnBoard = buildRamlBoardFromMothers(['1111', '1122', '2212', '1221']);
const noJinn = buildQawlSpiritualReading(noJinnBoard, 'q-jinn-type');
assert.notEqual(noJinn.remainder, 1);
assert.equal(noJinn.jinnTypeEvidence, null);
assert.equal(buildQawlSpiritualReading(board, 'q-sorcerer').valid, false);
assert.equal(buildQawlSpiritualReading({ entries: board.entries.slice(0, 15) }, 'q-sorcery').status, 'invalid-board');
assert.equal(buildQawlSpiritualReading({ ...board, boardValidation: { isValid: false } }, 'q-sorcery').status, 'invalid-board');
const zeroOpenBoard = buildRamlBoardFromMothers(['2222', '2222', '2222', '2222']);
assert.equal(buildQawlSpiritualReading(zeroOpenBoard, 'q-sorcery').status, 'source-unresolved-zero-open');

console.log('Qawl spiritual Kashf bridge: PASS');
