import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildQawlSpiritualReading, writeQawlSpiritualReading } from './goral-hachol/engine/qawl-spiritual-kashf-bridge.js';
import { saveQawlSpiritualReadingToArchive, getGoralArchive } from './goral-hachol/engine/goral-client-archive.js';

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
assert.equal(jinn.qarinEvidence, null);

// A computed p58 example: H15=Jamaa (2222), so H15×H4 equals H4.
// The whole valid board has 36 open points, hence the conditional jinn branch runs.
const qarinBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const qarin = buildQawlSpiritualReading(qarinBoard, 'q-jinn-type');
assert.equal(qarin.openCount, 36);
assert.equal(qarin.remainder, 1);
assert.equal(qarinBoard.entries[14].pattern, '2222');
assert.equal(qarin.jinnTypeEvidence.resultPattern, qarinBoard.entries[3].pattern);
assert.equal(qarin.qarinEvidence?.id, 'same-fourth-figure-jamaa-in-mizan-qarin');
assert.equal(qarin.qarinEvidence?.sourcePage, 58);
assert.equal(qarin.verdict, null);
assert.match(writeQawlSpiritualReading(qarin), /ענף הקרין בעמ׳ 58/);
assert.equal(buildQawlSpiritualReading(qarinBoard, 'q-sorcery').qarinEvidence, null);

const rendered = writeQawlSpiritualReading(jinn);
assert(rendered.includes('36 נקודות פתוחות'));
assert(rendered.includes('15×4'));
assert(!rendered.includes('מיקום הכישוף'));
assert(!rendered.includes('שם המכשף'));

const noJinnBoard = buildRamlBoardFromMothers(['1111', '1122', '2212', '1221']);
const noJinn = buildQawlSpiritualReading(noJinnBoard, 'q-jinn-type');
assert.notEqual(noJinn.remainder, 1);
assert.equal(noJinn.jinnTypeEvidence, null);
assert.equal(noJinn.qarinEvidence, null);
assert.equal(buildQawlSpiritualReading(board, 'q-sorcerer').valid, false);
assert.equal(buildQawlSpiritualReading({ entries: board.entries.slice(0, 15) }, 'q-sorcery').status, 'invalid-board');
assert.equal(buildQawlSpiritualReading({ ...board, boardValidation: { isValid: false } }, 'q-sorcery').status, 'invalid-board');
const zeroOpenBoard = buildRamlBoardFromMothers(['2222', '2222', '2222', '2222']);
const zeroGeneral = buildQawlSpiritualReading(zeroOpenBoard, 'q-sorcery');
assert.equal(zeroGeneral.status, 'partial-source-unresolved-zero-open');
assert.equal(zeroGeneral.isqatEvidence, null);
assert.equal(zeroGeneral.remainder, null);
assert.equal(zeroGeneral.verdict, null);
assert.equal(buildQawlSpiritualReading(zeroOpenBoard, 'q-jinn-type').qarinEvidence, null);
const zeroFemale = buildQawlSpiritualReading(zeroOpenBoard, 'q-sorcery', { gender: 'אישה' });
assert(zeroFemale.directEvidence.some(e => e.id === 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children'));
assert(!writeQawlSpiritualReading(zeroFemale).includes('שארית 7'));

// The consultation archive preserves the external source and each piece of
// evidence without converting the result to an invented aggregate verdict.
const savedStore = new Map();
globalThis.localStorage = {
  getItem: key => savedStore.get(key) || null,
  setItem: (key, value) => savedStore.set(key, value),
  removeItem: key => savedStore.delete(key),
};
const saved = saveQawlSpiritualReadingToArchive({
  question: 'מה מצביע הלוח?', clientContext: { clientName: 'דוגמה' }, chart: board.entries,
}, general);
assert.equal(saved.ok, true);
assert.equal(saved.record.method, 'qawl');
assert.equal(saved.record.spiritualDiagnosis.verdict, null);
assert.equal(saved.record.spiritualDiagnosis.isqatEvidence.sourcePage, 58);
assert.equal(saved.record.chart.length, 16);
assert.equal(getGoralArchive()[0].method, 'qawl');
assert(!saved.record.conclusion.includes('מי עשה'));
delete globalThis.localStorage;

console.log('Qawl spiritual Kashf bridge: PASS');
