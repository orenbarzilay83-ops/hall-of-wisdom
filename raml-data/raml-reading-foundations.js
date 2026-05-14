// גורל החול — ספר חוקי היסוד
// מקורות עבודה: الفلك المشحون في علم الرمل المصون + القول الجامع
// קובץ ידע בלבד. לא מנוע חישוב.
// לא מכניסים כאן דיני שאלות פרטיות כמו מסחר/חולי/גניבה — זה יבוא בקובץ נפרד.

const RAML_READING_FOUNDATIONS = {
  metadata: {
    id: "raml-reading-foundations",
    title: "חוקי היסוד של גורל החול",
    version: "v1",
    status: "working-source-verified-plus-needs-verification",
    notes: [
      "הקובץ הזה מרכז את חוקי המבנה והקריאה לפני דיני נושאים פרטיים.",
      "חוקים שלא נסגרו במקור מסומנים needsVerification ולא נכנסים ללוגיקת מנוע עד אימות.",
      "אין כאן פסילה אוטומטית של חזרת צורות באמהות עד שיימצא מקור מפורש."
    ]
  },

  boardStructure: {
    id: "board-structure",
    title: "מבנה הלוח",
    ruleType: "structure",
    sourceStatus: "verified",
    houses: {
      mothers: [1, 2, 3, 4],
      daughters: [5, 6, 7, 8],
      nieces: [9, 10, 11, 12],
      witnesses: [13, 14],
      judge: 15,
      sentence: 16
    },
    explanationHebrew: [
      "הלוח בנוי מארבע אמהות, ארבע בנות, ארבע נכדות, שני עדים, שופט ומשפט.",
      "הבתים 13–16 אינם בתים רגילים בלבד אלא עדים, שופט ומשפט."
    ],
    implementationReady: true
  },

  houseStrengthGroups: {
    id: "house-strength-groups",
    title: "יתדות, מוואיל, סוואקט, עדים",
    ruleType: "structure",
    sourceStatus: "verified",
    groups: {
      awtad: {
        arabic: "الأوتاد",
        hebrew: "היתדות",
        houses: [1, 4, 7, 10],
        strength: "חזקים ביותר",
        time: "הווה / מצב קיים",
        meaning: "הבתים החזקים ביותר. מהם לומדים את מצב הדבר בהווה."
      },
      mawail: {
        arabic: "الموائل",
        hebrew: "המוואיל / הבאים אחרי היתדות",
        houses: [2, 5, 8, 11],
        strength: "בינוני־חזק",
        time: "עתיד",
        meaning: "מה שבא אחרי היתדות. מהם לומדים את העתיד והמתהווה."
      },
      sawaqit: {
        arabic: "السواقط",
        hebrew: "הסוואקט / הנופלים",
        houses: [3, 6, 9, 12],
        strength: "חלשים",
        time: "עבר",
        meaning: "שלישי היתדות. מהם לומדים את העבר או דבר שנפל/נחלש."
      },
      witnessesAndRuling: {
        hebrew: "עדים, שופט ומשפט",
        houses: [13, 14, 15, 16],
        strength: "מכריעים לפי תפקיד",
        time: "סיכום / הכרעה / אחרית",
        meaning: "עד ראשון, עד שני, שופט ומשפט."
      }
    },
    implementationReady: true
  },

  pastPresentFutureRule: {
    id: "past-present-future-awtad-sawaqit-mawail",
    title: "עבר / הווה / עתיד",
    ruleType: "interpretation",
    sourceStatus: "verified",
    logic: {
      present: "awtad",
      past: "sawaqit",
      future: "mawail"
    },
    explanationHebrew: [
      "את מצב הדבר בהווה לומדים מן היתדות.",
      "את עברו לומדים מן הסוואקט, שהם שלישי היתדות.",
      "את עתידו לומדים מן המוואיל, כלומר מה שבא אחרי היתדות."
    ],
    implementationReady: true
  },

  happyAndHardHouses: {
    id: "happy-hard-houses",
    title: "בתים מאושרים ובתים קשים",
    ruleType: "house-quality",
    sourceStatus: "verified-working",
    happyHouses: {
      houses: [1, 2, 5, 7, 10, 11, 13, 15],
      hebrew: "בתים מאושרים",
      meaning: "בתים הנחשבים טובים/מסייעים לפי חלוקת הספר."
    },
    hardHouses: {
      houses: [3, 6, 8, 9, 12, 14, 16],
      hebrew: "בתים קשים / נחשיים",
      meaning: "בתים הנחשבים קשים, מחלישים, מונעים או מצביעים על קושי לפי חלוקת הספר."
    },
    implementationReady: true
  },

  relativeHouseRule: {
    id: "relative-house-counting",
    title: "דין בית ביחס לבית אחר",
    ruleType: "derived-houses",
    sourceStatus: "verified-working",
    rules: [
      { offset: 2,  meaning: "ממון הבית / רכושו / מה שיש לו" },
      { offset: 3,  meaning: "תנועה, עדות, מסר או שינוי של הבית" },
      { offset: 4,  meaning: "אחרית קטנה / שורש / סוף קטן של הבית" },
      { offset: 5,  meaning: "שמחה, ילדים, פרי, תענוג וסעד של הבית" },
      { offset: 6,  meaning: "מחלה, חולשה, נחס, סוד או עבדות של הבית" },
      { offset: 7,  meaning: "המבוקש, בן הזוג, היריב, השותף או מי שמול הבית" },
      { offset: 8,  meaning: "מוות, הפסד, פחד, חוב או נפילה של הבית" },
      { offset: 9,  meaning: "נסיעה, היעדרות, דרך רחוקה או עניין רוחני של הבית" },
      { offset: 10, meaning: "כבוד, שלטון, מעמד, עבודה או רוממות של הבית" },
      { offset: 11, meaning: "תקווה, משאלה, חברים, עזרה ושמחה של הבית" },
      { offset: 12, meaning: "אויבים, מניעות, פחדים והסתרות של הבית" },
      { offset: 13, meaning: "השתדלות / עדות פנימית של הבית" },
      { offset: 14, meaning: "מניעה, עצירה, חסימה או החזקה של הבית" },
      { offset: 15, meaning: "השולט עליו / שמחה גדולה / הכרעה ביחס לבית" },
      { offset: 16, meaning: "סיום, פירוק, הפסקה ואחרית של הבית" }
    ],
    implementationReady: true
  },

  figureRepetitionRules: {
    id: "figure-repetition",
    title: "חזרת צורות בלוח",
    ruleType: "repetition",
    sourceStatus: "verified-partial",
    verifiedRules: [
      "חזרת צורה אינה פסילה אוטומטית.",
      "חזרת צורה משמשת לפעמים לחישוב כיוון.",
      "אם צורה חוזרת באמהות ובנכדות/אזור — הכיוון יכול להיות משולב, כגון מזרח־צפון.",
      "אם צורה חוזרת באמהות ובבנות — בודקים איזה בית חזק יותר; אם בית האמהות חזק יותר הכיוון מזרח, ואם בית הבנות חזק יותר הכיוון מערב.",
      "על אותו עיקרון מודדים חזרת צורה בבתים ובכיוונים לפי חוזק הבית."
    ],
    zoneDirections: {
      mothers: "מזרח",
      daughters: "מערב",
      nieces: "צפון",
      extraOrRulingArea: "דרום"
    },
    needsVerification: [
      "האם קיימת פסילה מיוחדת כאשר אותה צורה חוזרת באמהות כמה פעמים.",
      "האם פסילה כזו תלויה במספר החזרות, בזהות הצורה, או במצב השאלה.",
      "האם יש הבדל בין חזרת צורה באמהות בלבד לבין חזרה בכל הלוח."
    ],
    implementationReady: false,
    implementationNotes: "להכניס למנוע רק חישוב כיוון מחזרת צורות. לא להכניס פסילה עד אימות מקור מפורש."
  },

  chartValidityRules: {
    id: "chart-validity",
    title: "כשרות / אמינות הגורל",
    ruleType: "validity",
    sourceStatus: "verified-working",
    verifiedRules: [
      {
        id: "do-not-read-for-tester",
        title: "אין לשאול למי שבא לבחון או להתגרות",
        rule: "אם השואל בא לבחון, לנסות, להתגרות, לצחוק, להכחיש, להתנסות, או בלי שאלה אמיתית — אין להכות לו רמל.",
        implementationReady: true
      },
      {
        id: "repeat-reading-validation",
        title: "בדיקת אמת העבודה על ידי חזרה",
        rule: "אפשר לבדוק את صحة العمل על ידי הכאה פעם שנייה ושלישית: אם חוזרת אותה תשובה, או תשובה קרובה לה ואינה סותרת לגמרי — זה סימן שהעבודה נכונה.",
        implementationReady: false,
        implementationNotes: "לא להפוך מיד לכפתור אוטומטי. קודם לבנות מצב בדיקה שמריץ 2–3 לוחות ומשווה קרבה/סתירה."
      },
      {
        id: "do-not-exceed-three-per-day",
        title: "לא להכות יותר משלוש פעמים ביום",
        rule: "אין להכות יותר משלוש פעמים ביום אלא לצורך גדול / הכרח.",
        implementationReady: true
      },
      {
        id: "past-question-warning",
        title: "זהירות בשאלת עבר",
        rule: "אם השאלה עוסקת בעבר ונופלת בקבוצת הסוואקט/הנופלים, יש לחשוד שהשואל בוחן או מנסה את בעל הרמל.",
        implementationReady: false
      },
      {
        id: "judge-balance-error",
        title: "בדיקת המאזן / השופט",
        rule: "יש מקור על מצב שבו אם המאזן/השופט יוצא באופן מסוים יש טעות בעבודה וצריך לחזור להולדה.",
        implementationReady: false,
        needsExactSourceText: true
      }
    ],
    needsVerification: [
      "נוסח מלא של בדיקת פסילת לוח.",
      "האם חזרת צורות באמהות פוסלת או רק מחלישה.",
      "מה בדיוק התנאי שבו השופט/המאזן מורה על טעות בלוח.",
      "האם יש סימן שהגורל סגור / לא מדבר.",
      "איך למדוד בקוד 'תשובה קרובה' או 'תשובה סותרת' בבדיקת 2–3 לוחות."
    ],
    implementationReady: false
  },

  workingConditions: {
    id: "working-conditions",
    title: "תנאים לפני הכאת הטכת",
    ruleType: "pre-reading",
    sourceStatus: "verified-working",
    conditions: [
      "להיות לבד / במקום פרטי.",
      "להיות בטהרה מלאה.",
      "להיות במקום שקט.",
      "לפנות לכיוון הקיבלה לפי המקור הערבי.",
      "לנקות את המחשבה לגמרי.",
      "לא לדבר בזמן הכאת השאלה.",
      "לא להכות יותר משלוש פעמים ביום אלא לצורך גדול.",
      "לא להשתמש בזה לצחוק, לעג, סרק או התגרות.",
      "להכות רק ביום בהיר / בזמן מתאים.",
      "לא להכות למכחיש.",
      "לא להכות לכופר בדבר.",
      "לא להכות למלגלג.",
      "לא להכות למי שבא לנסות.",
      "לא להכות למי שבא לבחון.",
      "לא להכות למי שאין לו ודאות או רצינות בשאלה.",
      "לא להכות במצב שאינו טהור.",
      "לא להכות במקום שאינו שקט.",
      "לא להכות בזמן ענן.",
      "לא להכות בזמן גשם.",
      "לא להכות בזמן רוח.",
      "לא להכות בזמן זריחה.",
      "לא להכות בזמן שקיעה."
    ],
    implementationReady: false,
    implementationNotes: "באפליקציה זה יהיה בעתיד צ׳קליסט לפני קריאה, לא חסימה קשיחה בשלב ראשון."
  },

  damirAlSail: {
    id: "damir-al-sail",
    title: "ضمير السائل — דמיר / מצפון השואל",
    ruleType: "damir",
    sourceStatus: "verified-working",
    description: "הדמיר הוא גילוי הדבר הפנימי שעליו השואל באמת שואל. אין להכניס אותו כפרשנות אחת קצרה; יש כמה דרכים להוציא אותו.",

    verifiedMethods: [
      {
        id: "damir-from-total-open-count",
        title: "דמיר השואל ממספר مفتוח הרמל כולו",
        sourceBook: "الفلك المشحون",
        formulaHebrew: [
          "לוקחים את מספר مفتוח הרמל כולו.",
          "מפילים אותו 15־15.",
          "את השארית מוליכים על הצורות מתחילת הטכת.",
          "המקום שבו המספר נעצר — שם נמצא הדמיר.",
          "הדמיר יכול להתברר דרך הצורה עצמה, הבית שבו נעצר, או בעל הבית."
        ],
        implementationReady: false,
        needsExactDefinition: [
          "צריך להגדיר בקוד בדיוק מהו عدد مفتوح الرمل كله.",
          "צריך להגדיר איך הולכים על הצורות: האם מתחילים מבית 1 כולל, ומה עושים אם השארית 0."
        ]
      },
      {
        id: "damir-queried-from-128-minus-open-count",
        title: "דמיר הנשאל עליו מ־128 פחות מספר مفتוח הרמל",
        sourceBook: "الفلك المشحون",
        formulaHebrew: [
          "לידיעת הנשאל עליו: מחסרים את מספר مفتוח הרמל מן 128.",
          "את היתרה מפילים 15־15.",
          "עם השארית השנייה הולכים מתחילת הטכת.",
          "המקום שבו המספר נעצר — שם הדמיר של הנשאל עליו, או הבית, או בעל הבית."
        ],
        implementationReady: false,
        needsExactDefinition: [
          "צריך להגדיר בקוד عدد مفتوح الرمل.",
          "צריך להגדיר שארית 0.",
          "צריך להגדיר במדויק בעל הבית לפי תסקין."
        ]
      },
      {
        id: "damir-thalith-method",
        title: "דרך השליש / طريقة الثليث",
        sourceBook: "الفلك المشحون",
        formulaHebrew: [
          "הדרך נקראת طريقة الثليث.",
          "הדמיר אינו יוצא משלושה מקומות: הצורה / הבית / בעל הבית.",
          "בודקים איפה חלה הצורה וכמה עברה מביתה.",
          "אם חלה בבית 1, 2, 3, 4, 5, 7, 9, 10, 11 או 15 — זה סימן כוח ואושר.",
          "אם חלה בבית 6, 8, 12 או 14 — זה סימן רדייה, חולשה וקושי."
        ],
        strongHouses: [1, 2, 3, 4, 5, 7, 9, 10, 11, 15],
        weakHouses: [6, 8, 12, 14],
        implementationReady: false,
        needsVerification: [
          "מה דין בית 13 ובית 16 בשיטה זו — המקור בקטע שנמצא לא מזכיר אותם במפורש."
        ]
      }
    ],

    additionalMethodsFromQawlJami: [
      {
        id: "damir-from-nar-hafidat-times-turab",
        title: "חיבור אש הנכדות עם עפרן",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-mizan",
        title: "מאזן הרמל הוא הדמיר",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-first-four-elements",
        title: "אש הראשון, אוויר השני, מים השלישי, עפר הרביעי יוצרים צורה והיא הדמיר",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-nar-awtad",
        title: "אש היתדות — בו הדמיר",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-1x7x15",
        title: "הכאת 1×7×15 — בו הדמיר",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-tasyir-point",
        title: "תוצאת הכאת הצורות שעליהן עמד תסייר הנקודה — בו הדמיר",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-open-count-to-mizan",
        title: "סופרים כל הרמל, יחיד וזוגי, עד המאזן ומפילים 15־15",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-nar-awtad-times-turab-awtad",
        title: "חיבור צורת אש היתדות עם צורת עפר היתדות",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-cross-triangle",
        title: "חיבור مثلثة الصليب: נהמת האמהות עם תמכן האמהות",
        status: "verified-text-needs-formula"
      },
      {
        id: "damir-from-repeat-first",
        title: "בית חזרת הראשון — בו הדמיר גם כן",
        status: "verified-text-needs-formula"
      }
    ],

    implementationReady: false,
    notes: [
      "לא לקודד דמיר לפני שמגדירים את המונחים המספריים בדיוק.",
      "הדמיר ישמש לזיהוי השאלה האמיתית של השואל לפני דיני נושאים.",
      "כרגע מכניסים את השיטות כידע מאומת/דורש נוסחה, לא כמנוע פעיל."
    ]
  },

  seekerAndQueriedParts: {
    id: "seeker-queried-parts",
    title: "חלק השואל וחלק הנשאל עליו",
    ruleType: "comparison",
    sourceStatus: "verified",
    elements: {
      fire: "نظر / מבט",
      air: "نطق / דיבור",
      water: "اتصال / חיבור",
      earth: "انفصال / ניתוק"
    },
    ruleHebrew: [
      "משווים את חלק השואל מול חלק הנשאל עליו.",
      "ריבוי אש מורה על כוח המבט / הרצון / התביעה.",
      "ריבוי אוויר מורה על כוח הדיבור.",
      "ריבוי מים מורה על כוח החיבור.",
      "ריבוי עפר מורה על כוח הניתוק.",
      "מי שמספרו גדול יותר באותו יסוד — ידו חזקה יותר באותו עניין.",
      "אם המספרים שווים — יש שוויון בין הצדדים באותו עניין."
    ],
    implementationReady: true
  },

  nazarNutqIttisalInfisal: {
    id: "nazar-nutq-ittisal-infisal",
    title: "نظر / نطق / اتصال / انفصال",
    ruleType: "core-interpretation",
    sourceStatus: "verified-working",
    mapping: {
      seeker: {
        nazar: { arabic: "نظر السائل", hebrew: "מבט השואל", houses: [1, 13], element: "אש" },
        nutq: { arabic: "نطق السائل", hebrew: "דיבור השואל", houses: [2, 14], element: "אוויר" },
        ittisal: { arabic: "اتصال السائل", hebrew: "חיבור השואל", houses: [3, 15], element: "מים" },
        infisal: { arabic: "انفصال السائل", hebrew: "ניתוק השואל", houses: [4, 16], element: "עפר" }
      },
      queried: {
        note: "לנשאל עליו יש נוסחאות מקבילות לפי חלקו; להכניס רק אחרי חילוץ מלא."
      }
    },
    ruleHebrew: [
      "כאשר הדין עומד על בית מסוים מוציאים ממנו את מבטו, דיבורו, חיבורו וניתוקו.",
      "אם הצורה היוצאת נמצאת בלוח בגלוי או בנסתר — הדין קיים.",
      "אם אינה נמצאת לא בגלוי ולא בנסתר — הדין אינו קיים."
    ],
    implementationReady: false,
    needsVerification: [
      "להשלים במדויק את נוסחת הנשאל עליו.",
      "להשלים מה פירוש גלוי/נסתר לפי המקור."
    ]
  },

  aspectRules: {
    id: "house-aspects",
    title: "יחסי מבט בין בתים",
    ruleType: "aspects",
    sourceStatus: "verified-working",
    rules: [
      {
        id: "no-aspect-adjacent",
        title: "אין מבט לשני הבתים הסמוכים",
        rule: "בית אינו מתחבר לשני הבתים הסמוכים לו מלפניו ומאחוריו."
      },
      {
        id: "no-aspect-around-seventh",
        title: "אין מבט לסמוכים לשביעי שלו",
        rule: "בית אינו מתחבר לשני הבתים הסמוכים לשביעי שלו."
      },
      {
        id: "tasdis",
        arabic: "تسديس",
        hebrew: "תסדיס",
        housesFromBase: [3, 11],
        meaning: "קשר מסייע / צדדי"
      },
      {
        id: "tarbi",
        arabic: "تربيع",
        hebrew: "ריבוע",
        housesFromBase: [4, 10, 16],
        meaning: "קשר חזק, שורשי או מכריע לפי ההקשר"
      },
      {
        id: "muqabala",
        arabic: "مقابلة",
        hebrew: "מול / مقابلة",
        housesFromBase: [7, 14],
        meaning: "עוינות שלמה וקשה / דבר שמולו"
      },
      {
        id: "tathlith",
        arabic: "تثليث",
        hebrew: "משולש",
        housesFromBase: [5, 9],
        meaning: "קשר טבעי/מסייע לפי ההקשר"
      }
    ],
    implementationReady: true
  },

  connectionRules: {
    id: "connection-rules",
    title: "חיבור / ניתוק בין בתים וצורות",
    ruleType: "connection",
    sourceStatus: "verified-working",
    rules: [
      "חיבור בתים נעשה כאשר אותה צורה חוזרת בבתים שונים.",
      "אם אותה צורה חוזרת בבתים טובים — זה חיבור טוב.",
      "אם אותה צורה חוזרת בבתים רעים — זה חיבור רע.",
      "צורות רעות בבתי רוע מורות על רוע שלם וקושי גדול.",
      "צורות טובות בבתי טוב מורות על טוב, שמחה, השגת רצון ומילוי צורך.",
      "צורות טובות בבתי רוע עלולות להורות על הבטחות שקריות, שמחה בתחילה וצער בסוף.",
      "צורות רעות בבתי טוב מורות על קלקול הנושא, מיעוט טוב ומיעוט תועלת.",
      "החיבור מערב את דלאלת הבית עם הבית האחר דרך הצורה המשותפת."
    ],
    implementationReady: true
  },

  judgeAndSentenceRules: {
    id: "judge-and-sentence",
    title: "עדים, שופט ומשפט",
    ruleType: "ruling",
    sourceStatus: "verified-working",
    houses: {
      firstWitness: 13,
      secondWitness: 14,
      judge: 15,
      sentence: 16
    },
    rules: [
      "בית 13 הוא עד ראשון ומורה על השואל, כוונתו וסוד נפשו.",
      "בית 14 הוא עד שני ומורה על הנשאל עליו, הדבר המבוקש או המניעה.",
      "בית 15 הוא השופט, המאזן וההכרעה המרכזית.",
      "בית 16 הוא המשפט / אחרית הדבר / השפעת הדין.",
      "אין לפרש את השופט לבדו בלי העדים והמשפט."
    ],
    implementationReady: true
  },

  seekerQuestionSource: {
    id: "seeker-question-source",
    title: "מאיזה בתים יוצאת שאלת השואל",
    ruleType: "question-source",
    sourceStatus: "verified",
    rules: [
      "שאלת השואל יוצאת מבתי הפרט: 1, 3, 5, 7, 9, 11, 13, 15.",
      "שאלת הנשאל עליו יוצאת מבתי הזוג: 2, 4, 6, 8, 10, 12, 14, 16.",
      "הבתים הפרטיים הם זכריים.",
      "הבתים הזוגיים הם נקביים."
    ],
    implementationReady: true
  },

  lightHeavyRules: {
    id: "light-heavy-rules",
    title: "קל וכבד בגורל",
    ruleType: "foundation-measure",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified-working",
    terminology: {
      arabicLight: "خفيف",
      arabicHeavy: "ثقيل",
      hebrewLight: "קל",
      hebrewHeavy: "כבד"
    },
    ruleHebrew: [
      "לבדיקת קלות או כבדות הדבר לוקחים צורה מאש היתדות וצורה מעפר היתדות.",
      "מחברים / ממזגים את שתי הצורות.",
      "מתוך הצורה היוצאת דנים אם הדבר קל או כבד.",
      "החוק עדיין דורש הגדרת קוד מדויקת: מה בדיוק נקרא אש היתדות ומה בדיוק נקרא עפר היתדות בלוח הגורל."
    ],
    implementationReady: false,
    needsExactFormula: [
      "להגדיר איך מוציאים צורה מאש היתדות.",
      "להגדיר איך מוציאים צורה מעפר היתדות.",
      "להגדיר האם המיזוג הוא חיבור רמלי רגיל.",
      "להגדיר טבלת תוצאה: אילו צורות קלות ואילו כבדות."
    ]
  },

  visibleHiddenRules: {
    id: "visible-hidden-rules",
    title: "נראה / נעלם",
    ruleType: "foundation-measure",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified-working",
    terminology: {
      visible: "נראה / גלוי",
      hidden: "נעלם / נסתר"
    },
    ruleHebrew: [
      "לבדיקת דבר נראה או נעלם לוקחים צורה מאש האזור / הנכדות וצורה מעפר האזור.",
      "מחברים / ממזגים את שתי הצורות.",
      "לפי הצורה היוצאת יודעים אם הדבר נראה או נעלם.",
      "החוק חשוב במיוחד לאבדה, גניבה, נעדר ודבר מוסתר."
    ],
    implementationReady: false,
    needsExactFormula: [
      "להגדיר מהו אש האזור / הנכדות לפי סדר הלוח.",
      "להגדיר מהו עפר האזור.",
      "להגדיר האם החיבור הוא חיבור רמלי רגיל.",
      "להגדיר טבלת הצורות שמורות על גלוי מול נסתר."
    ]
  },

  incomingTimeRules: {
    id: "incoming-time-rules",
    title: "מה שבא בזמן — ימים / שבועות / חודשים / שנים",
    ruleType: "timing",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified-working",
    ruleHebrew: [
      "יש שער העוסק בידיעת הדבר הבא בכל הזמנים.",
      "המקור מחלק זמן לפי יום, שבוע, חודש ושנה.",
      "בודקים את הצורה היוצאת ואת מקומה בתוך לוח הגורל.",
      "הדין תלוי גם בסעד/נחס של הצורה ובמצבה בשלוש הבחינות."
    ],
    implementationReady: false,
    needsExactFormula: [
      "לחלץ את רשימת הבתים או הצורות השייכות ליום.",
      "לחלץ את רשימת הבתים או הצורות השייכות לשבוע.",
      "לחלץ את רשימת הבתים או הצורות השייכות לחודש.",
      "לחלץ את רשימת הבתים או הצורות השייכות לשנה.",
      "להגדיר מה פירוש שלוש הבחינות שבהן בודקים סעד ונחס."
    ]
  },

  illnessFoundationRules: {
    id: "illness-foundation-rules",
    title: "חוקי יסוד לשאלת חולי",
    ruleType: "topic-foundation",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified-working",
    rules: [
      {
        id: "illness-awtad-sawaqit-mawail",
        title: "מצב החולה, עברו ועתידו",
        ruleHebrew: [
          "בשאלה על חולי לוקחים את היתדות לדעת את מצבו.",
          "את עברו לומדים מן הסוואקט, שהם שלישי היתדות.",
          "את עתידו לומדים מן המוואיל, כלומר מה שבא אחרי היתדות.",
          "בודקים את הצורות היחידות והזוגיות ומה יצא, באיזה בית יצא, ומה יש לו מן הימים."
        ],
        implementationReady: false
      },
      {
        id: "illness-recovery-by-position",
        title: "האם החולה מתרפא לפי מקום הצורה",
        ruleHebrew: [
          "מוציאים צורה מהאוויר של האוויר.",
          "מחפשים את אותה צורה בלוח הגורל.",
          "אם נמצאת ביתדות — החולה מתרפא.",
          "אם נמצאת במוואיל — המחלה מתארכת.",
          "אם נמצאת בסוואקט — החולה מת במחלתו.",
          "אין לשכוח את טוב/רע של הצורה, כי לזה חשיבות גדולה מאוד בנושא זה."
        ],
        implementationReady: false,
        needsExactFormula: [
          "להגדיר מהו אוויר האוויר.",
          "להגדיר כיצד מוציאים ממנו צורה."
        ]
      },
      {
        id: "illness-houses",
        title: "בתי החולי",
        ruleHebrew: [
          "בית 1 — החולה.",
          "בית 4 — העילה / השורש.",
          "בית 6 — סיבות המחלה.",
          "בית 7 — התרופה; אם הוא טוב הדבר מורה על התאמת התרופה למחלת החולה.",
          "בית 10 — הרופא; טובו מורה על טוב הרופא, ורעתו להפך."
        ],
        implementationReady: true
      }
    ]
  },

  absentArrivalDirectionRules: {
    id: "absent-arrival-direction-rules",
    title: "נעדר — יבוא ביבשה, בים או באוויר",
    ruleType: "topic-foundation",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified-working",
    ruleHebrew: [
      "בשאלה אם הנעדר יבוא ביבשה, בים או באוויר, מכים לוח גורל על הדמיר הזה.",
      "לוקחים את מספר נקודות האוויר, המים והעפר מצורות לוח הגורל, כל אחד בפני עצמו.",
      "היסוד שיש לו המספר הרב ביותר — בו יבוא הנעדר.",
      "דרך נוספת: מוציאים צורה מבתי האוויר וצורה מבתי העפר, מכים את שתיהן זו בזו, ואת היוצא מכים בשלישי.",
      "אם היוצא האחרון מזג את צורת האוויר — יבוא באוויר.",
      "אם מזג את המים — יבוא בים.",
      "אם מזג את העפר — יבוא ביבשה."
    ],
    implementationReady: false,
    needsExactFormula: [
      "להגדיר בדיוק איך סופרים נקודות אוויר/מים/עפר בכל לוח הגורל.",
      "להגדיר מהם בתי האוויר, בתי המים ובתי העפר לפי המקור.",
      "להגדיר מה פירוש 'מזג' בקוד — האם זה חיבור רמלי רגיל או בדיקת שוויון צורה."
    ]
  },

  ramlCountingDefinitions: {
    id: "raml-counting-definitions",
    title: "הגדרות מספריות של לוח הגורל",
    ruleType: "calculation-foundation",
    sourceBook: "القول الجامع",
    sourceStatus: "verified-working",
    terminology: {
      board: "לוח הגורל",
      sourceArabicBoard: "التخت",
      openPoint: "נקודה יחידה / مفتوح",
      closedLine: "שתי נקודות / خط / مسدود",
      boardLayers: "64 שכבות",
      fullMaximum: 128
    },
    rules: [
      "לוח הגורל בנוי מ־16 בתים.",
      "בכל בית יש 4 שכבות / שורות.",
      "כל לוח הגורל הוא 16×4 = 64 שכבות.",
      "נקודה יחידה נחשבת 1.",
      "שתי נקודות / קו נחשבות 2.",
      "מספר פתוח הוא ספירת הנקודות היחידות.",
      "מספר סגור / מסדוד הוא סכום השורות הזוגיות כשהן נספרות כ־2.",
      "שטח לוח הגורל כולו הוא סכום כל השורות לפי נקודה=1 וקו=2.",
      "דרך מהירה: 128 פחות מספר הנקודות היחידות.",
      "דוגמה: אם יש 34 נקודות יחידות, אז 64-34=30 קווים זוגיים, ושטח הלוח הוא 34 + 30×2 = 94."
    ],
    implementationReady: true
  },

  damirCalculationDefinitions: {
    id: "damir-calculation-definitions",
    title: "הגדרות חישוב לדמיר",
    ruleType: "damir-calculation",
    sourceBook: "القول الجامع / الفلك المشحون",
    sourceStatus: "verified-working",
    definitions: {
      boardArea: "שטח לוח הגורל כולו לפי נקודה=1 וקו=2",
      openCount: "מספר הנקודות היחידות בלוח הגורל",
      closedCount: "מספר השורות הזוגיות כפול 2",
      fullBoardMaximum: 128,
      drop15: "הפלה 15־15",
      drop16: "הפלה 16־16",
      drop12: "הפלה 12־12",
      drop9: "הפלה 9־9",
      drop6: "הפלה 6־6"
    },
    verifiedFormulas: [
      {
        id: "full-board-area",
        title: "שטח לוח הגורל כולו",
        formulaHebrew: "סופרים את כל 64 השורות: נקודה=1, קו=2.",
        alternativeFormulaHebrew: "128 פחות מספר הנקודות היחידות.",
        implementationReady: true
      },
      {
        id: "closed-count",
        title: "מספר מסדוד / סגור",
        formulaHebrew: "סופרים את השורות הזוגיות ומכפילים ב־2.",
        implementationReady: true
      },
      {
        id: "damir-open-mothers-on-houses",
        title: "דמיר מסכום הנקודות הפתוחות באמהות",
        formulaHebrew: [
          "אוספים את הנקודות הפתוחות באמהות.",
          "מפילים / משליכים על הבתים.",
          "הבית שבו נעצרת הספירה מורה על הדמיר."
        ],
        implementationReady: false,
        needsExactImplementation: [
          "להגדיר האם הספירה על 12, 15 או 16 לפי הנוסח המדויק.",
          "להגדיר מה עושים בשארית 0."
        ]
      },
      {
        id: "damir-all-single-points-to-mizan",
        title: "דמיר מכל הנקודות היחידות עד המאזן",
        formulaHebrew: [
          "סופרים את כל הנקודות היחידות בלוח הגורל עד המאזן.",
          "מפילים 16־16 לפי נוסח אחד / 15־15 לפי נוסח אחר.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-all-mothers-points-drop16",
        title: "דמיר מכל נקודות האמהות",
        formulaHebrew: [
          "סופרים את כל נקודות האמהות, יחיד וזוגי.",
          "מפילים 16־16.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-awtad-points-drop12",
        title: "דמיר מנקודות היתדות",
        formulaHebrew: [
          "סופרים את נקודות היתדות, יחיד וזוגי.",
          "מפילים 12־12.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-board-area-drop9",
        title: "דמיר משטח לוח הגורל בהפלת 9־9",
        formulaHebrew: [
          "מחשבים את שטח לוח הגורל.",
          "מפילים 9־9.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-open-fire-drop9",
        title: "דמיר ממפתוח האש בהפלת 9־9",
        formulaHebrew: [
          "לוקחים את מפתוח האש בלוח הגורל.",
          "מפילים 9־9.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-open-fire-air-drop6",
        title: "דמיר ממפתוח האש והאוויר בהפלת 6־6",
        formulaHebrew: [
          "לוקחים את מפתוח האש והאוויר.",
          "מפילים 6־6.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      },
      {
        id: "damir-first-plus-ninth",
        title: "דמיר מסכום הראשון והתשיעי",
        formulaHebrew: [
          "לוקחים את סכום הבית הראשון והבית התשיעי.",
          "מפילים על הבתים.",
          "מקום העצירה מורה על הדמיר."
        ],
        implementationReady: false
      }
    ],
    implementationReady: false
  },

  chartTruthRepeatCheck: {
    id: "chart-truth-repeat-check",
    title: "בדיקת אמת לוח הגורל על ידי חזרה",
    ruleType: "validity",
    sourceBook: "القول الجامع",
    sourceStatus: "verified",
    rules: [
      "בודקים את אמת העבודה על ידי הכאה פעם שנייה ושלישית.",
      "אם מתקבלת אותה תשובה — סימן שהעבודה נכונה.",
      "אם מתקבלת תשובה קרובה ואינה סותרת לגמרי — גם זה סימן שהעבודה נכונה.",
      "אם מתקבלת תשובה סותרת לגמרי — יש לחשוד שהלוח אינו יציב או שהעבודה לא נקייה."
    ],
    implementationReady: false,
    implementationNotes: [
      "בעתיד נבנה פונקציה שמשווה שלושה לוחות.",
      "לא להשוות רק שם צורה, אלא גם בית מרכזי, שופט, משפט, טוב/רע וחזרת מוטיבים.",
      "בשלב ראשון זה יישאר חוק לימודי ולא חסימה אוטומטית."
    ]
  },

  repeatFigureDirectionRules: {
    id: "repeat-figure-direction-rules",
    title: "חזרת צורה וקביעת כיוון",
    ruleType: "direction",
    sourceBook: "الفلك المشحون",
    sourceStatus: "verified",
    zones: {
      mothers: "מזרח",
      daughters: "מערב",
      nieces: "צפון",
      extrasOrRuling: "דרום"
    },
    rules: [
      "אם צורה חוזרת באמהות ובנכדות / אזור — הכיוון משולב, כגון צפון־מזרח.",
      "אם צורה חוזרת באמהות ובבנות — בודקים איזה בית חזק יותר.",
      "אם הבית שבאמהות חזק יותר — הכיוון מזרח.",
      "אם הבית שבבנות חזק יותר — הכיוון מערב.",
      "על אותו עיקרון מודדים חזרת צורה בשאר הבתים והכיוונים."
    ],
    implementationReady: false,
    implementationNotes: [
      "חזרת צורה אינה פסילה אוטומטית.",
      "לפני כל דין פסילה מחזרת צורות צריך מקור נפרד ומפורש."
    ]
  },

  missingImportantRules: {
    id: "missing-important-rules",
    title: "חוקים חשובים שעדיין אסור לקודד",
    ruleType: "needs-verification",
    items: [
      {
        id: "repeat-mothers-invalid",
        title: "חזרת צורה באמהות פוסלת?",
        status: "notVerified",
        note: "המשתמש זוכר חוק כזה. כרגע נמצא שחזרת צורות משמשת גם לחישוב כיוון, לכן אין לקודד פסילה עד מקור מפורש."
      },
      {
        id: "house-before-awtad",
        title: "הבית שלפני היתד",
        status: "notVerified",
        note: "המשתמש הזכיר חוק שמסתכל על הצורה בבית שלפני היתד. צריך למצוא מקור מדויק."
      },
      {
        id: "truth-of-chart",
        title: "האם הגורל מדבר אמת",
        status: "partial",
        note: "יש תנאי עבודה וסימני בדיקה, אך צריך לחלץ את כל נוסחאות אמת/שקר/פסילה."
      },
      {
        id: "seeker-fortune-house",
        title: "בית מזל השואל",
        status: "notComplete",
        note: "צריך לחלץ נוסחה מדויקת."
      },
      {
        id: "seeker-fall-house",
        title: "בית נפילת השואל",
        status: "notComplete",
        note: "צריך לחלץ נוסחה מדויקת."
      }
    ]
  }
};

function ramlGetReadingFoundation(sectionId) {
  return RAML_READING_FOUNDATIONS[sectionId] || null;
}

function ramlListReadingFoundationSections() {
  return Object.keys(RAML_READING_FOUNDATIONS);
}

if (typeof window !== "undefined") {
  window.RAML_READING_FOUNDATIONS = RAML_READING_FOUNDATIONS;
  window.ramlGetReadingFoundation = ramlGetReadingFoundation;
  window.ramlListReadingFoundationSections = ramlListReadingFoundationSections;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_READING_FOUNDATIONS,
    ramlGetReadingFoundation,
    ramlListReadingFoundationSections
  };
}
