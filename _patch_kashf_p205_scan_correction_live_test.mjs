#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}

const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
let text = fs.readFileSync(path, 'utf8');
text = replaceOnce(
  text,
  "assert(p205RepairLive.canonicalRetrieval?.v57?.hebrewRule?.includes('בבית החמישי'), 'live p205 retrieval exposes corrected H5 knowledge');",
  "assert(p205RepairLive.canonicalRetrieval?.v57?.hebrewRule?.includes('בבית החמישה־עשר'), 'live p205 retrieval exposes visually verified H15 knowledge');",
  'p205 live H15 knowledge assertion',
);
fs.writeFileSync(path, text, 'utf8');
console.log('p205 live-bridge H15 assertion repaired.');
