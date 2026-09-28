import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { KASHF_CANONICAL_METHODS } from '../goral-hachol/registry/kashf-canonical-method-registry.js';
import { KASHF_QUESTION_ROUTES } from '../goral-hachol/registry/kashf-question-route-registry.js';
import { KASHF_V57_KNOWLEDGE } from '../goral-hachol/registry/kashf-v57-knowledge-registry.js';
import { getKashfAiRetrievalRecord } from '../goral-hachol/registry/kashf-ai-retrieval-index.js';
import { resolveKashfRouteByQuestionId } from '../goral-hachol/engine/kashf-method-router.js';
import { isKashfMethodProfessionallyCertified } from '../goral-hachol/intelligence/kashf-professional-verdict-safety.js';
import { RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD as QAWL } from '../goral-hachol/data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pack = path.join(root, 'kashf-chat-pack');
const output = path.join(pack, '_build');
const zip = path.join(pack, 'kashf-chat-pack.zip');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`);
const expect = (value, message) => { if (!value) throw new Error(message); };

const html = fs.readFileSync(path.join(root, 'kashf-v57-ai-master-index.html'), 'utf8');
const match = html.match(/<script id="kashf-ai-master-index-data" type="application\/json">([\s\S]*?)<\/script>/);
expect(match, 'Master Index JSON missing');
const index = JSON.parse(match[1]);
const methods = Object.values(KASHF_CANONICAL_METHODS);
const runnable = methods.filter(method => method.methodRole === 'canonical-operational' && method.attributedSourceBook === 'Kashf'
  && method.sourceLayer === 'body' && method.kashfRuntimeStatus === 'ready'
  && method.runtimeAllowed === true && method.executorStatus === 'ready');
const routes = Object.values(KASHF_QUESTION_ROUTES);
const questionContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'goral-hachol/ui/question-bank.js'), 'utf8'), questionContext,
  { filename: 'goral-hachol/ui/question-bank.js', timeout: 1000 });
const questionBank = new Map(questionContext.window.QUESTION_BANK.map(item => [item.id, item]));
const count = (items, status) => items.filter(item => item.status === status).length;
expect(index.records.length === 272, 'Master Index record count changed');
expect(index.v57CorrectionQueue.length === 91 && count(index.v57CorrectionQueue, 'RESOLVED') === 91, 'v57 queue not closed');
expect(index.downstreamCorrectionQueue.length === 46 && count(index.downstreamCorrectionQueue, 'RESOLVED') === 46, 'downstream queue not closed');
expect(index.sourceConflictQueue.length === 48 && count(index.sourceConflictQueue, 'RESOLVED') === 9
  && count(index.sourceConflictQueue, 'SOURCE_CONFLICT/NON_OPERATIONAL') === 39, 'Source Freeze status changed');
expect(routes.length === 138 && runnable.length === 46, 'route/runnable inventory changed');
expect(routes.every(route => questionBank.has(route.questionId)), 'Question Bank labels missing');
const spiritualCoverage = index.spiritualQuestionCoverage;
expect(spiritualCoverage?.questionRoutes?.length === 8 && spiritualCoverage?.sourceMentions?.length === 8,
  'spiritual source coverage missing');
for (const item of spiritualCoverage.questionRoutes) {
  const resolved = resolveKashfRouteByQuestionId(item.questionId);
  expect(questionBank.has(item.questionId), `spiritual question missing: ${item.questionId}`);
  expect(Boolean(resolved.canRunKashf) === (item.runtimeStatus === 'READY'),
    `spiritual runtime drift: ${item.questionId}`);
  for (const entryId of [item.entryId, ...(item.contextEntryIds || [])].filter(Boolean))
    expect(index.records.some(record => record.entryId === entryId), `spiritual source entry missing: ${entryId}`);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const name of ['README.md', 'PROJECT_SETUP.md', 'PROJECT_INSTRUCTIONS.md', 'PROJECT_WORKFLOWS.md', 'SPIRITUAL_SCOPE.md', 'run.mjs', 'SELF_TEST.mjs']) {
  fs.copyFileSync(path.join(pack, name), path.join(output, name));
}
fs.writeFileSync(path.join(output, 'package.json'), '{"type":"module","private":true}\n');

const methodData = runnable.map(method => {
  const knowledge = KASHF_V57_KNOWLEDGE[method.kashfMethodId];
  const retrieval = getKashfAiRetrievalRecord(method.kashfMethodId);
  expect(knowledge?.v57?.hebrewRule && retrieval?.v57?.hebrewRule, `missing Hebrew rule: ${method.kashfMethodId}`);
  expect(knowledge.v57.hebrewRule === retrieval.v57.hebrewRule, `knowledge/retrieval drift: ${method.kashfMethodId}`);
  return {
    methodId: method.kashfMethodId,
    intentId: method.kashfIntentId,
    executionKind: method.executionKind,
    sourcePages: method.sourcePages,
    questionIds: routes.filter(route => route.kashfMethodId === method.kashfMethodId && resolveKashfRouteByQuestionId(route.questionId).canRunKashf)
      .map(route => route.questionId),
    v57: { page: knowledge.v57.page, heading: knowledge.v57.heading, hebrewRule: knowledge.v57.hebrewRule,
      detailPages: knowledge.v57.detailPages, supportingPages: knowledge.v57.supportingPages },
    doNotMixWith: retrieval.doNotMixWith || [],
    notes: method.notes || knowledge.notes || null,
    clientFacingCertified: isKashfMethodProfessionallyCertified(method.kashfMethodId),
  };
});
expect(methodData.filter(item => item.clientFacingCertified).length === 45, 'client certification inventory changed');
write('CANONICAL_METHODS.json', { role: 'operational-primary-v57', count: methodData.length, methods: methodData });
write('QUESTION_ROUTES.json', { role: 'exact-question-id-routing', count: routes.length,
  routes: routes.map(route => {
    const resolved = resolveKashfRouteByQuestionId(route.questionId);
    const question = questionBank.get(route.questionId);
    const supplemental = spiritualCoverage.questionRoutes.find(item => item.questionId === route.questionId);
    return { questionId: route.questionId, label: question.label, description: question.desc,
      category: question.category, intentId: route.kashfIntentId, methodId: route.kashfMethodId,
      disposition: route.disposition, aliasOf: route.aliasOf, canRunKashf: resolved.canRunKashf,
      runtimeStatus: resolved.kashfRuntimeStatus, executorStatus: resolved.executorStatus,
      note: route.note || null, blockedReason: resolved.canRunKashf ? null : resolved.userMessage,
      supplementalRuntime: supplemental?.supplementalRuntime || null,
      supplementalSourcePages: supplemental?.supplementalSourcePages || null };
  }) });
const directIds = ['ankis-house6-buried-magic-in-grave', 'jawdala-house6-drunk-magic',
  'jawdala-house12-bound-from-wife', 'qabd-dakhil-house6-bound-from-women',
  'hayyan-house10-also-bewitched', 'aqla-house13-bound-magic-sprinkled',
  'aqla-house14-house-or-place-has-magic', 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children',
  'jamaa-from-two-humra-strong-envy', 'jamaa-from-two-ankis-two-buried-magics-renewed'];
const directRules = directIds.map(id => {
  const rule = QAWL.figureHouseRules.find(item => item.id === id);
  expect(rule?.sourcePage === 57, `Qawl rule missing: ${id}`);
  return { id, sourcePage: 57, figure: rule.figure, house: rule.house ?? null,
    hebrewRule: rule.hebrewTranslation.join(' ') };
});
write('QAWL_SPIRITUAL_METHOD.json', {
  role: 'independent-supplemental-source-not-kashf', sourceBook: QAWL.sourceBookArabic,
  sourceAuthor: QAWL.sourceAuthorArabic, chapter: QAWL.sourceTitleArabic, printedPages: [56, 57, 58],
  questionIds: ['q-sorcery', 'q-sorcery-h10', 'q-jinn-type'],
  directRules, openPoints: { sourcePage: 58, method: 'count 1 in all 16 houses; reduce by seven',
    results: QAWL.isqatSevenRules.results.map(({ remainder, hebrew }) => ({ remainder, hebrew })) },
  conditionalJinnType: { sourcePage: 58, condition: 'only remainder 1', parents: [15, 4],
    results: QAWL.jinnTypeRules.filter(item => item.element).map(({ id, element, resultHebrew }) => ({ id, element, resultHebrew })) },
  excluded: QAWL.printedEditionAudit.excludedRuntimeUnits,
  note: 'Each matching printed rule is independent evidence; no invented aggregate verdict, sorcerer identity, or location.',
});
write('SOURCE_INDEX.json', { role: 'source-map-reference-only-never-activates-methods', version: index.version,
  coverage: index.coverage, spiritualQuestionCoverage: spiritualCoverage,
  records: index.records, sourceFreeze: index.sourceConflictQueue.map(item => ({
    id: item.id, entryId: item.entryId, page: item.page, status: item.status, summary: item.summary,
  })), inactiveMethods: methods.filter(method => !runnable.includes(method)).map(method => ({
    methodId: method.kashfMethodId, sourcePages: method.sourcePages, runtimeStatus: method.kashfRuntimeStatus,
    executorStatus: method.executorStatus, runtimeAllowed: method.runtimeAllowed, methodRole: method.methodRole,
    reason: method.notes,
  })) });
write('GOLDEN_CASES.json', { role: 'fixed-source-evidence-cases', note: 'Four printed-source fixtures from KASHF_GOLDEN_E2E_AUDIT.md; not exhaustive for 46 methods.', cases: [
  { id: 'GT-P191-PREGNANCY-EXISTS-SILENT', mothers: ['2111','1111','1111','1111'], questionId: 'q-pregnancy', methodId: 'pregnancy.p191.existsH5SilentEmpty', sourcePage: 191, expected: { h5Pattern: '2111', classification: 'silent', pregnancyExists: true } },
  { id: 'GT-P191-GENDER-MALE', mothers: ['1111','1111','1111','2111'], questionId: 'q-gender', methodId: 'pregnancy.p191.genderH5', sourcePage: 191, expected: { h5Pattern: '1112', gender: 'male' } },
  { id: 'GT-P191-192-MISCARRIAGE-PAIR', mothers: ['1122','1112','1122','1121'], questionId: 'q-miscarriage', methodId: 'pregnancy.p191-192.miscarriageRedH7NakisH8', sourcePage: 191, expected: { h7Pattern: '2122', h8Pattern: '2221', miscarriageSign: true } },
  { id: 'GT-P196-ILLNESS-RECOVERY', mothers: ['1111','1111','1111','1121'], questionId: 'q-illness-heal', methodId: 'illness.p196.outcomeH15', sourcePage: 196, expected: { h15Pattern: '2211', recoveryStatus: 'recovers' } },
] });

// Copy only the static dependency closure of the canonical runner. Keep it
// sealed under runtime/: it is executable code, never GPT source knowledge.
const roots = ['goral-hachol/engine/raml-board-generator.js', 'goral-hachol/engine/qawl-spiritual-kashf-bridge.js', 'goral-hachol/intelligence/kashf-canonical-ai-bridge.js',
  'goral-hachol/engine/kashf-canonical-reading-engine.js', 'goral-hachol/registry/kashf-canonical-method-registry.js',
  'goral-hachol/registry/kashf-ai-retrieval-index.js', 'goral-hachol/intelligence/kashf-professional-verdict-safety.js'];
const found = new Set();
const imports = /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s*)?['"](\.[^'"]+)['"]/g;
function visit(relative) {
  const normalized = path.normalize(relative);
  expect(!normalized.startsWith('..') && normalized.endsWith('.js'), `invalid runtime path: ${normalized}`);
  if (found.has(normalized)) return;
  const full = path.join(root, normalized);
  expect(fs.existsSync(full), `missing runtime dependency: ${normalized}`);
  found.add(normalized);
  const source = fs.readFileSync(full, 'utf8');
  for (const match of source.matchAll(imports)) {
    const target = path.normalize(path.join(path.dirname(normalized), match[1]));
    visit(path.extname(target) ? target : `${target}.js`);
  }
  const destination = path.join(output, 'runtime', normalized);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(full, destination);
}
for (const entry of roots) visit(entry);

const provenance = {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceBranch: execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
  masterIndexSha256: sha(path.join(root, 'kashf-v57-ai-master-index.html')),
  knowledgeRegistrySha256: sha(path.join(root, 'goral-hachol/registry/kashf-v57-knowledge-registry.js')),
  questionBankSha256: sha(path.join(root, 'goral-hachol/ui/question-bank.js')),
  counts: { indexRecords: 272, v57Corrections: 91, downstream: 46, frozenSourceItems: 48,
    nonOperationalSourceItems: 39, questionRoutes: 138, runnableMethods: 46, clientCertifiedMethods: 45,
    runtimeDependencies: found.size },
};
write('MANIFEST.json', provenance);
fs.rmSync(zip, { force: true });
execFileSync('zip', ['-q', '-r', zip, '.'], { cwd: output });
console.log(JSON.stringify({ zip, ...provenance.counts }, null, 2));
