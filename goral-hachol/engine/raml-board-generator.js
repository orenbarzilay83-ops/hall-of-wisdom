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
      sourceStatus: 'computed-source-verified',
    });
  });
}

// ── אימות תקינות הלוח ────────────────────────────────────────────────────────
// מקור: כשף אל-אסראר — שלושה כללים בסיסיים לפסילת לוח

const LIAR_EXPOSING_PATTERNS = new Set(['1111', '1221', '2112', '2222']);

// ראש התלי = القبض الخارج = ממון יוצא [1212]
// זנב התלי = عتبة خارجة = סף יוצא [1112]
// מקור: כשף אל-אסראר — "אם יצאה אחת מהן בתחילת היד — דון בה וחזור להכות שנית"
const RAS_DHANAB_PATTERNS = new Set(['1212', '1112']);

function validateRasDhanabInHouse1(house1) {
  if (!RAS_DHANAB_PATTERNS.has(house1.pattern)) return null;
  const figureName = house1.hebrewName || house1.pattern;
  const isRas = house1.pattern === '1212';
  return {
    code: isRas ? 'ras-tinnin-in-house1' : 'dhanab-tinnin-in-house1',
    severity: 'warning',
    houseNumber: 1,
    pattern: house1.pattern,
    hebrewMessage:
      `בית 1 מכיל את הצורה "${figureName}" (${house1.pattern}) — ` +
      `${isRas ? 'ראש התלי' : 'זנב התלי'}. ` +
      'יש לדון בה בזהירות ולשקול לחזור ולהפיל מחדש.',
    sourceRef: 'כשף אל-אסראר — אם יצאה אחת מהן בתחילת היד — דון בה וחזור להכות שנית.',
  };
}

function validateJudgeIsEven(house15) {
  // צורה "זוגית" = סכום הנקודות זוגי = מספר שורות '1' הוא 0, 2, או 4
  // צורה "אי-זוגית" = שורת '1' אחת (5 נקודות) או שלוש (7 נקודות) → לוח פסול
  const onesCount = house15.pattern.split('').filter((ch) => ch === '1').length;
  if (onesCount % 2 === 0) return null;
  return {
    code: 'judge-not-even',
    severity: 'critical',
    houseNumber: 15,
    pattern: house15.pattern,
    hebrewMessage:
      `בית 15 (הדיין) אינו תקין — הצורה "${house15.hebrewName}" (${house15.pattern}) היא אי-זוגית (${5 + (onesCount === 3 ? 2 : 0)} נקודות). ` +
      'הדיין חייב להיות צורה זוגית. יש לחזור ולהפיל מחדש.',
    sourceRef: 'כשף אל-אסראר — הדיין (בית 15) חייב להיות זוג. אם לא — הלוח כולו פסול.',
  };
}

function validateLiarFiguresPresent(entries) {
  const hasOne = entries.some((e) => LIAR_EXPOSING_PATTERNS.has(e.pattern));
  if (hasOne) return null;
  return {
    code: 'no-liar-figure',
    severity: 'warning',
    hebrewMessage:
      'אף אחת מ-4 הצורות "מגלות השקר" (דרך, סוהר, חיבור, גמאעה) לא מופיעה בלוח. ' +
      'אם אין ולא אחת מהן — השאלה אינה כנה או הלוח לא תקין.',
    sourceRef: 'כשף אל-אסראר — חובה שאחת מארבעת הצורות (الطريق, العقلة, الاجتماع, الجماعة) תופיע בלוח.',
  };
}

function validateBoard(entries) {
  const warnings = [];

  const rasDhanabWarning = validateRasDhanabInHouse1(entries[0]);
  if (rasDhanabWarning) warnings.push(rasDhanabWarning);

  const judgeWarning = validateJudgeIsEven(entries[14]);
  if (judgeWarning) warnings.push(judgeWarning);

  const liarWarning = validateLiarFiguresPresent(entries);
  if (liarWarning) warnings.push(liarWarning);

  return {
    isValid: !warnings.some((w) => w.severity === 'critical'),
    hasCritical: warnings.some((w) => w.severity === 'critical'),
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

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
    'computed-source-verified'
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
  const boardValidation = validateBoard(entries);

  return {
    ...board,
    id: 'raml-board-from-mothers',
    boardHebrewName: 'לוח הגורל',
    source: 'hawi',
    inputMode: 'manual-mothers',
    displayDirection: 'rtl',
    entries,
    boardValidation,
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
        status: 'source-verified',
        sourceTitleArabic: 'القول الجامع في علم الرمل',
        sourceSectionArabic: 'الفصل السادس — طرق استخراج الامهات والتخت ومعرفة صدق الرمل',
        note: 'המקור מאשר: בית 5 מראשי האמהות, בית 6 מחזות/אמצע האמהות, בית 7 מבטני האמהות, בית 8 מרגלי האמהות.',
      },
      {
        item: 'בית 16 / משפט',
        status: 'source-verified',
        sourceTitleArabic: 'القول الجامع في علم الرمل',
        sourceSectionArabic: 'الفصل السادس — طرق استخراج الامهات والتخت ومعرفة صدق الرمل',
        note: 'המקור מאשר: בית 15 נוצר מבית 13 ובית 14, ובית 16 נוצר מהכאת בית 15 עם בית 1.',
      },
    ],
  };
}

export default {
  generateRamlEntriesFromMothers,
  buildRamlBoardFromMothers,
};
