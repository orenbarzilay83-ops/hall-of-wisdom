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
          rule: "בשאלות על הודעות או אנשים אחרים, לשמור על ניסוח זהיר ולא להציג חדירה לפרטיות כעובדה מוחלטת.",
          status: "advisorNote"
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
          id: "property-legal-financial-care",
          rule: "בשאלות נכס/קנייה/מכירה אין להציג ייעוץ משפטי או פיננסי מחייב. זהו פירוש רמלי בלבד.",
          status: "advisorNote"
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
          displayPolicy: "advisorOnly / careful language",
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
          id: "pregnancy-no-medical-promise",
          rule: "אין לתת הבטחה רפואית על היריון, לידה, בריאות ילד או מצב גופני. זהו פירוש רמלי מסורתי בלבד.",
          status: "advisorNote"
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
      displayPolicy: "carefulLanguage / advisorOnly when illness or spiritual diagnosis is involved",
      coreMeaning: [
        "בית 6 מייצג חולי, חולשה, כאב, טרחה ודברים שמחלישים את השואל.",
        "בית 6 מייצג עובדים, משרתים, שירות, עבודה תחת עומס או עבודה שאינה בשליטה מלאה של השואל.",
        "בית 6 מייצג אויבים קטנים, הפרעות קטנות, קושי יומיומי ודברים שמציקים אך אינם בהכרח יריב גלוי גדול.",
        "במודול הרוחני בית 6 הוא بيت المرض — בית המחלה.",
        "אין להשתמש בבית 6 כדי לתת אבחנה רפואית. באפליקציה זה ידע רמלי/רוחני מסורתי בלבד."
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
          note: "בית 5 ילדים/היריון; בית 6 בריאות/חולי; לא להציג כהבטחה רפואית."
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
          rule: "אם משתמשים בשכבת יסודות: אש/אוויר/מים/עפר עשויים לרמוז על סוג טבע החולי או הליחה לפי המקורות. אין להציג זאת כאבחנה רפואית.",
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
        clientReportDefault: false
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
          id: "no-medical-diagnosis",
          rule: "אין להציג מסקנה רפואית או אבחנה רפואית. יש לנסח כקריאה רמלית/רוחנית מסורתית בלבד.",
          status: "mandatory"
        },
        {
          id: "spiritual-diagnosis-advisor-only",
          rule: "סחר, מס, חסד, עין הרע, ג׳ין וחולי רוחני הם advisorOnly ולא מופיעים בדוח לקוח כברירת מחדל.",
          status: "mandatory"
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
          id: "privacy-care",
          rule: "בשאלות על אדם אחר יש לנסח בזהירות ולא להציג חדירה מוחלטת למחשבותיו כעובדה.",
          status: "advisorNote"
        },
        {
          id: "legal-dispute-care",
          rule: "בשאלות סכסוך/תביעה/משפט אין להציג ייעוץ משפטי. זהו פירוש רמלי בלבד.",
          status: "advisorNote"
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
