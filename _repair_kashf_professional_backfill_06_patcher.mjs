#!/usr/bin/env node
import fs from 'node:fs';

const path = '_patch_kashf_professional_backfill_06.mjs';
let text = fs.readFileSync(path, 'utf8');
const from = "assert(p266ReturnExec?.returnIndicated === true && p266ReturnExec?.sourceOutcome === 'returns', 'p266 benefic-internal H1 + strong recurrence + benefic H16 gives return');";
const to = "assert(p266ReturnExec?.h1BeneficIncoming === true && p266ReturnExec?.appearsInStrongHouse === true && p266ReturnExec?.outcomeSupportsReturn === true && p266ReturnExec?.sourceOutcome === 'returns', 'p266 benefic-internal H1 + strong recurrence + benefic H16 gives return');";
if (!text.includes(from)) throw new Error('Batch 06 p266 assertion anchor not found');
text = text.replace(from, to);
fs.writeFileSync(path, text, 'utf8');
console.log('Batch 06 p266 assertion repaired.');
