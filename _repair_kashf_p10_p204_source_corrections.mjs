#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p10_p204_source_corrections.mjs';
let source = fs.readFileSync(patcherPath, 'utf8');

const brokenBoundary = "const previousFnEnd = executors.indexOf('\\n}\\n\\nconst CUSTOM_EXECUTORS', previousFnStart);";
const fixedBoundary = "const previousFnEnd = executors.indexOf('\\n}\\n\\n\\nfunction computeRulerConditionP257', previousFnStart);";
if (!source.includes(brokenBoundary)) throw new Error('Expected P10 previous-function end marker not found');
source = source.replace(brokenBoundary, fixedBoundary);

const harmfulGlobalTestRename = 'tests = tests.replaceAll(oldMethodId, newMethodId);\n';
if (!source.includes(harmfulGlobalTestRename)) throw new Error('Expected harmful global P8 test rename not found');
source = source.replace(harmfulGlobalTestRename, '');

fs.writeFileSync(patcherPath, source);

const check = spawnSync('node', ['--check', patcherPath], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const run = spawnSync('node', [patcherPath], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);
console.log('Repaired and executed P10 p204 source-correction patcher.');
