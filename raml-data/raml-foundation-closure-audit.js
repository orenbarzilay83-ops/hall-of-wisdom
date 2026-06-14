// גורל החול — סגירת יסודות
// קובץ ביקורת: מה כבר מוכן, מה דורש נוסחה, ומה נשאר לבדיקה.
// לא מנוע חישוב. לא דיני שאלות פרטיים.

const RAML_FOUNDATION_CLOSURE_AUDIT = {
  metadata: {
    id: "raml-foundation-closure-audit",
    title: "סגירת חוקי יסוד גורל החול",
    purpose: "לסמן במדויק מה מוכן להפעלה ומה נשאר למחקר לפני מעבר לדיני שאלות",
    status: "in-progress",
    externalKnowledgeUsed: false
  },

  readyForUse: [
    {
      id: "shield-structure",
      title: "מבנה לוח הגורל",
      files: ["raml.js", "raml-data/raml-reading-foundations.js"],
      status: "ready",
      note: "אמהות, בנות, נכדות, עדים, שופט ומשפט קיימים במנוע."
    },
    {
      id: "forms-basic",
      title: "16 הצורות — בסיס",
      files: ["raml-data/raml-forms-basic.js"],
      status: "ready"
    },
    {
      id: "forms-profiles",
      title: "16 הצורות — פרופילים",
      files: ["raml-data/raml-forms-profiles.js"],
      status: "ready"
    },
    {
      id: "houses-basic",
      title: "16 הבתים — בסיס",
      files: ["raml-data/raml-houses-basic.js"],
      status: "ready"
    },
    {
      id: "houses-profiles",
      title: "16 הבתים — פרופילים",
      files: ["raml-data/raml-houses-profiles.js"],
      status: "ready"
    },
    {
      id: "awtad-mawail-sawaqit",
      title: "יתדות / מוואיל / סוואקט",
      files: ["raml-data/raml-reading-foundations.js"],
      status: "ready"
    },
    {
      id: "existence-rule",
      title: "קיום / אי־קיום לפי נקודה וקו",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready"
    },
    {
      id: "board-completeness-96",
      title: "לוח חסר / לוח שלם לפי 96",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js", "raml-data/raml-reading-foundations.js"],
      status: "ready"
    },
    {
      id: "witness-agreement",
      title: "לא כל העדים חייבים להסכים",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready"
    },
    {
      id: "element-planet-relations",
      title: "אהבה ואיבה בין יסודות וכוכבים",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready"
    },
    {
      id: "connections",
      title: "חיבורים / מבטים / קשרי בתים",
      files: ["raml-data/raml-reading-foundations.js", "raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready"
    },
    {
      id: "general-fortune-balance",
      title: "ריבוי צורות טובות מול רעות",
      files: ["raml-data/raml-reading-foundations.js"],
      status: "ready"
    },
    {
      id: "repeat-reading-truth",
      title: "בדיקת אמת על ידי חזרה שנייה ושלישית",
      files: ["raml-data/raml-reading-foundations.js"],
      status: "ready-as-rule-not-automatic"
    },
    {
      id: "mumazaja",
      title: "ממאזגה / התאמה",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "comparisonOnly",
      note: "נשמר במשקל נמוך בלבד, לא כהכרעה ראשית."
    },
    {
      id: "taskin-abdah",
      title: "תסקין אבדח",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready-as-reference"
    },
    {
      id: "taskin-four-figures",
      title: "תסקין ארבע הצורות",
      files: ["raml-data/raml-foundation-qawl-jami-extra.js"],
      status: "ready-as-reference"
    }
  ],

  needsFormula: [
    {
      id: "shape-triangles-35",
      title: "35 משולשי הצורות",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "partiallyVerified",
      reason: "33 מתוך 35 משולשי הצורות מוכנים כידע עבודה. רק משולשים 6 ו־25 דורשים בדיקה חזותית.",
      verifiedCount: 33,
      blockedCount: 2,
      blockedItems: [
        { n: 6, value: "اطك / اطن", status: "blockedUntilVisualVerification" },
        { n: 25, value: "زعج", status: "blockedUntilVisualVerification" }
      ],
      nextAction: "לא לעכב את כל חוקי היסוד בגלל שני משולשים; להשתמש ב־33 המאומתים, ולחסום רק את 6 ו־25 עד בדיקה חזותית."
    },
    {
      id: "dignity-rules",
      title: "בית / ובאל / שרף / הובוט",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "closedAsReferenceRule",
      reason: "ההגדרות ורשימת שרף/הובוט לפי כוכבים קיימות ומאומתות כידע יסוד. אין טבלת בית/ובאל מלאה לכל 16 הצורות.",
      usableParts: [
        "הגדרת בית",
        "הגדרת ובאל",
        "הגדרת שרף",
        "הגדרת הובוט",
        "שרף/הובוט לפי כוכבים"
      ],
      blockedParts: [
        "טבלת בית/ובאל מלאה לכל 16 הצורות"
      ],
      nextAction: "להשתמש ככלל ייחוס בלבד. לא להפעיל כמנוע הכרעה מלא עד מקור מפורש."
    },
    {
      id: "taskin-hassan",
      title: "תסקין חסאן",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "closedAsReferenceOnly",
      reason: "המקור מזכיר תפקידים: עד, מורה, סוד, משתלט, שואל ונשאל; אין נוסחת שימוש מלאה להפעלה.",
      nextAction: "לשמור כתסקין ייחוס בלבד. לא להפעיל במנוע עד מקור מפורש לנוסחה."
    },
    {
      id: "taskin-nature-second",
      title: "תסקין הטבע השני",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "blockedUntilSource",
      reason: "המקור מזכיר תסקין טבע שני, אבל אין לנו סדר מלא.",
      nextAction: "לא להשתמש במנוע עד שיהיה מקור/סדר מלא."
    },
    {
      id: "intishaat",
      title: "היווצרויות",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "blockedUntilTable",
      reason: "העיקרון קיים: צורה נוצרת מצירוף שתי צורות. אבל אין עדיין טבלת הורים מלאה לכל צורה.",
      nextAction: "לא להפעיל במנוע עד בניית טבלת parentA + parentB => childFigure."
    },
    {
      id: "tasyir",
      title: "הולכת נקודות",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "blockedUntilFormula",
      reason: "התסייר קיים כשיטת יסוד, אבל אין נוסחת שימוש כללית ומדויקת להפעלה אוטומטית.",
      nextAction: "לשמור כשדה ידע עתידי לדמיר/זמן/הולכת נקודות. לא להפעיל במנוע עד נוסחה מדויקת."
    },
    {
      id: "ismatat-atrohat",
      title: "إسماطات / أطروحات — הפלות ושאריות",
      file: "raml-data/raml-foundation-qawl-jami-extra.js",
      currentStatus: "blockedUntilContextFormula",
      reason: "השיטה קיימת כחוק יסוד ויש בסיסים 12/16/15/9/6/7, אבל צריך לדעת מתי משתמשים בכל בסיס.",
      bases: [12, 16, 15, 9, 6, 7],
      nextAction: "לשמור כשיטת ניתוח כללית. לא להפעיל כמנוע עצמאי עד שתוגדר נוסחת הקשר לכל בסיס."
    },
    {
      id: "seeker-fortune-house",
      title: "בית מזל השואל",
      file: "raml-data/raml-reading-foundations.js",
      currentStatus: "blockedUntilExactSource",
      reason: "לא נמצא במקורות הנוכחיים בשם מדויק או כנוסחה מפורשת. ייתכן שקשור לדמיר, שרף/הובוט או חיזוק הצורה, אבל אין להפעיל בלי מקור.",
      nextAction: "לא להפעיל במנוע ולא לפרש עד מקור מפורש."
    },
    {
      id: "seeker-fall-house",
      title: "בית נפילת השואל",
      file: "raml-data/raml-reading-foundations.js",
      currentStatus: "blockedUntilExactSource",
      reason: "לא נמצא במקורות הנוכחיים בשם מדויק או כנוסחה מפורשת. ייתכן שקשור להובוט/נפילת כוכב, אבל אין להפעיל בלי מקור.",
      nextAction: "לא להפעיל במנוע ולא לפרש עד מקור מפורש."
    },
    {
      id: "house-before-awtad",
      title: "הבית שלפני היתד",
      file: "raml-data/raml-reading-foundations.js",
      currentStatus: "blockedUntilExactSource",
      reason: "המשתמש זוכר חוק כזה, אבל לא נמצא במקורות הנוכחיים מקור מפורש.",
      nextAction: "לא להפעיל במנוע ולא לפרש עד מקור מפורש."
    }
  ],

  closureDecision: {
    canMoveToTopicRules: true,
    reason: "המקור השלישי بلوغ الأمل في علم الرمل עבר חילוץ ראשוני מלא לעמודים 6–20. כל החוסרים זוהו ונשמרו בקבצי הידע עם סטטוס ברור: needsVisualEncoding / needsFormula / blockedUntilSource / advancedKnowledge / advisorOnly. אין כרגע חוסר לא-מסומן שמונע מעבר לדיני שאלות.",
    nextStep: "אפשר לעבור לדיני שאלות, אך לא להפעיל במנוע את הסעיפים החסומים מתוך بلوغ الأمل עד קידוד חזותי או נוסחה מלאה. יש לזכור לתקן בהמשך את תצוגת לוח הגורל לימין-לשמאל."
  }
};

function ramlGetFoundationClosureAudit() {
  return RAML_FOUNDATION_CLOSURE_AUDIT;
}

function ramlListFoundationClosureOpenItems() {
  return RAML_FOUNDATION_CLOSURE_AUDIT.needsFormula || [];
}

function ramlListFoundationClosureReadyItems() {
  return RAML_FOUNDATION_CLOSURE_AUDIT.readyForUse || [];
}

if (typeof window !== "undefined") {
  window.RAML_FOUNDATION_CLOSURE_AUDIT = RAML_FOUNDATION_CLOSURE_AUDIT;
  window.ramlGetFoundationClosureAudit = ramlGetFoundationClosureAudit;
  window.ramlListFoundationClosureOpenItems = ramlListFoundationClosureOpenItems;
  window.ramlListFoundationClosureReadyItems = ramlListFoundationClosureReadyItems;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_FOUNDATION_CLOSURE_AUDIT,
    ramlGetFoundationClosureAudit,
    ramlListFoundationClosureOpenItems,
    ramlListFoundationClosureReadyItems
  };
}
