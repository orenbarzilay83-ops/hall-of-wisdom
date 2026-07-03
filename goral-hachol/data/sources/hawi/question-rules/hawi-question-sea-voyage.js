export const HAWI_QUESTION_SEA_VOYAGE = {
  id: 'hawi-question-sea-voyage',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في ركوب البحر والسفر البحري',
  sourceSectionHebrew: 'שער מסע הים — רכיבה על הים',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'sea-voyage-rule-1',
      order: 1,
      arabicText: [
        'البيت الاول يدل على المسافر في البحر'
      ],
      hebrewTranslation: [
        'בית 1 מורה על הנוסע בים.'
      ],
      houses: [1],
      figures: [],
      technicalTerms: ['البيت الأول', 'المسافر', 'البحر'],
      rule: 'בית 1 = הנוסע בים.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-2',
      order: 2,
      arabicText: [
        'البيت التاسع يدل على الرحلة والبحر'
      ],
      hebrewTranslation: [
        'בית 9 מורה על המסע והים.'
      ],
      houses: [9],
      figures: [],
      technicalTerms: ['البيت التاسع', 'الرحلة', 'البحر'],
      rule: 'בית 9 = המסע והים.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-3',
      order: 3,
      arabicText: [
        'البيت الثامن يدل على خطر الغرق والموت في البحر'
      ],
      hebrewTranslation: [
        'בית 8 מורה על סכנת טביעה ומוות בים.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['البيت الثامن', 'خطر الغرق', 'الموت'],
      rule: 'בית 8 = סכנת טביעה ומוות בים.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-4',
      order: 4,
      arabicText: [
        'البيت الثاني عشر يدل على الاخطار الخفية في البحر'
      ],
      hebrewTranslation: [
        'בית 12 מורה על סכנות נסתרות בים.'
      ],
      houses: [12],
      figures: [],
      technicalTerms: ['البيت الثاني عشر', 'الأخطار الخفية', 'البحر'],
      rule: 'בית 12 = סכנות נסתרות בים.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-5',
      order: 5,
      arabicText: [
        'اذا كان شكل البيت التاسع سعدا وشكل البيت الثامن سعدا',
        'فالرحلة البحرية آمنة'
      ],
      hebrewTranslation: [
        'אם צורת בית 9 מיטיב וצורת בית 8 מיטיב — המסע בטוח.'
      ],
      houses: [8, 9],
      figures: [],
      technicalTerms: ['سعد', 'الرحلة البحرية', 'آمنة'],
      rule: 'מיטיב בבית 9 + מיטיב בבית 8 = מסע בטוח.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-6',
      order: 6,
      arabicText: [
        'اذا كان اي من البيوت التاسع والثامن والثاني عشر نحيسا',
        'فهناك خطر في البحر'
      ],
      hebrewTranslation: [
        'אם כל אחד מבתים 9, 8, 12 הוא מזיק — יש סכנה בים.'
      ],
      houses: [8, 9, 12],
      figures: [],
      technicalTerms: ['نحيس', 'خطر', 'البحر'],
      rule: 'מזיק בכל אחד מבתים 9/8/12 = סכנה בים.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-7',
      order: 7,
      arabicText: [
        'اتجاه شكل البيت التاسع خارج يدل على رحلة جيدة',
        'وداخل يدل على تاخير او عودة'
      ],
      hebrewTranslation: [
        'כיוון צורת בית 9: יוצאת = מסע טוב (מתקדם); נכנסת = עיכוב או חזרה.'
      ],
      houses: [9],
      figures: [],
      technicalTerms: ['اتجاه الشكل', 'خارج', 'داخل', 'تأخير', 'عودة'],
      rule: 'צורת בית 9 יוצאת = מסע טוב; נכנסת = עיכוב/חזרה.',
      status: 'sourceExact'
    },
    {
      id: 'sea-voyage-rule-8',
      order: 8,
      arabicText: [
        'الدايان البيت الخامس عشر سعد يدل على عودة سالمة',
        'ونحيس يدل على خطر او خسارة'
      ],
      hebrewTranslation: [
        'דיין (בית 15): מיטיב = חזרה בשלום; מזיק = סכנה/אובדן.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'سعد', 'نحيس', 'عودة سالمة', 'خسارة'],
      rule: 'דיין (בית 15): מיטיב = חזרה בשלום; מזיק = סכנה או אובדן.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת מסע הים בודקת ארבעה בתים: בית 1 (הנוסע), בית 9 (המסע), בית 8 (סכנת טביעה), בית 12 (סכנות נסתרות). מיטיב בבתים 9+8 = מסע בטוח; מזיק בכל אחד מהם = סכנה. כיוון צורת בית 9 מגלה מסע או עיכוב. הדיין (בית 15) פוסק את הסוף.',
    appDisplayHebrew: 'במסע ים: בית 9 = המסע, בית 8 = טביעה/סכנה, בית 12 = נסתר. מיטיב בשניהם = בטוח. מזיק בכל אחד = סכנה. דיין (בית 15) = פסיקה סופית.'
  }
};

export default { HAWI_QUESTION_SEA_VOYAGE };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_SEA_VOYAGE };
}
