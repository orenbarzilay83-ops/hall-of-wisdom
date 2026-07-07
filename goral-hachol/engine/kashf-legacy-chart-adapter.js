/**
 * kashf-legacy-chart-adapter.js
 *
 * ממיר את פורמט הלוח של מנוע כשף (board.entries[i].pattern) לפורמט ה-"chart"
 * (מערך {house,key,hebrew,fortune,element,direction,movement}) שמצפות לו
 * הפונקציות ב-kashf-pending-extraction.js — כדי לאפשר חיווט ישיר של פונקציות
 * שכבר אומתו מול המקור, בלי לשכתב את הלוגיקה שלהן מחדש.
 */

import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';
import { getHousePattern } from './kashf-formula-engine.js';

const DIRECTION_HEBREW = { incoming: 'נכנס', outgoing: 'יוצא', stable: 'קבוע', mutable: 'מתהפך' };

function getDirection(pattern) {
  if (!pattern || pattern.length < 2) return null;
  const p = pattern[0] + pattern[1];
  if (p === '21') return 'incoming';
  if (p === '12') return 'outgoing';
  if (p === '22') return 'stable';
  if (p === '11') return 'mutable';
  return null;
}

export function buildLegacyChart(board) {
  const chart = [];
  for (let houseNum = 1; houseNum <= 16; houseNum++) {
    const pattern = getHousePattern(board, houseNum);
    const fig = HAWI_FIGURE_NAMES_BY_ID?.[pattern] || {};
    const direction = getDirection(pattern);
    chart.push({
      house: houseNum,
      key: pattern,
      hebrew: fig.hebrewName || pattern,
      fortune: fig.fortuneHebrew || '',
      element: fig.elementHebrew || '',
      elementHebrew: fig.elementHebrew || '',
      direction,
      movement: DIRECTION_HEBREW[direction] || '',
    });
  }
  return chart;
}
