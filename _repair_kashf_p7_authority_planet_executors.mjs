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

// The canonical reading entry point is (board, questionId, clientContext).
// Repair the staged P7 contracts which were authored with the first two args reversed.
const callRepairs = [
  ["buildKashfReadingByQuestionId('q-fame', AUTHORITY_P256_SUN_BOARD,", "buildKashfReadingByQuestionId(AUTHORITY_P256_SUN_BOARD, 'q-fame',"],
  ["buildKashfReadingByQuestionId('q-fame', AUTHORITY_P256_SATURN_BOARD,", "buildKashfReadingByQuestionId(AUTHORITY_P256_SATURN_BOARD, 'q-fame',"],
  ["buildKashfReadingByQuestionId('q-fame', AUTHORITY_P256_UNRESOLVED_BOARD,", "buildKashfReadingByQuestionId(AUTHORITY_P256_UNRESOLVED_BOARD, 'q-fame',"],
  ["buildKashfReadingByQuestionId('q-position-keep', AUTHORITY_P257_POSITIVE_BOARD,", "buildKashfReadingByQuestionId(AUTHORITY_P257_POSITIVE_BOARD, 'q-position-keep',"],
  ["buildKashfReadingByQuestionId('q-position-keep', AUTHORITY_P257_NEGATIVE_BOARD,", "buildKashfReadingByQuestionId(AUTHORITY_P257_NEGATIVE_BOARD, 'q-position-keep',"],
];
for (const [from, to] of callRepairs) {
  if (!source.includes(from)) throw new Error(`P7 test call not found for repair: ${from}`);
  source = source.replace(from, to);
}

fs.writeFileSync(patcherPath, source);

const check = spawnSync('node', ['--check', patcherPath], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);

const run = spawnSync('node', [patcherPath], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);

console.log('Repaired and executed P7 authority planet patcher.');
