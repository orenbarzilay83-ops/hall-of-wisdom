// גורל החול — חוקי יסוד נוספים מתוך القول الجامع
// מקור: القول الجامع في علم الرمل – الشيخ محمد ساس
// קובץ ידע בלבד. לא מנוע חישוב.
// לא כולל דיני שאלות פרטיים: מסחר, גניבה, חולי, נישואין, אסיר וכו׳.

const RAML_QAWL_JAMI_EXTRA_FOUNDATIONS = {
  metadata: {
    id: "raml-qawl-jami-extra-foundations",
    title: "חוקי יסוד נוספים מתוך القول الجامع",
    source: "القول الجامع في علم الرمل - الشيخ محمد ساس",
    externalKnowledgeUsed: false,
    scope: "foundation-rules-only",
    status: "working-verified-and-needs-formula"
  },

  existenceRule: {
    id: "existence-rule-dot-line",
    title: "קיום / אי־קיום לפי נקודה וקו",
    arabicTerm: "الوجود / العدم - النقطة الفردية / الشرطة الزوجية - مفتوح / مسدود",
    hebrewApp: "פתוח = קיום / נוכחות; סגור = חסימה / אי־קיום",
    location: "עמ׳ 35-36",
    status: "verified",
    dot: {
      arabic: "النقطة الفردية / مفتوح",
      hebrew: "נקודה יחידה / פתוח",
      value: 1,
      meaning: "קיום, נוכחות, פתיחות היסוד"
    },
    line: {
      arabic: "الشرطة الزوجية / مسدود",
      hebrew: "קו זוגי / סגור",
      value: 2,
      meaning: "חסימה, אי־קיום, היעדר הדבר"
    },
    practicalUse: [
      "כל שורה בתוך צורה מייצגת יסוד / שכבה.",
      "נקודה אחת מסמנת שהיסוד פתוח ולכן הדבר קיים או פעיל.",
      "קו זוגי מסמן שהיסוד סגור ולכן יש חסימה או היעדר.",
      "יש לפרש לפי היסוד שנפתח או נסגר ולפי נושא השאלה."
    ],
    implementationReady: true
  },

  boardCompletenessRule: {
    id: "board-completeness-96",
    title: "לוח חסר / לוח שלם לפי 96",
    arabicTerm: "الرمل الناقص / التخت الناقص / الرمل الكامل / التخت الكامل / مساحة الرمل",
    hebrewApp: "לוח חסר / לוח מלא / שטח הלוח",
    location: "עמ׳ 35-36, עמ׳ 50",
    status: "verified",
    threshold: 96,
    pointValue: 1,
    lineValue: 2,
    totalLayers: 64,
    statuses: {
      below96: {
        hebrew: "לוח חסר",
        effect: "השאלה אינה מתקיימת, מתקיימת מעט, או אינה מתקיימת כפי שהשואל רצה"
      },
      equal96: {
        hebrew: "לוח שלם בסיסי",
        effect: "לוח מאוזן; לא לסמן כחסר"
      },
      above96: {
        hebrew: "לוח מלא / יותר מן השלם",
        effect: "קלות יחסית בקיום הדבר, בכפוף לשאר העדים"
      }
    },
    implementationReady: true
  },

  witnessAgreementRule: {
    id: "witness-agreement-weighted-evidence",
    title: "לא כל העדים חייבים להסכים",
    arabicTerm: "الشواهد",
    hebrewApp: "עדים / סימוכין מתוך לוח הגורל",
    location: "עמ׳ 36, עמ׳ 51",
    status: "verified",
    interpretationMode: "weightedEvidence",
    requireFullBoardAnalysis: true,
    allowContradictoryWitnesses: true,
    outputFields: [
      "supportingWitnesses",
      "opposingWitnesses",
      "dominantDirection"
    ],
    practicalUse: [
      "לא פוסקים מצורה אחת או מבית אחד בלבד.",
      "סתירה בין עדים אינה פוסלת את לוח הגורל.",
      "הקריאה צריכה לעבוד בשקלול: עדים תומכים, עדים מתנגדים, עדים חזקים יותר, וכיוון כללי."
    ],
    implementationReady: true
  },

  ramlBranches: {
    id: "raml-branches",
    title: "ענפי علم الرمل",
    arabicTerm: "فروع علم الرمل",
    hebrewApp: "ענפי מודול גורל החול",
    location: "עמ׳ 19; דמיר בעמ׳ 36-38; חילוץ שם מופיע כפרק עתידי",
    status: "verified",
    branches: [
      {
        id: "damir",
        arabic: "استخراج ضمير السائل",
        hebrew: "חילוץ כוונת השואל",
        appModule: "questionIntentDetection",
        status: "verified"
      },
      {
        id: "ahkam",
        arabic: "الأحكام",
        hebrew: "דיני שאלות פרטיים",
        appModule: "domainJudgments",
        status: "doNotUseYet"
      },
      {
        id: "duration",
        arabic: "استخراج الزمن / المدة",
        hebrew: "חילוץ זמן / משך",
        appModule: "timingEngine",
        status: "needsFormula"
      },
      {
        id: "speakingAnswer",
        arabic: "استخراج الاسم / الجواب الناطق / استنطاق الرمل",
        hebrew: "חילוץ שם / תשובה מדברת",
        appModule: "advancedNameOrSpeakingAnswer",
        status: "doNotUseYet"
      },
      {
        id: "sadaqatHealing",
        arabic: "العلاج بالصدقات",
        hebrew: "ריפוי בצדקות",
        appModule: "none",
        status: "doNotUseYet"
      }
    ],
    implementationReady: true
  },

  elementAndPlanetRelations: {
    id: "element-planet-relations",
    title: "אהבה ואיבה בין יסודות וכוכבים",
    arabicTerm: "محبة وعداوة الكواكب / محبة وعداوة الطبائع",
    hebrewApp: "יחסי התאמה / עימות בין יסודות וכוכבים",
    location: "עמ׳ 19-20",
    status: "verified",
    elementRelations: {
      fire_air: "love",
      water_earth: "love",
      fire_water: "enemy",
      earth_air: "enemy",
      fire_earth: "halfEnemy",
      air_water: "halfEnemy"
    },
    planetRelations: [
      { a: "Jupiter", b: "Mars", relation: "enemy", hebrew: "צדק אויב מאדים" },
      { a: "Sun", b: "Saturn", relation: "enemy", hebrew: "שמש אויב שבתאי" },
      { a: "Venus", b: "Mercury", relation: "enemy", hebrew: "נוגה אויב מרקורי" },
      { a: "Moon", b: "Tail", relation: "enemy", hebrew: "ירח אויב זנב" },
      { a: "Jupiter", b: "Venus", relation: "friend", hebrew: "צדק חבר נוגה" },
      { a: "Jupiter", b: "Moon", relation: "friend", hebrew: "צדק חבר ירח" },
      { a: "Mercury", b: "Sun", relation: "friend", hebrew: "מרקורי חבר שמש" },
      { a: "Saturn", b: "Mars", relation: "friend", hebrew: "שבתאי חבר מאדים" }
    ],
    practicalUse: [
      "להשוואת צורה מול צורה.",
      "התאמה מחזקת חיבור.",
      "איבה מחלישה חיבור.",
      "לא להשתמש כפסיקה יחידה אלא כשכבת תמיכה."
    ],
    implementationReady: true
  },

  ramlTriangles: {
    id: "raml-triangles",
    title: "משולשי החול",
    arabicTerm: "مثلثات علم الرمل / مثلثات البيوت / مثلثات الأشكال / مثلثات النحوس",
    hebrewApp: "משולשי בתים, משולשי צורות, משולשי נחס",
    location: "עמ׳ 20-21, עמ׳ 28, עמ׳ 52",
    status: "partially-verified",
    verifiedCount: 33,
    needsVisualVerificationCount: 2,
    visualVerificationPending: [
      { n: 6, value: "اطك / اطن", reason: "נדרש אימות חזותי מול הסריקה" },
      { n: 25, value: "زعج", reason: "נדרש אימות חזותי מול הסריקה" }
    ],
    houseTriangles: {
      page20_fullEight: [
        [1, 2, 9],
        [3, 4, 10],
        [5, 6, 11],
        [7, 8, 12],
        [9, 10, 13],
        [11, 12, 14],
        [13, 14, 15],
        [1, 15, 16]
      ],
      page28_fiveGroups: [
        [1, 2, 9],
        [3, 4, 10],
        [5, 6, 11],
        [7, 8, 12],
        [13, 14, 15]
      ]
    },
    shapeTriangles35: [
      { n: 1, value: "ابن" },
      { n: 2, value: "اجه" },
      { n: 3, value: "ادل" },
      { n: 4, value: "ازع" },
      { n: 5, value: "احس" },
      { n: 6, value: "اطك / اطن", status: "blockedUntilVisualVerification" },
      { n: 7, value: "ايو" },
      { n: 8, value: "بجل" },
      { n: 9, value: "بدو" },
      { n: 10, value: "بزس" },
      { n: 11, value: "بحع" },
      { n: 12, value: "بطه" },
      { n: 13, value: "بيل" },
      { n: 14, value: "جدس" },
      { n: 15, value: "جزو" },
      { n: 16, value: "جحل" },
      { n: 17, value: "جطن" },
      { n: 18, value: "جيع" },
      { n: 19, value: "دزك" },
      { n: 20, value: "دعه" },
      { n: 21, value: "دطع" },
      { n: 22, value: "دين" },
      { n: 23, value: "زحن" },
      { n: 24, value: "زطل" },
      { n: 25, value: "زعج", status: "blockedUntilVisualVerification" },
      { n: 26, value: "حطو" },
      { n: 27, value: "حيك" },
      { n: 28, value: "طيس" },
      { n: 29, value: "هوع" },
      { n: 30, value: "هكن" },
      { n: 31, value: "هلس" },
      { n: 32, value: "واعس" },
      { n: 33, value: "ولن" },
      { n: 34, value: "كلع" },
      { n: 35, value: "نسع" }
    ],
    maleficTriangles: [
      ["عتبة خارجة", "قبض خارج", "حمرة"],
      ["عتبة خارجة", "أنكيس", "طريق"],
      ["قبض خارج", "أنكيس", "نقي الخد"],
      ["قبض خارج", "عقلة", "نصرة داخلة"],
      ["أنكيس", "عقلة", "أحيان"],
      ["جودلة", "حمرة", "عقلة"],
      ["حمرة", "أنكيس", "قبض داخل"],
      ["عتبة خارجة", "عقلة", "عتبة داخلة"]
    ],
    implementationReady: false,
    implementationNotes: [
      "33 מתוך 35 משולשי הצורות מוכנים לשימוש כידע עבודה.",
      "משולשים 6 ו־25 חסומים עד בדיקה חזותית מול הסריקה.",
      "לא לאחד בכוח בין 8 משולשי הבתים בעמ׳ 20 לבין 5 הקבוצות בעמ׳ 28."
    ]
  },

  taskins: {
    id: "raml-taskins",
    title: "תסקינים",
    arabicTerm: "تساكين الرمل",
    hebrewApp: "מערכי שיכון / סדרי הצבת הצורות",
    location: "עמ׳ 30-32",
    status: "mixed",
    definition: "תסקין הוא הצבת הצורות במקומות המתאימים להן לפי מהלכן ופתרונן בבית.",
    abdah: {
      status: "verified",
      engineUse: "primary",
      weights: { fire: 1, air: 2, water: 4, earth: 8 },
      order: [
        "أحيان", "حمرة", "نصرة خارجة", "بياض",
        "قبض خارج", "اجتماع", "عتبة خارجة", "أنكيس",
        "عقلة", "قبض داخل", "جودلة", "نصرة داخلة",
        "نقي خد", "عتبة داخلة", "طريق", "جماعة"
      ]
    },
    letters: {
      status: "doNotUseYet",
      use: "שם / תחנות ירח / מולד"
    },
    zanati: {
      status: "comparisonOnly",
      use: "שיטה זנאטית / מספרים / משכים"
    },
    hassan: {
      status: "needsFormula",
      use: "עד, מורה, סוד, משתלט, שואל ונשאל"
    },
    fourFigures: {
      status: "verified",
      groups: {
        outside: ["أحيان", "نصرة خارجة", "قبض خارج", "عتبة خارجة"],
        inside: ["نصرة داخلة", "عتبة داخلة", "أنكيس", "قبض داخل"],
        inverted: ["نقي الخد", "طريق", "عقلة", "جودلة"],
        fixed: ["حمرة", "بياض", "اجتماع", "جماعة"]
      }
    },
    natureFirst: {
      status: "comparisonOnly"
    },
    natureSecond: {
      status: "needsFormula",
      order: null
    },
    implementationReady: false
  },

  dignityRules: {
    id: "dignity-rules",
    title: "בית / ובאל / שרף / הובוט / שמחה / עצב",
    arabicTerm: "بيت / وبال / شرف / هبوط / فرح / حزن",
    hebrewApp: "בית כוח, בית פגיעה, בית רוממות, בית ירידה, שמחה, עצב",
    location: "עמ׳ 29-30",
    status: "needsFormula",
    definitions: {
      bayt: "מקום הכוכב המקורי ומושבו",
      wabal: "הבית שמול בית הכוכב",
      sharaf: "שיא כוח הכוכב",
      hubut: "נפילה / קושי"
    },
    exaltationFallByPlanet: {
      moon_head_tail: {
        sharaf: 2,
        hubut: 8,
        note: "بياض ודרך להם הבית הרביעי / סרטן לפי הערת המקור"
      },
      sun: { sharaf: 1, hubut: 7 },
      mars: { sharaf: 3, hubut: 9 },
      mercury: { sharaf: 6, hubut: 12 },
      jupiter: { sharaf: 4, hubut: 12 },
      venus: { sharaf: 12, hubut: 4 },
      saturn: { sharaf: 7, hubut: 1 }
    },
    missing: [
      "אין כאן טבלת בית / ובאל מלאה לכל 16 הצורות.",
      "לא לבנות טבלה מלאה בלי מקור נוסף."
    ],
    implementationReady: false
  },

  mumazajaRule: {
    id: "mumazaja-rule",
    title: "ממאזגה — התמזגות / התאמה",
    arabicTerm: "الممازجة / الامتزاج",
    hebrewApp: "התאמת צורה לצורה לפי יסודות או כוכבים",
    location: "עמ׳ 29",
    status: "comparisonOnly",
    modes: ["byElement", "byPlanet"],
    elementStrengthOrder: ["air", "water", "fire", "earth"],
    engineWeight: 0.15,
    useAs: "secondaryCompatibilitySignal",
    neverUseAs: "primaryJudgment",
    warning: "המחבר מזהיר שלא להסתמך על ממאזגה יותר מדי, ומי שמרבה להסתמך עליה טועה בדינו.",
    implementationReady: false
  },

  analysisMethods: {
    id: "analysis-methods",
    title: "שיטות ניתוח כלליות",
    arabicTerm: "الحلول / الاتصالات / الانتشاءات / التسيير / الأضروبات / الإسماطات أو الأطروحات",
    hebrewApp: "שכבות ניתוח כלליות של לוח הגורל",
    location: "עמ׳ 27-29, 35-38, 51-52, 58",
    status: "verified-and-needs-formula",
    hulul: {
      arabic: "الحلول",
      hebrew: "חלוּל / הצורה השוכנת בבית",
      status: "verified",
      field: "house.figure"
    },
    itisalat: {
      arabic: "الاتصالات",
      hebrew: "חיבורים",
      status: "verified",
      types: {
        tasdis: [3, 11],
        tarbi: [4, 10, 16],
        muqabala: [7, 14],
        tathlith: [5, 9],
        ishtirak: "adjacentFigures"
      }
    },
    intishaat: {
      arabic: "الانتشاءات",
      hebrew: "היווצרויות",
      status: "needsFormula",
      eachFigureHasWays: 8,
      fields: ["parentA", "parentB", "childFigure"]
    },
    tasyir: {
      arabic: "التسيير",
      hebrew: "הולכה / הסעת נקודה",
      status: "needsFormula",
      source: "openPointsInMizan"
    },
    adrubat: {
      arabic: "الأضروبات",
      hebrew: "הכאות",
      status: "verified",
      rules: {
        line_line: "line",
        dot_dot: "line",
        dot_line: "dot",
        line_dot: "dot"
      }
    },
    ismatat: {
      arabic: "الإسماطات / الأطروحات",
      hebrew: "הפלות / השלכות / שאריות",
      status: "needsFormula",
      bases: [12, 16, 15, 9, 6, 7]
    },
    implementationReady: false
  },

  implementationSummary: {
    coreFoundationRulesToImplementNow: [
      "existenceRule_dotLine_openClosed",
      "boardCompleteness_96",
      "witnessAgreement_weightedEvidence",
      "ramlBranches_structure",
      "elementAndPlanetRelations",
      "houseTriangles",
      "taskinAbdah",
      "taskinFourFigures",
      "strikingRules",
      "connectionsRule"
    ],
    secondaryOrComparisonRules: [
      "mumazaja_lowWeight",
      "taskinZanati_comparisonOnly",
      "taskinHassan_needsFormula",
      "taskinNatureFirst_comparisonOnly",
      "shapeTriangles35_needsVerification",
      "maleficTriangles_secondaryWarning"
    ],
    doNotUseYet: [
      "privateQuestionJudgments_ahkam",
      "marriage_theft_trade_illness_prisoner_domains",
      "nameExtraction_speakingAnswer",
      "sadaqatHealing",
      "taskinNatureSecond_missingOrder"
    ]
  }
};

function ramlGetQawlJamiExtraFoundation(sectionId) {
  return RAML_QAWL_JAMI_EXTRA_FOUNDATIONS[sectionId] || null;
}

function ramlListQawlJamiExtraFoundationSections() {
  return Object.keys(RAML_QAWL_JAMI_EXTRA_FOUNDATIONS);
}

if (typeof window !== "undefined") {
  window.RAML_QAWL_JAMI_EXTRA_FOUNDATIONS = RAML_QAWL_JAMI_EXTRA_FOUNDATIONS;
  window.ramlGetQawlJamiExtraFoundation = ramlGetQawlJamiExtraFoundation;
  window.ramlListQawlJamiExtraFoundationSections = ramlListQawlJamiExtraFoundationSections;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_QAWL_JAMI_EXTRA_FOUNDATIONS,
    ramlGetQawlJamiExtraFoundation,
    ramlListQawlJamiExtraFoundationSections
  };
}
