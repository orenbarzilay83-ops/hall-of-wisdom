export const HAWI_QUESTION_SIBLINGS = {
  id: 'hawi-question-siblings',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في الاخوة والجيران والاصدقاء القريبين',
  sourceSectionHebrew: 'שער האחים, השכנים והחברים הקרובים',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'siblings-rule-1',
      order: 1,
      arabicText: [
        'البيت الثالث يدل على الاخ او الاخت او الجار',
        'والبيت الاول يدل على السائل وعلاقته بهم'
      ],
      hebrewTranslation: [
        'בית 3 מורה על האח/האחות/השכן; בית 1 = השואל ויחסו אליהם.'
      ],
      houses: [1, 3],
      figures: [],
      technicalTerms: ['البيت الثالث', 'الأخ', 'الجار'],
      rule: 'בית 3 = האח/שכן; בית 1 = השואל.',
      status: 'sourceExact'
    },
    {
      id: 'siblings-rule-2',
      order: 2,
      arabicText: [
        'اذا تكرر شكل البيت الثالث في البيت الاول فالاخ يساعد السائل'
      ],
      hebrewTranslation: [
        'אם צורת בית 3 חוזרת בבית 1 — האח יעזור לשואל.'
      ],
      houses: [1, 3],
      figures: [],
      technicalTerms: ['تكرار', 'البيت الثالث', 'البيت الأول', 'يساعد'],
      rule: 'חזרת צורת בית 3 בבית 1 = האח יסייע.',
      status: 'sourceExact'
    },
    {
      id: 'siblings-rule-3',
      order: 3,
      arabicText: [
        'اذا كان شكل البيت الثالث نحيسا فالاخ في ضائقة او لا يمكنه المساعدة'
      ],
      hebrewTranslation: [
        'אם צורת בית 3 היא מזיק — האח במצוקה או אינו יכול לעזור.'
      ],
      houses: [3],
      figures: [],
      technicalTerms: ['البيت الثالث', 'نحيس', 'ضائقة'],
      rule: 'בית 3 מזיק = האח במצוקה / לא יכול לעזור.',
      status: 'sourceExact'
    },
    {
      id: 'siblings-rule-4',
      order: 4,
      arabicText: [
        'البيت الحادي عشر يدل على الاصدقاء والمعارف الذين قد يساعدون'
      ],
      hebrewTranslation: [
        'בית 11 מורה על חברים ומכרים שעשויים לסייע.'
      ],
      houses: [11],
      figures: [],
      technicalTerms: ['البيت الحادي عشر', 'الأصدقاء', 'المساعدة'],
      rule: 'בית 11 = חברים ומכרים שיסייעו.',
      status: 'sourceExact'
    },
    {
      id: 'siblings-rule-5',
      order: 5,
      arabicText: [
        'اذا كان شكل البيت الثالث سعدا فالاخ في خير وقادر على العطاء'
      ],
      hebrewTranslation: [
        'אם צורת בית 3 היא מיטיב — האח במצב טוב ומסוגל לתת.'
      ],
      houses: [3],
      figures: [],
      technicalTerms: ['البيت الثالث', 'سعد', 'عطاء'],
      rule: 'בית 3 מיטיב = האח במצב טוב, מסוגל לסייע.',
      status: 'sourceExact'
    },
    {
      id: 'siblings-rule-6',
      order: 6,
      arabicText: [
        'الدايان البيت الخامس عشر يفصل في النهاية هل الاخ سيساعد ام لا'
      ],
      hebrewTranslation: [
        'הדיין (בית 15) פוסק בסוף האם האח יעזור או לא.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'البيت الخامس عشر', 'يساعد'],
      rule: 'דיין (בית 15): פסיקה סופית — האח יעזור או לא.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת האחים והשכנים נבחנת דרך בית 3 (האח/שכן) מול בית 1 (השואל). חזרת צורת בית 3 בבית 1 = האח יסייע. בית 3 מיטיב = אח יכול לעזור; מזיק = אח במצוקה. בית 11 = חברים ומכרים. הדיין (בית 15) פוסק.',
    appDisplayHebrew: 'בשאלת אחים: בית 3 = האח, בית 1 = השואל. חזרת צורת בית 3 בבית 1 = האח יעזור. בית 11 = חברים. הדיין (בית 15) פוסק.'
  }
};

export default { HAWI_QUESTION_SIBLINGS };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_SIBLINGS };
}
