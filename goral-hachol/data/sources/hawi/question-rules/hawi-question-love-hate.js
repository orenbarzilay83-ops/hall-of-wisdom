/**
 * Source-exact extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * باب في المحبة والبغضة
 *
 * Purpose:
 * דיני שאלת אהבה ושנאה לפי לשון המקור.
 *
 * Rules:
 * - Source first only.
 * - No inferred engine logic.
 * - No added interpretation beyond the source.
 * - Later we may add displayHebrew for app-friendly wording.
 */

export const HAWI_QUESTION_LOVE_HATE = {
  id: "hawi-question-love-hate",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "باب في المحبة والبغضة",
  sourceSectionHebrew: "שער אהבה ושנאה",
  extractionStatus: "sourceExact-complete",
  rules: [
    {
      id: "love-hate-check-houses-1-5-11",
      order: 1,
      arabicText: [
        "اذا سئلت عن اثنين هل بينهما محبة او بغضة",
        "او احدهما يحب والاخر مبغض",
        "فانظر الى الشكل الاول والخامس والحادي عشر"
      ],
      hebrewTranslation: [
        "אם נשאלת על שניים — האם יש ביניהם אהבה או שנאה, או שאחד מהם אוהב והאחר שונא — הסתכל אל הצורה הראשונה, החמישית והאחת־עשרה."
      ],
      houses: [1, 5, 11],
      figures: [],
      technicalTerms: [
        "محبة",
        "بغضة",
        "الشكل الاول",
        "الخامس",
        "الحادي عشر"
      ],
      rule: "בשאלת אהבה ושנאה בודקים את בית 1, בית 5 ובית 11.",
      status: "sourceExact"
    },

    {
      id: "love-hate-good-figures-water-elements-mutual-love",
      order: 2,
      arabicText: [
        "فان رايت فيهم اشكال سعيدة",
        "وفتحت فيهم عناصر المياه",
        "فاعلم انهم متحابان في بعضهما بعض"
      ],
      hebrewTranslation: [
        "אם ראית בהם צורות טובות, ונפתחו בהם יסודות המים — דע שהם אוהבים זה את זה."
      ],
      houses: [1, 5, 11],
      figures: [],
      technicalTerms: [
        "اشكال سعيدة",
        "عناصر المياه",
        "متحابان"
      ],
      rule: "צורות טובות בבתים 1,5,11 ופתיחת יסודות המים — אהבה הדדית.",
      status: "sourceExact"
    },

    {
      id: "love-hate-mizan-good-strengthens-love",
      order: 3,
      arabicText: [
        "ولاسيما ان كان في الميزان شكل سعيدا",
        "اوله فنسبة بالشكل الاول"
      ],
      hebrewTranslation: [
        "ובפרט אם במאזן יש צורה טובה, או שיש לו יחס אל הצורה הראשונה."
      ],
      houses: [15, 1],
      figures: [],
      technicalTerms: [
        "الميزان",
        "شكل سعيدا",
        "الشكل الاول"
      ],
      rule: "אם בבית 15 / המאזן יש צורה טובה, או יחס לצורה הראשונה — הדבר מחזק את סימן האהבה.",
      status: "sourceExact"
    },

    {
      id: "love-hate-house1-connects-house11",
      order: 4,
      arabicText: [
        "وخاصة ان شهد لها اتصال",
        "اعني ان يتصل الشكل الاول بالحادي عشر"
      ],
      hebrewTranslation: [
        "ובמיוחד אם יש לה עדות של התחברות — כלומר שהצורה הראשונה מתחברת לבית האחד־עשר."
      ],
      houses: [1, 11],
      figures: [],
      technicalTerms: [
        "اتصال",
        "الشكل الاول",
        "الحادي عشر"
      ],
      rule: "התחברות הצורה הראשונה לבית 11 — סימן טוב לחיבה, חברות ואהבה.",
      status: "sourceExact"
    },

    {
      id: "love-hate-house11-connects-house9",
      order: 5,
      arabicText: [
        "او اتصل الشكل الحادي عشر بالتاسع",
        "فكل هذه دلائل حسنة ودوام صحبة ومحبة"
      ],
      hebrewTranslation: [
        "או אם הצורה האחת־עשרה התחברה לתשיעית — כל אלה סימנים טובים, ומורים על קיום/המשכיות חברות ואהבה."
      ],
      houses: [11, 9],
      figures: [],
      technicalTerms: [
        "الحادي عشر",
        "التاسع",
        "دلائل حسنة",
        "دوام صحبة ومحبة"
      ],
      rule: "התחברות בית 11 לבית 9 — סימנים טובים והמשכיות חברות ואהבה.",
      status: "sourceExact"
    },

    {
      id: "love-hate-figure-in-house1-loved-by-asked-person",
      order: 6,
      arabicText: [
        "ثم انظر ان كان في البيت الاول",
        "فان المسؤول عنه شديد المحبة للسائل"
      ],
      hebrewTranslation: [
        "אחר כך הסתכל: אם הוא נמצא בבית הראשון — הנשאל עליו אוהב מאוד את השואל."
      ],
      houses: [1],
      figures: [],
      technicalTerms: [
        "البيت الاول",
        "المسؤول عنه",
        "شديد المحبة للسائل"
      ],
      rule: "אם הסימן הנבדק נמצא בבית 1 — הנשאל עליו אוהב מאוד את השואל.",
      status: "sourceExact"
    },

    {
      id: "love-hate-aqla-hated",
      order: 7,
      arabicText: [
        "وان خرجت العقلة",
        "كان مبغوضا عنده"
      ],
      hebrewTranslation: [
        "ואם יצאה עקלה — הוא שנוא אצלו."
      ],
      houses: [],
      figures: [
        "العقلة"
      ],
      technicalTerms: [
        "العقلة",
        "مبغوضا"
      ],
      rule: "יציאת עקלה בדין זה מורה שהאדם שנוא אצל הצד השני.",
      status: "sourceExact"
    },

    {
      id: "love-hate-nakis-love-for-another-flattery",
      order: 8,
      arabicText: [
        "وان خرج المنكوس",
        "كانت مودة لغيره وهو يمالقه"
      ],
      hebrewTranslation: [
        "ואם יצא המהופך / אנקיס — האהבה היא לאחר, והוא מחניף לו / מעמיד פנים אליו."
      ],
      houses: [],
      figures: [
        "المنكوس",
        "النكيس"
      ],
      technicalTerms: [
        "مودة لغيره",
        "يمالقه"
      ],
      rule: "יציאת אנקיס / המהופך מורה שהאהבה היא לאחר, וכלפי השואל יש חנופה או העמדת פנים.",
      status: "sourceExact"
    },

    {
      id: "love-hate-qabd-dakhil-kharij-love-with-withholding",
      order: 9,
      arabicText: [
        "وان خرج في اول الضرب احد هذين الشكلين",
        "وهما القبض الخارج والقبض الداخل",
        "فانه يحبه ويمتنع عنه"
      ],
      hebrewTranslation: [
        "ואם בתחילת ההכאה יצאה אחת משתי הצורות האלה — ממון יוצא או ממון נכנס — הרי שהוא אוהב אותו ונמנע ממנו."
      ],
      houses: [],
      figures: [
        "القبض الخارج",
        "القبض الداخل"
      ],
      technicalTerms: [
        "اول الضرب",
        "يحبه",
        "يمتنع عنه"
      ],
      rule: "ממון יוצא או ממון נכנס בתחילת ההכאה — יש אהבה, אבל יש גם מניעה או הימנעות.",
      status: "sourceExact"
    }
  ],
  summary: {
    mainHouses: [1, 5, 11],
    supportingHouses: [15, 9],
    mainFiguresMentioned: [
      "العقلة",
      "المنكوس",
      "النكيس",
      "القبض الخارج",
      "القبض الداخل"
    ],
    mainTechnicalLayers: [
      "اشكال سعيدة",
      "عناصر المياه",
      "اتصال",
      "الميزان"
    ],
    status: "complete"
  }
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_QUESTION_LOVE_HATE };
}
