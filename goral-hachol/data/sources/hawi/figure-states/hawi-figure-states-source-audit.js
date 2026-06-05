export const HAWI_FIGURE_STATES_SOURCE_AUDIT = {
  id: 'hawi-figure-states-source-audit',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceSectionArabic:
    'الباب الثامن عشر — الفصل الأول في حالات الأشكال في البيوت وأفعالها',
  sourceSectionHebrew:
    'השער השמונה־עשר — הפרק הראשון במצבי הצורות בבתים ופעולותיהן',
  auditStatus: 'initial-source-audit-from-drive-pdf-45-51',
  importantNoteHebrew:
    'שכבת figure-states אינה זהה לשכבת figure-transits. מצבי הצורות נמצאו בעמודי PDF 45–51 עבור 14 צורות. חיאן ובר הלחי הן צורות בודדות עם מצב קבוע לפי מקור נוסף.',
  auditedFigures: [
    {
      figureId: 'hawi-figure-qabd-dakhil',
      shortFigureId: 'qabd-dakhil',
      hebrewName: 'ממון נכנס',
      arabicName: 'القبض الداخل',
      sourcePages: ['PDF document 45.pdf'],
      figureStateFile: 'hawi-figure-state-qabd-dakhil.js',
      status: 'source-present',
      notesHebrew:
        'המקור מתחיל ב־PDF 45: أول القبض الداخل. קיימים בתים 1–13 ו־16; בית 14–15 לא הופיעו במיפוי הנוכחי.'
    },
    {
      figureId: 'hawi-figure-qabd-kharij',
      shortFigureId: 'qabd-kharij',
      hebrewName: 'ממון יוצא',
      arabicName: 'القبض الخارج',
      sourcePages: ['PDF document 45.pdf'],
      figureStateFile: 'hawi-figure-state-qabd-kharij.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 45. מופיעים בתים 1–16.'
    },
    {
      figureId: 'hawi-figure-jamaa',
      shortFigureId: 'jamaa',
      hebrewName: 'קהלה',
      arabicName: 'الجماعة',
      sourcePages: ['PDF document 45.pdf', 'PDF document 46.pdf'],
      figureStateFile: 'hawi-figure-state-jamaa.js',
      status: 'source-present',
      notesHebrew:
        'הצורה מתחילה בסוף PDF 45 וממשיכה ב־PDF 46. יש לוודא שכל בתי 1–16 נשמרו.'
    },
    {
      figureId: 'hawi-figure-judla',
      shortFigureId: 'judla',
      hebrewName: 'נלחם',
      arabicName: 'الجودلة',
      sourcePages: ['PDF document 46.pdf'],
      figureStateFile: 'hawi-figure-state-judla.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 46 תחת فصل في معرفة الجودلة. בית 15 מופיע במקור כ־لم يظهر.'
    },
    {
      figureId: 'hawi-figure-aqla',
      shortFigureId: 'aqla',
      hebrewName: 'סוהר',
      arabicName: 'العقلة',
      sourcePages: ['PDF document 46.pdf', 'PDF document 47.pdf'],
      figureStateFile: 'hawi-figure-state-aqla.js',
      status: 'source-present',
      notesHebrew:
        'המקור מתחיל ב־PDF 46 וממשיך ב־PDF 47. יש מקומות שבהם OCR משובש ודורש סימון unclear-needs-review במקום פסקנות.'
    },
    {
      figureId: 'hawi-figure-nakis',
      shortFigureId: 'nakis',
      hebrewName: 'שפל ראש',
      arabicName: 'النكيس',
      sourcePages: ['PDF document 47.pdf'],
      figureStateFile: 'hawi-figure-state-nakis.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 47. בית 15 לא מופיע; בית 16 מופיע כ־وفي السادس عشر ناطق نحس مدبر.'
    },
    {
      figureId: 'hawi-figure-humra',
      shortFigureId: 'humra',
      hebrewName: 'אדום',
      arabicName: 'الحمرة',
      sourcePages: ['PDF document 47.pdf', 'PDF document 48.pdf'],
      figureStateFile: 'hawi-figure-state-humra.js',
      status: 'source-present',
      notesHebrew:
        'הצורה מתחילה ב־PDF 47 וממשיכה ב־PDF 48. בית 15 לא מופיע במיפוי הנוכחי.'
    },
    {
      figureId: 'hawi-figure-bayad',
      shortFigureId: 'bayad',
      hebrewName: 'לבן',
      arabicName: 'البياض',
      sourcePages: ['PDF document 48.pdf'],
      figureStateFile: 'hawi-figure-state-bayad.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 48. בית 15 לא מופיע במיפוי הנוכחי.'
    },
    {
      figureId: 'hawi-figure-nusra-kharija',
      shortFigureId: 'nusra-kharija',
      hebrewName: 'כבוד יוצא',
      arabicName: 'النصرة الخارجة',
      sourcePages: ['PDF document 48.pdf'],
      figureStateFile: 'hawi-figure-state-nusra-kharija.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 48. מופיעים בתים 1–16.'
    },
    {
      figureId: 'hawi-figure-nusra-dakhila',
      shortFigureId: 'nusra-dakhila',
      hebrewName: 'כבוד נכנס',
      arabicName: 'النصرة الداخلة',
      sourcePages: ['PDF document 49.pdf'],
      figureStateFile: 'hawi-figure-state-nusra-dakhila.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 49. מופיעים בתים 1–16.'
    },
    {
      figureId: 'hawi-figure-ataba-kharija',
      shortFigureId: 'ataba-kharija',
      hebrewName: 'סף יוצא',
      arabicName: 'العتبة الخارجة',
      sourcePages: ['PDF document 49.pdf'],
      figureStateFile: 'hawi-figure-state-ataba-kharija.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 49. בית 15 לא הופיע במיפוי הנוכחי; בית 16 מופיע.'
    },
    {
      figureId: 'hawi-figure-tariq',
      shortFigureId: 'tariq',
      hebrewName: 'דרך',
      arabicName: 'الطريق',
      sourcePages: ['PDF document 49.pdf', 'PDF document 50.pdf'],
      figureStateFile: 'hawi-figure-state-tariq.js',
      status: 'source-present',
      notesHebrew:
        'המקור מתחיל בסוף PDF 49 וממשיך ב־PDF 50. בית 8 מסומן במקור כ־لم يذكر.'
    },
    {
      figureId: 'hawi-figure-ataba-dakhila',
      shortFigureId: 'ataba-dakhila',
      hebrewName: 'סף נכנס',
      arabicName: 'العتبة الداخلة',
      sourcePages: ['PDF document 50.pdf'],
      figureStateFile: 'hawi-figure-state-ataba-dakhila.js',
      status: 'source-present',
      notesHebrew:
        'המקור נמצא ב־PDF 50. בתי 15–16 מסומנים במקור כלא קיימת קריאה.'
    },
    {
      figureId: 'hawi-figure-ijtima',
      shortFigureId: 'ijtima',
      hebrewName: 'חיבור',
      arabicName: 'الاجتماع',
      sourcePages: ['PDF document 50.pdf', 'PDF document 51.pdf'],
      figureStateFile: 'hawi-figure-state-ijtima.js',
      status: 'source-present',
      notesHebrew:
        'המקור מתחיל ב־PDF 50 וממשיך ב־PDF 51. יש כפילות/שיבוש סביב בית 10–11: מופיע החادي عشر פעמיים, ולכן יש להשאיר unclear-needs-review.'
    }
  ],
  notFoundInFigureStatesSection: [],
  globalClassificationFigures: [
    {
      figureId: 'hawi-figure-hayyan',
      shortFigureId: 'hayyan',
      hebrewName: 'נשוא ראש',
      arabicName: 'الحيان / الأحيان',
      foundInOtherLayer: 'figure-transits',
      knownTransitPages: ['PDF document 17.pdf', 'PDF document 18.pdf'],
      figureStateFile: 'hawi-figure-state-hayyan.js',
      status: 'global-classification-fixed-falak-mashun',
      sourceBook: 'الفلك المشحون في علم الرمل المصون',
      globalSpeakingState: 'speaking',
      globalFortuneState: 'benefic',
      notesHebrew:
        'צורה בודדת שאינה נכנסת למיזן. מצבה קבוע בכל הבתים: מדברת וטובה.'
    },
    {
      figureId: 'hawi-figure-naqi-khad',
      shortFigureId: 'naqi-khad',
      hebrewName: 'בר הלחי',
      arabicName: 'نقي الخد / الأشقر',
      foundInOtherLayer: 'figure-transits',
      knownTransitPages: ['PDF document 18.pdf', 'PDF document 19.pdf'],
      figureStateFile: 'hawi-figure-state-naqi-khad.js',
      status: 'global-classification-fixed-falak-mashun',
      sourceBook: 'الفلك المشحون في علم الرمل المصون',
      globalSpeakingState: 'speaking',
      globalFortuneState: 'mixed',
      notesHebrew:
        'צורה בודדת. מצבה קבוע בכל הבתים: מדברת ומעורבת נחס.'
    }
  ],
  summary: {
    sourcePagesChecked: [
      'PDF document 45.pdf',
      'PDF document 46.pdf',
      'PDF document 47.pdf',
      'PDF document 48.pdf',
      'PDF document 49.pdf',
      'PDF document 50.pdf',
      'PDF document 51.pdf'
    ],
    figureStatesInCurrentSection: 14,
    figureStatesGlobalClassification: 2,
    figureStatesNotFoundInCurrentSection: 0,
    conclusionHebrew:
      'שכבת מצבי הצורות מכסה את כל 16 הצורות. 14 צורות נלקחו מחאוי (PDF 45–51). חיאן ובר הלחי אינן בפרק חאוי — הן צורות בודדות עם מצב קבוע, ומצבן נלקח מסיווג גלובלי לפי הפלק המשחון.'
  }
};

export function getHawiFigureStateAudit(shortFigureId) {
  if (!shortFigureId) return null;

  const normalized = String(shortFigureId).replace(/^hawi-figure-/, '');

  return HAWI_FIGURE_STATES_SOURCE_AUDIT.auditedFigures.find((item) =>
    item.shortFigureId === normalized ||
    item.figureId === shortFigureId
  ) || HAWI_FIGURE_STATES_SOURCE_AUDIT.notFoundInFigureStatesSection.find((item) =>
    item.shortFigureId === normalized ||
    item.figureId === shortFigureId
  ) || null;
}

export default { HAWI_FIGURE_STATES_SOURCE_AUDIT };
