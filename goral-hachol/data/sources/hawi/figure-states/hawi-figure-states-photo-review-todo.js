export const HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO = {
  id: 'hawi-figure-states-photo-review-todo',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceArea: 'figure-states',
  sourcePages: [
    'PDF document 45.pdf',
    'PDF document 46.pdf',
    'PDF document 47.pdf',
    'PDF document 48.pdf',
    'PDF document 49.pdf',
    'PDF document 50.pdf',
    'PDF document 51.pdf',
  ],
  purposeHebrew:
    'רשימת בדיקת צילום נקייה לשכבת מצבי הצורות: ناطق/صامت, سعد/نحس, חזק/חלש, מתקן/מקלקל. אין כאן דיני מנוע חדשים; זה קובץ ביקורת מקור בלבד.',

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    natiq: 'מדבר',
    samit: 'שותק',
  },

  urgentPhotoReview: [
    {
      figureHebrew: 'סוהר',
      figureArabic: 'العقلة',
      file: 'hawi-figure-state-aqla.js',
      houses: [11],
      currentProblem:
        'בית 11 קיים אך נוסח ה־OCR משובש: وفي الحادي عشر صامت نحس...',
      action:
        'לבדוק צילום PDF 46–47 ולאשר את הערבית המדויקת, מצב הדיבור, וסעד/נחס.',
      status: 'needs-photo-review',
    },
    {
      figureHebrew: 'חיבור',
      figureArabic: 'الاجتماع',
      file: 'hawi-figure-state-ijtima.js',
      houses: [10, 11],
      currentProblem:
        'קיימת כפילות OCR סביב בית 11, וייתכן שאחת הקריאות שייכת לבית 10.',
      action:
        'לבדוק צילום PDF 50–51 ולקבוע מה שייך לבית 10 ומה שייך לבית 11.',
      status: 'needs-photo-review',
    },
    {
      figureHebrew: 'ממון נכנס',
      figureArabic: 'القبض الداخل',
      file: 'hawi-figure-state-qabd-dakhil.js',
      houses: [14, 15],
      currentProblem:
        'בית 14 ובית 15 מסומנים not-explicit-in-current-page-index; בנוסף המילה قولي אולי שיבוש OCR.',
      action:
        'לבדוק צילום PDF 45 ולאשר אם בתים 14–15 קיימים בפרק או באמת חסרים.',
      status: 'needs-photo-review',
    },
    {
      figureHebrew: 'סף נכנס',
      figureArabic: 'عتبة داخلة',
      file: 'hawi-figure-state-ataba-dakhila.js',
      houses: [15, 16],
      currentProblem:
        'בית 15 ובית 16 לא נמצאו בקריאה הנוכחית.',
      action:
        'לבדוק צילום PDF 50 ולאשר אם הם חסרים במקור או רק לא נקלטו במיפוי.',
      status: 'needs-photo-review',
    },
  ],

  probablyNotExplicitButKeepMarked: [
    {
      figureHebrew: 'סף יוצא',
      figureArabic: 'عتبة خارجة',
      file: 'hawi-figure-state-ataba-kharija.js',
      houses: [15],
      currentStatus: 'לא הופיע במיפוי הנוכחי',
      action: 'לא להשלים מסברה; רק לאשר בצילום PDF 49 אם אכן חסר.',
    },
    {
      figureHebrew: 'לבן',
      figureArabic: 'البياض',
      file: 'hawi-figure-state-bayad.js',
      houses: [15],
      currentStatus: 'לא הופיע במיפוי הנוכחי',
      action: 'לא להשלים מסברה; רק לאשר בצילום PDF 48 אם אכן חסר.',
    },
    {
      figureHebrew: 'אדום',
      figureArabic: 'الحمرة',
      file: 'hawi-figure-state-humra.js',
      houses: [15],
      currentStatus: 'לא הופיע במיפוי הנוכחי',
      action: 'לא להשלים מסברה; רק לאשר בצילום PDF 47–48 אם אכן חסר.',
    },
    {
      figureHebrew: 'נלחם',
      figureArabic: 'الجودلة',
      file: 'hawi-figure-state-judla.js',
      houses: [15],
      currentStatus: 'במקור/מיפוי כתוב لم يظهر',
      action: 'לא להשלים מסברה; לשמר כלא הופיע אלא אם הצילום יראה אחרת.',
    },
    {
      figureHebrew: 'שפל ראש',
      figureArabic: 'النكيس',
      file: 'hawi-figure-state-nakis.js',
      houses: [15],
      currentStatus: 'לא הופיע במיפוי הנוכחי',
      action: 'לא להשלים מסברה; רק לאשר בצילום PDF 47 אם אכן חסר.',
    },
    {
      figureHebrew: 'דרך',
      figureArabic: 'الطريق',
      file: 'hawi-figure-state-tariq.js',
      houses: [8],
      currentStatus: 'במקור/מיפוי כתוב لم يذكر',
      action: 'לא להשלים מסברה; לשמר כלא נזכר אלא אם הצילום יראה אחרת.',
    },
  ],

  completeButNeedsPhotoConfirmationBeforeEngineActivation: [
    {
      figureHebrew: 'כבוד נכנס',
      figureArabic: 'النصرة الداخلة',
      file: 'hawi-figure-state-nusra-dakhila.js',
      coverage: '16/16',
      action: 'הקובץ מלא, אך יש לאשר צילום לפני הפעלה מלאה במנוע.',
    },
    {
      figureHebrew: 'כבוד יוצא',
      figureArabic: 'النصرة الخارجة',
      file: 'hawi-figure-state-nusra-kharija.js',
      coverage: '16/16',
      action: 'הקובץ מלא, אך יש לאשר צילום לפני הפעלה מלאה במנוע.',
    },
  ],

  engineDecisionHebrew:
    'אין להפעיל במנוע פסיקה כל שורה שמסומנת needs-photo-review או not-explicit-in-current-page-index. סעד יוצג בעברית כטוב, נחס יוצג בעברית כרע, אבל המקור הערבי נשמר.',

  nextWorkHebrew:
    'לבדוק צילום רק לדפים PDF 45–51, לפי הרשימה הדחופה תחילה. לאחר אימות, לעדכן כל קובץ מצב צורה ולשנות סטטוס רק למה שאומת באמת.',
};

export default { HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FIGURE_STATES_PHOTO_REVIEW_TODO };
}
