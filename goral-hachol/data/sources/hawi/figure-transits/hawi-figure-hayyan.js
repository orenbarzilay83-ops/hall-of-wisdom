/**
 * Source-exact working extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * ترحيل الأشكال الستة عشر في الستة عشر بيتا
 *
 * Figure:
 * الحيان / الأحيان — נשוא ראש
 *
 * Source pages:
 * PDF document 17.pdf — houses 1–8
 * PDF document 18.pdf — houses 9–16
 *
 * No external knowledge.
 */

const HAWI_FIGURE_HAYYAN = {
  id: 'hawi-figure-hayyan',
  order: 9,
  arabicName: 'الأحيان / الحيان',
  hebrewName: 'נשוא ראש',
  aliases: ['الضاحك القائم'],
  source: 'hawi',
  section: 'ترحيل الأشكال الستة عشر في الستة عشر بيتا',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourcePages: ['PDF document 17.pdf', 'PDF document 18.pdf'],
  extractionStatus: 'source-audited-enriched-option-2',
  auditStatus: 'source-present-expanded-from-transit-audit',
  next: 'hawi-figure-nakis',

  noteHebrew:
    'זהו פירוש מעבר/תרחיל הצורה נשוא ראש בבתים, ולא שכבת מצב צורה לפי ناطق/صامت/سعد/نحس. לפי מיפוי הספר, נשוא ראש מופיע בפרק התרחיל בעמודים 17–18, אך לא נמצא בפרק מצבי הצורות בעמודים 45–51.',

  houses: [
    {
      house: 1,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: ['الحيان بيت 1: الخير والسعادة'],
      meaning:
        'מורה על טוב, ברכה, אושר והצלחה כללית בפתיחת העניין.',
      detailsHebrew: [
        'זהו בית הפתיחה של הצורה.',
        'הדין המרכזי: טוב ואושר.',
        'יש לשמור את הקריאה כצורה חיובית מאוד כשהיא עומדת בבית הראשון.'
      ],
      topics: ['general-good', 'happiness', 'opening-state']
    },
    {
      house: 2,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 2: كثرة المال من حلال وحسن تدبير في كل ما يرجو'
      ],
      meaning:
        'מורה על ריבוי ממון ממקור מותר, ועל הנהגה טובה ותכנון נכון בכל מה שמקווים לו.',
      detailsHebrew: [
        'ריבוי ממון.',
        'הממון בא מן ההיתר / מקור מותר.',
        'חיזוק של ניהול נכון, שיקול דעת ותכנון טוב במה שהשואל מקווה לו.'
      ],
      topics: ['money', 'lawful-income', 'planning', 'livelihood']
    },
    {
      house: 3,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 3: المنافع من الحديد والذهب والفضة / السعة في التعليم'
      ],
      meaning:
        'מורה על תועלות מברזל, זהב וכסף, ועל הרחבה בלימוד.',
      detailsHebrew: [
        'תועלת ממתכות: ברזל, זהב וכסף.',
        'הרחבה בלימוד והשכלה.',
        'מתאים לשאלות על לימוד, ידע, אחים/קרובים ותנועה קרובה כאשר בית 3 פעיל.'
      ],
      topics: ['metals', 'gold', 'silver', 'iron', 'learning', 'education']
    },
    {
      house: 4,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 4: الفائدة من الضياع والارض والوبا'
      ],
      meaning:
        'מורה על תועלת מן האחוזות, הקרקע והעניינים הקשורים לאדמה.',
      detailsHebrew: [
        'תועלת מן קרקעות, אחוזות ונכסי אדמה.',
        'המילה הערבית האחרונה במיפוי: الوبا — דורשת בדיקת צילום/מקור, ולכן אין להרחיב מסברה.',
        'הקריאה נשמרת בזהירות סביב בית, שורשים, קרקע ורכוש.'
      ],
      topics: ['land', 'property', 'estates', 'roots'],
      unclearTerms: ['الوبا'],
      sourceReview: 'unclear-needs-photo-review'
    },
    {
      house: 5,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 5: المنافع من قبل الولد والهدايا والرسل ولبس الخلع'
      ],
      meaning:
        'מורה על תועלות מצד הילדים, מתנות, שליחים ולבישת כבוד/חלוקים.',
      detailsHebrew: [
        'תועלת מצד ילדים.',
        'מתנות ושליחים.',
        'לבישת خلع / לבושי כבוד או לבושים הניתנים כהוקרה.',
        'הקובץ הישן הזכיר שאין כאן חליצה/הסרה; לפי המיפוי הנוכחי יש לשמור את לשון לבישת الخلع ולא לפרש מסברה.'
      ],
      topics: ['children', 'gifts', 'messengers', 'honor-clothing']
    },
    {
      house: 6,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 6: الدواب والعبيد والمواشي والمماليك / الخروج من المرض والفرح'
      ],
      meaning:
        'מורה על בהמות, עבדים, מקנה ורכוש חי; ועל יציאה מן המחלה ושמחה.',
      detailsHebrew: [
        'ענייני בהמות, מקנה, עבדים ומשרתים.',
        'יציאה מן המחלה.',
        'שמחה לאחר קושי רפואי או שירותי.',
        'בית זה חשוב לשאלות חולי, עבדים/עובדים, מקנה ורכוש חי.'
      ],
      topics: ['illness', 'recovery', 'servants', 'livestock', 'animals', 'joy'],
      specialRules: ['יציאה מן המחלה ושמחה.'],
    },
    {
      house: 7,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 7: النكاح الحسن / الظفر بالخصام / العلو على الضداد'
      ],
      meaning:
        'מורה על נישואין טובים, ניצחון במריבה ועליונות על מתנגדים.',
      detailsHebrew: [
        'נישואין טובים.',
        'ניצחון במחלוקת או מריבה.',
        'עליונות על מתנגדים.',
        'בית חשוב לשאלות זוגיות, שותפות, דין ודברים ואויב גלוי.'
      ],
      topics: ['marriage', 'partnership', 'disputes', 'victory', 'opponents']
    },
    {
      house: 8,
      sourcePages: ['PDF document 17.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 8: المواريث وربما يدل على ولاية هذه الامور الواسعة'
      ],
      meaning:
        'מורה על ירושות, ואפשר שמורה גם על אחריות/מינוי/שליטה בעניינים רחבים.',
      detailsHebrew: [
        'ירושות.',
        'ייתכן דין של ولاية — אחריות, שליטה או מינוי על עניינים רחבים.',
        'אין לצמצם את בית 8 רק למוות; כאן המקור נותן תועלת של ירושה ואפשרות של אחריות רחבה.'
      ],
      topics: ['inheritance', 'authority', 'wide-affairs', 'house-8'],
      specialRules: ['לא לצמצם למוות: כאן המקור נותן ירושות ואפשרות מינוי/שליטה בעניינים רחבים.'],
    },
    {
      house: 9,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 9: السفار البعيدة والغربة والدين والعبادة والفقه والرؤيا الصالحة والتمكين والجاه'
      ],
      meaning:
        'מורה על נסיעות רחוקות, גלות/נכר, דת, עבודת קודש, פקחות/הלכה, חלום טוב, התבססות ומעמד.',
      detailsHebrew: [
        'נסיעות רחוקות ונכר.',
        'דת, עבודת קודש וידיעה דתית/הלכתית.',
        'חלומות טובים.',
        'تمكين וג׳אה — התבססות, כוח ומעמד.'
      ],
      topics: ['long-travel', 'foreign-lands', 'religion', 'worship', 'dreams', 'status']
    },
    {
      house: 10,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 10: الحياة وسفر السلطان / اجتماع بمحبوب'
      ],
      meaning:
        'מורה על חיים, נסיעת הסולטן, והתכנסות/מפגש עם אהוב.',
      detailsHebrew: [
        'חיים.',
        'נסיעה של הסולטן או בעל סמכות.',
        'מפגש עם אהוב.',
        'בית 10 מחבר כאן מעמד/שלטון עם עניין רגשי או מפגש חשוב.'
      ],
      topics: ['life', 'authority', 'sultan', 'travel', 'beloved', 'meeting']
    },
    {
      house: 11,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 11: الفرح والسرور / مصاحبة اكابر الناس والاتصال بهم'
      ],
      meaning:
        'מורה על שמחה, חדווה, חברות עם גדולי אנשים וקשר איתם.',
      detailsHebrew: [
        'שמחה וחדווה.',
        'חברות או ליווי של אנשים גדולים/חשובים.',
        'קשר עם בעלי מעמד.'
      ],
      topics: ['friends', 'joy', 'important-people', 'connections']
    },
    {
      house: 12,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 12: الفائدة في الرؤية والعبيد والماء'
      ],
      meaning:
        'מורה על תועלת בענייני ראייה/חזון לפי נוסח המיפוי, וכן עבדים ומים.',
      detailsHebrew: [
        'תועלת בענייני עבדים ומים.',
        'המילה الرؤية נשמרת כלשונה מן המיפוי; ייתכן שדורשת בדיקת צילום כדי לוודא אם הכוונה לראייה/חזון או מילה אחרת.',
        'אין להשלים מסברה מעבר למה שנמצא במיפוי.'
      ],
      topics: ['servants', 'water', 'vision-or-reading', 'house-12'],
      unclearTerms: ['الرؤية'],
      sourceReview: 'unclear-needs-photo-review'
    },
    {
      house: 13,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 13: الفائدة من قبل السلطان والوزير'
      ],
      meaning:
        'מורה על תועלת מצד הסולטן והשר.',
      detailsHebrew: [
        'תועלת מבעל סמכות.',
        'תועלת מן הסולטן או השר.',
        'מתאים לשאלות על עזרה מגורמי שלטון, בעלי תפקיד או מנהיגות.'
      ],
      topics: ['authority', 'sultan', 'minister', 'benefit']
    },
    {
      house: 14,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 14: كمال السعادة فيما يرجوه / طول الحياة / العز والكمال في كل شئ',
        'وليس يدخل في الميزان لنة من الشكال المفردة'
      ],
      meaning:
        'מורה על שלמות האושר במה שמקווים לו, אריכות חיים, כבוד, חוזק ושלמות בכל דבר; ואינה נכנסת במאזן מפני שהיא מן הצורות היחידות.',
      detailsHebrew: [
        'שלמות האושר במה שהשואל מקווה לו.',
        'אריכות חיים.',
        'כבוד, עוז ושלמות בכל דבר.',
        'כלל חשוב: הצורה אינה נכנסת במאזן מפני שהיא מן הצורות היחידות.',
        'זה כלל מבני חשוב למנוע ולא רק פירוש בית מקומי.'
      ],
      rules: [
        {
          id: 'hayyan-does-not-enter-mizan',
          arabicText: 'وليس يدخل في الميزان لنة من الشكال المفردة',
          hebrew: 'אינה נכנסת במאזן מפני שהיא מן הצורות היחידות.',
          ruleType: 'engine-structural-note'
        }
      ],
      topics: ['completion', 'happiness', 'long-life', 'honor', 'mizan', 'structural-rule'],
      specialRules: ['כלל מנוע חשוב: נשוא ראש אינו נכנס במאזן מפני שהוא מן הצורות היחידות.'],
    },
    {
      house: 15,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'not-explicit-in-source',
      sourceArabic: [],
      meaning:
        'המקור במיפוי הנוכחי אינו מביא דין מפורש לבית זה. אין להשלים מסברה.',
      detailsHebrew: [
        'בית 15 לא מופיע במיפוי שנמסר עבור החיאן.',
        'אין להשלים מתוך היגיון או מתוך בית אחר.'
      ],
      topics: ['not-explicit'],
      specialRules: ['לא מפורש במקור; אין להשלים מסברה.'],
    },
    {
      house: 16,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'الحيان بيت 16: الفروغ من كل شئ وقلة حصوله'
      ],
      meaning:
        'מורה על הסתעפות/פריסה או סיום של כל דבר, אך גם על מיעוט השגה או קושי להשיגו.',
      detailsHebrew: [
        'המקור מדבר על الفروغ من كل شئ.',
        'יחד עם זה מופיע قلة حصوله — מיעוט השגה או קושי בקבלת הדבר.',
        'לכן בית 16 אינו רק טוב או רק רע; יש בו סיום/התפנות או פריסה, אך השגה מועטה.'
      ],
      topics: ['ending', 'completion', 'low-attainment', 'house-16'],
      specialRules: ['סיום/פרוג של כל דבר יחד עם מיעוט השגה או קושי להשיג.'],
    }
  ],

  coverage: '16/16',
  housesListed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  notExplicitInSource: [15],

  expansionSummary: {
    sourcePages: ['PDF document 17.pdf', 'PDF document 18.pdf'],
    expandedFrom: 'full-book-mapping-pages-17-18',
    status: 'source-expanded',
    importantRules: ['hayyan-does-not-enter-mizan'],
    unclearNeedsPhotoReview: [
      { house: 4, term: 'الوبا' },
      { house: 12, term: 'الرؤية' }
    ]
  }
};

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_HAYYAN };
}
