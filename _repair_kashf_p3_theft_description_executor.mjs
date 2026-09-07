#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p3_theft_description_executor.mjs';
let text = fs.readFileSync(patcherPath, 'utf8');

const oldAssertion = `    "assert(String(thiefDescriptionReading.verdict?.text || '').includes('תיאור הגנב'), 'thief-description verdict is explicitly descriptive');",`;
const newAssertion = `    "assert(String(thiefDescriptionReading.verdict?.text || '').includes('רחב בטן'), 'thief-description verdict renders the source descriptive profile');",`;

if (text.includes(oldAssertion)) {
  text = text.replace(oldAssertion, newAssertion);
  fs.writeFileSync(patcherPath, text);
} else if (!text.includes('thief-description verdict renders the source descriptive profile')) {
  throw new Error('Could not repair thief-description contract assertion');
}

const result = spawnSync('node', [patcherPath], { stdio: 'inherit' });
process.exit(result.status ?? 1);
