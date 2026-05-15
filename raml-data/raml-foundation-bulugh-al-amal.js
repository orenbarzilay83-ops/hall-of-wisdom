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


  extractedPages6To20: {
    id: "bulugh-pages-6-to-20-full-extraction",
    title: "חילוץ עמודים 6–20 מתוך بلوغ الأمل",
    sourceBook: "بلوغ الأمل في علم الرمل",
    sourcePages: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    sourceStatus: "verified-from-user-extraction-and-visible-scan",
    status: "partiallyVerified",
    note: "זהו בלוק ידע מלא לפי החילוץ שהובא. כל מה שלא ניתן לקידוד ודאי מסומן needsVisualEncoding / needsFormula / blockedUntilSource.",

    castingGeneration: {
      id: "casting-generation-pages-6-7",
      title: "הכאה, הולדה, אמהות, בנות, נכדות, עדים ושופט",
      sourcePages: [6,7],
      status: "verified",
      maxPointsPerLine: 12,
      directionArabic: "من المشرق إلى المغرب",
      terms: {
        mothers: "أمهات",
        daughters: "بنات",
        generated: "منشآت",
        judge: ["الحاكم", "عاقبة الأمر", "الميزان"],
        finalAfterFinal: "عاقبة العاقبة"
      },
      rules: [
        "מכים ארבע שורות נקודות.",
        "כל שורה מצומצמת לזוג או יחיד: זוג נשאר 2, יחיד נשאר 1.",
        "כל צורה נוצרת מארבע שורות.",
        "ארבע הצורות הראשונות הן האמהות.",
        "הבנות נולדות מן ראשי/חלקי האמהות.",
        "הצורות הבאות נולדות מחיבור צורות קודמות.",
        "החاكم / המאזן הוא כלי הכרעה ואימות.",
        "אם החاكم יוצא فرد — העבודה שגויה ויש לתקן."
      ],
      codeNotes: {
        reduceLine: "points % 2 === 0 ? 2 : 1",
        combineForms: "same parity => 2, mixed parity => 1",
        judgeMustBePaired: true
      },
      implementationReady: true
    },

    workingConditions: {
      id: "working-conditions-pages-6-7",
      title: "תנאי עבודה וזמנים",
      sourcePages: [6,7],
      status: "verified-and-advisorOnly",
      dailyCastingLimit: 3,
      allowedTimesArabic: [
        "من أول النهار إلى الضحى",
        "من الظهر إلى العصر",
        "الليل كله"
      ],
      dislikedTimesArabic: [
        "عند طلوع الشمس",
        "من بعد العصر إلى المغرب",
        "عند المطر",
        "عند السحاب",
        "في قارعة الطريق"
      ],
      internalConditions: [
        "طهارة",
        "استقبال القبلة",
        "عدم الكلام בזמן ההכאה",
        "כוונה נוכחת וטהורה"
      ],
      prohibitions: [
        "לא לבצע למי שבא לנסות או ללעוג.",
        "לא להכות כאשר היועץ רעב.",
        "לא להכות כאשר היועץ כועס.",
        "לא לבצע בשליחות עבור אחר."
      ],
      displayPolicy: "advisorOnly עבור הצד הטקסי/תפילתי.",
      implementationReady: true
    },

    figureClassification: {
      id: "figure-classification-page-8",
      title: "זכר / נקבה / פנימי / חיצוני / נכנס / יוצא",
      sourcePages: [8],
      status: "partiallyVerified",
      needsVisualEncoding: true,
      arabicTitle: "معرفة المذكر والمؤنث والداخل والخارج",
      rules: [
        "הסיווג נועד לדעת מה נכנס ומה יצא בדינים.",
        "הסיווג משמש גם לשאלה האם הנשאל עליו זכר או נקבה.",
        "דרך אחת היא הסתכלות בבית הדמיר.",
        "דרך נוספת היא ספירת הצורות הזכריות והנקביות.",
        "הרוב קובע.",
        "אם יש שוויון — הדין לזכר, כי الذكور هو الأصل."
      ],
      visualTablesPending: [
        "المذكر الخارج",
        "المؤنث الداخل"
      ],
      implementationReady: false
    },

    fortuneCategories: {
      id: "fortune-categories-pages-8-9",
      title: "סעד / נחס / ממוזג / נוטה לסעד / נוטה לנחס",
      sourcePages: [8,9],
      status: "partiallyVerified",
      needsVisualEncoding: true,
      arabicTitle: "الأشكال السعيدة والنحس والممتزجة",
      categoriesArabic: [
        "سعيدة",
        "نحس",
        "ممتزجة",
        "مائلة إلى السعد",
        "مائلة إلى النحس"
      ],
      explicitNotes: {
        "الكوسج": "سعيد مائل إلى النحس"
      },
      rules: [
        "הצורות נחלקות לסעד, נחס, ממוזגות, נוטות לסעד ונוטות לנחס.",
        "הקוסג׳ מוגדר سعيد אך נוטה לנחס.",
        "כאשר מצטרפים סעד, נחס וממוזג — יש כלל הכרעה לפי הרכב הצורות.",
        "במקום שנאמר כך, הסעד גובר."
      ],
      implementationReady: false
    },

    houseStrengthAndWitnesses: {
      id: "house-strength-witnesses-pages-9-10",
      title: "יתדות, מה שאחר היתדות, סוואקט ועדים",
      sourcePages: [9,10],
      status: "verified-and-partial",
      houseGroups: {
        awtad: {
          arabic: "الأوتاد",
          houses: [1,4,7,10],
          strength: "strong",
          rule: "אם הסעד נכנס ליתדות — השאלה טובה וחזקה, ומורה על יציבות מצב השואל, עמידתו ותיקון ענייניו."
        },
        followingAwtad: {
          arabic: "ما يلي الأوتاد",
          houses: [2,5,8,11],
          strength: "medium",
          rule: "סעד בהם חלש מן היתדות ומורה על תיקון דברים בעתיד."
        },
        sawaqit: {
          arabic: "السواقط",
          houses: [3,6,9,12],
          strength: "weak",
          rule: "סעד בהם חלש יותר והם מורים על עניינים מן העבר."
        }
      },
      pastMatterRule: {
        topics: ["כסף שאבד", "נעדר", "גניבה", "בורח"],
        rule: "אם צורות سعيدة داخلة נמצאות בסוואקט — הדבר מורה על חזרה."
      },
      negativeRule: {
        arabicQuote: "إذا انتحست الأوتاد فلا خير في المسألة",
        hebrew: "אם היתדות נחסיות — אין טוב בשאלה."
      },
      witnesses: {
        arabic: "الشواهد",
        status: "partiallyVerified",
        needsFormula: true,
        rules: [
          "העדים הם עדי השאלה בטוב וברע.",
          "לכל צורה יש עד שלישי ממנה — شاهد كل شكل ثالثة.",
          "אם העדים והחاكم מסכימים בסעד — חותכים להשגת המבוקש.",
          "אם הם חולקים — חוזרים אל قاضي المسألة."
        ]
      },
      implementationReady: true
    },

    elementsDirectionsIllness: {
      id: "elements-directions-illness-pages-10-11",
      title: "ארבעת היסודות, כיוונים, צבעים, מחלות וסימני טבע",
      sourcePages: [10,11],
      status: "partiallyVerified",
      elements: {
        fire: { arabic: "النار", humor: "الصفراء", durationValue: 1 },
        air: { arabic: "الهواء", humor: "الدم", durationValue: 2 },
        water: { arabic: "الماء", humor: "البلغم", durationValue: 3 },
        earth: { arabic: "التراب", humor: "السوداء", durationValue: 4 }
      },
      hiddenObjectExamples: [
        "צורה אשית — קרוב למטבח / מקום אש.",
        "צורה מימית — באר, תעלת מים, ליד מים או עין מים.",
        "צורה עפרית — קבור בעפר או מעל האדמה.",
        "צורה אווירית — לא הופיעה דוגמה ברורה באותו פירוט בעמוד."
      ],
      dominanceRule: {
        arabicQuote: "وإن غلبت أشكال طبيعة فالحكم بها",
        hebrew: "אם טבע מסוים גובר — הדין הולך אחריו."
      },
      directions: {
        status: "needsVisualEncoding",
        purpose: ["جهة الخبية", "جهة ضائع", "جهة مسؤول عنه"]
      },
      displayPolicy: "חולי/ליחות — spiritualDiagnostic / advisorOnly.",
      implementationReady: false
    },

    durationAndNumberRules: {
      id: "duration-number-pages-11-12",
      title: "מספר, משך, זמן, הפלות ושאריות",
      sourcePages: [11,12],
      status: "verified-with-blocked-remainder-zero",
      arabicQuotes: [
        "فاضرب الأشكال وعد أمهاتهم وأسقطها ١٢",
        "فتجعل الأمهات أياماً وساعات",
        "والبنات أسبوعاً أو أياماً",
        "والمنشآت شهوراً أو أسابيع",
        "والموازين سنيناً أو شهوراً"
      ],
      rules: [
        "לחישוב משך או כמות כסף סופרים את האמהות ומפילים ב־12.",
        "את השארית מחלקים על הבתים.",
        "האמהות משמשות ימים/שעות.",
        "הבנות משמשות שבועות/ימים.",
        "הمنشآت משמשות חודשים/שבועות.",
        "הموازين משמשים שנים/חודשים."
      ],
      durationGroups: {
        mothers: ["days", "hours"],
        daughters: ["weeks", "days"],
        munshaat: ["months", "weeks"],
        mawazin: ["years", "months"]
      },
      numericPlaceByGroup: {
        mothers: 1,
        daughters: 10,
        munshaat: 100,
        mawazin: 1000
      },
      elementDurationValues: {
        fire: 1,
        air: 2,
        water: 3,
        earth: 4,
        allElementsTogether: 10
      },
      dropsFoundHere: [12],
      dropsNotFoundHere: [9,6,7],
      dropsFoundLaterContext: [15,16],
      remainderZero: "blockedUntilSource",
      implementationReady: true
    },

    taskinDays: {
      id: "taskin-days-pages-12-13",
      title: "תסקין הימים — ימים ולילות של הצורות",
      sourcePages: [12,13],
      status: "partiallyVerified",
      arabicTitle: "من التسكين وما يكون للأشكال من الأيام",
      purposeArabic: "معرفة الشخص وفي أي وقت تحصل الحاجة",
      purposeHebrew: "לדעת את האדם ובאיזה זמן תתקיים הבקשה / הצורך.",
      rules: [
        "אם צורה מופיעה בשאלה או בבית של התסקין — לוקחים ממנה את תיאור האדם ואת היום/לילה שלה.",
        "אם אינה בבית התסקין — מסתכלים אל בית הדמיר ומה שנמצא בו.",
        "המחבר מציין שהקיצור אינו מכיל את כל صفات الأشكال, ויש לקחת אותם מספרי רמל מורחבים."
      ],
      tableStatus: "partiallyVerified-needsSourceCheck",
      dayNightRows: [
        { figuresArabic: ["النصرة الخارجة", "القبض الداخل"], dayArabic: "الأحد", nightArabic: "ليلة الخميس", status: "needsSourceCheck" },
        { figuresArabic: ["البياض", "الطريق"], dayArabic: "الأثنين", nightArabic: "ليلة الجمعة", status: "working" },
        { figuresArabic: ["الحمرة", "الكوسج"], dayArabic: "الثلاثاء", nightArabic: "ليلة السبت", status: "working" },
        { figuresArabic: ["الجماعة", "الإجتماع"], dayArabic: "الأربعاء", nightArabic: "ليلة الأحد", status: "working" },
        { figuresArabic: ["القبض الداخل", "الضاحك"], dayArabic: "الخميس", nightArabic: "ليلة الأثنين", status: "needsSourceCheck", note: "הقبض الداخل מופיע גם בשורה הראשונה לפי החילוץ." },
        { figuresArabic: ["النصرة الداخلة", "نقي الخد"], dayArabic: "الجمعة", nightArabic: "ليلة الثلاثاء", status: "working" },
        { figuresArabic: ["العقلة", "الأنكيس"], dayArabic: "السبت", nightArabic: "ليلة الأربعاء", status: "working" }
      ],
      implementationReady: false
    },

    damirExtractionWays: {
      id: "damir-extraction-pages-13-18",
      title: "תסקין וחילוץ הדמיר",
      sourcePages: [13,14,15,16,17,18],
      status: "advancedKnowledge-partiallyVerified",
      arabicTitles: ["تسكين الضمير", "استخراج الضمير"],
      purpose: "גילוי הכוונה הפנימית של השאלה.",
      generalRules: [
        "אם צורה שוכנת בבית מן השאלה ובמיוחד אם דרך מן דרכי הדמיר מצביעה עליה — מתארים את הדמיר לפי אותה צורה.",
        "אם צורות חוזרות — הדמיר מתואר לפי החזרה.",
        "יש מחלוקת לגבי العتبة الداخلة והדרך.",
        "יש מי שממקם את الطريق בבית 13 ואת العتبة الداخلة בבית 14, וזה המפורסם אצל בעלי האמנות."
      ],
      ways: [
        {
          id: "way1",
          arabic: "الوجه الأول",
          rule: "סופרים את האמהות ומפילים 12. שארית 1 = בית ראשון, 2 = בית שני וכו׳.",
          status: "partiallyVerified",
          blocked: ["remainderZero"]
        },
        {
          id: "way2",
          arabic: "الوجه الثاني",
          ruleArabic: "تجمع نقط المسألة إلى خمسة عشر ثم اطرحهم ١٢",
          rule: "הביטוי דורש פירוש חשבוני מדויק.",
          status: "needsFormula"
        },
        {
          id: "way3",
          arabic: "الوجه الثالث",
          rule: "מסתכלים על المسؤول ומה שדומה לו מן القرعة; שם הדמיר.",
          status: "referenceOnly",
          blocked: ["needsQur'aMap"]
        },
        {
          id: "way4",
          arabic: "الوجه الرابع",
          rule: "מולידים צורה מן הראשון והרביעי; היוצא הוא מקום הדמיר.",
          status: "verified"
        },
        {
          id: "way5",
          arabic: "الوجه الخامس",
          rule: "מחברים נקודות אש ועפר מכל השאלה ומפילים 12.",
          allowedHouses: [2,4,6,8,10,12],
          note: "הדמיר בדרך זו נופל רק בזוגיים.",
          status: "partiallyVerified-strong"
        },
        {
          id: "way6",
          arabic: "الوجه السادس",
          rule: "מסתכלים על הצורה החוזרת. אם אין חזרה או יש שוויון — تعارض.",
          status: "verified-advancedKnowledge"
        },
        {
          id: "way7",
          arabic: "الوجه السابع / طريق النقطة",
          rule: "מסתכלים בבית 15 ומוליכים נקודת אש/עפר עד שתתיישב באמהות או בנות.",
          note: "המחבר אומר שדרך הנקודה חזקה מן האחרות.",
          status: "advancedKnowledge-needsFormula"
        }
      ],
      displayPolicy: "advisorOnly עד קידוד מלא.",
      implementationReady: false
    },

    letterTaskinAndNameDerivation: {
      id: "letter-taskin-name-derivation-pages-18-20",
      title: "תסקין האותיות וגזירת שם הנשאל עליו",
      sourcePages: [18,19,20],
      status: "advancedKnowledge-advisorOnly-needsVisualEncoding",
      arabicTitles: ["تسكين الحروف", "اشتقاق اسم المسؤول عنه"],
      taskinLetters: {
        status: "needsVisualEncoding",
        rules: [
          "השער עוסק בסידור אותיות על גבי הצורות.",
          "המחבר מציין שהתסקין המובא כאן אינו זהה לנוסח המחבר.",
          "מובאת גם צורה הנקראת تسكين المجدولة.",
          "לצורות المنقلبة נתנו שתי אותיות.",
          "אין להפעיל במנוע לפני שיוך ודאי של אות לצורה."
        ]
      },
      nameDerivationWays: [
        {
          id: "name-way1",
          arabic: "الوجه الأول",
          rule: "בודקים את הנקודה אל הבתים ולוקחים אותיות מן הצורות.",
          status: "needsFormula"
        },
        {
          id: "name-way2",
          arabic: "الوجه الثاني",
          rule: "לוקחים יתדות 1,4,7,10. מולידים 1+4, מולידים 7+10, ואז מולידים משניהם. אותיות הצורה היוצאת הן שם הנשאל עליו.",
          status: "advancedKnowledge-workingFormula"
        },
        {
          id: "name-way3",
          arabic: "الوجه الثالث",
          rule: "לוקחים את ארבעת היתדות ועושים אותן אמהות, משלימים עד 16 צורות, ואז לוקחים אותיות של 9, 11, 15.",
          status: "advancedKnowledge-workingFormula"
        },
        {
          id: "name-way4",
          arabic: "الوجه الرابع",
          rule: "לוקחים אותיות الطالع, התשיעי, האחד־עשר והארבעה־עשר.",
          houses: [1,9,11,14],
          status: "advancedKnowledge-workingFormula"
        },
        {
          id: "name-way5",
          arabic: "الوجه الخامس",
          rule: "הדרך המוסמכת והחזקה ביותר: אם כל הצורות שוכנות — לוקחים אותיות 1,4,12. אם לא, מסתכלים על הצורות המכוונות לשאלה בתסקין האותיות, מוסיפים אותיות של צורה חוזרת אם יש, וגוזרים שם.",
          note: "יכול להוציא שם ערבי, לועזי, חיה, צמח או מתכת.",
          status: "advancedKnowledge-strongest-needsLetterTaskin"
        }
      ],
      implementationReady: false
    },


    visualEncodingWork: {
      id: "bulugh-visual-encoding-work",
      title: "עבודת קידוד חזותי מתוך טבלאות הסריקה",
      status: "in-progress",
      sourceBook: "بلوغ الأمل في علم الرمل",
      note: "טבלאות שלא ניתן לקודד בוודאות מתוך החילוץ הטקסטואלי נשמרות כאן עד פענוח חזותי מלא.",

      genderInsideOutsideTable: {
        id: "gender-inside-outside-table-page-8",
        title: "טבלת זכר / נקבה / פנימי / חיצוני",
        sourcePages: [8],
        arabicTitle: "معرفة المذكر والمؤنث والداخل والخارج",
        status: "needsVisualEncoding",
        sourceStatus: "visible-scan-but-not-fully-encoded",
        knownRules: [
          "הטבלה משמשת להבחין בין זכר ונקבה, וכן בין الداخل והخرج.",
          "אפשר לקבוע לפי בית הדמיר.",
          "אפשר לקבוע לפי רוב הצורות הזכריות או הנקביות.",
          "אם הזכר והנקבה שווים — הדין לזכר, כי הזכר הוא الأصل."
        ],
        tableGroupsFromHeading: [
          {
            arabic: "المذكر الخارج",
            hebrew: "זכרי חיצוני / יוצא",
            encodedFigures: [],
            status: "needsVisualEncoding"
          },
          {
            arabic: "المؤنث الداخل",
            hebrew: "נקבי פנימי / נכנס",
            encodedFigures: [],
            status: "needsVisualEncoding"
          }
        ],
        engineUse: "blockedUntilVisualEncoding",
        implementationReady: false
      },

      letterTaskinTableWork: {
        id: "letter-taskin-table-pages-18-19",
        title: "תסקין אותיות",
        sourcePages: [18, 19],
        arabicTitle: "تسكين الحروف",
        status: "needsVisualEncoding-advisorOnly",
        sourceStatus: "visible-table-found-but-not-fully-encoded",
        knownContext: [
          "השער עוסק בסידור אותיות על גבי הצורות.",
          "המחבר מציין שהתסקין המובא כאן אינו זהה לנוסח המחבר.",
          "מופיעה גם צורה הנקראת تسكين المجدولة.",
          "לצורות المنقلبة ניתנו שתי אותיות.",
          "הטבלה קיימת בעמודים 18–19, אבל השיוך המדויק של אות לצורה דורש קידוד חזותי."
        ],
        missingVisualEncoding: [
          "שיוך כל אות לצורה המתאימה.",
          "זיהוי הצורות הגרפיות שמתחת לאותיות.",
          "הבחנה בין התסקין הרגיל לבין تسكين المجدولة.",
          "בדיקת הצורות المنقلبة שיש להן שתי אותיות.",
          "אימות כל אות מול הסריקה לפני הכנסת מנוע."
        ],
        advisorUse: [
          "לשמור כידע מתקדם ליועץ.",
          "לא להציג בדוח לקוח כברירת מחדל.",
          "לא להפעיל מנוע אותיות עד טבלה מלאה ומאומתת."
        ],
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-foundation-qawl-jami-extra.js",
            "raml-data/raml-reading-foundations.js"
          ],
          rule: "אם קיימת טבלת אותיות ממקור אחר, לא למזג בלי השוואת אות-צורה-מקור."
        },
        encodedLetters: [],
        suggestedCode: {
          status: "needsVisualEncoding",
          tableType: "letterTaskin",
          letterToFigureMap: "undefined",
          figureToLettersMap: "undefined",
          invertedFiguresWithTwoLetters: "undefined",
          advisorOnly: true
        },
        implementationReady: false
      },

      pointPathWork: {
        id: "point-path-pages-15-18",
        title: "דרך הנקודה בדמיר",
        sourcePages: [15, 16, 17, 18],
        arabicTitle: "طريق النقطة",
        status: "advancedKnowledge-needsFormula",
        sourceStatus: "text-found-but-movement-formula-not-fully-defined",
        knownContext: [
          "דרך הנקודה היא אחת מדרכי استخراج الضمير.",
          "המקור מתייחס לבית 15.",
          "מוליכים נקודת אש או נקודת עפר עד שהיא מתיישבת באמהות או בבנות.",
          "המחבר מציין שדרך הנקודה חזקה מן הדרכים האחרות.",
          "עדיין חסרה נוסחה מדויקת לקידוד תנועת הנקודה."
        ],
        missingFormula: [
          "איך בוחרים נקודת אש או נקודת עפר.",
          "מאיזה מקום בדיוק מתחילים בבית 15.",
          "באיזה סדר מוליכים את הנקודה.",
          "מה פירוש שתתיישב באמהות או בבנות.",
          "מה עושים אם יש כמה אפשרויות.",
          "איך ממפים את התוצאה לבית הדמיר או לצורה."
        ],
        advisorUse: [
          "לשמור כידע מתקדם ליועץ.",
          "לא להציג בדוח לקוח כברירת מחדל.",
          "לא להפעיל כמנוע חישוב עד נוסחה מלאה."
        ],
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-reading-foundations.js",
            "raml-data/raml-foundation-qawl-jami-extra.js"
          ],
          rule: "אם קיימת הולכת נקודות במקור אחר, לא למזג בלי השוואת נוסחה."
        },
        suggestedCode: {
          status: "needsFormula",
          sourceHouse: 15,
          pointTypes: ["fire", "earth"],
          movementOrder: "undefined",
          settlementTarget: ["mothers", "daughters"],
          output: "undefined"
        },
        implementationReady: false
      },

      damirWay2Work: {
        id: "damir-way2-page-14",
        title: "הדרך השנייה בדמיר",
        sourcePages: [14],
        arabicTitle: "الوجه الثاني في استخراج الضمير",
        arabicFormula: "تجمع نقط المسألة إلى خمسة عشر ثم اطرحهم ١٢",
        status: "needsFormula",
        sourceStatus: "text-found-but-calculation-not-fully-defined",
        knownContext: [
          "הדרך השנייה שייכת לפרק استخراج الضمير.",
          "הנוסח מדבר על جمع نقط المسألة — איסוף/סיכום נקודות השאלה.",
          "הנוסח מזכיר خمسة عشر ואז طرح 12.",
          "לא ברור עדיין האם הכוונה להוסיף עד 15, לקחת מנקודות השאלה עד 15, או לבצע שלב חישובי אחר.",
          "אין להפעיל את הדרך במנוע עד פירוש מדויק."
        ],
        missingFormula: [
          "מה בדיוק נספר תחת نقط المسألة.",
          "מה פירוש إلى خمسة عشر כאן.",
          "האם מפילים 12 אחרי השלמה ל־15 או מתוך סכום שהגיע ל־15.",
          "איך ממפים את השארית לבית.",
          "מה עושים בשארית 0."
        ],
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-reading-foundations.js",
            "raml-data/raml-foundation-qawl-jami-extra.js",
            "raml-data/raml-foundation-bulugh-al-amal.js"
          ],
          rule: "לא להחליף שיטות דמיר שכבר מאומתות; לשמור כדרך נוספת שדורשת נוסחה."
        },
        engineDecision: [
          "לא להפעיל במנוע.",
          "להציג כידע מתקדם ליועץ בלבד.",
          "לפתוח להפעלה רק אחרי אימות נוסחה מהמקור או מקור מאושר נוסף."
        ],
        suggestedCode: {
          status: "needsFormula",
          countQuestionPoints: "undefined",
          toFifteenMeaning: "undefined",
          dropBase: 12,
          remainderMapping: "undefined",
          remainderZero: "blockedUntilSource"
        },
        implementationReady: false
      },

      dropNineSixSevenWork: {
        id: "drop-9-6-7-pages-11-12",
        title: "הפלות לפי 9 / 6 / 7",
        sourcePages: [11, 12],
        arabicTerms: [
          "إسماط",
          "إسقاط",
          "طرح",
          "الباقي",
          "على ٩",
          "على ٦",
          "على ٧"
        ],
        status: "blockedUntilSource",
        sourceStatus: "not-found-in-bulugh-pages-11-12",
        knownContext: [
          "בפרק معرفة كم العدد والمدد נמצא שימוש מפורש בהפלה לפי 12.",
          "החילוץ לא מצא בעמודים 11–12 כלל מפורש להפלה לפי 9.",
          "החילוץ לא מצא בעמודים 11–12 כלל מפורש להפלה לפי 6.",
          "החילוץ לא מצא בעמודים 11–12 כלל מפורש להפלה לפי 7.",
          "לפי 15 ו־16 יש הקשרים בהמשך בפרקי הדמיר, אבל לא כאן ככלל כללי."
        ],
        engineDecision: [
          "לא להפעיל הפלות לפי 9/6/7 מתוך מקור זה.",
          "לא למחוק את האפשרות, כי היא קיימת כמטרה פתוחה ממקורות אחרים.",
          "אם יימצא מקור מפורש אחר — להוסיף sourceVariant ולא להחליף בלי בדיקה."
        ],
        suggestedCode: {
          drop9: "blockedUntilSource",
          drop6: "blockedUntilSource",
          drop7: "blockedUntilSource",
          doNotInferFromDrop12: true
        },
        implementationReady: false
      },

      remainderZeroWork: {
        id: "remainder-zero-pages-11-12",
        title: "שארית 0 בהפלות",
        sourcePages: [11, 12],
        arabicTerms: [
          "الباقي",
          "باقي",
          "إسقاط",
          "إسماط",
          "طرح العدد"
        ],
        status: "blockedUntilSource",
        sourceStatus: "not-found-as-explicit-rule-in-this-range",
        knownContext: [
          "בפרק معرفة كم العدد والمدد נמצא שימוש בהפלה לפי 12.",
          "נמצא שמחשבים מספר/משך ומחלקים את השארית על הבתים.",
          "לא נמצא כלל מפורש מה עושים כאשר השארית היא 0.",
          "אין להניח אוטומטית ש־0 = 12 או 0 = הבית האחרון בלי מקור מפורש."
        ],
        relatedRules: [
          "durationAndNumberRules",
          "drop-by-12",
          "damir-way1",
          "ismatat-atrohat"
        ],
        engineDecision: [
          "לא להפעיל טיפול בשארית 0 במנוע.",
          "אם חישוב מחזיר 0, להחזיר status blockedUntilSource.",
          "להציג ליועץ שהמקור אינו נותן כלל מפורש לשארית 0.",
          "אפשר להוסיף בהמשך sourceVariant אם מקור אחר אומר ש־0 שייך לבית 12/16/15."
        ],
        suggestedCode: {
          remainderZero: "blockedUntilSource",
          doNotMapZeroAutomatically: true,
          possibleFutureVariants: [
            "zeroAsLastHouse",
            "zeroAsFullCycle",
            "zeroRequiresRecast",
            "zeroHasSpecialJudgment"
          ]
        },
        implementationReady: false
      },

      directionsTableWork: {
        id: "directions-table-page-11",
        title: "טבלת כיווני הצורות",
        sourcePages: [11],
        arabicTitle: "جهات الأشكال",
        status: "needsVisualEncoding",
        sourceStatus: "visible-scan-but-not-fully-encoded",
        purpose: [
          "جهة الخبية — כיוון דבר נסתר / מוחבא",
          "جهة ضائع — כיוון דבר שאבד",
          "جهة مسؤول عنه — כיוון הנשאל עליו"
        ],
        knownRules: [
          "המקור מציג טבלה של כיווני הצורות.",
          "הכיוונים משמשים לאיתור דבר נסתר, דבר אבוד או הנשאל עליו.",
          "אין לקודד כיוון לצורה בלי פענוח חזותי ודאי של הטבלה."
        ],
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-forms-basic.js",
            "raml-data/raml-forms-profiles.js",
            "raml-data/raml-reading-foundations.js",
            "raml-data/raml-foundation-qawl-jami-extra.js"
          ],
          rule: "אם קיימים כיוונים ממקור קודם, אין להחליף אותם; יש לסמן sourceSupport או sourceVariant אחרי קידוד חזותי."
        },
        encodedDirections: [],
        engineUse: "blockedUntilVisualEncodingAndDuplicateCheck",
        implementationReady: false
      },

      witnessFormulaWork: {
        id: "witness-formula-page-10",
        title: "נוסחת העדים — شاهد كل شكل ثالثة",
        sourcePages: [10],
        arabicTitle: "الشواهد",
        status: "needsFormula",
        sourceStatus: "textual-rule-found-but-formula-not-fully-defined",
        arabicTerms: [
          "الشواهد",
          "شاهد كل شكل ثالثة",
          "قاضي المسألة"
        ],
        knownRules: [
          "העדים הם עדי השאלה בטוב וברע.",
          "לכל צורה יש עד שלישי ממנה — شاهد كل شكل ثالثة.",
          "אם העדים והחاكم מסכימים בסעד — חותכים להשגת המבוקש.",
          "אם העדים חולקים — חוזרים אל قاضي المسألة."
        ],
        missingFormula: [
          "להגדיר בדיוק מה פירוש 'עד שלישי' לכל צורה.",
          "האם מחשבים לפי ספירה מחזורית של צורות.",
          "האם מחשבים לפי טבלת צורות קבועה.",
          "האם מתייחסים לבית שבו הצורה עומדת או לצורה עצמה בלבד."
        ],
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-reading-foundations.js",
            "raml-data/raml-foundation-qawl-jami-extra.js"
          ],
          rule: "לא להחליף את מערכת העדים הקיימת; לשמור כנוסחת מקור שדורשת אימות."
        },
        engineUse: "blockedUntilFormula",
        implementationReady: false
      },

      fortuneCategoryTable: {
        id: "fortune-category-table-pages-8-9",
        title: "טבלת סעד / נחס / ממוזג / נוטה לסעד / נוטה לנחס",
        sourcePages: [8, 9],
        arabicTitle: "الأشكال السعيدة والنحس والممتزجة والمائلة إلى السعد والمائلة إلى النحس",
        status: "needsVisualEncoding",
        sourceStatus: "visible-scan-but-not-fully-encoded",
        duplicateCheck: {
          existingFilesToCompare: [
            "raml-data/raml-forms-basic.js",
            "raml-data/raml-forms-profiles.js",
            "raml-data/raml-foundation-qawl-jami-extra.js"
          ],
          rule: "לא ליצור סטטוס טוב/רע כפול לצורה שכבר קיימת; להשתמש רק כ-sourceSupport או sourceVariant אחרי קידוד חזותי."
        },
        knownCategories: [
          {
            arabic: "سعيدة",
            hebrew: "סעד / טוב",
            encodedFigures: [],
            status: "needsVisualEncoding"
          },
          {
            arabic: "نحس",
            hebrew: "נחס / רע",
            encodedFigures: [],
            status: "needsVisualEncoding"
          },
          {
            arabic: "ممتزجة",
            hebrew: "ממוזג / ביניים",
            encodedFigures: [],
            status: "needsVisualEncoding"
          },
          {
            arabic: "مائلة إلى السعد",
            hebrew: "נוטה לסעד",
            encodedFigures: [],
            status: "needsVisualEncoding"
          },
          {
            arabic: "مائلة إلى النحس",
            hebrew: "נוטה לנחס",
            encodedFigures: [],
            status: "needsVisualEncoding"
          }
        ],
        verifiedTextualRules: [
          "הצורות נחלקות לסעד, נחס, ממוזגות, נוטות לסעד ונוטות לנחס.",
          "המקור מציין: الصحيح أن الكوسج سعيد مائل إلى النحس.",
          "אם מצטרפים סעד, נחס וממוזג — יש כלל הכרעה לפי הרכב הצורות.",
          "אין להחליף את סיווגי הצורות הקיימים עד קידוד חזותי מלא והשוואה מול המקורות הקודמים."
        ],
        explicitNotes: {
          "الكوسج": {
            arabic: "سعيد مائل إلى النحس",
            hebrew: "טוב אבל נוטה לנחס",
            status: "verified-text-note"
          }
        },
        engineUse: "blockedUntilVisualEncodingAndDuplicateCheck",
        implementationReady: false
      }
    },

    openIssuesFromExtraction: [
      { id: "gender-inside-outside-table", title: "טבלת זכר/נקבה/פנימי/חיצוני", status: "needsVisualEncoding", pages: [8] },
      { id: "fortune-category-table", title: "טבלת סעד/נחס/ממוזג", status: "needsVisualEncoding", pages: [8,9] },
      { id: "witness-formula", title: "עדים — شاهد كل شكل ثالثة", status: "needsFormula", pages: [10] },
      { id: "directions-table", title: "כיווני הצורות", status: "needsVisualEncoding", pages: [11] },
      { id: "remainder-zero", title: "שארית 0", status: "blockedUntilSource", pages: [11,12] },
      { id: "drop-9-6-7", title: "הפלות לפי 9/6/7", status: "blockedUntilSource", pages: [11,12] },
      { id: "damir-way2", title: "הדרך השנייה בדמיר", status: "needsFormula", pages: [14] },
      { id: "point-path", title: "דרך הנקודה", status: "needsFormula", pages: [15,16,17,18] },
      { id: "letter-taskin-table", title: "תסקין אותיות", status: "needsVisualEncoding", pages: [18,19] },
      { id: "name-way1", title: "اشتقاق الاسم דרך ראשונה", status: "needsFormula", pages: [19] }
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
