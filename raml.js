// גורל החול — מנוע בסיס ראשון
// לא קשור לגורל העשיריות.
// כאן אנחנו בונים מנוע נפרד לגמרי לפי שיטת הרמל / Geomantic Shield.

let RAML_FORMS_BASIC = {};
try {
  ({ RAML_FORMS_BASIC } = require("./raml-data/raml-forms-basic.js"));
} catch (e) {
  RAML_FORMS_BASIC = {};
}

if (
  typeof window !== "undefined" &&
  window.RAML_FORMS_BASIC &&
  Object.keys(RAML_FORMS_BASIC).length === 0
) {
  RAML_FORMS_BASIC = window.RAML_FORMS_BASIC;
}


let RAML_HOUSES_BASIC = {};
try {
  ({ RAML_HOUSES_BASIC } = require("./raml-data/raml-houses-basic.js"));
} catch (e) {
  RAML_HOUSES_BASIC = {};
}

if (
  typeof window !== "undefined" &&
  window.RAML_HOUSES_BASIC &&
  Object.keys(RAML_HOUSES_BASIC).length === 0
) {
  RAML_HOUSES_BASIC = window.RAML_HOUSES_BASIC;
}

const RAML_FIGURES = {
  "1121": { key: "1121", hebrew: "נלחם", arabic: "جودلة / كوسج", meaning: "", fortune: "ממוזג־סעד" },
  "1222": { key: "1222", hebrew: "נשוא ראש", arabic: "الأحيان / الضاحك", meaning: "", fortune: "סעד" },
  "2111": { key: "2111", hebrew: "סף נכנס", arabic: "عتبة داخلة / راية الفرح", meaning: "", fortune: "סעד" },
  "2212": { key: "2212", hebrew: "לבן", arabic: "البياض", meaning: "", fortune: "סעד" },

  "1111": { key: "1111", hebrew: "דרך", arabic: "الطريق", meaning: "", fortune: "ממוזג־סעד" },
  "1212": { key: "1212", hebrew: "ממון יוצא", arabic: "القبض الخارج", meaning: "", fortune: "נחס" },
  "2122": { key: "2122", hebrew: "אדום", arabic: "الحمرة", meaning: "", fortune: "נחס" },
  "2221": { key: "2221", hebrew: "שפל ראש", arabic: "الأنكيس / المنكوس", meaning: "", fortune: "נחס" },

  "1122": { key: "1122", hebrew: "כבוד יוצא", arabic: "نصرة خارجية / الجواد", meaning: "", fortune: "סעד" },
  "1221": { key: "1221", hebrew: "סוהר", arabic: "العقلة / الشقاوة", meaning: "", fortune: "ממוזג־נחס" },
  "2112": { key: "2112", hebrew: "חיבור", arabic: "الاجتماع", meaning: "", fortune: "ממוזג־סעד" },
  "2211": { key: "2211", hebrew: "כבוד נכנס", arabic: "نصرة داخلة / النصير", meaning: "", fortune: "סעד" },

  "1112": { key: "1112", hebrew: "סף יוצא", arabic: "عتبة خارجة", meaning: "", fortune: "נחס" },
  "1211": { key: "1211", hebrew: "בר הלחי", arabic: "نقي الخد / الأشقر", meaning: "", fortune: "ממוזג־נחס" },
  "2121": { key: "2121", hebrew: "ממון נכנס", arabic: "القبض الداخل", meaning: "", fortune: "סעד" },
  "2222": { key: "2222", hebrew: "קהלה", arabic: "الجماعة", meaning: "", fortune: "ממוזג" },
};

// מיזוג קובץ הידע הבסיסי לתוך הצורות של המנוע
// המנוע נשאר אחראי לחישוב; קובץ הידע אחראי למידע לימודי/פרשני.
for (const key of Object.keys(RAML_FORMS_BASIC || {})) {
  RAML_FIGURES[key] = {
    ...(RAML_FIGURES[key] || {}),
    ...RAML_FORMS_BASIC[key],
    key
  };
}


// 1 = נקודה אחת
// 2 = שתי נקודות / קו
function ramlNormalizeLine(value) {
  return Number(value) === 2 ? 2 : 1;
}

function ramlFigureKey(fig) {
  return fig.map(ramlNormalizeLine).join("");
}

function ramlFigureInfo(fig) {
  const key = ramlFigureKey(fig);
  return RAML_FIGURES[key] || {
    key,
    hebrew: "צורה לא מזוהה",
    arabic: "",
    meaning: ""
  };
}

// חיבור שתי צורות:
// אם סכום השורה זוגי → 2
// אם סכום השורה אי־זוגי → 1
function ramlCombine(a, b) {
  return [0, 1, 2, 3].map(i => {
    const sum = ramlNormalizeLine(a[i]) + ramlNormalizeLine(b[i]);
    return sum % 2 === 0 ? 2 : 1;
  });
}

// מקבל ארבע אמהות ומוליד את כל לוח גורל החול
function ramlBuildShield(mothers) {
  if (!Array.isArray(mothers) || mothers.length !== 4) {
    throw new Error("צריך להזין בדיוק 4 אמהות.");
  }

  const m = mothers.map(fig => {
    if (!Array.isArray(fig) || fig.length !== 4) {
      throw new Error("כל אם חייבת להיות צורה של 4 שורות.");
    }
    return fig.map(ramlNormalizeLine);
  });

  // 1–4 אמהות
  const h1 = m[0];
  const h2 = m[1];
  const h3 = m[2];
  const h4 = m[3];

  // 5–8 בנות:
  // בת 1 = שורה ראשונה של כל ארבע האמהות
  // בת 2 = שורה שנייה של כל ארבע האמהות
  // וכן הלאה
  const h5 = [h1[0], h2[0], h3[0], h4[0]];
  const h6 = [h1[1], h2[1], h3[1], h4[1]];
  const h7 = [h1[2], h2[2], h3[2], h4[2]];
  const h8 = [h1[3], h2[3], h3[3], h4[3]];

  // 9–12 נכדות / אחייניות
  const h9 = ramlCombine(h1, h2);
  const h10 = ramlCombine(h3, h4);
  const h11 = ramlCombine(h5, h6);
  const h12 = ramlCombine(h7, h8);

  // 13–14 עדים
  const h13 = ramlCombine(h9, h10);
  const h14 = ramlCombine(h11, h12);

  // 15 שופט
  const h15 = ramlCombine(h13, h14);

  // 16 משפט / תוצאה סופית
  const h16 = ramlCombine(h15, h1);

  const houses = [
    h1, h2, h3, h4,
    h5, h6, h7, h8,
    h9, h10, h11, h12,
    h13, h14, h15, h16
  ];

  return houses.map((fig, index) => ({
    house: index + 1,
    figure: fig,
    key: ramlFigureKey(fig),
    ...ramlFigureInfo(fig)
  }));
}

// בדיקה מהירה לדוגמה
function ramlDemo() {
  const mothers = [
    [2, 2, 1, 2],
    [1, 2, 1, 2],
    [1, 1, 2, 2],
    [2, 1, 2, 1],
  ];

  return ramlBuildShield(mothers);
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_FIGURES,
    ramlNormalizeLine,
    ramlFigureKey,
    ramlFigureInfo,
    ramlCombine,
    ramlBuildShield,
    ramlDemo
  };
}

// מחזיר את הלוח מחולק לקבוצות תצוגה לאפליקציה
function ramlGroupShield(chart) {
  const groups = [
    { id: "mothers", title: "האמהות", from: 1, to: 4 },
    { id: "daughters", title: "הבנות", from: 5, to: 8 },
    { id: "granddaughters", title: "הנכדות / בנות הבנות", from: 9, to: 12 },
    { id: "witnesses", title: "העדים", from: 13, to: 14 },
    { id: "judge", title: "השופט", from: 15, to: 15 },
    { id: "sentence", title: "המשפט / התוצאה הסופית", from: 16, to: 16 },
  ];

  return groups.map(group => ({
    ...group,
    houses: chart.filter(h => h.house >= group.from && h.house <= group.to)
  }));
}

function ramlDrawFigureText(fig) {
  return fig.map(v => Number(v) === 1 ? "•" : "• •");
}

if (typeof module !== "undefined") {
  module.exports.ramlGroupShield = ramlGroupShield;
  module.exports.ramlDrawFigureText = ramlDrawFigureText;
}

// יצירת צורת רמל אקראית — לבדיקה ראשונית בלבד
function ramlRandomFigure() {
  return [0, 1, 2, 3].map(() => Math.random() < 0.5 ? 1 : 2);
}

function ramlRandomMothers() {
  return [
    ramlRandomFigure(),
    ramlRandomFigure(),
    ramlRandomFigure(),
    ramlRandomFigure(),
  ];
}

function ramlRandomChart() {
  const mothers = ramlRandomMothers();
  const chart = ramlBuildShield(mothers);
  return {
    mothers,
    chart,
    groups: ramlGroupShield(chart)
  };
}

if (typeof module !== "undefined") {
  module.exports.ramlRandomFigure = ramlRandomFigure;
  module.exports.ramlRandomMothers = ramlRandomMothers;
  module.exports.ramlRandomChart = ramlRandomChart;
}

// שלב 1 — מבנה ידע מורחב לצורות גורל החול
// כאן לא משנים את המנוע. רק מכינים מקום לידע שנכניס בהמשך מתוך הספר.

const RAML_FIGURE_FIELDS = [
  "key",
  "hebrew",
  "arabic",
  "pattern",
  "element",
  "nature",
  "fortune",
  "gender",
  "movement",
  "basicMeaning",
  "bookNotes"
];

function ramlGetFigureProfile(key) {
  const base = RAML_FIGURES[key];

  if (!base) {
    return {
      key,
      hebrew: "צורה לא מזוהה",
      arabic: "",
      pattern: key,
      element: "",
      nature: "",
      fortune: "",
      gender: "",
      movement: "",
      basicMeaning: "",
      bookNotes: ""
    };
  }

  return {
    key: base.key,
    hebrew: base.hebrew || "",
    arabic: base.arabic || "",
    pattern: base.key,
    element: base.element || "",
    nature: base.nature || "",
    fortune: base.fortune || "",
    gender: base.gender || "",
    movement: base.movement || "",
    basicMeaning: base.meaning || "",
    bookNotes: base.bookNotes || ""
  };
}

function ramlListFigureProfiles() {
  return Object.keys(RAML_FIGURES)
    .sort()
    .map(key => ramlGetFigureProfile(key));
}

if (typeof module !== "undefined") {
  module.exports.RAML_FIGURE_FIELDS = RAML_FIGURE_FIELDS;
  module.exports.ramlGetFigureProfile = ramlGetFigureProfile;
  module.exports.ramlListFigureProfiles = ramlListFigureProfiles;
}

// שמות 16 הבתים בגורל החול
const RAML_HOUSES = Object.keys(RAML_HOUSES_BASIC || {}).length
  ? RAML_HOUSES_BASIC
  : {
  1:  { number: 1,  hebrew: "בית החיים", arabic: "بيت الحياة", role: "השואל, הגוף, החיים, מצב האדם" },
  2:  { number: 2,  hebrew: "בית הממון", arabic: "بيت المال", role: "ממון, רכוש, פרנסה, מה שיש לאדם" },
  3:  { number: 3,  hebrew: "בית האחים", arabic: "بيت الإخوة", role: "אחים, קרובים, תנועה קרובה, מסרים" },
  4:  { number: 4,  hebrew: "בית ההורים", arabic: "بيت الوالدين", role: "אב, אם, בית, שורש, קרקע" },
  5:  { number: 5,  hebrew: "בית הבנים", arabic: "بيت الأولاد", role: "ילדים, פרי, תוצאה יוצאת" },
  6:  { number: 6,  hebrew: "בית המחלות", arabic: "بيت الأمراض", role: "חולי, חולשה, משרתים, קושי יומי" },
  7:  { number: 7,  hebrew: "בית הזוגיות", arabic: "بيت الزواج", role: "זוגיות, שותפות, הצד שמול השואל" },
  8:  { number: 8,  hebrew: "בית המוות", arabic: "بيت الموت", role: "סוף, פחד, אובדן, שינוי כבד" },
  9:  { number: 9,  hebrew: "בית הנסיעה", arabic: "بيت السفر", role: "דרך רחוקה, נסיעה, לימוד, חוץ" },
  10: { number: 10, hebrew: "בית הכבוד והרוממות", arabic: "بيت العز والرفعة", role: "מעמד, כבוד, הצלחה ציבורית" },
  11: { number: 11, hebrew: "בית התקווה והמשאלות", arabic: "بيت الرجاء والآمال", role: "תקוות, משאלות, עזרה, רווח" },
  12: { number: 12, hebrew: "בית האויבים", arabic: "بيت الأعداء", role: "אויבים, הסתרה, פחדים, מניעות" },
  13: { number: 13, hebrew: "עד ראשון / בית השואל", arabic: "الشاهد الأول / بيت السائل", role: "עד ראשון, מצב השואל, התחלה / עבר / הצד של השואל" },
  14: { number: 14, hebrew: "עד שני / בית הנשאל עליו", arabic: "الشاهد الثاني / بيت المسؤول عنه", role: "עד שני, הדבר הנשאל, הצד שמול השואל" },
  15: { number: 15, hebrew: "השופט", arabic: "الحاكم", role: "הכרעה, תשובה מרכזית, דין הקריאה" },
  16: { number: 16, hebrew: "המשפט / אחרית הדבר", arabic: "العاقبة", role: "אחרית הדבר, תוצאה סופית, השפעת הדין" }
};

function ramlGetHouseInfo(houseNumber) {
  return RAML_HOUSES[houseNumber] || {
    hebrew: "",
    arabic: "",
    role: ""
  };
}

function ramlAttachHouseInfo(chart) {
  return chart.map(h => ({
    ...h,
    houseHebrew: ramlGetHouseInfo(h.house).hebrew,
    houseArabic: ramlGetHouseInfo(h.house).arabic,
    houseRole: ramlGetHouseInfo(h.house).role
  }));
}

if (typeof module !== "undefined") {
  module.exports.RAML_HOUSES = RAML_HOUSES;
  module.exports.ramlGetHouseInfo = ramlGetHouseInfo;
  module.exports.ramlAttachHouseInfo = ramlAttachHouseInfo;
}

// שלב 2 — נושאי שאלות בגורל החול
// זה עדיין לא פירוש מלא. זו רק שכבת מיון ראשונית לפי נושאי השאלה.
// כללים מיוחדים כמו נישואין, אבדה, אסיר, חולי וכו׳ ימולאו בהמשך מתוך הספר.

const RAML_QUESTION_TOPICS = {
  generalCondition: {
    id: "generalCondition",
    hebrew: "מצב כללי של אדם",
    arabic: "حال المطلوب",
    focusHouse: 1,
    keywords: ["מצב", "מה מצבו", "אדם", "פלוני", "מה קורה עם"],
    needsSpecialRule: false,
    notes: "שאלה כללית על מצב האדם."
  },

  success: {
    id: "success",
    hebrew: "הצלחה בדבר",
    arabic: "النجاح في الأمر",
    focusHouse: 10,
    keywords: ["האם אצליח", "הצלחה", "יצליח", "האם יצליח", "האם הדבר יצליח"],
    needsSpecialRule: true,
    notes: "יש לבדוק בהמשך לפי דיני ההצלחה והבית המתאים לשאלה."
  },

  moneyProfitLoss: {
    id: "moneyProfitLoss",
    hebrew: "רווח או הפסד",
    arabic: "الكسب أو الخسارة",
    focusHouse: 2,
    keywords: ["כסף", "רווח", "הפסד", "ארוויח", "מניות", "עסק", "השקעה", "פרנסה"],
    needsSpecialRule: true,
    notes: "קשור לבית הממון, ובהמשך נוסיף כללי רווח/הפסד."
  },

  travel: {
    id: "travel",
    hebrew: "נסיעה / דרך",
    arabic: "السفر",
    focusHouse: 9,
    keywords: ["נסיעה", "לטוס", "לטייל", "דרך", "חו״ל", "מדינה רחוקה", "מסע"],
    needsSpecialRule: true,
    notes: "קשור לבית הנסיעה."
  },

  absentReturn: {
    id: "absentReturn",
    hebrew: "חזרת נעדר / רחוק",
    arabic: "عودة الغائب",
    focusHouse: 9,
    keywords: ["יחזור", "נעדר", "רחוק", "חזרת", "אדם רחוק", "מתי יחזור"],
    needsSpecialRule: true,
    notes: "דורש כלל מיוחד לחזרת נעדר."
  },

  stolenLostObject: {
    id: "stolenLostObject",
    hebrew: "אבדה / גניבה",
    arabic: "المسروق أو المفقود",
    focusHouse: 2,
    keywords: ["אבדה", "אבד", "גניבה", "נגנב", "אמצא", "חפץ", "רכוש"],
    needsSpecialRule: true,
    notes: "דורש כללי אבדה/גניבה. לא להסתפק בבית 2 בלבד."
  },

  friendTrust: {
    id: "friendTrust",
    hebrew: "נאמנות חבר / אדם קרוב",
    arabic: "وفاء الصاحب",
    focusHouse: 11,
    keywords: ["חבר", "סומך", "נאמן", "בוגד", "אמין", "אפשר לסמוך"],
    needsSpecialRule: true,
    notes: "דורש בדיקת יחס בין השואל לאדם הנשאל."
  },

  love: {
    id: "love",
    hebrew: "אהבה",
    arabic: "المحبة",
    focusHouse: 7,
    keywords: ["אהבה", "אוהב", "אוהבת", "רגשות", "לב", "האם הוא אוהב", "האם היא אוהבת"],
    needsSpecialRule: true,
    notes: "קשור לבית הזוגיות, ובהמשך נוסיף כללי אהבה."
  },

  marriage: {
    id: "marriage",
    hebrew: "נישואין / זיווג",
    arabic: "الزواج",
    focusHouse: 7,
    keywords: ["נישואין", "חתונה", "להתחתן", "זיווג", "אישה", "בעל", "בן זוג", "בת זוג"],
    needsSpecialRule: true,
    notes: "דורש דיני נישואין מיוחדים מהספר."
  },

  spouseDescription: {
    id: "spouseDescription",
    hebrew: "תיאור בן/בת זוג",
    arabic: "صفة الزوج أو الزوجة",
    focusHouse: 7,
    keywords: ["איך יהיה הבעל", "איך תהיה האישה", "תכונת בן זוג", "תכונת בת זוג", "מי הזיווג"],
    needsSpecialRule: true,
    notes: "שאלת תיאור, לא רק כן/לא."
  },

  childGender: {
    id: "childGender",
    hebrew: "זכר או נקבה בלידה",
    arabic: "ذكر أم أنثى",
    focusHouse: 5,
    keywords: ["בן או בת", "זכר", "נקבה", "ילד", "ילדה", "הריון", "לידה"],
    needsSpecialRule: true,
    notes: "קשור לבית הבנים, אבל דורש כלל מין הוולד."
  },

  illnessHealing: {
    id: "illnessHealing",
    hebrew: "חולי ורפואה",
    arabic: "شفاء المريض",
    focusHouse: 6,
    keywords: ["חולה", "מחלה", "יתרפא", "בריאות", "רפואה", "החלמה"],
    needsSpecialRule: true,
    notes: "קשור לבית המחלות ודורש דיני חולי."
  },

  prisonerFreedom: {
    id: "prisonerFreedom",
    hebrew: "אסיר / יציאה ממאסר",
    arabic: "خلاص الأسير أو المسجون",
    focusHouse: 12,
    keywords: ["אסיר", "כלא", "מאסר", "ישתחרר", "שחרור", "כלוא"],
    needsSpecialRule: true,
    notes: "דורש כלל מיוחד לאסיר/כלוא."
  },

  dailyLuck: {
    id: "dailyLuck",
    hebrew: "מזל היום",
    arabic: "سعد اليوم أو نحسه",
    focusHouse: 16,
    keywords: ["היום", "מזל היום", "האם היום טוב", "האם זה יום טוב"],
    needsSpecialRule: true,
    notes: "שאלה על מזל היום ודורשת דין מיוחד."
  },

  dream: {
    id: "dream",
    hebrew: "פירוש חלום",
    arabic: "تفسير الرؤيا",
    focusHouse: 9,
    keywords: ["חלום", "חלמתי", "פירוש חלום", "רؤיה"],
    needsSpecialRule: true,
    notes: "דורש כללי פירוש חלום, לא לפרש חופשי."
  }
};

function ramlDetectQuestionTopic(question) {
  const q = String(question || "").trim();

  if (!q) {
    return RAML_QUESTION_TOPICS.generalCondition;
  }

  for (const topic of Object.values(RAML_QUESTION_TOPICS)) {
    if (topic.keywords.some(k => q.includes(k))) {
      return topic;
    }
  }

  return RAML_QUESTION_TOPICS.generalCondition;
}

function ramlGetFocusHouse(question) {
  const topic = ramlDetectQuestionTopic(question);
  return {
    topic,
    house: topic.focusHouse,
    houseInfo: ramlGetHouseInfo(topic.focusHouse)
  };
}

if (typeof module !== "undefined") {
  module.exports.RAML_QUESTION_TOPICS = RAML_QUESTION_TOPICS;
  module.exports.ramlDetectQuestionTopic = ramlDetectQuestionTopic;
  module.exports.ramlGetFocusHouse = ramlGetFocusHouse;
}

// הרצת קריאה בסיסית של גורל החול
// עדיין בלי פירוש עומק — רק איסוף כל הנתונים המרכזיים לקריאה.
function ramlRunReading(question, mothers) {
  const topicResult = ramlGetFocusHouse(question);
  const chart = ramlBuildShield(mothers);
  const chartWithHouses = ramlAttachHouseInfo(chart);
  const groups = ramlGroupShield(chartWithHouses);

  const focusHouse = chartWithHouses.find(h => h.house === topicResult.house);
  const judge = chartWithHouses.find(h => h.house === 15);
  const sentence = chartWithHouses.find(h => h.house === 16);

  return {
    question: String(question || "").trim(),
    topic: topicResult.topic,
    focusHouseNumber: topicResult.house,
    focusHouseInfo: topicResult.houseInfo,
    focusHouse,
    judge,
    sentence,
    mothers,
    chart: chartWithHouses,
    groups,
    note: "קריאה בסיסית בלבד: זיהוי נושא, בית מרכזי, שופט ומשפט. פירוש עומק יתווסף בהמשך לפי הספר."
  };
}

function ramlRunRandomReading(question) {
  const mothers = ramlRandomMothers();
  return ramlRunReading(question, mothers);
}

if (typeof module !== "undefined") {
  module.exports.ramlRunReading = ramlRunReading;
  module.exports.ramlRunRandomReading = ramlRunRandomReading;
}

// סיכום טכני לקריאת גורל החול
// זה לא פירוש עומק ולא פסיקה. רק מציג את נתוני הקריאה בצורה ברורה.
function ramlBuildReadingSummary(reading) {
  if (!reading) {
    return "לא נוצרה קריאה.";
  }

  const focus = reading.focusHouse;
  const judge = reading.judge;
  const sentence = reading.sentence;

  const lines = [];

  lines.push(`השאלה: ${reading.question || "לא צוינה שאלה"}`);
  lines.push(`נושא השאלה: ${reading.topic?.hebrew || ""}`);
  lines.push(`הבית המרכזי לקריאה: בית ${reading.focusHouseNumber} — ${reading.focusHouseInfo?.hebrew || ""}`);

  if (focus) {
    lines.push(`בבית המרכזי נפלה הצורה: ${focus.hebrew} (${focus.key}) — ${focus.statusHebrew || focus.fortune || "ללא סיווג"}, ${focus.movement || "ללא תנועה"}, טבע ${focus.element || "לא ידוע"}`);
  }

  if (judge) {
    lines.push(`השופט: ${judge.hebrew} (${judge.key}) — ${judge.statusHebrew || judge.fortune || "ללא סיווג"}, ${judge.movement || "ללא תנועה"}, טבע ${judge.element || "לא ידוע"}`);
  }

  if (sentence) {
    lines.push(`המשפט / התוצאה הסופית: ${sentence.hebrew} (${sentence.key}) — ${sentence.statusHebrew || sentence.fortune || "ללא סיווג"}, ${sentence.movement || "ללא תנועה"}, טבע ${sentence.element || "לא ידוע"}`);
  }

  const diagnosis = ramlBuildInitialDiagnosis(reading);
  lines.push(`${diagnosis.title}`);
  lines.push(diagnosis.text);
  lines.push("הערה: זהו אבחון ראשוני בלבד. פירוש עומק יתווסף בהמשך לפי כללי הספר.");

  return lines.join("\n");
}

function ramlRunRandomReadingSummary(question) {
  const reading = ramlRunRandomReading(question);
  return {
    reading,
    summary: ramlBuildReadingSummary(reading)
  };
}

if (typeof module !== "undefined") {
  module.exports.ramlBuildReadingSummary = ramlBuildReadingSummary;
  module.exports.ramlRunRandomReadingSummary = ramlRunRandomReadingSummary;
}

// אבחון ראשוני בלבד לפי סעד / נחס / ממוזג
// זה לא מחליף את דיני הספר. זה רק נותן תמונת מצב ראשונית.
function ramlNormalizeFortune(fortune, statusHebrew) {
  const status = String(statusHebrew || "").trim();

  if (status === "טוב") return "good";
  if (status === "רע") return "bad";
  if (status === "נטייה לטוב") return "mixed_good";
  if (status === "נטייה לרע") return "mixed_bad";
  if (status === "ביניים") return "mixed";

  // תמיכה לאחור בערכי המקור הישנים, שלא נאבד תאימות
  const f = String(fortune || "");
  if (f.includes("ממוזג") && f.includes("סעד")) return "mixed_good";
  if (f.includes("ממוזג") && f.includes("נחס")) return "mixed_bad";
  if (f.includes("ממוזג")) return "mixed";
  if (f.includes("סעד")) return "good";
  if (f.includes("נחס")) return "bad";
  return "unknown";
}

function ramlBuildInitialDiagnosis(reading) {
  if (!reading || !reading.focusHouse || !reading.judge || !reading.sentence) {
    return {
      title: "אבחון ראשוני: לא זמין",
      text: "אין מספיק נתונים לבניית אבחון ראשוני."
    };
  }

  const focus = ramlNormalizeFortune(reading.focusHouse.fortune, reading.focusHouse.statusHebrew);
  const judge = ramlNormalizeFortune(reading.judge.fortune, reading.judge.statusHebrew);
  const sentence = ramlNormalizeFortune(reading.sentence.fortune, reading.sentence.statusHebrew);

  const values = [focus, judge, sentence];

  if (values.includes("mixed") || values.includes("mixed_good") || values.includes("mixed_bad")) {
    return {
      title: "אבחון ראשוני: מצב לא מוכרע",
      text: "אחת או יותר מן הצורות נמצאת במצב ביניים או נטייה. זה מצב שאינו מוכרע לגמרי לטוב או לרע, ויש לבדוק לפי הבית, השאלה, השופט והמשפט."
    };
  }

  const goodCount = values.filter(v => v === "good").length;
  const badCount = values.filter(v => v === "bad").length;

  if (goodCount > badCount) {
    return {
      title: "אבחון ראשוני: נטייה לטוב",
      text: "רוב הסימנים הראשוניים נוטים לטוב. זו נטייה ראשונית בלבד, לפני בדיקת דיני הפירוש המלאים."
    };
  }

  if (badCount > goodCount) {
    return {
      title: "אבחון ראשוני: נטייה לרע",
      text: "רוב הסימנים הראשוניים נוטים לרע. זו נטייה ראשונית בלבד, לפני בדיקת דיני הפירוש המלאים."
    };
  }

  return {
    title: "אבחון ראשוני: מאוזן",
    text: "הסימנים הראשוניים מאוזנים, ולכן צריך להכריע לפי הבית המרכזי, השופט, המשפט ודיני השאלה."
  };
}


if (typeof module !== "undefined") {
  module.exports.ramlNormalizeFortune = ramlNormalizeFortune;
  module.exports.ramlBuildInitialDiagnosis = ramlBuildInitialDiagnosis;
}

// לפי باب للخارج والداخل والمنقلب والثابت בספר הראשי בלבד
// 1 = נקודה יחידה / فرد
// 2 = זוג / زوج
function ramlGetMovementFromKey(key) {
  const k = String(key || "");
  const first = k[0];
  const last = k[k.length - 1];

  if (first === "1" && last === "1") {
    return {
      movement: "מתהפך",
      arabic: "منقلب",
      element: "אוויר"
    };
  }

  if (first === "2" && last === "2") {
    return {
      movement: "קבוע",
      arabic: "ثابت",
      element: "עפר"
    };
  }

  if (first === "1" && last === "2") {
    return {
      movement: "חיצוני",
      arabic: "خارج",
      element: "אש"
    };
  }

  if (first === "2" && last === "1") {
    return {
      movement: "פנימי",
      arabic: "داخل",
      element: "מים"
    };
  }

  return {
    movement: "",
    arabic: "",
    element: ""
  };
}

function ramlApplyMovementAndElementToFigures() {
  for (const key of Object.keys(RAML_FIGURES)) {
    const info = ramlGetMovementFromKey(key);
    RAML_FIGURES[key].movement = info.movement;
    RAML_FIGURES[key].movementArabic = info.arabic;
    RAML_FIGURES[key].movementElement = info.element;
    if (!RAML_FIGURES[key].element) RAML_FIGURES[key].element = info.element;
  }

  return RAML_FIGURES;
}

ramlApplyMovementAndElementToFigures();

if (typeof module !== "undefined") {
  module.exports.ramlGetMovementFromKey = ramlGetMovementFromKey;
  module.exports.ramlApplyMovementAndElementToFigures = ramlApplyMovementAndElementToFigures;
}

// יצירת צורה לפי ספירת נקודות, לפי הספר:
// אם מספר הנקודות אי־זוגי — נקודה אחת.
// אם מספר הנקודות זוגי — קו / שתי נקודות.
function ramlLineFromPointCount(count) {
  const n = Math.abs(Number(count || 0));
  if (!Number.isFinite(n) || n === 0) {
    throw new Error("ספירת נקודות חייבת להיות מספר חיובי.");
  }

  return n % 2 === 0 ? 2 : 1;
}

// מקבל 4 ספירות נקודות ומחזיר צורת רמל אחת
function ramlFigureFromPointCounts(counts) {
  if (!Array.isArray(counts) || counts.length !== 4) {
    throw new Error("צריך להזין בדיוק 4 ספירות נקודות לצורה אחת.");
  }

  return counts.map(ramlLineFromPointCount);
}

// מקבל 4 אמהות, כל אם מורכבת מ־4 ספירות נקודות
// דוגמה:
// [
//   [17, 24, 31, 18],
//   [11, 20, 15, 22],
//   [9, 16, 27, 30],
//   [14, 21, 28, 33]
// ]
function ramlMothersFromPointCounts(matrix) {
  if (!Array.isArray(matrix) || matrix.length !== 4) {
    throw new Error("צריך להזין 4 קבוצות של ספירות נקודות — אחת לכל אם.");
  }

  return matrix.map(ramlFigureFromPointCounts);
}

// הרצת קריאה לפי ספירת נקודות אמיתית, לא אקראית
function ramlRunReadingFromPointCounts(question, matrix) {
  const mothers = ramlMothersFromPointCounts(matrix);
  return ramlRunReading(question, mothers);
}

if (typeof module !== "undefined") {
  module.exports.ramlLineFromPointCount = ramlLineFromPointCount;
  module.exports.ramlFigureFromPointCounts = ramlFigureFromPointCounts;
  module.exports.ramlMothersFromPointCounts = ramlMothersFromPointCounts;
  module.exports.ramlRunReadingFromPointCounts = ramlRunReadingFromPointCounts;
}

/* Expose Goral Hachol engine functions to browser */
if (typeof window !== "undefined") {
  window.ramlFigureKey = ramlFigureKey;
  window.ramlFigureInfo = ramlFigureInfo;
  window.ramlRunReading = ramlRunReading;
  window.ramlRunReadingFromPointCounts = ramlRunReadingFromPointCounts;
  window.ramlMothersFromPointCounts = ramlMothersFromPointCounts;
  window.ramlFigureFromPointCounts = ramlFigureFromPointCounts;
  window.ramlBuildReadingSummary = ramlBuildReadingSummary;
  window.ramlBuildInitialDiagnosis = ramlBuildInitialDiagnosis;
}
