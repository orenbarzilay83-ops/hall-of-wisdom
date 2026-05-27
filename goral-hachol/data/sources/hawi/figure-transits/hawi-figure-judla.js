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

export const HAWI_FIGURE_JUDLA = {
  "id": "hawi-figure-judla",
  "order": 12,
  "arabicName": "الكوسج / الجودلة",
  "hebrewName": "נלחם",
  "aliases": [
    "الكوسج",
    "الجودلة"
  ],
  "source": "hawi",
  "section": "ترحيل الأشكال الستة عشر في الستة عشر بيتا",
  "next": "hawi-figure-humra",
  "houses": [
    {
      "house": 1,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על שמחה וכל מה שמקווים לו; אדם קצר צוואר, ארוך גוף, קטן ראש, דל זקן, ארוך פנים ובהיר/אדמוני; מורה גם על עבדים, שפחות ונערים מפני שהיא ממוזגת.",
      "topics": ['שמחה', 'תקווה', 'עבדים', 'שפחות', 'נערים', 'ממוזג', 'תיאור אדם'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على الخير الكثير',
        meaningHebrew: 'מורה על הטוב הרב.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 2,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על אושר, הצלחה, מכירה וקנייה ויחסי מסחר; דבר שיצא מידו יחזור לאחר ייאוש; אויב מזיק בגוף או בממון במרמה.",
      "topics": ['אושר', 'הצלחה', 'מכירה', 'קנייה', 'מסחר', 'דבר שחוזר אחרי ייאוש', 'אויב', 'מרמה'],
      "specialRules": ['דבר שיצא מידו חוזר אליו אחרי ייאוש.', 'יש אויב שמזיק בגוף או בממון במרמה.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على عسر الرزق',
        meaningHebrew: 'מורה על קושי בפרנסה.',
        conflictsWithHawi: true,
        note: 'חאוי: אושר, הצלחה, מסחר. בלוג האמל: קושי בפרנסה. חאוי גובר.',
      },
},
    {
      "house": 3,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על רע מצד אחים, אחיות וקרובים, חולשת דת, חלומות שקריים וקלקול נישואין מצד נשים ונערים.",
      "topics": ['רע מאחים', 'רע מאחיות', 'קרובים', 'חולשת דת', 'חלומות שקר', 'קלקול נישואין'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على تشتيت الأحوال',
        meaningHebrew: 'מורה על פיזור/בלבול המצבים.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 4,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על גילוי נסתר, חרבות מפורסמות, מצודה, בלבול עניינים, דמעות מצד האם, או קבר עם מת יקר ונכבד.",
      "topics": ['גילוי נסתר', 'חרבות', 'בלבול עניינים', 'דמעות אישה נטושה', 'חיבור אפשרי'],
      "specialRules": ['גילוי נסתר + חרבות מפורסמות/שלופות + בלבול עניינים; דמעות של אישה נטושה, ויש אפשרות חיבור אליה.'],
      "reviewNotes": ['בקובץ היה כתוב “מצודה”; לפי המקור שנבדק עדיף חרבות מפורסמות/שלופות. להשאיר לביקורת מקור אם צריך.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على فساد الأملاك والعقارات والآباء',
        meaningHebrew: 'מורה על קלקול נכסים, נדלן ואבות.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 5,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על ילדים, שליחים וכתבים, חזרת דבר למקומו, בשורות, זוג שמקווים לקשר איתו וקבלת דבר שהתעכב.",
      "topics": ['ילדים', 'שליחים', 'מכתבים', 'בשורות', 'זוג', 'קשר', 'דבר שמתעכב'],
      "specialRules": ['קבלת דבר שמתעכב.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على فساد الخبر وكذبه ورداءة الأولاد والتجارة',
        meaningHebrew: 'מורה על קלקול החדשות, כזב ורדידות הילדים והמסחר.',
        conflictsWithHawi: true,
        note: 'חאוי: ילדים, שליחים, בשורות (חיובי). בלוג האמל: קלקול חדשות (שלילי). חאוי גובר.',
      },
},
    {
      "house": 6,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על בריחת עבד, יציאה ממחלה ומכלא, עבדים זכרים, משכב אסור ושפלים, בריחת עבדים ומקנה, מחלתם, חזרת בורח וגילוי נסתר.",
      "topics": ['בריחת עבד', 'יציאה ממחלה', 'יציאה מכלא', 'משכב אסור', 'שפלים', 'חזרת בורח', 'גילוי נסתר'],
      "specialRules": ['יציאה ממחלה ומכלא; חזרת בורח וגילוי נסתר.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على عسر الإسقام والذي فقد لا يرجع',
        meaningHebrew: 'מורה על קושי מחלה ומה שאבד לא יחזור.',
        conflictsWithHawi: true,
        note: 'חאוי: יציאה מחלה, חזרת בורח. בלוג האמל: קושי מחלה ואיבוד קבוע. חאוי גובר.',
      },
},
    {
      "house": 7,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על נישואין אסורים, שחיתות, מעשים מגונים, רכילות, חוסר נאמנות, נשים העוסקות במשכב אסור, אדם עבד או שפל, ועבד קשה.",
      "topics": ['נישואין אסורים', 'שחיתות', 'מעשים מגונים', 'רכילות', 'חוסר נאמנות', 'לוואט', 'משכב אסור', 'שפלים'],
      "specialRules": ['חומר רגיש: נישואין אסורים, פשק/שחיתות, רכילות, חוסר נאמנות, לוואט/משכב אסור.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على أن المطلوب غير موافق وبيت الفراش فاسد',
        meaningHebrew: 'מורה שהמבוקש אינו מתאים ובית המיטה מקולקל.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 8,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על מרמה, תחבולה, בגידה, חרבות שלופות, ומוות מצד נשים ונערים; והוא רע.",
      "topics": ['מרמה', 'תחבולה', 'בגידה', 'חרבות שלופות', 'מוות', 'נשים', 'נערים', 'רע'],
      "specialRules": ['מרמה, בגידה, חרבות שלופות, מוות מצד נשים ונערים; רע.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على أن المريض يبرأ ويشفي من سقمه ويعافي',
        meaningHebrew: 'מורה שהחולה יחלים ויבריא ממחלתו.',
        conflictsWithHawi: true,
        note: 'חאוי: מרמה, בגידה, מוות (שלילי). בלוג האמל: החולה יחלים (חיובי). חאוי גובר.',
      },
},
    {
      "house": 9,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על ריבוי נסיעות, נכר, שחיתות בדת, שתיית יין וחלומות שקריים; גם על אי־נסיעה, ואפשר שיתכנס בנסיעה עם בן זוג וישיג טוב בתנועה.",
      "topics": ['ריבוי נסיעות', 'נכר', 'קלקול דת', 'יין', 'חלומות שקר', 'אי־נסיעה', 'מפגש בן זוג', 'טוב בתנועה'],
      "specialRules": ['ריבוי נסיעות ונכר, אבל גם אי־נסיעה; ייתכן מפגש עם בן זוג בנסיעה וטוב בתנועה.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'على أن السفر غير موافق وخير الطالب في الغيب',
        meaningHebrew: 'מורה שהנסיעה אינה מתאימה וטובת השואל בהיעדרות.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 10,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על שירות מלכים וסולטנים, ברזל מעובד כגון חרבות ופגיונות, בית סוהר, קלקול עניינים, אויב משפיע, ומוות בידי סולטן בלא פגע רע.",
      "topics": ['שירות מלכים', 'סולטנים', 'ברזל מעובד', 'חרבות', 'פגיונות', 'סכינים', 'קלקול עניינים', 'אויבים', 'עוזרי עוול'],
      "specialRules": ['שירות מלכים וסולטנים; ברזל וכלי נשק; קלקול עניינים ואויבים רעים.'],
      "reviewNotes": ["בקובץ היה 'בית סוהר'; במקור שנבדק כאן לא הופיע במפורש בשורה זו. להשאיר review ולא לבנות על זה כלל מנוע."],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على أن العز متوسط إلى السائل وله فرح',
        meaningHebrew: 'מורה שהכבוד ממוצע לשואל ויש לו שמחה.',
        conflictsWithHawi: true,
        note: 'חאוי: שירות מלכים, ברזל, כלא (שלילי). בלוג האמל: כבוד ממוצע עם שמחה. חאוי גובר.',
      },
},
    {
      "house": 11,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על שמחה, ריבוי חברים ואחים מתוך חוסר ביטחון, אויב רחוק שנוצחים עליו, ואפשר קשר מיטה עם בן זוג אך בלי יכולת עליו לפי העדים.",
      "topics": ['שמחה', 'חברים', 'אחים', 'חוסר ביטחון', 'אויב', 'ניצחון', 'קשר מיטה'],
      "witnessDependent": true,
      "criticalArabicTerms": ['على قدر الشواهد'],
      "specialRules": ['שמחה וחברים אך לא בביטחון; אויב שמזיק וניצחון עליו; קשר מיטה בלי יכולת עליו לפי העדים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على فساد الفراش وقطع الرجا من المأمول',
        meaningHebrew: 'מורה על קלקול מיטה/נישואין וניתוק התקווה מהמיוחל.',
        conflictsWithHawi: true,
        note: 'חאוי: שמחה, חברים, ניצחון (מעורב-חיובי). בלוג האמל: קלקול נישואין (שלילי). חאוי גובר.',
      },
},
    {
      "house": 12,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על קלקול עניינים, מרמה מצד אויבים, טוב ורע עמהם, דיבור עם שפלים, ואיבה גדולה מצד נשים ארוכות וממי שאין בו טוב.",
      "topics": ['קלקול עניינים', 'מרמה מצד אויבים', 'טוב ורע', 'דיבור עם שפלים', 'איבה גדולה'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على أن الأعداء للسائل كثيرون وإن حاجته محبوسة',
        meaningHebrew: 'מורה שאויבי השואל רבים ועניינו חסום.',
        conflictsWithHawi: false,
      },
},
    {
      "house": 13,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על רווחה מצד אהבה ומצד הסולטן, ועל הגעת נעדר, שליח או מכתב שישמח בו.",
      "topics": ['שמחה מאהבה', 'שלטון', 'הגעת נעדר', 'שליח', 'מכתב משמח'],
      "specialRules": ['הגעת נעדר/שליח/מכתב משמח.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على الحركات العسرة والمقاصد الصعبة والطريق العسر',
        meaningHebrew: 'מורה על תנועות קשות, מטרות קשות ודרך קשה.',
        conflictsWithHawi: true,
        note: 'חאוי: רווחה מאהבה ושלטון, הגעת נעדר (חיובי). בלוג האמל: קושי בתנועות (שלילי). חאוי גובר.',
      },
},
    {
      "house": 14,
      "sourceStatus": "explicit-in-source",
      "meaning": "מורה על בלבול עניינים כעת שאחריו טוב; טוב בנישואין, שמחה, טובה גלויה, אכילה ושתייה, הנאות, בושם, ממון, מידות טובות, תשוקה בנישואין וילדים קטנים.",
      "topics": ['בלבול עניינים', 'טוב אחר כך', 'נישואין', 'שמחה', 'טובה גלויה', 'אכילה', 'שתייה', 'הנאות', 'בושם', 'ממון', 'תשוקת נישואין'],
      "specialRules": ['בלבול עכשיו שאחריו טוב; טוב בנישואין, שמחה, אכילה, שתייה, הנאות, בושם, ממון ותשוקת נישואין.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'تدل على بلوغ الأمل من النساء أو الأموال في النهاية',
        meaningHebrew: 'מורה על השגת התקווה מנשים או מממון בסופו של דבר.',
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
      "sourceStatus": "supplemented-from-secondary-source",
      "meaning": "מורה על גורל אישה ממוצעת ואישה פרוצה ואמת שאינה נאמנה.",
      "topics": ['לא מפורש'],
      "specialRules": ['לא מפורש במקור; אין להשלים.'],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'عاقبة إمرأة متوسطة وإمرأة فاجرة وصدق غير صدوق',
        meaningHebrew: 'מורה על גורל אישה ממוצעת ואישה פרוצה ואמת שאינה נאמנה.',
        isNewData: true,
        conflictsWithHawi: false,
      },
}
  ],

  secondarySourceEnrichment: {
    sourceBook: 'بلوغ الأمل في علم الرمل',
    housesEnriched: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    housesWithNewData: [16],
    housesWithConflict: [2, 5, 6, 8, 10, 11, 13],
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
    15,
    16
  ],
  "extractionStatus": "source-audited-enriched-option-2"
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_FIGURE_JUDLA };
}
