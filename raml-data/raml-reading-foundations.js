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
    sourceStatus: "verified-partial",
    verifiedRules: [
      {
        id: "do-not-read-for-tester",
        title: "אין לשאול למי שבא לבחון או להתגרות",
        rule: "אם השואל בא לבחון, לנסות, להתגרות, לצחוק או בלי שאלה אמיתית — אין להכות לו רמל.",
        implementationReady: true
      },
      {
        id: "past-question-warning",
        title: "זהירות בשאלת עבר",
        rule: "אם שאלה עוסקת בעבר ונופלת בקבוצת הסוואקט/הנופלים, יש לחשוד שהשואל בוחן או מנסה את בעל הרמל.",
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
      "נוסח מלא של בדיקת אמת הגורל.",
      "נוסח מלא של פסילת לוח.",
      "האם חזרת צורות באמהות פוסלת או רק מחלישה.",
      "מה בדיוק התנאי שבו השופט/המאזן מורה על טעות בלוח.",
      "האם יש סימן שהגורל סגור / לא מדבר."
    ],
    implementationReady: false
  },

  workingConditions: {
    id: "working-conditions",
    title: "תנאים לפני הכאת הטכת",
    ruleType: "pre-reading",
    sourceStatus: "verified-working",
    conditions: [
      "לא לעבוד למי שאינו שואל באמת.",
      "לא לעבוד למי שבא לבחון או לנסות.",
      "לא לעבוד מתוך ליצנות או התגרות.",
      "יש להקפיד על שקט וישוב הדעת.",
      "יש להקפיד על מצב מתאים של זמן ומקום לפי הספר.",
      "תנאי טהרה, זמן, ענן, גשם, רוח, זריחה ושקיעה דורשים ניסוח מדויק נוסף לפני קידוד."
    ],
    implementationReady: false
  },

  damirAlSail: {
    id: "damir-al-sail",
    title: "ضمير السائل — דמיר / מצפון השואל",
    ruleType: "damir",
    sourceStatus: "verified-partial",
    description: "הדמיר אינו חוק אחד אלא כמה דרכי חילוץ מן הלוח.",
    methods: [
      {
        id: "damir-from-mothers",
        title: "דמיר מן האמהות",
        status: "needsExactFormula"
      },
      {
        id: "damir-from-awtad",
        title: "דמיר מן היתדות",
        status: "needsExactFormula"
      },
      {
        id: "damir-from-balance",
        title: "דמיר מן המאזן / השופט",
        status: "needsExactFormula"
      },
      {
        id: "damir-from-elements-of-first-four",
        title: "דמיר מן אש הראשון, אוויר השני, מים השלישי, עפר הרביעי",
        status: "needsExactFormula"
      },
      {
        id: "damir-from-repeat-house",
        title: "דמיר ממקום חזרת צורה",
        status: "needsExactFormula"
      }
    ],
    implementationReady: false,
    notes: [
      "לא לקודד דמיר לפני חילוץ נוסחאות מדויקות.",
      "הדמיר ישמש בהמשך לזיהוי שאלת השואל ומה הוא באמת שואל."
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
