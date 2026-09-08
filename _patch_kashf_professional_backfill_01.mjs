#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const i = text.indexOf(needle);
  if (i < 0) throw new Error(`Missing anchor: ${label}`);
  if (text.indexOf(needle, i + needle.length) >= 0) throw new Error(`Non-unique anchor: ${label}`);
  return text.slice(0, i) + replacement + text.slice(i + needle.length);
}

// 1) Professional Verdict Safety: certify first backfill batch and expose
// certification separately from generic AI-advisor safety.
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v1';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v2';",
    'safety version'
  );
  s = replaceOnce(
    s,
    "const P210_MARRIAGE_METHOD = 'marriage.p210.generalMarriageH1H2H7H8H10Judge';\nconst P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';",
    `const P174_GENERAL_METHOD = 'general.p174.h1h2h4h7h10h15';\nconst P182_SIBLING_SENIORITY_METHOD = 'siblings.p182.seniority';\nconst P244_TRAVELER_RETURN_METHOD = 'travel.p244.returnH1H2H9';\nconst P249_MISSING_RETURN_METHOD = 'missing.p249.returnAnglesJudge';\nconst P210_MARRIAGE_METHOD = 'marriage.p210.generalMarriageH1H2H7H8H10Judge';\nconst P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';`,
    'method constants'
  );
  const beforeP210 = 'function p210Policy() {';
  const policies = `function p174Policy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-01',\n    goldenCaseIds: freezeArray(['PV-BF01-P174']),\n    policyId: 'p174-general-state-no-aggregation-v1',\n    questionScopeHebrew: 'קריאה כללית תחומה לפי עמ׳ 174',\n    decisiveRuleHebrew: 'אין כאן פסק כן/לא יחיד: המקור מורה לקרוא בנפרד את H1,H2,H4,H7,H10,H15 לפי תפקידיהם.',\n    oneWayBranches: freezeArray([]),\n    forbiddenInversions: freezeArray([\n      'בית שאינו מיטיב אינו מוכיח שהמצב הכללי רע; אין כלל היפוך כזה בשיטה.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'כל בית מחוץ H1,H2,H4,H7,H10,H15.',\n      'כל רוב, ממוצע, ניקוד או שקלול בין ששת הבתים.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'המצב הכללי טוב',\n      'המצב הכללי רע',\n      'רוב הסימנים חיוביים ולכן התשובה כן',\n    ]),\n  });\n}\n\nfunction p182Policy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-01',\n    goldenCaseIds: freezeArray(['PV-BF01-P182']),\n    policyId: 'p182-sibling-seniority-named-figures-v1',\n    questionScopeHebrew: 'סימן לגדולים/בכורה בין אחים לפי עמ׳ 182',\n    decisiveRuleHebrew: 'ב-H3 קהלה (2222) מורה על גדולים, ובייחוד מצד האב; שפל ראש (2221) גם מורה על גדולים.',\n    oneWayBranches: freezeArray([\n      'H3 קהלה (2222) => סימן לגדולים, ובייחוד לגדולים מצד האב',\n      'H3 שפל ראש (2221) => סימן לגדולים',\n    ]),\n    forbiddenInversions: freezeArray([\n      'כל צורה אחרת ב-H3 אינה מוכיחה שהאח צעיר יותר.',\n      'אי-קיום קהלה/שפל ראש אינו מזהה מי הבכור מן הדעת.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'משמעות כללית של H1 או שיטות יחסי-אחים אחרות.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'האח צעיר יותר משום שלא יצאה קהלה או שפל ראש',\n      'זהו אח מסוים בשם',\n    ]),\n  });\n}\n\nfunction p244Policy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-01',\n    goldenCaseIds: freezeArray(['PV-BF01-P244-POSITIVE', 'PV-BF01-P244-HARDSHIP']),\n    policyId: 'p244-traveler-return-one-way-v1',\n    questionScopeHebrew: 'חזרת נוסע מן המסע לפי עמ׳ 244',\n    decisiveRuleHebrew: 'H1,H2,H9 מיטיבים ופנימיים תומכים בחזרה בטוב ובשמחה. אם שלושתם מזיקים, המקור מוסר יגיעה ולעיתים אי-חזרה — לא פסק ודאי של אי-חזרה.',\n    oneWayBranches: freezeArray([\n      'H1+H2+H9 כולם מיטיבים ופנימיים => ישוב אל ארצו בטוב ובשמחה',\n      'H1+H2+H9 כולם מזיקים => יגיעה במסע, ולעיתים לא ישוב',\n    ]),\n    forbiddenInversions: freezeArray([\n      'כישלון התנאי החיובי אינו מוכיח אי-חזרה.',\n      'הענף המזיק אינו מתיר להפוך "לעיתים לא ישוב" ל"לא ישוב" ודאי.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'כלל H5 הנפרד על בן-לוויה.',\n      'missing.p249.returnAnglesJudge — דין נעדר נפרד.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'הנוסע בוודאות לא יחזור',\n      'רוב הבתים חיוביים ולכן יחזור',\n    ]),\n  });\n}\n\nfunction p249Policy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-01',\n    goldenCaseIds: freezeArray(['PV-BF01-P249']),\n    policyId: 'p249-missing-return-male-scope-v1',\n    questionScopeHebrew: 'סימן חזרת נעדר/בורח בזכרים לפי עמ׳ 249',\n    decisiveRuleHebrew: 'היתדות H1,H4,H7,H10 צריכות לשאת צורות מיטיבות פנימיות, וגם H15 צריך להעיד לכך; אז המקור מורה על חזרת הזכרים.',\n    oneWayBranches: freezeArray([\n      'כל ארבע היתדות מיטיבות ופנימיות + H15 מעיד לכך => סימן לחזרת הזכרים',\n    ]),\n    forbiddenInversions: freezeArray([\n      'אי-קיום התנאי אינו מוכיח שהנעדר לא יחזור.',\n      'הסימן אינו פסק אוניברסלי לכל נעדר ואינו מורחב בשקט מעבר ללשון הזכרים.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'travel.p244.returnH1H2H9 — דין נוסע נפרד.',\n      'missing.p248-249.lifeH1H4H9Outcome — דין חיים/מוות נפרד.',\n      'שיטות מיקום/כיוון של נעדר.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'הנעדר לא יחזור',\n      'כל נעדר יחזור ללא הגבלת מין/הקשר',\n    ]),\n  });\n}\n\n`;
  s = replaceOnce(s, beforeP210, policies + beforeP210, 'insert batch policies');
  s = replaceOnce(
    s,
    "    policyId: 'p210-marriage-source-hierarchy-v1',",
    "    certificationStatus: 'certified',\n    certificationBatch: 'golden-case-001',\n    goldenCaseIds: freezeArray(['PV-GC001-P210']),\n    policyId: 'p210-marriage-source-hierarchy-v1',",
    'p210 certification metadata'
  );
  s = replaceOnce(
    s,
    `const METHOD_POLICIES = Object.freeze({\n  [P210_MARRIAGE_METHOD]: p210Policy(),\n});`,
    `const METHOD_POLICIES = Object.freeze({\n  [P174_GENERAL_METHOD]: p174Policy(),\n  [P182_SIBLING_SENIORITY_METHOD]: p182Policy(),\n  [P244_TRAVELER_RETURN_METHOD]: p244Policy(),\n  [P249_MISSING_RETURN_METHOD]: p249Policy(),\n  [P210_MARRIAGE_METHOD]: p210Policy(),\n});\n\nexport const KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS = Object.freeze(\n  Object.entries(METHOD_POLICIES)\n    .filter(([, policy]) => policy?.certificationStatus === 'certified')\n    .map(([methodId]) => methodId)\n);\n\nexport function isKashfMethodProfessionallyCertified(methodId) {\n  return KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(methodId);\n}`,
    'method policy map'
  );
  s = replaceOnce(
    s,
    `  const methodSpecificPolicy = METHOD_POLICIES[methodId] || null;\n  const doNotMixWith = Array.isArray(canonicalRetrieval?.doNotMixWith)`,
    `  const methodSpecificPolicy = METHOD_POLICIES[methodId] || null;\n  const certificationStatus = methodSpecificPolicy?.certificationStatus === 'certified'\n    ? 'certified'\n    : (sourceReady && readingReady ? 'pending-backfill' : 'not-applicable');\n  const clientFacingCertified = certificationStatus === 'certified';\n  const doNotMixWith = Array.isArray(canonicalRetrieval?.doNotMixWith)`,
    'certification state derivation'
  );
  s = replaceOnce(
    s,
    `    requiresExactPolarityMatch: true,\n    binaryClientVerdictAllowed: Boolean(isSafe && (polarity === 'positive' || polarity === 'negative')),\n    nonBinaryExplanationAllowed: Boolean(isSafe && polarity === 'non-binary'),`,
    `    requiresExactPolarityMatch: true,\n    certificationStatus,\n    clientFacingCertified,\n    certificationBatch: methodSpecificPolicy?.certificationBatch || null,\n    goldenCaseIds: freezeArray(methodSpecificPolicy?.goldenCaseIds || []),\n    binaryClientVerdictAllowed: Boolean(isSafe && clientFacingCertified && (polarity === 'positive' || polarity === 'negative')),\n    nonBinaryExplanationAllowed: Boolean(isSafe && clientFacingCertified && polarity === 'non-binary'),`,
    'client certification fields'
  );
  s = replaceOnce(
    s,
    `  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,\n};`,
    `  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,\n  KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS,\n  isKashfMethodProfessionallyCertified,\n};`,
    'default export certification'
  );
  write(path, s);
}

// 2) AI prompts: uncertified engines remain advisor-readable, but client-facing
// draft generation is hard-blocked until the method has passed backfill.
{
  const path = 'ai/prompts/oren-smart-advisor-brain.prompt.md';
  let s = read(path);
  const old = 'אם `overallPositive` בינארי, טיוטת הלקוח חייבת לשמור בדיוק את אותו קוטב; אם הוא null, אסור להמציא כן/לא. כל פלט Kashf מובנה חייב לכלול `verdictAudit` והשרת משווה אותו דטרמיניסטית לשער הבטיחות.';
  const neu = 'אם `overallPositive` בינארי, טיוטת הלקוח חייבת לשמור בדיוק את אותו קוטב; אם הוא null, אסור להמציא כן/לא. **בנוסף, `professionalVerdictSafety.certificationStatus` חייב להיות `certified` ו-`clientFacingCertified` חייב להיות true לפני שמותר להחזיר `clientAnswerDraft`; בכל מצב `pending-backfill`/`not-applicable` הטיוטה חייבת להיות null, גם אם המנוע עצמו runnable.** כל פלט Kashf מובנה חייב לכלול `verdictAudit` והשרת משווה אותו דטרמיניסטית לשער הבטיחות.';
  s = replaceOnce(s, old, neu, 'main prompt certification rule');
  write(path, s);
}
{
  const path = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';
  let s = read(path);
  s = replaceOnce(s, "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v7';", "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v8';", 'prompt version');
  const old = `    non-binary, אסור ליצור כן/לא. אם הוא blocked או isSafe אינו true —\n    clientAnswerDraft חייב להיות null. לפני החזרת הפלט מלא verdictAudit בכנות:`;
  const neu = `    non-binary, אסור ליצור כן/לא. אם הוא blocked או isSafe אינו true —\n    clientAnswerDraft חייב להיות null. גם כאשר isSafe=true והמנוע runnable,\n    אם certificationStatus אינו \"certified\" או clientFacingCertified אינו true —\n    המנוע עדיין בבדיקת-Backfill מקצועית: מותר לנתח אותו ליועץ, אבל\n    clientAnswerDraft חייב להיות null. לפני החזרת הפלט מלא verdictAudit בכנות:`;
  s = replaceOnce(s, old, neu, 'edge prompt certification rule');
  write(path, s);
}

// 3) Sanitizer validates certification metadata and prevents a payload from
// claiming client-facing certification inconsistently.
{
  const path = 'supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
  let s = read(path);
  const anchor = `  if (typeof safety.binaryClientVerdictAllowed !== 'boolean') return false;\n  if (safety.noInverseRule !== true || safety.noUnstatedAggregation !== true || safety.selectedMethodOnly !== true) return false;`;
  const replacement = `  if (typeof safety.binaryClientVerdictAllowed !== 'boolean') return false;\n  if (!['certified', 'pending-backfill', 'not-applicable'].includes(String(safety.certificationStatus || ''))) return false;\n  if (typeof safety.clientFacingCertified !== 'boolean') return false;\n  if ((safety.certificationStatus === 'certified') !== (safety.clientFacingCertified === true)) return false;\n  if (safety.binaryClientVerdictAllowed === true && safety.clientFacingCertified !== true) return false;\n  if (safety.noInverseRule !== true || safety.noUnstatedAggregation !== true || safety.selectedMethodOnly !== true) return false;`;
  s = replaceOnce(s, anchor, replacement, 'sanitizer certification metadata');
  write(path, s);
}

// 4) Server-side semantic alignment: uncertified methods may still produce an
// advisor-only diagnosis, but absolutely no clientAnswerDraft.
{
  const path = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts';
  let s = read(path);
  const old = `  const polarity = String(s.authoritativePolarity || 'blocked');\n  const hasDraft = output.clientAnswerDraft !== null && output.clientAnswerDraft.trim().length > 0;\n  if (polarity === 'positive' || polarity === 'negative') {\n    if (s.binaryClientVerdictAllowed !== true) return { ok: false, category: 'binary-client-verdict-not-allowed' };\n    if (hasDraft && audit.clientDraftPolarity !== polarity) return { ok: false, category: 'client-draft-polarity-mismatch' };\n    if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };\n  } else if (polarity === 'non-binary') {\n    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };\n  } else {\n    if (hasDraft || audit.clientDraftPolarity !== 'none') return { ok: false, category: 'blocked-method-client-draft' };\n  }`;
  const neu = `  const polarity = String(s.authoritativePolarity || 'blocked');\n  const hasDraft = output.clientAnswerDraft !== null && output.clientAnswerDraft.trim().length > 0;\n  const clientFacingCertified = s.certificationStatus === 'certified' && s.clientFacingCertified === true;\n  if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };\n  if (!clientFacingCertified && hasDraft) return { ok: false, category: 'uncertified-client-draft' };\n  if (polarity === 'positive' || polarity === 'negative') {\n    if (hasDraft && s.binaryClientVerdictAllowed !== true) return { ok: false, category: 'binary-client-verdict-not-allowed' };\n    if (hasDraft && audit.clientDraftPolarity !== polarity) return { ok: false, category: 'client-draft-polarity-mismatch' };\n  } else if (polarity === 'non-binary') {\n    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };\n  } else {\n    if (hasDraft || audit.clientDraftPolarity !== 'none') return { ok: false, category: 'blocked-method-client-draft' };\n  }`;
  s = replaceOnce(s, old, neu, 'alignment certification gate');
  write(path, s);
}

// 5) Professional backfill Golden Cases: execute real canonical methods on
// controlled boards, verify no-inverse/no-aggregation/method isolation, and
// prove an unbackfilled runnable method is advisor-only.
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    `  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,\n} from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';`,
    `  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,\n  KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS,\n} from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';`,
    'test import certified ids'
  );
  const anchor = `console.log(\`\\nKashf professional verdict safety tests: \${passed} passed, \${failed} failed\`);\nif (failed) process.exit(1);`;
  const tests = `\nconsole.log('\\n--- Professional backfill batch 01 ---');\n\nfunction makeBoard(overrides = {}) {\n  return {\n    entries: Array.from({ length: 16 }, (_, index) => {\n      const house = index + 1;\n      const pattern = overrides[house] || '2222';\n      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };\n    }),\n  };\n}\n\nfunction auditOutputForSafety(safetyBlock, { draft = null, draftPolarity = 'none' } = {}) {\n  return {\n    module: 'kashf',\n    advisorDiagnosis: 'בדיקת backfill מקצועית.',\n    clientAnswerDraft: draft,\n    engineCritique: { hasProblem: false, problems: [], severity: 'none' },\n    missingKnowledgeOrRules: [],\n    recommendedFix: '',\n    codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },\n    safetyNotes: [],\n    privacyBlockedFields: [],\n    nextBestAction: 'בדיקת backfill.',\n    confidence: 'high',\n    needsOrenDecision: false,\n    verdictAudit: {\n      methodId: safetyBlock.kashfMethodId,\n      engineVerdictPolarity: safetyBlock.authoritativePolarity,\n      clientDraftPolarity: draftPolarity,\n      usedOnlyAuthorizedVerdictSource: true,\n      inventedInverseRule: false,\n      mixedUnselectedMethod: false,\n      unsupportedClientClaims: [],\n    },\n  };\n}\n\nassert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 5, 'certification registry starts with p210 + four backfilled methods');\nfor (const id of [\n  'marriage.p210.generalMarriageH1H2H7H8H10Judge',\n  'general.p174.h1h2h4h7h10h15',\n  'siblings.p182.seniority',\n  'travel.p244.returnH1H2H9',\n  'missing.p249.returnAnglesJudge',\n]) {\n  assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' is explicitly professionally certified');\n}\n\n// PV-BF01-P174 — six-house profile remains non-binary; no majority is allowed.\nconst p174 = buildKashfCanonicalAiBridge({ questionId: 'q-general-state', questionText: 'מה מצבי הכללי?', board: makeBoard({ 1:'2111', 2:'1112', 4:'2111', 7:'1112', 10:'2111', 15:'1112' }) });\nassert(p174.canonicalReading?.overallPositive === null, 'p174 remains non-binary even with a deliberately split 3/3 board');\nassert(p174.professionalVerdictSafety?.certificationStatus === 'certified', 'p174 passed professional backfill');\nassert(p174.professionalVerdictSafety?.clientFacingCertified === true, 'p174 client-facing explanation is certified');\nassert(p174.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p174 cannot become yes/no');\nassert(p174.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('רוב')), 'p174 policy explicitly forbids majority aggregation');\n\n// PV-BF01-P182 — named figures indicate seniority; every other H3 figure stays unresolved.\nconst p182Named = buildKashfCanonicalAiBridge({ questionId: 'q-sibling-eldest', questionText: 'מי הגדול בין האחים?', board: makeBoard({ 3:'2222' }) });\nconst p182NamedExec = p182Named.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p182NamedExec?.senioritySignal === 'older-paternal-emphasis', 'p182 Jamaa branch preserves older/paternal emphasis');\nassert(p182Named.professionalVerdictSafety?.certificationStatus === 'certified', 'p182 passed professional backfill');\nconst p182Other = buildKashfCanonicalAiBridge({ questionId: 'q-sibling-eldest', questionText: 'מי הגדול בין האחים?', board: makeBoard({ 3:'2111' }) });\nassert(p182Other.canonicalReading?.primaryFormula?.result?.executorResult?.senioritySignal === 'unresolved', 'p182 unlisted H3 figure is not inverted into younger');\nassert(p182Other.canonicalReading?.overallPositive === null, 'p182 unlisted branch does not invent binary polarity');\n\n// PV-BF01-P244 — positive branch is binary; hardship branch is not a certain no-return.\nconst p244Good = buildKashfCanonicalAiBridge({ questionId: 'q-traveler-return', questionText: 'האם הנוסע יחזור?', board: makeBoard({ 1:'2111', 2:'2111', 9:'2111' }) });\nassert(p244Good.canonicalReading?.overallPositive === true, 'p244 all-benefic/internal fixture gives the explicit positive return branch');\nassert(p244Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p244 passed professional backfill');\nassert(p244Good.professionalVerdictSafety?.binaryClientVerdictAllowed === true, 'p244 explicit positive branch may be stated positively');\nconst p244Hard = buildKashfCanonicalAiBridge({ questionId: 'q-traveler-return', questionText: 'האם הנוסע יחזור?', board: makeBoard({ 1:'1112', 2:'1112', 9:'1112' }) });\nassert(p244Hard.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'hardship-possible-no-return', 'p244 malefic fixture exposes hardship/possible non-return only');\nassert(p244Hard.canonicalReading?.overallPositive === null, 'p244 hardship branch is not inverted into a certain negative verdict');\nconst p244WrongNegative = validateKashfAdvisorOutput(auditOutputForSafety(p244Hard.professionalVerdictSafety, { draft: 'הנוסע לא יחזור.', draftPolarity: 'negative' }));\nassert(validateKashfAdvisorVerdictAlignment(p244WrongNegative.value, p244Hard.professionalVerdictSafety).ok === false, 'server rejects certain negative client verdict for p244 hardship/non-binary branch');\n\n// PV-BF01-P249 — return sign is explicitly male-scoped and remains non-binary globally.\nconst p249 = buildKashfCanonicalAiBridge({ questionId: 'q-missing-return', questionText: 'האם הנעדר יחזור?', board: makeBoard({ 1:'2111', 4:'2111', 7:'2111', 10:'2111', 15:'2111' }) });\nconst p249Exec = p249.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p249Exec?.returnIndicatedForMale === true, 'p249 exact angle+judge fixture exposes the male-return sign');\nassert(p249.canonicalReading?.overallPositive === null, 'p249 does not generalize male-return sign into universal yes/no');\nassert(p249.professionalVerdictSafety?.certificationStatus === 'certified', 'p249 passed professional backfill');\nassert(p249.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('לא יחזור')), 'p249 policy forbids inverse non-return claim');\n\n// p179 is intentionally NOT rubber-stamped: v57 says "יש בה צד מיטיב" while\n// the current executor gate is pure saad. Until scan-level wording is closed,\n// it stays runnable for advisor inspection but client-facing drafting is blocked.\nconst p179Pending = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'2111', 10:'2211' }) });\nassert(p179Pending.canonicalReading?.valid === true && p179Pending.canonicalReading?.canRunKashf === true, 'p179 engine remains runnable while professional wording audit is open');\nassert(p179Pending.professionalVerdictSafety?.certificationStatus === 'pending-backfill', 'p179 is explicitly pending professional backfill, not silently certified');\nassert(p179Pending.professionalVerdictSafety?.clientFacingCertified === false, 'p179 cannot produce client-facing draft before source wording closes');\nconst p179Draft = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety, { draft: 'מקור הכסף הוא מן השלטון.', draftPolarity: 'non-binary' }));\nconst p179DraftAlignment = validateKashfAdvisorVerdictAlignment(p179Draft.value, p179Pending.professionalVerdictSafety);\nassert(p179DraftAlignment.ok === false && p179DraftAlignment.category === 'uncertified-client-draft', 'server hard-blocks p179 client draft while backfill certification is pending');\nconst p179AdvisorOnly = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety));\nassert(validateKashfAdvisorVerdictAlignment(p179AdvisorOnly.value, p179Pending.professionalVerdictSafety).ok === true, 'p179 may still be analyzed advisor-only with clientAnswerDraft:null');\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'append professional backfill tests');
  write(path, s);
}

// 6) Work-order update + dedicated status file.
{
  const path = 'HALL_WISDOM_PROFESSIONAL_VERDICT_SAFETY_WORK_ORDER.md';
  let s = read(path);
  if (!s.includes('## 7. Backfill למנועים שכבר היו Ready')) {
    s += `\n\n## 7. Backfill למנועים שכבר היו Ready\n\nהתקן החדש חל רטרואקטיבית על כל המנועים הפעילים, לא רק על ששת המנועים שטרם מומשו. ` +
      '`ready` הוא סטטוס חישובי/מקורי ואינו מהווה עוד לבדו אישור לניסוח ללקוח.\n\n' +
      '- מנוע שלא עבר Backfill מקבל `certificationStatus: pending-backfill` ו-`clientFacingCertified:false`.\n' +
      '- מותר ל-AI לנתח אותו ליועץ לצורכי ביקורת, אך `clientAnswerDraft` חייב להיות `null`.\n' +
      '- רק מנוע שעבר Source/Scope/No-Inverse/No-Aggregation/Isolation/Golden-Case מקבל `certified`.\n' +
      '- Batch 01 הסמיך את p174, p182, p244, p249; p210 כבר הוסמך כ-Golden Case 001.\n' +
      '- p179 נבדק אך לא הוסמך: נוסח v57 "יש בה צד מיטיב" דורש סגירת-מקור מול שער ה-pure-benefic הקיים לפני אישור client-facing.\n';
  }
  write(path, s);
}
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  const content = `# Kashf — Professional Verdict Safety Backfill Status\n\n> תאריך: 2026-09-08\n> מטרה: הסמכה רטרואקטיבית של כל מנועי כשף שכבר היו runnable/ready לפי תקן Professional Verdict Safety.\n\n## מצב כללי\n\n- מנועי source-ready runnable לפני ה-Backfill: **43**.\n- מוסמכים מקצועית לאחר Batch 01: **5/43**.\n- ממתינים להסמכה רטרואקטיבית: **38/43**.\n- ששת מנועי source-ready שטרם קיבלו executor נשארים במסלול Source Closure נפרד וייסגרו מלכתחילה לפי התקן החדש.\n\n## מוסמכים\n\n| Method | תקן | Golden Case | הערה |\n|---|---|---|---|\n| marriage.p210.generalMarriageH1H2H7H8H10Judge | certified | PV-GC001-P210 | דין נישואין ייעודי; H15/H16 אינם רשאים לדרוס את פסק p210 |\n| general.p174.h1h2h4h7h10h15 | certified | PV-BF01-P174 | פרופיל שישה בתים; אין רוב/שקלול/כן-לא |\n| siblings.p182.seniority | certified | PV-BF01-P182 | רק קהלה/שפל ראש הם ענפי הגדולים; אין היפוך לצעיר |\n| travel.p244.returnH1H2H9 | certified | PV-BF01-P244-* | הענף המזיק הוא יגיעה/אפשרות אי-חזרה, לא "לא יחזור" ודאי |\n| missing.p249.returnAnglesJudge | certified | PV-BF01-P249 | סימן חזרת זכרים; אין היפוך לאי-חזרה ואין הכללה אוניברסלית |\n\n## Audit פתוח — לא להסמיך עדיין\n\n### money.p179.sourceByIncomingHonorHouse\n\n- v57: **"אם בשני יש בה צד מיטיב"**.\n- executor נוכחי מפעיל את השער רק כאשר `saadNahs === 'saad'` (מיטיב טהור).\n- זהו יישום שמרני, אבל טרם הוכח שזהה בדיוק ללשון "צד מיטיב".\n- לכן המנוע נשאר runnable לצורכי advisor/debug, אך `certificationStatus: pending-backfill` ו-`clientFacingCertified:false`.\n- לפני הסמכה: לבדוק את הסריקה הערבית בעמ׳ 179 ואת סיווג הממוזגות בהקשר הספציפי. אין לשנות executor עד שהמקור נסגר.\n\n## כלל הפעלה בזמן ה-Backfill\n\nמנוע runnable שאינו certified אינו מושבת חישובית, כדי שנוכל לבדוק אותו. עם זאת, שכבת השרת דוחה כל `clientAnswerDraft` עבורו. פלט advisor-only עם `clientAnswerDraft:null` מותר, וכך ניתן להמשיך QA בלי לסכן ייעוץ ללקוח.\n`;
  if (!fs.existsSync(path)) write(path, content);
  else throw new Error(path + ' already exists');
}

console.log('Professional Verdict Safety backfill batch 01 patch applied.');
