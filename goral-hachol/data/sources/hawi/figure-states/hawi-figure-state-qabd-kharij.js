export const HAWI_FIGURE_STATE_QABD_KHARIJ = {
  id: 'hawi-figure-state-qabd-kharij',
  figureId: 'hawi-figure-qabd-kharij',
  shortFigureId: 'qabd-kharij',
  arabicName: 'القبض الخارج',
  hebrewName: 'ממון יוצא',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourceSectionArabic: 'الباب الثامن عشر في الكلام على الاشكال — الفصل الاول في حالات الاشكال في البيوت وافعالها',
  sourceSectionHebrew: 'שער מצבי הצורות בבתים — מצב ממון יוצא בשישה־עשר הבתים',
  sourcePages: ['PDF document 45.pdf'],
  sourceType: 'full-book-page-index',
  extractionStatus: 'source-mapped-needs-photo-review',

  noteHebrew:
    'זה אינו פירוש מעבר הצורה הרגיל, אלא שכבת מצב הצורה בבית: נاطق/صامت, سعد/نحس, חזק/חלש, מתקן/מקלקל. החומר נלקח ממיפוי PDF 45 ודורש בדיקת מקור/צילום לפני הפעלה מלאה במנוע.',

  states: [
    {
      house: 1,
      arabicText: ['في الأول ناطق قوي سعيد الخروج'],
      hebrewTranslation: ['בבית הראשון: מדבר, חזק, וטוב ליציאה.'],
      speakingState: 'speaking',
      fortuneState: 'benefic-strong',
      effectHebrew: 'טוב ליציאה, תנועה והוצאה לפועל.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 2,
      arabicText: ['وفي الثاني صامت نحس يتلف الأموال'],
      hebrewTranslation: ['בבית השני: שותק, נחס, ומשחית ממון.'],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'פגיעה בממון והשחתת כספים.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 3,
      arabicText: ['وفي الثالث ناطق ضعيف شديد العواقب'],
      hebrewTranslation: ['בבית השלישי: מדבר, חלש, ואחריתו קשה.'],
      speakingState: 'speaking',
      fortuneState: 'weak-hard-outcome',
      effectHebrew: 'חולשה בתנועה/תקשורת ואחרית קשה.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 4,
      arabicText: ['وفي الرابع نحس صامت فرحه غير ثابت'],
      hebrewTranslation: ['בבית הרביעי: נחס שותק; שמחתו אינה יציבה.'],
      speakingState: 'silent',
      fortuneState: 'malefic-unstable',
      effectHebrew: 'שמחה או הקלה שאינה מחזיקה מעמד.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 5,
      arabicText: ['وفي الخامس ناطق خايف سعيد'],
      hebrewTranslation: ['בבית החמישי: מדבר, מפחד, אך טוב.'],
      speakingState: 'speaking',
      fortuneState: 'benefic-with-fear',
      effectHebrew: 'טוב שיש בו פחד או חשש.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 6,
      arabicText: ['وفي السادس صامت رديء'],
      hebrewTranslation: ['בבית השישי: שותק ורע.'],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'רע בענייני חולי, שירות, עמל וקושי.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 7,
      arabicText: ['وفي السابع ناطق يصلح النساء ويطيب قلوبهم'],
      hebrewTranslation: ['בבית השביעי: מדבר, מתקן את הנשים ומיטיב את ליבן.'],
      speakingState: 'speaking',
      fortuneState: 'benefic',
      effectHebrew: 'תיקון בענייני נשים/זוגיות והטבת הלב.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 8,
      arabicText: ['وفي الثامن صامت يقوي الخوف ويكثر الشدة'],
      hebrewTranslation: ['בבית השמיני: שותק, מחזק פחד ומרבה קושי.'],
      speakingState: 'silent',
      fortuneState: 'fear-hardship',
      effectHebrew: 'חיזוק פחד וריבוי קושי.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 9,
      arabicText: ['وفي التاسع ناطق سعيد للسفر ويعطي المكسب'],
      hebrewTranslation: ['בבית התשיעי: מדבר, טוב לנסיעה, ונותן רווח.'],
      speakingState: 'speaking',
      fortuneState: 'benefic',
      effectHebrew: 'טוב לנסיעה ומביא רווח.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 10,
      arabicText: ['وفي العاشر نحس صامت لا يكسب وأفعاله ردية'],
      hebrewTranslation: ['בבית העשירי: נחס שותק, אינו מרוויח, ופעולותיו רעות.'],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'חוסר רווח וקלקול בפעולות של מעמד/שלטון/פרנסה.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 11,
      arabicText: ['وفي الحادي عشر ناطق نحس يفرق بين الأصدقاء ويكثر العداوة'],
      hebrewTranslation: ['בבית האחד־עשר: מדבר, נחס, מפריד בין חברים ומרבה איבה.'],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'פירוד בין חברים וריבוי איבה.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 12,
      arabicText: ['وفي الثاني عشر صامت يفسد حال الدواب ويكثر العداء ويعكسهم'],
      hebrewTranslation: ['בבית השנים־עשר: שותק, מקלקל מצב בהמות/חיות, מרבה אויבים והופך אותם.'],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'קלקול בענייני בהמות/רכוש חי, ריבוי אויבים והיפוך מצבם.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 13,
      arabicText: ['وفي الثالث عشر ناطق نحس مدبر'],
      hebrewTranslation: ['בבית השלושה־עשר: מדבר, נחס, ומסדר/מנהל.'],
      speakingState: 'speaking',
      fortuneState: 'malefic',
      effectHebrew: 'ניהול/סידור עם איכות נחסית.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 14,
      arabicText: ['وفي الرابع عشر صامت ذو قوة وسعد'],
      hebrewTranslation: ['בבית הארבעה־עשר: שותק, בעל כוח וטוב.'],
      speakingState: 'silent',
      fortuneState: 'benefic-strong',
      effectHebrew: 'כוח וטוב פנימי/שקט.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 15,
      arabicText: ['وفي الخامس عشر ناطق قوي يصلح ويفسد'],
      hebrewTranslation: ['בבית החמישה־עשר: מדבר, חזק, מתקן ומקלקל.'],
      speakingState: 'speaking',
      fortuneState: 'mixed-strong',
      effectHebrew: 'כוח גדול שיש בו גם תיקון וגם קלקול.',
      sourceStatus: 'sourceMapped'
    },
    {
      house: 16,
      arabicText: ['وفي السادس عشر صامت نحس مدبر جميع ما يصلح يفسده'],
      hebrewTranslation: ['בבית השישה־עשר: שותק, נחס, ומקלקל כל דבר שהיה מתוקן.'],
      speakingState: 'silent',
      fortuneState: 'malefic',
      effectHebrew: 'קלקול של כל דבר מתוקן.',
      sourceStatus: 'sourceMapped'
    }
  ],

  summary: {
    housesLength: 16,
    explicitCoverage: '16/16',
    notExplicit: [],
    sourcePages: ['PDF document 45.pdf'],
    status: 'initial-source-mapped'
  }
};

export function getHawiFigureStateQabdKharijHouse(house) {
  const houseNumber = Number(house);

  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 16) {
    return null;
  }

  return HAWI_FIGURE_STATE_QABD_KHARIJ.states.find((state) => state.house === houseNumber) || null;
}

export default { HAWI_FIGURE_STATE_QABD_KHARIJ };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_STATE_QABD_KHARIJ };
}
