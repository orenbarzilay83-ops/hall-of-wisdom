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
  computeBodyPartDiagnosisKashf,
} from './kashf-pending-extraction.js';

import { combineRamlFigures } from './raml-figures.js';
import { buildRamlBoardFromMothers } from './raml-board-generator.js';
import { FIGURE_PLANET_MAP } from '../data/sources/kashf-al-asrar/kashf-hazz.js';
import { classifyCanonicalFigure } from './kashf-canonical-figure-classifier.js';
import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';

const LEGACY_EXECUTORS = Object.freeze({
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

function computeMiscarriageRedH7NakisH8P191P192(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house) === 7)
    || chart.find((entry) => Number(entry?.houseNumber) === 7)
    || chart[6] || null;
  const h8 = chart.find((entry) => Number(entry?.house) === 8)
    || chart.find((entry) => Number(entry?.houseNumber) === 8)
    || chart[7] || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h7Pattern || !h8Pattern) return null;

  const humraInH7 = h7Pattern === '2122';
  const nakisInH8 = h8Pattern === '2221';
  const miscarriageSign = humraInH7 && nakisInH8;
  const sourceOutcome = miscarriageSign ? 'miscarriage-sign' : 'unresolved';
  const h7FigureHebrew = h7?.hebrew || h7?.hebrewName || classifyCanonicalFigure(h7Pattern).figureHebrew || h7Pattern;
  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || classifyCanonicalFigure(h8Pattern).figureHebrew || h8Pattern;
  const outputHebrew = miscarriageSign
    ? 'בית 7 הוא אדום/חֻמְרַה (2122) ובית 8 הוא שפל ראש/אַנְכִּיס (2221). לפי הכלל החוצה את עמ׳ 191–192 בכשף, זהו סימן ההפלה המפורש במקור. זהו פסק של שיטת גורל החול בלבד ואינו אבחון או ודאות רפואית.'
    : 'הצירוף המפורש של עמ׳ 191–192 — אדום בבית 7 יחד עם שפל ראש בבית 8 — אינו מתקיים. המקור אינו אומר שהיעדר הצירוף מוכיח שההריון בטוח או שלא תתרחש הפלה, ולכן שיטה זו נשארת ללא הכרעה.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 191–192',
    sourceText: 'כאשר אדום נמצא בבית השביעי ושפל ראש בבית השמיני — האישה ההרה מפילה.',
    housesUsed: [7, 8],
    h7Pattern,
    h8Pattern,
    h7FigureHebrew,
    h8FigureHebrew,
    humraInH7,
    nakisInH8,
    miscarriageSign,
    sourceOutcome,
    positive: null,
    verdictType: 'miscarriage-source-sign',
    outputHebrew,
  };
}

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




// Kashf p225 gives the routing rule: take the thief's description from H7.
// The detailed sixteen-figure profile table begins on p231 and continues
// through pp232-233.  This canonical copy is deliberately source-bounded:
// it returns the printed profile for the H7 figure and nothing more.  It does
// NOT identify a real person, prove guilt, calculate name letters, or import
// the separate p224 recurrence/relationship rule.
const P225_THIEF_DESCRIPTION_BY_PATTERN = Object.freeze({
  '1121': 'בהיר־שיער/בלונדיני, גבוה, וזקנו דליל. בנוסח אחר: בעל מראה נשי או אנדרוגיני, סריס, או חסר זקן.',
  '1222': 'עד, סופר או מלמד. בנוסח אחר: שלם במבנהו, חזהו רחב, פניו עגולות, עיניו גדולות, תוארו נאה, צבעו לבן, בהיר־שיער ובעל זקן גדול.',
  '2111': 'אישה לבנת־צבע, מהירת דיבור, ראשה גדול וכפות רגליה דקות. בנוסח אחר: סאסאנית או עירונית.',
  '2212': 'אדם לבן, מחייך ומובחן, ודיבורו נעים. בנוסח אחר: עוסק בנייר/כתיבה, בחייטות או בהלבנת בדים.',
  '1211': 'אדם הנמשך אחר נשים ונחשב לבעל דעת רבה; מלאכתו סייף/מוציא־להורג או קשת. בנוסח אחר: אישה או נער יפה־עיניים.',
  '1112': 'שחום־עור. בנוסח אחר: ראייתו רעה, ריחו רע, ועיסוקו באשפה או במלאכה ירודה מן הסוג המתואר במקור.',
  '2122': 'צבעו דמי, קומתו גבוהה, כפות רגליו רחבות ויש סימן בפניו; עיסוקו טבח, עובד חום/אש, או רכיל פרוץ.',
  '2221': 'צבעו שחור; בלשון המקור מיוחס לו שורש של עבדות. עיסוקו בעיבוד עורות, בעבודת אדמה, בקריאה/כריזה או בהובלת בהמות.',
  '1122': 'פניו עגולות, כפות רגליו רחבות והוא בעל הדר ומעמד; עיסוקו בזהב או באבני חן.',
  '1221': 'שחום־עור, בטנו רחבה וכפות רגליו גדולות; עיסוקו סנדלר.',
  '2112': 'איש לשכה/דיוואן, מעתיק כתבים, שופט או אסטרולוג, ועוסק במכירת ספרים; קומתו גבוהה, זקנו גדול וראשו קטן.',
  '2211': 'אישה לבנת־צבע, עגולת פנים, ראשה גדול וכפות רגליה קטנות. בנוסח אחר: שופט או פוסק־הלכה בעל מעלה וידע.',
  '1111': 'נער קטן, גבוה ודק־גוף; רקדן, או מי שעיסוקו בהליכה ובריצה.',
  '1212': 'אדם לבן או צהבהב, כפות רגליו גדולות וראשו קטן; עיסוקו ברפואה.',
  '2222': 'גופו רחב, ובניסוח המקור אופיו רע; סנטרו גדול וכפות רגליו רחבות. עיסוקו ספנות, הנדסה או ראשות מלאכה.',
  '2121': 'קומתו בינונית, צבעו חיטה, פניו עגולות, ראשו וכפות רגליו גדולים וזקנו עבה; עיסוקו בסחורה וברווחים עבור אחרים.',
});

function computeThiefDescriptionP225(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const figureHebrew = classification.figureHebrew || h7?.hebrew || h7?.hebrewName || pattern;
  const description = P225_THIEF_DESCRIPTION_BY_PATTERN[pattern] || null;

  const outputHebrew = description
    ? 'בית 7: ' + figureHebrew + ' (' + pattern + '). לפי הוראת כשף עמ׳ 225 וטבלת התיאור בעמ׳ 231–233: ' + description + ' זהו פרופיל תיאורי מן המקור בלבד; הוא אינו מזהה אדם מסוים ואינו מוכיח אשמה.'
    : 'בית 7: ' + figureHebrew + ' (' + pattern + '). לא נמצא עבור הצורה הזאת תיאור בטבלת כשף עמ׳ 231–233; אין להשלים תיאור מן הדעת.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 225; טבלת תיאור הגנב עמ׳ 231–233',
    sourceText: 'מן הבית השביעי נלקחת صفة السارق; תיאורי שש־עשרה הצורות מפורטים בעמ׳ 231–233.',
    housesUsed: [7],
    h7Pattern: pattern,
    h7FigureHebrew: figureHebrew,
    description,
    profileResolved: Boolean(description),
    identityResolved: false,
    guiltProven: false,
    nameLettersResolved: false,
    positive: null,
    verdictType: 'thief-source-profile',
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


// Kashf p254 — profession/craft from the p133-134 figure attribution in H9.
// H10/H11 are a separate one-way ease-of-work qualifier only: both must be
// pure سعد. Mixed figures are not promoted, and failure of the condition
// never creates the inverse claim that the work is difficult.
const P254_PROFESSION_BY_ATTRIBUTION = Object.freeze({
  'שבתאי': 'חקלאות ועבודת אדמה',
  'צדק': 'בקשת חכמות ולימודים',
  'מאדים': 'רפואה ורפואת בהמות',
  'שמש': 'הנדסה ומדידות',
  'נוגה': 'דברי הימים, לחנים וניגונים',
  'כוכב': 'כישוף, נפלאות ואצטגנינות',
  'ירח': 'ענייני עניים וצדיקים',
  'ראש התלי': 'ידיעת הדתות ואפשר ידיעה בחלק ממדע הנסתר',
  'זנב התלי': 'בורות, בגידה וקלקול',
});

function computeProfessionP254(chart) {
  if (!Array.isArray(chart)) return null;
  const h9 = findCanonicalHouse(chart, 9);
  const h10 = findCanonicalHouse(chart, 10);
  const h11 = findCanonicalHouse(chart, 11);
  const h9Pattern = h9?.key || h9?.pattern || null;
  if (!h9Pattern) return null;

  const attribution = getVerifiedPlanetForPattern(h9Pattern);
  const attributionHebrew = attribution?.planetHebrew || null;
  const profession = attributionHebrew ? (P254_PROFESSION_BY_ATTRIBUTION[attributionHebrew] || null) : null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  const h11Pattern = h11?.key || h11?.pattern || null;
  const h10Classification = h10Pattern ? classifyCanonicalFigure(h10Pattern) : null;
  const h11Classification = h11Pattern ? classifyCanonicalFigure(h11Pattern) : null;
  const h10PureSaad = h10Classification?.saadNahs === 'saad';
  const h11PureSaad = h11Classification?.saadNahs === 'saad';
  const easeOfWorkIndicated = h10PureSaad && h11PureSaad ? true : null;

  const h9FigureHebrew = h9?.hebrew || h9?.hebrewName || h9Pattern;
  const parts = [];
  if (easeOfWorkIndicated === true) {
    parts.push('בתים 10 ו־11 שניהם מיטיבים טהורים. לפי כשף עמ׳ 254: מלאכתו מעטה בטרחה והוא מוצא בה מנוחה.');
  }
  if (attributionHebrew && profession) {
    parts.push(`בית 9: ${h9FigureHebrew} (${h9Pattern}) — ${attributionHebrew}: ${profession}.`);
  } else {
    parts.push(`בית 9: ${h9FigureHebrew} (${h9Pattern}) — ייחוס הצורה אינו מוכרע בטבלת עמ׳ 133–134, ולכן עמ׳ 254 אינו מאפשר לקבוע את סוג המלאכה.`);
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 254; טבלת ייחוס הצורות עמ׳ 133–134',
    sourceText: 'אם בבית העשירי ובאחד־עשר יש צורה מיטיבה, מלאכתו מעטה בטרחה והוא מוצא בה מנוחה. את סוג המלאכה דנים לפי ייחוס הצורה בבית התשיעי.',
    housesUsed: [9, 10, 11],
    h9Pattern,
    h9FigureHebrew,
    attributionHebrew,
    attributionArabic: attribution?.planetArabic || null,
    planet9: attributionHebrew,
    profession,
    h10Pattern,
    h11Pattern,
    h10Quality: h10Classification?.saadNahs || null,
    h11Quality: h11Classification?.saadNahs || null,
    easeOfWorkIndicated,
    lightWork: easeOfWorkIndicated === true,
    positive: null,
    verdictType: 'profession-by-h9-attribution',
    outputHebrew: parts.join(' '),
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

// Printed p267 gives a separate House 11 fallback after the compound
// H1/H2/H5/H13 and recurrence test. Only that explicit fallback runs here;
// neither failure of the compound test nor a mixed H11 is inverted into a verdict.
function computeHopeHouse11FallbackP267(chart) {
  if (!Array.isArray(chart)) return null;
  const h11 = findCanonicalHouse(chart, 11);
  const pattern = h11?.key || h11?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const outcome = classification.saadNahs === 'saad' ? 'hope-and-good'
    : classification.saadNahs === 'nahs' ? 'not-completed' : 'unresolved';
  const outputHebrew = outcome === 'hope-and-good'
    ? `בבית התקווה מופיעה ${classification.figureHebrew} (${pattern}), צורה מיטיבה. סימן זה מורה על זכייה וטוב.`
    : outcome === 'not-completed'
      ? `בבית התקווה מופיעה ${classification.figureHebrew} (${pattern}), צורה מזיקה. סימן זה מורה שהדבר אינו נשלם.`
      : `צורת בית התקווה, ${classification.figureHebrew || pattern}, אינה נותנת הכרעה בענף זה.`;
  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 267',
    sourceText: 'אלא אם בבית התקווה צורה מיטיבה — זכייה וטוב; ואם מזיקה — הדבר אינו נשלם.',
    housesUsed: [11], h11Pattern: pattern, classification: classification.saadNahs,
    branch: 'house11-fallback-only', outcome,
    positive: outcome === 'hope-and-good' ? true : outcome === 'not-completed' ? false : null,
    outputHebrew,
  };
}

// Printed p48 assigns gifts to H5; p193 judges gifts by benefic/malefic.
// The cross-passage result concerns a specified gift's sign, not arrival.
function computeSpecifiedGiftQualityH5P193(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = findCanonicalHouse(chart, 5);
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const branch = classification.saadNahs === 'saad' ? 'favorable'
    : classification.saadNahs === 'nahs' ? 'adverse' : 'unresolved';
  const conclusion = branch === 'favorable' ? 'סימן לטובה במתנה המסוימת.'
    : branch === 'adverse' ? 'סימן להפך במתנה המסוימת.'
      : 'צורת בית המתנות ממוזגת; אין פסק לטובה או להפך בסעיף זה.';
  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 48, 193',
    sourceText: 'בית 5 הוא בית המתנות; במתנות ובתשורות דנים במיטיב לטובה ובמזיק להפך.',
    housesUsed: [5], h5Pattern: pattern, classification, branch,
    positive: branch === 'favorable' ? true : branch === 'adverse' ? false : null,
    outputHebrew: `בבית המתנות נמצאת ${classification.figureHebrew || pattern} (${pattern}). ${conclusion} הכלל אינו קובע אם המתנה תגיע או מתי.`,
  };
}

// A separate vessel rule follows the p242 movement passage. The H1 figures
// The legacy method ID says p243-244; the H1 vessel list is on printed pp241-242
// (scan PDF pp243-244). Three figures are omitted.
const P243_VESSEL_DAMAGE_BY_PATTERN = Object.freeze({
  '1221': 'פגם בחלק הקדמי, המתוקן לאחר מכן', // סוהר
  '2112': 'פגם באחד הצדדים, המתוקן לאחר מכן', // חיבור
  '1111': 'פגם באמצע הכלי, המתוקן לאחר מכן', // דרך
  '1222': 'פגם גדול בראש הכלי; המקור אומר שהוא נשאר שלם', // נשוא ראש
  '2221': 'פגם במוצא הפסולת, המתוקן לאחר מכן', // שפל ראש
  '2122': 'פגם בחבלים, המתוקן לאחר מכן', // אדום
  '2212': 'פגם בחבלים, המתוקן לאחר מכן', // לבן
  '1112': 'פגם באחת הפינות, המתוקן לאחר מכן', // סף יוצא
  '1121': 'פגם במעברים, במחסנים או בתיבה, המתוקן לאחר מכן', // נלחם
  '1211': 'פגם במעברים, במחסנים או בתיבה, המתוקן לאחר מכן', // בר הלחי
  '2121': 'פגם במעברים, במחסנים או בתיבה, המתוקן לאחר מכן', // ממון נכנס
  '1212': 'פגם במעברים, במחסנים או בתיבה, המתוקן לאחר מכן', // ממון יוצא
});

function computeVesselH1SignsP243P244(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const pattern = h1?.key || h1?.pattern || null;
  if (!pattern) return null;
  const figure = classifyCanonicalFigure(pattern);
  const branch = pattern === '2222' ? 'safe-arrival-sign'
    : P243_VESSEL_DAMAGE_BY_PATTERN[pattern] ? 'repairable-damage-sign' : 'unresolved';
  const sign = branch === 'safe-arrival-sign' ? 'המקור מורה על הגעה בשלום.'
    : branch === 'repairable-damage-sign'
      ? `המקור מציין ${P243_VESSEL_DAMAGE_BY_PATTERN[pattern]}.`
      : 'צורה זו אינה נמנית עם הצורות שקיבלו דין מפורש בכלל הזה.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 241–242',
    sourceText: 'למצב כלי השיט הסתכל בצורת הבית הראשון: קהלה מורה על הגעה בשלום; הצורות המנויות האחרות מורות על פגמים מסוימים ותיקונם.',
    housesUsed: [1], h1Pattern: pattern, h1FigureHebrew: figure.figureHebrew,
    branch, damageSign: P243_VESSEL_DAMAGE_BY_PATTERN[pattern] || null,
    positive: branch === 'safe-arrival-sign' ? true : null,
    outputHebrew: `בבית 1 מופיעה ${figure.figureHebrew || pattern} (${pattern}). ${sign} זהו סימן לפי הספר, ולא אישור בטיחות עובדתי למסע.`,
  };
}

function computeFatherMoneySignH5P184(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = findCanonicalHouse(chart, 5);
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;
  const figure = classifyCanonicalFigure(pattern);
  const branch = figure.saadNahs === 'saad' ? 'money-sign'
    : figure.saadNahs === 'nahs' ? 'no-money-or-no-benefit-sign' : 'unresolved';
  const sign = branch === 'money-sign' ? 'לפי הכלל זהו סימן שיש לאב ממון.'
    : branch === 'no-money-or-no-benefit-sign'
      ? 'לפי הכלל זהו סימן שאין לו ממון, או שאינו נהנה מן הממון שיש לו.'
      : 'הצורה ממוזגת; סעיף זה אינו נותן לה פסק על ממון האב.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 184; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם בחמישי מיטיב, יהיה לאב ממון; ואם מזיק, אין לו ממון או שאין לו תועלת בממונו.',
    housesUsed: [5], h5Pattern: pattern, h5FigureHebrew: figure.figureHebrew,
    classification: figure.saadNahs, branch,
    positive: branch === 'money-sign' ? true : branch === 'no-money-or-no-benefit-sign' ? false : null,
    outputHebrew: `בבית 5 מופיעה ${figure.figureHebrew || pattern} (${pattern}). ${sign} הכלל אינו קובע את מצב בריאות האב, אריכות ימיו או הבעלות על בית וקרקע.`,
  };
}

function computeLandOwnershipSignH4P184(chart) {
  if (!Array.isArray(chart)) return null;
  const h4 = findCanonicalHouse(chart, 4);
  const pattern = h4?.key || h4?.pattern || null;
  if (!pattern) return null;
  const figure = classifyCanonicalFigure(pattern);
  const branch = figure.saadNahs === 'saad' ? 'ownership-sign'
    : figure.saadNahs === 'nahs' ? 'absence-or-loss-sign' : 'unresolved';
  const sign = branch === 'ownership-sign' ? 'לפי הסעיף זהו סימן לקניין ולהחזקת נכס.'
    : branch === 'absence-or-loss-sign' ? 'לפי הסעיף זהו סימן להעדר נכס או ליציאתו מיד השואל.'
      : 'הצורה ממוזגת; סעיף זה אינו מכריע על הקניין.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 184; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'צורות מיטיבות ברביעי מורות שיהיה לשואל נכס ויקנה נכס; אם הרביעי פנוי ממיטיבים — העדר הקניין ויציאתו מידו.',
    housesUsed: [4], h4Pattern: pattern, h4FigureHebrew: figure.figureHebrew,
    classification: figure.saadNahs, branch,
    positive: branch === 'ownership-sign' ? true : branch === 'absence-or-loss-sign' ? false : null,
    outputHebrew: `בבית 4 מופיעה ${figure.figureHebrew || pattern} (${pattern}). ${sign} הכלל אינו קובע יבול, השקיה או זכויות רשומות במרשם מקרקעין.`,
  };
}

function computeDisputeWinnerH1P212(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const pattern = h1?.key || h1?.pattern || null;
  if (!pattern) return null;
  const figure = classifyCanonicalFigure(pattern);
  const branch = figure.saadNahs === 'nahs' ? 'seeker-prevails'
    : figure.saadNahs === 'saad' ? 'other-party-prevails' : 'unresolved';
  const sign = branch === 'seeker-prevails' ? 'לפי סימן זה המבקש גובר.'
    : branch === 'other-party-prevails' ? 'לפי סימן זה הצד השני גובר.'
      : 'צורת הבית הראשון ממוזגת; הסעיף אינו מכריע מי גובר.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 212; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'במריבות: אם בראשון מזיק, המבקש גובר; אם מיטיב, להפך.',
    housesUsed: [1], h1Pattern: pattern, h1FigureHebrew: figure.figureHebrew,
    classification: figure.saadNahs, branch,
    positive: branch === 'seeker-prevails' ? true : branch === 'other-party-prevails' ? false : null,
    outputHebrew: `בבית 1 מופיעה ${figure.figureHebrew || pattern} (${pattern}). ${sign} זהו דין בית 1 בלבד; הספר מוסר באותו עמוד גם סימנים נוספים שאין כאן כלל הכרעה כאשר הם חלוקים.`,
  };
}

function computePrisonerRapidExitP272P273(chart) {
  if (!Array.isArray(chart)) return null;
  const h11 = findCanonicalHouse(chart, 11);
  const h5 = findCanonicalHouse(chart, 5);
  const h11Pattern = h11?.key || h11?.pattern || null;
  const h5Pattern = h5?.key || h5?.pattern || null;
  if (!h11Pattern || !h5Pattern) return null;
  const rapidExitSign = h11Pattern === '2211'; // כבוד נכנס
  const noExitCaution = h5Pattern === '2221'; // שפל ראש
  const branch = rapidExitSign && noExitCaution ? 'conflicting-signs'
    : rapidExitSign ? 'rapid-exit-sign' : noExitCaution ? 'no-exit-caution' : 'unresolved';
  const sign = branch === 'conflicting-signs'
    ? 'כבוד נכנס בבית 11 הוא סימן ליציאה מהירה, אך שפל ראש בבית 5 הוא אזהרה שמא לא יצא. הספר אינו נותן כאן כלל להכריע בין שני הסימנים.'
    : branch === 'rapid-exit-sign' ? 'כבוד נכנס בבית 11 הוא סימן ליציאה מהירה מן הכלא לפי הספר.'
      : branch === 'no-exit-caution' ? 'שפל ראש בבית 5 הוא אזהרה שמא לא יצא; אין בכך ודאות שלא ישוחרר.'
        : 'שני הסימנים המפורשים אינם מופיעים; הסעיפים הללו אינם מכריעים על יציאה מהירה.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 272–273',
    sourceText: 'כבוד נכנס בבית 11 בשאלת אסיר — יוצא במהירות; שפל ראש בבית 5 — יש לחשוש שמא לא יצא.',
    housesUsed: [11, 5], h11Pattern, h5Pattern,
    rapidExitSign, noExitCaution, branch,
    positive: branch === 'rapid-exit-sign' ? true : null,
    outputHebrew: `${sign} אין בסעיפים אלה תאריך שחרור.`,
  };
}

function computeMissingDepartedCityH7P249(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;
  const figure = classifyCanonicalFigure(pattern);
  const branch = figure.saadNahs === 'saad' && figure.dakhalKharij === 'kharij' ? 'departed-city-sign'
    : figure.dakhalKharij === 'mujassad-dakhil' ? 'remains-in-place-sign' : 'unresolved';
  const sign = branch === 'departed-city-sign' ? 'לפי הספר זהו סימן שהנעדר יצא מן העיר.'
    : branch === 'remains-in-place-sign' ? 'זוהי צורה קבועה; לפי הספר היא מורה שהנעדר שוהה במקומו, בלי לציין איזו עיר.'
      : 'הצורה אינה מתאימה לשני סימני המקום המפורשים בסעיף זה.';
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 247; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם בשביעי צורה מיטיבה חיצונית — יצא מן העיר; אם צורה קבועה — הוא שוהה במקומו.',
    housesUsed: [7], h7Pattern: pattern, h7FigureHebrew: figure.figureHebrew,
    quality: figure.saadNahs, motion: figure.dakhalKharij, branch,
    positive: branch === 'departed-city-sign' ? true : null,
    outputHebrew: `בבית 7 מופיעה ${figure.figureHebrew || pattern} (${pattern}). ${sign} הסעיף אינו מוסר כתובת, כיוון או מיקום נוכחי מאומת.`,
  };
}

// Printed p174: H5 and H11 are each combined with H1 before the two
// intermediate figures are combined. This is distinct from the p267 H11 rule.
function computeHopeThroughTwoIntermediatesP174(chart) {
  if (!Array.isArray(chart)) return null;
  const patterns = [1, 5, 11].map((house) => {
    const entry = findCanonicalHouse(chart, house);
    return entry?.key || entry?.pattern || null;
  });
  if (patterns.some((pattern) => !pattern)) return null;
  const [h1Pattern, h5Pattern, h11Pattern] = patterns;
  const first = combineRamlFigures(h5Pattern, h1Pattern).resultPattern;
  const second = combineRamlFigures(h11Pattern, h1Pattern).resultPattern;
  const resultPattern = combineRamlFigures(first, second).resultPattern;
  const result = classifyCanonicalFigure(resultPattern);
  const branch = result.saadNahs === 'saad' && result.dakhalKharij === 'dakhil'
    ? 'benefic-incoming'
    : result.saadNahs === 'saad' && result.dakhalKharij === 'kharij'
      ? 'benefic-outgoing'
      : result.saadNahs === 'nahs' && result.dakhalKharij === 'dakhil'
        ? 'malefic-incoming'
        : result.saadNahs === 'nahs' && result.dakhalKharij === 'kharij'
          ? 'malefic-outgoing' : 'unresolved';
  const conclusions = {
    'benefic-incoming': 'הבקשה תיענה.',
    'benefic-outgoing': 'הבקשה תתעכב ותיענה.',
    'malefic-incoming': 'הבקשה תושג בעמל.',
    'malefic-outgoing': 'טוב יותר לעזוב את הבקשה.',
    unresolved: 'הצורה המתקבלת אינה משתייכת לאחד מארבעת הצירופים המפורשים בכלל זה; אין הכרעה.',
  };
  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 174',
    sourceText: 'קח את החמישי ואת האחד־עשר והכה כל אחד בראשון; צרף את שתי הצורות היוצאות ודון במיטיב/מזיק ובפנימי/חיצוני.',
    housesUsed: [1, 5, 11], h1Pattern, h5Pattern, h11Pattern,
    firstIntermediatePattern: first, secondIntermediatePattern: second,
    resultPattern, resultFigureHebrew: result.figureHebrew,
    classification: result, branch,
    positive: branch === 'benefic-incoming' || branch === 'benefic-outgoing' || branch === 'malefic-incoming' ? true : null,
    outputHebrew: `שתי הצורות שנוצרו מן הבית הראשון עם החמישי ועם האחד־עשר הן ${first} ו־${second}; צורתן המצורפת היא ${result.figureHebrew || resultPattern} (${resultPattern}). ${conclusions[branch]}`,
  };
}

// Printed p176: the H1/H2 gate is evaluated before the H1+H4 outcome.
function computeRequestGateAndOutcomeP176(chart) {
  if (!Array.isArray(chart)) return null;
  const h1Pattern = findCanonicalHouse(chart, 1)?.key || findCanonicalHouse(chart, 1)?.pattern || null;
  const h2Pattern = findCanonicalHouse(chart, 2)?.key || findCanonicalHouse(chart, 2)?.pattern || null;
  const h4Pattern = findCanonicalHouse(chart, 4)?.key || findCanonicalHouse(chart, 4)?.pattern || null;
  if (!h1Pattern || !h2Pattern || !h4Pattern) return null;
  const h1 = classifyCanonicalFigure(h1Pattern);
  const h2 = classifyCanonicalFigure(h2Pattern);
  const gate = h1.saadNahs === 'nahs' || h2.saadNahs === 'nahs'
    ? 'leave-request'
    : h1.saadNahs === 'saad' && h2.saadNahs === 'saad'
      ? 'open' : 'unresolved';
  const derivedPattern = gate === 'open' ? combineRamlFigures(h1Pattern, h4Pattern).resultPattern : null;
  const derived = derivedPattern ? classifyCanonicalFigure(derivedPattern) : null;
  const branch = gate !== 'open' ? gate
    : derived.saadNahs === 'saad' ? 'good-end'
      : derived.saadNahs === 'nahs' ? 'difficult-end'
        : derived.saadNahs === 'mixed' ? 'middle-end' : 'unresolved';
  const conclusions = {
    'leave-request': 'אחת מצורות שער הבקשה מזיקה; הספר מורה לעזוב את הבקשה. אין מחשבים ממנה פסק אחרית.',
    'good-end': 'צורת האחרית מיטיבה: טוב, שלום ואחרית טובה.',
    'difficult-end': 'צורת האחרית מזיקה: חולשת האחרית, עמל וקושי.',
    'middle-end': 'צורת האחרית ממוזגת: אחרית ממוצעת, לא טוב גמור ולא רע גמור.',
    unresolved: 'שער הבקשה אינו מוכרע בצורות המיטיבות/המזיקות הטהורות; אין פסק אחרית בכלל זה.',
  };
  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 176',
    sourceText: 'אם אחד מן הראשון והשני מזיק — עזוב את הבקשה; אחר כך הוצא צורה מן הראשון והרביעי ודון במיטיב, מזיק או ממוזג.',
    housesUsed: [1, 2, 4], h1Pattern, h2Pattern, h4Pattern,
    gate, gateClasses: { h1: h1.saadNahs, h2: h2.saadNahs },
    derivedPattern, derivedFigureHebrew: derived?.figureHebrew || null,
    derivedClass: derived?.saadNahs || null, branch,
    positive: branch === 'good-end' ? true : branch === 'difficult-end' ? false : null,
    outputHebrew: `שער הבקשה: בית 1 ${h1.figureHebrew || h1Pattern}, בית 2 ${h2.figureHebrew || h2Pattern}. ${derivedPattern ? `חיבור 1+4 נתן ${derived.figureHebrew || derivedPattern} (${derivedPattern}). ` : ''}${conclusions[branch]}`,
  };
}

// Printed p176 مقصد الإنسان: a sign for a person's defined purpose,
// not a claim about moral character or undisclosed thoughts.
function computePersonPurposeSignP176(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const h10 = findCanonicalHouse(chart, 10);
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h7Pattern || !h10Pattern) return null;
  const resultPattern = combineRamlFigures(h7Pattern, h10Pattern).resultPattern;
  const result = classifyCanonicalFigure(resultPattern);
  const branch = result.saadNahs === 'saad' ? 'favorable'
    : result.saadNahs === 'nahs' ? 'adverse' : 'unresolved';
  const conclusion = branch === 'favorable' ? 'סימן מיטיב למטרה שנשאלה.'
    : branch === 'adverse' ? 'סימן מזיק למטרה שנשאלה.'
      : 'צורת התוצאה ממוזגת; הסעיף אינו נותן לה פסק חד־משמעי.';
  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 176',
    sourceText: 'במטרת אדם: הוצא צורה מן השביעי והעשירי; אם מיטיבה דון לטובה, ואם מזיקה דון לנחס.',
    housesUsed: [7, 10], h7Pattern, h10Pattern,
    resultPattern, resultFigureHebrew: result.figureHebrew,
    classification: result, branch,
    positive: branch === 'favorable' ? true : branch === 'adverse' ? false : null,
    outputHebrew: `חיבור הבתים 7 ו־10 נתן ${result.figureHebrew || resultPattern} (${resultPattern}). ${conclusion} הסימן אינו קובע את יושרו של האדם או את מחשבותיו הנסתרות.`,
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

function computeTheftRecoveryH8P224(chart) {
  if (!Array.isArray(chart)) return null;
  const h8 = findCanonicalHouse(chart, 8);
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h8Pattern) return null;

  const classification = classifyCanonicalFigure(h8Pattern);
  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || classification.figureHebrew || h8Pattern;
  const recovered = classification.saadNahs === 'saad' ? true
    : classification.saadNahs === 'nahs' ? false : null;
  const outputHebrew = recovered === true
    ? `בית 8: ${h8FigureHebrew} (${h8Pattern}) — צורה מיטיבה. לפי כשף עמ׳ 224, בעל הדבר יזכה ברכוש שנגנב.`
    : recovered === false
      ? `בית 8: ${h8FigureHebrew} (${h8Pattern}) — צורה מזיקה. לפי כשף עמ׳ 224, בעל הדבר לא יזכה ברכוש שנגנב.`
      : `בית 8: ${h8FigureHebrew} (${h8Pattern}) — ${classification.saadNahs === 'mixed' ? 'צורה ממוזגת' : 'סיווג לא ידוע'}. כלל עמ׳ 224 אינו מכריע כאן את השגת הרכוש שנגנב.`;

  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 224; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם בשמיני צורה מיטיבה, בעל הדבר יזכה בגניבה; ואם בו צורה מזיקה, לא יזכה בה.',
    housesUsed: [8],
    h8Pattern,
    h8FigureHebrew,
    classification,
    stolenPropertyRecovered: recovered,
    positive: recovered,
    outputHebrew,
  };
}

function computeEnemyPresenceH1H12P271(chart) {
  const h1 = findCanonicalHouse(chart, 1);
  const h12 = findCanonicalHouse(chart, 12);
  const h1Pattern = h1?.key || h1?.pattern;
  const h12Pattern = h12?.key || h12?.pattern;
  if (!h1Pattern || !h12Pattern) return null;
  const first = classifyCanonicalFigure(h1Pattern).saadNahs;
  const twelfth = classifyCanonicalFigure(h12Pattern).saadNahs;
  const branch = first === 'saad' && twelfth === 'saad' ? 'no-enemy'
    : first === 'nahs' && twelfth === 'nahs' ? 'enemies'
      : first === 'saad' && twelfth === 'nahs' ? 'querent-prevails'
        : first === 'nahs' && twelfth === 'saad' ? 'enemy-prevails' : null;
  const sayings = {
    'no-enemy': 'אין לו אויב.',
    enemies: 'יש לו אויבים.',
    'querent-prevails': 'הוא יגבר על אויביו.',
    'enemy-prevails': 'האויב יגבר עליו.',
  };
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 271; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם הראשון והשנים־עשר מיטיבים — אין לו אויב; אם שניהם מזיקים — יש לו אויבים; הראשון מיטיב והשנים־עשר מזיק — הוא יגבר; הראשון מזיק והשנים־עשר מיטיב — האויב יגבר.',
    housesUsed: [1, 12], h1Pattern, h12Pattern,
    h1FigureHebrew: h1?.hebrew || HAWI_FIGURE_NAMES_BY_ID[h1Pattern]?.hebrewName,
    h12FigureHebrew: h12?.hebrew || HAWI_FIGURE_NAMES_BY_ID[h12Pattern]?.hebrewName,
    h1Quality: first, h12Quality: twelfth, branch,
    enemyPresent: branch === 'no-enemy' ? false : branch ? true : null,
    querentPrevails: branch === 'querent-prevails' ? true : branch === 'enemy-prevails' ? false : null,
    positive: branch === 'no-enemy' ? false : branch ? true : null,
    outputHebrew: branch ? `לפי דין בתי 1 ו־12: ${sayings[branch]}`
      : 'בבתים 1 ו־12 יש צורה ממוזגת או בלתי מסווגת; ארבעת ענפי הדין בעמ׳ 271 אינם מכריעים צירוף זה.',
  };
}

function computeIllnessHumorH1H8P197(chart) {
  const h1 = findCanonicalHouse(chart, 1);
  const h8 = findCanonicalHouse(chart, 8);
  const h1Pattern = h1?.key || h1?.pattern;
  const h8Pattern = h8?.key || h8?.pattern;
  if (!h1Pattern || !h8Pattern) return null;
  const h1Element = HAWI_FIGURE_NAMES_BY_ID[h1Pattern]?.elementHebrew || null;
  const h8Element = HAWI_FIGURE_NAMES_BY_ID[h8Pattern]?.elementHebrew || null;
  const sameElement = Boolean(h1Element && h1Element === h8Element);
  const traditions = { 'מים': 'קור ולחות', 'עפר': 'מרה שחורה', 'אש': 'מרה צהובה', 'אוויר': 'רוחות שונות' };
  const humor = sameElement ? traditions[h1Element] || null : null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 197; יסודות הצורות עמ׳ 43–67',
    sourceText: 'אם בראשון ובשמיני צורות מימיות — קור ולחות; עפריות — מרה שחורה; אשיות — מרה צהובה; אוויריות — רוחות שונות.',
    housesUsed: [1, 8], h1Pattern, h8Pattern, h1Element, h8Element,
    sameElement, humor, positive: null,
    outputHebrew: humor ? `לפי סיווג היסודות בספר, צורות בתי 1 ו־8 הן ${h1Element}; דינו המסורתי: ${humor}.`
      : 'צורות בתי 1 ו־8 אינן מאותו יסוד; סעיף עמ׳ 197 אינו קובע להן סוג חולי.',
  };
}

function computeFriendshipH1H11P263(chart) {
  const h1Pattern = findCanonicalHouse(chart, 1)?.key || findCanonicalHouse(chart, 1)?.pattern;
  const h11Pattern = findCanonicalHouse(chart, 11)?.key || findCanonicalHouse(chart, 11)?.pattern;
  if (!h1Pattern || !h11Pattern) return null;
  const first = classifyCanonicalFigure(h1Pattern).saadNahs;
  const eleventh = classifyCanonicalFigure(h11Pattern).saadNahs;
  const pairEvidence = first === 'saad' && eleventh === 'saad' ? 'כל אחד נהנה מחברו'
    : first === 'nahs' && eleventh === 'nahs' ? 'כל אחד מזיק לחברו' : null;
  const derived = combineRamlFigures(h1Pattern, h11Pattern).resultPattern;
  const derivedQuality = classifyCanonicalFigure(derived).saadNahs;
  const derivedEvidence = derivedQuality === 'saad' ? 'דון לטובה ביניהם'
    : derivedQuality === 'nahs' ? 'דון להפך ביניהם' : null;
  const lines = [pairEvidence && `בתי 1 ו־11: ${pairEvidence}.`,
    derivedEvidence && `הצורה הנולדת מהם (${HAWI_FIGURE_NAMES_BY_ID[derived]?.hebrewName || derived}): ${derivedEvidence}.`]
    .filter(Boolean);
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 263; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם הראשון והאחד־עשר מיטיבים, כל אחד נהנה מחברו; אם שניהם מזיקים, כל אחד מזיק לחברו. הצורה הנולדת מהם: מיטיבה — לטובה ביניהם, מזיקה — להפך.',
    housesUsed: [1, 11], h1Pattern, h11Pattern, h1Quality: first, h11Quality: eleventh,
    pairEvidence, derivedPattern: derived, derivedQuality, derivedEvidence,
    positive: null,
    outputHebrew: lines.length ? lines.join(' ') : 'הצורות בבתי 1 ו־11 ובצורה הנולדת אינן נכללות בענפים המכריעים בסעיף עמ׳ 263.',
  };
}

function computePunishmentFearP273(chart) {
  const pattern = house => findCanonicalHouse(chart, house)?.key || findCanonicalHouse(chart, house)?.pattern || null;
  const h1Pattern = pattern(1);
  const h4Pattern = pattern(4);
  const h5Pattern = pattern(5);
  const h10Pattern = pattern(10);
  const h12Pattern = pattern(12);
  if (![h1Pattern, h4Pattern, h5Pattern, h10Pattern, h12Pattern].every(Boolean)) return null;
  const ahyanHouse = h1Pattern === '1222' ? 1 : h12Pattern === '1222' ? 12 : null;
  const h4Quality = classifyCanonicalFigure(h4Pattern).saadNahs;
  const noFear = h10Pattern === '2211' && h5Pattern === '2111'
    && ahyanHouse !== null && h4Quality === 'saad' ? true : null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 273; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'כבוד נכנס בעשירי, סף נכנס בחמישי, נשוא ראש בראשון או בבית האויבים, ומיטיב ברביעי — אין לחשוש עליו מן העונש.',
    housesUsed: [1, 4, 5, 10, 12], h1Pattern, h4Pattern, h5Pattern, h10Pattern, h12Pattern,
    ahyanHouse, h4Quality, noFear, positive: noFear === true ? false : null,
    outputHebrew: noFear === true
      ? `כבוד נכנס בבית 10, סף נכנס בבית 5, נשוא ראש בבית ${ahyanHouse}, ובית 4 מיטיב. לפי דין עמ׳ 273 אין לחשוש עליו מן העונש.`
      : 'לא התקיימו כל התנאים המצטברים של דין עמ׳ 273. הסעיף אינו קובע מכך שהעונש יוטל.',
  };
}

function computeTravelRoadCautionsP240(chart) {
  const h7Pattern = findCanonicalHouse(chart, 7)?.key || findCanonicalHouse(chart, 7)?.pattern || null;
  const h9Pattern = findCanonicalHouse(chart, 9)?.key || findCanonicalHouse(chart, 9)?.pattern || null;
  if (!h7Pattern || !h9Pattern) return null;
  const h9Quality = classifyCanonicalFigure(h9Pattern).saadNahs;
  const h7Element = HAWI_FIGURE_NAMES_BY_ID[h7Pattern]?.elementHebrew || null;
  const cautions = {
    'אש': 'ליסטים', 'אוויר': 'בהמות הדרך ודומיהן',
    'מים': 'טביעה, גנבה ומריבה', 'עפר': 'נחשים, עקרבים ומזיקים שבאדמה',
  };
  const h9Evidence = h9Quality === 'saad' ? 'בית 9 מיטיב — הדרך טובה'
    : h9Quality === 'nahs' ? 'בית 9 מזיק — הספר מורה להיזהר' : null;
  const h7Caution = cautions[h7Element] || null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 240; יסודות הצורות עמ׳ 43–67',
    sourceText: 'בית 9 מיטיב — טוב, מזיק — להיזהר. אחר כך ראה את בית 7: אש — ליסטים; אוויר — בהמות; מים — טביעה, גנבה ולחימה; עפר — נחשים, עקרבים ומזיקי אדמה.',
    housesUsed: [9, 7], h9Pattern, h9Quality, h9Evidence,
    h7Pattern, h7Element, h7Caution, positive: null,
    outputHebrew: [h9Evidence ? `${h9Evidence}.` : 'בית 9 ממוזג; סעיף זה אינו קובע אם דרכו טובה או רעה.',
      h7Caution ? `בית 7 מיסוד ${h7Element} — הספר מזהיר מפני ${h7Caution}.` : 'יסוד בית 7 אינו ידוע; אין אזהרה מסווגת.'].join(' '),
  };
}

function computeDreamH9AndOccurrencesP254(chart) {
  const h9 = findCanonicalHouse(chart, 9);
  const h9Pattern = h9?.key || h9?.pattern || null;
  if (!h9Pattern) return null;
  const quality = classifyCanonicalFigure(h9Pattern).saadNahs;
  const occurrences = Array.from({ length: 16 }, (_, i) => i + 1)
    .filter(house => house !== 9 && (findCanonicalHouse(chart, house)?.key || findCanonicalHouse(chart, house)?.pattern) === h9Pattern);
  const good = quality === 'saad' ? true : quality === 'nahs' ? false : null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 254; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'דין ראיית החלום מן הבית התשיעי: אם צורתו מיטיבה, דון לטוב; אם מזיקה, להפך. ראה גם לאן עברה צורת התשיעי ועל פיו דון.',
    housesUsed: [9], h9Pattern,
    h9FigureHebrew: h9?.hebrew || h9?.hebrewName || HAWI_FIGURE_NAMES_BY_ID[h9Pattern]?.hebrewName || h9Pattern,
    h9Quality: quality, sameFigureHouses: occurrences, dreamGoodSign: good, positive: good,
    outputHebrew: `${good === true ? 'צורת בית 9 מיטיבה — לפי עמ׳ 254, דין החלום לטובה.'
      : good === false ? 'צורת בית 9 מזיקה — לפי עמ׳ 254, דין החלום להפך.'
        : 'צורת בית 9 ממוזגת; סעיף עמ׳ 254 אינו נותן לה ענף מיטיב או מזיק.'} `
      + (occurrences.length ? `אותה צורה מופיעה גם בבתים ${occurrences.join(', ')}; הספר מורה לעיין במקום מעבר הצורה, אך אינו מפרט כאן פסק נוסף לפי כל בית.`
        : 'לא נמצאה הופעה נוספת של צורת בית 9; אין להוסיף מסלול מעבר מן הדעת.'),
  };
}

// Printed Kashf pp174-175 defines the fortunate houses as the four angles
// H1/H4/H7/H10 and their following houses H2/H5/H8/H11. The p265 first
// state-continuity clause requires the H1 figure to appear AGAIN in one of
// those houses and in H15. H1 alone cannot satisfy the extra recurrence.
const P265_FORTUNATE_OTHER_HOUSES = [2, 4, 5, 7, 8, 10, 11];

function computeStateContinuityFirstClauseP265(chart) {
  const h1Pattern = findCanonicalHouse(chart, 1)?.key || findCanonicalHouse(chart, 1)?.pattern || null;
  const h15Pattern = findCanonicalHouse(chart, 15)?.key || findCanonicalHouse(chart, 15)?.pattern || null;
  if (!h1Pattern || !h15Pattern) return null;
  const h1Quality = classifyCanonicalFigure(h1Pattern).saadNahs;
  const fortunateOccurrences = P265_FORTUNATE_OTHER_HOUSES.filter(house => {
    const entry = findCanonicalHouse(chart, house);
    return (entry?.key || entry?.pattern) === h1Pattern;
  });
  const repeatsInJudge = h15Pattern === h1Pattern;
  const stabilitySign = h1Quality === 'saad' && fortunateOccurrences.length > 0 && repeatsInJudge ? true : null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 265; הגדרת בתים מאושרים עמ׳ 174–175; סיווג הצורות עמ׳ 55–57',
    sourceText: 'אם בראשון צורה מיטיבה והיא בבתים המאושרים וחוזרת גם בחמישה־עשר — הדבר מורה על קיום המצב ושלמות האושר.',
    housesUsed: [1, ...P265_FORTUNATE_OTHER_HOUSES, 15], h1Pattern, h1Quality, h15Pattern,
    fortunateOccurrences, repeatsInJudge, stabilitySign, positive: stabilitySign,
    outputHebrew: stabilitySign === true
      ? `צורת בית 1 מיטיבה (${h1Pattern}), חוזרת בבית/בתים המאושרים ${fortunateOccurrences.join(', ')} וגם בבית 15. לפי כשף עמ׳ 265 זהו סימן ליציבות המצב ולהשלמת האושר.`
      : 'תנאי הענף הראשון בעמ׳ 265 אינם מתקיימים יחד. אין להסיק מכך שהמצב יתערער או יידרדר; הענף החלופי של אותו עמוד אינו מוכרע כאן.',
  };
}

const P236_GOOD_TRAVEL_TIME_PATTERNS = new Set(['1111', '1222', '2211']);

function computeProposedTravelTimeP236(chart) {
  const h1Pattern = findCanonicalHouse(chart, 1)?.key || findCanonicalHouse(chart, 1)?.pattern || null;
  const h4Pattern = findCanonicalHouse(chart, 4)?.key || findCanonicalHouse(chart, 4)?.pattern || null;
  const h9Pattern = findCanonicalHouse(chart, 9)?.key || findCanonicalHouse(chart, 9)?.pattern || null;
  if (!h1Pattern || !h4Pattern || !h9Pattern) return null;
  const namedHouses = [1, 9].filter(h => P236_GOOD_TRAVEL_TIME_PATTERNS.has(h === 1 ? h1Pattern : h9Pattern));
  const h4Quality = classifyCanonicalFigure(h4Pattern).saadNahs;
  const favorable = namedHouses.length > 0 && h4Quality === 'saad' ? true : null;
  return {
    sourceRef: 'כשף אל־אסראר עמ׳ 236 (PDF עמ׳ 238); סיווגי הצורות עמ׳ 57–60',
    sourceText: 'לבחירת זמן הנסיעה רצוי שדרך, נשוא ראש או כבוד נכנס יהיו בבית התשיעי, בראש המערך או בבית השואל; והרביעי חייב להיות מיטיב.',
    housesUsed: [1, 4, 9], h1Pattern, h4Pattern, h9Pattern, namedHouses, h4Quality,
    favorableDepartureTime: favorable, positive: favorable,
    outputHebrew: favorable === true
      ? `הצורה המבוקשת נמצאת בבית ${namedHouses.join(' או ')} ובית 4 מיטיב. לפי עמ׳ 236, אלה סימנים נוחים לזמן היציאה שנבדק.`
      : 'תנאי בחירת הזמן בעמ׳ 236 אינם מתקיימים יחד בלוח זה; הסעיף אינו נותן מכך יום חלופי או פסק שהמסע ייכשל.',
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

// The p188 directional procedure requires four NEW casts, separate from the
// ordinary board. Their order refers only to the practitioner's four marked
// physical quarters; the passage does not prescribe compass directions.
function computeQuarterDirectionP188(_chart, clientContext = {}) {
  const quarters = [1, 2, 3, 4].map(quarterNumber => {
    const pattern = clientContext.dynFields?.[`quarter${quarterNumber}Pattern`];
    if (typeof pattern !== 'string' || !/^[12]{4}$/.test(pattern)) {
      throw new Error('Four independent quarter casts are required');
    }
    const classification = classifyCanonicalFigure(pattern);
    const indication = classification.saadNahs === 'saad' && classification.dakhalKharij === 'dakhil'
      ? 'suspected'
      : classification.saadNahs === 'nahs' && classification.dakhalKharij === 'kharij'
        ? 'excluded'
        : 'unresolved';
    return { quarterNumber, pattern, figureHebrew: classification.figureHebrew, classification, indication };
  });
  const suspected = quarters.filter(q => q.indication === 'suspected').map(q => q.quarterNumber);
  const excluded = quarters.filter(q => q.indication === 'excluded').map(q => q.quarterNumber);
  const unresolved = quarters.filter(q => q.indication === 'unresolved').map(q => q.quarterNumber);
  const detail = quarters.map(q => `רבע ${q.quarterNumber}: ${q.figureHebrew} (${q.pattern}) — ${q.indication === 'suspected' ? 'חשוד לפי הכלל' : q.indication === 'excluded' ? 'נשלל לפי הכלל' : 'ללא הכרעה בכלל זה'}`).join('; ');
  const outputHebrew = `${detail}. ${suspected.length === 1 && unresolved.length === 0
    ? `רבע ${suspected[0]} הוא הרבע החשוד היחיד לפי הכלל. זו אינה הוכחה לקיום הדבר.`
    : suspected.length > 1
      ? 'כמה רבעים מסומנים כחשודים; המקור אינו נותן כלל לבחירת אחד מהם.'
      : 'אין רבע יחיד שהכלל יכול לבחור מתוך ארבע התוצאות.'}`;
  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 188; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'לכל אחד מארבעת חלקי המקום צורה נפרדת; מיטיב פנימי מסמן את המקום החשוד, מזיק חיצוני שולל אותו.',
    quarters, suspected, excluded, unresolved,
    positive: null, // A location indication is not a yes/no proof of existence.
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

// Kashf v57 p212 — partnership compatibility ("تحكم للشريك"), opened
// 2026-10-04 while re-reading printed p212 (PDF 214) in full sequence for
// the already-known "الجملة" partnership blocker. Immediately above the
// "نكتة: في الشركة..." note (the still-unresolved 2-by-2 Jumla rule, kept
// as partnership.p212.operationUnresolved), the SAME page's disputes
// paragraph ends: "وكذلك تحكم للشريك من الأول والسابع، والخامس والسابع،
// لأنهما بيتا مزاجهما، فما كان سعدا، فاحكم له بالخير، وما كان نحسا، فاحكم
// بضده" — "and likewise, judge for the partner from [combining] the 1st
// and 7th, and the 5th and 7th, because these are the two houses of their
// [mutual] temperament; whichever is benefic, judge good for it; whichever
// is malefic, judge the opposite."
//
// This is textually and thematically distinct from the nearby
// dispute.p212.reconciliationH1H7 clause (which answers "will the two
// disputing sides reconcile", a single H1+H7 figure, benefic-only verdict)
// and from dispute.p212.winnerH1 (who wins a dispute): this clause is
// introduced specifically for "الشريك" (the partner) and judges TWO
// independent combined figures (H1+H7, H5+H7) each on its own fortune —
// "بيتا مزاجهما" (the two houses of their temperament) — matching
// partnership.goodOrBad's real-world question ("is there good in this
// partnership or not") far more closely than a dispute-winner question.
// The source gives NO combination/tie-break rule for when the two
// generated figures disagree (unlike the p101-102 witness-disagreement
// rule used elsewhere) — so when they disagree, both are reported as
// evidence and no single good/bad verdict is produced, per the same
// "do not invent an arbitration rule the source does not give" discipline
// applied throughout this session.
function computePartnershipCompatibilityP212(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h5 = findCanonicalHouse(chart, 5);
  const h7 = findCanonicalHouse(chart, 7);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h5Pattern = h5?.key || h5?.pattern || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  if (!h1Pattern || !h5Pattern || !h7Pattern) return null;

  const combined17 = combineRamlFigures(h1Pattern, h7Pattern);
  const combined57 = combineRamlFigures(h5Pattern, h7Pattern);
  const pattern17 = combined17?.resultPattern || null;
  const pattern57 = combined57?.resultPattern || null;
  if (!pattern17 || !pattern57) return null;

  const fortune17 = classifyCanonicalFigure(pattern17).saadNahs;
  const fortune57 = classifyCanonicalFigure(pattern57).saadNahs;

  const sourceRef = 'כשף אל־אסראר עמ׳ 212';
  const sourceText = 'וכן דנים בעד השותף מן [תולדת] הראשון והשביעי, ומן [תולדת] החמישי והשביעי, כי הם שני בתי המזג שביניהם; מה שהיה מיטיב — שפטו לו לטובה, ומה שהיה מזיק — שפטו להפך.';

  let branch, positive, outputHebrew, clientSafeHebrew;

  if (fortune17 === 'saad' && fortune57 === 'saad') {
    branch = 'good';
    positive = true;
    outputHebrew = `שתי הצורות הנולדות — מבית 1+7 (${pattern17}) ומבית 5+7 (${pattern57}) — מיטיבות ללא מחלוקת. לפי כשף עמ׳ 212: "מה שהיה מיטיב, שפטו לו לטובה" — יש טובה בשותפות.`;
    clientSafeHebrew = 'סימני הלוח מראים טובה בשותפות.';
  } else if (fortune17 === 'nahs' && fortune57 === 'nahs') {
    branch = 'bad';
    positive = false;
    outputHebrew = `שתי הצורות הנולדות — מבית 1+7 (${pattern17}) ומבית 5+7 (${pattern57}) — מזיקות ללא מחלוקת. לפי כשף עמ׳ 212: "ומה שהיה מזיק, שפטו להפך" — אין טובה בשותפות.`;
    clientSafeHebrew = 'סימני הלוח מראים קושי בשותפות, לא טובה.';
  } else if (fortune17 !== 'mixed' && fortune57 !== 'mixed' && fortune17 !== fortune57) {
    branch = 'unresolved-disagreement';
    positive = null;
    outputHebrew = `הצורה הנולדת מבית 1+7 (${pattern17}) היא ${fortune17 === 'saad' ? 'מיטיבה' : 'מזיקה'}, והצורה הנולדת מבית 5+7 (${pattern57}) היא ${fortune57 === 'saad' ? 'מיטיבה' : 'מזיקה'} — שני הסימנים חלוקים. עמ׳ 212 נותן פסק נפרד לכל צורה ("מה שהיה... שפטו לו") אך אינו נותן כלל הכרעה בין שני סימנים חלוקים; לכן אין פסק טובה/קושי כולל אחד, ושני הסימנים מוצגים כעדות בלבד.`;
    clientSafeHebrew = 'סימני הלוח בעניין השותפות חלוקים, והמקור אינו נותן כאן דרך ודאית להכריע ביניהם.';
  } else {
    branch = 'unresolved-mixed';
    positive = null;
    outputHebrew = `אחת מהצורות הנולדות ממוזגת (בית 1+7: ${pattern17}, ${fortune17}; בית 5+7: ${pattern57}, ${fortune57}) — עמ׳ 212 פוסק רק לפי מיטיב/מזיק מובהק, ואינו נותן פסק לצורה ממוזגת.`;
    clientSafeHebrew = 'אין בלוח סימן מכריע לגבי טובת השותפות.';
  }

  return {
    sourceRef, sourceText,
    housesUsed: [1, 5, 7],
    h1Pattern, h5Pattern, h7Pattern,
    pattern17, pattern57,
    fortune17, fortune57,
    branch, positive,
    outputHebrew, clientSafeHebrew,
  };
}


// Kashf v57 pp178/183 — stay in the current place or move away.
// The source gives exactly two opposite H1/H2 combinations. We do not infer
// a verdict for same-class testimony or for mixed figures.
function computeRelocationStayMoveH1H2(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h2 = findCanonicalHouse(chart, 2);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h2Pattern = h2?.key || h2?.pattern || null;
  if (!h1Pattern || !h2Pattern) return null;

  const h1Classification = classifyCanonicalFigure(h1Pattern);
  const h2Classification = classifyCanonicalFigure(h2Pattern);
  const h1Quality = h1Classification.saadNahs;
  const h2Quality = h2Classification.saadNahs;

  let decision = 'unresolved';
  let decisionHebrew = 'לא הוכרע אם עדיף להישאר או לעבור לפי כלל זה';
  let currentPlaceBetter = null;
  let moveBetter = null;
  let outputHebrew;

  if (h1Quality === 'saad' && h2Quality === 'nahs') {
    decision = 'stay';
    decisionHebrew = 'המקום שבו הוא נמצא טוב לו — עדיף להישאר';
    currentPlaceBetter = true;
    moveBetter = false;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 178 (והכלל החוזר בעמ׳ 183), בבית הראשון צורה מיטיבה ובבית השני צורה מזיקה. לכן המקום שבו הוא נמצא טוב לו, והדין נוטה להישארות.';
  } else if (h1Quality === 'nahs' && h2Quality === 'saad') {
    decision = 'move';
    decisionHebrew = 'הדין להפך — המעבר מן המקום הנוכחי עדיף';
    currentPlaceBetter = false;
    moveBetter = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 178 (והכלל החוזר בעמ׳ 183), בבית הראשון צורה מזיקה ובבית השני צורה מיטיבה. המקור אומר שבמצב ההפוך הדין להפך, ולכן המעבר מן המקום הנוכחי עדיף.';
  } else {
    const hasMixed = h1Quality === 'mixed' || h2Quality === 'mixed';
    outputHebrew = hasMixed
      ? 'כלל v57 להישארות או מעבר דורש צירוף מפורש של מיטיב מול מזיק בשני הבתים. כאן לפחות אחד מהם ממוזג, ולכן אין להפוך את נטייתו בכוח להכרעה ואין פסק לפי כלל זה.'
      : 'בית 1 ובית 2 אינם יוצרים כאן אחד משני הצירופים ההפוכים שהמקור מגדיר במפורש. לכן אין להשלים מן הדעת אם עדיף להישאר או לעבור.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 178; חזרה בעמ׳ 183',
    sourceText: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',
    housesUsed: [1, 2],
    h1Pattern,
    h2Pattern,
    h1Classification,
    h2Classification,
    h1Quality,
    h2Quality,
    decision,
    decisionHebrew,
    currentPlaceBetter,
    moveBetter,
    positive: null,
    outputHebrew,
  };
}


// Kashf v57 pp264-265 — clothing luck.
// This executor is intentionally narrower than the old legacy helper:
// - H5+H11 both pure saad => luck in clothing.
// - H5+H11 both pure nahs => no luck in clothing.
// - H10 pure nahs => separate no-luck indication for royal clothing/honor.
// - Mixed or split H5/H11 testimony remains unresolved.
// Fixed/mutable garment persistence and color indications are knowledge-only
// here; they are not converted into the clothing-luck verdict.
function computeClothingLuckP265(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = findCanonicalHouse(chart, 5);
  const h10 = findCanonicalHouse(chart, 10);
  const h11 = findCanonicalHouse(chart, 11);
  const h5Pattern = h5?.key || h5?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  const h11Pattern = h11?.key || h11?.pattern || null;
  if (!h5Pattern || !h10Pattern || !h11Pattern) return null;

  const h5Classification = classifyCanonicalFigure(h5Pattern);
  const h10Classification = classifyCanonicalFigure(h10Pattern);
  const h11Classification = classifyCanonicalFigure(h11Pattern);
  const h5Quality = h5Classification.saadNahs;
  const h10Quality = h10Classification.saadNahs;
  const h11Quality = h11Classification.saadNahs;

  const bothBenefic = h5Quality === 'saad' && h11Quality === 'saad';
  const bothMalefic = h5Quality === 'nahs' && h11Quality === 'nahs';
  const royalClothingNoLuck = h10Quality === 'nahs';

  let clothingLuck = null;
  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע מזל הלבוש לפי כלל זה';
  let positive = null;
  let outputHebrew;

  if (bothBenefic) {
    clothingLuck = true;
    sourceOutcome = 'clothing-luck';
    sourceOutcomeHebrew = 'יש לו מזל בלבושים';
    positive = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264–265, בבית החמישי ובבית האחד־עשר נמצאות צורות מיטיבות טהורות. לפי לשון הכלל: יש לו מזל בלבושים.';
  } else if (bothMalefic) {
    clothingLuck = false;
    sourceOutcome = 'no-clothing-luck';
    sourceOutcomeHebrew = 'אין לו מזל בלבוש';
    positive = false;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264–265, בבית החמישי ובבית האחד־עשר נמצאות צורות מזיקות טהורות. לפי לשון הכלל: אין לו מזל בלבוש.';
  } else {
    const hasMixed = h5Quality === 'mixed' || h11Quality === 'mixed';
    outputHebrew = hasMixed
      ? 'דין v57 על מזל בלבוש נותן ענף מפורש כאשר הבית החמישי והאחד־עשר מיטיבים יחד או מזיקים יחד. כאן לפחות אחד מהם ממוזג, ולכן אין להעלות את נטייתו בכוח למיטיב או למזיק ואין הכרעה לפי כלל זה.'
      : 'הבית החמישי והאחד־עשר נותנים כאן עדות מפוצלת ולא את אחד משני המצבים המפורשים במקור. לכן אין להשלים מן הדעת דין של מזל חלקי.';
  }

  const royalClothingOutcome = royalClothingNoLuck
    ? 'בית 10 מזיק: אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה.'
    : 'בית 10 אינו נותן כאן את ענף המזיק המפורש; אין להסיק מכך לבדו מזל חיובי בלבוש מלכים.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 264–265',
    sourceText: 'בדין מזל הלבוש: אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם בעשירי צורה מזיקה, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה. אם בחמישי ובאחד־עשר צורות מזיקות, אין לו מזל בלבוש.',
    housesUsed: [5, 10, 11],
    h5Pattern,
    h10Pattern,
    h11Pattern,
    h5Classification,
    h10Classification,
    h11Classification,
    h5Quality,
    h10Quality,
    h11Quality,
    bothBenefic,
    bothMalefic,
    clothingLuck,
    royalClothingNoLuck,
    royalClothingOutcome,
    sourceOutcome,
    sourceOutcomeHebrew,
    fixedMutableSubruleExecuted: false,
    colorSubruleExecuted: false,
    positive,
    outputHebrew: outputHebrew + ' ' + royalClothingOutcome,
  };
}

// Kashf v57 p206 — whether the querent wants the matter.
// Derive H7+H11, then combine that generated figure with H5.
// This uses the same geometry as the neighboring woman-favor clause,
// but the semantic intent and output remain strictly separate.
function computeQuerentWantsMatterP206(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const h11 = findCanonicalHouse(chart, 11);
  const h5 = findCanonicalHouse(chart, 5);
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h11Pattern = h11?.key || h11?.pattern || null;
  const h5Pattern = h5?.key || h5?.pattern || null;
  if (!h7Pattern || !h11Pattern || !h5Pattern) return null;

  const firstDerived = combineRamlFigures(h7Pattern, h11Pattern);
  const finalDerived = combineRamlFigures(firstDerived.resultPattern, h5Pattern);
  const finalPattern = finalDerived.resultPattern;
  const classification = classifyCanonicalFigure(finalPattern);
  const finalFigureHebrew = finalDerived.result?.hebrewName || classification.figureHebrew || finalPattern;

  let wantsMatter = null;
  if (classification.saadNahs === 'saad') wantsMatter = true;
  else if (classification.saadNahs === 'nahs') wantsMatter = false;

  let outputHebrew;
  if (wantsMatter === true) {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מיטיבה. לפי כשף עמ׳ 206: השואל רוצה בדבר.';
  } else if (wantsMatter === false) {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מזיקה. לפי כשף עמ׳ 206: הדין להפך — השואל אינו רוצה בדבר.';
  } else {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — ' + (classification.saadNahsHebrew || 'ללא סיווג מכריע') + '. כלל עמ׳ 206 מוסר הכרעה מפורשת למיטיב או מזיק בלבד; תוצאה ממוזגת נשארת ללא הכרעה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 206',
    sourceText: 'אם רצית לדעת אם השואל רוצה בדבר או לא: הכה את השביעי והאחד־עשר, ואת היוצא מהם הכה עם החמישי. אם יצאה צורה מיטיבה — הוא רוצה. ואם יצאה צורה מזיקה — להפך.',
    housesUsed: [7, 11, 5],
    h7Pattern,
    h11Pattern,
    h5Pattern,
    firstDerivedPattern: firstDerived.resultPattern,
    firstDerivedFigureHebrew: firstDerived.result?.hebrewName || firstDerived.resultPattern,
    finalPattern,
    finalFigureHebrew,
    classification,
    wantsMatter,
    positive: wantsMatter,
    outputHebrew,
  };
}

// Kashf v57 p206 — whether a woman finds favor in the querent's eyes.
// Derive H7+H11, then combine that generated figure with H5.
// This is distinct from the adjacent querent-desire clause despite using
// the same derivation, and distinct from mutual love/attention methods.
function computeWomanFavorP206(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const h11 = findCanonicalHouse(chart, 11);
  const h5 = findCanonicalHouse(chart, 5);
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h11Pattern = h11?.key || h11?.pattern || null;
  const h5Pattern = h5?.key || h5?.pattern || null;
  if (!h7Pattern || !h11Pattern || !h5Pattern) return null;

  const firstDerived = combineRamlFigures(h7Pattern, h11Pattern);
  const finalDerived = combineRamlFigures(firstDerived.resultPattern, h5Pattern);
  const finalPattern = finalDerived.resultPattern;
  const classification = classifyCanonicalFigure(finalPattern);
  const finalFigureHebrew = finalDerived.result?.hebrewName || classification.figureHebrew || finalPattern;

  let findsFavor = null;
  if (classification.saadNahs === 'saad') findsFavor = true;
  else if (classification.saadNahs === 'nahs') findsFavor = false;

  let outputHebrew;
  if (findsFavor === true) {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מיטיבה. לפי כשף עמ׳ 206: היא תמצא חן בעיניו.';
  } else if (findsFavor === false) {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מזיקה. לפי כשף עמ׳ 206: היא לא תמצא חן בעיניו.';
  } else {
    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — ' + (classification.saadNahsHebrew || 'ללא סיווג מכריע') + '. כלל עמ׳ 206 מוסר הכרעה מפורשת למיטיב או מזיק בלבד; תוצאה ממוזגת נשארת ללא הכרעה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 206',
    sourceText: 'אם שאל השואל על אישה — האם היא תמצא חן בעיני? קח צורה מן השביעי והאחד־עשר, ואת היוצא הכה עם החמישי. אם יצאה צורה מיטיבה, היא תמצא חן בעיניו. ואם יצאה צורה מזיקה, לא תמצא חן בעיניו.',
    housesUsed: [7, 11, 5],
    h7Pattern,
    h11Pattern,
    h5Pattern,
    firstDerivedPattern: firstDerived.resultPattern,
    firstDerivedFigureHebrew: firstDerived.result?.hebrewName || firstDerived.resultPattern,
    finalPattern,
    finalFigureHebrew,
    classification,
    findsFavor,
    positive: findsFavor,
    outputHebrew,
  };
}

// Kashf v57 p191 — child/fetal safety.
function computeChildSafetyP191(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 6, 8];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
    };
  });
  if (rows.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));
  const h1Class = byHouse[1].classification.saadNahs;
  const severeCondition = byHouse[6].classification.saadNahs === 'nahs' && byHouse[8].classification.saadNahs === 'nahs';
  const h1Safety = h1Class === 'saad';
  const h1Fear = h1Class === 'nahs';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'הכלל אינו מכריע בבירור';
  if (severeCondition) {
    sourceOutcome = 'severe-risk';
    sourceOutcomeHebrew = 'אזהרת מקור חמורה: שני הבתים 6 ו־8 מזיקים';
  } else if (h1Safety) {
    sourceOutcome = 'safety';
    sourceOutcomeHebrew = 'עדות לשלום הוולד';
  } else if (h1Fear) {
    sourceOutcome = 'fear';
    sourceOutcomeHebrew = 'יש לחשוש על הוולד';
  }

  let outputHebrew;
  if (severeCondition) {
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 191, בית 6 ובית 8 שניהם מזיקים. המקור מוסר שבמצב זה הוולד עלול לצאת מת. זהו ניסוח של סיכון במקור, לא פסק ודאי של מוות.';
  } else if (h1Safety) {
    outputHebrew = 'בית 1 מיטיב. לפי חשיפת הסודות הנצורים v57 עמ׳ 191, הדבר מורה שהוולד יינצל ויהיה בשלום. בתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  } else if (h1Fear) {
    outputHebrew = 'בית 1 מזיק. לפי חשיפת הסודות הנצורים v57 עמ׳ 191, יש לחשוש על הוולד. בתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  } else {
    outputHebrew = 'בית 1 אינו מיטיב טהור ואינו מזיק טהור לפי הסיווג הקנוני. כלל עמ׳ 191 אינו נותן כאן הכרעה חד־משמעית, ובתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 191',
    sourceText: 'אם בבית הראשון נמצאת צורה מיטיבה, הוולד יינצל ויהיה בשלום. ואם נמצאת בו צורה מזיקה, יש לחשוש עליו. ואם בשישי ובשמיני נמצאות צורות מזיקות, הוולד עלול לצאת מת.',
    housesUsed,
    houseResults: rows,
    h1Safety,
    h1Fear,
    severeCondition,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: h1Safety && !severeCondition ? true : null,
    verdictType: 'child-safety',
    outputHebrew,
  };
}

// Kashf v57 p264 — beginning/middle/end of life by planetary figure.
function computeLifespanStagesP264(chart) {
  if (!Array.isArray(chart)) return null;
  const stageDefs = [
    { houseNumber: 11, stage: 'beginning', stageHebrew: 'ראשית החיים' },
    { houseNumber: 9, stage: 'middle', stageHebrew: 'אמצע החיים' },
    { houseNumber: 7, stage: 'end', stageHebrew: 'סוף החיים' },
  ];

  const stages = stageDefs.map((def) => {
    const entry = findCanonicalHouse(chart, def.houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const planetRecord = FIGURE_PLANET_MAP.find((record) => Array.isArray(record.patterns) && record.patterns.includes(pattern)) || null;
    return {
      ...def,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || classifyCanonicalFigure(pattern).figureHebrew || pattern,
      planetHebrew: planetRecord?.planet || null,
      planetArabic: planetRecord?.arabicName || null,
      planetSourceStatus: planetRecord?.sourceStatus || null,
      planetResolved: Boolean(planetRecord),
    };
  });
  if (stages.some((item) => !item)) return null;

  const detail = stages.map((item) => {
    const planet = item.planetResolved ? item.planetHebrew : 'שיוך כוכבי לא מוכרע במפה המאומתת';
    return item.stageHebrew + ': ' + item.figureHebrew + ' (' + item.pattern + ') — ' + planet;
  }).join('; ');

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 264; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'בדין החיים: הבית האחד־עשר מורה על ראשית החיים; התשיעי על האמצע; והשביעי על הסוף. דון לפי צורות הכוכבים המופיעות בבתים.',
    housesUsed: [11, 9, 7],
    stages,
    aggregationRule: 'none-source-explicit',
    positive: null,
    verdictType: 'lifespan-stages',
    outputHebrew: 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264: ' + detail + '. שיטה זו מתארת שלושה שלבים לפי הכוכב של הצורה בכל בית; היא אינה מחשבת את מספר שנות החיים.',
  };
}

// Kashf v57 p244 — traveler return.
function computeTravelerReturnP244(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 9];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      beneficIncoming: classification.saadNahs === 'saad' && classification.dakhalKharij === 'dakhil',
      pureMalefic: classification.saadNahs === 'nahs',
    };
  });
  if (rows.some((item) => !item)) return null;

  const allBeneficIncoming = rows.every((item) => item.beneficIncoming);
  const allPureMalefic = rows.every((item) => item.pureMalefic);
  let sourceOutcome = 'unresolved';
  let outputHebrew;
  if (allBeneficIncoming) {
    sourceOutcome = 'good-return';
    outputHebrew = 'בתים 1, 2 ו־9 כולם נושאים צורות מיטיבות פנימיות. לפי חשיפת הסודות הנצורים v57 עמ׳ 244, הדבר תומך בכך שהנוסע ישוב אל ארצו בטוב ובשמחה.';
  } else if (allPureMalefic) {
    sourceOutcome = 'hardship-possible-no-return';
    outputHebrew = 'בתים 1, 2 ו־9 כולם מזיקים. לפי חשיפת הסודות הנצורים v57 עמ׳ 244, הנוסע יתייגע במסעו ולעיתים לא ישוב. המקור אינו הופך את הענף הזה לפסק ודאי של אי־חזרה.';
  } else {
    outputHebrew = 'העדות בבתים 1, 2 ו־9 מפוצלת או ממוזגת. כדי לא להמציא כלל רוב שאינו במקור, שיטת עמ׳ 244 נשארת כאן ללא הכרעה חד־משמעית.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 244',
    sourceText: 'כלל לנוסע: התבונן בראשון, בשני ובתשיעי. אם נמצאו בהם צורות מיטיבות המורות על כניסה, ובפרט במקומות הראויים, ישוב אל ארצו בטוב ובשמחה. ואם נמצאו בהם צורות מזיקות, יתייגע במסעו, ולעיתים לא ישוב.',
    housesUsed,
    houseResults: rows,
    allBeneficIncoming,
    allPureMalefic,
    sourceOutcome,
    returnIndicated: allBeneficIncoming ? true : null,
    positive: allBeneficIncoming ? true : null,
    verdictType: 'traveler-return',
    outputHebrew,
  };
}

// Kashf v57 pp210-211 — general marriage judgment.
function computeMarriageSuitabilityP210(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 5, 7, 8, 10, 15];
  const patterns = {};
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    patterns[houseNumber] = pattern;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(houseResults.map((item) => [item.houseNumber, item]));
  const manGoodToWoman = byHouse[1].classification.saadNahs === 'saad' ? true : null;
  const womanBetterThanMan = byHouse[1].classification.saadNahs === 'nahs' && byHouse[7].classification.saadNahs === 'saad' ? true : null;
  const judgeGood = byHouse[15].classification.saadNahs === 'saad' ? true : null;

  const derived = combineRamlFigures(patterns[1], patterns[5]);
  const finalPattern = derived.resultPattern;
  const finalClassification = classifyCanonicalFigure(finalPattern);
  const finalOutcome = finalClassification.saadNahs === 'saad'
    ? 'good'
    : finalClassification.saadNahs === 'nahs'
      ? 'opposite-bad'
      : 'unresolved';
  const positive = finalOutcome === 'good' ? true : finalOutcome === 'opposite-bad' ? false : null;

  const sourceSignals = [];
  if (manGoodToWoman) sourceSignals.push('בית 1 מיטיב — האיש טוב לה ומיטיב עמה');
  if (womanBetterThanMan) sourceSignals.push('בית 1 מזיק ובית 7 מיטיב — היא טובה ממנו לפי לשון המקור');
  if (judgeGood) sourceSignals.push('בית 15 מיטיב — אחרית עניינם טובה, יפה ושמחה');
  sourceSignals.push('חיבור בית 1 ובית 5 יצר ' + (finalClassification.figureHebrew || finalPattern) + ' (' + finalPattern + ') — ' + (finalClassification.saadNahsHebrew || 'ללא סיווג'));

  let outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 210–211: ' + sourceSignals.join('; ') + '. ';
  if (finalOutcome === 'good') {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי מיטיבה, ולכן הדין הסופי של ההולדה הוא לטוב.';
  } else if (finalOutcome === 'opposite-bad') {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי מזיקה, ולכן הדין הסופי הוא להפך מן הטוב.';
  } else {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי ממוזגת או בלתי מוכרעת; אין לכפות עליה פסק טוב/רע חד־משמעי.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 210–211',
    sourceText: 'עשה את הבית הראשון והשני לסימני האיש והנישואין, ואת הבית השביעי והשמיני לסימני האישה. הבית העשירי מורה על מה שיתרחש ביניהם, והדיין מורה על אחרית עניינם. אם הראשון מיטיב, האיש טוב לה ומיטיב עמה. אם הראשון מזיק והשביעי מיטיב, הרי היא טובה ממנו. אם המכריע מיטיב, אחרית עניינם טובה, יפה ושמחה. לאחר מכן הוצא צורה מן הראשון והחמישי, ודון במה שיצא, לטוב או להפך.',
    housesUsed,
    houseResults,
    roles: {
      manAndMarriage: [1, 2],
      woman: [7, 8],
      betweenThem: 10,
      judge: 15,
      finalDerivation: [1, 5],
    },
    manGoodToWoman,
    womanBetterThanMan,
    judgeGood,
    finalPattern,
    finalFigureHebrew: finalClassification.figureHebrew || null,
    finalClassification,
    finalOutcome,
    positive,
    verdictType: 'marriage-suitability',
    outputHebrew,
  };
}

// Kashf v57 p194 — childhood pains and longer-term health trajectory.
function computeChildHealthTrajectoryP194(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [6, 8];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
    };
  });
  if (rows.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));
  const h6Malefic = byHouse[6].classification.saadNahs === 'nahs';
  const h8Class = byHouse[8].classification.saadNahs;
  const childhoodPains = h6Malefic ? true : null;
  const longTermOutcome = h8Class === 'nahs'
    ? 'low-hope'
    : h8Class === 'saad'
      ? 'improves-with-age'
      : 'unresolved';

  const h6Text = h6Malefic
    ? 'בית 6 מזיק — המקור מורה על ריבוי מכאובים בילדות.'
    : 'בית 6 אינו מזיק טהור — כלל עמ׳ 194 אינו מוסר מכאן לבדו את ההפך, ולכן אין לקבוע שאין מכאובים.';
  const h8Text = h8Class === 'nahs'
    ? 'בית 8 מזיק — התקווה בו מועטה לפי המקור.'
    : h8Class === 'saad'
      ? 'בית 8 מיטיב — ככל שיגדל ימעט חוליו וישתפר מצבו לפי המקור.'
      : 'בית 8 ממוזג או לא מסווג לענף מפורש — מגמת הבריאות בהמשך אינה מוכרעת בכלל זה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 194',
    sourceText: 'בדין בריאות הילד: התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו. המשפט הקודם על צורה שאינה זכרית או נקבית ומתַהפכת שייך לדין ריקות הבטן ואינו תנאי להפעלת H6/H8.',
    housesUsed,
    houseResults: rows,
    childhoodPains,
    longTermOutcome,
    positive: null,
    verdictType: 'child-health-trajectory',
    outputHebrew: h6Text + ' ' + h8Text + ' שתי העדויות נשמרות בנפרד; אין ליצור מהן ציון בריאות כולל שלא נמסר במקור.',
  };
}

// Kashf v57 p182 — sign of elder/senior siblings from H3.
function computeSiblingSeniorityP182(chart) {
  if (!Array.isArray(chart)) return null;
  const h3 = findCanonicalHouse(chart, 3);
  const pattern = h3?.key || h3?.pattern || null;
  if (!pattern) return null;

  let senioritySignal = 'unresolved';
  let seniorityHebrew = 'אין סימן מפורש לגדולים בכלל זה';
  if (pattern === '2222') {
    senioritySignal = 'older-paternal-emphasis';
    seniorityHebrew = 'סימן לגדולים, ובייחוד לגדולים מצד האב';
  } else if (pattern === '2221') {
    senioritySignal = 'older';
    seniorityHebrew = 'סימן לגדולים';
  }

  const figureHebrew = classifyCanonicalFigure(pattern).figureHebrew || h3?.hebrew || h3?.hebrewName || pattern;
  const outputHebrew = senioritySignal === 'unresolved'
    ? 'בית 3 מכיל ' + figureHebrew + ' (' + pattern + '). כלל כשף v57 עמ׳ 182 נותן סימן מפורש לגדולים רק לקהלה (2222) ולשפל ראש (2221); אין להסיק מן הצורה הנוכחית שהאח צעיר יותר ואין לזהות אח מסוים מן הדעת.'
    : 'בית 3 מכיל ' + figureHebrew + ' (' + pattern + ') — ' + seniorityHebrew + '. זהו סימן ותק/בכורה בלבד, לא זיהוי של אח מסוים בשם.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 182',
    sourceText: 'הצורה קהלה מורה על הגדולים, ובייחוד הגדולים מצד האב. וכן שפל ראש.',
    housesUsed: [3],
    h3Pattern: pattern,
    h3FigureHebrew: figureHebrew,
    senioritySignal,
    seniorityHebrew,
    positive: null,
    verdictType: 'sibling-seniority-sign',
    outputHebrew,
  };
}

// Kashf v57 p211 — complete H7 marriage stability/dissolution matrix.
// The scan gives all internal/external/fixed/mutable branches. Fixed and mutable
// figures include Kashf source classes recorded in the catalogue as mixed-benefic
// or mixed-malefic; for THIS matrix only, their explicit source tendency supplies
// the سعد/نحس side of the printed branch. This local rule must not leak into
// methods where mixed figures are intentionally unresolved.
const P211_SOURCE_HEBREW_RUNTIME = "בבית השביעי: אם שכנו בו צורות פנימיות, הדבר מורה על יישוב הדעת ועל קיום מצב הנישואין. צורה מזיקה פנימית מורה על עגמת נפש ומריבה, אבל החלק קבוע. צורה מיטיבה חיצונית מורה על נישואין טובים, אך אפשר שתהיה פרידה מפני שהחלק אינו קבוע. צורה מזיקה חיצונית מורה שאין כאן נישואין ראויים, ואם כבר היו — החלק נחתך ונפסק ואין בו טוב. צורה מיטיבה וקבועה מורה על תיקון בית המשכב. צורה מזיקה וקבועה מורה שאין תיקון לבית המשכב, שנמשך רוע בין בני הזוג, ומקורו מן האיש. צורה מיטיבה ומתַהפכת מורה על יישוב, שמחה וששון בבית המשכב, על אהבת אחד מהם לאחר, ועל עושר ועונג. צורה מזיקה ומתַהפכת מורה שאין כאן נישואין, שהדבר הולך לרעה ולפירוד; ובלשון המקור: העזיבה עדיפה.";

function computeMarriageDissolutionP211(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const fortune = classification.saadNahs;
  const state = classification.dakhalKharij;
  const sourceValence = fortune === 'saad'
    ? 'saad'
    : fortune === 'nahs'
      ? 'nahs'
      : classification.mixedTendency === 'saad'
        ? 'saad'
        : classification.mixedTendency === 'nahs'
          ? 'nahs'
          : null;
  const sourceValenceBasis = fortune === 'mixed' ? 'mixed-tendency-for-p211-only' : 'pure-fortune';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'הצירוף אינו מקבל ענף מפורש בכלל זה';

  if (state === 'dakhil') {
    if (sourceValence === 'nahs') {
      sourceOutcome = 'stable-with-quarrel';
      sourceOutcomeHebrew = 'עגמת נפש ומריבה, אבל מצב הנישואין קבוע';
    } else if (sourceValence === 'saad') {
      sourceOutcome = 'stable';
      sourceOutcomeHebrew = 'יישוב הדעת וקיום מצב הנישואין';
    }
  } else if (state === 'kharij' && sourceValence === 'saad') {
    sourceOutcome = 'good-but-separation-possible';
    sourceOutcomeHebrew = 'נישואין טובים, אך פרידה אפשרית מפני שהחלק אינו קבוע';
  } else if (state === 'kharij' && sourceValence === 'nahs') {
    sourceOutcome = 'breakdown-if-existing';
    sourceOutcomeHebrew = 'אין כאן נישואין ראויים; ואם כבר היו — החלק נחתך ונפסק ואין בו טוב';
  } else if (state === 'mujassad-dakhil' && sourceValence === 'saad') {
    sourceOutcome = 'fixed-benefic-repair';
    sourceOutcomeHebrew = 'צורה מיטיבה וקבועה — תיקון בית המשכב';
  } else if (state === 'mujassad-dakhil' && sourceValence === 'nahs') {
    sourceOutcome = 'fixed-malefic-distress-origin-man';
    sourceOutcomeHebrew = 'צורה מזיקה וקבועה — אין תיקון לבית המשכב; נמשך רוע בין בני הזוג, ומקורו מן האיש';
  } else if (state === 'mujassad-kharij' && sourceValence === 'saad') {
    sourceOutcome = 'mutable-benefic-joy-love-wealth';
    sourceOutcomeHebrew = 'צורה מיטיבה ומתַהפכת — יישוב, שמחה וששון בבית המשכב; אהבת אחד מהם לאחר; ועושר ועונג';
  } else if (state === 'mujassad-kharij' && sourceValence === 'nahs') {
    sourceOutcome = 'mutable-malefic-breakdown-separation';
    sourceOutcomeHebrew = 'צורה מזיקה ומתַהפכת — אין כאן נישואין; הדבר הולך לרעה ולפירוד; ובלשון המקור: העזיבה עדיפה';
  }

  const figureHebrew = classification.figureHebrew || h7?.hebrew || h7?.hebrewName || pattern;
  const unresolvedNote = sourceOutcome === 'unresolved'
    ? ' המקור אינו נותן בקטע זה דין מפורש לצירוף הנוכחי, ולכן אין להשלים גירושין או יציבות מן הדעת.'
    : '';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 211; אימות מול הסריקה הערבית עמ׳ 211',
    sourceText: P211_SOURCE_HEBREW_RUNTIME,
    housesUsed: [7],
    h7Pattern: pattern,
    h7FigureHebrew: figureHebrew,
    classification,
    sourceValence,
    sourceValenceBasis,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: null,
    verdictType: 'marriage-stability-dissolution',
    outputHebrew: 'בית 7: ' + figureHebrew + ' (' + pattern + ') — ' + (classification.saadNahsHebrew || fortune || 'ללא סיווג') + ', ' + (classification.dakhalKharijHebrew || state || 'ללא מצב') + '. לפי כשף v57 עמ׳ 211: ' + sourceOutcomeHebrew + '.' + unresolvedNote,
  };
}

// Kashf v57 p249 — return sign for a missing/absent male from angles + judge.
function computeMissingReturnP249(chart) {
  if (!Array.isArray(chart)) return null;
  const angleHouses = [1, 4, 7, 10];
  const angleResults = angleHouses.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      returnQuality: classification.saadNahs === 'saad' && classification.dakhalKharij === 'dakhil',
    };
  });
  if (angleResults.some((item) => !item)) return null;

  const judge = findCanonicalHouse(chart, 15);
  const judgePattern = judge?.key || judge?.pattern || null;
  if (!judgePattern) return null;
  const judgeClassification = classifyCanonicalFigure(judgePattern);
  const judgeSupportsReturn = judgeClassification.saadNahs === 'saad' && judgeClassification.dakhalKharij === 'dakhil';
  const allAnglesSupportReturn = angleResults.every((item) => item.returnQuality);
  const returnIndicatedForMale = allAnglesSupportReturn && judgeSupportsReturn;

  const outputHebrew = returnIndicatedForMale
    ? 'ארבעת היתדות — בתים 1, 4, 7 ו־10 — כולם מיטיבים פנימיים, וגם בית 15 נותן אותה עדות תומכת. לפי כשף v57 עמ׳ 249 זהו סימן לחזרת הזכרים. לשון המקור כאן מצומצמת לזכרים, ולכן אין להרחיב את הפסק אוטומטית למקרה אחר.'
    : 'תנאי החזרה החיובי של עמ׳ 249 אינו שלם: לא כל ארבעת היתדות מיטיבים פנימיים ו/או בית 15 אינו נותן אותה עדות תומכת. המקור אינו מוסר כאן שהעדר התנאי מוכיח אי־חזרה, ולכן התוצאה נשארת ללא הכרעה שלילית.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 249',
    sourceText: 'אם בבתים היתדיים נמצאו צורות מיטיבות פנימיות בעניין נעדר, בורח, אבדה או גניבה — הדבר מורה על חזרת הזכרים, כאשר גם המכריע מעיד לכך.',
    housesUsed: [1, 4, 7, 10, 15],
    angleHouses,
    angleResults,
    allAnglesSupportReturn,
    judgePattern,
    judgeFigureHebrew: judgeClassification.figureHebrew || judge?.hebrew || judge?.hebrewName || judgePattern,
    judgeClassification,
    judgeSupportsReturn,
    returnIndicatedForMale,
    sourceOutcome: returnIndicatedForMale ? 'male-return-indicated' : 'unresolved',
    sourceScope: 'male-return-clause',
    positive: null,
    verdictType: 'missing-return',
    outputHebrew,
  };
}

// Kashf v57 p191 — ease/difficulty of delivery.
function computeDeliveryDifficultyP191(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 5, 15];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: classifyCanonicalFigure(pattern).figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
      masculine: P191_MASCULINE_PATTERNS.has(pattern),
      mutable: P204_MUTABLE_PATTERNS.has(pattern),
      fixed: P204_FIXED_PATTERNS.has(pattern),
    };
  });
  if (rows.some((item) => !item)) return null;
  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));

  const easeSign = byHouse[1].masculine && byHouse[5].masculine;
  const bothMutable = byHouse[1].mutable && byHouse[5].mutable;
  const difficultySign = byHouse[5].fixed;
  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע בכלל זה';
  if (easeSign && difficultySign) {
    sourceOutcome = 'conflicting-source-signs';
    sourceOutcomeHebrew = 'סימן הקלות וסימן הקושי מופיעים יחד';
  } else if (easeSign) {
    sourceOutcome = 'easy';
    sourceOutcomeHebrew = bothMutable ? 'לידה קלה — עם חיזוק מפני ששתי הצורות מתהפכות' : 'לידה קלה';
  } else if (difficultySign) {
    sourceOutcome = 'difficult';
    sourceOutcomeHebrew = 'לידה קשה ואינה נשלמת בקלות';
  }

  const outputHebrew = sourceOutcome === 'unresolved'
    ? 'לפי כשף v57 עמ׳ 191, סימן הקלות דורש שהראשון והחמישי יהיו זכריים, וסימן הקושי המפורש הוא צורה קבועה בחמישי. אף אחד מן התנאים המפורשים אינו מכריע כאן; עדות בית 1 ובית 15 נשמרת ואינה נהפכת להצבעת רוב.'
    : sourceOutcome === 'conflicting-source-signs'
      ? 'בית 1 ובית 5 זכריים ולכן מופיע סימן הקלות, אך בית 5 גם קבוע ולכן מופיע סימן הקושי. המקור אינו נותן כאן כלל קדימות בין שני הסימנים; לכן אין לבחור אחד מהם מן הדעת. בית 15 נשמר כעדות נוספת בלבד.'
      : 'לפי כשף v57 עמ׳ 191: ' + sourceOutcomeHebrew + '. בית 15 מוצג כעדות המקור ואינו משמש להצבעת רוב שלא נמסרה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 191; פירוט משלים עמ׳ 194',
    sourceText: 'אם הראשון והחמישי זכריים, הוולד זכר והלידה קלה ליולדת, בפרט אם הצורות מתהפכות. אם החמישי צורה קבועה, הלידה קשה ואינה נשלמת בקלות, לפי עדות הראשון והחמישה־עשר.',
    housesUsed,
    houseResults: rows,
    easeSign,
    bothMutable,
    difficultySign,
    h15Testimony: byHouse[15],
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: sourceOutcome === 'easy' ? true : sourceOutcome === 'difficult' ? false : null,
    verdictType: 'delivery-difficulty',
    outputHebrew,
  };
}

// Kashf v57 p181 — rebuild a secondary board from H2/H5/H8/H11.
function computeMoneyAcquireP181(chart) {
  if (!Array.isArray(chart)) return null;
  const sourceMotherHouses = [2, 5, 8, 11];
  const sourceMothers = sourceMotherHouses.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    return pattern ? { houseNumber, pattern, figureHebrew: entry?.hebrew || entry?.hebrewName || pattern } : null;
  });
  if (sourceMothers.some((item) => !item)) return null;

  const recastMotherPatterns = sourceMothers.map((item) => item.pattern);
  const recastBoard = buildRamlBoardFromMothers(recastMotherPatterns);
  const recastChart = recastBoard?.entries || [];
  if (recastChart.length !== 16) return null;

  const conditionHouses = [1, 2, 4, 7, 10];
  const conditionResults = conditionHouses.map((houseNumber) => {
    const entry = findCanonicalHouse(recastChart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      strictlyInternal: classification.dakhalKharij === 'dakhil',
    };
  });
  if (conditionResults.some((item) => !item)) return null;

  const allRequiredInternal = conditionResults.every((item) => item.strictlyInternal);
  const moneyObtained = allRequiredInternal ? true : null;
  const failingHouses = conditionResults.filter((item) => !item.strictlyInternal).map((item) => item.houseNumber);
  const outputHebrew = allRequiredInternal
    ? 'הבתים 2, 5, 8 ו־11 מן הלוח המקורי הועמדו כאמהות ונבנה מהם לוח חדש. בלוח החדש ארבעת היתדות — 1, 4, 7, 10 — וגם בית 2 הם צורות פנימיות ממש. לפי כשף v57 עמ׳ 181: הממון יושג.'
    : 'הבתים 2, 5, 8 ו־11 מן הלוח המקורי הועמדו כאמהות ונבנה מהם לוח חדש. תנאי עמ׳ 181 דורש שבארבעת היתדות ובבית 2 בלוח החדש יהיו צורות פנימיות; התנאי אינו שלם בבתים ' + failingHouses.join(', ') + '. הקטע הזה אינו מוסר במפורש שהעדר התנאי מוכיח שהממון לא יושג, ולכן התוצאה נשארת ללא הכרעה שלילית. אין לצרף לכאן את שיטת הזוג/יחיד החלופית שבאותו עמוד.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 181',
    sourceText: 'בדין הממון: העמד את השני, החמישי, השמיני והאחד־עשר כאמהות, והשלים את גורל החול. אם ראית שהיתדות והבית השני פנימיים, הממון יושג.',
    housesUsed: sourceMotherHouses,
    sourceMotherHouses,
    sourceMothers,
    recastMotherPatterns,
    recastBoardValid: recastBoard?.boardValidation?.isValid !== false,
    recastBoardWarnings: recastBoard?.boardValidation?.warnings || [],
    recastConditionHouses: conditionHouses,
    recastConditionResults: conditionResults,
    allRequiredInternal,
    failingHouses,
    moneyObtained,
    sourceOutcome: allRequiredInternal ? 'money-obtained' : 'unresolved',
    positive: moneyObtained,
    verdictType: 'money-acquire-recast',
    outputHebrew,
  };
}

// Kashf v57 p266 — whether a person dismissed from service returns.
function computeReturnToOfficeP266(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h16 = findCanonicalHouse(chart, 16);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h16Pattern = h16?.key || h16?.pattern || null;
  if (!h1Pattern || !h16Pattern) return null;

  const h1Classification = classifyCanonicalFigure(h1Pattern);
  const h16Classification = classifyCanonicalFigure(h16Pattern);
  const h1BeneficIncoming = h1Classification.saadNahs === 'saad' && h1Classification.dakhalKharij === 'dakhil';
  const h1PureMalefic = h1Classification.saadNahs === 'nahs';

  const strongRecurrenceHouses = [4, 7, 10].filter((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    return (entry?.key || entry?.pattern || null) === h1Pattern;
  });
  const appearsInStrongHouse = strongRecurrenceHouses.length > 0;
  const appearsInH10 = strongRecurrenceHouses.includes(10);
  const outcomeSupportsReturn = h16Classification.saadNahs === 'saad';
  const returnIndicated = h1BeneficIncoming && appearsInStrongHouse && outcomeSupportsReturn;

  let sourceOutcome = 'unresolved';
  let positive = null;
  let outputHebrew;
  if (returnIndicated) {
    sourceOutcome = 'returns';
    positive = true;
    outputHebrew = 'בית 1 הוא צורה מיטיבה פנימית, אותה צורה חוזרת בבית חזק נוסף (' + strongRecurrenceHouses.join(', ') + '), ובית 16 — אחרית הדבר — מיטיב ותומך. לפי כשף v57 עמ׳ 266: מי שהודח מן השירות חוזר למקומו.';
  } else if (h1PureMalefic) {
    sourceOutcome = 'does-not-return';
    positive = false;
    outputHebrew = 'בית 1 הוא צורה מזיקה טהורה. המקור בעמ׳ 266 אומר במפורש שבמקרה שהצורה הנזכרת מזיקה הדין להפך; לפי כלל זה אין חזרה למקום השירות. אין צורך להמציא הצבעת רוב מן הבתים האחרים.';
  } else {
    const missing = [];
    if (!h1BeneficIncoming) missing.push('בית 1 אינו מיטיב־פנימי במלוא התנאי');
    if (!appearsInStrongHouse) missing.push('צורת בית 1 אינה חוזרת בבית חזק נוסף');
    if (!outcomeSupportsReturn) missing.push('בית 16 אינו נותן עדות מיטיבה תומכת');
    outputHebrew = 'תנאי החזרה החיובי של כשף v57 עמ׳ 266 אינו שלם: ' + missing.join('; ') + '. מאחר שבית 1 גם אינו מזיק טהור בענף ההפוך המפורש, אין להשלים פסק מן הדעת והתוצאה נשארת ללא הכרעה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 266',
    sourceText: 'מי שהודח משירות — האם יחזור? ראה את הראשון. אם הוא מיטיב נכנס, ומצטייר בעשירי או בבתים החזקים, והאחרית מעידה על כך — הוא חוזר למקומו. ואם הצורה מזיקה, הדין להפך.',
    housesUsed: [1, 4, 7, 10, 16],
    h1Pattern,
    h1FigureHebrew: h1Classification.figureHebrew || h1?.hebrew || h1?.hebrewName || h1Pattern,
    h1Classification,
    h1BeneficIncoming,
    strongRecurrenceHouses,
    appearsInStrongHouse,
    appearsInH10,
    outcomeHouse: 16,
    h16Pattern,
    h16FigureHebrew: h16Classification.figureHebrew || h16?.hebrew || h16?.hebrewName || h16Pattern,
    h16Classification,
    outcomeSupportsReturn,
    sourceOutcome,
    positive,
    verdictType: 'return-to-office',
    outputHebrew,
  };
}

// Kashf v57 p182 — general money/livelihood outlook from H2 + H10.
function computeMoneyGeneralConditionP182(chart) {
  if (!Array.isArray(chart)) return null;
  const h2 = findCanonicalHouse(chart, 2);
  const h10 = findCanonicalHouse(chart, 10);
  const h2Pattern = h2?.key || h2?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h2Pattern || !h10Pattern) return null;

  const combined = combineRamlFigures(h2Pattern, h10Pattern);
  const resultPattern = combined.resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);
  const resultFigureHebrew = combined.result?.hebrewName || classification.figureHebrew || resultPattern;

  let sourceOutcome = 'mixed-or-unresolved';
  let positive = null;
  let outcomeHebrew = 'הצורה ממוזגת או אינה שייכת לענף מיטיב/מזיק טהור; הכלל אינו נותן כאן פסק בינארי.';
  if (classification.saadNahs === 'saad') {
    sourceOutcome = 'good';
    positive = true;
    outcomeHebrew = 'הצורה מיטיבה — עדות לטוב בעניין הממון והפרנסה.';
  } else if (classification.saadNahs === 'nahs') {
    sourceOutcome = 'bad';
    positive = false;
    outcomeHebrew = 'הצורה מזיקה — עדות לרע בעניין הממון והפרנסה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 182',
    sourceText: 'אם רצית לשאול על בית ממונך ופרנסתך, התבונן בבית השני ובעשירי — בית הפרנסה — והעמד מהם צורה; היא מודיעה את כל הטוב והרע בעניין.',
    housesUsed: [2, 10],
    h2Pattern,
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    classification,
    sourceOutcome,
    positive,
    verdictType: 'money-general-condition-h2h10',
    outputHebrew: 'בית 2 (' + h2Pattern + ') ובית 10 (' + h10Pattern + ') הולידו את ' + resultFigureHebrew + ' (' + resultPattern + '). ' + outcomeHebrew + ' זהו דין המצב הכללי בלבד; מקור הכסף, השגת ממון מסוים, סכום, חוקיות ושיטות חלופיות אינם מצטרפים לפסק זה.',
  };
}

// Kashf v57 p180 — invert H10 rows and judge the resulting figure's placement.
function computeLivelihoodP180(chart) {
  if (!Array.isArray(chart)) return null;
  const h10 = findCanonicalHouse(chart, 10);
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h10Pattern || h10Pattern.length !== 4) return null;
  const resultPattern = [...h10Pattern].map((row) => row === '1' ? '2' : row === '2' ? '1' : '').join('');
  if (resultPattern.length !== 4) return null;
  const classification = classifyCanonicalFigure(resultPattern);
  const resultFigureHebrew = classification.figureHebrew || resultPattern;

  const placements = [];
  for (let houseNumber = 1; houseNumber <= 12; houseNumber += 1) {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (pattern === resultPattern) placements.push(houseNumber);
  }
  const angleSet = new Set([1, 4, 7, 10]);
  const cadentSet = new Set([3, 6, 9, 12]);
  const succedentSet = new Set([2, 5, 8, 11]);
  const anglePlacements = placements.filter((houseNumber) => angleSet.has(houseNumber));
  const cadentPlacements = placements.filter((houseNumber) => cadentSet.has(houseNumber));
  const succedentPlacements = placements.filter((houseNumber) => succedentSet.has(houseNumber));
  const hasAnglePlacement = anglePlacements.length > 0;
  const hasCadentPlacement = cadentPlacements.length > 0;

  let sourceOutcome = 'unresolved';
  let positive = null;
  if (hasAnglePlacement && hasCadentPlacement) {
    sourceOutcome = 'conflicting-placement';
  } else if (hasAnglePlacement && classification.saadNahs === 'saad') {
    sourceOutcome = 'expanded-livelihood';
    positive = true;
  } else if (hasCadentPlacement) {
    sourceOutcome = 'unfavorable-livelihood';
    positive = false;
  }

  let outputHebrew;
  if (sourceOutcome === 'expanded-livelihood') {
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '), צורה מיטיבה, והיא נמצאת בבית/בתי יתד ' + anglePlacements.join(', ') + '. לפי כשף v57 עמ׳ 180: המחיה מתרחבת.';
  } else if (sourceOutcome === 'unfavorable-livelihood') {
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '), והיא נמצאת בבית/בתים נופלים ' + cadentPlacements.join(', ') + '. לפי כשף v57 עמ׳ 180: מצב זה אינו טוב למחיה.';
  } else if (sourceOutcome === 'conflicting-placement') {
    outputHebrew = 'הצורה שנוצרה מהיפוך בית 10 נמצאת גם ביתד (' + anglePlacements.join(', ') + ') וגם בבית נופל (' + cadentPlacements.join(', ') + '). המקור אינו נותן כלל קדימות למצב כפול כזה, ולכן אין להכריע מן הדעת.';
  } else {
    const where = placements.length ? placements.join(', ') : 'ללא חזרה בבתים 1–12';
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '). מיקומיה בלוח: ' + where + '. התנאי המפורש של צורה מיטיבה ביתד אינו מתקיים באופן חד־משמעי, וגם אין עדות נופלת יחידה שמכריעה; לכן כלל עמ׳ 180 נשאר ללא הכרעה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 180',
    sourceText: 'במחיה: התבונן בעשירי. כל מה שבצורותיו פתוח — סתום; וכל מה שסתום — פתח. התבונן איזו צורה יוצאת. אם הצורה עוברת לבית יתד והיא צורה מיטיבה, המחיה מתרחבת; ואם היא נופלת, אינה טובה.',
    housesUsed: [1,2,3,4,5,6,7,8,9,10,11,12],
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    classification,
    placements,
    anglePlacements,
    succedentPlacements,
    cadentPlacements,
    sourceOutcome,
    positive,
    verdictType: 'livelihood',
    outputHebrew,
  };
}

// Kashf printed p257: the White/Road placement clause applies when the
// question was cast at night. The H10 "this house" clause and the day/Venus
// clause are separate unresolved operations and are not inferred here.
function computeMotherNightWhiteRoadP257(chart, clientContext = {}) {
  if (!Array.isArray(chart)) return null;
  const period = clientContext?.dynFields?.motherCastPeriod || clientContext?.motherCastPeriod || null;
  const placements = { '2212': [], '1111': [] };
  for (let houseNumber = 1; houseNumber <= 12; houseNumber += 1) {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (Object.hasOwn(placements, pattern)) placements[pattern].push(houseNumber);
  }
  const favorableHouses = new Set([1, 2, 4, 5, 7, 8, 10, 11]);
  const fallingHouses = new Set([3, 6, 9, 12]);
  const favorable = Object.values(placements).flat().filter(house => favorableHouses.has(house));
  const falling = Object.values(placements).flat().filter(house => fallingHouses.has(house));
  const signals = period === 'לילה' ? [
    ...(favorable.length ? [`לבן או דרך בבית יתד או סמוך לו (${favorable.join(', ')}) — סימן לטוב ולתיקון לפי כשף עמ׳ 257.`] : []),
    ...(falling.length ? [`לבן או דרך בבית נופל (${falling.join(', ')}) — סימן לצרות לפי כשף עמ׳ 257.`] : []),
  ] : [];
  const positive = period === 'לילה' && favorable.length && !falling.length ? true
    : period === 'לילה' && falling.length && !favorable.length ? false : null;
  const outputHebrew = period !== 'לילה'
    ? 'כלל מיקום לבן ודרך בעמ׳ 257 נאמר על שאלת לילה בלבד. דרוש זמן ההטלה ״לילה״; ענף היום אינו מוכרע כאן.'
    : signals.length
      ? `${signals.join(' ')}${favorable.length && falling.length ? ' הסימנים מופיעים בשני סוגי הבתים; המקור אינו נותן כלל קדימות לפסק כולל.' : ''} דין ״בית זה״ וענף היום לא הופעלו.`
      : 'לא נמצאו לבן או דרך בבתים 1–12; ענף המיקום הלילי בעמ׳ 257 אינו נותן פסק מכך. דין ״בית זה״ לא הופעל.';
  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 257; סיווג הבתים עמ׳ 43–45',
    sourceText: 'לבן או דרך ביתד או בסמוכים — טוב ותיקון; בנופלים — צרות. דין זה כשזמן השאלה בלילה.',
    housesUsed: Object.values(placements).flat(),
    period, placements, favorable, falling, signals,
    positive,
    outputHebrew,
  };
}

const P248_249_MISSING_DEATH_PATTERNS = new Set([
  '2222', // קהלה / الجماعة
  '2112', // חיבור / الاجتماع
  '1111', // דרך / الطريق
  '2212', // לבן / البياض
  '2122', // אדום / الحمرة
]);

// Kashf v57 pp248-249 — life-status testimony for a missing person.
function computeMissingLifeStatusP248P249(chart) {
  if (!Array.isArray(chart)) return null;
  const lifeHouses = [1, 4, 9, 15];
  const severeHouses = [6, 7, 8, 15];
  const readHouse = (houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: classifyCanonicalFigure(pattern).figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  };
  const lifeResults = lifeHouses.map(readHouse);
  const severeResults = severeHouses.map(readHouse);
  if (lifeResults.some((item) => !item) || severeResults.some((item) => !item)) return null;

  const aliveIndicated = lifeResults.every((item) => item.classification.saadNahs === 'saad');
  const severeDeathTestimony = severeResults.every((item) => P248_249_MISSING_DEATH_PATTERNS.has(item.pattern));
  let sourceOutcome = 'unresolved';
  if (aliveIndicated && severeDeathTestimony) sourceOutcome = 'conflicting-source-signs';
  else if (aliveIndicated) sourceOutcome = 'alive-indicated';
  else if (severeDeathTestimony) sourceOutcome = 'severe-death-testimony';

  let outputHebrew;
  if (sourceOutcome === 'alive-indicated') {
    outputHebrew = 'בתים 1, 4, 9 ו־15 כולם מיטיבים. לפי כשף v57 עמ׳ 248–249: זהו סימן שהנעדר חי.';
  } else if (sourceOutcome === 'severe-death-testimony') {
    outputHebrew = 'בבתים 6, 7, 8 ו־15 נמצאות כולן צורות מן הרשימה המפורשת בעמ׳ 248–249: קהלה, חיבור, דרך, לבן או אדום. זהו סימן מקור המורה על מותו של הנעדר; הפלט שומר אותו כעדות של שיטת הספר ואינו מציג אותו כאימות עובדתי חיצוני של מוות.';
  } else if (sourceOutcome === 'conflicting-source-signs') {
    outputHebrew = 'בלוח מתקיימים יחד סימן החיים וסימן המוות שנמסרו בעמ׳ 248–249. המקור אינו נותן כאן כלל קדימות בין העדויות, ולכן אין לבחור אחת מהן מן הדעת.';
  } else {
    outputHebrew = 'לא הושלם סימן החיים של בתים 1, 4, 9 ו־15, וגם לא הושלם צירוף ארבעת בתי עדות המוות 6, 7, 8 ו־15. אין להסיק מאי־קיום אחד התנאים את היפוכו; כלל זה נשאר ללא הכרעה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 248–249',
    sourceText: 'אם הראשון, הסוף, הרביעי והתשיעי מיטיבים — הנעדר חי. ואם בשישי, בשביעי, בשמיני ובסוף נמצאות מן הצורות האלה: קהלה, חיבור, דרך, לבן או אדום — הדבר מורה על מותו.',
    housesUsed: [1,4,6,7,8,9,15],
    lifeHouses,
    severeHouses,
    lifeResults,
    severeResults,
    aliveIndicated,
    severeDeathTestimony,
    sourceOutcome,
    positive: sourceOutcome === 'alive-indicated' ? true : null,
    verdictType: 'missing-life-status',
    outputHebrew,
  };
}

const P174_GENERAL_STATE_HOUSE_ROLES = Object.freeze({
  1: Object.freeze({ titleHebrew: 'בית הנפש', roleHebrew: 'מצב האדם והתחלת כל דבר' }),
  2: Object.freeze({ titleHebrew: 'בית הממון', roleHebrew: 'ממונו של השואל' }),
  4: Object.freeze({ titleHebrew: 'בית האחרית והמקום', roleHebrew: 'אחריתו ומקומו' }),
  7: Object.freeze({ titleHebrew: 'בית הכוונות והמבוקש', roleHebrew: 'כוונותיו ומבוקשיו' }),
  10: Object.freeze({ titleHebrew: 'בית הטוב והמעמד', roleHebrew: 'טובו ומעמדו' }),
  15: Object.freeze({ titleHebrew: 'בית אחרית העניין', roleHebrew: 'אחרית עניינו' }),
});

// Kashf v57 p174 — bounded general-state reading.
// The source tells the reader which houses to inspect. It does NOT give a
// majority rule or a single aggregate yes/no formula, so every house remains
// an independent source witness and the executor deliberately returns
// positive:null.
function computeGeneralStateP174(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 4, 7, 10, 15];
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    const role = P174_GENERAL_STATE_HOUSE_ROLES[houseNumber];
    return {
      houseNumber,
      titleHebrew: role?.titleHebrew || ('בית ' + houseNumber),
      roleHebrew: role?.roleHebrew || null,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      fortuneClass: classification.saadNahs,
      fortuneClassHebrew: classification.saadNahsHebrew || 'ללא סיווג קנוני זמין',
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const detail = houseResults.map((item) =>
    'בית ' + item.houseNumber + ' — ' + item.titleHebrew + ' (' + item.roleHebrew + '): ' +
    item.figureHebrew + ' (' + item.pattern + '), ' + item.fortuneClassHebrew
  ).join('; ');

  const outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 174, הקריאה הכללית נעשית בשישה מוקדים נפרדים: ' +
    detail + '. המקור מורה להתבונן בכל אחד מן הבתים האלה לפי תפקידו; הוא אינו מוסר כאן נוסחת רוב, שקלול בין הבתים או פסק כן/לא יחיד, ולכן אין ליצור הכרעה מצטברת שלא נאמרה במקור.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 174',
    sourceText: 'בבית הראשון האדם: אם שאלך אדם על הבית הראשון שלו, על אחריתו, על ממונו, על מסעותיו או על כלל ענייניו, התבונן לאחר השלמת ההכאה בבית הראשון — בית הנפש, שהוא התחלת כל דבר. אחר כך התבונן בשני — בית הממון; ברביעי — בית אחריתו ומקומו; בשביעי — בית כוונותיו ומבוקשיו; בעשירי — בית טובו ומעמדו; ובחמישה־עשר — בית אחרית עניינו.',
    housesUsed,
    houseResults,
    aggregationRule: 'none-source-explicit',
    aggregateVerdict: null,
    verdictType: 'general-state-profile',
    positive: null,
    outputHebrew,
  };
}

const P179_MONEY_SOURCE_HOUSE_LABELS = Object.freeze({
  1: 'בית הנפש / השואל',
  2: 'בית הממון',
  3: 'בית האחים והקרובים',
  4: 'בית האב, הבית והקרקע',
  5: 'בית הילדים והשמחה',
  6: 'בית המחלות והמשרתים',
  7: 'בית הזוגיות והצד שמול השואל',
  8: 'בית המוות והירושה',
  9: 'בית המסע והדת',
  10: 'בית הכבוד, השלטון והמלאכה',
  11: 'בית התקווה, החברים והסיוע',
  12: 'בית האויבים, המאסר והעיכוב',
});

// Kashf p179 — source of money by the house occupied by Incoming Honor.
// Raw-scan verification closes the gate wording as explicit سعد: «وإن كان في
// الثاني سعد». Therefore H2 must be pure benefic; mixed H2 is not promoted. Incoming Honor is searched only in the twelve topical
// houses because the rule asks for the nature of the house; witness/judge
// positions are traced separately but not interpreted as financial channels.
function computeMoneySourceP179(chart) {
  if (!Array.isArray(chart)) return null;
  const h2 = findCanonicalHouse(chart, 2);
  const h2Pattern = h2?.key || h2?.pattern || null;
  if (!h2Pattern) return null;

  const h2Classification = classifyCanonicalFigure(h2Pattern);
  const beneficGateMet = h2Classification.saadNahs === 'saad';
  const allPositions = Array.from({ length: 16 }, (_, i) => i + 1);
  const topicalHouses = Array.from({ length: 12 }, (_, i) => i + 1);

  const incomingHonorOccurrences = allPositions.filter((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    return (entry?.key || entry?.pattern || null) === '2211';
  });
  const incomingHonorTopicalHouses = incomingHonorOccurrences.filter((houseNumber) => houseNumber <= 12);
  const incomingHonorNonTopicalPositions = incomingHonorOccurrences.filter((houseNumber) => houseNumber > 12);

  const sourceCandidates = beneficGateMet
    ? incomingHonorTopicalHouses.map((houseNumber) => ({
        houseNumber,
        houseNatureHebrew: P179_MONEY_SOURCE_HOUSE_LABELS[houseNumber] || ('בית ' + houseNumber),
      }))
    : [];

  const moneyIncomingInH2 = h2Pattern === '2121';
  const moneyIncomingJudgmentHouses = moneyIncomingInH2
    ? topicalHouses.filter((houseNumber) => {
        const entry = findCanonicalHouse(chart, houseNumber);
        return (entry?.key || entry?.pattern || null) === '2121';
      })
    : [];

  const sourceResolved = beneficGateMet && sourceCandidates.length > 0;
  let outputHebrew;
  if (!beneficGateMet) {
    outputHebrew = 'בית 2 אינו מסווג כאן כצורה מיטיבה טהורה. לכן כלל מקור הממון של כשף v57 עמ׳ 179 — חיפוש כבוד נכנס — אינו מופעל. אין להסיק מכך לבדו שאין כסף, ואין להפעיל כאן את ענפי העמוד האחרים שלא שייכים לשיטה הזאת.';
  } else if (!sourceCandidates.length) {
    outputHebrew = 'בית 2 מיטיב, אך כבוד נכנס (2211) אינו נמצא באחד משנים־עשר בתי הנושא. לכן כלל עמ׳ 179 אינו נותן כאן מקור ביתי מוגדר לממון.';
  } else {
    const channels = sourceCandidates.map((item) => 'בית ' + item.houseNumber + ' — ' + item.houseNatureHebrew).join('; ');
    outputHebrew = 'בית 2 מיטיב. כבוד נכנס (2211) נמצא ב' + channels + '. לפי כשף v57 עמ׳ 179, הממון מתקבל מטבע הבית או הבתים שבהם כבוד נכנס שורה. אם יש יותר מהופעה אחת, המקור נותן יותר מערוץ אחד ואינו מדרג ביניהם.';
  }

  if (moneyIncomingInH2) {
    const recurrenceText = moneyIncomingJudgmentHouses.length
      ? moneyIncomingJudgmentHouses.map((n) => 'בית ' + n).join(', ')
      : 'ללא חזרה נוספת';
    outputHebrew += ' בנוסף, ממון נכנס (2121) עצמו נמצא בבית 2; הופעותיו ב' + recurrenceText + ' נותנות לפי אותו עמוד עדות נפרדת על השגת הממון. עדות זו אינה מוחלפת או מוזגת עם כלל מקור הממון של כבוד נכנס.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 179',
    sourceText: 'אם בבית השני צורה מיטיבה, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',
    housesUsed: topicalHouses,
    positionsScanned: allPositions,
    h2Pattern,
    h2Classification,
    beneficGateMet,
    incomingHonorPattern: '2211',
    incomingHonorOccurrences,
    incomingHonorTopicalHouses,
    incomingHonorNonTopicalPositions,
    sourceCandidates,
    sourceHouseNumbers: sourceCandidates.map((item) => item.houseNumber),
    sourceResolved,
    multipleSourceChannels: sourceCandidates.length > 1,
    moneyIncomingPattern: '2121',
    moneyIncomingInH2,
    moneyIncomingJudgmentHouses,
    positive: null,
    verdictType: 'money-source',
    outputHebrew,
  };
}

// Kashf p159 — dedicated rule for identifying whom/what the querent is
// actually asking about. This is NOT a generic hidden-thought method.
// Read H6, then look for the same figure in another topical house (H1-H12).
// The source gives no precedence if the figure repeats in more than one house,
// so multiple matches stay explicitly ambiguous.
const P159_SUBJECT_HOUSE_ROLES = Object.freeze({
  1: 'השואל עצמו',
  2: 'ממון ורכוש',
  3: 'אח/אחות, שכן או קרוב',
  4: 'אב, בית או קרקע',
  5: 'ילד/ילדה',
  7: 'בן/בת זוג, שותף או יריב',
  8: 'ירושה או ענייני מוות',
  9: 'נסיעה, אדם רחוק או דת',
  10: 'שלטון, מעמד או עבודה',
  11: 'ידיד, תקווה או רצון',
  12: 'אויב נסתר או מאסר',
});

function computeQuestionSubjectByH6P159(chart) {
  if (!Array.isArray(chart)) return null;
  const h6 = findCanonicalHouse(chart, 6);
  const h6Pattern = h6?.key || h6?.pattern || null;
  if (!h6Pattern) return null;

  const matches = [];
  for (let houseNumber = 1; houseNumber <= 12; houseNumber += 1) {
    if (houseNumber === 6) continue;
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (pattern !== h6Pattern) continue;
    matches.push({
      houseNumber,
      houseRole: P159_SUBJECT_HOUSE_ROLES[houseNumber] || `בית ${houseNumber}`,
      figurePattern: pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
    });
  }

  const resolvedHouseNumber = matches.length === 1 ? matches[0].houseNumber : null;
  const resolvedHouseRole = matches.length === 1 ? matches[0].houseRole : null;
  const status = matches.length === 1
    ? 'resolved'
    : matches.length === 0
      ? 'no-recurrence'
      : 'ambiguous-multiple-recurrences';

  let outputHebrew;
  if (matches.length === 1) {
    outputHebrew = `צורת בית 6 (${h6?.hebrew || h6?.hebrewName || h6Pattern}, ${h6Pattern}) חוזרת בבית ${resolvedHouseNumber}. לפי כשף עמ׳ 159, השואל שואל על בעל בית זה: ${resolvedHouseRole}.`;
  } else if (matches.length === 0) {
    outputHebrew = `צורת בית 6 (${h6?.hebrew || h6?.hebrewName || h6Pattern}, ${h6Pattern}) אינה חוזרת בבית אחר מבתי 1–12. כלל עמ׳ 159 אינו נותן כאן זיהוי תפעולי נוסף.`;
  } else {
    outputHebrew = `צורת בית 6 (${h6?.hebrew || h6?.hebrewName || h6Pattern}, ${h6Pattern}) חוזרת ביותר מבית אחד: ${matches.map((m) => `בית ${m.houseNumber} — ${m.houseRole}`).join('; ')}. המקור אינו נותן כלל קדימות בין חזרות, ולכן אין לבחור אחת מהן בכוח.`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 159',
    sourceText: 'כדי לדעת על מי שאל השואל: התבונן בשישי, וראה את דוגמתו באיזה בית; דע שהוא שואל על בעל אותו בית.',
    housesUsed: [6, ...matches.map((m) => m.houseNumber)],
    h6Pattern,
    h6FigureHebrew: h6?.hebrew || h6?.hebrewName || h6Pattern,
    matches,
    status,
    resolvedHouseNumber,
    resolvedHouseRole,
    positive: null,
    verdictType: 'question-subject-identification',
    outputHebrew,
  };
}

// Kashf p167 — hidden/covert action behind the querent.
// Source construction: AIR row only from H4, H6, H8 and H15 (the balance/judge),
// assembled in that order into one four-row figure. This is intentionally NOT
// the neighboring fire-row sorcery rule and does not diagnose sorcery/jinn/evil eye.
function computeHiddenActionP167(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [4, 6, 8, 15];
  const airRows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    const value = typeof pattern === 'string' && pattern.length === 4 ? pattern[1] : null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      airRowValue: value,
      airRowState: getCanonicalRowState(pattern, 1),
    };
  });
  if (airRows.some((row) => row.airRowValue !== '1' && row.airRowValue !== '2')) return null;

  const derivedPattern = airRows.map((row) => row.airRowValue).join('');
  const classification = classifyCanonicalFigure(derivedPattern);
  const derivedFigureHebrew = classification.figureHebrew || derivedPattern;
  const hiddenAction = classification.saadNahs === 'nahs';

  let outputHebrew;
  if (hiddenAction) {
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — צורה מזיקה. לפי כשף עמ׳ 167: יש פעולה מאחורי השואל. כלל זה אינו קובע שמדובר בכישוף, ג׳ין או עין הרע ואינו מזהה אדם.';
  } else {
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — ' + (classification.saadNahsHebrew || classification.saadNahs || 'ללא סיווג') + '. לפי לשון כשף עמ׳ 167: אם התוצאה אינה מזיקה — אין פעולה מאחורי השואל לפי כלל זה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 167',
    sourceText: 'אם אמר לך השואל: האם מאחוריי יש פעולה או לא? קח את אוויר הרביעי, אוויר השישי, אוויר השמיני ואוויר המאזן; העמד מהם צורה. אם יצאה צורה מזיקה, הרי הפעולה מאחוריו; ואם לא — לא.',
    housesUsed,
    rowUsed: 'air',
    rowIndex: 1,
    airRows,
    derivedPattern,
    derivedFigureHebrew,
    classification,
    hiddenAction,
    sourceConditionMet: hiddenAction,
    positive: hiddenAction,
    diagnosisScope: 'hidden-action-only',
    outputHebrew,
  };
}

// Kashf p167 — does the querent practice sorcery on the asked-about person.
// Source construction: FIRE row only from H1, H4, H6 and H15 (the same
// Mizan/Judge identification already used by the sibling hidden-action
// method above), assembled in that order into one four-row figure.
// Opened 2026-10-04, immediately after computeHiddenActionP167. UNLIKE that
// sibling, this passage states only the malefic branch ("فإن نحسا، فالسائل
// يعمل") with no "otherwise not" clause anywhere before the next نكتة
// begins — confirmed by direct re-reading at printed p167. So the non-
// malefic case here returns no verdict (null), not a disguised "not
// sorcery" claim, matching the asymmetric-branch discipline already used
// this session for travel.p239.profitH7Witness. Does not identify a
// third-party sorcerer and does not diagnose jinn or evil eye.
function computeQuerentCastsSorceryP167(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 4, 6, 15];
  const fireRows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    const value = typeof pattern === 'string' && pattern.length === 4 ? pattern[0] : null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      fireRowValue: value,
      fireRowState: getCanonicalRowState(pattern, 0),
    };
  });
  if (fireRows.some((row) => row.fireRowValue !== '1' && row.fireRowValue !== '2')) return null;

  const derivedPattern = fireRows.map((row) => row.fireRowValue).join('');
  const classification = classifyCanonicalFigure(derivedPattern);
  const derivedFigureHebrew = classification.figureHebrew || derivedPattern;
  const querentCastsSorcery = classification.saadNahs === 'nahs';

  let outputHebrew, clientSafeHebrew, positive;
  if (querentCastsSorcery) {
    positive = true;
    outputHebrew = 'שורות האש של בתים 1, 4, 6 ו-15 (המאזן) יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — צורה מזיקה. לפי כשף עמ׳ 167: "ואם היה השואל מכשף את הנשאל עליו, קח אש הראשון, והרביעי, והשישי, והמאזן... אם יצאה נחס, השואל פועל". המקור נותן כאן רק ענף מפורש אחד (מזיק); אין בו סעיף "אם לא" מפורש.';
    clientSafeHebrew = 'סימני הלוח מצביעים על פעולת כישוף מצד השואל כלפי הנשאל, לפי כלל ייעודי בכשף.';
  } else {
    positive = null;
    outputHebrew = 'שורות האש של בתים 1, 4, 6 ו-15 (המאזן) יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — ' + (classification.saadNahsHebrew || classification.saadNahs || 'ללא סיווג') + ', לא מזיקה. כשף עמ׳ 167 נותן פסק מפורש רק לענף המזיק ("אם יצאה נחס, השואל פועל"); אין בטקסט סעיף "ואם לא" מפורש, ולכן אין כאן פסק של "אין כישוף" — רק היעדר תנאי הפסק המפורש.';
    clientSafeHebrew = 'אין בלוח סימן מכריע לפי כלל זה; המקור אינו נותן כאן פסק שלילי מפורש.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 167',
    sourceText: 'אם היה השואל מכשף את הנשאל או לא? קח את אש הראשון, והרביעי, והשישי, והמאזן; העמד מהם צורה; הבט בצורה ההיא: אם יצאה מזיקה, השואל פועל.',
    housesUsed,
    rowUsed: 'fire',
    rowIndex: 0,
    fireRows,
    derivedPattern,
    derivedFigureHebrew,
    classification,
    querentCastsSorcery,
    sourceConditionMet: querentCastsSorcery,
    positive,
    diagnosisScope: 'querent-casts-sorcery-only',
    outputHebrew,
    clientSafeHebrew,
  };
}

// Printed p205–206 — "نكتة: عن المرأة وصيانتها" (signs of a woman's chastity/
// modesty). Repairs marriage.p205.modestyPurity. The pre-existing legacy
// computeWomanModesty() (kashf-book-additions.js) tested fortune (saad/nahs)
// for every clause, including the ones the source states in explicit purity
// (طاهر/طمئة) terms, and collapsed "take a figure from the 7th and 9th"
// (خذ من السابع والتاسع شكلا) into "both H7 and H9 individually benefic" — a
// different operation than deriving one combined figure from the two houses.
// This executor applies purity where the source says purity, fortune where
// the source says fortune, and the combined-figure operation where the
// source says to combine. Verified against KASHF_ARABIC_PRINTED_SCAN.pdf
// printed p205 (PDF p207) and p206 (PDF p208).
//
// The source lists several "وقيل" (= "and it is said") clauses — alternate
// methods from different authorities, not sequential steps of one algorithm.
// Each applicable clause is therefore reported as its own sign below, not
// merged into a single invented priority order.
//
// One further clause on printed p206 ("فإن كان الأول في الثامن وهو طاهر...")
// relates H1 to H8 and is NOT implemented here — its operator ("the First in
// the Eighth") is not clearly decodable as a single operation from the
// printed text alone (unlike "وافق الميزان" on p205, which is unambiguous),
// so it is left out rather than guessed. See the delivery report.
//
// 2026-10-04 Codex audit fixes:
// (1) kashf-v57-draft.html's displayed p205 text was corrected to phrase the
//     H7+H9 clause as a combined-figure operation (matching this executor)
//     instead of "both H7 and H9 individually benefic".
// (2) The opening instruction "كمل الرمل على إسمها" (complete the casting on
//     HER name) is a named-subject precondition, not a name-to-figure
//     conversion algorithm — no such conversion procedure for a primary
//     board appears anywhere near this passage (unlike the unrelated p186
//     abjad direction-rule, which spells out its own name arithmetic in
//     full). Inventing one would violate the no-invented-data rule. Instead
//     this executor checks whether a candidate name was actually recorded
//     for this reading, and reports plainly when that precondition is
//     unconfirmed, rather than silently assuming it.
// (3) outputHebrew (citations, "وقيل" markers, method notes) is evidence for
//     the advisor record, not something to read to a client verbatim. A
//     separate clientSafeHebrew field now carries a short, citation-free
//     rendering of the same signals; kashf-canonical-reading-engine.js
//     prefers it for the client-facing verdict text when present.
//
// 2026-10-04 second audit round: typing a name is not proof the board was
// actually cast for that name — a stale or reused board could carry any
// text in the name field. The source's precondition is now enforced as a
// HARD gate at this executor (not only in the UI): both a non-empty
// candidate name AND an explicit confirmation flag
// (clientContext.dynFields.castConfirmedOnName === true) are required, or
// NO sign-reading verdict is produced at all — not even a partial one.
// This applies to every caller of this function, including direct/
// programmatic invocation that bypasses the UI form.
function computeMarriageChastityPurityP205(chart, clientContext = {}) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h7 = findCanonicalHouse(chart, 7);
  const h9 = findCanonicalHouse(chart, 9);
  const h15 = findCanonicalHouse(chart, 15);
  const p1 = h1?.key || h1?.pattern || null;
  const p7 = h7?.key || h7?.pattern || null;
  const p9 = h9?.key || h9?.pattern || null;
  const p15 = h15?.key || h15?.pattern || null;
  if (!p1 || !p7 || !p9 || !p15) return null;

  const candidateName = String(clientContext?.dynFields?.candidate || '').trim();
  const castConfirmedOnName = clientContext?.dynFields?.castConfirmedOnName === true;
  const namedCastConfirmed = candidateName.length > 0 && castConfirmedOnName;

  if (!namedCastConfirmed) {
    const missing = [];
    if (!candidateName) missing.push('שם המועמדת');
    if (!castConfirmedOnName) missing.push('אישור מפורש שהלוח הוטל על שמה');
    const sourceRef = 'כשף אל־אסראר עמ׳ 205–206';
    const sourceText = 'נكتة על האישה וצניעותה: השלם את גורל החול על שמה... (ראו תיעוד מלא בסעיף זה כשהתנאי מתקיים).';
    return {
      sourceRef, sourceText,
      housesUsed: [1, 7, 9, 15],
      h1Pattern: p1, h7Pattern: p7, h9Pattern: p9, h15Pattern: p15,
      branch: 'named-cast-not-confirmed',
      positive: null,
      namedCastConfirmed: false,
      candidateName: candidateName || null,
      outputHebrew: `המקור פותח בהוראה מפורשת "השלם את גורל החול על שמה" — הטלה המיוחדת לאישה הנשאלת, לא לוח כללי או לוח שהוטל למטרה אחרת. חסר: ${missing.join(' וגם ')}. אין בקוד נוסחה הממירה שם לאותיות/ספרות עבור הלוח הראשי (בשונה מכלל כיוון האב בעמ׳ 186 שמפרש נוסחת אבג״ד משלו משלו); לכן אין להמיר שם אוטומטית ואין להפיק סימן כלשהו לפני שהתנאי מאומת במפורש.`,
      clientSafeHebrew: 'לא ניתן להפיק סימן צניעות — חסר שם המועמדת ו/או אישור מפורש שהלוח הוטל במיוחד על שמה, כנדרש במקור.',
    };
  }

  const purityOf = (pattern) => {
    const v = HAWI_FIGURE_NAMES_BY_ID?.[pattern]?.purityHebrew || null;
    if (v === 'טהור') return 'pure';
    if (typeof v === 'string' && v.startsWith('טמא')) return 'impure';
    return null; // dual-classified (e.g. אדום) or unknown — no verdict from purity alone
  };
  const fortuneOf = (pattern) => classifyCanonicalFigure(pattern).saadNahs;

  const pure1 = purityOf(p1);
  const pure7 = purityOf(p7);
  const pure9 = purityOf(p9);
  const pure15 = purityOf(p15);
  const fortune1 = fortuneOf(p1);
  const fortune9 = fortuneOf(p9);
  const fortune15 = fortuneOf(p15);
  const combined79 = combineRamlFigures(p7, p9);
  const pattern79 = combined79?.resultPattern || null;
  const fortune79 = pattern79 ? fortuneOf(pattern79) : null;

  const lines = [];
  const clientLines = [];
  const signals = [];

  if (p1 === p15 && pure1 === 'pure' && pure15 === 'pure') {
    lines.push('בית 1 זהה לצורת המאזן (בית 15) ושתיהן טהורות — "טהורה כליל, אין בה ספק ואין פירוש אחר" (כשף עמ׳ 205).');
    clientLines.push('הלוח מראה טהרה וודאית — זהו סימן חזק לצניעותה.');
    signals.push('positive');
  } else if (pure1 === 'pure') {
    lines.push('צורת בית 1 טהורה — סימן לצניעותה (כשף עמ׳ 205).');
    clientLines.push('הלוח מראה סימן טהרה — זהו סימן לצניעותה.');
    signals.push('positive');
  } else if (pure1 === 'impure') {
    lines.push('צורת בית 1 טמאה — אין בה סימן טהרה מסעיף זה.');
    clientLines.push('הלוח אינו מראה כאן סימן טהרה.');
  }

  if (pure1 === 'pure' && pure7 === 'pure') {
    lines.push('לפי שיטה חלופית ("وقيل"): בית 1 ובית 7 שניהם טהורים — סימן לצניעותה.');
    clientLines.push('סימן נוסף בלוח מחזק את סימן הצניעות.');
    signals.push('positive');
  }

  if (fortune79 === 'saad') {
    lines.push(`לפי שיטה חלופית נוספת ("وقيل"): הצורה הנולדת מהרכבת בית 7 ובית 9 (${pattern79}) מיטיבה — סימן ליראת שמים וצניעות ("תקיה").`);
    clientLines.push('סימן נוסף בלוח מראה יראת שמים וצניעות.');
    signals.push('positive');
  } else if (fortune79 === 'nahs') {
    lines.push(`⚠ לפי אותה שיטה חלופית: הצורה הנולדת מהרכבת בית 7 ובית 9 (${pattern79}) מזיקה — סימן לפריצות ("פאסקה").`);
    clientLines.push('יש בלוח סימן המעורר חשש בעניין צניעותה.');
    signals.push('negative');
  }

  if (p1 === p15 && fortune15 === 'nahs') {
    lines.push('⚠ בית 1 זהה לצורת המאזן, וזו מזיקה — "היא בהפך זאת" (כשף עמ׳ 205): סימן לפריצות.');
    clientLines.push('יש בלוח סימן מובהק המעורר חשש בעניין צניעותה.');
    signals.push('negative');
  }

  if (fortune1 === 'saad' && pure1 === 'pure' && fortune9 === 'nahs') {
    lines.push('בית 1 מיטיב וטהור, אך בית 9 מזיק — נשקף חשש שתתקלקל אחרי תקופת צניעות (כשף עמ׳ 205-206).');
    clientLines.push('לצד הסימן החיובי, יש בלוח רמז לחשש לעתיד שראוי לשים לב אליו.');
    signals.push('concern');
  }

  if (fortune1 === 'nahs' && pure9 === 'pure' && pure15 === 'pure') {
    lines.push('בית 1 מזיק, אך בית 9 והמאזן טהורים — "הנפש אינה חוששת ממשוכת דיבה" (כשף עמ׳ 206): אין חשש מרכילה.');
    clientLines.push('גם כשיש סימן שלילי חלקי, הלוח מרגיע מפני חשש של רכילה או דיבה.');
    signals.push('positive');
  }

  const sourceRef = 'כשף אל־אסראר עמ׳ 205–206';
  const sourceText = 'נكتة על האישה וצניעותה: אם צורת בית 1 טהורה — טהורה; אם תואמת את המאזן בטהרה — טהורה כליל ואין בה ספק. "وقيل": אם בית 1 ובית 7 טהורים — טהורה. "وقيل": קח צורה מהרכבת בית 7 ובית 9 — אם מיטיבה, תקיה; אם מזיקה, פאסקה. אם בית 1 תואם את המאזן והוא מזיק — ההפך. אם בית 1 מיטיב וטהור ובית 9 מזיק — חשש שתתקלקל אחרי צניעות. אם בית 1 מזיק ובית 9 והמאזן טהורים — אין חשש מרכילה.';
  const namePreconditionNote = `הלוח מתועד כמוטל על שם המועמדת ("${candidateName}"), עם אישור מפורש שההטלה נעשתה במיוחד על שמה, כנדרש בפתיח המקור ("كمل الرمل على إسمها").`;

  if (!lines.length) {
    return {
      sourceRef, sourceText,
      housesUsed: [1, 7, 9, 15],
      h1Pattern: p1, h7Pattern: p7, h9Pattern: p9, h15Pattern: p15,
      combinedH7H9Pattern: pattern79,
      branch: 'no-applicable-clause',
      positive: null,
      namedCastConfirmed,
      candidateName: candidateName || null,
      outputHebrew: `אף אחד מסעיפי הסימנים (עמ׳ 205-206) אינו חל על צירוף הצורות הזה בלוח הנוכחי. ${namePreconditionNote}`,
      clientSafeHebrew: 'אין בלוח הזה סימן מכריע בעניין הצניעות.',
    };
  }

  const hasNegative = signals.includes('negative');
  const hasConcern = signals.includes('concern');
  const hasPositive = signals.includes('positive');
  let branch;
  let positive;
  if (hasNegative && !hasPositive) { branch = 'impure-signs'; positive = false; }
  else if (hasPositive && !hasNegative && !hasConcern) { branch = 'pure-signs'; positive = true; }
  else { branch = 'mixed-signs'; positive = null; }

  return {
    sourceRef, sourceText,
    housesUsed: [1, 7, 9, 15],
    h1Pattern: p1, h7Pattern: p7, h9Pattern: p9, h15Pattern: p15,
    combinedH7H9Pattern: pattern79,
    branch,
    positive,
    namedCastConfirmed,
    candidateName: candidateName || null,
    outputHebrew: `${lines.join(' ')} שימו לב: הסעיפים השונים הם שיטות חלופיות ("وقيل") של המקור ולא שלבי צבירה אחת; כל סימן שחל מוצג כפי שהוא במקור, בלי לקבוע ביניהם סדר עדיפות שאינו כתוב בטקסט. ${namePreconditionNote}`,
    clientSafeHebrew: clientLines.join(' '),
  };
}

// Printed p239 (PDF 241) — a distinct, fully-decodable profit rule for H7
// (the destination city), cross-verified against the witness-assignment
// table on printed p101-102 (PDF 103-104): H9 witnesses H1/H5/H7, and H5
// witnesses H3/H7/H11 — both lists include H7 (HOUSE_TESTIMONY in
// kashf-figure-attributes-gate2.js, independently re-confirmed against the
// scan). The source text reads: "والسابع البلد الذي قاصدها، فإن كان فيه
// شكل سعد، وشهد له سعد، فإنه يربح في تجارته ويرجع سالما؛ وإن كان فيه نحس،
// فالتجارة خاسرة" — the loss branch is stated unconditionally on H7 alone;
// only the profit branch requires a confirming witness, so the two branches
// are deliberately asymmetric and are kept asymmetric here.
//
// This is INDEPENDENT of the OTHER printed p237 (PDF 239) profit rule
// ("تراب المنطقة" / "earth of the region"), which remains blocked because
// its input term is undefined nowhere in the book (travel.p239.
// profitEarthRowH2, still blocked-by-source) — this executor does not
// substitute for or silently close that other method; it answers the same
// real-world question through a different, independently-documented source
// passage.
//
// Witness handling, corrected 2026-10-04 after reading printed p101-102
// (PDF 103-104) in full sequence, not just the testimony-assignment table:
// immediately after that table, the SAME passage continues "والتوليد من
// الشكلين عند اختلافهما، هو شاهد لهما وعليهما؛ فمن مال إليه، فاحكم به من
// السعد، والنحس، والممتزج" — "the generation from the two figures, when
// they disagree, is itself a witness for and against them; whichever
// [witness] it inclines toward, judge by that one's fortune." This DOES
// apply here in principle: H9 and H5 are exactly the two witnesses of H7,
// and when they disagree on fortune, the source's own prescribed procedure
// is to derive a third figure (combineRamlFigures, the same "توليد"
// operation used elsewhere) from them and use it to decide which witness to
// trust. But "مال إليه" ("inclines toward") is never given a computable
// definition anywhere in the book (same unresolved operator as the p182
// money-halal rule's "مال الخارج إلى", which is in fact the same
// terminology for the same kind of arbitration) — there is no stated way to
// determine which of two parent figures a derived figure "inclines toward".
// So: the disagreement-resolution procedure is correctly NOT invented here.
// When H9 and H5 disagree on fortune (saad vs. not-saad), the generated
// figure is computed and shown as evidence that the source's own procedure
// was followed, but no profit verdict is produced — per the explicit
// instruction that an undecodable arbitration must not be presented to the
// client as a certain decision. Only when H9 and H5 AGREE (both saad) is
// there no disagreement to arbitrate, and the profit branch fires cleanly.
function computeTravelProfitH7WitnessP239(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const h9 = findCanonicalHouse(chart, 9);
  const h5 = findCanonicalHouse(chart, 5);
  const p7 = h7?.key || h7?.pattern || null;
  const p9 = h9?.key || h9?.pattern || null;
  const p5 = h5?.key || h5?.pattern || null;
  if (!p7 || !p9 || !p5) return null;

  const fortune7 = classifyCanonicalFigure(p7).saadNahs;
  const fortune9 = classifyCanonicalFigure(p9).saadNahs;
  const fortune5 = classifyCanonicalFigure(p5).saadNahs;

  const sourceRef = 'כשף אל־אסראר עמ׳ 239 (קביעת עדי בית 7 וכלל המחלוקת לפי עמ׳ 101–102)';
  const sourceText = 'והשביעי הוא הארץ שאליה הוא מכוון: אם יש בו צורה מיטיבה ועד מיטיב מעיד לה, הוא מרוויח במסחרו וחוזר בשלום; ואם יש בו צורה מזיקה, המסחר מפסיד. (עדי בית 7, לפי טבלת העדות בעמ׳ 101-102: בית 9 ובית 5. אם העדים חלוקים: "התולדה משתי הצורות בעת מחלוקתן היא עדה בעדן ועליהן; למי שהיא נוטה — שפטו בו מן הסעד, הנחס והממוזג" — עמ׳ 101-102.)';

  let branch, positive, outputHebrew, clientSafeHebrew;

  if (fortune7 === 'nahs') {
    branch = 'loss';
    positive = false;
    outputHebrew = 'בית 7 (ארץ היעד) מזיק — "המסחר מפסיד" (כשף עמ׳ 239). הפסוק אינו מתנה ענף זה בעדות; הפסק חל ללא תלות בבתים 9/5.';
    clientSafeHebrew = 'סימן בלוח מראה הפסד בנסיעת העסקים.';
  } else if (fortune7 === 'saad' && fortune9 === 'saad' && fortune5 === 'saad') {
    branch = 'profit';
    positive = true;
    outputHebrew = 'בית 7 מיטיב, ושני עדיו (בית 9 ובית 5) מיטיבים ללא מחלוקת — "מרוויח במסחרו וחוזר בשלום" (כשף עמ׳ 239).';
    clientSafeHebrew = 'סימן בלוח מראה רווח בנסיעת העסקים וחזרה בשלום.';
  } else if (fortune7 === 'saad' && (fortune9 === 'saad') !== (fortune5 === 'saad')) {
    // Exactly one of the two witnesses is benefic — a genuine disagreement
    // per "اختلافهما", since they do not agree on whether to confirm H7.
    const combined95 = combineRamlFigures(p9, p5);
    const pattern95 = combined95?.resultPattern || null;
    branch = 'unresolved-disagreeing-witnesses';
    positive = null;
    outputHebrew = `בית 7 מיטיב, אך עדיו חלוקים (בית 9: ${fortune9}; בית 5: ${fortune5}). לפי כשף עמ׳ 101-102, במחלוקת עדים יש להוליד צורה משתיהן (${pattern95 || 'לא ניתן לחשב'}) ולשפוט לפי מי שהיא "נוטה" אליו מבין שני העדים — אך פעולת ה"נטייה" הזו אינה מוגדרת תפעולית בשום מקום בספר (אותו מונח לא-פתור כמו "مال إلى" בכלל הממון המותר/האסור, עמ׳ 182). הצורה הנולדת מוצגת כעדות שהנוהל מן המקור בוצע, אך אין בכך כדי להכריע — אין פסק רווח.`;
    clientSafeHebrew = 'עדי הלוח חלוקים בעניין רווח נסיעת העסקים, והמקור אינו נותן כאן דרך ודאית להכריע ביניהם — אין פסק חד-משמעי.';
  } else if (fortune7 === 'saad') {
    branch = 'unresolved-no-confirming-witness';
    positive = null;
    outputHebrew = `בית 7 מיטיב, אך שני עדיו (בית 9: ${fortune9 || 'לא ידוע'}; בית 5: ${fortune5 || 'לא ידוע'}) מסכימים ביניהם שאינם מיטיבים — המקור דורש עד מיטיב לפסק הרווח המפורש, ותנאי זה אינו מתקיים כאן. אין פסק רווח; הפסק השלילי גם הוא אינו חל, כי הוא מותנה במפורש בבית 7 מזיק, וזה אינו המצב.`;
    clientSafeHebrew = 'יש בלוח סימן חיובי חלקי, אך בלי האישור הנוסף שהמקור דורש לפסק רווח ודאי.';
  } else {
    branch = 'unresolved-mixed-h7';
    positive = null;
    outputHebrew = 'צורת בית 7 ממוזגת — המקור אינו נותן כאן פסק לצורה ממוזגת; אין לפסוק רווח או הפסד.';
    clientSafeHebrew = 'אין בלוח סימן מכריע לרווח או הפסד בנסיעת העסקים.';
  }

  return {
    sourceRef, sourceText,
    housesUsed: [7, 9, 5],
    h7Pattern: p7, h9Pattern: p9, h5Pattern: p5,
    branch, positive,
    outputHebrew, clientSafeHebrew,
  };
}

const CUSTOM_EXECUTORS = Object.freeze({
  'enemy.p271.h1vsH12': computeEnemyPresenceH1H12P271,
  'illness.p197.h1h8ElementHumor': computeIllnessHumorH1H8P197,
  'friends.p263.h1h11': computeFriendshipH1H11P263,
  'fear.p273.punishmentSigns': computePunishmentFearP273,
  'travel.p240.roadCautionsH9H7': computeTravelRoadCautionsP240,
  'dream.p254.h9AndTransit': computeDreamH9AndOccurrencesP254,
  'state.p265.h1h2h9h15': computeStateContinuityFirstClauseP265,
  'travel.p236.timeSelectionH9H4': computeProposedTravelTimeP236,
  'theft.p224.recoveryH8': computeTheftRecoveryH8P224,
  'profession.p254.h9Planet': computeProfessionP254,
  'pregnancy.p191-192.miscarriageRedH7NakisH8': computeMiscarriageRedH7NakisH8P191P192,
  'pregnancy.p191.deliveryDifficultyH1H5H15': computeDeliveryDifficultyP191,
  'money.p182.h2h10Outlook': computeMoneyGeneralConditionP182,
  'money.p180.livelihoodH10Invert': computeLivelihoodP180,
  'money.p181.recast25811': computeMoneyAcquireP181,
  'career.p266.returnToOffice': computeReturnToOfficeP266,
  'missing.p248-249.lifeH1H4H9Outcome': computeMissingLifeStatusP248P249,
  'child.p194.healthTrajectoryH6H8': computeChildHealthTrajectoryP194,
  'siblings.p182.seniority': computeSiblingSeniorityP182,
  'marriage.p211.dissolutionH7StateMatrix': computeMarriageDissolutionP211,
  'missing.p249.returnAnglesJudge': computeMissingReturnP249,
  'pregnancy.p191.childSafetyH1H6H8': computeChildSafetyP191,
  'lifespan.p264.stagesH11H9H7': computeLifespanStagesP264,
  'travel.p244.returnH1H2H9': computeTravelerReturnP244,
  'marriage.p210.generalMarriageH1H2H7H8H10Judge': computeMarriageSuitabilityP210,
  'general.p174.h1h2h4h7h10h15': computeGeneralStateP174,
  'money.p179.sourceByIncomingHonorHouse': computeMoneySourceP179,
  'dhamir.p159.subjectByH6Recurrence': computeQuestionSubjectByH6P159,
  'spiritual.p167.hiddenActionAirRows46815': computeHiddenActionP167,
  'spiritual.p167.querentCastsSorceryMizan': computeQuerentCastsSorceryP167,
  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,
  'desire.p206.querentWantsH7H11ThenH5': computeQuerentWantsMatterP206,
  'clothing.p264-265.luck': computeClothingLuckP265,
  'relocation.p183.stayMoveH1H2': computeRelocationStayMoveH1H2,
  'dispute.p212.reconciliationH1H7': computeDisputeReconciliationP212,
  'partnership.p212.compatibilityH1H7H5H7': computePartnershipCompatibilityP212,
  'religion.p253.h3h9Quality': computeReligionQualityP253,
  'matter.p172.h17_h1011_thenCombine': computeMatterOutcomeP172,
  'relocation.p183.currentVsNewPlace': computeRelocationCurrentVsNewP183,
  'illness.p196.outcomeH15': computeIllnessRecoveryP196,
  'hidden.p188.isStillThere': computeHiddenStillThereP188,
  'hidden.p188.quarterDirection': computeQuarterDirectionP188,
  'lostItem.p202.returnH6H8': computeLostItemReturnP202,
  'marriage.p204.previousStatusH7inH10': computeMarriagePreviousStatusP204,
  'love.p204.attentionFireRows1713': computeLoveAttentionP204,
  'hope.p267.fulfillment': computeHopeHouse11FallbackP267,
  'gift.p193.h5Quality': computeSpecifiedGiftQualityH5P193,
  'travel.p243-244.vesselH1Signs': computeVesselH1SignsP243P244,
  'family.p184.fatherMoneyH5': computeFatherMoneySignH5P184,
  'property.p184.landOwnershipH4': computeLandOwnershipSignH4P184,
  'dispute.p212.winnerH1': computeDisputeWinnerH1P212,
  'prisoner.p272-273.rapidExitH11WithH5Caution': computePrisonerRapidExitP272P273,
  'missing.p249.departedCityH7': computeMissingDepartedCityH7P249,
  'hope.p174.h5h11ThroughH1': computeHopeThroughTwoIntermediatesP174,
  'request.p176.h1h2GateThenH1H4': computeRequestGateAndOutcomeP176,
  'intent.p176.h7h10': computePersonPurposeSignP176,
  'marriage.p204.dowryH8': computeDowryH8P204,
  'theft.p225.thiefDescriptionH7': computeThiefDescriptionP225,
  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,
  'pregnancy.p191.genderH5': computePregnancyGenderP191,
  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,
  'authority.p256.honorConditionH10Planet': computeHonorConditionP256,
  'authority.p257.appointmentH1H10Planet': computeAppointmentCompletionP257,
  'authority.p257.rulerConditionH7H10': computeRulerConditionP257,
  'mother.p257.statusDayNight': computeMotherNightWhiteRoadP257,
  'marriage.p205.modestyPurity': computeMarriageChastityPurityP205,
  'travel.p239.profitH7Witness': computeTravelProfitH7WitnessP239,
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

export function executeCanonicalCustomMethod(kashfMethodId, board, clientContext = {}) {
  const executor = CUSTOM_EXECUTORS[kashfMethodId];
  if (typeof executor !== 'function') {
    const error = new Error(`No approved canonical custom executor for ${kashfMethodId}`);
    error.code = 'KASHF_CANONICAL_CUSTOM_EXECUTOR_NOT_APPROVED';
    throw error;
  }

  return executor(toLegacyChart(board), clientContext);
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
