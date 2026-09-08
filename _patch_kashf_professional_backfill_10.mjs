#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}
function replaceRegexOnce(text, regex, to, label) {
  const matches = [...text.matchAll(new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g'))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly 1 regex match, found ${matches.length}`);
  return text.replace(regex, to);
}

// ---------------------------------------------------------------------------
// 1) Canonical executors: p194 scan correction + p248-249 exact separation.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let text = read(path);

  text = replaceOnce(
    text,
    "    sourceText: 'אם באה הצורה ריקה, התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו.',",
    "    sourceText: 'בדין בריאות הילד: התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו. המשפט הקודם על צורה שאינה זכרית או נקבית ומתַהפכת שייך לדין ריקות הבטן ואינו תנאי להפעלת H6/H8.',",
    'p194 executor source text',
  );

  text = replaceRegexOnce(
    text,
    /const P250_251_MISSING_DEATH_PATTERNS = new Set\(\[\n[\s\S]*?\n\]\);/,
    `const P248_249_MISSING_DEATH_PATTERNS = new Set([\n  '2222', // קהלה / الجماعة\n  '2112', // חיבור / الاجتماع\n  '1111', // דרך / الطريق\n  '2212', // לבן / البياض\n  '2122', // אדום / الحمرة\n]);`,
    'p248-249 death set',
  );

  text = replaceOnce(text, '// Kashf v57 pp250-251 — life-status testimony for a missing person.\nfunction computeMissingLifeStatusP250P251(chart) {', '// Kashf v57 pp248-249 — life-status testimony for a missing person.\nfunction computeMissingLifeStatusP248P249(chart) {', 'rename missing executor');
  text = replaceOnce(text, 'P250_251_MISSING_DEATH_PATTERNS.has(item.pattern)', 'P248_249_MISSING_DEATH_PATTERNS.has(item.pattern)', 'missing death set use');
  text = replaceOnce(text, "outputHebrew = 'בתים 1, 4, 9 ו־15 כולם מיטיבים. לפי כשף v57 עמ׳ 250–251: זהו סימן שהנעדר חי.';", "outputHebrew = 'בתים 1, 4, 9 ו־15 כולם מיטיבים. לפי כשף v57 עמ׳ 248–249: זהו סימן שהנעדר חי.';", 'missing alive output');
  text = replaceOnce(text, "outputHebrew = 'בבתים 6, 7, 8 ו־15 נמצאות כולן צורות מן הרשימה הקשה שמונה המקור: קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן. זהו לפי v57 עמ׳ 250–251 סימן קשה בדין חייו של הנעדר; הפלט אינו הופך עדות זו לבדו לאישור עובדתי ודאי של מוות.';", "outputHebrew = 'בבתים 6, 7, 8 ו־15 נמצאות כולן צורות מן הרשימה המפורשת בעמ׳ 248–249: קהלה, חיבור, דרך, לבן או אדום. זהו סימן מקור המורה על מותו של הנעדר; הפלט שומר אותו כעדות של שיטת הספר ואינו מציג אותו כאימות עובדתי חיצוני של מוות.';", 'missing severe output');
  text = replaceOnce(text, "outputHebrew = 'בלוח מתקיימים יחד סימן החיים וסימן המוות הקשה שנמסרו בעמ׳ 250–251. המקור אינו נותן כאן כלל קדימות בין העדויות, ולכן אין לבחור אחת מהן מן הדעת.';", "outputHebrew = 'בלוח מתקיימים יחד סימן החיים וסימן המוות שנמסרו בעמ׳ 248–249. המקור אינו נותן כאן כלל קדימות בין העדויות, ולכן אין לבחור אחת מהן מן הדעת.';", 'missing conflict output');
  text = replaceOnce(text, "    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 250–251',", "    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 248–249',", 'missing source ref');
  text = replaceOnce(
    text,
    "    sourceText: 'אם הראשון, הרביעי, התשיעי והסוף מיטיבים, הרי הנעדר חי. אם נמצאו בשישי, בשביעי, בשמיני ובסוף צורות המוות המנויות במקור — קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן — הדבר משמש עדות קשה בדין חייו של הנעדר.',",
    "    sourceText: 'אם הראשון, הסוף, הרביעי והתשיעי מיטיבים — הנעדר חי. ואם בשישי, בשביעי, בשמיני ובסוף נמצאות מן הצורות האלה: קהלה, חיבור, דרך, לבן או אדום — הדבר מורה על מותו.',",
    'missing source text',
  );
  text = replaceOnce(text, "  'missing.p248-249.lifeH1H4H9Outcome': computeMissingLifeStatusP250P251,", "  'missing.p248-249.lifeH1H4H9Outcome': computeMissingLifeStatusP248P249,", 'missing executor mapping');

  write(path, text);
}

// ---------------------------------------------------------------------------
// 2) v57 operational Hebrew knowledge: correct p194 and p248-249 provenance.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = read(path);

  text = replaceOnce(
    text,
    "    hebrewRule: 'אם באה הצורה ריקה, התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו.',",
    "    hebrewRule: 'בדין בריאות הילד: התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו.',",
    'p194 v57 rule',
  );
  text = replaceOnce(
    text,
    "    arabicVerificationPages: [194],\n    notes: 'זהו מסלול בריאות הילד לאורך הזמן, לא מנוע החלמה מחולי נוכחי.',",
    "    arabicVerificationPages: [194],\n    verificationNotes: 'בדיקה חוזרת של הסריקה הערבית מראה שהמשפט הקודם מדבר על צורת H5 שאינה זכרית ואינה נקבית והיא מתהפכת, שאז הבטן ריקה; אחריו מתחיל במפורש ثم انظر إلى البيت السادس. לכן ריקות הבטן אינה שער להפעלת דיני H6/H8.',\n    notes: 'זהו מסלול בריאות הילד לאורך הזמן, לא מנוע החלמה מחולי נוכחי. H6 ו-H8 הם שני עדים נפרדים; אין לייבא אליהם את סעיף ריקות הבטן של H5 ואין ליצור ציון בריאות כולל.',",
    'p194 verification note',
  );

  const oldMissing = `    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',\n    page: 251,\n    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',\n    heading: 'הגעת הנעדר ושובו',\n    hebrewRule: 'אם הראשון, הרביעי, התשיעי והסוף מיטיבים, הרי הנעדר חי. אם נמצאו בשישי, בשביעי, בשמיני ובסוף צורות המוות המנויות במקור — קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן — הדבר משמש עדות קשה בדין חייו של הנעדר.',\n    detailPages: [250, 251],\n    supportingPages: [54, 57, 58, 59, 60],\n    arabicVerificationPages: [250, 251],\n    notes: 'מזהה השיטה נשמר לשם תאימות לאחור, אך ביקורת v57 תיקנה את עקיבות העמודים: הכלל התפעולי הזה נמצא בעמודים 250–251, לא 248–249.',`;
  const newMissing = `    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',\n    page: 248,\n    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',\n    heading: 'חיי הנעדר ועדות למותו',\n    hebrewRule: 'אם הראשון, הסוף, הרביעי והתשיעי מיטיבים — הנעדר חי. ואם בשישי, בשביעי, בשמיני ובסוף נמצאות מן הצורות האלה: קהלה, חיבור, דרך, לבן או אדום — הדבר מורה על מותו.',\n    detailPages: [248, 249],\n    supportingPages: [54, 57, 58, 59, 60],\n    arabicVerificationPages: [248, 249],\n    verificationNotes: 'בדיקת הסריקה המקורית מפרידה את כלל עמ׳ 248–249 מן הכלל הסמוך שקדם לו: רשימת המוות בשיטה זו היא בדיוק קהלה, חיבור, דרך, לבן ואדום. סוהר ושפל ראש אינם חלק מן הרשימה הזאת.',\n    notes: 'מזהה השיטה כבר נושא את העמודים הנכונים ונשמר. אין לערבב את דין החיים/מוות הזה עם דין חזרת הנעדר בעמ׳ 249 או עם כלל סמוך מן העמוד הקודם.',`;
  text = replaceOnce(text, oldMissing, newMissing, 'p248-249 v57 knowledge block');

  write(path, text);
}

// ---------------------------------------------------------------------------
// 3) Canonical registry + question-route provenance.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = read(path);
  text = replaceOnce(text, "    sourcePages: [250, 251],", "    sourcePages: [248, 249],", 'missing method source pages');
  text = replaceOnce(
    text,
    "    notes: 'Canonical pp250-251 missing-person life-status executor is wired from the corrected v57 provenance. H1+H4+H9+H15 all pure benefic expose the explicit alive sign. H6+H7+H8+H15 all drawn from the seven source-listed death figures expose the separate severe testimony. Neither absence of the alive sign nor the severe pattern is silently converted into a certain death/alive verdict; mixed or incomplete testimony remains unresolved.',",
    "    notes: 'Canonical pp248-249 missing-person life-status executor is wired from the original-scan provenance. H1+H15+H4+H9 all pure benefic expose the explicit alive sign. H6+H7+H8+H15 all drawn from the exact five named figures — קהלה, חיבור, דרך, לבן, אדום — expose the separate death testimony. סוהר ושפל ראש belong to a neighboring rule and are excluded. Neither absence of the alive sign nor the named-figure condition is inverted into the opposite verdict.',",
    'missing method notes',
  );
  write(path, text);
}

{
  const path = 'goral-hachol/registry/kashf-question-route-registry.js';
  let text = read(path);
  text = replaceOnce(
    text,
    "    note: 'v57 provenance correction: the prior 3/5/9 recurrence method is in the later al-Multaqat addition. The selected body-source life/death material is on pp250-251; the historical method id is retained for compatibility.',",
    "    note: 'Original-scan re-audit: the selected body-source life/death rule is on printed pp248-249. The prior 3/5/9 recurrence method is in the later al-Multaqat addition. Keep this route isolated from the separate return rule on p249 and from neighboring death-sign lists.',",
    'missing question route note',
  );
  write(path, text);
}

// ---------------------------------------------------------------------------
// 4) Professional Verdict Safety policies: certify p194 + p248-249.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = read(path);
  text = replaceOnce(text, "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v10';", "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v11';", 'safety version');
  text = replaceOnce(
    text,
    "const P225_THIEF_DESCRIPTION_METHOD = 'theft.p225.thiefDescriptionH7';",
    "const P225_THIEF_DESCRIPTION_METHOD = 'theft.p225.thiefDescriptionH7';\nconst P194_CHILD_HEALTH_METHOD = 'child.p194.healthTrajectoryH6H8';\nconst P248_249_MISSING_LIFE_METHOD = 'missing.p248-249.lifeH1H4H9Outcome';",
    'batch10 safety constants',
  );

  const policies = `\nfunction p194ChildHealthPolicy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-10',\n    goldenCaseIds: freezeArray(['PV-BF10-P194-H6', 'PV-BF10-P194-H8-BENEFIC', 'PV-BF10-P194-H8-MALEFIC', 'PV-BF10-P194-EXACT-DRAFT']),\n    policyId: 'p194-child-health-h6-h8-scan-corrected-v1',\n    questionScopeHebrew: 'מסלול בריאות הילד לאורך הזמן לפי עמ׳ 194',\n    decisiveRuleHebrew: 'H6 מזיק טהור => ריבוי מכאובים בילדות. H8 מזיק טהור => התקווה בו מועטה. H8 מיטיב טהור => ככל שיגדל ימעט חוליו וישתפר מצבו. הסעיף הקודם על H5 שאינה זכרית/נקבית ומתַהפכת שייך לריקות הבטן ואינו שער להפעלת H6/H8.',\n    oneWayBranches: freezeArray([\n      'H6 מזיק טהור => ריבוי מכאובים בילדות',\n      'H8 מזיק טהור => התקווה בו מועטה',\n      'H8 מיטיב טהור => ככל שיגדל ימעט חוליו וישתפר מצבו',\n    ]),\n    forbiddenInversions: freezeArray([\n      'H6 שאינו מזיק טהור אינו מוכיח שלא יהיו מכאובים.',\n      'H8 ממוזג אינו מקודם למיטיב או למזיק.',\n      'אין להפוך את סעיף ריקות הבטן של H5 לתנאי סף לבריאות H6/H8.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'pregnancy.p191.existsH5SilentEmpty — קיום הריון הוא דין נפרד.',\n      'pregnancy.p191.genderH5 — מין הוולד הוא דין נפרד.',\n      'pregnancy.p191.deliveryDifficultyH1H5H15 — קלות הלידה היא דין נפרד.',\n      'illness.p196.outcomeH15 — החלמת חולה נוכחי היא דין נפרד.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'אבחנה רפואית של מחלה מסוימת',\n      'ודאות שהילד ימות או לא יחלים',\n      'אין שום בעיית בריאות משום ש-H6 אינו מזיק',\n    ]),\n  });\n}\n\nfunction p248249MissingLifePolicy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-10',\n    goldenCaseIds: freezeArray(['PV-BF10-P248-ALIVE', 'PV-BF10-P248-DEATH-SIGN', 'PV-BF10-P248-NEIGHBOR-EXCLUSION', 'PV-BF10-P248-EXACT-DRAFT']),\n    policyId: 'p248-249-missing-life-exact-five-figures-v1',\n    questionScopeHebrew: 'חיי הנעדר ועדות למותו לפי עמ׳ 248–249',\n    decisiveRuleHebrew: 'H1+H15+H4+H9 כולם מיטיבים טהורים => סימן שהנעדר חי. H6+H7+H8+H15 כולם אחת מחמש הצורות המפורשות קהלה/חיבור/דרך/לבן/אדום => סימן המקור למותו.',\n    oneWayBranches: freezeArray([\n      'H1+H15+H4+H9 כולם מיטיבים טהורים => הנעדר חי לפי השיטה',\n      'H6+H7+H8+H15 כולם מן {קהלה, חיבור, דרך, לבן, אדום} => סימן המקור למותו',\n    ]),\n    forbiddenInversions: freezeArray([\n      'כישלון סימן החיים אינו מוכיח מוות.',\n      'כישלון רשימת חמש הצורות אינו מוכיח חיים.',\n      'סוהר ושפל ראש אינם רשאים להיכנס לרשימת חמש הצורות של עמ׳ 248–249.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'רשימות מוות מן הכלל הסמוך בעמוד הקודם.',\n      'missing.p249.returnAnglesJudge — דין חזרת נעדר הוא שיטה נפרדת.',\n      'שיטות מיקום/כיוון של נעדר.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'אימות עובדתי חיצוני של מותו של אדם',\n      'הנעדר מת משום שלא התקיים סימן החיים',\n      'הנעדר חי משום שלא התקיימה רשימת חמש הצורות',\n    ]),\n  });\n}\n\n`;
  text = replaceOnce(text, 'const METHOD_POLICIES = Object.freeze({', policies + 'const METHOD_POLICIES = Object.freeze({', 'insert batch10 policies');
  text = replaceOnce(
    text,
    '  [P225_THIEF_DESCRIPTION_METHOD]: p225ThiefDescriptionPolicy(),\n});',
    '  [P225_THIEF_DESCRIPTION_METHOD]: p225ThiefDescriptionPolicy(),\n  [P194_CHILD_HEALTH_METHOD]: p194ChildHealthPolicy(),\n  [P248_249_MISSING_LIFE_METHOD]: p248249MissingLifePolicy(),\n});',
    'register batch10 policies',
  );
  write(path, text);
}

// ---------------------------------------------------------------------------
// 5) Golden/regression tests.
// ---------------------------------------------------------------------------
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = read(path);
  text = replaceOnce(text, "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 39, 'certification registry contains thirty-nine professionally certified methods');", "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 41, 'certification registry contains forty-one professionally certified methods');", 'certified count 39->41');
  text = replaceOnce(
    text,
    "// Five runnable methods remain intentionally uncertified after source/implementation audit.\nfor (const id of [\n  'marriage.p211.dissolutionH7StateMatrix',\n  'profession.p254.h9Planet',\n  'child.p194.healthTrajectoryH6H8',\n  'missing.p248-249.lifeH1H4H9Outcome',\n]) {",
    "// Two runnable methods remain intentionally uncertified after source/implementation audit.\nfor (const id of [\n  'marriage.p211.dissolutionH7StateMatrix',\n  'profession.p254.h9Planet',\n]) {",
    'pending list after batch10',
  );

  const batch10Tests = `\n\nconsole.log('\\n--- Professional backfill batch 10 — p194 scan correction + p248-249 source separation ---');\n\nassert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('child.p194.healthTrajectoryH6H8'), 'p194 child-health method is explicitly professionally certified');\nassert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('missing.p248-249.lifeH1H4H9Outcome'), 'p248-249 missing-life method is explicitly professionally certified');\n\nconst p194PainImprove = buildKashfCanonicalAiBridge({ questionId: 'q-child-health', questionText: 'בריאות הילד לאורך הזמן', board: makeBoard({ 6:'1112', 8:'2211' }) });\nconst p194PainImproveExec = p194PainImprove.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(JSON.stringify(p194PainImproveExec?.housesUsed) === JSON.stringify([6,8]), 'p194 executes H6/H8 only: no invented H5 empty-figure gate');\nassert(p194PainImproveExec?.childhoodPains === true, 'p194 pure-malefic H6 gives the explicit childhood-pains testimony');\nassert(p194PainImproveExec?.longTermOutcome === 'improves-with-age', 'p194 pure-benefic H8 gives improvement with age');\nassert(p194PainImprove.professionalVerdictSafety?.certificationStatus === 'certified', 'p194 passed professional backfill after raw-scan antecedent correction');\nassert(p194PainImprove.professionalVerdictSafety?.clientFacingCertified === true, 'p194 exact source-bounded client explanation is certified');\nassert(p194PainImprove.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('ריקות הבטן')), 'p194 safety policy blocks reintroducing the stale empty-womb gate');\nconst p194LowHope = buildKashfCanonicalAiBridge({ questionId: 'q-child-health', questionText: 'בריאות הילד לאורך הזמן', board: makeBoard({ 6:'2211', 8:'1112' }) });\nassert(p194LowHope.canonicalReading?.primaryFormula?.result?.executorResult?.longTermOutcome === 'low-hope', 'p194 pure-malefic H8 preserves the low-hope source branch');\nconst p194MixedH8 = buildKashfCanonicalAiBridge({ questionId: 'q-child-health', questionText: 'בריאות הילד לאורך הזמן', board: makeBoard({ 8:'1121' }) });\nassert(p194MixedH8.canonicalReading?.primaryFormula?.result?.executorResult?.longTermOutcome === 'unresolved', 'p194 mixed H8 is not promoted to benefic or malefic');\nconst p194Exact = validateKashfAdvisorOutput(auditOutputForSafety(p194PainImprove.professionalVerdictSafety, {\n  draft: p194PainImprove.professionalVerdictSafety.authoritativeClientDraftHebrew,\n  draftPolarity: 'non-binary',\n}));\nassert(validateKashfAdvisorVerdictAlignment(p194Exact.value, p194PainImprove.professionalVerdictSafety).ok === true, 'p194 exact deterministic client draft passes');\n\nconst p248Alive = buildKashfCanonicalAiBridge({ questionId: 'q-missing-alive', questionText: 'הנעדר חי או מת', board: makeBoard({ 1:'2111', 4:'2111', 9:'2111', 15:'2111' }) });\nconst p248AliveExec = p248Alive.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p248AliveExec?.aliveIndicated === true && p248AliveExec?.sourceOutcome === 'alive-indicated', 'p248-249 four pure-benefic life houses give the explicit alive sign');\nassert(p248Alive.professionalVerdictSafety?.certificationStatus === 'certified', 'p248-249 missing-life method passed professional backfill');\nassert(p248Alive.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p248-249 source testimony remains non-binary for the AI safety layer');\n\nconst p248Severe = buildKashfCanonicalAiBridge({ questionId: 'q-missing-alive', questionText: 'הנעדר חי או מת', board: makeBoard({ 6:'2222', 7:'2222', 8:'2222', 15:'2222' }) });\nconst p248SevereExec = p248Severe.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p248SevereExec?.severeDeathTestimony === true && p248SevereExec?.sourceOutcome === 'severe-death-testimony', 'p248-249 exact named figure Jamaa is accepted in all four death-testimony houses');\nassert(String(p248SevereExec?.sourceText || '').includes('קהלה, חיבור, דרך, לבן או אדום'), 'p248-249 executor carries exactly the five source-listed figures');\nassert(!String(p248SevereExec?.sourceText || '').includes('סוהר') && !String(p248SevereExec?.sourceText || '').includes('שפל ראש'), 'p248-249 executor excludes Aqla/Ankis bleed from the neighboring rule');\nconst p248NeighborBleed = buildKashfCanonicalAiBridge({ questionId: 'q-missing-alive', questionText: 'הנעדר חי או מת', board: makeBoard({ 6:'2221', 7:'2221', 8:'2221', 15:'2221' }) });\nassert(p248NeighborBleed.canonicalReading?.primaryFormula?.result?.executorResult?.severeDeathTestimony === false, 'p248-249 Ankis no longer falsely triggers the death testimony');\nconst p248AqlaBleed = buildKashfCanonicalAiBridge({ questionId: 'q-missing-alive', questionText: 'הנעדר חי או מת', board: makeBoard({ 6:'1221', 7:'1221', 8:'1221', 15:'1221' }) });\nassert(p248AqlaBleed.canonicalReading?.primaryFormula?.result?.executorResult?.severeDeathTestimony === false, 'p248-249 Aqla no longer falsely triggers the death testimony');\nassert(p248Severe.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('סוהר ושפל ראש')), 'p248-249 safety policy locks the neighboring-rule exclusion');\nconst p248Exact = validateKashfAdvisorOutput(auditOutputForSafety(p248Severe.professionalVerdictSafety, {\n  draft: p248Severe.professionalVerdictSafety.authoritativeClientDraftHebrew,\n  draftPolarity: 'non-binary',\n}));\nassert(validateKashfAdvisorVerdictAlignment(p248Exact.value, p248Severe.professionalVerdictSafety).ok === true, 'p248-249 exact deterministic client draft passes');\n`;

  const endMarker = "\nif (failed > 0) {";
  if (text.includes(endMarker)) {
    text = replaceOnce(text, endMarker, batch10Tests + endMarker, 'append batch10 tests before failure gate');
  } else {
    // Older test harness prints summary directly; append before the summary marker instead.
    const summaryMarker = "\nconsole.log(`\\nKashf professional verdict safety tests:";
    if (!text.includes(summaryMarker)) throw new Error('test end marker not found');
    text = replaceOnce(text, summaryMarker, batch10Tests + summaryMarker, 'append batch10 tests before summary');
  }
  write(path, text);
}

{
  const path = '_test_kashf_canonical_routing.mjs';
  let text = read(path);
  text = replaceOnce(text, "assert(JSON.stringify(getKashfMethod('missing.p248-249.lifeH1H4H9Outcome')?.sourcePages) === JSON.stringify([250, 251]), 'missing-person life/death method now points to actual v57 pp250-251');", "assert(JSON.stringify(getKashfMethod('missing.p248-249.lifeH1H4H9Outcome')?.sourcePages) === JSON.stringify([248, 249]), 'missing-person life/death method points to original-scan pp248-249');", 'canonical missing page assertion');
  text = replaceOnce(text, "const p250Severe = buildKashfReadingByQuestionId(makeP204Board({ 6: '2221', 7: '2221', 8: '2221', 15: '2221' }), 'q-missing-alive');", "const p250Severe = buildKashfReadingByQuestionId(makeP204Board({ 6: '2222', 7: '2222', 8: '2222', 15: '2222' }), 'q-missing-alive');", 'canonical severe fixture');
  text = replaceOnce(text, "assert(p250Severe.primaryFormula?.result?.executorResult?.severeDeathTestimony === true && p250Severe.primaryFormula?.result?.executorResult?.sourceOutcome === 'severe-death-testimony', 'pp250-251 four source-listed death figures expose severe testimony');", "assert(p250Severe.primaryFormula?.result?.executorResult?.severeDeathTestimony === true && p250Severe.primaryFormula?.result?.executorResult?.sourceOutcome === 'severe-death-testimony', 'pp248-249 exact five-figure list exposes the severe source testimony');", 'canonical severe assertion');
  text = replaceOnce(text, "assert(p250Alive.primaryFormula?.sourceText === getKashfV57Knowledge('missing.p248-249.lifeH1H4H9Outcome')?.v57?.hebrewRule, 'pp250-251 missing-life runtime sourceText comes from Hebrew v57');", "assert(p250Alive.primaryFormula?.sourceText === getKashfV57Knowledge('missing.p248-249.lifeH1H4H9Outcome')?.v57?.hebrewRule, 'pp248-249 missing-life runtime sourceText comes from Hebrew v57');", 'canonical source text label');
  text = replaceOnce(text, "assert(p250AliveExec?.aliveIndicated === true && p250AliveExec?.sourceOutcome === 'alive-indicated', 'pp250-251 four pure-benefic life houses expose explicit alive sign');", "assert(p250AliveExec?.aliveIndicated === true && p250AliveExec?.sourceOutcome === 'alive-indicated', 'pp248-249 four pure-benefic life houses expose explicit alive sign');", 'canonical alive label');
  const severeNeedle = "assert(p250Severe.primaryFormula?.result?.executorResult?.positive === null, 'severe missing-person testimony is not converted to a generic certain-death boolean');";
  const severeExtra = severeNeedle + "\nconst p248NeighborExcluded = buildKashfReadingByQuestionId(makeP204Board({ 6: '2221', 7: '2221', 8: '2221', 15: '2221' }), 'q-missing-alive');\nassert(p248NeighborExcluded.primaryFormula?.result?.executorResult?.severeDeathTestimony === false, 'p248-249 excludes Ankis from the five-figure death list');";
  text = replaceOnce(text, severeNeedle, severeExtra, 'canonical neighbor exclusion');
  write(path, text);
}

// ---------------------------------------------------------------------------
// 6) Status + historical traceability docs.
// ---------------------------------------------------------------------------
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = read(path);
  text = replaceOnce(text, '- מוסמכים מקצועית לאחר Batch 09: **39/43**.\n- ממתינים להסמכה רטרואקטיבית: **4/43**.', '- מוסמכים מקצועית לאחר Batch 10: **41/43**.\n- ממתינים להסמכה רטרואקטיבית: **2/43**.', 'status counts');
  text = replaceOnce(
    text,
    '| theft.p225.thiefDescriptionH7 | certified | PV-BF09-P225-* | H7 בלבד: הוראת עמ׳ 225 + טבלת 16 התיאורים עמ׳ 231–233; פרופיל תיאורי בלבד, ללא זיהוי אדם, הוכחת אשמה או אותיות שם |',
    '| theft.p225.thiefDescriptionH7 | certified | PV-BF09-P225-* | H7 בלבד: הוראת עמ׳ 225 + טבלת 16 התיאורים עמ׳ 231–233; פרופיל תיאורי בלבד, ללא זיהוי אדם, הוכחת אשמה או אותיות שם |\n| child.p194.healthTrajectoryH6H8 | certified | PV-BF10-P194-* | הסריקה המקורית מפרידה את סעיף ריקות הבטן של H5 מדיני הבריאות: H6 מזיק=>מכאובי ילדות; H8 מזיק=>תקווה מועטה; H8 מיטיב=>שיפור עם הגיל; אין שער H5 ואין ציון כולל |\n| missing.p248-249.lifeH1H4H9Outcome | certified | PV-BF10-P248-* | עמ׳ 248–249: H1/H15/H4/H9 מיטיבים=>חי; עדות המוות ב-H6/H7/H8/H15 משתמשת בדיוק בקהלה/חיבור/דרך/לבן/אדום; סוהר ושפל ראש הופרדו ככלל סמוך |',
    'status certified rows',
  );
  text = replaceRegexOnce(text, /\n### child\.p194\.healthTrajectoryH6H8\n[\s\S]*?(?=\n### missing\.p248-249\.lifeH1H4H9Outcome)/, '\n', 'remove resolved p194 audit');
  text = replaceRegexOnce(text, /\n### missing\.p248-249\.lifeH1H4H9Outcome\n[\s\S]*?(?=\n### profession\.p254\.h9Planet)/, '\n', 'remove resolved missing audit');
  text += `\n\n## Batch 10 — p194 scan correction + p248–249 source separation\n\nBatch 10 סגר שני פערים שנראו בתחילה כפערי יישום אך התבררו כבעיות עקיבות מקור. ב-\`child.p194.healthTrajectoryH6H8\` בדיקה חוזרת של הסריקה הערבית הראתה שהמשפט על צורה שאינה זכרית/נקבית ומתַהפכת מתייחס לריקות הבטן בסעיף H5 הקודם; אחריו מתחיל במפורש הדין \`ثم انظر إلى البيت السادس\`. לכן H6/H8 אינם תלויים בשער "צורה ריקה", וה-executor הקיים היה נכון במבנהו לאחר תיקון טקסט המקור והנעילה המקצועית.\n\nב-\`missing.p248-249.lifeH1H4H9Outcome\` הסריקה המקורית החזירה את עקיבות העמודים לעמ׳ 248–249 והפרידה רשימות שהתמזגו בעבר. סימן החיים הוא H1+H15+H4+H9 מיטיבים. רשימת עדות המוות של H6+H7+H8+H15 כוללת בדיוק חמש צורות: קהלה, חיבור, דרך, לבן ואדום. סוהר ושפל ראש שייכים לכלל סמוך ואינם רשאים להפעיל שיטה זו. שתי השיטות קיבלו Exact Client Draft Lock ו-Golden Cases ייעודיים.\n\nלאחר Batch 10 נותרו שני runnable methods ללא הסמכה: \`marriage.p211.dissolutionH7StateMatrix\` ו-\`profession.p254.h9Planet\`. שניהם נשארים חסומים ל-clientAnswerDraft עד Source Closure ייעודי.\n`;
  write(path, text);
}

{
  const path = 'HALL_WISDOM_KASHF_V57_READY_METHOD_BACKFILL.md';
  let text = read(path);
  text = replaceOnce(
    text,
    '4. **missing-person life/death page traceability was stale.** The selected operational rule is in v57 pp250-251; the historical method id is retained for compatibility, but sourcePages are corrected.',
    '4. **Historical provenance note superseded by Batch 10 raw-scan re-audit.** This backfill originally placed the selected missing-person life/death rule on pp250-251. Reinspection of the original scan restored the exact body-source rule to printed pp248-249 and separated its five named death figures from the neighboring rule. See the Professional Verdict Safety Batch 10 status record.',
    'historical provenance correction',
  );
  write(path, text);
}

console.log('Professional Verdict Safety backfill batch 10 patch applied.');
