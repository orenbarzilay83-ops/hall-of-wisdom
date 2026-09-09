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
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const matches = [...text.matchAll(new RegExp(regex.source, flags))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly 1 regex match, found ${matches.length}`);
  return text.replace(regex, to);
}

// ---------------------------------------------------------------------------
// 1) Source-backed p133-134 attribution table: complete all 16 figures.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/data/sources/kashf-al-asrar/kashf-hazz.js';
  let text = read(path);

  text = replaceOnce(
    text,
    '//   צמתי הגלגל (ראש/זנב) — לא נכללים במחזור הבתים, לא מחושבים בתסכין-כוכב',
    '//   טבלת עמ׳ 134 כוללת גם ראש/זנב התלי ומשלימה שיוך מפורש לכל 16 הצורות; הצמתים אינם חלק ממחזור שבעת כוכבי הבתים.',
    'hazz top node note',
  );

  const newMap = [
    '// מיפוי ייחוס מזג/כוכב → צורות (עמ׳ 133-134)',
    '// הטקסט בעמ׳ 133-134 והטבלה המודפסת בעמ׳ 134 נקראים יחד:',
    '// - נלחם / ג׳ודלה (1121) שייך לנוגה; בר הלחי (1211) למאדים.',
    '// - סוהר / עקלה (1221) שייך לשבתאי.',
    '// - ראש התלי = ממון יוצא (1212); זנב התלי = סף יוצא (1112).',
    '// כך מתקבלת חלוקה מלאה וחד-ערכית של כל 16 הצורות.',
    'export const FIGURE_PLANET_MAP = [',
    "  { planet: 'שמש',       arabicName: 'الشمس',   patterns: ['2121', '1122'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'נוגה',      arabicName: 'الزهرة',  patterns: ['1121', '2211'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'ירח',       arabicName: 'القمر',   patterns: ['2212', '1111'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'כוכב',      arabicName: 'عطارد',   patterns: ['2112', '2222'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'שבתאי',     arabicName: 'زحل',     patterns: ['2221', '1221'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'מאדים',     arabicName: 'المريخ',  patterns: ['2122', '1211'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'צדק',       arabicName: 'المشتري', patterns: ['2111', '1222'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'ראש התלי', arabicName: 'الرأس',   patterns: ['1212'], sourceStatus: 'explicit-in-source' },",
    "  { planet: 'זנב התלי', arabicName: 'الذنب',   patterns: ['1112'], sourceStatus: 'explicit-in-source' },",
    '];',
  ].join('\n');

  text = replaceRegexOnce(
    text,
    /\/\/ מיפוי כוכב → צורות \(עמוד 133-134\)[\s\S]*?export const FIGURE_PLANET_MAP = \[[\s\S]*?\n\];/,
    newMap,
    'replace complete p133-134 attribution map',
  );

  write(path, text);
}

// ---------------------------------------------------------------------------
// 2) Canonical p254 executor: H9 attribution + pure-saad H10/H11 qualifier.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let text = read(path);

  text = replaceOnce(
    text,
    "import {\n  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n} from './kashf-pending-extraction.js';",
    "import {\n  computeBodyPartDiagnosisKashf,\n} from './kashf-pending-extraction.js';",
    'remove profession legacy import',
  );

  text = replaceOnce(
    text,
    "const LEGACY_EXECUTORS = Object.freeze({\n  'profession.p254.h9Planet': computeProfessionH9Kashf,\n  'illness.bodyPart.h6Figure': computeBodyPartDiagnosisKashf,\n});",
    "const LEGACY_EXECUTORS = Object.freeze({\n  'illness.bodyPart.h6Figure': computeBodyPartDiagnosisKashf,\n});",
    'remove profession legacy allowlist',
  );

  const p254Block = [
    '// Kashf p254 — profession/craft from the p133-134 figure attribution in H9.',
    '// H10/H11 are a separate one-way ease-of-work qualifier only: both must be',
    '// pure سعد. Mixed figures are not promoted, and failure of the condition',
    '// never creates the inverse claim that the work is difficult.',
    'const P254_PROFESSION_BY_ATTRIBUTION = Object.freeze({',
    "  'שבתאי': 'חקלאות ועבודת אדמה',",
    "  'צדק': 'בקשת חכמות ולימודים',",
    "  'מאדים': 'רפואה ורפואת בהמות',",
    "  'שמש': 'הנדסה ומדידות',",
    "  'נוגה': 'דברי הימים, לחנים וניגונים',",
    "  'כוכב': 'כישוף, נפלאות ואצטגנינות',",
    "  'ירח': 'ענייני עניים וצדיקים',",
    "  'ראש התלי': 'ידיעת הדתות ואפשר ידיעה בחלק ממדע הנסתר',",
    "  'זנב התלי': 'בורות, בגידה וקלקול',",
    '});',
    '',
    'function computeProfessionP254(chart) {',
    '  if (!Array.isArray(chart)) return null;',
    '  const h9 = findCanonicalHouse(chart, 9);',
    '  const h10 = findCanonicalHouse(chart, 10);',
    '  const h11 = findCanonicalHouse(chart, 11);',
    "  const h9Pattern = h9?.key || h9?.pattern || null;",
    '  if (!h9Pattern) return null;',
    '',
    '  const attribution = getVerifiedPlanetForPattern(h9Pattern);',
    '  const attributionHebrew = attribution?.planetHebrew || null;',
    '  const profession = attributionHebrew ? (P254_PROFESSION_BY_ATTRIBUTION[attributionHebrew] || null) : null;',
    "  const h10Pattern = h10?.key || h10?.pattern || null;",
    "  const h11Pattern = h11?.key || h11?.pattern || null;",
    '  const h10Classification = h10Pattern ? classifyCanonicalFigure(h10Pattern) : null;',
    '  const h11Classification = h11Pattern ? classifyCanonicalFigure(h11Pattern) : null;',
    "  const h10PureSaad = h10Classification?.saadNahs === 'saad';",
    "  const h11PureSaad = h11Classification?.saadNahs === 'saad';",
    '  const easeOfWorkIndicated = h10PureSaad && h11PureSaad ? true : null;',
    '',
    "  const h9FigureHebrew = h9?.hebrew || h9?.hebrewName || h9Pattern;",
    '  const parts = [];',
    '  if (easeOfWorkIndicated === true) {',
    "    parts.push('בתים 10 ו־11 שניהם מיטיבים טהורים. לפי כשף עמ׳ 254: מלאכתו מעטה בטרחה והוא מוצא בה מנוחה.');",
    '  }',
    '  if (attributionHebrew && profession) {',
    '    parts.push(`בית 9: ${h9FigureHebrew} (${h9Pattern}) — ${attributionHebrew}: ${profession}.`);',
    '  } else {',
    "    parts.push(`בית 9: ${h9FigureHebrew} (${h9Pattern}) — ייחוס הצורה אינו מוכרע בטבלת עמ׳ 133–134, ולכן עמ׳ 254 אינו מאפשר לקבוע את סוג המלאכה.`);",
    '  }',
    '',
    '  return {',
    "    sourceRef: 'כשף אל-אסרר עמ׳ 254; טבלת ייחוס הצורות עמ׳ 133–134',",
    "    sourceText: 'אם בבית העשירי ובאחד־עשר יש צורה מיטיבה, מלאכתו מעטה בטרחה והוא מוצא בה מנוחה. את סוג המלאכה דנים לפי ייחוס הצורה בבית התשיעי.',",
    '    housesUsed: [9, 10, 11],',
    '    h9Pattern,',
    '    h9FigureHebrew,',
    '    attributionHebrew,',
    '    attributionArabic: attribution?.planetArabic || null,',
    '    planet9: attributionHebrew,',
    '    profession,',
    '    h10Pattern,',
    '    h11Pattern,',
    '    h10Quality: h10Classification?.saadNahs || null,',
    '    h11Quality: h11Classification?.saadNahs || null,',
    '    easeOfWorkIndicated,',
    '    lightWork: easeOfWorkIndicated === true,',
    '    positive: null,',
    "    verdictType: 'profession-by-h9-attribution',",
    "    outputHebrew: parts.join(' '),",
    '  };',
    '}',
    '',
  ].join('\n');

  text = replaceOnce(
    text,
    "const P256_HONOR_POSITIVE_PLANETS = new Set(['שמש', 'צדק', 'נוגה']);",
    p254Block + "const P256_HONOR_POSITIVE_PLANETS = new Set(['שמש', 'צדק', 'נוגה']);",
    'insert p254 canonical executor',
  );

  text = replaceOnce(
    text,
    'const CUSTOM_EXECUTORS = Object.freeze({',
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'profession.p254.h9Planet': computeProfessionP254,",
    'wire p254 custom executor',
  );

  write(path, text);
}

// ---------------------------------------------------------------------------
// 3) Registry provenance: p254 is now a custom canonical executor.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let text = read(path);

  const replacement = [
    "  'profession.p254.h9Planet': method({",
    "    kashfMethodId: 'profession.p254.h9Planet',",
    "    kashfIntentId: 'profession.type',",
    "    topicId: 'authorityState',",
    '    sourcePages: [133, 134, 254],',
    "    kashfRuntimeStatus: 'ready',",
    '    runtimeAllowed: true,',
    "    executionKind: 'custom-engine',",
    "    executorStatus: 'ready',",
    "    legacyTopicId: 'authorityState',",
    "    notes: 'Canonical p254 profession executor is wired directly from the source. H9 uses the complete p133-134 attribution table for all 16 figures, including Head=1212 and Tail=1112. H10/H11 are only a separate one-way ease-of-work qualifier and both must be pure saad; mixed testimony is not promoted and a failed qualifier is not inverted into hard work. The method reports the source craft/profession, not a modern best-career recommendation.',",
    '  }),',
  ].join('\n');

  text = replaceRegexOnce(
    text,
    /  'profession\.p254\.h9Planet': method\(\{[\s\S]*?\n  \}\),/,
    replacement,
    'replace p254 method registry block',
  );

  write(path, text);
}

// ---------------------------------------------------------------------------
// 4) v57 operational knowledge: record full source verification dependency.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let text = read(path);

  const replacement = [
    "  'profession.p254.h9Planet': knowledge({",
    "    kashfMethodId: 'profession.p254.h9Planet',",
    '    page: 254,',
    "    topic: 'הפרק התשיעי — מסע, נעדר, אבדה, חלום וחוב',",
    "    heading: 'ייחוס, מלאכה וחלום — תכונות המלאכות',",
    "    hebrewRule: 'אם בבית העשירי ובאחד־עשר יש צורה מיטיבה, מלאכתו מעטה בטרחה והוא מוצא בה מנוחה. אחר כך דנים לפי הצורה או הכוכב בבית התשיעי: שבתאי — חקלאות ועבודת אדמה; צדק — בקשת חכמות ולימודים; מאדים — רפואה ורפואת בהמות; שמש — הנדסה ומדידות; נוגה — דברי הימים, לחנים וניגונים; כוכב / עֻטַארִד — כישוף, נפלאות ואצטגנינות; ירח — ענייני עניים וצדיקים; ראש התלי — ידיעת הדתות ואפשר ידיעה בחלק ממדע הנסתר; זנב התלי — בורות, בגידה וקלקול.',",
    '    supportingPages: [133, 134],',
    '    arabicVerificationPages: [133, 134, 254],',
    "    verificationNotes: 'עמ׳ 133–134 והטבלה המודפסת בעמ׳ 134 משלימים ייחוס חד-ערכי לכל 16 הצורות: נלחם 1121 וכבוד נכנס 2211 לנוגה; שפל ראש 2221 וסוהר 1221 לשבתאי; ראש התלי הוא ממון יוצא 1212; זנב התלי הוא סף יוצא 1112. עמ׳ 254 משתמש בייחוס הזה לקביעת סוג המלאכה. H10/H11 הם תנאי נפרד של קלות המלאכה.',",
    "    notes: 'v57 מתקן כאן חומר ישן: עֻטַארִד אינו כתיבה/חשבונות בכלל המלאכות הזה אלא כישוף, נפלאות ואצטגנינות. H10/H11 אינם קובעים את סוג המקצוע, וכישלון תנאי הקלות אינו יוצר מן הדעת דין של קושי.',",
    '  }),',
  ].join('\n');

  text = replaceRegexOnce(
    text,
    /  'profession\.p254\.h9Planet': knowledge\(\{[\s\S]*?\n  \}\),/,
    replacement,
    'replace p254 v57 block',
  );

  write(path, text);
}

// ---------------------------------------------------------------------------
// 5) Professional Verdict Safety v12: certify p254.
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = read(path);

  text = replaceOnce(
    text,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v11';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v12';",
    'safety version v12',
  );

  text = replaceOnce(
    text,
    "const P248_249_MISSING_LIFE_METHOD = 'missing.p248-249.lifeH1H4H9Outcome';",
    "const P248_249_MISSING_LIFE_METHOD = 'missing.p248-249.lifeH1H4H9Outcome';\nconst P254_PROFESSION_METHOD = 'profession.p254.h9Planet';",
    'p254 safety method constant',
  );

  const policy = [
    'function p254ProfessionPolicy() {',
    '  return Object.freeze({',
    "    certificationStatus: 'certified',",
    "    certificationBatch: 'professional-backfill-11',",
    "    goldenCaseIds: freezeArray(['PV-BF11-P254-VENUS', 'PV-BF11-P254-SATURN', 'PV-BF11-P254-HEAD-TAIL', 'PV-BF11-P254-MIXED-EASE', 'PV-BF11-P254-EXACT-DRAFT']),",
    "    policyId: 'p254-profession-h9-attribution-pure-saad-ease-v1',",
    "    questionScopeHebrew: 'סוג המלאכה לפי ייחוס הצורה ב-H9; H10/H11 הם רק סייג נפרד של קלות המלאכה',",
    "    decisiveRuleHebrew: 'סוג המלאכה נקבע לפי ייחוס H9 בטבלת עמ׳ 133–134 והפירוש בעמ׳ 254. רק אם H10 וגם H11 מיטיבים טהורים נאמר שמלאכתו מעטה בטרחה ומוצא בה מנוחה.',",
    '    oneWayBranches: freezeArray([',
    "      'H9 משויך לשמש/נוגה/עֻטַארִד/ירח/שבתאי/צדק/מאדים/ראש/זנב => החזרת המלאכה המפורשת של אותו ייחוס בעמ׳ 254',",
    "      'H10+H11 שניהם pure saad => מלאכתו מעטה בטרחה והוא מוצא בה מנוחה',",
    '    ]),',
    '    forbiddenInversions: freezeArray([',
    "      'כישלון תנאי H10/H11 אינו מוכיח שהמלאכה קשה או מרובת טרחה.',",
    "      'צורה ממוזגת ב-H10 או H11 אינה מקודמת למיטיב טהור.',",
    "      'אין לאחד ראש וזנב התלי לענף מעורפל אחד; לכל אחד דין שונה בעמ׳ 254.',",
    '    ]),',
    '    excludedFromPrimaryVerdict: freezeArray([',
    "      'H10/H11 אינם קובעים את סוג המקצוע.',",
    "      'משמעות כללית של H9 או של הצורה מחוץ לטבלת הייחוס והפירוש של p254.',",
    "      'שיטות משרה, כבוד, חזרה לתפקיד או המלצת קריירה מודרנית.',",
    '    ]),',
    '    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([',
    "      'זה המקצוע שהכי מתאים לך בחיים',",
    "      'יהיה לך קשה במקצוע משום שתנאי H10/H11 לא התקיים',",
    "      'ראש התלי וזנב התלי נותנים אותה תוצאה',",
    "      'המקור מוכיח הצלחה כלכלית במקצוע',",
    '    ]),',
    '  });',
    '}',
    '',
  ].join('\n');

  text = replaceOnce(
    text,
    'const METHOD_POLICIES = Object.freeze({',
    policy + 'const METHOD_POLICIES = Object.freeze({',
    'insert p254 safety policy',
  );

  text = replaceOnce(
    text,
    '  [P248_249_MISSING_LIFE_METHOD]: p248249MissingLifePolicy(),',
    '  [P248_249_MISSING_LIFE_METHOD]: p248249MissingLifePolicy(),\n  [P254_PROFESSION_METHOD]: p254ProfessionPolicy(),',
    'wire p254 safety policy',
  );

  write(path, text);
}
