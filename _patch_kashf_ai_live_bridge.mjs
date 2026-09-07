#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error(`Missing patch anchor: ${label}`);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique patch anchor: ${label}`);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

// -------------------------------------------------------------------------
// 1. Canonical-aware AI context builder
// -------------------------------------------------------------------------
const builderPath = 'goral-hachol/intelligence/kashf-ai-context-builder.js';
let builder = read(builderPath);
builder = replaceOnce(
  builder,
  "import { buildReadingPlan } from './reading-planner.js';",
  "import { buildReadingPlan } from './reading-planner.js';\nimport { buildKashfCanonicalAiBridge } from './kashf-canonical-ai-bridge.js';",
  'builder bridge import'
);
builder = replaceOnce(
  builder,
  "export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v7';",
  "export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v8';",
  'builder version'
);

const canonicalProjection = `

// Canonical engine output projection. This is separate from the legacy
// projection above because the canonical runtime has a different contract:
// exact method/intent ids, Hebrew v57 knowledge, source roles and explicit
// isolation evidence. clientContext is intentionally absent.
const CANONICAL_ENGINE_OUTPUT_ALLOWED_KEYS = [
  'valid', 'status', 'canRunKashf', 'kashfIntentId', 'kashfMethodId',
  'kashfRuntimeStatus', 'executorStatus', 'methodRole', 'knowledgeLanguage',
  'hebrewKnowledge', 'topicId', 'topicHebrewName', 'topicDescription',
  'sourceRef', 'primaryFormula', 'formula', 'verdict', 'overallPositive',
  'canonicalExecution', 'source', 'reason', 'userMessage', 'error',
];

export function buildAiSafeCanonicalKashfEngineOutput(engineOutput) {
  if (!engineOutput || typeof engineOutput !== 'object') return engineOutput;
  return projectAllowlist(engineOutput, CANONICAL_ENGINE_OUTPUT_ALLOWED_KEYS);
}

function buildCanonicalMethodMetadata(bridge) {
  const resolution = bridge?.resolution || {};
  const retrieval = bridge?.canonicalRetrieval || null;
  return {
    primaryMethod: resolution.kashfMethodId || null,
    kashfIntentId: resolution.kashfIntentId || null,
    authority: resolution.resolutionSource || null,
    authoritativeQuestionRoute: resolution.authoritative === true,
    aiVerdictAllowed: bridge?.aiVerdictAllowed === true,
    allowedVerdictSources: ['readingContext.engineOutput.verdict', 'readingContext.engineOutput.primaryFormula'],
    forbiddenForVerdict: [
      'readingContext.retrievalCandidates',
      'readingContext.canonicalRetrieval.doNotMixWith',
      'readingContext.canonicalRetrieval.arabicVerification',
      'legacyTopicBundle',
      'dhamir',
      'alternateMethods',
    ],
    doNotMixWith: Array.isArray(retrieval?.doNotMixWith) ? [...retrieval.doNotMixWith] : [],
    operationalKnowledge: retrieval?.v57 ? {
      language: 'he',
      role: 'operational-primary',
      version: retrieval.v57.version,
      page: retrieval.v57.page,
      anchor: retrieval.v57.anchor,
    } : null,
    verificationKnowledge: retrieval?.arabicVerification ? {
      language: 'ar',
      role: 'verification-only',
      pages: [...(retrieval.arabicVerification.pages || [])],
    } : null,
  };
}
`;

builder = replaceOnce(
  builder,
  "  return projected;\n}\n\n// ---------------------------------------------------------------------------\n// AI-safe Board Projection",
  "  return projected;\n}" + canonicalProjection + "\n// ---------------------------------------------------------------------------\n// AI-safe Board Projection",
  'canonical projection insertion'
);

builder = replaceOnce(
  builder,
  " * @param {string} [input.clientName]\n * @returns {{ contextPackage: object|null, completeness: 'complete'|'partial', missingFields: string[], intentResult: object|null }}",
  " * @param {string} [input.clientName]\n * @param {string} [input.questionId] - authoritative Question Bank id when selected\n * @param {boolean} [input.useCanonicalRetrieval] - allow free-text canonical retrieval when no questionId exists\n * @returns {{ contextPackage: object|null, completeness: 'complete'|'partial', missingFields: string[], intentResult: object|null, canonicalBridge?: object|null }}",
  'builder jsdoc input'
);

builder = replaceOnce(
  builder,
  "  const { mothers, topicId, question, readingId, clientName } = input;",
  "  const { mothers, topicId, question, readingId, clientName, questionId, useCanonicalRetrieval = false } = input;",
  'builder destructuring'
);

builder = replaceOnce(
  builder,
  "  const board = buildRamlBoardFromMothers(mothers);\n  const rawEngineOutput = buildKashfReading(board, topicId, { name: clientName || '', question });\n  const aiSafeEngineOutput = buildAiSafeKashfEngineOutput(rawEngineOutput);\n  const aiSafeBoard = buildAiSafeKashfBoard(board);",
  `  const board = buildRamlBoardFromMothers(mothers);
  const canonicalMode = Boolean(questionId || useCanonicalRetrieval === true);
  const canonicalBridge = canonicalMode
    ? buildKashfCanonicalAiBridge({
        questionId: questionId || null,
        questionText: question,
        board,
        clientContext: { name: clientName || '', question },
      })
    : null;
  const rawEngineOutput = canonicalBridge
    ? canonicalBridge.canonicalReading
    : buildKashfReading(board, topicId, { name: clientName || '', question });
  const aiSafeEngineOutput = canonicalBridge
    ? buildAiSafeCanonicalKashfEngineOutput(rawEngineOutput)
    : buildAiSafeKashfEngineOutput(rawEngineOutput);
  const aiSafeBoard = buildAiSafeKashfBoard(board);`,
  'builder canonical engine selection'
);

builder = replaceOnce(
  builder,
  "  missingFields.push('readingContext.activatedRuleIds — no per-rule ruleDefinitions source is wired for Kashf yet (rule-decision-engine.js has no real loader; goral-knowledge-registry.js entries are topic-level, not rule-level)');\n  missingFields.push('readingContext.rejectedRuleIds — same missing source as activatedRuleIds');\n  missingFields.push('readingContext.sourceEvidence — same missing source (per-rule sourceEvidence snippets, distinct from topic-level evidenceLocation pointers)');\n  missingFields.push('decisionSummary — normally produced by runRuleDecisionEngine, which did not run (see activatedRuleIds above)');",
  `  missingFields.push('readingContext.activatedRuleIds — no per-rule ruleDefinitions source is wired for Kashf yet (rule-decision-engine.js has no real loader; goral-knowledge-registry.js entries are topic-level, not rule-level)');
  missingFields.push('readingContext.rejectedRuleIds — same missing source as activatedRuleIds');
  if (!canonicalBridge?.canonicalRetrieval?.v57?.hebrewRule) {
    missingFields.push('readingContext.sourceEvidence — no canonical v57 Hebrew rule was resolved for this request');
  }
  missingFields.push('decisionSummary — normally produced by runRuleDecisionEngine, which did not run (see activatedRuleIds above)');`,
  'builder source evidence gap'
);

builder = replaceOnce(
  builder,
  "  const contextPackage = {\n    payloadVersion: 'ai-context-package-v1',",
  `  const canonicalSourceEvidence = canonicalBridge?.canonicalRetrieval?.v57?.hebrewRule
    ? [\`v57 עמ׳ \${canonicalBridge.canonicalRetrieval.v57.page}: \${canonicalBridge.canonicalRetrieval.v57.hebrewRule}\`]
    : [];

  const contextPackage = {
    payloadVersion: 'ai-context-package-v1',`,
  'builder canonical source evidence'
);

builder = replaceOnce(
  builder,
  "    primaryIntent: intentResult.primaryIntent,",
  "    primaryIntent: canonicalBridge?.resolution?.kashfIntentId || intentResult.primaryIntent,",
  'builder canonical primary intent'
);

builder = replaceOnce(
  builder,
  "      engineOutput: aiSafeEngineOutput,\n      methodMetadata: KASHF_METHOD_METADATA,\n      ruleCoverageStatus: buildRuleCoverageStatus(topicId),\n      activatedRuleIds: [],\n      rejectedRuleIds: [],\n      sourceEvidence: [],",
  `      engineOutput: aiSafeEngineOutput,
      canonicalBridgeVersion: canonicalBridge?.bridgeVersion || null,
      canonicalResolution: canonicalBridge?.resolution || null,
      canonicalRetrieval: canonicalBridge?.canonicalRetrieval || null,
      retrievalCandidates: canonicalBridge?.candidates || [],
      aiVerdictAllowed: canonicalBridge ? canonicalBridge.aiVerdictAllowed === true : null,
      methodMetadata: canonicalBridge ? buildCanonicalMethodMetadata(canonicalBridge) : KASHF_METHOD_METADATA,
      ruleCoverageStatus: buildRuleCoverageStatus(topicId),
      activatedRuleIds: [],
      rejectedRuleIds: [],
      sourceEvidence: canonicalSourceEvidence,`,
  'builder reading context canonical block'
);

builder = replaceOnce(
  builder,
  "  return { contextPackage, completeness: missingFields.length === 0 ? 'complete' : 'partial', missingFields, intentResult };",
  "  return { contextPackage, completeness: missingFields.length === 0 ? 'complete' : 'partial', missingFields, intentResult, canonicalBridge };",
  'builder return bridge'
);

builder = replaceOnce(
  builder,
  "export default { buildKashfAiContextPackage, buildAiSafeKashfEngineOutput, buildAiSafeKashfBoard, buildRuleCoverageStatus, KASHF_METHOD_METADATA, KASHF_AI_CONTEXT_BUILDER_VERSION };",
  "export default { buildKashfAiContextPackage, buildAiSafeKashfEngineOutput, buildAiSafeCanonicalKashfEngineOutput, buildAiSafeKashfBoard, buildRuleCoverageStatus, KASHF_METHOD_METADATA, KASHF_AI_CONTEXT_BUILDER_VERSION };",
  'builder default export'
);
write(builderPath, builder);

// -------------------------------------------------------------------------
// 2. Server-side canonical payload validation
// -------------------------------------------------------------------------
const sanitizerPath = 'supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
let sanitizer = read(sanitizerPath);
sanitizer = replaceOnce(
  sanitizer,
  "interface KashfReadingPayloadLike {\n  readingContext?: { sourceEvidence?: unknown };\n}",
  `interface KashfReadingPayloadLike {
  readingContext?: {
    sourceEvidence?: unknown;
    canonicalResolution?: unknown;
    canonicalRetrieval?: unknown;
    aiVerdictAllowed?: unknown;
  };
}

function isShortString(value: unknown, max = 300): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function isStringArray(value: unknown, maxItems = 30, maxLength = 300): value is string[] {
  return Array.isArray(value)
    && value.length <= maxItems
    && value.every((item) => typeof item === 'string' && item.length <= maxLength);
}

function validateCanonicalBlock(payload: KashfReadingPayloadLike): boolean {
  const rc = payload?.readingContext;
  const retrieval = rc?.canonicalRetrieval as Record<string, unknown> | null | undefined;
  const resolution = rc?.canonicalResolution as Record<string, unknown> | null | undefined;

  // Legacy packages remain accepted. Once either canonical field is present,
  // both must satisfy the stricter contract.
  if (retrieval == null && resolution == null) return true;
  if (!retrieval || typeof retrieval !== 'object' || !resolution || typeof resolution !== 'object') return false;

  if (!isShortString(retrieval.kashfMethodId, 200)) return false;
  if (!isShortString(retrieval.kashfIntentId, 200)) return false;
  if (retrieval.knowledgeLanguage !== 'he') return false;
  if (retrieval.knowledgeRole !== 'operational-primary') return false;
  if (!isStringArray(retrieval.doNotMixWith, 30, 200)) return false;

  const v57 = retrieval.v57 as Record<string, unknown> | null | undefined;
  if (!v57 || typeof v57 !== 'object') return false;
  if (v57.version !== 'v57') return false;
  if (!isShortString(v57.hebrewRule, MAX_SOURCE_SNIPPET_LENGTH)) return false;
  if (!isShortString(v57.anchor, 80)) return false;
  if (typeof v57.page !== 'number' || !Number.isFinite(v57.page)) return false;

  const arabic = retrieval.arabicVerification as Record<string, unknown> | null | undefined;
  if (!arabic || typeof arabic !== 'object' || arabic.role !== 'verification-only') return false;
  if (!Array.isArray(arabic.pages) || !arabic.pages.every((p) => typeof p === 'number' && Number.isFinite(p))) return false;

  if (resolution.kashfMethodId !== retrieval.kashfMethodId) return false;
  if (resolution.kashfIntentId !== retrieval.kashfIntentId) return false;
  if (!['question-route', 'retrieval-index'].includes(String(resolution.resolutionSource || ''))) return false;
  if (typeof rc?.aiVerdictAllowed !== 'boolean') return false;

  // A blocked/pending method may be retrievable knowledge, but the payload
  // must never claim the AI is allowed to present a computed verdict for it.
  const runtimeAllowed = retrieval.runtimeAllowed === true;
  const executorReady = retrieval.executorStatus === 'ready';
  const sourceReady = retrieval.kashfRuntimeStatus === 'ready';
  if (rc.aiVerdictAllowed === true && !(runtimeAllowed && executorReady && sourceReady)) return false;

  return true;
}`,
  'sanitizer canonical interfaces'
);

sanitizer = replaceOnce(
  sanitizer,
  "  const sourceEvidence = (payload as KashfReadingPayloadLike)?.readingContext?.sourceEvidence;",
  `  const typedPayload = payload as KashfReadingPayloadLike;
  if (!validateCanonicalBlock(typedPayload)) {
    return { ok: false, reason: 'sanitization-failed' };
  }

  const sourceEvidence = typedPayload?.readingContext?.sourceEvidence;`,
  'sanitizer canonical validation call'
);
write(sanitizerPath, sanitizer);

// -------------------------------------------------------------------------
// 3. Live prompt canonical authority contract
// -------------------------------------------------------------------------
const promptPath = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';
let prompt = read(promptPath);
prompt = replaceOnce(
  prompt,
  "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v5';",
  "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v6';",
  'prompt version'
);
prompt = replaceOnce(
  prompt,
  "פלט-המנוע, Rule Decisions שהופעלו ושנדחו, וראיות-מקור. תפקידך: ביקורת\nמקצועית על מה-שכבר-חושב, לא חישוב-מחדש.",
  "פלט-המנוע, Rule Decisions שהופעלו ושנדחו, וראיות-מקור. כאשר קיימים\nreadingContext.canonicalResolution/canonicalRetrieval, הם שכבת-הסמכות\nהקנונית לבחירת השיטה והמקור. תפקידך: ביקורת מקצועית על מה-שכבר-חושב,\nלא חישוב-מחדש.",
  'prompt intro canonical'
);
prompt = replaceOnce(
  prompt,
  "12. Method Isolation — פסק-הדין הראשי (verdict) חייב להגיע אך ורק מה-method\n    שצוין ב-readingContext.methodMetadata.primaryMethod (בבקשה זו: \"kashf\"),",
  "12. Method Isolation — פסק-הדין הראשי (verdict) חייב להגיע אך ורק מה-method\n    שצוין ב-readingContext.methodMetadata.primaryMethod. בנתיב הקנוני זהו\n    kashfMethodId המדויק; במעטפת legacy ישנה בלבד הערך עשוי להיות \"kashf\".",
  'prompt method isolation primary method'
);

const canonicalPromptRule = `
16. Canonical Retrieval / v57 — כאשר readingContext.canonicalResolution
    ו-readingContext.canonicalRetrieval קיימים, הם גוברים על סיווגי-topic
    כלליים, readingStrategy ו-readingPlan בכל הנוגע לזהות שיטת-כשף ומקור
    הידע. אם canonicalResolution.resolutionSource הוא "question-route",
    questionId שנבחר באפליקציה הוא סמכותי: אסור לך להחליף את
    canonicalResolution.kashfMethodId בשיטה שעלתה מחיפוש טקסט, גם אם ניסוח
    השאלה מזכיר נושא אחר. canonicalRetrieval.v57.hebrewRule הוא הידע
    operational-primary של הבקשה ובשפה העברית. החומר הערבי שב-
    canonicalRetrieval.arabicVerification הוא verification-only: מותר לציין
    אותו כאימות/פער-מקור אם נמסר, אך אסור להשתמש בו כדי להחליף בשקט כלל v57,
    להשלים כלל עברי חסר או ליצור verdict חדש. כל methodId שמופיע ב-
    canonicalRetrieval.doNotMixWith אסור להשתתף בפסק, בהצבעה, באיזון או
    בשילוב עם השיטה הקנונית. retrievalCandidates הם מועמדי ניווט בלבד — לא
    ראיות לפסק. אם readingContext.aiVerdictAllowed אינו true, או אם
    canonicalResolution.state אינו "resolved", אסור להפיק/לרמוז על פסק
    מחושב של כשף; יש להסביר ליועץ שהשיטה חסומה/עמומה/ממתינה למבצע. גם כאשר
    aiVerdictAllowed=true, פסק-הדין חייב לשקף רק את
    readingContext.engineOutput.verdict והראיות של השיטה הקנונית המדויקת;
    אין לחשב את הלוח מחדש ואין להריץ שיטה חלופית.
`;
prompt = replaceOnce(
  prompt,
  "\nמבנה הקלט שתקבל (JSON) — AI Context Package:",
  canonicalPromptRule + "\nמבנה הקלט שתקבל (JSON) — AI Context Package:",
  'prompt canonical rule insertion'
);
prompt = replaceOnce(
  prompt,
  "- readingContext.engineOutput: פלט-המנוע הדטרמיניסטי (clientWording/practicalGuidance/certaintyLevel וכו')",
  "- readingContext.engineOutput: פלט-המנוע הדטרמיניסטי; בנתיב הקנוני זהו פלט של kashfMethodId אחד בלבד\n- readingContext.canonicalResolution: הכרעת-הניתוב (question-route סמכותי או retrieval-index) וסטטוס ההפעלה\n- readingContext.canonicalRetrieval: intent/method מדויקים, כלל v57 העברי, doNotMixWith ו-Arabic verification-only\n- readingContext.aiVerdictAllowed: שער קשיח — רק true מתיר לדון בפסק שכבר חושב",
  'prompt input canonical fields'
);
write(promptPath, prompt);

// -------------------------------------------------------------------------
// 4. Production UI: replace always-local MOCK with canonical live request
// -------------------------------------------------------------------------
const appPath = 'goral-hachol/ui/goral-app.js';
let app = read(appPath);
app = replaceOnce(
  app,
  "// ── Oren Smart Advisor Brain — לוח-יועץ-פנימי, MOCK בלבד ────────────────\n// אין AI חי, אין קריאת-רשת, אין secret. ראו\n// OREN_SMART_ADVISOR_PANEL_PLACEMENT_DECISION.md. advisor-only — לעולם\n// לא-מוצג-אוטומטית ללקוח, לא-משנה את פלט-הקריאה שמעליו (kashfReadingOutput).",
  "// ── Oren Smart Advisor Brain — לוח יועץ פנימי ──────────────────────────\n// הנתיב החי משתמש ב-AI Context Package קנוני: Question Bank -> exact Kashf\n// method -> v57 Hebrew -> canonical executor -> authorized Edge Function.\n// אם live אינו זמין, השרת/לקוח נופלים במפורש ל-MOCK. advisor-only — לעולם\n// לא מוצג אוטומטית ללקוח ולא משנה את פלט הקריאה שמעליו.",
  'app advisor header comment'
);

const liveHelper = `

async function buildLiveOrenAdvisorBrainOutput({ mothers, topicId, question, questionId }) {
  const localFallback = async (reason) => ({
    output: await buildMockOrenAdvisorBrainOutput(window._lastKashfReading || {}),
    evaluatorMode: 'mock',
    liveModeUnavailableReason: reason,
    canonicalMethodId: null,
  });

  try {
    const builderMod = await import('/goral-hachol/intelligence/kashf-ai-context-builder.js');
    if (!builderMod?.buildKashfAiContextPackage) return localFallback('context-builder-unavailable');

    const built = builderMod.buildKashfAiContextPackage({
      mothers,
      topicId,
      question,
      questionId,
      useCanonicalRetrieval: !questionId,
      readingId: `kashf-${Date.now()}`,
    });
    if (!built?.contextPackage) return localFallback('canonical-context-unavailable');

    const supabase = window.__supabase;
    if (!supabase?.functions?.invoke) return localFallback('supabase-client-unavailable');

    const { data, error } = await supabase.functions.invoke('oren-smart-advisor', {
      body: {
        module: 'kashf',
        mode: 'live',
        payload: built.contextPackage,
      },
    });
    if (error || !data?.advisorBrainOutput) {
      return localFallback(error?.message ? `edge-error:${error.message}` : 'edge-response-invalid');
    }

    return {
      output: data.advisorBrainOutput,
      evaluatorMode: data.evaluatorMode || 'mock',
      liveModeUnavailableReason: data.liveModeUnavailableReason || null,
      canonicalMethodId: built.contextPackage?.readingContext?.canonicalResolution?.kashfMethodId || null,
      canonicalIntentId: built.contextPackage?.readingContext?.canonicalResolution?.kashfIntentId || null,
      aiVerdictAllowed: built.contextPackage?.readingContext?.aiVerdictAllowed === true,
    };
  } catch (err) {
    return localFallback(err instanceof Error ? `client-error:${err.message}` : 'client-error');
  }
}
`;
app = replaceOnce(
  app,
  "\nfunction renderOrenAdvisorPanel(mockOutput) {",
  liveHelper + "\nfunction renderOrenAdvisorPanel(mockOutput, runtimeMeta = {}) {",
  'app live advisor helper insertion'
);
app = replaceOnce(
  app,
  "  const c = mockOutput.codeInstructionForClaude;\n  const needsCode = !!c?.needed;",
  `  const c = mockOutput.codeInstructionForClaude;
  const needsCode = !!c?.needed;
  const evaluatorMode = runtimeMeta.evaluatorMode || 'mock';
  const isLive = evaluatorMode === 'live';
  const modeBadge = isLive
    ? 'AI חי — נתיב קנוני v57'
    : runtimeMeta.liveModeUnavailableReason
      ? \`MOCK — live לא זמין: \${runtimeMeta.liveModeUnavailableReason}\`
      : 'מצב בדיקה / MOCK — לא AI חי';`,
  'app panel runtime mode'
);
app = replaceOnce(
  app,
  "      <span class=\"oren-advisor-badge\">מצב בדיקה / MOCK — לא AI חי</span>",
  "      <span class=\"oren-advisor-badge\">${escapeHtml(modeBadge)}</span>",
  'app panel dynamic badge'
);
app = replaceOnce(
  app,
  "        <p class=\"oren-advisor-meta\">module: ${escapeHtml(mockOutput.module)} | confidence: ${escapeHtml(mockOutput.confidence)}</p>",
  "        <p class=\"oren-advisor-meta\">module: ${escapeHtml(mockOutput.module)} | confidence: ${escapeHtml(mockOutput.confidence)} | mode: ${escapeHtml(evaluatorMode)}${runtimeMeta.canonicalMethodId ? ` | method: ${escapeHtml(runtimeMeta.canonicalMethodId)}` : ''}</p>",
  'app panel method metadata'
);

app = replaceOnce(
  app,
  `      // Oren Smart Advisor Brain — לוח-יועץ-פנימי, MOCK בלבד (אין AI חי,
      // אין קריאת-רשת). ראו OREN_SMART_ADVISOR_PANEL_PLACEMENT_DECISION.md.
      // כישלון כאן לא-אמור-לשבור את הקריאה עצמה.
      try {
        const mockAdvisorOutput = await buildMockOrenAdvisorBrainOutput(kashfReading);
        renderOrenAdvisorPanel(mockAdvisorOutput);
      } catch (err) {
        // best-effort — לא חוסם את הקריאה
      }`,
  `      // בינת היכל החכמה — הנתיב החי מקבל רק AI Context Package קנוני.
      // השאלה שנבחרה בבנק נועלת את ה-kashfMethodId; ה-AI אינו רשאי לבחור
      // שיטה אחרת. כשל/מצב שרת לא-live נופל במפורש ל-MOCK ולא שובר קריאה.
      try {
        window._lastKashfReading = kashfReading;
        const advisorResult = await buildLiveOrenAdvisorBrainOutput({
          mothers: selectedMothers.map((m) => m.key),
          topicId: kashfTopicId,
          question,
          questionId: selectedQuestion?.id || null,
        });
        renderOrenAdvisorPanel(advisorResult.output, advisorResult);
      } catch (err) {
        const mockAdvisorOutput = await buildMockOrenAdvisorBrainOutput(kashfReading);
        renderOrenAdvisorPanel(mockAdvisorOutput, { evaluatorMode: 'mock', liveModeUnavailableReason: 'advisor-client-error' });
      }`,
  'app live call replacement'
);
write(appPath, app);

// -------------------------------------------------------------------------
// 5. Permanent CI coverage for the full AI bridge
// -------------------------------------------------------------------------
const workflowPath = '.github/workflows/kashf-ai-retrieval-index-tests.yml';
let workflow = read(workflowPath);
workflow = replaceOnce(
  workflow,
  "      - 'goral-hachol/registry/kashf-ai-retrieval-index.js'\n      - '_test_kashf_ai_retrieval_index.mjs'",
  `      - 'goral-hachol/registry/kashf-ai-retrieval-index.js'
      - 'goral-hachol/intelligence/kashf-canonical-ai-bridge.js'
      - 'goral-hachol/intelligence/kashf-ai-context-builder.js'
      - 'goral-hachol/ui/goral-app.js'
      - 'supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts'
      - 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts'
      - 'supabase/functions/oren-smart-advisor/index.ts'
      - '_test_kashf_ai_retrieval_index.mjs'
      - '_test_kashf_ai_retrieval_live_bridge.mjs'
      - '_test_kashf_ai_context_builder.mjs'
      - '_test_oren_smart_advisor_kashf_reading_payload.mjs'`,
  'workflow path coverage'
);
workflow = replaceOnce(
  workflow,
  "      - name: Run canonical routing contract\n        run: node _test_kashf_canonical_routing.mjs",
  `      - name: Run canonical live AI bridge contract
        run: node _test_kashf_ai_retrieval_live_bridge.mjs
      - name: Run AI context builder regression
        run: node _test_kashf_ai_context_builder.mjs
      - name: Run Edge Kashf payload regression
        run: node _test_oren_smart_advisor_kashf_reading_payload.mjs
      - name: Run canonical routing contract
        run: node _test_kashf_canonical_routing.mjs`,
  'workflow bridge steps'
);
write(workflowPath, workflow);

console.log('Applied canonical Kashf AI live bridge patch.');
