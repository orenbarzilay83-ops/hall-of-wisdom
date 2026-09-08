#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const i = text.indexOf(needle);
  if (i < 0) throw new Error('Missing anchor: ' + label);
  if (text.indexOf(needle, i + needle.length) >= 0) throw new Error('Non-unique anchor: ' + label);
  return text.slice(0, i) + replacement + text.slice(i + needle.length);
}
function mustReplace(text, re, replacement, label) {
  if (!re.test(text)) throw new Error('Missing regex anchor: ' + label);
  return text.replace(re, replacement);
}

// 1) Canonical AI bridge: add deterministic Professional Verdict Safety gate.
{
  const path = 'goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "} from '../registry/kashf-ai-retrieval-index.js';\n\nexport const KASHF_CANONICAL_AI_BRIDGE_VERSION = 'kashf-canonical-ai-bridge-v1';",
    "} from '../registry/kashf-ai-retrieval-index.js';\nimport { buildKashfProfessionalVerdictSafety } from './kashf-professional-verdict-safety.js';\n\nexport const KASHF_CANONICAL_AI_BRIDGE_VERSION = 'kashf-canonical-ai-bridge-v2';",
    'bridge import/version'
  );
  const oldReturn = `  return Object.freeze({\n    bridgeVersion: KASHF_CANONICAL_AI_BRIDGE_VERSION,\n    resolution,\n    canonicalRetrieval,\n    candidates: freezeArray(candidates),\n    canonicalReading,\n    aiVerdictAllowed: Boolean(\n      resolution.state === 'resolved'\n      && canonicalReading?.valid === true\n      && canonicalReading?.canRunKashf === true\n      && canonicalReading?.kashfMethodId === resolution.kashfMethodId\n    ),\n  });`;
  const newReturn = `  const baseAiVerdictAllowed = Boolean(\n    resolution.state === 'resolved'\n    && canonicalReading?.valid === true\n    && canonicalReading?.canRunKashf === true\n    && canonicalReading?.kashfMethodId === resolution.kashfMethodId\n  );\n  const professionalVerdictSafety = buildKashfProfessionalVerdictSafety({\n    resolution,\n    canonicalReading,\n    canonicalRetrieval,\n    baseAiVerdictAllowed,\n  });\n  const aiVerdictAllowed = Boolean(baseAiVerdictAllowed && professionalVerdictSafety.isSafe);\n\n  return Object.freeze({\n    bridgeVersion: KASHF_CANONICAL_AI_BRIDGE_VERSION,\n    resolution,\n    canonicalRetrieval,\n    candidates: freezeArray(candidates),\n    canonicalReading,\n    professionalVerdictSafety,\n    aiVerdictAllowed,\n  });`;
  s = replaceOnce(s, oldReturn, newReturn, 'bridge safety return');
  write(path, s);
}

// 2) Retrieval isolation: p210 must explicitly not mix p211.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    doNotMixWith: ['marriage.p204.previousStatusH7inH10', 'marriage.p204.dowryH8', 'love.p206.womanFavorH7H11ThenH5', 'desire.p206.querentWantsH7H11ThenH5'],",
    "    doNotMixWith: ['marriage.p204.previousStatusH7inH10', 'marriage.p204.dowryH8', 'marriage.p211.dissolutionH7StateMatrix', 'love.p206.womanFavorH7H11ThenH5', 'desire.p206.querentWantsH7H11ThenH5'],",
    'p210 doNotMix p211'
  );
  write(path, s);
}

// 3) AI context builder: carry safety gate and narrow verdict sources.
{
  const path = 'goral-hachol/intelligence/kashf-ai-context-builder.js';
  let s = read(path);
  s = replaceOnce(s, "export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v8';", "export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v9';", 'context version');
  const oldMeta = `    aiVerdictAllowed: bridge?.aiVerdictAllowed === true,\n    allowedVerdictSources: ['readingContext.engineOutput.verdict', 'readingContext.engineOutput.primaryFormula'],\n    forbiddenForVerdict: [\n      'readingContext.retrievalCandidates',\n      'readingContext.canonicalRetrieval.doNotMixWith',\n      'readingContext.canonicalRetrieval.arabicVerification',\n      'legacyTopicBundle',\n      'dhamir',\n      'alternateMethods',\n    ],`;
  const newMeta = `    aiVerdictAllowed: bridge?.aiVerdictAllowed === true,\n    professionalVerdictSafetyVersion: bridge?.professionalVerdictSafety?.policyVersion || null,\n    allowedVerdictSources: [\n      'readingContext.engineOutput.overallPositive',\n      'readingContext.engineOutput.verdict',\n    ],\n    explanationOnlySources: [\n      'readingContext.engineOutput.primaryFormula',\n      'readingContext.canonicalRetrieval.v57',\n    ],\n    forbiddenForVerdict: [\n      'readingContext.board',\n      'readingContext.board.houses[*].figureState',\n      'readingContext.retrievalCandidates',\n      'readingContext.canonicalRetrieval.doNotMixWith',\n      'readingContext.canonicalRetrieval.arabicVerification',\n      'legacyTopicBundle',\n      'dhamir',\n      'alternateMethods',\n      'genericFigureOrHouseMeaningOutsideSelectedMethod',\n    ],`;
  s = replaceOnce(s, oldMeta, newMeta, 'context method metadata');
  s = replaceOnce(
    s,
    "      aiVerdictAllowed: canonicalBridge ? canonicalBridge.aiVerdictAllowed === true : null,\n      methodMetadata: canonicalBridge ? buildCanonicalMethodMetadata(canonicalBridge) : KASHF_METHOD_METADATA,",
    "      aiVerdictAllowed: canonicalBridge ? canonicalBridge.aiVerdictAllowed === true : null,\n      professionalVerdictSafety: canonicalBridge?.professionalVerdictSafety || null,\n      methodMetadata: canonicalBridge ? buildCanonicalMethodMetadata(canonicalBridge) : KASHF_METHOD_METADATA,",
    'context safety field'
  );
  write(path, s);
}

// 4) Server sanitizer: canonical payload must carry and satisfy the safety block.
{
  const path = 'supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
  let s = read(path);
  s = replaceOnce(
    s,
    "    aiVerdictAllowed?: unknown;\n  };",
    "    aiVerdictAllowed?: unknown;\n    professionalVerdictSafety?: unknown;\n  };",
    'sanitizer interface'
  );
  const anchor = `  if (typeof rc?.aiVerdictAllowed !== 'boolean') return false;\n\n  // A blocked/pending method may be retrievable knowledge, but the payload`;
  const inserted = `  if (typeof rc?.aiVerdictAllowed !== 'boolean') return false;\n\n  const safety = rc?.professionalVerdictSafety as Record<string, unknown> | null | undefined;\n  if (!safety || typeof safety !== 'object') return false;\n  if (!isShortString(safety.policyVersion, 120)) return false;\n  if (safety.kashfMethodId !== retrieval.kashfMethodId) return false;\n  if (!['positive', 'negative', 'non-binary', 'blocked'].includes(String(safety.authoritativePolarity || ''))) return false;\n  if (typeof safety.isSafe !== 'boolean') return false;\n  if (typeof safety.binaryClientVerdictAllowed !== 'boolean') return false;\n  if (safety.noInverseRule !== true || safety.noUnstatedAggregation !== true || safety.selectedMethodOnly !== true) return false;\n  if (!isStringArray(safety.allowedVerdictSources, 10, 300)) return false;\n  if (!isStringArray(safety.forbiddenVerdictSources, 60, 500)) return false;\n  if (rc.aiVerdictAllowed === true && safety.isSafe !== true) return false;\n  if (safety.authoritativePolarity === 'non-binary' && safety.binaryClientVerdictAllowed !== false) return false;\n  if (safety.authoritativePolarity === 'blocked' && rc.aiVerdictAllowed === true) return false;\n\n  // A blocked/pending method may be retrievable knowledge, but the payload`;
  s = replaceOnce(s, anchor, inserted, 'sanitizer safety validation');
  write(path, s);
}

// 5) Structured output contract: add required verdictAudit + deterministic alignment validator.
{
  const path = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts';
  let s = read(path);
  s = replaceOnce(s, 'with every field present.', 'with every field present, including the professional verdict audit.', 'schema description');
  s = replaceOnce(
    s,
    "      needsOrenDecision: { type: 'boolean' },\n    },",
    `      needsOrenDecision: { type: 'boolean' },\n      verdictAudit: {\n        type: 'object',\n        properties: {\n          methodId: { type: 'string' },\n          engineVerdictPolarity: { type: 'string', enum: ['positive', 'negative', 'non-binary', 'blocked'] },\n          clientDraftPolarity: { type: 'string', enum: ['positive', 'negative', 'non-binary', 'none'] },\n          usedOnlyAuthorizedVerdictSource: { type: 'boolean' },\n          inventedInverseRule: { type: 'boolean' },\n          mixedUnselectedMethod: { type: 'boolean' },\n          unsupportedClientClaims: { type: 'array', items: { type: 'string' } },\n        },\n        required: ['methodId', 'engineVerdictPolarity', 'clientDraftPolarity', 'usedOnlyAuthorizedVerdictSource', 'inventedInverseRule', 'mixedUnselectedMethod', 'unsupportedClientClaims'],\n        additionalProperties: false,\n      },\n    },`,
    'schema verdictAudit property'
  );
  s = replaceOnce(
    s,
    "      'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision',",
    "      'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision', 'verdictAudit',",
    'schema required verdictAudit'
  );
  s = replaceOnce(
    s,
    "  needsOrenDecision: boolean;\n}",
    `  needsOrenDecision: boolean;\n  verdictAudit: {\n    methodId: string;\n    engineVerdictPolarity: 'positive' | 'negative' | 'non-binary' | 'blocked';\n    clientDraftPolarity: 'positive' | 'negative' | 'non-binary' | 'none';\n    usedOnlyAuthorizedVerdictSource: boolean;\n    inventedInverseRule: boolean;\n    mixedUnselectedMethod: boolean;\n    unsupportedClientClaims: string[];\n  };\n}`,
    'schema interface verdictAudit'
  );
  const validationAnchor = `  if (typeof obj.needsOrenDecision !== 'boolean') return { ok: false, category: 'wrong-type:needsOrenDecision' };\n\n  return {`;
  const validationInsert = `  if (typeof obj.needsOrenDecision !== 'boolean') return { ok: false, category: 'wrong-type:needsOrenDecision' };\n\n  const va = obj.verdictAudit;\n  if (!va || typeof va !== 'object' || Array.isArray(va)) return { ok: false, category: 'missing-or-wrong-type:verdictAudit' };\n  const vaObj = va as Record<string, unknown>;\n  if (typeof vaObj.methodId !== 'string' || !vaObj.methodId) return { ok: false, category: 'wrong-type:verdictAudit.methodId' };\n  if (!['positive', 'negative', 'non-binary', 'blocked'].includes(vaObj.engineVerdictPolarity as string)) return { ok: false, category: 'wrong-type:verdictAudit.engineVerdictPolarity' };\n  if (!['positive', 'negative', 'non-binary', 'none'].includes(vaObj.clientDraftPolarity as string)) return { ok: false, category: 'wrong-type:verdictAudit.clientDraftPolarity' };\n  if (typeof vaObj.usedOnlyAuthorizedVerdictSource !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.usedOnlyAuthorizedVerdictSource' };\n  if (typeof vaObj.inventedInverseRule !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.inventedInverseRule' };\n  if (typeof vaObj.mixedUnselectedMethod !== 'boolean') return { ok: false, category: 'wrong-type:verdictAudit.mixedUnselectedMethod' };\n  if (!isStringArray(vaObj.unsupportedClientClaims)) return { ok: false, category: 'wrong-type:verdictAudit.unsupportedClientClaims' };\n\n  return {`;
  s = replaceOnce(s, validationAnchor, validationInsert, 'schema validation verdictAudit');
  s = replaceOnce(
    s,
    "      needsOrenDecision: obj.needsOrenDecision,\n    },",
    `      needsOrenDecision: obj.needsOrenDecision,\n      verdictAudit: {\n        methodId: vaObj.methodId as string,\n        engineVerdictPolarity: vaObj.engineVerdictPolarity as 'positive' | 'negative' | 'non-binary' | 'blocked',\n        clientDraftPolarity: vaObj.clientDraftPolarity as 'positive' | 'negative' | 'non-binary' | 'none',\n        usedOnlyAuthorizedVerdictSource: vaObj.usedOnlyAuthorizedVerdictSource as boolean,\n        inventedInverseRule: vaObj.inventedInverseRule as boolean,\n        mixedUnselectedMethod: vaObj.mixedUnselectedMethod as boolean,\n        unsupportedClientClaims: vaObj.unsupportedClientClaims as string[],\n      },\n    },`,
    'schema return verdictAudit'
  );
  const defaultAnchor = `\nexport default { KASHF_ADVISOR_TOOL_NAME, KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput };`;
  const alignFn = `\nexport interface VerdictAlignmentResult { ok: boolean; category?: string }\n\n/**\n * Deterministic post-AI semantic gate. The model must explicitly audit the\n * polarity it used, and the server compares that audit to the engine-created\n * Professional Verdict Safety block. Any mismatch fails closed.\n */\nexport function validateKashfAdvisorVerdictAlignment(\n  output: KashfAdvisorOutput | undefined,\n  safety: unknown,\n): VerdictAlignmentResult {\n  if (!output) return { ok: false, category: 'missing-advisor-output' };\n  if (!safety || typeof safety !== 'object' || Array.isArray(safety)) return { ok: false, category: 'missing-professional-verdict-safety' };\n  const s = safety as Record<string, unknown>;\n  const audit = output.verdictAudit;\n  if (s.isSafe !== true) return { ok: false, category: 'professional-verdict-safety-not-safe' };\n  if (typeof s.kashfMethodId !== 'string' || audit.methodId !== s.kashfMethodId) return { ok: false, category: 'verdict-method-mismatch' };\n  if (audit.engineVerdictPolarity !== s.authoritativePolarity) return { ok: false, category: 'engine-polarity-mismatch' };\n  if (audit.usedOnlyAuthorizedVerdictSource !== true) return { ok: false, category: 'unauthorized-verdict-source-used' };\n  if (audit.inventedInverseRule !== false) return { ok: false, category: 'invented-inverse-rule' };\n  if (audit.mixedUnselectedMethod !== false) return { ok: false, category: 'mixed-unselected-method' };\n  if (audit.unsupportedClientClaims.length !== 0) return { ok: false, category: 'unsupported-client-claim' };\n\n  const polarity = String(s.authoritativePolarity || 'blocked');\n  const hasDraft = output.clientAnswerDraft !== null && output.clientAnswerDraft.trim().length > 0;\n  if (polarity === 'positive' || polarity === 'negative') {\n    if (s.binaryClientVerdictAllowed !== true) return { ok: false, category: 'binary-client-verdict-not-allowed' };\n    if (hasDraft && audit.clientDraftPolarity !== polarity) return { ok: false, category: 'client-draft-polarity-mismatch' };\n    if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };\n  } else if (polarity === 'non-binary') {\n    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };\n  } else {\n    if (hasDraft || audit.clientDraftPolarity !== 'none') return { ok: false, category: 'blocked-method-client-draft' };\n  }\n  return { ok: true };\n}\n\nexport default { KASHF_ADVISOR_TOOL_NAME, KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput, validateKashfAdvisorVerdictAlignment };`;
  s = replaceOnce(s, defaultAnchor, alignFn, 'schema alignment function');
  write(path, s);
}

// 6) Edge function: enforce verdict alignment after schema validation.
{
  const path = 'supabase/functions/oren-smart-advisor/index.ts';
  let s = read(path);
  s = replaceOnce(
    s,
    "import { KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput } from './oren-smart-advisor-brain-tool-schema.ts';",
    "import { KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput, validateKashfAdvisorVerdictAlignment } from './oren-smart-advisor-brain-tool-schema.ts';",
    'index schema import'
  );
  s = replaceOnce(
    s,
    "      sourceEvidence?: unknown;\n    } | undefined;",
    "      sourceEvidence?: unknown;\n      professionalVerdictSafety?: unknown;\n    } | undefined;",
    'index readingContext safety type'
  );
  s = replaceOnce(
    s,
    "    confidence: 'low',\n    needsOrenDecision: false,\n  };",
    `    confidence: 'low',\n    needsOrenDecision: false,\n    verdictAudit: {\n      methodId: 'mock',\n      engineVerdictPolarity: 'blocked',\n      clientDraftPolarity: 'none',\n      usedOnlyAuthorizedVerdictSource: true,\n      inventedInverseRule: false,\n      mixedUnselectedMethod: false,\n      unsupportedClientClaims: [] as string[],\n    },\n  };`,
    'index mock verdictAudit'
  );
  const liveAnchor = `    if (!validation.ok || !validation.value) {\n      logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: false, error: 'schema-validation-failed', schemaValidationErrorCategory: validation.category || 'unknown' }));\n      return mockFallback('anthropic-error');\n    }\n\n    logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: true }));`;
  const liveReplace = `    if (!validation.ok || !validation.value) {\n      logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: false, error: 'schema-validation-failed', schemaValidationErrorCategory: validation.category || 'unknown' }));\n      return mockFallback('anthropic-error');\n    }\n\n    const verdictAlignment = validateKashfAdvisorVerdictAlignment(\n      validation.value,\n      readingContext?.professionalVerdictSafety,\n    );\n    if (!verdictAlignment.ok) {\n      logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: false, error: 'verdict-alignment-failed', schemaValidationErrorCategory: verdictAlignment.category || 'unknown' }));\n      return mockFallback('professional-verdict-safety-failed');\n    }\n\n    logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: true }));`;
  s = replaceOnce(s, liveAnchor, liveReplace, 'index alignment gate');
  write(path, s);
}

// 7) Live prompt: Professional Verdict Safety is a new hard rule.
{
  const path = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';
  let s = read(path);
  s = replaceOnce(s, "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v6';", "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v7';", 'prompt version');
  const inputAnchor = `\nמבנה הקלט שתקבל (JSON) — AI Context Package:`;
  const rule17 = `\n17. Professional Verdict Safety — readingContext.professionalVerdictSafety הוא\n    שער-בטיחות מקצועי מחייב ולא המלצה. הפסק ללקוח נקבע לפי ההיררכיה:\n    השיטה שנבחרה בפועל > הדין הייעודי המדויק לשאלה > הענפים המפורשים של\n    אותו דין > חומר הסבר מאותו דין > משמעות כללית של צורה/בית > שיטות או\n    ספרים אחרים. שכבה נמוכה לעולם אינה רשאית להפוך, לרכך, לסייג או לאזן\n    שכבה גבוהה. allowedVerdictSources הם מקורות הפסק היחידים;\n    explanationOnlySources מותרים להסבר בלבד; forbiddenVerdictSources אסורים\n    לפסק. בפרט: readingContext.board ו-figureState הם קונטקסט בלבד — אסור\n    להסיק מהם פסק חדש; אסור להפוך כלל חד-כיווני (\"אם X אז טוב\" אינו אומר\n    \"אם לא X אז רע\"); אסור להמציא רוב/שקלול; ואסור להפעיל method אחר\n    מאותו topic בלי שנבחר במפורש. אם authoritativePolarity הוא positive או\n    negative, clientAnswerDraft חייב לשמור בדיוק את אותו קוטב. אם הוא\n    non-binary, אסור ליצור כן/לא. אם הוא blocked או isSafe אינו true —\n    clientAnswerDraft חייב להיות null. לפני החזרת הפלט מלא verdictAudit בכנות:\n    methodId וה-engineVerdictPolarity חייבים להתאים לשער; clientDraftPolarity\n    חייב לתאר את הטיוטה בפועל; usedOnlyAuthorizedVerdictSource חייב להיות true;\n    inventedInverseRule ו-mixedUnselectedMethod חייבים להיות false; וכל טענה\n    מהותית ללקוח שאין לה ענף מפורש בשיטה הנבחרת חייבת להופיע ב-\n    unsupportedClientClaims — ואז השרת ידחה את הפלט. בדוגמת p210 נישואין:\n    H15 שאינו מיטיב אינו מוכיח לבדו חסימה/כישלון, ו-H16 כלל אינו חלק מפסק\n    p210; אסור להשתמש בהם כדי להפוך פסק שנקבע מההולדה המפורשת H1+H5.\n`;
  s = replaceOnce(s, inputAnchor, rule17 + inputAnchor, 'prompt rule17');
  s = replaceOnce(
    s,
    "- readingContext.aiVerdictAllowed: שער קשיח — רק true מתיר לדון בפסק שכבר חושב\n- readingContext.methodMetadata: הצהרת-בידוד-שיטות מחייבת — ראה כלל 12",
    "- readingContext.aiVerdictAllowed: שער קשיח — רק true מתיר לדון בפסק שכבר חושב\n- readingContext.professionalVerdictSafety: היררכיית-הפסק, קוטב-המנוע ומקורות-פסק אסורים/מותרים — ראה כלל 17\n- readingContext.methodMetadata: הצהרת-בידוד-שיטות מחייבת — ראה כלל 12",
    'prompt input safety field'
  );
  s = replaceOnce(
    s,
    "- needsOrenDecision: boolean\n\nדוגמת-כשל",
    `- needsOrenDecision: boolean\n- verdictAudit: { methodId: string, engineVerdictPolarity: \"positive\"|\"negative\"|\"non-binary\"|\"blocked\", clientDraftPolarity: \"positive\"|\"negative\"|\"non-binary\"|\"none\", usedOnlyAuthorizedVerdictSource: boolean, inventedInverseRule: boolean, mixedUnselectedMethod: boolean, unsupportedClientClaims: מערך-מחרוזות }\n\nדוגמת-כשל`,
    'prompt output verdictAudit'
  );
  write(path, s);
}

// 8) Human-readable prompt mirror: record the same safety principle.
{
  const path = 'ai/prompts/oren-smart-advisor-brain.prompt.md';
  let s = read(path);
  const anchor = `\n## תת-פרומפטים למודולים`;
  const section = `\n## Professional Verdict Safety — כלל מחייב\n\nכאשר קיים \`readingContext.professionalVerdictSafety\`, הוא גובר על כל ניסיון של הבינה לפרש את הלוח מחדש. היררכיית הפסק: **השיטה שנבחרה > הדין הייעודי לשאלה > הענפים המפורשים של אותו דין > חומר הסבר > משמעות כללית של צורה/בית > שיטה/ספר אחר**. אין להפוך כלל חד-כיווני, אין להמציא רוב או שקלול, ואין לערב method אחר מאותו topic ללא בחירה מפורשת. \`readingContext.board\` ו-\`figureState\` הם קונטקסט בלבד ואינם מקור פסק עצמאי. אם \`overallPositive\` בינארי, טיוטת הלקוח חייבת לשמור בדיוק את אותו קוטב; אם הוא null, אסור להמציא כן/לא. כל פלט Kashf מובנה חייב לכלול \`verdictAudit\` והשרת משווה אותו דטרמיניסטית לשער הבטיחות. במקרה p210 נישואין, H15 שאינו מיטיב אינו מוכיח לבדו חסימה/כישלון ו-H16 אינו חלק ממבצע p210; אין להשתמש בהם כדי להפוך את ההולדה המפורשת H1+H5.\n`;
  s = replaceOnce(s, anchor, section + anchor, 'markdown prompt safety section');
  write(path, s);
}

// 9) Existing structured-output regression fixture: update 12 -> 13 fields and verdictAudit.
{
  const path = '_test_kashf_structured_tool_output.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "  needsOrenDecision: false,\n};",
    `  needsOrenDecision: false,\n  verdictAudit: {\n    methodId: 'test.method',\n    engineVerdictPolarity: 'non-binary',\n    clientDraftPolarity: 'none',\n    usedOnlyAuthorizedVerdictSource: true,\n    inventedInverseRule: false,\n    mixedUnselectedMethod: false,\n    unsupportedClientClaims: [],\n  },\n};`,
    'structured test fixture verdictAudit'
  );
  s = replaceOnce(s, 'required.length === 12', 'required.length === 13', 'structured test required count');
  s = s.replace('full 12-field required list', 'full 13-field required list');
  write(path, s);
}

console.log('Professional Verdict Safety patch applied.');
