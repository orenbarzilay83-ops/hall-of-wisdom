export const HAWI_FULL_BOOK_GAP_AUDIT = {
  id: 'hawi-full-book-gap-audit',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  extractionStatus: 'gap-audit-from-full-book-page-index',
  purposeHebrew:
    'מפת פערים רשמית בין מיפוי הספר המלא PDF 1–62 לבין מה שכבר קיים במודול גורל החול. אין כאן דיני מנוע פעילים; זה קובץ ניהול ידע כדי שלא נאבד שום שער, כלל או תובנה מן המקור.',

  policy: {
    noExternalKnowledge: true,
    sourceFirst: true,
    doNotInferMissingRules: true,
    preserveArabicTerms: true,
    hebrewDisplayStyle: 'עברית ישראלית ברורה',
    religiousDisplayAdaptation:
      'כאשר המקור מזכיר מוסדות/אנשי דת לא יהודיים, בתצוגה ליהודי דתי מותר להוסיף מקבילה יהודית כגון בית כנסת, בית מדרש, רב, מקובל, תנ״ך או ספר תורני — בלי למחוק את לשון המקור הערבית.',
  },

  gaps: [
    {
      id: 'gap-introduction-source-history-idris-tamtam',
      sourcePages: ['PDF document 1.pdf'],
      status: 'missing',
      targetKnowledgeArea: 'future-foundation-or-source-introduction',
      hebrewTitle: 'הקדמת הספר, ייחוס לאידריס/טמטם ומעמד علم الرمل',
      arabicKeywords: ['إدريس', 'طمطم', 'علم استخراج الضمار بالتخت والتراب'],
      missingSummaryHebrew:
        'חסר קובץ הקדמה/מטא־מקור: מטרת הספר, ייחוס לאחמד אבן זנבל, השוואת מקורות, תפיסת הרמל ככלי לחשיפת נסתרות דרך לוח הגורל והחול, וסיפור אידריס/טמטם.',
      recommendedAction:
        'ליצור בעתיד קובץ יסוד/הקדמה, לא לחבר למנוע פסיקה.',
    },

    {
      id: 'gap-mahw-thabat-figure-generation',
      sourcePages: ['PDF document 2.pdf'],
      status: 'missing',
      targetKnowledgeArea: 'future-foundations',
      hebrewTitle: 'باب المحو والثبات — מחיקה, קיום, הכאה, חלוקה והולדה',
      arabicKeywords: ['باب المحو والثبات', 'محو', 'اثبات', 'ضرب', 'قسمة', 'توليد'],
      missingSummaryHebrew:
        'שער יסוד חשוב שמסביר את שורש הצורות מתוך الطريق/الجماعة ואת פעולות מחיקה, קיום, הכאה, חלוקה והולדה. אינו קיים עדיין כשכבת יסוד עצמאית.',
      recommendedAction:
        'לפתוח בעתיד קובץ יסודות ייעודי, אחרי בדיקת מקור מדויקת של סימני הצורות.',
    },

    {
      id: 'gap-houses-16-deep-correspondences',
      sourcePages: [
        'PDF document 3.pdf',
        'PDF document 4.pdf',
        'PDF document 5.pdf',
        'PDF document 6.pdf',
        'PDF document 7.pdf',
        'PDF document 8.pdf',
        'PDF document 9.pdf',
      ],
      status: 'partially-exists',
      targetKnowledgeArea: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
      hebrewTitle: 'העמקת 16 הבתים — זמנים, אותיות, איברים, צבעים, מקומות וסודות',
      arabicKeywords: ['البيوت الستة عشر', 'الحروف', 'مدة قريبة', 'الأعضاء', 'الأسرار'],
      missingSummaryHebrew:
        'קובץ 16 הבתים קיים, אך צריך להשוות אם כל עומק הבתים נכנס: זמנים, אותיות, איברים, צבעים, מקומות, ערים, שערים, קברים, סודות, כישוף/רוקיות, קנאה, פחד, ידיעת נסתרות ושיוכי בתים 13–16.',
      recommendedAction:
        'לעשות מעבר בית־בית ולעדכן רק חטיבה אחת בכל פעם.',
    },

    {
      id: 'gap-figure-transits-full-detail',
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
      status: 'partially-exists',
      targetKnowledgeArea: 'goral-hachol/data/sources/hawi/figure-transits/',
      hebrewTitle: 'ترحيل الأشكال — מעבר 16 הצורות ב־16 הבתים',
      arabicKeywords: ['ترحيل الأشكال الستة عشر', 'على قدر الشواهد'],
      missingSummaryHebrew:
        'קבצי הצורות קיימים וטעינה עברה, אבל צריך לוודא שכל פרט מן הספר נכנס: דיני נסיעה, חולי, מוות, רעל, נישואין, אויבים, שלטון, גניבה, אובדן, כלא, מטמון, והכללים החוזרים “על פי העדים”.',
      recommendedAction:
        'לעבור צורה־צורה מול מיפוי העמודים; לא להחליף קובץ שלם בלי בדיקה.',
    },

    {
      id: 'gap-advanced-figure-states-speaking-silent',
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
      status: 'missing',
      targetKnowledgeArea: 'future-figure-states-file',
      hebrewTitle: 'מצבי הצורות בבתים — ناطق/صامت, سعد/نحس, מתקן/מקלקל',
      arabicKeywords: ['ناطق', 'صامت', 'سعيد', 'نحس', 'افعالها'],
      missingSummaryHebrew:
        'נמצא שער נוסף שאינו זהה למעבר הצורות הרגיל: מצב כל צורה בכל בית — מדברת/שותקת, טובה/רעה, מתקנת/מקלקלת. שכבה זו עדיין לא קיימת כקובץ נפרד.',
      recommendedAction:
        'ליצור בעתיד שכבת figure-states נפרדת, כדי לא לערבב עם פירושי המעבר הקיימים.',
    },

    {
      id: 'gap-planetary-correspondences-regions-materials',
      sourcePages: ['PDF document 40.pdf', 'PDF document 41.pdf', 'PDF document 42.pdf'],
      status: 'missing',
      targetKnowledgeArea: 'future-foundations-planetary-correspondences',
      hebrewTitle: 'מזגי הכוכבים, אקלימים, אזורים, מתכות, בעלי חיים וצמחים',
      arabicKeywords: ['مزاج', 'الكواكب', 'الأقاليم', 'زحل', 'المشتري', 'المريخ', 'الشمس', 'الزهرة', 'عطارد', 'القمر', 'الرأس والذنب'],
      missingSummaryHebrew:
        'שער שלם על שיוכי כוכבים וצורות: אזורים, עמים, מעמדות, מתכות, אבנים, מאכלים, צמחים ובעלי חיים. חסר לגמרי כמבנה ידע.',
      recommendedAction:
        'ליצור קובץ יסוד עתידי. לא לחבר למנוע לפני אימות סימני הצורות והכוכבים.',
    },

    {
      id: 'gap-authority-state-kings-rulers',
      sourcePages: ['PDF document 36.pdf', 'PDF document 37.pdf', 'PDF document 38.pdf'],
      status: 'missing',
      targetKnowledgeArea: 'future-question-rules-authority-state',
      hebrewTitle: 'שער מלכים, מושלים, מדינות ואויבי מדינה',
      arabicKeywords: ['الملوك', 'ارباب الدول', 'الدولة', 'اعداء الدولة', 'قتل الملك', 'استخراج اسمه'],
      missingSummaryHebrew:
        'נמצא שער מתקדם על מושלים, בעלי תפקידים, יציבות או נפילת מדינה, אויבי מדינה, וזיהוי גורם דרך אותיות/בית/חיבור/יסוד. אינו קיים כשער שאלה רגיל.',
      recommendedAction:
        'להכניס בעתיד כתת־מודול מדיני/שלטוני מתקדם, לא כחלק מהמנוע הבסיסי.',
    },

    {
      id: 'gap-birth-nativity-mawlud',
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
      status: 'missing',
      targetKnowledgeArea: 'future-birth-nativity-module',
      hebrewTitle: 'שער המולד / הנולד — امر المولود',
      arabicKeywords: ['امر المولود', 'حل الضمير', 'الطالع', 'ثاني الطالع', 'ثالث الطالع'],
      missingSummaryHebrew:
        'שער גדול מאוד על אדם/מולד לפי حل الضمير וחזרת בעל הטאלע בבתים. כולל ממון, נישואין, ילדים, חולי, מוות, נסתרות, כישוף, טליסמאות, ידיעת נסתרות, אויבים, שלטון ופרישות.',
      recommendedAction:
        'ליצור מודול עתידי נפרד. לא לערבב עם דיני שאלה רגילים.',
    },

    {
      id: 'gap-missing-person-ghaib',
      sourcePages: ['PDF document 59.pdf', 'PDF document 60.pdf'],
      status: 'source-mapped-dedicated-file-needs-photo-review',
      targetKnowledgeArea: 'goral-hachol/data/sources/hawi/question-rules/hawi-question-missing-person.js',
      hebrewTitle: 'שער הגאיב / נעדר — האם חוזר, מתי, חי או מת',
      arabicKeywords: ['باب الغايب', 'هل يقدم الغايب', 'هل هو حي ام ميت'],
      missingSummaryHebrew:
        'הפער אינו חסר עוד כקובץ: נוצר קובץ ייעודי hawi-question-missing-person.js עם 19 כללים מתוך PDF 59–60. הקובץ כולל חזרה מהירה/מאוחרת, שמועות שקר, פחד, כלא/חולי, מוות בגלות, בדיקת חי/מת, ותנאי מוות לפי בתים וצורות.',
      recommendedAction:
        'לא ליצור קובץ חדש. השלב הבא הוא בדיקת צילום/מקור לכל שורה לפני הפעלה מלאה במנוע, ולאחר מכן לשנות את הסטטוס ל-source-verified.',
    },

    {
      id: 'gap-yearly-forecast-prices-rain-weather',
      sourcePages: ['PDF document 60.pdf', 'PDF document 61.pdf', 'PDF document 62.pdf'],
      status: 'missing',
      targetKnowledgeArea: 'future-yearly-weather-omens-module',
      hebrewTitle: 'טאלע השנה, יוקר/זול, גשם ומזג אוויר',
      arabicKeywords: ['باب الغلا والرخاء', 'باب طالع السنة', 'باب المطر', 'المطر', 'الثلج', 'الرياح'],
      missingSummaryHebrew:
        'נמצא חומר אלגוריתמי גדול על חיזוי שנתי, מחירים, שפע/יוקר, מלחמות, מחלות, מגפות, גשם, קור, שלג, רוחות וברקים לפי יסודות, כוכבים, ירח ובית 15.',
      recommendedAction:
        'תת־מודול עתידי נפרד לגמרי. לא להפעיל בתוך שאלות פרטיות.',
    },

    {
      id: 'gap-spiritual-diagnostics-eye-jinn-mass',
      sourcePages: [],
      status: 'requires-targeted-source-search',
      targetKnowledgeArea: 'goral-hachol/data/sources/hawi/foundations/hawi-spiritual-diagnostics.js',
      hebrewTitle: 'עין הרע, ג׳ין, מס/אחיזה רוחנית — איתור ממוקד',
      arabicKeywords: ['عين', 'جن', 'مس'],
      missingSummaryHebrew:
        'האבחון הרוחני כבר כולל כישוף, רוקיות, קנאה, נכפה/אחוז, מטמון מטולסם, טליסמאות וידיעת נסתרות. אך המונחים عين, جن, مس עדיין לא נמצאו אצלנו כמקור מפורש ומסודר.',
      recommendedAction:
        'לעשות חיפוש מקור ממוקד בספר המלא לפני הכנסת דין. לא להמציא “עין הרע” אם המקור מדבר רק על حسד/קנאה.',
    },
  ],

  summary: {
    totalGapItems: 11,
    immediateNextCandidates: [
      'gap-houses-16-deep-correspondences',
      'gap-birth-nativity-mawlud',
      'gap-planetary-correspondences-regions-materials',
      'gap-spiritual-diagnostics-eye-jinn-mass',
    ],
    recommendedNextStepHebrew:
      'שער הגאיב/נעדר כבר קיים כקובץ ייעודי ומחובר, אך דורש ביקורת צילום לפני הפעלה מלאה. השלב הבא המומלץ הוא לבחור בין העמקת 16 הבתים לבין שכבת האבחון הרוחני/הנסתרות.',
  },
};

export function getHawiFullBookGap(id) {
  return HAWI_FULL_BOOK_GAP_AUDIT.gaps.find((gap) => gap.id === id) || null;
}

export function getHawiFullBookGapsByStatus(status) {
  return HAWI_FULL_BOOK_GAP_AUDIT.gaps.filter((gap) => gap.status === status);
}

export default { HAWI_FULL_BOOK_GAP_AUDIT };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FULL_BOOK_GAP_AUDIT };
}
