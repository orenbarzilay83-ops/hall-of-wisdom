export const RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD = {
  id: "raml-spiritual-diagnostics-sihr-mass-hasad",
  sourceGroup: "approved-raml-sources",
  sourceStatus: "user-approved-screenshot-source",
  sourceTitleArabic: "أحكام السحر والمس والحسد في علم الرمل",
 sourceTitleHebrew: "דיני כישוף, מס/אחיזה וקנאה במדע הרמל",
  visiblePages: [56, 57],
 knowledgeDomain: "spiritual-diagnostics",
 extractionStatus: "visual-source-extracted-needs-final-review",
  purposeHebrew:
 "שכבת ידע לאבחון רוחני בגורל החול: כישוף, מס/אחיזה, קנאה/עין, ג׳ין, קשרים, סוגי מחלה לפי יסודות, ותפקידי הבתים בשאלת חולי/כישוף.",

  coreTerms: {
    sihr: {
      arabic: "السحر",
 hebrew: "כישוף"
    },
    mass: {
      arabic: "المس",
 hebrew: "מס / אחיזה / פגיעה רוחנית"
    },
    hasad: {
      arabic: "الحسد",
 hebrew: "קנאה מזיקה"
    },
    jinn: {
      arabic: "الجن",
 hebrew: "ג׳ין"
    },
    ayn: {
      arabic: "عين / معيون / منظور",
 hebrew: "עין / נפגע עין / מבט מזיק"
    },
    kahana: {
      arabic: "الكهانة",
 hebrew: "חיזוי / ניבוי"
    },
    arrafah: {
      arabic: "العرافة",
 hebrew: "ידיעת נסתרות / ניחוש"
    },
    shudhudha: {
      arabic: "الشعوذة",
 hebrew: "שַׁעְוַדַ׳ה / כשפים עממיים"
    }
  },

  openingRules: [
    {
      id: "sihr-attributed-to-zuhal-aqla",
      sourcePage: 56,
      arabicText: [
        "السحر منسوب لزحل",
        "وخصوصا شكل العقلة هي تدل على المرأة الساحرة"
      ],
      hebrewTranslation: [
 "הכישוף מיוחס לזֻחַל / שבתאי.",
 "ובייחוד צורת סוהר מורה על אישה מכשפת."
      ],
      figures: ["العقلة"],
      planets: ["زحل"],
 topics: ["כישוף", "שבתאי", "אישה מכשפת", "סוהר"],
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "ankis-loss-grief-failure-tight-chest",
      sourcePage: 56,
      arabicText: [
        "وشكل الأنكيس يدل على الخسارة والحزن والفشل وضيق الصدر"
      ],
      hebrewTranslation: [
 "צורת שפל ראש מורה על הפסד, עצב, כישלון ומועקת/צרות החזה."
      ],
      figures: ["الأنكيس"],
 topics: ["הפסד", "עצב", "כישלון", "מועקת חזה"],
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "ijtima-bad-sahir-and-occult-workers",
      sourcePage: 56,
      arabicText: [
        "وشكل الاجتماع يدل على الساحر السيء الرديء",
        "والبيت التاسع في الرمل يدل على السحرة والشيوخ ... والروحانيين والذين يعملون في أمور السحر والجن والعرافة والكهانة والشعوذة"
      ],
      hebrewTranslation: [
 "צורת חיבור מורה על מכשף רע ופגום.",
 "בית 9 ברמל מורה על מכשפים, שייח׳ים/אנשי רוח, רוחניים, ועל העוסקים בענייני כישוף, ג׳ין, ניחוש, ניבוי וכשפים עממיים."
      ],
      figures: ["الاجتماع"],
      houses: [9],
 topics: ["מכשף רע", "כישוף", "ג׳ין", "ידיעת נסתרות", "ניבוי", "כשפים", "בית 9"],
      sourceReview: "some-arabic-wording-needs-photo-review",
      status: "explicit-in-user-approved-screenshot"
    }
  ],

  diagnosticHouseMap: [
    {
      house: 1,
      arabicRole: "المريض",
 hebrewRole: "החולה / השואל",
      meaningHebrew:
 "בית 1 מייצג את החולה עצמו, את השואל, מצבו הנפשי, עצביו, מצבו הכללי ובריאותו."
    },
    {
      house: 2,
      arabicRole: "مال المريض",
 hebrewRole: "כסף החולה",
 meaningHebrew: "בית 2 מקבל את דינו ככסף החולה או משאביו."
    },
    {
      house: 3,
      arabicRole: "إخوته وأعوانه",
 hebrewRole: "אחיו ועוזריו",
 meaningHebrew: "בית 3 מייצג את אחיו, קרוביו ועוזריו של החולה."
    },
    {
      house: 4,
      arabicRole: "الدواء",
 hebrewRole: "התרופה",
 meaningHebrew: "בית 4 הוא בית התרופה."
    },
    {
      house: 5,
      arabicRole: "أفراحه",
 hebrewRole: "שמחותיו",
 meaningHebrew: "בית 5 מייצג את שמחותיו, הקלותיו וענייני שמחה של החולה."
    },
    {
      house: 6,
      arabicRole: "بيت المرض",
 hebrewRole: "בית המחלה",
 meaningHebrew: "בית 6 הוא בית המחלה, וממנו נלמדים דיני כישוף/מחלה רבים במקור זה."
    },
    {
      house: 7,
      arabicRole: "زوجته",
 hebrewRole: "אשתו / בן הזוג",
 meaningHebrew: "בית 7 מייצג את אשתו או בן/בת הזוג."
    },
    {
      house: 8,
      arabicRole: "بيت الموت",
 hebrewRole: "בית המוות / הגוף",
 meaningHebrew: "בית 8 הוא בית המוות. יחד עם בית 6 הוא מלמד על סוג המחלה הגופנית לפי היסוד השולט בשניהם."
    },
    {
      house: 9,
      arabicRole: "الساحر",
 hebrewRole: "המכשף",
 meaningHebrew: "בית 9 הוא בית המכשף והעוסקים בכישוף, ג׳ין וחיזוי."
    },
    {
      house: 10,
      arabicRole: "الطبيب أو المعالج",
 hebrewRole: "הרופא או המטפל",
 meaningHebrew: "בית 10 הוא הרופא, המטפל או מי שמטפל במצב."
    },
    {
      house: 12,
      arabicRole: "بيت الأعداء",
 hebrewRole: "בית האויבים",
 meaningHebrew: "בית 12 הוא בית האויבים ומקור אפשרי לפגיעה מצד אויב."
    }
  ],

  figureHouseRules: [
    {
      id: "ankis-house6-buried-magic-in-grave",
      sourcePage: 57,
      arabicText: ["الأنكيس في السادس فهو مدفون له سحر في قبر"],
 hebrewTranslation: ["שפל ראש בבית 6 — קבור לו כישוף בקבר."],
      figure: "الأنكيس",
      house: 6,
      diagnosis: "buried-magic-in-grave",
 appMeaningHebrew: "סימן לכישוף קבור, ובפרט כישוף הקשור בקבר.",
 severity: "high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "jawdala-house6-drunk-magic",
      sourcePage: 57,
      arabicText: ["الجودلة في السادس فهو سحر مشروب"],
 hebrewTranslation: ["נלחם בבית 6 — זהו כישוף שנשתה."],
      figure: "الجودلة",
      house: 6,
      diagnosis: "drunk-magic",
 appMeaningHebrew: "סימן לכישוף שנכנס דרך שתייה.",
 severity: "high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "jawdala-house12-bound-from-wife",
      sourcePage: 57,
      arabicText: ["الجودلة في الثاني عشر بيت الأعداء فهو مربوط عن زوجته"],
 hebrewTranslation: ["נלחם בבית 12, בית האויבים — הוא קשור/חסום מאשתו."],
      figure: "الجودلة",
      house: 12,
      diagnosis: "bound-from-wife",
 appMeaningHebrew: "סימן לקשירה או חסימה זוגית מצד בית האויבים.",
 severity: "high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "qabd-dakhil-house6-bound-from-women",
      sourcePage: 57,
      arabicText: ["القبض الداخل في السادس فهو معقود ومربوط عن النساء"],
 hebrewTranslation: ["ממון נכנס בבית 6 — הוא קשור וחסום מן הנשים."],
      figure: "القبض الداخل",
      house: 6,
      diagnosis: "bound-from-women",
 appMeaningHebrew: "סימן לקשירה/חסימה בענייני נשים וזוגיות.",
 severity: "high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "hayyan-house10-also-bewitched",
      sourcePage: 57,
      arabicText: ["الأحيان في العاشر فهو أيضا مسحور"],
 hebrewTranslation: ["נשוא ראש בבית 10 — גם הוא מכושף."],
      figure: "الأحيان",
      house: 10,
      diagnosis: "bewitched",
 appMeaningHebrew: "סימן שגם כאן יש דין כישוף, אף שהוא בבית המטפל/העשירי.",
 severity: "medium-high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "aqla-house13-bound-magic-sprinkled",
      sourcePage: 57,
      arabicText: ["العقلة في الثالث عشر فهو معقود له سحر ومرشوش له أيضا"],
 hebrewTranslation: ["סוהר בבית 13 — הוא קשור; יש לו כישוף, וגם נזרק/פוזר עליו דבר."],
      figure: "العقلة",
      house: 13,
      diagnosis: "bound-magic-sprinkled",
 appMeaningHebrew: "סימן לקשירה, כישוף, ופיזור/התזה/ריסוס של חומר או פעולה עליו.",
 severity: "high",
      sourceReview: "word مرشوش should be kept as sprayed/sprinkled and reviewed later",
      status: "explicit-in-user-approved-screenshot"
    },
    {
      id: "aqla-house14-house-or-place-has-magic",
      sourcePage: 57,
      arabicText: [
        "العقلة في الرابع عشر فإن بيته في سحر أو معلق له سحر في البيت أو المكان الذي تضرب عليه وتسأل عنه"
      ],
      hebrewTranslation: [
 "סוהר בבית 14 — ביתו בכישוף, או שיש כישוף תלוי בבית או במקום שעליו מפילים את הגורל ושואלים."
      ],
      figure: "العقلة",
      house: 14,
      diagnosis: "house-or-place-magic",
 appMeaningHebrew: "סימן לכישוף הקשור בבית, במקום, או במקום השאלה.",
 severity: "high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "jamaa-from-two-humra-strong-envy",
      sourcePage: 57,
      arabicText: ["انتشاء الجماعة من حمّرتين فهو محسود حسد شديد جدا جدا"],
 hebrewTranslation: ["היווצרות קהלה משתי אדומות — הוא מקונא בקנאה חזקה מאוד מאוד."],
      figure: "الجماعة",
      derivedFrom: ["الحمرة", "الحمرة"],
      diagnosis: "severe-envy",
 appMeaningHebrew: "סימן לקנאה חזקה מאוד.",
 severity: "very-high",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "jamaa-from-two-ankis-two-buried-magics-renewed",
      sourcePage: 57,
      arabicText: [
        "انتشاء الجماعة من أنكيسين فهو مدفون له سحرين لا محالة وأزود من ذلك ويجدد له الساحر السحر كل فترة"
      ],
      hebrewTranslation: [
 "היווצרות קהלה משני שפל ראש — קבורים לו שני כשפים בלי ספק, ואף יותר מזה; והמכשף מחדש לו את הכישוף בכל תקופה."
      ],
      figure: "الجماعة",
      derivedFrom: ["الأنكيس", "الأنكيس"],
      diagnosis: "two-buried-magics-renewed-periodically",
 appMeaningHebrew: "סימן חמור לשני כשפים קבורים ולחידוש תקופתי של הכישוף.",
 severity: "extreme",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children",
      sourcePage: 57,
      arabicText: [
        "إذا جاءت الجماعة في السادس فهي عندها تابعة أم الصبيان تمنع وتعطل زواجها ولو تزوجت لا تنجب ولو حملت تسقط حملها ولو أنجبت تصيب أطفالها ..."
      ],
      hebrewTranslation: [
 "אם קהלה באה בבית 6 — יש אצלה תַאבִּעַה / אם הצביאן; היא מונעת ומשבשת את נישואיה, ואם תינשא לא תלד; ואם תיכנס להריון תפיל; ואם תלד — הדבר פוגע בילדיה."
      ],
      figure: "الجماعة",
      house: 6,
      diagnosis: "umm-sibyan-female-pregnancy-marriage-affliction",
      appMeaningHebrew:
 "סימן לפגיעה נשית/רוחנית מסוג תאבּעה / אם הצביאן, עם דגש על עיכוב נישואין, עקרות, הפלה או פגיעה בילדים.",
 severity: "extreme",
      sourceReview: "last words in screenshot should be reviewed visually before final wording",
      status: "explicit-in-user-approved-screenshot"
    },
    {
      id: "jawdala-house13-confused-witchcraft",
      sourcePage: 58,
      arabicText: ["الجودلة في الثالث عشر فهو مدعوم وله سحر مشوش وأيضا"],
 hebrewTranslation: ["נלחם בבית 13 — הוא נתמך ויש לו כישוף מבולבל/מעורבב."],
      figure: "الجودلة",
      house: 13,
      diagnosis: "confused-chaotic-witchcraft",
 appMeaningHebrew: "סימן לכישוף מבולבל, עם השפעה על מצב השואל.",
 severity: "high",
 status: "source-extracted-sefer-2"
    },
    {
 id: "jawdala-house14-magic-in-house-or-place",
      sourcePage: 58,
      arabicText: ["الجودلة في الرابع عشر فبيته فيه سحر معلق أو في المكان أو البيت"],
 hebrewTranslation: ["נלחם בבית 14 — ביתו יש בו כישוף תלוי, או במקום הבית."],
      figure: "الجودلة",
      house: 14,
      diagnosis: "hanging-magic-in-house",
 appMeaningHebrew: "סימן לכישוף תלוי בבית, בחדר או במקום שבו החולה נמצא.",
 severity: "high",
 status: "source-extracted-sefer-2"
    },
    {
 id: "ankis-house6-buried-underground-sorcery",
      sourcePage: 58,
      arabicText: ["المنكوس في السادس فهو سحر مدفون في الأرض"],
 hebrewTranslation: ["שפל ראש (מנכוס) בבית 6 — זהו כישוף קבור בקרקע."],
      figure: "المنكوس",
      house: 6,
      diagnosis: "buried-underground-sorcery",
 appMeaningHebrew: "סימן לכישוף קבור באדמה (גרסה מורחבת — לא בקבר בלבד).",
 severity: "high",
 status: "source-extracted-sefer-2"
    }
  ],

  organDiagnosisRules: {
    id: "organ-diagnosis-8x6",
    sourcePage: null,
    sourceBook: "المول الجامع في علم الرمل — الشيخ محمد ساس",
    sourceChapter: "الفصل الرابع عشر — أحكام المرض",
    arabicText: [
      "العضو الذي يؤلم المريض 8×6",
      "انظر إلى الطالع وبيت المرض وهو البيت السادس وما جاورهما والى المتولد منهما",
      "فإذا كان السؤال عن مريض فما غلب عليه في هذه الطبائع من هذه الأشكال فاحكم له",
      "النارية: فالمرض من المرارة والصفراء",
      "المائية: فالمرض من البلغم",
      "الهوائية: فالمرض من الدم",
      "الترابية: فالمرض من السوداء"
    ],
 hebrewDescription: "כלל 8×6 — לפי היסוד השולט בבית 6 (מחלה) ובית 8 (גוף/מוות) מזהים את סוג המחלה הגופנית.",
 method: "dominant-element-in-houses-6-and-8",
 sourceStatus: "source-extracted-sefer-2",
    results: [
      {
        element: "fire",
        elementHebrew: "אש",
        arabicIllness: "مرض المرارة والصفراء",
 hebrewIllness: "מחלת מרה צהובה / מרארה — מחלות אש/כבד/מרה",
 diagnosis: "yellow-bile-fire-illness",
        organHebrew: "כבד, מרה, מחלות חום"
      },
      {
        element: "water",
        elementHebrew: "מים",
        arabicIllness: "مرض البلغم",
 hebrewIllness: "מחלת ליחה/בלגם — מחלות מים/ריאות/קיבה",
 diagnosis: "phlegm-water-illness",
        organHebrew: "ריאות, קיבה, מחלות ליחה"
      },
      {
        element: "air",
        elementHebrew: "אוויר",
        arabicIllness: "مرض الدم",
 hebrewIllness: "מחלת דם — מחלות אוויר/לב/דם",
 diagnosis: "blood-air-illness",
        organHebrew: "לב, דם, מחלות אוויר"
      },
      {
        element: "earth",
        elementHebrew: "עפר",
        arabicIllness: "مرض السوداء",
 hebrewIllness: "מחלת מרה שחורה — מחלות עפר/טחול/עצבות",
 diagnosis: "black-bile-earth-illness",
        organHebrew: "טחול, עצמות, מחלות עצבות"
      }
    ]
  },

  jinnTypeRules: [
    {
      id: "jinn-type-by-15x4",
      sourcePage: 57,
      arabicText: [
        "نوعية الجن التي تؤذي المريض وتسلط عليه 15×4"
      ],
      hebrewTranslation: [
 "סוג הג׳ין המזיק לחולה ומשתלט עליו נבדק לפי 15×4."
      ],
 method: "15x4",
 status: "explicit-in-user-approved-screenshot"
    },
    {
 id: "fire-figure-red-jinn",
      sourcePage: 57,
      conditionArabic: "لو كان شكل ناري",
      resultArabic: "فهو من الجن الأحمر",
 conditionHebrew: "אם הצורה אשית",
 resultHebrew: "הוא מן הג׳ין האדום",
 element: "fire",
 jinnType: "red-jinn"
    },
    {
 id: "earth-figure-earthly-or-lower-mass",
      sourcePage: 57,
      conditionArabic: "ولو ترابي",
      resultArabic: "فهو لمسه أرضيه أو مس سفلي",
 conditionHebrew: "אם הצורה עפרית",
 resultHebrew: "זהו מגע/מס ארצי או מס תחתון",
 element: "earth",
 jinnType: "earthly-or-lower-mass"
    },
    {
 id: "air-figure-flying-jinn",
      sourcePage: 57,
      conditionArabic: "ولو هوائي",
      resultArabic: "فهو مس طيار / من جن طيار",
 conditionHebrew: "אם הצורה אווירית",
 resultHebrew: "זהו מס מעופף / מן הג׳ין המעופף",
 element: "air",
 jinnType: "flying-jinn"
    },
    {
 id: "water-figure-diving-jinn",
      sourcePage: 57,
      conditionArabic: "ولو مائي",
      resultArabic: "فهو من جن غواص",
 conditionHebrew: "אם הצורה מימית",
 resultHebrew: "הוא מן הג׳ין הצולל/המימי",
 element: "water",
 jinnType: "diving-jinn"
    },
    {
 id: "same-fourth-figure-jamaa-in-mizan-qarin",
      sourcePage: 57,
      conditionArabic: "ولو كان ضرب 15×4 هو نفسه الشكل الرابع يعني جاءت جماعة في الميزان",
      resultArabic: "فهو أذى من القرين",
 conditionHebrew: "אם תוצאת 15×4 היא אותה צורה רביעית, כלומר קהלה באה במאזן",
 resultHebrew: "זהו נזק מן הקרין",
 method: "15x4",
 diagnosis: "qarin-affliction"
    }
  ],

  isqatSevenRules: {
    id: "isqat-7-7-spiritual-diagnosis",
    sourcePage: 57,
    arabicText: [
      "بقواعد الإسقاطات تعد مفتوح الرمل وتسقطه 7-7"
    ],
    hebrewTranslation: [
 "לפי כללי ההשמטות: סופרים את מפתוח הרמל ומפחיתים/משליכים 7–7."
    ],
 method: "count-open-raml-and-reduce-by-seven",
    results: [
      {
        remainder: 1,
        arabic: "لو تبقى 1 فهو ممسوس من الجن",
 hebrew: "אם נשאר 1 — הוא ממוסס/אחוז מן הג׳ין.",
 diagnosis: "possessed-by-jinn",
        element: null
      },
      {
        remainder: 2,
        arabic: "لو تبقى 2 فهو محسود ومنظور ومعيون",
 hebrew: "אם נשאר 2 — הוא מקונא, נפגע ממבט, ונפגע עין.",
 diagnosis: "envy-evil-eye",
        element: null
      },
      {
        remainder: 3,
        arabic: "لو تبقى 3 فهو مسحور من الإنس ويفعل فاعل",
 hebrew: "אם נשאר 3 — הוא מכושף מאדם, ויש פועל/עושה שפועל.",
 diagnosis: "human-made-magic",
        element: null
      },
      {
        remainder: 4,
        arabic: "لو تبقى 4 فهو مرض بلغم منسوب للماء",
 hebrew: "אם נשאר 4 — זו מחלת ליחה, מיוחסת למים.",
 diagnosis: "phlegm-illness",
 element: "water"
      },
      {
        remainder: 5,
        arabic: "لو تبقى 5 فهو مرض دم عضوي منسوب للهواء",
 hebrew: "אם נשאר 5 — זו מחלת דם גופנית, מיוחסת לאוויר.",
 diagnosis: "blood-organic-illness",
 element: "air"
      },
      {
        remainder: 6,
        arabic: "لو تبقى 6 فهو مرض سوداء عضوي منسوب للتراب",
 hebrew: "אם נשאר 6 — זו מחלת מרה שחורה גופנית, מיוחסת לעפר.",
 diagnosis: "black-bile-organic-illness",
 element: "earth"
      },
      {
        remainder: 7,
        arabic: "لو تبقى 7 فهو مرض صفراء عضوي منسوب للنار",
 hebrew: "אם נשאר 7 — זו מחלת מרה צהובה גופנית, מיוחסת לאש.",
 diagnosis: "yellow-bile-organic-illness",
 element: "fire"
      }
    ],
 status: "explicit-in-user-approved-screenshot"
  },

  practicalNotes: [
    {
      id: "must-know-figures-and-properties",
      sourcePage: 57,
      arabicText: [
        "ولتفصيل الأمور لابد للرمال أن يحفظ وصف الأشكال جيدا ويعرف خواص كل الأشكال جيدا"
      ],
      hebrewTranslation: [
 "כדי לפרט את העניינים, המרמל חייב לזכור היטב את תיאור הצורות ולדעת היטב את סגולות/תכונות כל הצורות."
      ],
      appMeaningHebrew:
 "אין לפסוק רק לפי כלל אחד. יש לשלב צורות, בתים, תכונות, מחלה, כישוף וג׳ין."
    },
    {
 id: "extract-damir-and-read-houses",
      sourcePage: 57,
      arabicText: [
        "من خلال استخراج الضمير وتفسيره في البيوت تعرف كل شيء حصل للشخص"
      ],
      hebrewTranslation: [
 "דרך חילוץ הדמיר ופירושו בבתים יודעים כל מה שקרה לאדם."
      ],
      appMeaningHebrew:
 "שכבה זו דורשת שילוב עם חילוץ הדמיר, מעבר הצורות בבתים, וחזרת הצורות."
    }
  ],

  summary: {
    verifiedTerms: ["السحر", "المس", "الحسد", "الجن", "معيون", "منظور", "الكهانة", "العرافة", "الشعوذة"],
    diagnosticFocus:
 "כישוף, מס/אחיזה, קנאה/עין, ג׳ין, כישוף קבור, כישוף שתוי, קשירה זוגית/מינית, פגיעה בבית או במקום, אם הצביאן, סוגי ג׳ין, מחלות לפי יסודות.",
    appStatus:
 "ready-as-approved-knowledge-layer-not-yet-engine-activated",
    cautionHebrew:
 "המידע נכנס כשכבת ידע מקצועית למרמל. הפעלה אוטומטית במנוע תיעשה רק לאחר מיפוי שדות וקישור לצורות/בתים."
  }
};

export function getRamlSihrMassHasadRule(id) {
  const groups = [
    RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.openingRules,
    RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.figureHouseRules,
    RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.jinnTypeRules,
    RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.practicalNotes
  ];

  for (const group of groups) {
    const found = group.find((item) => item.id === id);
    if (found) return found;
  }

  if (RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.isqatSevenRules.id === id) {
    return RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD.isqatSevenRules;
  }

  return null;
}

export default { RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD };

if (typeof module !== "undefined") {
  module.exports = { RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD };
}
