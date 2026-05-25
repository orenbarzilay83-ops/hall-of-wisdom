/**
 * Source-exact working extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * ترحيل الأشكال الستة عشر في الستة عشر بيتا
 *
 * Figure:
 * نقي الخد / الأشقر — בר הלחי
 *
 * Source pages:
 * PDF document 18.pdf — heading begins at end
 * PDF document 19.pdf — houses 1–16
 *
 * Secondary source checked (بلوغ الأمل في علم الرمل):
 * Only topic-specific rules found (commerce, theft) — no per-house transit data.
 * No enrichment added; Hawi data stands as sole source.
 */

export const HAWI_FIGURE_NAQI_KHAD = {
  id: 'hawi-figure-naqi-khad',
  order: 11,
  arabicName: 'نقي الخد / الأشقر',
  hebrewName: 'בר הלחי',
  aliases: ['نقي الخد', 'الأشقر'],
  source: 'hawi',
  section: 'ترحيل الأشكال الستة عشر في الستة عشر بيتا',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourcePages: ['PDF document 18.pdf', 'PDF document 19.pdf'],
  extractionStatus: 'source-audited-enriched-option-2',
  auditStatus: 'source-present-expanded-from-transit-audit',
  next: 'hawi-figure-judla',

  noteHebrew:
    'זהו פירוש מעבר/תרחיל הצורה בר הלחי בבתים, ולא שכבת מצב צורה לפי ناطق/صامت/سعد/نحس. לפי מיפוי הספר, בר הלחי מתחיל בסוף PDF 18 והפירוט המלא נמצא ב־PDF 19.',

  houses: [
    {
      house: 1,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'نقي الخد בית 1: الذكر والنثى / الفرح والسرور / النعمة الظاهرة / الاكل والشرب / كثرة الملاهي / كثرة المال / حسن الخلق / الشهوة والنكاح / الاطفال المرد',
        'בית 1: العشق في النساء والصبيان / المشي معهم / القبض منهم / بسعد الشواهد الجيدة'
      ],
      meaning:
        'מורה על זכר ונקבה, שמחה, טובה גלויה, אכילה ושתייה, הנאות, ריבוי ממון, מידות טובות, תשוקה, נישואין וילדים צעירים.',
      detailsHebrew: [
        'זכר ונקבה.',
        'שמחה וחדווה.',
        'نعمة ظاهرة — טובה גלויה/ברכה נראית.',
        'אכילה, שתייה וריבוי הנאות.',
        'ריבוי ממון.',
        'מידות טובות.',
        'תשוקה, נישואין וילדים צעירים.',
        'אהבה/חשק בנשים ובנערים לפי לשון המקור.',
        'הליכה/קשר איתם וקבלה מהם לפי עדים טובים.'
      ],
      sensitiveNotes: [
        'המקור כולל לשון של תשוקה, נשים ונערים. לשמר כידע מקור; ניסוח לקוח ייקבע בנפרד.'
      ],
      witnessDependent: true,
      topics: ['male-female', 'joy', 'food-drink', 'pleasure', 'money', 'desire', 'marriage', 'young-children', 'witness-dependent'],
      criticalArabicTerms: ['الشواهد الجيدة'],
      specialRules: ['אהבה/חשק וקבלה מנשים/נערים לפי עדים טובים; לשמור כחומר מקור רגיש.'],
    },
    {
      house: 2,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 2: الفائدة من قبل النساء / كثرة البيع والشراء',
        'בית 2: قبض مال بعد تأخير ومطل / دراهم وذهب من زوجة تعشقه / بالشواهد'
      ],
      meaning:
        'מורה על תועלת מצד נשים, ריבוי מכירה וקנייה, וקבלת ממון לאחר עיכוב ודחייה.',
      detailsHebrew: [
        'תועלת מצד נשים.',
        'ריבוי מסחר: מכירה וקנייה.',
        'קבלת ממון לאחר עיכוב, דחייה או סחבת.',
        'דרהמים וזהב מאישה שאוהבת/חושקת בו לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['money', 'women', 'commerce', 'gold', 'delayed-payment', 'witness-dependent'],
      criticalArabicTerms: ['بالشواهد'],
      specialRules: ['קבלת ממון לאחר עיכוב ודחייה, זהב/דרהמים מאישה לפי העדים.'],
    },
    {
      house: 3,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 3: المحبة بين الصدقاء / الخوة والمخاطبة / الاجتماع بحبيب من احد اخوته',
        'בית 3 חומר רגיש: اهل الزنا واللواطة',
        'בית 3: مفارقة زوج من اقاربه / قبض دراهم على قدر الشواهد'
      ],
      meaning:
        'מורה על אהבה בין חברים ואחים, דיבור וקשר, מפגש עם אהוב דרך אחד מאחיו, וכן חומר רגיש על זנות ולוואט; פרידה של בן זוג מקרוביו וקבלת דרהמים לפי העדים.',
      detailsHebrew: [
        'אהבה בין חברים.',
        'אחים, דיבור והתכתבות/שיחה.',
        'מפגש עם אהוב דרך אחד מן האחים.',
        'פרידה של בן זוג מאחד מקרוביו.',
        'קבלת דרהמים לפי העדים.'
      ],
      sensitiveNotes: [
        'המקור מזכיר اهل الزنا واللواطة. לשמר את המונחים בשכבת ידע; ניסוח לקוח ייקבע בנפרד.'
      ],
      witnessDependent: true,
      topics: ['siblings', 'friends', 'speech', 'beloved', 'sexual-conduct', 'separation', 'money', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['אהבה בין חברים ואחים, אבל גם חומר רגיש: זנות/לוואט; קבלת דרהמים לפי העדים.'],
    },
    {
      house: 4,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 4: الفائدة من قبل الاباء والامهات والضياع والعقارات / كتمان السر',
        'בית 4: البكاء والدموع من قبل والدية وقرابته من النساء / قبض صرة دراهم على قدر الشواهد'
      ],
      meaning:
        'מורה על תועלת מצד אבות ואימהות, אחוזות וקרקעות, שמירת סוד, בכי ודמעות מצד ההורים או קרובות נשים, וקבלת צרור דרהמים לפי העדים.',
      detailsHebrew: [
        'תועלת מצד האב והאם.',
        'תועלת מאחוזות, קרקעות ונכסים.',
        'שמירת סוד.',
        'בכי ודמעות מצד ההורים או קרובות משפחה נשים.',
        'קבלת צרור דרהמים לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['parents', 'land', 'property', 'secrecy', 'tears', 'money', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['תועלת מהורים/קרקע + שמירת סוד + בכי ודמעות + צרור דרהמים לפי העדים.'],
    },
    {
      house: 5,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 5: الولد والسرور والهدايا والرسل / كتب مجموعة من محبوب / السعد الكامل',
        'בית 5: طفل يولد على قدر الشواهد'
      ],
      meaning:
        'מורה על ילד, שמחה, מתנות, שליחים, כתבים מקבוצת אהובים, סעד שלם, וילד שייוולד לפי העדים.',
      detailsHebrew: [
        'ילד ושמחה.',
        'מתנות ושליחים.',
        'כתבים/מכתבים מקבוצת אהובים.',
        'סעד שלם.',
        'ילד שייוולד לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['children', 'birth', 'joy', 'gifts', 'messengers', 'letters', 'benefic', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['ילד שייוולד לפי העדים.'],
    },
    {
      house: 6,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 6: المرض والموت في العبيد والماء',
        'בית 6: سفر المماليك والمواشي والفائدة منهم',
        'בית 6: النساء التي فيهن الخلطة / الاتصال بحبيب مفارق / قبض شئ منه على قدر الشواهد'
      ],
      meaning:
        'מורה על מחלה ומוות אצל עבדים ומים, נסיעת משרתים/מקנה ותועלת מהם, נשים שיש בהן ערבוב, וקשר עם אהוב שנפרד וקבלת דבר ממנו לפי העדים.',
      detailsHebrew: [
        'מחלה ומוות בעבדים ובמים לפי לשון המקור.',
        'נסיעה של משרתים/ממלוכים ומקנה.',
        'תועלת מהם.',
        'נשים שיש בהן خِلطة / ערבוב או קשר מעורב.',
        'קשר עם אהוב שנפרד.',
        'קבלת דבר ממנו לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['illness', 'death', 'servants', 'water', 'livestock', 'travel', 'women', 'beloved', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['מחלה/מוות בעבדים ומים; קשר עם אהוב שנפרד וקבלת דבר ממנו לפי העדים.'],
    },
    {
      house: 7,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 7: التزويج والسرور من قبل النساء / النجاح في الشركة والمعاملة والمخالطة',
        'בית 7: الاتصال بالنساء والصبيان المنكوحين / الاجتماع بحبيب',
        'בית 7 חומר רגיש: الحرام والعشق والفسق'
      ],
      meaning:
        'מורה על זיווג, שמחה מצד נשים, הצלחה בשותפות, עסקה וקשרי תערובת; קשר עם נשים ונערים, מפגש עם אהוב, וגם ענייני איסור, חשק וفسק לפי המקור.',
      detailsHebrew: [
        'נישואין/זיווג.',
        'שמחה מצד נשים.',
        'הצלחה בשותפות, מסחר/עסקה ומעורבות עם אחרים.',
        'קשר עם נשים ונערים לפי לשון המקור.',
        'מפגש עם אהוב.'
      ],
      sensitiveNotes: [
        'המקור מזכיר الحرام والعشق والفسق. לשמר כידע מקור; ניסוח לקוח ייקבע בנפרד.'
      ],
      topics: ['marriage', 'women', 'partnership', 'commerce', 'mixing', 'beloved', 'forbidden', 'sexual-conduct'],
      specialRules: ['נישואין/שותפות/נשים, אבל גם איסור/חשק/فسق; חומר רגיש לשימור.'],
    },
    {
      house: 8,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 8: الصغار والمواريث الداخلة / السيف المغمود / الصبي الذي لم يبلغ الحلم',
        'בית 8: موت صبية / زوج يناله مشقة وربما هلك على قدر الشواهد'
      ],
      meaning:
        'מורה על קטנים, ירושות נכנסות, חרב בנדן, ילד שלא הגיע לבגרות, מות נערה, ובן זוג שיקבל קושי ואולי יאבד/ייהרג לפי העדים.',
      detailsHebrew: [
        'קטנים וילדים צעירים.',
        'ירושות נכנסות.',
        'חרב בנדן.',
        'ילד שלא הגיע לבגרות.',
        'מות נערה.',
        'בן זוג שיקבל קושי ואולי יאבד/ייהרג לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['children', 'inheritance', 'sword', 'death', 'spouse', 'difficulty', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['קטנים/ירושות/חרב בנדן; מות נערה; בן זוג בקושי ואולי אובדן לפי העדים.'],
    },
    {
      house: 9,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 9: الفائدة في السفار / المعرفة بغوامض العلوم والحكمة والفلسفة / الرؤيا الصالحة',
        'בית 9: النقلة والخروج بزوجة / אולי ממלכה / יציאה מהיד לצורך נישואין على قدر الشواهد'
      ],
      meaning:
        'מורה על תועלת בנסיעות, ידיעת עומקי החכמות, חכמה ופילוסופיה, חלומות טובים, מעבר ויציאה עם אישה/בת זוג, ואפשרות לעניין מלכות או יציאה מן היד לצורך נישואין לפי העדים.',
      detailsHebrew: [
        'תועלת בנסיעות.',
        'ידיעה בעומקי החכמות.',
        'חכמה ופילוסופיה.',
        'חלומות טובים.',
        'מעבר ויציאה עם אישה/בת זוג.',
        'אפשרות לעניין מלכות לפי המיפוי.',
        'יציאה מן היד לצורך נישואין לפי העדים.'
      ],
      witnessDependent: true,
      topics: ['travel', 'hidden-knowledge', 'wisdom', 'philosophy', 'dreams', 'spouse', 'authority', 'witness-dependent'],
      criticalArabicTerms: ['على قدر الشواهد'],
      specialRules: ['חכמות נסתרות, פילוסופיה, חלומות; יציאה עם אישה/לצורך נישואין לפי העדים.'],
    },
    {
      house: 10,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 10: السرور والفرح من قبل السلطان والولاة / النجاح في البيع والشراء وكل شئ يرجى',
        'בית 10: الاتصال بالملك والشراف / الرفعة والحباء / خدمة السلطان'
      ],
      meaning:
        'מורה על שמחה מצד הסולטן והשרים/ממונים, הצלחה במכירה וקנייה ובכל דבר שמקווים לו, קשר עם מלך ונכבדים, התרוממות, מתנות/חיבה, ושירות הסולטן.',
      detailsHebrew: [
        'שמחה מצד הסולטן ובעלי תפקיד.',
        'הצלחה במסחר: מכירה וקנייה.',
        'הצלחה בכל דבר שמקווים לו.',
        'קשר עם מלך ונכבדים.',
        'עלייה במעמד.',
        'حباء — מתנות, הענקה או חיבה מצד בעל סמכות.',
        'שירות הסולטן.'
      ],
      topics: ['authority', 'sultan', 'governors', 'commerce', 'success', 'king', 'honor', 'service']
    },
    {
      house: 11,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 11: المصادقة والسرور / الفائدة من الخوان والولد والنكاح / فائدة وصلح من زوج نقي الخد'
      ],
      meaning:
        'מורה על ידידות, שמחה, תועלת מן האחים/חברים, ילד ונישואין, ותועלת ותיקון מצד בן זוג בר הלחי.',
      detailsHebrew: [
        'ידידות וחברות.',
        'שמחה.',
        'תועלת מן האחים/חברים.',
        'תועלת מן ילד ונישואין.',
        'תועלת ותיקון מצד בן זוג הנושא את איכות בר הלחי.'
      ],
      topics: ['friends', 'joy', 'siblings', 'children', 'marriage', 'spouse', 'reconciliation']
    },
    {
      house: 12,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 12: فساد الامور والمكر والحيل / المنفعة من الدواب والماء والعبيد وربما ماتوا',
        'בית 12: مصاحبة صديق وهو عشير والعاقبة جيدة'
      ],
      meaning:
        'מורה על קלקול עניינים, מרמה ותחבולות; תועלת מבהמות, מים ועבדים, ואפשר שימותו; וכן חברות עם אדם נאמן/קרוב אך קשה, ואחריתה טובה.',
      detailsHebrew: [
        'קלקול עניינים.',
        'מרמה ותחבולות.',
        'תועלת מבהמות, מים ועבדים.',
        'אפשרות מוות שלהם לפי המקור.',
        'חברות עם חבר/בן ברית קרוב.',
        'האחרית טובה.'
      ],
      sensitiveNotes: [
        'יש לשמור את לשון המוות והמרמה כמקור; ניסוח לקוח ייקבע בנפרד.'
      ],
      topics: ['corruption', 'deception', 'schemes', 'animals', 'water', 'servants', 'death', 'friendship', 'good-ending'],
      specialRules: ['קלקול, מרמה ותחבולות; תועלת מבהמות/מים/עבדים; אחרית טובה עם חבר/בן ברית.'],
    },
    {
      house: 13,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 13: الفائدة من الولاة والدين والسفر / العاقبة الجيدة'
      ],
      meaning:
        'מורה על תועלת מצד בעלי סמכות, דת ונסיעה, ועל אחרית טובה.',
      detailsHebrew: [
        'תועלת מצד ממונים/בעלי סמכות.',
        'תועלת מצד דת.',
        'תועלת מצד נסיעה.',
        'אחרית טובה.'
      ],
      topics: ['authority', 'religion', 'travel', 'good-ending']
    },
    {
      house: 14,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 14: الفوائد وقبض بمشقة وانفصال'
      ],
      meaning:
        'מורה על תועלות וקבלה מתוך קושי והיפרדות.',
      detailsHebrew: [
        'תועלות.',
        'קבלה/אחיזה במשהו מתוך קושי.',
        'יש בה גם انفصال — היפרדות/ניתוק.'
      ],
      topics: ['benefit', 'receiving', 'difficulty', 'separation'],
      specialRules: ['תועלות וקבלה מתוך קושי והיפרדות.'],
    },
    {
      house: 15,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 15: לא הופיע במיפוי הסיכום כמשפט ערבי מלא, אך קובץ העבודה הקודם שמר: השגת המבוקש, קשר/חיבור והיפרדות.'
      ],
      meaning:
        'מורה על השגת המבוקש, על קשר או חיבור, ועל היפרדות.',
      detailsHebrew: [
        'במיפוי שהודבק לשיחה, בית 15 לא הופיע עם נוסח ערבי מלא.',
        'הקובץ הקיים לפני ההרחבה שמר דין מפורש לבית 15: השגת המבוקש, קשר/חיבור והיפרדות.',
        'לכן הבית נשמר כ־explicit-in-source אך מסומן לבדיקת צילום/מקור כדי להשלים נוסח ערבי מדויק.'
      ],
      sourceReview: 'needs-arabic-source-line-review',
      topics: ['attainment', 'connection', 'separation', 'needs-review'],
      reviewNotes: ['בית 15 — חסר נוסח ערבי מלא במיפוי הנוכחי; להשאיר needs-arabic-source-line-review.'],
    },
    {
      house: 16,
      sourcePages: ['PDF document 19.pdf'],
      sourceStatus: 'explicit-in-source',
      sourceArabic: [
        'בית 16: خسارة المال واتصال يرجى'
      ],
      meaning:
        'מורה על הפסד ממון, וגם על קשר או חיבור שמקווים לו.',
      detailsHebrew: [
        'הפסד ממון.',
        'קשר/חיבור שמקווים לו.',
        'הדין מורכב: הפסד מצד אחד, אפשרות חיבור מצד שני.'
      ],
      topics: ['money-loss', 'connection', 'hope', 'mixed'],
      specialRules: ['הפסד ממון + קשר/חיבור שמקווים לו; דין מעורב.'],
    }
  ],

  coverage: '16/16',
  housesListed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  notExplicitInSource: [],

  expansionSummary: {
    sourcePages: ['PDF document 18.pdf', 'PDF document 19.pdf'],
    expandedFrom: 'full-book-mapping-pages-18-19',
    status: 'source-expanded',
    sensitiveTopicsPreserved: [
      'sexual-conduct',
      'forbidden-desire',
      'zina',
      'liwat',
      'fisq',
      'illness',
      'death',
      'deception',
      'money-loss'
    ],
    needsPhotoReview: [
      {
        house: 15,
        reason: 'The pasted full-book mapping did not include the complete Arabic line for house 15, while the existing working extraction had an explicit meaning.'
      }
    ]
  }
};

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_NAQI_KHAD };
}
