// מערכת החַ'ט (حظوظ الأشكال) — יתרונות הצורות בבתים
// Source: كشف الأسرار المصونة في اخراج الضمائر المخزونة, pages 43-68
//
// "للأشكال في البيوت حظوظ" — לכל צורה יש יתרונות בבתים
//
// הספר מדגים: האחיאן (1222) בבית 1 → 4 יתרונות:
//   תסכין השכינה + תסכין האותיות + תסכין היסוד + יתד
//
// סוגי יתרון מבוססי-מקור (explicit-in-source):
//   תסכין-שכינה:  הצורה בביתה הטבעי (לפי נוסחת ספר, עמוד 43)
//   תסכין-אותיות: הצורה בבית-האות שלה (לפי סדר תסקין עבדוה — hawi-figure-letter-extraction.js)
//   תסכין-מזג-ויום: יסוד הצורה = יסוד הבית (מחזורי: 1=אש,2=אוויר,3=מים,4=עפר) + זמן תואם
//   יתד:          הבית הוא בית יתד (1,4,7,10)
//
// שתי מערכות השכינה (שכינה ואותיות) נותנות בתים שונים לאותה צורה ב-14 מתוך 16 מקרים.
//
// תסכין-כוכב (عمود 133-134, التسكين الرابع):
//   כוכב הצורה = כוכב הבית (מחזור: שבתאי,צדק,מאדים,שמש,נוגה,כוכב,ירח × 16 בתים)
//   3 כוכבים מאומתים (עמוד 133): שמש, נוגה, ירח — sourceStatus: explicit-in-source
//   4 כוכבים על-פי מסורת רמל (עמוד 134 לא נגיש כעת) — sourceStatus: not-yet-found-in-current-code-search

import { FIGURE_LETTER_EXTRACTION } from './hawi-figure-letter-extraction.js';

// בנה מפה: pattern → מיקום אות (1-16) לפי סדר תסקין עבדוה
const FIGURE_LETTER_HOUSE = Object.fromEntries(
  FIGURE_LETTER_EXTRACTION.figureLetters.map((f, idx) => [f.pattern, idx + 1])
);

// ── תסכין-כוכב ────────────────────────────────────────────────────────────────
// מיפוי כוכב → צורות (עמוד 133-134)
// עמוד 133: שמש, נוגה, ירח — מאומת
// עמוד 134 (שיר): כוכב/עטארד, שבתאי/זחל, מאדים/מריח', צדק/משתרי — מאומת
// צמתים (ראש/זנב) — ממתין לאימות
export const FIGURE_PLANET_MAP = [
  // ── מאומת מעמוד 133 ──────────────────────────────────
  { planet: 'שמש',   arabicName: 'الشمس',   patterns: ['2121', '1122'], sourceStatus: 'explicit-in-source' },
  { planet: 'נוגה',  arabicName: 'الزهرة',  patterns: ['1212', '2211'], sourceStatus: 'explicit-in-source' },
  { planet: 'ירח',   arabicName: 'القمر',   patterns: ['2212', '1111'], sourceStatus: 'explicit-in-source' },
  // ── מאומת מעמוד 134 ──────────────────────────────────
  // "والإجتماع ثم والجماعة عطارد أتاها طباعه"
  { planet: 'כוכב',  arabicName: 'عطارد',   patterns: ['2112', '2222'], sourceStatus: 'explicit-in-source' },
  // "وإنما الأنكيس والثقاف لزحل ما فيهما خلاف"
  { planet: 'שבתאי', arabicName: 'زحل',     patterns: ['2221', '1112'], sourceStatus: 'explicit-in-source' },
  // "وحمرة كذا نقي الخد لكوكب المريخ فيما عندي"
  { planet: 'מאדים', arabicName: 'المريخ',  patterns: ['2122', '1211'], sourceStatus: 'explicit-in-source' },
  // "وعتبة داخلة وضاحكه للمشتري ومن يعاند هالك"
  { planet: 'צדק',   arabicName: 'المشتري', patterns: ['2111', '1222'], sourceStatus: 'explicit-in-source' },
  // ── צמתים (ذنب/رأس) — ממתין לאימות ──────────────────
  // 1221 (סוהר/العقلة) ו-1121 (נלחם/جودلة) — מסורת רמל
  { planet: 'ראש',   arabicName: 'الرأس',   patterns: ['1121'], sourceStatus: 'not-yet-found-in-current-code-search' },
  { planet: 'זנב',   arabicName: 'الذنب',   patterns: ['1221'], sourceStatus: 'not-yet-found-in-current-code-search' },
];

// מפה הפוכה: pattern → כוכב
const PATTERN_TO_PLANET = Object.fromEntries(
  FIGURE_PLANET_MAP.flatMap((entry) =>
    entry.patterns.map((p) => [p, { planet: entry.planet, arabicName: entry.arabicName, sourceStatus: entry.sourceStatus }])
  )
);

// כוכב לפי בית — מחזור שבתאי,צדק,מאדים,שמש,נוגה,כוכב,ירח (בתים 1–16)
// Source: traditional Arabic raml cycle — sourceStatus: not-yet-found-in-current-code-search
const PLANET_CYCLE = ['שבתאי', 'צדק', 'מאדים', 'שמש', 'נוגה', 'כוכב', 'ירח'];
function getHousePlanet(houseNum) {
  return PLANET_CYCLE[(houseNum - 1) % 7];
}

// ערכי יסוד עמודות הצורה (עמוד 43):
// "النقطة النارية واحد... الهواء اثنان... الماء أربعة... التراب ثمانية"
const ELEMENT_VALUES = { fire: 1, air: 2, water: 4, earth: 8 };

// מפת יסוד לשפה עברית
const ELEMENT_HEB_TO_TYPE = {
  'אש': 'fire',
  'אוויר': 'air',
  'מים': 'water',
  'עפר': 'earth',
};

// יסוד הבית לפי מחזור (בית 1=אש, 2=אוויר, 3=מים, 4=עפר, 5=אש, ...)
// Source: page 45: "والبيت الأول: ناري؛ والثاني: هوائي؛ والثالث: مائي؛ والرابع: ترابي، وهلم جرا"
function getHouseElementHebrew(houseNum) {
  const cycle = ((houseNum - 1) % 4) + 1;
  return { 1: 'אש', 2: 'אוויר', 3: 'מים', 4: 'עפר' }[cycle];
}

// חישוב בית השכינה הטבעי של צורה לפי נוסחת הספר (עמוד 43):
// סכום ערכי יסוד של השורות הבודדות (נקודה אחת) בלבד
// תוצאה 0 → בית 16
export function calculateNaturalHouseFromPattern(pattern) {
  const rows = pattern.split('');
  const elementTypes = ['fire', 'air', 'water', 'earth'];
  let total = 0;
  rows.forEach((dot, i) => {
    if (dot === '1') {
      total += ELEMENT_VALUES[elementTypes[i]];
    }
  });
  return total === 0 ? 16 : total;
}

// טבלת בית-שכינה לכל 16 הצורות (לפי נוסחת הספר)
export const BOOK_NATURAL_HOUSE_FIGURES = {
  1:  '1222', // الأحيان / נשוא ראש (1+0+0+0=1)
  2:  '2122', // الحمرة / אדום (0+2+0+0=2)
  3:  '1122', // نصرة خارجة / כבוד יוצא (1+2+0+0=3)
  4:  '2212', // البياض / לבן (0+0+4+0=4)
  5:  '1212', // القبض الخارج / ממון יוצא (1+0+4+0=5)
  6:  '2112', // الاجتماع / חיבור (0+2+4+0=6)
  7:  '1112', // عتبة خارجة / סף יוצא (1+2+4+0=7)
  8:  '2221', // المنكوس / שפל ראש (0+0+0+8=8)
  9:  '1221', // العقلة / סוהר (1+0+0+8=9)
  10: '2121', // القبض الداخل / ממון נכנס (0+2+0+8=10)
  11: '1121', // جودلة / נלחם (1+2+0+8=11)
  12: '2211', // نصرة داخلة / כבוד נכנס (0+0+4+8=12)
  13: '1211', // نقي الخد / בר הלחי (1+0+4+8=13)
  14: '2111', // عتبة داخلة / סף נכנס (0+2+4+8=14)
  15: '1111', // الطريق / דרך (1+2+4+8=15)
  16: '2222', // الجماعة / קהלה (0+0+0+0=0→16)
};

// חישוב חַ'ט (יתרונות) של צורה בבית מסוים
// מחזיר מערך של סוגי יתרון שקיימים
export function calculateHazz(figure, houseNum) {
  const h = Number(houseNum);
  const advantages = [];

  // 1. תסכין שכינה — בית שכינה טבעי (לפי נוסחת ספר)
  if (BOOK_NATURAL_HOUSE_FIGURES[h] === figure.pattern) {
    advantages.push({
      type: 'תסכין-שכינה',
      arabicName: 'تسكين السكنى',
      sourceStatus: 'explicit-in-source',
    });
  }

  // 2. תסכין אותיות — בית האות של הצורה (לפי סדר תסקין עבדוה) = בית נוכחי
  // מערכת נפרדת מהשכינה: 14 מתוך 16 צורות מקבלות בית-אות שונה מבית-שכינה
  const letterHouse = FIGURE_LETTER_HOUSE[figure.pattern];
  if (letterHouse === h) {
    advantages.push({
      type: 'תסכין-אותיות',
      arabicName: 'تسكين الحروف',
      letterHouse,
      sourceStatus: 'explicit-in-source',
    });
  }

  // 3. תסכין-מזג-ויום — יסוד הצורה + זמנה תואמים את הבית (יחד = יתרון אחד)
  // Source: book example calls this combined type "تسكين المزاج واليوم" (one hazz, not two)
  // אי-זוגי = יומי/אש/אוויר, זוגי = לילי/מים/עפר
  const houseElement = getHouseElementHebrew(h);
  const houseIsDay = h % 2 === 1;
  const elementMatches = figure.elementHebrew && figure.elementHebrew === houseElement;
  const timeMatches =
    (houseIsDay && figure.timeHebrew === 'יומי') ||
    (!houseIsDay && figure.timeHebrew === 'לילי');
  if (elementMatches || timeMatches) {
    advantages.push({
      type: 'תסכין-מזג-ויום',
      arabicName: 'تسكين المزاج واليوم',
      elementMatches,
      timeMatches,
      sourceStatus: 'explicit-in-source',
    });
  }

  // 4. יתד — הבית הוא יתד (1, 4, 7, 10)
  // Source: page 46: "وهو وتد, فهذه أربعة حظوظ" (from الأحيان example)
  if ([1, 4, 7, 10].includes(h)) {
    advantages.push({
      type: 'יתד',
      arabicName: 'الوتد',
      sourceStatus: 'explicit-in-source',
    });
  }

  // 5. תסכין-כוכב — כוכב הצורה = כוכב הבית (עמוד 133-134)
  // Source pages 133-134: التسكين الرابع: تسكين المزاج
  // 3 planets verified (p.133): שמש/נוגה/ירח — others from raml tradition pending p.134
  const figurePlanetEntry = PATTERN_TO_PLANET[figure.pattern];
  if (figurePlanetEntry) {
    const housePlanet = getHousePlanet(h);
    if (figurePlanetEntry.planet === housePlanet) {
      advantages.push({
        type: 'תסכין-כוכב',
        arabicName: 'تسكين الكوكب',
        planet: figurePlanetEntry.planet,
        housePlanet,
        sourceStatus: figurePlanetEntry.sourceStatus,
      });
    }
  }

  return {
    houseNum: h,
    figurePattern: figure.pattern,
    figureHebrewName: figure.hebrewName || figure.pattern,
    count: advantages.length,
    advantages,
    sourceStatus: 'explicit-in-source',
  };
}

export function getHazzStrengthLabel(count) {
  if (count >= 4) return 'חזק מאוד';
  if (count === 3) return 'חזק';
  if (count === 2) return 'בינוני';
  if (count === 1) return 'חלש';
  return 'אין יתרון';
}

export default {
  calculateNaturalHouseFromPattern,
  calculateHazz,
  getHazzStrengthLabel,
  BOOK_NATURAL_HOUSE_FIGURES,
  FIGURE_PLANET_MAP,
};

if (typeof module !== 'undefined') {
  module.exports = {
    calculateNaturalHouseFromPattern,
    calculateHazz,
    getHazzStrengthLabel,
    BOOK_NATURAL_HOUSE_FIGURES,
    FIGURE_PLANET_MAP,
  };
}
