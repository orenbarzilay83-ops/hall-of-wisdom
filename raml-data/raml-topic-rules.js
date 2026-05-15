// גורל החול — דיני שאלות לפי סדר הבתים
// קובץ נושאים בלבד בשלב ראשון.
// לא מנוע הכרעה סופי.
// כל דין שאלה פרטני ייכנס בהמשך רק אם נמצא במקור מאושר.

const RAML_TOPIC_RULES = {
  metadata: {
    id: "raml-topic-rules",
    title: "דיני שאלות לפי סדר הבתים",
    status: "foundation-topic-map",
    sourcePolicy: "approved-sources-only",
    externalKnowledgeUsed: false,
    note: "קובץ זה מסדר את נושאי השאלות לפי 12 הבתים. דינים פרטיים יתווספו בהמשך רק עם מקור מאושר."
  },

  houseTopicOrder: [
    {
      house: 1,
      id: "house-1-seeker",
      title: "בית 1 — השואל",
      arabicTerms: ["الطالع", "بيت السائل", "السائل"],
      hebrewTopics: [
        "השואל",
        "גוף השואל",
        "מצב אישי",
        "תחילת השאלה",
        "כוונת השואל",
        "הדמיר כשהוא נוגע לשואל"
      ],
      engineUse: "focus-house",
      implementationReady: true
    },
    {
      house: 2,
      id: "house-2-money",
      title: "בית 2 — כסף ורכוש",
      arabicTerms: ["المال", "بيت المال"],
      hebrewTopics: [
        "כסף",
        "רכוש",
        "פרנסה",
        "רווח",
        "חפצים",
        "מה ששייך לשואל"
      ],
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 3,
      id: "house-3-siblings-messages",
      title: "בית 3 — אחים, שכנים ותנועה קרובה",
      arabicTerms: ["الإخوة", "الجيران", "الرسائل"],
      hebrewTopics: [
        "אחים",
        "אחיות",
        "שכנים",
        "נסיעה קרובה",
        "שליחים",
        "הודעות",
        "דיבור קרוב"
      ],
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 4,
      id: "house-4-home-root-end",
      title: "בית 4 — בית, קרקע ושורש הדבר",
      arabicTerms: ["الأرض", "البيت", "العاقبة", "الأب"],
      hebrewTopics: [
        "בית",
        "קרקע",
        "אב",
        "שורש הדבר",
        "סוף הדבר",
        "מקום קבוע",
        "נכס"
      ],
      engineUse: "topic-house-and-ending-root",
      implementationReady: true
    },
    {
      house: 5,
      id: "house-5-children-joy-love",
      title: "בית 5 — ילדים, שמחה ואהבה",
      arabicTerms: ["الأولاد", "الفرح", "المحبة"],
      hebrewTopics: [
        "ילדים",
        "שמחה",
        "אהבה",
        "הנאה",
        "יצירה",
        "משחק",
        "היריון — רק אם מקור שאלה מתאים יאושר בהמשך"
      ],
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 6,
      id: "house-6-illness-work-trouble",
      title: "בית 6 — חולי, טרחה ועובדים",
      arabicTerms: ["المرض", "الخدم", "التعب"],
      hebrewTopics: [
        "חולי",
        "טרחה",
        "עובדים",
        "עבודה כפויה",
        "עבדות/שירות במונחי המקורות",
        "אויבים קטנים",
        "דברים שמחלישים את השואל"
      ],
      displayPolicy: "spiritualDiagnostic / advisorOnly when illness is involved",
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 7,
      id: "house-7-queried-partner-opponent",
      title: "בית 7 — הנשאל, זוגיות, שותף ויריב גלוי",
      arabicTerms: ["المسؤول عنه", "الزوج", "الشريك", "الخصم"],
      hebrewTopics: [
        "הנשאל עליו",
        "בן/בת זוג",
        "שותף",
        "יריב גלוי",
        "אדם מול השואל",
        "נישואין — דינים פרטיים ייכנסו בהמשך רק ממקור"
      ],
      engineUse: "opposite-house-topic",
      implementationReady: true
    },
    {
      house: 8,
      id: "house-8-death-loss-fear",
      title: "בית 8 — מוות, הפסד, פחד וירושה",
      arabicTerms: ["الموت", "الخوف", "الميراث"],
      hebrewTopics: [
        "מוות",
        "פחד",
        "הפסד",
        "ירושה",
        "דבר כבד ונסתר",
        "סכנה",
        "תוצאה קשה"
      ],
      displayPolicy: "advisorOnly / careful language",
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 9,
      id: "house-9-travel-religion-dream",
      title: "בית 9 — נסיעה רחוקה, דת, חלום וחכמה",
      arabicTerms: ["السفر", "الدين", "الرؤيا", "العلم"],
      hebrewTopics: [
        "נסיעה רחוקה",
        "דת",
        "אמונה",
        "חלום",
        "חזון",
        "חכמה",
        "לימוד",
        "מורה"
      ],
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 10,
      id: "house-10-authority-work-reputation",
      title: "בית 10 — שלטון, עבודה, מעלה ותוצאה גלויה",
      arabicTerms: ["السلطان", "العمل", "الجاه", "الصيت"],
      hebrewTopics: [
        "שלטון",
        "אדם בעל כוח",
        "עבודה",
        "קריירה",
        "מעמד",
        "שם טוב",
        "תוצאה גלויה",
        "מעלה"
      ],
      engineUse: "topic-house-and-public-result",
      implementationReady: true
    },
    {
      house: 11,
      id: "house-11-friends-hope-gain",
      title: "בית 11 — חברים, תקווה ורווח",
      arabicTerms: ["الأصدقاء", "الرجاء", "الربح"],
      hebrewTopics: [
        "חברים",
        "תקווה",
        "עזרה",
        "רווח",
        "תמיכה",
        "אנשים שעוזרים לשואל"
      ],
      engineUse: "topic-house",
      implementationReady: true
    },
    {
      house: 12,
      id: "house-12-hidden-enemies-prison-sorrow",
      title: "בית 12 — אויבים נסתרים, מאסר, סוד וצער",
      arabicTerms: ["الأعداء", "السجن", "السر", "الحزن"],
      hebrewTopics: [
        "אויבים נסתרים",
        "מאסר",
        "סוד",
        "צער",
        "נזק נסתר",
        "דבר שפועל מאחורי הקלעים",
        "כישוף/עין הרע — רק אם מקור דיני שאלה מפורש יאושר"
      ],
      displayPolicy: "advisorOnly / spiritualDiagnostic when relevant",
      engineUse: "topic-house",
      implementationReady: true
    }
  ],

  topicAliases: {
    money: {
      hebrew: ["כסף", "פרנסה", "רווח", "משכורת", "חוב", "חפץ", "רכוש"],
      focusHouse: 2
    },
    home: {
      hebrew: ["בית", "דירה", "קרקע", "נכס", "אדמה", "שורש"],
      focusHouse: 4
    },
    love: {
      hebrew: ["אהבה", "זוגיות", "בן זוג", "בת זוג", "נישואין", "קשר"],
      focusHouseCandidates: [5, 7],
      note: "אהבה כללית יכולה להתחיל בבית 5; זוגיות/נישואין/האדם שמול השואל — בית 7."
    },
    illness: {
      hebrew: ["חולי", "מחלה", "כאב", "בריאות", "רפואה"],
      focusHouse: 6,
      displayPolicy: "spiritualDiagnostic / advisorOnly"
    },
    travel: {
      hebrew: ["נסיעה", "מסע", "חו״ל", "דרך", "טיסה"],
      focusHouseCandidates: [3, 9],
      note: "תנועה קרובה — בית 3; נסיעה רחוקה — בית 9."
    },
    work: {
      hebrew: ["עבודה", "קריירה", "תפקיד", "משרה", "מעמד"],
      focusHouse: 10
    },
    hiddenEnemy: {
      hebrew: ["אויב נסתר", "סוד", "פגיעה נסתרת", "עין הרע", "כישוף"],
      focusHouse: 12,
      displayPolicy: "advisorOnly / spiritualDiagnostic"
    }
  },


  houseQuestionRules: {
    id: "house-question-rules-by-order",
    title: "דיני שאלות לפי סדר הבתים",
    status: "in-progress",
    sourcePolicy: "approved-sources-only",
    note: "הרחבה הדרגתית לפי בית. כל דין פרטי יופעל רק אם מקורו ברור ומסומן.",

    house1SeekerRules: {
      id: "house-1-seeker-question-rules",
      house: 1,
      title: "בית 1 — דיני השואל",
      arabicTerms: ["الطالع", "بيت السائل", "السائل", "المريض"],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules",
      coreMeaning: [
        "בית 1 מייצג את השואל עצמו.",
        "בית 1 מייצג את גופו, מצבו, תחילת השאלה וכוונת השאלה.",
        "באבחון רוחני/חולי, בית 1 הוא החולה / בעל השאלה.",
        "בית 1 הוא נקודת המוצא לכל קריאה: לפני דיני נושא פרטיים בודקים את מצב השואל."
      ],
      whatToInspect: [
        {
          id: "figure-in-house-1",
          title: "הצורה בבית 1",
          rule: "בודקים את הצורה העומדת בבית 1: טבעה, סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים.",
          implementationReady: true
        },
        {
          id: "house-1-strength",
          title: "חוזק הבית",
          rule: "בית 1 הוא יתד, ולכן יש לו כוח יסודי חזק בלוח.",
          relatedFoundation: "awtad",
          implementationReady: true
        },
        {
          id: "seeker-vs-topic-house",
          title: "יחס השואל לבית הנושא",
          rule: "לא מספיק לבדוק את בית 1 לבד. יש להשוות את בית 1 לבית הנושא של השאלה.",
          examples: [
            "שאלת כסף — בית 1 מול בית 2.",
            "שאלת בית/נכס — בית 1 מול בית 4.",
            "שאלת זוגיות/אדם מולו — בית 1 מול בית 7.",
            "שאלת חולי — בית 1 מול בית 6.",
            "שאלת עבודה/מעמד — בית 1 מול בית 10."
          ],
          implementationReady: true
        },
        {
          id: "seeker-and-damir",
          title: "בית 1 ודמיר",
          rule: "אם הדמיר או אחת מדרכי הדמיר מחזירות לבית 1 או לצורה החוזרת בבית 1, הדבר מחזק שהשאלה נובעת ישירות ממצב השואל עצמו.",
          implementationReady: "partial",
          note: "חלק מדרכי הדמיר עדיין needsFormula ולכן לא כולן מופעלות."
        },
        {
          id: "seeker-spiritual-diagnostic",
          title: "בית 1 באבחון רוחני/חולי",
          rule: "במודול הרוחני בית 1 הוא המريض — החולה / האדם שעליו שואלים.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly",
          implementationReady: true
        }
      ],
      decisionLayers: [
        "שכבה 1: האם בית 1 טוב/רע/ממוזג לפי הצורה.",
        "שכבה 2: האם הצורה בבית 1 מתאימה לנושא השאלה או מתנגשת איתו.",
        "שכבה 3: האם בית הנושא מחזק או מחליש את בית 1.",
        "שכבה 4: האם יש חזרת צורה בין בית 1 לבית הנושא, לעדים, לשופט או לדמיר.",
        "שכבה 5: האם קיימת אינדיקציה רוחנית/חולית שמחייבת מצב advisorOnly."
      ],
      blockedOrCarefulUse: [
        {
          id: "do-not-diagnose-medically",
          rule: "אין להציג מסקנה רפואית ללקוח. חולי/אבחון רוחני נשמר ליועץ בלבד.",
          status: "advisorOnly"
        },
        {
          id: "do-not-force-topic",
          rule: "אם השאלה אינה שייכת לבית 1 אלא לבית אחר, בית 1 נשאר השואל ולא מחליף את בית הנושא.",
          status: "active"
        }
      ],
      engineUse: {
        role: "seeker-baseline",
        useBeforeEveryReading: true,
        canDecideAlone: false,
        mustCompareWithTopicHouse: true,
        advisorOnlyWhenSpiritualOrIllness: true
      },
      implementationReady: true
    },

    house2MoneyRules: {
      id: "house-2-money-question-rules",
      house: 2,
      title: "בית 2 — דיני כסף, רכוש ופרנסה",
      arabicTerms: ["بيت المال", "المال", "الرزق", "المتاع"],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      coreMeaning: [
        "בית 2 מייצג כסף, רכוש, פרנסה, חפצים ומה ששייך לשואל.",
        "בשאלות ממון בית 2 הוא בית הנושא המרכזי.",
        "אין לקרוא את בית 2 לבד; יש להשוות אותו לבית 1 — השואל.",
        "אם השאלה עוסקת באובדן, גניבה או חפץ שנעלם, בית 2 מייצג את ממון/חפץ השואל, אבל יש לשלב גם דיני אבודים/גניבה כאשר יוכנסו ממקור מפורש."
      ],
      questionTypes: [
        {
          id: "will-i-gain-money",
          hebrew: "האם ארוויח כסף?",
          focusHouse: 2,
          compareWith: [1, 10, 11],
          note: "בית 2 הוא הכסף; בית 1 הוא השואל; בית 10 תוצאה גלויה/עבודה; בית 11 רווח/תקווה."
        },
        {
          id: "salary-income-livelihood",
          hebrew: "פרנסה / הכנסה / משכורת",
          focusHouse: 2,
          compareWith: [1, 10, 11],
          note: "לשלב בהמשך עם דיני עבודה אם השאלה קשורה למשרה."
        },
        {
          id: "property-belongings",
          hebrew: "רכוש / חפצים / דבר ששייך לשואל",
          focusHouse: 2,
          compareWith: [1, 4],
          note: "אם זה נכס/קרקע/בית — בית 4 נעשה חשוב במיוחד."
        },
        {
          id: "lost-money-or-object",
          hebrew: "כסף שאבד / חפץ שנעלם",
          focusHouse: 2,
          compareWith: [1, 4, 7, 12],
          note: "דיני אבודים וגניבה ייכנסו בהמשך רק ממקור מפורש."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-2",
          title: "הצורה בבית 2",
          rule: "בודקים את הצורה בבית 2: האם היא סעד/נחס/ממוזג, יסוד, קל/כבד, פתוח/סגור, נכנס/יוצא אם יש קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-2-strength",
          title: "חוזק בית 2",
          rule: "בית 2 הוא מה שאחר היתד, ולכן הוא חלש מן היתדות אך עדיין מורה על דבר שיכול להתפתח/להיתקן בהמשך.",
          relatedFoundation: "followingAwtad",
          implementationReady: true
        },
        {
          id: "seeker-money-relationship",
          title: "יחס בית 1 לבית 2",
          rule: "בודקים האם בית 1 והשואל תומכים בבית 2 או מתנגדים לו: חזרת צורה, התאמת יסודות, סעד/נחס, וחיבור דרך דמיר/עדים אם קיים.",
          implementationReady: true
        },
        {
          id: "money-result-support",
          title: "תמיכת בית 10 ובית 11",
          rule: "בשאלות רווח/פרנסה, בית 10 מראה תוצאה גלויה/עבודה, ובית 11 מראה תקווה, רווח ועזרה.",
          implementationReady: true
        },
        {
          id: "money-loss-risk",
          title: "סיכון הפסד / הסתרה",
          rule: "אם השאלה על הפסד, גניבה או חפץ שנעלם — יש לבדוק גם בית 12 לאויבים נסתרים וסוד, ובית 7 לאדם שמול השואל/יריב גלוי.",
          implementationReady: "partial",
          note: "דיני גניבה ואבודים פרטיים עדיין לא הוכנסו."
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 2 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 2 — האם השואל יכול להגיע לכסף/רכוש.",
        "שכבה 3: האם בית 2 נתמך על ידי בית 10 או 11 בשאלות פרנסה ורווח.",
        "שכבה 4: האם יש סכנת הפסד/הסתרה דרך בית 12 או יריב דרך בית 7.",
        "שכבה 5: האם העדים והשופט מחזקים את השגת המבוקש או מחלישים."
      ],
      blockedOrCarefulUse: [
        {
          id: "do-not-predict-investments-as-financial-advice",
          rule: "בשאלות השקעה/מניות/כסף אין להציג ייעוץ פיננסי מחייב. זהו פירוש רמלי בלבד.",
          status: "advisorNote"
        },
        {
          id: "lost-object-rules-not-yet-active",
          rule: "דיני אבודים/גניבה פרטיים עדיין לא פעילים עד הכנסת מקור מפורש.",
          status: "blockedUntilTopicSource"
        }
      ],
      engineUse: {
        role: "money-topic-house",
        useWhenFocusHouseIs: 2,
        compareWithSeekerHouse: true,
        supportHouses: [10, 11],
        riskHouses: [7, 12],
        canDecideAlone: false
      },
      implementationReady: true
    }
  },

  engineRules: {
    status: "topic-routing-only",
    rules: [
      "בשלב זה הקובץ קובע בית נושא לפי שאלה.",
      "הכרעה לפי צורות, עדים, דמיר ודינים פרטיים תתווסף בהמשך.",
      "אין להפעיל דיני שאלה שלא הוכנסו ממקור מאושר.",
      "אם שאלה מתאימה ליותר מבית אחד, יש לסמן focusHouseCandidates ולא להכריע בכוח."
    ]
  }
};

function ramlGetTopicRules() {
  return RAML_TOPIC_RULES;
}

function ramlListTopicHouses() {
  return RAML_TOPIC_RULES.houseTopicOrder || [];
}

function ramlFindTopicHouseByNumber(houseNumber) {
  return ramlListTopicHouses().find(x => x.house === Number(houseNumber)) || null;
}

function ramlFindTopicAliases() {
  return RAML_TOPIC_RULES.topicAliases || {};
}

if (typeof window !== "undefined") {
  window.RAML_TOPIC_RULES = RAML_TOPIC_RULES;
  window.ramlGetTopicRules = ramlGetTopicRules;
  window.ramlListTopicHouses = ramlListTopicHouses;
  window.ramlFindTopicHouseByNumber = ramlFindTopicHouseByNumber;
  window.ramlFindTopicAliases = ramlFindTopicAliases;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_TOPIC_RULES,
    ramlGetTopicRules,
    ramlListTopicHouses,
    ramlFindTopicHouseByNumber,
    ramlFindTopicAliases
  };
}
