/**
 * kashf-canonical-executors.js
 *
 * Method-scoped executors for the canonical Kashf runtime.
 *
 * This is an explicit allowlist: a legacy helper may run here only after its
 * exact source method has been audited and mapped to one kashfMethodId.
 * Merely existing in kashf-pending-extraction.js does NOT authorize runtime
 * use.
 */

import {
  computeProfessionH9Kashf,
  computeBodyPartDiagnosisKashf,
  computeThiefPhysicalDescriptionKashf,
} from './kashf-pending-extraction.js';

const LEGACY_EXECUTORS = Object.freeze({
  'profession.p254.h9Planet': computeProfessionH9Kashf,
  'illness.bodyPart.h6Figure': computeBodyPartDiagnosisKashf,
});


const P191_SILENT_PATTERNS = new Set([
  '1211', // בר הלחי / نقي الخد
  '2111', // סף נכנס / عتبة داخلة
  '2121', // ממון נכנס / القبض الداخل
  '2211', // כבוד נכנס / نصرة داخلة
  '2212', // לבן / البياض
  '2221', // שפל ראש / الأنكيس
]);

const P191_EMPTY_PATTERNS = new Set([
  '1112', // סף יוצא / عتبة خارجة
  '1122', // כבוד יוצא / نصرة خارجة
  '1212', // ממון יוצא / القبض الخارج
  '1222', // נשוא ראש / الأحيان
]);

function computePregnancyExistenceP191(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = chart.find((entry) => Number(entry?.house) === 5)
    || chart.find((entry) => Number(entry?.houseNumber) === 5)
    || chart[4]
    || null;
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h5?.hebrew || h5?.hebrewName || pattern;
  const isSilent = P191_SILENT_PATTERNS.has(pattern);
  const isEmpty = P191_EMPTY_PATTERNS.has(pattern);
  const pregnancyExists = isSilent ? true : isEmpty ? false : null;
  const classification = isSilent ? 'silent' : isEmpty ? 'empty' : 'unresolved';
  const classificationHebrew = isSilent ? 'שותקת' : isEmpty ? 'ריקה' : 'לא הוכרעה בכלל זה';

  let outputHebrew;
  if (pregnancyExists === true) {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — צורה שותקת. לפי כשף עמ׳ 191: ההריון נכון.`;
  } else if (pregnancyExists === false) {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — צורה ריקה. לפי כשף עמ׳ 191: ההריון בטל.`;
  } else {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — הצורה אינה מן השותקות ואינה מן הריקות שנקבעו בכלל זה. כשף עמ׳ 191 לבדו אינו מכריע אם ההריון נכון או בטל.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 191; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם בבית החמישי נמצאת צורה שותקת — ההריון נכון; ואם נמצאת בו צורה ריקה — ההריון בטל.',
    houseNumber: 5,
    h5Pattern: pattern,
    h5FigureHebrew: figureHebrew,
    classification,
    classificationHebrew,
    pregnancyExists,
    positive: pregnancyExists,
    outputHebrew,
  };
}


const P191_MASCULINE_PATTERNS = new Set([
  '1112', // סף יוצא / عتبة خارجة
  '1121', // נלחם / جودلة
  '1122', // כבוד יוצא / نصرة خارجة
  '1212', // ממון יוצא / القبض الخارج
  '1222', // נשוא ראש / الأحيان
  '2122', // אדום / الحمرة
]);

const P191_FEMININE_PATTERNS = new Set([
  '1211', // בר הלחי / نقي الخد
  '2111', // סף נכנס / عتبة داخلة
  '2121', // ממון נכנס / القبض الداخل
  '2211', // כבוד נכנס / نصرة داخلة
  '2212', // לבן / البياض
  '2221', // שפל ראש / الأنكيس
]);

function computePregnancyGenderP191(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = chart.find((entry) => Number(entry?.house) === 5)
    || chart.find((entry) => Number(entry?.houseNumber) === 5)
    || chart[4]
    || null;
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h5?.hebrew || h5?.hebrewName || pattern;
  const isMasculine = P191_MASCULINE_PATTERNS.has(pattern);
  const isFeminine = P191_FEMININE_PATTERNS.has(pattern);
  const gender = isMasculine ? 'male' : isFeminine ? 'female' : null;
  const genderHebrew = isMasculine ? 'זכר' : isFeminine ? 'נקבה' : 'לא הוכרע בכלל זה';

  let outputHebrew;
  if (gender === 'male') {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — צורה זכרית. לפי כשף עמ׳ 191: הוולד זכר.`;
  } else if (gender === 'female') {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — צורה נקבית. לפי כשף עמ׳ 191: הוולד נקבה.`;
  } else {
    outputHebrew = `בית 5: ${figureHebrew} (${pattern}) — הצורה אינה זכרית ואינה נקבית לפי סיווג עמ׳ 59–60. כלל עמ׳ 191 לבדו אינו מכריע את מין הוולד.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 191; סיווגי זכר/נקבה עמ׳ 59–60',
    sourceText: 'אם הצורה זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',
    houseNumber: 5,
    h5Pattern: pattern,
    h5FigureHebrew: figureHebrew,
    gender,
    genderHebrew,
    positive: null,
    outputHebrew,
  };
}


const P224_H7_RECURRENCE_CONNECTIONS = Object.freeze({
  1: 'אדם העומד במקום בעל הדבר',
  2: 'אחד מעוזריו של בעל הדבר',
  3: 'הגנב עצמו',
  4: 'מי שנכנס לביתו של בעל הדבר',
  5: 'מי שמתערב עם ילדיו של בעל הדבר',
  6: 'המקור מוסר שבעל הדבר יחלה בגלל הגניבה; אין כאן זיהוי קשר אישי',
  9: 'הקשר בא מחמת נסיעה',
  10: 'אדם הקשור לבעלי השלטון',
  11: 'אדם הקשור לאנשים שהגנב מתחבר עמם',
});

const P225_KINSHIP_ROOTS = Object.freeze({
  1: 'סב מצד האם',
  4: 'אב',
  5: 'בן',
  6: 'דוד',
  8: 'אחים',
  10: 'אם ובני הדוד',
  11: 'חברים',
  12: 'בני הדוד מצד האם',
});

function computeThiefRelationshipP224(chart) {
  if (!Array.isArray(chart)) return null;
  const normalized = chart.map((entry, index) => ({
    ...entry,
    houseNumber: Number(entry?.house ?? entry?.houseNumber ?? (index + 1)),
    pattern: entry?.key || entry?.pattern || null,
  }));
  const h7 = normalized.find((entry) => entry.houseNumber === 7) || normalized[6] || null;
  const h7Pattern = h7?.pattern || null;
  if (!h7Pattern) return null;

  // The original H7 occurrence is the reference point, not a recurrence.
  const recurrenceHouses = normalized
    .filter((entry) => entry.houseNumber !== 7 && entry.pattern === h7Pattern)
    .map((entry) => entry.houseNumber)
    .filter((house) => Number.isInteger(house) && house >= 1 && house <= 16)
    .sort((a, b) => a - b);

  const indications = recurrenceHouses.map((house) => ({
    house,
    p224Connection: P224_H7_RECURRENCE_CONNECTIONS[house] || null,
    p225KinshipRoot: P225_KINSHIP_ROOTS[house] || null,
  }));
  const sourceSupported = indications.filter((item) => item.p224Connection || item.p225KinshipRoot);

  let outputHebrew;
  if (recurrenceHouses.length === 0) {
    outputHebrew = `צורת בית 7 (${h7Pattern}) אינה חוזרת בבית אחר בלוח. לפי כלל עמ׳ 224 אין כאן בית חזרה שממנו ניתן לקבוע את הקשר; הכלל גם אינו מודד מרחק מספרי.`;
  } else if (sourceSupported.length === 0) {
    outputHebrew = `צורת בית 7 (${h7Pattern}) חוזרת בבית/בתים ${recurrenceHouses.join(', ')}, אך במקטע המקור עמ׳ 224–225 לא נמסרה הוראת קשר מפורשת לבתים אלה. אין להשלים קשר מן הדעת.`;
  } else {
    const parts = sourceSupported.map((item) => {
      const layers = [];
      if (item.p224Connection) layers.push(`עמ׳ 224: ${item.p224Connection}`);
      if (item.p225KinshipRoot) layers.push(`עמ׳ 225 — שורש קרבה: ${item.p225KinshipRoot}`);
      return `בית ${item.house} — ${layers.join('; ')}`;
    });
    outputHebrew = `צורת בית 7 (${h7Pattern}) חוזרת בבית/בתים ${recurrenceHouses.join(', ')}. ${parts.join(' | ')}. זהו תיאור קשר לפי הבית שבו הצורה חוזרת, לא זיהוי של אדם מסוים ולא מדידת מרחק.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 224–225',
    sourceText: 'הבית השביעי, אם צורתו חוזרת בבית מן הבתים, מורה על סיבת הגניבה ועל מי שקשור בה; הדין לפי הבית שבו חזרה הצורה.',
    h7Pattern,
    h7FigureHebrew: h7?.hebrew || h7?.hebrewName || h7Pattern,
    recurrenceHouses,
    housesUsed: [7, ...recurrenceHouses],
    indications,
    sourceSupportedIndications: sourceSupported,
    relationResolved: sourceSupported.length > 0,
    positive: null,
    outputHebrew,
  };
}

const CUSTOM_EXECUTORS = Object.freeze({
  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,
  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,
  'pregnancy.p191.genderH5': computePregnancyGenderP191,
  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,
});

function toLegacyChart(board) {
  const entries = Array.isArray(board)
    ? board
    : Array.isArray(board?.entries)
      ? board.entries
      : null;
  if (!entries) {
    const error = new Error('Canonical legacy executor requires a board entries array');
    error.code = 'KASHF_CANONICAL_BOARD_ADAPTER_FAILED';
    throw error;
  }

  return entries.map((entry) => {
    const key = entry?.key || entry?.pattern || entry?.figure?.pattern || null;
    const hebrew = entry?.hebrew || entry?.hebrewName || entry?.figure?.hebrewName || key;
    return { ...entry, key, hebrew };
  });
}

export function hasCanonicalLegacyExecutor(kashfMethodId) {
  return typeof LEGACY_EXECUTORS[kashfMethodId] === 'function';
}

export function executeCanonicalLegacyMethod(kashfMethodId, board) {
  const executor = LEGACY_EXECUTORS[kashfMethodId];
  if (typeof executor !== 'function') {
    const error = new Error(`No approved canonical legacy executor for ${kashfMethodId}`);
    error.code = 'KASHF_CANONICAL_EXECUTOR_NOT_APPROVED';
    throw error;
  }

  return executor(toLegacyChart(board));
}


export function hasCanonicalCustomExecutor(kashfMethodId) {
  return typeof CUSTOM_EXECUTORS[kashfMethodId] === 'function';
}

export function executeCanonicalCustomMethod(kashfMethodId, board) {
  const executor = CUSTOM_EXECUTORS[kashfMethodId];
  if (typeof executor !== 'function') {
    const error = new Error(`No approved canonical custom executor for ${kashfMethodId}`);
    error.code = 'KASHF_CANONICAL_CUSTOM_EXECUTOR_NOT_APPROVED';
    throw error;
  }

  return executor(toLegacyChart(board));
}

export function listApprovedCanonicalLegacyExecutors() {
  return Object.keys(LEGACY_EXECUTORS);
}

export default {
  hasCanonicalLegacyExecutor,
  executeCanonicalLegacyMethod,
  hasCanonicalCustomExecutor,
  executeCanonicalCustomMethod,
  listApprovedCanonicalLegacyExecutors,
};
