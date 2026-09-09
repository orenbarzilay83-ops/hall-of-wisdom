#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

const path = '_test_kashf_professional_verdict_safety.mjs';
let text = fs.readFileSync(path, 'utf8');

text = replaceOnce(
  text,
  "const p256BfSaturn = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1112' }) });",
  "const p256BfSaturn = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1221' }) });",
  'p256 Saturn fixture uses source-correct Aqla 1221',
);

text = replaceOnce(
  text,
  "  board: makeBoard({ 1:'1111', 10:'2221' }),\n});\nconst p257AppointmentNoExec = p257AppointmentNo.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p257AppointmentNoExec?.resultPattern === '1112' && p257AppointmentNoExec?.planetHebrew === 'שבתאי', 'p257 appointment negative fixture resolves to Saturn');",
  "  board: makeBoard({ 1:'1111', 10:'2112' }),\n});\nconst p257AppointmentNoExec = p257AppointmentNo.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p257AppointmentNoExec?.resultPattern === '1221' && p257AppointmentNoExec?.planetHebrew === 'שבתאי', 'p257 appointment negative fixture resolves to Saturn');",
  'p257 generated Saturn fixture uses source-correct 1221',
);

text = replaceOnce(
  text,
  "  board: makeBoard({ 11:'1122', 9:'1111', 7:'1112' }),",
  "  board: makeBoard({ 11:'1122', 9:'1111', 7:'1221' }),",
  'p264 H7 Saturn fixture uses source-correct Aqla 1221',
);

fs.writeFileSync(path, text, 'utf8');
console.log('Batch 11 source-correct planet fixture repair applied.');
