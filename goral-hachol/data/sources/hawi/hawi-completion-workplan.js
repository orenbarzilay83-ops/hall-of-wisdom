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
        'בתים 8, 9, 10, 11, 12 אושרו ועודכנו ב-NATURAL_HOUSE_FIGURES. נותרים בתים 5, 6, 7 — ה-OCR של פרקי חאוי לבתים אלה לא לכד את סמלי הצורה. יש לחפש PDF עם OCR טוב יותר או מקור חלופי בתוך קובצי חאוי.',
      status: 'partial-blocked-waiting-for-better-ocr',
      sourceAvailable: false,
      notes: 'אין לשלים מסברה או ממקורות אחרים. רק מחאוי ישירות. בתים שאושרו: 1,2,3,4,8,9,10,11,12.',
    },
    {
      id: 'radicality-check',
      priority: 3,
      titleHebrew: 'בדיקת תקינות הלוח (אצאלה / أصالة)',
      descriptionHebrew:
        'האם השאלה תקפה בכלל לפסיקה? בדיקה ראשונית לפני כל פסיקה. אם הלוח אינו "אצאלי" — אין לפסוק.',
      status: 'pending',
      sourceAvailable: true,
      notes: 'חומר קיים ב-hawi-dhamir-directions-validation.js. צריך לחלץ את כללי האצאלה ולממש פונקציה.',
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
