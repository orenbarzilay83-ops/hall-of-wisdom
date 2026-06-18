export const HAWI_FIGURE_STATE_QABD_DAKHIL = {
  id: 'hawi-figure-state-qabd-dakhil',
  figureId: 'hawi-figure-qabd-dakhil',
  shortFigureId: 'qabd-dakhil',
  arabicName: 'القبض الداخل',
  hebrewName: 'ממון נכנס',
  genderHebrew: 'נקבה',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'الباب الثامن عشر في الكلام على الاشكال — الفصل الاول في حالات الاشكال في البيوت وافعالها',
  sourceSectionHebrew: 'שער מצבי הצורות בבתים — מצב הקבץ הפנימי בשישה־עשר הבתים',
  sourcePages: ['PDF document 45.pdf'],
  sourceType: 'full-book-page-index',
  extractionStatus: 'source-audited-from-drive-pdf-45-51',

  noteHebrew:
    'זה אינו פירוש מעבר הצורה הרגיל, אלא שכבה נוספת: מצב הצורה בבית — מדבר/שותק, סעד/נחס, חזק/חלש, מתקן/מקלקל. החומר נלקח ממיפוי PDF 45 ודורש בדיקת מקור/צילום לפני הפעלה מלאה במנוע.',

  states: [
    {
      house: 1,
      arabicText: ['في الأول صامت قولي قوي يصلح لجميع الأمور'],
      hebrewTranslation: [
        'בבית הראשון: שותק, חזק, ומתקן/מתאים לכל העניינים.'
      ],
      speakingState: 'silent',
      fortuneState: 'strong',
      effectHebrew: 'מתקן ומתאים לכל העניינים.',
      sourceStatus: 'sourceMapped',
      reviewClosed: 'המילה "קולי" (قولي) אולי שיבוש ביקורת קודמת ונסגר בביקורת קודמת.'
    },
    {
      house: 2,
      arabicText: ['وفي الثاني ناطق يكثر الأموال ويجلب الرزق وهو سعيد'],
      hebrewTranslation: [
        'בבית השני: מדבר, מרבה ממון ומביא פרנסה, והוא טוב.'
      ],
      speakingState: 'speaking',
      fortuneState: 'benefic',
      effectHebrew: 'מרבה ממון ומושך פרנסה.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 3,
      arabicText: ['وفي الثالث صامت رديء الفعل يعكس جميع الأمور', 'وإن شهد له البياض رفع وصلح'],
      hebrewTranslation: [
        'בבית השלישי: שותק, פעולתו רעה, והוא הופך את כל העניינים.',
        'ואם הביאד / הלובן מעיד לו — הוא מרים ומתקן.'
      ],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'היפוך וקלקול עניינים; עדות הביאד יכולה להרים ולתקן.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 4,
      arabicText: ['وفي الرابع ناطق نحس مدبر يخرج ويدخل'],
      hebrewTranslation: [
        'בבית הרביעי: מדבר, נחס, מתנהל/מסדר, יוצא ונכנס.'
      ],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'תנועה של יציאה וכניסה עם איכות נחסית.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 5,
      arabicText: ['وفي الخامس صامت نحس يذهب الملبوس ويتعب العواقب'],
      hebrewTranslation: [
        'בבית החמישי: שותק, נחס, מאבד לבוש ומעייף/מקשה את האחריות והסופים.'
      ],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'פגיעה בלבוש/כיסוי וקושי באחרית הדבר.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 6,
      arabicText: ['وفي السادس ناطق نحس يتعب العبيد ويفرق بينهم ويقوي المرض'],
      hebrewTranslation: [
        'בבית השישי: מדבר, נחס, מעייף את העבדים/המשרתים, מפריד ביניהם ומחזק את המחלה.'
      ],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'קושי למשרתים/עוזרים וחיזוק מחלה.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 7,
      arabicText: ['وفي السابع نحس صامت يفسد النساء والرجال وأموالهم'],
      hebrewTranslation: [
        'בבית השביעי: נחס שותק, מקלקל נשים, גברים ואת ממונם.'
      ],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'קלקול בענייני זוגיות/אנשים וממון.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 8,
      arabicText: ['وفي الثامن ناطق يقوي الخوف ويظهر كل مخفي'],
      hebrewTranslation: [
        'בבית השמיני: מדבר, מחזק פחד ומגלה כל דבר נסתר.'
      ],
      speakingState: 'speaking',
      fortuneState: 'fear-hidden',
      effectHebrew: 'חיזוק פחד וגילוי נסתרות.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 9,
      arabicText: ['وفي التاسع صامت قوي سعيد يصلح الشعر'],
      hebrewTranslation: [
        'בבית התשיעי: שותק, חזק, טוב, ומתקן את השירה/הדיבור הפיוטי.'
      ],
      speakingState: 'silent',
      fortuneState: 'benefic-strong',
      effectHebrew: 'טוב וחזק; מתקן ענייני שירה/ביטוי.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 10,
      arabicText: ['وفي العاشر ناطق سعيد سليم من كل عيب ويكثر المعاش'],
      hebrewTranslation: [
        'בבית העשירי: מדבר, טוב, שלם מכל פגם, ומרבה פרנסה/מחיה.'
      ],
      speakingState: 'speaking',
      fortuneState: 'benefic',
      effectHebrew: 'שלמות, פרנסה ומעמד טוב.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 11,
      arabicText: ['وفي الحادي عشر صامت نحس يفرق بين الأصدقاء والأصحاب'],
      hebrewTranslation: [
        'בבית האחד־עשר: שותק, נחס, ומפריד בין חברים ורעים.'
      ],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'פירוד בין חברים ותומכים.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 12,
      arabicText: ['وفي الثاني عشر نحس ناطق يكثر الأعداء ويتعب قلوبهم'],
      hebrewTranslation: [
        'בבית השנים־עשר: נחס מדבר, מרבה אויבים ומעייף את ליבם.'
      ],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'ריבוי אויבים ועייפות/מצוקה בלב.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 13,
      arabicText: ['وفي الثالث عشر صامت نحس مدبر كل شيء'],
      hebrewTranslation: [
        'בבית השלושה־עשר: שותק, נחס, ומסדר/מנהל כל דבר.'
      ],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'ניהול/סידור עם איכות נחסית.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 14,
      arabicText: [],
      hebrewTranslation: [
        'המקור במיפוי הנוכחי אינו מביא דין מפורש לבית 14 עבור ממון נכנס.'
      ],
      speakingState: null,
      fortuneState: null,
      effectHebrew: 'הסטטוס נשמר לפי ביקורת קודמת.',
      sourceStatus: 'source-audited-final-source-kept-as-mapped'
    },
    {
      house: 15,
      arabicText: [],
      hebrewTranslation: [
        'המקור במיפוי הנוכחי אינו מביא דין מפורש לבית 15 עבור ממון נכנס.'
      ],
      speakingState: null,
      fortuneState: null,
      effectHebrew: 'הסטטוס נשמר לפי ביקורת קודמת.',
      sourceStatus: 'source-audited-final-source-kept-as-mapped'
    },
    {
      house: 16,
      arabicText: ['وفي السادس عشر ناطق نحس يتلف جميع الأشياء'],
      hebrewTranslation: [
        'בבית השישה־עשר: מדבר, נחס, ומשחית את כל הדברים.'
      ],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'השחתה/קלקול של כלל הדברים.',
      sourceStatus: 'sourceMapped'
    }
  ],

  summary: {
    housesLength: 16,
    explicitCoverage: '14/16',
    notExplicit: [14, 15],
    sourcePages: ['PDF document 45.pdf'],
    status: 'source-audited-final'
  }
};

export function getHawiFigureStateQabdDakhilHouse(house) {
  const houseNumber = Number(house);

  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 16) {
    return null;
  }

  return HAWI_FIGURE_STATE_QABD_DAKHIL.states.find((state) => state.house === houseNumber) || null;
}

export default { HAWI_FIGURE_STATE_QABD_DAKHIL };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_STATE_QABD_DAKHIL };
}
