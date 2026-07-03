/**
 * Source-exact extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * هل يتم هذا الأمر وتنقضي الحاجة
 *
 * Purpose:
 * דיני שאלת השלמת עניין, מילוי צורך ובקשה לפי לשון המקור.
 *
 * Rules:
 * - Source first only.
 * - No inferred engine logic.
 * - No added interpretation beyond the source.
 * - Later we may add displayHebrew for app-friendly wording.
 */

export const HAWI_QUESTION_COMPLETION = {
  id: "hawi-question-completion",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "هل يتم هذا الأمر وتنقضي الحاجة",
  sourceSectionHebrew: "שער האם הדבר יושלם והצורך יתמלא",
  extractionStatus: "sourceExact-complete",
  rules: [
    {
      id: "completion-opening-important-matter-need",
      order: 1,
      arabicText: [
        "إذا سألت عن أمر مهم يتم أم لا",
        "أو حاجة تنقضي أم لا",
        "وما تؤول إليه"
      ],
      hebrewTranslation: [
        "אם שאלת על עניין חשוב — האם הוא יושלם או לא; או על צורך/בקשה — האם יתמלא או לא; ומה יהיה סופו."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "أمر مهم",
        "يتم أم لا",
        "حاجة",
        "تنقضي أم لا",
        "ما تؤول إليه"
      ],
      rule: "השער עוסק בשאלה האם עניין חשוב יושלם, האם צורך יתמלא, ומה תהיה אחריתו.",
      status: "sourceExact"
    },

    {
      id: "completion-main-houses-1-5-9-11-15",
      order: 2,
      arabicText: [
        "فانظر إلى الشكل الأول والخامس والتاسع والحادي عشر والخامس عشر"
      ],
      hebrewTranslation: [
        "הסתכל אל הצורה הראשונה, החמישית, התשיעית, האחת־עשרה והחמש־עשרה."
      ],
      houses: [1, 5, 9, 11, 15],
      figures: [],
      technicalTerms: [
        "الشكل الأول",
        "الخامس",
        "التاسع",
        "الحادي عشر",
        "الخامس عشر"
      ],
      rule: "בשאלת השלמת עניין ומילוי צורך, הבתים המרכזיים הם 1,5,9,11,15.",
      status: "sourceExact"
    },

    {
      id: "completion-good-incoming-figures-success",
      order: 3,
      arabicText: [
        "فإن وجدت فيهم أشكال سعيدة داخلة",
        "دل على قضائك الحاجة ونجاحها"
      ],
      hebrewTranslation: [
        "אם מצאת בהם צורות טובות ונכנסות — הדבר מורה על מילוי הצורך והצלחתו."
      ],
      houses: [1, 5, 9, 11, 15],
      figures: [],
      technicalTerms: [
        "أشكال سعيدة",
        "داخلة",
        "قضاء الحاجة",
        "نجاحها"
      ],
      rule: "צורות טובות ונכנסות בבתים 1,5,9,11,15 — מילוי צורך והצלחה.",
      status: "sourceExact"
    },

    {
      id: "completion-good-testimony-to-good-best",
      order: 4,
      arabicText: [
        "ولا سيما إن شهدت السعود إلى السعود",
        "فهو أحسن ما"
      ],
      hebrewTranslation: [
        "ובמיוחד אם המיטיבים מעידים אל המיטיבים — זה הטוב ביותר."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "شهدت السعود إلى السعود",
        "أحسن"
      ],
      rule: "עדות מיטיבים למיטיבים היא החיזוק הטוב ביותר למילוי הצורך.",
      status: "sourceExact"
    },

    {
      id: "completion-repetition-4-7-10-after-hardship",
      order: 5,
      arabicText: [
        "وان كان الاتصال على تكرار في الرابع والسابع او العاشر",
        "فيتم بعد تعب مشقة"
      ],
      hebrewTranslation: [
        "ואם החיבור הוא על ידי חזרה בבית הרביעי, השביעי או העשירי — הדבר יושלם אחרי עמל וקושי."
      ],
      houses: [4, 7, 10],
      figures: [],
      technicalTerms: [
        "الاتصال",
        "تكرار",
        "الرابع",
        "السابع",
        "العاشر",
        "يتم",
        "تعب",
        "مشقة"
      ],
      rule: "חיבור/חזרה בבית 4,7 או 10 — הדבר יושלם, אך אחרי עמל וקושי.",
      status: "sourceExact"
    },

    {
      id: "completion-good-incoming-in-malefic-houses-after-despair",
      order: 6,
      arabicText: [
        "وان انتشا في البيوت النحيسة مثل الثاني والثالث والسادس والثامن والرابع عشر",
        "اشكل سعيدة دواخل",
        "فينقضي بعد ان ينقطع اياسة من شدة الجهد والتعب والعناء",
        "والرواح والرجوع بغير طائل حتى تنقضي بعد ذلك"
      ],
      hebrewTranslation: [
        "ואם נולדו/התפתחו בבתים המזיקיים — כמו השני, השלישי, השישי, השמיני והארבעה־עשר — צורות טובות ונכנסות, אז הצורך יתמלא אחרי שכמעט תיפסק תקוותו.",
        "מרוב מאמץ, עייפות, טרחה, הליכה וחזרה בלי תועלת — עד שיתמלא לאחר מכן."
      ],
      houses: [2, 3, 6, 8, 14],
      figures: [],
      technicalTerms: [
        "البيوت النحيسة",
        "الثاني",
        "الثالث",
        "السادس",
        "الثامن",
        "الرابع عشر",
        "اشكل سعيدة",
        "دواخل",
        "ينقطع اياسة",
        "الجهد",
        "التعب",
        "العناء",
        "الرواح والرجوع",
        "بغير طائل"
      ],
      rule: "צורות טובות ונכנסות הנולדות בבתי מזיק 2,3,6,8,14 — הצורך יתמלא, אבל אחרי ייאוש כמעט מוחלט, עמל, עייפות, טרחה, הלוך וחזור בלי תועלת.",
      status: "sourceExact"
    },

    {
      id: "completion-outgoing-malefic-in-bad-places-failure",
      order: 7,
      arabicText: [
        "وان كان ضد ما ذكرنا اشكال خوارجا نحيسة",
        "كالقبض الخارج والعتبة الخارجة والطريق",
        "وتكررت في اماكن ردية مثل السادس والثامن والثالث والثاني عشر"
      ],
      hebrewTranslation: [
        "ואם היה להפך ממה שהזכרנו: צורות יוצאות ומזיקיות, כמו קבץ ח׳ארג׳, עתבה ח׳ארג׳ה, והדרך, והן חזרו במקומות רעים כמו השישי, השמיני, השלישי והשנים־עשר."
      ],
      houses: [6, 8, 3, 12],
      figures: [
        "القبض الخارج",
        "العتبة الخارجة",
        "الطريق"
      ],
      technicalTerms: [
        "اشكال خوارجا نحيسة",
        "القبض الخارج",
        "العتبة الخارجة",
        "الطريق",
        "تكررت",
        "اماكن ردية",
        "السادس",
        "الثامن",
        "الثالث",
        "الثاني عشر"
      ],
      rule: "צורות יוצאות ומזיקיות כגון קבץ ח׳ארג׳, עתבה ח׳ארג׳ה והדרך, החוזרות במקומות רעים 6,8,3,12 — סימן הפוך מהצלחה, קושי חמור/ביטול/אי־השלמה.",
      status: "sourceExact"
    },

    {
      id: "completion-house3-house9-best-falling-houses",
      order: 8,
      arabicText: [
        "ولكن اخفها واحسنها الثالث والتاسع",
        "لان الثالث يفرح فيه القمر",
        "والتاسع تفرح فيه الشمس",
        "فصارا هما احسن البيوت السواقط"
      ],
      hebrewTranslation: [
        "אבל הקלים והטובים שבהם הם השלישי והתשיעי, מפני שבשלישי הירח שמח, ובתשיעי השמש שמחה.",
        "ולכן הם נעשו הטובים שבבתים הנופלים."
      ],
      houses: [3, 9],
      figures: [],
      technicalTerms: [
        "الثالث",
        "التاسع",
        "يفرح فيه القمر",
        "تفرح فيه الشمس",
        "احسن البيوت السواقط"
      ],
      rule: "בית 3 ובית 9 הם הקלים והטובים יותר מבין הבתים הנופלים, מפני שבית 3 הוא שמחת הירח ובית 9 שמחת השמש.",
      status: "sourceExact"
    }
  ],
  summary: {
    mainHouses: [1, 5, 9, 11, 15],
    completionAfterHardshipHouses: [4, 7, 10],
    completionAfterDespairHouses: [2, 3, 6, 8, 14],
    negativeHousesWithOutgoingMalefics: [6, 8, 3, 12],
    bestFallingHouses: [3, 9],
    negativeFiguresMentioned: [
      "القبض الخارج",
      "العتبة الخارجة",
      "الطريق"
    ],
    mainTechnicalLayers: [
      "أشكال سعيدة",
      "داخلة",
      "سعود",
      "تكرار",
      "انتشاء",
      "خوارج",
      "نحيسة"
    ],
    status: "complete"
  }
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_QUESTION_COMPLETION };
}
