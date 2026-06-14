/**
 * kashf-chapter-map.js
 *
 * מיפוי 12 הפרקים של כשף-אל-אסראר לנושאי האפליקציה.
 *
 * עבור כל פרק מוגדר:
 *   - topicId       : מזהה הנושא (תואם TOPIC_MAIN_HOUSES ב-hawi-interpreter.js)
 *   - kashfChapter  : מספר הפרק בספר (1-12)
 *   - verdictHouses : הבתים שמשלבים ליצירת צורת-הפסיקה [bX, bY]
 *   - verdictType   : סוג הפסיקה (מפנה לטבלת VERDICT_TEMPLATES)
 *   - sourceRef     : עמוד/קטע בספר המקורי
 *   - confidence    : 'explicit' = מצוטט ישירות | 'derived' = נגזר מהספר | 'todo' = דורש אימות
 */

/**
 * תבניות פסיקה לפי ח'ארג'/דאח'ל × סעד/נחס.
 * 4 קטגוריות: kharij | dakhil | mujassad-kharij | mujassad-dakhil
 * × 3 איכויות: saad | nahs | mixed
 */
export const VERDICT_TEMPLATES = {

  'exit-or-stay': {
    'kharij':          { saad: 'יצא מהכלא — ובשלום ובקרוב',              nahs: 'יצא מהכלא — אך עם קושי ועיכוב',              mixed: 'יצא מהכלא' },
    'dakhil':          { saad: 'לא יצא עכשיו — אך מצבו בסדר',            nahs: 'לא יצא — מצבו קשה בכלא',                     mixed: 'לא יצא מהכלא' },
    'mujassad-kharij': { saad: 'הדבר תלוי — ייתכן יצא, נוטה לשחרור',    nahs: 'הדבר תלוי — עיכוב, אך לא סגור',              mixed: 'גורל האסיר לא ברור — הזמן יכריע' },
    'mujassad-dakhil': { saad: 'הדבר תלוי — ישאר עוד זמן, מצבו סביר',   nahs: 'הדבר תלוי — ישאר, המצב קשה',                 mixed: 'גורל האסיר אינו ברור' },
  },

  'recover-or-not': {
    'kharij':          { saad: 'החולה יבריא — פרוגנוזה טובה',             nahs: 'החולה יבריא אך לאט ובקושי',                  mixed: 'יבריא' },
    'dakhil':          { saad: 'המחלה תיגרר — אין סכנת חיים, אך לא יבריא בקרוב', nahs: 'מצב קשה — יש חשש לסיבוכים',          mixed: 'לא יבריא בקרוב' },
    'mujassad-kharij': { saad: 'המחלה בין החמרה להבראה — נוטה להבראה',   nahs: 'המחלה מעורפלת — נוטה להחמרה',               mixed: 'מצב המחלה אינו ברור' },
    'mujassad-dakhil': { saad: 'המחלה מתמשכת — יש תקווה, אך איטי',       nahs: 'המחלה מתמשכת — המצב עדיין קשה',              mixed: 'המחלה נמשכת ללא הכרעה' },
  },

  'happen-or-not': {
    'kharij':          { saad: 'הדבר יתממש — ובשעה טובה',                 nahs: 'הדבר יתממש — אך עם מכשולים בדרך',           mixed: 'הדבר יתממש' },
    'dakhil':          { saad: 'הדבר לא יתממש בשלב זה — אך אין נזק',     nahs: 'הדבר לא יתממש — יש מכשולים',                 mixed: 'הדבר לא יתממש עכשיו' },
    'mujassad-kharij': { saad: 'הדבר מעוכב — הזמן לא בשל, נוטה לקרות',  nahs: 'הדבר מעוכב — הזמן לא בשל, נוטה לא לקרות', mixed: 'הדבר תלוי ועומד' },
    'mujassad-dakhil': { saad: 'הדבר עצור — קשה להתקדם, אך יש אפשרות',  nahs: 'הדבר עצור — המצב לא נוח לכך',               mixed: 'הדבר לא זזה לשום כיוון' },
  },

  'alive-or-feared': {
    'kharij':          { saad: 'הנעדר חי ויחזור בקרוב — ובשלום',          nahs: 'הנעדר חי אך במצב קשה — עוד ייחזר',         mixed: 'הנעדר חי' },
    'dakhil':          { saad: 'הנעדר לא ייחזר בקרוב — יש לחוש שמצבו קשה', nahs: 'יש חשש שהנעדר מת — סכנה ממשית',         mixed: 'גורל הנעדר מוטל בספק' },
    'mujassad-kharij': { saad: 'גורל הנעדר לא ברור — נוטה לחיים ולחזרה', nahs: 'גורל הנעדר לא ברור — יש חשש',              mixed: 'גורל הנעדר אינו ברור' },
    'mujassad-dakhil': { saad: 'הנעדר קיים — אך נמצא רחוק ועצור',        nahs: 'יש חשש ממשי — הנעדר לא ייחזר בקלות',       mixed: 'עקבות הנעדר מעורפלים' },
  },

  'win-or-lose': {
    'kharij':          { saad: 'השואל ינצח — הפסיקה לטובתו',              nahs: 'השואל ינצח אך יהיה מחיר',                    mixed: 'השואל יגבר' },
    'dakhil':          { saad: 'השואל לא ינצח — כדאי לפשר',               nahs: 'השואל יפסיד — המצב לרעתו',                   mixed: 'השואל לא יגבר עכשיו' },
    'mujassad-kharij': { saad: 'ההכרעה תלויה — נוטה לטובת השואל',        nahs: 'ההכרעה תלויה — נוטה לרעת השואל',             mixed: 'ההכרעה לא הוכרעה' },
    'mujassad-dakhil': { saad: 'הסכסוך ייסגר — אך לא כפי שהשואל ציפה',  nahs: 'הסכסוך מתמשך — בלי הכרעה ברורה',             mixed: 'הסכסוך תקוע ללא פתרון' },
  },

  'profit-or-loss': {
    'kharij':          { saad: 'יהיה רווח — עסקה טובה',                   nahs: 'יהיה רווח אך קטן — מכשולים בדרך',           mixed: 'יהיה רווח' },
    'dakhil':          { saad: 'לא יהיה רווח עכשיו — אך הכסף שמור',      nahs: 'הפסד צפוי — יש להיזהר',                      mixed: 'לא יהיה רווח כרגע' },
    'mujassad-kharij': { saad: 'הרווח תלוי — הזמן עדיין לא בשל',         nahs: 'ספק אם יהיה רווח — אפשר להפסיד',            mixed: 'תוצאת העסקה לא ברורה' },
    'mujassad-dakhil': { saad: 'העסקה עצורה — הכסף שם אך לא זז',         nahs: 'העסקה עצורה — סיכון להפסד',                  mixed: 'העסקה תקועה ללא הכרעה' },
  },

  'found-or-lost': {
    'kharij':          { saad: 'האובד יימצא — ובמהרה',                    nahs: 'האובד יימצא — אך בקושי',                     mixed: 'האובד יימצא' },
    'dakhil':          { saad: 'האובד לא יימצא בקרוב — אך לא אבד לצמיתות', nahs: 'האובד אבד — קשה להחזירו',                 mixed: 'האובד לא יימצא עכשיו' },
    'mujassad-kharij': { saad: 'מיקום האובד לא ברור — נוטה להימצא',      nahs: 'מיקום האובד לא ברור — נוטה לאבד',           mixed: 'גורל האובד לא ברור' },
    'mujassad-dakhil': { saad: 'האובד קרוב אך עדיין מוסתר',              nahs: 'האובד עמוק מדי — קשה לאתרו',                 mixed: 'האובד במקום שקשה להגיע אליו' },
  },

  'danger-or-safe': {
    'kharij':          { saad: 'הסכנה עוברת — אין חשש ממשי',             nahs: 'הסכנה קיימת — יש להיזהר',                    mixed: 'הסכנה עוברת אך זהירות נדרשת' },
    'dakhil':          { saad: 'הפחד גדול מהמציאות — אין סכנה ממשית',    nahs: 'הסכנה ממשית — נחוצה זהירות רבה',             mixed: 'הסכנה לא מוחלטת' },
    'mujassad-kharij': { saad: 'מצב מעורפל — נוטה לבטחה',               nahs: 'מצב מעורפל — נוטה לסכנה',                    mixed: 'לא ניתן לקבוע בוודאות' },
    'mujassad-dakhil': { saad: 'הסכנה תלויה — הזמן יכריע, נוטה לסדר',  nahs: 'הסכנה נשארת — יש לנהוג בזהירות',             mixed: 'מצב הסכנה אינו ברור' },
  },

  'death-or-safe': {
    'kharij':          { saad: 'אין סכנת חיים ממשית — הגוף חזק',         nahs: 'יש חשש ממשי — יש לנקוט פעולה',              mixed: 'הסכנה קיימת אך לא מוחלטת' },
    'dakhil':          { saad: 'הסכנה אינה מיידית — יש זמן לפעול',       nahs: 'סכנה גדולה — יש לפעול כעת',                  mixed: 'הסכנה לא ברורה עדיין' },
    'mujassad-kharij': { saad: 'מצב לא ברור — נוטה לבטחה',              nahs: 'מצב לא ברור — נוטה לסכנה',                   mixed: 'הלוח אינו מכריע' },
    'mujassad-dakhil': { saad: 'הסכנה עוברת — אך לאט',                  nahs: 'הסכנה נמשכת — יש להיזהר',                    mixed: 'המשבר תלוי ועומד' },
  },

  'spiritual-or-natural': {
    'kharij':          { saad: 'אין פגיעה רוחנית — הקושי מקורו גופני או נפשי', nahs: 'יש פגיעה רוחנית — נחוצה בדיקה נוספת', mixed: 'סימני פגיעה — לא מובהקים' },
    'dakhil':          { saad: 'פגיעה קלה בלבד — ניתן להתגבר',           nahs: 'פגיעה עמוקה — יש לפעול לטיפול',              mixed: 'מצב רוחני לא ברור — צריך לבדוק עוד' },
    'mujassad-kharij': { saad: 'הסימנים לא מובהקים — נוטה לנקיון',      nahs: 'הסימנים לא מובהקים — נוטה לפגיעה',           mixed: 'המצב הרוחני מעורפל' },
    'mujassad-dakhil': { saad: 'קושי רוחני קל — לא חמור, יש תקווה',     nahs: 'קושי רוחני מתמשך — נחוץ טיפול ממוקד',        mixed: 'לא ניתן לקבוע — יש לבדוק עוד' },
  },
};

export const KASHF_CHAPTER_MAP = [

  {
    topicId:       'illness',
    kashfChapter:  3,
    chapterNameHebrew: 'החולה / המחלה',
    chapterNameArabic: 'فصل في المريض',
    verdictHouses: [1, 6],
    verdictMethod: 'combine',
    verdictType:   'recover-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 191–210',
    confidence:    'derived',
  },

  {
    topicId:       'marriage',
    kashfChapter:  4,
    chapterNameHebrew: 'נישואין / זוגיות',
    chapterNameArabic: 'فصل في النكاح',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 211–225',
    confidence:    'derived',
  },

  {
    topicId:       'childrenPregnancy',
    kashfChapter:  5,
    chapterNameHebrew: 'ילדים והריון',
    chapterNameArabic: 'فصل في الأولاد والحمل',
    verdictHouses: [1, 5],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 226–235',
    confidence:    'derived',
  },

  {
    topicId:       'commerce',
    kashfChapter:  6,
    chapterNameHebrew: 'מסחר / קנייה ומכירה',
    chapterNameArabic: 'فصل في التجارة',
    verdictHouses: [1, 2],
    verdictMethod: 'combine',
    verdictType:   'profit-or-loss',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 236–248',
    confidence:    'derived',
  },

  {
    topicId:       'disputes',
    kashfChapter:  7,
    chapterNameHebrew: 'סכסוך / תביעה / מריבה',
    chapterNameArabic: 'فصل في التنازع',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'win-or-lose',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 249–258',
    confidence:    'derived',
  },

  {
    topicId:       'missingPerson',
    kashfChapter:  8,
    chapterNameHebrew: 'נעדר / גאיב',
    chapterNameArabic: 'فصل في الغائب',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'alive-or-feared',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 259–265',
    confidence:    'derived',
  },

  {
    topicId:       'travel',
    kashfChapter:  9,
    chapterNameHebrew: 'נסיעה / מסע',
    chapterNameArabic: 'فصل في المسافر',
    verdictHouses: [1, 9],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 266–270',
    confidence:    'derived',
  },

  {
    topicId:       'authorityState',
    kashfChapter:  10,
    chapterNameHebrew: 'שלטון / מדינה / תפקיד',
    chapterNameArabic: 'فصل في السلطان',
    verdictHouses: [1, 10],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 271–272',
    confidence:    'derived',
  },

  {
    topicId:       'loveHate',
    kashfChapter:  11,
    chapterNameHebrew: 'ידידות / אהבה / תקוות',
    chapterNameArabic: 'فصل في الأصدقاء',
    verdictHouses: [1, 11],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 273',
    confidence:    'todo',
  },

  {
    topicId:       'enemies',
    kashfChapter:  12,
    chapterNameHebrew: 'אויבים',
    chapterNameArabic: 'فصل في الأعداء',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'win-or-lose',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 271–276',
    confidence:    'derived',
  },

  {
    topicId:       'prisoner',
    kashfChapter:  12,
    chapterNameHebrew: 'אסיר / כלא / מעצר',
    chapterNameArabic: 'فصل في المسجون',
    verdictHouses: [1, 5],
    verdictMethod: 'combine',
    verdictType:   'exit-or-stay',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 274',
    confidence:    'explicit',
  },

  {
    topicId:       'hiddenTreasure',
    kashfChapter:  2,
    chapterNameHebrew: 'אובדות / חפץ נעלם',
    chapterNameArabic: 'فصل في الضائع والمفقود',
    verdictHouses: [1, 4],
    verdictMethod: 'combine',
    verdictType:   'found-or-lost',
    sourceRef:     'כשף-אל-אסראר, פרק 2',
    confidence:    'todo',
  },

  // ── תת-נושאים של בית 7 ────────────────────────────────────────

  {
    topicId:       'theft',
    kashfChapter:  8,
    chapterNameHebrew: 'גנבה / אובד / גנב',
    chapterNameArabic: 'فصل في السرقة والضائع',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'found-or-lost',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 259–265 (גאיב — הגנוב כנעדר)',
    confidence:    'derived',
  },

  {
    topicId:       'partnership',
    kashfChapter:  6,
    chapterNameHebrew: 'שותפות / עסק משותף',
    chapterNameArabic: 'فصل في الشراكة',
    verdictHouses: [1, 7],
    verdictMethod: 'combine',
    verdictType:   'profit-or-loss',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 236–248 (מסחר — B7 לשותף)',
    confidence:    'derived',
  },

  // ── תת-נושאים של בית 12 ───────────────────────────────────────

  {
    topicId:       'fear',
    kashfChapter:  12,
    chapterNameHebrew: 'פחד / סכנה',
    chapterNameArabic: 'فصل في الخوف',
    verdictHouses: [1, 12],
    verdictMethod: 'combine',
    verdictType:   'danger-or-safe',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 271–276 (פרק אויבים — B12 כמקור פחד)',
    confidence:    'derived',
  },

  // ── תת-נושאים של בית 9 ────────────────────────────────────────

  {
    topicId:       'seaVoyage',
    kashfChapter:  9,
    chapterNameHebrew: 'מסע ים',
    chapterNameArabic: 'فصل في سفر البحر',
    verdictHouses: [1, 9],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 266–270 (נסיעה — B8/12 לסכנת ים)',
    confidence:    'derived',
  },

  // ── בתים בודדים ────────────────────────────────────────────────

  {
    topicId:       'siblings',
    kashfChapter:  1,
    chapterNameHebrew: 'אחים / שכנים / קרובים',
    chapterNameArabic: 'فصل في الأخوة',
    verdictHouses: [1, 3],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר, שער שישי פרק שלישי',
    confidence:    'todo',
  },

  {
    topicId:       'yearlyForecast',
    kashfChapter:  10,
    chapterNameHebrew: 'תחזית שנתית / גורל השנה',
    chapterNameArabic: 'فصل في طالع السنة',
    verdictHouses: [1, 10],
    verdictMethod: 'combine',
    verdictType:   'profit-or-loss',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 271–272 (שלטון — B10 לטאלע השנה)',
    confidence:    'derived',
  },

  {
    topicId:       'completion',
    kashfChapter:  10,
    chapterNameHebrew: 'האם הדבר יסתיים / יושלם',
    chapterNameArabic: 'فصل في تمام الأمر',
    verdictHouses: [1, 15],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר — הדיין (B15) כפסיקה מוחלטת',
    confidence:    'derived',
  },

  {
    topicId:       'deathInheritance',
    kashfChapter:  2,
    chapterNameHebrew: 'מוות / ירושה',
    chapterNameArabic: 'فصل في الموت والميراث',
    verdictHouses: [1, 8],
    verdictMethod: 'combine',
    verdictType:   'death-or-safe',
    sourceRef:     'כשף-אל-אסראר, עמ׳ 191–210 (B8 כבית מוות/ירושה)',
    confidence:    'derived',
  },

  {
    topicId:       'birthNativity',
    kashfChapter:  1,
    chapterNameHebrew: 'מולד / גורל האדם',
    chapterNameArabic: 'فصل في المواليد',
    verdictHouses: [1, 10],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר — B1 כטאלע, B10 כגורל כללי',
    confidence:    'derived',
  },

  {
    topicId:       'spiritualDiagnostics',
    kashfChapter:  3,
    chapterNameHebrew: 'אבחון רוחני — עין / כישוף / ג׳ין',
    chapterNameArabic: 'فصل في الأمراض الروحانية',
    verdictHouses: [1, 6],
    verdictMethod: 'combine',
    verdictType:   'spiritual-or-natural',
    sourceRef:     'כשף-אל-אסראר — B1+B6+B4+B8 לאבחון רוחני (B1+B6 כעיקר)',
    confidence:    'derived',
  },

  {
    topicId:       'foundations',
    kashfChapter:  1,
    chapterNameHebrew: 'פתיחה כללית / יסודות',
    chapterNameArabic: 'فصل في الأساس',
    verdictHouses: [1, 15],
    verdictMethod: 'combine',
    verdictType:   'happen-or-not',
    sourceRef:     'כשף-אל-אסראר — B1 כשואל, B15 כדיין הכללי',
    confidence:    'derived',
  },

];

const _topicIndex = Object.fromEntries(
  KASHF_CHAPTER_MAP.map((ch) => [ch.topicId, ch])
);

/**
 * מחזיר את הפרק הרלוונטי לנושא שאלה.
 * @param {string} topicId
 * @returns {object|null}
 */
export function getChapterForTopic(topicId) {
  return _topicIndex[topicId] || null;
}

export default { KASHF_CHAPTER_MAP, VERDICT_TEMPLATES, getChapterForTopic };
