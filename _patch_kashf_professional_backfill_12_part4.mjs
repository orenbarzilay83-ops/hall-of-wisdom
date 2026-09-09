#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let text = fs.readFileSync(path, 'utf8');
text = replaceOnce(
  text,
  "    notes: 'Canonical p211 H7 matrix is source-closed against scan p211. Internal, external, fixed and mutable branches are all implemented. Internal/external figures use their pure source fortune. Fixed/mutable figures require the catalogue mixed tendency to realize the source's explicit سعد/نحس split; that promotion is method-local to p211 and must not leak to other methods. Benefic-external remains only possible separation, not certain separation; the adverse mutable source phrase that leaving is preferable is preserved as source wording, not converted into independent advisor advice.',",
  "    notes: 'Canonical p211 H7 matrix is source-closed against scan p211. Internal, external, fixed and mutable branches are all implemented. Internal/external figures use their pure source fortune. Fixed/mutable figures require the catalogue mixed tendency to realize the explicit سعد/نحس split in the source; that promotion is method-local to p211 and must not leak to other methods. Benefic-external remains only possible separation, not certain separation; the adverse mutable source phrase that leaving is preferable is preserved as source wording, not converted into independent advisor advice.',",
  'repair p211 registry note quote',
);
fs.writeFileSync(path, text, 'utf8');
console.log('Batch 12 p211 registry quote repair applied.');
