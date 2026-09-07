import fs from 'node:fs';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
import { OREN_SMART_ADVISOR_BRAIN_PROMPT } from './supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) passed += 1;
  else { failed += 1; console.error('FAIL:', message); }
}

const MOTHERS = ['1112', '2122', '1121', '2211'];
const BOARD = buildRamlBoardFromMothers(MOTHERS);

// 1. Explicit question route is authoritative even when the free text points
// strongly at a competing method.
const locked = buildKashfCanonicalAiBridge({
  questionId: 'q-illness-heal',
  questionText: 'בתולה או גרושה',
  board: BOARD,
});
assert(locked.resolution.resolutionSource === 'question-route', 'explicit question uses question-route authority');
assert(locked.resolution.authoritative === true, 'question route is marked authoritative');
assert(locked.resolution.kashfMethodId === 'illness.p196.outcomeH15', 'free text cannot replace selected question method');
assert(locked.resolution.retrievalDisagreesWithRoute === true, 'bridge exposes retrieval disagreement for audit');
assert(locked.canonicalReading.kashfMethodId === 'illness.p196.outcomeH15', 'canonical engine executes the route-locked method');
assert(locked.canonicalRetrieval?.knowledgeLanguage === 'he', 'bridge exposes Hebrew as operational knowledge language');
assert(locked.canonicalRetrieval?.knowledgeRole === 'operational-primary', 'v57 is operational-primary in bridge');
assert(locked.canonicalRetrieval?.arabicVerification?.role === 'verification-only', 'Arabic remains verification-only in bridge');
assert(typeof locked.canonicalRetrieval?.v57?.hebrewRule === 'string' && locked.canonicalRetrieval.v57.hebrewRule.length > 0, 'bridge carries the exact v57 Hebrew rule');
assert(locked.aiVerdictAllowed === true, 'runnable route with canonical reading allows AI to discuss the engine verdict');

// 2. Free-text retrieval can resolve knowledge/method when there is no selected
// question, but only the canonical method engine may calculate it.
const freeText = buildKashfCanonicalAiBridge({
  questionText: 'בתולה או גרושה',
  board: BOARD,
});
assert(freeText.resolution.state === 'resolved', 'specific free text resolves');
assert(freeText.resolution.resolutionSource === 'retrieval-index', 'free text resolution comes from AI retrieval index');
assert(freeText.resolution.kashfMethodId === 'marriage.p204.previousStatusH7inH10', 'free text resolves exact previous-status method');
assert(freeText.canonicalReading.kashfMethodId === 'marriage.p204.previousStatusH7inH10', 'free-text method is executed only through canonical engine');

// 3. Ambiguous language never silently chooses/executed a relocation method.
const ambiguous = buildKashfCanonicalAiBridge({ questionText: 'מעבר', board: BOARD });
assert(ambiguous.resolution.state !== 'resolved' || ambiguous.aiVerdictAllowed === false, 'ambiguous relocation wording cannot silently authorize a verdict');
if (ambiguous.resolution.state !== 'resolved') {
  assert(ambiguous.canonicalReading.canRunKashf === false, 'ambiguous retrieval does not execute');
}

// 4. A source-ready method whose executor is pending remains blocked even when
// it is selected explicitly and has Hebrew v57 knowledge.
const pending = buildKashfCanonicalAiBridge({
  questionId: 'q-child-health',
  questionText: 'מה מצב בריאות הילד לאורך הזמן?',
  board: BOARD,
});
assert(pending.resolution.kashfMethodId === 'child.p194.healthTrajectoryH6H8', 'pending route resolves to exact source-ready method');
assert(pending.resolution.executorStatus === 'pending', 'pending executor status is preserved');
assert(pending.canonicalRetrieval?.knowledgeLanguage === 'he', 'pending method may still expose Hebrew knowledge');
assert(pending.aiVerdictAllowed === false, 'retrieval cannot promote pending executor to runnable');
assert(pending.canonicalReading.canRunKashf === false, 'canonical runtime stays blocked for pending executor');

// 5. Context builder canonical mode carries the bridge into the actual live AI
// envelope and sourceEvidence comes from v57 Hebrew, not invented rule prose.
const built = buildKashfAiContextPackage({
  mothers: MOTHERS,
  topicId: 'illness',
  question: 'האם החולה יחלים?',
  questionId: 'q-illness-heal',
  readingId: 'bridge-test-001',
});
assert(built.contextPackage?.readingContext?.canonicalResolution?.kashfMethodId === 'illness.p196.outcomeH15', 'live context package carries exact canonical method');
assert(built.contextPackage?.readingContext?.canonicalResolution?.resolutionSource === 'question-route', 'live package records question-route authority');
assert(built.contextPackage?.readingContext?.canonicalRetrieval?.v57?.hebrewRule?.includes('אם בחמישה־עשר'), 'live package carries v57 Hebrew operational rule');
assert(built.contextPackage?.readingContext?.canonicalRetrieval?.arabicVerification?.role === 'verification-only', 'live package keeps Arabic verification-only');
assert(built.contextPackage?.readingContext?.aiVerdictAllowed === true, 'live package explicitly records AI verdict permission');
assert(Array.isArray(built.contextPackage?.readingContext?.sourceEvidence) && built.contextPackage.readingContext.sourceEvidence.some((s) => s.includes('v57')), 'live package sourceEvidence is populated from v57');
assert(built.contextPackage?.readingContext?.engineOutput?.kashfMethodId === 'illness.p196.outcomeH15', 'AI engineOutput is canonical rather than broad topic output');
assert(built.contextPackage?.readingContext?.engineOutput?.canonicalExecution?.topicBundleExecuted === false, 'AI engineOutput proves broad topic bundle did not execute');
assert(built.contextPackage?.primaryIntent === 'illness.recovery', 'canonical Kashf intent replaces generic intent as primaryIntent in canonical package');

const payloadJson = JSON.stringify(built.contextPackage);
for (const forbidden of ['phone', 'dynFields', 'parentName', 'maritalStatus', 'hasChildren', 'clientHistorySummary']) {
  assert(!payloadJson.includes(`"${forbidden}"`), `canonical live payload contains no forbidden key ${forbidden}`);
}
assert(sanitizeKashfReadingPayloadForAi(built.contextPackage).ok === true, 'server sanitizer accepts canonical live payload');

// 6. Defense in depth: malformed source-role escalation is rejected server-side.
const malformed = JSON.parse(JSON.stringify(built.contextPackage));
malformed.readingContext.canonicalRetrieval.arabicVerification.role = 'operational-primary';
assert(sanitizeKashfReadingPayloadForAi(malformed).ok === false, 'server rejects Arabic role escalation');

// 7. The live prompt knows the new authority contract.
assert(OREN_SMART_ADVISOR_BRAIN_PROMPT.includes('canonicalRetrieval'), 'live prompt names canonicalRetrieval');
assert(OREN_SMART_ADVISOR_BRAIN_PROMPT.includes('operational-primary'), 'live prompt declares v57 operational-primary');
assert(OREN_SMART_ADVISOR_BRAIN_PROMPT.includes('verification-only'), 'live prompt declares Arabic verification-only');
assert(OREN_SMART_ADVISOR_BRAIN_PROMPT.includes('doNotMixWith'), 'live prompt enforces doNotMixWith');
assert(OREN_SMART_ADVISOR_BRAIN_PROMPT.includes('aiVerdictAllowed'), 'live prompt enforces AI verdict gate');

// 8. Production UI actually builds the canonical package and invokes the
// authorized Edge Function instead of always rendering the local MOCK helper.
const appSource = fs.readFileSync('./goral-hachol/ui/goral-app.js', 'utf8');
assert(appSource.includes("import('/goral-hachol/intelligence/kashf-ai-context-builder.js')"), 'production UI imports canonical-aware AI context builder');
assert(appSource.includes("functions.invoke('oren-smart-advisor'"), 'production UI invokes oren-smart-advisor Edge Function');
assert(appSource.includes('questionId: selectedQuestion?.id'), 'production UI sends selected Question Bank id into canonical bridge');
assert(appSource.includes("mode: 'live'"), 'production UI explicitly requests live AI mode');
assert(appSource.includes('evaluatorMode'), 'production UI renders server-reported live/mock mode');

console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
