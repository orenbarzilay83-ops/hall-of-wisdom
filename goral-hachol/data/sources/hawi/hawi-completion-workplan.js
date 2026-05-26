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
      id: 'dhamir-scoring',
      priority: 2,
      titleHebrew: 'דמיר משפיע על ציון הפסיקה',
      descriptionHebrew:
        'הדמיר (الضمير) מחובר כעת לציון הפסיקה במשקל 1.5. שיטת תסיירת נקטת המיזאן היא הראשית. הדמיר מאשר או סותר את הדיין ומוצג בפסיקה הסופית.',
      status: 'done-2026-05-25',
      sourceAvailable: true,
      notes: 'מומש ב-scoreBoard(): dhamirTone × 1.5. בנוסף: repetitionBonus (×0.4 לכל חזרת הדיין), aspectBonus (1.0/0.5 לחיבורי בית 1), completenessMultiplier (×0.8 אם לוח חסר). buildJudgeVerdict() ו-buildFinalConclusion() מציגים אישור/סתירת הדמיר.',
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
    {
      id: 'source-gap-handling',
      priority: 4,
      titleHebrew: 'טיפול בפערי מקור — בתים שלא מפורשים בספר',
      descriptionHebrew:
        'חלק מהצורות חסרות מעבר מפורש בחלק מהבתים (בעיקר בית 15 ו-16) — וזה אומת מספרים מרובים. המנוע מתייחס לכך נכון: getTransitMeaningForHouse() מחזיר null עבור not-explicit-in-source ולא מציג "המקור אינו מביא דין". boardAnalysis.sourceQuality מדווח לפרקטיקן על כמה בתים עיקריים מכוסים. buildFinalConclusion() מציג הערת מקור כשיש פערים.',
      status: 'done-2026-05-25',
      sourceAvailable: true,
      notes: 'מדיניות: אין להשלים ידע מסברה. הפסיקה על בתים חסרי מקור מבוצעת לפי מזל הצורה הכללי בלבד. isConnected בittisalat תוקן לכלול גם focus_to_judge.',
    },
  ],

  secondarySourceEnrichments: [
    {
      id: 'hayyan-enriched-from-balugh-alamal',
      status: 'done-2026-05-25',
      figure: 'الأحيان / נשוא ראש',
      sourceBook: 'بلوغ الأمل في علم الرمل',
      housesEnriched: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
      housesConfirmingGap: [15],
      housesWithTonalConflict: [7, 10, 12],
      policy: 'חאוי גובר תמיד. נתוני המקור המשני נשמרים בשדה supplementarySource. בתים עם קונפליקט טונלי מסומנים בדגל.',
      notes: 'בית 15 נעדר גם מבלוג׳ האמל — מאשר פער מקורי. נקי-חד לא נמצא בנתוני מעבר לבתים בספר זה.',
    },
    {
      id: 'judla-ataba-dakhila-bayad-naqi-khad-enriched-from-balugh-alamal',
      status: 'done-2026-05-25',
      figures: ['الكوسج / נלחם', 'العتبة الداخلة / סף נכנס', 'البياض / לבן', 'نقي الخد / בר הלחי'],
      sourceBook: 'بلوغ الأمل في علم الرمل',
      housesEnrichedPerFigure: 'H1-H14 and H16 for all four figures',
      housesWithNewHawiData: ['Judla H16 (supplemented-from-secondary-source)', 'Ataba-Dakhila H16 (supplemented-from-secondary-source)'],
      housesConfirmingGap: [15],
      policy: 'חאוי גובר תמיד. בתים עם קונפליקט מסומנים בדגל. בתים 16 של נלחם וסף נכנס עברו מ-not-explicit ל-supplemented-from-secondary-source.',
      notes: 'נמצא פרק שלם בבלוג׳ האמל עם נתוני מעבר לבתים לכלל 16 הצורות. בית 15 נעדר מכל הצורות גם שם — מאשר פער מקורי עצמאי.',
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
