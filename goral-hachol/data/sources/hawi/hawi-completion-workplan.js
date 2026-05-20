export const HAWI_COMPLETION_WORKPLAN = {
  id: 'hawi-completion-workplan',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  project: 'גורל החול',
  status: 'active-completion-workplan',
  purposeHebrew:
    'תוכנית עבודה לסגירת החומר המקיף של ספר חאוי באפליקציית גורל החול. אין כאן דיני מנוע חדשים; זה קובץ ניהול וסגירת פערים.',

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    mumtazij: 'ממוזג',
    natiq: 'מדבר',
    samit: 'שותק',
    mothers: 'אמהות',
    daughters: 'בנות',
    granddaughters: 'נכדות',
    witnesses: 'עדים',
    judge: 'דיין',
    sentence: 'משלים בית 15',
    takhth: 'לוח הגורל',
  },

  immediateEngineCritical: [
    {
      id: 'mahw-thabat-generation',
      titleHebrew: 'باب المحو والثبات — הולדת הצורות והכאתן',
      currentStatus: 'engine-exists-but-source-layer-needs-full-foundation-file',
      action:
        'ליצור/לעדכן קובץ יסוד שמסביר מחיקה, קיום, הכאה, חלוקה והולדה לפי המקור, בלי לשנות את המנוע שכבר עובד.',
      priority: 'critical',
    },
    {
      id: 'figure-states-photo-review',
      titleHebrew: 'מצבי הצורות בבתים — מדבר/שותק, סעד/נחס',
      currentStatus: 'partial-source-mapped-with-photo-review-items',
      action:
        'לסגור את ארבעת מוקדי הבדיקה הדחופים: סוהר בית 11, חיבור בתים 10–11, ממון נכנס בתים 14–15, סף נכנס בתים 15–16.',
      priority: 'critical',
    },
    {
      id: 'missing-person-source-verification',
      titleHebrew: 'שער הגאיב / נעדר',
      currentStatus: 'dedicated-file-created-needs-photo-review',
      action:
        'לעבור על hawi-question-missing-person.js ולשנות רק שורות מאומתות ל-source-verified.',
      priority: 'high',
    },
    {
      id: 'question-rules-final-audit',
      titleHebrew: 'דיני שאלות קיימים',
      currentStatus: 'many-files-complete-but-need-final-topic-audit',
      action:
        'לוודא שאין שערים חסרים או תתי־דינים חסרים בשערים שכבר בנינו: מסחר, נסיעה, חולי, נישואין, פחד, אויבים, מטמון, אהבה/שנאה, ילד/הריון, השלמת דבר.',
      priority: 'high',
    },
  ],

  preserveKnowledgeNotActiveYet: [
    {
      id: 'planetary-correspondences',
      titleHebrew: 'כוכבים, אזורים, מתכות, אבנים, מאכלים, צמחים ובעלי חיים',
      action:
        'להכניס כקובץ ידע עתידי. לא להפעיל במנוע עד אימות סימני הצורות והכוכבים.',
      priority: 'medium-high',
    },
    {
      id: 'spiritual-diagnostics-expanded',
      titleHebrew: 'אבחון רוחני מורחב — כישוף, קנאה, עין, ג׳ין, מס',
      action:
        'לשמר כל מקור מאושר. אם חאווי לא מביא عين/جن/مس במפורש, להשלים רק ממקור מאושר אחר ולסמן sourceGroup מתאים.',
      priority: 'high',
    },
    {
      id: 'letters-names-talismans',
      titleHebrew: 'אותיות, חילוץ שם, טליסמאות וקטורות',
      action:
        'להכניס לשכבת ידע עתידית, לא למנוע השאלות הרגיל.',
      priority: 'medium-high',
    },
  ],

  futureSeparateModules: [
    {
      id: 'birth-nativity-mawlud',
      titleHebrew: 'שער המולד / امر المولود',
      action: 'מודול עתידי נפרד. לא לערבב עם שאלות רגילות.',
      priority: 'medium',
    },
    {
      id: 'yearly-weather-omens',
      titleHebrew: 'טאלע שנה, גשם, מחירים, מלחמות ומגפות',
      action: 'מודול עתידי נפרד.',
      priority: 'medium',
    },
    {
      id: 'authority-state-kings-rulers',
      titleHebrew: 'מלכים, מושלים, מדינות ואויבי מדינה',
      action: 'מודול עתידי נפרד או שכבת שאלות מיוחדת.',
      priority: 'medium',
    },
  ],

  excludedForNow: [
    {
      id: 'introduction-history-idris-tamtam',
      titleHebrew: 'הקדמה, ייחוס, סיפורי מקור',
      reason: 'המשתמש ביקש להתמקד בידע מעשי ולא במבוא או היסטוריה.',
      priority: 'low',
    },
  ],

  todayOrder: [
    'figure-states-photo-review',
    'mahw-thabat-generation',
    'missing-person-source-verification',
    'question-rules-final-audit',
    'spiritual-diagnostics-expanded',
    'planetary-correspondences',
  ],
};

export function getHawiCompletionTodayOrder() {
  return HAWI_COMPLETION_WORKPLAN.todayOrder;
}

export function getHawiCompletionCriticalItems() {
  return HAWI_COMPLETION_WORKPLAN.immediateEngineCritical;
}

export default HAWI_COMPLETION_WORKPLAN;
