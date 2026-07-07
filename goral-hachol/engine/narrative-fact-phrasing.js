/**
 * narrative-fact-phrasing.js — שכבת-סינתזה משותפת (חאווי + כשף)
 *
 * מטרה: להחליף בחירת-משפט-קבוע-לפי-פולריות ("טוב"/"רע" → 1 מ-2 משפטים) בבניית
 * משפט מהעובדה הספציפית עצמה — שם הצורה שיצאה + מהותה — כך שכל אחת מ-16
 * הצורות מייצרת ניסוח שונה, לא רק שני קבצים בינאריים. אין כאן תוכן מומצא:
 * FIGURE_ESSENCE נגזר ישירות משמות הצורות (חאווי/כשף), לא פרשנות חדשה.
 */

// מהות כל אחת מ-16 הצורות — נגזרת ישירות משם הצורה עצמו.
export const FIGURE_ESSENCE = {
  'כבוד נכנס':  'כוח וכבוד',
  'ממון נכנס':  'ממון שזורם פנימה',
  'לבן':        'בהירות ורוגע',
  'חיבור':      'קשרים וחיבורים',
  'דרך':        'דרך פתוחה',
  'סף נכנס':    'פתח חדש שנפתח',
  'נשוא ראש':   'הצלחה ועלייה',
  'קהלה':       'ריבוי ותנועה',
  'שפל ראש':    'שפלות וחולשה',
  'אדום':       'לחץ וסכנה',
  'בר הלחי':    'הפסד',
  'נלחם':       'מאבק ולחץ',
  'סוהר':       'עצירה ומגבלה',
  'כבוד יוצא':  'כבוד שחולף',
  'ממון יוצא':  'ממון שיוצא',
  'סף יוצא':    'חיפוש מוצא',
};

export function essenceOf(figureHebrew) {
  return FIGURE_ESSENCE[figureHebrew] || '';
}

// קונוטציה לשונית של טקסט-המהות עצמו (לא סיווג גורלי — הסיווג נשאר
// fortuneHebrew מהמקור). משמש אך ורק לבדיקת-לכידות של המשפט: אם המהות
// נשמעת שלילית אבל הפסיקה מהמקור מיטיבה (למשל "נלחם" = מאבק ולחץ אך
// ממוזג-מיטיב בטבלת הספר) — המשפט חייב לבטא את המתח במפורש ("אך"),
// לא להדביק את שני החלקים כאילו הם מסכימים.
const ESSENCE_CONNOTATION = {
  'כבוד נכנס': 1, 'ממון נכנס': 1, 'לבן': 1, 'חיבור': 1, 'דרך': 1,
  'סף נכנס': 1, 'נשוא ראש': 1,
  'קהלה': 0, 'סף יוצא': 0,
  'שפל ראש': -1, 'אדום': -1, 'בר הלחי': -1, 'נלחם': -1, 'סוהר': -1,
  'כבוד יוצא': -1, 'ממון יוצא': -1,
};

/**
 * מפרק מחרוזת-פסיקה מהמקור לטון + האם ממוזגת.
 * @param {string} fortune - למשל "מיטיב", "ממוזג-מיטיב", "מזיק"
 */
export function fortuneToneParts(fortune) {
  const f = String(fortune || '');
  const mixed = f.includes('ממוזג');
  const tone = f.includes('מיטיב') ? 1 : f.includes('מזיק') ? -1 : 0;
  return { tone, mixed };
}

/**
 * בונה גזרת-תיאור לבית ספציפי: שם הצורה + מהותה (לא רק "טוב"/"רע").
 * @param {string} figureHebrew
 * @param {string} frameLabel - למשל "בית הממון"
 * @returns {string}
 */
export function phraseHouseFact(figureHebrew, frameLabel) {
  if (!figureHebrew) return '';
  const essence = essenceOf(figureHebrew);
  return essence ? `${frameLabel} מראה ${figureHebrew} — ${essence}` : `${frameLabel} מראה ${figureHebrew}`;
}

/**
 * בונה גזרה לכידה: צורה + מהות + השלכה, תוך יישוב מפורש כשמהות-השם
 * והפסיקה מהמקור מושכות לכיוונים הפוכים, וציון "ממוזגת" במפורש כשזה
 * הסיווג — במקום להציג פסיקה ממוזגת כאילו היא חד-משמעית.
 * @param {string} figureHebrew
 * @param {string} frameLabel - למשל "בית הממון"
 * @param {string} fortune - הפסיקה מהמקור ("מיטיב"/"ממוזג-מיטיב"/"מזיק"...)
 * @param {{positive: string, negative: string, mixed: string}} implications - נוסחי-השלכה לפי כיוון, ספציפיים לנושא
 * @returns {{ text: string, tone: number }}
 */
export function phraseHouseFactCoherent(figureHebrew, frameLabel, fortune, implications) {
  if (!figureHebrew) return { text: '', tone: 0 };
  const essence = essenceOf(figureHebrew);
  const essTone = ESSENCE_CONNOTATION[figureHebrew] ?? 0;
  const { tone, mixed } = fortuneToneParts(fortune);

  const implication = tone > 0 ? implications.positive
    : tone < 0 ? implications.negative
    : implications.mixed;

  const rulingWord = tone > 0 ? (mixed ? 'ממוזגת-מיטיבה' : 'מיטיבה')
    : tone < 0 ? (mixed ? 'ממוזגת-מזיקה' : 'מזיקה')
    : 'ממוזגת';

  const conflict = (essTone < 0 && tone > 0) || (essTone > 0 && tone < 0);

  let text;
  if (!essence) {
    text = `${frameLabel} מראה ${figureHebrew} — פסיקה ${rulingWord}: ${implication}`;
  } else if (conflict) {
    // מהות ופסיקה מנוגדות — מציגים את שתיהן ואת היחס ביניהן במפורש
    text = `${frameLabel} מראה ${figureHebrew} — מהותה ${essence}, אך פסיקתה ${rulingWord}: ${implication}`;
  } else if (mixed) {
    text = `${frameLabel} מראה ${figureHebrew} — ${essence} — פסיקה ${rulingWord}: ${implication}`;
  } else {
    text = `${frameLabel} מראה ${figureHebrew} — ${essence} — ${implication}`;
  }
  return { text, tone };
}

/**
 * מחבר שתי גזרות-משפט לפי היחס בין הטונים שלהן (הסכמה/סתירה/תוספת) —
 * בחירת מחבר-משפטים בלבד, לא תוכן חדש. מחזיר בלי נקודה בסוף — האחריות
 * להוסיף נקודת-סיום אחת היא של הקורא, כדי למנוע נקודות כפולות.
 * @param {string} clauseA
 * @param {number} toneA -1|0|1
 * @param {string} clauseB
 * @param {number} toneB -1|0|1
 * @returns {{ text: string, disagreed: boolean }}
 */
export function connectClauses(clauseA, toneA, clauseB, toneB) {
  if (!clauseA) return { text: clauseB || '', disagreed: false };
  if (!clauseB) return { text: clauseA, disagreed: false };
  const agree    = (toneA > 0 && toneB > 0) || (toneA < 0 && toneB < 0);
  const disagree = (toneA > 0 && toneB < 0) || (toneA < 0 && toneB > 0);
  if (agree)    return { text: `${clauseA}, וגם ${clauseB}`, disagreed: false };
  if (disagree) return { text: `${clauseA}. יחד עם זאת, ${clauseB}`, disagreed: true };
  return { text: `${clauseA}. בנוסף, ${clauseB}`, disagreed: false };
}
