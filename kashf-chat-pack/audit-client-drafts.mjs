import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runKashfPack } from './_build/run.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const methods = JSON.parse(fs.readFileSync(path.join(dir, '_build/CANONICAL_METHODS.json'), 'utf8')).methods;
const shapes = [];
for (const a of '12') for (const b of '12') for (const c of '12') for (const d of '12') shapes.push(a + b + c + d);
let seed = 42;
function random() {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const boards = [
  ['2222', '2211', '2121', '2221'], ['1122', '1122', '1122', '1122'],
  ['1221', '1221', '1221', '1221'], ['2211', '1122', '2211', '1122'],
  ['1221', '2221', '1221', '2221'], ['1122', '2221', '1122', '2221'],
  ['2221', '1122', '2221', '1122'],
];
for (let i = 0; i < 40; i++) boards.push(Array.from({ length: 4 }, () => shapes[Math.floor(random() * 16)]));
const inputs = {
  'hidden.p188.quarterDirection': { quarterPatterns: ['2111', '1112', '1212', '1112'] },
  'mother.p257.statusDayNight': { motherCastPeriod: 'לילה' },
  'marriage.p205.modestyPurity': { candidate: 'שם בדיקה', castConfirmedOnName: true },
  'marriage.p208.womanQualityH5H4': { candidate: 'שם בדיקה', castConfirmedOnName: true },
};

const audit = methods.map(method => {
  const branches = new Map();
  for (const mothers of boards) {
    const result = runKashfPack({ mothers, methodId: method.methodId, methodInputs: inputs[method.methodId] });
    if (result.status !== 'ok') throw new Error(`${method.methodId}: ${result.reason}`);
    const execution = result.methodResult?.executorResult ?? {};
    const branch = String(execution.branch ?? execution.verdictType ?? '(no branch field)');
    const key = `${branch}/${String(execution.positive ?? result.overallPositive ?? 'null')}`;
    const row = branches.get(key) ?? { branch, positive: execution.positive ?? result.overallPositive ?? null,
      sampledBoards: 0, clientDraftBoards: 0, advisorOnlyBoards: 0, exampleMothers: mothers };
    row.sampledBoards++;
    if (result.clientAnswerDraft) row.clientDraftBoards++;
    else row.advisorOnlyBoards++;
    branches.set(key, row);
  }
  return { methodId: method.methodId, questionIds: method.questionIds,
    policyCertified: method.clientFacingCertified, sampledBranches: [...branches.values()],
    clientDraftBoards: [...branches.values()].reduce((n, b) => n + b.clientDraftBoards, 0) };
});
const summary = { boardCount: boards.length, methodCount: methods.length,
  methodWithAnyDraft: audit.filter(m => m.clientDraftBoards > 0).length,
  methodWithNoDraft: audit.filter(m => m.clientDraftBoards === 0).length,
  methodWithPartialDraft: audit.filter(m => m.clientDraftBoards > 0 && m.clientDraftBoards < boards.length).length,
  sampledMethodBranches: audit.reduce((n, m) => n + m.sampledBranches.length, 0),
  sampledBranchesMissingDraft: audit.reduce((n, m) => n + m.sampledBranches.filter(b => b.advisorOnlyBoards > 0).length, 0) };
console.log(JSON.stringify({ summary, methods: audit }, null, 2));
