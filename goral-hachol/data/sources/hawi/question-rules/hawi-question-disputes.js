/**
 * Source-exact extraction:
 * حاوي العجائب ومظهر الغرائب
 *
 * Section:
 * الباب الثامن في الخصومات
 * + فصل في الغالب والمغلوب
 *
 * Purpose:
 * דיני סכסוכים, יריבים, בעלי דין, מנצח ומפסיד לפי לשון המקור.
 *
 * Rules:
 * - Source first only.
 * - No inferred engine logic.
 * - No added interpretation beyond the source.
 * - Zenati comparison is marked separately.
 * - Later we may add displayHebrew for app-friendly wording.
 */

export const HAWI_QUESTION_DISPUTES = {
  id: "hawi-question-disputes",
  sourceBook: "حاوي العجائب ومظهر الغرائب",
  sourceAuthor: "أحمد ابن زنبل المحلي",
  sourceSectionArabic: "الباب الثامن في الخصومات",
  sourceSectionHebrew: "שער הסכסוכים / יריבים / בעלי דין",
  extractionStatus: "sourceExact-complete",
  rules: [
    {
      id: "disputes-basic-house-division",
      order: 1,
      arabicText: [
        "اذا سالت عن متخاصمين وما يجري بينهم",
        "فاجعل الول والثاني للسائل ولمالة",
        "والسابع للخصم",
        "والثامن لبيت مال",
        "والعاشر للحاكم",
        "واشكال الشمس للسلطان",
        "واشكال المشتري للقاضي",
        "والراس والذنب للوالي"
      ],
      hebrewTranslation: [
        "אם נשאלת על שני בעלי סכסוך ומה יקרה ביניהם — עשה את הראשון והשני לשואל ולממונו.",
        "את השביעי ליריב; את השמיני לבית ממונו; ואת העשירי לשופט/בעל הסמכות.",
        "צורות השמש הן לסולטאן/שלטון; צורות צדק/المشتري הן לדיין; והראש והזנב הם לוואלי/ממונה."
      ],
      houses: [1, 2, 7, 8, 10],
      figures: [],
      technicalTerms: [
        "متخاصمين",
        "السائل",
        "ماله",
        "الخصم",
        "الحاكم",
        "اشكال الشمس",
        "السلطان",
        "اشكال المشتري",
        "القاضي",
        "الراس والذنب",
        "الوالي"
      ],
      rule: "בשאלת סכסוך: בית 1 לשואל, בית 2 לממון השואל, בית 7 ליריב, בית 8 לממון היריב, בית 10 לשופט/בעל סמכות. צורות שמש לשלטון, צדק לדיין, ראש וזנב לוואלי.",
      status: "sourceExact"
    },

    {
      id: "disputes-houses-13-14-15",
      order: 2,
      arabicText: [
        "واجعا الثالث عشر بمنزلة الول",
        "والرابع عشر بمنزلة السابع",
        "والخامس عشر عاقبة المر بين الخصمين",
        "ومهما حل فية من الشكال احكم بة بينهما"
      ],
      hebrewTranslation: [
        "עשה את הבית השלושה־עשר במעמד הראשון, ואת הארבעה־עשר במעמד השביעי.",
        "ואת החמישה־עשר אחרית העניין בין שני היריבים; וכל צורה שחלה בו — פסוק לפיה ביניהם."
      ],
      houses: [13, 14, 15],
      figures: [],
      technicalTerms: [
        "الثالث عشر بمنزلة الول",
        "الرابع عشر بمنزلة السابع",
        "الخامس عشر",
        "عاقبة المر",
        "الخصمين"
      ],
      rule: "בית 13 כמעמד בית 1; בית 14 כמעמד בית 7; בית 15 כאחרית העניין בין היריבים.",
      status: "sourceExact"
    },

    {
      id: "disputes-house1-good-querent-prevails",
      order: 3,
      arabicText: [
        "ثم انظر الطالع وما حل فية من الشكال",
        "فان وجدت في الول سعدا واشترك بة سعد",
        "فان السائل غالب"
      ],
      hebrewTranslation: [
        "אחר כך הסתכל בטאלע ובמה שחלה בו מן הצורות.",
        "אם מצאת בראשון צורה טובה, וטוב השתתף עמה — השואל גובר."
      ],
      houses: [1],
      figures: [],
      technicalTerms: [
        "الطالع",
        "الاول",
        "سعد",
        "اشترك",
        "السائل غالب"
      ],
      rule: "בית 1 טוב ובו השתתפות של סעד — השואל גובר.",
      status: "sourceExact"
    },

    {
      id: "disputes-ascendant-tends-to-sun-authority",
      order: 4,
      arabicText: [
        "فان مال الطالع او الشكل الذي حل فية الى اشكال الشمس",
        "فانة يطلب ان يشتكي من السلطان"
      ],
      hebrewTranslation: [
        "אם הטאלע, או הצורה שחלה בו, נוטה אל צורות השמש — הוא מבקש להתלונן/לתבוע אצל הסולטאן/השלטון."
      ],
      houses: [1],
      figures: [],
      technicalTerms: [
        "مال الطالع",
        "اشكال الشمس",
        "يشتكي",
        "السلطان"
      ],
      rule: "נטיית הטאלע או צורתו אל צורות השמש — פנייה לשלטון/סמכות עליונה.",
      status: "sourceExact"
    },

    {
      id: "disputes-ascendant-tends-to-jupiter-judge",
      order: 5,
      arabicText: [
        "فان مال الى اشكال المشتري او الى بيت",
        "فانة يريد الشكية من عند القاضي"
      ],
      hebrewTranslation: [
        "אם הוא נוטה אל צורות צדק/المشتري או אל ביתו — הרי שהוא רוצה את התלונה/התביעה אצל הדיין."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "اشكال المشتري",
        "بيت المشتري",
        "الشكية",
        "القاضي"
      ],
      rule: "נטייה לצורות צדק או לבית צדק — פנייה לדיין/בית דין.",
      status: "sourceExact"
    },

    {
      id: "disputes-ascendant-tends-to-house6-wali",
      order: 6,
      arabicText: [
        "وان مال الى السادس",
        "فانة يريد الشكية من عند الوالي"
      ],
      hebrewTranslation: [
        "ואם הוא נוטה אל השישי — הוא רוצה את התלונה/התביעה אצל הוואלי/הממונה."
      ],
      houses: [6],
      figures: [],
      technicalTerms: [
        "السادس",
        "الشكية",
        "الوالي"
      ],
      rule: "נטייה לבית 6 — פנייה לוואלי/ממונה.",
      status: "sourceExact"
    },

    {
      id: "disputes-same-judgment-for-opponent",
      order: 7,
      arabicText: [
        "وكذلك حكمك على الخصم"
      ],
      hebrewTranslation: [
        "וכן תדון על היריב."
      ],
      houses: [7],
      figures: [],
      technicalTerms: [
        "الخصم"
      ],
      rule: "את אותם דיני נטייה ופנייה לסמכות יש לבדוק גם על צד היריב.",
      status: "sourceExact"
    },

    {
      id: "disputes-definition-of-mayl",
      order: 8,
      arabicText: [
        "واعلم",
        "ان الميل ما يميل الشكل الى الشكل او البيت الى البيت",
        "اما الطبع واما بالدور واما بالجنس"
      ],
      hebrewTranslation: [
        "ודע: הנטייה היא כאשר הצורה נוטה אל צורה, או בית אל בית — או מצד הטבע, או מצד הסיבוב/המחזור, או מצד הסוג/מין."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "الميل",
        "الشكل الى الشكل",
        "البيت الى البيت",
        "الطبع",
        "الدور",
        "الجنس"
      ],
      rule: "נטייה נבדקת בין צורה לצורה או בית לבית, לפי טבע, סיבוב/מחזור או סוג/מין.",
      status: "sourceExact"
    },

    {
      id: "disputes-reconciliation-house1-house9",
      order: 9,
      arabicText: [
        "ثم انظر الى الول والتاسع",
        "فان اتصل من تثليث او تربيع او مقابلة",
        "فان اتصل من تثليث او تربيع اصطلحا قبل المنازعة",
        "فان لم يتصل من التربيع فلم يصطلحا ال بعد المنازعة والقوف على الحكم",
        "فان كان التصال من مقابلة فليس بينهما صلح"
      ],
      hebrewTranslation: [
        "אחר כך הסתכל אל הראשון והתשיעי.",
        "אם יש ביניהם חיבור מצד שליש, ריבוע או ניגוד: אם החיבור הוא משליש או מריבוע — הם משלימים לפני המחלוקת.",
        "ואם אינו מתחבר מן הריבוע — הם אינם משלימים אלא אחרי המחלוקת והעמידה על הדין.",
        "ואם החיבור הוא מניגוד — אין ביניהם שלום."
      ],
      houses: [1, 9],
      figures: [],
      technicalTerms: [
        "الاول",
        "التاسع",
        "تثليث",
        "تربيع",
        "مقابلة",
        "اصطلحا",
        "المنازعة",
        "الحكم",
        "صلح"
      ],
      rule: "בבדיקת שלום/פשרה בסכסוך בודקים בית 1 מול בית 9: שליש או ריבוע — פשרה לפני המחלוקת; בלי חיבור מתאים — פשרה רק אחרי מחלוקת ודין; ניגוד — אין שלום.",
      status: "sourceExact"
    },

    {
      id: "ghalib-maghlub-check-house1-house7",
      order: 10,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "اذا اردت ان تعلم الغالب من المغلوب",
        "فانظر الشكل الاول والسابع",
        "فايهما كان سعد داخل قويا في ذاته وله قوة في ذلك البيت",
        "ونظرت منه اشكال سعيدة",
        "فهو الغالب"
      ],
      hebrewTranslation: [
        "אם רצית לדעת מי המנצח ומי המפסיד — הסתכל בצורה הראשונה ובשביעית.",
        "מי מהם שהוא סעד, נכנס, חזק בעצמו, ויש לו כוח באותו בית, וצורות טובות מביטות ממנו — הוא הגובר."
      ],
      houses: [1, 7],
      figures: [],
      technicalTerms: [
        "الغالب",
        "المغلوب",
        "الشكل الاول",
        "السابع",
        "سعد داخل",
        "قويا في ذاته",
        "قوة في ذلك البيت",
        "اشكال سعيدة"
      ],
      rule: "בין בית 1 לבית 7, הצד שיש לו צורה טובה, נכנסת, חזקה בעצמה, בעלת כוח בבית ומבט צורות טובות — הוא הגובר.",
      status: "sourceExact"
    },

    {
      id: "ghalib-maghlub-house10-judge-inclination",
      order: 11,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "ثم انظر الى العاشر",
        "فكل من نظر له كان ميل الحاكم له"
      ],
      hebrewTranslation: [
        "אחר כך הסתכל אל הבית העשירי: כל מי שהוא מביט אליו — נטיית השופט/בעל הסמכות אליו."
      ],
      houses: [10],
      figures: [],
      technicalTerms: [
        "العاشر",
        "ميل الحاكم"
      ],
      rule: "בית 10 מראה לאיזה צד נוטה החاكم/השופט.",
      status: "sourceExact"
    },

    {
      id: "ghalib-maghlub-house10-fixed-form-right-established",
      order: 12,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "فان كان شكل العاشر شكل ثابتا ثبت لهم حقهم"
      ],
      hebrewTranslation: [
        "אם צורת הבית העשירי היא צורה קבועה — זכותם/דינם יתקבע להם."
      ],
      houses: [10],
      figures: [],
      technicalTerms: [
        "شكل العاشر",
        "شكل ثابتا",
        "ثبت لهم حقهم"
      ],
      rule: "צורה קבועה בבית 10 — קביעות הדין/הזכות.",
      status: "sourceExact"
    },

    {
      id: "ghalib-maghlub-house10-two-bodied-no-fixed-right",
      order: 13,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "وان كان ذا جسدين لم يثبت لهم شئ"
      ],
      hebrewTranslation: [
        "ואם היא בעלת שני גופים — לא יתקבע להם דבר."
      ],
      houses: [10],
      figures: [],
      technicalTerms: [
        "ذا جسدين",
        "لم يثبت لهم شئ"
      ],
      rule: "צורה בעלת שני גופים בבית 10 — אין קביעות בדין.",
      status: "sourceExact"
    },

    {
      id: "ghalib-maghlub-author-method-note",
      order: 14,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "وهذه الاحكام قولي مما انتخبته من علمي",
        "واما ما كتب المتقدمين فلم نجد فيها شيئا من ذلك"
      ],
      hebrewTranslation: [
        "ודינים אלו הם דבריי, ממה שבחרתי מתוך ידיעתי; ואילו במה שכתבו הקדמונים לא מצאנו דבר כזה."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "هذه الاحكام قولي",
        "انتخبته من علمي",
        "المتقدمين"
      ],
      rule: "המחבר מציין שדיני המנצח והמפסיד כאן הם בחירה/שיטה שלו, ולא דבר שמצא כתוב אצל הקדמונים.",
      status: "authorMethod"
    },

    {
      id: "ghalib-maghlub-zenati-comparison",
      order: 15,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "واما قول الشيخ محمد الزناتي رحمه الله تعالى",
        "قال اذا سالت عن متخاصمين",
        "فاجعل ناحية اليمين للسائل",
        "وناحية الشمال للمسؤل عنه",
        "ثم انظر الى العددين فايهما زاد فانه هو الغالب"
      ],
      hebrewTranslation: [
        "ואשר לדברי השייח׳ מוחמד הזנאטי: אם שאלת על שני בעלי סכסוך — עשה את צד ימין לשואל, ואת צד שמאל לנשאל עליו.",
        "אחר כך הסתכל בשני המספרים; מי מהם שגדל — הוא הגובר."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "محمد الزناتي",
        "ناحية اليمين",
        "ناحية الشمال",
        "العددين",
        "الغالب"
      ],
      rule: "שיטת זנאטי מובאת כאן כהשוואה: צד ימין לשואל, צד שמאל לנשאל, ומי שמספרו גדול הוא הגובר.",
      status: "quotedZenatiComparison"
    },

    {
      id: "ghalib-maghlub-author-prefers-own-method",
      order: 16,
      sourceSubsectionArabic: "فصل في الغالب والمغلوب",
      sourceSubsectionHebrew: "פרק המנצח והמפסיד",
      arabicText: [
        "فان هذه النكتة ربما اصابت مرة واخطت مرة اخرى",
        "واما التي وضعناها فهي احكام لا يخل نظامها ولا يخرم كلامها"
      ],
      hebrewTranslation: [
        "כי נוקדה זו לפעמים פוגעת ופעם אחרת טועה; ואילו זו שהנחנו — הם דינים שסדרם אינו מתקלקל ודבריהם אינם נפרצים."
      ],
      houses: [],
      figures: [],
      technicalTerms: [
        "ربما اصابت",
        "اخطت",
        "التي وضعناها",
        "لا يخل نظامها",
        "لا يخرم كلامها"
      ],
      rule: "המחבר אומר ששיטת זנאטי עשויה לפגוע לפעמים ולטעות לפעמים, ואילו שיטתו שלו חזקה וסדורה יותר.",
      status: "sourceExactAuthorPreference"
    }
  ],
  summary: {
    mainDisputeHouses: [1, 2, 7, 8, 10, 13, 14, 15],
    additionalHouses: [6, 9],
    authoritySigns: [
      "اشكال الشمس",
      "اشكال المشتري",
      "الرأس والذنب"
    ],
    mainTechnicalLayers: [
      "سعد",
      "اشتراك",
      "ميل",
      "طبع",
      "دور",
      "جنس",
      "تثليث",
      "تربيع",
      "مقابلة",
      "شكل ثابت",
      "ذا جسدين"
    ],
    zenatiStatus: "quotedComparisonOnly",
    status: "complete"
  }
};

if (typeof module !== "undefined") {
  module.exports = { HAWI_QUESTION_DISPUTES };
}
