#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const readingPath = 'goral-hachol/engine/kashf-canonical-reading-engine.js';
const pendingPath = 'goral-hachol/engine/kashf-pending-extraction.js';
const topicRulesPath = 'goral-hachol/engine/kashf-topic-rules.js';
const testPath = '_test_kashf_canonical_routing.mjs';
const auditPath = 'HALL_WISDOM_KASHF_V57_ACTIVE_METHOD_BACKFILL.md';

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Patch marker not found: ${label}`);
  return source.replace(from, to);
}

function replaceAllChecked(source, from, to, expectedCount, label) {
  const count = source.split(from).length - 1;
  if (count !== expectedCount) throw new Error(`${label}: expected ${expectedCount} occurrences, found ${count}`);
  return source.split(from).join(to);
}

// ── 1. Make v57 Hebrew knowledge a runtime prerequisite -----------------
let reading = fs.readFileSync(readingPath, 'utf8');
reading = replaceOnce(
  reading,
  "import { getKashfMethod } from '../registry/kashf-canonical-method-registry.js';\n",
  "import { getKashfMethod } from '../registry/kashf-canonical-method-registry.js';\nimport { getKashfV57Knowledge } from '../registry/kashf-v57-knowledge-registry.js';\n",
  'reading engine v57 import'
);
reading = replaceOnce(
  reading,
  'function buildLegacyFunctionReading(board, method, clientContext = {}) {',
  'function buildLegacyFunctionReading(board, method, clientContext = {}, v57Knowledge) {',
  'legacy/custom reading signature'
);

reading = replaceOnce(
  reading,
  "  if (method.executionKind === 'legacy-function'\n      || (method.executionKind === 'custom-engine' && hasCanonicalCustomExecutor(method.kashfMethodId))) {\n    return buildLegacyFunctionReading(board, method, clientContext);\n  }",
  "  const v57Knowledge = getKashfV57Knowledge(method.kashfMethodId);\n  if (!v57Knowledge) {\n    return blockedResult({\n      kashfMethodId: method.kashfMethodId,\n      kashfIntentId: method.kashfIntentId,\n      status: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      reason: 'v57-knowledge-missing',\n      userMessage: 'השיטה מוכנה לחישוב אך חסר לה עוגן ידע עברי v57; ההפעלה נחסמה כדי שה-AI לא יסתמך על מקור שאינו שכבת הידע העברית הקנונית.',\n    });\n  }\n\n  if (method.executionKind === 'legacy-function'\n      || (method.executionKind === 'custom-engine' && hasCanonicalCustomExecutor(method.kashfMethodId))) {\n    return buildLegacyFunctionReading(board, method, clientContext, v57Knowledge);\n  }",
  'runtime v57 hard stop'
);

reading = replaceAllChecked(
  reading,
  '      methodRole: method.methodRole,\n',
  "      methodRole: method.methodRole,\n      knowledgeLanguage: 'he',\n      hebrewKnowledge: v57Knowledge.v57,\n      v57Knowledge,\n",
  2,
  'attach v57 knowledge to both successful reading branches'
);

reading = replaceOnce(
  reading,
  "      sourceRef: 'כשף אל-אסרר, עמ׳ ' + method.sourcePages.join('–'),",
  "      sourceRef: 'חשיפת הסודות הנצורים v57, עמ׳ ' + v57Knowledge.v57.page,",
  'custom/legacy Hebrew source ref'
);
reading = replaceOnce(
  reading,
  '      sourceRef: `כשף אל-אסרר, עמ׳ ${method.sourcePages.join(\'–\')}`,',
  "      sourceRef: `חשיפת הסודות הנצורים v57, עמ׳ ${v57Knowledge.v57.page}` ,",
  'formula Hebrew source ref'
);

reading = replaceAllChecked(
  reading,
  "      sourceText: executorResult.sourceText || '',",
  '      sourceText: v57Knowledge.v57.hebrewRule,',
  2,
  'custom/legacy operational sourceText'
);
reading = replaceAllChecked(
  reading,
  "      sourceText: formula.sourceText || '',",
  '      sourceText: v57Knowledge.v57.hebrewRule,',
  2,
  'formula operational sourceText'
);

reading = replaceAllChecked(
  reading,
  '        sourceConfidence: method.sourceConfidence,\n      },',
  "        sourceConfidence: method.sourceConfidence,\n        operationalKnowledge: {\n          language: 'he',\n          role: 'operational-primary',\n          version: v57Knowledge.v57.version,\n          indexFile: v57Knowledge.v57.indexFile,\n          draftFile: v57Knowledge.v57.draftFile,\n          page: v57Knowledge.v57.page,\n          anchor: v57Knowledge.v57.anchor,\n        },\n        verificationSource: {\n          language: 'ar',\n          role: v57Knowledge.arabicVerification.role,\n          pages: [...v57Knowledge.arabicVerification.pages],\n        },\n      },",
  2,
  'source role metadata'
);

fs.writeFileSync(readingPath, reading);

// ── 2. Correct active profession knowledge to the v57 Hebrew text --------
let pending = fs.readFileSync(pendingPath, 'utf8');
pending = replaceOnce(
  pending,
  "  'כוכב / מרקורי':  'סגולות, כתיבות, חשבונות ואצטגנינות',",
  "  'כוכב / מרקורי':  'כישוף, נפלאות ואצטגנינות',",
  'profession Mercury mapping'
);
fs.writeFileSync(pendingPath, pending);

let topicRules = fs.readFileSync(topicRulesPath, 'utf8');
topicRules = replaceOnce(
  topicRules,
  'כוכב: כתיבה וחשבונות; לבנה: ענייני עניים',
  'כוכב / עֻטַארִד: כישוף, נפלאות ואצטגנינות; לבנה: ענייני עניים',
  'profession sourceText Mercury mapping'
);
fs.writeFileSync(topicRulesPath, topicRules);

// ── 3. Put v57 coverage into the permanent canonical contract suite ------
let test = fs.readFileSync(testPath, 'utf8');
test = replaceOnce(
  test,
  '  validateKashfMethodRegistry,\n} from \'./goral-hachol/registry/kashf-canonical-method-registry.js\';',
  "  validateKashfMethodRegistry,\n  KASHF_CANONICAL_METHODS,\n} from './goral-hachol/registry/kashf-canonical-method-registry.js';\nimport {\n  KASHF_V57_KNOWLEDGE,\n  getKashfV57Knowledge,\n  validateKashfV57KnowledgeCoverage,\n} from './goral-hachol/registry/kashf-v57-knowledge-registry.js';",
  'test v57 imports'
);

test = replaceOnce(
  test,
  "{\n  const result = validateKashfQuestionRoutes(getKashfMethod);\n  assert(result.valid, `question route registry valid: ${result.errors.join('; ')}`);\n}\n\nassert(\n",
  "{\n  const result = validateKashfQuestionRoutes(getKashfMethod);\n  assert(result.valid, `question route registry valid: ${result.errors.join('; ')}`);\n}\n{\n  const result = validateKashfV57KnowledgeCoverage(KASHF_CANONICAL_METHODS);\n  assert(result.valid, `every runnable canonical method has v57 Hebrew knowledge: ${result.errors.join('; ')}`);\n  assert(result.coveredCount === result.runnableCount, `v57 runnable coverage ${result.coveredCount}/${result.runnableCount}`);\n  assert(result.runnableCount > 0, 'v57 coverage gate sees runnable canonical methods');\n}\nfor (const [methodId, entry] of Object.entries(KASHF_V57_KNOWLEDGE)) {\n  assert(entry.knowledgeLanguage === 'he', `${methodId} v57 knowledge language is Hebrew`);\n  assert(entry.knowledgeRole === 'operational-primary', `${methodId} v57 knowledge is operational-primary`);\n  assert(entry.arabicVerification?.role === 'verification-only', `${methodId} Arabic source is verification-only`);\n  assert(entry.v57?.indexFile === 'kashf-v57-topic-index.html', `${methodId} points to v57 topic index`);\n  assert(entry.v57?.draftFile === 'kashf-v57-draft.html', `${methodId} points to v57 Hebrew draft`);\n  assert(typeof entry.v57?.hebrewRule === 'string' && entry.v57.hebrewRule.length > 0, `${methodId} has Hebrew operational rule text`);\n}\nconst professionV57 = getKashfV57Knowledge('profession.p254.h9Planet');\nassert(professionV57?.v57?.hebrewRule.includes('כישוף, נפלאות ואצטגנינות'), 'profession p254 v57 knowledge preserves Mercury magic/wonders/astrology rule');\nassert(!professionV57?.v57?.hebrewRule.includes('כתיבה וחשבונות'), 'profession p254 v57 knowledge does not retain stale Mercury writing/accounts rule');\n\nconst v57ProbeReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });\nassert(v57ProbeReading.knowledgeLanguage === 'he', 'runnable reading exposes Hebrew as operational knowledge language');\nassert(v57ProbeReading.hebrewKnowledge?.version === 'v57', 'runnable reading exposes v57 Hebrew knowledge payload');\nassert(v57ProbeReading.source?.operationalKnowledge?.role === 'operational-primary', 'reading source marks v57 as operational-primary');\nassert(v57ProbeReading.source?.verificationSource?.role === 'verification-only', 'reading source marks Arabic as verification-only');\nassert(v57ProbeReading.primaryFormula?.sourceText === getKashfV57Knowledge('pregnancy.p191.existsH5SilentEmpty')?.v57?.hebrewRule, 'reading primary sourceText comes from v57 Hebrew knowledge');\n\nassert(\n",
  'v57 permanent contract gate'
);
fs.writeFileSync(testPath, test);

// ── 4. Permanent audit / policy record -----------------------------------
const audit = `# Kashf v57 — Active Method Hebrew Knowledge Backfill\n\n## Status\n\nThis backfill makes **v57 Hebrew** the operational-primary knowledge layer for every currently runnable canonical Kashf method. The Arabic source remains the highest verification authority, but its runtime role is explicitly **verification-only**.\n\nThe navigation source is \`kashf-v57-topic-index.html\`; the Hebrew content source is \`kashf-v57-draft.html\`. A runnable method without a v57 entry is now blocked by the canonical reading engine with \`v57-knowledge-missing\`.\n\n## Runtime contract\n\nFor a method to produce a live Kashf reading it must satisfy both existing canonical gates and the new Hebrew-knowledge gate:\n\n1. canonical-operational method;\n2. \`kashfRuntimeStatus === 'ready'\`;\n3. \`runtimeAllowed === true\`;\n4. \`executorStatus === 'ready'\`;\n5. a matching entry in \`kashf-v57-knowledge-registry.js\`.\n\nSuccessful readings expose \`knowledgeLanguage: 'he'\`, \`hebrewKnowledge\`, and v57 operational source metadata. Arabic metadata is exposed only as \`verificationSource.role = 'verification-only'\`.\n\n## Backfilled runnable methods\n\n- completion.p173.fireRows15910 — p173\n- relocation.p183.h4h15 — p183\n- siblings.p182.h1h3 — p182\n- travel.p238.assemble1359 — p238\n- illness.p196.outcomeH15 — p196\n- illness.bodyPart.h6Figure — p199\n- pregnancy.p191.genderH5 — p191\n- pregnancy.p191.existsH5SilentEmpty — p191\n- hidden.p188.isStillThere — p188\n- lostItem.p202.returnH6H8 — p202\n- marriage.p204.dowryH8 — p204\n- marriage.p204.previousStatusH7inH10 — p204\n- authority.p256.honorConditionH10Planet — p256\n- authority.p257.appointmentH1H10Planet — p257\n- authority.p257.rulerConditionH7H10 — p257\n- profession.p254.h9Planet — p254\n- theft.p224.relationshipH7Recurrence — p224\n- theft.p225.thiefDescriptionH7 — p225, with detailed descriptions p232–234\n\n## Defect found by using v57\n\nThe active profession material contained a stale Mercury/עֻטַארִד gloss (writing/accounts). v57 p254 gives Mercury as **כישוף, נפלאות ואצטגנינות**, matching the Arabic verification text \`السحر والغرائب والتنجيم\`. The active profession map and topic source text were corrected to the v57 Hebrew reading.\n\n## Rule for future work\n\nNo new canonical executor may be enabled before its exact method has:\n\n- an index location in v57;\n- a Hebrew operational rule/excerpt in the v57 knowledge registry;\n- source-page traceability;\n- Arabic verification metadata;\n- canonical contract tests.\n\nThis prevents the AI layer from depending on Arabic-only context or on legacy paraphrases when the Hebrew v57 knowledge exists.\n`;
fs.writeFileSync(auditPath, audit);

// ── 5. Syntax + contracts -------------------------------------------------
for (const file of [
  'goral-hachol/registry/kashf-v57-knowledge-registry.js',
  readingPath,
  pendingPath,
  topicRulesPath,
  testPath,
]) {
  const check = spawnSync('node', ['--check', file], { stdio: 'inherit' });
  if (check.status !== 0) process.exit(check.status ?? 1);
}

for (const cmd of [
  ['node', [testPath]],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const run = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}

const pendingAfter = fs.readFileSync(pendingPath, 'utf8');
if (!pendingAfter.includes("'כוכב / מרקורי':  'כישוף, נפלאות ואצטגנינות'")) {
  throw new Error('v57 profession Mercury correction is missing after patch');
}
if (pendingAfter.includes("'כוכב / מרקורי':  'סגולות, כתיבות, חשבונות ואצטגנינות'")) {
  throw new Error('stale profession Mercury mapping survived patch');
}

console.log('v57 Hebrew active-method backfill passed.');
