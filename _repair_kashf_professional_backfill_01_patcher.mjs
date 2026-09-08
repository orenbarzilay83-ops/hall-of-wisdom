#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_01.mjs';
let s = fs.readFileSync(path, 'utf8');
const replacements = [
  ["`saadNahs === 'saad'`", "\\`saadNahs === 'saad'\\`"],
  ['`certificationStatus: pending-backfill`', '\\`certificationStatus: pending-backfill\\`'],
  ['`clientFacingCertified:false`', '\\`clientFacingCertified:false\\`'],
  ['`clientAnswerDraft`', '\\`clientAnswerDraft\\`'],
  ['`clientAnswerDraft:null`', '\\`clientAnswerDraft:null\\`'],
];
for (const [from, to] of replacements) {
  if (!s.includes(from)) throw new Error('repair target missing: ' + from);
  s = s.split(from).join(to);
}
fs.writeFileSync(path, s);
console.log('Backfill patcher quoting repaired.');
