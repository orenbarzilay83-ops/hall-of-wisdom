/**
 * הוצאת שם — מיפוי צורות גורל החול לאותיות עבריות
 *
 * מקור: מערכת תסקין עבדוה (تسكين عبده) / حاوي العجائب
 * כל צורה מקבילה לאות ראשית ולאות משנית.
 * בית 9 = הסוחר/מכשף, בית 7 = הגנב/אדם לא ידוע.
 *
 * המיפוי ניתן ישירות על ידי בעל המקצוע לפי מסורת גורל החול.
 */

export const FIGURE_LETTER_EXTRACTION = {
  id: 'figure-letter-extraction',
  sourceBook: 'חאוי העג׳איב — أحمد ابن زنبل المحلي',
  method: 'taskin-abduh',
  methodHebrew: 'תסקין עבדוה — הוצאת שם לפי צורת הבית',
  usageHouses: {
    9: 'שם הסוחר / המכשף / מי שגרם לפגיעה רוחנית',
    7: 'שם הגנב / האויב / האדם הלא ידוע',
  },
  // מיפוי: pattern 4 ספרות → אותיות עבריות (ראשית + משנית)
  figureLetters: [
    { pattern: '1222', hebrewName: 'נשוא ראש',   letters: ['א', 'פ'] },
    { pattern: '2221', hebrewName: 'שפל ראש',    letters: ['ב', 'צ'] },
    { pattern: '2122', hebrewName: 'אדום',        letters: ['ג', 'ק'] },
    { pattern: '2212', hebrewName: 'לבן',         letters: ['ד', 'ר'] },
    { pattern: '1122', hebrewName: 'כבוד יוצא',  letters: ['ה', 'ש'] },
    { pattern: '2211', hebrewName: 'כבוד נכנס',  letters: ['ו', 'ת'] },
    { pattern: '2111', hebrewName: 'סף נכנס',    letters: ['ז', 'ך'] },
    { pattern: '1112', hebrewName: 'סף יוצא',    letters: ['ח', 'ם'] },
    { pattern: '1121', hebrewName: 'נלחם',        letters: ['ט', 'ן'] },
    { pattern: '1211', hebrewName: 'בר הלחי',    letters: ['י', 'ף'] },
    { pattern: '2121', hebrewName: 'ממון נכנס',  letters: ['כ', 'ץ'] },
    { pattern: '1212', hebrewName: 'ממון יוצא',  letters: ['ל', 'א'] },
    { pattern: '2222', hebrewName: 'קהלה',        letters: ['מ']       },
    { pattern: '1221', hebrewName: 'סוהר',        letters: ['נ']       },
    { pattern: '2112', hebrewName: 'חיבור',       letters: ['ס']       },
    { pattern: '1111', hebrewName: 'דרך',         letters: ['ע']       },
  ],
};

export default FIGURE_LETTER_EXTRACTION;

if (typeof module !== 'undefined') {
  module.exports = { FIGURE_LETTER_EXTRACTION };
}
