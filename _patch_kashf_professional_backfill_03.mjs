#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content, 'utf8'); }
function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  if (text.indexOf(from) !== text.lastIndexOf(from)) throw new Error('Non-unique anchor: ' + label);
  return text.replace(from, to);
}

// ---------------------------------------------------------------------------
// 1) Professional Verdict Safety v4: exact deterministic client draft + BF03
// ---------------------------------------------------------------------------
const safetyPath = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
let safety = read(safetyPath);
safety = replaceOnce(
  safety,
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v3';",
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v4';",
  'safety version v3'
);
safety = replaceOnce(
  safety,
  "const P206_QUERENT_DESIRE_METHOD = 'desire.p206.querentWantsH7H11ThenH5';",
  "const P206_QUERENT_DESIRE_METHOD = 'desire.p206.querentWantsH7H11ThenH5';\nconst P183_STAY_MOVE_METHOD = 'relocation.p183.stayMoveH1H2';\nconst P212_RECONCILIATION_METHOD = 'dispute.p212.reconciliationH1H7';\nconst P253_RELIGION_METHOD = 'religion.p253.h3h9Quality';\nconst P202_LOST_RETURN_METHOD = 'lostItem.p202.returnH6H8';\nconst P265_CLOTHING_LUCK_METHOD = 'clothing.p264-265.luck';",
  'batch03 method constants'
);
safety = replaceOnce(
  safety,
  "function clientInstruction(polarity) {",
  `function authoritativeClientDraftFromReading(reading) {
  const executorText = reading?.primaryFormula?.result?.executorResult?.outputHebrew;
  if (typeof executorText === 'string' && executorText.trim().length > 0) return executorText.trim();
  const verdictText = reading?.verdict?.text;
  if (typeof verdictText === 'string' && verdictText.trim().length > 0) return verdictText.trim();
  return null;
}

function clientInstruction(polarity) {`,
  'authoritative client draft helper'
);

const batch03Policies = String.raw`
function p183StayMovePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P183-STAY', 'PV-BF03-P183-MOVE', 'PV-BF03-P183-UNRESOLVED']),
    policyId: 'p183-stay-move-exact-opposites-v1',
    questionScopeHebrew: 'האם טוב להישאר במקום הנוכחי או לעבור ממנו לפי H1/H2, עמ׳ 178/183',
    decisiveRuleHebrew: 'H1 מיטיב + H2 מזיק => המקום הנוכחי טוב לו. H1 מזיק + H2 מיטיב => הדין להפך, המעבר עדיף. כל צירוף אחר אינו מוכרע בכלל זה.',
    oneWayBranches: freezeArray([
      'H1 מיטיב + H2 מזיק => להישאר; המקום הנוכחי טוב לו',
      'H1 מזיק + H2 מיטיב => הדין להפך; המעבר עדיף',
    ]),
    forbiddenInversions: freezeArray([
      'שני בתים מיטיבים, שני בתים מזיקים, עדות מפוצלת שאינה שתי הצורות המפורשות או צורה ממוזגת אינם יוצרים ענף שלישי.',
      'אין להסיק סיבת כדאיות — כסף, זוגיות, בריאות או עבודה — מן הכלל הזה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'relocation.p183.currentVsNewPlace — שיטת השוואת מקום נוכחי/חדש נפרדת.',
      'relocation.p183.h4h15 ושיטות המעבר הסמוכות בעמ׳ 183–184.',
      'משמעות כללית של בית 1 או בית 2 מעבר לצירוף המפורש.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'כדאי לעבור משום שהעבודה תהיה טובה יותר',
      'כדאי להישאר משום שהזוגיות תהיה טובה יותר',
      'שני הבתים מיטיבים ולכן בוודאות עדיף להישאר',
    ]),
  });
}

function p212ReconciliationPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P212-RECONCILIATION', 'PV-BF03-P212-NOINVERSE']),
    policyId: 'p212-reconciliation-benefic-one-way-v1',
    questionScopeHebrew: 'עצם הפיוס בין שני צדדים לפי הולדת H1+H7, עמ׳ 212',
    decisiveRuleHebrew: 'אם מן H1+H7 נולדת צורה מיטיבה — שני הצדדים יתפייסו. המקור אינו נותן בענף זה היפוך מפורש של מזיק => לא יתפייסו.',
    oneWayBranches: freezeArray([
      'תוצאת H1+H7 מיטיבה => שניהם יתפייסו',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה מזיקה אינה מתירה לקבוע שלא יהיה פיוס.',
      'תוצאה ממוזגת אינה מתירה לקבוע כן או לא.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'סעיפי זהות המפשר/המתווך — חומר הסבר נפרד שאינו יוצר את פסק כן/לא.',
      'שיטות מנצח/מנוצח, אויבים או משפט אינן חלק מפסק הפיוס הזה.',
      'Al-Falak או כל שיטת פיוס השוואתית אחרת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'לא יהיה פיוס משום שהתוצאה מזיקה',
      'פלוני יהיה המתווך בלי שהסעיף המפורש של המקור הופעל',
      'צד מסוים ינצח בסכסוך',
    ]),
  });
}

function p253ReligionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P253-BENEFIC', 'PV-BF03-P253-MALEFIC', 'PV-BF03-P253-SPLIT']),
    policyId: 'p253-religion-two-house-agreement-v1',
    questionScopeHebrew: 'מצב הדת והצדקות לפי H3/H9, עמ׳ 253',
    decisiveRuleHebrew: 'H3 ו-H9 יחד במיטיב טהור => בעל דת ויראת אלוהים; שניהם במזיק טהור => מועט בדת. עדות מפוצלת או ממוזגת נשארת בלתי מוכרעת.',
    oneWayBranches: freezeArray([
      'H3+H9 שניהם מיטיבים טהורים => בעל דת ויראת אלוהים',
      'H3+H9 שניהם מזיקים טהורים => מועט בדת',
    ]),
    forbiddenInversions: freezeArray([
      'בית מיטיב אחד ובית מזיק אחד אינם מוכרעים באמצעות רוב או העדפת בית.',
      'צורה ממוזגת אינה מקודמת בכוח לצד הנטייה שלה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'מוסר כללי, יושר, אמינות, השתייכות דתית או זהות אישית שאינם כתובים בכלל.',
      'משמעות כללית של H3/H9 מעבר לכלל המקומי.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האדם שקרן או לא מוסרי',
      'האדם שייך לדת או לזרם מסוים',
      'עדות מפוצלת מוכיחה שהוא דתי במידה בינונית',
    ]),
  });
}

function p202LostReturnPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P202-RETURN', 'PV-BF03-P202-NORETURN']),
    policyId: 'p202-lost-item-return-exact-else-v1',
    questionScopeHebrew: 'שיבת אבדה/דבר אבוד לפי H6/H8, עמ׳ 202',
    decisiveRuleHebrew: 'אם ב-H6 וב-H8 צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא. זהו ענף else מפורש במקור.',
    oneWayBranches: freezeArray([
      'H6+H8 שניהם מיטיבים ופנימיים => האבדה תשוב',
      'התנאי אינו מתקיים => האבדה לא תשוב לפי כלל זה',
    ]),
    forbiddenInversions: freezeArray([]),
    excludedFromPrimaryVerdict: freezeArray([
      'זיהוי גנב, סיבת גניבה, מיקום מדויק או תיאור אדם.',
      'theft.p224.relationshipH7Recurrence ושאר דיני גניבה.',
      'שיטות אבדה אחרות שאינן H6/H8.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פלוני גנב את האבדה',
      'האבדה נמצאת במקום מסוים',
      'האבדה תחזור בתוך פרק זמן מסוים',
    ]),
  });
}

function p265ClothingLuckPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P265-GOOD', 'PV-BF03-P265-BAD', 'PV-BF03-P265-ROYAL-QUALIFIER', 'PV-BF03-P265-MIXED']),
    policyId: 'p265-clothing-luck-layered-branches-v1',
    questionScopeHebrew: 'מזל בלבוש לפי H5/H11 והסייג הנפרד של H10, עמ׳ 264–265',
    decisiveRuleHebrew: 'H5+H11 מיטיבים טהורים => יש מזל בלבושים; שניהם מזיקים טהורים => אין מזל בלבוש. H10 מזיק הוא סייג נפרד על לבוש מלכים/כיבוד מבעלי מעלה ואינו מבטל אוטומטית מזל כללי חיובי.',
    oneWayBranches: freezeArray([
      'H5+H11 שניהם מיטיבים => יש מזל בלבושים',
      'H5+H11 שניהם מזיקים => אין מזל בלבוש',
      'H10 מזיק => אין מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה',
    ]),
    forbiddenInversions: freezeArray([
      'H10 מיטיב אינו יוצר לבדו הבטחת מזל כללי בלבוש.',
      'עדות H5/H11 מפוצלת או ממוזגת אינה מוכרעת באמצעות רוב/נטייה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'clothing.color — צבעי לבוש הם ידע/כוונה נפרדים.',
      'clothing.fixedMutable — קביעות/החלפת לבוש אינן פסק המזל הכללי.',
      'משמעות כללית של H10 שאינה סעיף לבוש-המלכים המפורש.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'צבע מסוים יביא מזל',
      'H10 מזיק מבטל את המזל הכללי אף כאשר H5/H11 מיטיבים',
      'צורה ממוזגת מוכיחה מזל חלקי',
    ]),
  });
}

`;
safety = replaceOnce(safety, 'const METHOD_POLICIES = Object.freeze({', batch03Policies + 'const METHOD_POLICIES = Object.freeze({', 'batch03 policy insertion');
safety = replaceOnce(
  safety,
  "  [P206_QUERENT_DESIRE_METHOD]: p206QuerentDesirePolicy(),\n});",
  "  [P206_QUERENT_DESIRE_METHOD]: p206QuerentDesirePolicy(),\n  [P183_STAY_MOVE_METHOD]: p183StayMovePolicy(),\n  [P212_RECONCILIATION_METHOD]: p212ReconciliationPolicy(),\n  [P253_RELIGION_METHOD]: p253ReligionPolicy(),\n  [P202_LOST_RETURN_METHOD]: p202LostReturnPolicy(),\n  [P265_CLOTHING_LUCK_METHOD]: p265ClothingLuckPolicy(),\n});",
  'batch03 policy map entries'
);
safety = replaceOnce(
  safety,
  "  const methodSpecificPolicy = METHOD_POLICIES[methodId] || null;\n  const certificationStatus = methodSpecificPolicy?.certificationStatus === 'certified'",
  "  const methodSpecificPolicy = METHOD_POLICIES[methodId] || null;\n  const authoritativeClientDraftHebrew = authoritativeClientDraftFromReading(canonicalReading);\n  const certificationStatus = methodSpecificPolicy?.certificationStatus === 'certified'",
  'authoritative draft computation'
);
safety = replaceOnce(
  safety,
  "    clientFacingCertified,\n    certificationBatch: methodSpecificPolicy?.certificationBatch || null,",
  "    clientFacingCertified,\n    clientDraftExactMatchRequired: Boolean(clientFacingCertified),\n    authoritativeClientDraftHebrew,\n    authoritativeClientDraftSourcePath: authoritativeClientDraftHebrew ? 'readingContext.engineOutput.primaryFormula.result.executorResult.outputHebrew|verdict.text' : null,\n    certificationBatch: methodSpecificPolicy?.certificationBatch || null,",
  'authoritative draft fields'
);
write(safetyPath, safety);

// ---------------------------------------------------------------------------
// 2) Server sanitizer: certified client text must have deterministic source
// ---------------------------------------------------------------------------
const sanitizerPath = 'supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
let sanitizer = read(sanitizerPath);
sanitizer = replaceOnce(
  sanitizer,
  "  if ((safety.certificationStatus === 'certified') !== (safety.clientFacingCertified === true)) return false;\n  if (safety.binaryClientVerdictAllowed === true && safety.clientFacingCertified !== true) return false;",
  "  if ((safety.certificationStatus === 'certified') !== (safety.clientFacingCertified === true)) return false;\n  if (typeof safety.clientDraftExactMatchRequired !== 'boolean') return false;\n  if (safety.clientFacingCertified === true && safety.clientDraftExactMatchRequired !== true) return false;\n  if (safety.authoritativeClientDraftHebrew !== null && !isShortString(safety.authoritativeClientDraftHebrew, 6000)) return false;\n  if (safety.clientFacingCertified === true && !isShortString(safety.authoritativeClientDraftHebrew, 6000)) return false;\n  if (safety.binaryClientVerdictAllowed === true && safety.clientFacingCertified !== true) return false;",
  'sanitizer exact draft contract'
);
write(sanitizerPath, sanitizer);

// ---------------------------------------------------------------------------
// 3) Server post-AI gate: polarity is insufficient; exact category/text lock
// ---------------------------------------------------------------------------
const schemaPath = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts';
let schema = read(schemaPath);
schema = replaceOnce(
  schema,
  "  const clientFacingCertified = s.certificationStatus === 'certified' && s.clientFacingCertified === true;\n  if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };\n  if (!clientFacingCertified && hasDraft) return { ok: false, category: 'uncertified-client-draft' };",
  "  const clientFacingCertified = s.certificationStatus === 'certified' && s.clientFacingCertified === true;\n  const exactDraftRequired = s.clientDraftExactMatchRequired === true;\n  const authoritativeDraft = typeof s.authoritativeClientDraftHebrew === 'string' ? s.authoritativeClientDraftHebrew.trim() : '';\n  if (!hasDraft && audit.clientDraftPolarity !== 'none') return { ok: false, category: 'client-draft-polarity-without-draft' };\n  if (!clientFacingCertified && hasDraft) return { ok: false, category: 'uncertified-client-draft' };\n  if (clientFacingCertified && exactDraftRequired !== true) return { ok: false, category: 'missing-exact-client-draft-contract' };\n  if (hasDraft && !authoritativeDraft) return { ok: false, category: 'missing-authoritative-client-draft' };\n  if (hasDraft && output.clientAnswerDraft!.trim() !== authoritativeDraft) return { ok: false, category: 'client-draft-not-exact-engine-text' };",
  'server exact draft gate'
);
schema = replaceOnce(
  schema,
  "  } else if (polarity === 'non-binary') {\n    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };",
  "  } else if (polarity === 'non-binary') {\n    if (audit.clientDraftPolarity === 'positive' || audit.clientDraftPolarity === 'negative') return { ok: false, category: 'invented-binary-client-verdict' };\n    if (hasDraft && audit.clientDraftPolarity !== 'non-binary') return { ok: false, category: 'non-binary-draft-audit-mismatch' };",
  'non-binary draft audit lock'
);
write(schemaPath, schema);

// ---------------------------------------------------------------------------
// 4) Prompt + source mirror: clientAnswerDraft is verbatim deterministic text
// ---------------------------------------------------------------------------
const promptTsPath = 'supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';
let promptTs = read(promptTsPath);
promptTs = replaceOnce(
  promptTs,
  "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v8';",
  "export const OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION = 'oren-smart-advisor-brain-prompt-v9';",
  'prompt version v8'
);
promptTs = replaceOnce(
  promptTs,
  "    non-binary, אסור ליצור כן/לא. אם הוא blocked או isSafe אינו true —\n    clientAnswerDraft חייב להיות null. גם כאשר isSafe=true והמנוע runnable,",
  "    non-binary, אסור ליצור כן/לא. אם הוא blocked או isSafe אינו true —\n    clientAnswerDraft חייב להיות null. כאשר certificationStatus=\"certified\" ו-clientFacingCertified=true,\n    clientAnswerDraft אינו ניסוח חופשי: יש להעתיק מילה-במילה ורק את\n    professionalVerdictSafety.authoritativeClientDraftHebrew. אסור לקצר, לפרפרז, לרכך, להחמיר,\n    להחליף קטגוריה או להוסיף טענה. אם authoritativeClientDraftHebrew חסר — clientAnswerDraft חייב להיות null.\n    גם כאשר isSafe=true והמנוע runnable,",
  'prompt exact draft instruction'
);
write(promptTsPath, promptTs);

const promptMdPath = 'ai/prompts/oren-smart-advisor-brain.prompt.md';
let promptMd = read(promptMdPath);
promptMd = replaceOnce(
  promptMd,
  'אם הוא `blocked` או `isSafe` אינו `true` — `clientAnswerDraft` חייב להיות `null`.',
  'אם הוא `blocked` או `isSafe` אינו `true` — `clientAnswerDraft` חייב להיות `null`. כאשר `certificationStatus="certified"` ו-`clientFacingCertified=true`, `clientAnswerDraft` אינו ניסוח חופשי: יש להעתיק מילה-במילה ורק את `professionalVerdictSafety.authoritativeClientDraftHebrew`. אסור לקצר, לפרפרז, לרכך, להחמיר, להחליף קטגוריה או להוסיף טענה. אם השדה חסר — `clientAnswerDraft` חייב להיות `null`.',
  'prompt markdown exact draft instruction'
);
write(promptMdPath, promptMd);

// ---------------------------------------------------------------------------
// 5) Tests: exact client text + five Batch03 certifications
// ---------------------------------------------------------------------------
const testPath = '_test_kashf_professional_verdict_safety.mjs';
let tests = read(testPath);
tests = replaceOnce(
  tests,
  "    clientAnswerDraft: 'לפי דין הנישואין שנבחר, התשובה חיובית.',",
  "    clientAnswerDraft: safety.authoritativeClientDraftHebrew,",
  'p210 default exact client draft'
);
tests = replaceOnce(
  tests,
  "assert(safety?.binaryClientVerdictAllowed === true, 'positive binary client verdict is allowed because the engine itself is binary');",
  "assert(safety?.binaryClientVerdictAllowed === true, 'positive binary client verdict is allowed because the engine itself is binary');\nassert(safety?.clientDraftExactMatchRequired === true, 'certified p210 requires exact deterministic client draft');\nassert(safety?.authoritativeClientDraftHebrew === executor?.outputHebrew, 'p210 authoritative client draft is the executor source-bounded text');",
  'p210 exact draft assertions'
);
tests = replaceOnce(
  tests,
  "assert(validateKashfAdvisorVerdictAlignment(schemaGood.value, rc.professionalVerdictSafety).ok === true, 'matching positive AI draft passes deterministic server alignment');",
  "assert(validateKashfAdvisorVerdictAlignment(schemaGood.value, rc.professionalVerdictSafety).ok === true, 'matching exact positive engine draft passes deterministic server alignment');\n\nconst paraphrasedSamePolarity = validateKashfAdvisorOutput(advisorOutput({ clientAnswerDraft: 'לפי הדין התשובה חיובית.' }));\nconst paraphrasedAlignment = validateKashfAdvisorVerdictAlignment(paraphrasedSamePolarity.value, rc.professionalVerdictSafety);\nassert(paraphrasedAlignment.ok === false && paraphrasedAlignment.category === 'client-draft-not-exact-engine-text', 'server rejects same-polarity paraphrase: client text is deterministic, not AI-authored');",
  'p210 exact draft rejection test'
);
tests = replaceOnce(
  tests,
  "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 9, 'certification registry contains p210 plus eight professionally backfilled methods');",
  "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 14, 'certification registry contains fourteen professionally certified methods');",
  'certification count 14'
);
tests = replaceOnce(
  tests,
  "  'desire.p206.querentWantsH7H11ThenH5',\n]) {",
  "  'desire.p206.querentWantsH7H11ThenH5',\n  'relocation.p183.stayMoveH1H2',\n  'dispute.p212.reconciliationH1H7',\n  'religion.p253.h3h9Quality',\n  'lostItem.p202.returnH6H8',\n  'clothing.p264-265.luck',\n]) {",
  'batch03 certified id list'
);

const batch03Tests = String.raw`

console.log('\n--- Professional backfill batch 03 + exact client-draft lock ---');

// The exact draft gate must protect categorical/non-binary methods too.
const p204CategoryLock = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'1121' }) });
assert(p204CategoryLock.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'category-lock fixture engine says divorced');
assert(p204CategoryLock.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'category-lock fixture is non-binary by polarity');
assert(p204CategoryLock.professionalVerdictSafety?.clientDraftExactMatchRequired === true, 'categorical certified method requires exact client text');
const p204ExactDraft = validateKashfAdvisorOutput(auditOutputForSafety(p204CategoryLock.professionalVerdictSafety, { draft: p204CategoryLock.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p204ExactDraft.value, p204CategoryLock.professionalVerdictSafety).ok === true, 'exact categorical engine text is accepted');
const p204WrongCategory = validateKashfAdvisorOutput(auditOutputForSafety(p204CategoryLock.professionalVerdictSafety, { draft: 'בתולה', draftPolarity: 'non-binary' }));
const p204WrongCategoryAlignment = validateKashfAdvisorVerdictAlignment(p204WrongCategory.value, p204CategoryLock.professionalVerdictSafety);
assert(p204WrongCategoryAlignment.ok === false && p204WrongCategoryAlignment.category === 'client-draft-not-exact-engine-text', 'server rejects divorced→virgin category inversion even though both are non-binary');

// PV-BF03-P183-* — two exact opposite branches; same-class remains unresolved.
const p183Stay = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1122', 2:'1112' }) });
assert(p183Stay.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'stay', 'p183 H1 benefic + H2 malefic chooses stay');
assert(p183Stay.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 passed professional backfill');
assert(p183Stay.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p183 directional decision remains non-binary polarity');
const p183StayExact = validateKashfAdvisorOutput(auditOutputForSafety(p183Stay.professionalVerdictSafety, { draft: p183Stay.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p183StayExact.value, p183Stay.professionalVerdictSafety).ok === true, 'p183 exact stay text passes server gate');
const p183WrongMove = validateKashfAdvisorOutput(auditOutputForSafety(p183Stay.professionalVerdictSafety, { draft: 'המעבר עדיף.', draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p183WrongMove.value, p183Stay.professionalVerdictSafety).ok === false, 'p183 server blocks stay→move category reversal');
const p183Move = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1112', 2:'1122' }) });
assert(p183Move.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'move', 'p183 reverse explicit branch chooses move');
const p183Same = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1122', 2:'2211' }) });
assert(p183Same.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'unresolved', 'p183 same-class testimony remains unresolved');

// PV-BF03-P212-* — only the benefic result is an explicit reconciliation verdict.
const p212Good = buildKashfCanonicalAiBridge({ questionId: 'q-reconciliation', questionText: 'האם יהיה פיוס בין הצדדים?', board: makeBoard({ 1:'1111', 7:'2211' }) });
assert(p212Good.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'reconciliation', 'p212 benefic generated figure yields explicit reconciliation');
assert(p212Good.canonicalReading?.overallPositive === true, 'p212 explicit reconciliation branch is positive');
assert(p212Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p212 passed professional backfill');
const p212Bad = buildKashfCanonicalAiBridge({ questionId: 'q-reconciliation', questionText: 'האם יהיה פיוס בין הצדדים?', board: makeBoard({ 1:'1111', 7:'2221' }) });
assert(p212Bad.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p212 counterfixture generates a malefic result');
assert(p212Bad.canonicalReading?.overallPositive === null, 'p212 malefic result is not inverted into explicit no-reconciliation');
assert(p212Bad.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מזיקה')), 'p212 policy records the no-inverse rule');

// PV-BF03-P253-* — H3/H9 must agree in the same pure source class.
const p253Good = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1122', 9:'2211' }) });
assert(p253Good.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'religious-and-god-fearing', 'p253 two benefics yield the exact positive source branch');
assert(p253Good.canonicalReading?.overallPositive === true, 'p253 benefic branch is positive');
assert(p253Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p253 passed professional backfill');
const p253Bad = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1112', 9:'1221' }) });
assert(p253Bad.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'little-religion', 'p253 two malefics yield little-religion source branch');
assert(p253Bad.canonicalReading?.overallPositive === false, 'p253 malefic branch is negative');
const p253Split = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1112', 9:'1122' }) });
assert(p253Split.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p253 split testimony remains unresolved');
assert(p253Split.canonicalReading?.overallPositive === null, 'p253 split testimony does not become an invented middle verdict');

// PV-BF03-P202-* — source has an explicit else branch.
const p202Yes = buildKashfCanonicalAiBridge({ questionId: 'q-lost-item', questionText: 'האם האבדה תשוב?', board: makeBoard({ 6:'2111', 8:'2121' }) });
assert(p202Yes.canonicalReading?.overallPositive === true, 'p202 H6/H8 benefic+internal condition yields return');
assert(p202Yes.professionalVerdictSafety?.certificationStatus === 'certified', 'p202 passed professional backfill');
const p202No = buildKashfCanonicalAiBridge({ questionId: 'q-lost-item', questionText: 'האם האבדה תשוב?', board: makeBoard({ 6:'1112', 8:'2121' }) });
assert(p202No.canonicalReading?.overallPositive === false, 'p202 failure of explicit H6/H8 condition yields the source else/no branch');
assert(p202No.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('גנב')), 'p202 policy blocks theft-attribution expansion');

// PV-BF03-P265-* — general clothing luck and H10 royal-clothing qualifier remain separate.
const p265Good = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1122', 10:'2211', 11:'2111' }) });
assert(p265Good.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 H5/H11 benefic branch gives general clothing luck');
assert(p265Good.canonicalReading?.overallPositive === true, 'p265 good clothing-luck branch is positive');
assert(p265Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p265 passed professional backfill');
const p265Bad = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1112', 10:'1122', 11:'1212' }) });
assert(p265Bad.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === false, 'p265 H5/H11 malefic branch gives no general clothing luck');
assert(p265Bad.canonicalReading?.overallPositive === false, 'p265 bad clothing-luck branch is negative');
const p265Royal = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1122', 10:'1112', 11:'2111' }) });
assert(p265Royal.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 general clothing luck remains positive when H5/H11 are benefic');
assert(p265Royal.canonicalReading?.primaryFormula?.result?.executorResult?.royalClothingNoLuck === true, 'p265 malefic H10 remains a separate royal-clothing qualifier');
assert(p265Royal.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('מבטל')), 'p265 policy forbids H10 from silently cancelling the general branch');
const p265Mixed = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'2212', 10:'1122', 11:'2111' }) });
assert(p265Mixed.canonicalReading?.overallPositive === null, 'p265 mixed/split H5-H11 evidence remains unresolved');

`;
tests = replaceOnce(
  tests,
  "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);\nif (failed) process.exit(1);",
  batch03Tests + "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);\nif (failed) process.exit(1);",
  'append batch03 tests'
);
write(testPath, tests);

// ---------------------------------------------------------------------------
// 6) Backfill status + work order
// ---------------------------------------------------------------------------
const statusPath = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
let status = read(statusPath);
status = replaceOnce(status, '- מוסמכים מקצועית לאחר Batch 02: **9/43**.', '- מוסמכים מקצועית לאחר Batch 03: **14/43**.', 'status certified count');
status = replaceOnce(status, '- ממתינים להסמכה רטרואקטיבית: **34/43**.', '- ממתינים להסמכה רטרואקטיבית: **29/43**.', 'status pending count');
status = replaceOnce(
  status,
  '| desire.p206.querentWantsH7H11ThenH5 | certified | PV-BF02-P206-DESIRE-* | רצון השואל בלבד; אותה מכניקה אינה מתירה להעתיק משמעות משיטת מציאת החן |',
  `| desire.p206.querentWantsH7H11ThenH5 | certified | PV-BF02-P206-DESIRE-* | רצון השואל בלבד; אותה מכניקה אינה מתירה להעתיק משמעות משיטת מציאת החן |
| relocation.p183.stayMoveH1H2 | certified | PV-BF03-P183-* | רק שני הצירופים המפורשים מכריעים להישאר/לעבור; same-class/mixed אינם מוכרעים |
| dispute.p212.reconciliationH1H7 | certified | PV-BF03-P212-* | מיטיב בהולדת H1+H7 מורה פיוס; אין היפוך מזיק=>אין פיוס |
| religion.p253.h3h9Quality | certified | PV-BF03-P253-* | H3/H9 חייבים להסכים במיטיב/מזיק טהור; split/mixed נשאר לא מוכרע |
| lostItem.p202.returnH6H8 | certified | PV-BF03-P202-* | H6/H8 מיטיבים פנימיים=>שיבה; else מפורש=>לא; אין ייחוס גניבה/מיקום |
| clothing.p264-265.luck | certified | PV-BF03-P265-* | H5/H11 קובעים מזל כללי; H10 מזיק הוא סייג נפרד ללבוש מלכים ואינו מבטל אוטומטית את הכללי |`,
  'status batch03 rows'
);
status += `\n\n## חיזוק בטיחות שנוסף ב-Batch 03 — Exact Client Draft\n\nבדיקת ה-Backfill חשפה שפיקוח על positive/negative בלבד אינו מספיק לשיטות קטגוריאליות או כיווניות: AI יכול היה תאורטית להחליף \"גרושה\" ב\"בתולה\" או \"להישאר\" ב\"לעבור\" ועדיין לדווח non-binary. לכן החל מגרסת Professional Verdict Safety v4, כל מנוע certified נושא authoritativeClientDraftHebrew דטרמיניסטי. שכבת השרת דורשת התאמה מילה-במילה; פרפרזה, החלפת קטגוריה או תוספת מסקנה נדחות. אם הטקסט הסמכותי חסר, אין clientAnswerDraft.\n`;
write(statusPath, status);

const workPath = 'HALL_WISDOM_PROFESSIONAL_VERDICT_SAFETY_WORK_ORDER.md';
let work = read(workPath);
work = replaceOnce(
  work,
  '11. **Structured Output Alignment** — ה-AI חייב להצהיר על קוטב הפסק והשרת משווה אותו דטרמיניסטית לפסק המנוע.\n12. **Full Regression**',
  '11. **Structured Output Alignment** — ה-AI חייב להצהיר על קוטב הפסק והשרת משווה אותו דטרמיניסטית לפסק המנוע.\n12. **Exact Client Draft Lock** — מנוע certified מספק `authoritativeClientDraftHebrew`; טיוטת הלקוח חייבת להיות העתק מילה-במילה. אין פרפרזה, החלפת קטגוריה או תוספת AI. אם הטקסט חסר — `clientAnswerDraft:null`.\n13. **Full Regression**',
  'work order exact draft step'
);
work = replaceOnce(work, '13. **Deploy/Status**', '14. **Deploy/Status**', 'work order deploy renumber');
work += `\n\n## 8. חיזוק Batch 03 — קוטב אינו מספיק\n\nבמהלך ההסמכה הרטרואקטיבית התברר ששער שבודק רק positive/negative/non-binary אינו יכול לזהות החלפת קטגוריה בתוך non-binary. לדוגמה: מנוע שמחזיר \"גרושה\" וטיוטת AI שמחזירה \"בתולה\" חולקים אותו קוטב non-binary, וכך גם \"להישאר\" מול \"לעבור\". לכן client-facing של מנוע certified אינו עוד ניסוח AI חופשי: השרת מקבל רק העתק מדויק של הטקסט הדטרמיניסטי שהמנוע יצר. הבינה נשארת חופשית לנתח ב-advisorDiagnosis, אך אינה רשאית לנסח מחדש את הפסק ללקוח.\n`;
write(workPath, work);

console.log('Professional Verdict Safety backfill batch 03 patch applied.');
