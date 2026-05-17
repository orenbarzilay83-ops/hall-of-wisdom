/**
 * Source-exact extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * باب السفر / المسافر
 *
 * Purpose:
 * דיני שאלת נסיעה ונוסע לפי לשון המקור.
 *
 * Rules:
 * - Source first only.
 * - No inferred engine logic.
 * - No added interpretation beyond the source.
 * - Later we may add displayHebrew for app-friendly wording.
 */

const HAWI_QUESTION_TRAVEL = {
  id: "hawi-question-travel",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "باب السفر / المسافر",
  sourceSectionHebrew: "שער הנסיעה / הנוסע",
  extractionStatus: "sourceExact-complete",
  rules: [
    {
      id: "travel-basic-house-division",
      order: 1,
      arabicText: [
        "اجعل الطالع للمسافر",
        "والتاسع للسفر",
        "والثالث والخامس دليل على الخروج",
        "والوتاد لقوته وعزه وجاهه",
        "وما يليها لما يطرأ عليه",
        "والسادس لما يلقى من الشدائد والأمور الصعبة وموت الدواب والعبيد والغلمان",
        "والثامن موضع المنية والآفات والسموم القاتلة"
      ],
      hebrewTranslation: [
        "עשה את הטאלע / הבית הראשון לנוסע.",
        "את הבית התשיעי — לנסיעה.",
        "את הבית השלישי והחמישי — לדליל היציאה.",
        "את היתדות — לכוחו, כבודו ומעמדו.",
        "את הבתים שאחרי היתדות — למה שיקרה לו בדרך.",
        "את הבית השישי — למה שיפגוש מן הקשיים, העניינים הקשים, ומות בהמות, עבדים ונערים.",
        "ואת הבית השמיני — למקום המוות, הפגעים והרעלים הממיתים."
      ],
      houses: [1, 3, 5, 6, 8, 9],
      figures: [],
      technicalTerms: [
        "الطالع",
        "المسافر",
        "التاسع",
        "السفر",
        "الثالث",
        "الخامس",
        "الخروج",
        "الوتاد",
        "قوته",
        "عزه",
        "جاهه",
        "ما يليها",
        "الشدائد",
        "الأمور الصعبة",
        "موت الدواب",
        "العبيد",
        "الغلمان",
        "الثامن",
        "المنية",
        "الآفات",
        "السموم القاتلة"
      ],
      rule: "בשאלת נסיעה: בית 1 לנוסע, בית 9 לנסיעה, בית 3 ו־5 ליציאה, היתדות לכוח/כבוד/מעמד, הבאים אחרי היתדות למה שיקרה לו, בית 6 לקשיים, בית 8 למוות/פגעים/רעלים.",
      status: "sourceExact"
    },

    {
      id: "travel-ascendant-bad-look-to-house3-or-house9",
      order: 2,
      arabicText: [
        "إن نظر الطالع إلى الثالث أو التاسع نظرا غير محمود"
      ],
      hebrewTranslation: [
        "אם הטאלע מביט אל הבית השלישי או התשיעי במבט שאינו משובח."
      ],
      houses: [1, 3, 9],
      figures: [],
      technicalTerms: [
        "الطالع",
        "الثالث",
        "التاسع",
        "نظرا غير محمود"
      ],
      rule: "כאשר בית 1 / הטאלע מביט אל בית 3 או בית 9 במבט לא טוב — הנסיעה אינה יוצאת בנחת ויש בה כפייה או קושי.",
      status: "sourceExact"
    },

    {
      id: "travel-against-will-or-by-force",
      order: 3,
      arabicText: [
        "הנוסע נוסע שלא מרצונו",
        "או מחמת כפייה",
        "או מחמת אדם גדול ממנו / בעל כוח עליו"
      ],
      hebrewTranslation: [
        "הנוסע נוסע שלא מרצונו, או מחמת כפייה, או מחמת אדם גדול ממנו / בעל כוח עליו."
      ],
      houses: [1, 3, 9],
      figures: [],
      technicalTerms: [
        "נסיעה שלא מרצונו",
        "כפייה",
        "בעל כוח עליו"
      ],
      rule: "דין זה הוא המשך למבט הלא־טוב של הטאלע אל בית 3 או בית 9: נסיעה שלא מרצונו או מכוח מי שגדול ממנו.",
      status: "sourceExactDerivedFromExtractedLine"
    },

    {
      id: "travel-ascendant-in-house3-9-14-voluntary-travel",
      order: 4,
      arabicText: [
        "وإن كان الطالع في الثالث أو التاسع أو الرابع عشر"
      ],
      hebrewTranslation: [
        "ואם הטאלע נמצא בשלישי, או בתשיעי, או בארבעה־עשר."
      ],
      houses: [1, 3, 9, 14],
      figures: [],
      technicalTerms: [
        "الطالع",
        "الثالث",
        "التاسع",
        "الرابع عشر"
      ],
      rule: "אם הטאלע נמצא בבית 3, בית 9 או בית 14 — הנוסע מבקש את הנסיעה מעצמו וברצונו, ולא מתוך כפייה.",
      status: "sourceExact"
    },

    {
      id: "travel-angles-power-honor-status",
      order: 5,
      arabicText: [
        "والوتاد لقوته وعزه وجاهه"
      ],
      hebrewTranslation: [
        "והיתדות הן לכוחו, כבודו ומעמדו."
      ],
      houses: [1, 4, 7, 10],
      figures: [],
      technicalTerms: [
        "الوتاد",
        "قوته",
        "عزه",
        "جاهه"
      ],
      rule: "בשאלת נוסע, היתדות 1,4,7,10 מראות את כוחו, כבודו ומעמדו של הנוסע.",
      status: "sourceExact"
    },

    {
      id: "travel-following-angles-what-happens",
      order: 6,
      arabicText: [
        "وما يليها لما يطرأ عليه"
      ],
      hebrewTranslation: [
        "ומה שאחרי היתדות — למה שיקרה עליו / מה שיתרחש לו."
      ],
      houses: [2, 5, 8, 11],
      figures: [],
      technicalTerms: [
        "ما يليها",
        "يطرأ عليه"
      ],
      rule: "הבתים שאחרי היתדות — 2,5,8,11 — מראים מה שיקרה לנוסע בדרך או כתוצאה מן הנסיעה.",
      status: "sourceExact"
    },

    {
      id: "travel-house6-hardships",
      order: 7,
      arabicText: [
        "والسادس لما يلقى من الشدائد والأمور الصعبة وموت الدواب والعبيد والغلمان"
      ],
      hebrewTranslation: [
        "והשישי — למה שיפגוש מן הקשיים, העניינים הקשים, ומות בהמות, עבדים ונערים."
      ],
      houses: [6],
      figures: [],
      technicalTerms: [
        "السادس",
        "الشدائد",
        "الأمور الصعبة",
        "موت الدواب",
        "العبيد",
        "الغلمان"
      ],
      rule: "בית 6 בשאלת נסיעה מראה קשיים, עניינים קשים, ואובדן/מות בהמות, עבדים או נערים.",
      status: "sourceExact"
    },

    {
      id: "travel-house8-death-harms-poisons",
      order: 8,
      arabicText: [
        "والثامن موضع المنية والآفات والسموم القاتلة"
      ],
      hebrewTranslation: [
        "והשמיני — מקום המוות, הפגעים והרעלים הממיתים."
      ],
      houses: [8],
      figures: [],
      technicalTerms: [
        "الثامن",
        "موضع المنية",
        "الآفات",
        "السموم القاتلة"
      ],
      rule: "בית 8 בשאלת נסיעה מראה את הסכנות הקשות: מוות, פגעים ורעלים ממיתים.",
      status: "sourceExact"
    }
  ],
  summary: {
    travelerHouse: 1,
    travelHouse: 9,
    exitHouses: [3, 5],
    angleHousesForPowerHonorStatus: [1, 4, 7, 10],
    housesAfterAnglesForEvents: [2, 5, 8, 11],
    hardshipHouse: 6,
    severeDangerHouse: 8,
    voluntaryTravelHousesForAscendant: [3, 9, 14],
    status: "complete"
  }
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_QUESTION_TRAVEL };
}
