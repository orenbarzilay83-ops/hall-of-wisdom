export const HAWI_FULL_BOOK_GAP_AUDIT = {
  id: 'hawi-full-book-gap-audit',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  extractionStatus: 'cleaned-after-repeated-source-work',
  purposeHebrew:
    'קובץ ניהול נקי לאחר סגירת סימוני פער ישנים. אין כאן הוראות לפתוח מחדש חומר שכבר נבדק. הקובץ משמש רק כדי לראות מה באמת נשאר כידע עתידי או בדיקה ממוקדת.',

  policy: {
    noExternalKnowledgeUnlessApproved: true,
    doNotReopenClosedWork: true,
    doNotMarkOldReviewedMaterialAsOpen: true,
    sourceKnowledgeFilesAreAuthoritative: true,
  },

  closedKnowledgeAreas: [
    {
      id: 'figure-names',
      hebrewTitle: 'שמות 16 הצורות',
      status: 'closed-source-mapped',
      note: 'קיים בקובצי foundation/figure-names. אין לפתוח מחדש אלא אם נמצא שם מקור חדש ממש.',
    },
    {
      id: 'figure-combination-engine',
      hebrewTitle: 'חוק הכאת הצורות / חיבור צורות',
      status: 'closed-engine-implemented',
      note: 'קיים במנוע raml-figures.js וב־raml-board-generator.js. מסומן כסגור.',
    },
    {
      id: 'board-generation',
      hebrewTitle: 'בניית לוח הגורל עד 16',
      status: 'closed-engine-implemented',
      note: 'אמהות, בנות, נכדות, עדים, דיין ומשלים בית 15 כבר מיושמים. לא לפתוח מחדש בגלל סימוני audit ישנים.',
    },
    {
      id: 'figure-transits',
      hebrewTitle: 'תרחיל / מעבר 16 הצורות ב־16 הבתים',
      status: 'closed-rich-source-layer',
      note: 'קיים בתיקיית figure-transits. הערות review מקומיות אינן סיבה לפתוח מחדש את כל השכבה.',
    },
    {
      id: 'figure-states',
      hebrewTitle: 'מצבי הצורות — מדבר/שותק, סעד/נחס',
      status: 'closed-after-working-review',
      note: 'סימוני OCR/photo-review ישנים נוקו. אין לפתוח מחדש את כל הצורות.',
    },
    {
      id: 'houses-16',
      hebrewTitle: '16 הבתים',
      status: 'closed-rich-foundation',
      note: 'קיים hawi-houses-16.js. אם יתגלה שיוך קטן חדש בעתיד, מוסיפים נקודתית בלבד.',
    },
    {
      id: 'question-rules-core',
      hebrewTitle: 'דיני שאלות עיקריים',
      status: 'closed-as-current-source-layer',
      note: 'קיימים קבצי שאלות: מסחר, נסיעה, חולי, נישואין, פחד, אויבים, מטמון, אהבה/שנאה, ילד/הריון, השלמת דבר, נעדר.',
    },
  ],

  realRemainingKnowledgeAreas: [
    {
      id: 'planetary-correspondences',
      hebrewTitle: 'שיוכי כוכבים, אקלימים, מתכות, אבנים, מאכלים, צמחים ובעלי חיים',
      status: 'future-module-not-blocking-basic-goral',
      actionHebrew:
        'לשמר לעתיד כקובץ ידע נפרד. לא לעכב את מודול גורל החול הבסיסי.',
    },
    {
      id: 'birth-nativity-mawlud',
      hebrewTitle: 'שער המולד / הנולד',
      status: 'future-large-module-not-basic-question-engine',
      actionHebrew:
        'מודול עתידי נפרד. לא לערבב עם דיני שאלה רגילים.',
    },
    {
      id: 'yearly-weather-omens',
      hebrewTitle: 'טאלע השנה, גשם, יוקר/זול, מלחמות ומחלות כלליות',
      status: 'future-large-module-not-basic-question-engine',
      actionHebrew:
        'מודול עתידי נפרד. לא לעכב את בניית לוח גורל החול.',
    },
    {
      id: 'authority-state-kings-rulers',
      hebrewTitle: 'מלכים, מושלים, מדינות ואויבי מדינה',
      status: 'future-specialized-module',
      actionHebrew:
        'להכניס בעתיד רק אם נרצה מודול שלטון/מדינה.',
    },
    {
      id: 'spiritual-diagnostics-expanded',
      hebrewTitle: 'אבחון רוחני מורחב',
      status: 'partly-covered-needs-approved-sources-only',
      actionHebrew:
        'כישוף/קנאה/אחיזה קיימים בשכבות שונות. עין/ג׳ין/מס יושלמו רק ממקור מאושר, לא מסברה.',
    },
  ],

  currentDecisionHebrew:
    'אין יותר להשתמש בקובץ זה כדי לפתוח מחדש את מצבי הצורות, בניית הלוח, חוק ההכאה, שמות הצורות, הבתים או דיני השאלות שכבר נכנסו. הוא משמש רק מפת המשך נקייה.',
};

export function getHawiFullBookGapAudit() {
  return HAWI_FULL_BOOK_GAP_AUDIT;
}

export function getHawiClosedKnowledgeAreas() {
  return HAWI_FULL_BOOK_GAP_AUDIT.closedKnowledgeAreas;
}

export function getHawiRealRemainingKnowledgeAreas() {
  return HAWI_FULL_BOOK_GAP_AUDIT.realRemainingKnowledgeAreas;
}

export default { HAWI_FULL_BOOK_GAP_AUDIT };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_FULL_BOOK_GAP_AUDIT };
}
