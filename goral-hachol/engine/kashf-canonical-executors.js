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

import { combineRamlFigures } from './raml-figures.js';
import { FIGURE_PLANET_MAP } from '../data/sources/kashf-al-asrar/kashf-hazz.js';
import { classifyCanonicalFigure } from './kashf-canonical-figure-classifier.js';

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


const P256_HONOR_POSITIVE_PLANETS = new Set(['שמש', 'צדק', 'נוגה']);
const P257_APPOINTMENT_COMPLETION_PLANETS = new Set(['שמש', 'ירח', 'צדק', 'נוגה']);

function findCanonicalHouse(chart, houseNumber) {
  if (!Array.isArray(chart)) return null;
  return chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === houseNumber)
    || chart[houseNumber - 1]
    || null;
}

function getVerifiedPlanetForPattern(pattern) {
  if (!pattern) return null;
  const record = FIGURE_PLANET_MAP.find((entry) => Array.isArray(entry.patterns) && entry.patterns.includes(pattern));
  if (!record) return null;
  return {
    planetHebrew: record.planet,
    planetArabic: record.arabicName,
    sourceStatus: record.sourceStatus,
  };
}

function computeHonorConditionP256(chart) {
  const h10 = findCanonicalHouse(chart, 10);
  const pattern = h10?.key || h10?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h10?.hebrew || h10?.hebrewName || pattern;
  const planet = getVerifiedPlanetForPattern(pattern);
  const planetHebrew = planet?.planetHebrew || null;

  let condition = 'unresolved-by-source';
  let conditionHebrew = 'לא הוכרע בכלל זה';
  let positive = null;
  let outputHebrew;

  if (planetHebrew === 'שמש') {
    condition = 'strong-honor-and-rank';
    conditionHebrew = 'כוח בכבוד ובמעלה';
    positive = true;
    outputHebrew = `בית 10: ${figureHebrew} (${pattern}) — מצורות השמש. לפי כשף עמ׳ 256 הדבר מורה על כוח הכבוד והמעלה ועל שלווה לבעלי השררה.`;
  } else if (planetHebrew === 'צדק' || planetHebrew === 'נוגה') {
    condition = 'good-and-complete';
    conditionHebrew = 'טוב ושלמות';
    positive = true;
    outputHebrew = `בית 10: ${figureHebrew} (${pattern}) — מצורות ${planetHebrew}. לפי כשף עמ׳ 256 הדבר מורה על טוב ושלמות.`;
  } else if (planetHebrew === 'שבתאי') {
    condition = 'no-benefit-gloom-distress';
    conditionHebrew = 'חוסר תועלת, קדרות וצער';
    positive = false;
    outputHebrew = `בית 10: ${figureHebrew} (${pattern}) — מצורות שבתאי. לפי כשף עמ׳ 256 הדבר מורה על חוסר תועלת, קדרות וצער.`;
  } else if (planetHebrew) {
    outputHebrew = `בית 10: ${figureHebrew} (${pattern}) — מצורות ${planetHebrew}. במקטע כשף עמ׳ 256 נמסרה הוראה מפורשת לשמש, לצדק/נוגה ולשבתאי בלבד; אין להשלים מכאן דין לפרסום או למעמד עבור כוכב זה.`;
  } else {
    outputHebrew = `בית 10: ${figureHebrew} (${pattern}) — לא נמצא שיוך כוכבי מאומת במפת כשף עמ׳ 133–134, ולכן אין להכריע את מצב הכבוד לפי כלל עמ׳ 256.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 256; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'בבית הכבוד והשררה: צורות השמש מורות על כוח הכבוד והמעלה; צדק או נוגה על טוב ושלמות; שבתאי על חוסר תועלת, קדרות וצער.',
    housesUsed: [10],
    h10Pattern: pattern,
    h10FigureHebrew: figureHebrew,
    planetHebrew,
    planetArabic: planet?.planetArabic || null,
    planetSourceStatus: planet?.sourceStatus || null,
    condition,
    conditionHebrew,
    positive,
    outputHebrew,
  };
}

function computeAppointmentCompletionP257(chart) {
  const h1 = findCanonicalHouse(chart, 1);
  const h10 = findCanonicalHouse(chart, 10);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h1Pattern || !h10Pattern) return null;

  const combined = combineRamlFigures(h1Pattern, h10Pattern);
  const resultPattern = combined.resultPattern;
  const resultFigureHebrew = combined.result?.hebrewName || resultPattern;
  const planet = getVerifiedPlanetForPattern(resultPattern);
  const planetHebrew = planet?.planetHebrew || null;
  const appointmentCompletes = planetHebrew
    ? P257_APPOINTMENT_COMPLETION_PLANETS.has(planetHebrew)
    : null;

  let sourceClass = null;
  if (planetHebrew === 'שמש' || planetHebrew === 'ירח') sourceClass = 'luminary';
  if (planetHebrew === 'צדק' || planetHebrew === 'נוגה') sourceClass = 'benefic-planet';

  let outputHebrew;
  if (appointmentCompletes === true) {
    const classHebrew = sourceClass === 'luminary' ? 'משני המאורות' : 'משני הכוכבים המיטיבים';
    outputHebrew = `הולד צורה מבית 1 (${h1Pattern}) ומבית 10 (${h10Pattern}): ${resultFigureHebrew} (${resultPattern}), שיוכה ${planetHebrew}. היא ${classHebrew}; לפי כשף עמ׳ 257 השררה / המינוי מתקיימים.`;
  } else if (appointmentCompletes === false) {
    outputHebrew = `הולד צורה מבית 1 (${h1Pattern}) ומבית 10 (${h10Pattern}): ${resultFigureHebrew} (${resultPattern}), שיוכה ${planetHebrew}. היא אינה מצורות השמש/הירח ואינה מצורות צדק/נוגה; לפי כשף עמ׳ 257 השררה / המינוי אינם מתקיימים.`;
  } else {
    outputHebrew = `הולד צורה מבית 1 (${h1Pattern}) ומבית 10 (${h10Pattern}): ${resultFigureHebrew} (${resultPattern}), אך אין לה שיוך כוכבי מאומת במפת כשף עמ׳ 133–134. אין להחליף את החסר בסיווג מיטיב/מזיק.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 257; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'הולד צורה מן הראשון והעשירי: אם היא מצורות שני המאורות, השמש והירח, או משני הכוכבים המיטיבים, צדק ונוגה — השררה מתקיימת; ואם לא — אינה מתקיימת.',
    housesUsed: [1, 10],
    h1Pattern,
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    planetHebrew,
    planetArabic: planet?.planetArabic || null,
    planetSourceStatus: planet?.sourceStatus || null,
    sourceClass,
    appointmentCompletes,
    positive: appointmentCompletes,
    outputHebrew,
  };
}


// p204 uses the source's explicit "mutable" and "fixed" figure classes.
// Source classification (working pp. 57-60): four mutable + four fixed only.
// The other eight incoming/outgoing figures are NOT silently forced into either class.
const P204_MUTABLE_PATTERNS = new Set([
  '1121', // נלחם / الجودلة
  '1211', // בר הלחי / نقي الخد
  '1221', // סוהר / العقلة
  '1111', // דרך / الطريق
]);

const P204_FIXED_PATTERNS = new Set([
  '2222', // קהלה / الجماعة
  '2112', // חיבור / الاجتماع
  '2122', // אדום / الحمرة
  '2212', // לבן / البياض
]);

function computeMarriagePreviousStatusP204(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 7) || chart[6] || null;
  const h10 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 10) || chart[9] || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h7Pattern || !h10Pattern) return null;

  const figureHebrew = h7?.hebrew || h7?.hebrewName || h7Pattern;
  const recursInH10 = h7Pattern === h10Pattern;
  const isMutable = P204_MUTABLE_PATTERNS.has(h7Pattern);
  const isFixed = P204_FIXED_PATTERNS.has(h7Pattern);

  let previousStatus = null;
  let previousStatusHebrew = 'לא הוכרע בכלל זה';
  let figureClass = isMutable ? 'mutable' : isFixed ? 'fixed' : 'other-source-class';
  let figureClassHebrew = isMutable ? 'מתהפכת' : isFixed ? 'קבועה' : 'אינה מארבע המתהפכות ואינה מארבע הקבועות';
  let outputHebrew;

  if (!recursInH10) {
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') אינה נמצאת בבית 10. כלל כשף עמ׳ 204 קושר את דין גרושה/בתולה למצב שבו השביעי נמצא בעשירי; לכן כלל זה לבדו אינו מכריע כאן.';
  } else if (isMutable) {
    previousStatus = 'divorced';
    previousStatusHebrew = 'גרושה';
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10 והיא מתהפכת. לפי כשף עמ׳ 204: גרושה.';
  } else if (isFixed) {
    previousStatus = 'virgin';
    previousStatusHebrew = 'בתולה';
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10 והיא קבועה. לפי כשף עמ׳ 204: בתולה.';
  } else {
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10, אך היא אינה אחת מארבע המתהפכות ואינה אחת מארבע הקבועות שנקבעו בסיווג המקור. כלל עמ׳ 204 לבדו אינו מכריע גרושה לעומת בתולה; אין להשלים מן הדעת.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204; סיווג מתהפך/קבוע עמ׳ 57–60',
    sourceText: 'אם השביעי נמצא בעשירי: אם הוא מתהפך — גרושה; ואם הוא קבוע — בתולה.',
    housesUsed: [7, 10],
    h7Pattern,
    h10Pattern,
    h7FigureHebrew: figureHebrew,
    recursInH10,
    figureClass,
    figureClassHebrew,
    previousStatus,
    previousStatusHebrew,
    positive: null,
    outputHebrew,
  };
}


function computeRulerConditionP257(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 7) || chart[6] || null;
  const h10 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 10) || chart[9] || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h7Pattern || !h10Pattern) return null;

  const combined = combineRamlFigures(h7Pattern, h10Pattern);
  const resultPattern = combined.resultPattern;
  const resultFigureHebrew = combined.result?.hebrewName || resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);

  let rulerCondition = null;
  let rulerConditionHebrew = 'לא הוכרע בכלל זה';
  let positive = null;
  let outputHebrew;

  if (classification.saadNahs === 'saad') {
    rulerCondition = 'good';
    rulerConditionHebrew = 'טוב';
    positive = true;
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — מיטיבה. לפי כשף עמ׳ 257: מצב בעל השררה טוב.';
  } else if (classification.saadNahs === 'nahs') {
    rulerCondition = 'bad';
    rulerConditionHebrew = 'רע';
    positive = false;
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — מזיקה. לפי כשף עמ׳ 257: מצב בעל השררה רע.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — ממוזגת. כלל עמ׳ 257 מוסר דין מפורש למיטיב ולמזיק בלבד; אין להפוך צורה ממוזגת אוטומטית לטובה או לרעה.';
  } else {
    outputHebrew = 'לא ניתן לסווג את הצורה שנולדה מבית 7 ובית 10 לפי סיווג המיטיב/מזיק/ממוזג הקנוני; אין להשלים דין מן הדעת.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 257',
    sourceText: 'הולד מן השביעי והעשירי צורה; אם יצאה מיטיבה — דון לו בטוב, ואם מזיקה — דון לו ברע.',
    housesUsed: [7, 10],
    h7Pattern,
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    classification,
    rulerCondition,
    rulerConditionHebrew,
    positive,
    outputHebrew,
  };
}


function computeDowryH8P204(chart) {
  if (!Array.isArray(chart)) return null;
  const h8 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 8) || chart[7] || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h8Pattern) return null;

  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || h8Pattern;
  const classification = classifyCanonicalFigure(h8Pattern);
  const isLarge = classification.saadNahs === 'saad' ? true : null;

  let outputHebrew;
  if (isLarge === true) {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה מיטיבה. לפי כשף עמ׳ 204: המוהר גדול.';
  } else if (classification.saadNahs === 'nahs') {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה מזיקה. עמ׳ 204 קובע במפורש רק שמיטיב בבית 8 מורה על מוהר גדול; משפט המזיק הסמוך שייך לדין המשפחה בבית 10. לכן אין להסיק מכאן מוהר קטן.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה ממוזגת. עמ׳ 204 אינו נותן כאן דין מפורש לגודל המוהר בצורת ממוזג, ולכן אין להשלים מן הדעת.';
  } else {
    outputHebrew = 'לא ניתן לסווג את צורת בית 8 לפי סיווג המיטיב/מזיק/ממוזג הקנוני; אין להכריע את גודל המוהר.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204',
    sourceText: 'צורה מיטיבה בבית השמיני מורה על מוהר גדול.',
    housesUsed: [8],
    h8Pattern,
    h8FigureHebrew,
    classification,
    isLargeDowry: isLarge,
    positive: null,
    outputHebrew,
  };
}

const CUSTOM_EXECUTORS = Object.freeze({
  'marriage.p204.previousStatusH7inH10': computeMarriagePreviousStatusP204,
  'marriage.p204.dowryH8': computeDowryH8P204,
  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,
  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,
  'pregnancy.p191.genderH5': computePregnancyGenderP191,
  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,
  'authority.p256.honorConditionH10Planet': computeHonorConditionP256,
  'authority.p257.appointmentH1H10Planet': computeAppointmentCompletionP257,
  'authority.p257.rulerConditionH7H10': computeRulerConditionP257,
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
