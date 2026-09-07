#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p12_illness_recovery_h15.mjs';
let source = fs.readFileSync(patcherPath, 'utf8');

const oldSentence = "המקור אינו אומר כאן שהחולה לא יתרפא לעולם ואינו נותן כאן דין מוות.";
const newSentence = "המקור אינו שולל כאן החלמה עתידית ואינו נותן כאן דין מוות.";
if (!source.includes(oldSentence)) throw new Error('P12 malefic output sentence not found');
source = source.replace(oldSentence, newSentence);

const marker = "if (!tests.includes('// ── P12 illness recovery p196 H15 executor')) {";
if (!source.includes(marker)) throw new Error('P12 test insertion marker not found');

const migration = String.raw`
// q-illness-heal is no longer part of the generic hard-stop regression list.
tests = tests.replace(
  "for (const qid of ['q-promise', 'q-fear', 'q-sorcery', 'q-sea-voyage', 'q-prisoner', 'q-friends', 'q-stability', 'q-missing-alive', 'q-illness-heal']) {",
  "for (const qid of ['q-promise', 'q-fear', 'q-sorcery', 'q-sea-voyage', 'q-prisoner', 'q-friends', 'q-stability', 'q-missing-alive']) {"
);
tests = tests.replace(
  "assert(canRunKashfMethod('illness.p196.outcomeH15') === false, 'pending executor cannot run even when source status is ready');",
  "assert(canRunKashfMethod('illness.p196.outcomeH15') === true, 'p196 H15 executor can run after explicit canonical cutover');"
);

`;
source = source.replace(marker, migration + marker);
fs.writeFileSync(patcherPath, source);

const check = spawnSync('node', ['--check', patcherPath], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const run = spawnSync('node', [patcherPath], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);
console.log('Repaired and executed P12 illness-recovery patcher.');
