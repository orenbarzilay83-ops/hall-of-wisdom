export const HAWI_DHAMIR_DIRECTIONS_VALIDATION = {
  id: 'hawi-dhamir-directions-validation',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 33.pdf', 'PDF document 34.pdf'],
  sourceSectionsArabic: [
    'فصل في معرفة صحة الضرب',
    'تسكين الشرق',
    'بقية مسائل السفر',
  ],
  sourceSectionHebrew:
    'חילוץ הדמיר, בדיקת תקפות ההכאה, כוכבי הצורות ותסקין המזרח',
  status: 'source-preserved-and-entered',
  appArea: 'dhamir-directions-validation',
  purposeHebrew:
    'שכבת יסוד מתוך חאוי לחילוץ הדמיר, בדיקת תקפות ההכאה, שיוך צורות לכוכבים, תסקין الشرق, ודיני נסיעה לפי כיוונים, יתדות, סוקטים, לבנה ושמש.',

  travelHouseMap: {
    sourcePage: 33,
    arabic: [
      'اجعل الطالع للمسافر',
      'والتاسع للسفر',
      'والثالث والخامس دليل على الخروج والوتاد لقوتة وعزة وجاهة وما يليها لما يطرا علية',
      'والسادس لما يلقى من الشدائد والمور الصعبة وموت الدواب والعبيد والغلمان',
      'والثامن موضع المنية والفات والسموم القاتلة'
    ],
    hebrewRules: [
      'הטאלע / בית 1 — הנוסע עצמו.',
      'בית 9 — הנסיעה.',
      'בית 3 ובית 5 — סימני יציאה ותנועה.',
      'היתדות — כוחו, עוזו ומעמדו של הנוסע.',
      'מה שאחרי היתדות — מה שמתחדש עליו בדרך.',
      'בית 6 — קשיים, דברים קשים, מוות של בהמות/עבדים/משרתים.',
      'בית 8 — מקום מוות, פגעים ורעלים קטלניים.',
    ],
  },

  forcedOrChosenTravelRules: [
    {
      id: 'bad-look-to-third-or-ninth-forced-travel',
      sourcePage: 33,
      arabic:
        'فان نظر الى الثالث او الى التاسع نظر غير محمود فاعلم ان السائل مسافر بغير اختيارة وغصبا علية',
      hebrew:
        'אם הטאלע מביט לבית 3 או לבית 9 במבט שאינו משובח — השואל נוסע שלא ברצונו, בכפייה.',
    },
    {
      id: 'tali-in-third-ninth-fourteenth-self-chosen-travel',
      sourcePage: 33,
      arabic:
        'وان كان الطالع في الثالث والتاسع والرابع عشر طلب السفر من تلقاء نفسة وليس بمكروة علية',
      hebrew:
        'אם הטאלע בבית 3, 9 או 14 — הוא מבקש את הנסיעה מעצמו ואינו מוכרח עליה.',
    },
  ],

  moonValidationRules: {
    sourcePage: 33,
    principleArabic:
      'القمر هو ينبوع الحياة الحيوانية وانة الدليل على صاحب السؤال',
    principleHebrew:
      'הלבנה היא מקור החיים החיוניים והיא הדליל של בעל השאלה; מה שפוגע בה פוגע בבעל השאלה בטוב או ברע.',
    moonForms: [
      {
        arabicName: 'البياض',
        hebrewName: 'לבן',
        sourceShape: '||0|',
        ruleHebrew:
          'אם הופיע לבן — אין צורך בדרך לעניין מסוים; ובענייני מלחמה, קרב ובקשת צרכים לבן טוב יותר.',
      },
      {
        arabicName: 'الطريق',
        hebrewName: 'דרך',
        sourceShape: '0000',
        ruleHebrew:
          'אם הופיעה דרך והשאלה על נסיעה — זה טוב יותר.',
      },
    ],
    bothFormsRuleHebrew:
      'אם הופיעו שתי הצורות יחד — זה טוב וחזק יותר.',
    missingMoonRule: {
      arabic:
        'فان ضرب فلم يظهر القمر اعد الضرب',
      hebrew:
        'אם הפיל רמל ולא הופיעה צורת הלבנה — חוזרים על ההכאה/הפלה, במיוחד בדיני מלכים ודינים שרוצים לדייק בהם.',
    },
  },

  planetaryFigureMap: {
    sourcePage: 34,
    arabicIntro:
      'وكيفية الشكال على الكواكب وما شكل كوكب وقسمتة',
    ruleHebrew:
      'הצורה הרשומה ראשונה מצד ימין היא הכוכב עצמו; אם היא נעדרת, מעמידים את מזגו במקומו ודנים.',
    planets: [
      {
        dayHebrew: 'יום ראשון',
        planetArabic: 'شمس',
        planetHebrew: 'שמש',
        sourceShapes: ['00||', '|0|0'],
      },
      {
        dayHebrew: 'יום שני',
        planetArabic: 'قمر',
        planetHebrew: 'לבנה',
        sourceShapes: ['||0|', '0000'],
      },
      {
        dayHebrew: 'יום שלישי',
        planetArabic: 'مريخ',
        planetHebrew: 'מאדים',
        sourceShapes: ['|0||', '00|0'],
      },
      {
        dayHebrew: 'יום רביעי',
        planetArabic: 'عطارد',
        planetHebrew: 'כוכב / מרקורי',
        sourceShapes: ['||||', '|00'],
        reviewNoteHebrew:
          'במקור הקריא הצורה השנייה קצרה/משובשת כ־|00; לשמר כפי שנקרא עד בדיקה חזותית נוספת.',
      },
      {
        dayHebrew: 'יום חמישי',
        planetArabic: 'زحل',
        planetHebrew: 'שבתאי',
        sourceShapes: ['|||0', '0||0'],
      },
      {
        dayHebrew: 'יום שישי',
        planetArabic: 'زهرة',
        planetHebrew: 'נוגה',
        sourceShapes: ['||00', '0|00'],
      },
      {
        dayHebrew: 'יום שבת',
        planetArabic: 'مشتري',
        planetHebrew: 'צדק',
        sourceShapes: ['0|||', '|000'],
      },
    ],
  },

  strikeValidityPrinciples: [
    {
      id: 'every-important-raml-needs-planetary-figure-presence',
      sourcePage: 33,
      arabic:
        'وكل رمل نريد ان تستحكمة وتضبط احكامة فانة ان لم يحضر من قسمة كل كوكب وشكل من الشكال والفل تعتمد علية',
      hebrew:
        'בכל רמל שרוצים לחזק ולדייק את דיניו — אם לא הופיעה מחלקת כל כוכב וצורה מן הצורות, אין לסמוך עליו.',
    },
    {
      id: 'whole-book-related-to-dhamir',
      sourcePage: 34,
      arabic:
        'ثم ترجع الحكم فان الكتاب كلة متعلق بباب الضمير',
      hebrew:
        'המחבר אומר שכל הספר קשור לשער הדמיר; כלומר פתרון הדמיר הוא שכבה מרכזית שמחברת את הדינים.',
    },
    {
      id: 'dhamir-shape-rules-all-judgment',
      sourcePage: 34,
      arabic:
        'فان الشكل الذي يقع فية حل الضمير الحكم كلة فية وجميع الشكال راجعة الية وشاهدة علية والية',
      hebrew:
        'הצורה שבה נופל حل الضمير — כל הדין נמצא בה; כל הצורות חוזרות אליה, מעידות עליה ואליה.',
    },
  ],

  taskinEast: {
    sourcePage: 34,
    arabicName: 'تسكين الشرق',
    hebrewName: 'תסקין המזרח',
    ruleArabic:
      'انظر الى ذلك الشكل وكم مشى من بيتة على حكم الدائرة من اصل التسكين وهو هذا ويسمى تسكين الشرق',
    ruleHebrew:
      'לאחר שחישוב הדמיר נופל בצורה מסוימת, בודקים כמה היא הלכה מביתה לפי דין המעגל, לפי יסוד התסקין הנקרא תסקין המזרח.',
    orderFromSource: [
      '00|0',
      '0|||',
      '|000',
      '||0|',
      '0|00',
      '000|',
      '|0||',
      '|||0',
      '00||',
      '0||0',
      '|00|',
      '||00',
      '0000',
      '0|0|',
      '||||',
      '|0|0',
    ],
    noteHebrew:
      'זה סדר מקור חשוב. אין להחליף אותו בסדר צורות אחר לפני מיפוי מלא לצורות הפנימיות של האפליקציה.',
  },

  seventhSeekingRule: {
    sourcePage: 34,
    arabic:
      'واعلم ان كل شكل يطلب سابعة',
    hebrew:
      'כל צורה מבקשת את השביעית שלה.',
    appImportance:
      'כלל זה שייך לחיבורי צורות/דמיר/כיוונים וצריך להיכנס למנוע בעת בניית שכבת הדמיר.',
  },

  travelDhamirRule: {
    sourcePage: 34,
    arabic:
      'فاذا اردت تحكم بحل الضمير التي ذكرة فتنظر الى الشكل الذي يحل فية الضمي فان كان في وتد وتكرر في التاسع وكان داخل فانة لم يسافر',
    hebrew:
      'כאשר דנים בנסיעה לפי حل الضمير, מסתכלים על הצורה שבה הדמיר נופל: אם היא ביתד, חוזרת בתשיעי, והיא נכנסת — הוא לא ייסע.',
    topics: ['נסיעה', 'דמיר', 'יתדות', 'בית 9', 'צורה נכנסת'],
  },

  dangerTravelRules: [
    {
      id: 'bad-tali-moon-sun-travel-against-him',
      sourcePage: 34,
      arabic:
        'اذا نظرنا في امر هذا المسافر فوجدنا الطالع حل في ساقط او مايل وشهد لة النحوس او نظرت لة او كان هو نحيسا او منحوسا وكان القمر في وبالة او هبوطة او غير ناظر الى الطالع وكذلك الشمس فعلمنا ان سفرة علية ل لة',
      hebrew:
        'אם הטאלע בסוקֵט/נופל או נוטה, הנחסים מעידים לו או מביטים אליו, והוא עצמו נחס/מנוחס, והלבנה בנפילה/חולשה או אינה מביטה לטאלע וכן השמש — נסיעתו עליו ולא לטובתו.',
    },
    {
      id: 'connected-to-eighth-no-return',
      sourcePage: 34,
      arabic:
        'فان اتصل بالثامن او حل هو فية فاعلم انة لم يرجع من سفرة',
      hebrew:
        'אם התחבר לבית 8 או חל בו — אינו חוזר מנסיעתו.',
    },
    {
      id: 'malefic-look-death-in-travel',
      sourcePage: 34,
      arabic:
        'فان نظر منة منحوس مات في تلك السفرة',
      hebrew:
        'אם מביט ממנו נחס — מת באותה נסיעה.',
    },
    {
      id: 'benefics-and-good-moon-survival-after-hardship',
      sourcePage: 34,
      arabic:
        'وان نظر السعود وكان القمر ينظر في اماكن جيدة فاعلم انة يقاسي اهوال وشدائد وينجوا منها',
      hebrew:
        'אם הסעדים מביטים והלבנה מביטה ממקומות טובים — הוא יסבול פחדים וקשיים אך יינצל מהם.',
    },
  ],

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'דמיר, כיוונים ותוקף ההכאה',
    relatedModules: [
      'נסיעה',
      'טאלע השנה',
      'שער המולד',
      'כוכבים ומזלות',
      'בדיקת לוח הגורל',
      'תסקין הצורות',
    ],
    displayPolicyHebrew:
      'להציג כשכבת יסוד מקצועית. אין להשתמש בדמיר כמנוע אוטומטי עד שממפים את סדר תסקין الشرق לצורות הפנימיות באפליקציה.',
  },
};

export function getHawiDhamirDirectionsValidation() {
  return HAWI_DHAMIR_DIRECTIONS_VALIDATION;
}

export default { HAWI_DHAMIR_DIRECTIONS_VALIDATION };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_DHAMIR_DIRECTIONS_VALIDATION };
}
