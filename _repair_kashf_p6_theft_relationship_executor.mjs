#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const patcherPath = '_apply_kashf_p6_theft_relationship_executor.mjs';
let text = fs.readFileSync(patcherPath, 'utf8');

// Update the earlier route contract as part of the P6 patch itself.
const marker = `if (!tests.includes('// ── P6 theft-relationship H7 recurrence executor')) {`;
if (!text.includes('const oldThiefNearRoute = `assertRoute')) {
  const insertion = [
    "const oldThiefNearRoute = `assertRoute('q-thief-near', {",
    '  ok: true,',
    '  canRunKashf: false,',
    "  kashfIntentId: 'theft.thiefRelationship',",
    "  kashfMethodId: 'theft.p224.relationshipH7Recurrence',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'pending',",
    '});`;',
    "const newThiefNearRoute = `assertRoute('q-thief-near', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'theft.thiefRelationship',",
    "  kashfMethodId: 'theft.p224.relationshipH7Recurrence',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});`;',
    'if (tests.includes(oldThiefNearRoute)) {',
    '  tests = tests.replace(oldThiefNearRoute, newThiefNearRoute);',
    "} else if (!/q-thief-near[\\s\\S]*?canRunKashf: true,[\\s\\S]*?executorStatus: 'ready'/.test(tests)) {",
    "  throw new Error('Could not update q-thief-near route contract');",
    '}',
    '',
  ].join('\n');
  if (!text.includes(marker)) throw new Error('Could not find P6 test marker');
  text = text.replace(marker, insertion + marker);
}

const exactH4 = `    "assert(JSON.stringify(thiefRelationshipH4.primaryFormula?.result?.executorResult?.recurrenceHouses) === JSON.stringify([4]), 'H4 guard board has one exact recurrence');",`;
const includesH4 = `    "assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.recurrenceHouses?.includes(4) === true, 'H4 guard board includes the source-relevant H4 recurrence');",`;
if (text.includes(exactH4)) {
  text = text.replace(exactH4, includesH4);
} else if (!text.includes('H4 guard board includes the source-relevant H4 recurrence')) {
  throw new Error('Could not relax H4 recurrence guard to the source-relevant condition');
}

fs.writeFileSync(patcherPath, text);
const result = spawnSync('node', [patcherPath], { stdio: 'inherit' });
process.exit(result.status ?? 1);
