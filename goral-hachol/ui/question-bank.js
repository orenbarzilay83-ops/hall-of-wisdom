/**
 * question-bank.js
 *
 * בנק שאלות מלא — כל שאלה שהאפליקציה יודעת לענות עליה.
 * מקורות: kashf-topics-per-house.js + פונקציות המנוע.
 *
 * כל שאלה מכילה:
 *   id         — מזהה ייחודי
 *   category   — קטגוריה (מ-QUESTION_CATEGORIES)
 *   houseId    — הבית הראשי (1-12)
 *   topicId    — מזהה הנושא במנוע
 *   label      — הכותרת הקצרה לתצוגה
 *   desc       — תיאור מה האפליקציה בודקת
 *   clientFields — שדות פרטי לקוח ספציפיים לשאלה זו
 */

window.QUESTION_CATEGORIES = [
  { id: 'general',   label: 'שאלה כללית',      emoji: '🌟', color: '#fffde7', border: '#f9a825' },
  { id: 'health',    label: 'בריאות וחיים',     emoji: '🏥', color: '#e8f5e9', border: '#388e3c' },
  { id: 'money',     label: 'ממון ועסקים',      emoji: '💰', color: '#e3f2fd', border: '#1565c0' },
  { id: 'family',    label: 'משפחה',            emoji: '👨‍👩‍👧', color: '#fce4ec', border: '#c2185b' },
  { id: 'love',      label: 'זוגיות ואהבה',     emoji: '❤️', color: '#fdf6ff', border: '#7b1fa2' },
  { id: 'spiritual', label: 'רוחניות ונסתרות',  emoji: '🔮', color: '#ede7f6', border: '#512da8' },
  { id: 'travel',    label: 'נסיעה ונעדר',      emoji: '✈️', color: '#e0f7fa', border: '#00838f' },
  { id: 'career',    label: 'עבודה ומעמד',      emoji: '🏢', color: '#fff3e0', border: '#e65100' },
  { id: 'conflict',  label: 'יריבות וסכנות',    emoji: '⚖️', color: '#ffeaea', border: '#b71c1c' },
];

// ─── שדות לקוח לפי נושא ────────────────────────────────────────────────────
const F = {
  matter:       { id: 'matter',      label: 'על מה מדובר?',               type: 'textarea', placeholder: 'תאר בקצרה את העניין שבו שואלים...' },
  symptoms:     { id: 'symptoms',    label: 'תיאור התסמינים',              type: 'textarea', placeholder: 'כאבים, חום, עייפות, דיכאון...' },
  duration:     { id: 'duration',    label: 'כמה זמן נמשך?',              type: 'text',     placeholder: 'ימים / שבועות / חודשים' },
  treatment:    { id: 'treatment',   label: 'טיפול שקיבל',                type: 'text',     placeholder: 'תרופות, ניתוח, טיפול חלופי...' },
  doctorSays:   { id: 'doctorSays',  label: 'מה אמרו הרופאים?',           type: 'text',     placeholder: 'אבחנה, חוות דעת' },
  candidate:    { id: 'candidate',   label: 'שם / תיאור המועמד/ת',        type: 'text',     placeholder: 'אם יש מישהו ספציפי' },
  candidateAge: { id: 'candidateAge',label: 'גיל המועמד/ת',               type: 'number',   placeholder: 'גיל' },
  obstacle:     { id: 'obstacle',    label: 'מה המכשול / סיבת השאלה?',   type: 'textarea', placeholder: 'מה עוצר, מה מחכים לדעת...' },
  stolen:       { id: 'stolen',      label: 'מה נגנב?',                   type: 'text',     placeholder: 'תיאור הפריט' },
  stolenWhen:   { id: 'stolenWhen',  label: 'מתי נגנב?',                  type: 'text',     placeholder: 'תאריך / מתי בערך' },
  stolenValue:  { id: 'stolenValue', label: 'ערך משוער',                  type: 'text',     placeholder: 'ש"ח / תיאור' },
  suspect:      { id: 'suspect',     label: 'האם יש חשוד?',               type: 'text',     placeholder: 'שם / תיאור (אם יש)' },
  destination:  { id: 'destination', label: 'לאן הנסיעה?',               type: 'text',     placeholder: 'עיר / מדינה / יעד' },
  travelDate:   { id: 'travelDate',  label: 'מתי?',                       type: 'text',     placeholder: 'תאריך מתוכנן' },
  travelType:   { id: 'travelType',  label: 'סוג הנסיעה',                 type: 'select',   options: ['יבשה', 'ים', 'אוויר', 'לא ידוע'] },
  travelPurpose:{ id: 'travelPurpose',label: 'מטרת הנסיעה',              type: 'text',     placeholder: 'עסקים / טיפול רפואי / קשרי משפחה...' },
  missingName:  { id: 'missingName', label: 'שם הנעדר',                   type: 'text',     placeholder: 'שם פרטי' },
  missingGender:{ id: 'missingGender',label: 'מין הנעדר',                 type: 'select',   options: ['זכר', 'נקבה'] },
  missingAge:   { id: 'missingAge',  label: 'גיל הנעדר',                  type: 'number',   placeholder: 'גיל' },
  missingWhen:  { id: 'missingWhen', label: 'כמה זמן נעדר?',              type: 'text',     placeholder: 'ימים / שבועות' },
  missingWhere: { id: 'missingWhere',label: 'לאן הלך לפני שנעלם?',        type: 'text',     placeholder: 'כיוון / מקום אחרון' },
  debtAmount:   { id: 'debtAmount',  label: 'סכום החוב',                  type: 'text',     placeholder: 'ש"ח' },
  debtPerson:   { id: 'debtPerson',  label: 'שם החייב / הנושה',           type: 'text',     placeholder: 'שם' },
  opponent:     { id: 'opponent',    label: 'שם / תיאור הצד השני',        type: 'text',     placeholder: 'שם / קשר' },
  disputeIssue: { id: 'disputeIssue',label: 'מהות הסכסוך',               type: 'textarea', placeholder: 'כסף / עסק / ירושה / גרושין...' },
  disputeStage: { id: 'disputeStage',label: 'שלב המחלוקת',               type: 'select',   options: ['לפני בית משפט', 'בבית משפט', 'גישור', 'עימות ישיר'] },
  enemyWho:     { id: 'enemyWho',    label: 'מי האויב?',                  type: 'text',     placeholder: 'שם / תיאור הקשר' },
  enemyWhat:    { id: 'enemyWhat',   label: 'מה עשה?',                    type: 'textarea', placeholder: 'תיאור הפגיעה או האיום' },
  prisonerName: { id: 'prisonerName',label: 'שם האסיר',                   type: 'text',     placeholder: 'שם' },
  prisonerCharge:{ id: 'prisonerCharge',label: 'האשמה / הסיבה',          type: 'text',     placeholder: 'מה הוא האשמה?' },
  prisonerStage: { id: 'prisonerStage',label: 'שלב ההליך',               type: 'select',   options: ['מעצר', 'משפט', 'ריצוי עונש', 'ערעור'] },
  spiritSymptoms:{ id: 'spiritSymptoms',label: 'מה הסימפטומים?',         type: 'textarea', placeholder: 'כאבים, חרדה, מחשבות, שינה, תאונות...' },
  spiritWhen:   { id: 'spiritWhen',  label: 'מתי התחיל?',                 type: 'text',     placeholder: 'תאריך / אירוע' },
  spiritSuspect:{ id: 'spiritSuspect',label: 'חשד למי?',                  type: 'text',     placeholder: 'שם / קשר (אם יש)' },
  treasureDesc: { id: 'treasureDesc',label: 'תיאור מה מחפשים',            type: 'text',     placeholder: 'מטבעות / חפצים / כסף...' },
  treasureLoc:  { id: 'treasureLoc', label: 'מיקום / רמז',               type: 'text',     placeholder: 'שטח / בית / מקום' },
  wellLoc:      { id: 'wellLoc',     label: 'מיקום הקרקע',               type: 'text',     placeholder: 'כפר / עיר / שטח' },
  partnerName:  { id: 'partnerName', label: 'שם השותף',                   type: 'text',     placeholder: 'שם' },
  partnerBiz:   { id: 'partnerBiz',  label: 'סוג העסק',                   type: 'text',     placeholder: 'מסחר / נדל"ן / שירותים...' },
  partnerConcern:{ id: 'partnerConcern',label: 'מה המדאיג?',              type: 'textarea', placeholder: 'חשש, מחלוקת, שאלה עסקية...' },
  loveWho:      { id: 'loveWho',     label: 'שם / תיאור האהוב/ה',        type: 'text',     placeholder: 'שם' },
  loveRelation: { id: 'loveRelation',label: 'סוג הקשר',                   type: 'select',   options: ['חברים', 'מכרים', 'ידידים', 'בני זוג לשעבר', 'אין קשר עדיין'] },
  loveDuration: { id: 'loveDuration',label: 'כמה זמן מכירים?',           type: 'text',     placeholder: 'חודשים / שנים' },
  pregnancyMonths: { id: 'pregnancyMonths',label: 'כמה חודשי הריון (אם ידוע)?', type: 'number', placeholder: 'חודשים' },
  pregnancyConcern: { id: 'pregnancyConcern',label: 'מה הדאגה הספציפית?', type: 'text',    placeholder: 'סיכון / לידה / בריאות...' },
  siblingName:  { id: 'siblingName', label: 'שם האח / האחות / הקרוב',    type: 'text',     placeholder: 'שם' },
  siblingIssue: { id: 'siblingIssue',label: 'מהות השאלה',                 type: 'textarea', placeholder: 'סכסוך / עזרה / מרחק...' },
  birthDate:    { id: 'birthDate',   label: 'תאריך לידה (אם ידוע)',       type: 'text',     placeholder: 'DD/MM/YYYY' },
  positionName: { id: 'positionName',label: 'שם התפקיד / המשרה',         type: 'text',     placeholder: 'מנהל / שר / עצמאי...' },
  positionConcern: { id: 'positionConcern',label: 'מה השאלה?',            type: 'textarea', placeholder: 'האם ישמור / יקבל / יחזור...' },
  animalType:   { id: 'animalType',  label: 'סוג הבהמה',                  type: 'select',   options: ['סוס', 'פרה', 'כבשה', 'חמור', 'גמל', 'כלב', 'אחר'] },
  animalWhen:   { id: 'animalWhen',  label: 'מתי נאבד?',                  type: 'text',     placeholder: 'תאריך / מתי בערך' },
  animalWhere:  { id: 'animalWhere', label: 'איפה נראה לאחרונה?',        type: 'text',     placeholder: 'מקום' },
  dreamDesc:    { id: 'dreamDesc',   label: 'תיאור החלום',               type: 'textarea', placeholder: 'מה ראה בחלום...' },
  promiseDesc:  { id: 'promiseDesc', label: 'תיאור ההבטחה',              type: 'textarea', placeholder: 'מה הובטח ומי הבטיח' },
  yearForecast: { id: 'yearForecast',label: 'שנה / תקופה',               type: 'text',     placeholder: 'שנה / חודשים הקרובים' },
};

window.QUESTION_BANK = [

  // ════════════════════════════════════════════════════════════════
  // 🌟 שאלה כללית
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-general-state',
    category: 'general', houseId: 1, topicId: 'foundations',
    label: 'מה מצבי הכללי?',
    desc: 'ניתוח כוח הנפש, מצב האדם ועוצמתו ברגע הנוכחי',
    clientFields: [F.matter],
  },
  {
    id: 'q-success',
    category: 'general', houseId: 1, topicId: 'completion',
    label: 'האם הדבר יצליח?',
    desc: 'האם הצורך יתמלא — לפי סעד/נחס ויתדות',
    clientFields: [F.matter],
  },
  {
    id: 'q-geo-direction',
    category: 'general', houseId: 1, topicId: 'foundations',
    label: 'באיזה כיוון גיאוגרפי נמצא הדבר?',
    desc: 'מזרח/מערב/דרום/צפון לפי יסוד הצורה בבית 1',
    clientFields: [F.matter],
  },
  {
    id: 'q-wish',
    category: 'general', houseId: 11, topicId: 'completion',
    label: 'האם ישיג מה שרוצה?',
    desc: 'בדיקת בית 1+11+15 — האם האמל יתממש',
    clientFields: [F.matter],
  },
  {
    id: 'q-promise',
    category: 'general', houseId: 9, topicId: 'completion',
    label: 'האם יקיים את ההבטחה?',
    desc: 'האם מי שנתן הבטחה יעמוד בה',
    clientFields: [F.promiseDesc],
  },
  {
    id: 'q-dream',
    category: 'general', houseId: 9, topicId: 'travel',
    label: 'מה משמעות החלום?',
    desc: 'פרשנות חלום — לפי בית 9 (חלומות דתיים/רוחניים) ובית 3 (חלומות יומיומיים)',
    clientFields: [F.dreamDesc],
  },
  {
    id: 'q-nativity',
    category: 'general', houseId: 1, topicId: 'birthNativity',
    label: 'מה גורלי מלידה?',
    desc: 'ניתוח מולד — גורל האדם, אופיו, מה ייחודי בו',
    clientFields: [F.birthDate],
  },
  {
    id: 'q-move-city',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם כדאי לעבור מקום?',
    desc: 'השוואה: בית 1+2 (כאן) מול בית 7+8 (שם)',
    clientFields: [{ id: 'newCity', label: 'לאן שוקלים לעבור?', type: 'text', placeholder: 'עיר / מקום' }],
  },
  {
    id: 'q-best-city',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'איזו עיר עדיפה?',
    desc: 'השוואה בין שתי ערים — בית 1+2 מול בית 7+8',
    clientFields: [
      { id: 'city1', label: 'עיר ראשונה', type: 'text', placeholder: 'שם העיר' },
      { id: 'city2', label: 'עיר שנייה', type: 'text', placeholder: 'שם העיר' },
    ],
  },
  {
    id: 'q-message',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם המסר / המכתב יגיע?',
    desc: 'בית 3 — מסרים, שליחויות, מתנות, הודעות',
    clientFields: [{ id: 'msgFrom', label: 'ממי המסר?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-yearly-forecast',
    category: 'general', houseId: 10, topicId: 'yearlyForecast',
    label: 'תחזית לשנה הקרובה',
    desc: 'גורל השנה — מחירים, גשמים, שפע או מחסור, מצב כללי',
    clientFields: [F.yearForecast],
  },
  {
    id: 'q-clothing-lucky',
    category: 'general', houseId: 11, topicId: 'foundations',
    label: 'מה מזלי בלבוש?',
    desc: 'לפי כוכב בית 5+10+11 — איזה לבוש מביא מזל',
    clientFields: [],
  },

  // ════════════════════════════════════════════════════════════════
  // 🏥 בריאות וחיים
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-illness-heal',
    category: 'health', houseId: 6, topicId: 'illness',
    label: 'האם החולה יחלים?',
    desc: 'פרוגנוזה — לפי בית 1+6+7+8+13+14. צורות טובות = ישתפר, רעות = סכנה',
    clientFields: [F.symptoms, F.duration, F.treatment],
  },
  {
    id: 'q-illness-bodypart',
    category: 'health', houseId: 6, topicId: 'illness',
    label: 'איזה איבר כואב?',
    desc: 'תסכין האיברים — בית 6 מורה על האיבר הכואב (כשף עמ׳ 199)',
    clientFields: [F.symptoms],
  },
  {
    id: 'q-illness-type',
    category: 'health', houseId: 6, topicId: 'illness',
    label: 'מה סוג המחלה (אח׳לאט)?',
    desc: 'יסוד בית 1+8 → מאאי=קרירות, עפר=מרה שחורה, אש=מרה צהובה, אוויר=רוחות',
    clientFields: [F.symptoms, F.duration],
  },
  {
    id: 'q-illness-cause',
    category: 'health', houseId: 4, topicId: 'illness',
    label: 'מה מקור המחלה?',
    desc: 'בית 4 = בית סיבת המחלה — השוואה בין בית 4 לבית 6',
    clientFields: [F.symptoms, F.duration],
  },
  {
    id: 'q-lifespan',
    category: 'health', houseId: 1, topicId: 'foundations',
    label: 'האם יחיה חיים ארוכים?',
    desc: 'לפי צורות ארוכות (לבן, קהלה) וצורות קצרות (חיבור, בר הלחי, דרך, שפל ראש, אדום)',
    clientFields: [],
  },
  {
    id: 'q-lifespan-stages',
    category: 'health', houseId: 11, topicId: 'foundations',
    label: 'שלבי חיים — ראשית, אמצע וסוף',
    desc: 'לפי בתים 9+7+11 — גורל בגיל הצעיר, האמצעי, והבוגר',
    clientFields: [],
  },
  {
    id: 'q-security-h8',
    category: 'health', houseId: 8, topicId: 'deathInheritance',
    label: 'האם יש סכנת מוות / פחד גדול?',
    desc: 'בית 8 — סעד = ביטחון, נחס = פחד ומוות פתאומי',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // 💰 ממון ועסקים
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-money-state',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'מה מצב הממון?',
    desc: 'כמה כסף, האם יגיע, מה מצב הפרנסה',
    clientFields: [F.matter],
  },
  {
    id: 'q-money-source',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'מאיפה יגיע הכסף?',
    desc: 'לפי כוכב בעל הבית — שלטון/נשים/מסחר/ירושה/ספרים (כשף עמ׳ 181)',
    clientFields: [],
  },
  {
    id: 'q-livelihood',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'מה מצב הפרנסה?',
    desc: 'מאיפה תבוא הפרנסה, האם תשתפר, מכאסב ומחיה',
    clientFields: [],
  },
  {
    id: 'q-loan',
    category: 'money', houseId: 2, topicId: 'loan',
    label: 'האם החוב יוחזר?',
    desc: 'נושה ומדיון — מי יגבר. בית 1+2 מול בית 7+8',
    clientFields: [F.debtAmount, F.debtPerson, { id: 'loanDir', label: 'אני...', type: 'select', options: ['הנושה (נתתי כסף)', 'החייב (לקחתי כסף)'] }],
  },
  {
    id: 'q-trade',
    category: 'money', houseId: 7, topicId: 'commerce',
    label: 'האם העסקה תצליח?',
    desc: 'קנייה ומכירה — בית 1+2+7+8. האם יגמר הסכם',
    clientFields: [
      { id: 'tradeWhat', label: 'מה העסקה?', type: 'text', placeholder: 'נדל"ן / מכונית / מוצר...' },
      F.opponent,
    ],
  },
  {
    id: 'q-partnership',
    category: 'money', houseId: 7, topicId: 'partnership',
    label: 'האם השותפות כדאית?',
    desc: 'האם השותפות תצלח, מי ירוויח יותר',
    clientFields: [F.partnerName, F.partnerBiz, F.partnerConcern],
  },
  {
    id: 'q-who-looks-biz',
    category: 'money', houseId: 7, topicId: 'partnership',
    label: 'לאן פנויה תשומת הלב של הצד השני?',
    desc: 'האם השותף / הקונה / הצד השני עדיין מתמקד בך ובעסקה, או שכבר עבר הלאה לכיוון אחר (כשף עמ׳ 170)',
    clientFields: [F.partnerName, F.partnerConcern],
  },
  {
    id: 'q-inheritance',
    category: 'money', houseId: 2, topicId: 'deathInheritance',
    label: 'ירושה — מי יורש ומה?',
    desc: 'מי יורש, כמה, האם יגיע בפועל',
    clientFields: [
      { id: 'deceased', label: 'שם הנפטר / הקשר', type: 'text', placeholder: 'שם / אבא / סבא...' },
      { id: 'inheritConcern', label: 'מה השאלה?', type: 'textarea', placeholder: 'מחלוקת / חלוקה / זכות...' },
    ],
  },
  {
    id: 'q-treasure',
    category: 'money', houseId: 2, topicId: 'hiddenTreasure',
    label: 'האם יש מטמון נסתר?',
    desc: 'חיפוש מטמון/חבוי — בית 2+4+6+8+10. כיוון + מיקום',
    clientFields: [F.treasureDesc, F.treasureLoc],
  },
  {
    id: 'q-dig-direction',
    category: 'money', houseId: 4, topicId: 'hiddenTreasure',
    label: 'לאיזה כיוון לחפור?',
    desc: 'כיוון לחפירה — מזרח/מערב/דרום/צפון לפי יסוד הצורה',
    clientFields: [F.treasureLoc],
  },
  {
    id: 'q-well-drilling',
    category: 'money', houseId: 4, topicId: 'hiddenTreasure',
    label: 'האם יש מים בקרקע?',
    desc: 'קידוח בארות — האם יש מים, באיזה עומק (כשף עמ׳ 188-189)',
    clientFields: [F.wellLoc],
  },
  {
    id: 'q-debts',
    category: 'money', houseId: 12, topicId: 'loan',
    label: 'חובות — מה ייצא?',
    desc: 'בית 12 = חובות וכפייה. האם החוב ייגבה או יסולק',
    clientFields: [F.debtAmount, F.debtPerson],
  },

  // ════════════════════════════════════════════════════════════════
  // 👨‍👩‍👧 משפחה
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-pregnancy',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'האם יש הריון?',
    desc: 'בדיקת הריון — בית 1+5+7+8+11+15',
    clientFields: [F.pregnancyConcern],
  },
  {
    id: 'q-gender',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'זכר או נקבה?',
    desc: 'מין העובר — לפי בית 1+5 ובית 11 (אש/אוויר=זכר, מים/עפר=נקבה)',
    clientFields: [F.pregnancyMonths],
  },
  {
    id: 'q-miscarriage',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'חשש להפלה?',
    desc: 'סכנת הפלה — אדום/שפל-ראש בבית 7 = סכנה; אדום בבית 8 = הפלה',
    clientFields: [F.pregnancyMonths, F.symptoms],
  },
  {
    id: 'q-birth-ease',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'לידה קלה או קשה?',
    desc: 'בית 5 ת׳אבת = לידה קשה; מנקלב = לידה קלה (כשף עמ׳ 191)',
    clientFields: [F.pregnancyMonths],
  },
  {
    id: 'q-child-health',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'מצב בריאות הילד?',
    desc: 'בית 6 נחס = מחלות בגיל הרך; בית 8 סעד = ישתפר',
    clientFields: [{ id: 'childAge', label: 'גיל הילד', type: 'number', placeholder: 'שנים' }, F.symptoms],
  },
  {
    id: 'q-child-lifespan',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'אורך חיים של הילד?',
    desc: 'בית 5+16 שניהם סעד = אושר; שניהם נחס = ירוד (כשף עמ׳ 194)',
    clientFields: [{ id: 'childAge', label: 'גיל הילד', type: 'number', placeholder: 'שנים' }],
  },
  {
    id: 'q-siblings',
    category: 'family', houseId: 3, topicId: 'siblings',
    label: 'מצב האח / הקרוב?',
    desc: 'מצב אח, אחות, קרוב משפחה, שכן — בית 3',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-father',
    category: 'family', houseId: 4, topicId: 'foundations',
    label: 'מצב האב / הבית / הקרקע?',
    desc: 'בית 4 — אב, בית, נדל"ן, קרקע, ירושת אב',
    clientFields: [{ id: 'fatherIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'בריאות האב / בית / קרקע...' }],
  },
  {
    id: 'q-mother',
    category: 'family', houseId: 10, topicId: 'motherRules',
    label: 'מצב האם?',
    desc: 'דיני האם — בריאות, מזל, מצב האם',
    clientFields: [{ id: 'motherIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'בריאות האם / מצבה...' }],
  },
  {
    id: 'q-celebrations',
    category: 'family', houseId: 5, topicId: 'completion',
    label: 'האם תהיה שמחה / אירוע?',
    desc: 'שמחות, אירועים, ולימות, חתונות — בית 5',
    clientFields: [{ id: 'eventType', label: 'מהו האירוע?', type: 'text', placeholder: 'חתונה / בר-מצווה / מסיבה...' }],
  },
  {
    id: 'q-secrets',
    category: 'family', houseId: 4, topicId: 'hiddenTreasure',
    label: 'מה הנסתר / הסוד?',
    desc: 'בית 4 — דבר חבוי, סוד ישן, אמת שלא נאמרה',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ❤️ זוגיות ואהבה
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-marriage-fit',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'האם השידוך / הזוגיות יתאים?',
    desc: 'בית 1=שואל, בית 7=בן/בת הזוג. השוואה + עדים + דיין',
    clientFields: [F.candidate, F.candidateAge, F.obstacle],
  },
  {
    id: 'q-marriage-thayib',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'האם האישה בתולה או גרושה / אלמנה?',
    desc: 'האם האישה נשואה היתה קודם — לפי כפל 13×7 (PDF1 עמ׳ 44)',
    clientFields: [F.candidate],
  },
  {
    id: 'q-marriage-chastity',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'צניעות האישה?',
    desc: 'בדיקת נאמנות — זהרה + מריח׳ בבית 7+4 (PDF1 עמ׳ 43-44)',
    clientFields: [F.candidate],
  },
  {
    id: 'q-love',
    category: 'love', houseId: 7, topicId: 'loveHate',
    label: 'האם הוא/היא אוהב/ת אותי?',
    desc: 'עוצמת האהבה, הדדיות — בתים 1+5+11',
    clientFields: [F.loveWho, F.loveRelation, F.loveDuration],
  },
  {
    id: 'q-who-looks-love',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'לאן פונה תשומת ליבו/ה — אלי או להלאה?',
    desc: 'האם הצד השני עדיין חושב עלייך ומכוון אליך, או שכבר עבר/ה הלאה. שימושי לזוגיות, פירוד, שלום בית (כשף עמ׳ 170)',
    clientFields: [F.candidate],
  },
  {
    id: 'q-friends',
    category: 'love', houseId: 11, topicId: 'loveHate',
    label: 'האם החברים נאמנים?',
    desc: 'מצב הידידות, האם נאמנים — בית 11',
    clientFields: [{ id: 'friendName', label: 'שם / תיאור הידיד', type: 'text', placeholder: 'שם' }],
  },

  // ════════════════════════════════════════════════════════════════
  // 🔮 רוחניות ונסתרות
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-sorcery',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics',
    label: 'האם יש עלי כישוף / עין?',
    desc: 'אבחון רוחני — כישוף, עין הרע, ג׳ין. בית 6+8+9 (כשף שורה 963)',
    clientFields: [F.spiritSymptoms, F.spiritWhen, F.spiritSuspect],
  },
  {
    id: 'q-jinn-type',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics',
    label: 'מה סוג הג׳ין / ההשפעה?',
    desc: 'שיטת אסקאט: כפל בית 15 × 4; שארית 1=ג׳ין, 2=עין, 3=כישוף אדם (PDF1 עמ׳ 58)',
    clientFields: [F.spiritSymptoms, F.spiritWhen],
  },
  {
    id: 'q-sorcerer',
    category: 'spiritual', houseId: 9, topicId: 'spiritualDiagnostics',
    label: 'מי הוא המכשף / המאחז?',
    desc: 'בית 9 — הנביא/הרוחני, מי עוסק בכישוף (PDF1 עמ׳ 56)',
    clientFields: [F.spiritSuspect],
  },
  {
    id: 'q-sorcery-h10',
    category: 'spiritual', houseId: 10, topicId: 'spiritualDiagnostics',
    label: 'האם השואל מכושף?',
    desc: 'אחיאן בבית 10 = מכושף (PDF1 עמ׳ 56-57)',
    clientFields: [F.spiritSymptoms],
  },
  {
    id: 'q-religion',
    category: 'spiritual', houseId: 9, topicId: 'religion',
    label: 'שאלה בעניין דת / אמונה',
    desc: 'בית 9+3 — דת, קוראן, חכמה, עמידה רוחנית',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ✈️ נסיעה ונעדר
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-travel-safe',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'האם הנסיעה תצלח?',
    desc: 'בית 1+9 — האם הנסיעה בטוחה ותועיל',
    clientFields: [F.destination, F.travelDate, F.travelType, F.travelPurpose],
  },
  {
    id: 'q-travel-timing',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'מתי כדאי לצאת לנסיעה?',
    desc: 'בחירת זמן לנסיעה לפי בית 9 (כשף עמ׳ 238)',
    clientFields: [F.destination, F.travelType],
  },
  {
    id: 'q-travel-direction',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'לאיזה כיוון לנסוע?',
    desc: 'יסוד צורה בבית 9 → נארי=דרום, תראבי=מזרח, מאאי=צפון, הוואאי=מערב',
    clientFields: [F.travelPurpose],
  },
  {
    id: 'q-sea-voyage',
    category: 'travel', houseId: 9, topicId: 'seaVoyage',
    label: 'מסע ים — האם בטוח?',
    desc: 'ספינה, בטיחות מסע ים, סכנות מים',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-missing-alive',
    category: 'travel', houseId: 9, topicId: 'missingPerson',
    label: 'הנעדר — חי או מת?',
    desc: 'בית 1+4+8+9+12. ג׳ודלה+חמרה+ג׳מאעה בבית 4+12 = מת; סעד בבית 10 = חי',
    clientFields: [F.missingName, F.missingGender, F.missingAge, F.missingWhen, F.missingWhere],
  },
  {
    id: 'q-missing-location',
    category: 'travel', houseId: 9, topicId: 'missingPerson',
    label: 'היכן נמצא הנעדר?',
    desc: 'בית 7+9+10 — כיוון ומיקום הנעדר (כשף עמ׳ 246-250)',
    clientFields: [F.missingName, F.missingWhen, F.missingWhere],
  },
  {
    id: 'q-missing-return',
    category: 'travel', houseId: 9, topicId: 'missingPerson',
    label: 'האם הנעדר יחזור?',
    desc: 'בית 14 נשוא-ראש/כבוד-נכנס = יחזור; בית 1+7 סעד = סיכוי טוב (כשף עמ׳ 251)',
    clientFields: [F.missingName, F.missingWhen],
  },
  {
    id: 'q-fugitive',
    category: 'travel', houseId: 12, topicId: 'missingPerson',
    label: 'האם הבורח ייתפס?',
    desc: 'בורח — מיקומו, האם יוחזר (כשף עמ׳ 240-241)',
    clientFields: [
      { id: 'fugitiveName', label: 'שם הבורח', type: 'text', placeholder: 'שם' },
      { id: 'fugitiveWhen', label: 'מתי ברח?', type: 'text', placeholder: 'תאריך / מתי' },
    ],
  },
  {
    id: 'q-lost-animal',
    category: 'travel', houseId: 6, topicId: 'lostAnimal',
    label: 'האם הבהמה / חיה תחזור?',
    desc: 'האם תחזור — בית 6+8; סוג הבהמה לפי בית 6 (כשף עמ׳ 201-202)',
    clientFields: [F.animalType, F.animalWhen, F.animalWhere],
  },

  // ════════════════════════════════════════════════════════════════
  // 🏢 עבודה ומעמד
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-career-state',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'מה מצב הקריירה / התפקיד?',
    desc: 'שלטון, מעמד, כבוד — בית 1+10+11+12',
    clientFields: [F.positionName, F.positionConcern],
  },
  {
    id: 'q-career-duration',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'כמה זמן ישאר בתפקיד?',
    desc: 'מנקלב/ת׳אבת בבתים 1+4+7+10 (כשף עמ׳ 259)',
    clientFields: [F.positionName],
  },
  {
    id: 'q-career-return',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'האם יחזור לתפקיד?',
    desc: 'מסולק שרוצה לחזור — בית 1+10+11 דאח׳ל (כשף עמ׳ 266)',
    clientFields: [F.positionName],
  },
  {
    id: 'q-profession',
    category: 'career', houseId: 9, topicId: 'authorityState',
    label: 'מה המקצוע המתאים לי?',
    desc: 'לפי כוכב בית 9+10+11 — חקלאות, רפואה, מדעים, אמנות (כשף עמ׳ 254)',
    clientFields: [],
  },
  {
    id: 'q-ruler-status',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'מצב השליט / בעל הסמכות?',
    desc: 'האם השליט בסכנה — בית 7+10 → הנגזרת (כשף עמ׳ 257)',
    clientFields: [{ id: 'rulerName', label: 'שם / תיאור השליט', type: 'text', placeholder: 'מנהל / ראש עיר / שר...' }],
  },
  {
    id: 'q-stability',
    category: 'career', houseId: 11, topicId: 'authorityState',
    label: 'האם המצב יישאר יציב?',
    desc: 'דוואם אל-חאל — האם המצב הנוכחי ייגמר',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ⚖️ יריבות וסכנות
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-theft-who',
    category: 'conflict', houseId: 8, topicId: 'theft',
    label: 'מי גנב?',
    desc: 'תיאור פיזי ומקצועי של הגנב לפי בית 7 (כשף עמ׳ 231-234)',
    clientFields: [F.stolen, F.stolenWhen, F.stolenValue, F.suspect],
  },
  {
    id: 'q-theft-return',
    category: 'conflict', houseId: 8, topicId: 'theft',
    label: 'האם הגנוב יוחזר?',
    desc: 'בית 1+2 טוב + בית 7+8 רע = חוזר; הפוך = לא חוזר (כשף עמ׳ 229)',
    clientFields: [F.stolen, F.stolenWhen],
  },
  {
    id: 'q-thief-near',
    category: 'conflict', houseId: 8, topicId: 'theft',
    label: 'עד כמה הגנב קרוב לי?',
    desc: 'קרבת הגנב — האם מהבית / שכן / זר (כשף עמ׳ 224)',
    clientFields: [F.stolen, F.suspect],
  },
  {
    id: 'q-dispute',
    category: 'conflict', houseId: 7, topicId: 'disputes',
    label: 'מי ינצח בסכסוך?',
    desc: 'גאלב ומגלוב — מי יגבר. בית 1 מול בית 7 (PDF1 פרק 16)',
    clientFields: [F.opponent, F.disputeIssue, F.disputeStage],
  },
  {
    id: 'q-war',
    category: 'conflict', houseId: 7, topicId: 'disputes',
    label: 'מי ינצח במלחמה / עימות?',
    desc: 'כוח הצבאות / הצדדים — PDF1 פרק 21',
    clientFields: [F.opponent, F.disputeIssue],
  },
  {
    id: 'q-enemy',
    category: 'conflict', houseId: 7, topicId: 'enemies',
    label: 'מי האויב ועד כמה מסוכן?',
    desc: 'כוח האויב, ת׳אבת/מנקלב — בית 7 = יריב ראשי',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-hidden-enemy',
    category: 'conflict', houseId: 12, topicId: 'enemies',
    label: 'האם יש אויב נסתר?',
    desc: 'אויבים, קנאים, מחבלים — בית 1+7+12 (כשף עמ׳ 271)',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-fear',
    category: 'conflict', houseId: 12, topicId: 'fear',
    label: 'האם הפחד / הסכנה מבוססים?',
    desc: 'בית 1+6+8+12 — מקור הפחד, האם מציאותי',
    clientFields: [
      { id: 'fearWhat', label: 'ממה פוחד?', type: 'textarea', placeholder: 'תאר את הפחד / האיום' },
      { id: 'fearWhen', label: 'מתי התחיל?', type: 'text', placeholder: 'תאריך / אירוע' },
    ],
  },
  {
    id: 'q-prisoner',
    category: 'conflict', houseId: 12, topicId: 'prisoner',
    label: 'מתי ישוחרר האסיר?',
    desc: 'בית 6+10+12 — שהות בכלא, מתי יצא (PDF1 עמ׳ 53-55)',
    clientFields: [F.prisonerName, F.prisonerCharge, F.prisonerStage],
  },
  {
    id: 'q-prisoner-guilty',
    category: 'conflict', houseId: 12, topicId: 'prisoner',
    label: 'מי אחראי לכליאה?',
    desc: 'מי גרם לאסיר להיכלא — PDF1 עמ׳ 54',
    clientFields: [F.prisonerName],
  },

  // ════════════════════════════════════════════════════════════════
  // 💰 שאלות חדשות מכשף אל-אסרר
  // ════════════════════════════════════════════════════════════════

  // בית 2 — ממון
  {
    id: 'q-money-halal',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'האם הממון מותר או אסור?',
    desc: 'בית 9+11 — נוטה לתשיעי = מותר, לאחד-עשר = אסור (כשף עמ׳ 182)',
    clientFields: [F.matter],
  },

  // בית 3/4 — מעבר ונכסים
  {
    id: 'q-move-home',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם לעבור דירה / בית?',
    desc: 'בית 1+2 (כאן) מול בית 7+8 (שם) — כשף עמ׳ 182',
    clientFields: [
      { id: 'currentHome', label: 'כתובת נוכחית / שכונה', type: 'text', placeholder: 'עיר / שכונה' },
      { id: 'newHome', label: 'לאן שוקלים לעבור?', type: 'text', placeholder: 'כתובת / שכונה / עיר' },
    ],
  },
  {
    id: 'q-sell-property',
    category: 'money', houseId: 4, topicId: 'commerce',
    label: 'האם ימכר הנכס / הבית?',
    desc: 'בית 4 (הנכס) + בית 7 (הקונה) + בית 8 (התמורה) — כשף עמ׳ 218',
    clientFields: [
      { id: 'propertyType', label: 'סוג הנכס', type: 'text', placeholder: 'דירה / קרקע / חנות...' },
      { id: 'propertyPrice', label: 'מחיר מבוקש', type: 'text', placeholder: 'סכום / טווח' },
    ],
  },

  // בית 7 — קנייה ומכירה / שוק
  {
    id: 'q-buy-sell',
    category: 'money', houseId: 7, topicId: 'commerce',
    label: 'קנייה — האם העסקה תושלם?',
    desc: 'בית 1+2 (קונה) מול בית 7+8 (מוכר) + בית 10 (מתווך) — כשף עמ׳ 218',
    clientFields: [
      { id: 'dealWhat', label: 'מה רוכשים?', type: 'text', placeholder: 'נדל"ן / סחורה / רכב...' },
      { id: 'dealPrice', label: 'מחיר / תנאים', type: 'text', placeholder: 'סכום / תנאי התשלום' },
    ],
  },
  {
    id: 'q-market-price',
    category: 'money', houseId: 7, topicId: 'yearlyForecast',
    label: 'יוקר / זול — מה יהיה מחיר הסחורה?',
    desc: 'בית 2+5+10+11 — יסוד אש/רוח = יוקר, מים/עפר = זול (כשף עמ׳ 218–223)',
    clientFields: [
      { id: 'goodType', label: 'סוג הסחורה / המוצר', type: 'text', placeholder: 'חיטה / זהב / נדל"ן...' },
      { id: 'forecastPeriod', label: 'תקופה', type: 'text', placeholder: 'חודשים / עונה / שנה' },
    ],
  },

  // בית 8 — הלוואה
  {
    id: 'q-loan-give',
    category: 'money', houseId: 8, topicId: 'loan',
    label: 'האם ראוי לתת הלוואה?',
    desc: 'בית 7+8 או הכאה עם 3 — מיטיב = ייתן ויטיב; מזיק = סכנה (כשף עמ׳ 235)',
    clientFields: [F.debtAmount, F.debtPerson],
  },
  {
    id: 'q-loan-return',
    category: 'money', houseId: 8, topicId: 'loan',
    label: 'האם הלווה יחזיר את הכסף?',
    desc: 'בית 2+8 — צורה מיטיבה = יוכל להחזיר; מזיקה = יתקשה (כשף עמ׳ 235)',
    clientFields: [F.debtAmount, F.debtPerson],
  },

  // בית 9 — שני מסעות
  {
    id: 'q-two-trips',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'שני מסעות — איזה מהם עדיף?',
    desc: 'בית 9 מול בית 7 — הוצאת צורה ביניהם; מיטיב = מסע א עדיף (כשף עמ׳ 247)',
    clientFields: [
      { id: 'trip1', label: 'מסע ראשון', type: 'text', placeholder: 'יעד / מטרה' },
      { id: 'trip2', label: 'מסע שני', type: 'text', placeholder: 'יעד / מטרה' },
    ],
  },

  // בית 6 — פעולה נסתרת
  {
    id: 'q-hidden-action',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics',
    label: 'האם יש פעולה נסתרת מאחורי הדבר?',
    desc: 'האם מישהו פועל בנסתר נגד העניין — בתים 4+6+8+מאזן (כשף עמ׳ 166)',
    clientFields: [F.matter, F.spiritSymptoms],
  },

  // ════════════════════════════════════════════════════════════════
  // שאלות נוספות מסקר מלא — כשף אל-אסרר
  // ════════════════════════════════════════════════════════════════

  // בית 1 — חיים
  {
    id: 'q-lifespan-remaining',
    category: 'health', houseId: 1, topicId: 'birthNativity',
    label: 'כמה שנות חיים נותרו?',
    desc: 'אורך חיים שנותר — לפי צורות קצרות וארוכות בבית 1 (כשף עמ׳ 178)',
    clientFields: [],
  },

  // בית 3 — אחים / מקום
  {
    id: 'q-stay-place',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם כדאי להישאר במקום זה?',
    desc: 'בית 1+3 — האם להישאר או לעזוב את המקום הנוכחי (כשף עמ׳ 178)',
    clientFields: [{ id: 'stayPlace', label: 'המקום / הנסיבות', type: 'text', placeholder: 'עיר / מדינה / בית / עבודה...' }],
  },
  {
    id: 'q-sibling-eldest',
    category: 'family', houseId: 3, topicId: 'siblings',
    label: 'מי הגדול / הראשי בין האחים?',
    desc: 'קהלה ושפל ראש בבית 3 = גדולים מצד האב; גזר צורה מבית 1+3 (כשף עמ׳ 182)',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-sibling-agreement',
    category: 'family', houseId: 3, topicId: 'siblings',
    label: 'האם האחים בהסכמה או בסכסוך?',
    desc: 'בית 3 מיטיב = הסכמה; מזיק = קלקול מידות; גזר מבית 1+3, 5+3, 5+13 (כשף עמ׳ 182)',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-relative-state',
    category: 'family', houseId: 3, topicId: 'siblings',
    label: 'מצב הקרוב / החתן / החמות?',
    desc: 'הקרובים והחתנים — בית 3 מכסה גם קרובי משפחה וחתנים (הגדרת הבית)',
    clientFields: [F.siblingName, { id: 'relationType', label: 'הקשר', type: 'text', placeholder: 'חתן / חמות / גיס / דוד...' }],
  },
  {
    id: 'q-news-arrive',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם חדשות מרחוק יגיעו?',
    desc: 'בית 3 = "החדשות, השליחים" — האם שמועה או ידיעה תגיע (הגדרת הבית)',
    clientFields: [{ id: 'newsFrom', label: 'ממי / מאיפה החדשות?', type: 'text', placeholder: 'שם / מקום' }],
  },
  {
    id: 'q-dream-daily',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'חלום יומי — האם הוא בשורה?',
    desc: 'בית 3 = חלום יומי / רגיל (שונה מבית 9 שהוא חלום נבואי/דתי) — הגדרת הבית',
    clientFields: [F.dreamDesc],
  },
  {
    id: 'q-separation',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם הניתוק / הפרידה מוחלטים?',
    desc: 'בית 3 = "ההסתלקות והניתוק" — האם הפרידה סופית או זמנית (הגדרת הבית)',
    clientFields: [F.matter, { id: 'separationFrom', label: 'פרידה ממי?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-short-travel',
    category: 'travel', houseId: 3, topicId: 'siblings',
    label: 'נסיעה קצרה — האם תצלח?',
    desc: 'בית 3 = "התנועות הקרובות" — נסיעה קצרה/מקומית, שונה מנסיעה ארוכה (בית 9)',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-knowledge-success',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם הלמידה / הידע יצלחו?',
    desc: 'בית 3 = "הדעת, ההבנה, המחשבה" — שאלה על לימוד, ידע, הצלחה אינטלקטואלית (הגדרת הבית)',
    clientFields: [{ id: 'studyTopic', label: 'נושא הלמידה / הידע', type: 'text', placeholder: 'לימודים / מקצוע / מיומנות...' }],
  },
  {
    id: 'q-spiritual-path',
    category: 'spiritual', houseId: 3, topicId: 'siblings',
    label: 'האם הדרך הרוחנית / הלימוד הפנימי יצלחו?',
    desc: 'בית 3 = "העבודה הרוחנית" — שאלה על מסע פנימי, לימוד רוחני, תיקון הנפש (הגדרת הבית)',
    clientFields: [F.matter],
  },
  {
    id: 'q-joy-coming',
    category: 'general', houseId: 3, topicId: 'siblings',
    label: 'האם תבוא שמחה בקרוב?',
    desc: 'בית 3 = "השמחה" — האם יגיע אירוע שמח, טובה, אושר (הגדרת הבית)',
    clientFields: [F.matter],
  },

  // בית 5 — וולד
  {
    id: 'q-child-survive',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy',
    label: 'האם הוולד יחיה / יהיה בריא?',
    desc: 'בית 5+7+8 — האם הנולד ישרוד ויהיה בריא (כשף עמ׳ 192)',
    clientFields: [F.pregnancyConcern, F.pregnancyMonths],
  },

  // בית 7 — זוגיות
  {
    id: 'q-adultery',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'האם האישה בגדה / נואפת?',
    desc: 'בדיקת נאמנות הזוגית — בית 7+4+11; צורות נחס = בגידה (כשף עמ׳ 208)',
    clientFields: [F.candidate],
  },
  {
    id: 'q-divorce',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'האם הנישואין יתפרקו / גירושין?',
    desc: 'האם הזוג יתגרש — בית 1+7 נחס + עד 13 נחס = גירושין (כשף עמ׳ 210-211)',
    clientFields: [F.candidate, F.obstacle],
  },
  {
    id: 'q-woman-grace',
    category: 'love', houseId: 7, topicId: 'marriage',
    label: 'האם האישה תמצא חן בעיני האיש?',
    desc: 'קסם ואהבה הדדית — בית 1+7 + כוכב הבית (כשף עמ׳ 206)',
    clientFields: [F.candidate, F.candidateAge],
  },
  {
    id: 'q-reconciliation',
    category: 'conflict', houseId: 7, topicId: 'disputes',
    label: 'האם יהיה פיוס בסכסוך?',
    desc: 'האם שני הצדדים יתפייסו — בית 1+7 מיטיב + עד 13 מיטיב = פיוס (כשף עמ׳ 212)',
    clientFields: [F.opponent, F.disputeIssue],
  },

  // בית 9 — נסיעה
  {
    id: 'q-sea-or-land',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'האם הנסיעה בים או ביבשה?',
    desc: 'יסוד צורה בבית 9: מאאי=ים, תראבי/נארי=יבשה (כשף עמ׳ 239)',
    clientFields: [F.destination],
  },
  {
    id: 'q-travel-danger',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'האם יש סכנה בדרך?',
    desc: 'בית 9 נחס + צורה מזיקה = סכנה; בית 7 נחס = אויב בדרך (כשף עמ׳ 242)',
    clientFields: [F.destination, F.travelDate, F.travelType],
  },
  {
    id: 'q-travel-profit',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'האם הנוסע ירוויח?',
    desc: 'בית 2+9 מיטיב = רווח; נחס = הפסד (כשף עמ׳ 239)',
    clientFields: [F.destination, F.travelPurpose],
  },
  {
    id: 'q-traveler-return',
    category: 'travel', houseId: 9, topicId: 'travel',
    label: 'האם הנוסע יחזור?',
    desc: 'בית 1+9 דאח׳ל = חזרה; ח׳ארג׳ = יישאר בחוץ (כשף עמ׳ 244)',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-dream-omen',
    category: 'general', houseId: 9, topicId: 'travel',
    label: 'חלום — האם הוא בשורה טובה?',
    desc: 'חלום טוב או רע — בית 9 מיטיב = בשורה; נחס = אזהרה (כשף עמ׳ 253)',
    clientFields: [F.dreamDesc],
  },

  // בית 10 — סמכות / תפקיד
  {
    id: 'q-position-keep',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'האם המינוי / התפקיד ישמר?',
    desc: 'בית 10 ת׳אבת = יישמר; מנקלב = יאבד; עד 13 מכריע (כשף עמ׳ 257)',
    clientFields: [F.positionName, F.positionConcern],
  },

  // בית 11 — פרנסה
  {
    id: 'q-livelihood-arrive',
    category: 'money', houseId: 11, topicId: 'commerce',
    label: 'האם הפרנסה תגיע?',
    desc: 'בית 11 מיטיב = פרנסה תגיע; נחס = עיכוב או מניעה (כשף עמ׳ 268)',
    clientFields: [F.matter],
  },

  // בית 12 — אויבים ועונשים
  {
    id: 'q-enemy-exists',
    category: 'conflict', houseId: 12, topicId: 'enemies',
    label: 'האם יש לי אויב?',
    desc: 'האם קיים אויב — בית 1+7+12; נחס בבית 12 = אויב פעיל (כשף עמ׳ 271)',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-fear-punishment',
    category: 'conflict', houseId: 12, topicId: 'fear',
    label: 'האם יש לפחד מן העונש?',
    desc: 'בית 12 + בית 8 נחס = עונש קרוב; מיטיב = יינצל (כשף עמ׳ 273)',
    clientFields: [{ id: 'punishmentContext', label: 'ההקשר', type: 'textarea', placeholder: 'מה ההאשמה / האיום...' }],
  },

  // ════════════════════════════════════════════════════════════════
  // סקר מלא — הגדרות 12 הבתים (עמ׳ 47-52) — נושאים חסרים
  // ════════════════════════════════════════════════════════════════

  // ── בית 2 — ממון: "העוזרים, ביאת הנעדר, כתבי השלטון, מחלוקות הנשים" ──
  {
    id: 'q-helpers',
    category: 'general', houseId: 2, topicId: 'commerce',
    label: 'האם אמצא עוזר / עזרה?',
    desc: 'בית 2 = "העוזרים" — האם יבוא מי שיסייע בעניין (הגדרת הבית, עמ׳ 47)',
    clientFields: [F.matter],
  },
  {
    id: 'q-missing-money',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'האם הכסף / הרכוש שנעלם יחזור?',
    desc: 'בית 2 = "ביאת הנעדר" — חזרת ממון שנעלם, הושקע או נגנב (הגדרת הבית, עמ׳ 47)',
    clientFields: [F.debtAmount, { id: 'lostMoneyContext', label: 'הקשר', type: 'textarea', placeholder: 'כסף שניתן / הושקע / נגנב...' }],
  },
  {
    id: 'q-official-docs',
    category: 'money', houseId: 2, topicId: 'commerce',
    label: 'האם האישורים / המסמכים יתקבלו?',
    desc: 'בית 2 = "כתבי השלטון" — ויזה, רישיון, חוזה, אישור רשמי (הגדרת הבית, עמ׳ 47)',
    clientFields: [{ id: 'docType', label: 'סוג המסמך', type: 'text', placeholder: 'רישיון / אישור / ויזה / חוזה...' }],
  },
  {
    id: 'q-women-dispute',
    category: 'conflict', houseId: 2, topicId: 'disputes',
    label: 'מחלוקת עם אישה — מי ינצח?',
    desc: 'בית 2 = "מחלוקות הנשים" — סכסוך מול אישה / נשים (הגדרת הבית, עמ׳ 47)',
    clientFields: [F.opponent, F.disputeIssue],
  },

  // ── בית 4 — הורים: "החקלאות, תכלית כל דבר ואחרית עניינו" ──
  {
    id: 'q-agriculture',
    category: 'money', houseId: 4, topicId: 'yearlyForecast',
    label: 'שאלת חקלאות / אדמה — מה ייצא?',
    desc: 'בית 4 = "נכסי הקרקע, האדמות, החקלאות" — יבול, השקיה, בעלות אדמה (הגדרת הבית, עמ׳ 48)',
    clientFields: [{ id: 'landTopic', label: 'נושא השאלה', type: 'textarea', placeholder: 'יבול / השקיה / בעלות / אדמה...' }],
  },
  {
    id: 'q-matter-end',
    category: 'general', houseId: 4, topicId: 'completion',
    label: 'מה תהיה אחרית / תוצאת העניין?',
    desc: 'בית 4 = "תכלית כל דבר ואחרית עניינו" — מה יהיה הסוף (הגדרת הבית, עמ׳ 48)',
    clientFields: [F.matter],
  },

  // ── בית 5 — בנים: "האהבה, החשק, המתנות, השכנים" ──
  {
    id: 'q-love-desire',
    category: 'love', houseId: 5, topicId: 'loveHate',
    label: 'האם יש בינינו אהבה / חיבה?',
    desc: 'בית 5 = "האהבה, החשק, הידידויות" — קסם ומשיכה הדדית (הגדרת הבית, עמ׳ 48)',
    clientFields: [F.loveWho, F.loveRelation],
  },
  {
    id: 'q-gift',
    category: 'general', houseId: 5, topicId: 'loveHate',
    label: 'האם אקבל מתנה / חסד?',
    desc: 'בית 5 = "המתנות, העדינות, הנדיבות" — האם יגיע חסד, מתנה, טובה (הגדרת הבית, עמ׳ 48)',
    clientFields: [{ id: 'giftFrom', label: 'ממי?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-neighbor',
    category: 'family', houseId: 5, topicId: 'loveHate',
    label: 'מצב השכן / השכנות?',
    desc: 'בית 5 = "השכנים" — מצב השכן, האם יש שכנות טובה (הגדרת הבית, עמ׳ 48)',
    clientFields: [{ id: 'neighborIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'רעש / גדר / קשרים / עזרה...' }],
  },

  // ── בית 6 — מחלות: "הדבר האובד, פרידת האהובים" ──
  {
    id: 'q-lost-item',
    category: 'conflict', houseId: 6, topicId: 'theft',
    label: 'האם החפץ האבוד יימצא?',
    desc: 'בית 6 = "הדבר האובד" — חפץ שאבד (לא בהמה); בית 6+2 מורים על מציאתו (הגדרת הבית, עמ׳ 49)',
    clientFields: [F.stolen, F.stolenWhen, { id: 'lostWhere', label: 'היכן נראה לאחרונה?', type: 'text', placeholder: 'מקום' }],
  },
  {
    id: 'q-separation-loved',
    category: 'love', houseId: 6, topicId: 'marriage',
    label: 'האם הפרידה מאהוב/ה מוחלטת?',
    desc: 'בית 6 = "פרידת האהובים" — האם הניתוק מאדם אהוב סופי או זמני (הגדרת הבית, עמ׳ 49)',
    clientFields: [F.candidate, { id: 'separationContext', label: 'הקשר', type: 'textarea', placeholder: 'סיבה / נסיבות הפרידה...' }],
  },

  // ── בית 7 — זוגיות: "הנעשקים, תיאור מי שאינו מוכר, דברים שעברו" ──
  {
    id: 'q-wronged',
    category: 'conflict', houseId: 7, topicId: 'disputes',
    label: 'האם נפגעתי / נעשקתי עוול?',
    desc: 'בית 7 = "הנעשקים" — האם עשו לי עוול; בית 1 מול 7 מכריע (הגדרת הבית, עמ׳ 49)',
    clientFields: [F.opponent, { id: 'wrongContext', label: 'במה נפגעת?', type: 'textarea', placeholder: 'תיאור הפגיעה...' }],
  },
  {
    id: 'q-stranger-desc',
    category: 'general', houseId: 7, topicId: 'marriage',
    label: 'מה תיאורו של אדם שאינו מוכר?',
    desc: 'בית 7 = "תיאור מי שאינו מוכר" — גוף, אופי, מעמד של אדם זר (הגדרת הבית, עמ׳ 49)',
    clientFields: [{ id: 'strangerContext', label: 'הקשר', type: 'text', placeholder: 'שכן חדש / מועמד / יריב...' }],
  },
  {
    id: 'q-past-events',
    category: 'general', houseId: 7, topicId: 'completion',
    label: 'מה קרה בעבר / מה היה?',
    desc: 'בית 7 = "דברים שעברו" — בדיקת עבר לאימות הקריאה או גילוי מה שהיה (הגדרת הבית, עמ׳ 49)',
    clientFields: [F.matter],
  },

  // ── בית 8 — מוות: "נדוניית הנשים, יציאה מן הטובות, ריחוק מן הבריות" ──
  {
    id: 'q-dowry',
    category: 'family', houseId: 8, topicId: 'marriage',
    label: 'מה גובה הנדוניה / המוהר?',
    desc: 'בית 8 = "נדוניית הנשים" — גובה המוהר, הנדוניה ותנאי הנישואין (הגדרת הבית, עמ׳ 50)',
    clientFields: [F.candidate, { id: 'dowryContext', label: 'הקשר', type: 'text', placeholder: 'חתן / כלה / שדכנות...' }],
  },
  {
    id: 'q-lose-fortune',
    category: 'money', houseId: 8, topicId: 'deathInheritance',
    label: 'האם אאבד את הרכוש / המזל?',
    desc: 'בית 8 = "יציאה מן הטובות, מעבר מן הטוב אל הרע" — סכנת אובדן (הגדרת הבית, עמ׳ 50)',
    clientFields: [F.matter],
  },
  {
    id: 'q-isolation',
    category: 'health', houseId: 8, topicId: 'illness',
    label: 'האם הריחוק מן הבריות יעבור?',
    desc: 'בית 8 = "ריחוק מן הבריות" — בדידות, ניתוק חברתי, הסתגרות (הגדרת הבית, עמ׳ 50)',
    clientFields: [F.symptoms, F.duration],
  },

  // ── בית 9 — נסיעה: "המדעים, הפילוסופיה, השירה, הכרת המדע" ──
  {
    id: 'q-academic',
    category: 'general', houseId: 9, topicId: 'completion',
    label: 'האם הלימוד / המחקר / המדע יצליח?',
    desc: 'בית 9 = "המדעים, הפילוסופיה, השירה, הכרת המדע" — שאלות על לימוד אקדמי (הגדרת הבית, עמ׳ 50-51)',
    clientFields: [{ id: 'studyField', label: 'תחום הלימוד / המחקר', type: 'text', placeholder: 'רפואה / משפטים / כלכלה / גורל החול...' }],
  },

  // ── בית 10 — כבוד: "הפרסום, הקול הנשמע, הזיכרון הטוב" ──
  {
    id: 'q-fame',
    category: 'career', houseId: 10, topicId: 'authorityState',
    label: 'האם שמי ייוודע / יתפרסם?',
    desc: 'בית 10 = "הפרסום, הקול הנשמע, הזיכרון הטוב" — מוניטין, שם טוב (הגדרת הבית, עמ׳ 51)',
    clientFields: [{ id: 'fameContext', label: 'ההקשר', type: 'textarea', placeholder: 'בעסקים / בפוליטיקה / ברשתות חברתיות...' }],
  },

  // ── בית 11 — תקווה: "ניצחון, פשרה, הבטחות" ──
  {
    id: 'q-compromise',
    category: 'conflict', houseId: 11, topicId: 'loveHate',
    label: 'האם תהיה פשרה / הסדר?',
    desc: 'בית 11 = "פשרה, עדינות, נדיבות" — האם שני הצדדים יגיעו להסדר (הגדרת הבית, עמ׳ 52)',
    clientFields: [F.opponent, F.disputeIssue],
  },
  {
    id: 'q-victory-goal',
    category: 'conflict', houseId: 11, topicId: 'loveHate',
    label: 'האם אנצח / אצליח בעניין?',
    desc: 'בית 11 = "ניצחון, חוזק, כל כבוד בעניינים" — עמידה ונצחון במטרה (הגדרת הבית, עמ׳ 52)',
    clientFields: [F.matter],
  },

  // ── בית 12 — אויבים: "לשון הרע, ווסווס, מה שאינו נשלם, בעלי שני פנים" ──
  {
    id: 'q-slander',
    category: 'conflict', houseId: 12, topicId: 'enemies',
    label: 'האם מישהו מדבר עלי לשון הרע?',
    desc: 'בית 12 = "לשון הרע, קנאה, בעלי שתי לשונות" — גילוי מי מרכל (הגדרת הבית, עמ׳ 52)',
    clientFields: [{ id: 'slanderSuspect', label: 'מי חשוד?', type: 'text', placeholder: 'שם / קשר (אם יש)' }],
  },
  {
    id: 'q-obsession',
    category: 'spiritual', houseId: 12, topicId: 'spiritualDiagnostics',
    label: 'האם החרדות / הווסווס הם השפעה רוחנית?',
    desc: 'בית 12 = "הווסווס, בלבול השכל, הבדידות, המחשבה" — חרדה, מחשבות טורדניות (הגדרת הבית, עמ׳ 52)',
    clientFields: [F.spiritSymptoms, F.spiritWhen],
  },
  {
    id: 'q-stalled',
    category: 'general', houseId: 12, topicId: 'fear',
    label: 'מדוע הדבר נתקע / לא מתקיים?',
    desc: 'בית 12 = "מה שאינו נשלם, העיכוב, הסיבוך" — גורם לעיכוב (הגדרת הבית, עמ׳ 52)',
    clientFields: [F.matter],
  },
  {
    id: 'q-two-faced',
    category: 'conflict', houseId: 12, topicId: 'enemies',
    label: 'האם יש מסביבי אדם בעל פנים כפולות?',
    desc: 'בית 12 = "בעלי שני פנים ובעלי שתי לשונות" — מנגן, מרכל, בוגד (הגדרת הבית, עמ׳ 52)',
    clientFields: [{ id: 'twofacedContext', label: 'הקשר', type: 'text', placeholder: 'שם / תיאור היחסים' }],
  },
];
