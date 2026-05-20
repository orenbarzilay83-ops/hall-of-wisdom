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
