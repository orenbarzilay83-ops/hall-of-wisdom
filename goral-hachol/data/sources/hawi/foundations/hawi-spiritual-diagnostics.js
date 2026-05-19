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
      id: 'spiritual-missing-eye-jinn-mass-bukhoor',
      category: 'missing-requires-source-extraction',
      arabicTerms: ['عين', 'جن', 'مس', 'بخور', 'علم المغيبات'],
      hebrewTerms: ['עין הרע', 'ג׳ין', 'אחיזה/פגיעה רוחנית', 'בכור/קטורת', 'ידיעת נסתרות'],
      sourceLocation: null,
      sourceStatus: 'not-yet-found-in-current-code-search',
      appDisplayHebrew:
        'המונחים האלה חשובים לאבחון רוחני, אבל אינם קיימים עדיין בצורה מסודרת בקבצי הקוד לפי החיפוש הנוכחי. יש לאתר אותם בספר המלא או במיפוי העמודים לפני הכנסת דין.',
      caution:
        'לא להמציא. אם המקור לא מביא דין מפורש — לסמן not-explicit-in-source.'
    }
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
