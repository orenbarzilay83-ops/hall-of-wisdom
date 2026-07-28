// גורל החול — שיוכים אסטרו־רמליים מאומתים
// מקור: חשיפת הסודות הנצורים, עמ' 133–137.
// מדיניות: נתון שלא הוכרע במקור מסומן OPEN ואינו משמש לחישוב אוטומטי.

const RAML_PLANETARY_TEMPERAMENT = {
  sun: {
    hebrew: "שמש",
    arabic: "الشمس",
    figures: ["2121", "1122"], // ממון נכנס, כבוד יוצא
    day: "יום ראשון",
    night: "ליל חמישי",
    letters: ["א", "ג", "ס", "ת"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  venus: {
    hebrew: "נוגה",
    arabic: "الزهرة",
    figures: ["1121"], // נלחם — הכרעת המחבר במחלוקת
    day: "יום שישי",
    night: "ליל שלישי",
    letters: ["ב", "ט", "ע", "ת"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  mercury: {
    hebrew: "כוכב חמה / מרקורי",
    arabic: "عطارد",
    figures: ["2112", "2222"], // חיבור, קהלה
    day: "יום רביעי",
    night: "ליל ראשון",
    letters: ["ג", "י", "פ", "ע"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  moon: {
    hebrew: "לבנה",
    arabic: "القمر",
    figures: ["2212", "1111"], // לבן, דרך
    day: "יום שני",
    night: "ליל שישי",
    letters: ["ד", "כ", "צ", "ח"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  saturn: {
    hebrew: "שבתאי",
    arabic: "زحل",
    figures: ["2221", "1221"], // שפל ראש, סוהר
    day: "יום שבת",
    night: "ליל רביעי",
    letters: ["ה", "ל", "ק", "ז׳"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  jupiter: {
    hebrew: "צדק",
    arabic: "المشتري",
    figures: ["2111", "1222"], // סף נכנס, נשוא ראש
    day: "יום חמישי",
    night: "ליל שני",
    letters: ["ו", "מ", "ז", "ט"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  },
  mars: {
    hebrew: "מאדים",
    arabic: "المريخ",
    figures: ["2122", "1211"], // אדום, בר הלחי
    day: "יום שלישי",
    night: "ליל שבת",
    letters: ["ז", "נ", "ס", "ע"],
    status: "VERIFIED",
    sourcePages: [133, 134, 135]
  }
};

const RAML_SEASONS = {
  spring: {
    hebrew: "אביב",
    signs: ["טלה", "שור", "תאומים"],
    letters: "אבגד הוז",
    status: "VERIFIED",
    sourcePage: 137
  },
  summer: {
    hebrew: "קיץ",
    signs: ["סרטן", "אריה", "בתולה"],
    letters: "חטי כלמן",
    status: "VERIFIED",
    sourcePage: 137
  },
  autumn: {
    hebrew: "סתיו",
    signs: ["מאזניים", "עקרב", "קשת"],
    letters: "שעפצ קרשת",
    status: "VERIFIED",
    sourcePage: 137
  },
  winter: {
    hebrew: "חורף",
    signs: ["גדי", "דלי", "דגים"],
    letters: "תנכז׳ ד׳ט׳ג׳",
    status: "VERIFIED",
    sourcePage: 137
  }
};

const RAML_ZODIAC_ELEMENTS = {
  fire: { hebrew: "אש", signs: ["טלה", "אריה", "קשת"], status: "VERIFIED", sourcePage: 137 },
  earth: { hebrew: "עפר", signs: ["שור", "בתולה", "גדי"], status: "VERIFIED", sourcePage: 137 },
  air: { hebrew: "אוויר", signs: ["תאומים", "מאזניים", "דלי"], status: "VERIFIED", sourcePage: 137 },
  water: { hebrew: "מים", signs: ["סרטן", "עקרב", "דגים"], status: "VERIFIED", sourcePage: 137 }
};

// פרטי השיבוץ בעמ' 136–137 אינם עקביים דיים כדי לבנות מהם
// מפת צורה→מזל מלאה ללא אימות נוסף מול המקור הערבי.
const RAML_ZODIAC_FIGURE_ASSIGNMENTS = {
  status: "OPEN",
  reason: "נדרשת הצלבה מול הטבלה/השיר במקור הערבי לפני הפעלה חישובית",
  sourcePages: [136, 137]
};

function ramlPlanetByFigureKey(figureKey) {
  for (const [planetKey, planet] of Object.entries(RAML_PLANETARY_TEMPERAMENT)) {
    if (planet.figures.includes(String(figureKey))) {
      return { key: planetKey, ...planet };
    }
  }
  return null;
}

if (typeof window !== "undefined") {
  window.RAML_PLANETARY_TEMPERAMENT = RAML_PLANETARY_TEMPERAMENT;
  window.RAML_SEASONS = RAML_SEASONS;
  window.RAML_ZODIAC_ELEMENTS = RAML_ZODIAC_ELEMENTS;
  window.RAML_ZODIAC_FIGURE_ASSIGNMENTS = RAML_ZODIAC_FIGURE_ASSIGNMENTS;
  window.ramlPlanetByFigureKey = ramlPlanetByFigureKey;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_PLANETARY_TEMPERAMENT,
    RAML_SEASONS,
    RAML_ZODIAC_ELEMENTS,
    RAML_ZODIAC_FIGURE_ASSIGNMENTS,
    ramlPlanetByFigureKey
  };
}
