/**
 * Source metadata:
 * حاوي العجائب ومظهر الغرائب
 *
 * Project: גורל החול
 * Rule: source-first extraction only.
 * No inferred logic.
 * No engine logic.
 * No client wording policy.
 */

const HAWI_METADATA = {
  id: "hawi-al-ajaib-wa-muzhir-al-gharaib",
  sourceBookArabic: "حاوي العجائب ومظهر الغرائب",
  sourceBookHebrew: "חאווי אל־עג׳איב ומט׳הר אל־ע׳ראיב",
  attributedAuthorArabic: "أحمد ابن زنبل المحلي",
  attributedAuthorHebrew: "אחמד אבן זנבל אל־מחלי",
  sourceType: "approved-uploaded-source",
  projectUse: "גורל החול — מקור לדיני בתים, צורות ושאלות",
  status: "active-source",
  extractionPolicy: {
    sourceFirst: true,
    noInferredLogic: true,
    noUnmarkedZenatiBase: true,
    preserveArabicText: true,
    preserveHebrewTranslation: true,
    preserveHouseNumbersFromSourceOnly: true,
    preserveFigureNamesFromSourceOnly: true
  },
  notes: [
    "כל כלל חייב להישמר עם לשון מקור ערבית, תרגום עברי, בתים/צורות, דין וסטטוס.",
    "אם המחבר מביא שיטה זנאטית — מסמנים quotedZenatiComparison.",
    "אם שורה לא מלאה או דורשת בדיקה חוזרת — מסמנים needsNextPass.",
    "אין להוסיף לוגיקה של המנוע בתוך קבצי מקור."
  ]
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_METADATA };
}
