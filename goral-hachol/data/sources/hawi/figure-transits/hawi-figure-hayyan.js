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
 * Primary source pages (Hawi):
 * PDF document 17.pdf — houses 1–8
 * PDF document 18.pdf — houses 9–16
 *
 * Secondary source (supplementary, non-conflicting additions only):
 * بلوغ الأمل في علم الرمل — houses 1–14 and 16 found; house 15 also missing there.
 * Data marked with supplementarySource blocks. Hawi always takes precedence.
 */

export const HAWI_FIGURE_HAYYAN = {
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
        'יש לשמור את הקריאה כצורה חיובית מאוד כשהיא עומדת בבית הראשון.',
        '[בלוג' האמל] מוסיף: מצב השואל טוב, והדבר המבוקש קל להשגה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على حسن حال السائل والحاجة التي تطلب ميسرة',
        meaningHebrew: 'מורה על מצב טוב של השואל והעניין המבוקש — הוא קל להשגה.',
        conflictsWithHawi: false,
      },
      topics: ['general-good', 'happiness', 'opening-state', 'easy-attainment']
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
        'חיזוק של ניהול נכון, שיקול דעת ותכנון טוב במה שהשואל מקווה לו.',
        '[בלוג' האמל] מוסיף: בית הממון נמצא במצב טוב; הכנסות ומסחר בעלייה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على حسن بيت المال وزيادة المكاسب والتجارة',
        meaningHebrew: 'מורה על בית הממון הטוב, ריבוי הכנסות ומסחר.',
        conflictsWithHawi: false,
      },
      topics: ['money', 'lawful-income', 'planning', 'livelihood', 'trade', 'commerce']
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
        'מתאים לשאלות על לימוד, ידע, אחים/קרובים ותנועה קרובה כאשר בית 3 פעיל.',
        '[בלוג' האמל] מוסיף: ריבוי חברים לשואל, ותועלת רבה אף ממי שנחשב מתנגד.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على كثرة الأصدقاء للسائل وكثرة النفع من معادي',
        meaningHebrew: 'מורה על ריבוי חברים לשואל, ותועלת רבה אף ממתנגדים.',
        conflictsWithHawi: false,
      },
      topics: ['metals', 'gold', 'silver', 'iron', 'learning', 'education', 'friends', 'benefit-from-enemies']
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
        'הקריאה נשמרת בזהירות סביב בית, שורשים, קרקע ורכוש.',
        '[בלוג' האמל] מוסיף: ירושות ונכסים הנכנסים לשואל, וכבוד.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على الإرث والأملاك الذي تدخل للسائل والعز',
        meaningHebrew: 'מורה על ירושות ונכסים הנכנסים לשואל, וכבוד.',
        conflictsWithHawi: false,
      },
      topics: ['land', 'property', 'estates', 'roots', 'inheritance', 'honor'],
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
        'הקובץ הישן הזכיר שאין כאן חליצה/הסרה; לפי המיפוי הנוכחי יש לשמור את לשון לבישת الخلع ולא לפרש מסברה.',
        '[בלוג' האמל] מוסיף: שמחות הבאות ברצף, חדשות, וההשגה חוזרת עם שמחה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على الأفراح المتواردة والأخبار والإكتساب يعود مرحة',
        meaningHebrew: 'מורה על שמחות הבאות ברצף, חדשות טובות, וההשגה חוזרת עם שמחה.',
        conflictsWithHawi: false,
      },
      topics: ['children', 'gifts', 'messengers', 'honor-clothing', 'joy', 'news', 'acquisition']
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
        'בית זה חשוב לשאלות חולי, עבדים/עובדים, מקנה ורכוש חי.',
        '[בלוג' האמל] מוסיף: מצב המשרת/עוזר טוב, ועניין שאבד — ייתכן שיימצא.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على حسن الخادم والمستخدم والذي فقد',
        meaningHebrew: 'מורה על מצב טוב של המשרת/עוזר, ועל הדבר שאבד.',
        conflictsWithHawi: false,
      },
      topics: ['illness', 'recovery', 'servants', 'livestock', 'animals', 'joy', 'lost-items'],
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
        'בית חשוב לשאלות זוגיות, שותפות, דין ודברים ואויב גלוי.',
        '[בלוג' האמל — שוני דגש] מציין: השואל מלא דאגות מממון ונפש, אך בסוף יצליח. חאוי עדיף — ניצחון ונישואין הם העיקר.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على أن الطالب كثير الهم والكدر من مال ونفس وسيتحصل',
        meaningHebrew: 'מורה שהשואל מלא דאגות מממון ונפש, אך בסוף יצליח.',
        conflictsWithHawi: true,
        note: 'חאוי מדגיש ניצחון ונישואין (חיובי). בלוג' האמל מדגיש דאגות שמובילות להצלחה (מעורב). חאוי גובר — אל תחליף; השתמש כהשלמה בלבד.',
      },
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
        'אין לצמצם את בית 8 רק למוות; כאן המקור נותן תועלת של ירושה ואפשרות של אחריות רחבה.',
        '[בלוג' האמל] מוסיף: השואל שואף לכבוד ורוצה דבר קשה — ישיגנו.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على أن الطالب يتأمل بالعز ويروم شيئاً عسراً ويناله',
        meaningHebrew: 'מורה שהשואל שואף לכבוד ורוצה דבר קשה אך ישיגנו.',
        conflictsWithHawi: false,
      },
      topics: ['inheritance', 'authority', 'wide-affairs', 'house-8', 'aspiration', 'difficult-achievement'],
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
        'تمكين וג׳אה — התבססות, כוח ומעמד.',
        '[בלוג' האמל] מוסיף: הנסיעות מוצלחות; היעדרויות מתרחשות; הנפש תגיע למבוקשה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على الأسفار الموافقة والغياب الواردة والنفس المتحصلة',
        meaningHebrew: 'מורה על נסיעות מוצלחות, היעדרויות שיחולו, ונפש/עניין שיושג.',
        conflictsWithHawi: false,
      },
      topics: ['long-travel', 'foreign-lands', 'religion', 'worship', 'dreams', 'status', 'successful-journey']
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
        'בית 10 מחבר כאן מעמד/שלטון עם עניין רגשי או מפגש חשוב.',
        '[בלוג' האמל — שוני דגש] מציין: עגמת נפש לשואל וחוסר מסייעים, אך יגיע לתקוותיו. חאוי עדיף — מפגש ושמחה הם העיקר.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على الكدر للسائل وعدم المعين وسيبلغ الآمال',
        meaningHebrew: 'מורה על עגמת נפש וחוסר עוזרים לשואל, אך יגיע למטרותיו.',
        conflictsWithHawi: true,
        note: 'חאוי מדגיש חיים ומפגש (חיובי). בלוג' האמל מדגיש קושי שמוביל להצלחה (מעורב). חאוי גובר.',
      },
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
        'קשר עם בעלי מעמד.',
        '[בלוג' האמל] מוסיף: כבוד ורוממות, יציאה מצרה לשמחה, ונייה/כוונה טובה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على عز ورفعه وخروج من شدة إلى فرح ونية صالحة',
        meaningHebrew: 'מורה על כבוד ורוממות, יציאה מצרה לשמחה, ונייה טובה.',
        conflictsWithHawi: false,
      },
      topics: ['friends', 'joy', 'important-people', 'connections', 'honor', 'rise-from-hardship']
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
        'אין להשלים מסברה מעבר למה שנמצא במיפוי.',
        '[בלוג' האמל — שוני דגש] מציין: קלקול ושקר, אך הסוף הוא השגה ושמחה. חאוי עדיף — תועלת הוא העיקר.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'يدل على الفساد والكذب والنهاية إلى البلوغ والفرح',
        meaningHebrew: 'מורה על קלקול ושקר, אך הסוף הוא השגה ושמחה.',
        conflictsWithHawi: true,
        note: 'חאוי: תועלת בבית 12 (חיובי). בלוג' האמל: מתחיל בקלקול ומסיים בשמחה (מעורב שונה). חאוי גובר.',
      },
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
        'מתאים לשאלות על עזרה מגורמי שלטון, בעלי תפקיד או מנהיגות.',
        '[בלוג' האמל] מוסיף: דרך פתוחה, שמחה מתמדת, כוונות טובות, מזל טוב והצלחה.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'طريق مفتوح وفرح دائم ومقاصد حسنة وسعد وإقبال',
        meaningHebrew: 'דרך פתוחה, שמחה מתמדת, כוונות טובות, מזל טוב והצלחה.',
        conflictsWithHawi: false,
      },
      topics: ['authority', 'sultan', 'minister', 'benefit', 'open-path', 'joy', 'good-fortune']
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
        'זה כלל מבני חשוב למנוע ולא רק פירוש בית מקומי.',
        '[בלוג' האמל] מוסיף: קבלת ממון, פנימיות/כוונה טובה ונקייה, עניין שיושלם, ומדרגות/הישגים שיושגו.'
      ],
      rules: [
        {
          id: 'hayyan-does-not-enter-mizan',
          arabicText: 'وليس يدخل في الميزان لنة من الشكال المفردة',
          hebrew: 'אינה נכנסת במאזן מפני שהיא מן הצורות היחידות.',
          ruleType: 'engine-structural-note'
        }
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'قبض مال وسريرة صالحة وأمر يتمه ومراتب تتحصل',
        meaningHebrew: 'קבלת ממון, פנימיות טובה/כוונה נקייה, עניין שיושלם, ומדרגות שיושגו.',
        conflictsWithHawi: false,
      },
      topics: ['completion', 'happiness', 'long-life', 'honor', 'mizan', 'structural-rule', 'money', 'achievement'],
      specialRules: ['כלל מנוע חשוב: נשוא ראש אינו נכנס במאזן מפני שהוא מן הצורות היחידות.'],
    },
    {
      house: 15,
      sourcePages: ['PDF document 18.pdf'],
      sourceStatus: 'not-explicit-in-source',
      sourceArabic: [],
      meaning:
        'המקור אינו מביא דין מפורש לבית זה. אין להשלים מסברה.',
      detailsHebrew: [
        'בית 15 לא מופיע בחאוי עבור נשוא ראש.',
        'בית 15 גם נעדר מבלוג' האמל — המקור קופץ מ-14 ל-16 ישירות.',
        'אין להשלים מתוך היגיון או מתוך בית אחר.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: null,
        meaningHebrew: null,
        conflictsWithHawi: false,
        note: 'בית 15 גם חסר בבלוג' האמל — מאשר שמדובר בפער מקורי ולא בטעות הקלדה.',
      },
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
        'לכן בית 16 אינו רק טוב או רק רע; יש בו סיום/התפנות או פריסה, אך השגה מועטה.',
        '[בלוג' האמל] מוסיף: תוצאות מגיעות לאחר קושי בעניינים הקשים, ובמהירות יחסית.'
      ],
      supplementarySource: {
        sourceBook: 'بلوغ الأمل في علم الرمل',
        sourceArabic: 'عواقب بعد عسر في الحوائج العسرة وسرعة',
        meaningHebrew: 'תוצאות מגיעות לאחר קושי בעניינים הקשים, ובמהירות.',
        conflictsWithHawi: false,
      },
      topics: ['ending', 'completion', 'low-attainment', 'house-16', 'results-after-difficulty'],
      specialRules: ['סיום/פרוג של כל דבר יחד עם מיעוט השגה או קושי להשיג.'],
    }
  ],

  coverage: '16/16',
  housesListed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  notExplicitInSource: [15],

  expansionSummary: {
    sourcePages: ['PDF document 17.pdf', 'PDF document 18.pdf'],
    expandedFrom: 'full-book-mapping-pages-17-18',
    status: 'source-expanded-with-secondary',
    importantRules: ['hayyan-does-not-enter-mizan'],
    unclearNeedsPhotoReview: [
      { house: 4, term: 'الوبا' },
      { house: 12, term: 'الرؤية' }
    ],
    secondarySourceEnrichment: {
      sourceBook: 'بلوغ الأمل في علم الرمل',
      housesEnriched: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
      housesConfirmingSourceGap: [15],
      housesWithTonalConflict: [7, 10, 12],
      policy: 'Hawi always takes precedence. Secondary data stored in supplementarySource blocks. Conflicting entries flagged with conflictsWithHawi: true.',
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_HAYYAN };
}
