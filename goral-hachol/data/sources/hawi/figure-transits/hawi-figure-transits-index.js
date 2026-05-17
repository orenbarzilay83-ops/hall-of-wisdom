/**
 * Source-exact extraction index:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * ترحيل الأشكال الستة عشر في الستة عشر بيتا
 *
 * Purpose:
 * אינדקס לחילוץ הצבת 16 הצורות ב־16 הבתים.
 *
 * Rules:
 * - Source first only.
 * - Each figure gets its own file.
 * - No inferred engine logic.
 * - Later we may add displayHebrew for app-friendly wording.
 */

const HAWI_FIGURE_TRANSITS_INDEX = {
  id: "hawi-figure-transits-index",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "ترحيل الأشكال الستة عشر في الستة عشر بيتا",
  sourceSectionHebrew: "הצבת שש־עשרה הצורות בשישה־עשר הבתים",
  extractionStatus: "building",
  figures: [
    {
      id: "nusra-kharija",
      arabicName: "النصرة الخارجة",
      hebrewName: "נצרה ח׳ארג׳ה",
      file: "./hawi-figure-nusra-kharija.js",
      extractionStatus: "next"
    },
    {
      id: "nusra-dakhila",
      arabicName: "النصرة الداخلة",
      hebrewName: "נצרה דאחלה",
      file: "./hawi-figure-nusra-dakhila.js",
      extractionStatus: "not-started"
    },
    {
      id: "qabd-dakhil",
      arabicName: "القبض الداخل",
      hebrewName: "קבץ דאחל",
      file: "./hawi-figure-qabd-dakhil.js",
      extractionStatus: "not-started"
    },
    {
      id: "qabd-kharij",
      arabicName: "القبض الخارج",
      hebrewName: "קבץ ח׳ארג׳",
      file: "./hawi-figure-qabd-kharij.js",
      extractionStatus: "not-started"
    },
    {
      id: "tariq",
      arabicName: "الطريق",
      hebrewName: "הדרך",
      file: "./hawi-figure-tariq.js",
      extractionStatus: "not-started"
    },
    {
      id: "jamaa",
      arabicName: "الجماعة",
      hebrewName: "ג׳מאעה",
      file: "./hawi-figure-jamaa.js",
      extractionStatus: "not-started"
    },
    {
      id: "ijtima",
      arabicName: "الاجتماع",
      hebrewName: "אג׳תמאע",
      file: "./hawi-figure-ijtima.js",
      extractionStatus: "not-started"
    },
    {
      id: "aqla",
      arabicName: "العقلة",
      hebrewName: "עקלה",
      file: "./hawi-figure-aqla.js",
      extractionStatus: "not-started"
    },
    {
      id: "hayyan",
      arabicName: "الحيان",
      hebrewName: "חיאן",
      file: "./hawi-figure-hayyan.js",
      extractionStatus: "not-started"
    },
    {
      id: "nakis",
      arabicName: "النكيس / المنكوس",
      hebrewName: "אנקיס / המהופך",
      file: "./hawi-figure-nakis.js",
      extractionStatus: "not-started"
    },
    {
      id: "naqi-khad",
      arabicName: "نقي الخد",
      hebrewName: "נקי אל־חד",
      file: "./hawi-figure-naqi-khad.js",
      extractionStatus: "not-started"
    },
    {
      id: "judla",
      arabicName: "الجودلة",
      hebrewName: "ג׳ודלה",
      file: "./hawi-figure-judla.js",
      extractionStatus: "not-started"
    },
    {
      id: "humra",
      arabicName: "الحمرة",
      hebrewName: "חומרה",
      file: "./hawi-figure-humra.js",
      extractionStatus: "not-started"
    },
    {
      id: "bayad",
      arabicName: "البياض",
      hebrewName: "ביאד",
      file: "./hawi-figure-bayad.js",
      extractionStatus: "not-started"
    },
    {
      id: "ataba-dakhila",
      arabicName: "العتبة الداخلة",
      hebrewName: "עתבה דאחלה",
      file: "./hawi-figure-ataba-dakhila.js",
      extractionStatus: "not-started"
    },
    {
      id: "ataba-kharija",
      arabicName: "العتبة الخارجة",
      hebrewName: "עתבה ח׳ארג׳ה",
      file: "./hawi-figure-ataba-kharija.js",
      extractionStatus: "not-started"
    }
  ],
  notes: [
    "כל צורה תישמר בקובץ נפרד.",
    "כל קובץ יכלול 16 מיקומים לפי בתים, אם המקור נותן אותם.",
    "אם מקור חסר או חתוך — מסמנים needsNextPass ולא משלימים מהראש.",
    "שמות הצורות נשמרים לפי המונחים הערביים מתוך הספר."
  ]
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_FIGURE_TRANSITS_INDEX };
}
