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
      "לא מערבבים מקור חדש בתוך המנוע לפני סימון מקור וסטטוס.",
      "כל חוק יסומן לפי: verified / partiallyVerified / referenceOnly / needsFormula / blockedUntilSource.",
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
      extractionNeed: "letters-name-extraction-future",
      priority: "medium",
      status: "needsExtraction"
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
