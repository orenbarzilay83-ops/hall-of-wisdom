#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

const path = '_test_kashf_canonical_routing.mjs';
let text = fs.readFileSync(path, 'utf8');

text = replaceOnce(
  text,
  "const AUTHORITY_P256_SATURN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2221']);",
  "const AUTHORITY_P256_SATURN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2112']);",
  'p256 canonical Saturn board',
);
text = replaceOnce(
  text,
  "assert(authoritySaturn.primaryFormula?.result?.executorResult?.h10Pattern === '1112', 'p256 negative fixture has H10=1112');",
  "assert(authoritySaturn.primaryFormula?.result?.executorResult?.h10Pattern === '1221', 'p256 negative fixture has source-correct Saturn H10=1221');",
  'p256 canonical Saturn pattern',
);
text = replaceOnce(
  text,
  "assert(authoritySaturn.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 resolves H10=1112 to Saturn');",
  "assert(authoritySaturn.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 resolves source-correct H10=1221 to Saturn');",
  'p256 canonical Saturn message',
);

text = replaceOnce(
  text,
  "const AUTHORITY_P257_NEGATIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1112']);",
  "const AUTHORITY_P257_NEGATIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1221']);",
  'p257 canonical Saturn board',
);
text = replaceOnce(
  text,
  "assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p257 negative fixture combines to 1112');",
  "assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.resultPattern === '1221', 'p257 negative fixture combines to source-correct Saturn 1221');",
  'p257 canonical Saturn result',
);

fs.writeFileSync(path, text, 'utf8');
console.log('Batch 11 canonical source-correct planet fixture repair applied.');
