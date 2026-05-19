export const HAWI_FIGURE_NAMES = [
  {
    pattern: '1111',
    id: 'hawi-figure-tariq',
    shortId: 'tariq',
    arabicName: 'الطريق',
    hebrewName: 'דרך',
    fortuneHebrew: 'ממוזג־סעד',
    movementHebrew: 'מתהפך',
    elementHebrew: 'אוויר',
  },
  {
    pattern: '1112',
    id: 'hawi-figure-ataba-kharija',
    shortId: 'ataba-kharija',
    arabicName: 'عتبة خارجة',
    hebrewName: 'סף יוצא',
    fortuneHebrew: 'נחס',
    movementHebrew: 'חיצוני',
    elementHebrew: 'אש',
  },
  {
    pattern: '1121',
    id: 'hawi-figure-judla',
    shortId: 'judla',
    arabicName: 'جودلة / كوسج',
    hebrewName: 'נלחם',
    fortuneHebrew: 'ממוזג־סעד',
    movementHebrew: 'מתהפך',
    elementHebrew: 'אוויר',
  },
  {
    pattern: '1122',
    id: 'hawi-figure-nusra-kharija',
    shortId: 'nusra-kharija',
    arabicName: 'نصرة خارجة / الجواد',
    hebrewName: 'כבוד יוצא',
    fortuneHebrew: 'סעד',
    movementHebrew: 'חיצוני',
    elementHebrew: 'אש',
  },
  {
    pattern: '1211',
    id: 'hawi-figure-naqi-khad',
    shortId: 'naqi-khad',
    arabicName: 'نقي الخد / الأشقر',
    hebrewName: 'בר הלחי',
    fortuneHebrew: 'ממוזג־נחס',
    movementHebrew: 'מתהפך',
    elementHebrew: 'אוויר',
  },
  {
    pattern: '1212',
    id: 'hawi-figure-qabd-kharij',
    shortId: 'qabd-kharij',
    arabicName: 'القبض الخارج',
    hebrewName: 'ממון יוצא',
    fortuneHebrew: 'נחס',
    movementHebrew: 'חיצוני',
    elementHebrew: 'אש',
  },
  {
    pattern: '1221',
    id: 'hawi-figure-aqla',
    shortId: 'aqla',
    arabicName: 'العقلة / الشقاوة',
    hebrewName: 'סוהר',
    fortuneHebrew: 'ממוזג־נחס',
    movementHebrew: 'מתהפך',
    elementHebrew: 'אוויר',
  },
  {
    pattern: '1222',
    id: 'hawi-figure-hayyan',
    shortId: 'hayyan',
    arabicName: 'الأحيان / الضاحك',
    hebrewName: 'נושא ראש',
    fortuneHebrew: 'סעד',
    movementHebrew: 'חיצוני',
    elementHebrew: 'אש',
  },
  {
    pattern: '2111',
    id: 'hawi-figure-ataba-dakhila',
    shortId: 'ataba-dakhila',
    arabicName: 'عتبة داخلة / راية الفرح',
    hebrewName: 'סף נכנס',
    fortuneHebrew: 'סעד',
    movementHebrew: 'פנימי',
    elementHebrew: 'מים',
  },
  {
    pattern: '2112',
    id: 'hawi-figure-ijtima',
    shortId: 'ijtima',
    arabicName: 'الاجتماع',
    hebrewName: 'חיבור',
    fortuneHebrew: 'ממוזג־סעד',
    movementHebrew: 'קבוע',
    elementHebrew: 'עפר',
  },
  {
    pattern: '2121',
    id: 'hawi-figure-qabd-dakhil',
    shortId: 'qabd-dakhil',
    arabicName: 'القبض الداخل',
    hebrewName: 'ממון נכנס',
    fortuneHebrew: 'סעד',
    movementHebrew: 'פנימי',
    elementHebrew: 'מים',
  },
  {
    pattern: '2122',
    id: 'hawi-figure-humra',
    shortId: 'humra',
    arabicName: 'الحمرة',
    hebrewName: 'אדום',
    fortuneHebrew: 'נחס',
    movementHebrew: 'קבוע',
    elementHebrew: 'עפר',
  },
  {
    pattern: '2211',
    id: 'hawi-figure-nusra-dakhila',
    shortId: 'nusra-dakhila',
    arabicName: 'نصرة داخلة / النصير',
    hebrewName: 'כבוד נכנס',
    fortuneHebrew: 'סעד',
    movementHebrew: 'פנימי',
    elementHebrew: 'מים',
  },
  {
    pattern: '2212',
    id: 'hawi-figure-bayad',
    shortId: 'bayad',
    arabicName: 'البياض',
    hebrewName: 'לבן',
    fortuneHebrew: 'סעד',
    movementHebrew: 'קבוע',
    elementHebrew: 'עפר',
  },
  {
    pattern: '2221',
    id: 'hawi-figure-nakis',
    shortId: 'nakis',
    arabicName: 'المنكوس / الأنكيس',
    hebrewName: 'שפל ראש',
    fortuneHebrew: 'נחס',
    movementHebrew: 'פנימי',
    elementHebrew: 'מים',
  },
  {
    pattern: '2222',
    id: 'hawi-figure-jamaa',
    shortId: 'jamaa',
    arabicName: 'الجماعة',
    hebrewName: 'קהילה',
    fortuneHebrew: 'ממוזג',
    movementHebrew: 'קבוע',
    elementHebrew: 'עפר',
  },
];

export const HAWI_FIGURE_NAMES_BY_ID = Object.fromEntries(
  HAWI_FIGURE_NAMES.flatMap((figure) => [
    [figure.id, figure],
    [figure.shortId, figure],
    [figure.pattern, figure],
  ])
);

export function getHawiFigureCanonicalName(idOrPattern) {
  if (!idOrPattern || typeof idOrPattern !== 'string') {
    return null;
  }

  return HAWI_FIGURE_NAMES_BY_ID[idOrPattern] || null;
}

export function getHawiFigureHebrewName(idOrPattern) {
  return getHawiFigureCanonicalName(idOrPattern)?.hebrewName || null;
}

export default {
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
  getHawiFigureHebrewName,
};

if (typeof module !== 'undefined') {
  module.exports = {
    HAWI_FIGURE_NAMES,
    HAWI_FIGURE_NAMES_BY_ID,
    getHawiFigureCanonicalName,
    getHawiFigureHebrewName,
  };
}
