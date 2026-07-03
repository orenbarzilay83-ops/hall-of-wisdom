export const HAWI_QUESTION_TRAVEL_EXTRA = {
  id: 'hawi-question-travel-extra',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 33.pdf', 'PDF document 34.pdf'],
  sourceSectionArabic: 'بقية مسائل السفر',
  sourceSectionHebrew: 'השלמות שער הנסיעה',
  status: 'source-preserved-and-entered',
  appArea: 'question-rules-travel-extra',
  purposeHebrew:
    'השלמת דיני נסיעה מתוך חאוי: בתי הנסיעה, נסיעה מרצון או בכפייה, מצב הלבנה, סכנות בדרך, חזרה או אי־חזרה, כלא/חולי/מוות בדרך, והקשר לדמיר ותסקין המזרח.',

  travelHouseMap: {
    sourcePage: 33,
    arabic: [
      'اجعل الطالع للمسافر',
      'والتاسع للسفر',
      'والثالث والخامس دليل على الخروج',
      'والسادس لما يلقى من الشدائد والمور الصعبة',
      'والثامن موضع المنية والفات والسموم القاتلة'
    ],
    hebrewRules: [
      'בית 1 — הנוסע עצמו.',
      'בית 9 — עצם הנסיעה.',
      'בית 3 ובית 5 — יציאה, תנועה ותחילת הדרך.',
      'היתדות — כוחו, מעמדו ועמידותו של הנוסע.',
      'בית 6 — קשיים, צרות, חולי, עבדות/שירות, בהמות ומשרתים בדרך.',
      'בית 8 — מוות, פגעים, רעלים וסכנות קשות.',
      'בית 12 — פחד, אויבים, כליאה, הסתרה וקושי בדרך.'
    ],
  },

  chosenOrForcedTravelRules: [
    {
      id: 'bad-look-third-or-ninth-forced-travel',
      sourcePage: 33,
      arabic:
        'فان نظر الى الثالث او الى التاسع نظر غير محمود فاعلم ان السائل مسافر بغير اختيارة وغصبا علية',
      hebrew:
        'אם יש מבט בלתי משובח אל בית 3 או בית 9 — השואל נוסע שלא מרצונו, בכפייה.',
      result: 'נסיעה בכפייה',
      houses: [3, 9],
    },
    {
      id: 'tali-in-third-ninth-fourteenth-voluntary-travel',
      sourcePage: 33,
      arabic:
        'وان كان الطالع في الثالث والتاسع والرابع عشر طلب السفر من تلقاء نفسة وليس بمكروة علية',
      hebrew:
        'אם העולה בבית 3, 9 או 14 — השואל מבקש את הנסיעה מעצמו ואינו מוכרח עליה.',
      result: 'נסיעה מרצון',
      houses: [3, 9, 14],
    },
  ],

  moonTravelRules: [
    {
      id: 'moon-is-question-owner-indicator',
      sourcePage: 33,
      arabic:
        'القمر هو ينبوع الحياة الحيوانية وانة الدليل على صاحب السؤال',
      hebrew:
        'הלבנה היא מקור החיים החיוניים והיא המייצג של בעל השאלה.',
      result: 'הלבנה היא מדד מרכזי לבעל השאלה',
    },
    {
      id: 'bayad-not-needed-for-travel-but-good-for-war-needs',
      sourcePage: 33,
      arabic:
        'البياض ... لا حاجة في السفر ... وفي الحرب والقتال وطلب الحوائج فهو احسن',
      hebrew:
        'לבן אינו הצורה העיקרית לצורך נסיעה, אבל בענייני מלחמה, קרב ובקשת צרכים הוא טוב יותר.',
      figureHebrew: 'לבן',
      topics: ['לבן', 'מלחמה', 'צרכים'],
    },
    {
      id: 'tariq-best-for-travel',
      sourcePage: 33,
      arabic:
        'الطريق ... اذا كان السؤال عن سفر فهو احسن',
      hebrew:
        'דרך טובה יותר כאשר השאלה עצמה היא על נסיעה.',
      figureHebrew: 'דרך',
      topics: ['דרך', 'נסיעה'],
    },
    {
      id: 'both-bayad-and-tariq-stronger',
      sourcePage: 33,
      hebrew:
        'אם לבן ודרך מופיעים יחד — הדין חזק וטוב יותר לפי ההקשר.',
      figuresHebrew: ['לבן', 'דרך'],
    },
    {
      id: 'moon-not-appearing-repeat-strike',
      sourcePage: 33,
      arabic:
        'فان ضرب فلم يظهر القمر اعد الضرب',
      hebrew:
        'אם בהכאה לא הופיעה צורת הלבנה — חוזרים על ההכאה.',
      result: 'חזרה על הפלת הגורל',
    },
  ],

  dhamirTravelRules: [
    {
      id: 'dhamir-shape-holds-judgment',
      sourcePage: 34,
      arabic:
        'فان الشكل الذي يقع فية حل الضمير الحكم كلة فية وجميع الشكال راجعة الية',
      hebrew:
        'הצורה שבה נופל פתרון הדמיר — כל הדין נמצא בה, וכל הצורות חוזרות אליה.',
      relatedModule: 'hawi-dhamir-directions-validation',
    },
    {
      id: 'if-dhamir-in-angle-repeats-ninth-incoming-no-travel',
      sourcePage: 34,
      arabic:
        'فان كان في وتد وتكرر في التاسع وكان داخل فانة لم يسافر',
      hebrew:
        'אם צורת הדמיר נמצאת ביתד, חוזרת בבית 9, והיא צורה נכנסת — הוא לא ייסע.',
      result: 'אין נסיעה',
      houses: [9],
      conditionsHebrew: ['יתד', 'חזרה בבית 9', 'צורה נכנסת'],
    },
    {
      id: 'every-figure-seeks-seventh',
      sourcePage: 34,
      arabic:
        'واعلم ان كل شكل يطلب سابعة',
      hebrew:
        'כל צורה מבקשת את השביעית שלה.',
      appImportance:
        'כלל זה חשוב לניתוח קשרי צורות בנסיעה, דמיר, חיבור והיפרדות.',
    },
  ],

  dangerAndReturnRules: [
    {
      id: 'bad-tali-moon-sun-travel-against-him',
      sourcePage: 34,
      arabic:
        'اذا نظرنا في امر هذا المسافر فوجدنا الطالع حل في ساقط او مايل وشهد لة النحوس او نظرت لة او كان هو نحيسا او منحوسا وكان القمر في وبالة او هبوطة او غير ناظر الى الطالع وكذلك الشمس فعلمنا ان سفرة علية ل لة',
      hebrew:
        'אם העולה נופל/סוקט או נוטה, המזיקים מעידים לו או מביטים אליו, והוא מזיק או מנוחס, והלבנה בפגע/נפילה או אינה מביטה לבית הראשון, וכן השמש — נסיעתו עליו ולא לטובתו.',
      result: 'נסיעה לרעת השואל',
      topics: ['מזיק', 'לבנה', 'שמש', 'סכנה'],
    },
    {
      id: 'connected-to-eighth-no-return',
      sourcePage: 34,
      arabic:
        'فان اتصل بالثامن او حل هو فية فاعلم انة لم يرجع من سفرة',
      hebrew:
        'אם הוא מתחבר לבית 8 או חל בו — אינו חוזר מנסיעתו.',
      result: 'אין חזרה מן הנסיעה',
      houses: [8],
    },
    {
      id: 'malefic-look-death-in-travel',
      sourcePage: 34,
      arabic:
        'فان نظر منة منحوس مات في تلك السفرة',
      hebrew:
        'אם מביט ממנו מזיק — הוא מת באותה נסיעה.',
      result: 'מוות בנסיעה',
      topics: ['מזיק', 'מוות'],
    },
    {
      id: 'benefic-look-and-good-moon-hardship-then-survival',
      sourcePage: 34,
      arabic:
        'وان نظر السعود وكان القمر ينظر في اماكن جيدة فاعلم انة يقاسي اهوال وشدائد وينجوا منها',
      hebrew:
        'אם המיטיבים מביטים והלבנה מביטה ממקומות טובים — הוא סובל פחדים וקשיים אך ניצל מהם.',
      result: 'קשיים ולאחריהם הצלה',
      topics: ['מיטיב', 'לבנה', 'הצלה'],
    },
  ],

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'נסיעה — השלמות',
    relatedModules: [
      'דיני נסיעה קיימים',
      'דמיר',
      'תסקין המזרח',
      'לבנה ושמש',
      'בית 8',
      'בית 9',
      'מיטיבים ומזיקים',
    ],
    displayPolicyHebrew:
      'לשמור כהשלמת מקור לקובץ הנסיעה הקיים. אין למחוק את דיני הנסיעה הקיימים; הקובץ הזה מחזק ומסדר את שכבת הכיוונים, הדמיר והסכנות.',
  },
};

export function getHawiQuestionTravelExtra() {
  return HAWI_QUESTION_TRAVEL_EXTRA;
}

export default { HAWI_QUESTION_TRAVEL_EXTRA };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_TRAVEL_EXTRA };
}
