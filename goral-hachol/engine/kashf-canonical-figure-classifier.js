/**
 * kashf-canonical-figure-classifier.js
 *
 * Source-safe figure fortune classification for the canonical Kashf runtime.
 *
 * IMPORTANT:
 * The legacy getSaadNahs() helper intentionally remains untouched because old
 * runtime code depends on its historical collapsing behaviour. The canonical
 * runtime must preserve the source's third fortune class, ممتزج / ממוזג,
 * instead of silently treating "ממוזג-מיטיב" as saad or "ממוזג-מזיק" as nahs.
 *
 * Source basis:
 * - Kashf explicitly uses three verdict classes: سعد / نحس / ممتزج.
 * - The source-backed figure catalogue stores exact figure fortune labels as
 *   מיטיב, מזיק, ממוזג-מיטיב, or ממוזג-מזיק.
 */

import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';
import { getDakhalKharij } from './kashf-figure-classifier.js';

const CANONICAL_FORTUNE_MAP = Object.freeze({
  'מיטיב': Object.freeze({ saadNahs: 'saad', mixedTendency: null }),
  'מזיק': Object.freeze({ saadNahs: 'nahs', mixedTendency: null }),
  'ממוזג-מיטיב': Object.freeze({ saadNahs: 'mixed', mixedTendency: 'saad' }),
  'ממוזג-מזיק': Object.freeze({ saadNahs: 'mixed', mixedTendency: 'nahs' }),
});

const DAKHIL_KHARIJ_HEBREW = Object.freeze({
  kharij: 'חיצונית — צוחקת (יוצאת / מתממשת)',
  dakhil: 'פנימית — בוכה (נשארת / מעוכבת)',
  'mujassad-kharij': 'מתהפכת (תלוי, נוטה לחוץ)',
  'mujassad-dakhil': 'קבועה (תלוי, נוטה להישאר)',
});

function mixedTendencyHebrew(tendency) {
  if (tendency === 'saad') return 'נוטה למיטיב';
  if (tendency === 'nahs') return 'נוטה למזיק';
  return null;
}

export function getCanonicalSaadNahsDetail(pattern) {
  const figure = HAWI_FIGURE_NAMES_BY_ID?.[pattern] || null;
  const sourceFortuneHebrew = figure?.fortuneHebrew || null;
  const mapped = sourceFortuneHebrew ? CANONICAL_FORTUNE_MAP[sourceFortuneHebrew] : null;

  if (!figure || !mapped) {
    return {
      pattern,
      figureHebrew: figure?.hebrewName || null,
      sourceFortuneHebrew,
      saadNahs: null,
      saadNahsHebrew: '',
      mixedTendency: null,
      mixedTendencyHebrew: null,
      sourceStatus: figure?.sourceStatus || null,
    };
  }

  const tendencyHebrew = mixedTendencyHebrew(mapped.mixedTendency);
  const saadNahsHebrew = mapped.saadNahs === 'saad'
    ? 'מיטיב'
    : mapped.saadNahs === 'nahs'
      ? 'מזיק'
      : tendencyHebrew
        ? `ממוזג — ${tendencyHebrew}`
        : 'ממוזג';

  return {
    pattern,
    figureHebrew: figure.hebrewName || null,
    sourceFortuneHebrew,
    saadNahs: mapped.saadNahs,
    saadNahsHebrew,
    mixedTendency: mapped.mixedTendency,
    mixedTendencyHebrew: tendencyHebrew,
    sourceStatus: figure.sourceStatus || null,
  };
}

export function getCanonicalSaadNahs(pattern) {
  return getCanonicalSaadNahsDetail(pattern).saadNahs;
}

export function classifyCanonicalFigure(pattern) {
  const fortune = getCanonicalSaadNahsDetail(pattern);
  const knownFigure = Boolean(HAWI_FIGURE_NAMES_BY_ID?.[pattern]);
  const dakhalKharij = knownFigure ? getDakhalKharij(pattern) : null;

  return {
    pattern,
    dakhalKharij,
    dakhalKharijHebrew: DAKHIL_KHARIJ_HEBREW[dakhalKharij] || '',
    saadNahs: fortune.saadNahs,
    saadNahsHebrew: fortune.saadNahsHebrew,
    mixedTendency: fortune.mixedTendency,
    mixedTendencyHebrew: fortune.mixedTendencyHebrew,
    sourceFortuneHebrew: fortune.sourceFortuneHebrew,
    figureHebrew: fortune.figureHebrew,
    sourceStatus: fortune.sourceStatus,
  };
}

export default {
  getCanonicalSaadNahs,
  getCanonicalSaadNahsDetail,
  classifyCanonicalFigure,
};
