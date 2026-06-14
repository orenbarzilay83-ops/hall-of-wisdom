export const HAWI_SPIRITUAL_DIAGNOSTICS = {
  id: 'hawi-spiritual-diagnostics',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  extractionStatus: 'initial-index-from-current-files',
  purposeHebrew:
    'מפתח ראשוני לאיתור חומר רוחני/מיסטי שכבר קיים בקבצי חאווי: כישוף, רוקיות, קנאה מזיקה, אחיזה/נכפה, ידיעת נסתרות, מטמון מטולסם, פחד, רעלים, קברים ומקומות נסתרים.',

  rules: [
    {
      id: 'spiritual-house1-magic-ruqya-mind-senses',
      category: 'magic-ruqya',
      arabicTerms: ['السحر', 'الرقا'],
      hebrewTerms: ['כישוף', 'רוקיות / לחשים / רפואות רוחניות'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
        house: 1
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בית 1 כולל מקור מפורש לכישוף, רוקיות/לחשים, שכל, חושים, הבנה והנהגה. באפליקציה זה יכול לשמש כסימן לשאלה שיש בה מרכיב רוחני, מנטלי או חישתי.',
      caution:
        'לא להפוך כל הופעה של בית 1 לאבחון כישוף. זהו רק תחום משמעות אפשרי לפי המקור.'
    },

    {
      id: 'spiritual-house6-possession-madness-envy',
      category: 'possession-envy-affliction',
      arabicTerms: ['الجنون', 'المصروع', 'الحسد'],
      hebrewTerms: ['שיגעון', 'אחוז / נכפה', 'קנאה מזיקה'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
        house: 6
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בית 6 כולל מחלות, מצוקה, פחד, שיגעון/אחיזה, נכפה, חשיפת סוד וקנאה מזיקה. באפליקציה זה יכול לשמש כאזור אבחון של פגיעה, חולשה, קנאה או מצב נפשי/רוחני קשה.',
      caution:
        'המקור מזכיר الجنون והמصروع, אך לא כל חולי הוא פגיעה רוחנית. צריך להצליב עם צורות, עדים ובתי פחד/איבה.'
    },

    {
      id: 'spiritual-house8-death-poison-graves-dark-places',
      category: 'death-poison-graves',
      arabicTerms: ['السموم القاتلة', 'المقبرة', 'السراديب', 'الخوف', 'الموت'],
      hebrewTerms: ['רעלים ממיתים', 'בית קברות', 'מחילות / מרתפים', 'פחד', 'מוות'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
        house: 8
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בית 8 כולל פחד, מוות, ירושות, רעלים ממיתים, מקומות חרבים/חשוכים, קברים ומחילות. באפליקציה זהו בית מרכזי לסכנות נסתרות, פחד עמוק, רעל, אובדן ומקומות של מוות.',
      caution:
        'בית 8 רגיש מאוד. לשמור את המקור במלואו, אך בפלט ללקוח יש להפריד בין ניתוח מקצועי לבין ניסוח ייעוצי.'
    },

    {
      id: 'spiritual-house9-divination-dreams-sacred-study',
      category: 'divination-dreams-sacred-knowledge',
      arabicTerms: ['الكهانة', 'الفلسفة', 'المنامات', 'الرؤية', 'تعبيرها'],
      hebrewTerms: ['ידיעת נסתרות / חיזוי', 'פילוסופיה', 'חלומות', 'ראייה', 'פירוש חלום'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
        house: 9
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בית 9 כולל דת, לימוד, חלומות, פירוש חלומות, ידיעת נסתרות, פילוסופיה ומדע הרמל. בתצוגה יהודית אפשר להציג זאת כלימוד קודש, חכמה, חלום, פירוש חלום וידיעה רוחנית.',
      religiousAdaptation:
        'אם המקור מזכיר מסגד/מוסדות דת, בתצוגה ליהודי דתי אפשר לנסח: מקום תפילה או לימוד — בית כנסת, בית מדרש, ישיבה, מסגד או כנסייה לפי זהות השואל.'
    },

    {
      id: 'spiritual-house12-hatred-envy-bad-suspicion-hidden-enmity',
      category: 'hatred-envy-hidden-enmity',
      arabicTerms: ['الحقد', 'الحسد', 'سوء الظن', 'كتمان العداوة'],
      hebrewTerms: ['טינה', 'קנאה מזיקה', 'חשד רע', 'הסתרת איבה'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/foundations/hawi-houses-16.js',
        house: 12
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בית 12 כולל אויבים, קנאה, טינה, חשד רע והסתרת איבה. באפליקציה זה מתאים לאבחון אויב נסתר, קנאה מזיקה, פגיעה חברתית או אנרגיה עוינת סביב השואל.',
      caution:
        'לא לקרוא לזה “עין הרע” אלא אם נמצא מקור מפורש של عين בהקשר זה. בשלב זה המונח המדויק הוא حسد — קנאה מזיקה.'
    },

    {
      id: 'spiritual-hidden-treasure-talismanic-buried-place',
      category: 'talismanic-hidden-treasure',
      arabicTerms: ['المطلسم', 'مطلسمة'],
      hebrewTerms: ['מטולסם', 'מוגן/קשור בטליסמא', 'חבוי קבור'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/question-rules/hawi-question-hidden-treasure.js',
        relatedQuestionRuleIds: [
          'hidden-nakis-in-house8-old-buried-talismanic-money',
          'hidden-jamaa-ascendant-true-talismanic-under-building-dome-many-things'
        ]
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'שער החבוי/מטמון כולל מטמון קבור מטולסם או מקום מטולסם. זהו חומר מיסטי מפורש שקיים כבר בקובץ המטמון.',
      caution:
        'זה שייך לשער מטמון/חבוי, לא לכל שאלה כללית. יש להשתמש בו רק כאשר נושא השאלה מתאים.'
    },

    {
      id: 'spiritual-illness-hidden-internal-poison-snakes',
      category: 'hidden-illness-poison-snakes',
      arabicTerms: ['الداء الكامن', 'سقي السم', 'لدغ افاعي'],
      hebrewTerms: ['מחלה חבויה', 'שתיית רעל', 'הכשת נחשים'],
      sourceLocation: {
        file: 'goral-hachol/data/sources/hawi/question-rules/hawi-question-illness.js',
        relatedQuestionRuleIds: [
          'illness-house6-aqla-hidden-internal-poison-snakes'
        ]
      },
      sourceStatus: 'explicit-in-current-source-file',
      appDisplayHebrew:
        'בשער החולי, עקלה בבית 6 מורה על מחלה פנימית/חבויה, ואם חזרה בבית 8 — סכנת מוות; ייתכן רעל או הכשת נחשים עם עדות נחסים.',
      caution:
        'זהו דין מקור רגיש מאוד. אין להפוך אותו לאבחנה רפואית מודרנית; באפליקציה יש להציגו כחיווי רמלי/רוחני לפי המקור.'
    },

    {
      id: 'spiritual-pdf37-38-talismans-incense-name-extraction',
      category: 'talismans-incense-name-extraction',
      arabicTerms: ['صور', 'طلسمات', 'بخورات', 'استخراج اسم'],
      hebrewTerms: ['צורות מיסטיות', 'טליסמאות', 'בכור / קטורת', 'חילוץ שם'],
      sourceLocation: {
        sourceType: 'full-book-page-index',
        pdfPages: ['PDF document 37.pdf', 'PDF document 38.pdf'],
        relatedTopics: ['state', 'talismans', 'letters-names', 'spiritual-mystical-context']
      },
      sourceStatus: 'engine-implemented',
      appDisplayHebrew:
        'חילוץ שם פעיל במנוע: בית 9 למכשף/סוחר, בית 7 לגנב/אויב ולאויב מדינה. הצורה בבית → אותיות עבריות לפי שיטת תסכין עבדה.'
    },

    {
      id: 'spiritual-pdf52-56-hidden-knowledge-kahana-raml-stars',
      category: 'hidden-knowledge-divination',
      arabicTerms: ['علم المغيبات', 'الكهانة', 'الرمل', 'النجوم', 'الحكمة'],
      hebrewTerms: ['ידיעת נסתרות', 'חיזוי / קהאנא', 'רמל', 'כוכבים', 'חכמה'],
      sourceLocation: {
        sourceType: 'full-book-page-index',
        pdfPages: ['PDF document 52.pdf', 'PDF document 55.pdf', 'PDF document 56.pdf'],
        relatedTopics: ['birth-nativity', 'spiritual-mystical-context', 'hidden-knowledge']
      },
      sourceStatus: 'engine-implemented',
      appDisplayHebrew:
        'שער המולד פעיל במנוע birthNativity: בית 1 = בעל הטאלע, חזרת הצורה בבתים אחרים = משמעויות חיים. כולל ידיעת נסתרות, קהאנא, רמל וכוכבים.',
      religiousAdaptation:
        'כאשר המקור מדבר על אנשי דת או מדעי נסתר, בתצוגה ליהודי דתי ניתן להוסיף מקבילה: רב, מקובל, חכם, ספרי קודש, תנ״ך או ספר תורני — לפי ההקשר.'
    },

    {
      id: 'spiritual-pdf52-58-sihr-talismans-science-like-magic',
      category: 'magic-talismans-principle',
      arabicTerms: ['السحر', 'الطلسمات', 'العلم مثل السحر'],
      hebrewTerms: ['כישוף', 'טליסמאות', 'המדע דומה לכישוף'],
      sourceLocation: {
        sourceType: 'full-book-page-index',
        pdfPages: ['PDF document 52.pdf', 'PDF document 55.pdf', 'PDF document 58.pdf'],
        relatedTopics: ['birth-nativity', 'siḥr', 'talismans', 'teacher-transmission', 'symbols']
      },
      sourceStatus: 'engine-implemented',
      appDisplayHebrew:
        'שער המולד מופעל. הכישוף, הטליסמאות ועיקרון “המדע כמו סחר” נשמרים כשכבת ידע מקור. חילוץ שם פעיל בנושא spiritualDiagnostics דרך בית 9.'
    },

    {
      id: 'spiritual-pdf61-62-elements-planets-weather-yearly-omens',
      category: 'elements-planets-yearly-omens',
      arabicTerms: ['النار', 'الهواء', 'الماء', 'التراب', 'القمر', 'زحل', 'المريخ', 'المشتري', 'الزهرة', 'عطارد'],
      hebrewTerms: ['אש', 'אוויר', 'מים', 'עפר', 'ירח', 'שבתאי', 'מאדים', 'צדק', 'ונוס', 'מרקורי'],
      sourceLocation: {
        sourceType: 'full-book-page-index',
        pdfPages: ['PDF document 61.pdf', 'PDF document 62.pdf'],
        relatedTopics: ['yearly-forecast', 'rain', 'weather', 'elements', 'planetary-correspondences']
      },
      sourceStatus: 'engine-implemented',
      appDisplayHebrew:
        'שער טאלע השנה ושער הגשם פעילים במנוע yearlyForecast: יסודות, כוכבים, ירח, גשם, קור, שלג, רוחות. הדין על נושא yearlyForecast בלבד, לא מעורב בדיני שאלה פרטית.'
    },
  ],

  summary: {
    currentStatus:
      'האפליקציה מכילה חומר רוחני מפוזר בתוך הוראת הבתים, שער מטמון, שער פחד, שער נסיעה ושער חולי, אך עדיין אין מנגנון אבחון רוחני מלא.',
    nextRecommendedWork:
      'בעתיד יש לבנות שכבת אבחון רוחני מלאה שתאסוף את כל הדינים לפי קטגוריות: כישוף, קנאה, אחיזה/נכפה, פחד, רעל, קברים, מטמון מטולסם, אויב נסתר וידיעת נסתרות.',
    noExternalKnowledge: true
  }
};

export function getHawiSpiritualDiagnosticRule(id) {
  return HAWI_SPIRITUAL_DIAGNOSTICS.rules.find((rule) => rule.id === id) || null;
}

export function getHawiSpiritualDiagnosticsByCategory(category) {
  return HAWI_SPIRITUAL_DIAGNOSTICS.rules.filter((rule) => rule.category === category);
}

export default { HAWI_SPIRITUAL_DIAGNOSTICS };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_SPIRITUAL_DIAGNOSTICS };
}
