import assert from 'node:assert/strict';
import fs from 'node:fs';

import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { getKashfMethod } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';

const DEFAULT_MOTHERS = ['2222', '2211', '2121', '2221'];
const FAKE_UID = 'golden-e2e-uid';
const BANK_SOURCE = fs.readFileSync('./goral-hachol/ui/question-bank.js', 'utf8');

let assertions = 0;
function ok(condition, message) {
  assertions += 1;
  assert(condition, message);
}

function bankLabel(questionId) {
  const markerSingle = "id: '" + questionId + "'";
  const markerDouble = 'id: "' + questionId + '"';
  let start = BANK_SOURCE.indexOf(markerSingle);
  if (start < 0) start = BANK_SOURCE.indexOf(markerDouble);
  if (start < 0) return questionId;
  const chunk = BANK_SOURCE.slice(start, start + 1800);
  return chunk.match(/label\s*:\s*['"]([^'"]+)['"]/)?.[1] || questionId;
}

function isRunnable(method) {
  return Boolean(
    method
    && method.kashfRuntimeStatus === 'ready'
    && method.runtimeAllowed === true
    && method.executorStatus === 'ready'
  );
}

function makeLiveRequest(payload) {
  return new Request('https://golden.local/oren-smart-advisor', {
    method: 'POST',
    headers: {
      authorization: 'Bearer golden-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ module: 'kashf', mode: 'live', payload }),
  });
}

async function goldenVerifier(token) {
  return token === 'golden-token'
    ? { valid: true, userId: FAKE_UID }
    : { valid: false, userId: null };
}

function advisorOutputForSafety(safety) {
  const authoritativePolarity = String(safety?.authoritativePolarity || 'blocked');
  const authoritativeDraft = typeof safety?.authoritativeClientDraftHebrew === 'string'
    && safety.authoritativeClientDraftHebrew.trim().length > 0
      ? safety.authoritativeClientDraftHebrew
      : null;
  const clientDraftPolarity = authoritativeDraft
    ? (['positive', 'negative', 'non-binary'].includes(authoritativePolarity)
        ? authoritativePolarity
        : 'none')
    : 'none';

  return {
    module: 'kashf',
    advisorDiagnosis: 'Golden/E2E — הפלט הקנוני נשמר ללא שינוי.',
    clientAnswerDraft: authoritativeDraft,
    engineCritique: { hasProblem: false, problems: [], severity: 'none' },
    missingKnowledgeOrRules: [],
    recommendedFix: '',
    codeInstructionForClaude: {
      needed: false,
      instruction: '',
      filesToInspect: [],
      filesNotToTouch: [],
      testsToRun: [],
    },
    safetyNotes: [],
    privacyBlockedFields: [],
    nextBestAction: 'approveOutput',
    confidence: 'high',
    needsOrenDecision: false,
    verdictAudit: {
      methodId: String(safety?.kashfMethodId || ''),
      engineVerdictPolarity: authoritativePolarity,
      clientDraftPolarity,
      usedOnlyAuthorizedVerdictSource: true,
      inventedInverseRule: false,
      mixedUnselectedMethod: false,
      unsupportedClientClaims: [],
    },
  };
}

const originalEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  ALLOWED_OREN_UID: process.env.ALLOWED_OREN_UID,
  HALL_WISDOM_AI_MODE: process.env.HALL_WISDOM_AI_MODE,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
};
const originalFetch = globalThis.fetch;

process.env.SUPABASE_URL = 'https://golden.invalid';
process.env.SUPABASE_ANON_KEY = 'golden-anon-not-real';
process.env.ALLOWED_OREN_UID = FAKE_UID;
process.env.HALL_WISDOM_AI_MODE = 'live';
process.env.ANTHROPIC_API_KEY = 'golden-key-not-real';
process.env.ANTHROPIC_MODEL = 'golden-model-not-real';

let anthropicCalls = 0;
globalThis.fetch = async (_url, options = {}) => {
  anthropicCalls += 1;
  const body = JSON.parse(String(options.body || '{}'));
  const packageFromRequest = JSON.parse(String(body?.messages?.[0]?.content || '{}'));
  const safety = packageFromRequest?.readingContext?.professionalVerdictSafety;
  const toolName = body?.tool_choice?.name || 'submit_hall_wisdom_kashf_analysis';

  return new Response(JSON.stringify({
    stop_reason: 'tool_use',
    content: [{
      type: 'tool_use',
      id: 'golden-tool-use',
      name: toolName,
      input: advisorOutputForSafety(safety),
    }],
    usage: { input_tokens: 111, output_tokens: 222 },
  }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

try {
  console.log('\n--- Golden/E2E Tier A: complete canonical runtime matrix ---');

  const routedByMethod = new Map();
  for (const route of Object.values(KASHF_QUESTION_ROUTES)) {
    const method = getKashfMethod(route.kashfMethodId);
    if (!isRunnable(method)) continue;
    if (!routedByMethod.has(route.kashfMethodId)) routedByMethod.set(route.kashfMethodId, route);
  }

  ok(routedByMethod.size === 44, \`44 distinct runnable methods have an explicit Question Bank route (got \${routedByMethod.size})\`);

  let liveRoutedSuccess = 0;
  for (const [methodId, route] of routedByMethod.entries()) {
    const method = getKashfMethod(methodId);
    const question = bankLabel(route.questionId);
    const built = buildKashfAiContextPackage({
      mothers: DEFAULT_MOTHERS,
      topicId: method.topicId,
      question,
      questionId: route.questionId,
      readingId: \`golden-route-\${route.questionId}\`,
    });

    const pkg = built.contextPackage;
    const rc = pkg?.readingContext;
    const bridge = built.canonicalBridge;
    const decision = built.canonicalRuleDecision;

    ok(Boolean(pkg), \`\${route.questionId}: AI context built\`);
    ok(bridge?.resolution?.resolutionSource === 'question-route', \`\${route.questionId}: Question Bank route is authoritative\`);
    ok(bridge?.resolution?.kashfIntentId === route.kashfIntentId, \`\${route.questionId}: question -> exact intent\`);
    ok(bridge?.resolution?.kashfMethodId === methodId, \`\${route.questionId}: intent -> exact method\`);
    ok(bridge?.canonicalReading?.kashfMethodId === methodId, \`\${route.questionId}: engine executes selected method\`);
    ok(bridge?.canonicalReading?.valid === true && bridge?.canonicalReading?.canRunKashf === true, \`\${route.questionId}: canonical reading runnable\`);
    ok(bridge?.canonicalRetrieval?.kashfMethodId === methodId, \`\${route.questionId}: source retrieval aligned to selected method\`);
    ok(typeof bridge?.canonicalRetrieval?.v57?.hebrewRule === 'string' && bridge.canonicalRetrieval.v57.hebrewRule.length > 0, \`\${route.questionId}: v57 operational source rule present\`);
    ok(bridge?.aiVerdictAllowed === true, \`\${route.questionId}: professional AI verdict gate passed\`);
    ok(decision?.activatedRuleIds?.length === 1 && decision.activatedRuleIds[0] === methodId, \`\${route.questionId}: exactly one rule activated\`);
    ok(!decision?.rejectedRuleIds?.includes(methodId), \`\${route.questionId}: selected rule not rejected\`);
    ok((bridge?.canonicalRetrieval?.doNotMixWith || []).every((id) => decision.rejectedRuleIds.includes(id)), \`\${route.questionId}: all explicit doNotMixWith methods rejected\`);
    ok(Array.isArray(rc?.sourceEvidence) && rc.sourceEvidence.length > 0, \`\${route.questionId}: source evidence propagated to AI context\`);
    ok(rc?.activatedRuleIds?.[0] === methodId, \`\${route.questionId}: Rule Decision survives AI context packaging\`);
    ok(typeof pkg?.decisionSummary === 'string' && pkg.decisionSummary.includes(methodId), \`\${route.questionId}: deterministic decision summary present\`);

    const res = await handleAdvisorRequest(makeLiveRequest(pkg), { verifyToken: goldenVerifier });
    const body = await res.json();
    ok(res.status === 200 && body?.evaluatorMode === 'live', \`\${route.questionId}: full Edge path returns live structured output\`);
    ok(body?.advisorBrainOutput?.verdictAudit?.methodId === methodId, \`\${route.questionId}: advisor output audited against same method\`);
    ok(body?.advisorBrainOutput?.verdictAudit?.engineVerdictPolarity === rc?.professionalVerdictSafety?.authoritativePolarity, \`\${route.questionId}: advisor polarity equals engine polarity\`);
    if (body?.advisorBrainOutput?.clientAnswerDraft != null) {
      ok(
        body.advisorBrainOutput.clientAnswerDraft.trim() === String(rc?.professionalVerdictSafety?.authoritativeClientDraftHebrew || '').trim(),
        \`\${route.questionId}: client draft is exact authoritative engine text\`
      );
    }
    liveRoutedSuccess += 1;
  }
  ok(liveRoutedSuccess === 44, 'all 44 routed runnable methods complete the live mocked Advisor path');

  console.log('\n--- Golden/E2E Tier A2: two runnable non-Question-Bank methods ---');

  const desireBuilt = buildKashfAiContextPackage({
    mothers: DEFAULT_MOTHERS,
    topicId: 'marriage',
    question: 'האם השואל רוצה בדבר',
    useCanonicalRetrieval: true,
    readingId: 'golden-free-text-desire',
  });
  ok(desireBuilt.canonicalBridge?.resolution?.kashfMethodId === 'desire.p206.querentWantsH7H11ThenH5', 'free text selects exact p206 querent-desire method');
  ok(desireBuilt.canonicalRuleDecision?.activatedRuleIds?.[0] === 'desire.p206.querentWantsH7H11ThenH5', 'p206 desire is activated as sole rule');
  ok(desireBuilt.canonicalBridge?.aiVerdictAllowed === true, 'p206 desire is professionally safe for advisor output');
  {
    const res = await handleAdvisorRequest(makeLiveRequest(desireBuilt.contextPackage), { verifyToken: goldenVerifier });
    const body = await res.json();
    ok(body?.evaluatorMode === 'live', 'p206 free-text desire completes live mocked Advisor path');
    ok(body?.advisorBrainOutput?.verdictAudit?.methodId === 'desire.p206.querentWantsH7H11ThenH5', 'p206 Advisor audit method is exact');
  }

  const dhamirBuilt = buildKashfAiContextPackage({
    mothers: DEFAULT_MOTHERS,
    topicId: 'generalReading',
    question: 'על מי השואל שואל',
    useCanonicalRetrieval: true,
    readingId: 'golden-free-text-dhamir-subject',
  });
  ok(dhamirBuilt.canonicalBridge?.resolution?.kashfMethodId === 'dhamir.p159.subjectByH6Recurrence', 'free text selects exact p159 Dhamir subject-identification method');
  ok(dhamirBuilt.canonicalBridge?.canonicalReading?.valid === true, 'p159 Dhamir executor itself is runnable');
  ok(dhamirBuilt.canonicalBridge?.aiVerdictAllowed === false, 'p159 Dhamir is intentionally not authorized for client verdict');
  ok(dhamirBuilt.canonicalRuleDecision?.activatedRuleIds?.length === 0, 'p159 Dhamir activates zero client-verdict rules');
  ok(dhamirBuilt.canonicalRuleDecision?.rejectedRuleIds?.includes('dhamir.p159.subjectByH6Recurrence'), 'p159 Dhamir selected method is explicitly rejected for client verdict');
  {
    const res = await handleAdvisorRequest(makeLiveRequest(dhamirBuilt.contextPackage), { verifyToken: goldenVerifier });
    const body = await res.json();
    ok(body?.evaluatorMode === 'mock', 'p159 Dhamir cannot cross the professional live verdict gate');
    ok(body?.liveModeUnavailableReason === 'professional-verdict-safety-failed', 'p159 Dhamir fails closed at professional verdict safety');
  }

  const allRunnable = new Set([...routedByMethod.keys(), 'desire.p206.querentWantsH7H11ThenH5', 'dhamir.p159.subjectByH6Recurrence']);
  ok(allRunnable.size === 46, \`Golden/E2E matrix accounts for all 46 runnable methods (got \${allRunnable.size})\`);

  console.log('\n--- Golden/E2E Tier B: source-derived fixed cases ---');

  const sourceCases = [
    {
      id: 'GT-P191-PREGNANCY-EXISTS-SILENT',
      mothers: ['2111', '1111', '1111', '1111'],
      questionId: 'q-pregnancy',
      question: 'האם יש הריון?',
      topicId: 'children',
      methodId: 'pregnancy.p191.existsH5SilentEmpty',
      sourcePage: 191,
      expected: (x) => x?.classification === 'silent' && x?.pregnancyExists === true,
      description: 'H5=2111 silent => pregnancy exists',
    },
    {
      id: 'GT-P191-GENDER-MALE',
      mothers: ['1111', '1111', '1111', '2111'],
      questionId: 'q-gender',
      question: 'זכר או נקבה?',
      topicId: 'children',
      methodId: 'pregnancy.p191.genderH5',
      sourcePage: 191,
      expected: (x) => x?.h5Pattern === '1112' && x?.gender === 'male',
      description: 'H5=1112 masculine => male',
    },
    {
      id: 'GT-P191-192-MISCARRIAGE-PAIR',
      mothers: ['1122', '1112', '1122', '1121'],
      questionId: 'q-miscarriage',
      question: 'האם מופיע סימן ההפלה של עמ׳ 191–192?',
      topicId: 'children',
      methodId: 'pregnancy.p191-192.miscarriageRedH7NakisH8',
      sourcePage: 191,
      expected: (x) => x?.h7Pattern === '2122' && x?.h8Pattern === '2221' && x?.miscarriageSign === true && x?.sourceOutcome === 'miscarriage-sign',
      description: 'H7=Humra + H8=Nakis => printed miscarriage sign',
      expectedOverallPositive: null,
    },
    {
      id: 'GT-P196-ILLNESS-RECOVERY',
      mothers: ['1111', '1111', '1111', '1121'],
      questionId: 'q-illness-heal',
      question: 'האם החולה יחלים לפי דין H15?',
      topicId: 'illness',
      methodId: 'illness.p196.outcomeH15',
      sourcePage: 196,
      expected: (x) => x?.h15Pattern === '2211' && x?.recoveryStatus === 'recovers' && x?.recovers === true,
      description: 'H15=2211 pure-benefic => recovery',
      expectedOverallPositive: true,
    },
  ];

  for (const gt of sourceCases) {
    const board = buildRamlBoardFromMothers(gt.mothers);
    ok(board.boardValidation?.isValid === true, \`\${gt.id}: source fixture produces a valid board\`);

    const built = buildKashfAiContextPackage({
      mothers: gt.mothers,
      topicId: gt.topicId,
      question: gt.question,
      questionId: gt.questionId,
      readingId: gt.id,
    });
    const bridge = built.canonicalBridge;
    const executorResult = bridge?.canonicalReading?.primaryFormula?.result?.executorResult;

    ok(bridge?.resolution?.kashfMethodId === gt.methodId, \`\${gt.id}: exact source method selected\`);
    ok(bridge?.canonicalRetrieval?.v57?.page === gt.sourcePage, \`\${gt.id}: exact v57 source page retrieved\`);
    ok(gt.expected(executorResult), \`\${gt.id}: \${gt.description}\`);
    ok(built.canonicalRuleDecision?.activatedRuleIds?.[0] === gt.methodId, \`\${gt.id}: source method is sole activated rule\`);
    ok(
      built.contextPackage?.readingContext?.sourceEvidence?.some((e) => e.includes(\`עמ׳ \${gt.sourcePage}\`)),
      \`\${gt.id}: source page survives into AI context\`
    );
    if ('expectedOverallPositive' in gt) {
      ok(bridge?.canonicalReading?.overallPositive === gt.expectedOverallPositive, \`\${gt.id}: source polarity/non-binary contract preserved\`);
    }

    const res = await handleAdvisorRequest(makeLiveRequest(built.contextPackage), { verifyToken: goldenVerifier });
    const body = await res.json();
    ok(body?.evaluatorMode === 'live', \`\${gt.id}: source-derived case completes Advisor path\`);
    ok(body?.advisorBrainOutput?.verdictAudit?.methodId === gt.methodId, \`\${gt.id}: Advisor remains on exact source method\`);
  }

  console.log(\`\\nGolden/E2E assertions: \${assertions} passed\`);
  console.log(\`Mocked Anthropic tool calls: \${anthropicCalls}\`);
  console.log('Runnable canonical methods covered: 46/46');
  console.log('Professionally live-advisor-safe methods covered: 45/45');
  console.log('Intentionally client-verdict-blocked runnable method: 1/1 (p159 Dhamir)');
  console.log('Source-derived fixed Golden cases: 4/4');
  console.log('Kashf Golden/E2E: PASS');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
