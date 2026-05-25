export const HAWI_COMPLETION_WORKPLAN = {
  id: 'hawi-completion-workplan',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  project: 'גורל החול',
  status: 'updated-2026-05-25',
  purposeHebrew:
    'תוכנית עבודה עדכנית. אין לפתוח מחדש שכבות שכבר נסגרו.',

  closedDoNotReopen: [
    'שמות 16 הצורות',
    'חוק הכאת הצורות',
    'בניית לוח הגורל עד בית 16',
    'אמהות, בנות, נכדות, עדים, דיין ומשלים בית 15',
    'מצבי הצורות — מדבר/שותק, סעד/נחס',
    'מעבר הצורות ב־16 הבתים',
    '16 הבתים',
    'דיני שאלות קיימים בשכבת חאוי',
    'תחסיל (تحصيل) — מנוע הגעה: ישיר, טבעי, עדים, העברה, שיתוף שורות',
    'מניעה (حيلولة) — מנוע חסימה: דיין נחס, בית 12, בית 8',
    'NATURAL_HOUSE_FIGURES — ניקוי מסורת מערבית, מילוי ממקורות חאוי בלבד',
  ],

  pendingByPriority: [
    {
      id: 'figure-states-wiring',
      priority: 1,
      titleHebrew: 'חיבור מצבי צורות לציון הפסיקה',
      descriptionHebrew:
        'הנתונים קיימים (מדבר/שותק — ناطق/صامت) ומחוברים כעת למנוע הפסיקה. צורה שותקת מחלישה את משקל תרומתה (×0.6). מצב הצורה בבית (fortuneState) משמש כ-override לסעד/נחס הבסיסי כשקיים.',
      status: 'done-2026-05-25',
      sourceAvailable: true,
      notes: 'מומש ב-hawi-interpreter.js: getFigureStateHouseTone(), getSpeakingStateMultiplier(), getSpeakingStateHebrew(). חובר ל-scoreBoard ו-buildJudgeVerdict.',
    },
    {
      id: 'natural-houses-missing',
      priority: 2,
      titleHebrew: 'בתים טבעיים חסרים — בתים 5, 6, 7',
      descriptionHebrew:
        'כל 16 הבתים הושלמו. בתים 5, 6, 7 נגזרו מסדר תסקין המזרח (تسكين الشرق) בפרק חאוי, מסמכי PDF 33-34: עמדה 4=בר הלחי (1211), עמדה 5=סף יוצא (1112), עמדה 6=אדום (2122). הוכחה: 9/9 בתים אושרו לפני פתרון זה תואמים 100%.',
      status: 'done-2026-05-25',
      sourceAvailable: true,
      notes: 'מקור: taskinEast.orderFromSource ב-hawi-dhamir-directions-validation.js (PDF docs 33-34). כל 16 הבתים נמצאים ב-NATURAL_HOUSE_FIGURES.',
    },
    {
      id: 'radicality-check',
      priority: 3,
      titleHebrew: 'בדיקת תקינות הלוח (אצאלה / أصالة)',
      descriptionHebrew:
        'מומש. הפונקציה computeAsala() בודקת: (1) נוכחות צורת הלבנה (לבן/דרך), (2) נוכחות מחלקת כל 7 כוכבים. תוצאה מוצגת ב-buildFinalConclusion לפני פסיקת הדין.',
      status: 'done-2026-05-25',
      sourceAvailable: true,
      notes: 'מקור: hawi-dhamir-directions-validation.js, strikeValidityPrinciples + moonValidationRules. קוד: computeAsala() ב-hawi-interpreter.js.',
    },
  ],

  futureModulesNotUrgent: [
    {
      id: 'yearly-forecast',
      titleHebrew: 'טאלע השנה / גשם / יוקר וזול',
      ruleHebrew: 'מודול עתידי. לא מעכב את גורל החול הבסיסי.',
    },
    {
      id: 'birth-nativity',
      titleHebrew: 'מולד / נולד',
      ruleHebrew: 'מודול עתידי. לא מעכב.',
    },
    {
      id: 'authority-state',
      titleHebrew: 'שלטון / מדינה / בעלי תפקידים',
      ruleHebrew: 'מודול עתידי. לא מעכב.',
    },
  ],

  sourceRuleHebrew:
    'בונים רק מהתיקייה "ספרים לאפליקציית גורל החול" בגוגל דרייב. אין לערבב ידע ממקורות מערביים או מכל מקור אחר.',

  terminologyHebrew: {
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    mumtazij: 'ממוזג',
    natiq: 'מדבר',
    samit: 'שותק',
    muqbil: 'מתקדם',
    mudabbir: 'מתרחק',
    takhth: 'לוח הגורל',
    judge: 'דיין',
    sentence: 'משלים בית 15',
    tahasil: 'תחסיל — האם הדבר ייגמר',
    hayula: 'מניעה — מה חוסם',
    jadwal: 'ג׳דוול — צורה טבעית של הבית',
    asala: 'אצאלה — תקינות הלוח לפסיקה',
  },
};

export default { HAWI_COMPLETION_WORKPLAN };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_COMPLETION_WORKPLAN };
}
