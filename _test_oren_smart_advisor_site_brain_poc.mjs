/**
 * _test_oren_smart_advisor_site_brain_poc.mjs
 *
 * PoC מקומי-בלבד ל-Oren Smart Advisor Brain (ראו OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md).
 * בודק את השרשרת המלאה: טעינת ה-prompt הראשי → בניית input מ-5 דוגמאות-אמיתיות
 * (מ-KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md, שחוזרות ל-mothers/clientContext
 * המתועדים שם) → callAnthropic עם fetch מזויף (ai/provider/anthropic-provider.js,
 * לא שונה) → פרסור-JSON → ולידציה מלאה על 12 המפתחות + כללי-בטיחות.
 *
 * אין קריאת-רשת-אמיתית. אין מפתח-אמיתי (apiKey למטה הוא מחרוזת-מזויפת-מפורשת,
 * לעולם לא נקרא מ-process.env/secret אמיתי).
 */

import { readFileSync } from 'node:fs';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { sanitizeKashfClientContext } from './goral-hachol/engine/kashf-context-sanitizer.js';
import { callAnthropic } from './ai/provider/anthropic-provider.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// ── 1. טעינת ה-prompt הראשי ─────────────────────────────────────────────
console.log('\n--- 1. טעינת ai/prompts/oren-smart-advisor-brain.prompt.md ---');
const PROMPT_PATH = './ai/prompts/oren-smart-advisor-brain.prompt.md';
const promptText = readFileSync(PROMPT_PATH, 'utf8');
assert(promptText.length > 500, 'קובץ ה-prompt הראשי נטען ולא-ריק');
assert(promptText.includes('Oren Smart Advisor Brain'), 'ה-prompt מזהה את עצמו כ-Oren Smart Advisor Brain');
assert(promptText.includes('client-facing'), 'ה-prompt מכיל את כלל "לא client-facing"');

// ── 2. 5 דוגמאות-אמיתיות (mothers מדויקים מהקובץ הקיים) ──────────────────
const SAMPLES = [
  {
    label: 'דוגמה 1 — שכיר ששואל אם לפתוח עסק',
    mothers: ['2222', '2211', '2121', '2221'],
    ctx: { name: 'יוסי', question: 'האם כדאי לי לפתוח עסק חדש?', gender: 'male', workStatus: 'employed' },
  },
  {
    label: 'דוגמה 6 — quesitedName: שותף בעסקה',
    mothers: ['2122', '1111', '2212', '2222'],
    ctx: { name: 'רונית', question: 'האם השותפות עם השותף המוצע תצליח?', gender: 'female', workStatus: 'self', quesitedName: 'השותף המוצע' },
  },
  {
    label: 'דוגמה 8 — dynFields רגישים',
    mothers: ['1111', '2222', '1121', '2222'],
    ctx: { name: 'שרה', question: 'האם אצליח לסגור את העסקה?', gender: 'female', workStatus: 'self', dynFields: { debtDetails: 'יש לי חוב אישי-משפחתי גדול לגיס שלי ואני חוששת שזה ישפיע' } },
  },
  {
    label: 'דוגמה 9 — ודאות נמוכה',
    mothers: ['1112', '1122', '2211', '1112'],
    ctx: { name: 'עומר', question: 'האם כדאי לי להמשיך בעסק?', gender: 'male', workStatus: 'self' },
  },
  {
    label: 'דוגמה 12 — phone קיים + employed, שלילי',
    mothers: ['1122', '2112', '2211', '2212'],
    ctx: { name: 'רחל', question: 'האם כדאי לי להיכנס לעסק הזה?', gender: 'female', workStatus: 'employed', phone: '0521234567' },
  },
];

// ── 3. Mock-תשובות-AI ידניות, מעוגנות-לכל-דוגמה (לא-גנריות) ───────────────
function mockAiResponseFor(label, input) {
  const base = {
    module: 'kashf',
    advisorDiagnosis: `ניתוח-פנימי עבור ${input.clientContext.name}: ${input.readingData.judge}`,
    clientAnswerDraft: input.engineOutput.clientWordingExisting + ' ' + input.engineOutput.practicalGuidanceExisting,
    engineCritique: { hasProblem: false, problems: [], severity: 'none' },
    missingKnowledgeOrRules: [],
    recommendedFix: '',
    codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },
    safetyNotes: [],
    privacyBlockedFields: input.safetyRestrictions,
    nextBestAction: 'approveOutput',
    confidence: 'medium',
    needsOrenDecision: false,
  };

  if (label.includes('דוגמה 1')) {
    return { ...base, engineCritique: { hasProblem: false, problems: [], severity: 'none' }, nextBestAction: 'approveOutput' };
  }
  if (label.includes('דוגמה 6')) {
    return {
      ...base,
      engineCritique: { hasProblem: true, problems: ['quesitedName ("השותף המוצע") מגיע ב-clientSafeContext אך לא-מוזכר כלל ב-clientWordingExisting'], severity: 'minor' },
      missingKnowledgeOrRules: ['clientSafeContext.quesitedName לא-נצרך היום ב-kashf-commerce-smart-layer.js'],
      recommendedFix: 'להרחיב את שכבת-הניסוח כך שתתייחס לתפקיד-הנישאל (שותף/קונה/מוכר) כשהוא רלוונטי',
      codeInstructionForClaude: {
        needed: true,
        instruction: 'הרחב את kashf-commerce-smart-layer.js כך ש-clientSafeContext.quesitedName ישפיע על clientWordingAdjustments כשהוא קיים וה-topicId הוא commerce',
        filesToInspect: ['goral-hachol/engine/kashf-commerce-smart-layer.js', 'goral-hachol/engine/kashf-context-sanitizer.js'],
        filesNotToTouch: ['goral-hachol/engine/kashf-reading-engine.js', 'goral-hachol/engine/kashf-narrative-writer.js'],
        testsToRun: ['_test_kashf_commerce_context_aware.mjs', '_test_kashf_commerce_smart_layer.mjs'],
      },
      nextBestAction: 'sendInstructionToClaude',
      needsOrenDecision: true,
    };
  }
  if (label.includes('דוגמה 8')) {
    return {
      ...base,
      safetyNotes: ['dynFields.debtDetails הוא sensitive:true — לא-נכלל ב-clientAnswerDraft'],
      nextBestAction: 'approveOutput',
    };
  }
  if (label.includes('דוגמה 9')) {
    return {
      ...base,
      confidence: 'low',
      engineCritique: { hasProblem: true, problems: ['board.leshonHaInyan הוא null — לשון-העניין לא-מחוברת, יכלה-לחזק את האבחון בוודאות-נמוכה'], severity: 'minor' },
      missingKnowledgeOrRules: ['kashf-leshon-hainyan.js קיים אך לא-מיובא ב-kashf-reading-engine.js'],
      nextBestAction: 'approveOutput',
      needsOrenDecision: false,
    };
  }
  if (label.includes('דוגמה 12')) {
    return { ...base, safetyNotes: ['phone חסום מ-clientAnswerDraft'], nextBestAction: 'approveOutput' };
  }
  return base;
}

const VALID_NEXT_ACTIONS = new Set(['approveOutput', 'rewriteClientAnswerOnly', 'fixEngineLogic', 'addMissingRule', 'improvePrompt', 'askOrenForClarification', 'sendInstructionToClaude']);
const REQUIRED_KEYS = ['module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique', 'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude', 'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision'];

const FAKE_API_KEY = 'test-fake-key-do-not-use-not-real'; // מחרוזת-מזויפת-מפורשת, לא נקרא מ-env/secret
const results = [];

for (const sample of SAMPLES) {
  console.log(`\n--- ${sample.label} ---`);
  const board = buildRamlBoardFromMothers(sample.mothers);
  const reading = buildKashfReading(board, 'commerce', sample.ctx);
  assert(reading.valid, `${sample.label}: הלוח תקין`);

  const layer = reading.commerceSmartLayer;
  const sanitized = sanitizeKashfClientContext(reading);

  const judgeHouse = reading.keyHouseReadings.find((h) => h.houseNum === 15);
  const witnessSummary = reading.witnessTestimony
    ? `${reading.witnessTestimony.w13?.hebrewSummary || ''}; ${reading.witnessTestimony.w14?.hebrewSummary || ''}`
    : '';

  // ── בניית input JSON לפי הדרישה המפורשת (module/subModule/userIntent/וכו') ──
  const input = {
    module: 'kashf',
    subModule: 'commerce',
    userIntent: 'בדוק את המסקנה הקיימת עבור קריאת commerce זו והצע שיפור אם צריך',
    clientContext: sanitized.clientSafeContext,
    question: reading.clientContext.question,
    readingData: {
      keyHouses: reading.keyHouseReadings.map((h) => `בית ${h.houseNum}: ${h.figureName} — ${h.qualityHebrew}`),
      judge: judgeHouse ? `בית 15: ${judgeHouse.figureName} — ${judgeHouse.qualityHebrew}` : null,
      witnesses: witnessSummary,
      dhamir: reading.dhamir?.winner?.nameHebrew || null,
      leshonHaInyan: null,
    },
    engineOutput: {
      certaintyLevel: layer?.certaintyLevel,
      contradictions: layer?.contradictions || [],
      clientWordingExisting: layer?.clientWording || '',
      practicalGuidanceExisting: layer?.practicalGuidance || '',
    },
    sourceKnowledge: reading.primaryFormula?.sourceText || null,
    sourceRules: reading.altFormula?.sourceText ? [reading.altFormula.sourceText] : [],
    safetyRestrictions: sanitized.blockedContextFields,
    currentOutputToCritique: `${layer?.clientWording || ''} ${layer?.practicalGuidance || ''}`.trim(),
    orenStyleRules: ['לא מתלהם', 'לא מיסטי-מדי', 'מקצועי-וזהיר', 'מפריד יועץ/לקוח'],
  };

  // ── mock fetch — לא-קריאת-רשת-אמיתית, לא-מפתח-אמיתי ──────────────────────
  const originalFetch = globalThis.fetch;
  const mockOutput = mockAiResponseFor(sample.label, input);
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ content: [{ type: 'text', text: JSON.stringify(mockOutput) }] }),
  });

  let providerResult;
  try {
    providerResult = await callAnthropic({
      apiKey: FAKE_API_KEY,
      model: 'test-model-not-real',
      system: promptText,
      userMessage: JSON.stringify(input),
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert(providerResult.ok === true, `${sample.label}: callAnthropic (עם fetch מזויף) מחזיר ok:true`);

  let output;
  try {
    output = JSON.parse(providerResult.text);
  } catch (err) {
    assert(false, `${sample.label}: הפלט הוא JSON תקין`);
    continue;
  }
  assert(true, `${sample.label}: הפלט הוא JSON תקין`);

  // ── ולידציה מלאה ─────────────────────────────────────────────────────
  const hasAllKeys = REQUIRED_KEYS.every((k) => k in output);
  assert(hasAllKeys, `${sample.label}: כל 12 המפתחות הנדרשים קיימים`);
  assert(output.module === 'kashf', `${sample.label}: module === "kashf"`);
  assert(typeof output.engineCritique === 'object' && 'hasProblem' in output.engineCritique && 'problems' in output.engineCritique && 'severity' in output.engineCritique, `${sample.label}: engineCritique כולל hasProblem/problems/severity`);
  assert(typeof output.codeInstructionForClaude === 'object' && ['needed', 'instruction', 'filesToInspect', 'filesNotToTouch', 'testsToRun'].every((k) => k in output.codeInstructionForClaude), `${sample.label}: codeInstructionForClaude כולל את כל 5 תתי-השדות`);
  assert(VALID_NEXT_ACTIONS.has(output.nextBestAction), `${sample.label}: nextBestAction הוא מתוך ה-enum המוגדר (בפועל: ${output.nextBestAction})`);
  assert(typeof output.needsOrenDecision === 'boolean', `${sample.label}: needsOrenDecision הוא boolean`);

  // privacyBlockedFields לא מופיע בתוך clientAnswerDraft (בדיקת שם-שדה, לא ערך)
  const leakedFieldNames = (output.privacyBlockedFields || []).filter((f) => output.clientAnswerDraft.includes(f));
  assert(leakedFieldNames.length === 0, `${sample.label}: אין שם-שדה מ-privacyBlockedFields בתוך clientAnswerDraft`);

  // phone לא מופיע ב-clientAnswerDraft
  if (sample.ctx.phone) {
    assert(!output.clientAnswerDraft.includes(sample.ctx.phone), `${sample.label}: phone (${sample.ctx.phone}) לא מופיע ב-clientAnswerDraft`);
  }

  // dynFields רגישים לא מצוטטים ללקוח
  if (sample.ctx.dynFields) {
    for (const val of Object.values(sample.ctx.dynFields)) {
      assert(!output.clientAnswerDraft.includes(val), `${sample.label}: תוכן-dynFields ("${val.slice(0, 20)}...") לא מצוטט ב-clientAnswerDraft`);
    }
  }

  results.push({ label: sample.label, input, output });
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log(`כל הבדיקות עברו. 5/5 דוגמאות תקינות מקצה-לקצה: prompt נטען, input נבנה מנתונים-אמיתיים, callAnthropic (fetch מזויף בלבד) מחזיר JSON תקין, כל 12 המפתחות+כללי-הבטיחות מאומתים.`);

// ייצוא-לשימוש-חיצוני (למשל בעת יצירת הדוח) — לא-חלק-מהבדיקה עצמה
export { results };
