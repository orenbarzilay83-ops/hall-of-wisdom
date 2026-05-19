export const HAWI_FIGURE_TRANSITS_SOURCE_AUDIT = {
  id: 'hawi-figure-transits-source-audit',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceSectionArabic: 'ترحيل الأشكال الستة عشر في الستة عشر بيتا',
  sourceSectionHebrew: 'מעבר / תרחיל שש־עשרה הצורות בשישה־עשר הבתים',
  auditStatus: 'initial-full-book-mapping-audit',
  importantNoteHebrew:
    'שכבת figure-transits היא פירוש מעבר הצורה בבית. אין לערבב אותה עם שכבת figure-states, שהיא מצב הצורה בבית לפי ناطق/صامت/سعد/نحس.',
  sourcePagesChecked: [
    'PDF document 9.pdf',
    'PDF document 10.pdf',
    'PDF document 11.pdf',
    'PDF document 12.pdf',
    'PDF document 13.pdf',
    'PDF document 14.pdf',
    'PDF document 15.pdf',
    'PDF document 16.pdf',
    'PDF document 17.pdf',
    'PDF document 18.pdf',
    'PDF document 19.pdf',
    'PDF document 20.pdf',
    'PDF document 21.pdf',
    'PDF document 22.pdf',
    'PDF document 23.pdf',
    'PDF document 24.pdf'
  ],
  auditedFigures: [
    {
      figureId: 'hawi-figure-hayyan',
      shortFigureId: 'hayyan',
      hebrewName: 'נושא ראש',
      arabicName: 'الحيان / الأحيان',
      aliasesArabic: ['الضاحك القائم'],
      sourcePages: ['PDF document 17.pdf', 'PDF document 18.pdf'],
      figureTransitFile: 'hawi-figure-hayyan.js',
      status: 'source-present-needs-detail-expansion',
      sourceCoverageHebrew:
        'החיאן מתחיל ב־PDF 17 בבתים 1–8 וממשיך ב־PDF 18 בבתים 9–16.',
      missingOrNeedsExpansionHebrew:
        'יש לוודא שהקובץ כולל את כל פרטי המקור: טוב ושמחה, ממון מותר, לימוד, מתכות, קרקע, תועלת מילדים ומתנות ושליחים, יציאה ממחלה, נישואין טובים, ניצחון, ירושות, נסיעות רחוקות, דת, פקחות, חלום טוב, שלטון, חיבור עם אהוב, קשר עם גדולי אנשים, תועלת מעבדים/מים, תועלת מן הסולטן והשר, אורך חיים, כבוד, כלל שאינו נכנס במאזן מפני שהוא מהצורות היחידות, וקושי/מיעוט השגה בבית 16.'
    },
    {
      figureId: 'hawi-figure-naqi-khad',
      shortFigureId: 'naqi-khad',
      hebrewName: 'בר הלחי',
      arabicName: 'نقي الخد / الأشقر',
      aliasesArabic: ['نقي الخد'],
      sourcePages: ['PDF document 18.pdf', 'PDF document 19.pdf'],
      figureTransitFile: 'hawi-figure-naqi-khad.js',
      status: 'source-present-needs-detail-expansion',
      sourceCoverageHebrew:
        'בר הלחי מתחיל בסוף PDF 18 והפירוט המלא נמצא ב־PDF 19 בבתים 1–16.',
      missingOrNeedsExpansionHebrew:
        'יש לוודא שהקובץ כולל את כל פרטי המקור: זכר ונקבה, שמחה, אכילה ושתייה, הנאות, ממון, אהבה, תשוקה, נישואין, ילדים צעירים, ממון מנשים, מסחר, זהב, עיכוב בקבלת ממון, אהבה בין אחים וחברים, חומר רגיש של זנות/לוואט/فسق, תועלת מהורים וקרקעות, שמירת סוד, דמעות, מתנות, שליחים, כתבים, חולי/מוות בעבדים ומים, נסיעת מקנה, נשים מעורבות, קשר עם אהוב, הצלחה בשותפות ומסחר, ירושות, חרב, מוות של נערה, חכמות נסתרות, פילוסופיה, חלומות טובים, שלטון, ידידות, מרמה ותחבולה, תועלת מבהמות/עבדים, אחרית טובה, קבלת דברים בקושי, קשר/חיבור והפסד ממון.'
    }
  ],
  summary: {
    figureTransitsExpected: 16,
    figureTransitsFilesAlreadyExist: 16,
    priorityNow: [
      'לעבות את hawi-figure-hayyan.js לפי PDF 17–18',
      'לעבות את hawi-figure-naqi-khad.js לפי PDF 18–19',
      'אחר כך לעבור צורה־צורה על שאר figure-transits לפי עמודים 9–24'
    ],
    conclusionHebrew:
      'שכבת התרחיל קיימת לכל 16 הצורות, אך חלק מהקבצים הם תקציריים מדי. עכשיו צריך להרחיב אותם לפי מיפוי הספר המלא בלי למחוק ידע קיים.'
  }
};

export function getHawiFigureTransitAudit(figureId) {
  if (!figureId) return null;

  const normalized = String(figureId).replace(/^hawi-figure-/, '');

  return HAWI_FIGURE_TRANSITS_SOURCE_AUDIT.auditedFigures.find((item) =>
    item.shortFigureId === normalized ||
    item.figureId === figureId
  ) || null;
}

export default { HAWI_FIGURE_TRANSITS_SOURCE_AUDIT };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_TRANSITS_SOURCE_AUDIT };
}
