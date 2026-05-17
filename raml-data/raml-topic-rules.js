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
      displayPolicy: "advisorControlled",
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
          id: "advisor-controlled-health-domain",
          rule: "תחום חולי/אבחון רוחני נמצא בשליטת היועץ המקצועי ובשיקול דעתו.",
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
          id: "advisor-controlled-money-domain",
          rule: "תחום השקעה/מניות/כסף נמצא בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
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
    },

    house3SiblingsMessagesMovementRules: {
      id: "house-3-siblings-messages-movement-rules",
      house: 3,
      title: "בית 3 — דיני אחים, שכנים, הודעות ותנועה קרובה",
      arabicTerms: ["الإخوة", "الجيران", "الرسل", "الرسائل", "السفر القريب"],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      coreMeaning: [
        "בית 3 מייצג אחים ואחיות.",
        "בית 3 מייצג שכנים ואנשים קרובים בסביבה הקרובה.",
        "בית 3 מייצג שליחים, הודעות, מכתבים, דיבור והעברת מידע.",
        "בית 3 מייצג תנועה קרובה, דרך קצרה ונסיעה שאינה רחוקה.",
        "בקריאה לפי בתים, בית 3 אינו מחליף את בית 9: בית 3 הוא תנועה קרובה, בית 9 הוא נסיעה רחוקה."
      ],
      questionTypes: [
        {
          id: "siblings-question",
          hebrew: "שאלה על אח / אחות / קשר עם אחים",
          focusHouse: 3,
          compareWith: [1, 7],
          note: "בית 1 הוא השואל; בית 3 הוא האחים; בית 7 יכול להראות את האדם שמול השואל אם השאלה על עימות או קשר ישיר."
        },
        {
          id: "neighbors-question",
          hebrew: "שאלה על שכנים או סביבה קרובה",
          focusHouse: 3,
          compareWith: [1, 4, 7, 12],
          note: "בית 4 מראה את הבית/המקום; בית 12 אם יש דבר נסתר או הפרעה מאחורי הקלעים."
        },
        {
          id: "message-news-answer",
          hebrew: "הודעה / בשורה / מכתב / תשובה שמחכים לה",
          focusHouse: 3,
          compareWith: [1, 10, 11],
          note: "בית 10 יכול להראות תוצאה גלויה; בית 11 תקווה וקבלת עזרה."
        },
        {
          id: "short-trip-movement",
          hebrew: "נסיעה קרובה / תנועה קצרה / יציאה לסידור",
          focusHouse: 3,
          compareWith: [1, 4, 9],
          note: "אם הדרך הופכת לנסיעה רחוקה או חו״ל — יש לשלב את בית 9."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-3",
          title: "הצורה בבית 3",
          rule: "בודקים את הצורה בבית 3: האם היא סעד/נחס/ממוזג, יסוד, קל/כבד, פתוח/סגור, נכנסת/יוצאת אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-3-strength",
          title: "חוזק בית 3",
          rule: "בית 3 הוא מן הסוואקט / הבתים הנופלים, ולכן הוא חלש יותר מן היתדות וממה שאחר היתדות. הוא מתאים לעניינים חולפים, תנועה, הודעות ודברים שאינם יציבים לגמרי.",
          relatedFoundation: "sawaqit",
          implementationReady: true
        },
        {
          id: "seeker-house3-relationship",
          title: "יחס בית 1 לבית 3",
          rule: "בודקים האם השואל יכול לקבל את ההודעה, להגיע אל האח/השכן, או להצליח בתנועה הקרובה לפי היחס בין בית 1 לבית 3.",
          implementationReady: true
        },
        {
          id: "message-result-support",
          title: "תוצאה של הודעה או בשורה",
          rule: "בשאלות הודעה/בשורה, בית 10 יכול להראות את התוצאה הגלויה ובית 11 את התקווה או העזרה לקבלת הדבר.",
          implementationReady: true
        },
        {
          id: "short-vs-long-travel",
          title: "הבחנה בין נסיעה קרובה לרחוקה",
          rule: "אם השאלה על דרך קצרה, שליחות או תנועה קרובה — בית 3. אם השאלה על נסיעה רחוקה, חו״ל, לימוד או מסע משמעותי — יש לשלב או להעביר לבית 9.",
          implementationReady: true
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 3 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 3 — האם השואל מחובר לדבר הקרוב, להודעה או לאח/שכן.",
        "שכבה 3: האם בית 10 או 11 תומכים בקבלת תשובה/בשורה.",
        "שכבה 4: אם יש קושי, לבדוק בית 12 להסתרה/עיכוב נסתר, ובית 7 אם יש אדם מול השואל.",
        "שכבה 5: אם מדובר בנסיעה, להבחין בין בית 3 לבית 9."
      ],
      blockedOrCarefulUse: [
        {
          id: "do-not-use-house3-for-long-travel-alone",
          rule: "בית 3 אינו מספיק לנסיעה רחוקה או חו״ל; במקרים כאלה יש לבדוק גם בית 9.",
          status: "active"
        },
        {
          id: "messages-private-sensitive",
          rule: "שאלות על הודעות או אנשים אחרים נמצאות בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        }
      ],
      engineUse: {
        role: "siblings-neighbors-messages-short-movement-house",
        useWhenFocusHouseIs: 3,
        compareWithSeekerHouse: true,
        supportHouses: [10, 11],
        riskHouses: [7, 12],
        relatedTravelHouse: 9,
        canDecideAlone: false
      },
      implementationReady: true
    },

    house4HomeRootEndRules: {
      id: "house-4-home-root-end-rules",
      house: 4,
      title: "בית 4 — דיני בית, קרקע, נכס, אב, שורש וסוף הדבר",
      arabicTerms: ["الأرض", "البيت", "العقار", "الأب", "العاقبة", "أصل الأمر"],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      coreMeaning: [
        "בית 4 מייצג בית, קרקע, אדמה, נכס ומקום קבוע.",
        "בית 4 מייצג את האב או שורש המשפחה כאשר השאלה נוגעת לכך.",
        "בית 4 משמש גם כשורש הדבר או סוף הדבר לפי אופי השאלה.",
        "בגלל שבית 4 הוא יתד, יש לו כוח יסודי חזק בלוח.",
        "בשאלות על נכס, בית, מעבר, קרקע, מקום מגורים או שורש עניין — בית 4 הוא בית הנושא המרכזי."
      ],
      questionTypes: [
        {
          id: "home-property-land",
          hebrew: "בית / דירה / קרקע / נכס",
          focusHouse: 4,
          compareWith: [1, 2, 10],
          note: "בית 1 הוא השואל; בית 2 הכסף/יכולת רכישה; בית 10 תוצאה גלויה/אישור/מעמד."
        },
        {
          id: "buy-sell-property",
          hebrew: "קנייה או מכירה של בית/נכס",
          focusHouse: 4,
          compareWith: [1, 2, 7, 10],
          note: "בית 7 מייצג את הצד השני בעסקה; בית 2 את הכסף; בית 10 את התוצאה הגלויה."
        },
        {
          id: "father-family-root",
          hebrew: "אב / שורש משפחתי / עניין שבא מן הבית",
          focusHouse: 4,
          compareWith: [1, 10, 12],
          note: "אם יש סוד משפחתי/דבר נסתר — לבדוק גם בית 12."
        },
        {
          id: "end-of-matter",
          hebrew: "סוף הדבר / אחרית העניין",
          focusHouse: 4,
          compareWith: [1, 10, 15, 16],
          note: "בית 4 יכול לשמש סוף הדבר, ובמקביל יש להתחשב בשופט/משפט לפי מבנה הגורל."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-4",
          title: "הצורה בבית 4",
          rule: "בודקים את הצורה בבית 4: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-4-strength",
          title: "חוזק בית 4",
          rule: "בית 4 הוא יתד, ולכן הוא חזק ומשפיע על שורש הדבר ועל יציבות התוצאה.",
          relatedFoundation: "awtad",
          implementationReady: true
        },
        {
          id: "seeker-house4-relationship",
          title: "יחס בית 1 לבית 4",
          rule: "בודקים האם השואל מחובר לבית/נכס/שורש העניין, או האם יש התנגדות בין בית 1 לבית 4.",
          implementationReady: true
        },
        {
          id: "money-and-property",
          title: "בית 2 מול בית 4",
          rule: "בשאלות רכישת נכס או בית, בית 2 מראה כסף ויכולת, ובית 4 מראה את הנכס עצמו.",
          implementationReady: true
        },
        {
          id: "other-party-property",
          title: "בית 7 בעסקת נכס",
          rule: "כאשר יש מוכר, קונה, שותף או צד שני בעסקה — יש לבדוק גם את בית 7.",
          implementationReady: true
        },
        {
          id: "public-result-property",
          title: "בית 10 בתוצאה גלויה",
          rule: "בית 10 מראה תוצאה גלויה, אישור, מעמד, רשות או איך הדבר נראה כלפי חוץ.",
          implementationReady: true
        },
        {
          id: "hidden-problem-in-property",
          title: "בית 12 כסוד או בעיה נסתרת",
          rule: "אם השאלה כוללת חשש מבעיה נסתרת בבית/נכס/משפחה, בודקים גם בית 12.",
          implementationReady: true
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 4 לפי הצורה שבו.",
        "שכבה 2: האם בית 4 חזק או חלש ביחס לבית 1.",
        "שכבה 3: בשאלות נכס — האם בית 2 תומך בכסף והאם בית 7 מראה צד שני נוח או קשה.",
        "שכבה 4: האם בית 10 מראה תוצאה גלויה טובה או מכשול ציבורי/רשמי.",
        "שכבה 5: אם השאלה על סוף דבר — לשלב את בית 4 עם השופט/משפט ועם כלל סוף הדבר.",
        "שכבה 6: אם יש חשד נסתר — לבדוק את בית 12."
      ],
      blockedOrCarefulUse: [
        {
          id: "advisor-controlled-property-domain",
          rule: "שאלות נכס/קנייה/מכירה נמצאות בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        },
        {
          id: "end-of-matter-not-alone",
          rule: "בית 4 יכול להראות סוף דבר, אבל אין להכריע רק ממנו בלי שופט/משפט, עדים ובית הנושא.",
          status: "active"
        }
      ],
      engineUse: {
        role: "home-property-root-end-house",
        useWhenFocusHouseIs: 4,
        compareWithSeekerHouse: true,
        moneyHouse: 2,
        otherPartyHouse: 7,
        publicResultHouse: 10,
        hiddenProblemHouse: 12,
        judgeHouses: [15, 16],
        canDecideAlone: false
      },
      implementationReady: true
    },

    house5ChildrenJoyLoveRules: {
      id: "house-5-children-joy-love-rules",
      house: 5,
      title: "בית 5 — דיני ילדים, שמחה, אהבה, הנאה ויצירה",
      arabicTerms: ["الأولاد", "الفرح", "المحبة", "اللذة", "السرور"],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      coreMeaning: [
        "בית 5 מייצג ילדים וצאצאים.",
        "בית 5 מייצג שמחה, הנאה, משחק, יצירה ודברים שמביאים שמחת לב.",
        "בית 5 יכול לשמש לשאלות אהבה קלות או נטיית לב, אך אינו מחליף את בית 7 בשאלות זוגיות/נישואין/אדם מול השואל.",
        "בית 5 הוא מן הבתים שאחרי היתדות, ולכן הוא פחות חזק מן היתד אך יכול להראות התפתחות ותיקון."
      ],
      questionTypes: [
        {
          id: "children-question",
          hebrew: "שאלה על ילדים / בן / בת / צאצאים",
          focusHouse: 5,
          compareWith: [1, 4, 10],
          note: "בית 1 הוא השואל; בית 4 שורש המשפחה/הבית; בית 10 תוצאה גלויה."
        },
        {
          id: "joy-pleasure-celebration",
          hebrew: "שמחה / אירוע / הנאה / דבר משמח",
          focusHouse: 5,
          compareWith: [1, 10, 11],
          note: "בית 11 מוסיף תקווה ותמיכה; בית 10 מראה תוצאה גלויה."
        },
        {
          id: "love-interest-light",
          hebrew: "אהבה / משיכה / נטיית לב",
          focusHouse: 5,
          compareWith: [1, 7, 11],
          note: "אם מדובר בקשר ממשי, זוגיות, נישואין או האדם שמול השואל — בית 7 נעשה מרכזי."
        },
        {
          id: "creativity-creation",
          hebrew: "יצירה / רעיון / פרויקט שמביא שמחה",
          focusHouse: 5,
          compareWith: [1, 10, 11],
          note: "אם הפרויקט מקצועי/עסקי — לשלב גם בית 10 ובית 2."
        },
        {
          id: "pregnancy-sensitive",
          hebrew: "היריון / לידה",
          focusHouse: 5,
          compareWith: [1, 4, 6, 10],
          note: "להפעיל בזהירות ורק כידע מסורתי; לא כהבטחה רפואית."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-5",
          title: "הצורה בבית 5",
          rule: "בודקים את הצורה בבית 5: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-5-strength",
          title: "חוזק בית 5",
          rule: "בית 5 הוא מן הבתים שאחרי היתדות, ולכן הוא מראה אפשרות להתפתחות, שמחה או תוצאה שנבנית בהמשך.",
          relatedFoundation: "followingAwtad",
          implementationReady: true
        },
        {
          id: "seeker-house5-relationship",
          title: "יחס בית 1 לבית 5",
          rule: "בודקים האם השואל מחובר לשמחה/ילד/אהבה/יצירה או האם יש התנגדות בין בית 1 לבית 5.",
          implementationReady: true
        },
        {
          id: "love-house5-vs-house7",
          title: "הבחנה בין בית 5 לבית 7 באהבה",
          rule: "בית 5 מתאים לשמחה, אהבה קלה, משיכה והנאה. בית 7 מתאים לאדם מול השואל, זוגיות, נישואין ושותפות ממשית.",
          implementationReady: true
        },
        {
          id: "children-family-root",
          title: "ילדים ושורש משפחתי",
          rule: "בשאלות ילדים יש לשלב לפי הצורך את בית 4 כשורש הבית והמשפחה.",
          implementationReady: true
        },
        {
          id: "health-sensitive-child-pregnancy",
          title: "רגישות בריאותית בילדים/היריון",
          rule: "אם השאלה נוגעת לבריאות, היריון, לידה או סכנה — יש לשלב את בית 6 ולהשתמש בניסוח זהיר בלבד.",
          displayPolicy: "advisorControlled",
          implementationReady: true
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 5 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 5 — האם השואל מחובר לשמחה, לילד, ליצירה או לאהבה.",
        "שכבה 3: באהבה — לבדוק אם בית 7 צריך להפוך לבית המרכזי.",
        "שכבה 4: בילדים/משפחה — לשלב את בית 4 לפי הצורך.",
        "שכבה 5: בעניינים רגישים של היריון/בריאות — לשלב בית 6 ולהשאיר ניסוח זהיר.",
        "שכבה 6: לבדוק את העדים והשופט אם הם מחזקים שמחה/הצלחה או עיכוב."
      ],
      blockedOrCarefulUse: [
        {
          id: "advisor-controlled-pregnancy-domain",
          rule: "אין לתת הבטחה רפואית על היריון, לידה, בריאות ילד או מצב גופני. זהו פירוש רמלי מסורתי בלבד.",
          status: "advisorControlled"
        },
        {
          id: "love-house7-caution",
          rule: "לא להכריע זוגיות/נישואין מבית 5 בלבד כאשר השאלה היא על אדם מול השואל; יש לבדוק בית 7.",
          status: "active"
        }
      ],
      engineUse: {
        role: "children-joy-love-creation-house",
        useWhenFocusHouseIs: 5,
        compareWithSeekerHouse: true,
        relationshipHouse: 7,
        familyRootHouse: 4,
        healthHouse: 6,
        supportHouses: [10, 11],
        canDecideAlone: false
      },
      implementationReady: true
    },

    house6IllnessServiceTroubleRules: {
      id: "house-6-illness-service-trouble-rules",
      house: 6,
      title: "בית 6 — דיני חולי, טרחה, עובדים, שירות ואויבים קטנים",
      arabicTerms: [
        "المرض",
        "بيت المرض",
        "الخدم",
        "العبيد",
        "التعب",
        "الأعداء الصغار",
        "الضعف"
      ],
      status: "foundation-ready-sensitive",
      sourceStatus: "compiled-from-approved-foundation-rules-topic-map-and-spiritual-diagnostics",
      displayPolicy: "advisorControlled",
      coreMeaning: [
        "בית 6 מייצג חולי, חולשה, כאב, טרחה ודברים שמחלישים את השואל.",
        "בית 6 מייצג עובדים, משרתים, שירות, עבודה תחת עומס או עבודה שאינה בשליטה מלאה של השואל.",
        "בית 6 מייצג אויבים קטנים, הפרעות קטנות, קושי יומיומי ודברים שמציקים אך אינם בהכרח יריב גלוי גדול.",
        "במודול הרוחני בית 6 הוא بيت المرض — בית המחלה.",
        "בית 6 כולל ידע רמלי/רוחני מסורתי בענייני חולי, חולשה וטרחה, לשימוש מקצועי של היועץ."
      ],
      questionTypes: [
        {
          id: "illness-health-pain",
          hebrew: "חולי / בריאות / כאב / חולשה",
          focusHouse: 6,
          compareWith: [1, 4, 10, 12],
          note: "בית 1 הוא האדם/החולה; בית 6 הוא המחלה; בית 4 יכול להראות תרופה/שורש ריפוי במודול הרוחני; בית 10 יכול להראות רופא/מטפל; בית 12 יכול להראות דבר נסתר/אויב נסתר/רוחני."
        },
        {
          id: "workload-service-employees",
          hebrew: "עובדים / משרתים / שירות / עבודה תחת עומס",
          focusHouse: 6,
          compareWith: [1, 10, 11],
          note: "בית 10 הוא עבודה/מעמד/סמכות; בית 11 עזרה ותמיכה; בית 6 מראה טרחה, כפיפות ועומס."
        },
        {
          id: "small-enemies-annoyances",
          hebrew: "אויבים קטנים / הפרעות קטנות / טרדות יומיומיות",
          focusHouse: 6,
          compareWith: [1, 7, 12],
          note: "בית 7 הוא יריב גלוי; בית 12 אויבים נסתרים; בית 6 הפרעות קטנות או מחלישות."
        },
        {
          id: "spiritual-or-hidden-illness",
          hebrew: "חשש לחולי רוחני / עין הרע / סחר / מס / חסד",
          focusHouse: 6,
          compareWith: [1, 4, 9, 10, 12],
          note: "להשתמש רק עם raml-spiritual-diagnostics.js ובמצב advisorOnly."
        },
        {
          id: "pregnancy-child-health-sensitive",
          hebrew: "בריאות ילד / היריון / לידה — רגיש",
          focusHouse: 6,
          compareWith: [1, 5, 4, 10],
          note: "בית 5 ילדים/היריון; בית 6 בריאות/חולי; הניסוח וההכרעה בשליטת היועץ המקצועי."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-6",
          title: "הצורה בבית 6",
          rule: "בודקים את הצורה בבית 6: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-6-strength",
          title: "חוזק בית 6",
          rule: "בית 6 הוא מן הסוואקט / הבתים הנופלים, ולכן מורה על חולשה, נפילה, קושי, טרחה או דבר שאינו עומד חזק לטובת השואל.",
          relatedFoundation: "sawaqit",
          implementationReady: true
        },
        {
          id: "seeker-house6-relationship",
          title: "יחס בית 1 לבית 6",
          rule: "בודקים את היחס בין השואל בבית 1 לבין בית 6. אם בית 6 חזק או קשה מול בית 1, הדבר מראה שהקושי/חולי/טרחה משפיעים על השואל.",
          implementationReady: true
        },
        {
          id: "medicine-root-healing-house4",
          title: "בית 4 כתרופה / שורש ריפוי במודול הרוחני",
          rule: "במודול האבחון הרוחני, בית 4 הוא الدواء — התרופה או שורש הריפוי. לכן בשאלות חולי/רוחני יש להשוות בית 6 לבית 4.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly",
          implementationReady: true
        },
        {
          id: "doctor-healer-house10",
          title: "בית 10 כרופא / מטפל / סמכות טיפולית",
          rule: "במודול האבחון הרוחני, בית 10 הוא الطبيب أو المعالج — הרופא או המרפא. לכן בשאלות חולי בודקים אם בית 10 תומך או חלש.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly",
          implementationReady: true
        },
        {
          id: "hidden-spiritual-risk-house12",
          title: "בית 12 כסוד / אויב נסתר / פגיעה נסתרת",
          rule: "אם בשאלת חולי יש חשש למקור נסתר, עין הרע, סחר, מס, חסד או אויב נסתר — משלבים את בית 12 ואת המודול הרוחני.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly / spiritualDiagnostic",
          implementationReady: true
        },
        {
          id: "sorcerer-house9",
          title: "בית 9 כסוחר/מכשף במודול הרוחני",
          rule: "במודול הרוחני בית 9 מוגדר כבית الساحر / העוסק בעבודה רוחנית מסוג זה. לכן בשאלות סחר/כישוף יש לשלב את בית 9.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly / spiritualDiagnostic",
          implementationReady: true
        },
        {
          id: "elemental-illness",
          title: "חולי לפי יסודות",
          rule: "אם משתמשים בשכבת יסודות: אש/אוויר/מים/עפר עשויים לרמוז על סוג טבע החולי או הליחה לפי המקורות, בשיקול דעת היועץ.",
          relatedFoundation: "elementsDirectionsIllness",
          displayPolicy: "advisorOnly",
          implementationReady: "partial"
        },
        {
          id: "drop-seven-open-points",
          title: "הפלת פתוח הרמל 7־7 באבחון רוחני",
          rule: "במודול הרוחני קיימת ספירת مفتوح الرمل והפלה 7־7: 1 ג׳ין, 2 חסד/עין, 3 סחר מאדם, 4 מים/בלغم, 5 אוויר/דם, 6 עפר/סודאא, 7 אש/צפראא.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly / spiritualDiagnostic",
          implementationReady: true
        },
        {
          id: "small-enemies-vs-open-opponent",
          title: "אויבים קטנים מול יריב גלוי",
          rule: "בית 6 מתאים לאויבים קטנים, טרדות והחלשות. אם מדובר ביריב גלוי או אדם מול השואל — יש לבדוק בית 7.",
          implementationReady: true
        },
        {
          id: "hidden-enemies-vs-small-enemies",
          title: "אויבים נסתרים מול אויבים קטנים",
          rule: "בית 12 מראה אויבים נסתרים, סוד ונזק מאחורי הקלעים. בית 6 מראה טרדות, מחלישים ואויבים קטנים.",
          implementationReady: true
        }
      ],
      spiritualDiagnosticLinks: {
        relatedFile: "raml-spiritual-diagnostics.js",
        status: "advisorOnly",
        houseRoles: [
          {
            house: 1,
            role: "המريض — החולה / האדם שעליו שואלים"
          },
          {
            house: 4,
            role: "الدواء — התרופה / פתרון / שורש ריפוי"
          },
          {
            house: 6,
            role: "بيت المرض — בית המחלה"
          },
          {
            house: 9,
            role: "الساحر — הסוחר/מכשף או בעלי עבודה רוחנית"
          },
          {
            house: 10,
            role: "الطبيب أو المعالج — רופא / מרפא / מטפל"
          },
          {
            house: 12,
            role: "بيت الأعداء — בית האויבים"
          }
        ],
        sensitiveTopics: [
          "سحر — סחר / כישוף",
          "مس — מס / פגיעה מג׳ין",
          "حسد — חסד / קנאה",
          "عين — עין הרע",
          "جن — ג׳ין",
          "مرض روحي — חולי רוחני"
        ],
        clientWordingControlledByAdvisor: true
      },
      decisionLayers: [
        "שכבה 1: מצב בית 6 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 6 — האם החולי/טרחה/עומס משפיעים ישירות על השואל.",
        "שכבה 3: בשאלת חולי — לבדוק בית 4 כתרופה/שורש ריפוי ובית 10 כרופא/מטפל.",
        "שכבה 4: אם יש חשש לדבר נסתר/רוחני — לבדוק בית 12 ובית 9, ולהפעיל רק ידע advisorOnly.",
        "שכבה 5: אם מדובר בעובדים/שירות/עבודה תחת עומס — לבדוק גם בית 10 ובית 11.",
        "שכבה 6: אם מדובר באויבים — להבדיל בין בית 6 אויבים קטנים, בית 7 יריב גלוי, ובית 12 אויבים נסתרים.",
        "שכבה 7: לבדוק עדים ושופט כדי לראות אם הקושי מתמשך, נחלש או נפתר."
      ],
      blockedOrCarefulUse: [
        {
          id: "advisor-controlled-health-domain",
          rule: "תחום חולי ואבחון רוחני נמצא בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        },
        {
          id: "spiritual-diagnosis-advisor-only",
          rule: "סחר, מס, חסד, עין הרע, ג׳ין וחולי רוחני הם תחומים מקצועיים הנשלטים על ידי היועץ.",
          status: "advisorControlled"
        },
        {
          id: "needs-human-judgment",
          rule: "אין להפעיל אבחון רוחני אוטומטי בלי שיקול דעת היועץ, כי יש לשלב צורה, בית, דמיר, עדים ושופט.",
          status: "active"
        },
        {
          id: "do-not-confuse-service-with-career",
          rule: "בית 6 מראה שירות/עומס/עובדים/כפיפות; בית 10 מראה קריירה, מעמד ותפקיד גלוי.",
          status: "active"
        }
      ],
      engineUse: {
        role: "illness-service-trouble-small-enemies-house",
        useWhenFocusHouseIs: 6,
        compareWithSeekerHouse: true,
        medicineHouse: 4,
        healerHouse: 10,
        spiritualHiddenHouse: 12,
        sorcererHouse: 9,
        openOpponentHouse: 7,
        childrenPregnancyHouse: 5,
        supportHouses: [10, 11],
        canDecideAlone: false,
        advisorOnlyWhenIllnessOrSpiritual: true
      },
      implementationReady: true
    },

    house7QueriedPartnerOpponentRules: {
      id: "house-7-queried-partner-opponent-rules",
      house: 7,
      title: "בית 7 — דיני הנשאל עליו, זוגיות, שותף, יריב גלוי וצד שני",
      arabicTerms: [
        "المسؤول عنه",
        "الزوج",
        "الزوجة",
        "الشريك",
        "الخصم",
        "المقابل",
        "الغريم"
      ],
      status: "foundation-ready",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      coreMeaning: [
        "בית 7 מייצג את האדם שמול השואל.",
        "בית 7 מייצג בן זוג, בת זוג, נישואין וקשר זוגי ממשי.",
        "בית 7 מייצג שותף, צד שני בעסקה, מוכר/קונה, יריב גלוי ובעל דין.",
        "בית 7 הוא היתד שמול בית 1, ולכן הוא הבית המרכזי להשוואה בין השואל לבין מי שעומד מולו.",
        "בשאלות אהבה קלות בית 5 יכול להיות חשוב, אבל כאשר מדובר באדם מול השואל, קשר ממשי או נישואין — בית 7 נעשה מרכזי."
      ],
      questionTypes: [
        {
          id: "marriage-relationship",
          hebrew: "זוגיות / נישואין / קשר ממשי",
          focusHouse: 7,
          compareWith: [1, 5, 10, 11],
          note: "בית 1 השואל; בית 7 האדם שמולו; בית 5 אהבה/שמחה; בית 10 תוצאה גלויה; בית 11 תקווה ועזרה."
        },
        {
          id: "queried-person",
          hebrew: "אדם ששואלים עליו / הנשאל עליו",
          focusHouse: 7,
          compareWith: [1, 3, 10, 12],
          note: "בית 7 הוא האדם שמול השואל. בית 12 אם יש סוד/הסתרה; בית 3 אם מדובר בהודעה/קשר/דיבור."
        },
        {
          id: "business-partner",
          hebrew: "שותף / שותפות / צד שני בעסק",
          focusHouse: 7,
          compareWith: [1, 2, 10, 11],
          note: "בית 2 כסף; בית 10 תוצאה גלויה/מעמד; בית 11 רווח/תמיכה."
        },
        {
          id: "buyer-seller-deal",
          hebrew: "קונה / מוכר / צד שני בעסקה",
          focusHouse: 7,
          compareWith: [1, 2, 4, 10],
          note: "בשאלת נכס/בית יש לשלב בית 4. בשאלת כסף יש לשלב בית 2."
        },
        {
          id: "open-opponent-dispute",
          hebrew: "יריב גלוי / סכסוך / אדם שמתנגד לשואל",
          focusHouse: 7,
          compareWith: [1, 6, 10, 12],
          note: "בית 7 יריב גלוי; בית 6 אויבים קטנים/טרדות; בית 12 אויבים נסתרים; בית 10 הכרעה גלויה/סמכות."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-7",
          title: "הצורה בבית 7",
          rule: "בודקים את הצורה בבית 7: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-7-strength",
          title: "חוזק בית 7",
          rule: "בית 7 הוא יתד, ולכן הוא חזק מאוד ומייצג אדם/צד שעומד בבירור מול השואל.",
          relatedFoundation: "awtad",
          implementationReady: true
        },
        {
          id: "seeker-vs-other",
          title: "בית 1 מול בית 7",
          rule: "בודקים את היחס בין השואל בבית 1 לבין האדם/צד שני בבית 7: התאמה, התנגדות, חזרת צורה, תמיכה או ניגוד יסודות.",
          implementationReady: true
        },
        {
          id: "love-house5-house7",
          title: "בית 5 מול בית 7 באהבה",
          rule: "בית 5 מראה אהבה, שמחה ונטיית לב; בית 7 מראה קשר ממשי, זוגיות, נישואין והאדם שמול השואל.",
          implementationReady: true
        },
        {
          id: "partnership-money",
          title: "שותפות וכסף",
          rule: "בשאלת שותפות עסקית או עסקה, יש לבדוק בית 2 לכסף ואת בית 10 לתוצאה גלויה/מעמד.",
          implementationReady: true
        },
        {
          id: "opponent-visible-hidden",
          title: "יריב גלוי מול אויב נסתר",
          rule: "בית 7 מראה יריב גלוי. בית 12 מראה אויב נסתר או דבר שפועל מאחורי הקלעים.",
          implementationReady: true
        },
        {
          id: "dispute-authority",
          title: "סכסוך והכרעה גלויה",
          rule: "אם השאלה על סכסוך, משפט, תביעה או יריב — בית 10 יכול להראות סמכות/הכרעה גלויה, ובית 12 יכול להראות תחבולה או סוד.",
          implementationReady: true
        },
        {
          id: "damir-other-person",
          title: "דמיר והאדם שמול השואל",
          rule: "אם הדמיר מצביע לבית 7 או לצורה החוזרת בבית 7, הדבר מחזק שהשאלה נוגעת באמת לאדם שמול השואל.",
          implementationReady: "partial",
          note: "חלק מדרכי הדמיר עדיין needsFormula ולכן לא כולן פעילות."
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 7 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 7 — האם יש חיבור, התנגדות, משיכה או עימות.",
        "שכבה 3: באהבה — לשלב בית 5; בזוגיות/נישואין — בית 7 מרכזי.",
        "שכבה 4: בעסקה/שותפות — לשלב בית 2 כסף, בית 10 תוצאה ובית 11 תמיכה.",
        "שכבה 5: ביריב/סכסוך — לבדוק בית 12 לאויב נסתר ובית 10 להכרעה גלויה.",
        "שכבה 6: לבדוק עדים ושופט כדי לראות אם הצד השני תומך, מתנגד או משנה את המהלך."
      ],
      blockedOrCarefulUse: [
        {
          id: "do-not-force-love-from-house5-alone",
          rule: "בשאלה על אדם ממשי, זוגיות או נישואין — אין להכריע מבית 5 בלבד; בית 7 חייב להיבדק.",
          status: "active"
        },
        {
          id: "advisor-controlled-other-person-domain",
          rule: "שאלות על אדם אחר נמצאות בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        },
        {
          id: "advisor-controlled-dispute-domain",
          rule: "שאלות סכסוך/תביעה/משפט נמצאות בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        }
      ],
      engineUse: {
        role: "queried-person-partner-opponent-house",
        useWhenFocusHouseIs: 7,
        compareWithSeekerHouse: true,
        loveJoyHouse: 5,
        moneyHouse: 2,
        propertyHouse: 4,
        authorityResultHouse: 10,
        supportHouse: 11,
        hiddenEnemyHouse: 12,
        smallEnemiesHouse: 6,
        canDecideAlone: false
      },
      implementationReady: true
    },

    house8DeathLossFearInheritanceRules: {
      id: "house-8-death-loss-fear-inheritance-rules",
      house: 8,
      title: "בית 8 — דיני מוות, פחד, הפסד, ירושה, סכנה ודבר כבד נסתר",
      arabicTerms: [
        "الموت",
        "الخوف",
        "الهلاك",
        "الفقد",
        "الخسارة",
        "الميراث",
        "مال الميت",
        "الأمر الخفي الثقيل",
        "الخطر",
        "العاقبة الصعبة"
      ],
      status: "foundation-ready-sensitive",
      sourceStatus: "compiled-from-approved-foundation-rules-and-topic-map",
      displayPolicy: "advisorControlled",
      coreMeaning: [
        "בית 8 מייצג מוות במובן המסורתי של דיני הבתים, וכן פחד, הפסד, ירושה, סכנה ודבר כבד.",
        "בית 8 מייצג פחד, חרדה, סכנה, הפסד ודבר כבד.",
        "בית 8 מייצג ירושה, ממון שבא מן המת, חובות או רכוש שעובר דרך משבר.",
        "בית 8 מייצג דבר נסתר וכבד שאינו גלוי מיד כמו בית 10 ואינו אויב נסתר רגיל כמו בית 12.",
        "בית 8 יכול להראות סוף קשה, אובדן, ניתוק, פחד עמוק או שינוי דרך משבר.",
        "בכל עניין רגיש של מוות, סכנה, חולי קשה או פחד — משתמשים בשפה זהירה בלבד."
      ],
      questionTypes: [
        {
          id: "death-or-danger-sensitive",
          hebrew: "מוות / סכנה / פחד קשה — רגיש מאוד",
          focusHouse: 8,
          compareWith: [1, 6, 4, 10, 12],
          note: "בית 1 האדם; בית 6 חולי; בית 4 שורש/סוף/תרופה במודול רוחני; בית 10 תוצאה גלויה/מטפל; בית 12 נסתר/אויב נסתר."
        },
        {
          id: "fear-anxiety-heavy-hidden-matter",
          hebrew: "פחד / חרדה / דבר כבד שיושב על השואל",
          focusHouse: 8,
          compareWith: [1, 6, 12, 15, 16],
          note: "בית 8 מראה כובד ופחד; בית 12 מראה נסתר; שופט/משפט מראים הכרעה כללית."
        },
        {
          id: "loss-damage-failure",
          hebrew: "הפסד / אובדן / נזק / כישלון",
          focusHouse: 8,
          compareWith: [1, 2, 7, 10, 12],
          note: "בית 2 כסף ורכוש; בית 7 צד שני/יריב; בית 12 הסתרה/אויב נסתר."
        },
        {
          id: "inheritance-dead-person-money",
          hebrew: "ירושה / ממון של מת / רכוש שעובר אחרי מוות",
          focusHouse: 8,
          compareWith: [1, 2, 4, 7, 10],
          note: "בית 2 כסף; בית 4 שורש משפחתי/נכס; בית 7 צד שני או יורש מול השואל; בית 10 תוצאה גלויה/אישור."
        },
        {
          id: "debts-obligations-after-crisis",
          hebrew: "חובות / התחייבויות / כסף דרך משבר",
          focusHouse: 8,
          compareWith: [1, 2, 10, 12],
          note: "בית 8 מראה כסף כבד או הפסד; בית 2 הכסף הרגיל של השואל."
        },
        {
          id: "hidden-heavy-transition",
          hebrew: "שינוי כבד / מעבר דרך משבר / דבר נסתר שמכביד",
          focusHouse: 8,
          compareWith: [1, 4, 10, 12],
          note: "בית 4 שורש וסוף; בית 10 תוצאה גלויה; בית 12 מה שמוסתר מאחורי הקלעים."
        },
        {
          id: "spiritual-heavy-harm",
          hebrew: "פגיעה רוחנית כבדה / פחד רוחני / כובד נסתר",
          focusHouse: 8,
          compareWith: [1, 6, 9, 10, 12],
          note: "להשתמש בזהירות ובמודול הרוחני בלבד: בית 6 חולי, בית 9 סוחר/מכשף, בית 10 מטפל, בית 12 אויבים נסתרים."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-8",
          title: "הצורה בבית 8",
          rule: "בודקים את הצורה בבית 8: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-8-strength",
          title: "חוזק בית 8",
          rule: "בית 8 הוא מן הבתים שאחרי היתדות, ולכן הוא אינו יתד אך יש לו משקל גדול בענייני הפסד, פחד, ירושה ומשבר.",
          relatedFoundation: "followingAwtad",
          implementationReady: true
        },
        {
          id: "seeker-house8-relationship",
          title: "יחס בית 1 לבית 8",
          rule: "בודקים אם בית 8 משפיע ישירות על השואל: חזרת צורה, ניגוד יסודות, סעד/נחס, קשר לעדים או לשופט.",
          implementationReady: true
        },
        {
          id: "illness-danger-house6",
          title: "בית 6 מול בית 8 בענייני חולי וסכנה",
          rule: "אם השאלה נוגעת לחולי או סכנה, בית 6 מראה את המחלה/חולשה ובית 8 מראה כובד, פחד או סכנת הפסד.",
          displayPolicy: "advisorControlled",
          implementationReady: true
        },
        {
          id: "inheritance-money-house2",
          title: "בית 2 מול בית 8 בירושה וממון",
          rule: "בית 2 מראה כסף ורכוש של השואל. בית 8 מראה ירושה, הפסד, ממון של מת או כסף שבא דרך משבר.",
          implementationReady: true
        },
        {
          id: "property-inheritance-house4",
          title: "בית 4 מול בית 8 בנכס/ירושה",
          rule: "אם הירושה או ההפסד קשורים לבית, קרקע, משפחה או שורש עניין — משלבים את בית 4.",
          implementationReady: true
        },
        {
          id: "other-party-house7",
          title: "בית 7 מול בית 8 בצד שני או יריב",
          rule: "אם ההפסד, הירושה או המשבר תלויים באדם אחר, יריב, יורש נוסף, קונה/מוכר או צד שני — בודקים את בית 7.",
          implementationReady: true
        },
        {
          id: "hidden-enemy-house12",
          title: "בית 12 מול בית 8 בדבר נסתר",
          rule: "בית 8 מראה כובד, פחד, הפסד ומשבר; בית 12 מראה אויב נסתר, סוד, הסתרה או פגיעה מאחורי הקלעים. יש להבדיל ביניהם אך לבדוק קשר ביניהם.",
          implementationReady: true
        },
        {
          id: "authority-result-house10",
          title: "בית 10 כתוצאה גלויה או סמכות",
          rule: "בשאלות ירושה, הפסד, חוב או סכנה — בית 10 יכול להראות הכרעה גלויה, סמכות, רופא/מטפל, שופט, רשות או תוצאה שנראית לעין.",
          implementationReady: true
        },
        {
          id: "judge-and-final-houses",
          title: "שופט ומשפט בבית 8",
          rule: "בעניינים כבדים אין להכריע רק מבית 8. יש לבדוק עדים, שופט ומשפט כדי לדעת אם הכובד מתאשר, נחלש או משתנה.",
          relatedHouses: [13, 14, 15, 16],
          implementationReady: true
        },
        {
          id: "spiritual-diagnostic-connection",
          title: "קשר למודול האבחון הרוחני",
          rule: "אם בית 8 מצטרף לבית 6, 9, 10 או 12 בשאלת חולי/פחד/פגיעה נסתרת, יש לבדוק את המודול הרוחני אך לשמור זאת advisorOnly.",
          relatedFile: "raml-spiritual-diagnostics.js",
          displayPolicy: "advisorOnly / spiritualDiagnostic",
          implementationReady: true
        },
        {
          id: "elemental-heavy-indication",
          title: "יסוד הצורה בבית 8",
          rule: "יסוד הצורה בבית 8 עשוי לרמוז על אופי הכובד: אש — חריפות/סכנה מהירה; אוויר — תנועה/דאגה; מים — הצפה/בלבול/לחות; עפר — כובד/תקיעות/ירידה.",
          displayPolicy: "advisorControlled",
          implementationReady: "partial"
        }
      ],
      spiritualAndSensitiveLinks: {
        relatedFile: "raml-spiritual-diagnostics.js",
        status: "advisorOnly",
        relatedHouses: [
          {
            house: 1,
            role: "השואל / האדם שעליו שואלים"
          },
          {
            house: 6,
            role: "בית המחלה / חולשה"
          },
          {
            house: 8,
            role: "כובד, פחד, הפסד, סכנה, ירושה ודבר משברי"
          },
          {
            house: 9,
            role: "סוחר/מכשף או עוסק בעבודה רוחנית לפי המודול הרוחני"
          },
          {
            house: 10,
            role: "רופא / מטפל / סמכות / תוצאה גלויה"
          },
          {
            house: 12,
            role: "אויב נסתר / סוד / פגיעה מאחורי הקלעים"
          }
        ],
        sensitiveTopics: [
          "מוות",
          "סכנה",
          "חולי קשה",
          "פחד כבד",
          "פגיעה רוחנית",
          "סחר / מס / חסד / עין",
          "אובדן וירושה"
        ],
        clientWordingControlledByAdvisor: true
      },
      occultSpiritualTopics: {
        id: "house-8-occult-spiritual-heavy-hidden-topics",
        title: "בית 8 — עניינים רוחניים כבדים ונסתרים",
        status: "advisorControlled",
        professionalUse: true,
        clientWordingControlledByAdvisor: true,
        sourceLinks: [
          "raml-spiritual-diagnostics.js",
          "raml-foundation-bulugh-al-amal.js",
          "approved uploaded spiritual-diagnostic source"
        ],
        coreMeaning: [
          "בית 8 יכול להשתתף באבחון עניינים רוחניים כבדים, נסתרים ומשבריים.",
          "כאשר בית 8 מתחבר לבית 6, 9, 10 או 12 — יש לבדוק קשר אפשרי לחולי רוחני, פגיעה נסתרת, סחר, מס, חסד, עין, ג׳ין, רוחות או קללות.",
          "בית 8 אינו מחליף את בית 12: בית 8 מראה כובד, סכנה, הפסד, פחד, מוות, ירושה ומשבר; בית 12 מראה אויב נסתר, סוד, הסתרה ופגיעה מאחורי הקלעים.",
          "בית 8 אינו מחליף את בית 6: בית 6 הוא בית המחלה/החולשה; בית 8 מראה כובד, סכנת הפסד, עומק המשבר או תוצאה קשה.",
          "בית 8 אינו מחליף את בית 9 במודול הרוחני: בית 9 יכול להראות الساحر / הסוחר / המכשף / בעל העבודה הרוחנית.",
          "בית 8 יכול להראות שהעניין הרוחני הוא כבד, מסוכן, קשור להפסד, פחד, מוות, ירושה, קבר, קבורה, דבר מכוסה או דבר שלא יוצא לאור בקלות."
        ],
        occultTerms: [
          {
            arabic: "سحر",
            hebrew: "סחר / כישוף",
            house8Connection: "כישוף כבד, נסתר, קבור, קשור להפסד, פחד, נזק, קבר, ירושה או דבר מת."
          },
          {
            arabic: "مس",
            hebrew: "מס / פגיעת ג׳ין",
            house8Connection: "מס כבד המשפיע דרך פחד, לחץ, חולשה עמוקה, סכנה או תחושת כובד נסתר."
          },
          {
            arabic: "جن",
            hebrew: "ג׳ין / שדים",
            house8Connection: "כאשר בית 8 מתחבר לבית 6/9/12 או לצורות קשות, יש לבדוק אם יש רמז לפגיעת ג׳ין או שדים לפי המודול הרוחני."
          },
          {
            arabic: "أرواح",
            hebrew: "רוחות",
            house8Connection: "רוחות או השפעה רוחנית נסתרת הקשורה לפחד, מוות, קבר, בית מת, מקום כבד או עניין שאינו גלוי."
          },
          {
            arabic: "عين",
            hebrew: "עין הרע",
            house8Connection: "עין הרע כאשר היא גורמת הפסד, פחד, נזק, עצירה כבדה או כובד נסתר."
          },
          {
            arabic: "حسد",
            hebrew: "חסד / קנאה",
            house8Connection: "קנאה קשה שמביאה פחד, הפסד, פגיעה נסתרת, כובד, חולי או נזק."
          },
          {
            arabic: "لعنة / لعنات",
            hebrew: "קללה / קללות",
            house8Connection: "קללה או דיבור מזיק כאשר היא מחוברת לכובד, הפסד, סכנה, פחד, חולי או דבר נסתר."
          },
          {
            arabic: "عمل مدفون",
            hebrew: "סחר קבור / פעולה קבורה",
            house8Connection: "קשר חזק לבית 8 בגלל קבורה, קבר, מתים, דבר טמון באדמה או דבר מוסתר."
          },
          {
            arabic: "عمل مشروب",
            hebrew: "סחר משקה / דבר שנשתה",
            house8Connection: "נבדק יחד עם בית 6 לחולי, בית 12 להסתרה, ובית 8 לכובד/נזק/הפסד."
          },
          {
            arabic: "عمل في البيت",
            hebrew: "סחר בבית / פעולה בבית",
            house8Connection: "נבדק יחד עם בית 4 לבית/מקום, בית 12 להסתרה, ובית 8 לכובד או נזק מצטבר."
          }
        ],
        houseCombinations: [
          {
            houses: [1, 8],
            meaning: "השואל עצמו מושפע מכובד, פחד, הפסד, סכנה, מוות, ירושה או דבר נסתר כבד."
          },
          {
            houses: [6, 8],
            meaning: "חולי/חולשה עם כובד, פחד, סכנת הפסד, השפעה נסתרת או משבר עמוק."
          },
          {
            houses: [8, 12],
            meaning: "דבר כבד ונסתר יחד עם אויב נסתר, סוד, פגיעה מאחורי הקלעים, עין, חסד, סחר או קללה."
          },
          {
            houses: [8, 9],
            meaning: "קשר בין בית 8 לבין הסוחר/המכשף/בעל העבודה הרוחנית, או עבודה רוחנית כבדה."
          },
          {
            houses: [8, 10],
            meaning: "העניין הכבד יוצא לתוצאה גלויה, רשות, מטפל, מרפא, בעל סמכות או הכרעה נראית."
          },
          {
            houses: [4, 8],
            meaning: "כובד הקשור לבית, קרקע, קבר, שורש משפחתי, נכס, מקום קבוע או סוף הדבר."
          },
          {
            houses: [2, 8],
            meaning: "הפסד ממון, ירושה, חוב, רכוש של מת, כסף שבא דרך משבר או נזק לרכוש."
          },
          {
            houses: [7, 8],
            meaning: "אדם מול השואל, יריב, בן/בת זוג, שותף או צד שני הקשור להפסד, פחד, סוד כבד או עניין נסתר."
          }
        ],
        diagnosticChecks: [
          "לבדוק את הצורה בבית 8 עצמה.",
          "לבדוק האם צורת בית 8 חוזרת בבית 6, 9, 10, 12, בעדים, בשופט או במשפט.",
          "לבדוק האם בית 8 מקבל צורה נחסית, כבדה, סגורה, יוצאת/נכנסת לפי הקידוד המאומת.",
          "לבדוק האם בית 8 מחובר לבית 12 בסוד/אויב נסתר.",
          "לבדוק האם בית 8 מחובר לבית 6 בחולי/חולשה.",
          "לבדוק האם בית 8 מחובר לבית 9 בסוחר/מכשף/עבודה רוחנית.",
          "לבדוק האם בית 8 מחובר לבית 4 בבית/קרקע/קבר/שורש/סוף הדבר.",
          "לבדוק את המודול raml-spiritual-diagnostics.js כאשר מופיע חשד לסחר, מס, חסד, עין, ג׳ין, רוחות או קללות.",
          "לבדוק הפלת פתוח הרמל 7־7 אם ההקשר הרוחני מתאים והנתון קיים.",
          "לבדוק עדים ושופט לפני חיתוך סופי."
        ],
        relatedSpiritualDiagnosticsRules: [
          {
            ruleId: "drop-seven-open-points-rule",
            file: "raml-spiritual-diagnostics.js",
            use: "ספירת مفتوح الرمل והפלה 7־7: ג׳ין, חסד/עין, סחר מאדם, ומחלות לפי יסודות."
          },
          {
            ruleId: "specific-sorcery-examples",
            file: "raml-spiritual-diagnostics.js",
            use: "דוגמאות צורה+בית: אנקיס בבית 6, ג׳ודלה בבית 6/12, קבץ דאחל בבית 6, עקלה בבית 13/14, ג׳מאעה בבית 6."
          },
          {
            ruleId: "painful-organ-and-jinn-type",
            file: "raml-spiritual-diagnostics.js",
            use: "נוסחאות 6×8 לאיבר כואב ו־15×4 לסוג הג׳ין — עדיין needsFormula."
          },
          {
            ruleId: "damir-house-spiritual-diagnosis",
            file: "raml-spiritual-diagnostics.js",
            use: "שימוש בדמיר, תכונות בתים, חזרת צורות, מעברים והכאות כדי לדעת מה קרה לאדם."
          }
        ],
        implementationReady: true
      },

      decisionLayers: [
        "שכבה 1: מצב בית 8 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 8 — האם הכובד/פחד/הפסד נוגע ישירות לשואל.",
        "שכבה 3: אם מדובר בכסף/ירושה — לשלב בית 2 ובית 4.",
        "שכבה 4: אם מדובר באדם אחר או יריב — לשלב בית 7.",
        "שכבה 5: אם מדובר בחולי/סכנה — לשלב בית 6, בית 10 ובית 4 בזהירות.",
        "שכבה 6: אם יש חשד לדבר נסתר או רוחני — לשלב בית 12, בית 9 והמודול הרוחני במצב advisorOnly.",
        "שכבה 7: לבדוק עדים, שופט ומשפט לפני כל מסקנה קשה.",
        "שכבה 8: ניסוח התשובה ללקוח נקבע על ידי היועץ המקצועי."
      ],
      blockedOrCarefulUse: [
        {
          id: "advisor-controlled-house8-death-domain",
          rule: "בית 8 כולל מוות, סכנה, פחד, הפסד, ירושה ודבר כבד; הניסוח וההכרעה בשליטת היועץ המקצועי.",
          status: "advisorControlled"
        },
        {
          id: "advisor-controlled-health-domain",
          rule: "תחום חולי, סכנה ותחזית רפואית נמצא בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        },
        {
          id: "advisor-controlled-inheritance-domain",
          rule: "שאלות ירושה, חוב או רכוש נמצאות בשליטת היועץ המקצועי ובשיקול דעתו.",
          status: "advisorControlled"
        },
        {
          id: "spiritual-heavy-advisor-only",
          rule: "פגיעה רוחנית, סחר, עין, מס, חסד או ג׳ין בהקשר בית 8 הם advisorOnly ולא מוצגים ללקוח כברירת מחדל.",
          status: "advisorControlled"
        },
        {
          id: "do-not-decide-from-house8-alone",
          rule: "בית 8 לעולם לא מספיק לבדו למסקנה קשה. חייבים לבדוק בית נושא, בית 1, עדים, שופט ומשפט.",
          status: "active"
        }
      ],
      engineUse: {
        role: "death-loss-fear-inheritance-heavy-hidden-house",
        useWhenFocusHouseIs: 8,
        compareWithSeekerHouse: true,
        moneyHouse: 2,
        propertyFamilyRootHouse: 4,
        illnessHouse: 6,
        otherPartyHouse: 7,
        spiritualPractitionerHouse: 9,
        authorityHealerResultHouse: 10,
        hiddenEnemyHouse: 12,
        judgeHouses: [13, 14, 15, 16],
        canDecideAlone: false,
        advisorOnlyWhenDeathDangerIllnessOrSpiritual: true,
        clientWordingControlledByAdvisor: true
      },
      implementationReady: true
    },

    house9TravelReligionDreamSpiritualRules: {
      id: "house-9-travel-religion-dream-spiritual-rules",
      house: 9,
      title: "בית 9 — דיני נסיעה רחוקה, דת, חלום, חזון, לימוד, חכמה ועבודה רוחנית",
      arabicTerms: [
        "السفر",
        "السفر البعيد",
        "الدين",
        "الرؤيا",
        "الحلم",
        "العلم",
        "الحكمة",
        "الأستاذ",
        "المعلم",
        "الساحر",
        "الروحاني",
        "الكهانة",
        "العرافة",
        "الشعوذة"
      ],
      status: "foundation-ready-spiritual-linked",
      sourceStatus: "compiled-from-approved-foundation-rules-topic-map-and-spiritual-diagnostics",
      displayPolicy: "advisorControlled",
      professionalUse: true,
      clientWordingControlledByAdvisor: true,
      coreMeaning: [
        "בית 9 מייצג נסיעה רחוקה, דרך רחוקה, חו״ל ומסע משמעותי.",
        "בית 9 מייצג דת, אמונה, עבודת קודש, תפילה, תורה, לימוד וחכמה.",
        "בית 9 מייצג חלום, חזון, ראייה פנימית, סימן רוחני או ידיעה שמגיעה ממקור גבוה/נסתר.",
        "בית 9 מייצג מורה, רב, חכם, מדריך, בעל ידע או מי שמוסר חכמה.",
        "במודול האבחון הרוחני בית 9 מוגדר כבית الساحر — הסוחר/המכשף/בעל עבודה רוחנית.",
        "בית 9 יכול להראות אדם העוסק בכישוף, סחר, רוחניות, כהאנה, עראפה, שעודה, ג׳ין, רוחות או עבודה נסתרת.",
        "בית 9 אינו מחליף את בית 12: בית 9 מראה את בעל העבודה/הידע/הכוח הרוחני; בית 12 מראה אויב נסתר, סוד, פגיעה מאחורי הקלעים.",
        "בית 9 אינו מחליף את בית 6: בית 6 מראה מחלה/חולשה; בית 9 יכול להראות את המקור הרוחני או בעל הפעולה כאשר יש קשר רוחני."
      ],
      questionTypes: [
        {
          id: "long-travel-foreign-place",
          hebrew: "נסיעה רחוקה / חו״ל / דרך ארוכה / מקום רחוק",
          focusHouse: 9,
          compareWith: [1, 3, 4, 10],
          note: "בית 3 תנועה קרובה; בית 9 נסיעה רחוקה; בית 4 מקום/בית/שורש; בית 10 תוצאה גלויה."
        },
        {
          id: "religion-faith-prayer",
          hebrew: "דת / אמונה / תפילה / עבודת קודש",
          focusHouse: 9,
          compareWith: [1, 10, 11, 12],
          note: "בית 1 השואל; בית 10 תוצאה גלויה/מעמד; בית 11 תקווה ותמיכה; בית 12 סוד/נסתר."
        },
        {
          id: "dream-vision-sign",
          hebrew: "חלום / חזון / סימן / ידיעה פנימית",
          focusHouse: 9,
          compareWith: [1, 12, 15, 16],
          note: "בית 12 נסתר וסוד; שופט/משפט מראים הכרעה כללית של המסר."
        },
        {
          id: "learning-wisdom-teacher",
          hebrew: "לימוד / חכמה / מורה / רב / מדריך",
          focusHouse: 9,
          compareWith: [1, 10, 11],
          note: "בית 10 מראה מעמד/תוצאה גלויה; בית 11 עזרה ותמיכה."
        },
        {
          id: "spiritual-practitioner-sorcerer",
          hebrew: "סוחר / מכשף / בעל עבודה רוחנית / איש רוח / כהאנה / עראפה",
          focusHouse: 9,
          compareWith: [1, 6, 8, 10, 12],
          note: "לפי המודול הרוחני בית 9 הוא בית الساحر. יש לבדוק בית 6 מחלה, בית 8 כובד/פחד/הפסד, בית 10 מטפל/מרפא/תוצאה, בית 12 אויב נסתר/סוד."
        },
        {
          id: "jinn-spirits-occult-source",
          hebrew: "ג׳ין / שדים / רוחות / מקור רוחני של פגיעה",
          focusHouse: 9,
          compareWith: [1, 6, 8, 10, 12],
          note: "בית 9 יכול להראות בעל פעולה או מקור ידע/עבודה רוחנית; בית 12 מראה הסתרה/אויב נסתר; בית 6 חולי; בית 8 כובד/סכנה/פחד."
        }
      ],
      whatToInspect: [
        {
          id: "figure-in-house-9",
          title: "הצורה בבית 9",
          rule: "בודקים את הצורה בבית 9: סעד/נחס/ממוזג, יסוד, פתוח/סגור, קל/כבד, נכנס/יוצא אם קיים קידוד מאומת.",
          implementationReady: true
        },
        {
          id: "house-9-strength",
          title: "חוזק בית 9",
          rule: "בית 9 הוא מן הבתים הנופלים / הסוואקט, ולכן יש לבדוק היטב אם הדבר רחוק, נסתר, רוחני, תלוי בזמן או אינו בשליטת השואל.",
          relatedFoundation: "sawaqit",
          implementationReady: true
        },
        {
          id: "seeker-house9-relationship",
          title: "יחס בית 1 לבית 9",
          rule: "בודקים האם השואל מחובר לנסיעה, לאמונה, לחלום, ללימוד או לאדם הרוחני שמופיע בבית 9.",
          implementationReady: true
        },
        {
          id: "short-vs-long-travel-house3-house9",
          title: "הבחנה בין בית 3 לבית 9 בנסיעות",
          rule: "בית 3 מראה תנועה קרובה, שליחים והודעות; בית 9 מראה נסיעה רחוקה, חו״ל, דרך ארוכה ומסע משמעותי.",
          implementationReady: true
        },
        {
          id: "dream-hidden-house12",
          title: "חלום וחזון מול בית 12",
          rule: "בחלום, חזון או סימן נסתר יש לבדוק את בית 9 כמסר/חזון ואת בית 12 כסוד, נסתר או דבר שלא נראה בגלוי.",
          implementationReady: true
        },
        {
          id: "teacher-authority-house10",
          title: "מורה, רב, מדריך ותוצאה גלויה",
          rule: "בשאלות לימוד, מורה, רב או חכם — בית 9 מראה את הידע/המורה ובית 10 יכול להראות מעמד, אישור, הכרה או תוצאה גלויה.",
          implementationReady: true
        },
        {
          id: "spiritual-practitioner-house9",
          title: "בית 9 כסוחר/מכשף/בעל עבודה רוחנית",
          rule: "במודול הרוחני בית 9 הוא بيت الساحر — הסוחר/המכשף/בעל העבודה הרוחנית. בודקים אותו כאשר יש שאלה על סחר, כישוף, ג׳ין, רוחות, כהאנה, עראפה או שעודה.",
          relatedFile: "raml-spiritual-diagnostics.js",
          implementationReady: true
        },
        {
          id: "house9-with-house6",
          title: "בית 9 עם בית 6",
          rule: "חיבור בין בית 9 לבית 6 יכול להראות קשר בין בעל פעולה/מקור רוחני לבין חולי, חולשה, טרחה או מחלה.",
          relatedFile: "raml-spiritual-diagnostics.js",
          implementationReady: true
        },
        {
          id: "house9-with-house8",
          title: "בית 9 עם בית 8",
          rule: "חיבור בין בית 9 לבית 8 יכול להראות עבודה רוחנית כבדה, סחר/כישוף כבד, פחד, הפסד, מוות, קבר, ירושה, סכנה או דבר נסתר בעל משקל.",
          implementationReady: true
        },
        {
          id: "house9-with-house12",
          title: "בית 9 עם בית 12",
          rule: "חיבור בין בית 9 לבית 12 יכול להראות עבודה נסתרת, אויב נסתר בעל ידע, סוד רוחני, כישוף נסתר, ג׳ין, רוחות, עין, חסד, קללה או פגיעה מאחורי הקלעים.",
          implementationReady: true
        },
        {
          id: "house9-with-house10",
          title: "בית 9 עם בית 10",
          rule: "חיבור בין בית 9 לבית 10 יכול להראות רופא/מרפא/מטפל, בעל סמכות רוחנית, מורה גלוי, או שהעניין הרוחני יוצא לתוצאה גלויה.",
          implementationReady: true
        }
      ],
      occultSpiritualTopics: {
        id: "house-9-occult-spiritual-practitioner-topics",
        title: "בית 9 — בעל עבודה רוחנית, סחר, ג׳ין, רוחות, כהאנה ועראפה",
        status: "advisorControlled",
        professionalUse: true,
        clientWordingControlledByAdvisor: true,
        sourceLinks: [
          "raml-spiritual-diagnostics.js",
          "approved uploaded spiritual-diagnostic source"
        ],
        occultTerms: [
          {
            arabic: "الساحر",
            hebrew: "הסוחר / המכשף",
            house9Meaning: "אדם שעושה פעולה רוחנית, כישוף, סחר או עבודה נסתרת."
          },
          {
            arabic: "الروحاني",
            hebrew: "רוחני / בעל עבודה רוחנית",
            house9Meaning: "אדם הפועל דרך ידע רוחני, שמות, השבעות, עבודות או דרכים נסתרות."
          },
          {
            arabic: "الكاهن",
            hebrew: "כאהן / כהאנה",
            house9Meaning: "אדם העוסק בניחוש, ידיעה נסתרת או עבודה מסורתית של כהאנה."
          },
          {
            arabic: "العراف",
            hebrew: "עראף / מגיד נסתרות",
            house9Meaning: "אדם הטוען לידיעת נסתרות או גילוי דברים שאינם גלויים."
          },
          {
            arabic: "الشعوذة",
            hebrew: "שעודה / כשפים / להטוטים",
            house9Meaning: "עיסוק במעשים רוחניים/מאגיים/להטוטיים לפי לשון המקורות."
          },
          {
            arabic: "الجن",
            hebrew: "ג׳ין / שדים",
            house9Meaning: "בית 9 יכול להראות מי שעובד עם ג׳ין או מקור פעולה שקשור בג׳ין כאשר יש תמיכה מבתים 6/8/12."
          },
          {
            arabic: "الأرواح",
            hebrew: "רוחות",
            house9Meaning: "מקור רוחני, רוחות, מסרים או השפעות שאינן גשמיות."
          },
          {
            arabic: "السحر",
            hebrew: "סחר / כישוף",
            house9Meaning: "בית 9 יכול להצביע על בעל הסחר/המכשף או מקור הפעולה."
          },
          {
            arabic: "العين",
            hebrew: "עין הרע",
            house9Meaning: "כאשר בית 9 מתחבר לבית 12/8/6, אפשר לבדוק אם מקור הפגיעה קשור לעין או בעל פעולה רוחנית."
          },
          {
            arabic: "الحسد",
            hebrew: "חסד / קנאה",
            house9Meaning: "קנאה או חסד עם מקור רוחני/אדם פועל/ידיעה נסתרת."
          },
          {
            arabic: "اللعنة",
            hebrew: "קללה",
            house9Meaning: "קללה או דיבור מזיק כאשר יש קשר לבית 12 להסתרה או לבית 8 לכובד/נזק."
          }
        ],
        diagnosticChecks: [
          "לבדוק את הצורה בבית 9.",
          "לבדוק אם הצורה בבית 9 חוזרת בבית 6, 8, 10, 12, בעדים, בשופט או במשפט.",
          "לבדוק אם בית 9 מחובר לבית 12 — עבודה נסתרת או אויב נסתר בעל ידע.",
          "לבדוק אם בית 9 מחובר לבית 6 — השפעה על חולי/חולשה.",
          "לבדוק אם בית 9 מחובר לבית 8 — כישוף כבד, פחד, הפסד, סכנה, קבר, ירושה או דבר מת.",
          "לבדוק אם בית 9 מחובר לבית 10 — מטפל/מרפא/מורה/בעל סמכות או תוצאה גלויה.",
          "לבדוק את raml-spiritual-diagnostics.js כאשר יש סימנים לסחר, מס, חסד, עין, ג׳ין, רוחות או קללות.",
          "לבדוק דמיר, חזרת צורות, עדים, שופט ומשפט לפני חיתוך."
        ]
      },
      houseCombinations: [
        {
          houses: [1, 9],
          meaning: "השואל קשור לנסיעה רחוקה, אמונה, חלום, לימוד, מורה או עניין רוחני."
        },
        {
          houses: [3, 9],
          meaning: "הבחנה בין נסיעה קרובה/הודעה לבין נסיעה רחוקה/חזון/מסר עמוק."
        },
        {
          houses: [6, 9],
          meaning: "חולי/חולשה/טרחה עם מקור רוחני, בעל פעולה, סחר, ג׳ין או עבודה נסתרת."
        },
        {
          houses: [8, 9],
          meaning: "עבודה רוחנית כבדה, כישוף כבד, פחד, הפסד, מוות, קבר, ירושה או דבר נסתר חמור."
        },
        {
          houses: [9, 10],
          meaning: "מורה/רב/מטפל/מרפא/בעל סמכות רוחנית או תוצאה גלויה של עניין רוחני."
        },
        {
          houses: [9, 12],
          meaning: "עבודה נסתרת, אויב נסתר בעל ידע, סוד רוחני, פגיעה מאחורי הקלעים, עין, חסד, ג׳ין, רוחות או קללה."
        }
      ],
      decisionLayers: [
        "שכבה 1: מצב בית 9 לפי הצורה שבו.",
        "שכבה 2: יחס בית 1 לבית 9 — האם השואל מחובר לנסיעה, חזון, לימוד, דת או עניין רוחני.",
        "שכבה 3: בנסיעות — להבחין בין בית 3 לבית 9.",
        "שכבה 4: בחלומות/חזיונות — לבדוק בית 12, עדים, שופט ומשפט.",
        "שכבה 5: בלימוד/מורה/רב — לבדוק בית 10 ובית 11.",
        "שכבה 6: בעניינים רוחניים — לבדוק בית 6, 8, 10, 12 ואת raml-spiritual-diagnostics.js.",
        "שכבה 7: לבדוק חזרת צורות, דמיר, עדים ושופט לפני הכרעה."
      ],
      blockedOrCarefulUse: [
        {
          id: "advisor-controlled-spiritual-house9-domain",
          rule: "בית 9 כולל דת, חלום, חזון, חכמה, מורה, סוחר/מכשף, ג׳ין, רוחות, כהאנה, עראפה, שעודה ועבודה רוחנית; הניסוח וההכרעה בשליטת היועץ המקצועי.",
          status: "advisorControlled"
        }
      ],
      engineUse: {
        role: "long-travel-religion-dream-wisdom-spiritual-practitioner-house",
        useWhenFocusHouseIs: 9,
        compareWithSeekerHouse: true,
        shortTravelHouse: 3,
        illnessHouse: 6,
        heavyHiddenHouse: 8,
        authorityHealerTeacherHouse: 10,
        supportHouse: 11,
        hiddenEnemyHouse: 12,
        judgeHouses: [13, 14, 15, 16],
        canDecideAlone: false,
        advisorControlled: true,
        clientWordingControlledByAdvisor: true
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
