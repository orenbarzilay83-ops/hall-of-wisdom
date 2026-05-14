// גורל החול — חוקי יסוד מתוך بلوغ الأمل في علم الرمل
// מקור שלישי מאושר להשלמת ידע חסר.
// מקור: بلوغ الأمل في علم الرمل — عبد الفتاح السيد الطوخي — 1991
// קובץ ידע בלבד. לא מנוע חישוב.
// לא מכניסים דיני שאלות פרטיים לפני סיום חילוץ חוקי היסוד.

const RAML_BULUGH_AL_AMAL_FOUNDATIONS = {
  metadata: {
    id: "raml-bulugh-al-amal-foundations",
    sourceId: "bulugh-al-amal",
    arabicTitle: "بلوغ الأمل في علم الرمل",
    hebrewTitle: "בלוג׳ אל־אמל פי עלם אל־רמל",
    author: "عبد الفتاح السيد الطوخي",
    yearHijri: "1411",
    yearGregorian: "1991",
    status: "approvedSupplementarySource",
    externalKnowledgeUsed: false,
    scope: "foundation-rules-comparison-and-completion",
    sourceType: "image-scanned-pdf",
    pages: 20,
    note: "הקובץ סרוק כתמונות; יש לחלץ ממנו חוקים ידנית לפי עמודים."
  },

  extractionStatus: {
    status: "in-progress",
    purpose: "להכניס כל חוק יסוד או השלמה שאינם קיימים עדיין בקבצי הידע של גורל החול.",
    mustAddMissingKnowledge: true,
    principle: "ידע זה כוח",
    currentDecision: [
      "כל חומר יסוד חדש או משלים מתוך מקור זה ייכנס לקבצי הידע.",
      "לא מדלגים על ידע מתקדם, רוחני, אותיות, שמות, דמיר, סحر, مس, حسد או עין הרע.",
      "גם ידע שלא מופעל מיד במנוע נשמר בקובץ ידע עם סטטוס מתאים.",
      "לא מערבבים מקור חדש בתוך המנוע לפני סימון מקור וסטטוס.",
      "כל חוק יסומן לפי: verified / partiallyVerified / referenceOnly / needsFormula / blockedUntilSource / advancedKnowledge / spiritualDiagnostic.",
      "אם מקור זה סותר מקור קודם — לא מוחקים; מסמנים variant או sourceDisagreement."
    ]
  },

  pageMap: [
    {
      pages: [1, 4, 5],
      topic: "שער, פרטי מקור ושנת הדפסה",
      extractionNeed: "source-metadata",
      status: "seen"
    },
    {
      pages: [6, 7],
      topic: "יצירת האמהות, הבנות, הנכדות, העדים, השופט ותנאי העבודה",
      extractionNeed: "foundation-rules",
      priority: "high",
      status: "needsExtraction"
    },
    {
      pages: [8],
      topic: "זכר/נקבה, פנימי/חיצוני, נכנס/יוצא, טוב/רע/ממוזג",
      extractionNeed: "forms-classification",
      priority: "high",
      status: "needsExtraction"
    },
    {
      pages: [9, 10],
      topic: "יתדות, סוואבט, סוואקט, עדים ושוואהד",
      extractionNeed: "house-strength-and-witness-rules",
      priority: "very-high",
      status: "needsExtraction"
    },
    {
      pages: [10, 11],
      topic: "ארבעת היסודות, כיוונים, צבעים, מחלות וסימני טבע",
      extractionNeed: "element-rules",
      priority: "high",
      status: "needsExtraction"
    },
    {
      pages: [11, 12],
      topic: "מספר, משך, זמן, הפלות ושאריות",
      extractionNeed: "timing-counting-ismatat",
      priority: "very-high",
      status: "needsExtraction"
    },
    {
      pages: [12, 13],
      topic: "תסקין הימים והזמנים של הצורות",
      extractionNeed: "taskin-days",
      priority: "high",
      status: "needsExtraction"
    },
    {
      pages: [13, 14, 15, 16, 17, 18],
      topic: "תסקין הדמיר וחילוץ הדמיר",
      extractionNeed: "damir-tasyir-core",
      priority: "very-high",
      status: "needsExtraction"
    },
    {
      pages: [18, 19, 20],
      topic: "תסקין אותיות וחילוץ שם הנשאל עליו",
      extractionNeed: "letters-and-name-extraction-advanced-knowledge",
      priority: "high",
      status: "mustExtract",
      note: "לא לדלג. זהו ידע מתקדם לעבודה רוחנית: الباب الحادي عشر في تسكين الحروف והباب الثاني عشر في اشتقاق اسم المسؤول عنه."
    }
  ],

  missingFoundationTargets: [
    {
      id: "tasyir",
      hebrew: "תסייר / הולכת נקודות",
      arabicTerms: ["التسيير", "تسيير", "سير النقط", "نقطة الميزان", "النقط المفتوحة"],
      currentStatusInProject: "blockedUntilFormula",
      expectedPages: [13, 14, 15, 16, 17],
      status: "needsExtraction"
    },
    {
      id: "ismatat-atrohat",
      hebrew: "הפלות / שאריות",
      arabicTerms: ["إسماط", "إسماطات", "أطروحات", "طرح", "الباقي", "يسقط"],
      currentStatusInProject: "blockedUntilContextFormula",
      expectedPages: [11, 12, 13, 14, 15],
      status: "needsExtraction"
    },
    {
      id: "damir",
      hebrew: "חילוץ הדמיר",
      arabicTerms: ["الضمير", "تسكين الضمير", "استخراج الضمير"],
      currentStatusInProject: "partiallyImplementedAsKnowledge",
      expectedPages: [13, 14, 15, 16, 17, 18],
      status: "needsExtraction"
    },
    {
      id: "timing-duration",
      hebrew: "מספר / משך / זמן",
      arabicTerms: ["العدد", "المدة", "الساعات", "الأيام", "الشهور", "السنين"],
      currentStatusInProject: "partial",
      expectedPages: [11, 12],
      status: "needsExtraction"
    },
    {
      id: "awtad-sawaqit-witnesses",
      hebrew: "יתדות / סוואקט / עדים",
      arabicTerms: ["الأوتاد", "السواقط", "الشواهد", "الثوابت"],
      currentStatusInProject: "readyButNeedsComparison",
      expectedPages: [9, 10],
      status: "needsExtraction"
    },
    {
      id: "seeker-fortune-house",
      hebrew: "בית מזל השואל",
      arabicTerms: ["حظ السائل", "سعد السائل", "بيت السائل", "بيت الضمير", "بيت الطالب"],
      currentStatusInProject: "blockedUntilExactSource",
      expectedPages: [13, 14, 15, 16, 17],
      status: "searchInSource"
    },
    {
      id: "seeker-fall-house",
      hebrew: "בית נפילת השואל",
      arabicTerms: ["سقوط السائل", "نحس السائل", "هبوط السائل", "ضعف السائل"],
      currentStatusInProject: "blockedUntilExactSource",
      expectedPages: [13, 14, 15, 16, 17],
      status: "searchInSource"
    },
    {
      id: "house-before-awtad",
      hebrew: "הבית שלפני היתד",
      arabicTerms: ["ما قبل الوتد", "قبل الوتد", "السابق للوتد", "السواقط"],
      currentStatusInProject: "blockedUntilExactSource",
      expectedPages: [9, 10],
      status: "searchInSource"
    }
  ],


  extractedConstructionAndWorkRules: {
    id: "bulugh-construction-and-work-rules",
    title: "יצירת לוח הגורל ותנאי העבודה לפי بلوغ الأمل",
    sourceBook: "بلوغ الأمل في علم الرمل",
    sourcePages: [6, 7],
    sourceStatus: "verified-from-visible-scan",
    status: "verified",
    rules: [
      {
        id: "mothers-generation",
        title: "יצירת ארבע האמהות",
        arabicTerm: "الأمهات",
        ruleHebrew: [
          "מכים ארבע שורות של נקודות.",
          "השורה הראשונה נותנת את ראש הצורה.",
          "השורה השנייה נותנת את החלק השני של הצורה.",
          "השורה השלישית נותנת את החלק השלישי.",
          "השורה הרביעית נותנת את עקב/תחתית הצורה.",
          "כך נוצרת האם הראשונה.",
          "חוזרים על הפעולה ארבע פעמים ליצירת ארבע האמהות."
        ],
        implementationUse: "כבר קיים במנוע כיצירת mothers; מקור זה מחזק את השיטה.",
        implementationReady: true
      },
      {
        id: "daughters-generation",
        title: "יצירת ארבע הבנות מן האמהות",
        arabicTerm: "البنات",
        ruleHebrew: [
          "לוקחים את ראשי האמהות ויוצרים מהם את הבת הראשונה.",
          "לוקחים את החלק השני של האמהות ויוצרים ממנו את הבת השנייה.",
          "לוקחים את החלק השלישי של האמהות ויוצרים ממנו את הבת השלישית.",
          "לוקחים את תחתיות/עקבי האמהות ויוצרים מהם את הבת הרביעית."
        ],
        implementationUse: "כבר קיים במנוע כיצירת daughters.",
        implementationReady: true
      },
      {
        id: "granddaughters-generation",
        title: "יצירת ארבע הנכדות",
        arabicTerm: "الأحفاد",
        hebrewTerm: "נכדות",
        ruleHebrew: [
          "מחברים את האם הראשונה עם האם השנייה ונוצרת נכדה ראשונה.",
          "מחברים את האם השלישית עם האם הרביעית ונוצרת נכדה שנייה.",
          "מחברים את הבת הראשונה עם הבת השנייה ונוצרת נכדה שלישית.",
          "מחברים את הבת השלישית עם הבת הרביעית ונוצרת נכדה רביעית."
        ],
        implementationUse: "כבר קיים במנוע כיצירת nieces/granddaughters; באפליקציה להשתמש במונח נכדות.",
        implementationReady: true
      },
      {
        id: "witnesses-judge-final",
        title: "עדים, שופט ואחרית",
        arabicTerms: ["الشاهد", "القاضي", "عاقبة العاقبة"],
        ruleHebrew: [
          "מן הנכדות נוצרים העדים.",
          "מן העדים נוצר השופט.",
          "הצורה שלאחר השופט נקראת عاقبة العاقبة — אחרית האחרית / סוף הדבר."
        ],
        implementationUse: "מחזק את מבנה הבתים 13–16 שכבר קיים.",
        implementationReady: true
      },
      {
        id: "work-times",
        title: "זמנים לא מתאימים לעבודה",
        arabicTerm: "الأوقات",
        ruleHebrew: [
          "המקור מזהיר לא לעבוד בזמנים מסוימים.",
          "נזכרים: זמן זריחת השמש, זמן שקיעת השמש, מן הצהריים עד العصر, מן العصر עד المغرب, בזמן מטר, עננים, ובתקופות חשוכות/לא בהירות.",
          "מומלץ לעבוד בזמן מתאים, בייחוד בלילה, כאשר האדם רואה בבירור מה הוא עושה."
        ],
        implementationUse: "להוסיף לשכבת workingConditions כהשוואת מקור שלישי.",
        implementationReady: true
      },
      {
        id: "do-not-test-or-mock",
        title: "לא לעשות למי שבא לנסות או ללעוג",
        arabicTerm: "مستهزئ / اختبار",
        ruleHebrew: [
          "אין להכות גורל למי שבא לנסות את החכמה בלבד.",
          "אין לעבוד למי שבא בלגלוג, בכעס, או מתוך חוסר כבוד לעבודה.",
          "אין להרבות בהכאות שלא לצורך."
        ],
        implementationUse: "מחזק את תנאי העבודה שכבר קיימים.",
        implementationReady: true
      },
      {
        id: "max-three-per-day",
        title: "לא יותר משלוש הכאות ביום",
        arabicTerm: "ثلاث ضربات في اليوم",
        ruleHebrew: [
          "המקור מזהיר שלא להרבות יותר משלוש הכאות ביום אחד.",
          "הכלל קשור לשמירת כובד העבודה ולא להפיכת הגורל לניסוי חוזר בלי צורך."
        ],
        implementationUse: "כבר קיים אצלנו כתנאי עבודה; מקור זה מחזק אותו.",
        implementationReady: true
      }
    ],
    notes: [
      "זהו חילוץ ראשון מתוך بلوغ الأمل בלבד.",
      "החומר מחזק את מבנה המנוע הקיים ולא משנה כרגע את הלוגיקה.",
      "יש להמשיך לעמוד 8 לסיווגי הצורות."
    ]
  },


  extractedFigureClassificationRules: {
    id: "bulugh-figure-classification-rules",
    title: "סיווגי הצורות לפי بلوغ الأمل",
    sourceBook: "بلوغ الأمل في علم الرمل",
    sourcePages: [8],
    sourceStatus: "verified-from-visible-scan",
    status: "verified-working",
    ruleType: "forms-classification",
    categories: [
      {
        id: "male-female",
        title: "זכר ונקבה",
        arabicTerm: "الذكر والمؤنث",
        hebrewTerm: "זכר / נקבה",
        use: "סיווג טבע הצורה, מתאים לשאלות על אדם, מין, יוזמה, קבלה, פעולה או היענות.",
        implementationReady: true
      },
      {
        id: "inside-outside",
        title: "פנימי וחיצוני",
        arabicTerm: "الداخل والخارج",
        hebrewTerm: "נכנס / יוצא או פנימי / חיצוני",
        use: "מסמן האם הכוח נכנס פנימה, מתקבל, נשמר, או יוצא החוצה, מתרחק, מתפזר.",
        implementationReady: true
      },
      {
        id: "fortunate-unfortunate-mixed",
        title: "צורות טובות, רעות וממוזגות",
        arabicTerm: "الأشكال السعيدة والنحيسة والممتزجة",
        hebrewTerm: "טוב / רע / ממוזג",
        use: "שכבת הכרעה כללית: האם הצורה נוטה לטוב, לרע, או למצב ביניים/מעורב.",
        implementationReady: true
      }
    ],
    practicalUse: [
      "הסיווגים מחזקים את מה שכבר קיים ב־raml-forms-basic.js.",
      "אין לשנות כרגע שמות או סטטוסים קיימים של הצורות בלי השוואה מלאה.",
      "החומר ישמש כשכבת אימות והשוואה מול מקורות קודמים.",
      "אם יימצא הבדל בין המקורות — יש לסמן sourceVariant ולא למחוק מקור קודם."
    ],
    nextExtraction: "עמודים 9–10: יתדות, סוואבט, סוואקט, עדים ושוואהד."
  },


  advancedKnowledgePolicy: {
    id: "advanced-knowledge-policy",
    title: "מדיניות שימור ידע מתקדם ורוחני",
    status: "active",
    principle: "ידע זה כוח",
    rules: [
      "אין לדלג על ידע מתוך מקור מאושר גם אם הוא נראה חריג, רוחני, מאגי או מתקדם.",
      "המשתמש הוא יועץ רוחני, ולכן ידע על סحر, مس, حسد, עין הרע, אדם מכושף, אותיות ושמות הוא חלק מהמערכת המקצועית.",
      "ההחלטה אם להציג ידע כזה ללקוח בדוח היא החלטת UI/אתיקה, לא סיבה להשמיט אותו מקבצי הידע.",
      "ידע רגיש יסומן advisorOnly או spiritualDiagnostic ולא יוצג כברירת מחדל בדוח לקוח.",
      "ידע שאין לו נוסחה מלאה יישמר כ־needsFormula או advancedKnowledge ולא יופעל כמנוע הכרעה."
    ],
    mustExtractTopics: [
      {
        id: "taskin-letters",
        arabic: "تسكين الحروف",
        hebrew: "תסקין האותיות",
        sourcePages: [18, 19],
        status: "mustExtract"
      },
      {
        id: "derive-name-of-questioned",
        arabic: "اشتقاق اسم المسؤول عنه",
        hebrew: "חילוץ / גזירת שם הנשאל עליו",
        sourcePages: [19, 20],
        status: "mustExtract"
      },
      {
        id: "magic-evil-eye-spiritual-diagnostics",
        arabic: "السحر / المس / الحسد / العين",
        hebrew: "סחר / מס / קנאה / עין הרע / אדם מכושף",
        sourceBooks: ["القول الجامع", "بلوغ الأمل אם יימצא"],
        status: "mustExtractFromApprovedSources"
      }
    ]
  },

  extractedRules: {
    status: "empty-until-page-extraction",
    rules: []
  }
};

function ramlGetBulughAlAmalFoundations() {
  return RAML_BULUGH_AL_AMAL_FOUNDATIONS;
}

function ramlListBulughAlAmalPages() {
  return RAML_BULUGH_AL_AMAL_FOUNDATIONS.pageMap || [];
}

function ramlListBulughAlAmalMissingTargets() {
  return RAML_BULUGH_AL_AMAL_FOUNDATIONS.missingFoundationTargets || [];
}

if (typeof window !== "undefined") {
  window.RAML_BULUGH_AL_AMAL_FOUNDATIONS = RAML_BULUGH_AL_AMAL_FOUNDATIONS;
  window.ramlGetBulughAlAmalFoundations = ramlGetBulughAlAmalFoundations;
  window.ramlListBulughAlAmalPages = ramlListBulughAlAmalPages;
  window.ramlListBulughAlAmalMissingTargets = ramlListBulughAlAmalMissingTargets;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_BULUGH_AL_AMAL_FOUNDATIONS,
    ramlGetBulughAlAmalFoundations,
    ramlListBulughAlAmalPages,
    ramlListBulughAlAmalMissingTargets
  };
}
