/**
 * kashf-figure-attributes-gate2.js
 *
 * השער השני בכשף אל-אסראר (עמ' 96-102) — טבלאות תכונות נוספות ל-16
 * הצורות שטרם חולצו לשכבת נתונים מובנית: מעלה/מושב/גבול/פנים/שמחה/צער/מזג,
 * שיוך לחודשים, שותפות ועדות בין בתים, ושמות חלופיים.
 *
 * חשוב: קובץ זה עדיין לא מחובר לשום מנוע חי (מלבד FIGURE_DIGNITIES.maala
 * שכבר שוכפל בנפרד ל-kashf-dhamir.js::FIGURE_MAALA_HOUSE לצורך סוג 2
 * בגילוי הכוונה הנסתרת). לפני חיבור לכל שימוש חדש — לבדוק תחילה אם
 * הנתון הרלוונטי נדרש בפועל, ולקבל אישור מהמשתמש בהתאם לכלל ב-CLAUDE.md.
 *
 * מקור: كشف الأسرار المصونة في اخراج الضمائر المخزونة
 */

// ─────────────────────────────────────────────────────────────────────────
// מעלה/מושב/גבול/פנים/שמחה/צער/מזג (עמ' 97-99, "פרק במעלת הצורות,
// מושבן, מזגן ופניהן")
//
// הסבר המקור עצמו (עמ' 98) לגבי מקור כל טור: "המושב — ממעגל המושבות;
// המעלה — ממעגל נציר א-דין; הגבול — ממעגל המספר; הפנים — ממעגל אבג"ד;
// ואילו השמחה, הצער והמזג — איני יודע מאילו מעגלים נלקחו" (המחבר עצמו
// מודה שאינו יודע את מקור 3 הטורים האחרונים).
//
// ממון נכנס (2121) וסוהר (1221) אינם מוזכרים כלל בטבלת המקור המודפסת
// בעמ׳ 97-99 — לא הומצא עבורם ערך. חיבור ודרך כן מופיעים במקור.
// ערכי null מציינים נתון שלא נמסר במפורש באותה שורה; אין להשלים מסימטריה.
// ─────────────────────────────────────────────────────────────────────────

export const FIGURE_DIGNITIES_METADATA = {
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v57',
    sourceLayer: 'author_main_text',
    authorityType: 'primary',
    traditionId: 'dignity-table-main',
    authorResponse: 'reported_neutrally',
    defaultEligible: true,
    conflictGroupId: null,
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'high',
    ambiguity: false,
    visualDependency: 'none',
  },

  columns: {
    maalaHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'identified_by_author',
      originDescription: 'ממעגל נציר א-דין',
    },
    moshavHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'identified_by_author',
      originDescription: 'ממעגל המושבות',
    },
    gvulHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'identified_by_author',
      originDescription: 'ממעגל המספר',
    },
    panimHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'identified_by_author',
      originDescription: 'ממעגל אבג"ד',
    },
    simchaHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'author_does_not_know',
      originDescription: null,
    },
    tzaarHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'author_does_not_know',
      originDescription: null,
    },
    mezegHouse: {
      sourceStatus: 'explicit_in_source',
      originStatus: 'author_does_not_know',
      originDescription: null,
    },
  },

  nullSemantics: {
    meaning: 'not_stated_in_source',
    mustNotInfer: true,
    mustNotFillFromOtherTradition: true,
    mustNotConvertToZero: true,
  },

  omittedFigures: {
    '2121': {
      nameHebrew: 'ממון נכנס',
      status: 'not_stated_in_source',
    },
    '1221': {
      nameHebrew: 'סוהר',
      status: 'not_stated_in_source',
    },
  },

  sourceRef: "כשף אל-אסראר עמ' 97-99",
};

export const FIGURE_DIGNITIES = {
  '1121': { // נלחם / الجودلة
    maalaHouse: 1, moshavHouse: 5, gvulHouse: 9, panimHouse: 11,
    simchaHouse: 5, tzaarHouse: 7, mezegHouse: null,
    note: 'צערו נאמר במקור כ"כנגדו, והוא שביעו".',
  },
  '1222': { // נשוא ראש / الأحيان
    maalaHouse: 2, moshavHouse: 1, gvulHouse: 1, panimHouse: 1,
    simchaHouse: 11, tzaarHouse: null, mezegHouse: 6,
  },
  '2111': { // סף נכנס / عتبة داخلة
    maalaHouse: 3, moshavHouse: 14, gvulHouse: 7, panimHouse: 14,
    simchaHouse: 5, tzaarHouse: null, mezegHouse: 2,
  },
  '2212': { // לבן / البياض
    maalaHouse: 4, moshavHouse: 9, gvulHouse: 4, panimHouse: 6,
    simchaHouse: 6, tzaarHouse: null, mezegHouse: null,
  },
  '1211': { // בר הלחי / نقي الخد
    maalaHouse: 5, moshavHouse: 16, gvulHouse: 9, panimHouse: 13,
    simchaHouse: null, tzaarHouse: null, mezegHouse: null,
  },
  '1112': { // סף יוצא / عتبة خارجة
    maalaHouse: 6, moshavHouse: 13, gvulHouse: 8, panimHouse: 7,
    simchaHouse: 6, tzaarHouse: null, mezegHouse: null,
  },
  '2122': { // אדום / الحمرة
    maalaHouse: 7, moshavHouse: 9, gvulHouse: 3, panimHouse: 2,
    simchaHouse: null, tzaarHouse: null, mezegHouse: null,
  },
  '2221': { // שפל ראש / الأنكيس
    maalaHouse: 8, moshavHouse: 7, gvulHouse: 2, panimHouse: 8,
    simchaHouse: 12, tzaarHouse: null, mezegHouse: 5,
  },
  '2211': { // כבוד נכנס / نصرة داخلة
    maalaHouse: 9, moshavHouse: 10, gvulHouse: 6, panimHouse: 3,
    simchaHouse: 12, tzaarHouse: null, mezegHouse: null,
  },
  '2112': { // חיבור / الإجتماع
    maalaHouse: 11, moshavHouse: 15, gvulHouse: 15, panimHouse: 6,
    simchaHouse: 15, tzaarHouse: null, mezegHouse: 3,
  },
  '1122': { // כבוד יוצא / نصرة خارجة
    maalaHouse: 12, moshavHouse: 11, gvulHouse: 5, panimHouse: 12,
    simchaHouse: null, tzaarHouse: null, mezegHouse: 6,
  },
  '1111': { // דרך / الطريق
    maalaHouse: 13, moshavHouse: 13, gvulHouse: 16, panimHouse: 15,
    simchaHouse: 13, tzaarHouse: null, mezegHouse: 5,
    note: 'המקור מוסיף גם: בורג׳ 7.',
  },
  '1212': { // ממון יוצא / قبض خارج
    maalaHouse: 14, moshavHouse: 3, gvulHouse: 12, panimHouse: 5,
    simchaHouse: 10, tzaarHouse: null, mezegHouse: 3,
    note: 'צערה נאמר במקור כ"כנגדו" בלבד; אין להמיר זאת לבית מספרי בלי כלל מקור נפרד.',
  },
  '2222': { // קהלה / جماعة
    maalaHouse: 16, moshavHouse: 2, gvulHouse: 11, panimHouse: 10,
    simchaHouse: 10, tzaarHouse: null, mezegHouse: 9,
  },
  // '2121' (ממון נכנס) ו-'1221' (סוהר) אינן מופיעות כלל בטבלת המקור המודפסת עמ׳ 97-99.
};

// ─────────────────────────────────────────────────────────────────────────
// פרק נוסף בשמחת/צער הצורות (עמ' 100) — מסורת משלימה, נפרדת מטבלת
// המעלות בעמ' 97-99. המקור המודפס נשמר כאן כנתון משלים בלבד:
// שבתאי→11 דרך שמחת צדק; מאדים→16; שמש→9; נוגה→5; כוכב חמה→1;
// ירח→3. ראש התלי "נמשך אחר צדק" וזנב התלי "נמשך אחר שבתאי" —
// יחסי follow בלבד, בלי להמיר אותם אוטומטית לבית מספרי.
// הנוסח המודפס לגבי שש הצורות הראשונות מערב "צערן" עם "שמחתן
// באחד-עשר"; הוא נשמר כעמימות מקור ולא מנורמל.
// קהלה וחיבור — צערן ב-7 וב-14; לבן ודרך — צערן ב-1.
// ממון יוצא וסף יוצא מופיעים יחד בסיום בהסתייגות "אולי נספחים
// לשבתאי ולמאדים"; אין לחלק אותם אחד-לאחד בין שני הכוכבים.
// ─────────────────────────────────────────────────────────────────────────
export const FIGURE_JOY_GRIEF_SUPPLEMENTARY_NOTE = {
  sourceStatus: 'explicit-in-source',
  sourceRef: "כשף אל-אסראר עמ' 100",
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v57',
    sourceLayer: 'author_alternative_view',
    authorityType: 'primary_supplementary',
    traditionId: 'joy-grief-supplementary',
    authorResponse: 'reported_neutrally',
    defaultEligible: false,
    conflictGroupId: 'joy-grief-source-traditions',
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'mixed',
    ambiguity: true,
    visualDependency: 'printed-scan-p102',
  },

  usagePolicy: {
    maySupplementMainDignityTable: true,
    mayOverwriteMainDignityTable: false,
    mayFillNullValuesAutomatically: false,
    requiresExplicitTraditionSelection: true,
    ambiguousGroupMustRemainUnresolved: true,
    followsRelationMustNotBeConvertedToHouse: true,
    tentativePlanetAttachmentMustRemainTentative: true,
    tentativePlanetAttachmentMustNotBeSplitOneToOne: true,
  },

  planetJoyByHouse: {
    'שבתאי (דרך שמחת צדק)': 11,
    'מאדים': 16,
    'שמש': 9,
    'נוגה': 5,
    'כוכב חמה': 1,
    'ירח': 3,
  },

  nodeJoyFollows: {
    'ראש התלי': {
      follows: 'צדק',
      raw: 'فرح شكل الرأس تابع المشتري',
    },
    'זנב התלי': {
      follows: 'שבתאי',
      raw: 'فرح شكل الذنب تابع لزحل',
    },
  },

  // נוסח המקור: "ترح الأشكال ... فرحها بالحادي عشر".
  // אין להפוך אותו בשקט ל"צערן בבית 11" ואין למחוק את "שמחתן".
  ambiguousFigureGroup: {
    figures: ['2221', '1221', '2122', '1211', '1121', '2211'],
    raw: 'ترح الأشكال أنكيس وعقله وحمرة ونقي الخد وجودله ونصرة داخلة فرحها بالحادي عشر',
    statedJoyHouse: 11,
    interpretationStatus: 'source-wording-ambiguous',
  },

  griefByFigure: {
    '2222': [7, 14],  // קהלה — ترحها بالسابع وبالرابع عشر
    '2112': [7, 14],  // חיבור — ترحها بالسابع وبالرابع عشر
    '2212': [1],      // לבן — ترحها بالأول
    '1111': [1],      // דרך — ترحها بالأول
  },

  tentativePlanetAttachments: {
    figures: ['1212', '1112'], // ממון יוצא, סף יוצא
    planets: ['שבתאי', 'מאדים'],
    raw: 'قبض خارج وعتبة خارج لعله ملحوقات بزحل والمريخ',
    certainty: 'tentative-in-source',
    assignment: 'collective-unspecified',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// שיוך הצורות לחודשים (עמ' 99-100, "פרק בשיוך הצורות לחודשים")
// חודשי הלוח ההיג'רי. חלק מהחודשים משויכים ליותר מצורה אחת, וחלק
// מהצורות (לבן, בר הלחי, סף נכנס) אינן משויכות לחודש כלל במקור, וחודש
// אחד (מוחרם) אינו מוזכר כלל — כפי שהוא במקור, ללא השלמה.
// ─────────────────────────────────────────────────────────────────────────
export const FIGURE_MONTHS = {
  sourceStatus: 'explicit-in-source',
  sourceRef: "כשף אל-אסראר עמ' 99-100",
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v56',
    sourceLayer: 'author_main_text',
    authorityType: 'primary',
    traditionId: 'figure-month-associations',
    authorResponse: 'reported_neutrally',
    defaultEligible: true,
    conflictGroupId: null,
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'high',
    ambiguity: false,
    visualDependency: 'none',
  },

  completenessPolicy: {
    sourceIsPartial: true,
    missingMonthMeaning: 'not_stated_in_source',
    unassignedFigureMeaning: 'not_stated_in_source',
    mustNotInferMissingAssignments: true,
    mustNotDistributeFiguresAcrossMonths: true,
    mustNotFillFromOtherTradition: true,
  },

  byMonth: {
    'רמדאן':          ['1222'],         // נשוא ראש
    "ג'ומאדא הראשונה": ['2121', '1112'], // ממון נכנס, סף יוצא
    "ג'ומאדא האחרונה":  ['1212'],         // ממון יוצא
    'שוואל':          ['2222'],         // קהלה
    'רביע הראשון':     ['1121'],         // נלחם
    'רביע האחרון':     ['1121'],         // נלחם
    'שעבאן':          ['1221', '2221'], // סוהר, שפל ראש
    'רג׳ב':           ['2122'],         // אדום
    'צפר':            ['1122'],         // כבוד יוצא
    "זו אל-קעדה":      ['2211'],         // כבוד נכנס
    "זו אל-חג'ה":      ['2112', '1111'], // חיבור, דרך
    // 'מוחרם' אינו מוזכר במקור.
  },
  // צורות שאינן משויכות לחודש כלל בפרק הזה במקור:
  unassignedFigures: ['2212', '1211', '2111'], // לבן, בר הלחי, סף נכנס
};

// ─────────────────────────────────────────────────────────────────────────
// שותפות ועדות בין בתים (עמ' 100, "פרק בשותף ובעדות") — יחסים
// מבניים בין בתים (לא תלויי-צורה), שונה מ"עדי מגושמת"/witness-testimony
// שכבר קיים במנוע — לבדוק חפיפה לפני חיבור.
// ─────────────────────────────────────────────────────────────────────────
export const HOUSE_PARTNERS = {
  sourceStatus: 'explicit-in-source',
  sourceRef: "כשף אל-אסראר עמ' 100",
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v56',
    sourceLayer: 'author_main_text',
    authorityType: 'primary',
    traditionId: 'house-partnership-relations',
    authorResponse: 'reported_neutrally',
    defaultEligible: true,
    conflictGroupId: null,
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'high',
    ambiguity: false,
    visualDependency: 'none',
  },

  usagePolicy: {
    relationType: 'structural_house_partnership',
    mustNotTreatAsFigureRelation: true,
    mustNotTreatAsHawiWitnessRule: true,
    mustNotInferReverseRelation: true,
    mustNotExpandBeyondSource: true,
  },

  // "הצורה השלושה-עשר היא שותפו של הבית הראשון..." וכו'
  13: 1,
  14: 7,
  15: 10,
  16: 4,
};

export const HOUSE_TESTIMONY = {
  sourceStatus: 'explicit-in-source',
  sourceRef: "כשף אל-אסראר עמ' 100",
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v56',
    sourceLayer: 'author_main_text',
    authorityType: 'primary',
    traditionId: 'house-testimony-relations',
    authorResponse: 'reported_neutrally',
    defaultEligible: true,
    conflictGroupId: null,
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'high',
    ambiguity: false,
    visualDependency: 'none',
  },

  usagePolicy: {
    relationType: 'structural_house_testimony',
    mustNotTreatAsFigureRelation: true,
    mustNotTreatAsHawiWitnessRule: true,
    mustNotInferReverseRelation: true,
    mustNotExpandBeyondSource: true,
  },

  // "הצורה התשיעית מעידה על הראשון, על החמישי ועל השביעי..." וכו'
  9:  [1, 5, 7],
  14: [2, 6, 10],
  15: [3, 6, 7, 11],
  16: [4, 8, 12],
};

// ─────────────────────────────────────────────────────────────────────────
// שמות חלופיים לצורות (עמ' 101-102, "פרק בשמות הצורות")
// שם בית 16 (בר הלחי) אינו מבורר במקור עצמו: "נקראת גם בשם שלא
// נתברר במקור" — לא הומצא שם חלופי.
// ─────────────────────────────────────────────────────────────────────────
export const FIGURE_ALTERNATE_NAMES = {
  sourceStatus: 'explicit-in-source',
  sourceRef: "כשף אל-אסראר עמ' 101-102",
  provenance: {
    workId: 'kashf-al-asrar',
    editionId: 'kashf-hebrew-v56',
    sourceLayer: 'author_main_text',
    authorityType: 'primary',
    traditionId: 'figure-source-aliases',
    authorResponse: 'reported_neutrally',
    defaultEligible: false,
    conflictGroupId: null,
    editorialOrigin: null,
  },

  certainty: {
    status: 'explicit_in_source',
    confidence: 'high',
    ambiguity: true,
    visualDependency: 'none',
  },

  usagePolicy: {
    role: 'source_documentation_only',
    canonicalNamesOnlyForDisplay: true,
    mayAppearInClientOutput: false,
    mayAppearInSystemGeneratedText: false,
    mayReplaceCanonicalName: false,
    mayBeUsedAsAutomaticSynonym: false,
    mayBeUsedAsAutomaticSearchKey: false,
    mayBeUsedForRuleMatchingAutomatically: false,
    requiresManualSourceReviewForUse: true,
    mustPreserveOriginalSpelling: true,
    mustNotTranslateAutomatically: true,
    mustNotNormalizeAutomatically: true,
  },

  canonicalDisplayNames: {
    '1222': 'נשוא ראש',
    '2121': 'ממון נכנס',
    '1212': 'ממון יוצא',
    '2222': 'קהלה',
    '1121': 'נלחם',
    '1221': 'סוהר',
    '2221': 'שפל ראש',
    '2122': 'אדום',
    '2212': 'לבן',
    '1122': 'כבוד יוצא',
    '2211': 'כבוד נכנס',
    '1112': 'סף יוצא',
    '1111': 'דרך',
    '2111': 'סף נכנס',
    '2112': 'חיבור',
    '1211': 'בר הלחי',
  },

  completenessPolicy: {
    sourceAliasSetIsPartial: true,
    omittedFigurePattern: '1211',
    omittedFigureCanonicalName: 'בר הלחי',
    omittedAliasStatus: 'unresolved_in_source',
    mustNotInferMissingAlias: true,
    mustNotInventMissingAlias: true,
  },

  '1222': ['הצוחקת', 'איש גדול-ההימה'],       // נשוא ראש
  '2121': ['אכמוס'],                          // ממון נכנס
  '1212': ["אל-מע"],                          // ממון יוצא
  '2222': ['סתומת-הכול', "אִזאר", 'הקיבוץ', 'השלום'], // קהלה
  '1121': ["אל-כוסג'", 'הפתח', 'האדמוני', 'הבשורה'],  // נלחם
  '1221': ["א-ת'קאפ"],                        // סוהר
  '2221': ['המהופכת', 'האיש שפל-הייחוס'],     // שפל ראש
  '2122': ['הדם', 'מטרוש'],                   // אדום
  '2212': ['הני'],                            // לבן
  '1122': ["אג'ליד"],                         // כבוד יוצא
  '2211': ['תשמיר', 'אבו אל-עאקבה'],          // כבוד נכנס
  '1112': ['רכרזה', 'דגל השמחה'],             // סף יוצא
  '1111': ['זכירה נכנסת', 'אש שנשלפה'],       // דרך
  '2111': ['הנרתעת', 'באלי'],                 // סף נכנס
  '2112': ["אוזאע"],                          // חיבור
  // '1211' (בר הלחי) — "נקראת גם בשם שלא נתברר במקור"; לא הומצא שם.
};
