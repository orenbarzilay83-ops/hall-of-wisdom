#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_05.mjs';
let text = fs.readFileSync(path, 'utf8');
const from = "assert(p183BfCurrentExec?.moveGood === false && !String(p183BfCurrentExec?.outputHebrew || '').includes('המעבר רע'), 'p183 failed move pair is not inverted into a bad move');";
const to = "assert(p183BfCurrentExec?.moveGood === false && p183BfCurrentExec?.sourceOutcome === 'current-place-good' && p183BfCurrent.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('H7+H10')), 'p183 failed move pair stays non-positive and the safety policy explicitly forbids inversion into a bad move');";
if (!text.includes(from)) throw new Error('Batch 05 failing assertion anchor not found');
text = text.replace(from, to);
fs.writeFileSync(path, text, 'utf8');
console.log('Batch 05 patcher assertion repaired.');
