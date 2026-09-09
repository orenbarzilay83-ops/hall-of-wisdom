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

// Kashf v57 p167 — hidden/covert action behind the matter.
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
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — צורה מזיקה. לפי כשף v57 עמ׳ 167: יש פעולה מאחורי הדבר. כלל זה אינו קובע שמדובר בכישוף, ג׳ין או עין הרע ואינו מזהה אדם.';
  } else {
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — ' + (classification.saadNahsHebrew || classification.saadNahs || 'ללא סיווג') + '. לפי לשון כשף v57 עמ׳ 167: אם התוצאה אינה מזיקה — אין פעולה מאחורי הדבר לפי כלל זה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 167',
    sourceText: 'אם אמר לך השואל: האם מאחורי הדבר יש פעולה או לא? קח את אוויר הרביעי, אוויר השישי, אוויר השמיני ואוויר המאזן; העמד מהם צורה. אם יצאה צורה מזיקה, הרי הפעולה מאחוריו; ואם לא — לא.',
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

const CUSTOM_EXECUTORS = Object.freeze({
  'profession.p254.h9Planet': computeProfessionP254,
  'pregnancy.p191.deliveryDifficultyH1H5H15': computeDeliveryDifficultyP191,
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
  'spiritual.p167.hiddenActionAirRows46815': computeHiddenActionP167,
  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,
  'desire.p206.querentWantsH7H11ThenH5': computeQuerentWantsMatterP206,
  'clothing.p264-265.luck': computeClothingLuckP265,
  'relocation.p183.stayMoveH1H2': computeRelocationStayMoveH1H2,
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
  'theft.p225.thiefDescriptionH7': computeThiefDescriptionP225,
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
