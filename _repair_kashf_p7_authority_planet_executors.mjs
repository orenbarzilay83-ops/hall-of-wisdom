#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p7_authority_planet_executors.mjs';
let source = fs.readFileSync(patcherPath, 'utf8');

const scopeMarker = "if (!executors.includes('function computeHonorConditionP256')) {";
const scopeStart = source.indexOf(scopeMarker);
if (scopeStart < 0) throw new Error('Authority executor insertion scope not found');

const startMarker = '  const block = String.raw`';
const start = source.indexOf(startMarker, scopeStart);
if (start < 0) throw new Error('Broken String.raw executor block not found');
const contentStart = start + startMarker.length;

const endMarker = '\n`;\n  executors = executors.replace(anchor, block + anchor);';
const end = source.indexOf(endMarker, contentStart);
if (end < 0) throw new Error('Broken executor block end not found');

const inner = source.slice(contentStart, end);
const escaped = inner
  .replaceAll('`', '\\`')
  .replaceAll('${', '\\${');

const replacement = '  const block = `' + escaped + '\n`;';
source = source.slice(0, start) + replacement + source.slice(end + '\n`;'.length);
fs.writeFileSync(patcherPath, source);

const check = spawnSync('node', ['--check', patcherPath], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);

const run = spawnSync('node', [patcherPath], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);

console.log('Repaired and executed P7 authority planet patcher.');
