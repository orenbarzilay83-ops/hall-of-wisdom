// מערכת החַ'ט (حظوظ الأشكال) — יתרונות הצורות בבתים
// Source: كشف الأسرار المصونة في اخراج الضمائر المخزونة, pages 43-68
//
// "للأشكال في البيوت حظوظ" — לכל צורה יש יתרונות בבתים
//
// הספר מדגים: האחיאן (1222) בבית 1 → 4 יתרונות:
//   תסכין השכינה + תסכין האותיות + תסכין היסוד + יתד
//
// סוגי יתרון מבוססי-מקור (explicit-in-source):
//   תסכין-שכינה: הצורה בביתה הטבעי (לפי נוסחת ספר, עמוד 43)
//   תסכין-יסוד:  יסוד הצורה = יסוד הבית (מחזורי: 1=אש,2=אוויר,3=מים,4=עפר)
//   תסכין-זמן:   זמן הצורה (יומי/לילי) = זמן הבית (אי-זוגי=יומי, זוגי=לילי)
//   יתד:         הבית הוא בית יתד (1,4,7,10)
//
// סוגי יתרון שטרם מיושמים (not-yet-found-in-current-code-search):
//   תסכין-אותיות: ערך אבג'ד של הצורה תואם מספר הבית
//   כוכב:         הכוכב השולט בצורה = הכוכב השולט בבית

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

  // 2. תסכין יסוד — יסוד הצורה תואם יסוד הבית
  const houseElement = getHouseElementHebrew(h);
  if (figure.elementHebrew && figure.elementHebrew === houseElement) {
    advantages.push({
      type: 'תסכין-יסוד',
      arabicName: 'تسكين العنصر',
      sourceStatus: 'explicit-in-source',
    });
  }

  // 3. תסכין זמן — זמן הצורה תואם פריות הבית (אי-זוגי=יומי, זוגי=לילי)
  // Source: page 46: "والبيت الأول: ذكر؛ والثاني: أنثى؛ والثالث: ذكر..."
  const houseIsDay = h % 2 === 1;
  if (
    (houseIsDay && figure.timeHebrew === 'יומי') ||
    (!houseIsDay && figure.timeHebrew === 'לילי')
  ) {
    advantages.push({
      type: 'תסכין-זמן',
      arabicName: 'تسكين اليوم',
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

  // 5. תסכין אותיות — ערך אבג'ד (not-yet-found-in-current-code-search)
  // 6. כוכב — כוכב שולט (not-yet-found-in-current-code-search)

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
};

if (typeof module !== 'undefined') {
  module.exports = {
    calculateNaturalHouseFromPattern,
    calculateHazz,
    getHazzStrengthLabel,
    BOOK_NATURAL_HOUSE_FIGURES,
  };
}
