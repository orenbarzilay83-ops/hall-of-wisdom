export const HAWI_RAIN_WEATHER_FORECAST = {
  id: 'hawi-rain-weather-forecast',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 62.pdf'],
  sourceSectionArabic: 'باب المطر',
  sourceSectionHebrew: 'שער הגשם',
  status: 'source-preserved-and-entered',
  appArea: 'rain-weather-forecast',
  purposeHebrew:
    'שכבת ידע לשער הגשם מתוך חאוי: גשם, שלג, קור, רוחות, ברקים, רעמים, עננים, התאמת הדין לארץ ולזמן, כוכבים, יסודות ומזגי הצורות.',

  openingPrinciple: {
    sourcePage: 62,
    arabic: [
      'باب المطر',
      'اعلم ان هذا الباب شريك الباب الول في احكامة',
      'فانة ل بد من النظر في كل سنة في البابين والشرة في الحكم',
      'فاذا اردت ان تعرف السنة التي انت فيها هل يكون فيها مطر كثير او قليل او ذلك الشهر او تلك الجمعة'
    ],
    hebrew:
      'שער הגשם קשור לשער הקודם בדיניו. יש לבדוק בכל שנה את שני השערים יחד, כדי לדעת אם באותה שנה, חודש או שבוע יהיה גשם רב או מועט.',
  },

  basicMethod: {
    sourcePage: 62,
    arabic: [
      'فاضرب على ذلك الرمل وانظر في الشكال المتصورة في البيوت الستة عشر',
      'فتجعل القمر نصفين نصف للمطر ونصف للبرودة والثلج'
    ],
    hebrew:
      'מפילים רמל על השאלה ובודקים את הצורות שנוצרו ב־16 הבתים. מחלקים את הלבנה לשני חצאים: חצי לגשם וחצי לקור ולשלג.',
    appRule:
      'במודול מזג אוויר יש לחשב לפי לוח מלא של 16 בתים, ואז לבדוק את כוח חצי הלבנה הקשור לגשם ואת החצי הקשור לקור/שלג.',
  },

  rainStrengthRules: [
    {
      id: 'strong-first-half-heavy-rain',
      sourcePage: 62,
      arabic:
        'ثم انظر في قوة النصف الول ان كان قويا في ذاتة وشهد شاهدةودليلة بمثل ذلك فانة باذن اللة يكون مطرا غزيرا يعم تلك الرض والبلد',
      hebrew:
        'אם החצי הראשון חזק בעצמו, והעד והמייצג שלו מעידים כך — יהיה בעזרת ה׳ גשם רב השוטף/כולל את אותה ארץ ואותה עיר.',
      condition: 'חצי ראשון חזק + עד ומייצג מחזקים',
      result: 'גשם רב וכללי',
      topics: ['גשם רב', 'עד', 'מייצג', 'כוח'],
    },
    {
      id: 'watery-houses-cold-snow-mix',
      sourcePage: 62,
      arabic:
        'وان وجدت النصف زايد او اتصل بالبيوت المائية فان يكون بردا وثلجا وخليطا',
      hebrew:
        'אם החצי מתרבה או מתחבר לבתים מימיים — יהיה קור, שלג ותערובת.',
      condition: 'חצי מתרבה או מתחבר לבתים מימיים',
      result: 'קור, שלג ותערובת',
      topics: ['קור', 'שלג', 'בתים מימיים'],
    },
    {
      id: 'opposite-condition-opposite-ruling',
      sourcePage: 62,
      arabic:
        'وان كان ضد ذلك فبالضد احكم',
      hebrew:
        'אם התנאים הפוכים — פוסקים להפך.',
      condition: 'היפוך התנאים',
      result: 'היפוך הדין',
      topics: ['כלל הכרעה'],
    },
  ],

  regionAdjustmentRules: [
    {
      id: 'judge-by-nature-of-land',
      sourcePage: 62,
      arabic:
        'في كل ارض تحكم على قدر طبعها وقس على ذلك فل يجب ان تحكم في مصر كما تحكم في الشام والروم والحجاز كالعجم',
      hebrew:
        'בכל ארץ פוסקים לפי טבעה. אין לדון במצרים כמו שדנים בשאם, ברום, בחיג׳אז או בעג׳ם.',
      ruleHebrew:
        'חובה להתאים את דין הגשם והמזג לטבע הארץ, האזור והאקלים המקומי.',
      topics: ['ארצות', 'אקלימים', 'התאמת דין'],
    },
    {
      id: 'judgment-changes-by-time-and-place',
      sourcePage: 62,
      arabic:
        'وقال بطليموس الحكيم اعلم ان الحكم يتغير بالزمان البلدان',
      hebrew:
        'החכם בטלמיוס אמר: הדין משתנה לפי הזמן והארצות.',
      ruleHebrew:
        'אין דין מזג אוויר מוחלט בלי זמן ומקום. חייבים להתחשב בעונה, בארץ ובטבע המקום.',
      topics: ['זמן', 'מקום', 'ארצות'],
    },
  ],

  planetaryWeatherIndications: [
    {
      id: 'venus-clouds-and-rain',
      sourcePage: 62,
      planetArabic: 'الزهرة',
      planetHebrew: 'נוגה',
      arabic:
        'اشكال الزهرة اذا ابتعدت عن الشمس',
      hebrew:
        'צורות נוגה כאשר הן מתרחקות מן השמש קשורות לענייני עננים/מטר.',
      indicationsHebrew: ['עננים', 'גשם/מטר'],
    },
    {
      id: 'saturn-black-clouds',
      sourcePage: 62,
      planetArabic: 'زحل',
      planetHebrew: 'שבתאי',
      arabic:
        'زحل للسحاب السود المتراكب',
      hebrew:
        'שבתאי מורה על עננים שחורים מצטברים.',
      indicationsHebrew: ['עננים שחורים', 'עננים מצטברים', 'קור/יובש לפי הקשר'],
    },
    {
      id: 'mercury-white-clouds',
      sourcePage: 62,
      planetArabic: 'عطارد',
      planetHebrew: 'כוכב / מרקורי',
      arabic:
        'عطارد ... سحاب ابيض',
      hebrew:
        'כוכב/מרקורי מורה על עננים לבנים.',
      indicationsHebrew: ['עננים לבנים'],
    },
    {
      id: 'jupiter-clouds-rainbow',
      sourcePage: 62,
      planetArabic: 'المشتري',
      planetHebrew: 'צדק',
      arabic:
        'المشتري من الكواكب المناظرة وسحابة متصل بحمرة وربما ظهر فية قوس قزح',
      hebrew:
        'צדק מן הכוכבים המביטים; עננו מחובר באדמומיות, ולעיתים מופיעה בו קשת בענן.',
      indicationsHebrew: ['עננים', 'אדמומיות בענן', 'קשת בענן'],
    },
    {
      id: 'mars-lightning-thunder-heavy-air',
      sourcePage: 62,
      planetArabic: 'المريخ',
      planetHebrew: 'מאדים',
      arabic:
        'والمريخ للبروق والرعود الهوية الثقيلة والخفيفة',
      hebrew:
        'מאדים מורה על ברקים, רעמים ואוויר כבד או קל.',
      indicationsHebrew: ['ברקים', 'רעמים', 'אוויר כבד', 'אוויר קל'],
    },
    {
      id: 'moon-master-of-weather-action',
      sourcePage: 62,
      planetArabic: 'القمر',
      planetHebrew: 'לבנה',
      arabic:
        'اما القمر هو صاحب الفعل في هذة المور كلها',
      hebrew:
        'הלבנה היא בעלת הפעולה בכל העניינים האלה.',
      indicationsHebrew: ['גורם מרכזי בדין הגשם והמזג'],
    },
  ],

  advancedWeatherRules: [
    {
      id: 'mars-in-rain-signification-thunder-dryness',
      sourcePage: 62,
      arabic:
        'واعلم ان المريخ اذا كان في المطار يكون معة الرعد واليبوسة وغير ذلك',
      hebrew:
        'אם מאדים נמצא בדיני המטר — יש עמו רעם, יובש ודברים נוספים.',
      topics: ['מאדים', 'רעם', 'יובש'],
    },
    {
      id: 'jupiter-winds',
      sourcePage: 62,
      arabic:
        'والمشتري ايضا يدل على الرياح',
      hebrew:
        'גם צדק מורה על רוחות.',
      topics: ['צדק', 'רוחות'],
    },
    {
      id: 'jupiter-with-rain-signification-storm-winds',
      sourcePage: 62,
      arabic:
        'وكان من المطار في دللتة فانة يهب عند ذلك رياح عاصفة',
      hebrew:
        'אם צדק במייצגות המטר — ינשבו רוחות סוערות.',
      topics: ['צדק', 'רוחות סוערות', 'גשם'],
    },
    {
      id: 'saturn-continuous-rains',
      sourcePage: 62,
      arabic:
        'واذا كان دللتة من زحل فانة يدل على المطار الدايمة',
      hebrew:
        'אם המייצגות מצד שבתאי — מורה על גשמים מתמשכים.',
      topics: ['שבתאי', 'גשמים מתמשכים'],
    },
  ],

  elementalJudgmentRules: [
    {
      id: 'heat-from-mars-and-sun',
      sourcePage: 62,
      arabic:
        'فانك ان نظرت في الحر فمن المريخ والشمس',
      hebrew:
        'חום נידון מצד מאדים והשמש.',
      qualityHebrew: 'חום',
      sourcesHebrew: ['מאדים', 'שמש'],
    },
    {
      id: 'cold-and-dry-from-saturn',
      sourcePage: 62,
      arabic:
        'والبرد واليبس فمن زحل',
      hebrew:
        'קור ויובש נידונים מצד שבתאי.',
      qualityHebrew: 'קור ויובש',
      sourcesHebrew: ['שבתאי'],
    },
    {
      id: 'rain-from-venus-moon-mercury',
      sourcePage: 62,
      arabic:
        'والمطار فمن الزهرة والقمر وعطارد',
      hebrew:
        'גשמים נידונים מצד נוגה, הלבנה וכוכב/מרקורי.',
      qualityHebrew: 'גשם',
      sourcesHebrew: ['נוגה', 'לבנה', 'כוכב/מרקורי'],
    },
    {
      id: 'judge-by-mixture-of-qualities',
      sourcePage: 62,
      arabic:
        'ومزاجهما مع الشكال الحارة والباردة والريحية والرطبة فاقض عليها بالقلة والكثرة على قدر ما ترى',
      hebrew:
        'יש לדון לפי מזגם עם הצורות החמות, הקרות, הרוחיות והלחות, ולפסוק מיעוט או ריבוי לפי מה שרואים.',
      qualityHebrew: 'מיזוג איכויות',
      ruleHebrew:
        'כמות הגשם, הקור, הרוחות או החום נקבעת לפי כוח/חולשה ומיזוג הצורות.',
    },
  ],

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'גשם ומזג אוויר',
    relatedModules: [
      'עולה השנה / יוקר וזול',
      'כוכבים ומזלות',
      'יסודות',
      'בתים מימיים',
      'עד ומייצג',
      'מדינות ואקלימים',
    ],
    displayPolicyHebrew:
      'להציג כמודול ידע מקצועי בתוך האפליקציה. אין לדון מזג אוויר בלי זמן, מקום, טבע הארץ וכוח הצורות.',
  },
};

export function getHawiRainWeatherForecast() {
  return HAWI_RAIN_WEATHER_FORECAST;
}

export default { HAWI_RAIN_WEATHER_FORECAST };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_RAIN_WEATHER_FORECAST };
}
