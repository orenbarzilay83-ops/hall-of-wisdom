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


// Kashf p204 attention/look rule. In the canonical figure encoding, a row
// with one point ('1') is open/unbound and a row with two points ('2') is
// joined/closed. This is also consistent with the source definition of the
// four mutable figures: their fire and earth rows are both open.
//
// IMPORTANT: this executor is deliberately limited to the explicit p204
// clause. A similar practical rule appears at p170 with additional branches;
// those branches are not imported into this p204 method.
function getCanonicalRowState(pattern, rowIndex) {
  if (typeof pattern !== 'string' || pattern.length !== 4) return null;
  if (pattern[rowIndex] === '1') return 'open';
  if (pattern[rowIndex] === '2') return 'joined';
  return null;
}

function computeLoveAttentionP204(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h7 = findCanonicalHouse(chart, 7);
  const h13 = findCanonicalHouse(chart, 13);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h13Pattern = h13?.key || h13?.pattern || null;
  if (!h1Pattern || !h7Pattern || !h13Pattern) return null;

  const h1Fire = getCanonicalRowState(h1Pattern, 0);
  const h7Fire = getCanonicalRowState(h7Pattern, 0);
  const h13Fire = getCanonicalRowState(h13Pattern, 0);
  if (!h1Fire || !h7Fire || !h13Fire) return null;

  const sourceConditionMet = h1Fire === 'open' && h7Fire === 'open' && h13Fire === 'joined';
  const attention = sourceConditionMet ? 'mutual-and-others' : null;
  const attentionHebrew = sourceConditionMet ? 'שניהם מביטים זה בזה וגם באחרים' : 'לא הוכרע בכלל זה';

  const outputHebrew = sourceConditionMet
    ? 'שורת האש בבית 1 פתוחה, שורת האש בבית 7 פתוחה, ושורת האש בבית 13 מתחברת (שתי נקודות). לפי כשף עמ׳ 204: שניהם מביטים זה בזה וגם באחרים.'
    : 'תנאי עמ׳ 204 אינו מתקיים במלואו: הוא דורש אש פתוחה בבית 1, אש פתוחה בבית 7 ואש מתחברת בבית 13. לכן כלל זה לבדו אינו מכריע לאן מופנה המבט. אין לייבא לכאן את הענפים הנוספים של הכלל הדומה בעמ׳ 170, ואין להסיק מכאן אם קיימת אהבה.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204; מצב שורה פתוחה/מתחברת לפי כללי הצורות',
    sourceText: 'האם אדם זה מביט אליך או אל אחר? אם אש הבית הראשון פתוחה, ואש הבית השביעי פתוחה, וגם אש הבית השלושה־עשר מתחברת — שניהם מביטים זה בזה וגם באחרים.',
    housesUsed: [1, 7, 13],
    h1Pattern,
    h7Pattern,
    h13Pattern,
    fireRows: { h1: h1Fire, h7: h7Fire, h13: h13Fire },
    sourceConditionMet,
    attention,
    attentionHebrew,
    positive: null,
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


function computeLostItemReturnP202(chart) {
  if (!Array.isArray(chart)) return null;
  const h6 = findCanonicalHouse(chart, 6);
  const h8 = findCanonicalHouse(chart, 8);
  const h6Pattern = h6?.key || h6?.pattern || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h6Pattern || !h8Pattern) return null;

  const h6Classification = classifyCanonicalFigure(h6Pattern);
  const h8Classification = classifyCanonicalFigure(h8Pattern);
  const h6Qualifies = h6Classification.saadNahs === 'saad' && h6Classification.dakhalKharij === 'dakhil';
  const h8Qualifies = h8Classification.saadNahs === 'saad' && h8Classification.dakhalKharij === 'dakhil';
  const returns = h6Qualifies && h8Qualifies;

  const h6FigureHebrew = h6?.hebrew || h6?.hebrewName || h6Pattern;
  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || h8Pattern;
  const outputHebrew = returns
    ? 'בית 6: ' + h6FigureHebrew + ' (' + h6Pattern + ') ובית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — שתיהן צורות מיטיבות פנימיות. לפי כשף עמ׳ 202: האבדה תשוב.'
    : 'לפי כשף עמ׳ 202, חזרת האבדה דורשת שגם בית 6 וגם בית 8 יהיו צורות מיטיבות פנימיות. התנאי אינו מתקיים בשני הבתים יחד; לכן לפי כלל זה האבדה אינה שבה. אין להפוך צורה ממוזגת למיטיבה, ואין להחשיב צורה קבועה/מתהפכת/חיצונית כפנימית.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 202',
    sourceText: 'בעניין האבדה ושיבתה: כוון אל הבית השמיני והשישי; אם היו הצורות מיטיבות פנימיות — שבה, ואם לא — לא.',
    housesUsed: [6, 8],
    h6Pattern,
    h8Pattern,
    h6FigureHebrew,
    h8FigureHebrew,
    h6Classification,
    h8Classification,
    h6Qualifies,
    h8Qualifies,
    returns,
    positive: returns,
    outputHebrew,
  };
}


function computeHiddenStillThereP188(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 4, 13, 14, 15];
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const allBenefic = houseResults.every((item) => item.classification.saadNahs === 'saad');
  const presentInPlace = allBenefic;
  const nonBeneficHouses = houseResults
    .filter((item) => item.classification.saadNahs !== 'saad')
    .map((item) => item.houseNumber);

  const outputHebrew = presentInPlace
    ? 'בבתים 1, 2, 4, 13, 14 ו־15 נמצאו צורות מיטיבות. לפי כשף עמ׳ 188: הדבר הנסתר נמצא עדיין במקום הנבדק.'
    : 'לא כל הצורות בבתים 1, 2, 4, 13, 14 ו־15 מיטיבות (הבתים שאינם מיטיבים במפורש: ' + nonBeneficHouses.join(', ') + '). לפי כשף עמ׳ 188: הדבר הנסתר אינו במקום הנבדק. כלל זה עוסק בדבר נסתר שכבר נשאל עליו ובמקומו; הוא אינו מוכיח מעצמו שקיים מטמון לא ידוע.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 188',
    sourceText: 'בדבר הנסתר — האם הוא במקומו או לא? התבונן בראשון, בשני, בבית הדבר הנסתר — הרביעי — ובשלושה־עשר, בארבעה־עשר ובחמישה־עשר. אם הצורות מיטיבות, הרי הוא שם; ואם אינן מיטיבות, אינו שם.',
    housesUsed,
    houseResults,
    allBenefic,
    nonBeneficHouses,
    presentInPlace,
    positive: presentInPlace,
    outputHebrew,
  };
}


// Kashf p196: H15 alone gives the primary recovery/prolongation indication.
// Benefic => the patient recovers. Malefic => the illness is prolonged.
// The malefic clause does NOT say that recovery is impossible or that the
// patient dies, so canonical output must not turn prolongation into a false
// yes/no "will never recover" verdict. Mixed remains unresolved by this rule.
function computeIllnessRecoveryP196(chart) {
  if (!Array.isArray(chart)) return null;
  const h15 = findCanonicalHouse(chart, 15);
  const h15Pattern = h15?.key || h15?.pattern || null;
  if (!h15Pattern) return null;

  const h15FigureHebrew = h15?.hebrew || h15?.hebrewName || h15Pattern;
  const classification = classifyCanonicalFigure(h15Pattern);

  let recoveryStatus = 'unresolved';
  let recovers = null;
  let positive = null;
  let outputHebrew;

  if (classification.saadNahs === 'saad') {
    recoveryStatus = 'recovers';
    recovers = true;
    positive = true;
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה מיטיבה. לפי כשף עמ׳ 196: החולה יתרפא.';
  } else if (classification.saadNahs === 'nahs') {
    recoveryStatus = 'prolonged-illness';
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה מזיקה. לפי כשף עמ׳ 196: המחלה תתארך. המקור אינו שולל כאן החלמה עתידית ואינו נותן כאן דין מוות.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה ממוזגת. כלל כשף עמ׳ 196 נותן דין מפורש למיטיב ולמזיק בלבד; אין להמיר את הנטייה של צורה ממוזגת אוטומטית להחלמה או להתארכות.';
  } else {
    outputHebrew = 'לא ניתן לסווג את צורת בית 15 לפי סיווג מיטיב/מזיק/ממוזג הקנוני; אין להכריע את דין ההחלמה מן הכלל הזה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 196',
    sourceText: 'אם בחמישה־עשר צורה מיטיבה, הוא יתרפא; ואם היא מזיקה, המחלה תתארך.',
    housesUsed: [15],
    h15Pattern,
    h15FigureHebrew,
    classification,
    recoveryStatus,
    recovers,
    positive,
    outputHebrew,
  };
}


// Kashf v57 p183: current-place evidence is H1+H4, and move evidence is
// H7+H10. The source gives positive clauses only. Absence of the positive
// condition is not silently inverted into a negative verdict, and the method
// does not rank the two options when both qualify.
function computeRelocationCurrentVsNewP183(chart) {
  if (!Array.isArray(chart)) return null;
  const houseNumbers = [1, 4, 7, 10];
  const rows = houseNumbers.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  });
  if (rows.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));
  const isPureBenefic = (houseNumber) => byHouse[houseNumber].classification.saadNahs === 'saad';
  const currentPlaceGood = isPureBenefic(1) && isPureBenefic(4);
  const moveGood = isPureBenefic(7) && isPureBenefic(10);

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'הכלל אינו מכריע בין האפשרויות';
  let outputHebrew;

  if (currentPlaceGood && moveGood) {
    sourceOutcome = 'both-good';
    sourceOutcomeHebrew = 'גם המגורים במקום הנוכחי וגם המעבר מקבלים עדות טובה';
    outputHebrew = 'בית 1 ובית 4 מיטיבים, ולכן לפי כשף עמ׳ 183 יש טובה במגורים במקום הנוכחי. גם בית 7 ובית 10 מיטיבים, ולכן יש טובה במעבר. המקור אינו מדרג בין שתי האפשרויות כאשר שני הזוגות עומדים בתנאי.';
  } else if (currentPlaceGood) {
    sourceOutcome = 'current-place-good';
    sourceOutcomeHebrew = 'טובת המגורים במקום הנוכחי';
    outputHebrew = 'בית 1 ובית 4 שניהם מיטיבים. לפי כשף עמ׳ 183: דון בטובת המגורים במקום הנוכחי. הזוג 7+10 אינו עומד כאן בתנאי החיובי המפורש למעבר; אין להפוך זאת לבדו לדין שהמעבר רע.';
  } else if (moveGood) {
    sourceOutcome = 'move-good';
    sourceOutcomeHebrew = 'טובת המעבר';
    outputHebrew = 'בית 7 ובית 10 שניהם מיטיבים. לפי כשף עמ׳ 183: דון בטובת המעבר. הזוג 1+4 אינו עומד כאן בתנאי החיובי המפורש למגורים; אין להסיק מכך לבדו דין שלילי על המקום הנוכחי.';
  } else {
    const mixedHouses = rows.filter((item) => item.classification.saadNahs === 'mixed').map((item) => item.houseNumber);
    outputHebrew = 'בעמ׳ 183 נמסרו שני תנאים חיוביים: 1+4 מיטיבים לטובת המגורים, ו־7+10 מיטיבים לטובת המעבר. אף אחד משני הזוגות אינו כולו מיטיב כאן, ולכן הכלל לבדו אינו נותן הכרעה חיובית לאחד הצדדים ואין להשלים דין שלילי מן הדעת.' + (mixedHouses.length ? ' צורה ממוזגת נמצאה בבית/בתים ' + mixedHouses.join(', ') + ' ואינה מקודמת למיטיבה.' : '');
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 183',
    sourceText: 'במעבר — האם מקום זה טוב לי או לא? התבונן בראשון וברביעי. אם שניהם מיטיבים, דון בטובת המגורים. ואם השביעי והעשירי צורות מיטיבות, דון בטובת המעבר.',
    housesUsed: houseNumbers,
    houseResults: rows,
    currentPlacePair: [1, 4],
    movePair: [7, 10],
    currentPlaceGood,
    moveGood,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: null,
    outputHebrew,
  };
}


// Kashf v57 p172: derive one figure from H1+H7, another from H10+H11,
// then combine those generated figures. The final figure is the result of the
// querent's matter "for good or bad". Canonical source-safe fortune classes
// are preserved: mixed is not collapsed into benefic or malefic.
function computeMatterOutcomeP172(chart) {
  if (!Array.isArray(chart)) return null;
  const houseNumbers = [1, 7, 10, 11];
  const patterns = {};

  for (const houseNumber of houseNumbers) {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    patterns[houseNumber] = pattern;
  }

  const firstSeventh = combineRamlFigures(patterns[1], patterns[7]);
  const tenthEleventh = combineRamlFigures(patterns[10], patterns[11]);
  const finalCombination = combineRamlFigures(firstSeventh.resultPattern, tenthEleventh.resultPattern);
  const resultPattern = finalCombination.resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע לטוב או לרע בכלל זה';
  let positive = null;

  if (classification.saadNahs === 'saad') {
    sourceOutcome = 'good';
    sourceOutcomeHebrew = 'תוצאת העניין לטוב';
    positive = true;
  } else if (classification.saadNahs === 'nahs') {
    sourceOutcome = 'bad';
    sourceOutcomeHebrew = 'תוצאת העניין לרע';
    positive = false;
  } else if (classification.saadNahs === 'mixed') {
    sourceOutcome = 'mixed';
    sourceOutcomeHebrew = classification.mixedTendencyHebrew
      ? 'תוצאת העניין ממוזגת — ' + classification.mixedTendencyHebrew
      : 'תוצאת העניין ממוזגת';
  }

  const finalFigureLabel = classification.figureHebrew || resultPattern;
  const outputHebrew = classification.saadNahs === 'saad'
    ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — מיטיבה. לכן תוצאת עניינו של השואל נידונה לטוב.'
    : classification.saadNahs === 'nahs'
      ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — מזיקה. לכן תוצאת עניינו של השואל נידונה לרע.'
      : classification.saadNahs === 'mixed'
        ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — ממוזגת. אין להפוך צורה ממוזגת בכוח להכרעת טוב או רע חד־משמעית.'
        : 'הצורה הסופית נוצרה לפי חיבורי עמ׳ 172, אך סיווג הטוב/הרע שלה אינו זמין; לכן אין הכרעה לפי כלל זה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 172',
    sourceText: 'לדעת את תוצאת עניינו של השואל, הוצא צורה מן הבית הראשון והשביעי, וצורה נוספת מן העשירי והאחד־עשר. אחר כך צרף אותן; הצורה היוצאת מהן היא תוצאת עניינו של השואל — לטוב או לרע.',
    housesUsed: houseNumbers,
    housePatterns: patterns,
    firstSeventhPattern: firstSeventh.resultPattern,
    tenthEleventhPattern: tenthEleventh.resultPattern,
    resultPattern,
    resultFigureHebrew: classification.figureHebrew || null,
    classification,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive,
    outputHebrew,
  };
}


// Kashf v57 p253 — religion/righteousness. The source names H3 and H9
// together and gives only two explicit branches: malefic -> little religion;
// benefic -> religious and God-fearing. Canonical execution therefore requires
// both houses to agree in the same pure class. Mixed or split testimony is
// preserved as unresolved rather than invented into a third source verdict.
function computeReligionQualityP253(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [3, 9];
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const [h3, h9] = houseResults;
  const h3Quality = h3.classification.saadNahs;
  const h9Quality = h9.classification.saadNahs;
  const bothBenefic = h3Quality === 'saad' && h9Quality === 'saad';
  const bothMalefic = h3Quality === 'nahs' && h9Quality === 'nahs';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע לפי כלל זה';
  let positive = null;
  let outputHebrew;

  if (bothBenefic) {
    sourceOutcome = 'religious-and-god-fearing';
    sourceOutcomeHebrew = 'בעל דת ויראת אלוהים';
    positive = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 253, בבית השלישי ובבית התשיעי נמצאות צורות מיטיבות. לפי לשון הכלל: הוא בעל דת ויראת אלוהים.';
  } else if (bothMalefic) {
    sourceOutcome = 'little-religion';
    sourceOutcomeHebrew = 'מועט בדת';
    positive = false;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 253, בבית השלישי ובבית התשיעי נמצאות צורות מזיקות. לפי לשון הכלל: הוא מועט בדת.';
  } else {
    const hasMixed = h3Quality === 'mixed' || h9Quality === 'mixed';
    outputHebrew = hasMixed
      ? 'כלל v57 עמ׳ 253 נותן הכרעה כאשר השלישי והתשיעי נידונים כמיטיבים או כמזיקים. כאן לפחות אחד משני הבתים ממוזג, ולכן אין להפוך את הנטייה שלו בכוח למיטיבה או למזיקה ואין הכרעה לפי כלל זה.'
      : 'בית 3 ובית 9 אינם נותנים כאן עדות אחידה של שני מיטיבים או שני מזיקים. המקור אינו מוסר ענף מפורש לעדות מפוצלת, ולכן אין הכרעה לפי כלל זה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 253',
    sourceText: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',
    housesUsed,
    houseResults,
    h3Quality,
    h9Quality,
    bothBenefic,
    bothMalefic,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive,
    outputHebrew,
  };
}


// Kashf v57 p212 — reconciliation in disputes.
// Generate one figure from H1+H7. The source explicitly states only the
// benefic branch: if the generated figure is benefic, the two sides reconcile.
// The converse is not silently invented. Mediator identity rules are not part
// of this yes/no executor.
function computeDisputeReconciliationP212(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h7 = findCanonicalHouse(chart, 7);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  if (!h1Pattern || !h7Pattern) return null;

  const combined = combineRamlFigures(h1Pattern, h7Pattern);
  const resultPattern = combined.resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);
  const isBenefic = classification.saadNahs === 'saad';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע אם יהיה פיוס לפי כלל זה';
  let positive = null;
  let outputHebrew;

  if (isBenefic) {
    sourceOutcome = 'reconciliation';
    sourceOutcomeHebrew = 'שני הצדדים יתפייסו';
    positive = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 212, מן הבית הראשון והשביעי נולדה צורה מיטיבה. לפי לשון הכלל: שני הצדדים יתפייסו.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בעמ׳ 212 נמסר במפורש ענף לפיוס כאשר הצורה הנולדת מן הראשון והשביעי מיטיבה. כאן הצורה ממוזגת, ולכן אין להפוך את נטייתה בכוח למיטיבה ואין הכרעת פיוס לפי כלל זה.';
  } else if (classification.saadNahs === 'nahs') {
    outputHebrew = 'בעמ׳ 212 נמסר במפורש ענף לפיוס כאשר הצורה הנולדת מן הראשון והשביעי מיטיבה. כאן הצורה מזיקה, אך סעיף זה אינו אומר במפורש שההפך מוכיח אי־פיוס; לכן אין להשלים דין כזה מן הדעת.';
  } else {
    outputHebrew = 'הצורה נולדה מן הבית הראשון והשביעי לפי עמ׳ 212, אך סיווגה אינו זמין; לכן אין הכרעה לפי כלל זה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 212',
    sourceText: 'אם מן הראשון והשביעי נולדת צורה מיטיבה, שניהם יתפייסו על ידי מי שמורה עליו הבית שבו שוכנת הצורה. אם בראשון צורת השמש — הפיוס בא מן השלטון; ואם בעשירי צורת צדק — מן הדיין; ואם בראשון צורה של נציב או ממונה — מן המושל.',
    housesUsed: [1, 7],
    h1Pattern,
    h7Pattern,
    resultPattern,
    resultFigureHebrew: classification.figureHebrew || null,
    classification,
    reconciliation: isBenefic ? true : null,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive,
    mediatorResolved: false,
    outputHebrew,
  };
}

const CUSTOM_EXECUTORS = Object.freeze({
  'dispute.p212.reconciliationH1H7': computeDisputeReconciliationP212,
  'religion.p253.h3h9Quality': computeReligionQualityP253,
  'matter.p172.h17_h1011_thenCombine': computeMatterOutcomeP172,
  'relocation.p183.currentVsNewPlace': computeRelocationCurrentVsNewP183,
  'illness.p196.outcomeH15': computeIllnessRecoveryP196,
  'hidden.p188.isStillThere': computeHiddenStillThereP188,
  'lostItem.p202.returnH6H8': computeLostItemReturnP202,
  'marriage.p204.previousStatusH7inH10': computeMarriagePreviousStatusP204,
  'love.p204.attentionFireRows1713': computeLoveAttentionP204,
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
