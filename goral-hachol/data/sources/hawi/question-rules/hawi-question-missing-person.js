export const HAWI_QUESTION_MISSING_PERSON = {
  id: 'hawi-question-missing-person',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب الغايب',
  sourceSectionHebrew: 'שער הגאיב / הנעדר',
  sourcePages: ['PDF document 59.pdf', 'PDF document 60.pdf'],
  extractionStatus: 'source-found-initial-extraction',
  rules: [
    {
      id: 'missing-person-opening-two-sections',
      order: 1,
      arabicText: [
        'باب الغايب',
        'وهو على فصلين',
        'الفصل الاول هل يقدم الغايب ام لا',
        'الفصل الثاني هل هو حي ام ميت'
      ],
      hebrewTranslation: [
        'שער הגאיב / הנעדר.',
        'והוא נחלק לשני פרקים:',
        'הפרק הראשון — האם הנעדר יחזור או לא.',
        'הפרק השני — האם הוא חי או מת.'
      ],
      houses: [],
      figures: [],
      technicalTerms: ['باب الغايب', 'هل يقدم الغايب', 'هل هو حي ام ميت'],
      rule:
        'שער הנעדר מתחלק לשתי שאלות יסוד: האם הנעדר יחזור, והאם הוא חי או מת.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-complete-to-sixteen',
      order: 2,
      arabicText: [
        'اذا سألت عن الغايب ومتى يقدم',
        'فاضرب الرمل على ذلك',
        'وكمله الى ستة عشر بيتا'
      ],
      hebrewTranslation: [
        'אם שאלת על נעדר ומתי יחזור — הפק את הרמל על כך, והשלם אותו עד שישה־עשר בתים.'
      ],
      houses: [16],
      figures: [],
      technicalTerms: ['الغايب', 'متى يقدم', 'كمله الى ستة عشر بيتا'],
      rule:
        'בשאלת נעדר יש להשלים את לוח הרמל עד בית 16 לפני הכרעה.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-fast-return-house16-in-7-house10-in-12',
      order: 3,
      arabicText: [
        'فان وجدت السادس عشر في السابع',
        'والعاشر في الثاني عشر',
        'فانه يأتي سريعا'
      ],
      hebrewTranslation: [
        'אם מצאת את הבית השישה־עשר בשביעי, ואת העשירי בשנים־עשר — הרי שהוא יבוא במהירות.'
      ],
      houses: [7, 10, 12, 16],
      figures: [],
      technicalTerms: ['السادس عشر في السابع', 'العاشر في الثاني عشر', 'يأتي سريعا'],
      rule:
        'בית 16 בשביעי ובית 10 בשנים־עשר — סימן שהנעדר יחזור במהירות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-false-news-travel-farther',
      order: 4,
      arabicText: [
        'اذا كان السابع في التاسع داخل',
        'وقامت الجماعة في الخامس عشر من قبضين خارجين',
        'يقدم ويسافر الى ارض ابعد منها',
        'ويشاع عنه اخبار باطلة'
      ],
      hebrewTranslation: [
        'אם השביעי נמצא בתשיעי כשהוא נכנס, והג׳מאעה עומדת בחמישה־עשר משני קבצים יוצאים — הוא חוזר, אך נוסע לארץ רחוקה יותר, ויופצו עליו ידיעות שקריות.'
      ],
      houses: [7, 9, 15],
      figures: ['الجماعة', 'القبض الخارج'],
      technicalTerms: [
        'السابع في التاسع',
        'الجماعة',
        'الخامس عشر',
        'قبضين خارجين',
        'اخبار باطلة'
      ],
      rule:
        'שביעי בתשיעי + ג׳מאעה בבית 15 משני קבצים יוצאים — הנעדר יחזור, אך ימשיך לארץ רחוקה יותר, ויופצו עליו ידיעות שקר.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-stays-where-he-is-then-returns',
      order: 5,
      arabicText: [
        'اذا كان صاحب العمل في بيته',
        'وقامت الجماعة في الخامس عشر من طريقين او من شمسين',
        'يقدم وهو مقيم بارض راغب في المقام بها'
      ],
      hebrewTranslation: [
        'אם בעל העבודה נמצא בביתו, והג׳מאעה עומדת בחמישה־עשר משתי דרכים או משתי שמשות — הוא יחזור, והוא שוהה בארץ שהוא רוצה להישאר בה.'
      ],
      houses: [15],
      figures: ['الجماعة', 'الطريق'],
      technicalTerms: ['صاحب العمل في بيته', 'الجماعة', 'الخامس عشر', 'طريقين', 'شمسين'],
      rule:
        'כאשר בעל העבודה במקומו, וג׳מאעה בבית 15 נוצרת משתי דרכים או משתי שמשות — הנעדר יחזור, אך הוא נמצא במקום שהוא מעוניין לשהות בו.',
      status: 'sourceVerified',
      sourceVerification: 'נבדק מול PDF document 60.pdf: המקור כותב במפורש "من طريقين او من شمسين".',
      mappingReview: 'המקור מאשר שתי דרכים או שתי שמשות; עדיין צריך לוודא במילון הצורות הפנימי לאיזו צורה מנורמלת מתייחס شمس/شمسين.'
    },

    {
      id: 'missing-person-qabd-kharij-house9-repeat-house16-death-abroad',
      order: 6,
      arabicText: [
        'اذا كان القبض الخارج في التاسع',
        'وتكرر في السادس عشر',
        'ربما يموت في الغربة'
      ],
      hebrewTranslation: [
        'אם קבץ ח׳ארג׳ נמצא בתשיעי, וחוזר בשישה־עשר — ייתכן שימות בגלות / בארץ זרה.'
      ],
      houses: [9, 16],
      figures: ['القبض الخارج'],
      technicalTerms: ['القبض الخارج', 'التاسع', 'السادس عشر', 'يموت في الغربة'],
      rule:
        'קבץ ח׳ארג׳ בבית 9 וחזרה בבית 16 — חשש למוות בגלות או בארץ זרה.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-qabd-kharij-house9-return-after-long-time',
      order: 7,
      arabicText: [
        'وان كان القبض الخارج في التاسع وحده',
        'ربما يعود بعد زمان طويل'
      ],
      hebrewTranslation: [
        'ואם קבץ ח׳ארג׳ נמצא בתשיעי בלבד — ייתכן שיחזור לאחר זמן רב.'
      ],
      houses: [9],
      figures: ['القبض الخارج'],
      technicalTerms: ['القبض الخارج', 'التاسع', 'يعود بعد زمان طويل'],
      rule:
        'קבץ ח׳ארג׳ בבית 9 בלבד — אפשרות לחזרה לאחר זמן ארוך.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-house8-connected-house9-on-the-way-back',
      order: 8,
      arabicText: [
        'اذا اتصل الثامن بالتاسع',
        'في الطريق قادم ناهض الى المكان الذي خرج منه'
      ],
      hebrewTranslation: [
        'אם הבית השמיני התחבר לתשיעי — הוא בדרך, בא ומתעורר לשוב אל המקום שממנו יצא.'
      ],
      houses: [8, 9],
      figures: [],
      technicalTerms: ['اتصل الثامن بالتاسع', 'في الطريق', 'قادم', 'المكان الذي خرج منه'],
      rule:
        'חיבור בית 8 לבית 9 — הנעדר בדרך חזרה אל המקום שממנו יצא.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-house2-connected-house4-wants-return-afraid',
      order: 9,
      arabicText: [
        'اذا اتصل الثاني بالرابع',
        'يريد القدوم وهو خائف في نفسه'
      ],
      hebrewTranslation: [
        'אם הבית השני התחבר לרביעי — הוא רוצה לחזור, אך יש בו פחד בנפשו.'
      ],
      houses: [2, 4],
      figures: [],
      technicalTerms: ['اتصل الثاني بالرابع', 'يريد القدوم', 'خائف في نفسه'],
      rule:
        'חיבור בית 2 לבית 4 — הנעדר רוצה לחזור, אבל הוא מפחד מבפנים.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-house7-connected-house16-or-12-prisoned-or-sick',
      order: 10,
      arabicText: [
        'اذا اتصل السابع بالسادس عشر',
        'مسجون او مريض في البلد الذي سافر فيها',
        'وكذلك اتصال السابع بالثاني عشر'
      ],
      hebrewTranslation: [
        'אם הבית השביעי התחבר לשישה־עשר — הוא אסור/כלוא או חולה בארץ שאליה נסע.',
        'וכן הדין אם השביעי התחבר לשנים־עשר.'
      ],
      houses: [7, 12, 16],
      figures: [],
      technicalTerms: ['اتصل السابع بالسادس عشر', 'مسجون', 'مريض', 'اتصال السابع بالثاني عشر'],
      rule:
        'חיבור בית 7 לבית 16 או לבית 12 — הנעדר כלוא או חולה במקום שאליו נסע.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-alive-or-dead-check-house1-house9',
      order: 11,
      arabicText: [
        'اذا سألت عن رجل غايب او غيره هل هو حي ام ميت',
        'فانظر الى الشكل الاول والتاسع'
      ],
      hebrewTranslation: [
        'אם שאלת על אדם נעדר או אחר — האם הוא חי או מת — הסתכל בצורה הראשונה ובתשיעית.'
      ],
      houses: [1, 9],
      figures: [],
      technicalTerms: ['غايب', 'حي ام ميت', 'الشكل الاول', 'التاسع'],
      rule:
        'בשאלת חי או מת בודקים את הצורה הראשונה ואת התשיעית.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-death-if-returned-to-14-or-8-malefic-external',
      order: 12,
      arabicText: [
        'فان تكرر في الرابع عشر او الثامن',
        'وكان نحسا',
        'او تولد مقابله او تحته شكل خارج نحس',
        'دل على موت'
      ],
      hebrewTranslation: [
        'אם הוא חזר בארבעה־עשר או בשמיני, והיה נחס, או שנולד כנגדו או תחתיו צורה יוצאת נחסית — הדבר מורה על מוות.'
      ],
      houses: [8, 14],
      figures: [],
      technicalTerms: ['الرابع عشر', 'الثامن', 'نحس', 'شكل خارج نحس', 'موت'],
      rule:
        'חזרה בבית 14 או 8 כשהיא נחסית, או הולדת צורה יוצאת נחסית כנגדה/תחתיה — סימן מוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-death-house1-in-4-malefic-internal-and-external-under',
      order: 13,
      arabicText: [
        'وان كان صاحب الاول في الرابع وهو نحس',
        'والرابع شكل داخل نحس',
        'وتحته شكل خارج نحس',
        'دل على الموت'
      ],
      hebrewTranslation: [
        'ואם בעל הראשון נמצא ברביעי והוא נחס, והרביעי הוא צורה נכנסת נחסית, ותחתיו צורה יוצאת נחסית — הדבר מורה על מוות.'
      ],
      houses: [1, 4],
      figures: [],
      technicalTerms: ['صاحب الاول', 'الرابع', 'نحس', 'شكل داخل نحس', 'شكل خارج نحس', 'الموت'],
      rule:
        'בעל בית 1 בבית 4 כנחס, עם צורה נכנסת נחסית וצורה יוצאת נחסית תחתיו — סימן מוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-death-external-figures-in-cadent-bad-places',
      order: 14,
      arabicText: [
        'وان كان الاول والرابع عشر اشكال خارجة',
        'وتكررت في اماكن ساقطة عن الوتاد ونحيسة',
        'وانتشأ منها نحس',
        'دلت على الموت'
      ],
      hebrewTranslation: [
        'אם הראשון והארבעה־עשר הם צורות יוצאות, והן חוזרות במקומות נופלים מן היתדות ונחסיים, ונולד מהן נחס — הדבר מורה על מוות.'
      ],
      houses: [1, 14],
      figures: [],
      technicalTerms: ['اشكال خارجة', 'ساقطة عن الوتاد', 'نحيسة', 'انتشأ منها نحس', 'الموت'],
      rule:
        'בית 1 ובית 14 כצורות יוצאות החוזרות במקומות נופלים/נחסיים ומולידות נחס — סימן מוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-ataba-kharija-qabd-kharij-most-malefic-death',
      order: 15,
      arabicText: [
        'وبالأخص العتبة الخارجة والقبض الخارج',
        'فانهما انحس الاشكال',
        'وهما يدلان على الموت'
      ],
      hebrewTranslation: [
        'ובמיוחד עתבה ח׳ארג׳ה וקבץ ח׳ארג׳ — שהן מן הצורות הנחסיות ביותר, והן מורות על מוות.'
      ],
      houses: [],
      figures: ['العتبة الخارجة', 'القبض الخارج'],
      technicalTerms: ['العتبة الخارجة', 'القبض الخارج', 'انحس الاشكال', 'الموت'],
      rule:
        'בשאלת נעדר, עתבה ח׳ארג׳ה וקבץ ח׳ארג׳ הן סימנים חמורים במיוחד למוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-malefics-in-mothers-daughters-with-internal-under-corruption',
      order: 16,
      arabicText: [
        'وان كانت النحوس وقعت في الامهات او البنات',
        'وتحتهم اشكال داخلة',
        'تدل على الفساد',
        'وما اظن انها سالمة'
      ],
      hebrewTranslation: [
        'אם הנחסים נפלו באמהות או בבנות, ותחתיהם צורות נכנסות — הדבר מורה על קלקול/פגם, ואיני סבור שהיא שלמה/בטוחה.'
      ],
      houses: [],
      figures: [],
      technicalTerms: ['النحوس', 'الامهات', 'البنات', 'اشكال داخلة', 'الفساد', 'سالمة'],
      rule:
        'נחסים באמהות או בבנות ומתחתיהם צורות נכנסות — סימן לקלקול או סכנה, ולא לשלמות/בטיחות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-benefics-looking-to-house-of-death-not-death',
      order: 17,
      arabicText: [
        'وان نظرت السعود الى بيت المنية',
        'وكانت قوية',
        'لا تدل على الموت'
      ],
      hebrewTranslation: [
        'אם הצורות הטובות מביטות אל בית המוות, והן חזקות — אין הדבר מורה על מוות.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['السعود', 'بيت المنية', 'قوية', 'لا تدل على الموت'],
      rule:
        'מבט סעדים חזקים אל בית המוות מבטל או מרכך את דין המוות — אין להכריע מוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-malefics-looking-to-house-of-death-indicates-death',
      order: 18,
      arabicText: [
        'وان نظرت النحوس',
        'دلت'
      ],
      hebrewTranslation: [
        'ואם הנחסים מביטים — הם מורים על כך.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['النحوس', 'دلت', 'بيت المنية'],
      rule:
        'מבט נחסים אל בית המוות מחזק הכרעת מוות.',
      status: 'sourceMapped'
    },

    {
      id: 'missing-person-death-1-9-13-malefic-repeat-12-or-paired-malefics',
      order: 19,
      arabicText: [
        'متى كان الاول والتاسع والثالث عشر شكل نحسا',
        'وتكرر في الثاني عشر',
        'او زاوجته النحوس',
        'فاقض بالموت'
      ],
      hebrewTranslation: [
        'כל זמן שהראשון, התשיעי והשלושה־עשר הם צורה נחסית, והיא חוזרת בשנים־עשר, או שהנחסים מזדווגים איתה — פסוק מוות.'
      ],
      houses: [1, 9, 12, 13],
      figures: [],
      technicalTerms: ['الاول', 'التاسع', 'الثالث عشر', 'نحس', 'الثاني عشر', 'زاوجته النحوس', 'الموت'],
      rule:
        'כאשר 1, 9 ו־13 נחסיים, ויש חזרה בבית 12 או זיווג עם נחסים — דין מוות.',
      status: 'sourceMapped'
    }
  ],
  summary: {
    housesUsedSoFar: [1, 2, 4, 7, 8, 9, 10, 12, 13, 14, 15, 16],
    figuresMentionedSoFar: [
      'الجماعة',
      'القبض الخارج',
      'الطريق',
      'العتبة الخارجة'
    ],
    sourcePages: ['PDF document 59.pdf', 'PDF document 60.pdf'],
    extractionNote:
      'שער הגאיב/נעדר נוצר לפי מיפוי PDF 59–60. יש לבצע בהמשך בדיקת צילום/מקור לכל שורה לפני הפעלה מלאה במנוע.',
    status: 'initial-source-mapped'
  }
};

export default { HAWI_QUESTION_MISSING_PERSON };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_MISSING_PERSON };
}
