#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content, 'utf8'); }
function mustReplace(content, from, to, label) {
  if (!content.includes(from)) throw new Error(`Missing anchor: ${label}`);
  return content.replace(from, to);
}

// 1) Close the p179 source-wording blocker against the raw Arabic scan.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let s = read(path);
  s = mustReplace(
    s,
    "hebrewRule: 'אם בשני יש בה צד מיטיב, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',\n    supportingPages: [43, 46, 47, 54, 57, 58, 59, 60],\n    arabicVerificationPages: [179],",
    "hebrewRule: 'אם בבית השני צורה מיטיבה, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',\n    supportingPages: [43, 46, 47, 54, 57, 58, 59, 60],\n    arabicVerificationPages: [179],\n    notes: 'אימות הסריקה הערבית בעמ׳ 179 סגר את ניסוח השער: המקור אומר במפורש «وإن كان في الثاني سعد» — אם בשני מיטיב. לכן שער המבצע הקנוני הוא سعد/מיטיב טהור בלבד; צורה ממוזגת אינה מקודמת לשער.',",
    'p179 v57 raw-scan wording'
  );
  write(path, s);
}

// 2) Keep the already-correct pure-benefic executor, but repair its quoted source wording.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  s = mustReplace(
    s,
    "// Kashf v57 p179 — source of money by the house occupied by Incoming Honor.\n// The source first requires H2 to be benefic. We therefore do NOT promote a\n// mixed H2 into the gate.",
    "// Kashf p179 — source of money by the house occupied by Incoming Honor.\n// Raw-scan verification closes the gate wording as explicit سعد: «وإن كان في\n// الثاني سعد». Therefore H2 must be pure benefic; mixed H2 is not promoted.",
    'p179 executor comment'
  );
  s = mustReplace(
    s,
    "sourceText: 'אם בשני יש בה צד מיטיב, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',",
    "sourceText: 'אם בבית השני צורה מיטיבה, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',",
    'p179 executor sourceText'
  );
  write(path, s);
}

// 3) Professional Verdict Safety policy + certification.
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let s = read(path);
  s = mustReplace(
    s,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v8';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v9';",
    'safety version'
  );
  s = mustReplace(
    s,
    "const P167_HIDDEN_ACTION_METHOD = 'spiritual.p167.hiddenActionAirRows46815';",
    "const P167_HIDDEN_ACTION_METHOD = 'spiritual.p167.hiddenActionAirRows46815';\nconst P179_MONEY_SOURCE_METHOD = 'money.p179.sourceByIncomingHonorHouse';",
    'p179 method constant'
  );

  const policy = `\nfunction p179MoneySourcePolicy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-08',\n    goldenCaseIds: freezeArray(['PV-BF08-P179-H10', 'PV-BF08-P179-MULTI', 'PV-BF08-P179-MIXED-GATE']),\n    policyId: 'p179-money-source-incoming-honor-v1',\n    questionScopeHebrew: 'מקור הממון לפי H2 וכבוד נכנס, כשף עמ׳ 179',\n    decisiveRuleHebrew: 'אימות הסריקה הערבית אומר במפורש «وإن كان في الثاني سعد»: רק H2 מיטיב טהור פותח את השער. אז מחפשים כבוד נכנס (2211), וטבע הבית או הבתים שבהם הוא שורה מורה על מקור הממון. ממון נכנס ב-H2 הוא עדות נפרדת באותו עמוד.',\n    oneWayBranches: freezeArray([\n      'H2 מיטיב טהור + כבוד נכנס בבית נושא => מקור הממון לפי טבע אותו בית',\n      'כבוד נכנס בכמה בתי נושא => נשמרים כמה ערוצי מקור; המקור אינו מדרג ביניהם',\n      'ממון נכנס ב-H2 => הופעותיו נותנות עדות נפרדת על השגת הממון',\n    ]),\n    forbiddenInversions: freezeArray([\n      'H2 ממוזג או מזיק אינו נחשב מיטיב לצורך השער, אך גם אינו מוכיח שאין כסף.',\n      'היעדר כבוד נכנס בשנים-עשר בתי הנושא אינו מוכיח שלא יגיע כסף.',\n      'אין לבחור ערוץ אחד כעיקרי כאשר כבוד נכנס מופיע ביותר מבית נושא אחד.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'money.p180.livelihoodH10Invert — מצב המחיה הוא דין נפרד.',\n      'money.p181.recast25811 — עצם השגת הממון היא דין נפרד.',\n      'סכום הממון, מועד קבלתו, חוקיותו/איסורו ושיטות כסף אחרות אינם חלק משיטת מקור הממון הזאת.',\n      'עמדות 13–16 אינן מקבלות פירוש של ערוץ כספי בשיטה הזאת; המבצע רק מתעד אותן.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'הכסף בוודאות יגיע',\n      'הכסף בוודאות לא יגיע',\n      'סכום הכסף או מועד קבלתו',\n      'ערוץ אחד הוא המקור העיקרי כאשר המקור מציג כמה הופעות',\n      'מקור כספי שאינו נובע מטבע הבית שבו כבוד נכנס שורה',\n    ]),\n  });\n}\n\n`;
  s = mustReplace(s, 'function p204AttentionPolicy() {', policy + 'function p204AttentionPolicy() {', 'insert p179 policy');
  s = mustReplace(
    s,
    "  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\n});",
    "  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\n  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),\n});",
    'register p179 policy'
  );
  write(path, s);
}

// 4) Replace the old pending assertions with scan-closed certification golden cases.
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let s = read(path);
  s = mustReplace(
    s,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 37, 'certification registry contains thirty-seven professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 38, 'certification registry contains thirty-eight professionally certified methods');",
    'certified count 38'
  );
  s = mustReplace(
    s,
    "  'spiritual.p167.hiddenActionAirRows46815',\n]) {",
    "  'spiritual.p167.hiddenActionAirRows46815',\n  'money.p179.sourceByIncomingHonorHouse',\n]) {",
    'certified list includes p179'
  );

  const oldPending = `// p179 is intentionally NOT rubber-stamped: v57 says \"יש בה צד מיטיב\" while\n// the current executor gate is pure saad. Until scan-level wording is closed,\n// it stays runnable for advisor inspection but client-facing drafting is blocked.\nconst p179Pending = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'2111', 10:'2211' }) });\nassert(p179Pending.canonicalReading?.valid === true && p179Pending.canonicalReading?.canRunKashf === true, 'p179 engine remains runnable while professional wording audit is open');\nassert(p179Pending.professionalVerdictSafety?.certificationStatus === 'pending-backfill', 'p179 is explicitly pending professional backfill, not silently certified');\nassert(p179Pending.professionalVerdictSafety?.clientFacingCertified === false, 'p179 cannot produce client-facing draft before source wording closes');\nconst p179Draft = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety, { draft: 'מקור הכסף הוא מן השלטון.', draftPolarity: 'non-binary' }));\nconst p179DraftAlignment = validateKashfAdvisorVerdictAlignment(p179Draft.value, p179Pending.professionalVerdictSafety);\nassert(p179DraftAlignment.ok === false && p179DraftAlignment.category === 'uncertified-client-draft', 'server hard-blocks p179 client draft while backfill certification is pending');\nconst p179AdvisorOnly = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety));\nassert(validateKashfAdvisorVerdictAlignment(p179AdvisorOnly.value, p179Pending.professionalVerdictSafety).ok === true, 'p179 may still be analyzed advisor-only with clientAnswerDraft:null');\n`;
  s = mustReplace(s, oldPending, '// p179 scan-level wording was closed and is tested in professional backfill batch 08 below.\n', 'remove p179 pending block');

  const batch08 = `\nconsole.log('\\n--- Professional backfill batch 08 ---');\n\n// PV-BF08-P179-* — raw scan p179 explicitly says سعد in H2, closing the pure-benefic gate.\nconst p179H10Certified = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'1222', 10:'2211' }) });\nconst p179H10Exec = p179H10Certified.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p179H10Certified.resolution?.kashfMethodId === 'money.p179.sourceByIncomingHonorHouse', 'p179 exact money-source route selected');\nassert(p179H10Exec?.beneficGateMet === true, 'p179 raw-scan سعد wording opens only on pure-benefic H2');\nassert(JSON.stringify(p179H10Exec?.sourceHouseNumbers) === JSON.stringify([10]), 'p179 Incoming Honor in H10 yields the authority/work source channel');\nassert(p179H10Exec?.sourceCandidates?.[0]?.houseNatureHebrew?.includes('שלטון'), 'p179 H10 source preserves authority/work house nature');\nassert(p179H10Certified.professionalVerdictSafety?.certificationStatus === 'certified', 'p179 passed professional backfill after raw-scan closure');\nassert(p179H10Certified.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p179 remains descriptive/non-binary rather than yes/no');\nassert(p179H10Certified.professionalVerdictSafety?.methodSpecificPolicy?.decisiveRuleHebrew?.includes('سعد'), 'p179 policy records the decisive raw Arabic سعد wording');\nconst p179ExactDraft = validateKashfAdvisorOutput(auditOutputForSafety(p179H10Certified.professionalVerdictSafety, { draft: p179H10Certified.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));\nassert(validateKashfAdvisorVerdictAlignment(p179ExactDraft.value, p179H10Certified.professionalVerdictSafety).ok === true, 'p179 exact deterministic client explanation passes server alignment');\n\nconst p179Multi = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'1222', 4:'2211', 10:'2211' }) });\nassert(JSON.stringify(p179Multi.canonicalReading?.primaryFormula?.result?.executorResult?.sourceHouseNumbers) === JSON.stringify([4,10]), 'p179 preserves multiple source channels without ranking them');\nassert(p179Multi.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('עיקרי')), 'p179 policy forbids inventing a primary channel when several occur');\n\nconst p179MixedGate = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'2222', 10:'2211' }) });\nconst p179MixedExec = p179MixedGate.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p179MixedExec?.h2Classification?.saadNahs === 'mixed', 'p179 counterfixture uses a genuinely mixed H2');\nassert(p179MixedExec?.beneficGateMet === false, 'p179 mixed H2 is not promoted into the raw-source سعد gate');\nassert(p179MixedExec?.sourceResolved === false, 'p179 mixed gate does not yield an invented money source');\nassert(p179MixedGate.professionalVerdictSafety?.clientFacingCertified === true, 'p179 unresolved branch is still professionally certified for exact non-binary explanation');\n`;
  s = mustReplace(s, "// Six runnable methods remain intentionally uncertified after source/implementation audit.\nfor (const id of [\n  'money.p179.sourceByIncomingHonorHouse',", batch08 + "\n// Five runnable methods remain intentionally uncertified after source/implementation audit.\nfor (const id of [", 'append batch08 and reduce pending list');
  write(path, s);
}

// 5) Backfill status: 38/43, p179 moved from open audit to certified.
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let s = read(path);
  s = mustReplace(s, '- מוסמכים מקצועית לאחר Batch 07: **37/43**.', '- מוסמכים מקצועית לאחר Batch 08: **38/43**.', 'status certified count');
  s = mustReplace(s, '- ממתינים להסמכה רטרואקטיבית: **6/43**.', '- ממתינים להסמכה רטרואקטיבית: **5/43**.', 'status pending count');
  s = mustReplace(
    s,
    '| spiritual.p167.hiddenActionAirRows46815 | certified | PV-BF07-P167-* | אוויר H4/H6/H8/H15 בלבד; מזיק=>פעולה מאחורי הדבר, אחרת לא; אין קביעה של כישוף/ג׳ין/עין הרע |',
    '| spiritual.p167.hiddenActionAirRows46815 | certified | PV-BF07-P167-* | אוויר H4/H6/H8/H15 בלבד; מזיק=>פעולה מאחורי הדבר, אחרת לא; אין קביעה של כישוף/ג׳ין/עין הרע |\n| money.p179.sourceByIncomingHonorHouse | certified | PV-BF08-P179-* | הסריקה הערבית עמ׳ 179 אומרת במפורש «وإن كان في الثاني سعد»; H2 חייב להיות מיטיב טהור, ואז כבוד נכנס מורה על מקור הממון לפי טבע הבית; אין קידום ממוזג ואין דירוג בין כמה ערוצים |',
    'status certified row p179'
  );
  s = s.replace(/### money\.p179\.sourceByIncomingHonorHouse[\s\S]*?(?=### marriage\.p211\.dissolutionH7StateMatrix)/, '');
  s += `\n\n## Batch 08 — p179 Money Source raw-scan closure\n\nBatch 08 סגר את פער המקור של \\`money.p179.sourceByIncomingHonorHouse\\` מול הסריקה הראשית. במקום הניסוח העברי הרך "יש בה צד מיטיב", המקור הערבי המודפס בעמ׳ 179 אומר במפורש: \\`وإن كان في الثاني سعد، فاطلب النصرة الداخلة\\`. לכן ה-executor הקיים, שדרש H2 מיטיב טהור (`saad`) ולא קידם צורה ממוזגת, היה שמרני ונכון. השיטה הוסמכה עם Golden Cases לערוץ H10, לריבוי ערוצים ול-H2 ממוזג שאינו פותח את השער.\n`;
  write(path, s);
}

// 6) Work-order note no longer describes p179 as open.
{
  const path = 'HALL_WISDOM_PROFESSIONAL_VERDICT_SAFETY_WORK_ORDER.md';
  let s = read(path);
  const old = '- p179 נבדק אך לא הוסמך: נוסח v57 "יש בה צד מיטיב" דורש סגירת-מקור מול שער ה-pure-benefic הקיים לפני אישור client-facing.';
  if (s.includes(old)) {
    s = s.replace(old, '- Batch 08 סגר את p179 מול הסריקה הערבית: המקור אומר במפורש «وإن كان في الثاني سعد», ולכן שער pure-benefic הקיים אושר והמתודה הוסמכה client-facing ללא קידום צורות ממוזגות.');
  }
  write(path, s);
}

console.log('Professional Verdict Safety backfill batch 08 patch applied.');
