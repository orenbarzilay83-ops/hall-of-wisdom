/**
 * _test_oren_smart_advisor_kashf_live_runner.mjs
 *
 * Internal-only runner for the FIRST live Kashf call against the deployed
 * oren-smart-advisor Edge Function (module:"kashf", mode:"live"). Not a
 * UI. Not a pilot with a real client. Exactly one authenticated AI call.
 *
 * Credentials come from the environment ONLY:
 *   SUPABASE_FUNCTION_URL  — e.g. https://<project-ref>.supabase.co/functions/v1/oren-smart-advisor
 *   SUPABASE_USER_JWT      — a real Supabase session access_token for the allowlisted user
 * Never hardcode either value here. Never paste them in chat. Never commit
 * a .env file containing them (.gitignore already blocks .env/.env.*).
 *
 * Real payload source: this script does NOT build or invent a board,
 * engineOutput, activatedRuleIds, rejectedRuleIds, or sourceEvidence. It
 * loads a pre-built AiContextPackage JSON file from KASHF_REAL_PAYLOAD_PATH.
 * That file must be produced by actually running the real Kashf engine
 * (buildRamlBoardFromMothers + buildKashfReading + the Rule Decision Engine)
 * end-to-end for a real question — see the stop-message below for exactly
 * what's missing if this path isn't set.
 */

function fail(message) {
  console.error(`\n✗ STOP: ${message}\n`);
  process.exit(1);
}

// ── 1. Credentials — env only ────────────────────────────────────────────
const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL;
const SUPABASE_USER_JWT = process.env.SUPABASE_USER_JWT;

if (!SUPABASE_FUNCTION_URL) {
  fail(
    'SUPABASE_FUNCTION_URL is not set.\n' +
    '  Set it locally (never in chat, never committed) to:\n' +
    '  https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor\n' +
    '  Example (your own terminal): export SUPABASE_FUNCTION_URL="https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor"'
  );
}

if (!SUPABASE_USER_JWT) {
  fail(
    'SUPABASE_USER_JWT is not set.\n' +
    '  This must be a real Supabase session access_token for the allowlisted user (Oren), not the anon key.\n' +
    '  How to get it safely, without pasting it in chat or committing it to git:\n' +
    '    1. Log into the app in your browser as the allowlisted user (oren moshe).\n' +
    '    2. Open browser DevTools -> Application/Storage -> local storage -> find the\n' +
    '       Supabase auth entry (key usually starts with "sb-<project-ref>-auth-token").\n' +
    '    3. Copy the "access_token" field value from that JSON.\n' +
    '    4. In your OWN terminal (not this chat), run:\n' +
    '       export SUPABASE_USER_JWT="<paste-here>"\n' +
    '    5. Then run this script from that same terminal session.\n' +
    '  The token is short-lived (Supabase session tokens expire) — if this runner gets\n' +
    '  401 on the authenticated call, it likely just expired; get a fresh one.'
  );
}

// ── 2. Real payload — must come from an already-generated fixture ───────
const KASHF_REAL_PAYLOAD_PATH = process.env.KASHF_REAL_PAYLOAD_PATH;
if (!KASHF_REAL_PAYLOAD_PATH) {
  fail(
    'KASHF_REAL_PAYLOAD_PATH is not set — no real AiContextPackage to send.\n' +
    '  This runner refuses to invent board/engineOutput/activatedRuleIds/rejectedRuleIds/\n' +
    '  sourceEvidence. A genuine payload must be produced by actually running the real\n' +
    '  Kashf engine end-to-end for a real question:\n' +
    '    goral-hachol/engine/raml-board-generator.js  :: buildRamlBoardFromMothers(mothers)\n' +
    '    goral-hachol/engine/kashf-reading-engine.js   :: buildKashfReading(board, topicId, clientContext)\n' +
    '    goral-hachol/intelligence/rule-decision-engine.js :: runRuleDecisionEngine(input)\n' +
    '  MISSING PIECE (found during investigation, not yet built): no function in this\n' +
    '  codebase currently wires those three together into an AiContextPackage matching\n' +
    '  supabase/functions/oren-smart-advisor/ai-context-package.ts. Building that wiring\n' +
    '  is an architecture decision (how questionType/primaryIntent/readingStrategy/\n' +
    '  readingPlan get derived) that needs its own review before this runner can load a\n' +
    '  genuinely real payload. Point KASHF_REAL_PAYLOAD_PATH at a JSON file shaped like\n' +
    '  AiContextPackage once that builder exists and has produced real output.'
  );
}

const fs = await import('node:fs');
let contextPackage;
try {
  contextPackage = JSON.parse(fs.readFileSync(KASHF_REAL_PAYLOAD_PATH, 'utf8'));
} catch (err) {
  fail(`Could not read/parse KASHF_REAL_PAYLOAD_PATH (${KASHF_REAL_PAYLOAD_PATH}): ${err.message}`);
}

const rc = contextPackage?.readingContext;
const requiredEnvelopeFields = ['payloadVersion', 'domain', 'method', 'readingContext'];
const missingEnvelope = requiredEnvelopeFields.filter((k) => !(k in (contextPackage || {})));
const requiredContextFields = ['question', 'board', 'engineOutput', 'activatedRuleIds', 'rejectedRuleIds', 'sourceEvidence'];
const missingContext = requiredContextFields.filter((k) => !rc || !(k in rc));
if (missingEnvelope.length > 0 || missingContext.length > 0) {
  fail(
    `Loaded payload from ${KASHF_REAL_PAYLOAD_PATH} but it is incomplete.\n` +
    (missingEnvelope.length ? `  Missing envelope fields: ${missingEnvelope.join(', ')}\n` : '') +
    (missingContext.length ? `  Missing readingContext fields: ${missingContext.join(', ')}\n` : '')
  );
}
if (contextPackage.domain !== 'reading.goralHachol' || contextPackage.method !== 'kashf') {
  fail(`Payload domain/method mismatch — expected reading.goralHachol/kashf, got ${contextPackage.domain}/${contextPackage.method}.`);
}

const FORBIDDEN_KEYS = ['phone', 'dynFields', 'parentName', 'maritalStatus', 'hasChildren', 'clientHistorySummary', 'accessToken', 'access_token', 'apiKey', 'api_key'];
const payloadJson = JSON.stringify(contextPackage);
const foundForbidden = FORBIDDEN_KEYS.filter((k) => payloadJson.includes(`"${k}"`));
if (foundForbidden.length > 0) {
  fail(`Payload contains forbidden key(s), refusing to send: ${foundForbidden.join(', ')}`);
}

console.log(`✓ Credentials present (values not printed). Function URL host: ${new URL(SUPABASE_FUNCTION_URL).host}`);
console.log(`✓ Real payload loaded from ${KASHF_REAL_PAYLOAD_PATH} — readingId: ${contextPackage.readingId || '(none)'}, questionType: ${contextPackage.questionType || '(none)'}`);

// ── 3. Live 401 test — no Authorization header ───────────────────────────
console.log('\n--- Live test 1: no Authorization header (expect 401) ---');
let res401;
try {
  res401 = await fetch(SUPABASE_FUNCTION_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ module: 'kashf' }) });
} catch (err) {
  fail(`Network error on the unauthenticated preflight request itself: ${err.message}`);
}
if (res401.status !== 401) {
  fail(`Expected HTTP 401 with no Authorization header, got ${res401.status}. Stopping before any authenticated/AI call.`);
}
console.log('✓ HTTP 401 confirmed for unauthenticated request.');

// ── 4. Exactly one authenticated, live AI call ────────────────────────────
console.log('\n--- Live test 2: single authenticated mode:"live" call ---');
const requestBody = { module: 'kashf', mode: 'live', payload: contextPackage };
const startedAt = Date.now();
let liveRes;
try {
  liveRes = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${SUPABASE_USER_JWT}` },
    body: JSON.stringify(requestBody),
  });
} catch (err) {
  fail(`Network error on the live authenticated call: ${err.message}\nDiagnose before retrying — do not auto-retry.`);
}
const latencyMs = Date.now() - startedAt;
let liveBody;
try {
  liveBody = await liveRes.json();
} catch (err) {
  fail(`Live call returned non-JSON body (HTTP ${liveRes.status}): ${err.message}`);
}

console.log(`✓ HTTP ${liveRes.status} in ${latencyMs}ms`);

if (liveRes.status !== 200) {
  fail(`Live call did not return HTTP 200 (got ${liveRes.status}). Body ok=${liveBody?.ok}, errorCode=${liveBody?.errorCode}. Diagnose before retrying.`);
}

// ── 5. Output validation ──────────────────────────────────────────────────
const REQUIRED_ADVISOR_KEYS = [
  'module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique', 'missingKnowledgeOrRules',
  'recommendedFix', 'codeInstructionForClaude', 'safetyNotes', 'privacyBlockedFields',
  'nextBestAction', 'confidence', 'needsOrenDecision',
];

if (liveBody.evaluatorMode !== 'live' || liveBody.liveModeUnavailableReason) {
  fail(
    `Response fell back to mock instead of a real live AI answer.\n` +
    `  evaluatorMode: ${liveBody.evaluatorMode}\n` +
    `  liveModeUnavailableReason: ${liveBody.liveModeUnavailableReason}\n` +
    `  Diagnose the reason before retrying — do not auto-retry.`
  );
}

const output = liveBody.advisorBrainOutput;
const missingKeys = REQUIRED_ADVISOR_KEYS.filter((k) => !output || !(k in output));
if (missingKeys.length > 0) {
  fail(`Live advisorBrainOutput missing required keys: ${missingKeys.join(', ')}`);
}

console.log('✓ evaluatorMode === "live", no liveModeUnavailableReason');
console.log('✓ advisorBrainOutput has all 12 required schema keys');

// ── 6. Print only the safe summary — never raw prompt/response/token ─────
console.log('\n--- Summary (safe fields only) ---');
console.log(JSON.stringify({
  httpStatus: liveRes.status,
  latencyMs,
  evaluatorMode: liveBody.evaluatorMode,
  confidence: output.confidence,
  needsOrenDecision: output.needsOrenDecision,
  nextBestAction: output.nextBestAction,
  hasEngineCritique: !!output.engineCritique,
  missingKnowledgeOrRulesCount: Array.isArray(output.missingKnowledgeOrRules) ? output.missingKnowledgeOrRules.length : null,
}, null, 2));

console.log('\nDone. Full advisorBrainOutput was received in-memory only — write it into');
console.log('HALL_WISDOM_FIRST_LIVE_KASHF_PILOT_REPORT.md by hand, after your own review,');
console.log('never by piping this script\'s raw stdout into the report unreviewed.');
