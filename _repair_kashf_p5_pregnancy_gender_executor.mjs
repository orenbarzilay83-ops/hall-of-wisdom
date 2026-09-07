#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p5_pregnancy_gender_executor.mjs';
let text = fs.readFileSync(patcherPath, 'utf8');

const bad = "const genderMethodRegex = /(  'pregnancy\\.p191\\.genderH5': method\\(\\{[\\s\\S]*?legacyTopicId: 'children',\\n)(  \\}),)/;";
const good = "const genderMethodRegex = /(  'pregnancy\\.p191\\.genderH5': method\\(\\{[\\s\\S]*?legacyTopicId: 'children',\\n)(  \\}\\),)/;";

if (text.includes(bad)) {
  text = text.replace(bad, good);
  fs.writeFileSync(patcherPath, text);
} else if (!text.includes("const genderMethodRegex = /(  'pregnancy\\.p191\\.genderH5': method\\(\\{[\\s\\S]*?legacyTopicId: 'children',\\n)(  \\}\\),)/;")) {
  throw new Error('Could not repair pregnancy-gender regex');
}

const result = spawnSync('node', [patcherPath], { stdio: 'inherit' });
process.exit(result.status ?? 1);
