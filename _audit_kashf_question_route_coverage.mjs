#!/usr/bin/env node
/**
 * _audit_kashf_question_route_coverage.mjs
 *
 * P0 coverage gate.
 * Reads the classic-script Question Bank as source text, extracts every
 * q-* Question ID, and compares it with the explicit Kashf route registry.
 *
 * Coverage reached 100% on 2026-09-07. From this point forward, ANY new or
 * existing Question ID without an explicit Kashf route is a CI failure.
 * Structural defects also fail CI:
 * - duplicate Question IDs in the bank
 * - route IDs that do not exist in the bank
 * - malformed/non-q route IDs
 */

import fs from 'node:fs';
import {
  KASHF_QUESTION_ROUTES,
} from './goral-hachol/registry/kashf-question-route-registry.js';

const BANK_PATH = './goral-hachol/ui/question-bank.js';
const source = fs.readFileSync(BANK_PATH, 'utf8');

// Only object fields named exactly `id` whose value starts with q- are bank
// questions. Client-field ids and category ids do not match this pattern.
const matches = [...source.matchAll(/\bid\s*:\s*['"](q-[^'"]+)['"]/g)];
const allQuestionIds = matches.map((m) => m[1]);
const uniqueQuestionIds = [...new Set(allQuestionIds)];
const bankSet = new Set(uniqueQuestionIds);
const routeIds = Object.keys(KASHF_QUESTION_ROUTES);
const routeSet = new Set(routeIds);

const duplicates = [...new Set(
  allQuestionIds.filter((id, index) => allQuestionIds.indexOf(id) !== index)
)].sort();

const orphanRoutes = routeIds.filter((id) => !bankSet.has(id)).sort();
const malformedRoutes = routeIds.filter((id) => !/^q-[a-z0-9][a-z0-9-]*$/i.test(id)).sort();
const unmapped = uniqueQuestionIds.filter((id) => !routeSet.has(id)).sort();
const mapped = uniqueQuestionIds.filter((id) => routeSet.has(id)).sort();

const dispositionCounts = {};
const runtimeStatusCounts = {};
for (const id of mapped) {
  const route = KASHF_QUESTION_ROUTES[id];
  dispositionCounts[route.disposition] = (dispositionCounts[route.disposition] || 0) + 1;
  runtimeStatusCounts[route.kashfRuntimeStatus] = (runtimeStatusCounts[route.kashfRuntimeStatus] || 0) + 1;
}

const coveragePercent = uniqueQuestionIds.length
  ? ((mapped.length / uniqueQuestionIds.length) * 100).toFixed(1)
  : '0.0';

console.log('Kashf Question Route Coverage Audit');
console.log('-----------------------------------');
console.log(`Question IDs in bank: ${uniqueQuestionIds.length}`);
console.log(`Explicit Kashf routes: ${routeIds.length}`);
console.log(`Mapped bank questions: ${mapped.length}`);
console.log(`Unmapped bank questions: ${unmapped.length}`);
console.log(`Coverage: ${coveragePercent}%`);
console.log(`Disposition counts: ${JSON.stringify(dispositionCounts)}`);
console.log(`Runtime status counts: ${JSON.stringify(runtimeStatusCounts)}`);

if (unmapped.length) {
  console.error('\nUNMAPPED QUESTION IDS — HARD CI FAILURE:');
  for (const id of unmapped) console.error(`- ${id}`);
}

const errors = [];
if (uniqueQuestionIds.length === 0) errors.push('No q-* Question IDs were extracted from question-bank.js');
if (duplicates.length) errors.push(`Duplicate Question IDs: ${duplicates.join(', ')}`);
if (orphanRoutes.length) errors.push(`Route IDs not present in Question Bank: ${orphanRoutes.join(', ')}`);
if (malformedRoutes.length) errors.push(`Malformed route IDs: ${malformedRoutes.join(', ')}`);
if (unmapped.length) errors.push(`Unmapped Question IDs are forbidden after P0 reached 100% coverage: ${unmapped.join(', ')}`);

if (errors.length) {
  console.error('\nQUESTION ROUTE COVERAGE ERRORS:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nQuestion route coverage gate: PASS (100% explicit routing enforced)');
