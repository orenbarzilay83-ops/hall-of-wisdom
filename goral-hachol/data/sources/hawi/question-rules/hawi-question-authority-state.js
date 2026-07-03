export const HAWI_QUESTION_AUTHORITY_STATE = {
  id: 'hawi-question-authority-state',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في أمر الملوك والولاة والسلاطين ومن يطلب منصبا',
  sourceSectionHebrew: 'שער המלכים, השלטון והמשרה',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'authority-state-rule-1',
      order: 1,
      arabicText: [
        'البيت الاول يدل على مكانة السائل وموقعه الحالي',
        'والبيت العاشر يدل على المنصب او العرش المطلوب'
      ],
      hebrewTranslation: [
        'בית 1 מורה על מצב ועמדת השואל כיום.',
        'בית 10 מורה על המשרה, הכיסא, או התפקיד שהוא רוצה להשיג.'
      ],
      houses: [1, 10],
      figures: [],
      technicalTerms: ['البيت الأول', 'البيت العاشر', 'المنصب', 'العرش'],
      rule: 'בית 1 = עמדת השואל; בית 10 = המשרה/תפקיד שמחפש.',
      status: 'sourceExact'
    },
    {
      id: 'authority-state-rule-2',
      order: 2,
      arabicText: [
        'البيت السابع يدل على المنافس او العدو للمنصب'
      ],
      hebrewTranslation: [
        'בית 7 מורה על היריב או האויב המתחרה על אותה משרה.'
      ],
      houses: [7],
      figures: [],
      technicalTerms: ['البيت السابع', 'المنافس', 'العدو'],
      rule: 'בית 7 = היריב/מתחרה למשרה.',
      status: 'sourceExact'
    },
    {
      id: 'authority-state-rule-3',
      order: 3,
      arabicText: [
        'تكرار شكل البيوت الاول والخامس والحادي عشر والخامس عشر',
        'يدل على العودة الى المنصب وتاكيده'
      ],
      hebrewTranslation: [
        'חזרת הצורה בבתים 1, 5, 11, 15 מורה על חזרה למשרה ואישורה.'
      ],
      houses: [1, 5, 11, 15],
      figures: [],
      technicalTerms: ['تكرار', 'البيوت', 'العودة', 'المنصب'],
      rule: 'חזרות בבתים 1/5/11/15 = חזרה ואישור המשרה.',
      status: 'sourceExact'
    },
    {
      id: 'authority-state-rule-4',
      order: 4,
      arabicText: [
        'البيت الرابع يدل على النهاية والخاتمة في امر السلطة'
      ],
      hebrewTranslation: [
        'בית 4 מורה על הסוף והתוצאה הסופית של שאלת השלטון.'
      ],
      houses: [4],
      figures: [],
      technicalTerms: ['البيت الرابع', 'النهاية', 'الخاتمة'],
      rule: 'בית 4 = סוף ותוצאה סופית של שאלת השלטון.',
      status: 'sourceExact'
    },
    {
      id: 'authority-state-rule-5',
      order: 5,
      arabicText: [
        'اذا كان الدايان البيت الخامس عشر سعدا فالمنصب مضمون',
        'واذا كان نحيسا فالمنصب ضائع او مفقود'
      ],
      hebrewTranslation: [
        'דיין (בית 15): מיטיב = המשרה מובטחת; מזיק = המשרה אבודה.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'سعد', 'نحيس', 'المنصب'],
      rule: 'דיין (בית 15): מיטיב = משרה מובטחת/שמורה; מזיק = משרה אבודה.',
      status: 'sourceExact'
    },
    {
      id: 'authority-state-rule-6',
      order: 6,
      arabicText: [
        'اذا تكرر شكل البيت الاول في البيت العاشر',
        'فان السائل سيحقق المنصب المطلوب'
      ],
      hebrewTranslation: [
        'אם צורת בית 1 חוזרת בבית 10 — השואל יגיע לתפקיד שרצה.'
      ],
      houses: [1, 10],
      figures: [],
      technicalTerms: ['تكرر', 'البيت الأول', 'البيت العاشر', 'المنصب'],
      rule: 'צורת בית 1 חוזרת בבית 10 = השואל ישיג את המשרה.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת השלטון והמשרה נבחנת דרך ציר בית 1 (שואל) מול בית 10 (תפקיד מבוקש), בית 7 (יריב), ובית 4 (תוצאה). הדיין (בית 15) פוסק אם המשרה תינתן. חזרת צורות ב-1/5/11/15 מחזקת את הבטחת החזרה למשרה.',
    appDisplayHebrew: 'בשאלת שלטון ומשרה: בית 1 = מצב כיום, בית 10 = תפקיד מבוקש, בית 7 = יריב. הדיין (בית 15) פוסק. חזרת צורת בית 1 בבית 10 = בשורה טובה.'
  }
};

export default { HAWI_QUESTION_AUTHORITY_STATE };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_AUTHORITY_STATE };
}
