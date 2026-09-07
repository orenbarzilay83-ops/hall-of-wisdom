#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let source = fs.readFileSync(knowledgePath, 'utf8');
const stale = "hebrewRule: 'אם הצורה בבית החמישי זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',";
const exact = "hebrewRule: 'אם הצורה זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',";
if (!source.includes(stale)) throw new Error('Expected v57 pregnancy-gender wording not found');
source = source.replace(stale, exact);
fs.writeFileSync(knowledgePath, source);

const check = spawnSync('node', ['--check', knowledgePath], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const run = spawnSync('node', ['_apply_kashf_v57_active_method_backfill.mjs'], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);
console.log('Repaired v57 gender wording and executed full active-method backfill.');
