/**
 * Source-exact working extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * ترحيل الأشكال الستة عشر في الستة عشر بيتا
 *
 * Normalized export wrapper.
 * Secondary source: بلوغ الأمل في علم الرمل
 * supplementarySource blocks added per house. Hawi always takes precedence.
 */

export const HAWI_FIGURE_BAYAD = {
  "id": "hawi-figure-bayad",
  "order": 14,
  "arabicName": "البياض",
  "hebrewName": "לבן",
  "aliases": [
    "البياض"
  ],
  "source": "hawi",
  "section": "ترحيل الأشكال الستة عشر في الستة عشر بيتا",
  "next": "hawi-figure-ataba-dakhila",
  "houses": [
    {
      "house": 1,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על מילוי צרכים, שמחה וחדווה; גינות, מים, כתבים שמגיעים, דרהמים שנתפסים או חולה חלש.",
      "topics": ['מילוי צרכים', 'שמחה', 'חדווה', 'גינות', 'מים', 'מכתבים', 'דרהמים', 'חולה חלש'],
      "specialRules": ['מילוי צרכים, שמחה, גינות, מים, מכתבים, דרהמים; אפשרות חולה חלש.'],
      "reviewNotes": ['מונח מريض مقروص / חולה חלש דורש ניסוח זהיר.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على حسن الأحوال وقبض الأموال وإنفتاح الطريق',
        meaningHebrew: 'מורה על מצב טוב, קבלת ממון ופתיחת הדרך.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 2,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על ריבוי ממון, הרחבת פרנסה, קבלת דרהמים, ריבוי מכירה וקנייה, לקיחה ונתינה, ובגדים לבנים לפי מה שקיבל מהם.",
      "topics": ['ריבוי ממון', 'פרנסה רחבה', 'דרהמים', 'מכירה', 'קנייה', 'לקיחה', 'נתינה', 'בגדים לבנים', 'צרור דרהמים'],
      "specialRules": ['ריבוי ממון, פרנסה, דרהמים, בגדים לבנים או צרור דרהמים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على دخول ما خرج من اليد والتجارة ووسق',
        meaningHebrew: 'מורה על חזרת מה שיצא מהיד, מסחר וריבוי.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 3,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על מילוי צרכים, חברה עם נכבדים ואנשי דת וידע, חיים טובים עם אחים וקרובים; מורה גם על פירוד לפי כוח העדים.",
      "topics": ['מילוי צרכים', 'נכבדים', 'אנשי דת', 'ידע', 'אחים', 'קרובים', 'חתנים', 'בנים', 'פירוד'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على قدر الشواهد'],
      "specialRules": ['בנוסף לאחים/קרובים/נכבדים: מורה גם על בנים כי זה בית האחים — לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على الفرح والمال الداخل وحسن الأصدقاء والعواقب',
        meaningHebrew: 'מורה על שמחה, ממון הנכנס, ידידים טובים ותוצאות טובות.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 4,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על זרימת נהרות, ריבוי מים והשקיית גנים; מכתבים מקרובים, תועלת מצד האבות, כיבוד האם, ואולי נפילה או מחלה של אחד ההורים לפי העדים.",
      "topics": ['נהרות', 'מים רבים', 'השקיית גנים', 'מכתבים מקרובים', 'תועלת מן האב', 'כיבוד האם', 'נפילת הורה', 'מחלת הורה'],
      "witnessDependent": true,
      "criticalArabicTerms": ['بالشواهد'],
      "specialRules": ['נהרות, ריבוי מים והשקיית גנים; תועלת מן האב וכיבוד האם; נפילה או מחלה של אחד ההורים לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على الجمع والأحباب والإلفة مع الأعداء وتحصيل الإرث',
        meaningHebrew: 'מורה על קיבוץ, אהובים, אנסה עם אויבים והשגת ירושה.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 5,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על ילד טוב וצדיק, מכתבים מצד האהוב, מתנות ותנועה שיש בה תועלת; מורה גם על בוסתנים, עצים ונהרות, והיא צורה שמחה לפי העדים.",
      "topics": ['ילד טוב', 'ילד צדיק', 'מכתבים מן האהוב', 'מתנות', 'תנועה מועילה', 'מכתבים מן הוואלי', 'בוסתנים', 'עצים', 'נהרות', 'שמחה'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على الشواهد'],
      "specialRules": ['ילד טוב וצדיק; מכתבים מן האהוב ומן הוואלי/ממונים; צורה שמחה לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على البنين السعداء والخبر المفيد والرتبة التي لا بد منها',
        meaningHebrew: 'מורה על בנים מאושרים, חדשות מועילות ומדרגה הכרחית.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 6,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על מחלה ובלייה, תועלת מצד שפחות עבדים ובהמות, המתנה לנעדרים, וקושי או דבר שנאבד כמו בגדים ודרהמים וחוזר לפי העדים.",
      "topics": ['מחלה', 'בלייה', 'מים', 'עבדים', 'בהמות', 'המתנה לנעדרים', 'דבר שאבד', 'בגדים', 'דרהמים', 'חזרה'],
      "witnessDependent": true,
      "criticalArabicTerms": ['بالشواهد'],
      "specialRules": ['מחלה ובלייה; דבר שאבד כמו בגדים/דרהמים חוזר לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على حركة كالمريض وإزالة الأكدار وسفر فيه بركة ومحب صادق',
        meaningHebrew: 'מורה על תנועה כחולה, הסרת עגמות, נסיעה עם ברכה וידיד נאמן.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 7,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על נישואין טובים ותועלת מהם, נשים צנועות, סעודות חתונה ושמחות, פרות וביצים, וכתבים מצד דבר לבן לפי העדים.",
      "topics": ['נישואין טובים', 'נשים צנועות', 'סעודות חתונה', 'שמחות', 'בקר', 'סוסים', 'כתב נישואין', 'דבר שמקבל'],
      "witnessDependent": true,
      "criticalArabicTerms": ['بالشواهد'],
      "specialRules": ['נישואין טובים, נשים צנועות, סעודות חתונה, בקר וסוסים, כתב נישואין ודבר שמקבל לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على الإجتماع بمن يهواه القلب والإجتماع مع صاحب الرتب',
        meaningHebrew: 'מורה על מפגש עם מי שהלב רוצה בו ומפגש עם בעל מעמד.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 8,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על בכי על מתים, תכריכים וירושות.",
      "topics": ['בכי על מתים', 'תכריכים', 'ירושות'],
      "specialRules": ['בכי על מתים, תכריכים וירושות.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على دخول الرتب على الطالب ودخول ما يرتجيه',
        meaningHebrew: 'מורה על כניסת מדרגות לשואל וכניסת מה שמצפה לו.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 9,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על תועלת בנסיעות, מעלה בצום ובעבודת קודש, יופי הדת, חלומות טובים ומתנות שמגיעות לפי העדים.",
      "topics": ['תועלת בנסיעות', 'צום', 'עבודת קודש', 'יופי הדת', 'חלומות טובים', 'מתנות'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على قدر الشواهد'],
      "specialRules": ['תועלת בנסיעות, צום/עבודת קודש, יופי הדת, חלומות טובים ומתנות לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على السفر الذي لا يوافق والخبر الذي سوف يصدق والرعب',
        meaningHebrew: 'מורה על נסיעה לא מתאימה, חדשות שיתאמתו ורעד/פחד.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 10,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על הצלחת עניינים אצל מושלים ושופטים, ערבוב עם נכבדים, כבוד מצד מלכים ומכתבים שמגיעים מהם או עולים אליהם.",
      "topics": ['הצלחה אצל מושלים', 'שופטים', 'נכבדים', 'כבוד ממלכים', 'מכתבים לשלטון', 'מכתבים מהשלטון'],
      "specialRules": ['הצלחה אצל מושלים ושופטים, כבוד מצד מלכים, מכתבים שעולים אליהם או מגיעים מהם.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على الإتصال بالعز والسلطان وقبض الدرهم العاجل',
        meaningHebrew: 'מורה על קשר לכבוד ולסולטן וקבלת כסף מיידית.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 11,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על עזרת חברים, חברות טובה, ניצחון במה שמקווים לו, מכתבים שמגיעים ושמחה בהם, תועלת וברכה גדולה לפי העדים.",
      "topics": ['עזרת חברים', 'חברות טובה', 'ניצחון בתקווה', 'מכתבים', 'שמחה', 'תועלת', 'ברכה'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على قدر الشواهد'],
      "specialRules": ['תוקן מול המקור: עזרת חברים, חברות טובה, ניצחון במה שמקווים לו, מכתבים שמגיעים ושמחה בהם, תועלת וברכה; לא תפילה/חשבון טוב.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على سرعة الخبر وطول المدة والإتصال بالطلب',
        meaningHebrew: 'מורה על מהירות החדשות, ארך הזמן וקשר לבקשה.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 12,
      "sourceStatus": "not-explicit-in-source",
      "meaning": "המקור אינו מביא דין מפורש לבית זה. אין להשלים מסברה.",
      "topics": ['לא מפורש'],
      "specialRules": ['לא מפורש במקור; אין להשלים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على القهر والحبس والشيء الذي في يد الأعداء',
        meaningHebrew: 'מורה על דיכוי, כלא ודבר שבידי האויבים.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 13,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על סידור עניינים שהאדם חושש מתוצאותיהם, קבלה מצד בהמות, יציאת אסיר, תכריכי המת, מכתבים שמגיעים ואולי הרחקה מצד הסולטן.",
      "topics": ['תיקון עניינים', 'חשש מתוצאות', 'קבלה מבהמות', 'יציאת אסיר', 'תכריכי מת', 'מכתבים', 'הדחה מצד השלטון', 'טוב מנסיעות', 'תועלות ממלכים', 'חיבור לתקווה'],
      "specialRules": ['לשמר שתי יחידות מקור של בית 13: א. תיקון עניינים שחושש מתוצאותיהם, קבלה מבהמות, יציאת אסיר, תכריכי מת, מכתבים ואולי הדחה מצד הסולטן. ב. טוב מצד נסיעות, תועלות ממלכים, מכתבים וחיבור למה שמקווים לו.'],
      "reviewNotes": ['המקור מביא פעמיים “וידל בשלושה־עשר”; אין למחוק אף אחת מהיחידות.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على المرأة الحسنة وطلب الدنيا والفائدة الحاصل',
        meaningHebrew: 'מורה על אישה טובה, שאיפה לעולם הזה ותועלת מושגת.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 14,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על תועלת מצד חברים, פרנסה ואחרית טובה.",
      "topics": ['תועלת מחברים', 'פרנסה', 'אחרית טובה'],
      "specialRules": ['תועלת מחברים, פרנסה ואחרית טובה.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على حال يتحدد للسائل فيه صلاحه ومال يكسبه سريعاً',
        meaningHebrew: 'מורה על מצב שנקבע לשואל שיש בו תיקון וממון שירוויח מהר.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 15,
      "sourceStatus": "not-explicit-in-source",
      "meaning": "המקור אינו מביא דין מפורש לבית זה. אין להשלים מסברה.",
      "topics": ['לא מפורש'],
      "specialRules": ['לא מפורש במקור; אין להשלים.']
    },
    {
      "house": 16,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על נסיעה רחוקה ועל טוב לפי כוח העדים.",
      "topics": ['נסיעה רחוקה', 'טוב', 'עדים'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على قدر الشواهد'],
      "specialRules": ['נסיעה רחוקה וטוב לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'دل على فرح مقبل وطريق ميسر وسلامة للمريض والمسافر',
        meaningHebrew: 'מורה על שמחה קרובה, דרך קלה ושלמות לחולה ולנוסע.',
        isNewData: true,
        conflictsWithHawi: false,
      },
}
  ],

  secondarySourceEnrichment: {
    sourceBook: 'بلوغ الأمل في علم الرمل',
    housesEnriched: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    housesWithNewData: [16],
    policy: 'Hawi takes precedence. Conflicts flagged with conflictsWithHawi: true.',
  },
  "coverage": "16/16",
  "housesListed": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16
  ],
  "notExplicitInSource": [
    12,
    15
  ],
  "extractionStatus": "source-audited-enriched-option-2"
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_FIGURE_BAYAD };
}
