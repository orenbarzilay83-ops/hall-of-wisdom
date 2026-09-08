#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  return text.replace(from, to);
}

// ---------------------------------------------------------------------------
// 1. Canonical thief-description executor: p225 instruction + p231-233 table
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n  computeThiefPhysicalDescriptionKashf,\n} from './kashf-pending-extraction.js';",
    "  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n} from './kashf-pending-extraction.js';",
    'remove legacy thief-description import',
  );

  const insertion = String.raw`

// Kashf p225 gives the routing rule: take the thief's description from H7.
// The detailed sixteen-figure profile table begins on p231 and continues
// through pp232-233.  This canonical copy is deliberately source-bounded:
// it returns the printed profile for the H7 figure and nothing more.  It does
// NOT identify a real person, prove guilt, calculate name letters, or import
// the separate p224 recurrence/relationship rule.
const P225_THIEF_DESCRIPTION_BY_PATTERN = Object.freeze({
  '1121': 'בהיר־שיער/בלונדיני, גבוה, וזקנו דליל. בנוסח אחר: בעל מראה נשי או אנדרוגיני, סריס, או חסר זקן.',
  '1222': 'עד, סופר או מלמד. בנוסח אחר: שלם במבנהו, חזהו רחב, פניו עגולות, עיניו גדולות, תוארו נאה, צבעו לבן, בהיר־שיער ובעל זקן גדול.',
  '2111': 'אישה לבנת־צבע, מהירת דיבור, ראשה גדול וכפות רגליה דקות. בנוסח אחר: סאסאנית או עירונית.',
  '2212': 'אדם לבן, מחייך ומובחן, ודיבורו נעים. בנוסח אחר: עוסק בנייר/כתיבה, בחייטות או בהלבנת בדים.',
  '1211': 'אדם הנמשך אחר נשים ונחשב לבעל דעת רבה; מלאכתו סייף/מוציא־להורג או קשת. בנוסח אחר: אישה או נער יפה־עיניים.',
  '1112': 'שחום־עור. בנוסח אחר: ראייתו רעה, ריחו רע, ועיסוקו באשפה או במלאכה ירודה מן הסוג המתואר במקור.',
  '2122': 'צבעו דמי, קומתו גבוהה, כפות רגליו רחבות ויש סימן בפניו; עיסוקו טבח, עובד חום/אש, או רכיל פרוץ.',
  '2221': 'צבעו שחור; בלשון המקור מיוחס לו שורש של עבדות. עיסוקו בעיבוד עורות, בעבודת אדמה, בקריאה/כריזה או בהובלת בהמות.',
  '1122': 'פניו עגולות, כפות רגליו רחבות והוא בעל הדר ומעמד; עיסוקו בזהב או באבני חן.',
  '1221': 'שחום־עור, בטנו רחבה וכפות רגליו גדולות; עיסוקו סנדלר.',
  '2112': 'איש לשכה/דיוואן, מעתיק כתבים, שופט או אסטרולוג, ועוסק במכירת ספרים; קומתו גבוהה, זקנו גדול וראשו קטן.',
  '2211': 'אישה לבנת־צבע, עגולת פנים, ראשה גדול וכפות רגליה קטנות. בנוסח אחר: שופט או פוסק־הלכה בעל מעלה וידע.',
  '1111': 'נער קטן, גבוה ודק־גוף; רקדן, או מי שעיסוקו בהליכה ובריצה.',
  '1212': 'אדם לבן או צהבהב, כפות רגליו גדולות וראשו קטן; עיסוקו ברפואה.',
  '2222': 'גופו רחב, ובניסוח המקור אופיו רע; סנטרו גדול וכפות רגליו רחבות. עיסוקו ספנות, הנדסה או ראשות מלאכה.',
  '2121': 'קומתו בינונית, צבעו חיטה, פניו עגולות, ראשו וכפות רגליו גדולים וזקנו עבה; עיסוקו בסחורה וברווחים עבור אחרים.',
});

function computeThiefDescriptionP225(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const figureHebrew = classification.figureHebrew || h7?.hebrew || h7?.hebrewName || pattern;
  const description = P225_THIEF_DESCRIPTION_BY_PATTERN[pattern] || null;

  const outputHebrew = description
    ? 'בית 7: ' + figureHebrew + ' (' + pattern + '). לפי הוראת כשף עמ׳ 225 וטבלת התיאור בעמ׳ 231–233: ' + description + ' זהו פרופיל תיאורי מן המקור בלבד; הוא אינו מזהה אדם מסוים ואינו מוכיח אשמה.'
    : 'בית 7: ' + figureHebrew + ' (' + pattern + '). לא נמצא עבור הצורה הזאת תיאור בטבלת כשף עמ׳ 231–233; אין להשלים תיאור מן הדעת.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 225; טבלת תיאור הגנב עמ׳ 231–233',
    sourceText: 'מן הבית השביעי נלקחת صفة السارق; תיאורי שש־עשרה הצורות מפורטים בעמ׳ 231–233.',
    housesUsed: [7],
    h7Pattern: pattern,
    h7FigureHebrew: figureHebrew,
    description,
    profileResolved: Boolean(description),
    identityResolved: false,
    guiltProven: false,
    nameLettersResolved: false,
    positive: null,
    verdictType: 'thief-source-profile',
    outputHebrew,
  };
}
`;

  text = replaceOnce(
    text,
    "const P224_H7_RECURRENCE_CONNECTIONS = Object.freeze({",
    insertion + "\nconst P224_H7_RECURRENCE_CONNECTIONS = Object.freeze({",
    'insert canonical p225 executor before p224 constants',
  );

  text = replaceOnce(
    text,
    "  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,",
    "  'theft.p225.thiefDescriptionH7': computeThiefDescriptionP225,",
    'wire canonical p225 executor',
  );

  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 2. Keep the legacy warehouse table accurate even though runtime no longer
//    depends on it.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/engine/kashf-pending-extraction.js';
  let text = fs.readFileSync(path, 'utf8');
  const start = text.indexOf("// כשף אל-אסרר עמ׳ 231-234 — תיאור הגנב לפי הצורה בבית 7");
  const end = text.indexOf("\n\nexport function computeThiefPhysicalDescriptionKashf", start);
  if (start < 0 || end < 0) throw new Error('Legacy thief-description table block not found');
  const block = String.raw`// כשף אל-אסרר עמ׳ 225 (H7 instruction), עמ׳ 231-233 (detailed table)
// NOTE: canonical runtime no longer calls this legacy helper; the table is kept
// synchronized only so the warehouse does not preserve stale source data.
const THIEF_PHYSICAL_DESCRIPTION_KASHF = {
  '1121': 'בהיר־שיער/בלונדיני, גבוה, וזקנו דליל. בנוסח אחר: בעל מראה נשי או אנדרוגיני, סריס, או חסר זקן',
  '1222': 'עד, סופר או מלמד; בנוסח אחר: שלם במבנהו, חזה רחב, פנים עגולות, עיניים גדולות, תואר נאה, לבן, בהיר־שיער ובעל זקן גדול',
  '2111': 'אישה לבנת־צבע, מהירת דיבור, ראשה גדול וכפות רגליה דקות; בנוסח אחר: סאסאנית או עירונית',
  '2212': 'לבן, מחייך ומובחן, דיבורו נעים; בנוסח אחר: נייר/כתיבה, חייטות או הלבנת בדים',
  '1211': 'נמשך אחר נשים ונחשב לבעל דעת רבה; סייף/מוציא־להורג או קשת; בנוסח אחר: אישה או נער יפה־עיניים',
  '1112': 'שחום; בנוסח אחר: ראייה רעה, ריח רע ועיסוק באשפה או מלאכה ירודה המתוארת במקור',
  '2122': 'צבע דמי, קומה גבוהה, כפות רגליים רחבות וסימן בפנים; טבח, עובד חום/אש או רכיל פרוץ',
  '2221': 'שחור; בלשון המקור שורש עבדות; עיבוד עורות, אדמה, כריזה או הובלת בהמות',
  '1122': 'פנים עגולות, כפות רגליים רחבות ובעל הדר; זהב או אבני חן',
  '1221': 'שחום, בטן רחבה וכפות רגליים גדולות; סנדלר',
  '2112': 'איש דיוואן, מעתיק, שופט או אסטרולוג, מוכר ספרים; גבוה, זקן גדול, ראש קטן',
  '2211': 'אישה לבנה, עגולת פנים, ראש גדול וכפות רגליים קטנות; בנוסח אחר: שופט או פוסק־הלכה בעל מעלה וידע',
  '1111': 'נער קטן, גבוה ודק־גוף; רקדן או עוסק בהליכה ובריצה',
  '1212': 'לבן או צהבהב, כפות רגליים גדולות וראש קטן; רפואה',
  '2222': 'גוף רחב, בלשון המקור אופי רע, סנטר גדול וכפות רגליים רחבות; ספנות, הנדסה או ראשות מלאכה',
  '2121': 'קומה בינונית, צבע חיטה, פנים עגולות, ראש וכפות רגליים גדולים, זקן עבה; סחורה ורווחים עבור אחרים',
};`;
  text = text.slice(0, start) + block + text.slice(end);
  text = text.replaceAll('(כשף עמ׳ 231-234)', '(כשף עמ׳ 231-233)');
  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 3. Align method/v57/retrieval provenance and scope.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    "    sourcePages: [224, 225],\n    kashfRuntimeStatus: 'ready',\n    runtimeAllowed: true,\n    executionKind: 'custom-engine',\n    executorStatus: 'ready',",
    "    sourcePages: [225, 231, 232, 233],\n    kashfRuntimeStatus: 'ready',\n    runtimeAllowed: true,\n    executionKind: 'custom-engine',\n    executorStatus: 'ready',",
    'p225 canonical source pages',
  );
  text = replaceOnce(
    text,
    "    notes: 'Canonical thief-description executor is wired from H7 using the source-backed figure-description table.',",
    "    notes: 'Canonical thief-profile executor uses the p225 instruction to read H7 and the complete p231–233 sixteen-figure description table. It is descriptive only: no named-person identification, guilt proof or name-letter generation is inferred.',",
    'p225 method notes',
  );
  fs.writeFileSync(path, text, 'utf8');
}

{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(text, '    detailPages: [232, 233, 234],', '    detailPages: [231, 232, 233],', 'p225 v57 detail pages');
  text = replaceOnce(text, '    arabicVerificationPages: [225, 232, 233, 234],', '    arabicVerificationPages: [225, 231, 232, 233],', 'p225 Arabic verification pages');
  text = replaceOnce(
    text,
    "    notes: 'תיאורי 16 הצורות המפורטים בעמודים 232–234 הם גוף הידע של המבצע. אין להשתמש בתיאור כדי להאשים אדם מסוים.',",
    "    notes: 'עמ׳ 225 נותן את הוראת H7. טבלת תיאורי 16 הצורות מתחילה בעמ׳ 231 ונמשכת בעמ׳ 232–233. המבצע הקנוני מחזיר פרופיל תיאורי בלבד; אותיות השם המוזכרות בעמ׳ 225 אינן מחושבות בשיטה זו, ואין להשתמש בפרופיל כדי לזהות או להאשים אדם מסוים.',",
    'p225 v57 notes',
  );
  fs.writeFileSync(path, text, 'utf8');
}

{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    "    aliases: ['תיאור הגנב', 'איך הגנב נראה', 'מראה הגנב', 'אותיות שם הגנב'],",
    "    aliases: ['תיאור הגנב', 'איך הגנב נראה', 'מראה הגנב', 'פרופיל הגנב'],",
    'remove unsupported name-letter alias',
  );
  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 4. Professional Verdict Safety policy/certification.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v9';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v10';",
    'safety version v9->v10',
  );
  text = replaceOnce(
    text,
    "const P179_MONEY_SOURCE_METHOD = 'money.p179.sourceByIncomingHonorHouse';",
    "const P179_MONEY_SOURCE_METHOD = 'money.p179.sourceByIncomingHonorHouse';\nconst P225_THIEF_DESCRIPTION_METHOD = 'theft.p225.thiefDescriptionH7';",
    'p225 safety constant',
  );

  const policy = String.raw`

function p225ThiefDescriptionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-09',
    goldenCaseIds: freezeArray(['PV-BF09-P225-JOUDALA', 'PV-BF09-P225-NUSRA-IN', 'PV-BF09-P225-EXACT-DRAFT']),
    policyId: 'p225-thief-description-h7-source-table-v1',
    questionScopeHebrew: 'פרופיל תיאורי של הגנב לפי הצורה שב-H7: הוראת עמ׳ 225 וטבלת עמ׳ 231–233',
    decisiveRuleHebrew: 'קרא את צורת H7 והחזר רק את שורת התיאור המתאימה לה בטבלת המקור. אין לצרף חזרות בתים, משמעות כללית של הצורה או שיטת זיהוי אחרת.',
    oneWayBranches: freezeArray([
      'צורת H7 בעלת שורה בטבלה => החזר את הפרופיל המודפס של אותה צורה בלבד',
    ]),
    forbiddenInversions: freezeArray([
      'תיאור דומה לאדם מוכר אינו מוכיח שאותו אדם הוא הגנב.',
      'אין להפוך תכונת מראה, מלאכה או מגדר לזהות ודאית.',
      'אין להשלים אותיות שם משום שעמ׳ 225 מזכיר אותן אך המבצע הזה אינו כולל שיטת אותיות.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'theft.p224.relationshipH7Recurrence — קשר/קרבה לפי חזרת H7 הוא דין נפרד.',
      'מיקום הגניבה, החזרת האבדה, מספר הגנבים, גיל הגנב או אשמת חשוד מסוים.',
      'תיאור כללי של צורה ממקור אחר או משיטת חאווי.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פלוני הוא הגנב',
      'הפרופיל מוכיח אשמה',
      'אותיות שמו של הגנב הן',
      'זהותו של הגנב ודאית',
    ]),
  });
}
`;

  text = replaceOnce(text, 'const METHOD_POLICIES = Object.freeze({', policy + '\nconst METHOD_POLICIES = Object.freeze({', 'insert p225 safety policy');
  text = replaceOnce(
    text,
    "  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),\n});",
    "  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),\n  [P225_THIEF_DESCRIPTION_METHOD]: p225ThiefDescriptionPolicy(),\n});",
    'register p225 policy',
  );
  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 5. Golden tests + certification count.
// ---------------------------------------------------------------------------
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 38, 'certification registry contains thirty-eight professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 39, 'certification registry contains thirty-nine professionally certified methods');",
    'certified count 38->39',
  );

  // The old final pending loop still contains p225; remove exactly that line.
  text = replaceOnce(
    text,
    "  'profession.p254.h9Planet',\n  'theft.p225.thiefDescriptionH7',\n  'child.p194.healthTrajectoryH6H8',",
    "  'profession.p254.h9Planet',\n  'child.p194.healthTrajectoryH6H8',",
    'remove p225 from pending loop',
  );

  const tests = String.raw`

console.log('\n--- Professional backfill batch 09 — p225 thief source profile ---');

const p225Joudala = buildKashfCanonicalAiBridge({ questionId: 'q-theft-who', questionText: 'תיאור הגנב', board: makeBoard({ 7:'1121' }) });
const p225JoudalaExec = p225Joudala.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p225Joudala.resolution?.kashfMethodId === 'theft.p225.thiefDescriptionH7', 'p225 description route selects exact method');
assert(p225JoudalaExec?.profileResolved === true, 'p225 Joudala profile resolves from H7');
assert(String(p225JoudalaExec?.description || '').includes('זקנו דליל'), 'p225 Joudala preserves the source light/sparse beard wording');
assert(!String(p225JoudalaExec?.description || '').includes('מייצג'), 'p225 Joudala no longer contains the stale mistranscription');
assert(String(p225JoudalaExec?.sourceRef || '').includes('231–233'), 'p225 executor points to the actual detailed table pages 231-233');
assert(p225JoudalaExec?.identityResolved === false && p225JoudalaExec?.guiltProven === false, 'p225 descriptive profile never resolves identity or guilt');
assert(p225Joudala.professionalVerdictSafety?.certificationStatus === 'certified', 'p225 thief description passed professional backfill');
assert(p225Joudala.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p225 profile remains descriptive/non-binary');

const p225NusraIn = buildKashfCanonicalAiBridge({ questionId: 'q-theft-who', questionText: 'איך הגנב נראה', board: makeBoard({ 7:'2211' }) });
const p225NusraInExec = p225NusraIn.canonicalReading?.primaryFormula?.result?.executorResult;
assert(String(p225NusraInExec?.description || '').includes('כפות רגליה קטנות'), 'p225 Nusra Dakhila preserves small feet from the source');
assert(!String(p225NusraInExec?.description || '').includes('קומה קטנה'), 'p225 Nusra Dakhila removes the stale small-stature substitution');
assert(p225NusraInExec?.nameLettersResolved === false, 'p225 does not pretend to calculate name letters');
assert(p225NusraIn.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('פלוני הוא הגנב'), 'p225 safety policy explicitly blocks named-person accusation');

const p225Exact = validateKashfAdvisorOutput(auditOutputForSafety(p225Joudala.professionalVerdictSafety, {
  draft: p225Joudala.professionalVerdictSafety.authoritativeClientDraftHebrew,
  draftPolarity: 'non-binary',
}));
assert(validateKashfAdvisorVerdictAlignment(p225Exact.value, p225Joudala.professionalVerdictSafety).ok === true, 'p225 exact deterministic client draft passes');
const p225InventedIdentity = validateKashfAdvisorOutput(auditOutputForSafety(p225Joudala.professionalVerdictSafety, {
  draft: 'לפי התיאור, פלוני הוא הגנב.',
  draftPolarity: 'non-binary',
}));
assert(validateKashfAdvisorVerdictAlignment(p225InventedIdentity.value, p225Joudala.professionalVerdictSafety).ok === false, 'p225 server gate blocks replacing source profile with a named-person accusation');
`;

  text = replaceOnce(
    text,
    "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    tests + "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    'append batch09 tests',
  );
  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 6. Status document.
// ---------------------------------------------------------------------------
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOnce(
    text,
    '- מוסמכים מקצועית לאחר Batch 08: **38/43**.\n- ממתינים להסמכה רטרואקטיבית: **5/43**.',
    '- מוסמכים מקצועית לאחר Batch 09: **39/43**.\n- ממתינים להסמכה רטרואקטיבית: **4/43**.',
    'status count 39/43',
  );
  text = replaceOnce(
    text,
    '| money.p179.sourceByIncomingHonorHouse | certified | PV-BF08-P179-* | הסריקה הערבית עמ׳ 179 אומרת במפורש «وإن كان في الثاني سعد»; H2 חייב להיות מיטיב טהור, ואז כבוד נכנס מורה על מקור הממון לפי טבע הבית; אין קידום ממוזג ואין דירוג בין כמה ערוצים |',
    '| money.p179.sourceByIncomingHonorHouse | certified | PV-BF08-P179-* | הסריקה הערבית עמ׳ 179 אומרת במפורש «وإن كان في الثاني سعد»; H2 חייב להיות מיטיב טהור, ואז כבוד נכנס מורה על מקור הממון לפי טבע הבית; אין קידום ממוזג ואין דירוג בין כמה ערוצים |\n| theft.p225.thiefDescriptionH7 | certified | PV-BF09-P225-* | H7 בלבד: הוראת עמ׳ 225 + טבלת 16 התיאורים עמ׳ 231–233; פרופיל תיאורי בלבד, ללא זיהוי אדם, הוכחת אשמה או אותיות שם |',
    'add p225 certified row',
  );

  const openBlock = `### theft.p225.thiefDescriptionH7\n\n- המנוע runnable ומתבסס על טבלת תיאור לפי H7, אך יש **אי-התאמת עמודי מקור**.\n- הרשם הקנוני מייחס את השיטה לעמ׳ 224–225, בעוד פונקציית המקור והטבלה בקוד מסומנות כעמ׳ 231–234.\n- לפני הסמכה יש ליישר את עוגן העמודים מול v57/הסריקה ולוודא שאין ערבוב בין פרקי קשר הגנב לבין תיאורו.\n\n`;
  if (text.includes(openBlock)) text = text.replace(openBlock, '');
  else throw new Error('Open p225 audit block not found');

  text += '\n\n## Batch 09 — p225 Thief Description source-table closure\n\nBatch 09 סגר את פער העמודים והטבלה של `theft.p225.thiefDescriptionH7`. עמ׳ 225 נותן את הוראת H7, ואילו טבלת 16 התיאורים עצמה מתחילה בעמ׳ 231 ונמשכת בעמ׳ 232–233. המבצע הועבר לטבלה קנונית עצמאית, תוקנו שיבושי תעתיק/תרגום שנמצאו בטבלה הישנה — ובהם `1121` זקן דליל ו-`2211` כפות רגליים קטנות — וננעל שהפלט הוא פרופיל תיאורי בלבד. אין לזהות אדם מסוים, להוכיח אשמה או להמציא אותיות שם מתוך השיטה הזאת.\n';
  fs.writeFileSync(path, text, 'utf8');
}

console.log('Professional Verdict Safety backfill batch 09 patch applied.');
