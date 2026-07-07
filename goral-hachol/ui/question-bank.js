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
 *   desc       — הסבר קצר לבחירת השאלה הנכונה
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
  partnerConcern:{ id: 'partnerConcern',label: 'מה המדאיג?',              type: 'textarea', placeholder: 'חשש, מחלוקת, שאלה עסקית...' },
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
    category: 'general', houseId: 1, topicId: 'foundations', kashfTopicId: 'generalReading',
    label: 'מה מצבי הכללי?',
    desc: 'לניתוח כוללני של מצב האדם כרגע. בחר כאן כשאין שאלה ספציפית אחת',
    clientFields: [F.matter],
  },
  {
    id: 'q-success',
    category: 'general', houseId: 1, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם הדבר יצליח?',
    desc: 'בדיקה ישירה: האם ייצא הדבר שמחכים לו. מתאים לכל עניין ספציפי',
    clientFields: [F.matter],
  },
  {
    id: 'q-geo-direction',
    category: 'general', houseId: 1, topicId: 'foundations', kashfTopicId: 'generalReading',
    label: 'באיזה כיוון גיאוגרפי נמצא הדבר?',
    desc: 'לגילוי כיוון (מזרח/מערב/צפון/דרום) — לחפץ אבוד, נעדר, עניין שמקומו לא ידוע',
    clientFields: [F.matter],
  },
  {
    id: 'q-wish',
    category: 'general', houseId: 11, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם ישיג מה שרוצה?',
    desc: 'כשיש מטרה ספציפית שהלקוח שואף אליה — תפקיד, רצון, מהלך חשוב',
    clientFields: [F.matter],
  },
  {
    id: 'q-promise',
    category: 'general', houseId: 9, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם יקיים את ההבטחה?',
    desc: 'כשמישהו הבטיח משהו — האם יעמוד בהבטחה',
    clientFields: [F.promiseDesc],
  },
  {
    id: 'q-dream',
    category: 'general', houseId: 9, topicId: 'dream', kashfTopicId: 'dream',
    label: 'מה משמעות החלום?',
    desc: 'לחלום נבואי, דתי, שנחקק עמוק בזיכרון. לחלום יומיומי רגיל — בחר "חלום יומי" (בית 3)',
    clientFields: [F.dreamDesc],
  },
  {
    id: 'q-nativity',
    category: 'general', houseId: 1, topicId: 'birthNativity', kashfTopicId: 'generalReading',
    label: 'מה גורלי מלידה?',
    desc: 'ניתוח אופי, כשרונות וגורל חיים לפי יום הלידה — בדיקת מולד',
    clientFields: [F.birthDate],
  },
  {
    id: 'q-move-city',
    category: 'general', houseId: 3, topicId: 'relocation', kashfTopicId: 'relocation',
    label: 'האם כדאי לעבור מקום?',
    desc: 'להחלטת מעבר לעיר/מקום חדש — האם שם יהיה טוב יותר. לשתי ערים ספציפיות — בחר "איזו עיר עדיפה"',
    clientFields: [{ id: 'newCity', label: 'לאן שוקלים לעבור?', type: 'text', placeholder: 'עיר / מקום' }],
  },
  {
    id: 'q-best-city',
    category: 'general', houseId: 3, topicId: 'relocation', kashfTopicId: 'relocation',
    label: 'איזו עיר עדיפה?',
    desc: 'כשמתלבטים בין שתי ערים מוגדרות — השוואה ישירה',
    clientFields: [
      { id: 'city1', label: 'עיר ראשונה', type: 'text', placeholder: 'שם העיר' },
      { id: 'city2', label: 'עיר שנייה', type: 'text', placeholder: 'שם העיר' },
    ],
  },
  {
    id: 'q-message',
    category: 'general', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'האם המסר / המכתב יגיע?',
    desc: 'לכל שליחות: הודעה, מכתב, חבילה — האם תגיע ליעד',
    clientFields: [{ id: 'msgFrom', label: 'ממי המסר?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-yearly-forecast',
    category: 'general', houseId: 10, topicId: 'yearlyForecast', kashfTopicId: 'yearlyForecast',
    label: 'תחזית לשנה הקרובה',
    desc: 'גורל תקופה שלמה — שפע, מחסור, אירועים. לא שאלה ספציפית אחת',
    clientFields: [F.yearForecast],
  },
  {
    id: 'q-clothing-lucky',
    category: 'general', houseId: 11, topicId: 'foundations', kashfTopicId: 'generalReading',
    label: 'מה מזלי בלבוש?',
    desc: 'לקוח הרוצה לדעת איזה צבע/סוג לבוש מביא לו מזל',
    clientFields: [],
  },

  // ════════════════════════════════════════════════════════════════
  // 🏥 בריאות וחיים
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-illness-heal',
    category: 'health', houseId: 6, topicId: 'illness', kashfTopicId: 'illness',
    label: 'האם החולה יחלים?',
    desc: 'הפרוגנוזה: האם המחלה תחלוף והחולה יבריא',
    clientFields: [F.symptoms, F.duration, F.treatment],
  },
  {
    id: 'q-illness-bodypart',
    category: 'health', houseId: 6, topicId: 'illness', kashfTopicId: 'illness',
    label: 'איזה איבר כואב?',
    desc: 'כשהכאב לא מאובחן — לגילוי איזה איבר או מערכת גוף פגועה',
    clientFields: [F.symptoms],
  },
  {
    id: 'q-illness-type',
    category: 'health', houseId: 6, topicId: 'illness', kashfTopicId: 'illness',
    label: 'מה סוג המחלה (אח׳לאט)?',
    desc: 'לסיווג המחלה לפי ארבעת היסודות — מועיל לבחירת כיוון הטיפול',
    clientFields: [F.symptoms, F.duration],
  },
  {
    id: 'q-illness-cause',
    category: 'health', houseId: 4, topicId: 'illness', kashfTopicId: 'illness',
    label: 'מה מקור המחלה?',
    desc: 'לגילוי שורש הבעיה הרפואית — פיזי, רגשי, סביבתי',
    clientFields: [F.symptoms, F.duration],
  },
  {
    id: 'q-lifespan',
    category: 'health', houseId: 1, topicId: 'deathInheritance', kashfTopicId: 'deathInheritance',
    label: 'האם יחיה חיים ארוכים?',
    desc: 'שאלה כללית על אורך חיים — לא מיועדת לחירום רפואי',
    clientFields: [],
  },
  {
    id: 'q-lifespan-stages',
    category: 'health', houseId: 11, topicId: 'deathInheritance', kashfTopicId: 'deathInheritance',
    label: 'שלבי חיים — ראשית, אמצע וסוף',
    desc: 'ניתוח שלושת שלבי החיים: ילדות, בגרות, זקנה — מה כל שלב מביא',
    clientFields: [],
  },
  {
    id: 'q-security-h8',
    category: 'health', houseId: 8, topicId: 'deathInheritance', kashfTopicId: 'deathInheritance',
    label: 'האם יש סכנת מוות / פחד גדול?',
    desc: 'כשיש חשש ממשי מסכנה, תאונה, מחלה קשה, או אסון',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // 💰 ממון ועסקים
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-money-state',
    category: 'money', houseId: 2, topicId: 'money', kashfTopicId: 'money',
    label: 'מה מצב הממון?',
    desc: 'מצב הכסף כרגע — שאלה כללית. לעסקה ספציפית מול מישהו — בחר "האם העסקה תצליח"',
    clientFields: [F.matter],
  },
  {
    id: 'q-money-source',
    category: 'money', houseId: 2, topicId: 'money', kashfTopicId: 'money',
    label: 'מאיפה יגיע הכסף?',
    desc: 'כשצפוי כסף אך לא ידוע המקור — ממי, מאיפה, מאיזה ערוץ',
    clientFields: [],
  },
  {
    id: 'q-livelihood',
    category: 'money', houseId: 2, topicId: 'money', kashfTopicId: 'money',
    label: 'מה מצב הפרנסה?',
    desc: 'מצב הפרנסה השוטפת — האם מייצרת, האם תשתפר, מה מקורותיה',
    clientFields: [],
  },
  {
    id: 'q-loan',
    category: 'money', houseId: 2, topicId: 'loan', kashfTopicId: 'loan',
    label: 'האם החוב יוחזר?',
    desc: 'לחוב ספציפי בין שני אנשים. ציין אם אתה הנושה (נתתי כסף) או החייב (לקחתי)',
    clientFields: [F.debtAmount, F.debtPerson, { id: 'loanDir', label: 'אני...', type: 'select', options: ['הנושה (נתתי כסף)', 'החייב (לקחתי כסף)'] }],
  },
  {
    id: 'q-trade',
    category: 'money', houseId: 7, topicId: 'commerce', kashfTopicId: 'commerce',
    label: 'האם העסקה תצליח?',
    desc: 'לעסקה ספציפית מול צד שכנגד: האם הצד השני ייסגר ועסקה תושלם. שונה מ"מצב הממון" שהוא שאלה כללית',
    clientFields: [
      { id: 'tradeWhat', label: 'מה העסקה?', type: 'text', placeholder: 'נדל"ן / מכונית / מוצר...' },
      F.opponent,
    ],
  },
  {
    id: 'q-partnership',
    category: 'money', houseId: 7, topicId: 'partnership', kashfTopicId: 'partnership',
    label: 'האם השותפות כדאית?',
    desc: 'לשותפות עסקית: האם מתאים, מי ירוויח יותר, האם לסמוך על השותף',
    clientFields: [F.partnerName, F.partnerBiz, F.partnerConcern],
  },
  {
    id: 'q-who-looks-biz',
    category: 'money', houseId: 7, topicId: 'partnership', kashfTopicId: 'partnership',
    label: 'לאן פנויה תשומת הלב של הצד השני?',
    desc: 'האם הצד השני עדיין מחויב לעסקה — או כבר עבר להזדמנות אחרת. שונה מ"האם העסקה תצליח" שבודקת תוצאה — זו בודקת כוונה',
    clientFields: [F.partnerName, F.partnerConcern],
  },
  {
    id: 'q-inheritance',
    category: 'money', houseId: 2, topicId: 'deathInheritance', kashfTopicId: 'deathInheritance',
    label: 'ירושה — מי יורש ומה?',
    desc: 'לשאלות ירושה: מי יזכה, כמה, האם תהיה מחלוקת',
    clientFields: [
      { id: 'deceased', label: 'שם הנפטר / הקשר', type: 'text', placeholder: 'שם / אבא / סבא...' },
      { id: 'inheritConcern', label: 'מה השאלה?', type: 'textarea', placeholder: 'מחלוקת / חלוקה / זכות...' },
    ],
  },
  {
    id: 'q-treasure',
    category: 'money', houseId: 2, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',
    label: 'האם יש מטמון נסתר?',
    desc: 'חיפוש כסף/חפצים טמונים כשיש רמז או מקום מסוים',
    clientFields: [F.treasureDesc, F.treasureLoc],
  },
  {
    id: 'q-dig-direction',
    category: 'money', houseId: 4, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',
    label: 'לאיזה כיוון לחפור?',
    desc: 'לכיוון חיפוש בלבד — מזרח/מערב/צפון/דרום',
    clientFields: [F.treasureLoc],
  },
  {
    id: 'q-well-drilling',
    category: 'money', houseId: 4, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',
    label: 'האם יש מים בקרקע?',
    desc: 'לפני קידוח — האם שווה לנסות, ובאיזה עומק',
    clientFields: [F.wellLoc],
  },
  {
    id: 'q-debts',
    category: 'money', houseId: 12, topicId: 'loan', kashfTopicId: 'loan',
    label: 'חובות — מה ייצא?',
    desc: 'לחוב ישן שנמשך זמן רב — האם יגבה, יסולק, או יישאר תלוי',
    clientFields: [F.debtAmount, F.debtPerson],
  },

  // ════════════════════════════════════════════════════════════════
  // 👨‍👩‍👧 משפחה
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-pregnancy',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'האם יש הריון?',
    desc: 'בדיקה ישירה: האם יש הריון כרגע',
    clientFields: [F.pregnancyConcern],
  },
  {
    id: 'q-gender',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'זכר או נקבה?',
    desc: 'לקביעת מין העובר — לאחר אישור הריון',
    clientFields: [F.pregnancyMonths],
  },
  {
    id: 'q-miscarriage',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'חשש להפלה?',
    desc: 'כשיש חשש מפגיעה בהריון — האם הסיכון ממשי',
    clientFields: [F.pregnancyMonths, F.symptoms],
  },
  {
    id: 'q-birth-ease',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'לידה קלה או קשה?',
    desc: 'מה צפוי בלידה עצמה — קלה ומהירה, או מסובכת',
    clientFields: [F.pregnancyMonths],
  },
  {
    id: 'q-child-health',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'מצב בריאות הילד?',
    desc: 'לבדיקת מצב בריאות ילד — האם יחלים, מה צפוי',
    clientFields: [{ id: 'childAge', label: 'גיל הילד', type: 'number', placeholder: 'שנים' }, F.symptoms],
  },
  {
    id: 'q-child-lifespan',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'אורך חיים של הילד?',
    desc: 'שאלה על אורך חיים ואושר של ילד',
    clientFields: [{ id: 'childAge', label: 'גיל הילד', type: 'number', placeholder: 'שנים' }],
  },
  {
    id: 'q-siblings',
    category: 'family', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'מצב האח / הקרוב?',
    desc: 'לבדיקת מצב אח, אחות, קרוב משפחה, או שכן',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-father',
    category: 'family', houseId: 4, topicId: 'parentsProperty', kashfTopicId: 'parentsProperty',
    label: 'מצב האב / הבית / הקרקע?',
    desc: 'לשאלות על האב, הבית, הנכס, קרקע — גם מצב האב בריאותית',
    clientFields: [{ id: 'fatherIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'בריאות האב / בית / קרקע...' }],
  },
  {
    id: 'q-mother',
    category: 'family', houseId: 10, topicId: 'motherRules', kashfTopicId: 'motherRules',
    label: 'מצב האם?',
    desc: 'לשאלות על האם — בריאות, מזל, מצב כללי',
    clientFields: [{ id: 'motherIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'בריאות האם / מצבה...' }],
  },
  {
    id: 'q-celebrations',
    category: 'family', houseId: 5, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם תהיה שמחה / אירוע?',
    desc: 'האם בקרוב יבוא אירוע שמח — חתונה, לידה, שמחה',
    clientFields: [{ id: 'eventType', label: 'מהו האירוע?', type: 'text', placeholder: 'חתונה / בר-מצווה / מסיבה...' }],
  },
  {
    id: 'q-secrets',
    category: 'family', houseId: 4, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',
    label: 'מה הנסתר / הסוד?',
    desc: 'לגילוי סוד ישן, דבר שהוסתר, אמת שלא נאמרה',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ❤️ זוגיות ואהבה
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-marriage-fit',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם השידוך / הזוגיות יתאים?',
    desc: 'לבדיקת שידוך: האם הזוג מתאים, מה סיכויי הנישואין',
    clientFields: [F.candidate, F.candidateAge, F.obstacle],
  },
  {
    id: 'q-marriage-thayib',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם האישה בתולה או גרושה / אלמנה?',
    desc: 'לבחינת עבר האישה — האם נישאה בעבר. שאלה עדינה הדורשת הקשר מתאים',
    clientFields: [F.candidate],
  },
  {
    id: 'q-marriage-chastity',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'צניעות האישה?',
    desc: 'לספקות על נאמנות ועבר המועמדת — שאלה רגישה לפני נישואין',
    clientFields: [F.candidate],
  },
  {
    id: 'q-love',
    category: 'love', houseId: 7, topicId: 'loveHate', kashfTopicId: 'marriage',
    label: 'האם הוא/היא אוהב/ת אותי?',
    desc: 'לבדיקת עוצמת הרגשות ורמת ההדדיות — עד כמה הצד השני אוהב',
    clientFields: [F.loveWho, F.loveRelation, F.loveDuration],
  },
  {
    id: 'q-who-looks-love',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'לאן פונה תשומת ליבו/ה — אלי או להלאה?',
    desc: 'האם הצד השני עדיין חושב עלייך — או כבר עבר הלאה. מתאים לפירוד, שלום בית, קשר רדום',
    clientFields: [F.candidate],
  },
  {
    id: 'q-friends',
    category: 'love', houseId: 11, topicId: 'friendsHope', kashfTopicId: 'friendsHope',
    label: 'האם החברים נאמנים?',
    desc: 'לבדיקת כנות הידידות — האם הידידים נאמנים ואפשר לסמוך עליהם',
    clientFields: [{ id: 'friendName', label: 'שם / תיאור הידיד', type: 'text', placeholder: 'שם' }],
  },

  // ════════════════════════════════════════════════════════════════
  // 🔮 רוחניות ונסתרות
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-sorcery',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'האם יש עלי כישוף / עין?',
    desc: 'אבחון ראשוני: האם יש השפעה רוחנית כלשהי — כישוף, עין, ג׳ין',
    clientFields: [F.spiritSymptoms, F.spiritWhen, F.spiritSuspect],
  },
  {
    id: 'q-jinn-type',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'מה סוג הג׳ין / ההשפעה?',
    desc: 'לאחר שנמצאה השפעה — לזיהוי הסוג: ג׳ין, עין, או כישוף אדם',
    clientFields: [F.spiritSymptoms, F.spiritWhen],
  },
  {
    id: 'q-sorcerer',
    category: 'spiritual', houseId: 9, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'מי הוא המכשף / המאחז?',
    desc: 'לגילוי זהות מי שעוסק בכישוף — תיאור האדם מאחורי הפגיעה',
    clientFields: [F.spiritSuspect],
  },
  {
    id: 'q-sorcery-h10',
    category: 'spiritual', houseId: 10, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'האם השואל מכושף?',
    desc: 'בדיקה ישירה: האם הלקוח עצמו מכושף — כשיש תסמינים ספציפיים',
    clientFields: [F.spiritSymptoms],
  },
  {
    id: 'q-religion',
    category: 'spiritual', houseId: 9, topicId: 'religion', kashfTopicId: 'religion',
    label: 'שאלה בעניין דת / אמונה',
    desc: 'לשאלות על אמונה, קשר לה׳, פרקטיקה דתית, לימוד',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ✈️ נסיעה ונעדר
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-travel-safe',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'האם הנסיעה תצלח?',
    desc: 'לנסיעה ארוכה/לחו"ל — בטיחות והצלחה. לנסיעה קצרה/מקומית — בחר "נסיעה קצרה"',
    clientFields: [F.destination, F.travelDate, F.travelType, F.travelPurpose],
  },
  {
    id: 'q-travel-timing',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'מתי כדאי לצאת לנסיעה?',
    desc: 'לבחירת הזמן הטוב לנסיעה — מתי לצאת כדי להצליח',
    clientFields: [F.destination, F.travelType],
  },
  {
    id: 'q-travel-direction',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'לאיזה כיוון לנסוע?',
    desc: 'לכיוון גיאוגרפי — מזרח/מערב/צפון/דרום, לאדם שלא יודע לאן לפנות',
    clientFields: [F.travelPurpose],
  },
  {
    id: 'q-sea-voyage',
    category: 'travel', houseId: 9, topicId: 'seaVoyage', kashfTopicId: 'travel',
    label: 'מסע ים — האם בטוח?',
    desc: 'לנסיעת ים ספציפית — בטיחות, סכנות מים',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-missing-alive',
    category: 'travel', houseId: 9, topicId: 'missingPerson', kashfTopicId: 'missingPerson',
    label: 'הנעדר — חי או מת?',
    desc: 'השאלה הדחופה ביותר על נעדר — האם בחיים',
    clientFields: [F.missingName, F.missingGender, F.missingAge, F.missingWhen, F.missingWhere],
  },
  {
    id: 'q-missing-location',
    category: 'travel', houseId: 9, topicId: 'missingPerson', kashfTopicId: 'missingPerson',
    label: 'היכן נמצא הנעדר?',
    desc: 'לאחר אישור שהנעדר חי — לכיוון ומיקומו הגיאוגרפי',
    clientFields: [F.missingName, F.missingWhen, F.missingWhere],
  },
  {
    id: 'q-missing-return',
    category: 'travel', houseId: 9, topicId: 'missingPerson', kashfTopicId: 'missingPerson',
    label: 'האם הנעדר יחזור?',
    desc: 'לאחר אישור שחי — האם ומתי יחזור הביתה',
    clientFields: [F.missingName, F.missingWhen],
  },
  {
    id: 'q-fugitive',
    category: 'travel', houseId: 12, topicId: 'missingPerson', kashfTopicId: 'missingPerson',
    label: 'האם הבורח ייתפס?',
    desc: 'לאדם שנמלט — האם יוחזר, האם ייתפס',
    clientFields: [
      { id: 'fugitiveName', label: 'שם הבורח', type: 'text', placeholder: 'שם' },
      { id: 'fugitiveWhen', label: 'מתי ברח?', type: 'text', placeholder: 'תאריך / מתי' },
    ],
  },
  {
    id: 'q-lost-animal',
    category: 'travel', houseId: 6, topicId: 'lostAnimal', kashfTopicId: 'lostAnimal',
    label: 'האם הבהמה / חיה תחזור?',
    desc: 'לבהמה, חיית מחמד, או בעל חיים שאבד — האם יחזור',
    clientFields: [F.animalType, F.animalWhen, F.animalWhere],
  },

  // ════════════════════════════════════════════════════════════════
  // 🏢 עבודה ומעמד
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-career-state',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'מה מצב הקריירה / התפקיד?',
    desc: 'מצב תפקיד/קריירה נוכחי — האם יציב, מה מגמתו',
    clientFields: [F.positionName, F.positionConcern],
  },
  {
    id: 'q-career-duration',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'כמה זמן ישאר בתפקיד?',
    desc: 'לתפקיד שנמצאים בו — כמה זמן עוד ישמר',
    clientFields: [F.positionName],
  },
  {
    id: 'q-career-return',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'האם יחזור לתפקיד?',
    desc: 'לאחר פיטורים/עזיבה — האם יחזור לאותו תפקיד',
    clientFields: [F.positionName],
  },
  {
    id: 'q-profession',
    category: 'career', houseId: 9, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'מה המקצוע המתאים לי?',
    desc: 'לאדם שמחפש כיוון — מה המקצוע הטבעי לאופיו',
    clientFields: [],
  },
  {
    id: 'q-ruler-status',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'מצב השליט / בעל הסמכות?',
    desc: 'לבדיקת מנהיג/שליט/בעל סמכות — האם יישמר במקומו',
    clientFields: [{ id: 'rulerName', label: 'שם / תיאור השליט', type: 'text', placeholder: 'מנהל / ראש עיר / שר...' }],
  },
  {
    id: 'q-stability',
    category: 'career', houseId: 11, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'האם המצב יישאר יציב?',
    desc: 'לבדיקה האם מצב נוכחי (עבודה, זוגיות, מגורים) ימשיך כך',
    clientFields: [F.matter],
  },

  // ════════════════════════════════════════════════════════════════
  // ⚖️ יריבות וסכנות
  // ════════════════════════════════════════════════════════════════
  {
    id: 'q-theft-who',
    category: 'conflict', houseId: 8, topicId: 'theft', kashfTopicId: 'theft',
    label: 'מי גנב?',
    desc: 'לזיהוי הגנב — תיאורו הפיזי, מקצועו, קרבתו',
    clientFields: [F.stolen, F.stolenWhen, F.stolenValue, F.suspect],
  },
  {
    id: 'q-theft-return',
    category: 'conflict', houseId: 8, topicId: 'theft', kashfTopicId: 'theft',
    label: 'האם הגנוב יוחזר?',
    desc: 'כשידוע מה נגנב — האם הגנוב ייחזר',
    clientFields: [F.stolen, F.stolenWhen],
  },
  {
    id: 'q-thief-near',
    category: 'conflict', houseId: 8, topicId: 'theft', kashfTopicId: 'theft',
    label: 'עד כמה הגנב קרוב לי?',
    desc: 'האם הגנב הוא מהמשפחה, שכן קרוב, או זר לחלוטין',
    clientFields: [F.stolen, F.suspect],
  },
  {
    id: 'q-dispute',
    category: 'conflict', houseId: 7, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'מי ינצח בסכסוך?',
    desc: 'לסכסוך עם גבר — מי יגבר. לסכסוך ספציפי עם אישה — בחר "מחלוקת עם אישה"',
    clientFields: [F.opponent, F.disputeIssue, F.disputeStage],
  },
  {
    id: 'q-war',
    category: 'conflict', houseId: 7, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'מי ינצח במלחמה / עימות?',
    desc: 'לעימות/קרב בין שני צדדים — כוח ויתרון כל צד',
    clientFields: [F.opponent, F.disputeIssue],
  },
  {
    id: 'q-enemy',
    category: 'conflict', houseId: 7, topicId: 'enemies', kashfTopicId: 'enemies',
    label: 'מי האויב ועד כמה מסוכן?',
    desc: 'לאויב ידוע — מה כוחו, עד כמה מסוכן, האם יציב',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-hidden-enemy',
    category: 'conflict', houseId: 12, topicId: 'enemies', kashfTopicId: 'enemies',
    label: 'האם יש אויב נסתר?',
    desc: 'כשמרגישים שיש אויב אך לא יודעים מי — גילוי האויב הנסתר',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-fear',
    category: 'conflict', houseId: 12, topicId: 'fear', kashfTopicId: 'fear',
    label: 'האם הפחד / הסכנה מבוססים?',
    desc: 'לבדיקה האם הפחד מבוסס על מציאות — אם כן, מה מקורו',
    clientFields: [
      { id: 'fearWhat', label: 'ממה פוחד?', type: 'textarea', placeholder: 'תאר את הפחד / האיום' },
      { id: 'fearWhen', label: 'מתי התחיל?', type: 'text', placeholder: 'תאריך / אירוע' },
    ],
  },
  {
    id: 'q-prisoner',
    category: 'conflict', houseId: 12, topicId: 'prisoner', kashfTopicId: 'prisoner',
    label: 'מתי ישוחרר האסיר?',
    desc: 'לאסיר — מתי ייצא, מה צפוי בהליך',
    clientFields: [F.prisonerName, F.prisonerCharge, F.prisonerStage],
  },
  {
    id: 'q-prisoner-guilty',
    category: 'conflict', houseId: 12, topicId: 'prisoner', kashfTopicId: 'prisoner',
    label: 'מי אחראי לכליאה?',
    desc: 'לגילוי מי גרם לכליאה — מי הכניס לבעיה',
    clientFields: [F.prisonerName],
  },

  // ════════════════════════════════════════════════════════════════
  // 💰 שאלות נוספות מכשף אל-אסרר
  // ════════════════════════════════════════════════════════════════

  // בית 2 — ממון
  {
    id: 'q-money-halal',
    category: 'money', houseId: 2, topicId: 'money', kashfTopicId: 'money',
    label: 'האם הממון מותר או אסור?',
    desc: 'לבדיקה האם מקור ממון כשר — לאדם שמתלבט על כשרות הכסף שמגיע',
    clientFields: [F.matter],
  },

  // בית 3/4 — מעבר ונכסים
  {
    id: 'q-move-home',
    category: 'general', houseId: 3, topicId: 'relocation', kashfTopicId: 'relocation',
    label: 'האם לעבור דירה / בית?',
    desc: 'לדירה/בית ספציפי — האם כדאי לעבור. לשינוי עיר — בחר "האם כדאי לעבור מקום"',
    clientFields: [
      { id: 'currentHome', label: 'כתובת נוכחית / שכונה', type: 'text', placeholder: 'עיר / שכונה' },
      { id: 'newHome', label: 'לאן שוקלים לעבור?', type: 'text', placeholder: 'כתובת / שכונה / עיר' },
    ],
  },
  {
    id: 'q-sell-property',
    category: 'money', houseId: 4, topicId: 'commerce', kashfTopicId: 'commerce',
    label: 'האם ימכר הנכס / הבית?',
    desc: 'למכירת נדל"ן ספציפי: האם יימצא קונה ויסגר הסכם',
    clientFields: [
      { id: 'propertyType', label: 'סוג הנכס', type: 'text', placeholder: 'דירה / קרקע / חנות...' },
      { id: 'propertyPrice', label: 'מחיר מבוקש', type: 'text', placeholder: 'סכום / טווח' },
    ],
  },

  // בית 7 — קנייה ומכירה / שוק
  {
    id: 'q-buy-sell',
    category: 'money', houseId: 7, topicId: 'commerce', kashfTopicId: 'commerce',
    label: 'קנייה — האם העסקה תושלם?',
    desc: 'כשאני הקונה: האם המוכר ייסגר ולא יתחרט. לנדל"ן, סחורה, רכב',
    clientFields: [
      { id: 'dealWhat', label: 'מה רוכשים?', type: 'text', placeholder: 'נדל"ן / סחורה / רכב...' },
      { id: 'dealPrice', label: 'מחיר / תנאים', type: 'text', placeholder: 'סכום / תנאי התשלום' },
    ],
  },
  {
    id: 'q-market-price',
    category: 'money', houseId: 7, topicId: 'yearlyForecast', kashfTopicId: 'yearlyForecast',
    label: 'יוקר / זול — מה יהיה מחיר הסחורה?',
    desc: 'תחזית שוק: האם הסחורה תתייקר או תוזל בתקופה הקרובה',
    clientFields: [
      { id: 'goodType', label: 'סוג הסחורה / המוצר', type: 'text', placeholder: 'חיטה / זהב / נדל"ן...' },
      { id: 'forecastPeriod', label: 'תקופה', type: 'text', placeholder: 'חודשים / עונה / שנה' },
    ],
  },

  // בית 8 — הלוואה
  {
    id: 'q-loan-give',
    category: 'money', houseId: 8, topicId: 'loan', kashfTopicId: 'loan',
    label: 'האם ראוי לתת הלוואה?',
    desc: 'לפני שנותן הלוואה — האם כדאי, האם הלווה ישלם בסוף',
    clientFields: [F.debtAmount, F.debtPerson],
  },
  {
    id: 'q-loan-return',
    category: 'money', houseId: 8, topicId: 'loan', kashfTopicId: 'loan',
    label: 'האם הלווה יחזיר את הכסף?',
    desc: 'אחרי שכבר נתן — האם הלווה יוכל וירצה להחזיר',
    clientFields: [F.debtAmount, F.debtPerson],
  },

  // בית 9 — שני מסעות
  {
    id: 'q-two-trips',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'שני מסעות — איזה מהם עדיף?',
    desc: 'כשמתלבטים בין שתי נסיעות — השוואה ישירה, איזו עדיפה',
    clientFields: [
      { id: 'trip1', label: 'מסע ראשון', type: 'text', placeholder: 'יעד / מטרה' },
      { id: 'trip2', label: 'מסע שני', type: 'text', placeholder: 'יעד / מטרה' },
    ],
  },

  // בית 6 — פעולה נסתרת
  {
    id: 'q-hidden-action',
    category: 'spiritual', houseId: 6, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'האם יש פעולה נסתרת מאחורי הדבר?',
    desc: 'האם מישהו פועל בנסתר נגד העניין — לא בדרך רוחנית, אלא בפעולה סמויה',
    clientFields: [F.matter, F.spiritSymptoms],
  },

  // ════════════════════════════════════════════════════════════════
  // שאלות נוספות — סקר מלא כשף אל-אסרר
  // ════════════════════════════════════════════════════════════════

  // בית 1 — חיים
  {
    id: 'q-lifespan-remaining',
    category: 'health', houseId: 1, topicId: 'birthNativity', kashfTopicId: 'generalReading',
    label: 'כמה שנות חיים נותרו?',
    desc: 'שאלה על אורך החיים שנותר — מתאים לאדם מבוגר',
    clientFields: [],
  },

  // בית 3 — אחים / מקום
  {
    id: 'q-stay-place',
    category: 'general', houseId: 3, topicId: 'relocation', kashfTopicId: 'relocation',
    label: 'האם כדאי להישאר במקום זה?',
    desc: 'להחלטה האם להישאר (עיר, מדינה, מקום עבודה) — לא מעבר אחר',
    clientFields: [{ id: 'stayPlace', label: 'המקום / הנסיבות', type: 'text', placeholder: 'עיר / מדינה / בית / עבודה...' }],
  },
  {
    id: 'q-sibling-eldest',
    category: 'family', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'מי הגדול / הראשי בין האחים?',
    desc: 'מי הגדול/בכיר בין האחים — גם בהקשר ירושה וסמכות',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-sibling-agreement',
    category: 'family', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'האם האחים בהסכמה או בסכסוך?',
    desc: 'מצב היחסים בין האחים — שלום בית או סכסוך ביניהם',
    clientFields: [F.siblingName, F.siblingIssue],
  },
  {
    id: 'q-relative-state',
    category: 'family', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'מצב הקרוב / החתן / החמות?',
    desc: 'לקרוב משפחה שאינו אח — חתן, חמות, גיס, דוד',
    clientFields: [F.siblingName, { id: 'relationType', label: 'הקשר', type: 'text', placeholder: 'חתן / חמות / גיס / דוד...' }],
  },
  {
    id: 'q-news-arrive',
    category: 'general', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'האם חדשות מרחוק יגיעו?',
    desc: 'האם תגיע ידיעה/חדשות ממקום רחוק בקרוב',
    clientFields: [{ id: 'newsFrom', label: 'ממי / מאיפה החדשות?', type: 'text', placeholder: 'שם / מקום' }],
  },
  {
    id: 'q-dream-daily',
    category: 'general', houseId: 3, topicId: 'dream', kashfTopicId: 'dream',
    label: 'חלום יומי — האם הוא בשורה?',
    desc: 'לחלום רגיל/יומיומי. לחלום נבואי/דתי שנחקק — בחר "מה משמעות החלום" (בית 9)',
    clientFields: [F.dreamDesc],
  },
  {
    id: 'q-separation',
    category: 'general', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'האם הניתוק / הפרידה מוחלטים?',
    desc: 'לפרידה מאדם, מקום, או קשר — האם מוחלטת או זמנית',
    clientFields: [F.matter, { id: 'separationFrom', label: 'פרידה ממי?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-short-travel',
    category: 'travel', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'נסיעה קצרה — האם תצלח?',
    desc: 'לנסיעה קצרה/מקומית/ביום אחד. לנסיעה ארוכה/לחו"ל — בחר "האם הנסיעה תצלח"',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-knowledge-success',
    category: 'general', houseId: 3, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם הלמידה / הידע יצלחו?',
    desc: 'לרכישת ידע/מיומנות עצמאית — האם הלמידה תניב הצלחה',
    clientFields: [{ id: 'studyTopic', label: 'נושא הלמידה / הידע', type: 'text', placeholder: 'לימודים / מקצוע / מיומנות...' }],
  },
  {
    id: 'q-spiritual-path',
    category: 'spiritual', houseId: 3, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם הדרך הרוחנית / הלימוד הפנימי יצלחו?',
    desc: 'לבדיקת התקדמות ברוחניות — האם המסע הפנימי יניב פרי',
    clientFields: [F.matter],
  },
  {
    id: 'q-joy-coming',
    category: 'general', houseId: 3, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'האם תבוא שמחה בקרוב?',
    desc: 'האם בקרוב יגיע אירוע שמח, חדשות טובות, שיפור',
    clientFields: [F.matter],
  },

  // בית 5 — וולד
  {
    id: 'q-child-survive',
    category: 'family', houseId: 5, topicId: 'childrenPregnancy', kashfTopicId: 'children',
    label: 'האם הוולד יחיה / יהיה בריא?',
    desc: 'לשאלת הישרדות ובריאות הנולד בשלב מיד לאחר הלידה',
    clientFields: [F.pregnancyConcern, F.pregnancyMonths],
  },

  // בית 7 — זוגיות
  {
    id: 'q-adultery',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם האישה בגדה / נואפת?',
    desc: 'כשיש חשד לבגידה — בדיקה ישירה. שאלה רגישה',
    clientFields: [F.candidate],
  },
  {
    id: 'q-divorce',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם הנישואין יתפרקו / גירושין?',
    desc: 'כשיש חשש לגירושין — האם הזוג ייפרד',
    clientFields: [F.candidate, F.obstacle],
  },
  {
    id: 'q-woman-grace',
    category: 'love', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם האישה תמצא חן בעיני האיש?',
    desc: 'לפני שידוך — האם יהיה כימיה הדדית ומשיכה',
    clientFields: [F.candidate, F.candidateAge],
  },
  {
    id: 'q-reconciliation',
    category: 'conflict', houseId: 7, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'האם יהיה פיוס בסכסוך?',
    desc: 'האם שני הצדדים יתפייסו — כשרוצים פשרה ולא ניצחון',
    clientFields: [F.opponent, F.disputeIssue],
  },

  // בית 9 — נסיעה
  {
    id: 'q-sea-or-land',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'האם הנסיעה בים או ביבשה?',
    desc: 'לאיתור אופי הנסיעה — שימושי כשלא ידוע כיוון הנעדר',
    clientFields: [F.destination],
  },
  {
    id: 'q-travel-danger',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'האם יש סכנה בדרך?',
    desc: 'כשיש חשש מסכנות ספציפיות בנסיעה — האם הדרך בטוחה',
    clientFields: [F.destination, F.travelDate, F.travelType],
  },
  {
    id: 'q-travel-profit',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'האם הנוסע ירוויח?',
    desc: 'לנסיעת עסקים: האם הנסיעה תביא רווח כספי',
    clientFields: [F.destination, F.travelPurpose],
  },
  {
    id: 'q-traveler-return',
    category: 'travel', houseId: 9, topicId: 'travel', kashfTopicId: 'travel',
    label: 'האם הנוסע יחזור?',
    desc: 'לנוסע שכבר יצא לדרך — האם ישוב הביתה',
    clientFields: [F.destination, F.travelDate],
  },
  {
    id: 'q-dream-omen',
    category: 'general', houseId: 9, topicId: 'dream', kashfTopicId: 'dream',
    label: 'חלום — האם הוא בשורה טובה?',
    desc: 'האם חלום ספציפי הוא בשורה טובה או רעה — לחלום שחקוק בזיכרון',
    clientFields: [F.dreamDesc],
  },

  // בית 10 — סמכות / תפקיד
  {
    id: 'q-position-keep',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'האם המינוי / התפקיד ישמר?',
    desc: 'לאחר קבלת תפקיד/מינוי — האם יישמר, או יאבד',
    clientFields: [F.positionName, F.positionConcern],
  },

  // בית 11 — פרנסה
  {
    id: 'q-livelihood-arrive',
    category: 'money', houseId: 11, topicId: 'money', kashfTopicId: 'money',
    label: 'האם הפרנסה תגיע?',
    desc: 'לפרנסה ספציפית שמצופה: שכר, עסק, הכנסה — האם תגיע',
    clientFields: [F.matter],
  },

  // בית 12 — אויבים ועונשים
  {
    id: 'q-enemy-exists',
    category: 'conflict', houseId: 12, topicId: 'enemies', kashfTopicId: 'enemies',
    label: 'האם יש לי אויב?',
    desc: 'בדיקה ראשונית — האם בכלל יש אויב פעיל',
    clientFields: [F.enemyWho, F.enemyWhat],
  },
  {
    id: 'q-fear-punishment',
    category: 'conflict', houseId: 12, topicId: 'fear', kashfTopicId: 'fear',
    label: 'האם יש לפחד מן העונש?',
    desc: 'כשיש חשש מעונש — האם יתממש, האם אפשר לצאת ממנו',
    clientFields: [{ id: 'punishmentContext', label: 'ההקשר', type: 'textarea', placeholder: 'מה ההאשמה / האיום...' }],
  },

  // ════════════════════════════════════════════════════════════════
  // סקר מלא — הגדרות 12 הבתים — נושאים חסרים
  // ════════════════════════════════════════════════════════════════

  // ── בית 2 — ממון: "העוזרים, ביאת הנעדר, כתבי השלטון, מחלוקות הנשים" ──
  {
    id: 'q-helpers',
    category: 'general', houseId: 2, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם אמצא עוזר / עזרה?',
    desc: 'כשצריך מישהו לסייע — האם יימצא מי שיעזור',
    clientFields: [F.matter],
  },
  {
    id: 'q-missing-money',
    category: 'money', houseId: 2, topicId: 'money', kashfTopicId: 'money',
    label: 'האם הכסף / הרכוש שנעלם יחזור?',
    desc: 'לכסף שנעלם, הושקע ולא חזר, או נגנב — האם יוחזר. לגילוי הגנב — בחר "מי גנב"',
    clientFields: [F.debtAmount, { id: 'lostMoneyContext', label: 'הקשר', type: 'textarea', placeholder: 'כסף שניתן / הושקע / נגנב...' }],
  },
  {
    id: 'q-official-docs',
    category: 'money', houseId: 2, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'האם האישורים / המסמכים יתקבלו?',
    desc: 'לאישורים רשמיים: ויזה, רישיון, חוזה — האם יאושרו',
    clientFields: [{ id: 'docType', label: 'סוג המסמך', type: 'text', placeholder: 'רישיון / אישור / ויזה / חוזה...' }],
  },
  {
    id: 'q-women-dispute',
    category: 'conflict', houseId: 2, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'מחלוקת עם אישה — מי ינצח?',
    desc: 'לסכסוך ספציפי מול אישה — כסף, ירושה, גט. לסכסוך עם גבר — בחר "מי ינצח בסכסוך"',
    clientFields: [F.opponent, F.disputeIssue],
  },

  // ── בית 4 — הורים: "החקלאות, תכלית כל דבר ואחרית עניינו" ──
  {
    id: 'q-agriculture',
    category: 'money', houseId: 4, topicId: 'yearlyForecast', kashfTopicId: 'yearlyForecast',
    label: 'שאלת חקלאות / אדמה — מה ייצא?',
    desc: 'לשאלות אדמה וחקלאות: יבול, השקיה, בעלות קרקע',
    clientFields: [{ id: 'landTopic', label: 'נושא השאלה', type: 'textarea', placeholder: 'יבול / השקיה / בעלות / אדמה...' }],
  },
  {
    id: 'q-matter-end',
    category: 'general', houseId: 4, topicId: 'completion', kashfTopicId: 'completion',
    label: 'מה תהיה אחרית / תוצאת העניין?',
    desc: 'לעניין פתוח — מה יהיה הסוף הסופי. שאלה על תוצאה אחרונה',
    clientFields: [F.matter],
  },

  // ── בית 5 — בנים: "האהבה, החשק, המתנות, השכנים" ──
  {
    id: 'q-love-desire',
    category: 'love', houseId: 5, topicId: 'loveHate', kashfTopicId: 'marriage',
    label: 'האם יש בינינו אהבה / חיבה?',
    desc: 'לבדיקת קיום אהבה בין שני אנשים — גם חברים, גם זוג',
    clientFields: [F.loveWho, F.loveRelation],
  },
  {
    id: 'q-gift',
    category: 'general', houseId: 5, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם אקבל מתנה / חסד?',
    desc: 'האם יגיע חסד, מתנה, או טובה ממישהו',
    clientFields: [{ id: 'giftFrom', label: 'ממי?', type: 'text', placeholder: 'שם / קשר' }],
  },
  {
    id: 'q-neighbor',
    category: 'family', houseId: 5, topicId: 'siblings', kashfTopicId: 'siblings',
    label: 'מצב השכן / השכנות?',
    desc: 'מצב השכן, האם השכנות תקינה, האם יש בעיות',
    clientFields: [{ id: 'neighborIssue', label: 'מה השאלה?', type: 'textarea', placeholder: 'רעש / גדר / קשרים / עזרה...' }],
  },

  // ── בית 6 — מחלות: "הדבר האובד, פרידת האהובים" ──
  {
    id: 'q-lost-item',
    category: 'conflict', houseId: 6, topicId: 'theft', kashfTopicId: 'theft',
    label: 'האם החפץ האבוד יימצא?',
    desc: 'לחפץ שאבד (לא כסף, לא בהמה) — האם יימצא. לאובדן כסף — בחר "הכסף שנעלם"',
    clientFields: [F.stolen, F.stolenWhen, { id: 'lostWhere', label: 'היכן נראה לאחרונה?', type: 'text', placeholder: 'מקום' }],
  },
  {
    id: 'q-separation-loved',
    category: 'love', houseId: 6, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'האם הפרידה מאהוב/ה מוחלטת?',
    desc: 'האם פרידה מאדם אהוב היא סופית — לניתוק שאינו גירושין (חבר, ידיד, משפחה)',
    clientFields: [F.candidate, { id: 'separationContext', label: 'הקשר', type: 'textarea', placeholder: 'סיבה / נסיבות הפרידה...' }],
  },

  // ── בית 7 — זוגיות: "הנעשקים, תיאור מי שאינו מוכר, דברים שעברו" ──
  {
    id: 'q-wronged',
    category: 'conflict', houseId: 7, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'האם נפגעתי / נעשקתי עוול?',
    desc: 'כשמרגישים שנפגעתי — האם העוול אמיתי וחוקי',
    clientFields: [F.opponent, { id: 'wrongContext', label: 'במה נפגעת?', type: 'textarea', placeholder: 'תיאור הפגיעה...' }],
  },
  {
    id: 'q-stranger-desc',
    category: 'general', houseId: 7, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'מה תיאורו של אדם שאינו מוכר?',
    desc: 'לתיאור אדם לא מוכר — מראה, אופי, מקצוע, קרבה',
    clientFields: [{ id: 'strangerContext', label: 'הקשר', type: 'text', placeholder: 'שכן חדש / מועמד / יריב...' }],
  },
  {
    id: 'q-past-events',
    category: 'general', houseId: 7, topicId: 'completion', kashfTopicId: 'completion',
    label: 'מה קרה בעבר / מה היה?',
    desc: 'לגילוי מה קרה בעבר — לאימות קריאה או גילוי עבר נסתר',
    clientFields: [F.matter],
  },

  // ── בית 8 — מוות: "נדוניית הנשים, יציאה מן הטובות, ריחוק מן הבריות" ──
  {
    id: 'q-dowry',
    category: 'family', houseId: 8, topicId: 'marriage', kashfTopicId: 'marriage',
    label: 'מה גובה הנדוניה / המוהר?',
    desc: 'לגובה המוהר ותנאי הנישואין — לשדכנות ומשא ומתן',
    clientFields: [F.candidate, { id: 'dowryContext', label: 'הקשר', type: 'text', placeholder: 'חתן / כלה / שדכנות...' }],
  },
  {
    id: 'q-lose-fortune',
    category: 'money', houseId: 8, topicId: 'deathInheritance', kashfTopicId: 'deathInheritance',
    label: 'האם אאבד את הרכוש / המזל?',
    desc: 'כשיש חשש מאובדן רכוש, מזל, או מעמד — האם יתממש',
    clientFields: [F.matter],
  },
  {
    id: 'q-isolation',
    category: 'health', houseId: 8, topicId: 'illness', kashfTopicId: 'illness',
    label: 'האם הריחוק מן הבריות יעבור?',
    desc: 'לבדידות וניתוק חברתי — האם מצב זה יעבור',
    clientFields: [F.symptoms, F.duration],
  },

  // ── בית 9 — נסיעה: "המדעים, הפילוסופיה, השירה, הכרת המדע" ──
  {
    id: 'q-academic',
    category: 'general', houseId: 9, topicId: 'completion', kashfTopicId: 'completion',
    label: 'האם הלימוד / המחקר / המדע יצליח?',
    desc: 'לתלמידים ואקדמאים — האם הלימוד/המחקר יניב הצלחה',
    clientFields: [{ id: 'studyField', label: 'תחום הלימוד / המחקר', type: 'text', placeholder: 'רפואה / משפטים / כלכלה / גורל החול...' }],
  },

  // ── בית 10 — כבוד: "הפרסום, הקול הנשמע, הזיכרון הטוב" ──
  {
    id: 'q-fame',
    category: 'career', houseId: 10, topicId: 'authorityState', kashfTopicId: 'authorityState',
    label: 'האם שמי ייוודע / יתפרסם?',
    desc: 'לבדיקת פרסום ושם טוב — האם ייבנה מוניטין',
    clientFields: [{ id: 'fameContext', label: 'ההקשר', type: 'textarea', placeholder: 'בעסקים / בפוליטיקה / ברשתות חברתיות...' }],
  },

  // ── בית 11 — תקווה: "ניצחון, פשרה, הבטחות" ──
  {
    id: 'q-compromise',
    category: 'conflict', houseId: 11, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'האם תהיה פשרה / הסדר?',
    desc: 'האם ייוצר הסדר בין הצדדים — כשרוצים פשרה ולא ניצחון',
    clientFields: [F.opponent, F.disputeIssue],
  },
  {
    id: 'q-victory-goal',
    category: 'conflict', houseId: 11, topicId: 'disputes', kashfTopicId: 'disputes',
    label: 'האם אנצח / אצליח בעניין?',
    desc: 'כשיש מאבק/מטרה ורוצים לנצח — האם יצליח',
    clientFields: [F.matter],
  },

  // ── בית 12 — אויבים: "לשון הרע, ווסווס, מה שאינו נשלם, בעלי שני פנים" ──
  {
    id: 'q-slander',
    category: 'conflict', houseId: 12, topicId: 'enemies', kashfTopicId: 'enemies',
    label: 'האם מישהו מדבר עלי לשון הרע?',
    desc: 'כשחושדים שמדברים עלי — מי, ומה מדברים',
    clientFields: [{ id: 'slanderSuspect', label: 'מי חשוד?', type: 'text', placeholder: 'שם / קשר (אם יש)' }],
  },
  {
    id: 'q-obsession',
    category: 'spiritual', houseId: 12, topicId: 'spiritualDiagnostics', kashfTopicId: 'spiritualDiagnostics',
    label: 'האם החרדות / הווסווס הם השפעה רוחנית?',
    desc: 'כשיש חרדות, מחשבות טורדניות, בלבול — האם זה רוחני או פסיכולוגי',
    clientFields: [F.spiritSymptoms, F.spiritWhen],
  },
  {
    id: 'q-stalled',
    category: 'general', houseId: 12, topicId: 'fear', kashfTopicId: 'fear',
    label: 'מדוע הדבר נתקע / לא מתקיים?',
    desc: 'כשדבר תקוע ולא מתקדם — לאיתור גורם העיכוב',
    clientFields: [F.matter],
  },
  {
    id: 'q-two-faced',
    category: 'conflict', houseId: 12, topicId: 'enemies', kashfTopicId: 'enemies',
    label: 'האם יש מסביבי אדם בעל פנים כפולות?',
    desc: 'כשחושדים במכר — גילוי מי מנגן/מרכל/בוגד',
    clientFields: [{ id: 'twofacedContext', label: 'הקשר', type: 'text', placeholder: 'שם / תיאור היחסים' }],
  },
];
