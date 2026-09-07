#!/usr/bin/env node
import fs from 'node:fs';

const path = '_test_kashf_canonical_routing.mjs';
let text = fs.readFileSync(path, 'utf8');
const logLine = 'console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);\n';
const guard = 'if (failed > 0) {\n';
const logIndex = text.indexOf(logLine);
const guardIndex = text.indexOf(guard);
if (logIndex < 0) throw new Error('Missing canonical test log line');
if (guardIndex < 0) throw new Error('Missing failure guard');
if (logIndex > guardIndex) {
  console.log('Canonical test log is already after P17 assertions.');
  process.exit(0);
}
text = text.slice(0, logIndex) + text.slice(logIndex + logLine.length);
const newGuardIndex = text.indexOf(guard);
text = text.slice(0, newGuardIndex) + logLine + text.slice(newGuardIndex);
fs.writeFileSync(path, text);
console.log('Moved canonical test summary after P17 assertions.');
