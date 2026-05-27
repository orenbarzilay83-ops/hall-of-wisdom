export const HAWI_QUESTION_BIRTH_NATIVITY = {
  id: 'hawi-question-birth-nativity',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'باب في المولود والطالع الشخصي وحظ الإنسان',
  sourceSectionHebrew: 'שער המולד — הטאלע האישי וגורל האדם',
  extractionStatus: 'source-inferred',
  rules: [
    {
      id: 'birth-nativity-rule-1',
      order: 1,
      arabicText: [
        'البيت الاول هو الطالع وهو اصل الانسان',
        'ويدل على ذاته ومزاجه وحياته'
      ],
      hebrewTranslation: [
        'בית 1 הוא הטאלע (עולה) — שורש האדם, מזגו וחייו.'
      ],
      houses: [1],
      figures: [],
      technicalTerms: ['الطالع', 'البيت الأول', 'أصل الإنسان', 'مزاج'],
      rule: 'בית 1 = הטאלע (אסצנדנט) — שורש האדם, טבעו ואורח חייו.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-2',
      order: 2,
      arabicText: [
        'تكرار شكل البيت الاول في البيوت الاخرى يكشف ابعاد القدر',
        'فكل بيت يتكرر فيه الشكل يشير الى جانب من جوانب حياة الانسان'
      ],
      hebrewTranslation: [
        'חזרת הצורה של בית 1 בבתים אחרים חושפת ממדי הגורל.',
        'כל בית שבו חוזרת הצורה מורה על פן נוסף בחיי האדם.'
      ],
      houses: [1],
      figures: [],
      technicalTerms: ['تكرار الشكل', 'البيوت', 'أبعاد القدر'],
      rule: 'חזרת צורת בית 1 בבתים אחרים = גילוי ממדי גורל האדם לפי כל בית.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-3',
      order: 3,
      arabicText: [
        'البيت السابع يدل على الاعداء ومعارضة القدر'
      ],
      hebrewTranslation: [
        'בית 7 מורה על האויבים וההתנגדות לגורל.'
      ],
      houses: [7],
      figures: [],
      technicalTerms: ['البيت السابع', 'الأعداء', 'معارضة القدر'],
      rule: 'בית 7 = אויבים והתנגדות לגורל האדם.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-4',
      order: 4,
      arabicText: [
        'البيت العاشر يدل على المهنة والشرف والجاه'
      ],
      hebrewTranslation: [
        'בית 10 מורה על מקצוע, כבוד ותהילה.'
      ],
      houses: [10],
      figures: [],
      technicalTerms: ['البيت العاشر', 'المهنة', 'الشرف', 'الجاه'],
      rule: 'בית 10 = קריירה, כבוד ותהילה.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-5',
      order: 5,
      arabicText: [
        'البيت الرابع يدل على آخر العمر والمال والعقار'
      ],
      hebrewTranslation: [
        'בית 4 מורה על סוף החיים, הרכוש והמקרקעין.'
      ],
      houses: [4],
      figures: [],
      technicalTerms: ['البيت الرابع', 'آخر العمر', 'المال', 'العقار'],
      rule: 'בית 4 = סוף החיים, רכוש ומקרקעין.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-6',
      order: 6,
      arabicText: [
        'البيت الثامن يدل على الموت والتحولات الكبرى'
      ],
      hebrewTranslation: [
        'בית 8 מורה על מוות ותמורות גדולות.'
      ],
      houses: [8],
      figures: [],
      technicalTerms: ['البيت الثامن', 'الموت', 'التحولات'],
      rule: 'בית 8 = מוות ותמורות גדולות בחיי האדם.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-7',
      order: 7,
      arabicText: [
        'عناصر البيوت الاول والسابع والعاشر تكشف المقابلات الكوكبية والبروجية'
      ],
      hebrewTranslation: [
        'יסודות בתים 1, 7, 10 חושפים התאמות כוכביות ומזלות.'
      ],
      houses: [1, 7, 10],
      figures: [],
      technicalTerms: ['العناصر', 'المقابلات الكوكبية', 'البروجية'],
      rule: 'יסודות בתים 1/7/10 חושפים שיוכי כוכבים ומזלות לאדם.',
      status: 'sourceExact'
    },
    {
      id: 'birth-nativity-rule-8',
      order: 8,
      arabicText: [
        'الدايان البيت الخامس عشر يحدد الحكم العام على حظ الانسان في حياته'
      ],
      hebrewTranslation: [
        'הדיין (בית 15) קובע את הפסיקה הכללית על מזל האדם בחייו.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['الدايان', 'البيت الخامس عشر', 'الحظ', 'الحياة'],
      rule: 'דיין (בית 15) = פסיקה כללית על מזל חיי האדם.',
      status: 'sourceExact'
    }
  ],
  summary: {
    hebrew: 'שאלת המולד בודקת את הטאלע האישי דרך בית 1 כשורש האדם, חזרת הצורה בבתים אחרים כגילוי פני הגורל, ובתים 7/10/4/8 לעמדות חיים שונות. הדיין (בית 15) פוסק את הגורל הכללי.',
    appDisplayHebrew: 'בשאלת מולד: בית 1 = הטאלע, בית 10 = קריירה/כבוד, בית 7 = אויבים, בית 4 = סוף/רכוש, בית 8 = מוות/תמורה. חזרת צורת בית 1 בבתים אחרים = גילוי פני הגורל.'
  }
};

export default { HAWI_QUESTION_BIRTH_NATIVITY };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_QUESTION_BIRTH_NATIVITY };
}
