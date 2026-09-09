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
  "assert(p205LoveV57?.v57?.hebrewRule.includes('בבית החמישי'), 'p205 Hebrew operational knowledge now records H5 from the primary scan');",
  "assert(p205LoveV57?.v57?.hebrewRule.includes('בבית החמישה־עשר'), 'p205 Hebrew operational knowledge records visually verified H15 from the primary scan');",
  'p205 canonical H15 positive knowledge assertion',
);
text = replaceOnce(
  text,
  "assert(!p205LoveV57?.v57?.hebrewRule.includes('בבית החמישה־עשר'), 'p205 Hebrew operational knowledge no longer states H15');",
  "assert(!p205LoveV57?.v57?.hebrewRule.includes('בבית החמישי, המכונה כאן המבוקש'), 'p205 Hebrew operational knowledge no longer carries the mistaken H5 repair wording');",
  'p205 canonical mistaken-H5 negative assertion',
);
fs.writeFileSync(path, text, 'utf8');
console.log('p205 canonical H15 assertions repaired.');
