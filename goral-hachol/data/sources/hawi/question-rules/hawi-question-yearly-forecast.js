export const HAWI_QUESTION_YEARLY_FORECAST = {
  id: 'hawi-question-yearly-forecast',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في طالع السنة والمطر والأسعار والملوك',
  sourceSectionHebrew: 'שער טאלע השנה — גשם, מחירים ומלכים',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'yearly-forecast-rule-1',
      order: 1,
      arabicText: [
        'الدايان البيت الخامس عشر يحدد جودة السنة بشكل عام',
        'سعد يدل على سنة جيدة ونحيس يدل على سنة صعبة'
      ],
      hebrewTranslation: [
        'הדיין (בית 15) קובע את איכות השנה הכללית.',
        'מיטיב = שנה טובה; מזיק = שנה קשה.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'جودة السنة', 'سعد', 'نحيس'],
      rule: 'דיין (בית 15): מיטיב = שנה טובה; מזיק = שנה קשה.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-2',
      order: 2,
      arabicText: [
        'البيت العاشر يدل على المطر والزراعة والاسعار',
        'وهو وتد الشمال في اللوح'
      ],
      hebrewTranslation: [
        'בית 10 מורה על גשם, חקלאות ומחירים — הוא יתד הצפון בלוח.'
      ],
      houses: [10],
      figures: [],
      technicalTerms: ['البيت العاشر', 'المطر', 'الزراعة', 'الأسعار', 'وتد الشمال'],
      rule: 'בית 10 = גשם, חקלאות ומחירים בשנה זו.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-3',
      order: 3,
      arabicText: [
        'البيت الثاني يدل على الاحوال الاقتصادية',
        'سعد يدل على رخص ووفرة ونحيس يدل على غلاء وشح'
      ],
      hebrewTranslation: [
        'בית 2 מורה על המצב הכלכלי.',
        'מיטיב = זול ושפע; מזיק = יוקר ומחסור.'
      ],
      houses: [2],
      figures: [],
      technicalTerms: ['البيت الثاني', 'رخص', 'غلاء', 'وفرة', 'شح'],
      rule: 'בית 2: מיטיב = שנה של זול ושפע; מזיק = שנה של יוקר ומחסור.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-4',
      order: 4,
      arabicText: [
        'البيت السابع يدل على الحروب والصراعات والقوى المعارضة في السنة'
      ],
      hebrewTranslation: [
        'בית 7 מורה על מלחמות, עימותים וכוחות מנוגדים בשנה זו.'
      ],
      houses: [7],
      figures: [],
      technicalTerms: ['البيت السابع', 'الحروب', 'الصراعات', 'القوى المعارضة'],
      rule: 'בית 7 = מלחמות, סכסוכים וכוחות מנוגדים בשנה.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-5',
      order: 5,
      arabicText: [
        'مواضع القمر والزهرة في اشكال اللوح تؤثر على توقعات المطر',
        'شكل القمر في البيت العاشر يدل على مطر غزير'
      ],
      hebrewTranslation: [
        'מיקום הירח ונוגה בצורות הלוח משפיע על תחזית הגשם.',
        'צורת הירח בבית 10 = גשם שוטף.'
      ],
      houses: [10],
      figures: [],
      technicalTerms: ['القمر', 'الزهرة', 'المطر', 'غزير'],
      rule: 'צורות ירח ונוגה בלוח משפיעות על תחזית גשמי השנה.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-6',
      order: 6,
      arabicText: [
        'غلبة الاشكال السعيدة في اللوح تدل على سنة مزدهرة',
        'وغلبة النحوس تدل على سنة صعبة'
      ],
      hebrewTranslation: [
        'רוב צורות מיטיב בלוח = שנה משגשגת.',
        'רוב צורות מזיק = שנה קשה.'
      ],
      houses: [],
      figures: [],
      technicalTerms: ['غلبة الأشكال', 'سعيدة', 'نحوس', 'مزدهرة'],
      rule: 'רוב מיטיב = שנה טובה; רוב מזיק = שנה קשה.',
      status: 'sourceExact'
    },
    {
      id: 'yearly-forecast-rule-7',
      order: 7,
      arabicText: [
        'اشكال النار في البيت العاشر تدل على جفاف',
        'واشكال الماء تدل على مطر وفير'
      ],
      hebrewTranslation: [
        'צורות אש בבית 10 = בצורת.',
        'צורות מים = גשמים שוטפים.'
      ],
      houses: [10],
      figures: [],
      technicalTerms: ['أشكال النار', 'جفاف', 'أشكال الماء', 'مطر وفير'],
      rule: 'צורות אש בבית 10 = בצורת; צורות מים = גשם שוטף.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת טאלע השנה בודקת שלושה אפיקים עיקריים: הדיין (בית 15) לאיכות השנה הכללית, בית 10 לגשם וחקלאות ומחירים, ובית 2 למצב הכלכלי. בית 7 מגלה מלחמות וסכסוכים. צורות אש בבית 10 = בצורת; צורות מים = גשם.',
    appDisplayHebrew: 'בשאלת השנה: דיין (בית 15) = איכות כללית, בית 10 = גשם/חקלאות, בית 2 = כלכלה/מחירים, בית 7 = מלחמות. רוב מיטיב = שנה טובה; רוב מזיק = שנה קשה.'
  }
};

export default { HAWI_QUESTION_YEARLY_FORECAST };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_YEARLY_FORECAST };
}
