export const HAWI_QUESTION_DEATH_INHERITANCE = {
  id: 'hawi-question-death-inheritance',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في الموت والميراث والتركة',
  sourceSectionHebrew: 'שער המוות, הירושה והעיזבון',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'death-inheritance-rule-1',
      order: 1,
      arabicText: [
        'البيت الثامن يدل على الموت والميراث والتركة'
      ],
      hebrewTranslation: [
        'בית 8 מורה על המוות, הירושה והעיזבון.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['البيت الثامن', 'الموت', 'الميراث', 'التركة'],
      rule: 'בית 8 = מוות, ירושה, עיזבון.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-2',
      order: 2,
      arabicText: [
        'البيت السابع يدل على المتوفى او صاحب الميراث'
      ],
      hebrewTranslation: [
        'בית 7 מורה על הנפטר או בעל הירושה.'
      ],
      houses: [7],
      figures: [],
      technicalTerms: ['البيت السابع', 'المتوفى', 'صاحب الميراث'],
      rule: 'בית 7 = הנפטר / בעל הירושה.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-3',
      order: 3,
      arabicText: [
        'البيت الثاني يدل على المال والتركة التي ستنتقل'
      ],
      hebrewTranslation: [
        'בית 2 מורה על הכסף והעיזבון שיעבור לידי הויורש.'
      ],
      houses: [2],
      figures: [],
      technicalTerms: ['البيت الثاني', 'المال', 'التركة'],
      rule: 'בית 2 = הכסף/העיזבון שיעבור.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-4',
      order: 4,
      arabicText: [
        'اذا كان شكل البيت الثامن سعدا فالوارث سينال حقه',
        'واذا كان نحيسا فالميراث مشكوك فيه او مؤخر'
      ],
      hebrewTranslation: [
        'בית 8 סעד = היורש יקבל את חלקו.',
        'בית 8 נחס = הירושה מוטלת בספק או מעוכבת.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['البيت الثامن', 'سعد', 'نحيس', 'الوارث', 'الميراث'],
      rule: 'בית 8 סעד = יורש יקבל חלקו; נחס = ירושה בספק/מעוכבת.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-5',
      order: 5,
      arabicText: [
        'اذا تكرر شكل البيت الثامن في البيت الثاني فالتركة ستنتقل بسهولة'
      ],
      hebrewTranslation: [
        'אם צורת בית 8 חוזרת בבית 2 — העיזבון יעבור בקלות.'
      ],
      houses: [2, 8],
      figures: [],
      technicalTerms: ['تكرار', 'البيت الثامن', 'البيت الثاني', 'التركة'],
      rule: 'חזרת צורת בית 8 בבית 2 = העיזבון יעבור בקלות.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-6',
      order: 6,
      arabicText: [
        'البيت الرابع يدل على النهاية — هل الميراث يستقر ام يتشتت'
      ],
      hebrewTranslation: [
        'בית 4 = הסוף — האם הירושה תתיישב או תתפזר.'
      ],
      houses: [4],
      figures: [],
      technicalTerms: ['البيت الرابع', 'النهاية', 'الميراث'],
      rule: 'בית 4 = סוף עניין הירושה.',
      status: 'sourceExact'
    },
    {
      id: 'death-inheritance-rule-7',
      order: 7,
      arabicText: [
        'الدايان البيت الخامس عشر سعد يدل على ان الوارث سينال الميراث',
        'ونحيس يدل على الحرمان من الميراث'
      ],
      hebrewTranslation: [
        'דיין (בית 15): סעד = היורש יקבל הירושה; נחס = היורש יחרם.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'البيت الخامس عشر', 'الوارث', 'الحرمان'],
      rule: 'דיין (בית 15): סעד = ירושה תינתן; נחס = חרמה מהירושה.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת המוות והירושה נבחנת דרך בית 8 (מוות/ירושה), בית 7 (הנפטר/בעל הירושה) ובית 2 (הממון שיעבור). בית 8 סעד = יורש יקבל חלקו; נחס = ירושה בספק. חזרת צורת בית 8 בבית 2 = מעבר קל. הדיין (בית 15) פוסק.',
    appDisplayHebrew: 'בשאלת ירושה: בית 8 = מוות/ירושה, בית 7 = הנפטר, בית 2 = הממון. בית 8 סעד = יורש יקבל; נחס = בספק. הדיין (בית 15) פוסק.'
  }
};

export default { HAWI_QUESTION_DEATH_INHERITANCE };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_DEATH_INHERITANCE };
}
