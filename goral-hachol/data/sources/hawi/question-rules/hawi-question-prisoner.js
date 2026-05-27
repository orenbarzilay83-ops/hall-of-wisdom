export const HAWI_QUESTION_PRISONER = {
  id: 'hawi-question-prisoner',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في الأسير والمسجون وهل يخرج من محبسه',
  sourceSectionHebrew: 'שער האסיר — האם ייצא מכלאו',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'prisoner-rule-1',
      order: 1,
      arabicText: [
        'البيت الثاني عشر يدل على السجن والحبس'
      ],
      hebrewTranslation: [
        'בית 12 מורה על הכלא והמאסר.'
      ],
      houses: [12],
      figures: [],
      technicalTerms: ['البيت الثاني عشر', 'السجن', 'الحبس'],
      rule: 'בית 12 = כלא ומאסר.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-2',
      order: 2,
      arabicText: [
        'البيت الاول يدل على الاسير نفسه'
      ],
      hebrewTranslation: [
        'בית 1 מורה על האסיר עצמו.'
      ],
      houses: [1],
      figures: [],
      technicalTerms: ['البيت الأول', 'الأسير'],
      rule: 'בית 1 = האסיר עצמו.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-3',
      order: 3,
      arabicText: [
        'البيت الخامس يدل على الحظ والقدر',
        'وهو البيت المفتاحي لحكم الاسير'
      ],
      hebrewTranslation: [
        'בית 5 מורה על המזל והגורל — הוא הבית המפתח לפסיקת גורל האסיר.'
      ],
      houses: [5],
      figures: [],
      technicalTerms: ['البيت الخامس', 'الحظ', 'القدر', 'البيت المفتاحي'],
      rule: 'בית 5 = מזל וגורל — הבית המרכזי לפסיקת גורל האסיר.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-4',
      order: 4,
      arabicText: [
        'الدايان البيت الخامس عشر يحكم على خروج الاسير'
      ],
      hebrewTranslation: [
        'הדיין (בית 15) פוסק על שחרור האסיר.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'البيت الخامس عشر', 'خروج الأسير'],
      rule: 'דיין (בית 15) = פסיקה על שחרור האסיר.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-5',
      order: 5,
      arabicText: [
        'اذا كان البيت الاول مرتبطا بالبيت الثاني عشر فالاسير لا يزال في السجن'
      ],
      hebrewTranslation: [
        'אם בית 1 מחובר לבית 12 — האסיר עדיין כלוא.'
      ],
      houses: [1, 12],
      figures: [],
      technicalTerms: ['مرتبط', 'البيت الأول', 'البيت الثاني عشر', 'السجن'],
      rule: 'בית 1 מחובר לבית 12 = האסיר עדיין בכלא.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-6',
      order: 6,
      arabicText: [
        'اذا كان البيت الخامس سعدا فالخروج قادم'
      ],
      hebrewTranslation: [
        'אם בית 5 הוא סעד — השחרור בא.'
      ],
      houses: [5],
      figures: [],
      technicalTerms: ['البيت الخامس', 'سعد', 'الخروج'],
      rule: 'בית 5 סעד = שחרור קרב.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-7',
      order: 7,
      arabicText: [
        'اذا كان الدايان سعدا والبيت الخامس سعدا فالخروج محقق',
        'واذا كانا نحيسين فالسجن طويل'
      ],
      hebrewTranslation: [
        'דיין סעד + בית 5 סעד = שחרור ודאי.',
        'שניהם נחס = מאסר ממושך.'
      ],
      houses: [5, 15],
      figures: [],
      technicalTerms: ['الدايان', 'سعد', 'نحيس', 'الخروج محقق', 'السجن طويل'],
      rule: 'דיין סעד + בית 5 סעד = שחרור ודאי; שניהם נחס = מאסר ממושך.',
      status: 'sourceExact'
    },
    {
      id: 'prisoner-rule-8',
      order: 8,
      arabicText: [
        'كلما تكرر شكل البيت الاول في اللوح',
        'كلما طال أمد السجن'
      ],
      hebrewTranslation: [
        'ככל שצורת בית 1 חוזרת יותר בלוח — כך המאסר מתמשך יותר.'
      ],
      houses: [1],
      figures: [],
      technicalTerms: ['تكرار', 'البيت الأول', 'أمد السجن'],
      rule: 'חזרות רבות של צורת בית 1 = מאסר ממושך יותר.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת האסיר נחקרת דרך בית 12 (כלא), בית 1 (האסיר), בית 5 (גורל/מזל — המפתח) ודיין (בית 15). חיבור בין בית 1 לבית 12 = עדיין כלוא. סעד בבית 5 + דיין סעד = שחרור ודאי. חזרות צורת בית 1 בלוח = אורך המאסר.',
    appDisplayHebrew: 'בשאלת אסיר: בית 12 = כלא, בית 1 = האסיר, בית 5 = גורל (מפתח), דיין (בית 15) = פסיקה. בית 5 סעד + דיין סעד = שחרור ודאי. חזרות צורת בית 1 = אורך מאסר.'
  }
};

export default { HAWI_QUESTION_PRISONER };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_PRISONER };
}
