export const HAWI_QUESTION_MISSING_PERSON_EXTRA = {
  id: 'hawi-question-missing-person-extra',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 59.pdf', 'PDF document 60.pdf'],
  sourceSectionArabic: 'الباب العشرون في الغايب / هل يقدم الغايب / هل هو حي ام ميت',
  sourceSectionHebrew: 'שער הגאיב / הנעדר — האם חוזר, מתי, חי או מת',
  status: 'source-preserved-and-entered',
  appArea: 'question-rules-missing-person-extra',
  purposeHebrew:
    'השלמת שער הגאיב/נעדר מתוך חאוי: האם הנעדר חוזר, האם חוזר מהר או באיחור, האם יש פחד/כלא/חולי, והאם הוא חי או מת לפי בתים וצורות.',

  openingPrinciple: {
    sourcePage: 59,
    arabic:
      'اذا سالك انسان عن غايب هل يقدم ام لا',
    hebrew:
      'כאשר אדם שואל על נעדר/גאיב — האם הוא יבוא/יחזור או לא.',
  },

  returnRules: [
    {
      id: 'tariq-in-first-or-seventh-return',
      sourcePage: 59,
      hebrew:
        'אם צורת דרך נמצאת בבית 1 או בבית 7 — זה סימן לתנועה וחזרה/ביאה של הנעדר.',
      houses: [1, 7],
      figuresHebrew: ['דרך'],
      result: 'חזרה / ביאה',
    },
    {
      id: 'incoming-figures-support-return',
      sourcePage: 59,
      hebrew:
        'צורות נכנסות, במיוחד כאשר הן קשורות לטאלע או לבית השביעי, מחזקות את דין החזרה.',
      result: 'חזרה מתחזקת',
    },
    {
      id: 'outgoing-or-blocking-figures-delay-return',
      sourcePage: 59,
      hebrew:
        'צורות יוצאות או חוסמות סביב הטאלע/השביעי/התשיעי מראות עיכוב, מניעה או ריחוק.',
      result: 'עיכוב / מניעה',
    },
    {
      id: 'malefics-in-travel-houses-danger',
      sourcePage: 59,
      hebrew:
        'אם נחסים נמצאים בבתי הדרך, הפחד, החולי או המוות — הדבר מורה על סכנה, פחד, כלא, חולי או רעה בדרך.',
      houses: [6, 8, 9, 12],
      result: 'סכנה או קושי בדרך',
    },
  ],

  lifeDeathRules: [
    {
      id: 'eighth-and-fourth-death-indicators',
      sourcePage: 60,
      hebrew:
        'בדיקת חי/מת נעשית לפי קשרי בית 8, בית 4, בית 12, בית 6, הצורות הנחסיות והעדים.',
      houses: [4, 6, 8, 12],
      result: 'בדיקת חיים או מוות',
    },
    {
      id: 'benefics-and-returning-signs-life',
      sourcePage: 60,
      hebrew:
        'סעדים, צורות חוזרות לטובה, ותמיכת העדים מורים שהנעדר חי או שיש תקווה לחזרתו.',
      result: 'חי / תקווה',
    },
    {
      id: 'malefics-in-death-houses-death-risk',
      sourcePage: 60,
      hebrew:
        'נחסים בבתי מוות, פחד, כלא או חולי, ובפרט אם הם מתחברים לבית 8 או מעידים ממנו — מורים על סכנת מוות או רעה גדולה.',
      result: 'סכנת מוות',
    },
    {
      id: 'false-news-rule',
      sourcePage: 60,
      hebrew:
        'המקור כולל הבחנה בין ידיעה אמיתית לבין שמועה שקרית; אין לפסוק רק משמועה בלי בדיקת העדים והדליל.',
      result: 'בדיקת אמת שמועה',
    },
  ],

  timingAndConditionRules: [
    {
      id: 'fast-return-vs-delayed-return',
      sourcePage: 59,
      hebrew:
        'חזרה מהירה או מאוחרת נבדקת לפי כוח הצורות, כניסה/יציאה, תנועה, בית 3, בית 9, בית 7 והעדים.',
      topics: ['מהירות חזרה', 'איחור', 'בתים 3/7/9'],
    },
    {
      id: 'fear-prison-illness-on-road',
      sourcePage: 59,
      hebrew:
        'כאשר בית 6, 8 או 12 מעורבים בנחס — יש לבדוק פחד, כלא, חולי, סכנה, עיכוב או צרה בדרך.',
      houses: [6, 8, 12],
      topics: ['פחד', 'כלא', 'חולי', 'סכנה'],
    },
  ],

  specificReturnCombinations: [
    {
      id: 'missing-person-complete-to-sixteen',
      sourcePage: 59,
      arabic: 'اذا سالت عن الغايب ومتى يقدم فاضرب الرمل على ذلك وكمله الى ستة عشر بيتا',
      hebrew: 'אם שאלת על נעדר ומתי יחזור — הפק את הרמל על כך, והשלם אותו עד שישה־עשר בתים.',
      houses: [16],
      result: 'חובה להשלים ל-16 בתים',
    },
    {
      id: 'missing-person-fast-return-house16-in-7-house10-in-12',
      sourcePage: 59,
      arabic: 'فان وجدت السادس عشر في السابع والعاشر في الثاني عشر فانه يأتي سريعا',
      hebrew: 'אם מצאת את בית 16 בשביעי, ואת בית 10 בשנים־עשר — הנעדר יבוא במהירות.',
      houses: [7, 10, 12, 16],
      result: 'חזרה מהירה',
    },
    {
      id: 'missing-person-false-news-travel-farther',
      sourcePage: 59,
      arabic: 'اذا كان السابع في التاسع داخل وقامت الجماعة في الخامس عشر من قبضين خارجين يقدم ويسافر الى ارض ابعد منها ويشاع عنه اخبار باطلة',
      hebrew: 'אם בית 7 בתשיעי כשהוא נכנס, וג׳מאעה בבית 15 משני קבצים יוצאים — הנעדר חוזר אך ממשיך לארץ רחוקה יותר, ויופצו עליו ידיעות שקר.',
      houses: [7, 9, 15],
      figuresArabic: ['الجماعة', 'القبض الخارج'],
      result: 'חזרה + המשך נסיעה + שמועות שקר',
    },
    {
      id: 'missing-person-stays-where-he-is-then-returns',
      sourcePage: 59,
      arabic: 'وقامت الجماعة في الخامس عشر من طريقين او من شمسين يقدم وهو مقيم بارض راغب في المقام بها',
      hebrew: 'ג׳מאעה בבית 15 משתי דרכים או משתי שמשות — הנעדר יחזור, אך הוא שוהה במקום שרוצה להישאר בו.',
      houses: [15],
      figuresArabic: ['الجماعة', 'الطريق'],
      result: 'חזרה מרצון, שוהה שם ברצון',
    },
    {
      id: 'missing-person-qabd-kharij-house9-repeat-house16-death-abroad',
      sourcePage: 59,
      arabic: 'اذا كان القبض الخارج في التاسع وتكرر في السادس عشر ربما يموت في الغربة',
      hebrew: 'קבץ ח׳ארג׳ בבית 9 וחוזר בבית 16 — חשש למוות בגלות או בארץ זרה.',
      houses: [9, 16],
      figuresArabic: ['القبض الخارج'],
      result: 'חשש מוות בגלות',
    },
    {
      id: 'missing-person-qabd-kharij-house9-return-after-long-time',
      sourcePage: 59,
      arabic: 'وان كان القبض الخارج في التاسع وحده ربما يعود بعد زمان طويل',
      hebrew: 'קבץ ח׳ארג׳ בבית 9 בלבד — אפשרות לחזרה לאחר זמן רב.',
      houses: [9],
      figuresArabic: ['القبض الخارج'],
      result: 'חזרה באיחור גדול',
    },
    {
      id: 'missing-person-house8-connected-house9-on-the-way-back',
      sourcePage: 59,
      arabic: 'اذا اتصل الثامن بالتاسع في الطريق قادم ناهض الى المكان الذي خرج منه',
      hebrew: 'חיבור בית 8 לבית 9 — הנעדר בדרך, קם ובא אל המקום שממנו יצא.',
      houses: [8, 9],
      result: 'בדרך חזרה',
    },
    {
      id: 'missing-person-house2-connected-house4-wants-return-afraid',
      sourcePage: 59,
      arabic: 'اذا اتصل الثاني بالرابع يريد القدوم وهو خائف في نفسه',
      hebrew: 'חיבור בית 2 לבית 4 — הנעדר רוצה לחזור, אך הוא מפחד מבפנים.',
      houses: [2, 4],
      result: 'רצון לחזור עם פחד פנימי',
    },
    {
      id: 'missing-person-house7-connected-house16-or-12-prisoned-or-sick',
      sourcePage: 59,
      arabic: 'اذا اتصل السابع بالسادس عشر مسجون او مريض في البلد الذي سافر فيها وكذلك اتصال السابع بالثاني عشر',
      hebrew: 'חיבור בית 7 לבית 16, או חיבור בית 7 לבית 12 — הנעדר כלוא או חולה במקום שנסע אליו.',
      houses: [7, 12, 16],
      result: 'כלוא או חולה בחו"ל',
    },
  ],

  specificDeathRules: [
    {
      id: 'missing-person-alive-or-dead-check-house1-house9',
      sourcePage: 60,
      arabic: 'اذا سالت عن رجل غايب او غيره هل هو حي ام ميت فانظر الى الشكل الاول والتاسع',
      hebrew: 'בשאלת חי או מת — בודקים את הצורה הראשונה ואת התשיעית.',
      houses: [1, 9],
      result: 'נקודת הבדיקה: בית 1 ובית 9',
    },
    {
      id: 'missing-person-death-if-returned-to-14-or-8-malefic-external',
      sourcePage: 60,
      arabic: 'فان تكرر في الرابع عشر او الثامن وكان نحسا او تولد مقابله او تحته شكل خارج نحس دل على موت',
      hebrew: 'חזרה בבית 14 או 8 כשהיא נחסית, או הולדת צורה יוצאת נחסית כנגדה/תחתיה — סימן מוות.',
      houses: [8, 14],
      result: 'סימן מוות',
    },
    {
      id: 'missing-person-death-house1-in-4-malefic-internal-and-external',
      sourcePage: 60,
      arabic: 'وان كان صاحب الاول في الرابع وهو نحس والرابع شكل داخل نحس وتحته شكل خارج نحس دل على الموت',
      hebrew: 'בעל בית 1 בבית 4 כנחס, בית 4 צורה נכנסת נחסית, ותחתיו יוצאת נחסית — מוות.',
      houses: [1, 4],
      result: 'מוות',
    },
    {
      id: 'missing-person-death-external-figures-in-cadent-bad-places',
      sourcePage: 60,
      arabic: 'وان كان الاول والرابع عشر اشكال خارجة وتكررت في اماكن ساقطة عن الوتاد ونحيسة وانتشأ منها نحس دلت على الموت',
      hebrew: 'בית 1 ובית 14 כצורות יוצאות, חוזרות במקומות נופלים/נחסיים ומולידות נחס — מוות.',
      houses: [1, 14],
      result: 'מוות',
    },
    {
      id: 'missing-person-ataba-kharija-qabd-kharij-most-malefic-death',
      sourcePage: 60,
      arabic: 'وبالأخص العتبة الخارجة والقبض الخارج فانهما انحس الاشكال وهما يدلان على الموت',
      hebrew: 'בשאלת נעדר, עתבה ח׳ארג׳ה וקבץ ח׳ארג׳ הן הצורות הנחסיות ביותר — מורות על מוות.',
      figuresArabic: ['العتبة الخارجة', 'القبض الخارج'],
      result: 'מוות חזק',
    },
    {
      id: 'missing-person-malefics-in-mothers-daughters-corruption',
      sourcePage: 60,
      arabic: 'وان كانت النحوس وقعت في الامهات او البنات وتحتهم اشكال داخلة تدل على الفساد وما اظن انها سالمة',
      hebrew: 'נחסים באמהות או בבנות ומתחתיהם צורות נכנסות — קלקול/פגם, ואין הנעדר שלם/בטוח.',
      result: 'קלקול / סכנה',
    },
    {
      id: 'missing-person-benefics-looking-to-death-house-not-death',
      sourcePage: 60,
      arabic: 'وان نظرت السعود الى بيت المنية وكانت قوية لا تدل على الموت',
      hebrew: 'סעדים חזקים המביטים אל בית המוות — מבטלים/מרככים את דין המוות.',
      houses: [8],
      result: 'ביטול/ריכוך דין מוות',
    },
    {
      id: 'missing-person-malefics-looking-to-death-house-confirms-death',
      sourcePage: 60,
      arabic: 'وان نظرت النحوس دلت',
      hebrew: 'נחסים המביטים אל בית המוות — מחזקים הכרעת מוות.',
      houses: [8],
      result: 'חיזוק דין מוות',
    },
    {
      id: 'missing-person-death-1-9-13-malefic-repeat-12-or-paired',
      sourcePage: 60,
      arabic: 'متى كان الاول والتاسع والثالث عشر شكل نحسا وتكرر في الثاني عشر او زاوجته النحوس فاقض بالموت',
      hebrew: 'בתים 1, 9 ו-13 כולם נחסיים, וחזרה בבית 12 או זיווג עם נחסים — פסוק מוות.',
      houses: [1, 9, 12, 13],
      result: 'מוות — פסיקה חד משמעית',
    },
  ],

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'נעדר / גאיב — השלמות',
    relatedModules: [
      'דיני נעדר קיימים',
      'נסיעה',
      'חולי',
      'פחד',
      'בית 8',
      'בית 12',
      'עדים ודליל',
    ],
    displayPolicyHebrew:
      'לשמור כהשלמת מקור לקובץ הנעדר הקיים. אין למחוק את הקובץ הקיים; יש להשתמש בזה להשלמת בדיקה ולחיבור עתידי למנוע.',
  },
};

export function getHawiQuestionMissingPersonExtra() {
  return HAWI_QUESTION_MISSING_PERSON_EXTRA;
}

export default { HAWI_QUESTION_MISSING_PERSON_EXTRA };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_MISSING_PERSON_EXTRA };
}
