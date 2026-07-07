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
