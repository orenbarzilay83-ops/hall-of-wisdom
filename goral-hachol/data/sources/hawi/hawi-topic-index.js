export const HAWI_TOPIC_INDEX = {
  id: 'hawi-topic-index',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  purposeHebrew:
    'אינדקס נושאים מלא לחאוי לפי תחומי ידע. מטרתו לוודא שלא נאבד שום שער, כלל, דין, מושג או ידע מעשי מן הספר בזמן בניית אפליקציית גורל החול.',
  principleHebrew:
    'ידע זה כוח. אין להחסיר אפילו טיפת ידע אחת. כל נושא מקבל סטטוס: קיים, קיים חלקית, חסר, דורש ביקורת צילום, או מיועד למודול עתידי.',
  policy: {
    sourceFirst: true,
    preserveArabicTerms: true,
    preservePracticalDetails: true,
    doNotDiscardEsotericMaterial: true,
    doNotMergeDifferentKnowledgeLayersBlindly: true,
    noExternalKnowledgeUnlessUserApproved: true,
  },

  topics: [
    {
      topicId: 'source-introduction-history',
      hebrewTitle: 'הקדמת הספר, מסורת המקור ומעמד علم الرمل',
      arabicKeywords: ['إدريس', 'طمطم', 'علم الرمل', 'التخت', 'التراب', 'الضمير'],
      sourcePages: ['PDF document 1.pdf'],
      existingFiles: [],
      coverageStatus: 'missing',
      whatExistsHebrew: 'אין עדיין קובץ הקדמה/מטא־מקור עצמאי.',
      missingOrNeedsReviewHebrew:
        'חסר לשמר את הקדמת הספר, מטרתו, ייחוסו, תפיסת הרמל ככלי לחשיפת נסתרות, וסיפורי המקור כגון אידריס/טמטם.',
      recommendedAction:
        'ליצור קובץ foundation/introduction ייעודי. לא לחבר למנוע פסיקה.',
      priority: 'medium',
    },

    {
      topicId: 'figure-generation-mahw-thabat',
      hebrewTitle: 'יצירת הצורות — מחיקה, קיום, הכאה, חלוקה והולדה',
      arabicKeywords: ['باب المحو والثبات', 'محو', 'إثبات', 'ضرب', 'قسمة', 'توليد'],
      sourcePages: ['PDF document 2.pdf'],
      existingFiles: [],
      coverageStatus: 'missing',
      whatExistsHebrew: 'אין עדיין שכבת יסוד עצמאית לפעולות יצירת הצורות.',
      missingOrNeedsReviewHebrew:
        'חסר שער שמסביר את פעולות מחיקה/קיום/הכאה/חלוקה/הולדה ואת שורש הצורות.',
      recommendedAction:
        'ליצור קובץ יסוד ייעודי אחרי בדיקת צילום/מקור, כי זה בסיס אלגוריתמי חשוב.',
      priority: 'high',
    },

    {
      topicId: 'houses-16-foundation',
      hebrewTitle: 'שישה־עשר הבתים — פירוש יסודי ועמוק',
      arabicKeywords: ['البيوت الستة عشر', 'البيت الأول', 'البيت السادس عشر'],
      sourcePages: [
        'PDF document 3.pdf',
        'PDF document 4.pdf',
        'PDF document 5.pdf',
        'PDF document 6.pdf',
        'PDF document 7.pdf',
        'PDF document 8.pdf',
        'PDF document 9.pdf',
      ],
      existingFiles: ['goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js'],
      coverageStatus: 'rich-source-mapped-needs-correspondence-audit',
      whatExistsHebrew:
        'קיים קובץ עשיר מאוד עם 16 בתים, ערבית מקורית, תרגום עברי, topics, בתים 13–16, בית 15 מאזני הרמל ובית 16 דין פרוג/סיום.',
      missingOrNeedsReviewHebrew:
        'צריך ביקורת מול PDF 3–9 כדי לוודא אם חסרים שיוכים טבלאיים כגון אותיות, צבעים, איברים, זמנים, ערים, שערים, מקומות או שיוכים נוספים.',
      recommendedAction:
        'לא ליצור קובץ חדש כרגע. לבצע בעתיד audit בית־בית לשיוכים חסרים.',
      priority: 'high',
    },

    {
      topicId: 'figure-names-foundation',
      hebrewTitle: 'שמות 16 הצורות ושמות עבריים',
      arabicKeywords: ['الأشكال', 'أسماء الأشكال', 'الحيان', 'نقي الخد', 'الاجتماع'],
      sourcePages: ['multiple'],
      existingFiles: ['goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js'],
      coverageStatus: 'exists-connected',
      whatExistsHebrew:
        'קיימים 16 שמות צורות ומיפוי עברי מתוקן, כולל חיבור=الاجتماع, נושא ראש=الحيان, בר הלחי=نقي الخد.',
      missingOrNeedsReviewHebrew:
        'אין פער ידוע כרגע, אך כל שם חדש/כינוי ממקור נוסף צריך להיכנס כ־alias ולא להחליף שם מאומת.',
      recommendedAction:
        'לשמור יציבות שמות. לא לשנות בלי מקור.',
      priority: 'high',
    },

    {
      topicId: 'figure-transits-16x16',
      hebrewTitle: 'מעבר 16 הצורות ב־16 הבתים',
      arabicKeywords: ['ترحيل الأشكال الستة عشر', 'على قدر الشواهد'],
      sourcePages: [
        'PDF document 9.pdf',
        'PDF document 10.pdf',
        'PDF document 11.pdf',
        'PDF document 12.pdf',
        'PDF document 13.pdf',
        'PDF document 14.pdf',
        'PDF document 15.pdf',
        'PDF document 16.pdf',
        'PDF document 17.pdf',
        'PDF document 18.pdf',
        'PDF document 19.pdf',
        'PDF document 20.pdf',
        'PDF document 21.pdf',
        'PDF document 22.pdf',
        'PDF document 23.pdf',
        'PDF document 24.pdf',
      ],
      existingFiles: ['goral-hachol/data/sources/hawi/figure-transits/'],
      coverageStatus: 'exists-needs-full-detail-audit',
      whatExistsHebrew:
        'קיימים 16 קבצי figure-transits. נושא ראש ובר הלחי הורחבו וחוברו. שכבת transits נטענת ומחוברת ל־hawi-source.',
      missingOrNeedsReviewHebrew:
        'צריך לעבור צורה־צורה מול מיפוי PDF 9–24 כדי לוודא שלא חסרים פרטים: נסיעה, חולי, מוות, נישואין, אויבים, שלטון, גניבה, אובדן, כלא, מטמון, וכללי על פי העדים.',
      recommendedAction:
        'להמשיך audit צורה־צורה, לא להחליף קבצים שלמים בלי בדיקה.',
      priority: 'very-high',
    },

    {
      topicId: 'question-rules-core',
      hebrewTitle: 'דיני שאלות קיימים',
      arabicKeywords: ['باب الزواج', 'باب البيع والشراء', 'باب المريض', 'باب السفر', 'باب الخوف'],
      sourcePages: ['multiple'],
      existingFiles: [
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-marriage.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-commerce.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-love-hate.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-illness.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-disputes.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-fear.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-travel.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-completion.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-children-pregnancy.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-hidden-treasure.js',
        'goral-hachol/data/sources/hawi/question-rules/hawi-question-missing-person.js',
      ],
      coverageStatus: 'many-files-exist-needs-topic-by-topic-audit',
      whatExistsHebrew:
        'קיימים קבצי דיני שאלה רבים: נישואין, מסחר, אהבה/שנאה, חולי, סכסוכים, פחד, נסיעה, השלמת דבר, ילדים/הריון, מטמון/חבוי, נעדר/גאיב.',
      missingOrNeedsReviewHebrew:
        'צריך לוודא לפי הספר המלא שלא חסרים שערים או תתי־דינים בתוך כל שער. קובץ אויבים מסומן באינדקס הישן כ־needs-source-recovery אף שקיים קובץ — דורש בדיקת מצב.',
      recommendedAction:
        'לבצע audit לכל שאלה לפי topicId ולפי עמודי מקור.',
      priority: 'very-high',
    },

    {
      topicId: 'figure-states-speaking-silent',
      hebrewTitle: 'מצבי הצורות בבתים — נاطق/صامت, سعد/نحس',
      arabicKeywords: ['ناطق', 'صامت', 'سعيد', 'نحس', 'افعالها'],
      sourcePages: [
        'PDF document 44.pdf',
        'PDF document 45.pdf',
        'PDF document 46.pdf',
        'PDF document 47.pdf',
        'PDF document 48.pdf',
        'PDF document 49.pdf',
        'PDF document 50.pdf',
        'PDF document 51.pdf',
      ],
      existingFiles: ['goral-hachol/data/sources/hawi/figure-states/'],
      coverageStatus: 'exists-14-of-16-source-audited',
      whatExistsHebrew:
        'קיימת שכבת figure-states עם 14 צורות. נעשה audit: שתי צורות קיימות בתרחיל אך לא נמצאו בפרק מצבי הצורות PDF 45–51.',
      missingOrNeedsReviewHebrew:
        'צריך לשמר את סטטוס שתי הצורות שלא נמצאו ולא להמציא להן מצבי צורה. חלק מהבתים דורשים צילום בגלל OCR.',
      recommendedAction:
        'להמשיך ביקורת צילום נקודתית לשורות marked unclear-needs-review.',
      priority: 'high',
    },

    {
      topicId: 'spiritual-diagnostics-hawi',
      hebrewTitle: 'אבחון רוחני ונסתרות מתוך חאוי',
      arabicKeywords: ['السحر', 'الرقا', 'الحسد', 'الجنون', 'المصروع', 'طلسمات', 'علم المغيبات', 'الكهانة', 'دفين'],
      sourcePages: ['multiple'],
      existingFiles: ['goral-hachol/data/sources/hawi/foundations/hawi-spiritual-diagnostics.js'],
      coverageStatus: 'exists-partial-with-approved-external-layer-added',
      whatExistsHebrew:
        'בחאוי קיימים כישוף/רוקיות, حسد, الجنون, المصروع, רעלים, קברים, מטמון מטולסם, טליסמאות, علم المغيبات ו־الكهانة. נוסף גם מקור מאושר חיצוני על السحر والمس والحسد.',
      missingOrNeedsReviewHebrew:
        'בחאוי עצמו טרם נמצא דין מסודר ל־عين/جن/مس, אך מקור מאושר אחר כבר הוכנס למאגר approved-raml. אין למחוק או לרכך חומר רוחני.',
      recommendedAction:
        'להפריד בין שכבת חאוי לבין approved-raml, ולבנות בהמשך מנוע אבחון רוחני כללי שמושך משתי השכבות.',
      priority: 'very-high',
    },

    {
      topicId: 'authority-state-kings-rulers',
      hebrewTitle: 'שלטון, מלכים, מושלים, מדינה ואויבי מדינה',
      arabicKeywords: ['الملوك', 'ارباب الدول', 'الدولة', 'اعداء الدولة', 'قتل الملك', 'استخراج اسمه'],
      sourcePages: ['PDF document 36.pdf', 'PDF document 37.pdf', 'PDF document 38.pdf'],
      existingFiles: [],
      coverageStatus: 'missing',
      whatExistsHebrew: 'אין עדיין קובץ ייעודי לשער מדיני/שלטוני.',
      missingOrNeedsReviewHebrew:
        'חסר חומר על מושלים, בעלי תפקידים, יציבות/נפילת מדינה, אויבי מדינה, וזיהוי גורם דרך אותיות/בית/חיבור/יסוד.',
      recommendedAction:
        'להכניס בעתיד כתת־מודול מדיני/שלטוני מתקדם.',
      priority: 'medium',
    },

    {
      topicId: 'planetary-correspondences',
      hebrewTitle: 'שיוכי כוכבים, יסודות, אקלימים, מתכות, צמחים ובעלי חיים',
      arabicKeywords: ['الكواكب', 'الأقاليم', 'زحل', 'المشتري', 'المريخ', 'الشمس', 'الزهرة', 'عطارد', 'القمر'],
      sourcePages: ['PDF document 40.pdf', 'PDF document 41.pdf', 'PDF document 42.pdf'],
      existingFiles: [],
      coverageStatus: 'missing',
      whatExistsHebrew: 'אין עדיין קובץ שיוכים כוכביים/אקלימיים/חומריים.',
      missingOrNeedsReviewHebrew:
        'חסר שער שלם על כוכבים, אזורים, עמים, מעמדות, מתכות, אבנים, מאכלים, צמחים ובעלי חיים.',
      recommendedAction:
        'ליצור קובץ יסוד עתידי. לא לחבר למנוע לפני אימות מלא.',
      priority: 'high',
    },

    {
      topicId: 'birth-nativity-mawlud',
      hebrewTitle: 'שער המולד / הנולד — امر المولود',
      arabicKeywords: ['امر المولود', 'حل الضمير', 'الطالع', 'ثاني الطالع', 'ثالث الطالع'],
      sourcePages: [
        'PDF document 51.pdf',
        'PDF document 52.pdf',
        'PDF document 53.pdf',
        'PDF document 54.pdf',
        'PDF document 55.pdf',
        'PDF document 56.pdf',
        'PDF document 57.pdf',
        'PDF document 58.pdf',
        'PDF document 59.pdf',
      ],
      existingFiles: [],
      coverageStatus: 'missing-large-module',
      whatExistsHebrew:
        'אין עדיין מודול מולד. יש רק אזכורים באינדקס הפערים ובאבחון הרוחני.',
      missingOrNeedsReviewHebrew:
        'חסר שער גדול על אדם/מולד לפי حل الضمير וחזרת בעל הטאלע בבתים. כולל ממון, נישואין, ילדים, חולי, מוות, נסתרות, כישוף, טליסמאות, אויבים, שלטון ופרישות.',
      recommendedAction:
        'ליצור מודול עתידי נפרד ולא לערבב עם דיני שאלה רגילים.',
      priority: 'very-high',
    },

    {
      topicId: 'missing-person-ghaib',
      hebrewTitle: 'שער הגאיב / נעדר',
      arabicKeywords: ['باب الغايب', 'هل يقدم الغايب', 'هل هو حي ام ميت'],
      sourcePages: ['PDF document 59.pdf', 'PDF document 60.pdf'],
      existingFiles: ['goral-hachol/data/sources/hawi/question-rules/hawi-question-missing-person.js'],
      coverageStatus: 'source-mapped-dedicated-file-needs-photo-review',
      whatExistsHebrew:
        'קיים קובץ ייעודי עם 19 כללים: חזרה מהירה/מאוחרת, שמועות שקר, פחד, כלא/חולי, מוות בגלות, בדיקת חי/מת ותנאי מוות.',
      missingOrNeedsReviewHebrew:
        'דורש בדיקת צילום/מקור לכל שורה לפני סטטוס source-verified.',
      recommendedAction:
        'לא ליצור קובץ חדש. לבצע ביקורת צילום ואז לעדכן סטטוס.',
      priority: 'high',
    },

    {
      topicId: 'yearly-forecast-prices-rain-weather',
      hebrewTitle: 'טאלע השנה, יוקר/זול, גשם ומזג אוויר',
      arabicKeywords: ['باب الغلا والرخاء', 'باب طالع السنة', 'باب المطر', 'المطر', 'الثلج', 'الرياح'],
      sourcePages: ['PDF document 60.pdf', 'PDF document 61.pdf', 'PDF document 62.pdf'],
      existingFiles: [],
      coverageStatus: 'missing-large-module',
      whatExistsHebrew: 'אין עדיין מודול שנתי/גשם/מזג אוויר.',
      missingOrNeedsReviewHebrew:
        'חסר חומר אלגוריתמי על חיזוי שנתי, מחירים, שפע/יוקר, מלחמות, מחלות, מגפות, גשם, קור, שלג, רוחות וברקים לפי יסודות, כוכבים, ירח ובית 15.',
      recommendedAction:
        'לבנות כתת־מודול עתידי נפרד ולא להפעיל בשאלות פרטיות רגילות.',
      priority: 'medium-high',
    },
  ],

  summary: {
    totalTopics: 13,
    missingTopics: [
      'source-introduction-history',
      'figure-generation-mahw-thabat',
      'authority-state-kings-rulers',
      'planetary-correspondences',
      'birth-nativity-mawlud',
      'yearly-forecast-prices-rain-weather',
    ],
    highPriorityNextTopics: [
      'figure-transits-16x16',
      'question-rules-core',
      'birth-nativity-mawlud',
      'figure-generation-mahw-thabat',
      'spiritual-diagnostics-hawi',
    ],
    recommendedNextStepHebrew:
      'להתחיל בסגירת פערי ידע לפי נושא, לא לפי קובץ. המועמדים הקריטיים: audit מלא ל־figure-transits, בדיקת דיני שאלות קיימים, ושער המולד הגדול.',
  },
};

export function getHawiTopic(topicId) {
  return HAWI_TOPIC_INDEX.topics.find((topic) => topic.topicId === topicId) || null;
}

export function getHawiTopicsByStatus(coverageStatus) {
  return HAWI_TOPIC_INDEX.topics.filter((topic) => topic.coverageStatus === coverageStatus);
}

export function getHawiTopicsByPriority(priority) {
  return HAWI_TOPIC_INDEX.topics.filter((topic) => topic.priority === priority);
}

export default { HAWI_TOPIC_INDEX };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_TOPIC_INDEX };
}
