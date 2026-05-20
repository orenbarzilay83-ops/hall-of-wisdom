export const HAWI_INTRODUCTION_MAHW_THABAT = {
  id: 'hawi-introduction-mahw-thabat',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 1.pdf', 'PDF document 2.pdf'],
  sourceSectionsArabic: [
    'مقدمة الكتاب',
    'نسبة علم الرمل',
    'باب المحو والثبات',
  ],
  sourceSectionHebrew:
    'מבוא הספר, מעמד علم الرمل, ושער מחיקה/קיום/הכאה/חלוקה/הולדה',
  status: 'source-preserved-and-entered',
  appArea: 'foundations-introduction-mahw-thabat',
  purposeHebrew:
    'שכבת יסוד מתוך תחילת חאוי: מעמד علم الرمل, ייחוסו במסורת, מטרת העבודה בלוח הגורל והחול, ושער المحو والثبات המסביר את שורש יצירת הצורות, מחיקה, קיום, הכאה, חלוקה והולדה.',

  introduction: {
    sourcePage: 1,
    topicsHebrew: [
      'מעמד علم الرمل ככלי לגילוי נסתרות',
      'ייחוס למסורת קדומה',
      'אידריס וטמטם כמסורת מקור',
      'עבודה דרך לוח הגורל והחול',
      'שמירת החכמה כמסורת מקצועית',
    ],
    arabicKeywords: [
      'علم الرمل',
      'استخراج الضمار',
      'التخت',
      'التراب',
      'إدريس',
      'طمطم',
    ],
    hebrew:
      'המבוא מציג את علم الرمل כחכמה לגילוי נסתרות דרך לוח הגורל והחול, ומחבר אותה למסורת קדומה של חכמים כגון אידריס וטמטם. באפליקציה החומר הזה נשמר כשכבת לימוד ומקור, כדי שהמשתמש יבין את שורש השיטה ולא רק את הפלט המעשי.',
  },

  scienceStatus: {
    sourcePage: 1,
    hebrew:
      'הספר מתייחס לרמל כאל علم — חכמה/מדע מסורתי — ולא כאל פעולה טכנית בלבד. לכן באפליקציה צריך להיות מקום ללימוד: מהו לוח הגורל, מהי הפלת החול, מהי הכאה, מהו דיין, מהו משלים, ומה ההבדל בין דין שאלה לבין שערים מיוחדים כמו מולד, גשם, מדינה ומטמון.',
    appRule:
      'חומר המבוא נכנס לתפריט לימוד גורל החול ותפילה/הכנה לעשיית הגורל, ולא לתוך תיבת צורה בלוח.',
  },

  mahwThabatCore: {
    sourcePage: 2,
    sourceSectionArabic: 'باب المحو والثبات',
    hebrewTitle: 'שער מחיקה וקיום',
    arabicTerms: {
      mahw: 'محو',
      thabat: 'ثبات / إثبات',
      darb: 'ضرب',
      qisma: 'قسمة',
      tawlid: 'توليد',
    },
    hebrewTerms: {
      mahw: 'מחיקה',
      thabat: 'קיום / הוכחה / השארה',
      darb: 'הכאה / חיבור שתי צורות',
      qisma: 'חלוקה',
      tawlid: 'הולדה',
    },
    hebrew:
      'שער זה הוא שער יסוד שמסביר איך נולדות הצורות ואיך עובדים עם חיבור/הכאה של צורות. הוא אינו רק הסבר טכני, אלא שורש לשאלה איך לוח הגורל נבנה ומתפרש.',
  },

  figureGenerationPrinciples: [
    {
      id: 'root-forms',
      sourcePage: 2,
      arabicKeywords: ['الطريق', 'الجماعة'],
      hebrew:
        'המקור מציג את שורשי הצורות דרך צורות יסוד כגון דרך וג׳מאעה, ומהן מתבארת אפשרות המחיקה, הקיום וההולדה.',
      appUse:
        'לשמור כשכבת לימוד שמסבירה מדוע הצורות אינן רשימה סתמית אלא מערכת בנויה.',
    },
    {
      id: 'darb-two-figures',
      sourcePage: 2,
      arabicKeywords: ['ضرب الشكلين'],
      hebrew:
        'הכאה היא פעולה בין שתי צורות. באפליקציה זה מתאים למנוע שכבר יוצר נכדות, עדים, דיין ומשלים בית 15 מתוך חיבור צורות.',
      appUse:
        'לא לשנות את המנוע הקיים בלי בדיקה; הקובץ מסביר את העיקרון ומסמן אותו כמקור.',
    },
    {
      id: 'tawlid-sixteen',
      sourcePage: 2,
      arabicKeywords: ['توليد', 'ستة عشر'],
      hebrew:
        'הולדת הצורות מובילה לבניית 16 צורות/בתים מלאים בלוח הגורל.',
      appUse:
        'קשור ישירות ל־raml-board-generator.js: אמהות, בנות, נכדות, עדים, דיין ומשלים בית 15.',
    },
    {
      id: 'qisma-and-order',
      sourcePage: 2,
      arabicKeywords: ['قسمة'],
      hebrew:
        'חלוקה וסדר הם חלק מן היסוד: אין לדון צורה מבודדת בלי מיקומה, מקורה, חיבורה ושייכותה לסדר הלוח.',
      appUse:
        'מסביר מדוע האפליקציה חייבת לשמור בית, צורה, מקור הולדה, עדים ודיין.',
    },
  ],

  boardTerminology: {
    mothers: 'אמהות',
    daughters: 'בנות',
    granddaughters: 'נכדות',
    witnesses: 'עדים',
    judge: 'דיין',
    sentence: 'משלים בית 15',
    takhth: 'לוח הגורל',
    noteHebrew:
      'השמות האלה נשמרים כמונחי אפליקציה. לא להשתמש במונחים אחרים כמו “נכדים” במקום נכדות.',
  },

  appLearningDisplay: {
    suggestedMenuHebrew: 'יסודות גורל החול',
    suggestedSubSections: [
      'מהו علم الرمل',
      'לוח הגורל והחול',
      'אמהות, בנות, נכדות, עדים ודיין',
      'מחיקה וקיום',
      'הכאה והולדה',
      'מדוע לא מפרשים צורה בלי בית ושאלה',
    ],
    displayPolicyHebrew:
      'החומר יוצג בתפריט לימוד, לא בתוך לוח הבחירה של הצורות. בלוח עצמו יוצגו רק מספר בית, שם בית וצורה נקייה.',
  },

  appIntegration: {
    mustEnterApp: true,
    relatedModules: [
      'לוח הגורל',
      'מנוע 4 אמהות',
      'דמיר',
      'דיני שאלות',
      'לימוד גורל החול',
      'תפילה לעשיית הגורל',
    ],
    enginePolicyHebrew:
      'המנוע הקיים נשמר. אם בעתיד משנים אלגוריתם הכאה/הולדה, עושים זאת רק אחרי השוואה מול מקור זה ומול קובצי המנוע המאומתים.',
  },
};

export function getHawiIntroductionMahwThabat() {
  return HAWI_INTRODUCTION_MAHW_THABAT;
}

export default { HAWI_INTRODUCTION_MAHW_THABAT };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_INTRODUCTION_MAHW_THABAT };
}
