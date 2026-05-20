import {
  normalizeRamlFigure,
  combineRamlFigures,
} from './raml-figures.js';

import {
  createRamlBoard,
} from './raml-board.js';

/**
 * מנוע יצירת לוח הגורל מתוך 4 אמהות.
 *
 * שפת אפליקציה:
 * - Mothers = אמהות
 * - Daughters = בנות
 * - Nieces / Granddaughters = נכדות
 * - Witnesses = עדים
 * - Judge = דין
 * - Sentence = משפט / השפעת הדין
 * - Geomantic Shield / Takhth = לוח הגורל
 *
 * הערה חשובה:
 * המנוע שומר את הבתים בסדר חישובי רגיל 1–16.
 * התצוגה באפליקציה חייבת להיות מימין לשמאל:
 * בית 1 בצד ימין.
 */

function requireFourMothers(mothers) {
  if (!Array.isArray(mothers) || mothers.length !== 4) {
    throw new Error('buildRamlBoardFromMothers expects exactly 4 mother figures');
  }

  return mothers.map((input, index) => {
    const figure = normalizeRamlFigure(input);

    if (!figure) {
      throw new Error(`Unknown mother figure at position ${index + 1}`);
    }

    return figure;
  });
}

function figureEntry({ houseNumber, roleHebrew, roleEnglish, figure, sourceStatus = 'computed' }) {
  return {
    houseNumber,
    house: houseNumber,
    roleHebrew,
    roleEnglish,
    figureId: figure.id,
    shortId: figure.shortId,
    pattern: figure.pattern,
    hebrewName: figure.hebrewName,
    arabicName: figure.arabicName,
    figure,
    sourceStatus,
  };
}

function combineEntry(leftEntry, rightEntry, houseNumber, roleHebrew, roleEnglish, sourceStatus = 'computed') {
  const combined = combineRamlFigures(leftEntry.figure, rightEntry.figure);

  return figureEntry({
    houseNumber,
    roleHebrew,
    roleEnglish,
    figure: combined.result,
    sourceStatus,
  });
}

function buildDaughtersFromMothers(motherEntries) {
  const motherPatterns = motherEntries.map((entry) => entry.pattern);

  return [0, 1, 2, 3].map((rowIndex) => {
    const daughterPattern = motherPatterns
      .map((pattern) => pattern[rowIndex])
      .join('');

    const figure = normalizeRamlFigure(daughterPattern);

    if (!figure) {
      throw new Error(`Could not resolve daughter pattern: ${daughterPattern}`);
    }

    return figureEntry({
      houseNumber: 5 + rowIndex,
      roleHebrew: 'בת',
      roleEnglish: 'daughter',
      figure,
      sourceStatus: 'computed-needs-source-verification',
    });
  });
}

export function generateRamlEntriesFromMothers(mothers) {
  const normalizedMothers = requireFourMothers(mothers);

  const motherEntries = normalizedMothers.map((figure, index) =>
    figureEntry({
      houseNumber: index + 1,
      roleHebrew: 'אם',
      roleEnglish: 'mother',
      figure,
      sourceStatus: 'manual-input',
    })
  );

  const daughterEntries = buildDaughtersFromMothers(motherEntries);

  const house1 = motherEntries[0];
  const house2 = motherEntries[1];
  const house3 = motherEntries[2];
  const house4 = motherEntries[3];

  const house5 = daughterEntries[0];
  const house6 = daughterEntries[1];
  const house7 = daughterEntries[2];
  const house8 = daughterEntries[3];

  const house9 = combineEntry(house1, house2, 9, 'נכדה', 'granddaughter');
  const house10 = combineEntry(house3, house4, 10, 'נכדה', 'granddaughter');
  const house11 = combineEntry(house5, house6, 11, 'נכדה', 'granddaughter');
  const house12 = combineEntry(house7, house8, 12, 'נכדה', 'granddaughter');

  const house13 = combineEntry(house9, house10, 13, 'עד ראשון', 'first-witness');
  const house14 = combineEntry(house11, house12, 14, 'עד שני', 'second-witness');

  const house15 = combineEntry(house13, house14, 15, 'דין', 'judge');

  const house16 = combineEntry(
    house15,
    house1,
    16,
    'משפט / השפעת הדין',
    'sentence',
    'computed-needs-source-verification'
  );

  return [
    house1,
    house2,
    house3,
    house4,
    house5,
    house6,
    house7,
    house8,
    house9,
    house10,
    house11,
    house12,
    house13,
    house14,
    house15,
    house16,
  ];
}

export function buildRamlBoardFromMothers(mothers) {
  const entries = generateRamlEntriesFromMothers(mothers);
  const board = createRamlBoard(entries.map((entry) => entry.figureId));

  return {
    ...board,
    id: 'raml-board-from-mothers',
    boardHebrewName: 'לוח הגורל',
    source: 'hawi',
    inputMode: 'manual-mothers',
    displayDirection: 'rtl',
    entries,
    generation: {
      mothers: entries.slice(0, 4),
      daughters: entries.slice(4, 8),
      granddaughters: entries.slice(8, 12),
      witnesses: entries.slice(12, 14),
      judge: entries[14],
      sentence: entries[15],
    },
    sourceReview: [
      {
        item: 'בנות',
        status: 'needs-source-verification',
        note: 'סדר יצירת הבנות מתוך שורות האמהות צריך אימות נוסף מול מקור מצולם.',
      },
      {
        item: 'בית 16 / משפט',
        status: 'needs-source-verification',
        note: 'בית 16 נבנה כאן כדין + בית 1 לפי תרשים העבודה; צריך אימות מול מקור חאוי לפני הפעלה סופית.',
      },
    ],
  };
}

export default {
  generateRamlEntriesFromMothers,
  buildRamlBoardFromMothers,
};
