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
