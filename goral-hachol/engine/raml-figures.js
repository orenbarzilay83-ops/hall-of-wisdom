import {
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
} from '../data/sources/hawi/foundations/hawi-figure-names.js';

/**
 * מנוע חיבור / הולדת צורות רמל.
 *
 * מקור:
 * حاوي العجائب ومظهر الغرائب
 * باب المحو والثبات
 *
 * עיקרון:
 * כל צורה מיוצגת בארבע שורות.
 * בקוד שלנו:
 * 1 = נקודה אחת / קו יחיד
 * 2 = שתי נקודות / קו כפול
 *
 * חיבור שתי שורות:
 * זוגי + זוגי או אי־זוגי + אי־זוגי => 2
 * זוגי + אי־זוגי => 1
 */

export function isValidRamlPattern(pattern) {
  return (
    typeof pattern === 'string' &&
    /^[12]{4}$/.test(pattern) &&
    Boolean(HAWI_FIGURE_NAMES_BY_ID[pattern])
  );
}

export function normalizeRamlFigure(input) {
  if (!input) return null;

  if (typeof input === 'string') {
    return getHawiFigureCanonicalName(input);
  }

  if (typeof input === 'object') {
    if (typeof input.pattern === 'string') {
      return getHawiFigureCanonicalName(input.pattern);
    }

    if (typeof input.id === 'string') {
      return getHawiFigureCanonicalName(input.id);
    }

    if (typeof input.shortId === 'string') {
      return getHawiFigureCanonicalName(input.shortId);
    }
  }

  return null;
}

export function combineRamlPatterns(patternA, patternB) {
  if (!/^[12]{4}$/.test(patternA || '') || !/^[12]{4}$/.test(patternB || '')) {
    throw new Error('combineRamlPatterns expects two valid 4-line patterns using only 1 and 2');
  }

  return patternA
    .split('')
    .map((value, index) => {
      const sum = Number(value) + Number(patternB[index]);
      return sum % 2 === 0 ? '2' : '1';
    })
    .join('');
}

export function combineRamlFigures(figureAInput, figureBInput) {
  const figureA = normalizeRamlFigure(figureAInput);
  const figureB = normalizeRamlFigure(figureBInput);

  if (!figureA || !figureB) {
    throw new Error('combineRamlFigures expects two known Hawi figure ids, short ids, or patterns');
  }

  const resultPattern = combineRamlPatterns(figureA.pattern, figureB.pattern);
  const resultFigure = getHawiFigureCanonicalName(resultPattern);

  if (!resultFigure) {
    throw new Error(`No Hawi figure found for generated pattern: ${resultPattern}`);
  }

  return {
    source: 'hawi',
    sourceSectionArabic: 'باب المحو والثبات',
    methodHebrew: 'חיבור / הולדת צורות',
    left: figureA,
    right: figureB,
    resultPattern,
    result: resultFigure,
  };
}

export function getAllRamlFigures() {
  return HAWI_FIGURE_NAMES;
}

export default {
  isValidRamlPattern,
  normalizeRamlFigure,
  combineRamlPatterns,
  combineRamlFigures,
  getAllRamlFigures,
};
