export const HAWI_QUESTION_PARTNERSHIP = {
  id: 'hawi-question-partnership',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في الشراكة والكفالة والضمان',
  sourceSectionHebrew: 'שער השותפות, הערבות והאחריות',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'partnership-rule-1',
      order: 1,
      arabicText: [
        'البيت الاول يدل على السائل في الشراكة',
        'والبيت السابع يدل على الشريك'
      ],
      hebrewTranslation: [
        'בית 1 מורה על השואל בשותפות; בית 7 מורה על השותף.'
      ],
      houses: [1, 7],
      figures: [],
      technicalTerms: ['البيت الأول', 'البيت السابع', 'الشريك'],
      rule: 'בית 1 = השואל בשותפות; בית 7 = השותף.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-2',
      order: 2,
      arabicText: [
        'البيت الثاني يدل على مال السائل في الشراكة',
        'والبيت الثامن يدل على مال الشريك'
      ],
      hebrewTranslation: [
        'בית 2 = ממון השואל בשותפות; בית 8 = ממון השותף.'
      ],
      houses: [2, 8],
      figures: [],
      technicalTerms: ['البيت الثاني', 'البيت الثامن', 'مال الشريك'],
      rule: 'בית 2 = כסף השואל; בית 8 = כסף השותף.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-3',
      order: 3,
      arabicText: [
        'اذا تكرر شكل البيت الاول في البيت السابع فالشريك موافق ومتوافق',
        'وان اختلفا فالشراكة فيها خلاف'
      ],
      hebrewTranslation: [
        'אם צורת בית 1 חוזרת בבית 7 — השותף מסכים ומתאים.',
        'אם שונות — יש מחלוקת בשותפות.'
      ],
      houses: [1, 7],
      figures: [],
      technicalTerms: ['تكرر', 'البيت الأول', 'البيت السابع', 'موافق'],
      rule: 'חזרת צורת בית 1 בבית 7 = שותף מתאים/מסכים; שוני = מחלוקת.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-4',
      order: 4,
      arabicText: [
        'اذا كان شكل البيت الثاني والبيت العاشر سعدا فالشراكة مربحة',
        'واذا كانا نحيسا فلا ربح فيها'
      ],
      hebrewTranslation: [
        'בית 2 ובית 10 שניהם סעד = שותפות רווחית.',
        'שניהם נחס = אין רווח.'
      ],
      houses: [2, 10],
      figures: [],
      technicalTerms: ['البيت الثاني', 'البيت العاشر', 'سعد', 'نحيس', 'ربح'],
      rule: 'בית 2+10 סעד = שותפות רווחית; נחס = לא כדאי.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-5',
      order: 5,
      arabicText: [
        'البيت الرابع يدل على نهاية الشراكة وخاتمتها'
      ],
      hebrewTranslation: [
        'בית 4 מורה על סוף השותפות ותוצאתה הסופית.'
      ],
      houses: [4],
      figures: [],
      technicalTerms: ['البيت الرابع', 'نهاية الشراكة'],
      rule: 'בית 4 = סוף השותפות.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-6',
      order: 6,
      arabicText: [
        'الدايان البيت الخامس عشر سعد يدل على الشراكة ستنجح',
        'ونحيس يدل على الفشل او الخسارة'
      ],
      hebrewTranslation: [
        'דיין (בית 15): סעד = שותפות תצליח; נחס = כישלון או הפסד.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'البيت الخامس عشر', 'سعد', 'نحيس', 'نجح'],
      rule: 'דיין (בית 15): סעד = שותפות מוצלחת; נחס = הפסד.',
      status: 'sourceExact'
    },
    {
      id: 'partnership-rule-7',
      order: 7,
      arabicText: [
        'اذا كان شكل البيت السابع نحيسا فاياك ان تشارك هذا الشخص'
      ],
      hebrewTranslation: [
        'אם צורת בית 7 היא נחס — הזהר מהשותפות עם אדם זה.'
      ],
      houses: [7],
      figures: [],
      technicalTerms: ['البيت السابع', 'نحيس', 'تحذير', 'شراكة'],
      rule: 'בית 7 נחס = אזהרה מהשותפות.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת השותפות נבחנת דרך ציר בית 1 (שואל) מול בית 7 (שותף), ובית 2 (ממון שואל) מול בית 8 (ממון שותף). חזרת צורת בית 1 בבית 7 = שותף מתאים. בית 2+10 סעד = רווח. הדיין (בית 15) פוסק אם השותפות תצלח. בית 7 נחס = אזהרה.',
    appDisplayHebrew: 'בשאלת שותפות: בית 1 = השואל, בית 7 = השותף. חזרת צורת בית 1 בבית 7 = שותפות טובה. בית 2+10 סעד = רווח. הדיין (בית 15) פוסק.'
  }
};

export default { HAWI_QUESTION_PARTNERSHIP };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_PARTNERSHIP };
}
